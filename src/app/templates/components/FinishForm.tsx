'use client';

import React from 'react';
import { CheckCircleIcon } from '@/ui/icons/FormIcons';
import { useTranslations } from 'next-intl';

export const FinishForm = () => {
	const $t = useTranslations('FinishForm');

	return (
		<div>
			<div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 border border-green-200 dark:border-green-800 rounded-xl shadow-lg p-6">
				<div className="flex items-start gap-4">
					<div className="flex-shrink-0">
						<div className="w-12 h-12 bg-green-100 dark:bg-green-800/50 rounded-lg flex items-center justify-center">
							<CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
						</div>
					</div>
					<div className="flex-1">
						<h4 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-3">{$t('title')}</h4>
						<p className="text-green-700 dark:text-green-300 leading-relaxed">{$t('description')}</p>
					</div>
				</div>
			</div>
		</div>
	);
};
