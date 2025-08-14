import Handlebars from 'handlebars';
import { UserDataType } from '@/app/models/user';

// Register custom Handlebars helpers
Handlebars.registerHelper('formatDate', function (date: Date, format: string) {
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

Handlebars.registerHelper('skillLevel', function (level: number) {
	// Convert skill level (1-5) to percentage (20-100)
	return Math.min(Math.max(level * 20, 20), 100);
});

Handlebars.registerHelper('ifNotEmpty', function (value: any, options: any) {
	if (value && (Array.isArray(value) ? value.length > 0 : value.trim() !== '')) {
		return options.fn(this);
	} else {
		return options.inverse(this);
	}
});

Handlebars.registerHelper('join', function (array: any[], separator: string = ', ') {
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
 * Extract CSS from a Handlebars template that has embedded styles
 */
export const extractCSSFromHandlebars = (templateContent: string): { html: string; css: string } => {
	const cssMatch = templateContent.match(/<style[^>]*>([\s\S]*?)<\/style>/i);

	if (cssMatch) {
		const css = cssMatch[1];
		const html = templateContent.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
		return { html, css };
	}

	// If no embedded CSS, return the template as HTML
	return { html: templateContent, css: '' };
};

/**
 * Validate Handlebars template syntax
 */
export const validateHandlebarsTemplate = (templateContent: string): { isValid: boolean; errors: string[] } => {
	const errors: string[] = [];

	try {
		// Try to compile the template
		Handlebars.precompile(templateContent);
	} catch (error) {
		errors.push(`Template compilation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}

	// Check for common issues
	if (templateContent.includes('{{#each') && !templateContent.includes('{{/each}}')) {
		errors.push('Unclosed {{#each}} block');
	}

	if (templateContent.includes('{{#if') && !templateContent.includes('{{/if}}')) {
		errors.push('Unclosed {{#if}} block');
	}

	return {
		isValid: errors.length === 0,
		errors
	};
};
