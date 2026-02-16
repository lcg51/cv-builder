import Handlebars from 'handlebars';
import { TemplateDataType } from '@/types/payload-types';

// Define proper types for Handlebars helpers
type HandlebarsHelperOptions = {
	fn: (context: any) => string;
	inverse: (context: any) => string;
	hash: Record<string, any>;
	data?: any;
};

type HandlebarsContext = Record<string, any>;

// Register custom Handlebars helpers
Handlebars.registerHelper('formatDate', function (this: HandlebarsContext, date: Date, format: string) {
	if (!date) return '';

	const d = new Date(date);

	switch (format) {
		case 'MMM yyyy':
			return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
		case 'PPP':
			return d.toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			});
		default:
			return d.toLocaleDateString();
	}
});

Handlebars.registerHelper('skillLevel', function (this: HandlebarsContext, level: number) {
	// Convert skill level (1-5) to percentage (20-100)
	return Math.min(Math.max(level * 20, 20), 100);
});

Handlebars.registerHelper(
	'ifNotEmpty',
	function (this: HandlebarsContext, value: unknown, options: HandlebarsHelperOptions) {
		if (value && (Array.isArray(value) ? value.length > 0 : String(value).trim() !== '')) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	}
);

Handlebars.registerHelper('join', function (this: HandlebarsContext, array: unknown[], separator: string = ', ') {
	if (!Array.isArray(array)) return '';
	return array.join(separator);
});

/**
 * Load a template by ID from the CMS, compile its Handlebars HTML,
 * and return the compiled template function alongside the CSS.
 */
export const compileHandlebarsTemplate = async (
	templateId: string
): Promise<{ template: (userData: TemplateDataType) => string; css: string }> => {
	const { loadTemplate } = await import('@/templates');
	const { html, css } = await loadTemplate(templateId);

	if (!html) {
		throw new Error(`Template ${templateId} has no HTML content`);
	}

	const compiled = Handlebars.compile(html);

	return {
		template: (userData: TemplateDataType): string => {
			if (!userData) return '';
			return compiled(userData);
		},
		css
	};
};
