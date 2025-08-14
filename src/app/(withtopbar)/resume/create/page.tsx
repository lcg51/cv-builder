'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { TemplateSelection } from '../components/TemplateSelection';
import { NavigationStateEnum, resumeDataStore, ResumeDataStoreType } from '@/app/store/resume';
import { useNavigationGuard } from '@/hooks/useNavigationGuard';
import { ModalDisclaimer } from '@/app/components/ModalDisclaimer';
import { TemplateUpdate } from '../components/TemplateUpdate';
import { TemplateSkeleton } from '../components/TemplateSkeleton';
import { TemplateUpdateSkeleton } from '../components/TemplateUpdateSkeleton';
import { TemplateDownload } from '../components/TemplateDownload';
import { useCreatePDF } from '@/hooks/useCreatePDF';

const TOPBAR_HEIGHT = 60;
const CONTAINER_PADDING = 32; // 2rem = 32px (p-4 lg:p-6)
const TOTAL_OFFSET = TOPBAR_HEIGHT + 2 * CONTAINER_PADDING;

export default function CreateResume() {
	const userResumeData = resumeDataStore((state: ResumeDataStoreType) => state.userResumeData);
	const resetResumeUserData = resumeDataStore((state: ResumeDataStoreType) => state.resetResumeUserData);
	const selectedTemplate = resumeDataStore((state: ResumeDataStoreType) => state.selectedTemplate);
	const setSelectedTemplate = resumeDataStore((state: ResumeDataStoreType) => state.setSelectedTemplate);
	const navigationState = resumeDataStore((state: ResumeDataStoreType) => state.navigationState);
	const setNavigationState = resumeDataStore((state: ResumeDataStoreType) => state.setNavigationState);
	const [isPageLoading, setIsPageLoading] = useState<boolean>(true);

	const hasUnsavedChanges = Object.values(userResumeData).some(
		value => value !== '' && value !== null && value !== undefined
	);

	const resetResumeProccess = useCallback(() => {
		resetResumeUserData();
		setNavigationState(NavigationStateEnum.TEMPLATE_SELECTION);
	}, [resetResumeUserData, setNavigationState]);

	const { showExitDialog, confirmExit, cancelExit, attemptNavigation } = useNavigationGuard({
		hasUnsavedChanges,
		onConfirmExit: resetResumeProccess
	});

	const { templateHTML, styles, fetchTemplatePDF, setCurrentTemplate, downloadPDF, isDownloading } = useCreatePDF({
		userResumeData,
		setSelectedTemplate,
		selectedTemplate,
		useHandlebars: true
	});

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsPageLoading(false);
		}, 200);

		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		if (selectedTemplate) {
			fetchTemplatePDF();
		}
	}, [fetchTemplatePDF, selectedTemplate]);

	const handleTemplateSelect = useCallback(
		async (templateId: string) => {
			setSelectedTemplate(templateId);
			setNavigationState(NavigationStateEnum.TEMPLATE_UPDATE);
		},
		[setSelectedTemplate]
	);

	const onTemplateDownload = useCallback(() => {
		setNavigationState(NavigationStateEnum.TEMPLATE_DOWNLOAD);
	}, []);

	return (
		<div
			className={`bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 min-h-[calc(100vh-3.5rem)] lg:min-h-[calc(100vh-3.75rem)] xl:min-h-[calc(100vh-60px)]`}
		>
			{/* Exit Disclaimer Dialog */}
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

			{navigationState === NavigationStateEnum.TEMPLATE_SELECTION &&
				(isPageLoading ? <TemplateSkeleton /> : <TemplateSelection onTemplateSelect={handleTemplateSelect} />)}
			{navigationState === NavigationStateEnum.TEMPLATE_UPDATE &&
				(isPageLoading ? (
					<TemplateUpdateSkeleton />
				) : (
					<TemplateUpdate
						totalOffset={TOTAL_OFFSET}
						templateHTML={templateHTML}
						styles={styles}
						fetchTemplatePDF={fetchTemplatePDF}
						setCurrentTemplate={setCurrentTemplate}
						templateId={selectedTemplate}
						onTemplateDownload={onTemplateDownload}
					/>
				))}
			{navigationState === NavigationStateEnum.TEMPLATE_DOWNLOAD && (
				<TemplateDownload
					templateId={selectedTemplate}
					initialValues={userResumeData}
					onDownloadPDF={downloadPDF}
					isDownloading={isDownloading}
				/>
			)}
		</div>
	);
}
