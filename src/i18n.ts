import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
	// Validate that the incoming `locale` parameter is valid
	const locale = 'en';

	return {
		locale,
		messages: (await import(`../messages/${locale}.json`)).default
	};
});
