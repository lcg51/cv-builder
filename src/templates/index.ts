import { template1Screenshot, template2Screenshot, template3Screenshot, template4Screenshot } from '@/assets';

export type TemplateCategory = 'professional' | 'creative' | 'modern' | 'minimal';

export type Feature = {
	id: string;
	name: string;
	description: string;
	documentId: string;
};

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

// --- CMS API types ---

export type CMSTemplateLayoutBlock = {
	id: string;
	label: string;
	html: string;
	blockName: string | null;
	blockType: string;
};

export type CMSTemplateDoc = {
	id: number;
	name: string;
	slug: string;
	layout: CMSTemplateLayoutBlock[];
	customCSS: string;
	renderedHTML: string;
	thumbnail: {
		url: string;
		width: number;
		height: number;
		sizes: {
			thumbnail: { url: string | null };
			small: { url: string | null };
			medium: { url: string | null };
		};
	} | null;
	globalConfig: {
		primaryColor: string;
		secondaryColor: string;
		fontFamily: string;
		socialLinks: string[];
	};
	generateSlug: boolean;
	_status: string;
	updatedAt: string;
	createdAt: string;
};

export type CMSTemplateListResponse = {
	docs: CMSTemplateDoc[];
	totalDocs: number;
	limit: number;
	totalPages: number;
	page: number;
	pagingCounter: number;
	hasPrevPage: boolean;
	hasNextPage: boolean;
	prevPage: number | null;
	nextPage: number | null;
};

// Use the Next.js rewrite proxy to avoid CORS issues on client-side fetches
const CMS_API_BASE = '/cms-api';
const CMS_ORIGIN = process.env.NEXT_PUBLIC_CMS_API_URL || 'https://portfolio-cms-beige-eta.vercel.app';

// --- CMS mapper ---

function buildThumbnailUrl(doc: CMSTemplateDoc): string {
	const path = doc.thumbnail?.sizes?.small?.url ?? doc.thumbnail?.sizes?.medium?.url ?? doc.thumbnail?.url;
	if (!path) return '';
	return `${CMS_ORIGIN}${path}`;
}

function mapCMSDocToTemplate(doc: CMSTemplateDoc): Template {
	return {
		id: String(doc.id),
		name: doc.name,
		description: doc.name,
		category: 'professional',
		files: { handlebars: '', css: '', html: '' },
		preview: doc.slug,
		previewImage: buildThumbnailUrl(doc),
		tags: [],
		isActive: doc._status === 'published',
		features: []
	};
}

// --- CMS API functions ---

export async function fetchAllTemplates(): Promise<Template[]> {
	const response = await fetch(`${CMS_API_BASE}/templates`);
	if (!response.ok) {
		throw new Error(`Failed to fetch templates: ${response.status}`);
	}
	const data: CMSTemplateListResponse = await response.json();
	return data.docs.map(mapCMSDocToTemplate).filter(t => t.isActive);
}

export async function fetchTemplateById(id: string): Promise<Template | undefined> {
	try {
		const response = await fetch(`${CMS_API_BASE}/templates/${id}`);
		if (!response.ok) return undefined;
		const doc: CMSTemplateDoc = await response.json();
		return mapCMSDocToTemplate(doc);
	} catch {
		return undefined;
	}
}

export type TemplateId = string;

export async function loadTemplate(templateId: string): Promise<{ html: string; css: string }> {
	const response = await fetch(`${CMS_API_BASE}/templates/${templateId}`);
	if (!response.ok) {
		throw new Error(`Failed to load template ${templateId}`);
	}
	const doc: CMSTemplateDoc = await response.json();

	if (!doc.layout || doc.layout.length === 0) {
		throw new Error(`Template ${templateId} has no layout blocks`);
	}

	return {
		html: doc.layout[0].html,
		css: doc.customCSS
	};
}

// --- Client-side filter utilities (operate on a provided array) ---

export function filterTemplatesByCategory(templates: Template[], category: TemplateCategory): Template[] {
	return templates.filter(template => template.category === category);
}

export function searchTemplates(templates: Template[], query: string): Template[] {
	const lowercaseQuery = query.toLowerCase();
	return templates.filter(
		template =>
			template.name.toLowerCase().includes(lowercaseQuery) ||
			template.description.toLowerCase().includes(lowercaseQuery) ||
			template.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
	);
}
