'use client';

import React from 'react';
import { StepsBarComponentProps } from '@/app/components/StepsBar/StepsBar';
import { Button } from '@/components/ui/button';
import { DownloadIcon, CheckCircleIcon } from '@/components/icons/FormIcons';

export type FinishFormProps = StepsBarComponentProps & {
	onDownloadPDF?: () => void;
	isDownloadEnabled?: boolean;
};

export const FinishForm = ({ onDownloadPDF, isDownloadEnabled = false, initialValues }: FinishFormProps) => {
	// Check if all required data is filled
	const isDataComplete =
		initialValues &&
		initialValues.firstName &&
		initialValues.lastName &&
		initialValues.email &&
		initialValues.workExperience?.length > 0 &&
		initialValues.education?.length > 0 &&
		initialValues.skills?.length > 0 &&
		initialValues.aboutMe;

	const canDownload = isDownloadEnabled && isDataComplete;
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
							Your resume is complete and ready to download as a PDF
						</p>
					</div>
				</div>
			</div>

			<div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-6">
				<div className="flex items-start gap-3">
					<CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400 mt-0.5" />
					<div>
						<h4 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
							Resume Complete!
						</h4>
						<p className="text-green-700 dark:text-green-300">
							All sections have been filled out successfully. You can now download your professional
							resume as a PDF file.
						</p>
					</div>
				</div>
			</div>

			<div className="flex justify-center">
				<Button
					onClick={onDownloadPDF}
					disabled={!canDownload}
					className={`inline-flex items-center gap-2 px-8 py-3 text-lg font-medium transition-all duration-200 ${
						canDownload
							? 'text-white shadow-lg hover:shadow-xl'
							: 'bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed'
					}`}
				>
					<DownloadIcon />
					Download PDF Resume
				</Button>
			</div>

			{!canDownload && (
				<div className="mt-4 text-center">
					<p className="text-sm text-slate-500 dark:text-slate-400">
						{!isDownloadEnabled
							? 'Please complete all previous steps to enable download'
							: 'Please fill in all required information to enable download'}
					</p>
				</div>
			)}
		</div>
	);
};
