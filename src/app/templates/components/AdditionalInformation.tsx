'use client';

import React from 'react';
import { CheckIcon } from '@/ui/icons';
import { useTranslations } from 'next-intl';
import { withSkeleton } from '@/ui/components/withSkeleton';
import { AdditionalInformationSkeleton } from './AdditionalInformationSkeleton';

export type AdditionalInformationProps = Record<never, never>;

export const AdditionalInformation: React.FC<AdditionalInformationProps> = () => {
	const $t = useTranslations('TemplateDownload');

	return (
		<div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 sm:p-6 text-center">
			<div className="max-w-2xl mx-auto space-y-3">
				<h4 className="text-base sm:text-lg font-semibold text-slate-700 dark:text-slate-300">
					{$t('additionalInformation.title')}
				</h4>
				<div className="grid grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
					{([0, 1, 2] as const).map(i => (
						<div key={i} className="flex flex-col items-center gap-2">
							<div className="w-8 h-8 bg-blue-100 dark:bg-blue-800/50 rounded-lg flex items-center justify-center">
								<CheckIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
							</div>
							<span>{$t(`additionalInformation.items.${i}`)}</span>
						</div>
					))}
				</div>
				<p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 pt-2">
					{$t('additionalInformation.description')}
				</p>
			</div>
		</div>
	);
};

export const AdditionalInformationWithSkeleton = withSkeleton(AdditionalInformation, AdditionalInformationSkeleton);
