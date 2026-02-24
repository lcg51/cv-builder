import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProgressBar, ProgressBarProps } from './ProgressBar';

// Test data factories
const createProgressBarProps = (overrides: Partial<ProgressBarProps> = {}): ProgressBarProps => ({
	title: 'Test Progress',
	completionPercentage: 50,
	completedText: 'Completed!',
	incompleteText: 'In Progress...',
	...overrides
});

describe('ProgressBar Component', () => {
	describe('Rendering and Display', () => {
		it('should render the title correctly', () => {
			const props = createProgressBarProps({ title: 'Custom Title' });
			render(<ProgressBar {...props} />);

			expect(screen.getByText('Custom Title')).toBeInTheDocument();
		});

		it('should display completion percentage as text', () => {
			const props = createProgressBarProps({ completionPercentage: 75 });
			render(<ProgressBar {...props} />);

			expect(screen.getByText('75%')).toBeInTheDocument();
		});

		it('should display completion percentage with proper formatting', () => {
			const props = createProgressBarProps({ completionPercentage: 33.5 });
			render(<ProgressBar {...props} />);

			expect(screen.getByText('33.5%')).toBeInTheDocument();
		});
	});

	describe('Progress Bar Visual', () => {
		it('should render progress bar element', () => {
			const props = createProgressBarProps();
			render(<ProgressBar {...props} />);

			const progressBar = screen.getByRole('progressbar');
			expect(progressBar).toBeInTheDocument();
		});

		it('should set correct aria-valuenow based on completion percentage', () => {
			const props = createProgressBarProps({ completionPercentage: 60 });
			render(<ProgressBar {...props} />);

			const progressBar = screen.getByRole('progressbar');
			expect(progressBar).toHaveAttribute('aria-valuenow', '60');
		});

		it('should set aria-valuemin to 0', () => {
			const props = createProgressBarProps();
			render(<ProgressBar {...props} />);

			const progressBar = screen.getByRole('progressbar');
			expect(progressBar).toHaveAttribute('aria-valuemin', '0');
		});

		it('should set aria-valuemax to 100', () => {
			const props = createProgressBarProps();
			render(<ProgressBar {...props} />);

			const progressBar = screen.getByRole('progressbar');
			expect(progressBar).toHaveAttribute('aria-valuemax', '100');
		});

		it('should apply correct width style based on completion percentage', () => {
			const props = createProgressBarProps({ completionPercentage: 45 });
			render(<ProgressBar {...props} />);

			const progressFill = screen.getByTestId('progress-fill');
			expect(progressFill).toHaveStyle('width: 45%');
		});

		it('should handle 0% completion', () => {
			const props = createProgressBarProps({ completionPercentage: 0 });
			render(<ProgressBar {...props} />);

			const progressFill = screen.getByTestId('progress-fill');
			expect(progressFill).toHaveStyle('width: 0%');
		});

		it('should handle 100% completion', () => {
			const props = createProgressBarProps({ completionPercentage: 100 });
			render(<ProgressBar {...props} />);

			const progressFill = screen.getByTestId('progress-fill');
			expect(progressFill).toHaveStyle('width: 100%');
		});
	});

	describe('Bottom Text Display Logic', () => {
		it('should display completedText when completion is 100%', () => {
			const props = createProgressBarProps({
				completionPercentage: 100,
				completedText: 'All done!',
				incompleteText: 'Keep going...'
			});
			render(<ProgressBar {...props} />);

			expect(screen.getByText('All done!')).toBeInTheDocument();
			expect(screen.queryByText('Keep going...')).not.toBeInTheDocument();
		});

		it('should display incompleteText when completion is less than 100%', () => {
			const props = createProgressBarProps({
				completionPercentage: 99,
				completedText: 'All done!',
				incompleteText: 'Almost there...'
			});
			render(<ProgressBar {...props} />);

			expect(screen.getByText('Almost there...')).toBeInTheDocument();
			expect(screen.queryByText('All done!')).not.toBeInTheDocument();
		});

		it('should display incompleteText when completion is 0%', () => {
			const props = createProgressBarProps({
				completionPercentage: 0,
				completedText: 'Finished!',
				incompleteText: 'Getting started...'
			});
			render(<ProgressBar {...props} />);

			expect(screen.getByText('Getting started...')).toBeInTheDocument();
			expect(screen.queryByText('Finished!')).not.toBeInTheDocument();
		});

		it('should display incompleteText when completion is exactly 50%', () => {
			const props = createProgressBarProps({
				completionPercentage: 50,
				completedText: 'Done!',
				incompleteText: 'Halfway there!'
			});
			render(<ProgressBar {...props} />);

			expect(screen.getByText('Halfway there!')).toBeInTheDocument();
			expect(screen.queryByText('Done!')).not.toBeInTheDocument();
		});
	});

	describe('Edge Cases and Error Handling', () => {
		it('should handle negative completion percentage', () => {
			const props = createProgressBarProps({ completionPercentage: -10 });
			render(<ProgressBar {...props} />);

			const progressFill = screen.getByTestId('progress-fill');
			expect(progressFill).toHaveStyle('width: -10%');
			expect(screen.getByText('-10%')).toBeInTheDocument();
		});

		it('should handle completion percentage over 100%', () => {
			const props = createProgressBarProps({ completionPercentage: 150 });
			render(<ProgressBar {...props} />);

			const progressFill = screen.getByTestId('progress-fill');
			expect(progressFill).toHaveStyle('width: 150%');
			expect(screen.getByText('150%')).toBeInTheDocument();
		});

		it('should handle decimal completion percentages', () => {
			const props = createProgressBarProps({ completionPercentage: 33.333 });
			render(<ProgressBar {...props} />);

			expect(screen.getByText('33.333%')).toBeInTheDocument();
			const progressFill = screen.getByTestId('progress-fill');
			expect(progressFill).toHaveStyle('width: 33.333%');
		});

		it('should handle empty title', () => {
			const props = createProgressBarProps({ title: '' });
			const { container } = render(<ProgressBar {...props} />);

			// Should not crash and should render empty title
			const titleElement = container.querySelector('h3');
			expect(titleElement).toBeInTheDocument();
			expect(titleElement).toHaveTextContent('');
		});

		it('should handle empty text props', () => {
			const props = createProgressBarProps({
				completedText: '',
				incompleteText: ''
			});
			render(<ProgressBar {...props} />);

			// Should not crash
			expect(screen.getByRole('progressbar')).toBeInTheDocument();
		});
	});

	describe('Accessibility', () => {
		it('should have proper ARIA attributes for screen readers', () => {
			const props = createProgressBarProps({ completionPercentage: 75 });
			render(<ProgressBar {...props} />);

			const progressBar = screen.getByRole('progressbar');
			expect(progressBar).toHaveAttribute('aria-valuenow', '75');
			expect(progressBar).toHaveAttribute('aria-valuemin', '0');
			expect(progressBar).toHaveAttribute('aria-valuemax', '100');
		});

		it('should have accessible label', () => {
			const props = createProgressBarProps({ title: 'Project Progress' });
			render(<ProgressBar {...props} />);

			const progressBar = screen.getByRole('progressbar');
			expect(progressBar).toHaveAttribute('aria-label', 'Project Progress');
		});
	});

	describe('Component Structure', () => {
		it('should render all required elements in correct order', () => {
			const props = createProgressBarProps({
				title: 'Test Title',
				completionPercentage: 60,
				completedText: 'Done',
				incompleteText: 'Working'
			});
			render(<ProgressBar {...props} />);

			// Check that all elements are present
			expect(screen.getByText('Test Title')).toBeInTheDocument();
			expect(screen.getByText('60%')).toBeInTheDocument();
			expect(screen.getByRole('progressbar')).toBeInTheDocument();
			expect(screen.getByText('Working')).toBeInTheDocument();
		});

		it('should maintain consistent styling classes', () => {
			const props = createProgressBarProps();
			const { container } = render(<ProgressBar {...props} />);

			// Check for expected CSS classes
			expect(container.querySelector('.progress-bar-container')).toBeInTheDocument();
			expect(container.querySelector('.progress-bar-track')).toBeInTheDocument();
			expect(container.querySelector('.progress-bar-fill')).toBeInTheDocument();
		});
	});

	describe('Props Validation', () => {
		it('should handle all required props being provided', () => {
			const props: ProgressBarProps = {
				title: 'Required Title',
				completionPercentage: 25,
				completedText: 'Required Completed',
				incompleteText: 'Required Incomplete'
			};

			expect(() => render(<ProgressBar {...props} />)).not.toThrow();
		});

		it('should handle undefined completion percentage gracefully', () => {
			const props = createProgressBarProps({ completionPercentage: undefined });
			render(<ProgressBar {...props} />);

			// Should handle undefined gracefully
			expect(screen.getByRole('progressbar')).toBeInTheDocument();
		});
	});
});
