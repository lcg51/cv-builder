'use client';
import { StepsBar, StepsBarItemsProps } from '@/app/components/StepsBar.tsx/StepsBar';
import { ContactForm } from '../components/ContactForm';
import { ExperienceForm } from '../components/ExperienceForm';
import { EducationForm } from '../components/EducationForm';
import { useState } from 'react';

export default function CreateResume() {
	const [items, setItems] = useState<StepsBarItemsProps[]>([
		{ title: 'Contact', active: true, component: ContactForm },
		{ title: 'Experience', active: false, component: ExperienceForm },
		{ title: 'Education', active: false, component: EducationForm },
		{ title: 'Skills', active: false, component: ContactForm },
		{ title: 'About', active: false, component: ContactForm },
		{ title: 'Finish it', active: false, component: ContactForm }
	]);

	const updateItems = (newItems: StepsBarItemsProps[]) => {
		setItems(newItems);
	};

	return (
		<div className="flex flex-1 flex-col">
			<StepsBar items={items} onNextStepCallback={updateItems} />
		</div>
	);
}
