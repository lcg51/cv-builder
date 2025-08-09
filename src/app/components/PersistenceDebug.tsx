'use client';
import React from 'react';
import { resumeDataStore } from '../store/resume';

export const PersistenceDebug: React.FC = () => {
	const [isVisible, setIsVisible] = React.useState(false);
	const userData = resumeDataStore(state => state.userResumeData);
	const activeStep = resumeDataStore(state => state.activeStep);
	const clearStorage = resumeDataStore(state => state.clearStorage);
	const resetResumeUserData = resumeDataStore(state => state.resetResumeUserData);

	const handleClearStorage = () => {
		clearStorage();
		alert('Storage cleared!');
	};

	const handleResetData = () => {
		resetResumeUserData();
		alert('Data reset to defaults!');
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

			<div className="space-y-2 text-xs">
				<div>
					<strong>Active Step:</strong> {activeStep} (Step {activeStep + 1})
				</div>
				<div>
					<strong>Data Keys:</strong> {Object.keys(userData).length}
				</div>
				<div>
					<strong>Education Items:</strong> {userData.education?.length || 0}
				</div>
				<div>
					<strong>Experience Items:</strong> {userData.workExperience?.length || 0}
				</div>
				<div>
					<strong>Skills Items:</strong> {userData.skills?.length || 0}
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
