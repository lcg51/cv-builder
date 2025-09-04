import React from 'react';

export interface ProgressBarProps {
	/** The title displayed above the progress bar */
	title: string;
	/** The completion percentage (0-100) */
	completionPercentage: number;
	/** Text displayed when progress is 100% complete */
	completedText: string;
	/** Text displayed when progress is less than 100% */
	incompleteText: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
	title,
	completionPercentage,
	completedText,
	incompleteText
}) => {
	const isCompleted = completionPercentage >= 100;
	const displayText = isCompleted ? completedText : incompleteText;

	return (
		<div className="progress-bar-container w-full">
			{/* Title and Percentage Display */}
			<div className="flex justify-between items-center mb-2">
				<h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</h3>
				<span className="text-sm font-medium text-slate-600 dark:text-slate-400">{completionPercentage}%</span>
			</div>

			{/* Progress Bar */}
			<div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-4">
				<div
					className="progress-bar-fill bg-primary h-2 rounded-full transition-all duration-300 ease-out"
					style={{ width: `${completionPercentage}%` }}
					data-testid="progress-fill"
				/>
			</div>

			{/* Bottom Text */}
			<div className="text-sm text-slate-500 dark:text-slate-400 text-center">{displayText}</div>

			{/* Hidden progress bar for accessibility */}
			<div
				className="progress-bar-track sr-only"
				role="progressbar"
				aria-valuenow={completionPercentage}
				aria-valuemin={0}
				aria-valuemax={100}
				aria-label={title || 'Progress'}
			/>
		</div>
	);
};
