'use client';
import { useCallback, useEffect, useState } from 'react';
import { TemplateSkeleton } from '../components/TemplateSkeleton';
import { TemplateSelection } from '../components/TemplateSelection';
import { resumeDataStore, ResumeDataStoreType } from '@/app/store/resume';
import { useRouter } from 'next/navigation';

export default function Templates() {
	const { push } = useRouter();
	const setSelectedTemplate = resumeDataStore((state: ResumeDataStoreType) => state.setSelectedTemplate);
	const [isPageLoading, setIsPageLoading] = useState<boolean>(true);

	const handleTemplateSelect = useCallback(
		async (templateId: string) => {
			setSelectedTemplate(templateId);

			await new Promise(resolve => setTimeout(resolve, 100));
			push(`/resume/create?template=${templateId}`);
		},
		[setSelectedTemplate, push]
	);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsPageLoading(false);
		}, 200);

		return () => clearTimeout(timer);
	}, []);

	return (
		<div
			className={`bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 min-h-[calc(100vh-3.5rem)] lg:min-h-[calc(100vh-3.75rem)] xl:min-h-[calc(100vh-60px)]`}
		>
			{isPageLoading ? <TemplateSkeleton /> : <TemplateSelection onTemplateSelect={handleTemplateSelect} />}
		</div>
	);
}
