import type { AISuggestType } from '@/lib/dynamicFormSchema';

export interface SuggestRequestBody {
	type: AISuggestType;
	currentText?: string;
	context?: { jobTitle?: string; company?: string; jobTitles?: string[] };
}

export interface SuggestResponseBody {
	suggestion: string;
}

export class SuggestError extends Error {
	constructor(
		message: string,
		public readonly status: number
	) {
		super(message);
		this.name = 'SuggestError';
	}
}

export async function fetchSuggestion(body: SuggestRequestBody): Promise<SuggestResponseBody> {
	const res = await fetch('/api/ai/suggest', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body)
	});
	if (!res.ok) throw new SuggestError(res.statusText, res.status);
	return res.json();
}
