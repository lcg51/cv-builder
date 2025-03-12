'use client';
import React, { useEffect, useState } from 'react';
import { TemplatePreview } from '../TemplatePreview/TemplatePreview';
import { UserDataType } from '@/app/models/user';
import './HTMLPreviewer.css';
import { format } from 'date-fns';

export const HtmlPreviewer = ({ userData }: { userData: UserDataType }) => {
	const [htmlInput, setHtmlInput] = useState('');

	useEffect(() => {
		const template = `
        <div class="cv p-14 items-center flex flex-col justify-center bg-secondary">
            <div class="cv-header w-full">
                <div class="cv-header__wrapper">
                    <div class="cv-header__text">${userData?.firstName.charAt(0).toUpperCase()} | ${userData?.lastName.charAt(0).toUpperCase()}</div>
                    <div>
                        <div class="name-title">${userData?.firstName} ${userData?.lastName}</div>
                    </div>
                    <div class="header-role">
                        <div class="header-role--bar"></div>
                        <div class="click-to-edit-wrapper">
                            <div class="header-role--title">${userData?.role}</div>
                        </div>
                        <div class="header-role--bar"></div>
                    </div>
                    <div class="header-icons">
                        <div class="header-icons__item">
                            <div class="">{/* <MapIcon /> */}</div>
                            <div>
                                <div class="header-icons__item--text">${userData?.city}, ${userData?.postalCode}</div>
                            </div>
                        </div>
                        <div class="header-icons__item">
                            <div class="">{/* <PhoneIcon /> */}</div>
                            <div>
                                <div class="header-icons__item--text">${userData?.phone}</div>
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
                    <div id="PROFESSIONAL_SUMMARY" class="janQsy jcDrNn">
                        <div class="jgHnCq bdkegh">
                            <div class="section-title mb-4 mt-4">
                                <span> ABOUT ME </span>
                            </div>
                            <div class="dvqVRL">
                                <div class="janQsy">
                                    <div>
                                        <div class="about-me__description">
                                            <div class="hMKVdI">
                                                <div class="about-me__description--text">
                                                    <p>Hi, I'm ${userData?.firstName} ${userData?.lastName}.</p>
                                                    <p>${userData?.aboutMe}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="EDUCATION-block" class="jcDrNn">
                        <div class="section-title mb-4 mt-4">
                            <span> EDUCATION </span>
                        </div>
                        <div class="education">
                            ${userData.education
								.map(
									edu => `
                                <div class="dZuYuB">
                                    <div>
                                        <span class="education_degree">${edu.degree}</span>
                                    </div>
                                    <div>
                                        <div class="education__university">${edu.university}</div>
                                    </div>
                                    <div>
                                        <div class="education__city">${edu.city}</div>
                                    </div>
                                    <div>
                                        <div class="education__date">${format(edu.finishDate, 'PPP')}</div>
                                    </div>
                                    <div>
                                        <div class="education__description">${edu.description}</div>
                                    </div>
                                </div>
                            `
								)
								.join('')}
                        </div>
                    </div>
                    <div id="SKILLS-block">
                        <div class="section-title mb-4 mt-4">
                            <span>SKILLS</span>
                        </div>
                        <div class="skills">
                            ${userData.skills
								.map(
									skill => `
                                    <div class="skill-item mb-2">
                                        <span class="skill-item__name">${skill.title}:</span>
                                        <div class="bar-container">
                                            <div class="bar-container__progress" style="width: ${skill.level[0]}%;"></div>
                                        </div>
                                    </div>
                            `
								)
								.join('')}
                        </div>
                    </div>
                </div>
                <div class="RightColumn table-cell">
                    <div id="EMPLOYMENT-block">
                        <div class="section-title mb-4 mt-4">
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
                                                <span>${format(exp.startDate, 'PPP')}&nbsp;-&nbsp;${format(exp.endDate, 'PPP')} </span>
                                            </div>
                                            <div>
                                                <span> ${exp.location} </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="experience-item">
                                        <div class="work-experience__role">${exp.jobTitle}</div>
                                        <div class="work-experience__role-description">
                                            ${exp.description}
                                        </div>
                                    </div>
                                </div>
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
		setHtmlInput(template);
	}, [userData]);

	return (
		<div className="html-previewer">
			<TemplatePreview template={htmlInput} />
		</div>
	);
};
