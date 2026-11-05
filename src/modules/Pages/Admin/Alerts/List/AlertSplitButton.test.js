import React from 'react';
import { act, rtlRender, userEvent, waitFor } from 'test-utils';
import AlertSplitButton from './AlertSplitButton';

jest.mock('@mui/material/ClickAwayListener', () => {
    const React = jest.requireActual('react');

    return ({ children, onClickAway }) => {
        globalThis.__alertSplitButtonClickAway = onClickAway;
        return React.createElement(React.Fragment, null, children);
    };
});

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

describe('AlertSplitButton', () => {
    afterEach(() => {
        delete window.__alertSplitButtonClickAway;
    });

    it('default values render correctly', () => {
        const { container } = setup();
        expect(container).toMatchSnapshot();
    });

    it('navigates to the edit form from the main button', async () => {
        const navigateToEditForm = jest.fn();
        const { getByTestId } = setup({ navigateToEditForm });

        await userEvent.click(getByTestId('alert-list-item-edit-1'));

        expect(navigateToEditForm).toHaveBeenCalledWith('1');
    });

    it('navigates to the view form when the main button is labeled View', async () => {
        const navigateToView = jest.fn();
        const { getByTestId } = setup({ mainButtonLabel: 'View', navigateToView });

        await userEvent.click(getByTestId('alert-list-item-view-1'));

        expect(navigateToView).toHaveBeenCalledWith('1');
    });

    it('opens the more-actions menu and navigates to clone', async () => {
        const navigateToCloneForm = jest.fn();
        const { getByRole, getByTestId } = setup({ navigateToCloneForm });

        await userEvent.click(getByRole('button', { name: 'More actions' }));
        await userEvent.click(getByTestId('1-clone-button'));

        expect(navigateToCloneForm).toHaveBeenCalledWith('1');
    });

    it('closes the menu when toggled from its anchor or dismissed outside', async () => {
        const { getByRole, getByTestId, queryByTestId } = setup();
        const moreActionsButton = getByRole('button', { name: 'More actions' });

        await userEvent.click(moreActionsButton);
        expect(getByTestId('1-clone-button')).toBeInTheDocument();

        await userEvent.click(moreActionsButton);
        await waitFor(() => expect(queryByTestId('1-clone-button')).not.toBeInTheDocument());

        await userEvent.click(moreActionsButton);
        expect(getByTestId('1-clone-button')).toBeInTheDocument();

        act(() => {
            window.__alertSplitButtonClickAway({ target: document.body });
        });
        await waitFor(() => expect(queryByTestId('1-clone-button')).not.toBeInTheDocument());
    });

    it('keeps the menu open when a click-away event targets the button anchor', async () => {
        const { getByRole, getByTestId } = setup();

        await userEvent.click(getByRole('button', { name: 'More actions' }));
        window.__alertSplitButtonClickAway({ target: getByTestId('alert-list-arrowicon-1') });

        expect(getByTestId('1-clone-button')).toBeInTheDocument();
    });

    it('confirms deletion and calls the delete handler with the alert id', async () => {
        const deleteAlertById = jest.fn();
        const confirmDeleteLocale = jest.fn();
        const { getByRole, getByTestId, queryByTestId } = setup({ deleteAlertById, confirmDeleteLocale });

        await userEvent.click(getByRole('button', { name: 'More actions' }));
        await userEvent.click(getByTestId('1-delete-button'));

        expect(confirmDeleteLocale).toHaveBeenCalledWith(1);
        expect(getByTestId('dialogbox-alert-delete-confirm')).toBeInTheDocument();
        await userEvent.click(getByRole('button', { name: 'Yes' }));

        expect(deleteAlertById).toHaveBeenCalledWith('1');
        await waitFor(() => {
            expect(queryByTestId('dialogbox-alert-delete-confirm')).not.toBeInTheDocument();
        });
    });

    it('closes the delete confirmation when cancelled', async () => {
        const { getByRole, getByTestId, queryByTestId } = setup();

        await userEvent.click(getByRole('button', { name: 'More actions' }));
        await userEvent.click(getByTestId('1-delete-button'));
        expect(getByTestId('dialogbox-alert-delete-confirm')).toBeInTheDocument();

        await userEvent.click(getByRole('button', { name: 'No' }));

        await waitFor(() => {
            expect(queryByTestId('dialogbox-alert-delete-confirm')).not.toBeInTheDocument();
        });
    });
});
