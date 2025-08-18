import { template1Screenshot, template2Screenshot, template3Screenshot, template4Screenshot } from '@/assets';
import { v4 as uuidv4 } from 'uuid';

export type TemplateCategory = 'professional' | 'creative' | 'modern' | 'minimal';

export interface Template {
	id: string;
	name: string;
	description: string;
	category: TemplateCategory;
	files: {
		handlebars: string;
		css: string;
		html: string;
	};
	preview: string;
	previewImage: string;
	tags: string[];
	isActive: boolean;
	features: string[];
}

// Map template preview names to their screenshot images
export const templateScreenshotsMap: Record<string, any> = {
	template1: template1Screenshot,
	template2: template2Screenshot,
	template3: template3Screenshot,
	template4: template4Screenshot
};

/**
 * Generates a UUID v4 for templates
 * @returns A unique UUID string
 */
export function generateTemplateId(): string {
	return uuidv4();
}

export const TEMPLATES: Template[] = [
	{
		id: '1e8e97cb-ecb3-4e40-a865-d325b1dc009c',
		name: 'Classic Header',
		description:
			'Clean and professional design with a traditional header layout, perfect for corporate environments and traditional industries.',
		category: 'professional',
		files: {
			handlebars: '/templates/template1/template1.hbs',
			css: '/templates/template1/template1.css',
			html: '/templates/template1/template1.html'
		},
		previewImage: 'template1-screenshot.png',
		preview: 'template1',
		tags: ['corporate', 'traditional', 'header', 'professional'],
		isActive: true,
		features: ['Header layout', 'Traditional design', 'Corporate style']
	},
	{
		id: 'ac3d81a7-caa9-471c-a0c5-eb0e3297b73e',
		name: 'Modern Sidebar',
		description:
			'Contemporary design with a sidebar layout, ideal for creative professionals and modern workplaces.',
		category: 'modern',
		files: {
			handlebars: '/templates/template2/template2.hbs',
			css: '/templates/template2/template2.css',
			html: '/templates/template2/template2.html'
		},
		preview: 'template2',
		previewImage: 'template2-screenshot.png',
		tags: ['modern', 'sidebar', 'creative', 'contemporary'],
		isActive: true,
		features: ['Sidebar layout', 'Modern design', 'Creative style']
	},
	{
		id: '681ef50c-8ea4-43de-938d-68c322840978',
		name: 'Card Layout',
		description:
			'Innovative card-based design that stands out, perfect for tech professionals and creative portfolios.',
		category: 'creative',
		files: {
			handlebars: '/templates/template3/template3.hbs',
			css: '/templates/template3/template3.css',
			html: '/templates/template3/template3.html'
		},
		preview: 'template3',
		previewImage: 'template3-screenshot.png',
		tags: ['card-based', 'innovative', 'tech', 'portfolio'],
		isActive: true,
		features: ['Card layout', 'Innovative design', 'Portfolio style']
	},
	{
		id: '9d297f66-b54b-44dc-bc19-ff2ab9633fd6',
		name: 'Minimalist Design',
		description:
			'Clean and minimal design focusing on content and readability, perfect for professionals who prefer simplicity.',
		category: 'minimal',
		files: {
			handlebars: '/templates/template4/template4.hbs',
			css: '/templates/template4/template4.css',
			html: '/templates/template4/template4.html'
		},
		preview: 'template4',
		previewImage: 'template4-screenshot.png',
		tags: ['minimal', 'clean', 'readable', 'simple', 'professional'],
		isActive: true,
		features: ['Minimal design', 'Focus on content', 'High readability', 'Clean typography']
	}
];

export type TemplateId = string;

export async function loadTemplate(templatePreview: string): Promise<{ html: string; css: string }> {
	const template = TEMPLATES.find(template => template.preview === templatePreview);
	if (!template) {
		throw new Error(`Template ${templatePreview} not found`);
	}

	try {
		// Load the Handlebars template file
		const response = await fetch(template.files.handlebars);
		if (!response.ok) {
			throw new Error(`Failed to load Handlebars template for ${templatePreview}`);
		}

		const templateContent = await response.text();

		// Extract CSS from the embedded styles
		const cssMatch = templateContent.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
		const css = cssMatch ? cssMatch[1] : '';

		// Remove the style tag to get clean HTML
		const html = templateContent.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

		return { html, css };
	} catch (error) {
		console.error(`Error loading template ${templatePreview}:`, error);
		throw new Error(
			`Failed to load template ${templatePreview}: ${error instanceof Error ? error.message : 'Unknown error'}`
		);
	}
}

export function getTemplate(id: TemplateId): Template | undefined {
	return TEMPLATES.find(template => template.id === id) ?? undefined;
}

export function getAllTemplates(): Template[] {
	return TEMPLATES.filter(template => template.isActive);
}

export function getHomePageTemplates(): Template[] {
	return TEMPLATES.filter(template => template.isActive).slice(1, 4);
}

export function getTemplatesByCategory(category: Template['category']): Template[] {
	return TEMPLATES.filter(template => template.category === category);
}

export function searchTemplates(query: string): Template[] {
	const lowercaseQuery = query.toLowerCase();
	return getAllTemplates().filter(
		template =>
			template.name.toLowerCase().includes(lowercaseQuery) ||
			template.description.toLowerCase().includes(lowercaseQuery) ||
			template.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
	);
}
