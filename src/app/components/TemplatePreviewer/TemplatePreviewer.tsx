'use client';
import React, { useEffect, useState } from 'react';
import { UserDataType } from '@/app/models/user';
import './TemplatePreviewer.css';
import { format } from 'date-fns';
import { LockIcon, DownloadIcon } from '@/components/icons/FormIcons';

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
				body: JSON.stringify({ html: processedHtml, styles: templateStyles })
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
		<div className="flex flex-col h-full">
			{/* Preview Content */}
			<div className="flex-1 overflow-y-auto bg-slate-100 dark:bg-slate-900 p-4">
				<div className="max-w-[8.5in] mx-auto bg-white shadow-lg" id="cv-preview">
					<style dangerouslySetInnerHTML={{ __html: templateStyles }} />
					<div className="cv-wrapper" dangerouslySetInnerHTML={{ __html: processedHtml }} />
				</div>
			</div>

			{/* Controls */}
			<div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
				<div className="flex items-center justify-between gap-4">
					<div className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
						<LockIcon />
						Preview updates automatically
					</div>
					<button
						className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
						onClick={postData}
					>
						<DownloadIcon />
						Download PDF
					</button>
				</div>
			</div>
		</div>
	);
};
