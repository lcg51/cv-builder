'use client';

import React from 'react';
import { ExperienceIcon } from '@/ui/icons';
import { DynamicFormAdapter, type DynamicFormConfig } from './DynamicFormAdapter';
import { type StepsBarComponentProps } from '@/ui/components';

// Configuration for the Experience form using the dynamic adapter
const experienceFormConfig: DynamicFormConfig = {
	header: {
		title: 'Work Experience',
		description: 'Add your professional experience, starting with your most recent position',
		icon: <ExperienceIcon color="black" />
	},
	formKey: 'workExperience', // This tells the adapter to send all form data under the 'workExperience' key
	fields: [
		{
			name: 'experienceForms',
			label: 'Experience',
			type: 'text', // This is required but not used for array fields
			isArray: true,
			addButtonText: 'Add Another Experience',
			itemTitle: (index: number) => `Experience ${index + 1}`,
			arrayItemSchema: {
				jobTitle: {
					name: 'jobTitle',
					label: 'Job Title',
					type: 'text',
					placeholder: 'Software Engineer',
					required: true,
					minLength: 2,
					gridColumn: 'half'
				},
				company: {
					name: 'company',
					label: 'Company',
					type: 'text',
					placeholder: 'Google',
					required: true,
					minLength: 2,
					gridColumn: 'half'
				},
				startDate: {
					name: 'startDate',
					label: 'Start Date',
					type: 'date',
					required: true,
					gridColumn: 'half'
				},
				endDate: {
					name: 'endDate',
					label: 'End Date',
					type: 'date',
					required: true,
					gridColumn: 'half'
				},
				location: {
					name: 'location',
					label: 'Location',
					type: 'text',
					placeholder: 'San Francisco, CA',
					required: true,
					minLength: 2,
					gridColumn: 'half'
				},
				description: {
					name: 'description',
					label: 'Job Description',
					type: 'textarea',
					placeholder: 'Describe your key responsibilities and achievements in this role...',
					required: true,
					minLength: 2,
					gridColumn: 'full'
				}
			}
		}
	]
};

export type ExperienceFormProps = StepsBarComponentProps;

export const ExperienceForm: React.FC<ExperienceFormProps> = props => {
	return <DynamicFormAdapter config={experienceFormConfig} {...props} />;
};
