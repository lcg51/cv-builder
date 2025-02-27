'use client';

import React, { useState, useCallback } from 'react';
import { WorkExperienceType } from '@/app/models/user';
import { ExperienceForm } from './ExperienceForm';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';

export type ExperienceProps = {
	onSuccess?: () => void;
	onFieldChange?: (key: string, value: unknown) => void;
};

export const Experience = ({ onSuccess, onFieldChange }: ExperienceProps) => {
	const [experienceForms, setExperienceForms] = useState<number[]>([]);

	const addExperienceForm = () => {
		setExperienceForms(prevForms => [...prevForms, prevForms.length]);
	};

	const handleFormChange = useCallback(
		(index: string, value: WorkExperienceType) => {
			const updatedValues = experienceForms.map(formIndex => (formIndex === parseInt(index) ? value : {}));
			onFieldChange?.('workExperience', updatedValues);
		},
		[experienceForms, onFieldChange]
	);

	const removeExperienceForm = (index: number) => {
		setExperienceForms(prevForms => prevForms.filter((_, i) => i !== index));
	};

	return (
		<div>
			<h3 className="pb-8">Tell us about the experience</h3>
			{experienceForms.map((formIndex, index) => (
				<div key={formIndex} className="relative">
					<ExperienceForm
						onFormChange={value => handleFormChange(index.toString(), value)}
						onSuccess={onSuccess}
					/>
					<Button
						variant="destructive"
						className="absolute top-[-20px] right-0"
						onClick={() => removeExperienceForm(index)}
					>
						<Trash />
					</Button>
				</div>
			))}
			<Button className="mt-4" onClick={addExperienceForm}>
				Add Experience
			</Button>
		</div>
	);
};
