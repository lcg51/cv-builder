'use client';
import React, { useEffect, useState } from 'react';
import { UserDataType } from '@/app/models/user';
import './HTMLPreviewer.css';
import { format } from 'date-fns';

export const HtmlPreviewer = ({ userData }: { userData: UserDataType }) => {
	const [htmlTemplate, setHtmlTemplate] = useState('');
	const [processedHtml, setProcessedHtml] = useState('');
	const [styles, setStyles] = useState('');

	useEffect(() => {
		const fetchTemplate = async () => {
			try {
				const htmlResponse = await fetch('../../../../templates/template1.html');
				const stylesResponse = await fetch('../../../../templates/template1.css');
				if (!htmlResponse.ok || !stylesResponse.ok) {
					throw new Error(`HTTP error! status: ${htmlResponse.status}`);
				}

				const template = await htmlResponse.text();
				const styles = await stylesResponse.text();
				setHtmlTemplate(template);
				setStyles(styles);
			} catch (error) {
				console.error('Error fetching template:', error);
			}
		};

		fetchTemplate();
	}, []);

	useEffect(() => {
		if (!htmlTemplate) return;
		const updatedTemplate = htmlTemplate
			.replace(/{{firstName}}/g, userData?.firstName || '')
			.replace(/{{lastName}}/g, userData?.lastName || '')
			.replace(/{{role}}/g, userData?.role || '')
			.replace(/{{city}}/g, userData?.city || '')
			.replace(/{{postalCode}}/g, userData?.postalCode || '')
			.replace(/{{phone}}/g, userData?.phone || '')
			.replace(/{{email}}/g, userData?.email || '')
			.replace(/{{aboutMe}}/g, userData?.aboutMe || '')
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
					.map(skill =>
						match.replace(/{{title}}/g, skill.title).replace(/{{level}}/g, skill.level[0].toString())
					)
					.join('')
			)
			.replace(/{{#each workExperience}}([\s\S]*?){{\/each}}/g, (_, match) =>
				userData.workExperience
					.map(exp =>
						match
							.replace(/{{company}}/g, exp.company)
							.replace(/{{startDate}}/g, format(exp.startDate, 'PPP'))
							.replace(/{{endDate}}/g, format(exp.endDate, 'PPP'))
							.replace(/{{location}}/g, exp.location)
							.replace(/{{jobTitle}}/g, exp.jobTitle)
							.replace(/{{description}}/g, exp.description)
					)
					.join('')
			);

		setProcessedHtml(updatedTemplate);
	}, [userData, htmlTemplate]);

	return (
		<section className="html-previewer">
			<div id="cv-preview">
				<style dangerouslySetInnerHTML={{ __html: styles }} />
				<div className="cv-wrapper" dangerouslySetInnerHTML={{ __html: processedHtml }} />
			</div>
		</section>
	);
};
