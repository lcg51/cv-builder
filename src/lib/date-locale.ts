import type { Locale } from 'date-fns';
import { enUS, es } from 'date-fns/locale';

const DATE_LOCALES: Record<string, Locale> = {
	en: enUS,
	es
};

export function getDateLocale(locale: string): Locale {
	return DATE_LOCALES[locale] ?? enUS;
}
