'use client';
import { TemplateSelection } from './components/TemplateSelection';
import { useTemplates } from '@/app/templates/hooks/useTemplates';

export default function Templates() {
	const {
		templates,
		loading: isLoading,
		error,
		searchTemplatesByQuery,
		loadTemplatesByCategory,
		resetToAllTemplates
	} = useTemplates();

	if (error) throw new Error(error);

	return (
		<div className="w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 lg:min-h-[calc(100vh-60px)] xl:min-h-[calc(100vh-60px)]">
			<TemplateSelection
				templates={templates}
				isLoading={isLoading}
				searchTemplatesByQuery={searchTemplatesByQuery}
				resetToAllTemplates={resetToAllTemplates}
				loadTemplatesByCategory={loadTemplatesByCategory}
			/>
		</div>
	);
}
