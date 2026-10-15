import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useNavigate, useParams } from 'react-router';
import { useCookies } from 'react-cookie';
import { useAccountContext } from 'context';

import { DLOTeamForm } from './DlOTeamForm';

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: jest.fn(),
    useParams: jest.fn(),
}));

jest.mock('react-cookie', () => ({
    useCookies: jest.fn(),
}));

jest.mock('context', () => ({
    useAccountContext: jest.fn(),
}));

jest.mock('modules/SharedComponents/Toolbox/ConfirmDialogBox', () => ({
    ConfirmationBox: ({ isOpen, locale, onAction, onCancelAction, onClose, confirmationBoxId }) => {
        if (!isOpen) return null;

        return (
            <div data-testid={confirmationBoxId || 'confirmation-box'}>
                <div data-testid="confirmation-title">{locale.confirmationTitle}</div>
                <div data-testid="confirmation-message">{locale.confirmationMessage}</div>
                {locale.cancelButtonLabel && (
                    <button type="button" onClick={onCancelAction}>
                        {locale.cancelButtonLabel}
                    </button>
                )}
                <button type="button" onClick={onAction}>
                    {locale.confirmButtonLabel}
                </button>
                <button type="button" onClick={onClose}>
                    Close
                </button>
            </div>
        );
    },
}));

jest.mock('modules/SharedComponents/Toolbox/Loaders', () => ({
    InlineLoader: ({ message }) => <div data-testid="inline-loader">{message}</div>,
}));

const baseFormDefaults = {
    team_id: 42,
    team_name: 'Alpha Team',
    team_manager: 'Team Manager',
    team_admin_username: 'admin1',
    team_email: 'admin1@example.com',
    team_members: [
        {
            team_admin_id: 101,
            team_admin_username: 'admin1',
            team_admin_email: 'admin1@example.com',
            team_admin_receive_object_notifications: true,
            team_admin_receive_overdue_notifications: false,
            created_at: '2024-01-01T00:00:00Z',
            team_id: 42,
        },
    ],
};

const renderForm = (props = {}) => {
    const actions = {
        createDlorTeam: jest.fn(),
        updateDlorTeam: jest.fn(),
        editDlorTeamMember: jest.fn(),
        addDlorTeamMember: jest.fn(),
        deleteDlorTeamMember: jest.fn(),
        ...props.actions,
    };

    render(
        <DLOTeamForm
            actions={actions}
            formDefaults={baseFormDefaults}
            dlorTeamLoading={false}
            dlorTeamError={null}
            dlorTeamSaving={false}
            dlorSavedTeamError={null}
            dlorSavedTeam={null}
            mode="edit"
            {...props}
        />,
    );

    return { actions };
};

describe('DLOTeamForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useParams.mockReturnValue({ dlorTeamId: '42' });
        useNavigate.mockReturnValue(jest.fn());
        useCookies.mockReturnValue([{}, jest.fn()]);
        useAccountContext.mockReturnValue({ account: { id: 'u1234567', groups: ['lib_dlor_admins'] } });
    });

    it('shows the loading display while the team is still being loaded in edit mode', () => {
        render(
            <DLOTeamForm
                actions={{}}
                formDefaults={null}
                dlorTeamLoading={true}
                dlorTeamError={null}
                dlorTeamSaving={false}
                dlorSavedTeamError={null}
                dlorSavedTeam={null}
                mode="edit"
            />,
        );

        expect(screen.getByTestId('inline-loader')).toHaveTextContent('Loading');
    });

    it('shows the team error state and exits early when the team cannot load', () => {
        render(
            <DLOTeamForm
                actions={{}}
                formDefaults={null}
                dlorTeamLoading={false}
                dlorTeamError="Load failed"
                dlorTeamSaving={false}
                dlorSavedTeamError={null}
                dlorSavedTeam={null}
                mode="edit"
            />,
        );

        expect(screen.getByTestId('dlor-teamItem-error')).toHaveTextContent('Load failed');
    });

    it('renders an empty state when adding a team without defaults', () => {
        renderForm({
            mode: 'add',
            formDefaults: null,
        });

        expect(screen.queryByTestId('dlor-team-item-list')).not.toBeInTheDocument();
        expect(screen.queryByTestId('inline-loader')).not.toBeInTheDocument();
    });

    it('blocks editing for users who are not a member of the team', () => {
        useAccountContext.mockReturnValue({ account: { id: 'other-user', groups: ['other-group'] } });

        renderForm();

        expect(screen.getByTestId('dlor-teamItem-error-message')).toHaveTextContent(
            'You are not a member of this team and cannot edit it.',
        );
    });

    it('closes the team save confirmation from its close control', () => {
        renderForm({
            dlorSavedTeam: { team_id: 42 },
        });

        fireEvent.click(screen.getByText('Close'));

        expect(screen.queryByTestId('dlor-team-save-outcome')).not.toBeInTheDocument();
    });

    it('closes a failed team save confirmation from its action button', () => {
        renderForm({
            dlorSavedTeamError: 'Save failed',
        });

        const confirmation = screen.getByTestId('dlor-team-save-outcome');
        expect(screen.getByTestId('confirmation-title')).toHaveTextContent('Save failed');
        fireEvent.click(confirmation.querySelector('button'));

        expect(screen.queryByTestId('dlor-team-save-outcome')).not.toBeInTheDocument();
    });

    it('closes an add confirmation without reloading the page', () => {
        renderForm({
            mode: 'add',
            dlorSavedTeam: { team_id: 42 },
        });

        fireEvent.click(screen.getByText('Add another Team'));

        expect(screen.queryByTestId('dlor-team-save-outcome')).not.toBeInTheDocument();
    });

    it('renders the form defaults and saves valid team updates', async () => {
        const { actions } = renderForm();

        const teamNameInput = document.getElementById('team_name');
        const teamAdminUsernameInput = document.getElementById('team_admin_username');
        const teamEmailInput = document.getElementById('team_email');
        const saveButton = screen.getByTestId('admin-dlor-team-form-save-button');

        fireEvent.change(teamNameInput, { target: { value: 'Alpha Team Updated' } });
        fireEvent.change(teamAdminUsernameInput, { target: { value: 'admin2' } });
        fireEvent.change(teamEmailInput, { target: { value: 'admin2@example.com' } });

        await waitFor(() => expect(saveButton).not.toBeDisabled());

        fireEvent.click(saveButton);

        expect(actions.updateDlorTeam).toHaveBeenCalledWith(
            '42',
            expect.objectContaining({
                team_name: 'Alpha Team Updated',
                team_manager: 'Team Manager',
                team_admin_username: 'admin2',
                team_email: 'admin2@example.com',
            }),
        );
    });

    it('adds a valid new team admin when the form is filled in', async () => {
        const { actions } = renderForm();

        const usernameInput = screen.getByPlaceholderText('Username');
        const emailInput = screen.getByPlaceholderText('Email');
        const addButton = screen.getByTestId('add-team-member-button');

        fireEvent.change(usernameInput, { target: { value: 'newadmin' } });
        fireEvent.change(emailInput, { target: { value: 'newadmin@example.com' } });

        await waitFor(() => expect(addButton).not.toBeDisabled());

        fireEvent.click(addButton);

        expect(actions.addDlorTeamMember).toHaveBeenCalledWith({
            team_admin_username: 'newadmin',
            team_admin_email: 'newadmin@example.com',
            team_id: 42,
        });
    });
});
