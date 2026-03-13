import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { auth } from '@/auth';

type SuggestType = 'improve-summary' | 'improve-description';

interface SuggestRequestBody {
	type: SuggestType;
	currentText: string;
	context?: { jobTitle?: string; company?: string };
}

if (!process.env.GROQ_API_KEY) throw new Error('GROQ_API_KEY is not set');

const MAX_TEXT_LENGTH = 2000;

const client = new OpenAI({
	apiKey: process.env.GROQ_API_KEY,
	baseURL: 'https://api.groq.com/openai/v1'
});

function sanitize(value: string, maxLength = 100): string {
	return value.replace(/[\r\n]+/g, ' ').slice(0, maxLength);
}

function buildSystemPrompt(type: SuggestType, context?: { jobTitle?: string; company?: string }): string {
	if (type === 'improve-summary') {
		return 'You are a professional resume writer. Improve the professional summary below. Return only the improved text, no preamble. Keep it 2–3 sentences.';
	}
	const jobTitle = sanitize(context?.jobTitle || 'the candidate');
	const company = sanitize(context?.company || 'the company');
	return `You are a professional resume writer. The candidate worked as ${jobTitle} at ${company}. Rewrite the description below as 3–5 concise bullet points starting with action verbs. Return only the bullet points, one per line.`;
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

	if (!currentText || typeof currentText !== 'string' || currentText.trim() === '') {
		return NextResponse.json({ error: 'currentText is required' }, { status: 400 });
	}

	if (currentText.length > MAX_TEXT_LENGTH) {
		return NextResponse.json(
			{ error: `currentText exceeds maximum length of ${MAX_TEXT_LENGTH} characters` },
			{ status: 400 }
		);
	}

	if (type !== 'improve-summary' && type !== 'improve-description') {
		return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
	}

	try {
		const completion = await client.chat.completions.create({
			model: 'llama-3.3-70b-versatile',
			messages: [
				{ role: 'system', content: buildSystemPrompt(type, context) },
				{ role: 'user', content: currentText }
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
