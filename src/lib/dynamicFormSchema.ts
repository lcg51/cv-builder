import { z } from 'zod';
import type { TemplateDataType } from '@/types/payload-types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

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

export function createFieldSchema(field: BaseFieldConfig): z.ZodSchema<unknown> {
	if (field.validation) return field.validation;

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
	}

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

export function createZodSchema(fields: FieldConfig[]): z.ZodSchema<Record<string, unknown>> {
	const schemaObject: Record<string, z.ZodSchema<unknown>> = {};

	fields.forEach(field => {
		if (field.isArray) {
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

export function buildDefaultValues(
	fields: FieldConfig[],
	formKey: string | undefined,
	initialValues: TemplateDataType | undefined
): Record<string, unknown> {
	const defaults: Record<string, unknown> = {};

	fields.forEach(field => {
		if (field.isArray) {
			const sourceKey = formKey || field.name;
			const sourceData = initialValues?.[sourceKey as keyof typeof initialValues] || [];

			defaults[field.name] = Array.isArray(sourceData)
				? sourceData.map((item: Record<string, unknown>) => {
						const converted = { ...item };
						Object.entries(field.arrayItemSchema).forEach(([key, itemField]) => {
							if (itemField.type === 'date' && converted[key]) {
								const val = converted[key];
								converted[key] = val instanceof Date ? val : new Date(val as string | number);
							}
						});
						return converted;
					})
				: [];
		} else {
			defaults[field.name] =
				initialValues?.[field.name as keyof typeof initialValues] ||
				(field.type === 'slider' ? [field.min || 50] : field.type === 'date' ? new Date() : '');
		}
	});

	return defaults;
}
