import { useState, useCallback, useEffect, useRef } from 'react';
import {
	Template,
	TemplateId,
	fetchAllTemplates,
	fetchTemplateById,
	filterTemplatesByCategory,
	searchTemplates,
	loadTemplate
} from '@/templates';

type UseTemplatesProps = {
	isHomePage?: boolean;
};

export function useTemplates({ isHomePage = false }: UseTemplatesProps = {}) {
	const [templates, setTemplates] = useState<Template[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const allTemplatesRef = useRef<Template[]>([]);

	// Load all templates from CMS
	const loadAllTemplates = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const allTemplates = await fetchAllTemplates();
			allTemplatesRef.current = allTemplates;
			setTemplates(allTemplates);
		} catch (err) {
			setError('Failed to load templates');
			console.error('Error loading templates:', err);
		} finally {
			setLoading(false);
		}
	}, []);

	// Load templates by category (client-side filter)
	const loadTemplatesByCategory = useCallback((category: Template['category']) => {
		const filtered = filterTemplatesByCategory(allTemplatesRef.current, category);
		setTemplates(filtered);
	}, []);

	// Search templates (client-side filter)
	const searchTemplatesByQuery = useCallback((query: string) => {
		const results = searchTemplates(allTemplatesRef.current, query);
		setTemplates(results);
	}, []);

	// Load a specific template
	const loadSpecificTemplate = useCallback(async (id: TemplateId) => {
		try {
			setLoading(true);
			setError(null);
			const template = await fetchTemplateById(id);
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

	const loadHomePageTemplates = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const allTemplates = await fetchAllTemplates();
			allTemplatesRef.current = allTemplates;
			setTemplates(allTemplates.slice(0, 3));
		} catch (err) {
			setError('Failed to load templates');
			console.error('Error loading templates:', err);
		} finally {
			setLoading(false);
		}
	}, []);

	// Reset to all templates (from cached data)
	const resetToAllTemplates = useCallback(() => {
		setTemplates(allTemplatesRef.current);
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
