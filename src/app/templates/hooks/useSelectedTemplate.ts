import { useState, useEffect, useCallback } from 'react';
import {
	fetchTemplateById,
	type TemplateDataType as TemplateDataTypeService,
	loadTemplate
} from '@/app/templates/templates.service';
import { compileHandlebarsTemplate } from '@/lib/handlebarsProcessor';
import type { TemplateDataType } from '@/types/payload-types';

type UseSelectedTemplateProps = {
	templateId?: string;
};

export function useSelectedTemplate({ templateId }: UseSelectedTemplateProps = {}) {
	const [selectedTemplate, setSelectedTemplate] = useState<TemplateDataTypeService | null>(null);
	const [templateError, setTemplateError] = useState<string | null>(null);
	const [compiledTemplate, setCompiledTemplate] = useState<((userData: TemplateDataType) => string) | null>(null);
	const [styles, setStyles] = useState('');
	const [isCompiling, setIsCompiling] = useState(false);

	useEffect(() => {
		if (!templateId) {
			setSelectedTemplate(null);
			setTemplateError(null);
			setCompiledTemplate(null);
			setStyles('');
			setIsCompiling(false);
			return;
		}

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

	const compileTemplateFromHandlebars = useCallback(async () => {
		setIsCompiling(true);
		try {
			const result = await compileHandlebarsTemplate<TemplateDataType>(() =>
				loadTemplate(selectedTemplate?.id ?? '')
			);
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
		selectedTemplate,
		templateError,
		compiledTemplate,
		styles,
		isCompiling,
		refreshTemplates
	};
}
