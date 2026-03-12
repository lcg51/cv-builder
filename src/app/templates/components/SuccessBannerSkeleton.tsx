import React from 'react';
import { Skeleton } from '@/ui/components/skeleton';

export const SuccessBannerSkeleton: React.FC<{ mainComponentProps: object }> = () => {
	return <Skeleton className="h-32 w-full rounded-xl" />;
};
