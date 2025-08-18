'use client';
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const TemplateUpdateSkeleton: React.FC = () => {
	return (
		<div className="container mx-auto p-4 lg:p-6 pb-10">
			{/* Main Content Skeleton */}
			<div className="flex flex-col xl:flex-row gap-6 h-auto">
				{/* Form Section Skeleton */}
				<div className="w-full h-full xl:w-1/2 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
					<div className="p-4 lg:p-6 h-full flex flex-col">
						{/* Steps Bar Skeleton */}
						<div className="mb-6">
							{/* Step Tabs */}
							<div className="flex items-center justify-between mb-6">
								{Array.from({ length: 6 }).map((_, index) => (
									<div key={index} className="flex flex-col items-center">
										<Skeleton className="w-8 h-8 rounded-full mb-2" />
										<Skeleton className="w-16 h-4" />
									</div>
								))}
							</div>

							{/* Progress Bar */}
							<Skeleton className="w-full h-2 rounded-full" />
						</div>

						{/* Form Content Skeleton */}
						<div className="flex-1 space-y-6">
							{/* Form Fields */}
							<div className="space-y-4">
								<Skeleton className="h-4 w-20" />
								<Skeleton className="h-11 w-full" />
							</div>

							<div className="space-y-4">
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-11 w-full" />
							</div>

							<div className="space-y-4">
								<Skeleton className="h-4 w-16" />
								<Skeleton className="h-11 w-full" />
							</div>

							<div className="space-y-4">
								<Skeleton className="h-4 w-28" />
								<Skeleton className="h-20 w-full" />
							</div>
						</div>

						{/* Navigation Buttons */}
						<div className="flex justify-between mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
							<Skeleton className="h-10 w-24" />
							<Skeleton className="h-10 w-32" />
						</div>
					</div>
				</div>

				{/* Preview Section Skeleton */}
				<div className="h-full w-full xl:w-1/2 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
					<div className="flex flex-col w-full h-full">
						{/* Preview Header */}
						<div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex-shrink-0">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Skeleton className="w-5 h-5 rounded" />
									<Skeleton className="h-5 w-24" />
								</div>
								<Skeleton className="w-8 h-8 rounded" />
							</div>
						</div>

						{/* Preview Content */}
						<div className="flex-1 p-4 bg-slate-100 dark:bg-slate-900">
							<div className="max-w-[8.5in] mx-auto bg-white shadow-lg">
								{/* Resume Header Skeleton */}
								<div className="p-6 border-b border-slate-200">
									<Skeleton className="h-8 w-48 mx-auto mb-4" />
									<Skeleton className="h-4 w-32 mx-auto mb-2" />
									<Skeleton className="h-4 w-40 mx-auto" />
								</div>

								{/* Resume Content Skeleton */}
								<div className="p-6 space-y-6">
									{/* Section */}
									<div>
										<Skeleton className="h-5 w-24 mb-3" />
										<div className="space-y-3">
											<Skeleton className="h-4 w-full" />
											<Skeleton className="h-4 w-3/4" />
											<Skeleton className="h-4 w-1/2" />
										</div>
									</div>

									{/* Section */}
									<div>
										<Skeleton className="h-5 w-20 mb-3" />
										<div className="space-y-3">
											<Skeleton className="h-4 w-full" />
											<Skeleton className="h-4 w-5/6" />
											<Skeleton className="h-4 w-2/3" />
										</div>
									</div>

									{/* Section */}
									<div>
										<Skeleton className="h-5 w-16 mb-3" />
										<div className="space-y-3">
											<Skeleton className="h-4 w-full" />
											<Skeleton className="h-4 w-4/5" />
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Mobile Preview Button Skeleton */}
			<div className="xl:hidden fixed bottom-6 right-6 z-50">
				<Skeleton className="w-16 h-16 rounded-full" />
			</div>
		</div>
	);
};
