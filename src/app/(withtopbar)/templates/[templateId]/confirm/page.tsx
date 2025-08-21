'use client';
import { useRouter } from 'next/navigation';
import { TemplateDownload } from '../../components/TemplateDownload';
import { useCreatePDF } from '@/hooks/useCreatePDF';
import { resumeDataStore, ResumeDataStoreType } from '@/app/store/resume';
import { useCallback, useEffect, useState } from 'react';
import { getTemplate, Template } from '@/templates';
import { useNavigationGuardProvider } from '@/hooks/useNavigationGuardProvider';

export default function ConfirmPage() {
	const { replace } = useRouter();
	const {
		userResumeData,
		selectedTemplate: selectedTemplateId,
		resetResumeUserData
	} = resumeDataStore((state: ResumeDataStoreType) => state);

	const [template, setTemplate] = useState<Template | null>(null);

	const resetResumeProccess = useCallback(() => {
		replace('/templates');
		resetResumeUserData();
	}, [replace, resetResumeUserData]);

	useEffect(() => {
		if (!selectedTemplateId) {
			resetResumeProccess();
			return;
		}

		const foundTemplate = getTemplate(selectedTemplateId);

		if (!foundTemplate) {
			resetResumeProccess();
			return;
		}

		setTemplate(foundTemplate);
	}, [selectedTemplateId, resetResumeProccess]);

	useNavigationGuardProvider({
		hasUnsavedChanges: true,
		onConfirmExit: resetResumeUserData
	});

	const { downloadPDF, isDownloading } = useCreatePDF({
		userResumeData,
		selectedTemplate: template,
		useHandlebars: true
	});

	return (
		<TemplateDownload initialValues={userResumeData} onDownloadPDF={downloadPDF} isDownloading={isDownloading} />
	);
}
