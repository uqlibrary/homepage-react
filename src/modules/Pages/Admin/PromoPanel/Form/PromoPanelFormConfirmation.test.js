import React from 'react';
import PromoPanelFormConfirmation from './PromoPanelFormConfirmation';
import { rtlRender } from '../../../../../../utils/test-utils';

function setup(testProps = {}) {
    const props = {
        confirmationMode: 'save',
        isConfirmOpen: true,
        confirmSave: jest.fn(),
        cancelAction: jest.fn(),
        confirmationMessage: 'Testing Content',
    };
    return rtlRender(<PromoPanelFormConfirmation {...props} {...testProps} />);
}

describe('Promo Panel Form confirmation', () => {
    it('renders as expected for Save', () => {
        const expected = 'Testing Save';
        const staticExpected = 'Please Confirm';
        const { getByText } = setup({ confirmationMessage: expected });
        expect(getByText(expected)).toBeInTheDocument();
        expect(getByText(staticExpected)).toBeInTheDocument();
        // screen.debug(undefined, 10000);
    });
    it('renders as expected for schedule conflict', () => {
        const expected = 'Testing Schedule';
        const staticExpected = 'Schedule Conflict';
        const { getByText } = setup({ confirmationMode: 'schedule', confirmationMessage: expected });
        expect(getByText(expected)).toBeInTheDocument();
        expect(getByText(staticExpected)).toBeInTheDocument();
        // screen.debug(undefined, 10000);
    });
});
