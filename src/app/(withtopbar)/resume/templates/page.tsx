'use client';
import { useCallback, useMemo } from 'react';
import { TemplateSkeleton } from '../components/TemplateSkeleton';
import { TemplateSelection } from '../components/TemplateSelection';
import { resumeDataStore, ResumeDataStoreType } from '@/app/store/resume';
import { useRouter } from 'next/navigation';
import { useTemplates } from '@/hooks/useTemplates';
import { DisplayErrorMessage } from '@/app/components/DisplayErrorMessage';
import { RefreshCwIcon } from 'lucide-react';

export default function Templates() {
	const { push } = useRouter();
	const setSelectedTemplate = resumeDataStore((state: ResumeDataStoreType) => state.setSelectedTemplate);

	const {
		templates,
		loading: isLoading,
		error,
		searchTemplatesByQuery,
		loadTemplatesByCategory,
		resetToAllTemplates,
		clearError
	} = useTemplates();

	const handleTemplateSelect = useCallback(
		async (templateId: string) => {
			setSelectedTemplate(templateId);

			await new Promise(resolve => setTimeout(resolve, 100));
			push(`/resume/create?template=${templateId}`);
		},
		[setSelectedTemplate, push]
	);

	const handleRetry = () => {
		clearError();
		resetToAllTemplates();
	};

	const NavigationStateComponent = useMemo(() => {
		if (isLoading) {
			return <TemplateSkeleton />;
		}
		if (error) {
			return (
				<DisplayErrorMessage
					errorMsg={error}
					onClickCallback={handleRetry}
					errorTitle="Oops! Something went wrong"
					errorButtonText="Try Again"
					errorIcon={<RefreshCwIcon className="w-5 h-5 mr-2" />}
				/>
			);
		}
		return (
			<TemplateSelection
				onTemplateSelect={handleTemplateSelect}
				templates={templates}
				searchTemplatesByQuery={searchTemplatesByQuery}
				resetToAllTemplates={resetToAllTemplates}
				loadTemplatesByCategory={loadTemplatesByCategory}
			/>
		);
	}, [isLoading, templates, searchTemplatesByQuery, resetToAllTemplates, loadTemplatesByCategory]);

	return (
		<div
			className={`flex justify-center items-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 lg:min-h-[calc(100vh-60px)] xl:min-h-[calc(100vh-60px)]`}
		>
			{NavigationStateComponent}
		</div>
	);
}
