import React from 'react';
import { Skeleton } from '@/ui/components/skeleton';
import type { DownloadSectionProps } from './DownloadSection'; // type-only — no runtime circular dep

export const DownloadSectionSkeleton: React.FC<{ mainComponentProps: DownloadSectionProps }> = () => {
	return (
		<div className="text-center py-2">
			<Skeleton className="h-14 w-64 mx-auto rounded-xl" />
		</div>
	);
};
