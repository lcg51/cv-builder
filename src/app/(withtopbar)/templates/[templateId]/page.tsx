'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { resumeDataStore, ResumeDataStoreType } from '@/app/store/resume';
import { useNavigationGuard } from '@/hooks/useNavigationGuard';
import { ModalDisclaimer } from '@/app/components/ModalDisclaimer';
import { TemplateUpdate } from '../components/TemplateUpdate';
import { TemplateUpdateSkeleton } from '../components/TemplateUpdateSkeleton';
import { useCreatePDF } from '@/hooks/useCreatePDF';
import { useParams, useRouter } from 'next/navigation';
import { getTemplate, Template } from '@/templates';
import { DisplayErrorMessage } from '@/app/components/DisplayErrorMessage';

export default function CreateTemplate() {
	const params = useParams();
	const { push } = useRouter();
	const userResumeData = resumeDataStore((state: ResumeDataStoreType) => state.userResumeData);
	const resetResumeUserData = resumeDataStore((state: ResumeDataStoreType) => state.resetResumeUserData);
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

	const resetResumeProccess = useCallback(() => {
		resetResumeUserData();
	}, [resetResumeUserData]);

	const { showExitDialog, confirmExit, cancelExit, attemptNavigation } = useNavigationGuard({
		hasUnsavedChanges: true,
		onConfirmExit: resetResumeProccess
	});

	const { styles, compiledTemplate, downloadPDF, isDownloading, isLoading } = useCreatePDF({
		userResumeData,
		selectedTemplate: template,
		useHandlebars: true
	});

	const onTemplateDownload = useCallback(() => {
		push(`/templates/${template?.id}/confirm`);
	}, [push, template]);

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

		return (
			<TemplateUpdate
				styles={styles}
				compiledTemplate={compiledTemplate}
				onTemplateDownload={onTemplateDownload}
			/>
		);
	}, [
		template,
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
			className={`bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 md:min-h-[calc(100vh-60px)]`}
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
