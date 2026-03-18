'use client';

import React from 'react';
import { useFieldArray, Control, type FieldArrayPath } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/components/form';
import { Input, Textarea, MonthYearPicker, Slider, ChipButton } from '@/ui/components';
import { AITextarea } from '@/ui/components/molecules/ai-textarea/AITextarea';
import { PlusIcon, Trash } from '@/ui/icons';
import { type StepsBarComponentProps } from '@/ui/components';
import { type BaseFieldConfig, type ArrayFieldConfig, type SimpleFieldConfig } from '@/lib/dynamicFormSchema';
import { useDynamicForm, type FormHeader, type DynamicFormConfig } from '../hooks/useDynamicForm';

export type {
	FieldType,
	BaseFieldConfig,
	ArrayFieldConfig,
	SimpleFieldConfig,
	FieldConfig
} from '@/lib/dynamicFormSchema';
export type { FormHeader, DynamicFormConfig } from '../hooks/useDynamicForm';

interface DynamicFormAdapterProps extends StepsBarComponentProps {
	config: DynamicFormConfig;
}

interface FieldRendererProps {
	field: BaseFieldConfig;
	control: Control<Record<string, unknown>>;
	name: string;
	getValues?: (path: string) => unknown;
	arrayParent?: string;
}

const FieldRenderer: React.FC<FieldRendererProps> = ({ field, control, name, getValues, arrayParent }) => {
	const inputClass =
		field.type === 'textarea'
			? 'min-h-24 border-slate-300 dark:border-slate-600 focus:border-primary dark:focus:border-primary'
			: 'h-11 border-slate-300 dark:border-slate-600 focus:border-primary dark:focus:border-primary';

	const getInputComponent = (formFieldValue?: unknown, onChange?: (v: unknown) => void) => {
		const base = { placeholder: field.placeholder, className: inputClass };
		if (field.type === 'textarea' && field.aiAssist) {
			const resolveContext = () => {
				if (arrayParent && getValues) {
					const item = getValues(arrayParent) as Record<string, string>;
					return { jobTitle: item?.jobTitle, company: item?.company };
				}
				return {};
			};
			return (
				<AITextarea
					{...base}
					aria-label={field.label}
					value={typeof formFieldValue === 'string' ? formFieldValue : ''}
					aiAssist={{ type: field.aiAssist.type, getContext: resolveContext }}
					onAISuggestion={text => onChange?.(text)}
				/>
			);
		}
		switch (field.type) {
			case 'textarea':
				return <Textarea {...base} />;
			case 'email':
				return <Input type="email" {...base} />;
			case 'tel':
				return <Input type="tel" {...base} />;
			case 'url':
				return <Input type="url" {...base} />;
			case 'number':
				return <Input type="number" {...base} min={field.min} max={field.max} step={field.step} />;
			default:
				return <Input {...base} />;
		}
	};

	return (
		<FormField
			control={control}
			name={name}
			render={({ field: formField }) => (
				<FormItem>
					<FormLabel className="text-sm font-semibold text-slate-700 dark:text-slate-300">
						{field.label}
						{field.type === 'slider' &&
							Array.isArray(formField.value) &&
							formField.value.length > 0 &&
							field.sliderConfig?.showValue !== false &&
							` (${
								field.sliderConfig?.valueFormat
									? field.sliderConfig.valueFormat(formField.value[0] || field.min || 0)
									: `${formField.value[0] || field.min || 0}%`
							})`}
					</FormLabel>
					<FormControl>
						{field.type === 'slider' ? (
							<div className="pt-2">
								<Slider
									value={Array.isArray(formField.value) ? formField.value : [field.min || 50]}
									onValueChange={formField.onChange}
									max={field.max || 100}
									min={field.min || 0}
									step={field.step || 1}
									className="w-full"
								/>
							</div>
						) : field.type === 'date' ? (
							<MonthYearPicker
								value={formField.value instanceof Date ? formField.value : undefined}
								onChange={formField.onChange}
								ref={formField.ref}
							/>
						) : field.type === 'textarea' && field.aiAssist ? (
							getInputComponent(formField.value, formField.onChange)
						) : (
							React.cloneElement(getInputComponent(), formField)
						)}
					</FormControl>
					{field.helpText && (
						<div className="text-xs text-slate-500 dark:text-slate-400 mt-2">{field.helpText}</div>
					)}
					{field.type === 'slider' && field.sliderConfig?.labels && (
						<div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
							{field.sliderConfig.labels.map((label, index) => (
								<span key={index}>{label}</span>
							))}
						</div>
					)}
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};

const SimpleField = ({
	field,
	control,
	getValues
}: {
	field: SimpleFieldConfig;
	control: Control<Record<string, unknown>>;
	getValues: (path: string) => unknown;
}) => (
	<div className={field.gridColumn === 'full' ? 'col-span-full' : 'col-span-1'}>
		<FieldRenderer field={field} control={control} name={field.name} getValues={getValues} />
	</div>
);

const ArrayFieldSection = ({
	field,
	control,
	getValues
}: {
	field: ArrayFieldConfig;
	control: Control<Record<string, unknown>>;
	getValues: (path: string) => unknown;
}) => {
	type FormWithArray = Record<string, Record<string, unknown>[]>;

	const { fields, append, remove } = useFieldArray<FormWithArray>({
		control: control as Control<FormWithArray>,
		name: field.name as FieldArrayPath<FormWithArray>
	});

	const buildNewItem = (prefillValue?: string) => {
		const newItem: Record<string, unknown> = {};
		const firstTextField = Object.entries(field.arrayItemSchema).find(([, f]) => f.type === 'text');
		Object.entries(field.arrayItemSchema).forEach(([key, itemField]) => {
			if (prefillValue && firstTextField && key === firstTextField[0]) {
				newItem[key] = prefillValue;
			} else {
				newItem[key] =
					itemField.type === 'slider' ? [itemField.min || 50] : itemField.type === 'date' ? new Date() : '';
			}
		});
		return newItem;
	};

	const addNewItem = () => append(buildNewItem() as Record<string, unknown>);
	const addSuggestedItem = (value: string) => append(buildNewItem(value) as Record<string, unknown>);

	return (
		<div className="col-span-full space-y-6">
			{field.suggestedItems && field.suggestedItems.length > 0 && (
				<div className="space-y-2">
					{field.suggestedItemsLabel && (
						<p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
							{field.suggestedItemsLabel}
						</p>
					)}
					<div className="flex flex-wrap gap-2">
						{field.suggestedItems.map(skill => (
							<ChipButton
								key={skill}
								label={skill}
								icon={<PlusIcon className="w-3 h-3" />}
								onClick={() => addSuggestedItem(skill)}
							/>
						))}
					</div>
				</div>
			)}
			{fields.map((arrayField, index) => (
				<div
					key={arrayField.id}
					className="relative bg-slate-50 dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700"
				>
					<div className="flex items-center justify-between mb-4">
						<h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
							{field.itemTitle ? field.itemTitle(index) : `${field.label} ${index + 1}`}
						</h4>
						<button
							type="button"
							className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
							onClick={() => remove(index)}
						>
							<Trash className="w-4 h-4" />
						</button>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{Object.entries(field.arrayItemSchema).map(([key, itemField]) => (
							<div key={key} className={itemField.gridColumn === 'full' ? 'col-span-full' : ''}>
								<FieldRenderer
									field={itemField}
									control={control}
									name={`${field.name}.${index}.${key}`}
									getValues={getValues}
									arrayParent={`${field.name}.${index}`}
								/>
							</div>
						))}
					</div>
				</div>
			))}

			<div className="flex justify-center">
				<button
					type="button"
					className="flex items-center gap-2 px-6 py-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-400 hover:border-primary hover:text-primary transition-colors duration-200"
					onClick={addNewItem}
				>
					<PlusIcon />
					{field.addButtonText || `Add Another ${field.label}`}
				</button>
			</div>
		</div>
	);
};

const DynamicFormHeader = ({ title, description, icon }: FormHeader) => (
	<div className="mb-6">
		<div className="flex items-center gap-3 mb-3">
			<div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white">
				{icon}
			</div>
			<div>
				<h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-1">{title}</h3>
				<p className="text-slate-600 dark:text-slate-400">{description}</p>
			</div>
		</div>
	</div>
);

export const DynamicFormAdapter: React.FC<DynamicFormAdapterProps> = props => {
	const { config } = props;
	const { form, control } = useDynamicForm(props);
	const getValues = (path: string) => form.getValues(path as never);

	return (
		<>
			<DynamicFormHeader {...config.header} />
			<Form {...form}>
				<div className="space-y-6">
					<div
						className={`grid grid-cols-1 gap-6 md:grid-cols-2 bg-slate-50 dark:bg-slate-800 rounded-lg p-6 ${config.containerClassName || ''}`}
					>
						{config.fields.map(field =>
							field.isArray ? (
								<ArrayFieldSection
									key={field.name}
									field={field}
									control={control}
									getValues={getValues}
								/>
							) : (
								<SimpleField key={field.name} field={field} control={control} getValues={getValues} />
							)
						)}
					</div>
				</div>
			</Form>
		</>
	);
};
