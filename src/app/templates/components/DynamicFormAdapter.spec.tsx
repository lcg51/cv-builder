import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { DynamicFormAdapter, type DynamicFormConfig } from './DynamicFormAdapter';
import { type ArrayFieldConfig } from '@/lib/dynamicFormSchema';
import { useFormValidation } from '@/hooks/useFormValidation';

// ─── Mocks ───────────────────────────────────────────────────────────────────

jest.mock('@/hooks/useFormValidation');
const mockUseFormValidation = useFormValidation as jest.MockedFunction<typeof useFormValidation>;

// Simple stand-ins for complex UI primitives to avoid Radix DOM API issues.
// Note: jest.mock factories cannot reference out-of-scope variables, so we
// use require() inside to access React.
jest.mock('@/ui/components', () => {
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	const React = require('react');
	return {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		Input: React.forwardRef(function MockInput({ type, ...rest }: any, ref: any) {
			return <input ref={ref} type={type || 'text'} {...rest} />;
		}),
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		Textarea: React.forwardRef(function MockTextarea(props: any, ref: any) {
			return <textarea ref={ref} {...props} />;
		}),
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		MonthYearPicker: React.forwardRef(function MockMonthYearPicker({ value, onChange, ...rest }: any, ref: any) {
			return (
				<input
					ref={ref}
					data-testid="month-year-picker"
					type="text"
					defaultValue={value instanceof Date ? value.toISOString() : ''}
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					onChange={(e: any) => onChange?.(new Date(e.target.value))}
					{...rest}
				/>
			);
		}),
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		Slider: function MockSlider({ value, onValueChange, min = 0, max = 100, step = 1, ...rest }: any) {
			return (
				<input
					data-testid="slider"
					type="range"
					value={value?.[0] ?? 50}
					min={min}
					max={max}
					step={step}
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					onChange={(e: any) => onValueChange?.([Number(e.target.value)])}
					{...rest}
				/>
			);
		}
	};
});

jest.mock('@/ui/icons', () => ({
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	PlusIcon: () => require('react').createElement('span', null, '+'),
	Trash: ({ className }: { className?: string }) =>
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		require('react').createElement('span', { 'data-testid': 'trash-icon', className })
}));

// ─── Factories ───────────────────────────────────────────────────────────────

const makeConfig = (overrides: Partial<DynamicFormConfig> = {}): DynamicFormConfig => ({
	header: {
		title: 'Test Form',
		description: 'Test description',
		icon: <span data-testid="header-icon" />
	},
	fields: [{ name: 'firstName', label: 'First Name', type: 'text', placeholder: 'Your name' }],
	...overrides
});

const arrayField: ArrayFieldConfig = {
	name: 'experiences',
	label: 'Experience',
	type: 'text',
	isArray: true,
	addButtonText: 'Add Experience',
	itemTitle: i => `Experience ${i + 1}`,
	arrayItemSchema: {
		company: { name: 'company', label: 'Company', type: 'text', placeholder: 'Company name' },
		role: { name: 'role', label: 'Role', type: 'text', placeholder: 'Job title' }
	}
};

// ─── Setup ───────────────────────────────────────────────────────────────────

beforeEach(() => {
	jest.clearAllMocks();
	mockUseFormValidation.mockReturnValue({
		registerForm: jest.fn(),
		unregisterForm: jest.fn(),
		submitCurrentForm: jest.fn().mockResolvedValue(true)
	});
});

