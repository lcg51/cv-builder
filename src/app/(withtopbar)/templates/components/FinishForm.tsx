'use client';

import React from 'react';
import { CheckCircleIcon } from '@/components/icons/FormIcons';
import type { StepsBarComponentProps } from '@/components/ui/StepsBar/StepsBar';

export type FinishFormProps = StepsBarComponentProps;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const FinishForm = (_props: FinishFormProps) => {
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
						<h4 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-3">
							Ready to Download! 🎉
						</h4>
						<p className="text-green-700 dark:text-green-300 leading-relaxed">
							Congratulations! Your resume has been completed successfully. Click the next button below to
							go to download your professional PDF resume that&apos;s ready for job applications and
							career advancement.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};
