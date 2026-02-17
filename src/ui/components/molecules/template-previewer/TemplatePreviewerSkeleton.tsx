import React from 'react';
import { Skeleton } from '@/ui/components/skeleton';

export const TemplatePreviewerSkeleton: React.FC = () => {
	return (
		<div className="flex flex-col h-full">
			{/* Preview Content */}
			<div className="bg-slate-100 dark:bg-slate-900 p-4 xl:flex-1 overflow-y-auto min-h-0">
				<div className="max-w-[8.5in] mx-auto bg-white dark:bg-slate-800 shadow-lg">
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
	);
};
