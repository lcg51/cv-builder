'use client';

import type { ReactNode } from 'react';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useFormValidation } from '@/hooks/useFormValidation';
import { type StepsBarComponentProps } from '@/ui/components';
import { type FieldConfig, type SchemaTranslator, createZodSchema, buildDefaultValues } from '@/lib/dynamicFormSchema';

export interface FormHeader {
	title: string;
	description: string;
	icon: ReactNode;
}

export interface DynamicFormConfig {
	header: FormHeader;
	fields: FieldConfig[];
	formKey?: string;
	containerClassName?: string;
}

interface UseDynamicFormProps extends StepsBarComponentProps {
	config: DynamicFormConfig;
}

export function useDynamicForm({ config, initialValues, onFieldChange, formId }: UseDynamicFormProps) {
	const $t = useTranslations('validation') as unknown as SchemaTranslator;
	const schema = useMemo(() => createZodSchema(config.fields, $t), [config.fields, $t]);
	const defaultValues = useMemo(() => buildDefaultValues(config.fields, config.formKey, initialValues), []);

	if (process.env.NODE_ENV === 'development' && config.formKey) {
		console.log(`[DynamicFormAdapter] ${config.formKey} - Initial values:`, initialValues);
	}

	const form = useForm<Record<string, unknown>>({ resolver: zodResolver(schema), defaultValues });
	const { control, watch, trigger } = form;
	const { registerForm, unregisterForm } = useFormValidation();

	useEffect(() => {
		if (!formId) return;
		registerForm(formId, () => trigger());
		return () => unregisterForm(formId);
	}, [formId, registerForm, unregisterForm, trigger]);

	useEffect(() => {
		const subscription = watch(values => {
			if (config.formKey) {
				const arrayField = config.fields.find(f => f.isArray);
				if (arrayField && values[arrayField.name]) {
					onFieldChange?.(config.formKey, values[arrayField.name]);
				} else {
					onFieldChange?.(config.formKey, values);
				}
			} else {
				Object.entries(values).forEach(([key, value]) => onFieldChange?.(key, value));
			}
		});
		return () => subscription.unsubscribe();
	}, [watch, onFieldChange, config]);

	return { form, control };
}
