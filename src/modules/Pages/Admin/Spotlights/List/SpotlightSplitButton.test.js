import React from 'react';
import { rtlRender } from 'test-utils';
import SpotlightSplitButton from './SpotlightSplitButton';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
}));

function setup(testProps = {}) {
    const props = {
        deleteSpotlightById: jest.fn(),
        mainButtonLabel: 'Edit',
        navigateToCloneForm: jest.fn(),
        navigateToView: jest.fn(),
        confirmDeleteLocale: jest.fn(),
        showViewByHistoryOption: jest.fn(),
        spotlight: [],
    };
    return rtlRender(<SpotlightSplitButton {...props} {...testProps} />);
}

describe('SpotlightSplitButton', () => {
    it('default values render correctly', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });
});
