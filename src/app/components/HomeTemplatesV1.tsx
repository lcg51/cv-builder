import { Template } from '@/app/components/Template';
import { useTemplates } from '@/hooks/useTemplates';

export const HomeTemplatesV1 = () => {
	const { templates } = useTemplates({ isHomePage: true });
	return (
		<div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
			{templates.map((template, index) => (
				<Template key={index} template={template} />
			))}
		</div>
	);
};
