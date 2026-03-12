import React from 'react';
import { Skeleton } from '@/ui/components/skeleton';
import type { SuccessBannerProps } from './SuccessBanner';

export const SuccessBannerSkeleton: React.FC<{ mainComponentProps: SuccessBannerProps }> = () => {
	return <Skeleton className="h-32 w-full rounded-xl" />;
};
