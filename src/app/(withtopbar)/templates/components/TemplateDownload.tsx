'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { DownloadIcon, CheckCircleIcon, LockIcon } from '@/components/icons/FormIcons';
import { CheckIcon } from 'lucide-react';
import { UserDataType } from '@/app/models/user';

export type TemplateDownloadProps = {
	onDownloadPDF?: () => void;
	isDownloadEnabled?: boolean;
	isDownloading?: boolean;
	initialValues?: UserDataType;
};

export const TemplateDownload = ({ onDownloadPDF, isDownloading = false, initialValues }: TemplateDownloadProps) => {
	// Calculate completion percentage
	const calculateCompletion = () => {
		if (!initialValues) return 0;
		let completed = 0;
		const total = 7; // firstName, lastName, email, workExperience, education, skills, aboutMe

		if (initialValues.firstName) completed++;
		if (initialValues.lastName) completed++;
		if (initialValues.email) completed++;
		if (initialValues.workExperience?.length > 0) completed++;
		if (initialValues.education?.length > 0) completed++;
		if (initialValues.skills?.length > 0) completed++;
		if (initialValues.aboutMe) completed++;

		return Math.round((completed / total) * 100);
	};

	const completionPercentage = calculateCompletion();

	return (
		<div className="max-w-4xl mx-auto space-y-8 p-4">
			{/* Header Section */}
			<div className="text-center space-y-4">
				<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted text-white shadow-lg">
					<DownloadIcon className="w-8 h-8" />
				</div>
				<div>
					<h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-3">Download Your Resume</h2>
					<p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
						Review your information and download your professional resume in high-quality PDF format
					</p>
				</div>
			</div>

			{/* Progress Indicator */}
			<div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Resume Completion</h3>
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

			{/* Additional Information */}
			<div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 text-center">
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

			{/* Download Button Section */}
			<div className="sticky bottom-0 left-0 right-0 md:relative text-center space-y-6">
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

				{/* {
					<div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 max-w-md mx-auto">
						<div className="flex items-center gap-3 text-amber-700 dark:text-amber-300">
							<LockIcon className="w-5 h-5 text-amber-500" />
							<p className="text-sm font-medium">
								Please complete all required information to enable download
							</p>
						</div>
					</div>
				} */}
			</div>
		</div>
	);
};
