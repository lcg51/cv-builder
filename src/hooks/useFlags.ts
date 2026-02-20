// src/hooks/useFlags.ts
'use client';
import { useEffect, useState } from 'react';

type Flags = {
	areFilterTemplatesEnabled: boolean;
	isEmailSignInEnabled: boolean;
};

export function useFlags() {
	const [flags, setFlags] = useState<Flags | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch('/api/flags')
			.then(res => res.json())
			.then(setFlags)
			.catch(() => setFlags({ areFilterTemplatesEnabled: false, isEmailSignInEnabled: false }))
			.finally(() => setLoading(false));
	}, []);

	return { flags, loading };
}
