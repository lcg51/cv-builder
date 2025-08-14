'use client';
import React, { useCallback, useEffect, useMemo } from 'react';
import { NavigationStateEnum, resumeDataStore, ResumeDataStoreType } from '@/app/store/resume';
import { useNavigationGuard } from '@/hooks/useNavigationGuard';
import { ModalDisclaimer } from '@/app/components/ModalDisclaimer';
import { TemplateUpdate } from '../components/TemplateUpdate';
import { TemplateUpdateSkeleton } from '../components/TemplateUpdateSkeleton';
import { TemplateDownload } from '../components/TemplateDownload';
import { useCreatePDF } from '@/hooks/useCreatePDF';
import { useSearchParams } from 'next/navigation';

const TOPBAR_HEIGHT = 60;
const CONTAINER_PADDING = 32; // 2rem = 32px (p-4 lg:p-6)
const TOTAL_OFFSET = TOPBAR_HEIGHT + 2 * CONTAINER_PADDING;

export default function CreateResume() {
	const searchParams = useSearchParams();
	const userResumeData = resumeDataStore((state: ResumeDataStoreType) => state.userResumeData);
	const resetResumeUserData = resumeDataStore((state: ResumeDataStoreType) => state.resetResumeUserData);
	const selectedTemplate = resumeDataStore((state: ResumeDataStoreType) => state.selectedTemplate);
	const setSelectedTemplate = resumeDataStore((state: ResumeDataStoreType) => state.setSelectedTemplate);
	const navigationState = resumeDataStore((state: ResumeDataStoreType) => state.navigationState);
	const setNavigationState = resumeDataStore((state: ResumeDataStoreType) => state.setNavigationState);

	// Fallback: If store doesn't have template, try to get it from URL params
	useEffect(() => {
		if (!selectedTemplate) {
			const templateFromUrl = searchParams.get('template');
			if (templateFromUrl) {
				console.log('CreateResume - Setting template from URL param:', templateFromUrl);
				setSelectedTemplate(templateFromUrl);
			}
		}
	}, [selectedTemplate, searchParams, setSelectedTemplate]);

	const hasUnsavedChanges = Object.values(userResumeData).some(
		value => value !== '' && value !== null && value !== undefined
	);

	const resetResumeProccess = useCallback(() => {
		resetResumeUserData();
		setNavigationState(NavigationStateEnum.TEMPLATE_UPDATE);
	}, [resetResumeUserData, setNavigationState]);

	const { showExitDialog, confirmExit, cancelExit, attemptNavigation } = useNavigationGuard({
		hasUnsavedChanges,
		onConfirmExit: resetResumeProccess
	});

	const { styles, compiledTemplate, downloadPDF, isDownloading, isLoading } = useCreatePDF({
		userResumeData,
		setSelectedTemplate,
		selectedTemplate,
		useHandlebars: true
	});

	const onTemplateDownload = useCallback(() => {
		setNavigationState(NavigationStateEnum.TEMPLATE_DOWNLOAD);
	}, []);

	const NavigationStateComponent = useMemo(() => {
		if (isLoading) {
			return <TemplateUpdateSkeleton />;
		}
		if (navigationState === NavigationStateEnum.TEMPLATE_UPDATE) {
			return (
				<TemplateUpdate
					totalOffset={TOTAL_OFFSET}
					styles={styles}
					compiledTemplate={compiledTemplate}
					onTemplateDownload={onTemplateDownload}
				/>
			);
		}
		if (navigationState === NavigationStateEnum.TEMPLATE_DOWNLOAD) {
			return (
				<TemplateDownload
					templateId={selectedTemplate}
					initialValues={userResumeData}
					onDownloadPDF={downloadPDF}
					isDownloading={isDownloading}
				/>
			);
		}
		return null;
	}, [
		navigationState,
		isLoading,
		styles,
		selectedTemplate,
		onTemplateDownload,
		userResumeData,
		downloadPDF,
		isDownloading
	]);

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
			{NavigationStateComponent}
		</div>
	);
}
