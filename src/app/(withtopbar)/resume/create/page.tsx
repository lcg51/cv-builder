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

	const { showExitDialog, confirmExit, cancelExit, attemptNavigation } = useNavigationGuard({
		hasUnsavedChanges,
		onConfirmExit: resetResumeUserData
	});

	const { templateHTML, styles, fetchTemplatePDF, setCurrentTemplate, downloadPDF, isDownloading } = useCreatePDF({
		userResumeData,
		setSelectedTemplate,
		selectedTemplate
	});

	useEffect(() => {
		const handleNavigationAttempt = () => {
			if (hasUnsavedChanges) {
				attemptNavigation('/home');
			}
		};

		window.addEventListener('navigation-attempt', handleNavigationAttempt as EventListener);
		return () => window.removeEventListener('navigation-attempt', handleNavigationAttempt as EventListener);
	}, [hasUnsavedChanges, attemptNavigation]);

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
			className={`bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800`}
			style={{ height: `calc(100vh - ${TOPBAR_HEIGHT}px)` }}
		>
			{/* Exit Disclaimer Dialog */}
			<ModalDisclaimer
				open={showExitDialog}
				onOpenChange={() => {
					if (!showExitDialog) {
						attemptNavigation('/home');
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
