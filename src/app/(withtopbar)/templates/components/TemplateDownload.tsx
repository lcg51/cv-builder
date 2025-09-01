'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DownloadIcon, CheckCircleIcon, LockIcon } from '@/components/icons/FormIcons';
import { CheckIcon } from 'lucide-react';
import { TemplatePreviewer } from '@/components/ui';
import { UserDataType } from '@/app/models/user';
import { useWindowSize } from '@/hooks/useWindowSize';

export type TemplateDownloadProps = {
	onDownloadPDF?: () => void;
	isDownloadEnabled?: boolean;
	isDownloading?: boolean;
	completionPercentage: number;
	userResumeData: UserDataType;
	compiledTemplate: (userData: UserDataType) => string;
	styles: string;
};

export const TemplateDownload = ({
	onDownloadPDF,
	isDownloading = false,
	completionPercentage,
	userResumeData,
	compiledTemplate,
	styles
}: TemplateDownloadProps) => {
	const { width } = useWindowSize();
	const [isLargeScreen, setIsLargeScreen] = useState(false);

	useEffect(() => {
		setIsLargeScreen(width >= 1024);
	}, [width]);

	const DownloadButtonSection = useMemo(() => {
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
							<span>Generating PDF...</span>
						</>
					) : (
						<>
							<DownloadIcon className="w-6 h-6" />
							<span>Download PDF Resume</span>
						</>
					)}
				</Button>
			</div>
		);
	}, [onDownloadPDF, isDownloading]);

	const AdditionalInformationSection = useMemo(() => {
		return (
			<div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 text-center mt-4">
				<div className="max-w-2xl mx-auto space-y-3">
					<h4 className="text-lg font-semibold text-slate-700 dark:text-slate-300">What You&apos;ll Get</h4>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600 dark:text-slate-400">
						<div className="flex flex-col items-center gap-2">
							<div className="w-8 h-8 bg-blue-100 dark:bg-blue-800/50 rounded-lg flex items-center justify-center">
								<CheckIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
							</div>
							<span>High-quality PDF</span>
						</div>
						<div className="flex flex-col items-center gap-2">
							<div className="w-8 h-8 bg-blue-100 dark:bg-blue-800/50 rounded-lg flex items-center justify-center">
								<CheckIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
							</div>
							<span>Professional layout</span>
						</div>
						<div className="flex flex-col items-center gap-2">
							<div className="w-8 h-8 bg-blue-100 dark:bg-blue-800/50 rounded-lg flex items-center justify-center">
								<CheckIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
							</div>
							<span>Print-ready format</span>
						</div>
					</div>
					<p className="text-sm text-slate-500 dark:text-slate-400 pt-2">
						Your resume will be generated as a high-quality PDF file that you can use for job applications,
						professional networking, and career advancement.
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
								Download Your Resume
							</h2>
						</div>
					</div>
					{/* Progress Indicator */}
					<div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 mt-4">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
								Resume Completion
							</h3>
							<span className="text-2xl font-bold text-muted">{completionPercentage}%</span>
						</div>
						<div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 mb-4">
							<div
								className="bg-muted h-3 rounded-full transition-all duration-500 ease-out"
								style={{ width: `${completionPercentage}%` }}
							></div>
						</div>
						<div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
							{completionPercentage === 100 ? (
								<>
									<CheckCircleIcon className="w-5 h-5 text-green-500" />
									<span className="text-green-600 dark:text-green-400 font-medium">
										All sections completed!
									</span>
								</>
							) : (
								<>
									<LockIcon className="w-5 h-5 text-amber-500" />
									<span>Complete all sections to enable download</span>
								</>
							)}
						</div>
					</div>
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
