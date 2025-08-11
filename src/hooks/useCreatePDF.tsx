import { useCallback, useState } from 'react';
import { processTemplate } from '@/lib/templateProcessor';
import { UserDataType } from '@/app/models/user';

type CreatePdfProps = {
	userResumeData: UserDataType;
};

export function useCreatePDF({ userResumeData }: CreatePdfProps) {
	const [templateHTML, setTemplateHTML] = useState<string>('');
	const [styles, setStyles] = useState<string>('');

	const fetchTemplatePDF = async (templateId: string) => {
		try {
			const htmlResponse = await fetch(`/templates/${templateId}/${templateId}.html`);
			const stylesResponse = await fetch(`/templates/${templateId}/${templateId}.css`);
			if (!htmlResponse.ok || !stylesResponse.ok) {
				throw new Error(`HTTP error! status: ${htmlResponse.status}`);
			}

			const template = await htmlResponse.text();
			const styles = await stylesResponse.text();

			setTemplateHTML(template || '');
			setStyles(styles || '');
		} catch (error) {
			console.error('Error fetching template:', error);
		}
	};

	const downloadPDF = useCallback(async () => {
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
		}
	}, [templateHTML, styles, userResumeData]);

	return { templateHTML, styles, fetchTemplatePDF, downloadPDF };
}
