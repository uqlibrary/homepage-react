import React from 'react';
import { rtlRender } from 'test-utils';
import AlertSplitButton from './AlertSplitButton';
function setup(testProps = {}) {
    const props = {
        alertId: '1',
        deleteAlertById: jest.fn(),
        // mainButtonLabel = 'Edit',
        navigateToCloneForm: jest.fn(),
        navigateToEditForm: jest.fn(),
        navigateToView: jest.fn(),
        confirmDeleteLocale: jest.fn(),
    };
    return rtlRender(<AlertSplitButton {...props} {...testProps} />);
}

describe('defaults', () => {
    it('default values render correctly', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });
});
