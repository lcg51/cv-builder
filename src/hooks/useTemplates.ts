import { useState, useCallback, useEffect, useRef } from 'react';
import {
	Template,
	TemplateId,
	fetchAllTemplates,
	fetchTemplateById,
	filterTemplatesByCategory,
	searchTemplates
} from '@/templates';
import { compileHandlebarsTemplate } from '@/lib/handlebarsProcessor';
import { TemplateDataType } from '@/types/payload-types';

type UseTemplatesProps = {
	isHomePage?: boolean;
	templateId?: string;
};

export function useTemplates({ isHomePage = false, templateId }: UseTemplatesProps = {}) {
	const [templates, setTemplates] = useState<Template[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const allTemplatesRef = useRef<Template[]>([]);

	// Selected template state (fetched by templateId)
	const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
	const [templateError, setTemplateError] = useState<string | null>(null);

	// Template compilation state
	const [compiledTemplate, setCompiledTemplate] = useState<((userData: TemplateDataType) => string) | null>(null);
	const [styles, setStyles] = useState<string>('');
	const [isCompiling, setIsCompiling] = useState(false);

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

	// Fetch a single template by ID
	useEffect(() => {
		if (!templateId) return;

		let cancelled = false;
		setSelectedTemplate(null);
		setTemplateError(null);

		fetchTemplateById(templateId).then(foundTemplate => {
			if (cancelled) return;
			if (!foundTemplate) {
				setTemplateError(`Template "${templateId}" not found`);
				return;
			}
			setSelectedTemplate(foundTemplate);
		});

		return () => {
			cancelled = true;
		};
	}, [templateId]);

	// Compile Handlebars template when selectedTemplate changes
	const compileTemplateFromHandlebars = useCallback(async () => {
		setIsCompiling(true);
		try {
			const result = await compileHandlebarsTemplate(selectedTemplate?.id ?? '');
			setCompiledTemplate(() => result.template);
			setStyles(result.css);
		} catch (err) {
			console.error('Error compiling template:', err);
		} finally {
			setIsCompiling(false);
		}
	}, [selectedTemplate]);

	useEffect(() => {
		if (!selectedTemplate) return;
		compileTemplateFromHandlebars();
	}, [selectedTemplate, compileTemplateFromHandlebars]);

	const refreshTemplates = useCallback(() => {
		setStyles('');
		setCompiledTemplate(null);
	}, []);

	return {
		templates,
		loading,
		error,
		loadAllTemplates,
		loadTemplatesByCategory,
		loadHomePageTemplates,
		searchTemplatesByQuery,
		loadSpecificTemplate,
		resetToAllTemplates,
		clearError,
		selectedTemplate,
		templateError,
		compiledTemplate,
		styles,
		isCompiling,
		refreshTemplates
	};
}
