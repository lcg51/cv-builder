import { useState, useCallback, useEffect } from 'react';
import { TemplateV2Props } from '@/templates';
import { templatesAPI } from '@/api';

type UseTemplatesProps = {
	isHomePage?: boolean;
};

export function useTemplatesV2({ isHomePage = false }: UseTemplatesProps = {}) {
	const [templates, setTemplates] = useState<TemplateV2Props[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchV2Templates = useCallback(async () => {
		try {
			const result = await templatesAPI.getAll({
				pagination: {
					limit: 3
				},
				populate: ['*']
			});
			const processedData = result.data as TemplateV2Props[];

			return processedData;
		} catch (error) {
			console.error('Error fetching templates:', error);
			throw error;
		}
	}, []);

	// Load all templates
	const loadAllTemplates = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const allTemplates = await fetchV2Templates();
			setTemplates(allTemplates);
		} catch (err) {
			setError('Failed to load templates');
			console.error('Error loading templates:', err);
		} finally {
			setLoading(false);
		}
	}, []);

	const loadHomePageTemplates = useCallback(async () => {
		const templates = await fetchV2Templates();
		setTemplates(templates);
	}, [fetchV2Templates]);

	// Reset to all templates
	const resetToAllTemplates = useCallback(async () => {
		const allTemplates = await fetchV2Templates();
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
		loadHomePageTemplates,
		resetToAllTemplates,
		clearError
	};
}
