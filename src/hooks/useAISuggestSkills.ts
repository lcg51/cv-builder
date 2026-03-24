import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchSuggestion } from '@/app/api/ai/suggest/types';

export function useAISuggestSkills(jobTitles: string[], fallback: string[]) {
	const [skills, setSkills] = useState<string[]>(fallback);
	const [isLoading, setIsLoading] = useState(false);
	const cancelledRef = useRef(false);

	const jobTitlesKey = jobTitles.length === 0 ? '' : JSON.stringify(jobTitles);

	const suggest = useCallback(async (titlesForRequest: string[]) => {
		setIsLoading(true);

		try {
			const { suggestion } = await fetchSuggestion({
				type: 'suggest-skills',
				context: { jobTitles: titlesForRequest }
			});
			if (cancelledRef.current) return;
			try {
				const parsed = JSON.parse(suggestion) as unknown;
				if (Array.isArray(parsed) && parsed.length > 0) {
					setSkills(parsed as string[]);
				}
			} catch (error) {
				// Keep fallback if suggestion is not valid JSON
				console.error('Failed to parse suggestion', error);
			}
		} catch (error) {
			// Keep fallback on network error
			console.error('Failed to suggest skills', error);
		} finally {
			if (!cancelledRef.current) setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		if (jobTitlesKey === '') return;

		cancelledRef.current = false;
		const titlesForRequest = JSON.parse(jobTitlesKey) as string[];

		suggest(titlesForRequest);

		return () => {
			cancelledRef.current = true;
		};
	}, [jobTitlesKey]);

	return { skills, isLoading };
}
