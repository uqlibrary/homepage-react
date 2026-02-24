import React from 'react';
// import { render } from '@testing-library/react';
import { render } from 'test-utils';
import config from './configure';

describe('RenderBox component from helpers', () => {
    it('renders checkbox with correct props', () => {
        const props = {
            value: true,
            checked: true,
            id: 'can_admin_cb-input',
            inputProps: { 'data-testid': 'data-test-id' },
            onChange: jest.fn(),
        };

        const data = {
            can_admin_cb: true,
            isSelf: true,
        };

        const row = {
            can_admin_cb: true,
            isSelf: true,
        };
        const { getByTestId } = render(<>{config.fields.can_admin_cb.component(props, data, row)}</>);

        expect(getByTestId('data-test-id')).toHaveAttribute('disabled');
    });
});
