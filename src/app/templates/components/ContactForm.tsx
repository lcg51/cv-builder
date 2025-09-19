'use client';

import React, { useMemo } from 'react';
import { ContactIcon } from '@/ui/icons/FormIcons';
import { DynamicFormAdapter, type DynamicFormConfig } from './DynamicFormAdapter';
import { type StepsBarComponentProps } from '@/ui/components';
import { useTranslations } from 'next-intl';

export type ContactFormProps = StepsBarComponentProps;

export const ContactForm: React.FC<ContactFormProps> = props => {
	const $t = useTranslations('ContactForm');

	// Configuration for the Contact form using the dynamic adapter
	const contactFormConfig: DynamicFormConfig = useMemo(
		() => ({
			header: {
				title: $t('title'),
				description: $t('description'),
				icon: <ContactIcon color="black" />
			},
			fields: [
				{
					name: 'firstName',
					label: $t('fields.firstName'),
					type: 'text',
					placeholder: 'John',
					required: true,
					minLength: 2,
					gridColumn: 'half'
				},
				{
					name: 'lastName',
					label: $t('fields.lastName'),
					type: 'text',
					placeholder: 'Doe',
					required: true,
					minLength: 2,
					gridColumn: 'half'
				},
				{
					name: 'email',
					label: $t('fields.email'),
					type: 'email',
					placeholder: 'john.doe@example.com',
					required: true,
					minLength: 2,
					gridColumn: 'half'
				},
				{
					name: 'phone',
					label: $t('fields.phone'),
					type: 'tel',
					placeholder: '+1 (555) 123-4567',
					required: true,
					minLength: 2,
					gridColumn: 'half'
				},
				{
					name: 'city',
					label: $t('fields.city'),
					type: 'text',
					placeholder: 'New York',
					required: true,
					minLength: 2,
					gridColumn: 'half'
				},
				{
					name: 'postalCode',
					label: $t('fields.postalCode'),
					type: 'text',
					placeholder: '10001',
					required: true,
					minLength: 2,
					gridColumn: 'half'
				}
			]
		}),
		[$t]
	);

	return <DynamicFormAdapter config={contactFormConfig} {...props} />;
};
