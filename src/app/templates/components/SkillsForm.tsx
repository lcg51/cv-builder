'use client';

import React, { useMemo } from 'react';
import { SkillsIcon, PlusIcon } from '@/ui/icons';
import { ChipButton } from '@/ui/components';
import { DynamicFormAdapter, type DynamicFormConfig } from './DynamicFormAdapter';
import { type StepsBarComponentProps } from '@/ui/components';
import { useTranslations } from 'next-intl';

export type SkillsFormProps = StepsBarComponentProps;

type SkillItem = { title: string; level: number[] };

const SUGGESTED_SKILLS = [
	'JavaScript',
	'TypeScript',
	'React',
	'Node.js',
	'Python',
	'SQL',
	'Git',
	'Docker',
	'CSS',
	'HTML'
];

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
					itemTitle: (index, values: SkillItem) => values.title || `${$t('title')} ${index + 1}`,
					headerSection: addItem => (
						<div className="space-y-2">
							<p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
								{$t('suggestedSkillsLabel')}
							</p>
							<div className="flex flex-wrap gap-2">
								{SUGGESTED_SKILLS.map(skill => (
									<ChipButton
										key={skill}
										label={skill}
										icon={<PlusIcon className="w-3 h-3" />}
										onClick={() => addItem(skill)}
									/>
								))}
							</div>
						</div>
					),
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
