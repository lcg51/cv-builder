'use client';

import React from 'react';
import { CheckCircle } from '@/ui/icons';
import { useTranslations } from 'next-intl';
import { withSkeleton } from '@/ui/components/withSkeleton';
import { SuccessBannerSkeleton } from './SuccessBannerSkeleton';

export type SuccessBannerProps = Record<never, never>;

export const SuccessBanner: React.FC<SuccessBannerProps> = () => {
	const $t = useTranslations('TemplateDownload');

	return (
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
	);
};

export const SuccessBannerWithSkeleton = withSkeleton(SuccessBanner, SuccessBannerSkeleton);
