import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';
import { auth } from '@/auth';
import type { SuggestRequestBody } from '@/services/aiSuggest';
import { type AISuggestType as SuggestType } from '@/lib/dynamicFormSchema';

const MAX_TEXT_LENGTH = 2000;

const suggestBodySchema = z
	.object({
		type: z.enum(['improve-summary', 'improve-description', 'suggest-skills']),
		currentText: z.string().max(MAX_TEXT_LENGTH).optional(),
		context: z
			.object({
				jobTitle: z.string().optional(),
				company: z.string().optional(),
				jobTitles: z.array(z.string()).optional()
			})
			.optional()
	})
	.superRefine((data, ctx) => {
		if (data.type !== 'suggest-skills' && !data.currentText?.trim()) {
			ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'currentText is required', path: ['currentText'] });
		}
	});

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 10;

const rateLimitMap = new Map<string, number[]>();

function isRateLimited(userId: string): boolean {
	const now = Date.now();
	const windowStart = now - RATE_LIMIT_WINDOW_MS;
	const timestamps = (rateLimitMap.get(userId) ?? []).filter(t => t > windowStart);

	if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
		rateLimitMap.set(userId, timestamps);
		return true;
	}

	if (timestamps.length === 0) {
		rateLimitMap.delete(userId);
	}

	timestamps.push(now);
	rateLimitMap.set(userId, timestamps);
	return false;
}

function sanitize(value: string, maxLength = 100): string {
	return value.replace(/[\r\n]+/g, ' ').slice(0, maxLength);
}

let groqClient: OpenAI | null = null;

function getGroqClient(): OpenAI {
	const apiKey = process.env.GROQ_API_KEY;
	if (!apiKey) throw new Error('GROQ_API_KEY is not set');
	groqClient ??= new OpenAI({ apiKey, baseURL: 'https://api.groq.com/openai/v1' });
	return groqClient;
}

const SYSTEM_PROMPTS: Record<SuggestType, string> = {
	'improve-summary':
		'You are a professional resume writer. Improve the professional summary provided inside <summary> tags. Return only the improved text, no preamble. Keep it 2–3 sentences.',
	'suggest-skills':
		'You are a professional resume writer. Suggest 10 relevant technical and soft skills for the job roles listed inside <job_roles> tags. Return ONLY a valid JSON array of skill name strings, no explanation. Example: ["JavaScript","React","Node.js"]',
	'improve-description':
		'You are a professional resume writer. Rewrite the work description provided inside <description> tags as 3–5 concise bullet points starting with action verbs. Use the job title and company inside <job_title> and <company> tags as context only. Return only the bullet points, one per line.'
};

function buildUserContent({ type, currentText, context }: SuggestRequestBody): string {
	if (type === 'improve-summary') {
		return `<summary>${sanitize(currentText ?? '', MAX_TEXT_LENGTH)}</summary>`;
	}
	if (type === 'suggest-skills') {
		const roles = (context?.jobTitles ?? [])
			.filter((t): t is string => typeof t === 'string')
			.map(t => sanitize(t))
			.join('\n');
		return `<job_roles>\n${roles || 'professional'}\n</job_roles>`;
	}
	const jobTitle = sanitize(context?.jobTitle ?? 'the candidate');
	const company = sanitize(context?.company ?? 'the company');
	return `<job_title>${jobTitle}</job_title>\n<company>${company}</company>\n<description>${sanitize(currentText ?? '', MAX_TEXT_LENGTH)}</description>`;
}

export async function POST(req: NextRequest) {
	const session = await auth();
	const userId = session?.user?.id;
	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	if (isRateLimited(userId)) {
		return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
	}

	let rawBody: unknown;
	try {
		rawBody = await req.json();
	} catch {
		return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
	}

	const parsed = suggestBodySchema.safeParse(rawBody);
	if (!parsed.success) {
		return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
	}

	const { type, currentText, context } = parsed.data;

	let client: OpenAI;
	try {
		client = getGroqClient();
	} catch {
		return NextResponse.json({ error: 'AI service is not configured' }, { status: 503 });
	}

	try {
		const completion = await client.chat.completions.create({
			model: 'llama-3.3-70b-versatile',
			messages: [
				{ role: 'system', content: SYSTEM_PROMPTS[type] },
				{ role: 'user', content: buildUserContent({ type, currentText, context }) }
			]
		});

		const suggestion = completion.choices[0]?.message?.content?.trim() ?? '';
		if (!suggestion) {
			return NextResponse.json({ error: 'AI service unavailable' }, { status: 503 });
		}
		return NextResponse.json({ suggestion });
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error('Groq error:', error.message);
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
