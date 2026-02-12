'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/ui/components/button';
import { DownloadIcon, CheckIcon, LockIcon, GoogleIcon } from '@/ui/icons';
import { ProgressBar, TemplatePreviewer } from '@/ui/components';
import { TemplateDataType } from '@/types/payload-types';
import { useWindowSize } from '@/hooks/useWindowSize';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { googleSignIn } from '@/app/server-actions/session';

export type TemplateDownloadProps = {
	onDownloadPDF?: () => void;
	isDownloadEnabled?: boolean;
	isDownloading?: boolean;
	completionPercentage: number;
	userResumeData: TemplateDataType;
	compiledTemplate: (userData: TemplateDataType) => string;
	styles: string;
	isAuthenticated: boolean;
};

export const TemplateDownload = ({
	onDownloadPDF,
	isDownloading = false,
	completionPercentage,
	userResumeData,
	compiledTemplate,
	styles,
	isAuthenticated
}: TemplateDownloadProps) => {
	const { width } = useWindowSize();
	const [isLargeScreen, setIsLargeScreen] = useState(false);
	const $t = useTranslations('TemplateDownload');
	const pathname = usePathname();

	useEffect(() => {
		setIsLargeScreen(width >= 1024);
	}, [width]);

	const DownloadButtonSection = useMemo(() => {
		if (!isAuthenticated) {
			return (
				<div className="mt-4">
					<div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6 text-center space-y-4">
						<div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30">
							<LockIcon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
						</div>
						<h4 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
							{$t('signInRequired')}
						</h4>
						<p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
							{$t('signInDescription')}
						</p>
						<form action={() => googleSignIn(pathname)}>
							<Button
								type="submit"
								variant="default"
								className="inline-flex items-center gap-3 px-8 py-3 text-base font-semibold text-white shadow-lg hover:shadow-xl rounded-xl transition-all duration-300"
							>
								<GoogleIcon className="w-5 h-5" />
								<span>{$t('signInButton')}</span>
							</Button>
						</form>
					</div>
				</div>
			);
		}

		return (
			<div className="sticky bottom-4 left-0 right-0 text-center space-y-6 mt-4">
				<Button
					variant="default"
					onClick={onDownloadPDF}
					disabled={isDownloading}
					className={`group relative inline-flex items-center gap-3 px-10 py-4 text-lg font-semibold transition-all duration-300 ${
						!isDownloading
							? 'text-white shadow-xl hover:shadow-2xl'
							: 'bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed shadow-md'
					} rounded-xl`}
				>
					{isDownloading ? (
						<>
							<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
							<span>{$t('generatingPDF')}</span>
						</>
					) : (
						<>
							<DownloadIcon className="w-6 h-6" />
							<span>{$t('button')}</span>
						</>
					)}
				</Button>
			</div>
		);
	}, [onDownloadPDF, isDownloading, isAuthenticated, pathname]);

	const AdditionalInformationSection = useMemo(() => {
		return (
			<div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 text-center mt-4">
				<div className="max-w-2xl mx-auto space-y-3">
					<h4 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
						{$t('additionalInformation.title')}
					</h4>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600 dark:text-slate-400">
						<div className="flex flex-col items-center gap-2">
							<div className="w-8 h-8 bg-blue-100 dark:bg-blue-800/50 rounded-lg flex items-center justify-center">
								<CheckIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
							</div>
							<span>{$t('additionalInformation.items.0')}</span>
						</div>
						<div className="flex flex-col items-center gap-2">
							<div className="w-8 h-8 bg-blue-100 dark:bg-blue-800/50 rounded-lg flex items-center justify-center">
								<CheckIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
							</div>
							<span>{$t('additionalInformation.items.1')}</span>
						</div>
						<div className="flex flex-col items-center gap-2">
							<div className="w-8 h-8 bg-blue-100 dark:bg-blue-800/50 rounded-lg flex items-center justify-center">
								<CheckIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
							</div>
							<span>{$t('additionalInformation.items.2')}</span>
						</div>
					</div>
					<p className="text-sm text-slate-500 dark:text-slate-400 pt-2">
						{$t('additionalInformation.description')}
					</p>
				</div>
			</div>
		);
	}, []);

	return (
		<div className="container mx-auto space-y-8 p-4">
			<div className="flex flex-col lg:flex-row gap-4 lg:h-[calc(100vh-115px)]">
				<div className="lg:w-1/2">
					{/* Header Section */}
					<div className="text-center space-y-4">
						<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted text-white shadow-lg">
							<DownloadIcon className="w-8 h-8" />
						</div>
						<div>
							<h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-3">
								{$t('title')}
							</h2>
						</div>
					</div>
					<ProgressBar
						title={$t('completionPercentage')}
						completionPercentage={completionPercentage}
						completedText={$t('completedText')}
						incompleteText={$t('incompleteText')}
					/>
					{isLargeScreen && AdditionalInformationSection}
					{isLargeScreen && DownloadButtonSection}
				</div>

				<TemplatePreviewer
					userData={userResumeData}
					templateStyles={styles}
					compiledTemplate={compiledTemplate}
				/>
			</div>

			{!isLargeScreen && AdditionalInformationSection}
			{!isLargeScreen && DownloadButtonSection}
		</div>
	);
};
