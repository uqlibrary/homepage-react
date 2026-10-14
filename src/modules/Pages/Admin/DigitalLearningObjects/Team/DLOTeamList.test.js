import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router';
import { useAccountContext } from 'context';
import { rtlRender, WithRouter } from '../../../../../../utils/test-utils';

import { DLOTeamList } from './DLOTeamList';

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: jest.fn(),
}));

jest.mock('context', () => ({
    useAccountContext: jest.fn(),
}));

jest.mock('modules/SharedComponents/Toolbox/StandardPage', () => ({
    StandardPage: ({ title, children }) => <div data-testid="standard-page" data-title={title}>{children}</div>,
}));

jest.mock('modules/SharedComponents/Toolbox/Loaders', () => ({
    InlineLoader: ({ message }) => <div data-testid="inline-loader">{message}</div>,
}));

jest.mock('modules/SharedComponents/Toolbox/ConfirmDialogBox', () => ({
    ConfirmationBox: ({ isOpen, locale, onAction, onCancelAction, onClose }) => {
        if (!isOpen) return null;
        return (
            <div data-testid="dialogbox-dlor-team-delete-confirm">
                <div data-testid="dialog-title">{locale.confirmationTitle}</div>
                <button type="button" onClick={onAction}>{locale.confirmButtonLabel}</button>
                {!locale.hideCancelButton && !!locale.cancelButtonLabel && (
                    <button type="button" onClick={onCancelAction}>{locale.cancelButtonLabel}</button>
                )}
                <button type="button" onClick={onClose}>Close</button>
            </div>
        );
    },
}));

jest.mock('modules/Pages/Admin/DigitalLearningObjects/SharedDlorComponents/DlorAdminBreadcrumbs', () => ({
    __esModule: true,
    default: ({ breadCrumbList }) => <div data-testid="breadcrumbs">{breadCrumbList?.map(item => item.title).join(', ')}</div>,
}));

jest.mock('modules/Pages/Admin/DigitalLearningObjects//SharedDlorComponents/ObjectListItem', () => ({
    ObjectListItem: ({ object }) => <div data-testid={`team-object-${object?.object_public_uuid}`}>{object?.object_title}</div>,
}));

const sampleDlorList = [
    {
        object_public_uuid: 'obj-1',
        object_title: 'Alpha object',
        object_owning_team_id: 1,
    },
    {
        object_public_uuid: 'obj-2',
        object_title: 'Beta object',
        object_owning_team_id: 2,
    },
];

const sampleTeams = [
    {
        team_id: 1,
        team_name: 'Alpha team',
        objects_count: 1,
        team_members: [{ team_admin_username: 'u1234567' }],
    },
    {
        team_id: 2,
        team_name: 'Beta team',
        objects_count: 0,
        team_members: [{ team_admin_username: 'other-user' }],
    },
];

const renderTeamList = (props = {}) => {
    const actions = {
        loadOwningTeams: jest.fn(() => Promise.resolve()),
        loadAllDLORs: jest.fn(() => Promise.resolve()),
        deleteDlorTeam: jest.fn(() => Promise.resolve()),
        ...(props.actions || {}),
    };

    const mergedProps = {
        actions,
        dlorTeamList: sampleTeams,
        dlorTeamListLoading: false,
        dlorTeamListError: null,
        dlorList: sampleDlorList,
        dlorListLoading: false,
        dlorListError: null,
        dlorTeamDeleting: false,
        dlorTeamDeleted: null,
        dlorTeamDeleteError: null,
        ...props,
    };

    const view = rtlRender(
        <WithRouter>
            <DLOTeamList {...mergedProps} />
        </WithRouter>,
    );

    return { actions, ...view };
};

