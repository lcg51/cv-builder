import { useEffect, useState } from 'react';

export function useAISuggestSkills(jobTitles: string[], fallback: string[]) {
	const [skills, setSkills] = useState<string[]>(fallback);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!jobTitles.length) return;

		let cancelled = false;
		setIsLoading(true);

		fetch('/api/ai/suggest', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ type: 'suggest-skills', context: { jobTitles } })
		})
			.then(res => {
				if (!res.ok) throw new Error('Failed');
				return res.json() as Promise<{ suggestion: string }>;
			})
			.then(data => {
				if (cancelled) return;
				const parsed = JSON.parse(data.suggestion) as unknown;
				if (Array.isArray(parsed) && parsed.length > 0) {
					setSkills(parsed as string[]);
				}
			})
			.catch(() => {
				// Keep fallback on error
			})
			.finally(() => {
				if (!cancelled) setIsLoading(false);
			});

		return () => {
			cancelled = true;
		};
	}, [jobTitles.join(',')]);

	return { skills, isLoading };
}
