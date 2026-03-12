import React from 'react';
import { Skeleton } from '@/ui/components/skeleton';
import type { ProgressBarProps } from './ProgressBar'; // type-only — no runtime circular dep

export const ProgressBarSkeleton: React.FC<{ mainComponentProps: ProgressBarProps }> = () => {
	return (
		<div className="w-full">
			<div className="flex items-center justify-between mb-2">
				<Skeleton className="h-4 w-40" />
				<Skeleton className="h-4 w-10" />
			</div>
			<div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-4">
				<Skeleton className="h-2 w-3/4 rounded-full" />
			</div>
			<Skeleton className="h-4 w-48 mx-auto" />
		</div>
	);
};
