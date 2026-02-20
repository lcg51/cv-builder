import Handlebars from 'handlebars';

// Define proper types for Handlebars helpers
type HandlebarsHelperOptions = {
	fn: (context: Record<string, unknown>) => string;
	inverse: (context: Record<string, unknown>) => string;
	hash: Record<string, unknown>;
	data?: Record<string, unknown>;
};

type HandlebarsContext = Record<string, unknown>;

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
 * Compiles a Handlebars template from any HTML/CSS source into a typed render function.
 * The loader callback decouples fetching from compilation, making this reusable for any data shape.
 */
export const compileHandlebarsTemplate = async <T>(
	loader: () => Promise<{ html: string; css: string }>
): Promise<{ template: (data: T) => string; css: string }> => {
	const { html, css } = await loader();

	if (!html) {
		throw new Error('Template has no HTML content');
	}

	const compiled = Handlebars.compile<T>(html);

	return {
		template: (data: T): string => compiled(data),
		css
	};
};
