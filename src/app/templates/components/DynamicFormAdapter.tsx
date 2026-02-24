'use client';

import React, { useEffect, ReactNode } from 'react';
import { useForm, useFieldArray, Control, type FieldArrayPath } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/components/form';
import { Input, Textarea, MonthYearPicker, Slider } from '@/ui/components';
import { PlusIcon, Trash } from '@/ui/icons';
import { useFormValidation } from '@/hooks/useFormValidation';
import { type StepsBarComponentProps } from '@/ui/components';

// Field type definitions
export type FieldType = 'text' | 'email' | 'tel' | 'url' | 'textarea' | 'date' | 'slider' | 'number';

export interface BaseFieldConfig {
	name: string;
	label: string;
	type: FieldType;
	placeholder?: string;
	required?: boolean;
	minLength?: number;
	maxLength?: number;
	min?: number;
	max?: number;
	step?: number;
	validation?: z.ZodSchema<unknown>;
	gridColumn?: 'full' | 'half';
	helpText?: string;
	// Slider-specific configuration
	sliderConfig?: {
		labels?: string[];
		showValue?: boolean;
		valueFormat?: (value: number) => string;
	};
}

export interface ArrayFieldConfig extends BaseFieldConfig {
	isArray: true;
	arrayItemSchema: Record<string, BaseFieldConfig>;
	addButtonText?: string;
	itemTitle?: (index: number) => string;
}

export interface SimpleFieldConfig extends BaseFieldConfig {
	isArray?: false;
}

export type FieldConfig = SimpleFieldConfig | ArrayFieldConfig;

export interface FormHeader {
	title: string;
	description: string;
	icon: ReactNode;
}

export interface DynamicFormConfig {
	header: FormHeader;
	fields: FieldConfig[];
	formKey?: string; // Key for onFieldChange callback
	containerClassName?: string;
}

interface DynamicFormAdapterProps extends StepsBarComponentProps {
	config: DynamicFormConfig;
}

// Helper function to create zod schema from field configs
function createZodSchema(fields: FieldConfig[]): z.ZodSchema<Record<string, unknown>> {
	const schemaObject: Record<string, z.ZodSchema<unknown>> = {};

	fields.forEach(field => {
		if (field.isArray) {
			// Create schema for array field
			const itemSchemaObject: Record<string, z.ZodSchema<unknown>> = {};

			Object.entries(field.arrayItemSchema).forEach(([key, itemField]) => {
				itemSchemaObject[key] = createFieldSchema(itemField);
			});

			schemaObject[field.name] = z.array(z.object(itemSchemaObject));
		} else {
			schemaObject[field.name] = createFieldSchema(field);
		}
	});

	return z.object(schemaObject);
}

// Helper function to create individual field schema
function createFieldSchema(field: BaseFieldConfig): z.ZodSchema<unknown> {
	if (field.validation) {
		return field.validation;
	}

	let schema: z.ZodSchema<unknown>;

	switch (field.type) {
		case 'email':
			schema = z.string().email({ message: 'Invalid email address.' });
			break;
		case 'url':
			schema = z.string().url({ message: 'Please enter a valid URL.' });
			break;
		case 'date':
			schema = z.date({ required_error: 'Date is required.' });
			break;
		case 'slider':
			schema = z.array(
				z
					.number()
					.min(field.min || 0)
					.max(field.max || 100)
			);
			break;
		case 'number':
			schema = z.number().min(field.min || 0);
			break;
		default:
			schema = z.string();
			break;
	}

	// Apply common validations
	if (field.type === 'text' || field.type === 'textarea' || field.type === 'tel') {
		if (field.minLength) {
			schema = (schema as z.ZodString).min(field.minLength, {
				message: `${field.label} must be at least ${field.minLength} characters.`
			});
		}
		if (field.maxLength) {
			schema = (schema as z.ZodString).max(field.maxLength, {
				message: `${field.label} must be no more than ${field.maxLength} characters.`
			});
		}
	}

	if (!field.required) {
		schema = schema.optional().or(z.literal(''));
	}

	return schema;
}

// Field renderer component
interface FieldRendererProps {
	field: BaseFieldConfig;
	control: Control<Record<string, unknown>>;
	name: string;
}

