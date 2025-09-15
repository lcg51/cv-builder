import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
	getClientLocale,
	setClientLocale,
	isValidLocale,
	type SupportedLocale,
	SUPPORTED_LOCALES
} from '@/lib/locale-detection';

interface UseLocaleResult {
	/** Current locale */
	locale: SupportedLocale;

	/** Whether locale is being changed */
	loading: boolean;

	/** Change the locale */
	changeLocale: (newLocale: SupportedLocale) => void;

	/** Available locales */
	availableLocales: readonly SupportedLocale[];

	/** Get locale display name */
	getLocaleDisplayName: (locale: SupportedLocale) => string;

	/** Check if locale is currently active */
	isActiveLocale: (locale: SupportedLocale) => boolean;
}

// Locale display names
const LOCALE_DISPLAY_NAMES: Record<SupportedLocale, string> = {
	en: 'English',
	es: 'Español'
};

/**
 * Hook for managing application locale
 */
export function useLocale(): UseLocaleResult {
	const [locale, setLocale] = useState<SupportedLocale>(() => getClientLocale());
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	// Sync with stored locale on mount
	useEffect(() => {
		const storedLocale = getClientLocale();
		if (storedLocale !== locale) {
			setLocale(storedLocale);
		}
	}, []);

	const changeLocale = useCallback(
		async (newLocale: SupportedLocale) => {
			if (!isValidLocale(newLocale) || newLocale === locale) {
				return;
			}

			setLoading(true);

			try {
				// Store the new locale
				setClientLocale(newLocale);
				setLocale(newLocale);

				// Add locale to URL and refresh to apply server-side changes
				const url = new URL(window.location.href);
				url.searchParams.set('locale', newLocale);

				// Use router.push to navigate with the new locale parameter
				router.push(url.toString());

				// Alternatively, you could do a full page refresh:
				// window.location.href = url.toString();
			} catch (error) {
				console.error('Failed to change locale:', error);
			} finally {
				setLoading(false);
			}
		},
		[locale, router]
	);

	const getLocaleDisplayName = useCallback((locale: SupportedLocale) => {
		return LOCALE_DISPLAY_NAMES[locale] || locale;
	}, []);

	const isActiveLocale = useCallback(
		(checkLocale: SupportedLocale) => {
			return checkLocale === locale;
		},
		[locale]
	);

	return {
		locale,
		loading,
		changeLocale,
		availableLocales: SUPPORTED_LOCALES,
		getLocaleDisplayName,
		isActiveLocale
	};
}

/**
 * Hook for getting locale information from IP detection
 */
export function useIPLocaleInfo() {
	const [ipLocaleInfo, setIPLocaleInfo] = useState<{
		detectedLocale?: SupportedLocale;
		country?: string;
		source?: string;
		confidence?: string;
	} | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchIPLocaleInfo() {
			try {
				const response = await fetch('/api/locale-detection');
				if (response.ok) {
					const data = await response.json();
					setIPLocaleInfo(data);
				}
			} catch (error) {
				console.error('Failed to fetch IP locale info:', error);
			} finally {
				setLoading(false);
			}
		}

		fetchIPLocaleInfo();
	}, []);

	return { ipLocaleInfo, loading };
}
