import React from 'react';
import { Skeleton } from '@/ui/components/skeleton';

export const StepsBarSkeleton: React.FC = () => {
	return (
		<>
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
		</>
	);
};
