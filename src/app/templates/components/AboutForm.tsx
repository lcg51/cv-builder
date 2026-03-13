'use client';

import React, { useMemo } from 'react';
import { z } from 'zod';
import { AboutIcon } from '@/ui/icons/FormIcons';
import { DynamicFormAdapter, type DynamicFormConfig } from './DynamicFormAdapter';
import { type StepsBarComponentProps } from '@/ui/components';
import { useTranslations } from 'next-intl';

export type AboutFormProps = StepsBarComponentProps;

export const AboutForm: React.FC<AboutFormProps> = props => {
	const $t = useTranslations('AboutForm');

	// Custom validation schemas for GitHub and LinkedIn URLs
	const githubValidation = z
		.string()
		.refine(
			url => {
				if (url === '') return true; // Allow empty string
				try {
					new URL(url); // Check if it's a valid URL
					return url.includes('github.com');
				} catch {
					return false;
				}
			},
			{
				message: $t('fields.github.validation')
			}
		)
		.optional()
		.or(z.literal(''));

	const linkedinValidation = z
		.string()
		.refine(
			url => {
				if (url === '') return true; // Allow empty string
				try {
					new URL(url); // Check if it's a valid URL
					return url.includes('linkedin.com');
				} catch {
					return false;
				}
			},
			{
				message: $t('fields.linkedin.validation')
			}
		)
		.optional()
		.or(z.literal(''));

	const aboutFormConfig: DynamicFormConfig = useMemo(
		() => ({
			header: {
				title: $t('title'),
				description: $t('description'),
				icon: <AboutIcon color="black" />
			},
			fields: [
				{
					name: 'aboutMe',
					label: $t('fields.aboutMe.label'),
					type: 'textarea',
					placeholder: $t('fields.aboutMe.placeholder'),
					required: true,
					minLength: 2,
					gridColumn: 'full',
					helpText: $t('fields.aboutMe.helpText'),
					aiAssist: { type: 'improve-summary' }
				},
				{
					name: 'github',
					label: $t('fields.github.label'),
					type: 'url',
					placeholder: $t('fields.github.placeholder'),
					required: false,
					validation: githubValidation,
					gridColumn: 'full',
					helpText: $t('fields.github.helpText')
				},
				{
					name: 'linkedin',
					label: $t('fields.linkedin.label'),
					type: 'url',
					placeholder: $t('fields.linkedin.placeholder'),
					required: false,
					validation: linkedinValidation,
					gridColumn: 'full',
					helpText: $t('fields.linkedin.helpText')
				}
			]
		}),
		[$t]
	);

	return <DynamicFormAdapter config={aboutFormConfig} {...props} />;
};
