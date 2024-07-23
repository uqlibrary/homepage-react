import React from 'react';
import { rtlRender } from 'test-utils';
import AlertsListAsTable from './AlertsListAsTable';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
}));
function setup(testProps = {}) {
    const props = {
        rows: [],
        headertag: 'Current alerts',
        alertsLoading: false,
        actions: {},
        deleteAlert: jest.fn(),
    };
    return rtlRender(<AlertsListAsTable {...props} {...testProps} />);
}

describe('PersonalisedPanel', () => {
    it('default values render correctly', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });
});
