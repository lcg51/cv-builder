'use client';
import React from 'react';
import { Skeleton } from '@/ui/components/skeleton';

export const ConfirmPageSkeleton: React.FC = () => {
	return (
		<div className="max-w-4xl mx-auto space-y-8 p-4">
			{/* Header Section Skeleton */}
			<div className="text-center space-y-4">
				<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700">
					<Skeleton className="w-8 h-8 rounded" />
				</div>
				<div>
					<Skeleton className="h-9 w-80 mx-auto mb-3" />
				</div>
			</div>

			{/* Progress Indicator Skeleton */}
			<div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
				<div className="flex items-center justify-between mb-4">
					<Skeleton className="h-6 w-40" />
					<Skeleton className="h-8 w-16" />
				</div>
				<div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 mb-4">
					<Skeleton className="h-3 w-3/4 rounded-full" />
				</div>
				<div className="flex items-center gap-2">
					<Skeleton className="w-5 h-5 rounded-full" />
					<Skeleton className="h-5 w-48" />
				</div>
			</div>

			{/* Additional Information Skeleton */}
			<div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 text-center">
				<div className="max-w-2xl mx-auto space-y-3">
					<Skeleton className="h-6 w-32 mx-auto" />
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{Array.from({ length: 3 }).map((_, index) => (
							<div key={index} className="flex flex-col items-center gap-2">
								<Skeleton className="w-8 h-8 rounded-lg" />
								<Skeleton className="h-4 w-20" />
							</div>
						))}
					</div>
					<Skeleton className="h-4 w-full max-w-lg mx-auto pt-2" />
				</div>
			</div>

			{/* Download Button Section Skeleton */}
			<div className="sticky bottom-0 left-0 right-0 md:relative text-center space-y-6">
				<Skeleton className="h-14 w-64 mx-auto rounded-xl" />
			</div>
		</div>
	);
};
