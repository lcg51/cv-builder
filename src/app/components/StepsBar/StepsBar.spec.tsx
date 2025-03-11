import React from 'react';
import { render, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { StepsBar, StepsBarComponentProps, StepsBarItemsProps } from './StepsBar';

const mockComponent1 = ({ onSuccess }: StepsBarComponentProps) => {
	return <button onClick={onSuccess}>Mock Component 1</button>;
};

const mockComponent2 = () => {
	return <button>Mock Component 2</button>;
};

const mockUserData = {
	firstName: 'John',
	lastName: 'Doe',
	email: 'john.doe@example.com',
	phone: '123-456-7890',
	city: 'New York',
	postalCode: '10001',
	role: 'Software Engineer',
	education: [
		{
			university: 'University of Example',
			degree: 'Bachelor of Science',
			fieldOfStudy: 'Computer Science',
			finishDate: new Date(),
			city: 'New York',
			description: 'Studied computer science.'
		}
	],
	workExperience: [
		{
			jobTitle: 'Software Developer',
			company: 'Example Corp',
			startDate: new Date(),
			endDate: new Date(),
			location: 'New York',
			description: 'Developed software applications.'
		}
	],
	skills: [
		{
			category: 'Programming',
			description: 'JavaScript, TypeScript, React'
		}
	],
	linkedin: 'https://linkedin.com/in/johndoe',
	github: 'https://github.com/johndoe'
};

describe('StepsBar', () => {
	const user = userEvent.setup();
	const items: StepsBarItemsProps[] = [
		{ title: 'Step 1', active: true, isClickable: true, component: mockComponent1 },
		{ title: 'Step 2', active: false, isClickable: false, component: mockComponent2 }
	];

	const onNextStepCallback = jest.fn();
	const onFieldChangeCallback = jest.fn();
	const setSelectedIndex = jest.fn();

	beforeEach(() => {
		jest.spyOn(React, 'useState').mockImplementation(() => [0, setSelectedIndex]);
	});

	it('should render the correct number of steps', () => {
		const { getAllByText } = render(
			<StepsBar
				items={items}
				activeStep={0}
				onNextStepCallback={onNextStepCallback}
				onFieldChangeCallback={onFieldChangeCallback}
				initialValues={mockUserData}
			/>
		);
		const steps = getAllByText(/Step/);
		expect(steps.length).toBe(2);
	});

	it('should render the active step component', () => {
		const { getByRole } = render(
			<StepsBar
				items={items}
				activeStep={0}
				onNextStepCallback={onNextStepCallback}
				onFieldChangeCallback={onFieldChangeCallback}
				initialValues={mockUserData}
			/>
		);
		expect(getByRole('button', { name: 'Mock Component 1' })).toBeInTheDocument();
	});

	it('should update the selected index when a step is clicked', async () => {
		const { getByRole } = render(
			<StepsBar
				items={items}
				activeStep={0}
				onNextStepCallback={onNextStepCallback}
				onFieldChangeCallback={onFieldChangeCallback}
				initialValues={mockUserData}
			/>
		);

		await act(() => {
			user.click(getByRole('button', { name: 'Mock Component 1' }));
		});

		await waitFor(() => {
			expect(onNextStepCallback).toHaveBeenCalledWith([
				{ title: 'Step 1', active: true, component: mockComponent1 },
				{ title: 'Step 2', active: true, component: mockComponent2 }
			]);
		});
	});
});
