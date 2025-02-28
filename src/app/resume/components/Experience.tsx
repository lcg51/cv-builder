'use client';

import React, { useState, useCallback } from 'react';
import { WorkExperienceType } from '@/app/models/user';
import { ExperienceForm } from './ExperienceForm';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { StepsBarComponentProps } from '@/app/components/StepsBar/StepsBar';

export type ExperienceProps = StepsBarComponentProps;

export const Experience = ({ initialValues, onSuccess, onFieldChange }: ExperienceProps) => {
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
			<div className="mb-4">
				<h3 className="pb-2">Tell us about the experience</h3>
				<p className="text-sm text-gray-500">Start with your last work experience</p>
			</div>
			<div>
				{experienceForms.map((formIndex, index) => (
					<div key={formIndex} className="relative">
						<ExperienceForm
							onFormChange={value => handleFormChange(index.toString(), value)}
							onSuccess={onSuccess}
							experienceForm={initialValues?.workExperience[index]}
						/>
						<span
							className="absolute top-[-20px] right-0 cursor-pointer"
							onClick={() => removeExperienceForm(index)}
						>
							<Trash color="red" />
						</span>
					</div>
				))}

				<label className="block text-sm text-gray-500">
					In this section, list related employment experience in your last 10 years along with the dates.
					Mention the most recent employment first.
				</label>
				<Button className="mt-4 mb-4" onClick={addExperienceForm}>
					Add Experience
				</Button>
			</div>

			<div className="flex justify-end">
				<Button type="submit">Next Step</Button>
			</div>
		</div>
	);
};
