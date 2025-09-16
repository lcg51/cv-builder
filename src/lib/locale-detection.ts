import { NextRequest } from 'next/server';
import { getClientIP, getIPInfo, isLocalIP } from './ip-utils';

/**
 * Supported locales in the application
 */
export const SUPPORTED_LOCALES = ['en', 'es'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

/**
 * Default locale fallback
 */
export const DEFAULT_LOCALE: SupportedLocale = 'es';

/**
 * Country to locale mapping
 * Maps country codes/names to preferred locales
 */
export const COUNTRY_LOCALE_MAP: Record<string, SupportedLocale> = {
	// English-speaking countries
	'United States': 'en',
	'United Kingdom': 'en',
	Canada: 'en',
	Australia: 'en',
	'New Zealand': 'en',
	Ireland: 'en',
	'South Africa': 'en',

	// Spanish-speaking countries
	Spain: 'es',
	Mexico: 'es',
	Argentina: 'es',
	Colombia: 'es',
	Peru: 'es',
	Venezuela: 'es',
	Chile: 'es',
	Ecuador: 'es',
	Guatemala: 'es',
	Cuba: 'es',
	Bolivia: 'es',
	'Dominican Republic': 'es',
	Honduras: 'es',
	Paraguay: 'es',
	'El Salvador': 'es',
	Nicaragua: 'es',
	'Costa Rica': 'es',
	Panama: 'es',
	'Puerto Rico': 'es',
	Uruguay: 'es'

	// Add more mappings as needed
};

/**
 * Browser language to locale mapping
 * Maps browser language codes to supported locales
 */
export const BROWSER_LOCALE_MAP: Record<string, SupportedLocale> = {
	en: 'en',
	'en-US': 'en',
	'en-GB': 'en',
	'en-CA': 'en',
	'en-AU': 'en',
	es: 'es',
	'es-ES': 'es',
	'es-MX': 'es',
	'es-AR': 'es',
	'es-CO': 'es',
	'es-PE': 'es',
	'es-VE': 'es',
	'es-CL': 'es',
	'es-EC': 'es',
	'es-GT': 'es',
	'es-CU': 'es',
	'es-BO': 'es',
	'es-DO': 'es',
	'es-HN': 'es',
	'es-PY': 'es',
	'es-SV': 'es',
	'es-NI': 'es',
	'es-CR': 'es',
	'es-PA': 'es',
	'es-PR': 'es',
	'es-UY': 'es'
};

/**
 * Interface for locale detection result
 */
export interface LocaleDetectionResult {
	locale: SupportedLocale;
	source: 'ip-geolocation' | 'browser-header' | 'cookie' | 'url-param' | 'default';
	confidence: 'high' | 'medium' | 'low';
	ipInfo?: {
		ip: string;
		country?: string;
		isLocal: boolean;
	};
	browserLanguages?: string[];
	debug?: {
		detectedCountry?: string;
		detectedBrowserLang?: string;
		availableStrategies: string[];
	};
}

/**
 * Detects the best locale for a user based on multiple strategies
 */
export async function detectUserLocale(request: NextRequest): Promise<LocaleDetectionResult> {
	const strategies: Array<() => Promise<LocaleDetectionResult | null>> = [
		() => detectFromUrlParam(request),
		() => detectFromCookie(request),
		() => detectFromIPGeolocation(request),
		() => Promise.resolve(getDefaultLocale())
	];

	for (const strategy of strategies) {
		try {
			const result = await strategy();
			console.log('result', result);
			if (result) {
				return result;
			}
		} catch (error) {
			console.warn('Locale detection strategy failed:', error);
			continue;
		}
	}

	// Final fallback
	return getDefaultLocale();
}

/**
 * Detect locale from URL parameter (?locale=es)
 */
async function detectFromUrlParam(request: NextRequest): Promise<LocaleDetectionResult | null> {
	const url = new URL(request.url);
	const localeParam = url.searchParams.get('locale');

	if (localeParam && SUPPORTED_LOCALES.includes(localeParam as SupportedLocale)) {
		return {
			locale: localeParam as SupportedLocale,
			source: 'url-param',
			confidence: 'high'
		};
	}

	return null;
}

/**
 * Detect locale from cookie
 */
async function detectFromCookie(request: NextRequest): Promise<LocaleDetectionResult | null> {
	const cookieLocale = request.cookies.get('locale')?.value;

	if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale as SupportedLocale)) {
		return {
			locale: cookieLocale as SupportedLocale,
			source: 'cookie',
			confidence: 'high'
		};
	}

	return null;
}

