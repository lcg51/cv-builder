'use client';
import React from 'react';
import { resumeDataStore } from '../store/resume';

interface PersistenceDebugProps {
	onTemplateChange?: (templateId: string) => void;
	currentTemplate?: string;
}

export const PersistenceDebug: React.FC<PersistenceDebugProps> = ({
	onTemplateChange,
	currentTemplate = 'template1'
}) => {
	const [isVisible, setIsVisible] = React.useState(false);
	const resumeData = resumeDataStore(state => state.userResumeData);
	const activeStep = resumeDataStore(state => state.activeStep);
	const selectedTemplate = resumeDataStore(state => state.selectedTemplate);
	const clearStorage = resumeDataStore(state => state.clearStorage);
	const resetResumeUserData = resumeDataStore(state => state.resetResumeUserData);

	const availableTemplates = [
		{ id: 'template1', name: 'Classic Header' },
		{ id: 'template2', name: 'Modern Sidebar' },
		{ id: 'template3', name: 'Card Layout' }
	];

	const handleClearStorage = () => {
		clearStorage();
		alert('Storage cleared!');
	};

	const handleResetData = () => {
		resetResumeUserData();
		alert('Data reset to defaults!');
	};

	const handleTemplateChange = (templateId: string) => {
		if (onTemplateChange) {
			onTemplateChange(templateId);
		}
	};

	if (!isVisible) {
		return (
			<button
				onClick={() => setIsVisible(true)}
				className="fixed bottom-6 left-5 bg-gray-800 text-white p-2 rounded-full text-xs z-50"
				title="Debug Persistence"
			>
				🔧
			</button>
		);
	}

	return (
		<div className="fixed bottom-4 left-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-4 shadow-lg z-50 max-w-sm">
			<div className="flex justify-between items-center mb-3">
				<h3 className="text-sm font-semibold">Persistence Debug</h3>
				<button
					onClick={() => setIsVisible(false)}
					className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
				>
					✕
				</button>
			</div>

			{/* Template Switcher */}
			<div className="mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded">
				<div className="text-xs font-medium mb-2 text-gray-600 dark:text-gray-300">
					Template: {currentTemplate}
				</div>
				<div className="flex gap-1">
					{availableTemplates.map(template => (
						<button
							key={template.id}
							onClick={() => handleTemplateChange(template.id)}
							className={`px-2 py-1 text-xs rounded transition-colors ${
								currentTemplate === template.id
									? 'bg-blue-500 text-white'
									: 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
							}`}
							title={template.name}
						>
							{template.id}
						</button>
					))}
				</div>
			</div>

			<div className="space-y-2 text-xs">
				<div>
					<strong>Active Step:</strong> {activeStep} (Step {activeStep + 1})
				</div>
				<div>
					<strong>Selected Template:</strong> {selectedTemplate || 'None'}
				</div>
				<div>
					<strong>Data Keys:</strong> {Object.keys(resumeData).length}
				</div>
				<div>
					<strong>Education Items:</strong> {resumeData.education?.length || 0}
				</div>
				<div>
					<strong>Experience Items:</strong> {resumeData.workExperience?.length || 0}
				</div>
				<div>
					<strong>Skills Items:</strong> {resumeData.skills?.length || 0}
				</div>
			</div>

			<div className="mt-3 space-y-2">
				<button
					onClick={handleResetData}
					className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-2 rounded"
				>
					Reset Data
				</button>
				<button
					onClick={handleClearStorage}
					className="w-full bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-2 rounded"
				>
					Clear Storage
				</button>
			</div>
		</div>
	);
};
