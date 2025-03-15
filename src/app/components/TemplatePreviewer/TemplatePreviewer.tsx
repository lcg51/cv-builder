'use client';
import React, { useEffect, useState } from 'react';
import { UserDataType } from '@/app/models/user';
import './TemplatePreviewer.css';
import { format } from 'date-fns';

export const TemplatePreviewer = ({ userData }: { userData: UserDataType }) => {
	const [htmlTemplate, setHtmlTemplate] = useState('');
	const [processedHtml, setProcessedHtml] = useState('');
	const [styles, setStyles] = useState('');

	const postData = async () => {
		try {
			const response = await fetch(`/api/hello`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ html: processedHtml, styles })
			});

			if (!response.ok) {
				throw new Error('Failed to generate PDF');
			}
			const blob = await response.blob();
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = 'resume.pdf';
			link.click();
		} catch (error) {
			console.error('Error downloading PDF:', error);
		}
	};

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
		<section className="template-previewer">
			<div id="cv-preview">
				<style dangerouslySetInnerHTML={{ __html: styles }} />
				<div className="cv-wrapper" dangerouslySetInnerHTML={{ __html: processedHtml }} />
			</div>
			<button className="btn btn-primary" onClick={postData}>
				Download PDF
			</button>
		</section>
	);
};
