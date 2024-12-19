'use client';
import React, { useMemo } from 'react';
import './StepsBar.css';

export type StepsBarProps = {
	items: { title: string; active: boolean }[];
};

export const StepsBar = ({ items }: StepsBarProps) => {
	const sortedItems = useMemo(() => {
		return items.sort(a => (a.active ? -1 : 1));
	}, [items]);

	const filledBarWidth = useMemo(() => {
		const itemBarWidth = 100 / items.length;
		const activeItems = items.filter(item => item.active);
		return itemBarWidth * activeItems.length - itemBarWidth / 2;
	}, [items]);

	return (
		<div className="flex justify-between w-full rounded-lg shadow-md relative">
			<div className={`steps-bar`}></div>
			<div
				data-testid="steps-bar-fill"
				className={`steps-bar--fill`}
				style={{ width: `calc(${filledBarWidth}%` }}
			></div>
			{sortedItems.map((item, index) => (
				<div key={index} className="flex flex-col flex-1 items-center relative">
					<div className="text-xs uppercase pb-4">{item.title}</div>
					<div className={`bullet ${item.active ? 'active' : ''}`}></div>
				</div>
			))}
		</div>
	);
};
