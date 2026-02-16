'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { resumeDataStore, ResumeDataStoreType } from '@/app/store/resume';
import { useNavigationGuardProvider } from '@/hooks/useNavigationGuardProvider';
import { TemplateUpdate } from '../components/TemplateUpdate';
import { TemplateUpdateSkeleton } from '../components/TemplateUpdateSkeleton';
import { useCreatePDF } from '@/hooks/useCreatePDF';
import { useParams, useRouter } from 'next/navigation';
import { fetchTemplateById, Template } from '@/templates';
import { DisplayErrorMessage } from '@/app/components/DisplayErrorMessage';

export default function CreateTemplate() {
	const params = useParams();
	const { push } = useRouter();
	const templateID = params.templateId as string;
	const { userResumeData, resetResumeUserData } = resumeDataStore((state: ResumeDataStoreType) => state);
	const [template, setTemplate] = useState<Template | null>(null);
	const [templateError, setTemplateError] = useState<string | null>(null);

	useEffect(() => {
		if (!templateID) {
			setTemplateError('No template specified');
			return;
		}

		let cancelled = false;
		fetchTemplateById(templateID).then(foundTemplate => {
			if (cancelled) return;
			if (!foundTemplate) {
				setTemplateError(`Template "${templateID}" not found`);
				return;
			}
			setTemplate(foundTemplate);
			setTemplateError(null);
		});
		return () => {
			cancelled = true;
		};
	}, [templateID]);

	useNavigationGuardProvider({
		hasUnsavedChanges: true,
		onConfirmExit: resetResumeUserData
	});

	const { styles, compiledTemplate, downloadPDF, isDownloading, isLoading } = useCreatePDF({
		userResumeData,
		selectedTemplate: template
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
	}, [template, isLoading, styles, onTemplateDownload, downloadPDF, isDownloading, templateError]);

	return (
		<div
			className={`bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 md:min-h-[calc(100vh-60px)]`}
		>
			{NavigationStateComponent}
		</div>
	);
}
