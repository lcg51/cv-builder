'use client';
import React from 'react';
import { Card } from '@/ui/components/card';
import { Skeleton } from '@/ui/components/skeleton';

export const TemplateSkeleton: React.FC = () => {
	return (
		<div className="container mx-auto p-4 lg:p-6 pb-10">
			<div className="w-full max-w-4xl mx-auto">
				{/* Header Skeleton */}
				<div className="text-center mb-8">
					<Skeleton className="h-12 w-96 mx-auto mb-4" />
					<Skeleton className="h-6 w-2xl mx-auto" />
				</div>

				{/* Template Grid Skeleton */}
				<div className="grid md:grid-cols-3 gap-6 mb-8">
					{Array.from({ length: 3 }).map((_, index) => (
						<Card key={index} className="overflow-hidden">
							{/* Template Preview Skeleton */}
							<div className="relative h-48 bg-slate-100 dark:bg-slate-700 p-6">
								<div className="flex flex-col items-center justify-center h-full space-y-3">
									<Skeleton className="w-12 h-12 rounded-full" />
									<Skeleton className="w-20 h-4" />
								</div>
							</div>

							{/* Template Info Skeleton */}
							<div className="p-6 space-y-3">
								<Skeleton className="h-6 w-32" />
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-3/4" />
							</div>
						</Card>
					))}
				</div>

				{/* Action Button Skeleton */}
				<div className="text-center">
					<Skeleton className="h-12 w-48 mx-auto" />
				</div>

				{/* Help Text Skeleton */}
				<div className="text-center mt-6">
					<Skeleton className="h-4 w-80 mx-auto" />
				</div>
			</div>
		</div>
	);
};
