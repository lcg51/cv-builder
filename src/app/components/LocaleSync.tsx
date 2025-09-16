'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useIPContext } from '@/app/providers/IPProvider';
import { useLocale } from '@/hooks/useLocale';
import { COUNTRY_LOCALE_MAP, type SupportedLocale } from '@/lib/locale-detection';

/**
 * Component that synchronizes locale based on IP detection
 * This runs client-side after the app loads to avoid blocking SSR
 */
export function LocaleSync() {
	const { ipInfo, loading: ipLoading } = useIPContext();
	const { locale: currentLocale, changeLocale } = useLocale();
	const router = useRouter();

	useEffect(() => {
		// Skip if IP info is still loading or not available
		if (ipLoading || !ipInfo) {
			return;
		}

		// Skip for local IPs
		if (ipInfo.isLocal) {
			console.log('[LocaleSync] Skipping locale sync for local IP');
			return;
		}

		// Check if we can detect locale from country
		const country = ipInfo.geoInfo?.country;
		if (!country || !COUNTRY_LOCALE_MAP[country]) {
			console.log('[LocaleSync] No locale mapping for country:', country);
			return;
		}

		const detectedLocale = COUNTRY_LOCALE_MAP[country] as SupportedLocale;

		// Check if we should update the locale
		const shouldUpdate = checkIfShouldUpdateLocale(currentLocale, detectedLocale);

		if (shouldUpdate) {
			console.log('[LocaleSync] Updating locale based on IP:', {
				from: currentLocale,
				to: detectedLocale,
				country,
				ip: ipInfo.ip
			});

			// Update locale preference
			changeLocale(detectedLocale);
		} else {
			console.log('[LocaleSync] Keeping current locale:', {
				current: currentLocale,
				detected: detectedLocale,
				country
			});
		}
	}, [ipInfo, ipLoading, currentLocale, changeLocale, router]);

	// This component doesn't render anything
	return null;
}

/**
 * Determines if the locale should be updated based on IP detection
 * Only updates if:
 * 1. No explicit user preference exists (no cookie)
 * 2. Current locale is the default (likely from browser/fallback)
 * 3. Detected locale is different from current
 */
function checkIfShouldUpdateLocale(currentLocale: SupportedLocale, detectedLocale: SupportedLocale): boolean {
	// Don't update if locales are the same
	if (currentLocale === detectedLocale) {
		return false;
	}

	// Check if user has explicit preference (cookie exists)
	if (typeof window !== 'undefined') {
		const hasExplicitPreference = document.cookie.split(';').some(cookie => cookie.trim().startsWith('locale='));

		if (hasExplicitPreference) {
			console.log('[LocaleSync] User has explicit locale preference, not updating');
			return false;
		}

		// Check URL parameter - if present, don't override
		const urlParams = new URLSearchParams(window.location.search);
		if (urlParams.has('locale')) {
			console.log('[LocaleSync] URL has locale parameter, not updating');
			return false;
		}
	}

	// Update if detected locale is different and no explicit preference
	return true;
}
