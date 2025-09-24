'use client';

import React, { useMemo } from 'react';
import { SkillsIcon } from '@/ui/icons';
import { DynamicFormAdapter, type DynamicFormConfig } from './DynamicFormAdapter';
import { type StepsBarComponentProps } from '@/ui/components';
import { useTranslations } from 'next-intl';

export type SkillsFormProps = StepsBarComponentProps;

export const SkillsForm: React.FC<SkillsFormProps> = props => {
	const $t = useTranslations('SkillsForm');

	const skillsFormConfig: DynamicFormConfig = useMemo(
		() => ({
			header: {
				title: $t('title'),
				description: $t('description'),
				icon: <SkillsIcon color="black" />
			},
			formKey: 'skills', // This tells the adapter to send all form data under the 'skills' key
			fields: [
				{
					name: 'skillsForms',
					label: $t('title'),
					type: 'text', // This is required but not used for array fields
					isArray: true,
					addButtonText: $t('button'),
					itemTitle: (index: number) => `${$t('title')} ${index + 1}`,
					arrayItemSchema: {
						title: {
							name: 'title',
							label: $t('fields.title'),
							type: 'text',
							placeholder: 'JavaScript',
							required: true,
							minLength: 2,
							gridColumn: 'half'
						},
						level: {
							name: 'level',
							label: $t('fields.level'),
							type: 'slider',
							min: 0,
							max: 100,
							step: 5,
							required: true,
							gridColumn: 'half',
							sliderConfig: {
								labels: [
									$t('skillLevels.beginner'),
									$t('skillLevels.intermediate'),
									$t('skillLevels.expert')
								],
								showValue: true,
								valueFormat: (value: number) => `${value}%`
							}
						}
					}
				}
			]
		}),
		[$t]
	);
	return <DynamicFormAdapter config={skillsFormConfig} {...props} />;
};
