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
