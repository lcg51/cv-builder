import { format } from 'date-fns';
import { UserDataType } from '@/app/models/user';

export const processTemplate = (templateHTML: string, userData: UserDataType): string => {
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