/**
 * Detect locale from IP geolocation
 */
async function detectFromIPGeolocation(request: NextRequest): Promise<LocaleDetectionResult | null> {
	try {
		const clientIP = getClientIP(request);

		// Skip IP detection for local addresses
		if (isLocalIP(clientIP)) {
			console.log('[Locale] Skipping IP geolocation for local IP:', clientIP);
			return null;
		}

		console.log('[Locale] Attempting IP geolocation for:', clientIP);

		// Add timeout and error handling for IP geolocation
		const timeoutPromise = new Promise<never>((_, reject) => {
			setTimeout(() => reject(new Error('IP geolocation timeout')), 3000); // 3 second timeout
		});

		const ipInfo = await Promise.race([getIPInfo(clientIP), timeoutPromise]);

		if (ipInfo.country && COUNTRY_LOCALE_MAP[ipInfo.country]) {
			console.log('[Locale] IP geolocation successful:', ipInfo.country, '→', COUNTRY_LOCALE_MAP[ipInfo.country]);
			return {
				locale: COUNTRY_LOCALE_MAP[ipInfo.country],
				source: 'ip-geolocation',
				confidence: 'medium',
				ipInfo: {
					ip: clientIP,
					country: ipInfo.country,
					isLocal: false
				},
				debug: {
					detectedCountry: ipInfo.country,
					availableStrategies: ['ip-geolocation']
				}
			};
		}

		console.log('[Locale] No country mapping found for:', ipInfo.country);
		return null;
	} catch (error) {
		console.warn(
			'[Locale] IP geolocation failed for locale detection:',
			error instanceof Error ? error.message : error
		);
		return null;
	}
}

/**
 * Get default locale
 */
function getDefaultLocale(): LocaleDetectionResult {
	return {
		locale: DEFAULT_LOCALE,
		source: 'default',
		confidence: 'low',
		debug: {
			availableStrategies: ['default']
		}
	};
}

/**
 * Validates if a locale is supported
 */
export function isValidLocale(locale: string): locale is SupportedLocale {
	return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}

/**
 * Gets the locale from various sources for client-side usage
 */
export function getClientLocale(): SupportedLocale {
	// Try to get from browser
	if (typeof window !== 'undefined') {
		// Check URL params first
		const urlParams = new URLSearchParams(window.location.search);
		const urlLocale = urlParams.get('locale');
		if (urlLocale && isValidLocale(urlLocale)) {
			return urlLocale;
		}

		// Check local storage
		const storedLocale = localStorage.getItem('locale');
		if (storedLocale && isValidLocale(storedLocale)) {
			return storedLocale;
		}

		// Check browser language
		const browserLang = navigator.language;
		if (BROWSER_LOCALE_MAP[browserLang]) {
			return BROWSER_LOCALE_MAP[browserLang];
		}

		const langCode = browserLang.split('-')[0];
		if (BROWSER_LOCALE_MAP[langCode]) {
			return BROWSER_LOCALE_MAP[langCode];
		}
	}

	return DEFAULT_LOCALE;
}

/**
 * Sets the locale in client-side storage
 */
export function setClientLocale(locale: SupportedLocale): void {
	if (typeof window !== 'undefined') {
		localStorage.setItem('locale', locale);

		// Also set as cookie for server-side access
		document.cookie = `locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`; // 1 year
	}
}
