import { format } from 'date-fns';
import { TemplateDataType } from '@/types/payload-types';

export const processTemplate = (templateHTML: string, userData: TemplateDataType): string => {
	if (!templateHTML || !userData) return '';

	return templateHTML
		.replace(/{{firstName}}/g, userData?.firstName || '')
		.replace(/{{lastName}}/g, userData?.lastName || '')
		.replace(/{{role}}/g, userData?.role || '')
		.replace(/{{city}}/g, userData?.city || '')
		.replace(/{{postalCode}}/g, userData?.postalCode || '')
		.replace(/{{phone}}/g, userData?.phone || '')
		.replace(/{{email}}/g, userData?.email || '')
		.replace(/{{aboutMe}}/g, userData?.aboutMe || '')
		.replace(/{{linkedin}}/g, userData?.linkedin || '')
		.replace(/{{github}}/g, userData?.github || '')
		.replace(/{{#each education}}([\s\S]*?){{\/each}}/g, (_, match) =>
			userData.education
				.map(edu =>
					match
						.replace(/{{degree}}/g, edu.degree)
						.replace(/{{university}}/g, edu.university)
						.replace(/{{city}}/g, edu.city)
						.replace(/{{finishDate}}/g, format(edu.finishDate, 'PPP'))
						.replace(/{{description}}/g, edu.description)
				)
				.join('')
		)
		.replace(/{{#each skills}}([\s\S]*?){{\/each}}/g, (_, match) =>
			userData.skills
				.map(skill => match.replace(/{{title}}/g, skill.title).replace(/{{level}}/g, skill.level[0].toString()))
				.join('')
		)
		.replace(/{{#each workExperience}}([\s\S]*?){{\/each}}/g, (_, match) =>
			userData.workExperience
				.map(exp =>
					match
						.replace(/{{company}}/g, exp.company)
						.replace(/{{startDate}}/g, `${format(exp.startDate, 'MMM')} ${format(exp.startDate, 'yyyy')}`)
						.replace(/{{endDate}}/g, `${format(exp.endDate, 'MMM')} ${format(exp.endDate, 'yyyy')}`)
						.replace(/{{location}}/g, exp.location)
						.replace(/{{jobTitle}}/g, exp.jobTitle)
						.replace(/{{description}}/g, exp.description)
				)
				.join('')
		);
};

/**
 * Compile a Handlebars template once and return a function that can be reused
 * This avoids recompiling the template on every data change
 */
export const compileHandlebarsTemplate = async (
	templateId: string
): Promise<{ template: (userData: TemplateDataType) => string; css: string }> => {
	try {
		// Import the Handlebars processor
		const { compileCompleteHandlebarsTemplate } = await import('@/lib/handlebarsProcessor');

		// Compile the Handlebars template once
		return await compileCompleteHandlebarsTemplate(templateId);
	} catch (error) {
		console.error(`Error compiling Handlebars template ${templateId}:`, error);
		throw new Error(
			`Failed to compile Handlebars template ${templateId}: ${error instanceof Error ? error.message : 'Unknown error'}`
		);
	}
};
