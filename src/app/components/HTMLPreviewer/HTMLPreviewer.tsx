'use client';
import React, { useEffect, useState } from 'react';
import './HtmlPreviewer.css';
import { TemplatePreview } from '../TemplatePreview/TemplatePreview';

type UserPortoflioType = {
	name: string;
	role: string;
	location: string;
	phone: string;
	email: string;
	linkedin: string;
	github: string;
	education: {
		degree: string;
		university: string;
	};
	workExperience: Array<{
		company: string;
		role: string;
		startDate: string;
		endDate: string;
		location: string;
		description: string;
	}>;
	skills: Array<{ category: string; description: string }>;
};

export const HtmlPreviewer = () => {
	const [htmlInput, setHtmlInput] = useState('');

	const userData: UserPortoflioType = {
		name: 'John Doe',
		role: 'Software Engineer',
		location: 'San Francisco, CA',
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

	const template = `
        <div class="cv p-14 items-center flex flex-col justify-center bg-secondary">
            <div class="cv-header w-full">
                <div class="cv-header__wrapper">
                    <div class="cv-header__text">P | S</div>
                    <div>
                        <div class="name-title">${userData.name}</div>
                    </div>
                    <div class="header-role">
                        <div class="header-role--bar"></div>
                        <div class="click-to-edit-wrapper">
                            <div class="header-role--title">${userData.role}</div>
                        </div>
                        <div class="header-role--bar"></div>
                    </div>
                    <div class="header-icons">
                        <div class="header-icons__item">
                            <div class="">{/* <MapIcon /> */}</div>
                            <div>
                                <div class="header-icons__item--text">${userData.location}</div>
                            </div>
                        </div>
                        <div class="header-icons__item">
                            <div class="">{/* <PhoneIcon /> */}</div>
                            <div>
                                <div class="header-icons__item--text">${userData.phone}</div>
                            </div>
                        </div>
                        <div class="header-icons__item">
                            <div class="">{/* <MailIcon /> */}</div>
                            <div>
                                <div class="header-icons__item--text">${userData.email}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex">
                <div class="LeftColumn-sc-fvgclz-15 left-column">
                    <div class="image-wrapper">
                        {/* <img src={picture} alt="profile-picture" class="image" /> */}
                    </div>
                    <div id="PROFESSIONAL_SUMMARY" class="janQsy jcDrNn">
                        <div class="jgHnCq bdkegh">
                            <div class="section-title">
                                <span> ABOUT ME </span>
                            </div>
                            <div class="dvqVRL">
                                <div class="janQsy">
                                    <div>
                                        <div class="about-me__description">
                                            <div class="hMKVdI">
                                                <div class="UnbreakableView-sc-g0hv7p-0">
                                                    <div>
                                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                                        Sed quis quam in odio tincidunt fermentum. Nam auctor,
                                                        nisl.
                                                    </div>
                                                </div>
                                                <div class="UnbreakableView-sc-g0hv7p-0">
                                                    <div>
                                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                                        Sed quis quam in odio tincidunt fermentum. Nam auctor,
                                                        nisl.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="EDUCATION-block" class="jcDrNn">
                        <div class="section-title">
                            <span> EDUCATION </span>
                        </div>
                        <div class="education">
                            <div class="dZuYuB">
                                <div>
                                    <span class="education_degree">${userData.education.degree}</span>
                                </div>
                                <div>
                                    <div class="education__university">${userData.education.university}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="SOCIAL_LINKS-block" class="enCnDQ jcDrNn">
                        <div class="jgHnCq fmxcqb">
                            <div class="section-title">
                                <span> LINKS </span>
                            </div>
                            <div class="links-section">
                                <div class="links-section__item">
                                    <div class="links-section__name">LinkedIn:</div>
                                    <a href="${userData.linkedin}" class="links-section__link">
                                        MyLinkedIn
                                    </a>
                                </div>
                                <div class="links-section__item">
                                    <div class="links-section__name">Github:</div>
                                    <a href="${userData.github}" class="links-section__link">
                                        My github
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="LANGUAGES-block" class="janQsy jcDrNn">
                        <div>
                            <div class="section-title">
                                <span> LANGUAGES </span>
                            </div>
                            <div class="languages">
                                <div class="language-item">
                                    <div class="language-item__name">English</div>
                                    <div>
                                        <div class="bar-container">
                                            <div class="bar-container__progress bar-container__progress-80"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="language-item">
                                    <div class="language-item__name">Spanish</div>
                                    <div>
                                        <div class="bar-container">
                                            <div class="bar-container__progress bar-container__progress-100"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="RightColumn table-cell">
                    <div id="EMPLOYMENT-block">
                        <div class="section-title">
                            <div>WORK EXPERIENCE</div>
                        </div>
                        <div class="∫dvqVRL">
                            ${userData.workExperience
								.map(
									exp => `
                            <div class="enCnDQ">
                                <div class="dZuYuB cmdikB">
                                    <div class="Column-sc-3wzo5k-6 igMrOZ">
                                        <div class="">
                                            <span> ${exp.company} </span>
                                        </div>
                                        <div class="work-experience__time">
                                            <div>
                                                <span>${exp.startDate}&nbsp;-&nbsp;${exp.endDate} </span>
                                            </div>
                                            <div>
                                                <span> ${exp.location} </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="experience-item">
                                        <div class="work-experience__role">${exp.role}</div>
                                        <div class="work-experience__role-description">
                                            <span>
                                                ${exp.description}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            `
								)
								.join('')}
                        </div>
                    </div>
                    <div id="SKILLS-block">
                        <div class="section-title">
                            <div>Skills</div>
                        </div>
                        <div class="skills-container">
                            ${userData.skills
								.map(
									skill => `
                            <div class="skills-container__paragraph">
                                <span class="skills-container--bold">${skill.category}:</span>
                                ${skill.description}
                            </div>
                            `
								)
								.join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

	useEffect(() => {
		setHtmlInput(template);
	}, [template]);

	return (
		<div className="html-previewer">
			<TemplatePreview template={htmlInput} />
		</div>
	);
};