describe('DLOTeamList', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useNavigate.mockReturnValue(jest.fn());
        useAccountContext.mockReturnValue({ account: { id: 'u1234567', groups: ['lib_dlor_admins'] } });
    });

    it('shows the loading state while team data is still loading', () => {
        renderTeamList({ dlorTeamListLoading: true, dlorTeamList: null });

        expect(screen.getByTestId('inline-loader')).toHaveTextContent('Loading');
    });

    it('shows the error when the team list fails to load', () => {
        renderTeamList({ dlorTeamListError: 'Failed to load teams', dlorTeamList: null });

        expect(screen.getByTestId('dlor-teamlist-error')).toHaveTextContent('Failed to load teams');
    });

    it('shows the empty state when there are no teams in the system', () => {
        renderTeamList({ dlorTeamList: [] });

        expect(screen.getByTestId('dlor-teamlist-noresult')).toHaveTextContent(
            'We did not find any entries in the system - please try again later.',
        );
    });

    it('loads team and DLO data on mount when they are not already available', () => {
        const { actions } = renderTeamList({ dlorTeamList: null, dlorList: null });

        expect(actions.loadOwningTeams).toHaveBeenCalledTimes(1);
        expect(actions.loadAllDLORs).toHaveBeenCalledTimes(1);
    });

    it('renders the admin add button and navigates to the add page when clicked', () => {
        const navigate = jest.fn();
        useNavigate.mockReturnValue(navigate);

        renderTeamList();

        fireEvent.click(screen.getByTestId('admin-dlor-visit-add-button'));

        expect(navigate).toHaveBeenCalledWith('/admin/dlor/team/add');
    });

    it('renders the team details and navigates to the edit page when the edit button is clicked', () => {
        const navigate = jest.fn();
        useNavigate.mockReturnValue(navigate);

        renderTeamList();

        expect(screen.getByText('Alpha team')).toBeInTheDocument();
        expect(screen.getByText('1 Object')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('dlor-teamlist-edit-1'));

        expect(navigate).toHaveBeenCalledWith('/admin/dlor/team/edit/1');
    });

    it('shows the no-access message for a non-admin user without team membership', () => {
        useAccountContext.mockReturnValue({ account: { id: 'u1234567', groups: ['other-group'] } });
        renderTeamList({
            dlorTeamList: [
                { team_id: 4, team_name: 'Hidden team', objects_count: 0, team_members: [{ team_admin_username: 'someone-else' }] },
            ],
        });

        expect(screen.getByTestId('dlor-teamlist-no-access')).toHaveTextContent(
            'You do not have access to any teams. If you believe this is an error, please contact support.',
        );
    });

    it('opens the confirmation modal and deletes the team when the user confirms', async () => {
        const { actions } = renderTeamList({
            dlorTeamList: [{ team_id: 2, team_name: 'Beta team', objects_count: 0, team_members: [{ team_admin_username: 'u1234567' }] }],
            dlorList: [],
        });

        fireEvent.click(screen.getByTestId('dlor-teamlist-delete-2'));
        expect(screen.getByTestId('dialogbox-dlor-team-delete-confirm')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Yes'));

        await waitFor(() => {
            expect(actions.deleteDlorTeam).toHaveBeenCalledWith(2);
        });
        await waitFor(() => {
            expect(actions.loadOwningTeams).toHaveBeenCalledTimes(1);
        });
    });

    it('shows the success confirmation state after a successful delete result is returned', async () => {
        const { actions, rerender } = renderTeamList({
            dlorTeamList: [{ team_id: 2, team_name: 'Beta team', objects_count: 0, team_members: [{ team_admin_username: 'u1234567' }] }],
            dlorList: [],
            dlorTeamDeleted: null,
        });

        fireEvent.click(screen.getByTestId('dlor-teamlist-delete-2'));
        fireEvent.click(screen.getByText('Yes'));
        await waitFor(() => expect(actions.deleteDlorTeam).toHaveBeenCalledWith(2));

        rerender(
            <WithRouter>
                <DLOTeamList
                    actions={actions}
                    dlorTeamList={[{ team_id: 2, team_name: 'Beta team', objects_count: 0, team_members: [{ team_admin_username: 'u1234567' }] }]}
                    dlorTeamListLoading={false}
                    dlorTeamListError={null}
                    dlorList={[]}
                    dlorListLoading={false}
                    dlorListError={null}
                    dlorTeamDeleting={false}
                    dlorTeamDeleted={[]}
                    dlorTeamDeleteError={null}
                />
            </WithRouter>,
        );

        await waitFor(() => {
            expect(screen.getByTestId('dialog-title')).toHaveTextContent('The team has been deleted.');
        });
    });

    it('shows the error confirmation state after a failed delete result is returned', async () => {
        const { actions, rerender } = renderTeamList({
            dlorTeamList: [{ team_id: 2, team_name: 'Beta team', objects_count: 0, team_members: [{ team_admin_username: 'u1234567' }] }],
            dlorList: [],
            dlorTeamDeleteError: null,
        });

        fireEvent.click(screen.getByTestId('dlor-teamlist-delete-2'));
        fireEvent.click(screen.getByText('Yes'));
        await waitFor(() => expect(actions.deleteDlorTeam).toHaveBeenCalledWith(2));

        rerender(
            <WithRouter>
                <DLOTeamList
                    actions={actions}
                    dlorTeamList={[{ team_id: 2, team_name: 'Beta team', objects_count: 0, team_members: [{ team_admin_username: 'u1234567' }] }]}
                    dlorTeamListLoading={false}
                    dlorTeamListError={null}
                    dlorList={[]}
                    dlorListLoading={false}
                    dlorListError={null}
                    dlorTeamDeleting={false}
                    dlorTeamDeleted={null}
                    dlorTeamDeleteError="Delete failed"
                />
            </WithRouter>,
        );

        await waitFor(() => {
            expect(screen.getByTestId('dialog-title')).toHaveTextContent('Delete failed');
        });
    });
});
