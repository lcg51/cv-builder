'use client';
import React, { FC, useCallback, useMemo, useState, useEffect } from 'react';
import { useWindowSize } from '../../../../hooks/useWindowSize';
import { UserDataType } from '@/app/models/user';
import { ChevronLeftIcon, ChevronRightIcon, CheckIcon, ArrowRightIcon } from '@/ui/icons';
import { Button } from '@/ui/components/button';
import { useFormValidation } from '../../../../hooks/useFormValidation';
import { useTranslations } from 'next-intl';

export type StepsBarComponentProps = {
	onFieldChange?: (key: string, value: unknown) => void;
	initialValues?: UserDataType;
	formId?: string; // Make formId optional since some forms (like FinishForm) don't need validation
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
	$t: ReturnType<typeof useTranslations>;
};

export const StepsBar = ({
	items,
	activeStep = 0,
	onNextStepCallback,
	onFieldChangeCallback,
	initialValues,
	$t
}: StepsBarProps) => {
	const [selectedIndex, setSelectedIndex] = useState<number>(activeStep);
	const [stepItems, setStepItems] = useState<StepsBarItemsProps[]>(items);
	const { width } = useWindowSize();
	const isTabletResolution = width < 1024;
	const isLastStep = selectedIndex === stepItems.length - 1;
	const { submitCurrentForm } = useFormValidation();

	const stepText = useMemo(
		() =>
			$t.rich('stepTexts.step', { step: selectedIndex + 1, total: stepItems.length }) ??
			`${selectedIndex + 1} of ${stepItems.length}`,
		[$t]
	);

	const completeText = useMemo(
		() =>
			$t.rich('stepTexts.complete', {
				completionPercentage: Math.round(((selectedIndex + 1) / stepItems.length) * 100)
			}) ?? `${Math.round(((selectedIndex + 1) / stepItems.length) * 100)}% Complete`,
		[$t]
	);

	const nextText = useMemo(() => $t('stepTexts.next') ?? 'Next', [$t]);
	const finishText = useMemo(() => $t('stepTexts.finish') ?? 'Finish', [$t]);

	// Sync selectedIndex with activeStep prop when it changes (e.g., when data is loaded from Zustand)
	useEffect(() => {
		setSelectedIndex(activeStep);
		// Update step items to reflect the active step
		const newItems = items.map((item, index) => ({
			...item,
			active: index <= activeStep,
			isClickable: index <= activeStep
		}));
		setStepItems(newItems);
	}, [activeStep, items]);

	const onSetNextStep = useCallback(async () => {
		// Validate current form before proceeding
		const currentFormId = items[selectedIndex]?.title.toLowerCase().replace(/\s+/g, '-');
		const isValid = await submitCurrentForm(currentFormId);
		if (!isValid) {
			return; // Don't proceed if validation fails
		}

		if (isLastStep) {
			onNextStepCallback?.(selectedIndex + 1);
			return;
		}
		const newItems = stepItems.map((item, index) => ({
			...item,
			active: index <= selectedIndex + 1,
			isClickable: index <= selectedIndex + 1
		}));
		setStepItems(newItems);
		setSelectedIndex(selectedIndex + 1);
		onNextStepCallback?.(selectedIndex + 1);
	}, [selectedIndex, stepItems, isLastStep, onNextStepCallback, submitCurrentForm, items]);

	const onClickStepItem = useCallback(
		({ item, index }: { item: StepsBarItemsProps; index: number }) => {
			if (!item.active) return;

			const newItems = stepItems.map((item, stepIndex) => ({
				...item,
				active: stepIndex <= index
			}));
			setStepItems(newItems);
			setSelectedIndex(index);
			// Notify parent component about step change
			onNextStepCallback?.(index);
		},
		[stepItems, onNextStepCallback]
	);

	const stepsViewRender = useMemo(() => {
		return stepItems.map(({ component }, index) => {
			const ComponentView = component;
			const formId = stepItems[index]?.title.toLowerCase().replace(/\s+/g, '-');

			return (
				selectedIndex === index && (
					<div key={index}>
						<ComponentView
							formId={formId}
							onFieldChange={onFieldChangeCallback}
							initialValues={initialValues}
						/>
					</div>
				)
			);
		});
	}, [stepItems, selectedIndex, onFieldChangeCallback, initialValues]);

	const stepsTabsRender = useMemo(() => {
		if (isTabletResolution) {
			// Mobile: Show current step with navigation arrows
			return (
				<div className="flex items-center justify-between w-full">
					<button
						className={`absolute left-0 bottom-0 p-2 rounded-full ${selectedIndex > 0 ? 'text-primary hover:bg-slate-100 dark:hover:bg-slate-700' : 'text-slate-300 cursor-not-allowed'}`}
						onClick={() =>
							selectedIndex > 0 &&
							onClickStepItem({ item: stepItems[selectedIndex - 1], index: selectedIndex - 1 })
						}
						disabled={selectedIndex === 0}
						aria-label="Left Arrow"
					>
						<ChevronLeftIcon />
					</button>

					<div className="flex-1 text-center">
						<div className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
							{stepItems[selectedIndex]?.title}
						</div>
						<div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm font-bold mx-auto">
							{selectedIndex + 1}
						</div>
					</div>

					<button
						className={`absolute right-0 bottom-0 p-2 rounded-full ${selectedIndex < stepItems.length - 1 ? 'text-primary hover:bg-slate-100 dark:hover:bg-slate-700' : 'text-slate-300 cursor-not-allowed'}`}
						onClick={() =>
							selectedIndex < stepItems.length - 1 &&
							stepItems[selectedIndex + 1]?.active &&
							onClickStepItem({ item: stepItems[selectedIndex + 1], index: selectedIndex + 1 })
						}
						disabled={selectedIndex === stepItems.length - 1 || !stepItems[selectedIndex + 1]?.active}
						aria-label="Right Arrow"
					>
						<ChevronRightIcon />
					</button>
				</div>
			);
		}
		return stepItems.map((item, index) => {
			const isCompleted = selectedIndex > index;
			const isCurrent = selectedIndex === index;

			return (
				<div
					key={index}
					className={`flex flex-col flex-1 items-center relative transition-all duration-200 ${
						item.active ? 'cursor-pointer hover:scale-105' : 'opacity-50'
					}`}
					onClick={() => onClickStepItem({ item, index })}
				>
					<div
						className={`text-xs font-medium uppercase pb-4 transition-colors duration-200 ${
							isCurrent
								? 'text-primary font-semibold'
								: isCompleted
									? 'text-green-600 dark:text-green-400'
									: 'text-slate-500 dark:text-slate-400'
						}`}
					>
						{item.title}
					</div>
					<div
						className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
							isCompleted
								? 'bg-green-500 border-green-500 text-white'
								: isCurrent
									? 'bg-primary border-primary text-primary shadow-lg border-0'
									: item.active
										? 'bg-white border-primary text-primary dark:text-white hover:bg-primary hover:text-white'
										: 'bg-slate-200 border-slate-300 text-slate-400'
						}`}
					>
						{isCompleted ? (
							<CheckIcon />
						) : (
							<span className="text-sm text-foreground dark:text-slate-500 font-bold">{index + 1}</span>
						)}
					</div>
				</div>
			);
		});
	}, [stepItems, selectedIndex, isTabletResolution, onClickStepItem]);

	return (
		<div className="flex flex-col w-full h-full xl:flex-1">
			{/* Progress Bar */}
			<div className="mb-8">
				<div className="flex justify-between items-center mb-2">
					<span className="text-sm font-medium text-slate-600 dark:text-slate-400">{stepText}</span>
					<span className="text-sm font-medium text-slate-600 dark:text-slate-400">{completeText}</span>
				</div>
				<div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-6">
					<div
						className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
						style={{ width: `${((selectedIndex + 1) / stepItems.length) * 100}%` }}
					></div>
				</div>
			</div>

			{/* Steps Navigation */}
			<div className="flex justify-between w-full relative mb-8">
				<div className="absolute top-5 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-700"></div>
				<div
					data-testid="steps-bar-fill"
					className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-300 ease-out"
					style={{ width: `${(selectedIndex / (stepItems.length - 1)) * 100}%` }}
				></div>
				{stepsTabsRender}
			</div>

			<div className="flex flex-col bg-slate-50 dark:bg-slate-900 rounded-lg lg:overflow-y-auto">
				{/* Form Content */}
				<div className="p-6 xl:flex-1 overflow-y-auto min-h-0">{stepsViewRender}</div>

				{/* Centralized Submit Button */}
				<div className="sticky xl:relative bottom-0 left-0 right-0 bg-white dark:bg-slate-900 md:relative flex justify-between items-center p-6 mt-6">
					<div className="text-sm text-slate-500 dark:text-slate-400">{stepText}</div>
					<Button
						variant="default"
						onClick={onSetNextStep}
						className="px-6 py-2 h-11"
						data-testid="continue-button"
						disabled={!stepItems[selectedIndex]?.active}
					>
						{isLastStep ? finishText : nextText}
						<ArrowRightIcon className="w-4 h-4" />
					</Button>
				</div>
			</div>
		</div>
	);
};
