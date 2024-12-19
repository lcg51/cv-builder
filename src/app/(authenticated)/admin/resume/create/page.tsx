'use client';
import { CreateForm } from '../components/CreateForm';
import { StepsBar } from '../components/StepsBar.tsx/StepsBar';

export default function CreateResume() {
	const items = [
		{ title: 'Contact', active: true },
		{ title: 'Experience', active: true },
		{ title: 'Education', active: false },
		{ title: 'Skills', active: true },
		{ title: 'About', active: false },
		{ title: 'Finish it', active: false }
	];

	return (
		<div className="flex flex-1 flex-col">
			<StepsBar items={items} />
			<CreateForm />
		</div>
	);
}
