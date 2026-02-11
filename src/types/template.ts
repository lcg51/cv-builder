/**
 * Template Data Type Definitions
 * Generated from Payload CMS backend
 */

export type SkillType = {
	title: string;
	level: number[];
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

export type TemplateDataType = {
	firstName: string;
	lastName: string;
	aboutMe: string;
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

/**
 * Available Handlebars variables for templates
 */
export const USER_DATA_KEYS = [
	'firstName',
	'lastName',
	'aboutMe',
	'role',
	'city',
	'postalCode',
	'phone',
	'email',
	'linkedin',
	'github',
	'education',
	'workExperience',
	'skills'
] as const;

export type UserDataKey = (typeof USER_DATA_KEYS)[number];
