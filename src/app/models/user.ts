export type SkillType = {
	category: string;
	description: string;
};

export type WorkExperienceType = {
	company: string;
	jobTitle: string;
	startDate: Date;
	endDate: Date;
	location: string;
	description: string;
};

export type EducationType = {
	degree: string;
	university: string;
	fieldOfStudy: string;
	finishDate: Date;
	city: string;
	description: string;
};

export type UserDataType = {
	firstName: string;
	lastName: string;
	role: string;
	city: string;
	postalCode: string;
	phone: string;
	email: string;
	linkedin: string;
	github: string;
	education: Array<EducationType>;
	workExperience: Array<WorkExperienceType>;
	skills: Array<SkillType>;
};

export const defaultUserData: UserDataType = {
	firstName: 'John',
	lastName: 'Doe',
	role: 'Software Engineer',
	city: 'San Francisco, CA',
	postalCode: '94102',
	phone: '123-456-7890',
	email: 'johndoe@gmail.com',
	linkedin: 'https://www.linkedin.com/in/johndoe',
	github: 'https://www.github.com/johndoe',
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
	skills: [
		{
			category: 'Programming Languages',
			description: 'JavaScript, Python, Java, C++'
		},
		{
			category: 'Web Technologies',
			description: 'HTML, CSS, React, Node.js'
		}
	]
};
