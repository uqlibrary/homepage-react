import React from 'react';
import { rtlRender, userEvent } from 'test-utils';

import LocationButton from './LocationButton';

const setup = (props = {}) => rtlRender(<LocationButton title="this artwork" onClick={jest.fn()} {...props} />);

describe('LocationButton', () => {
    it('renders an accessible button and handles clicks', async () => {
        const onClick = jest.fn();
        const { getByRole } = setup({ onClick });

        await userEvent.click(getByRole('button', { name: 'Location information about this artwork' }));

        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('positions the button and allows styles and props to be overridden', () => {
        const { getByRole } = setup({ disabled: true, sx: { bottom: '16px', left: '4px' } });

        expect(getByRole('button', { name: 'Location information about this artwork' })).toHaveStyle({
            position: 'absolute',
            bottom: '16px',
            right: '8px',
            left: '4px',
            padding: 0,
        });
        expect(getByRole('button', { name: 'Location information about this artwork' })).toBeDisabled();
    });
});
