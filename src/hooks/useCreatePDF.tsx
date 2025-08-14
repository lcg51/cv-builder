import { useCallback, useState, useEffect } from 'react';
import { compileHandlebarsTemplate, compileHandlebarsTemplateFromContent } from '@/lib/templateProcessor';
import { UserDataType } from '@/app/models/user';

type CreatePdfProps = {
	userResumeData: UserDataType;
	setSelectedTemplate: (templateId: string) => void;
	selectedTemplate: string;
	useHandlebars?: boolean;
};

export const useCreatePDF = ({
	userResumeData,
	selectedTemplate,
	setSelectedTemplate,
	useHandlebars = true
}: CreatePdfProps) => {
	const [templateHTML, setTemplateHTML] = useState<string>('');
	const [styles, setStyles] = useState<string>('');
	const [isLoading, setIsLoading] = useState(false);
	const [isDownloading, setIsDownloading] = useState(false);
	const [compiledTemplate, setCompiledTemplate] = useState<((userData: UserDataType) => string) | null>(null);

	// Compile Handlebars template once when template changes
	useEffect(() => {
		if (!useHandlebars) return;

		const compileTemplate = async () => {
			try {
				console.log('🔄 Compiling Handlebars template for PDF generation...');
				// Try to compile from template ID first
				const result = await compileHandlebarsTemplate(selectedTemplate);
				setCompiledTemplate(() => result.template);
				setStyles(result.css);
				console.log('✅ Template compiled for PDF generation');
			} catch (error) {
				console.error('Error compiling template for PDF:', error);
				// Fallback to fetching individual files if compilation fails
				await fetchTemplatePDF();
			}
		};

		compileTemplate();
	}, [selectedTemplate, useHandlebars]);

	const fetchTemplatePDF = useCallback(async () => {
		// Prevent duplicate requests if templates are already loaded
		if (templateHTML && styles) {
			return;
		}

		setIsLoading(true);

		try {
			const htmlResponse = await fetch(`/templates/${selectedTemplate}/${selectedTemplate}.html`);
			const stylesResponse = await fetch(`/templates/${selectedTemplate}/${selectedTemplate}.css`);
			if (!htmlResponse.ok || !stylesResponse.ok) {
				throw new Error(`HTTP error! status: ${htmlResponse.status}`);
			}

			const template = await htmlResponse.text();
			const styles = await stylesResponse.text();

			setTemplateHTML(template || '');
			setStyles(styles || '');

			// If using Handlebars, compile the fetched template
			if (useHandlebars && template) {
				try {
					const compiledTemplateFn = await compileHandlebarsTemplateFromContent(template);
					setCompiledTemplate(() => compiledTemplateFn);
					console.log('✅ Template compiled from fetched HTML for PDF generation');
				} catch (compileError) {
					console.error('Error compiling fetched template:', compileError);
				}
			}
		} catch (error) {
			console.error('Error fetching template:', error);
		} finally {
			setIsLoading(false);
		}
	}, [selectedTemplate, templateHTML, styles, useHandlebars]);

	const refreshTemplates = useCallback(async () => {
		setTemplateHTML('');
		setStyles('');
		setCompiledTemplate(null);
		await fetchTemplatePDF();
	}, [selectedTemplate, fetchTemplatePDF]);

	const downloadPDF = useCallback(async () => {
		setIsDownloading(true);
		try {
			let processedHtml: string;

			if (useHandlebars && compiledTemplate) {
				// Use the compiled Handlebars template function
				console.log('⚡ Processing Handlebars template for PDF generation');
				processedHtml = compiledTemplate(userResumeData);
			} else if (templateHTML) {
				// Fallback to legacy template processing
				const { processTemplate } = await import('@/lib/templateProcessor');
				processedHtml = processTemplate(templateHTML, userResumeData);
			} else {
				throw new Error('No template available for processing');
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
	}, [templateHTML, styles, userResumeData, useHandlebars, compiledTemplate]);

	const setCurrentTemplate = useCallback((templateId: string) => {
		setSelectedTemplate(templateId);
	}, []);

	return {
		templateHTML,
		styles,
		isLoading,
		isDownloading,
		fetchTemplatePDF,
		refreshTemplates,
		downloadPDF,
		setCurrentTemplate
	};
};
