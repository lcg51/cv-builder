export interface Template {
	id: string;
	name: string;
	description: string;
	category: 'professional' | 'creative' | 'modern' | 'minimal';
	files: {
		html: string;
		css: string;
	};
	preview: string;
	tags: string[];
	isActive: boolean;
	features: string[];
}

export const TEMPLATES: Record<string, Template> = {
	template1: {
		id: 'template1',
		name: 'Classic Header',
		description:
			'Clean and professional design with a traditional header layout, perfect for corporate environments and traditional industries.',
		category: 'professional',
		files: {
			html: '/templates/template1/template1.html',
			css: '/templates/template1/template1.css'
		},
		preview: 'template1',
		tags: ['corporate', 'traditional', 'header', 'professional'],
		isActive: true,
		features: ['Header layout', 'Traditional design', 'Corporate style']
	},
	template2: {
		id: 'template2',
		name: 'Modern Sidebar',
		description:
			'Contemporary design with a sidebar layout, ideal for creative professionals and modern workplaces.',
		category: 'modern',
		files: {
			html: '/templates/template2/template2.html',
			css: '/templates/template2/template2.css'
		},
		preview: 'template2',
		tags: ['modern', 'sidebar', 'creative', 'contemporary'],
		isActive: true,
		features: ['Sidebar layout', 'Modern design', 'Creative style']
	},
	template3: {
		id: 'template3',
		name: 'Card Layout',
		description:
			'Innovative card-based design that stands out, perfect for tech professionals and creative portfolios.',
		category: 'creative',
		files: {
			html: '/templates/template3/template3.html',
			css: '/templates/template3/template3.css'
		},
		preview: 'template3',
		tags: ['card-based', 'innovative', 'tech', 'portfolio'],
		isActive: true,
		features: ['Card layout', 'Innovative design', 'Portfolio style']
	},
	template4: {
		id: 'template4',
		name: 'Minimalist Design',
		description:
			'Clean and minimal design focusing on content and readability, perfect for professionals who prefer simplicity.',
		category: 'minimal',
		files: {
			html: '/templates/template4/template4.html',
			css: '/templates/template4/template4.css'
		},
		preview: 'template4',
		tags: ['minimal', 'clean', 'readable', 'simple', 'professional'],
		isActive: true,
		features: ['Minimal design', 'Focus on content', 'High readability', 'Clean typography']
	}
} as const;

export type TemplateId = keyof typeof TEMPLATES;

export async function loadTemplate(id: TemplateId): Promise<{ html: string; css: string }> {
	const template = TEMPLATES[id];
	if (!template) {
		throw new Error(`Template ${id} not found`);
	}

	try {
		const [html, css] = await Promise.all([
			fetch(template.files.html).then(r => {
				if (!r.ok) throw new Error(`Failed to load HTML for ${id}`);
				return r.text();
			}),
			fetch(template.files.css).then(r => {
				if (!r.ok) throw new Error(`Failed to load CSS for ${id}`);
				return r.text();
			})
		]);

		return { html, css };
	} catch (error) {
		console.error(`Error loading template ${id}:`, error);
		throw new Error(`Failed to load template ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
}

export function getTemplate(id: TemplateId): Template | undefined {
	return TEMPLATES[id];
}

export function getAllTemplates(): Template[] {
	return Object.values(TEMPLATES).filter(template => template.isActive);
}

export function getTemplatesByCategory(category: Template['category']): Template[] {
	return getAllTemplates().filter(template => template.category === category);
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
