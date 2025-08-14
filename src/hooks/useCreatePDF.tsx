import { useCallback, useState, useEffect } from 'react';
import { compileHandlebarsTemplate, compileHandlebarsTemplateFromContent } from '@/lib/templateProcessor';
import { UserDataType } from '@/app/models/user';

type CreatePdfProps = {
	userResumeData: UserDataType;
	setSelectedTemplate: (templateId: string) => void;
	selectedTemplate: string;
	useHandlebars?: boolean;
};

export const useCreatePDF = ({ userResumeData, selectedTemplate, useHandlebars = true }: CreatePdfProps) => {
	const [compiledTemplate, setCompiledTemplate] = useState<((userData: UserDataType) => string) | null>(null);
	const [styles, setStyles] = useState<string>('');
	const [isLoading, setIsLoading] = useState(false);
	const [isDownloading, setIsDownloading] = useState(false);

	const compileTemplateFromContent = useCallback(async () => {
		setIsLoading(true);
		try {
			const template = await compileHandlebarsTemplateFromContent(selectedTemplate);
			setCompiledTemplate(() => template);
		} catch (error) {
			console.error('Error compiling template:', error);
		} finally {
			setIsLoading(false);
		}
	}, [selectedTemplate]);

	const compileTemplate = useCallback(async () => {
		setIsLoading(true);
		try {
			console.log('🔄 Compiling Handlebars template...');

			const result = await compileHandlebarsTemplate(selectedTemplate);
			console.log('✅ Template compiled from templateId');
			setCompiledTemplate(() => result.template);
			setStyles(result.css);
		} catch (error) {
			console.error('Error compiling template:', error);
		} finally {
			setIsLoading(false);
		}
	}, [selectedTemplate]);

	// Compile Handlebars template once when template changes
	useEffect(() => {
		if (!selectedTemplate) return;
		if (!useHandlebars) compileTemplateFromContent();

		compileTemplate();
	}, [selectedTemplate, useHandlebars, compileTemplate, compileTemplateFromContent]);

	const refreshTemplates = useCallback(async () => {
		setStyles('');
		setCompiledTemplate(null);
	}, [selectedTemplate]);

	const downloadPDF = useCallback(async () => {
		setIsDownloading(true);
		try {
			let processedHtml: string;

			if (!compiledTemplate) {
				throw new Error('No template available for processing');
			}

			if (useHandlebars) {
				processedHtml = compiledTemplate(userResumeData);
			} else {
				// const { processTemplate } = await import('@/lib/templateProcessor');
				processedHtml = compiledTemplate(userResumeData);
			}

			const response = await fetch(`/api/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ html: processedHtml, styles: styles })
			});

			if (!response.ok) {
				throw new Error('Failed to generate PDF');
			}
			const blob = await response.blob();
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = `${userResumeData.firstName} ${userResumeData.lastName} - ${new Date().toLocaleDateString()}.pdf`;
			link.click();
		} catch (error) {
			console.error('Error downloading PDF:', error);
		} finally {
			setIsDownloading(false);
		}
	}, [styles, userResumeData, useHandlebars, compiledTemplate]);

	return {
		styles,
		isLoading,
		isDownloading,
		refreshTemplates,
		downloadPDF,
		compiledTemplate
	};
};
