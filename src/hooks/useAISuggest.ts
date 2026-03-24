import { AISuggestType } from '@/lib/dynamicFormSchema';
import { fetchSuggestion } from '@/app/api/ai/suggest/types';
import { useCallback, useEffect, useRef, useState } from 'react';

export type AISuggestContext = { jobTitle?: string; company?: string };
export type AISuggestSkillsConfig = { jobTitles: string[]; fallback: string[] };

export function useAISuggest(errorMessage: string, skillsConfig?: AISuggestSkillsConfig) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [skills, setSkills] = useState<string[]>(skillsConfig?.fallback ?? []);
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

	const jobTitlesKey = skillsConfig
		? skillsConfig.jobTitles.length === 0
			? ''
			: JSON.stringify(skillsConfig.jobTitles)
		: null;

	useEffect(() => {
		if (!jobTitlesKey) return;

		cancelledRef.current = false;
		const titles = JSON.parse(jobTitlesKey) as string[];

		setIsLoading(true);
		fetchSuggestion({ type: 'suggest-skills', context: { jobTitles: titles } })
			.then(({ suggestion }) => {
				if (cancelledRef.current) return;
				try {
					const parsed = JSON.parse(suggestion) as unknown;
					if (Array.isArray(parsed) && parsed.length > 0) setSkills(parsed as string[]);
				} catch (e) {
					console.error('Failed to parse suggestion', e);
				}
			})
			.catch(e => console.error('Failed to suggest skills', e))
			.finally(() => {
				if (!cancelledRef.current) setIsLoading(false);
			});

		return () => {
			cancelledRef.current = true;
		};
	}, [jobTitlesKey]);

	const clearError = useCallback(() => setError(null), []);

	return { suggest, isLoading, error, clearError, skills };
}
