import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';
import { DEFAULT_LOCALE, isValidLocale, BROWSER_LOCALE_MAP, type SupportedLocale } from './lib/locale-detection';

export default getRequestConfig(async () => {
	let locale: SupportedLocale = DEFAULT_LOCALE;

	try {
		// Get headers from the request
		const headersList = await headers();

		// First try simple detection methods that don't require external API calls
		// 1. Check URL parameter
		const url = headersList.get('x-url') || '';
		if (url) {
			const urlObj = new URL(url);
			const localeParam = urlObj.searchParams.get('locale');
			if (localeParam && isValidLocale(localeParam)) {
				locale = localeParam;
				console.log('[i18n] Locale from URL param:', locale);
				return {
					locale,
					messages: (await import(`../messages/${locale}.json`)).default
				};
			}
		}

		// 2. Check cookie
		const cookieHeader = headersList.get('cookie');
		if (cookieHeader) {
			const cookies = cookieHeader.split(';').reduce(
				(acc: Record<string, string>, cookie: string) => {
					const [key, value] = cookie.trim().split('=');
					if (key && value) acc[key] = value;
					return acc;
				},
				{} as Record<string, string>
			);

			const cookieLocale = cookies['locale'];
			if (cookieLocale && isValidLocale(cookieLocale)) {
				locale = cookieLocale;
				console.log('[i18n] Locale from cookie:', locale);
				return {
					locale,
					messages: (await import(`../messages/${locale}.json`)).default
				};
			}
		}

		// 3. Check browser language (Accept-Language header)
		const acceptLanguage = headersList.get('accept-language');
		if (acceptLanguage) {
			const languages = acceptLanguage.split(',').map(lang => {
				const [code] = lang.trim().split(';');
				return code.trim();
			});

			for (const langCode of languages) {
				// Try exact match first
				if (BROWSER_LOCALE_MAP[langCode]) {
					locale = BROWSER_LOCALE_MAP[langCode];
					console.log('[i18n] Locale from browser language:', locale, '(from', langCode, ')');
					break;
				}

				// Try language code without country
				const simpleLang = langCode.split('-')[0];
				if (BROWSER_LOCALE_MAP[simpleLang]) {
					locale = BROWSER_LOCALE_MAP[simpleLang];
					console.log('[i18n] Locale from browser language:', locale, '(from', simpleLang, ')');
					break;
				}
			}
		}

		// Note: IP geolocation is deferred to client-side to avoid blocking SSR
		// The client-side IP provider will handle geolocation-based locale updates

		if (process.env.NODE_ENV === 'development') {
			console.log('[i18n] Final locale (no IP geolocation):', locale);
		}
	} catch (error) {
		console.warn('[i18n] Failed to detect locale, using default:', error);
		locale = DEFAULT_LOCALE;
	}

	// Validate the detected locale
	if (!isValidLocale(locale)) {
		console.warn(`[i18n] Invalid locale detected: ${locale}, falling back to ${DEFAULT_LOCALE}`);
		locale = DEFAULT_LOCALE;
	}

	return {
		locale,
		messages: (await import(`../messages/${locale}.json`)).default
	};
});
