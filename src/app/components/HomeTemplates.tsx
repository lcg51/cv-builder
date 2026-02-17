'use client';
import { Template } from './Template';
import { useTemplates } from '@/hooks/useTemplates';

export const HomeTemplates = () => {
	const { templates } = useTemplates({ isHomePage: true });
	return (
		<div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
			{templates.map((template, index) => (
				<Template key={index} template={template} />
			))}
		</div>
	);
};
