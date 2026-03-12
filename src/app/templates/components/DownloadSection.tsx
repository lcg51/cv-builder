'use client';

import React from 'react';
import { Button } from '@/ui/components/button';
import { DownloadIcon, LockIconCustom } from '@/ui/icons';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import LoginForm from '@/app/login/components/LoginForm';
import { withSkeleton } from '@/ui/components/withSkeleton';
import { DownloadSectionSkeleton } from './DownloadSectionSkeleton';

export type DownloadSectionProps = {
	isAuthenticated: boolean;
	onDownloadPDF?: () => void;
	isDownloading?: boolean;
};

export const DownloadSection: React.FC<DownloadSectionProps> = ({
	isAuthenticated,
	onDownloadPDF,
	isDownloading = false
}) => {
	const $t = useTranslations('TemplateDownload');
	const pathname = usePathname();

	if (!isAuthenticated) {
		return (
			<div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-b border-slate-200 dark:border-slate-700 px-4 sm:px-6 py-4 flex items-center gap-3">
					<div className="flex-shrink-0 w-9 h-9 bg-blue-100 dark:bg-blue-800/50 rounded-lg flex items-center justify-center">
						<LockIconCustom className="w-4 h-4 text-blue-600 dark:text-blue-400" />
					</div>
					<div>
						<h4 className="text-base font-semibold text-slate-800 dark:text-slate-200">
							{$t('signInDescription')}
						</h4>
						<p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{$t('signInSubtitle')}</p>
					</div>
				</div>
				<div className="px-4 sm:px-6 py-4">
					<LoginForm redirectTo={pathname} showHeader={false} dividerBgClass="bg-white dark:bg-slate-800" />
				</div>
			</div>
		);
	}

	return (
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
	);
};

export const DownloadSectionWithSkeleton = withSkeleton(DownloadSection, DownloadSectionSkeleton);
