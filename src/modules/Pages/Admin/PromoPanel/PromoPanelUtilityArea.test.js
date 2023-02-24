import { PromoPanelUtilityArea, navigateToAddPage } from './PromoPanelUtilityArea';
import React from 'react';

import { rtlRender, fireEvent } from '../../../../../utils/test-utils';

const props = {
    helpButtonLabel: 'Help',
    helpContent: { title: 'Test help content', text: 'Help content text' },
    history: { push: jest.fn() },
    showAddButton: true,
};

function setupRender(testProps = {}) {
    return rtlRender(<PromoPanelUtilityArea {...props} {...testProps} />);
}

describe('Utility Tests', () => {
    it('renders the utility area correctly', () => {
        const wrapper = setupRender();
        expect(wrapper).toMatchSnapshot();
    });
    it('navigateToAddPage works correctly', () => {
        const pushHistory = jest.fn();
        const history = { push: pushHistory };
        navigateToAddPage(history);
        expect(pushHistory).toBeCalled();
    });
    it('Buttons function as expected', () => {
        const historyMock = jest.fn();
        const { getByTestId } = setupRender({ history: { push: historyMock } });

        fireEvent.click(getByTestId('admin-promopanel-add-display-button'));
        expect(historyMock).toBeCalled();
        fireEvent.click(getByTestId('admin-promopanel-help-button'));
        expect(getByTestId('help-drawer-title')).toBeInTheDocument();
        fireEvent.click(getByTestId('promopanel-helpdrawer-close-button'));
        expect(getByTestId('help-drawer-title')).not.toBeVisible();
    });
});
