import { useCallback, useState, useEffect } from 'react';
import { compileHandlebarsTemplate, compileHandlebarsTemplateFromContent } from '@/lib/templateProcessor';
import { TemplateDataType } from '@/types/payload-types';
import { Template } from '@/templates';
import { cmsApi } from '@/api';

type CreatePdfProps = {
	userResumeData: TemplateDataType;
	selectedTemplate: Template | null;
	useHandlebars?: boolean;
};

export const useCreatePDF = ({ userResumeData, selectedTemplate, useHandlebars = true }: CreatePdfProps) => {
	const [compiledTemplate, setCompiledTemplate] = useState<((userData: TemplateDataType) => string) | null>(null);
	const [styles, setStyles] = useState<string>('');
	const [isLoading, setIsLoading] = useState(false);
	const [isDownloading, setIsDownloading] = useState(false);

	const compileTemplateFromHTML = useCallback(async () => {
		setIsLoading(true);
		try {
			const template = await compileHandlebarsTemplateFromContent(selectedTemplate?.preview ?? '');
			setCompiledTemplate(() => template);
		} catch (error) {
			console.error('Error compiling template:', error);
		} finally {
			setIsLoading(false);
		}
	}, [selectedTemplate]);

	const compileTemplateFromHandlebars = useCallback(async () => {
		setIsLoading(true);
		try {
			const result = await compileHandlebarsTemplate(selectedTemplate?.id ?? '');
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
		if (!useHandlebars) compileTemplateFromHTML();

		compileTemplateFromHandlebars();
	}, [selectedTemplate, useHandlebars, compileTemplateFromHandlebars, compileTemplateFromHTML]);

	const refreshTemplates = useCallback(async () => {
		setStyles('');
		setCompiledTemplate(null);
	}, [selectedTemplate]);

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
		styles,
		isLoading,
		isDownloading,
		refreshTemplates,
		downloadPDF,
		compiledTemplate
	};
};
