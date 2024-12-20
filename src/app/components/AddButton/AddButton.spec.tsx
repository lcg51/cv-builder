import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { AddButton } from './AddButton';

describe('AddButton', () => {
	it('should call onClickCallback when clicked', () => {
		const onClickCallback = jest.fn();
		const { getByRole } = render(<AddButton onClickCallback={onClickCallback} />);

		const button = getByRole('button');
		fireEvent.click(button);

		expect(onClickCallback).toHaveBeenCalledTimes(1);
	});
});