const FieldRenderer: React.FC<FieldRendererProps> = ({ field, control, name }) => {
	const getInputComponent = () => {
		const baseProps = {
			placeholder: field.placeholder,
			className:
				field.type === 'textarea'
					? 'min-h-24 border-slate-300 dark:border-slate-600 focus:border-primary dark:focus:border-primary'
					: 'h-11 border-slate-300 dark:border-slate-600 focus:border-primary dark:focus:border-primary'
		};

		switch (field.type) {
			case 'textarea':
				return <Textarea {...baseProps} />;
			case 'email':
				return <Input type="email" {...baseProps} />;
			case 'tel':
				return <Input type="tel" {...baseProps} />;
			case 'url':
				return <Input type="url" {...baseProps} />;
			case 'number':
				return <Input type="number" {...baseProps} min={field.min} max={field.max} step={field.step} />;
			default:
				return <Input {...baseProps} />;
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

export const DynamicFormAdapter: React.FC<DynamicFormAdapterProps> = ({
	config,
	initialValues,
	onFieldChange,
	formId
}) => {
	const schema = createZodSchema(config.fields);

	// Prepare default values
	const defaultValues: Record<string, unknown> = {};

	// Debug logging for initial values
	if (process.env.NODE_ENV === 'development' && config.formKey) {
		console.log(`[DynamicFormAdapter] ${config.formKey} - Initial values:`, initialValues);
	}

	config.fields.forEach(field => {
		if (field.isArray) {
			// For array fields, if we have a formKey, look for data under that key
			// Otherwise, look for data under the field name
			const sourceKey = config.formKey || field.name;
			const sourceData = initialValues?.[sourceKey as keyof typeof initialValues] || [];

			// Convert date strings to Date objects for array items if needed
			if (Array.isArray(sourceData)) {
				defaultValues[field.name] = sourceData.map((item: Record<string, unknown>) => {
					const convertedItem = { ...item };
					// Convert date fields to Date objects
					Object.entries(field.arrayItemSchema).forEach(([key, itemField]) => {
						if (itemField.type === 'date' && convertedItem[key]) {
							const val = convertedItem[key];
							convertedItem[key] = val instanceof Date ? val : new Date(val as string | number);
						}
					});
					return convertedItem;
				});
			} else {
				defaultValues[field.name] = [];
			}
		} else {
			defaultValues[field.name] =
				initialValues?.[field.name as keyof typeof initialValues] ||
				(field.type === 'slider' ? [field.min || 50] : field.type === 'date' ? new Date() : '');
		}
	});

	const form = useForm<Record<string, unknown>>({
		resolver: zodResolver(schema),
		defaultValues
	});

	const { control, watch, trigger } = form;

	// Register form validation with StepsBar
	const { registerForm, unregisterForm } = useFormValidation();

	useEffect(() => {
		if (formId) {
			registerForm(formId, async () => {
				const isValid = await trigger();
				return isValid;
			});

			return () => {
				unregisterForm(formId);
			};
		}
	}, [formId, registerForm, unregisterForm, trigger]);

	useEffect(() => {
		const subscription = watch(values => {
			if (config.formKey) {
				// For forms with formKey (array forms), extract the actual array data
				const arrayField = config.fields.find(field => field.isArray);
				if (arrayField && values[arrayField.name]) {
					onFieldChange?.(config.formKey, values[arrayField.name]);
				} else {
					// For non-array forms with formKey, send all form data
					onFieldChange?.(config.formKey, values);
				}
			} else {
				Object.entries(values).forEach(([key, value]) => {
					onFieldChange?.(key, value);
				});
			}
		});
		return () => subscription.unsubscribe();
	}, [watch, onFieldChange, config]);

	const renderSimpleField = (field: SimpleFieldConfig) => {
		const gridClass = field.gridColumn === 'full' ? 'col-span-full' : 'col-span-1';

		return (
			<div key={field.name} className={gridClass}>
				<FieldRenderer field={field} control={control} name={field.name} />
			</div>
		);
	};

	const renderArrayField = (field: ArrayFieldConfig) => {
		// useFieldArray requires a form type with array paths; we assert for this dynamic array field only.
		type FormWithArray = Record<string, Record<string, unknown>[]>;
		const { fields, append, remove } = useFieldArray<FormWithArray>({
			control: control as Control<FormWithArray>,
			name: field.name as FieldArrayPath<FormWithArray>
		});

		const addNewItem = () => {
			const newItem: Record<string, unknown> = {};
			Object.entries(field.arrayItemSchema).forEach(([key, itemField]) => {
				newItem[key] =
					itemField.type === 'slider' ? [itemField.min || 50] : itemField.type === 'date' ? new Date() : '';
			});
			append(newItem as Record<string, unknown>);
		};

		return (
			<div key={field.name} className="col-span-full space-y-6">
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
							{Object.entries(field.arrayItemSchema).map(([key, itemField]) => {
								const fieldName = `${field.name}.${index}.${key}`;
								const gridClass = itemField.gridColumn === 'full' ? 'col-span-full' : '';

								return (
									<div key={key} className={gridClass}>
										<FieldRenderer field={itemField} control={control} name={fieldName} />
									</div>
								);
							})}
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

	return (
		<>
			{/* Header */}
			<div className="mb-6">
				<div className="flex items-center gap-3 mb-3">
					<div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white">
						{config.header.icon}
					</div>
					<div>
						<h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-1">
							{config.header.title}
						</h3>
						<p className="text-slate-600 dark:text-slate-400">{config.header.description}</p>
					</div>
				</div>
			</div>

			{/* Form */}
			<Form {...form}>
				<div className="space-y-6">
					<div
						className={`grid grid-cols-1 gap-6 md:grid-cols-2 bg-slate-50 dark:bg-slate-800 rounded-lg p-6 ${config.containerClassName || ''}`}
					>
						{config.fields.map(field =>
							field.isArray ? renderArrayField(field) : renderSimpleField(field)
						)}
					</div>
				</div>
			</Form>
		</>
	);
};
