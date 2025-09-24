'use client';

import React, { useMemo } from 'react';
import { EducationIcon } from '@/ui/icons';
import { DynamicFormAdapter, type DynamicFormConfig } from './DynamicFormAdapter';
import { type StepsBarComponentProps } from '@/ui/components';
import { useTranslations } from 'next-intl';

export type EducationFormProps = StepsBarComponentProps;

export const EducationForm: React.FC<EducationFormProps> = props => {
	const $t = useTranslations('EducationForm');
	// Configuration for the Education form using the dynamic adapter
	const educationFormConfig: DynamicFormConfig = useMemo(
		() => ({
			header: {
				title: $t('title'),
				description: $t('description'),
				icon: <EducationIcon color="black" />
			},
			formKey: 'education', // This tells the adapter to send all form data under the 'education' key
			fields: [
				{
					name: 'educationForms',
					label: $t('title'),
					type: 'text', // This is required but not used for array fields
					isArray: true,
					addButtonText: $t('button'),
					itemTitle: (index: number) => `${$t('title')} ${index + 1}`,
					arrayItemSchema: {
						university: {
							name: 'university',
							label: $t('fields.university'),
							type: 'text',
							placeholder: 'Harvard University',
							required: true,
							minLength: 2,
							gridColumn: 'half'
						},
						degree: {
							name: 'degree',
							label: $t('fields.degree'),
							type: 'text',
							placeholder: 'Bachelor of Science',
							required: true,
							minLength: 2,
							gridColumn: 'half'
						},
						fieldOfStudy: {
							name: 'fieldOfStudy',
							label: $t('fields.fieldOfStudy'),
							type: 'text',
							placeholder: 'Computer Science',
							required: true,
							minLength: 2,
							gridColumn: 'half'
						},
						finishDate: {
							name: 'finishDate',
							label: $t('fields.finishDate'),
							type: 'date',
							required: true,
							gridColumn: 'half'
						},
						city: {
							name: 'city',
							label: $t('fields.city'),
							type: 'text',
							placeholder: 'Cambridge, MA',
							required: true,
							minLength: 2,
							gridColumn: 'half'
						},
						description: {
							name: 'description',
							label: $t('fields.description'),
							type: 'textarea',
							placeholder: 'Describe relevant coursework, achievements, or activities...',
							required: false,
							minLength: 2,
							gridColumn: 'full'
						}
					}
				}
			]
		}),
		[$t]
	);

	return <DynamicFormAdapter config={educationFormConfig} {...props} />;
};
