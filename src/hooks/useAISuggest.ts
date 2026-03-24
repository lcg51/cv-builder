import { AISuggestType } from '@/lib/dynamicFormSchema';
import { fetchSuggestion } from '@/services/aiSuggest';
import { resumeDataStore } from '@/app/store/resume';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type AISuggestContext = { jobTitle?: string; company?: string };

// Tracks keys whose fetch is currently in-flight. Prevents React Strict Mode's
// double-effect invocation from firing a duplicate request for the same key.
const inFlightKeys = new Set<string>();

export interface UseAISuggestOptions {
	errorMessage?: string;
	jobTitles?: string[];
	fallback?: string[];
}

export function useAISuggest({ errorMessage = '', jobTitles, fallback = [] }: UseAISuggestOptions = {}) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const cancelledRef = useRef(false);

	const suggest = useCallback(
		async (type: AISuggestType, currentText: string, context?: AISuggestContext): Promise<string | null> => {
			setIsLoading(true);
			setError(null);
			try {
				const { suggestion } = await fetchSuggestion({ type, currentText, context });
				return suggestion;
			} catch {
				setError(errorMessage);
				return null;
			} finally {
				setIsLoading(false);
			}
		},
		[errorMessage]
	);

	const jobTitlesKey = useMemo(() => {
		if (jobTitles === undefined) return null;
		if (jobTitles.length === 0) return '';
		return JSON.stringify(jobTitles);
	}, [jobTitles]);

	const skills = resumeDataStore(state =>
		jobTitlesKey ? (state.suggestedSkills[jobTitlesKey] ?? fallback) : fallback
	);

	useEffect(() => {
		if (jobTitlesKey === null || jobTitlesKey === '') return;
		if (resumeDataStore.getState().suggestedSkills[jobTitlesKey]) return;

		// Reset cancellation first — signals to any in-flight fetch for this key
		// (e.g. from a previous Strict Mode run) that this component is still active.
		cancelledRef.current = false;

		if (inFlightKeys.has(jobTitlesKey)) return;

		inFlightKeys.add(jobTitlesKey);
		setIsLoading(true);

		fetchSuggestion({ type: 'suggest-skills', context: { jobTitles: jobTitles! } })
			.then(({ suggestion }) => {
				if (cancelledRef.current) return;
				try {
					const parsed = JSON.parse(suggestion) as unknown;
					if (Array.isArray(parsed) && parsed.length > 0 && parsed.every(item => typeof item === 'string')) {
						resumeDataStore.getState().setSuggestedSkills(jobTitlesKey, parsed as string[]);
					}
				} catch (e) {
					console.error('Failed to parse suggestion', e);
				}
			})
			.catch(e => console.error('Failed to suggest skills', e))
			.finally(() => {
				inFlightKeys.delete(jobTitlesKey);
				if (!cancelledRef.current) setIsLoading(false);
			});

		return () => {
			cancelledRef.current = true;
		};
	}, [jobTitlesKey]);

	const clearError = useCallback(() => setError(null), []);

	return { suggest, isLoading, error, clearError, skills };
}
