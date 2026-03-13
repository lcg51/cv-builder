import { AISuggestType } from '@/lib/dynamicFormSchema';
import { useCallback, useState } from 'react';

export type AISuggestContext = { jobTitle?: string; company?: string };

export function useAISuggest(errorMessage: string) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const suggest = useCallback(
		async (type: AISuggestType, currentText: string, context?: AISuggestContext): Promise<string | null> => {
			setIsLoading(true);
			setError(null);
			try {
				const res = await fetch('/api/ai/suggest', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ type, currentText, context })
				});
				if (!res.ok) throw new Error('AI request failed');
				const data = (await res.json()) as { suggestion: string };
				return data.suggestion;
			} catch {
				setError(errorMessage);
				return null;
			} finally {
				setIsLoading(false);
			}
		},
		[errorMessage]
	);

	const clearError = useCallback(() => setError(null), []);

	return { suggest, isLoading, error, clearError };
}
