'use client';

import React from 'react';
import { StepsBarComponentProps } from '@/app/components/StepsBar/StepsBar';
import { Button } from '@/components/ui/button';
import { DownloadIcon, CheckCircleIcon, LockIcon } from '@/components/icons/FormIcons';
import { CheckIcon } from 'lucide-react';

export type TemplateDownloadProps = StepsBarComponentProps & {
	onDownloadPDF?: () => void;
	isDownloadEnabled?: boolean;
	isDownloading?: boolean;
	templateId?: string;
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
					<span className="text-2xl font-bold text-muted dark:text-blue-400">{completionPercentage}%</span>
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

			{/* Template Information Card */}
			{/* <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg p-6">
				<div className="flex items-start gap-4">
					<div className="flex-shrink-0">
						<div className="w-12 h-12 bg-blue-100 dark:bg-blue-800/50 rounded-lg flex items-center justify-center">
							<EyeIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
						</div>
					</div>
					<div className="flex-1 min-w-0">
						<h4 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-4">
							Template Details
						</h4>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-3">
								<div className="flex items-center gap-3">
									<div className="w-2 h-2 bg-blue-400 rounded-full"></div>
									<span className="text-sm font-medium text-blue-700 dark:text-blue-300">
										Template:
									</span>
									<span className="text-sm text-blue-800 dark:text-blue-200 font-semibold">
										{templateId ? getTemplateName(templateId) : 'Professional Template'}
									</span>
								</div>
								<div className="flex items-center gap-3">
									<div className="w-2 h-2 bg-blue-400 rounded-full"></div>
									<span className="text-sm font-medium text-blue-700 dark:text-blue-300">Name:</span>
									<span className="text-sm text-blue-800 dark:text-blue-200 font-semibold">
										{initialValues?.firstName} {initialValues?.lastName}
									</span>
								</div>
								<div className="flex items-center gap-3">
									<div className="w-2 h-2 bg-blue-400 rounded-full"></div>
									<span className="text-sm font-medium text-blue-700 dark:text-blue-300">Email:</span>
									<span className="text-sm text-blue-800 dark:text-blue-200 font-semibold">
										{initialValues?.email}
									</span>
								</div>
							</div>
							<div className="space-y-3">
								<div className="flex items-center gap-3">
									<div className="w-2 h-2 bg-blue-400 rounded-full"></div>
									<span className="text-sm font-medium text-blue-700 dark:text-blue-300">
										Experience:
									</span>
									<span className="text-sm text-blue-800 dark:text-blue-200 font-semibold">
										{initialValues?.workExperience?.length || 0} position(s)
									</span>
								</div>
								<div className="flex items-center gap-3">
									<div className="w-2 h-2 bg-blue-400 rounded-full"></div>
									<span className="text-sm font-medium text-blue-700 dark:text-blue-300">
										Education:
									</span>
									<span className="text-sm text-blue-800 dark:text-blue-200 font-semibold">
										{initialValues?.education?.length || 0} degree(s)
									</span>
								</div>
								<div className="flex items-center gap-3">
									<div className="w-2 h-2 bg-blue-400 rounded-full"></div>
									<span className="text-sm font-medium text-blue-700 dark:text-blue-300">
										Skills:
									</span>
									<span className="text-sm text-blue-800 dark:text-blue-200 font-semibold">
										{initialValues?.skills?.length || 0} skill(s)
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div> */}

			{/* Success Message Card */}
			{/* {canDownload && (
				<div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl shadow-lg p-6">
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
								Congratulations! Your resume has been completed successfully. Click the download button
								below to get your professional PDF resume that&apos;s ready for job applications and
								career advancement.
							</p>
						</div>
					</div>
				</div>
			)} */}

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
			<div className="text-center space-y-6">
				<Button
					variant="default"
					onClick={onDownloadPDF}
					disabled={isDownloading}
					className={`group relative inline-flex items-center gap-3 px-10 py-4 text-lg font-semibold transition-all duration-300 transform ${
						!isDownloading
							? 'text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95'
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
							<DownloadIcon className="w-6 h-6 transition-transform group-hover:translate-y-1" />
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
