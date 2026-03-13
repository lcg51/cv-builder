'use client';

import React, { useMemo } from 'react';
import { ExperienceIcon } from '@/ui/icons';
import { DynamicFormAdapter, type DynamicFormConfig } from './DynamicFormAdapter';
import { type StepsBarComponentProps } from '@/ui/components';
import { useTranslations } from 'next-intl';

export type ExperienceFormProps = StepsBarComponentProps;

export const ExperienceForm: React.FC<ExperienceFormProps> = props => {
	const $t = useTranslations('ExperienceForm');

	const experienceFormConfig: DynamicFormConfig = useMemo(
		() => ({
			header: {
				title: $t('title'),
				description: $t('description'),
				icon: <ExperienceIcon color="black" />
			},
			formKey: 'workExperience', // This tells the adapter to send all form data under the 'workExperience' key
			fields: [
				{
					name: 'experienceForms',
					label: $t('title'),
					type: 'text', // This is required but not used for array fields
					isArray: true,
					addButtonText: $t('button'),
					itemTitle: (index: number) => `${$t('title')} ${index + 1}`,
					arrayItemSchema: {
						jobTitle: {
							name: 'jobTitle',
							label: $t('fields.jobTitle'),
							type: 'text',
							placeholder: 'Software Engineer',
							required: true,
							minLength: 2,
							gridColumn: 'half'
						},
						company: {
							name: 'company',
							label: $t('fields.company'),
							type: 'text',
							placeholder: 'Google',
							required: true,
							minLength: 2,
							gridColumn: 'half'
						},
						startDate: {
							name: 'startDate',
							label: $t('fields.startDate'),
							type: 'date',
							required: true,
							gridColumn: 'half'
						},
						endDate: {
							name: 'endDate',
							label: $t('fields.endDate'),
							type: 'date',
							required: true,
							gridColumn: 'half'
						},
						location: {
							name: 'location',
							label: $t('fields.location'),
							type: 'text',
							placeholder: 'San Francisco, CA',
							required: true,
							minLength: 2,
							gridColumn: 'half'
						},
						description: {
							name: 'description',
							label: $t('fields.description'),
							type: 'textarea',
							placeholder: 'Describe your key responsibilities and achievements in this role...',
							required: true,
							minLength: 2,
							gridColumn: 'full',
							aiAssist: { type: 'improve-description' as const }
						}
					}
				}
			]
		}),
		[$t]
	);

	return <DynamicFormAdapter config={experienceFormConfig} {...props} />;
};
