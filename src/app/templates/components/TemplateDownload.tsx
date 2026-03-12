'use client';

import React from 'react';
import { TemplatePreviewer } from '@/ui/components';
import { ProgressBarWithSkeleton } from '@/ui/components/molecules/progress-bar/ProgressBar';
import { TemplateDataType } from '@/types/payload-types';
import { useTranslations } from 'next-intl';
import { SuccessBannerWithSkeleton } from './SuccessBanner';
import { AdditionalInformationWithSkeleton } from './AdditionalInformation';
import { DownloadSectionWithSkeleton } from './DownloadSection';

export type TemplateDownloadProps = {
	onDownloadPDF?: () => void;
	isDownloading?: boolean;
	completionPercentage: number;
	userResumeData: TemplateDataType;
	compiledTemplate: (userData: TemplateDataType) => string;
	styles: string;
	isAuthenticated: boolean;
	isLoading?: boolean;
};

export const TemplateDownload = ({
	onDownloadPDF,
	isDownloading = false,
	completionPercentage,
	userResumeData,
	compiledTemplate,
	styles,
	isAuthenticated,
	isLoading
}: TemplateDownloadProps) => {
	const $t = useTranslations('TemplateDownload');

	const showAdditionalInfoContent = isAuthenticated;

	return (
		<div className="container mx-auto p-4">
			<div className="flex flex-col lg:flex-row gap-6 lg:h-[calc(100vh-115px)]">
				{/* Left Column: Info sections */}
				<div className="lg:w-1/2 lg:overflow-y-auto space-y-6">
					{/* Success Banner */}
					<SuccessBannerWithSkeleton isLoading={isLoading} />

					{/* Progress Bar */}
					<ProgressBarWithSkeleton
						isLoading={isLoading}
						title={$t('completionPercentage')}
						completionPercentage={completionPercentage}
						completedText={$t('completedText')}
						incompleteText={$t('incompleteText')}
					/>

					{/* Additional Information (authenticated users only) */}
					{showAdditionalInfoContent && <AdditionalInformationWithSkeleton isLoading={isLoading} />}

					{/* Download / Sign-in Section */}
					<DownloadSectionWithSkeleton
						isLoading={isLoading}
						isAuthenticated={isAuthenticated}
						onDownloadPDF={onDownloadPDF}
						isDownloading={isDownloading}
					/>
				</div>

				{/* Right Column: Template Preview */}
				<div className="lg:w-1/2">
					<TemplatePreviewer
						userData={userResumeData}
						templateStyles={styles}
						compiledTemplate={compiledTemplate}
						isLoading={isLoading}
					/>
				</div>
			</div>
		</div>
	);
};
