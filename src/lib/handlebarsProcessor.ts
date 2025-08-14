import Handlebars from 'handlebars';
import { UserDataType } from '@/app/models/user';

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
 * Process a Handlebars template with user data
 */
export const processHandlebarsTemplate = (templateContent: string, userData: UserDataType): string => {
	if (!templateContent || !userData) return '';

	try {
		// Compile the Handlebars template
		const template = Handlebars.compile(templateContent);

		// Process the template with user data
		const result = template(userData);

		return result;
	} catch (error) {
		console.error('Error processing Handlebars template:', error);
		throw new Error(`Failed to process template: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
};

/**
 * Process a complete Handlebars template (with embedded CSS) with user data
 */
export const processCompleteHandlebarsTemplate = async (
	templateId: string,
	userData: UserDataType
): Promise<{ html: string; css: string }> => {
	try {
		// Import the template loading function
		const { loadTemplate } = await import('@/templates');

		// Load template content
		const templateContent = await loadTemplate(templateId as any);

		// Process Handlebars template with user data
		const processedHTML = processHandlebarsTemplate(templateContent.html, userData);

		return {
			html: processedHTML,
			css: templateContent.css
		};
	} catch (error) {
		console.error(`Error processing Handlebars template ${templateId}:`, error);
		throw new Error(
			`Failed to process template ${templateId}: ${error instanceof Error ? error.message : 'Unknown error'}`
		);
	}
};

/**
 * Compile a Handlebars template from HTML content string
 * This is useful when you have the template content directly
 */
export const compileHandlebarsTemplateFromContent = (templateContent: string): ((userData: UserDataType) => string) => {
	if (!templateContent) {
		throw new Error('Template content is required');
	}

	try {
		// Compile the Handlebars template once
		const template = Handlebars.compile(templateContent);

		// Return a function that can be reused with different user data
		return (userData: UserDataType): string => {
			if (!userData) return '';
			return template(userData);
		};
	} catch (error) {
		console.error('Error compiling Handlebars template from content:', error);
		throw new Error(
			`Failed to compile template from content: ${error instanceof Error ? error.message : 'Unknown error'}`
		);
	}
};

/**
 * Compile a complete Handlebars template (with embedded CSS) once
 * Returns an object with the compiled template function and CSS
 */
export const compileCompleteHandlebarsTemplate = async (
	templateId: string
): Promise<{ template: (userData: UserDataType) => string; css: string }> => {
	try {
		// Import the template loading function
		const { loadTemplate } = await import('@/templates');

		// Load template content
		const templateContent = await loadTemplate(templateId as string);

		// Compile Handlebars template once
		const template = compileHandlebarsTemplateFromContent(templateContent.html);

		return {
			template,
			css: templateContent.css
		};
	} catch (error) {
		console.error(`Error compiling Handlebars template ${templateId}:`, error);
		throw new Error(
			`Failed to compile template ${templateId}: ${error instanceof Error ? error.message : 'Unknown error'}`
		);
	}
};
