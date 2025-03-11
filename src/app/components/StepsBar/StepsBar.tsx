'use client';
import React, { FC, useCallback, useMemo, useState } from 'react';
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
	isClickable: boolean;
	component: FC<StepsBarComponentProps>;
};

export type StepsBarProps = {
	items: StepsBarItemsProps[];
	activeStep?: number;
	onNextStepCallback?: (stepIndex: number) => void;
	onFieldChangeCallback: (key: string, value: unknown) => void;
	initialValues?: UserDataType;
};

export const StepsBar = ({ items, onNextStepCallback, onFieldChangeCallback, initialValues }: StepsBarProps) => {
	const [selectedIndex, setSelectedIndex] = useState<number>(0);
	const [stepItems, setStepItems] = useState<StepsBarItemsProps[]>(items);
	const { width } = useWindowSize();
	const isTabletResolution = width < 1024;

	const onSetNextStep = useCallback(() => {
		if (selectedIndex === stepItems.length - 1) return;
		const newItems = stepItems.map((item, index) => ({
			...item,
			active: index <= selectedIndex + 1,
			isClickable: index <= selectedIndex + 1
		}));
		setStepItems(newItems);
		setSelectedIndex(selectedIndex + 1);
		onNextStepCallback?.(selectedIndex + 1);
	}, [selectedIndex, stepItems]);

	const filledBarWidth = useMemo(() => {
		const itemBarWidth = 100 / stepItems.length;
		const activeItems = stepItems.filter(item => item.active);
		const itemsTotalWidth = itemBarWidth * activeItems.length;
		const filledBarWidth = isTabletResolution ? itemsTotalWidth : itemsTotalWidth - itemBarWidth / 2;
		return filledBarWidth;
	}, [items, isTabletResolution, selectedIndex]);

	const onClickStepItem = useCallback(
		({ item, index }: { item: StepsBarItemsProps; index: number }) => {
			if (!item.active) return;

			const newItems = stepItems.map((item, stepIndex) => ({
				...item,
				active: stepIndex <= index
			}));
			setStepItems(newItems);
			setSelectedIndex(index);
		},
		[setSelectedIndex]
	);

	const stepsViewRender = useMemo(() => {
		return stepItems.map(({ component }, index) => {
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
	}, [stepItems, selectedIndex, onSetNextStep, onFieldChangeCallback, initialValues]);

	const stepsTabsRender = useMemo(() => {
		if (isTabletResolution)
			return stepItems.map((item, index) => {
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
		return stepItems.map((item, index) => (
			<div
				key={index}
				className={`flex flex-col flex-1 items-center relative ${item.active ? 'cursor-pointer' : ''}`}
				onClick={() => onClickStepItem({ item, index })}
			>
				<div className="text-xs uppercase pb-4">{item.title}</div>
				<div className={`bullet ${item.active ? 'active' : ''}`}></div>
			</div>
		));
	}, [stepItems, selectedIndex, isTabletResolution, onClickStepItem]);

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
