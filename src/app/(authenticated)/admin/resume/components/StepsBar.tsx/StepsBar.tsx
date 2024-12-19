'use client';
import React, { FC, useCallback, useMemo, useState } from 'react';
import './StepsBar.css';

export type StepsBarItemsProps = {
	title: string;
	active: boolean;
	component: FC;
};

export type StepsBarProps = {
	items: StepsBarItemsProps[];
};

export const StepsBar = ({ items }: StepsBarProps) => {
	const [selectedIndex, setSelectedIndex] = useState<number>(0);

	const sortedItems = useMemo(() => {
		return items.sort(a => (a.active ? -1 : 1));
	}, [items]);

	const filledBarWidth = useMemo(() => {
		const itemBarWidth = 100 / items.length;
		const activeItems = items.filter(item => item.active);
		return itemBarWidth * activeItems.length - itemBarWidth / 2;
	}, [items]);

	const stepsViewRender = useMemo(() => {
		return items.map(({ component }, index) => {
			const ComponentView = component;

			return (
				selectedIndex === index && (
					<div key={index}>
						<ComponentView />
					</div>
				)
			);
		});
	}, [items, selectedIndex]);

	const onClickStepItem = useCallback(
		({ item, index }: { item: StepsBarItemsProps; index: number }) => {
			if (!item.active) return;
			setSelectedIndex(index);
		},
		[setSelectedIndex]
	);

	return (
		<div className="flex flex-col justify-between w-full rounded-lg shadow-md">
			<div className="flex justify-between w-full relative">
				<div className={`steps-bar`}></div>
				<div
					data-testid="steps-bar-fill"
					className="steps-bar--fill"
					style={{ width: `calc(${filledBarWidth}%` }}
				></div>
				{sortedItems.map((item, index) => (
					<div
						key={index}
						className={`flex flex-col flex-1 items-center relative ${item.active ? 'cursor-pointer' : ''}`}
						onClick={() => onClickStepItem({ item, index })}
					>
						<div className="text-xs uppercase pb-4">{item.title}</div>
						<div className={`bullet ${item.active ? 'active' : ''}`}></div>
					</div>
				))}
			</div>
			<div className="pt-8">{stepsViewRender}</div>
		</div>
	);
};
