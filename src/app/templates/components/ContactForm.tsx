'use client';

import React from 'react';
import { ContactIcon } from '@/ui/icons/FormIcons';
import { DynamicFormAdapter, type DynamicFormConfig } from './DynamicFormAdapter';
import { type StepsBarComponentProps } from '@/ui/components';

// Configuration for the Contact form using the dynamic adapter
const contactFormConfig: DynamicFormConfig = {
	header: {
		title: 'Contact Information',
		description: 'Tell us about yourself and how to reach you',
		icon: <ContactIcon color="black" />
	},
	fields: [
		{
			name: 'firstName',
			label: 'First Name',
			type: 'text',
			placeholder: 'John',
			required: true,
			minLength: 2,
			gridColumn: 'half'
		},
		{
			name: 'lastName',
			label: 'Last Name',
			type: 'text',
			placeholder: 'Doe',
			required: true,
			minLength: 2,
			gridColumn: 'half'
		},
		{
			name: 'email',
			label: 'Email Address',
			type: 'email',
			placeholder: 'john.doe@example.com',
			required: true,
			minLength: 2,
			gridColumn: 'half'
		},
		{
			name: 'phone',
			label: 'Phone Number',
			type: 'tel',
			placeholder: '+1 (555) 123-4567',
			required: true,
			minLength: 2,
			gridColumn: 'half'
		},
		{
			name: 'city',
			label: 'City',
			type: 'text',
			placeholder: 'New York',
			required: true,
			minLength: 2,
			gridColumn: 'half'
		},
		{
			name: 'postalCode',
			label: 'Postal Code',
			type: 'text',
			placeholder: '10001',
			required: true,
			minLength: 2,
			gridColumn: 'half'
		}
	]
};

export type ContactFormProps = StepsBarComponentProps;

export const ContactForm: React.FC<ContactFormProps> = props => {
	return <DynamicFormAdapter config={contactFormConfig} {...props} />;
};
