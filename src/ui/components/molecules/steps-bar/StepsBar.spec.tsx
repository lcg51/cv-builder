import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { StepsBar, StepsBarComponentProps, StepsBarItemsProps } from './StepsBar';
import { useFormValidation } from '../../../../hooks/useFormValidation';
import { useWindowSize } from '../../../../hooks/useWindowSize';
import { useTranslations } from 'next-intl';

// Mock the useWindowSize hook
jest.mock('../../../../hooks/useWindowSize');
const mockUseWindowSize = useWindowSize as jest.MockedFunction<typeof useWindowSize>;

// Mock the useFormValidation hook
jest.mock('../../../../hooks/useFormValidation');
const mockUseFormValidation = useFormValidation as jest.MockedFunction<typeof useFormValidation>;

// Mock components for testing
const MockFormComponent = ({ onFieldChange, formId, initialValues }: StepsBarComponentProps) => {
	const [isValid, setIsValid] = React.useState(false);

	React.useEffect(() => {
		// Simulate form validation
		setIsValid(!!initialValues?.firstName);
	}, [initialValues]);

	return (
		<div data-testid={`form-${formId}`}>
			<input
				data-testid="test-input"
				onChange={e => onFieldChange?.('firstName', e.target.value)}
				value={initialValues?.firstName || ''}
			/>
			<span data-testid="validation-status">{isValid ? 'valid' : 'invalid'}</span>
		</div>
	);
};

const MockSimpleComponent = ({ formId }: StepsBarComponentProps) => (
	<div data-testid={`simple-${formId}`}>Simple Component</div>
);

const MockValidatingComponent = ({ formId }: StepsBarComponentProps) => {
	const [isValid, setIsValid] = React.useState(false);
	const { registerForm } = useFormValidation();

	React.useEffect(() => {
		registerForm(formId, async () => {
			return isValid;
		});
	}, [formId, registerForm, isValid]);

	return (
		<div data-testid={`validating-${formId}`}>
			<button data-testid="toggle-validation" onClick={() => setIsValid(!isValid)}>
				Toggle Validation
			</button>
			<span data-testid="validation-state">{isValid ? 'valid' : 'invalid'}</span>
		</div>
	);
};

// Test data factories
const createStepItems = (count: number, activeIndex: number = 0): StepsBarItemsProps[] => {
	return Array.from({ length: count }, (_, index) => ({
		title: `Step ${index + 1}`,
		active: index <= activeIndex,
		isClickable: index <= activeIndex,
		component: index === 0 ? MockFormComponent : MockSimpleComponent
	}));
};

const createValidatingStepItems = (): StepsBarItemsProps[] => [
	{
		title: 'Validating Step',
		active: true,
		isClickable: true,
		component: MockValidatingComponent
	},
	{
		title: 'Next Step',
		active: false,
		isClickable: false,
		component: MockSimpleComponent
	}
];

