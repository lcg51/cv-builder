'use client';

import React from 'react';
import { z } from 'zod';
import { AboutIcon } from '@/ui/icons/FormIcons';
import { DynamicFormAdapter, type DynamicFormConfig } from './DynamicFormAdapter';
import { type StepsBarComponentProps } from '@/ui/components';

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
			message: 'Please enter a valid GitHub URL (must contain github.com) or leave empty'
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
			message: 'Please enter a valid LinkedIn URL (must contain linkedin.com) or leave empty'
		}
	)
	.optional()
	.or(z.literal(''));

// Configuration for the About form using the dynamic adapter
const aboutFormConfig: DynamicFormConfig = {
	header: {
		title: 'Professional Summary',
		description: 'Write a brief summary that highlights your key achievements and career goals',
		icon: <AboutIcon color="black" />
	},
	fields: [
		{
			name: 'aboutMe',
			label: 'Professional Summary',
			type: 'textarea',
			placeholder:
				'I am a passionate software engineer with 5+ years of experience in full-stack development. I specialize in building scalable web applications using modern technologies and frameworks. My goal is to create innovative solutions that drive business growth and enhance user experiences.',
			required: true,
			minLength: 2,
			gridColumn: 'full',
			helpText:
				'Tip: Keep it concise and highlight your most relevant skills and achievements (2-3 sentences recommended)'
		},
		{
			name: 'github',
			label: 'GitHub Profile',
			type: 'url',
			placeholder: 'https://github.com/yourusername',
			required: false,
			validation: githubValidation,
			gridColumn: 'full',
			helpText: 'Tip: Include your full GitHub profile URL to showcase your projects and contributions'
		},
		{
			name: 'linkedin',
			label: 'LinkedIn Profile',
			type: 'url',
			placeholder: 'https://linkedin.com/in/yourusername',
			required: false,
			validation: linkedinValidation,
			gridColumn: 'full',
			helpText: 'Tip: Include your full LinkedIn profile URL to connect with potential employers'
		}
	]
};

export type AboutFormProps = StepsBarComponentProps;

export const AboutForm: React.FC<AboutFormProps> = props => {
	return <DynamicFormAdapter config={aboutFormConfig} {...props} />;
};
