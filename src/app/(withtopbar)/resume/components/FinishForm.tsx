'use client';

import React from 'react';
import { StepsBarComponentProps } from '@/app/components/StepsBar/StepsBar';
import { Button } from '@/components/ui/button';
import { CheckCircleIcon } from '@/components/icons/FormIcons';

export type FinishFormProps = StepsBarComponentProps & {
	onSuccess?: () => void;
};

export const FinishForm = ({ onSuccess }: FinishFormProps) => {
	return (
		<div>
			<div className="mb-6">
				<div className="flex items-center gap-3 mb-3">
					<div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-500 text-white">
						<CheckCircleIcon />
					</div>
					<div>
						<h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-1">
							Ready to Download!
						</h3>
						<p className="text-slate-600 dark:text-slate-400">
							All sections have been filled out successfully. Your resume is complete and can be
							downloaded in the next step.
						</p>
					</div>
				</div>
			</div>

			<div className="flex justify-center gap-4">
				<Button
					variant="default"
					onClick={onSuccess}
					className="inline-flex items-center gap-2 px-8 py-3 text-lg font-medium"
				>
					Next to Download
				</Button>
			</div>
		</div>
	);
};
