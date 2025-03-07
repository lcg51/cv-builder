import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StepsBar, StepsBarItemsProps } from './StepsBar';
import { defaultUserData } from '@/app/models/user';

const mockComponent = () => <div>Mock Component</div>;

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
				initialValues={defaultUserData}
			/>
		);
		const steps = getAllByText(/Step/);
		expect(steps.length).toBe(3);
	});

	it('should render the active step component', () => {
		const { getByText } = render(
			<StepsBar
				items={items}
				activeStep={0}
				onNextStepCallback={onNextStepCallback}
				onFieldChangeCallback={onFieldChangeCallback}
				initialValues={defaultUserData}
			/>
		);
		expect(getByText('Mock Component')).toBeInTheDocument();
	});

	it('should call onNextStepCallback when onSuccess is triggered', () => {
		const { getByText } = render(
			<StepsBar
				items={items}
				activeStep={0}
				onNextStepCallback={onNextStepCallback}
				onFieldChangeCallback={onFieldChangeCallback}
				initialValues={defaultUserData}
			/>
		);
		fireEvent.click(getByText('Mock Component'));
		expect(onNextStepCallback).toHaveBeenCalled();
	});

	it('should update the filled bar width correctly', () => {
		const { container } = render(
			<StepsBar
				items={items}
				activeStep={0}
				onNextStepCallback={onNextStepCallback}
				onFieldChangeCallback={onFieldChangeCallback}
				initialValues={defaultUserData}
			/>
		);
		const filledBar = container.querySelector('.steps-bar--fill');
		expect(filledBar).toHaveStyle('width: calc(33.33333333333333%)');
	});

	it('should update the selected index when a step is clicked', () => {
		const { getByText } = render(
			<StepsBar
				items={items}
				activeStep={0}
				onNextStepCallback={onNextStepCallback}
				onFieldChangeCallback={onFieldChangeCallback}
				initialValues={defaultUserData}
			/>
		);
		fireEvent.click(getByText('Step 2'));
		expect(getByText('Mock Component')).toBeInTheDocument();
	});
});
