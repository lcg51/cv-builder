'use client';

import React from 'react';
import { SkillsIcon } from '@/ui/icons';
import { DynamicFormAdapter, type DynamicFormConfig } from './DynamicFormAdapter';
import { type StepsBarComponentProps } from '@/ui/components';

// Configuration for the Skills form using the dynamic adapter
const skillsFormConfig: DynamicFormConfig = {
	header: {
		title: 'Skills & Expertise',
		description: 'Add your key skills and rate your proficiency level for each',
		icon: <SkillsIcon color="black" />
	},
	formKey: 'skills', // This tells the adapter to send all form data under the 'skills' key
	fields: [
		{
			name: 'skillsForms',
			label: 'Skills',
			type: 'text', // This is required but not used for array fields
			isArray: true,
			addButtonText: 'Add Another Skill',
			itemTitle: (index: number) => `Skill ${index + 1}`,
			arrayItemSchema: {
				title: {
					name: 'title',
					label: 'Skill Name',
					type: 'text',
					placeholder: 'JavaScript',
					required: true,
					minLength: 2,
					gridColumn: 'half'
				},
				level: {
					name: 'level',
					label: 'Proficiency Level',
					type: 'slider',
					min: 0,
					max: 100,
					step: 5,
					required: true,
					gridColumn: 'half'
				}
			}
		}
	]
};

export type SkillsFormProps = StepsBarComponentProps;

export const SkillsForm: React.FC<SkillsFormProps> = props => {
	return <DynamicFormAdapter config={skillsFormConfig} {...props} />;
};
