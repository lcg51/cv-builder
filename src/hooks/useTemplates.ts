import { useState, useCallback, useEffect } from 'react';
import {
	Template,
	TemplateId,
	getAllTemplates,
	getHomePageTemplates,
	getTemplatesByCategory,
	searchTemplates,
	loadTemplate,
	getTemplate
} from '@/templates';

type UseTemplatesProps = {
	isHomePage?: boolean;
};

export function useTemplates({ isHomePage = false }: UseTemplatesProps = {}) {
	const [templates, setTemplates] = useState<Template[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Load all templates
	const loadAllTemplates = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const allTemplates = getAllTemplates();
			setTemplates(allTemplates);
		} catch (err) {
			setError('Failed to load templates');
			console.error('Error loading templates:', err);
		} finally {
			await new Promise(resolve => setTimeout(resolve, 500));
			setLoading(false);
		}
	}, []);

	// Load templates by category
	const loadTemplatesByCategory = useCallback(async (category: Template['category']) => {
		try {
			setLoading(true);
			setError(null);
			const categoryTemplates = getTemplatesByCategory(category);
			setTemplates(categoryTemplates);
		} catch (err) {
			setError('Failed to load templates by category');
			console.error('Error loading templates by category:', err);
		} finally {
			setLoading(false);
		}
	}, []);

	// Search templates
	const searchTemplatesByQuery = useCallback(async (query: string) => {
		try {
			setLoading(true);
			setError(null);
			const searchResults = searchTemplates(query);
			setTemplates(searchResults);
		} catch (err) {
			setError('Failed to search templates');
			console.error('Error searching templates:', err);
		} finally {
			setLoading(false);
		}
	}, []);

	// Load a specific template
	const loadSpecificTemplate = useCallback(async (id: TemplateId) => {
		try {
			setLoading(true);
			setError(null);
			const template = getTemplate(id);
			if (template) {
				setTemplates([template]);
			} else {
				setError(`Template ${id} not found`);
			}
		} catch (err) {
			setError(`Failed to load template ${id}`);
			console.error(`Error loading template ${id}:`, err);
		} finally {
			setLoading(false);
		}
	}, []);

	// Load template content (HTML + CSS)
	const loadTemplateContent = useCallback(async (id: TemplateId) => {
		try {
			setLoading(true);
			setError(null);
			const content = await loadTemplate(id);
			return content;
		} catch (err) {
			setError(`Failed to load template content for ${id}`);
			console.error(`Error loading template content for ${id}:`, err);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const loadHomePageTemplates = useCallback(() => {
		const homePageTemplates = getHomePageTemplates();
		setTemplates(homePageTemplates);
	}, []);

	// Reset to all templates
	const resetToAllTemplates = useCallback(() => {
		const allTemplates = getAllTemplates();
		setTemplates(allTemplates);
	}, []);

	// Clear error
	const clearError = useCallback(() => {
		setError(null);
	}, []);

	// Load all templates on mount
	useEffect(() => {
		if (isHomePage) {
			loadHomePageTemplates();
			return;
		}
		loadAllTemplates();
	}, [loadAllTemplates, loadHomePageTemplates, isHomePage]);

	return {
		templates,
		loading,
		error,
		loadAllTemplates,
		loadTemplatesByCategory,
		loadHomePageTemplates,
		searchTemplatesByQuery,
		loadSpecificTemplate,
		loadTemplateContent,
		resetToAllTemplates,
		clearError
	};
}
