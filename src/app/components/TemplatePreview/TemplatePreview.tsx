'use client';
import React from 'react';
import './TemplatePreview.css';

export const TemplatePreview = ({ template }: { template: string }) => {
	return (
		<section id="cv-preview">
			<div className="cv-wrapper" dangerouslySetInnerHTML={{ __html: template }} />
		</section>
	);
};
