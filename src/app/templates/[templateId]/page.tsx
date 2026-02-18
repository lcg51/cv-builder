'use client';
import React, { useCallback, useMemo } from 'react';
import { resumeDataStore, ResumeDataStoreType } from '@/app/store/resume';
import { useNavigationGuardProvider } from '@/hooks/useNavigationGuardProvider';
import { TemplateUpdate } from '../components/TemplateUpdate';
import { useSelectedTemplate } from '@/hooks/useSelectedTemplate';
import { useParams, useRouter } from 'next/navigation';
import { DisplayErrorMessage } from '@/app/components/DisplayErrorMessage';

export default function CreateTemplate() {
	const params = useParams();
	const { push } = useRouter();
	const templateID = params.templateId as string;
	const { resetResumeUserData } = resumeDataStore((state: ResumeDataStoreType) => state);

	useNavigationGuardProvider({
		hasUnsavedChanges: true,
		onConfirmExit: resetResumeUserData
	});

	const { styles, compiledTemplate, isCompiling, selectedTemplate, templateError } = useSelectedTemplate({
		templateId: templateID
	});

	const onTemplateDownload = useCallback(() => {
		push(`/templates/${selectedTemplate?.id}/confirm`);
	}, [push, selectedTemplate]);

	const templateIsLoading = isCompiling || (!selectedTemplate && !templateError);

	const NavigationStateComponent = useMemo(() => {
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
				isLoading={templateIsLoading}
			/>
		);
	}, [selectedTemplate, templateIsLoading, styles, onTemplateDownload, compiledTemplate, templateError]);

	return (
		<div
			className={`bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 md:min-h-[calc(100vh-60px)]`}
		>
			{NavigationStateComponent}
		</div>
	);
}
