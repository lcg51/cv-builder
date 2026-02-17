import { useCallback, useState } from 'react';
import { TemplateDataType } from '@/types/payload-types';
import { cmsApi } from '@/api';

type CreatePdfProps = {
	userResumeData: TemplateDataType;
	compiledTemplate: ((userData: TemplateDataType) => string) | null;
	styles: string;
};

export const useCreatePDF = ({ userResumeData, compiledTemplate, styles }: CreatePdfProps) => {
	const [isDownloading, setIsDownloading] = useState(false);

	const downloadPDF = useCallback(async () => {
		setIsDownloading(true);
		try {
			if (!compiledTemplate) {
				throw new Error('No template available for processing');
			}

			const processedHtml = compiledTemplate(userResumeData);

			await cmsApi.login();
			const blob = await cmsApi.postRaw('/pdf', { html: processedHtml, styles });

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
	}, [styles, userResumeData, compiledTemplate]);

	return {
		downloadPDF,
		isDownloading
	};
};
