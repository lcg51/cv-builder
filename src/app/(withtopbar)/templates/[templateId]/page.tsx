'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { NavigationStateEnum, resumeDataStore, ResumeDataStoreType } from '@/app/store/resume';
import { useNavigationGuard } from '@/hooks/useNavigationGuard';
import { ModalDisclaimer } from '@/app/components/ModalDisclaimer';
import { TemplateUpdate } from '../components/TemplateUpdate';
import { TemplateUpdateSkeleton } from '../components/TemplateUpdateSkeleton';
import { TemplateDownload } from '../components/TemplateDownload';
import { useCreatePDF } from '@/hooks/useCreatePDF';
import { useParams, useRouter } from 'next/navigation';
import { getTemplate, Template } from '@/templates';
import { DisplayErrorMessage } from '@/app/components/DisplayErrorMessage';

const TOPBAR_HEIGHT = 60;
const CONTAINER_PADDING = 32; // 2rem = 32px (p-4 lg:p-6)
const TOTAL_OFFSET = TOPBAR_HEIGHT + 2 * CONTAINER_PADDING;

export default function CreateTemplate() {
	const params = useParams();
	const { push } = useRouter();
	const userResumeData = resumeDataStore((state: ResumeDataStoreType) => state.userResumeData);
	const resetResumeUserData = resumeDataStore((state: ResumeDataStoreType) => state.resetResumeUserData);
	const navigationState = resumeDataStore((state: ResumeDataStoreType) => state.navigationState);
	const setNavigationState = resumeDataStore((state: ResumeDataStoreType) => state.setNavigationState);
	const [template, setTemplate] = useState<Template | null>(null);
	const [templateError, setTemplateError] = useState<string | null>(null);

	useEffect(() => {
		const templateID = params.templateId as string;

		if (!templateID) {
			setTemplateError('No template specified');
			return;
		}

		const foundTemplate = getTemplate(templateID);
		if (foundTemplate) {
			setTemplate(foundTemplate);
			setTemplateError(null);
		} else {
			setTemplateError(`Template "${templateID}" not found`);
		}
	}, [params]);

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
		selectedTemplate: template,
		useHandlebars: true
	});

	const onTemplateDownload = useCallback(() => {
		setNavigationState(NavigationStateEnum.TEMPLATE_DOWNLOAD);
	}, []);

	const NavigationStateComponent = useMemo(() => {
		if (isLoading || (!template && !templateError)) {
			return <TemplateUpdateSkeleton />;
		}
		if (templateError) {
			return (
				<DisplayErrorMessage
					errorMsg={templateError}
					onClickCallback={() => push('/templates')}
					errorTitle="Template Not Found"
					errorButtonText="Choose a Template"
				/>
			);
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
					templateId={template?.id}
					initialValues={userResumeData}
					onDownloadPDF={downloadPDF}
					isDownloading={isDownloading}
				/>
			);
		}
		return null;
	}, [
		template,
		navigationState,
		isLoading,
		styles,
		template,
		onTemplateDownload,
		userResumeData,
		downloadPDF,
		isDownloading,
		templateError
	]);

	return (
		<div
			className={`flex justify-center items-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 min-h-[calc(100vh-60px)]`}
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
