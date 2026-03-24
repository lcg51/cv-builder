import type { AISuggestType } from '@/lib/dynamicFormSchema';

export interface SuggestRequestBody {
	type: AISuggestType;
	currentText?: string;
	context?: { jobTitle?: string; company?: string; jobTitles?: string[] };
}

export interface SuggestResponseBody {
	suggestion: string;
}

export async function fetchSuggestion(body: SuggestRequestBody): Promise<SuggestResponseBody> {
	const res = await fetch('/api/ai/suggest', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body)
	});
	if (!res.ok) throw new Error('Failed');
	return res.json();
}
