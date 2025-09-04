import React from 'react';
import { ProgressBar } from './ProgressBar';

// Demo component to showcase ProgressBar usage
export const ProgressBarDemo: React.FC = () => {
	return (
		<div className="p-8 space-y-8">
			<h1 className="text-2xl font-bold mb-6">ProgressBar Component Demo</h1>

			{/* Example 1: Incomplete progress */}
			<div className="border p-4 rounded-lg">
				<h2 className="text-lg font-semibold mb-4">Example 1: Incomplete Progress (45%)</h2>
				<ProgressBar
					title="Project Completion"
					completionPercentage={45}
					completedText="Project completed successfully!"
					incompleteText="Work in progress..."
				/>
			</div>

			{/* Example 2: Complete progress */}
			<div className="border p-4 rounded-lg">
				<h2 className="text-lg font-semibold mb-4">Example 2: Complete Progress (100%)</h2>
				<ProgressBar
					title="Task Finished"
					completionPercentage={100}
					completedText="All tasks completed! 🎉"
					incompleteText="Still working on it..."
				/>
			</div>

			{/* Example 3: Zero progress */}
			<div className="border p-4 rounded-lg">
				<h2 className="text-lg font-semibold mb-4">Example 3: Zero Progress (0%)</h2>
				<ProgressBar
					title="Getting Started"
					completionPercentage={0}
					completedText="Done!"
					incompleteText="Ready to begin..."
				/>
			</div>

			{/* Example 4: Decimal progress */}
			<div className="border p-4 rounded-lg">
				<h2 className="text-lg font-semibold mb-4">Example 4: Decimal Progress (33.5%)</h2>
				<ProgressBar
					title="Data Processing"
					completionPercentage={33.5}
					completedText="Processing complete!"
					incompleteText="Processing in progress..."
				/>
			</div>

			{/* Example 5: Edge case - over 100% */}
			<div className="border p-4 rounded-lg">
				<h2 className="text-lg font-semibold mb-4">Example 5: Over 100% (150%)</h2>
				<ProgressBar
					title="Bonus Progress"
					completionPercentage={150}
					completedText="Exceeded expectations!"
					incompleteText="Working hard..."
				/>
			</div>
		</div>
	);
};
