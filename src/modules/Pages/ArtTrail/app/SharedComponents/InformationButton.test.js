import React from 'react';
import { rtlRender, userEvent } from 'test-utils';

import InformationButton from './InformationButton';

const setup = (props = {}) => rtlRender(<InformationButton onClick={jest.fn()} {...props} />);

describe('InformationButton', () => {
    it('renders an accessible button and handles clicks', async () => {
        const onClick = jest.fn();
        const { getByRole } = setup({ onClick });

        await userEvent.click(getByRole('button', { name: 'More information about this artwork' }));

        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('positions the button and allows styles and props to be overridden', () => {
        const { getByRole } = setup({ disabled: true, sx: { top: '16px', left: '4px' } });

        expect(getByRole('button', { name: 'More information about this artwork' })).toHaveStyle({
            position: 'absolute',
            top: '16px',
            right: '8px',
            left: '4px',
            padding: 0,
        });
        expect(getByRole('button', { name: 'More information about this artwork' })).toBeDisabled();
    });
});
