'use client';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import './StepsBar.css';
import { useWindowSize } from '../../util/hooks/useWindowSize';
import { UserDataType } from '@/app/models/user';

export type StepsBarComponentProps = {
	onSuccess?: () => void;
	onFieldChange?: (key: string, value: unknown) => void;
	initialValues?: UserDataType;
};

export type StepsBarItemsProps = {
	title: string;
	active: boolean;
	component: FC<StepsBarComponentProps>;
};

export type StepsBarProps = {
	items: StepsBarItemsProps[];
	activeStep: number;
	onNextStepCallback: (newItems: StepsBarItemsProps[]) => void;
	onFieldChangeCallback: (key: string, value: unknown) => void;
	initialValues?: UserDataType;
};

export const StepsBar = ({
	activeStep,
	items,
	onNextStepCallback,
	onFieldChangeCallback,
	initialValues
}: StepsBarProps) => {
	const [selectedIndex, setSelectedIndex] = useState<number>(activeStep);
	const { width } = useWindowSize();

	useEffect(() => {
		setSelectedIndex(activeStep);
	}, [activeStep]);

	const isTabletResolution = width < 1024;

	const sortedItems = useMemo(() => {
		return items
			.sort(a => (a.active ? -1 : 1))
			.map((item, index) => {
				const newItem = { ...item, active: index <= selectedIndex };
				return newItem;
			});
	}, [items, selectedIndex]);

	const filledBarWidth = useMemo(() => {
		const itemBarWidth = 100 / sortedItems.length;
		const activeItems = sortedItems.filter(item => item.active);
		const itemsTotalWidth = itemBarWidth * activeItems.length;
		const filledBarWidth = isTabletResolution ? itemsTotalWidth : itemsTotalWidth - itemBarWidth / 2;
		return filledBarWidth;
	}, [sortedItems, isTabletResolution]);

	const onSetNextStep = useCallback(() => {
		if (selectedIndex === items.length - 1) return;
		const newItems = items.map((item, index) => {
			if (index === selectedIndex + 1) item.active = true;
			return item;
		});
		onNextStepCallback(newItems);

		setSelectedIndex(selectedIndex + 1);
	}, [setSelectedIndex]);

	const stepsViewRender = useMemo(() => {
		return items.map(({ component }, index) => {
			const ComponentView = component;

			return (
				selectedIndex === index && (
					<div key={index}>
						<ComponentView
							onSuccess={onSetNextStep}
							onFieldChange={onFieldChangeCallback}
							initialValues={initialValues}
						/>
					</div>
				)
			);
		});
	}, [items, selectedIndex]);

	const stepsTabsRender = useMemo(() => {
		if (isTabletResolution)
			return sortedItems.map((item, index) => {
				return (
					selectedIndex === index && (
						<div
							key={index}
							className={`flex flex-col flex-1 items-center relative ${item.active ? 'cursor-pointer' : ''}`}
							onClick={() => onClickStepItem({ item, index })}
						>
							<div className="text-xs uppercase pb-4">{item.title}</div>
						</div>
					)
				);
			});
		return sortedItems.map((item, index) => (
			<div
				key={index}
				className={`flex flex-col flex-1 items-center relative ${item.active ? 'cursor-pointer' : ''}`}
				onClick={() => onClickStepItem({ item, index })}
			>
				<div className="text-xs uppercase pb-4">{item.title}</div>
				<div className={`bullet ${item.active ? 'active' : ''}`}></div>
			</div>
		));
	}, [items, selectedIndex, isTabletResolution]);

	const onClickStepItem = useCallback(
		({ item, index }: { item: StepsBarItemsProps; index: number }) => {
			if (!item.active) return;
			setSelectedIndex(index);
		},
		[setSelectedIndex]
	);

	return (
		<div className="flex flex-col w-full">
			<div className="flex justify-between w-full relative">
				<div className={`steps-bar`}></div>
				<div
					data-testid="steps-bar-fill"
					className="steps-bar--fill"
					style={{ width: `calc(${filledBarWidth}%` }}
				></div>
				{stepsTabsRender}
			</div>
			<div className="pt-8">{stepsViewRender}</div>
		</div>
	);
};
