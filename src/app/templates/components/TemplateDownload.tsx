'use client';

import React from 'react';
import { Button } from '@/ui/components/button';
import { DownloadIcon, CheckIcon, CheckCircle, LockIconCustom } from '@/ui/icons';
import { ProgressBar, TemplatePreviewer } from '@/ui/components';
import { TemplateDataType } from '@/types/payload-types';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import LoginForm from '@/app/login/components/LoginForm';
import { TemplateDownloadSkeleton } from './TemplateDownloadSkeleton';

export type TemplateDownloadProps = {
	onDownloadPDF?: () => void;
	isDownloadEnabled?: boolean;
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
	const pathname = usePathname();

	return (
		<div className="container mx-auto p-4">
			<div className="flex flex-col lg:flex-row gap-6 lg:h-[calc(100vh-115px)]">
				{/* Left Column: Info sections */}
				<div className="lg:w-1/2 lg:overflow-y-auto space-y-6">
					{isLoading ? (
						<TemplateDownloadSkeleton />
					) : (
						<>
							{/* Success Banner */}
							<div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 border border-green-200 dark:border-green-800 rounded-xl shadow-lg p-4 sm:p-6">
								<div className="flex items-start gap-3 sm:gap-4">
									<div className="flex-shrink-0">
										<div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-800/50 rounded-lg flex items-center justify-center">
											<CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
										</div>
									</div>
									<div className="flex-1 min-w-0">
										<h4 className="text-lg sm:text-xl font-semibold text-green-800 dark:text-green-200 mb-2">
											{$t('successBanner.title')}
										</h4>
										<p className="text-sm sm:text-base text-green-700 dark:text-green-300 leading-relaxed">
											{$t('successBanner.description')}
										</p>
									</div>
								</div>
							</div>

							{/* Progress Bar */}
							<ProgressBar
								title={$t('completionPercentage')}
								completionPercentage={completionPercentage}
								completedText={$t('completedText')}
								incompleteText={$t('incompleteText')}
							/>

							{/* Additional Information */}
							{isAuthenticated && (
								<div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 sm:p-6 text-center">
									<div className="max-w-2xl mx-auto space-y-3">
										<h4 className="text-base sm:text-lg font-semibold text-slate-700 dark:text-slate-300">
											{$t('additionalInformation.title')}
										</h4>
										<div className="grid grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
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
										<p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 pt-2">
											{$t('additionalInformation.description')}
										</p>
									</div>
								</div>
							)}

							{/* Download / Sign-in Section */}
							{!isAuthenticated ? (
								<div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
									<div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-b border-slate-200 dark:border-slate-700 px-4 sm:px-6 py-4 flex items-center gap-3">
										<div className="flex-shrink-0 w-9 h-9 bg-blue-100 dark:bg-blue-800/50 rounded-lg flex items-center justify-center">
											<LockIconCustom className="w-4 h-4 text-blue-600 dark:text-blue-400" />
										</div>
										<div>
											<h4 className="text-base font-semibold text-slate-800 dark:text-slate-200">
												{$t('signInDescription')}
											</h4>
											<p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
												{$t('signInSubtitle')}
											</p>
										</div>
									</div>
									<div className="px-4 sm:px-6 py-4">
										<LoginForm
											redirectTo={pathname}
											showHeader={false}
											dividerBgClass="bg-white dark:bg-slate-800"
										/>
									</div>
								</div>
							) : (
								<div className="text-center py-2">
									<Button
										variant="default"
										onClick={onDownloadPDF}
										disabled={isDownloading}
										className={`group relative inline-flex items-center gap-3 px-8 py-3 sm:px-10 sm:py-4 text-base sm:text-lg font-semibold transition-all duration-300 ${
											!isDownloading
												? 'text-white shadow-xl hover:shadow-2xl'
												: 'bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed shadow-md'
										} rounded-xl`}
									>
										{isDownloading ? (
											<>
												<div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-white"></div>
												<span>{$t('generatingPDF')}</span>
											</>
										) : (
											<>
												<DownloadIcon className="w-5 h-5 sm:w-6 sm:h-6" />
												<span>{$t('button')}</span>
											</>
										)}
									</Button>
								</div>
							)}
						</>
					)}
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
