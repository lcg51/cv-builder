#!/usr/bin/env npx ts-node

/**
 * Convert existing HTML/CSS templates to Handlebars format
 *
 * This script helps you convert your existing separate HTML and CSS files
 * into single Handlebars (.hbs) files with embedded styles.
 *
 * Usage: npx ts-node scripts/convert-to-handlebars.ts <template-id>
 *
 * Example: npx ts-node scripts/convert-to-handlebars.ts template2
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// CSS minification utilities
interface MinifyOptions {
	removeComments?: boolean;
	removeWhitespace?: boolean;
	removeEmptyRules?: boolean;
	minify?: boolean;
}

/**
 * Minify CSS content
 */
function minifyCSS(css: string, options: MinifyOptions = { minify: true }): string {
	if (!options.minify) return css;

	let minified = css;

	// Remove comments
	if (options.removeComments !== false) {
		minified = minified.replace(/\/\*[\s\S]*?\*\//g, '');
	}

	// Remove unnecessary whitespace
	if (options.removeWhitespace !== false) {
		minified = minified
			// Remove line breaks and multiple spaces
			.replace(/\s+/g, ' ')
			// Remove spaces around certain characters
			.replace(/\s*([{}:;,>+~])\s*/g, '$1')
			// Remove trailing spaces
			.replace(/\s+}/g, '}')
			// Remove leading spaces
			.replace(/{\s+/g, '{')
			// Remove spaces before semicolons
			.replace(/\s*;\s*/g, ';')
			// Remove spaces around colons
			.replace(/\s*:\s*/g, ':')
			// Remove spaces around commas
			.replace(/\s*,\s*/g, ',')
			// Remove spaces around braces
			.replace(/\s*{\s*/g, '{')
			.replace(/\s*}\s*/g, '}')
			// Remove spaces around operators
			.replace(/\s*([>+~])\s*/g, '$1')
			// Remove empty rules
			.replace(/[^{}]+{\s*}/g, '')
			// Trim
			.trim();
	}

	// Remove empty rules
	if (options.removeEmptyRules !== false) {
		minified = minified.replace(/[^{}]+{\s*}/g, '');
	}

	return minified;
}

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Types and interfaces
interface ConversionOptions {
	templateId: string;
	templateDir: string;
	htmlFile: string;
	cssFile: string;
	hbsFile: string;
	minifyCSS?: boolean;
}

interface ConversionResult {
	success: boolean;
	message: string;
	filePath?: string;
	error?: string;
}

// Template variable mappings
const VARIABLE_MAPPINGS = {
	// Simple variable placeholders
	firstName: '{{firstName}}',
	lastName: '{{lastName}}',
	role: '{{role}}',
	city: '{{city}}',
	postalCode: '{{postalCode}}',
	phone: '{{phone}}',
	email: '{{email}}',
	aboutMe: '{{aboutMe}}',
	linkedin: '{{linkedin}}',
	github: '{{github}}'
} as const;

// Loop block patterns for converting plain HTML to Handlebars
const LOOP_PATTERNS = [
	{
		pattern: /\{\{#each education\}\}([\s\S]*?)\{\{\/each\}\}/g,
		replacements: {
			degree: '{{degree}}',
			university: '{{university}}',
			city: '{{city}}',
			finishDate: "{{formatDate finishDate 'PPP'}}",
			description: '{{description}}'
		}
	},
	{
		pattern: /\{\{#each skills\}\}([\s\S]*?)\{\{\/each\}\}/g,
		replacements: {
			title: '{{title}}',
			level: '{{skillLevel level}}'
		}
	},
	{
		pattern: /\{\{#each workExperience\}\}([\s\S]*?)\{\{\/each\}\}/g,
		replacements: {
			company: '{{company}}',
			startDate: "{{formatDate startDate 'MMM yyyy'}}",
			endDate: "{{formatDate endDate 'MMM yyyy'}}",
			location: '{{location}}',
			jobTitle: '{{jobTitle}}',
			description: '{{description}}'
		}
	}
] as const;

/**
 * Validate command line arguments
 */
function validateArguments(): string | null {
	const templateId = process.argv[2];

	if (!templateId) {
		console.error('❌ Usage: npx ts-node scripts/convert-to-handlebars.ts <template-id>');
		console.error('📝 Example: npx ts-node scripts/convert-to-handlebars.ts template2');
		return null;
	}

	return templateId;
}

/**
 * Setup conversion paths and validate files exist
 */
function setupConversion(templateId: string): ConversionOptions | null {
	const templateDir = path.join(__dirname, '..', 'public', 'templates', templateId);
	const htmlFile = path.join(templateDir, `${templateId}.html`);
	const cssFile = path.join(templateDir, `${templateId}.css`);
	const hbsFile = path.join(templateDir, `${templateId}.hbs`);

	// Check if template directory exists
	if (!fs.existsSync(templateDir)) {
		console.error(`❌ Template directory not found: ${templateDir}`);
		return null;
	}

	// Check if HTML file exists
	if (!fs.existsSync(htmlFile)) {
		console.error(`❌ HTML file not found: ${htmlFile}`);
		return null;
	}

	// Check if CSS file exists
	if (!fs.existsSync(cssFile)) {
		console.error(`❌ CSS file not found: ${cssFile}`);
		return null;
	}

	return {
		templateId,
		templateDir,
		htmlFile,
		cssFile,
		hbsFile
	};
}

/**
 * Convert HTML content to Handlebars syntax
 */
function convertHtmlToHandlebars(htmlContent: string): string {
	let handlebarsContent = htmlContent;

	// Check if content already contains Handlebars syntax
	const hasHandlebars = /{{#?[^}]+}}/.test(htmlContent);

	if (hasHandlebars) {
		console.log(`🔍 Template already contains Handlebars syntax - preserving existing structure`);
		return handlebarsContent; // Return as-is if already Handlebars
	}

	console.log(`🔄 Converting plain HTML to Handlebars syntax...`);

	// Convert simple variable placeholders
	Object.entries(VARIABLE_MAPPINGS).forEach(([oldPattern, newPattern]) => {
		const regex = new RegExp(`\\{\\{${oldPattern}\\}\\}`, 'g');
		handlebarsContent = handlebarsContent.replace(regex, newPattern);
	});

	// Convert loop blocks
	LOOP_PATTERNS.forEach(({ pattern, replacements }) => {
		handlebarsContent = handlebarsContent.replace(pattern, (match, content) => {
			let convertedContent = content;

			Object.entries(replacements).forEach(([oldPattern, newPattern]) => {
				const regex = new RegExp(`\\{\\{${oldPattern}\\}\\}`, 'g');
				convertedContent = convertedContent.replace(regex, newPattern);
			});

			return convertedContent;
		});
	});

	// Add conditional clauses for better user experience
	handlebarsContent = addConditionalClauses(handlebarsContent);

	return handlebarsContent;
}

/**
 * Enhance existing Handlebars templates with better formatting and helpers
 */
function enhanceExistingHandlebars(htmlContent: string): string {
	let enhancedContent = htmlContent;

	// Check if this is an existing Handlebars template
	if (!/{{#?[^}]+}}/.test(htmlContent)) {
		return enhancedContent; // Not a Handlebars template
	}

	console.log(`✨ Enhancing existing Handlebars template with better formatting...`);

	// Enhance skill level display with skillLevel helper
	enhancedContent = enhancedContent.replace(/style="width: {{level}}%"/g, 'style="width: {{skillLevel level}}%"');

	// Enhance date formatting with formatDate helper
	enhancedContent = enhancedContent.replace(/{{startDate}}/g, "{{formatDate startDate 'MMM yyyy'}}");

	enhancedContent = enhancedContent.replace(/{{endDate}}/g, "{{formatDate endDate 'MMM yyyy'}}");

	enhancedContent = enhancedContent.replace(/{{finishDate}}/g, "{{formatDate finishDate 'PPP'}}");

	// Add ifNotEmpty helper for conditional rendering
	enhancedContent = enhancedContent.replace(/{{linkedin}}/g, '{{#ifNotEmpty linkedin}}{{linkedin}}{{/ifNotEmpty}}');

	enhancedContent = enhancedContent.replace(/{{github}}/g, '{{#ifNotEmpty github}}{{github}}{{/ifNotEmpty}}');

	return enhancedContent;
}

/**
 * Add conditional rendering clauses to HTML templates
 */
function addConditionalClauses(htmlContent: string): string {
	let enhancedContent = htmlContent;

	console.log(`🔍 Adding conditional rendering clauses...`);

	// Simple and reliable section detection by class names
	const sections = [
		{ classPattern: 'about-section', condition: 'aboutMe' },
		{ classPattern: 'skills-section', condition: 'skills' },
		{ classPattern: 'experience-section', condition: 'workExperience' },
		{ classPattern: 'education-section', condition: 'education' },
		{ classPattern: 'contact-section', condition: 'contact' }
	];

	sections.forEach(({ classPattern, condition }) => {
		console.log(`🔍 Looking for ${condition} section (class: ${classPattern})...`);

		// Simple pattern: find div with the specific class and wrap it
		const pattern = new RegExp(`(<div[^>]*class[^>]*${classPattern}[^>]*>[\\s\\S]*?<\\/div>)`, 'gi');
		const matches = enhancedContent.match(pattern);

		if (matches) {
			console.log(`✅ Found ${matches.length} ${condition} section(s)`);
			enhancedContent = enhancedContent.replace(pattern, `{{#if ${condition}}}$1{{/if}}`);
			console.log(`✅ Added {{#if ${condition}}} clause`);
		} else {
			console.log(`❌ No ${condition} section found`);
		}
	});

	// Add conditional clauses for individual fields that might be empty
	const conditionalFields = [
		{ field: 'linkedin', pattern: /{{linkedin}}/g },
		{ field: 'github', pattern: /{{github}}/g },
		{ field: 'phone', pattern: /{{phone}}/g },
		{ field: 'location', pattern: /{{location}}/g },
		{ field: 'description', pattern: /{{description}}/g }
	];

	conditionalFields.forEach(({ field, pattern }) => {
		if (enhancedContent.match(pattern)) {
			enhancedContent = enhancedContent.replace(pattern, `{{#ifNotEmpty ${field}}}{{${field}}}{{/ifNotEmpty}}`);
			console.log(`✅ Added conditional rendering for ${field}`);
		}
	});

	return enhancedContent;
}

/**
 * Insert CSS into the HTML head section
 */
function insertCSSIntoHead(htmlContent: string, cssContent: string, minify: boolean = true): string {
	// Minify CSS if requested
	const processedCSS = minify ? minifyCSS(cssContent) : cssContent;

	const styleTag = `    <style>${processedCSS}</style>`;

	// Check if the content already has a <style> tag
	if (htmlContent.includes('<style>')) {
		console.log('⚠️  Template already contains styles, skipping CSS insertion');
		return htmlContent;
	}

	// Try to find the closing </head> tag and insert styles before it
	if (htmlContent.includes('</head>')) {
		return htmlContent.replace('</head>', `${styleTag}\n</head>`);
	}

	// Try to find <head> tag and insert styles after it
	if (htmlContent.includes('<head>')) {
		return htmlContent.replace('<head>', `<head>\n${styleTag}`);
	}

	// If no head tags found, try to insert after <html> tag
	if (htmlContent.includes('<html')) {
		return htmlContent.replace('<html', `<html>\n<head>\n${styleTag}\n</head>`);
	}

	// If no HTML structure found, wrap the content with HTML structure
	if (!htmlContent.includes('<!DOCTYPE') && !htmlContent.includes('<html')) {
		return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>{{firstName}} {{lastName}} - Resume</title>
            ${styleTag}
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>`;
	}

	// Last resort: insert styles at the beginning of the file
	console.log('⚠️  Could not find proper insertion point, adding styles at beginning');
	return `${styleTag}\n\n${htmlContent}`;
}

/**
 * Convert template to Handlebars format
 */
function convertTemplate(options: ConversionOptions): ConversionResult {
	try {
		// Read existing files
		const htmlContent = fs.readFileSync(options.htmlFile, 'utf8');
		const cssContent = fs.readFileSync(options.cssFile, 'utf8');

		console.log(`📖 Read HTML file: ${options.htmlFile} (${htmlContent.length} characters)`);
		console.log(`🎨 Read CSS file: ${options.cssFile} (${cssContent.length} characters)`);

		// Convert HTML to Handlebars syntax (or enhance existing Handlebars)
		let handlebarsContent = convertHtmlToHandlebars(htmlContent);

		// If it was already Handlebars, enhance it with better helpers
		if (/{{#?[^}]+}}/.test(htmlContent)) {
			handlebarsContent = enhanceExistingHandlebars(handlebarsContent);
		}

		console.log(`🔄 Processed template syntax`);

		// Insert CSS into the head section
		handlebarsContent = insertCSSIntoHead(handlebarsContent, cssContent, options.minifyCSS);
		console.log(`💅 Inserted ${options.minifyCSS ? 'and minified ' : ''}CSS into template`);

		// Write the new Handlebars file
		fs.writeFileSync(options.hbsFile, handlebarsContent);
		console.log(`💾 Wrote Handlebars file: ${options.hbsFile} (${handlebarsContent.length} characters)`);

		return {
			success: true,
			message: `✅ Successfully converted ${options.templateId} to Handlebars format!`,
			filePath: options.hbsFile
		};
	} catch (error) {
		return {
			success: false,
			message: `❌ Error converting template: ${error instanceof Error ? error.message : 'Unknown error'}`,
			error: error instanceof Error ? error.message : 'Unknown error'
		};
	}
}

/**
 * Display success message and next steps
 */
function displaySuccessMessage(templateId: string, filePath: string): void {
	console.log(`✅ Successfully converted ${templateId} to Handlebars format!`);
	console.log(`📁 New file: ${filePath}`);
	console.log(`\n📝 Next steps:`);
	console.log(`1. Update your template registry to use the new .hbs file`);
	console.log(`2. Test the template with useHandlebars={true}`);
	console.log(`3. You can now delete the old .html and .css files`);
	console.log(`\n🎨 The template now uses Handlebars syntax with embedded CSS!`);
}

/**
 * Main conversion function
 */
function main(): void {
	try {
		// Parse command line arguments
		const args = process.argv.slice(2);
		const templateId = args[0];
		const minify = !args.includes('--no-minify');

		// Validate arguments
		if (!templateId) {
			console.error('❌ Usage: npx tsx scripts/convert-to-handlebars.ts <template-id> [--no-minify]');
			console.error('📝 Example: npx tsx scripts/convert-to-handlebars.ts template2');
			console.error('📝 Example: npx tsx scripts/convert-to-handlebars.ts template2 --no-minify');
			process.exit(1);
		}

		// Setup conversion
		const options = setupConversion(templateId);
		if (!options) {
			process.exit(1);
		}

		// Add minification option
		options.minifyCSS = minify;

		// Convert template
		const result = convertTemplate(options);

		if (result.success) {
			displaySuccessMessage(options.templateId, result.filePath!);
		} else {
			console.error(result.message);
			if (result.error) {
				console.error(`Error details: ${result.error}`);
			}
			process.exit(1);
		}
	} catch (error) {
		console.error(`❌ Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
		process.exit(1);
	}
}

// Run the script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
	main();
}

// Export for potential use as a module
export {
	convertTemplate,
	convertHtmlToHandlebars,
	enhanceExistingHandlebars,
	addConditionalClauses,
	insertCSSIntoHead,
	minifyCSS,
	validateArguments,
	setupConversion,
	type ConversionOptions,
	type ConversionResult,
	type MinifyOptions
};
