'use client';
import { useParams, useRouter } from 'next/navigation';
import { TemplateDownload } from '../../components/TemplateDownload';
import { useCreatePDF } from '@/hooks/useCreatePDF';
import { resumeDataStore, ResumeDataStoreType } from '@/app/store/resume';
import { useCallback, useEffect, useState } from 'react';
import { getTemplate, Template } from '@/templates';
import { ModalDisclaimer } from '@/app/components/ModalDisclaimer';
import { useNavigationGuard } from '@/hooks/useNavigationGuard';

export default function ConfirmPage() {
	const params = useParams();
	const { replace } = useRouter();
	const templateId = params.templateId as string;
	const userResumeData = resumeDataStore((state: ResumeDataStoreType) => state.userResumeData);
	const resetResumeUserData = resumeDataStore((state: ResumeDataStoreType) => state.resetResumeUserData);
	const selectedTemplate = resumeDataStore((state: ResumeDataStoreType) => state.selectedTemplate);
	const [template, setTemplate] = useState<Template | null>(null);

	useEffect(() => {
		const templateID = params.templateId as string;
		const foundTemplate = getTemplate(templateID);
		if (foundTemplate && selectedTemplate) {
			setTemplate(foundTemplate);
		} else {
			replace('/templates');
		}
	}, [params, selectedTemplate]);

	const resetResumeProccess = useCallback(() => {
		resetResumeUserData();
	}, [resetResumeUserData]);

	const { showExitDialog, confirmExit, cancelExit, attemptNavigation } = useNavigationGuard({
		hasUnsavedChanges: true,
		onConfirmExit: resetResumeProccess
	});

	const { downloadPDF, isDownloading } = useCreatePDF({
		userResumeData,
		selectedTemplate: template,
		useHandlebars: true
	});

	return (
		<>
			<ModalDisclaimer
				open={showExitDialog}
				onOpenChange={() => {
					if (!showExitDialog) {
						attemptNavigation('/');
					}
				}}
				onConfirm={confirmExit}
				onCancel={cancelExit}
			/>
			<TemplateDownload templateId={templateId} onDownloadPDF={downloadPDF} isDownloading={isDownloading} />
		</>
	);
}
