import { PromoPanelUtilityArea, navigateToAddPage } from './PromoPanelUtilityArea';
import React from 'react';

import { rtlRender, fireEvent } from 'test-utils';

const mockUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockUseNavigate,
}));

const props = {
    helpButtonLabel: 'Help',
    helpContent: { title: 'Test help content', text: 'Help content text' },
    showAddButton: true,
};

function setupRender(testProps = {}) {
    return rtlRender(<PromoPanelUtilityArea {...props} {...testProps} />);
}

describe('Utility Tests', () => {
    afterEach(() => {
        mockUseNavigate.mockClear();
    });
    it('renders the utility area correctly', () => {
        const wrapper = setupRender();
        expect(wrapper).toMatchSnapshot();
    });
    it('navigateToAddPage works correctly', () => {
        navigateToAddPage(mockUseNavigate);
        expect(mockUseNavigate).toBeCalled();
    });
    it('Buttons function as expected', () => {
        const { getByTestId } = setupRender();

        fireEvent.click(getByTestId('admin-promopanel-add-display-button'));
        expect(mockUseNavigate).toBeCalled();
        fireEvent.click(getByTestId('admin-promopanel-help-button'));
        expect(getByTestId('help-drawer-title')).toBeInTheDocument();
        fireEvent.click(getByTestId('promopanel-helpdrawer-close-button'));
        expect(getByTestId('help-drawer-title')).not.toBeVisible();
    });
});
