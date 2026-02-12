export type SkillType = {
	title: string;
	level: number[];
};

export type WorkExperienceType = {
	company: string;
	jobTitle: string;
	startDate: Date | string;
	endDate: Date | string;
	location: string;
	description: string;
};

export type EducationType = {
	degree: string;
	university: string;
	fieldOfStudy: string;
	finishDate: Date | string;
	city: string;
	description: string;
};

export type TemplateDataType = {
	firstName: string;
	lastName: string;
	role: string;
	city: string;
	postalCode: string;
	phone: string;
	email: string;
	linkedin: string;
	github: string;
	aboutMe: string;
	profileImage?: string;
	education: EducationType[];
	workExperience: WorkExperienceType[];
	skills: SkillType[];
};
