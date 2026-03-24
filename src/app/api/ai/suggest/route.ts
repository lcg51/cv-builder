import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { auth } from '@/auth';
import { type AISuggestType as SuggestType } from '@/lib/dynamicFormSchema';

interface SuggestRequestBody {
	type: SuggestType;
	currentText?: string;
	context?: { jobTitle?: string; company?: string; jobTitles?: string[] };
}

const MAX_TEXT_LENGTH = 2000;

function sanitize(value: string, maxLength = 100): string {
	return value.replace(/[\r\n]+/g, ' ').slice(0, maxLength);
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
		return `<summary>${currentText ?? ''}</summary>`;
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
	return `<job_title>${jobTitle}</job_title>\n<company>${company}</company>\n<description>${currentText ?? ''}</description>`;
}

export async function POST(req: NextRequest) {
	const session = await auth();
	if (!session) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	let body: SuggestRequestBody;
	try {
		body = (await req.json()) as SuggestRequestBody;
	} catch {
		return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
	}

	const { type, currentText, context } = body;

	if (type !== 'improve-summary' && type !== 'improve-description' && type !== 'suggest-skills') {
		return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
	}

	if (type !== 'suggest-skills') {
		if (!currentText || typeof currentText !== 'string' || currentText.trim() === '') {
			return NextResponse.json({ error: 'currentText is required' }, { status: 400 });
		}
		if (currentText.length > MAX_TEXT_LENGTH) {
			return NextResponse.json(
				{ error: `currentText exceeds maximum length of ${MAX_TEXT_LENGTH} characters` },
				{ status: 400 }
			);
		}
	}

	const apiKey = process.env.GROQ_API_KEY;
	if (!apiKey) {
		return NextResponse.json({ error: 'AI service is not configured' }, { status: 503 });
	}

	const client = new OpenAI({ apiKey, baseURL: 'https://api.groq.com/openai/v1' });

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
	} catch (error) {
		console.error('Groq error:', error);
		return NextResponse.json({ error: 'AI service unavailable' }, { status: 503 });
	}
}
