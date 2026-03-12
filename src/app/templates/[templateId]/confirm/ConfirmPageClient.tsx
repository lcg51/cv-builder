'use client';
import { useRouter } from 'next/navigation';
import { TemplateDownload } from '../../components/TemplateDownload';
import { useCreatePDF } from '@/hooks/useCreatePDF';
import { useSelectedTemplate } from '@/app/templates/hooks/useSelectedTemplate';
import { resumeDataStore, ResumeDataStoreType } from '@/app/store/resume';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useNavigationGuardProvider } from '@/hooks/useNavigationGuardProvider';
import { useStoreHydration } from '@/hooks/useStoreHydration';
import { useModal } from '@/hooks/useModal';
import { useParams } from 'next/navigation';
import { PdfSuccessModal } from '../../components/PdfSuccessModal';

type ConfirmPageClientProps = {
	isAuthenticated: boolean;
};

export default function ConfirmPageClient({ isAuthenticated }: ConfirmPageClientProps) {
	const { replace } = useRouter();
	const params = useParams();
	const templateIdFromUrl = params.templateId as string;
	const { isLoading } = useStoreHydration();
	const {
		userResumeData,
		selectedTemplate: selectedTemplateId,
		resetResumeUserData
	} = resumeDataStore((state: ResumeDataStoreType) => state);

	const completionPercentage = useMemo(() => {
		if (!userResumeData) return 0;
		let completed = 0;
		const total = 7;

		if (userResumeData.firstName) completed++;
		if (userResumeData.lastName) completed++;
		if (userResumeData.email) completed++;
		if (userResumeData.workExperience?.length > 0) completed++;
		if (userResumeData.education?.length > 0) completed++;
		if (userResumeData.skills?.length > 0) completed++;
		if (userResumeData.aboutMe) completed++;

		return Math.round((completed / total) * 100);
	}, [userResumeData]);

	const resetResumeProccess = useCallback(() => {
		replace('/templates');
		resetResumeUserData();
	}, [replace, resetResumeUserData]);

	// Validate that the store's selectedTemplate matches the URL before fetching
	const validatedTemplateId =
		!isLoading && selectedTemplateId && selectedTemplateId === templateIdFromUrl ? selectedTemplateId : undefined;

	useEffect(() => {
		if (isLoading) return;
		if (!selectedTemplateId || selectedTemplateId !== templateIdFromUrl) {
			resetResumeProccess();
		}
	}, [selectedTemplateId, templateIdFromUrl, isLoading, resetResumeProccess]);

	useNavigationGuardProvider({
		hasUnsavedChanges: true,
		onConfirmExit: resetResumeUserData
	});

	const { styles, compiledTemplate, isCompiling, selectedTemplate } = useSelectedTemplate({
		templateId: validatedTemplateId
	});

	const { downloadPDF, isDownloading } = useCreatePDF({
		userResumeData,
		compiledTemplate,
		styles
	});

	const { addModal } = useModal();

	const handleDownloadPDF = useCallback(async () => {
		const success = await downloadPDF();
		if (success) {
			addModal({
				isClosable: true,
				testID: 'pdf-success-modal',
				renderComponent: ({ close }) => (
					<PdfSuccessModal
						onConfirm={() => {
							close();
							resetResumeUserData();
							replace('/');
						}}
					/>
				)
			});
		}
	}, [downloadPDF, addModal, resetResumeUserData, replace]);

	const templateIsLoading = !selectedTemplate || isLoading || isCompiling;

	const NavigationStateComponent = useMemo(() => {
		return (
			<TemplateDownload
				completionPercentage={completionPercentage}
				onDownloadPDF={handleDownloadPDF}
				isDownloading={isDownloading}
				userResumeData={userResumeData}
				compiledTemplate={compiledTemplate ?? (() => '')}
				styles={styles}
				isAuthenticated={isAuthenticated}
				isLoading={templateIsLoading}
			/>
		);
	}, [
		completionPercentage,
		compiledTemplate,
		templateIsLoading,
		styles,
		handleDownloadPDF,
		isDownloading,
		userResumeData,
		isAuthenticated
	]);

	return (
		<div
			className={`bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 md:min-h-[calc(100vh-60px)]`}
		>
			{NavigationStateComponent}
		</div>
	);
}
