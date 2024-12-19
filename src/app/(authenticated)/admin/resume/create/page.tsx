'use client';
import { ContactForm } from '../components/ContactForm';
import { ExperienceForm } from '../components/ExperienceForm';
import { StepsBar } from '../components/StepsBar.tsx/StepsBar';

export default function CreateResume() {
	const items = [
		{ title: 'Contact', active: true, component: ContactForm },
		{ title: 'Experience', active: true, component: ExperienceForm },
		{ title: 'Education', active: false, component: ContactForm },
		{ title: 'Skills', active: true, component: ContactForm },
		{ title: 'About', active: false, component: ContactForm },
		{ title: 'Finish it', active: false, component: ContactForm }
	];

	return (
		<div className="flex flex-1 flex-col">
			<StepsBar items={items} />
		</div>
	);
}
