'use client';
import { useMemo } from 'react';
import { TemplateSelection } from './components/TemplateSelection';
import { useTemplates } from '@/app/templates/hooks/useTemplates';
import { DisplayErrorMessage } from '@/app/components/DisplayErrorMessage';
import { RefreshCwIcon } from '@/ui/icons';

export default function Templates() {
	const {
		templates,
		loading: isLoading,
		error,
		searchTemplatesByQuery,
		loadTemplatesByCategory,
		resetToAllTemplates,
		clearError
	} = useTemplates();

	const handleRetry = () => {
		clearError();
		resetToAllTemplates();
	};

	const NavigationStateComponent = useMemo(() => {
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
				templates={templates}
				isLoading={isLoading}
				searchTemplatesByQuery={searchTemplatesByQuery}
				resetToAllTemplates={resetToAllTemplates}
				loadTemplatesByCategory={loadTemplatesByCategory}
			/>
		);
	}, [isLoading, error, templates, searchTemplatesByQuery, resetToAllTemplates, loadTemplatesByCategory]);

	return (
		<div className="w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 lg:min-h-[calc(100vh-60px)] xl:min-h-[calc(100vh-60px)]">
			{NavigationStateComponent}
		</div>
	);
}
