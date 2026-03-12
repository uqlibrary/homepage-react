import React from 'react';
// import { render } from '@testing-library/react';
import { render } from 'test-utils';
import config from './configure';

describe('RenderBox component from helpers', () => {
    it('renders checkbox with correct props', () => {
        const props = {
            value: true,
            checked: true,
            id: 'team_current_flag_cb-input',
            inputProps: { 'data-testid': 'data-test-id' },
            onChange: jest.fn(),
        };

        const data = {
            team_current_flag_cb: true,
            isSelf: true,
        };

        const row = {
            team_current_flag_cb: true,
            isSelf: true,
        };
        const { getByTestId } = render(<>{config.fields.team_current_flag_cb.component(props, data, row)}</>);

        expect(getByTestId('data-test-id')).toHaveAttribute('disabled');
    });
});
