'use client';
import React, { FC, useCallback, useMemo, useState, useEffect, createContext, useContext, useRef } from 'react';
import './StepsBar.css';
import { useWindowSize } from '../../../../hooks/useWindowSize';
import { UserDataType } from '@/app/models/user';
import { ChevronLeftIcon, ChevronRightIcon, CheckIcon } from '@/components/icons/FormIcons';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from '@/components/icons/FormIcons';

// Form validation context
export type FormValidationContextType = {
	registerForm: (formId: string | undefined, validate: () => Promise<boolean>) => void;
	unregisterForm: (formId: string | undefined) => void;
	submitCurrentForm: () => Promise<boolean>;
};

const FormValidationContext = createContext<FormValidationContextType | null>(null);

export const useFormValidation = () => {
	const context = useContext(FormValidationContext);
	if (!context) {
		throw new Error('useFormValidation must be used within a FormValidationProvider');
	}
	return context;
};

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
};

export const StepsBar = ({
	items,
	activeStep = 0,
	onNextStepCallback,
	onFieldChangeCallback,
	initialValues
}: StepsBarProps) => {
	const [selectedIndex, setSelectedIndex] = useState<number>(activeStep);
	const [stepItems, setStepItems] = useState<StepsBarItemsProps[]>(items);
	const formValidatorsRef = useRef<Map<string, () => Promise<boolean>>>(new Map());
	const { width } = useWindowSize();
	const isTabletResolution = width < 1024;
	const isLastStep = selectedIndex === stepItems.length - 1;

	// Form validation context value
	const formValidationContextValue = useMemo<FormValidationContextType>(
		() => ({
			registerForm: (formId: string | undefined, validate: () => Promise<boolean>) => {
				if (formId) {
					formValidatorsRef.current.set(formId, validate);
				}
			},
			unregisterForm: (formId: string | undefined) => {
				if (formId) {
					formValidatorsRef.current.delete(formId);
				}
			},
			submitCurrentForm: async () => {
				const currentFormId = items[selectedIndex]?.title.toLowerCase().replace(/\s+/g, '-');
				// If no formId is provided for the current step, allow progression
				if (!currentFormId) {
					return true;
				}
				const validator = formValidatorsRef.current.get(currentFormId);
				if (validator) {
					return await validator();
				}
				return true; // If no validator, allow progression
			}
		}),
		[selectedIndex, items]
	);

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
		const isValid = await formValidationContextValue.submitCurrentForm();
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
	}, [selectedIndex, stepItems, isLastStep, onNextStepCallback, formValidationContextValue]);

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
		<FormValidationContext.Provider value={formValidationContextValue}>
			<div className="flex flex-col w-full h-full xl:flex-1">
				{/* Progress Bar */}
				<div className="mb-8">
					<div className="flex justify-between items-center mb-2">
						<span className="text-sm font-medium text-slate-600 dark:text-slate-400">
							Step {selectedIndex + 1} of {stepItems.length}
						</span>
						<span className="text-sm font-medium text-slate-600 dark:text-slate-400">
							{Math.round(((selectedIndex + 1) / stepItems.length) * 100)}% Complete
						</span>
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
					<div className="sticky xl:relative bottom-0 left-0 right-0 bg-white dark:bg-slate-900 md:relative flex justify-between items-center p-6 border-t border-slate-200 dark:border-slate-700 mt-6">
						<div className="text-sm text-slate-500 dark:text-slate-400">
							Step {selectedIndex + 1} of {stepItems.length}
						</div>
						<Button
							variant="default"
							onClick={onSetNextStep}
							className="px-6 py-2 h-11"
							disabled={!stepItems[selectedIndex]?.active}
						>
							{isLastStep ? 'Finish' : 'Continue'}
							<ArrowRightIcon className="w-4 h-4" />
						</Button>
					</div>
				</div>
			</div>
		</FormValidationContext.Provider>
	);
};
