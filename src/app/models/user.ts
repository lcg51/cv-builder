// Re-export types from the API-generated template types
export type { SkillType, WorkExperienceType, EducationType, TemplateDataType } from '@/types/payload-types';
import { TemplateDataType } from '@/types/payload-types';

export const defaultUserData: TemplateDataType = {
	firstName: 'John',
	lastName: 'Doe',
	role: 'Software Engineer',
	city: 'San Francisco, CA',
	postalCode: '94102',
	phone: '123-456-7890',
	email: 'johndoe@gmail.com',
	linkedin: 'https://www.linkedin.com/in/johndoe',
	github: 'https://www.github.com/johndoe',
	aboutMe: 'I am a software engineer with a passion for building web applications.',
	profileImage: '',
	education: [
		{
			degree: 'Bachelor of Science in Computer Science',
			university: 'University of California, Berkeley',
			fieldOfStudy: 'Computer Science',
			finishDate: new Date(),
			city: 'Berkeley, CA',
			description: 'Graduated with honors.'
		}
	],
	workExperience: [
		{
			company: 'Google',
			jobTitle: 'Software Engineer',
			startDate: new Date(),
			endDate: new Date(),
			location: 'Mountain View, CA',
			description: 'Worked on the Google Search team to improve search results for users.'
		}
	],
	skills: []
};
