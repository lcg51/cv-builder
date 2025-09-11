'use client';

import React from 'react';
import { EducationIcon } from '@/ui/icons';
import { DynamicFormAdapter, type DynamicFormConfig } from './DynamicFormAdapter';
import { type StepsBarComponentProps } from '@/ui/components';

// Configuration for the Education form using the dynamic adapter
const educationFormConfig: DynamicFormConfig = {
	header: {
		title: 'Education',
		description: 'Add your educational background, starting with your most recent qualification',
		icon: <EducationIcon color="black" />
	},
	formKey: 'education', // This tells the adapter to send all form data under the 'education' key
	fields: [
		{
			name: 'educationForms',
			label: 'Education',
			type: 'text', // This is required but not used for array fields
			isArray: true,
			addButtonText: 'Add Another Education',
			itemTitle: (index: number) => `Education ${index + 1}`,
			arrayItemSchema: {
				university: {
					name: 'university',
					label: 'School/University',
					type: 'text',
					placeholder: 'Harvard University',
					required: true,
					minLength: 2,
					gridColumn: 'half'
				},
				degree: {
					name: 'degree',
					label: 'Degree',
					type: 'text',
					placeholder: 'Bachelor of Science',
					required: true,
					minLength: 2,
					gridColumn: 'half'
				},
				fieldOfStudy: {
					name: 'fieldOfStudy',
					label: 'Field of Study',
					type: 'text',
					placeholder: 'Computer Science',
					required: true,
					minLength: 2,
					gridColumn: 'half'
				},
				finishDate: {
					name: 'finishDate',
					label: 'Graduation Date',
					type: 'date',
					required: true,
					gridColumn: 'half'
				},
				city: {
					name: 'city',
					label: 'Location',
					type: 'text',
					placeholder: 'Cambridge, MA',
					required: true,
					minLength: 2,
					gridColumn: 'half'
				},
				description: {
					name: 'description',
					label: 'Description (Optional)',
					type: 'textarea',
					placeholder: 'Describe relevant coursework, achievements, or activities...',
					required: false,
					minLength: 2,
					gridColumn: 'full'
				}
			}
		}
	]
};

export type EducationFormProps = StepsBarComponentProps;

export const EducationForm: React.FC<EducationFormProps> = props => {
	return <DynamicFormAdapter config={educationFormConfig} {...props} />;
};
