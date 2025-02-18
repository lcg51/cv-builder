export type SkillType = {
	category: string;
	description: string;
};

export type WorkExperienceType = {
	company: string;
	role: string;
	startDate: string;
	endDate: string;
	location: string;
	description: string;
};

export type EducationType = {
	degree: string;
	university: string;
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
	education: EducationType;
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
	education: {
		degree: 'Bachelor of Science in Computer Science',
		university: 'University of California, Berkeley'
	},
	workExperience: [
		{
			company: 'Google',
			role: 'Software Engineer',
			startDate: 'Jan 2020',
			endDate: 'Present',
			location: 'Mountain View, CA',
			description: 'Worked on the Google Search team to improve search results for users.'
		},
		{
			company: 'Facebook',
			role: 'Software Engineer Intern',
			startDate: 'May 2019',
			endDate: 'Aug 2019',
			location: 'Menlo Park, CA',
			description: 'Developed new features for the Facebook app using React Native.'
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
