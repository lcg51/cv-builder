'use client';
import { useRouter } from 'next/navigation';
import { TemplateDownload } from '../../components/TemplateDownload';
import { ConfirmPageSkeleton } from '../../components/ConfirmPageSkeleton';
import { useCreatePDF } from '@/hooks/useCreatePDF';
import { resumeDataStore, ResumeDataStoreType } from '@/app/store/resume';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchTemplateById, Template } from '@/templates';
import { useNavigationGuardProvider } from '@/hooks/useNavigationGuardProvider';
import { useStoreHydration } from '@/hooks/useStoreHydration';
import { useParams } from 'next/navigation';

type ConfirmPageClientProps = {
	isAuthenticated: boolean;
};

export default function ConfirmPageClient({ isAuthenticated }: ConfirmPageClientProps) {
	const { replace } = useRouter();
	const params = useParams();
	const templateIdFromUrl = params.templateId as string;
	const { isLoading } = useStoreHydration();
	const {
		userResumeData,
		selectedTemplate: selectedTemplateId,
		resetResumeUserData
	} = resumeDataStore((state: ResumeDataStoreType) => state);

	const calculateCompletion = () => {
		if (!userResumeData) return 0;
		let completed = 0;
		const total = 7;

		if (userResumeData.firstName) completed++;
		if (userResumeData.lastName) completed++;
		if (userResumeData.email) completed++;
		if (userResumeData.workExperience?.length > 0) completed++;
		if (userResumeData.education?.length > 0) completed++;
		if (userResumeData.skills?.length > 0) completed++;
		if (userResumeData.aboutMe) completed++;

		return Math.round((completed / total) * 100);
	};

	const [template, setTemplate] = useState<Template | null>(null);

	const resetResumeProccess = useCallback(() => {
		replace('/templates');
		resetResumeUserData();
	}, [replace, resetResumeUserData]);

	useEffect(() => {
		if (isLoading) {
			return;
		}

		if (!selectedTemplateId || selectedTemplateId !== templateIdFromUrl) {
			resetResumeProccess();
			return;
		}

		let cancelled = false;
		fetchTemplateById(selectedTemplateId).then(foundTemplate => {
			if (cancelled) return;
			if (!foundTemplate) {
				resetResumeProccess();
				return;
			}
			setTemplate(foundTemplate);
		});
		return () => {
			cancelled = true;
		};
	}, [selectedTemplateId, templateIdFromUrl, isLoading, resetResumeProccess]);

	useNavigationGuardProvider({
		hasUnsavedChanges: true,
		onConfirmExit: resetResumeUserData
	});

	const { downloadPDF, isDownloading, styles, compiledTemplate } = useCreatePDF({
		userResumeData,
		selectedTemplate: template
	});

	const NavigationStateComponent = useMemo(() => {
		if (!template || isLoading) {
			return <ConfirmPageSkeleton />;
		}

		return (
			<TemplateDownload
				completionPercentage={calculateCompletion()}
				onDownloadPDF={downloadPDF}
				isDownloading={isDownloading}
				userResumeData={userResumeData}
				compiledTemplate={compiledTemplate ?? (() => '')}
				styles={styles}
				isAuthenticated={isAuthenticated}
			/>
		);
	}, [template, isLoading, styles, downloadPDF, isDownloading, userResumeData, isAuthenticated]);

	return (
		<div
			className={`bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 md:min-h-[calc(100vh-60px)]`}
		>
			{NavigationStateComponent}
		</div>
	);
}