afterEach(() => {
	jest.restoreAllMocks();
});

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('DynamicFormAdapter', () => {
	describe('Header rendering', () => {
		it('renders the header title', () => {
			render(<DynamicFormAdapter config={makeConfig()} onFieldChange={jest.fn()} />);
			expect(screen.getByText('Test Form')).toBeInTheDocument();
		});

		it('renders the header description', () => {
			render(<DynamicFormAdapter config={makeConfig()} onFieldChange={jest.fn()} />);
			expect(screen.getByText('Test description')).toBeInTheDocument();
		});

		it('renders the header icon', () => {
			render(<DynamicFormAdapter config={makeConfig()} onFieldChange={jest.fn()} />);
			expect(screen.getByTestId('header-icon')).toBeInTheDocument();
		});
	});

	describe('Simple field rendering', () => {
		it('renders a text field with label and placeholder', () => {
			render(<DynamicFormAdapter config={makeConfig()} onFieldChange={jest.fn()} />);
			expect(screen.getByText('First Name')).toBeInTheDocument();
			expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument();
		});

		it('renders an email field with type="email"', () => {
			const config = makeConfig({
				fields: [{ name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' }]
			});
			render(<DynamicFormAdapter config={config} onFieldChange={jest.fn()} />);
			expect(screen.getByPlaceholderText('you@example.com')).toHaveAttribute('type', 'email');
		});

		it('renders a tel field with type="tel"', () => {
			const config = makeConfig({
				fields: [{ name: 'phone', label: 'Phone', type: 'tel', placeholder: '+1 555 0000' }]
			});
			render(<DynamicFormAdapter config={config} onFieldChange={jest.fn()} />);
			expect(screen.getByPlaceholderText('+1 555 0000')).toHaveAttribute('type', 'tel');
		});

		it('renders a url field with type="url"', () => {
			const config = makeConfig({
				fields: [{ name: 'website', label: 'Website', type: 'url', placeholder: 'https://example.com' }]
			});
			render(<DynamicFormAdapter config={config} onFieldChange={jest.fn()} />);
			expect(screen.getByPlaceholderText('https://example.com')).toHaveAttribute('type', 'url');
		});

		it('renders a textarea field', () => {
			const config = makeConfig({
				fields: [{ name: 'bio', label: 'Bio', type: 'textarea', placeholder: 'Tell us about yourself' }]
			});
			render(<DynamicFormAdapter config={config} onFieldChange={jest.fn()} />);
			const textarea = screen.getByPlaceholderText('Tell us about yourself');
			expect(textarea.tagName).toBe('TEXTAREA');
		});

		it('renders a number field', () => {
			const config = makeConfig({
				fields: [{ name: 'age', label: 'Age', type: 'number', min: 0, max: 120 }]
			});
			render(<DynamicFormAdapter config={config} onFieldChange={jest.fn()} />);
			expect(screen.getByRole('spinbutton')).toHaveAttribute('type', 'number');
		});

		it('renders a slider field', () => {
			const config = makeConfig({
				fields: [{ name: 'proficiency', label: 'Proficiency', type: 'slider', min: 0, max: 100 }]
			});
			render(<DynamicFormAdapter config={config} onFieldChange={jest.fn()} />);
			expect(screen.getByTestId('slider')).toBeInTheDocument();
		});

		it('renders a date field using MonthYearPicker', () => {
			const config = makeConfig({
				fields: [{ name: 'startDate', label: 'Start Date', type: 'date' }]
			});
			render(<DynamicFormAdapter config={config} onFieldChange={jest.fn()} />);
			expect(screen.getByTestId('month-year-picker')).toBeInTheDocument();
		});

		it('renders help text when provided', () => {
			const config = makeConfig({
				fields: [{ name: 'name', label: 'Name', type: 'text', helpText: 'Enter your full legal name' }]
			});
			render(<DynamicFormAdapter config={config} onFieldChange={jest.fn()} />);
			expect(screen.getByText('Enter your full legal name')).toBeInTheDocument();
		});

		it('does not render help text when not provided', () => {
			render(<DynamicFormAdapter config={makeConfig()} onFieldChange={jest.fn()} />);
			// The only text nodes are the label and header, no help text div
			expect(screen.queryByText(/full legal name/i)).not.toBeInTheDocument();
		});

		it('renders slider label text including current value', () => {
			const config = makeConfig({
				fields: [
					{
						name: 'skill',
						label: 'Skill Level',
						type: 'slider',
						min: 0,
						max: 100,
						sliderConfig: { showValue: true }
					}
				]
			});
			render(
				<DynamicFormAdapter
					config={config}
					onFieldChange={jest.fn()}
					initialValues={{ skill: [75] } as never}
				/>
			);
			expect(screen.getByText(/Skill Level/)).toBeInTheDocument();
			expect(screen.getByText(/75%/)).toBeInTheDocument();
		});

		it('renders slider range labels when sliderConfig.labels is provided', () => {
			const config = makeConfig({
				fields: [
					{
						name: 'skill',
						label: 'Skill',
						type: 'slider',
						sliderConfig: { labels: ['Beginner', 'Expert'] }
					}
				]
			});
			render(<DynamicFormAdapter config={config} onFieldChange={jest.fn()} />);
			expect(screen.getByText('Beginner')).toBeInTheDocument();
			expect(screen.getByText('Expert')).toBeInTheDocument();
		});

		it('applies col-span-full class when gridColumn is "full"', () => {
			const config = makeConfig({
				fields: [{ name: 'bio', label: 'Bio', type: 'textarea', gridColumn: 'full' }]
			});
			const { container } = render(<DynamicFormAdapter config={config} onFieldChange={jest.fn()} />);
			expect(container.querySelector('.col-span-full')).toBeInTheDocument();
		});

		it('applies col-span-1 class when gridColumn is "half" (default)', () => {
			const { container } = render(<DynamicFormAdapter config={makeConfig()} onFieldChange={jest.fn()} />);
			expect(container.querySelector('.col-span-1')).toBeInTheDocument();
		});
	});

	describe('Array field rendering', () => {
		it('renders the add button with custom addButtonText', () => {
			const config = makeConfig({ fields: [arrayField] });
			render(<DynamicFormAdapter config={config} onFieldChange={jest.fn()} />);
			expect(screen.getByText('Add Experience')).toBeInTheDocument();
		});

		it('falls back to "Add Another <label>" when addButtonText is not provided', () => {
			const config = makeConfig({
				fields: [{ ...arrayField, addButtonText: undefined }]
			});
			render(<DynamicFormAdapter config={config} onFieldChange={jest.fn()} />);
			expect(screen.getByText('Add Another Experience')).toBeInTheDocument();
		});

		it('renders no items initially when initialValues is empty', () => {
			const config = makeConfig({ fields: [arrayField] });
			render(<DynamicFormAdapter config={config} onFieldChange={jest.fn()} />);
			expect(screen.queryByText('Experience 1')).not.toBeInTheDocument();
		});

		it('adds a new item when the add button is clicked', async () => {
			const user = userEvent.setup();
			const config = makeConfig({ fields: [arrayField] });
			render(<DynamicFormAdapter config={config} onFieldChange={jest.fn()} />);

			await user.click(screen.getByText('Add Experience'));

			expect(screen.getByText('Experience 1')).toBeInTheDocument();
			expect(screen.getByPlaceholderText('Company name')).toBeInTheDocument();
			expect(screen.getByPlaceholderText('Job title')).toBeInTheDocument();
		});

		it('shows a custom itemTitle per added item', async () => {
			const user = userEvent.setup();
			const config = makeConfig({
				fields: [{ ...arrayField, itemTitle: (i: number) => `Position #${i + 1}` }]
			});
			render(<DynamicFormAdapter config={config} onFieldChange={jest.fn()} />);

			// arrayField keeps addButtonText: 'Add Experience'
			await user.click(screen.getByText('Add Experience'));
			expect(screen.getByText('Position #1')).toBeInTheDocument();
		});

		it('uses "<label> <index+1>" as default title when itemTitle is not provided', async () => {
			const user = userEvent.setup();
			const config = makeConfig({
				fields: [{ ...arrayField, addButtonText: 'Add', itemTitle: undefined }]
			});
			render(<DynamicFormAdapter config={config} onFieldChange={jest.fn()} />);

			await user.click(screen.getByText('Add'));
			expect(screen.getByText('Experience 1')).toBeInTheDocument();
		});

		it('removes an item when the trash button is clicked', async () => {
			const user = userEvent.setup();
			const config = makeConfig({ fields: [arrayField] });
			render(<DynamicFormAdapter config={config} onFieldChange={jest.fn()} />);

			await user.click(screen.getByText('Add Experience'));
			expect(screen.getByText('Experience 1')).toBeInTheDocument();

			await user.click(screen.getByTestId('trash-icon'));
			expect(screen.queryByText('Experience 1')).not.toBeInTheDocument();
		});

		it('increments item title for multiple items', async () => {
			const user = userEvent.setup();
			const config = makeConfig({ fields: [arrayField] });
			render(<DynamicFormAdapter config={config} onFieldChange={jest.fn()} />);

			await user.click(screen.getByText('Add Experience'));
			await user.click(screen.getByText('Add Experience'));

			expect(screen.getByText('Experience 1')).toBeInTheDocument();
			expect(screen.getByText('Experience 2')).toBeInTheDocument();
		});
	});

	describe('Form validation registration', () => {
		it('calls registerForm with formId on mount', () => {
			const registerForm = jest.fn();
			mockUseFormValidation.mockReturnValue({
				registerForm,
				unregisterForm: jest.fn(),
				submitCurrentForm: jest.fn().mockResolvedValue(true)
			});
			render(<DynamicFormAdapter config={makeConfig()} onFieldChange={jest.fn()} formId="contact-form" />);
			expect(registerForm).toHaveBeenCalledWith('contact-form', expect.any(Function));
		});

		it('calls unregisterForm with formId on unmount', () => {
			const unregisterForm = jest.fn();
			mockUseFormValidation.mockReturnValue({
				registerForm: jest.fn(),
				unregisterForm,
				submitCurrentForm: jest.fn().mockResolvedValue(true)
			});
			const { unmount } = render(
				<DynamicFormAdapter config={makeConfig()} onFieldChange={jest.fn()} formId="contact-form" />
			);
			unmount();
			expect(unregisterForm).toHaveBeenCalledWith('contact-form');
		});

		it('does not call registerForm when formId is not provided', () => {
			const registerForm = jest.fn();
			mockUseFormValidation.mockReturnValue({
				registerForm,
				unregisterForm: jest.fn(),
				submitCurrentForm: jest.fn().mockResolvedValue(true)
			});
			render(<DynamicFormAdapter config={makeConfig()} onFieldChange={jest.fn()} />);
			expect(registerForm).not.toHaveBeenCalled();
		});
	});

	describe('onFieldChange callback', () => {
		it('calls onFieldChange per field key when no formKey is set', async () => {
			const user = userEvent.setup();
			const onFieldChange = jest.fn();
			render(<DynamicFormAdapter config={makeConfig()} onFieldChange={onFieldChange} />);

			await user.type(screen.getByPlaceholderText('Your name'), 'J');

			await waitFor(() => {
				expect(onFieldChange).toHaveBeenCalledWith('firstName', expect.stringContaining('J'));
			});
		});

		it('calls onFieldChange with formKey and merged values when formKey is set', async () => {
			const user = userEvent.setup();
			const onFieldChange = jest.fn();
			const config = makeConfig({
				formKey: 'contact',
				fields: [{ name: 'firstName', label: 'First Name', type: 'text', placeholder: 'Your name' }]
			});
			render(<DynamicFormAdapter config={config} onFieldChange={onFieldChange} />);

			await user.type(screen.getByPlaceholderText('Your name'), 'A');

			await waitFor(() => {
				expect(onFieldChange).toHaveBeenCalledWith('contact', expect.any(Object));
			});
		});

		it('calls onFieldChange with formKey and array data when array field is present', async () => {
			const user = userEvent.setup();
			const onFieldChange = jest.fn();
			const config: DynamicFormConfig = {
				...makeConfig(),
				formKey: 'experiences',
				fields: [{ ...arrayField }]
			};
			render(<DynamicFormAdapter config={config} onFieldChange={onFieldChange} />);

			await user.click(screen.getByText('Add Experience'));

			await waitFor(() => {
				expect(onFieldChange).toHaveBeenCalledWith('experiences', expect.any(Array));
			});
		});
	});

	describe('Default and initial values', () => {
		it('pre-populates a text field from initialValues', () => {
			render(
				<DynamicFormAdapter
					config={makeConfig()}
					onFieldChange={jest.fn()}
					initialValues={{ firstName: 'Jane' } as never}
				/>
			);
			expect(screen.getByPlaceholderText('Your name')).toHaveValue('Jane');
		});

		it('defaults text field to empty string when initialValues is not provided', () => {
			render(<DynamicFormAdapter config={makeConfig()} onFieldChange={jest.fn()} />);
			expect(screen.getByPlaceholderText('Your name')).toHaveValue('');
		});

		it('defaults slider to [min || 50] when initialValues is not provided', () => {
			const config = makeConfig({
				fields: [{ name: 'skill', label: 'Skill', type: 'slider', min: 20, max: 100 }]
			});
			render(<DynamicFormAdapter config={config} onFieldChange={jest.fn()} />);
			const slider = screen.getByTestId('slider');
			expect(slider).toHaveValue('20');
		});

		it('pre-populates array items from initialValues when formKey matches', () => {
			const config: DynamicFormConfig = {
				...makeConfig(),
				formKey: 'experiences',
				fields: [{ ...arrayField }]
			};
			const initialExperiences = [{ company: 'Acme', role: 'Engineer' }];
			render(
				<DynamicFormAdapter
					config={config}
					onFieldChange={jest.fn()}
					initialValues={{ experiences: initialExperiences } as never}
				/>
			);
			expect(screen.getByDisplayValue('Acme')).toBeInTheDocument();
			expect(screen.getByDisplayValue('Engineer')).toBeInTheDocument();
		});
	});

	describe('Slider interaction', () => {
		it('updates slider value when changed', async () => {
			const onFieldChange = jest.fn();
			const config = makeConfig({
				fields: [{ name: 'skill', label: 'Skill', type: 'slider', min: 0, max: 100 }]
			});
			render(<DynamicFormAdapter config={config} onFieldChange={onFieldChange} />);

			const slider = screen.getByTestId('slider');
			fireEvent.change(slider, { target: { value: '80' } });

			await waitFor(() => {
				expect(onFieldChange).toHaveBeenCalledWith('skill', expect.anything());
			});
		});

		it('hides slider value in label when showValue is false', () => {
			const config = makeConfig({
				fields: [
					{
						name: 'skill',
						label: 'Skill Level',
						type: 'slider',
						min: 0,
						max: 100,
						sliderConfig: { showValue: false }
					}
				]
			});
			render(
				<DynamicFormAdapter
					config={config}
					onFieldChange={jest.fn()}
					initialValues={{ skill: [60] } as never}
				/>
			);
			// Label should just be "Skill Level" with no "(60%)" appended
			const label = screen.getByText('Skill Level');
			expect(label.textContent).toBe('Skill Level');
		});

		it('uses valueFormat from sliderConfig when provided', () => {
			const config = makeConfig({
				fields: [
					{
						name: 'years',
						label: 'Experience',
						type: 'slider',
						min: 0,
						max: 30,
						sliderConfig: {
							showValue: true,
							valueFormat: (v: number) => `${v} yrs`
						}
					}
				]
			});
			render(
				<DynamicFormAdapter config={config} onFieldChange={jest.fn()} initialValues={{ years: [5] } as never} />
			);
			expect(screen.getByText(/5 yrs/)).toBeInTheDocument();
		});
	});
});