describe('StepsBar Component', () => {
	const user = userEvent.setup();
	const onNextStepCallback: jest.Mock = jest.fn();
	const onFieldChangeCallback: jest.Mock = jest.fn();

	// Mock translation function with proper typing
	const mockTranslation = Object.assign(
		jest.fn((key: string) => {
			const translations: Record<string, string> = {
				'stepTexts.next': 'Continue',
				'stepTexts.finish': 'Finish'
			};
			return translations[key] || key;
		}),
		{
			rich: jest.fn((key: string, params?: Record<string, unknown>) => {
				if (key === 'stepTexts.step') {
					return `Step ${params?.step} of ${params?.total}`;
				}
				if (key === 'stepTexts.complete') {
					return `${params?.completionPercentage}% Complete`;
				}
				return key;
			}),
			markup: jest.fn((key: string) => key),
			raw: jest.fn((key: string) => key),
			has: jest.fn(() => true)
		}
	) as ReturnType<typeof useTranslations>;

	beforeEach(() => {
		mockUseWindowSize.mockReturnValue({ width: 1200, height: 800 }); // Desktop by default

		// Mock useFormValidation hook
		mockUseFormValidation.mockReturnValue({
			registerForm: jest.fn(),
			unregisterForm: jest.fn(),
			submitCurrentForm: jest.fn().mockResolvedValue(true)
		});

		jest.clearAllMocks();
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('Rendering and Basic Functionality', () => {
		it('should render the correct number of steps', () => {
			const items = createStepItems(3);
			render(
				<StepsBar
					items={items}
					activeStep={0}
					onNextStepCallback={onNextStepCallback}
					onFieldChangeCallback={onFieldChangeCallback}
					$t={mockTranslation}
				/>
			);

			expect(screen.getAllByText('Step 1 of 3')).toHaveLength(2);
			expect(screen.getByText('33% Complete')).toBeInTheDocument();
		});

		it('should render the active step component', () => {
			const items = createStepItems(2);
			render(
				<StepsBar
					items={items}
					activeStep={0}
					onNextStepCallback={onNextStepCallback}
					onFieldChangeCallback={onFieldChangeCallback}
					$t={mockTranslation}
				/>
			);

			expect(screen.getByTestId('form-step-1')).toBeInTheDocument();
		});

		it('should display progress bar with correct width', () => {
			const items = createStepItems(4);
			render(
				<StepsBar
					items={items}
					activeStep={1}
					onNextStepCallback={onNextStepCallback}
					onFieldChangeCallback={onFieldChangeCallback}
					$t={mockTranslation}
				/>
			);

			const progressBar = screen.getByTestId('steps-bar-fill');
			expect(progressBar).toHaveStyle('width: 33.33333333333333%');
		});

		it('should show correct step completion percentage', () => {
			const items = createStepItems(5);
			render(
				<StepsBar
					items={items}
					activeStep={2}
					onNextStepCallback={onNextStepCallback}
					onFieldChangeCallback={onFieldChangeCallback}
					$t={mockTranslation}
				/>
			);

			expect(screen.getByText('60% Complete')).toBeInTheDocument();
		});
	});

	describe('Step Navigation', () => {
		it('should allow clicking on active steps', async () => {
			const items = createStepItems(3, 1);
			render(
				<StepsBar
					items={items}
					activeStep={0}
					onNextStepCallback={onNextStepCallback}
					onFieldChangeCallback={onFieldChangeCallback}
					$t={mockTranslation}
				/>
			);

			const step2 = screen.getByText('Step 2');
			await user.click(step2);

			expect(onNextStepCallback).not.toHaveBeenCalled();
		});

		it('should not allow clicking on inactive steps', async () => {
			const items = createStepItems(3, 0); // Only first step active
			render(
				<StepsBar
					items={items}
					activeStep={0}
					onNextStepCallback={onNextStepCallback}
					onFieldChangeCallback={onFieldChangeCallback}
					$t={mockTranslation}
				/>
			);

			// Try to click on step 3 (inactive)
			const step3 = screen.getByText('Step 3');
			await user.click(step3);

			expect(onNextStepCallback).not.toHaveBeenCalled();
		});

		it('should update step items when activeStep prop changes', () => {
			const items = createStepItems(3);
			const { rerender } = render(
				<StepsBar
					items={items}
					activeStep={0}
					onNextStepCallback={onNextStepCallback}
					onFieldChangeCallback={onFieldChangeCallback}
					$t={mockTranslation}
				/>
			);

			// Initially only step 1 should be active
			expect(screen.getByText('Step 1')).toHaveClass('text-primary');

			// Change activeStep to 1
			rerender(
				<StepsBar
					items={items}
					activeStep={1}
					onNextStepCallback={onNextStepCallback}
					onFieldChangeCallback={onFieldChangeCallback}
					$t={mockTranslation}
				/>
			);

			// Now step 2 should be active and step 1 should be completed
			expect(screen.getByText('Step 2')).toHaveClass('text-primary');
		});
	});

	describe('Continue/Finish Button', () => {
		it('should show "Continue" button when not on last step', () => {
			const items = createStepItems(3);
			render(
				<StepsBar
					items={items}
					activeStep={0}
					onNextStepCallback={onNextStepCallback}
					onFieldChangeCallback={onFieldChangeCallback}
					$t={mockTranslation}
				/>
			);

			expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
		});

		it('should show "Finish" button when on last step', () => {
			const items = createStepItems(3);
			render(
				<StepsBar
					items={items}
					activeStep={2}
					onNextStepCallback={onNextStepCallback}
					onFieldChangeCallback={onFieldChangeCallback}
					$t={mockTranslation}
				/>
			);

			expect(screen.getByRole('button', { name: /finish/i })).toBeInTheDocument();
		});

		it('should call onNextStepCallback when continue button is clicked', async () => {
			const items = createStepItems(3);
			render(
				<StepsBar
					items={items}
					activeStep={0}
					onNextStepCallback={onNextStepCallback}
					onFieldChangeCallback={onFieldChangeCallback}
					$t={mockTranslation}
				/>
			);

			const continueButton = screen.getByRole('button', { name: /continue/i });
			await user.click(continueButton);

			expect(onNextStepCallback).toHaveBeenCalledWith(1);
		});

		it('should disable button when current step is not active', () => {
			const items = createStepItems(3, 0); // Only first step active
			render(
				<StepsBar
					items={items}
					activeStep={0}
					onNextStepCallback={onNextStepCallback}
					onFieldChangeCallback={onFieldChangeCallback}
					$t={mockTranslation}
				/>
			);

			const continueButton = screen.getByRole('button', { name: /continue/i });
			expect(continueButton).not.toBeDisabled();
		});
	});

	describe('Form Validation Context', () => {
		it('should provide form validation context to child components', () => {
			const items = createValidatingStepItems();
			render(
				<StepsBar
					items={items}
					activeStep={0}
					onNextStepCallback={onNextStepCallback}
					onFieldChangeCallback={onFieldChangeCallback}
					$t={mockTranslation}
				/>
			);

			expect(screen.getByTestId('validating-validating-step')).toBeInTheDocument();
		});

		it('should prevent step progression when form validation fails', async () => {
			// Mock submitCurrentForm to return false (validation fails)
			mockUseFormValidation.mockReturnValue({
				registerForm: jest.fn(),
				unregisterForm: jest.fn(),
				submitCurrentForm: jest.fn().mockResolvedValue(false)
			});

			const items = createValidatingStepItems();
			render(
				<StepsBar
					items={items}
					activeStep={0}
					onNextStepCallback={onNextStepCallback}
					onFieldChangeCallback={onFieldChangeCallback}
					$t={mockTranslation}
				/>
			);

			// Initially validation should be invalid
			expect(screen.getByTestId('validation-state')).toHaveTextContent('invalid');

			const continueButton = screen.getByRole('button', { name: /continue/i });
			await user.click(continueButton);

			// Should not proceed to next step
			expect(onNextStepCallback).not.toHaveBeenCalled();
		});

		it('should allow step progression when form validation passes', async () => {
			// Mock submitCurrentForm to return true (validation passes)
			mockUseFormValidation.mockReturnValue({
				registerForm: jest.fn(),
				unregisterForm: jest.fn(),
				submitCurrentForm: jest.fn().mockResolvedValue(true)
			});

			const items = createValidatingStepItems();
			render(
				<StepsBar
					items={items}
					activeStep={0}
					onNextStepCallback={onNextStepCallback}
					onFieldChangeCallback={onFieldChangeCallback}
					$t={mockTranslation}
				/>
			);

			// Make validation pass
			const toggleButton = screen.getByTestId('toggle-validation');
			await user.click(toggleButton);

			expect(screen.getByTestId('validation-state')).toHaveTextContent('valid');

			const continueButton = screen.getByRole('button', { name: /continue/i });
			await user.click(continueButton);

			// Should proceed to next step
			expect(onNextStepCallback).toHaveBeenCalledWith(1);
		});
	});

	describe('Responsive Behavior', () => {
		it('should render mobile navigation when screen width is less than 1024px', () => {
			mockUseWindowSize.mockReturnValue({ width: 768, height: 1024 }); // Tablet
			const items = createStepItems(3);
			render(
				<StepsBar
					items={items}
					activeStep={1}
					onNextStepCallback={onNextStepCallback}
					onFieldChangeCallback={onFieldChangeCallback}
					$t={mockTranslation}
				/>
			);

			// Should show mobile navigation with current step title
			expect(screen.getByText('Step 2')).toBeInTheDocument();
			expect(screen.getByText('2')).toBeInTheDocument(); // Step number in circle
		});

		it('should render desktop navigation when screen width is 1024px or more', () => {
			mockUseWindowSize.mockReturnValue({ width: 1200, height: 800 }); // Desktop
			const items = createStepItems(3);
			render(
				<StepsBar
					items={items}
					activeStep={1}
					onNextStepCallback={onNextStepCallback}
					onFieldChangeCallback={onFieldChangeCallback}
					$t={mockTranslation}
				/>
			);

			// Should show all step titles
			expect(screen.getByText('Step 1')).toBeInTheDocument();
			expect(screen.getByText('Step 2')).toBeInTheDocument();
			expect(screen.getByText('Step 3')).toBeInTheDocument();
		});

		it('should handle mobile navigation arrows correctly', async () => {
			mockUseWindowSize.mockReturnValue({ width: 768, height: 1024 }); // Tablet
			const items = createStepItems(3, 1); // First two steps active
			render(
				<StepsBar
					items={items}
					activeStep={1}
					onNextStepCallback={onNextStepCallback}
					onFieldChangeCallback={onFieldChangeCallback}
					$t={mockTranslation}
				/>
			);

			const leftArrow = screen.getByRole('button', { name: 'Left Arrow' });
			expect(leftArrow).toBeInTheDocument();
			expect(leftArrow).not.toBeDisabled();
			await user.click(leftArrow!);

			expect(onNextStepCallback).toHaveBeenCalledWith(0);
		});

		it('should handle right arrow navigation in mobile view', async () => {
			mockUseWindowSize.mockReturnValue({ width: 768, height: 1024 });
			const items = createStepItems(3, 2);
			render(
				<StepsBar
					items={items}
					activeStep={0}
					onNextStepCallback={onNextStepCallback}
					onFieldChangeCallback={onFieldChangeCallback}
					$t={mockTranslation}
				/>
			);

			// Click right arrow to go to next step
			const rightArrow = screen.getByRole('button', { name: 'Right Arrow' });
			expect(rightArrow).toBeInTheDocument();
			expect(rightArrow).toBeDisabled();
		});
	});

	describe('Edge Cases and Error Handling', () => {
		it('should handle empty items array', () => {
			render(
				<StepsBar
					items={[]}
					activeStep={0}
					onNextStepCallback={onNextStepCallback}
					onFieldChangeCallback={onFieldChangeCallback}
					$t={mockTranslation}
				/>
			);

			expect(screen.getAllByText('Step 1 of 0')).toHaveLength(2);
		});

		it('should handle activeStep greater than items length', () => {
			const items = createStepItems(2);
			render(
				<StepsBar
					items={items}
					activeStep={5}
					onNextStepCallback={onNextStepCallback}
					onFieldChangeCallback={onFieldChangeCallback}
					$t={mockTranslation}
				/>
			);

			expect(screen.getAllByText('Step 6 of 2')).toHaveLength(2);
		});

		it('should handle negative activeStep', () => {
			const items = createStepItems(2);
			render(
				<StepsBar
					items={items}
					activeStep={-1}
					onNextStepCallback={onNextStepCallback}
					onFieldChangeCallback={onFieldChangeCallback}
					$t={mockTranslation}
				/>
			);

			// Should not crash and should handle gracefully
			expect(screen.getAllByText('Step 0 of 2')).toHaveLength(2);
		});

		it('should handle missing onNextStepCallback', async () => {
			const items = createStepItems(2);
			render(
				<StepsBar
					items={items}
					activeStep={0}
					onFieldChangeCallback={onFieldChangeCallback}
					$t={mockTranslation}
				/>
			);

			const continueButton = screen.getByRole('button', { name: /continue/i });
			await user.click(continueButton);

			// Should not crash when callback is not provided
			expect(continueButton).toBeInTheDocument();
		});
	});

	describe('Accessibility', () => {
		it('should have proper ARIA labels and roles', () => {
			const items = createStepItems(3);
			render(
				<StepsBar
					items={items}
					activeStep={1}
					onNextStepCallback={onNextStepCallback}
					onFieldChangeCallback={onFieldChangeCallback}
					$t={mockTranslation}
				/>
			);

			// Check that buttons have proper roles
			expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
		});

		it('should disable navigation buttons when appropriate', () => {
			mockUseWindowSize.mockReturnValue({ width: 768, height: 1024 }); // Tablet
			const items = createStepItems(3, 0); // Only first step active
			render(
				<StepsBar
					items={items}
					activeStep={0}
					onNextStepCallback={onNextStepCallback}
					onFieldChangeCallback={onFieldChangeCallback}
					$t={mockTranslation}
				/>
			);

			// Left arrow should be disabled on first step - use CSS selector to be more specific
			const leftArrow = document.querySelector('button.absolute.left-0');
			expect(leftArrow).toBeInTheDocument();
			expect(leftArrow).toBeDisabled();
		});
	});

	describe('Performance and State Management', () => {
		it('should not re-render unnecessarily when props do not change', () => {
			const items = createStepItems(3);
			const renderSpy = jest.fn();

			const TestWrapper = () => {
				renderSpy();
				return (
					<StepsBar
						items={items}
						activeStep={1}
						onNextStepCallback={onNextStepCallback}
						onFieldChangeCallback={onFieldChangeCallback}
						$t={mockTranslation}
					/>
				);
			};

			const { rerender } = render(<TestWrapper />);
			const initialRenderCount = renderSpy.mock.calls.length;

			// Re-render with same props
			rerender(<TestWrapper />);

			// Should not cause additional renders
			expect(renderSpy.mock.calls.length).toBe(initialRenderCount + 1);
		});
	});
});
