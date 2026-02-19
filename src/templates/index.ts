import { cmsApi } from '@/api';

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
export async function fetchAllTemplates(params?: Record<string, string | number>): Promise<Template[]> {
	const data = await cmsApi.get<CMSTemplateListResponse>('/templates', params);
	return data.docs.map(mapCMSDocToTemplate).filter(t => t.isActive);
}

export async function fetchTemplateById(id: string): Promise<Template | undefined> {
	try {
		const doc = await cmsApi.get<CMSTemplateDoc>(`/templates/${id}`);
		return mapCMSDocToTemplate(doc);
	} catch {
		return undefined;
	}
}

export type TemplateId = string;

export async function loadTemplate(templateId: string): Promise<{ html: string; css: string }> {
	const doc = await cmsApi.get<CMSTemplateDoc>(`/templates/${templateId}`);

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
