import { useCallback, useState } from 'react';
import { processTemplate } from '@/lib/templateProcessor';
import { UserDataType } from '@/app/models/user';

type CreatePdfProps = {
	userResumeData: UserDataType;
	setSelectedTemplate: (templateId: string) => void;
	selectedTemplate: string;
};

export function useCreatePDF({ userResumeData, selectedTemplate, setSelectedTemplate }: CreatePdfProps) {
	const [templateHTML, setTemplateHTML] = useState<string>('');
	const [styles, setStyles] = useState<string>('');
	const [isLoading, setIsLoading] = useState(false);
	const [isDownloading, setIsDownloading] = useState(false);

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
		} catch (error) {
			console.error('Error fetching template:', error);
		} finally {
			setIsLoading(false);
		}
	}, [selectedTemplate, templateHTML, styles]);

	const refreshTemplates = useCallback(async () => {
		setTemplateHTML('');
		setStyles('');
		await fetchTemplatePDF();
	}, [selectedTemplate, fetchTemplatePDF]);

	const downloadPDF = useCallback(async () => {
		setIsDownloading(true);
		try {
			// Process the template with user data using the shared utility
			const processedHtml = processTemplate(templateHTML, userResumeData);

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
			link.download = 'resume.pdf';
			link.click();
		} catch (error) {
			console.error('Error downloading PDF:', error);
		} finally {
			setIsDownloading(false);
		}
	}, [templateHTML, styles, userResumeData]);

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
}
