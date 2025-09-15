import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';
import { NextRequest } from 'next/server';
import { detectUserLocale, DEFAULT_LOCALE, isValidLocale, type SupportedLocale } from './lib/locale-detection';

export default getRequestConfig(async () => {
	let locale: SupportedLocale = DEFAULT_LOCALE;

	try {
		// Get headers from the request
		const headersList = await headers();

		// Create a mock NextRequest object for locale detection
		// Note: This is a workaround since we can't get the full request in getRequestConfig
		const mockRequest = {
			headers: headersList,
			cookies: {
				get: (name: string) => {
					const cookieHeader = headersList.get('cookie');
					if (!cookieHeader) return undefined;

					const cookies = cookieHeader.split(';').reduce(
						(acc: Record<string, string>, cookie: string) => {
							const [key, value] = cookie.trim().split('=');
							acc[key] = value;
							return acc;
						},
						{} as Record<string, string>
					);

					return cookies[name] ? { value: cookies[name] } : undefined;
				}
			},
			url: headersList.get('x-url') || 'http://localhost:3000',
			nextUrl: {
				searchParams: new URLSearchParams(new URL(headersList.get('x-url') || 'http://localhost:3000').search)
			}
		} as unknown as NextRequest;

		// Detect locale based on IP and other factors
		const detectionResult = await detectUserLocale(mockRequest);
		locale = detectionResult.locale;

		// Log the detection result in development
		if (process.env.NODE_ENV === 'development') {
			console.log('[i18n] Locale detection:', {
				detectedLocale: locale,
				source: detectionResult.source,
				confidence: detectionResult.confidence,
				country: detectionResult.ipInfo?.country,
				browserLanguages: detectionResult.browserLanguages
			});
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
