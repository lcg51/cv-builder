import React, { JSX } from 'react';

export type WithSkeletonProps<T> = T & { isLoading?: boolean };

type SkeletonComponentProps<T> = {
	mainComponentProps: T;
};

export function withSkeleton<T extends object, S extends SkeletonComponentProps<T>>(
	Component: React.ComponentType<T>,
	Skeleton: React.ComponentType<S>
) {
	const SkeletonedComponent = (allProps: WithSkeletonProps<T>) => {
		const { isLoading = false, ...props } = allProps;

		if (isLoading) {
			const skeletonProps = { mainComponentProps: props } as S;
			return <Skeleton {...(skeletonProps as JSX.IntrinsicAttributes & S)} />;
		}

		return <Component {...(props as JSX.IntrinsicAttributes & T)} />;
	};

	SkeletonedComponent.displayName = `withSkeleton(${Component.displayName ?? Component.name})`;

	return SkeletonedComponent;
}
