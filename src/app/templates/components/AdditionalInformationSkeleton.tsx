import React from 'react';
import { Skeleton } from '@/ui/components/skeleton';

export const AdditionalInformationSkeleton: React.FC<{ mainComponentProps: object }> = () => {
	return (
		<div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 sm:p-6 text-center">
			<div className="max-w-2xl mx-auto space-y-3">
				<Skeleton className="h-6 w-32 mx-auto" />
				<div className="grid grid-cols-3 gap-3 sm:gap-4">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="flex flex-col items-center gap-2">
							<Skeleton className="w-8 h-8 rounded-lg" />
							<Skeleton className="h-4 w-20" />
						</div>
					))}
				</div>
				<Skeleton className="h-4 w-full max-w-lg mx-auto" />
			</div>
		</div>
	);
};
