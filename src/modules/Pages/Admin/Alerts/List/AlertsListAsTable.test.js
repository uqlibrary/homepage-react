import React from 'react';
import { rtlRender } from 'test-utils';
import AlertsListAsTable from './AlertsListAsTable';
function setup(testProps = {}) {
    const props = {
        rows: [],
        headertag: 'Current alerts',
        alertsLoading: false,
        history: {},
        actions: {},
        deleteAlert: jest.fn(),
    };
    return rtlRender(<AlertsListAsTable {...props} {...testProps} />);
}

describe('defaults', () => {
    it('default values render correctly', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });
});
