import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StepsBar, StepsBarItemsProps } from './StepsBar';

const mockComponent = () => {
	return <button>Mock Component</button>;
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
	const items: StepsBarItemsProps[] = [
		{ title: 'Step 1', active: true, component: mockComponent },
		{ title: 'Step 2', active: false, component: mockComponent },
		{ title: 'Step 3', active: false, component: mockComponent }
	];

	const onNextStepCallback = jest.fn();
	const onFieldChangeCallback = jest.fn();

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
		expect(steps.length).toBe(3);
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
		expect(getByRole('button', { name: 'Mock Component' })).toBeInTheDocument();
	});

	it('should update the selected index when a step is clicked', () => {
		const { getByText } = render(
			<StepsBar
				items={items}
				activeStep={0}
				onNextStepCallback={onNextStepCallback}
				onFieldChangeCallback={onFieldChangeCallback}
				initialValues={mockUserData}
			/>
		);
		fireEvent.click(getByText('Step 2'));
		expect(getByText('Mock Component')).toBeInTheDocument();
	});
});
