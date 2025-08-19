import { TemplateV2 } from '@/app/components/TemplateV2';
import { useTemplatesV2 } from '@/hooks/useTemplatesV2';

export const HomeTemplatesV2 = () => {
	const { templates } = useTemplatesV2({ isHomePage: true });
	return (
		<div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
			{templates.map((template, index) => (
				<TemplateV2 key={index} template={template} />
			))}
		</div>
	);
};
