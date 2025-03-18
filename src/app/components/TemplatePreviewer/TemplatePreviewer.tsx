'use client';
import React, { useEffect, useState } from 'react';
import { UserDataType } from '@/app/models/user';
import './TemplatePreviewer.css';
import { format } from 'date-fns';

type TemplateProps = {
	userData: UserDataType;
	templateHTML: string;
	templateStyles: string;
};

export const TemplatePreviewer = ({ userData, templateHTML, templateStyles }: TemplateProps) => {
	const [processedHtml, setProcessedHtml] = useState('');

	const postData = async () => {
		try {
			const response = await fetch(`/api/pdf`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ html: processedHtml, templateStyles })
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
		if (!templateHTML) return;
		const updatedTemplate = templateHTML
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
							.replace(
								/{{startDate}}/g,
								`${format(exp.startDate, 'MMM')} ${format(exp.startDate, 'yyyy')}`
							)
							.replace(/{{endDate}}/g, `${format(exp.endDate, 'MMM')} ${format(exp.endDate, 'yyyy')}`)
							.replace(/{{location}}/g, exp.location)
							.replace(/{{jobTitle}}/g, exp.jobTitle)
							.replace(/{{description}}/g, exp.description)
					)
					.join('')
			);

		setProcessedHtml(updatedTemplate);
	}, [userData, templateHTML]);

	return (
		<section className="template-previewer">
			<div id="cv-preview">
				<style dangerouslySetInnerHTML={{ __html: templateStyles }} />
				<div className="cv-wrapper" dangerouslySetInnerHTML={{ __html: processedHtml }} />
			</div>
			<button className="btn btn-primary" onClick={postData}>
				Download PDF
			</button>
		</section>
	);
};
