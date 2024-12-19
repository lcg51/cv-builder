import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StepsBar } from './StepsBar';

describe('StepsBar', () => {
	it('should sort items correctly', () => {
		const items = [
			{ title: 'Step 1', active: false },
			{ title: 'Step 2', active: true },
			{ title: 'Step 3', active: false }
		];
		const { getAllByText } = render(<StepsBar items={items} />);
		const titles = getAllByText(/Step/).map(el => el.textContent);
		expect(titles).toEqual(['Step 2', 'Step 1', 'Step 3']);
	});

	it('should calculate filled bar width correctly', () => {
		const items = [
			{ title: 'Step 1', active: true },
			{ title: 'Step 2', active: true },
			{ title: 'Step 3', active: false }
		];
		const { container } = render(<StepsBar items={items} />);
		const filledBar = container.querySelector('.steps-bar--fill');
		expect(filledBar).toHaveStyle('width: calc(66.66666666666666%)');
	});

	it('should render correct number of active and inactive bullets', () => {
		const items = [
			{ title: 'Step 1', active: true },
			{ title: 'Step 2', active: false },
			{ title: 'Step 3', active: true }
		];
		const { container } = render(<StepsBar items={items} />);
		const activeBullets = container.querySelectorAll('.bullet.active');
		const inactiveBullets = container.querySelectorAll('.bullet:not(.active)');
		expect(activeBullets.length).toBe(2);
		expect(inactiveBullets.length).toBe(1);
	});
});
