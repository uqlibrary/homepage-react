import React from 'react';
import Teams from './Teams';
import { rtlRender, WithRouter, act, fireEvent, waitFor, WithReduxStore } from 'test-utils';
import Immutable from 'immutable';

import locale from '../../../testTag.locale';

const actions = {
    clearTeamListError: jest.fn(),
    loadTeamList: jest.fn(() => Promise.resolve()),
    addTeam: jest.fn(() => Promise.resolve()),
    updateTeam: jest.fn(() => Promise.resolve()),
    deleteTeam: jest.fn(() => Promise.resolve()),
};

const user = {
    department_display_name: 'Library',
    team_current_flag: 1,
    user_team: 'WSS',
    team_display_name: 'Work Station Support',
    user_id: 4,
    user_licence_number: 'NOT LICENSED',
    team_name: 'Reporting User',
    team_slug: 'uqmanager',
    privileges: {
        can_admin: 1,
        can_inspect: 0,
        can_alter: 0,
        can_see_reports: 1,
    },
    actions_count: 0,
};

const teamList = [
    {
        team_slug: 'SPACES',
        team_department: 'UQL',
        team_display_name: 'Spaces',
        created_at: null,
        updated_at: null,
        team_current_flag: 1,
        users_count: 1,
    },
    {
        team_slug: 'WSS',
        team_department: 'UQL',
        team_display_name: 'Work Station Support',
        created_at: null,
        updated_at: null,
        team_current_flag: 1,
        users_count: 15,
    },
    {
        team_slug: 'TESTDEL',
        team_department: 'UQL',
        team_display_name: 'Test deletion',
        created_at: null,
        updated_at: null,
        team_current_flag: 1,
        users_count: 0,
    },
];

function setup(testProps = {}, renderer = rtlRender) {
    const { state = {}, actions = {}, ...props } = testProps;
    const _state = {
        accountReducer: {
            accountLoading: false,
            account: { tnt: user },
        },
        ...state,
    };
    return renderer(
        <WithReduxStore initialState={Immutable.Map(_state)}>
            <WithRouter>
                <Teams
                    id="test"
                    actions={actions}
                    teamListLoading={false}
                    teamList={teamList}
                    teamListError={null}
                    {...props}
                />
            </WithRouter>
        </WithReduxStore>,
    );
}
describe('Manage Teams', () => {
    beforeEach(() => {
        jest.spyOn(console, 'error');
        console.error.mockImplementation(() => null);
    });

    afterEach(() => {
        console.error.mockRestore();
    });
    it('renders component standard', () => {
        const { getByText } = setup({ actions: actions });
        expect(getByText(locale.pages.manage.teams.header.pageSubtitle('', 'Library'))).toBeInTheDocument();
        expect(getByText('Spaces')).toBeInTheDocument();
    });
    it('catches error on LoadTeamList', async () => {
        actions.loadTeamList = jest.fn(() => {
            return Promise.reject('Testing Error');
        });

        const { getByText } = setup({ actions: actions });
        await waitFor(() => {
            expect(getByText(locale.pages.manage.teams.header.pageSubtitle('', 'Library'))).toBeInTheDocument();
        });
        expect(actions.loadTeamList).rejects.toEqual('Testing Error');
    });

    it('Add User functions correctly', async () => {
        actions.loadTeamList = jest.fn(() => {
            return Promise.resolve();
        });
        const { getByText, getByTestId } = setup({ actions: actions });

        expect(getByText(locale.pages.manage.teams.header.pageSubtitle('', 'Library'))).toBeInTheDocument();
        expect(getByText('Work Station Support')).toBeInTheDocument();
        expect(getByTestId('team-management-data-table-toolbar-export-menu')).toBeInTheDocument();
        await act(async () => {
            await fireEvent.click(getByTestId('team-management-data-table-toolbar-add-button'));
        });

        await waitFor(() => {
            expect(getByTestId('team_slug-input')).toBeInTheDocument();
        });
        await act(async () => {
            await fireEvent.change(getByTestId('team_slug-input'), { target: { value: 'TESTSLUG' } });
            await fireEvent.change(getByTestId('team_display_name-input'), { target: { value: 'TEST NEW TEAM' } });
        });

        // commit the change
        const expected = {
            team_current_flag: 1,
            team_display_name: 'TEST NEW TEAM',
            team_slug: 'TESTSLUG',
        };
        await act(async () => {
            await fireEvent.click(getByTestId('update_dialog-action-button'));
            expect(actions.addTeam).toHaveBeenCalledWith(expected);
        });

        // Check error condition for add
        actions.addTeam = jest.fn(() => Promise.reject('Test Error'));
        await act(async () => {
            await fireEvent.click(getByTestId('team-management-data-table-toolbar-add-button'));
        });

        await waitFor(() => {
            expect(getByTestId('team_slug-input')).toBeInTheDocument();
        });
        await act(async () => {
            await fireEvent.change(getByTestId('team_slug-input'), { target: { value: 'TESTSLUG' } });
            await fireEvent.change(getByTestId('team_display_name-input'), { target: { value: 'TEST NEW TEAM' } });
        });

        await act(async () => {
            await fireEvent.click(getByTestId('update_dialog-action-button'));
            expect(actions.addTeam).rejects.toEqual('Test Error');
        });
    });
    it('Edit User functions correctly', async () => {
        const selectedTeamSlug = teamList[1].team_slug;
        const { getByText, getByTestId } = setup({ actions: actions });
        expect(getByText(locale.pages.manage.teams.header.pageSubtitle('', 'Library'))).toBeInTheDocument();
        expect(getByText('Work Station Support')).toBeInTheDocument();

        await act(async () => {
            await fireEvent.click(getByTestId(`action_cell-${selectedTeamSlug}-edit-button`));
        });
        await waitFor(() => {
            expect(getByTestId('team_display_name-input')).toBeInTheDocument();
        });
        await act(async () => {
            await fireEvent.change(getByTestId('team_display_name-input'), { target: { value: 'TEST EDITED TEAM' } });
        });
        // commit the change
        await act(async () => {
            await fireEvent.click(getByTestId('update_dialog-action-button'));
        });
        expect(actions.updateTeam).toHaveBeenCalledWith(selectedTeamSlug, {
            team_display_name: 'TEST EDITED TEAM',
            team_current_flag: 1,
        });
        // Check Save Team fail on save.
        actions.updateTeam = jest.fn(() => Promise.reject('Test Error'));
        await act(async () => {
            await fireEvent.click(getByTestId(`action_cell-${selectedTeamSlug}-edit-button`));
        });
        await act(async () => {
            await fireEvent.click(getByTestId('update_dialog-action-button'));
        });
        expect(actions.updateTeam).rejects.toEqual('Test Error');
    });

    it('Delete or Reassign Team functions correctly', async () => {
        const selectedTeamSlug = teamList[2].team_slug;
        const { getByText, getByTestId } = setup({ actions: actions });
        expect(getByText(locale.pages.manage.teams.header.pageSubtitle('', 'Library'))).toBeInTheDocument();
        expect(getByText('Work Station Support')).toBeInTheDocument();

        await act(async () => {
            await fireEvent.click(getByTestId(`action_cell-${selectedTeamSlug}-delete-button`));
        });

        await waitFor(() => {
            expect(getByTestId('confirm-team-management')).toBeInTheDocument();
            fireEvent.click(getByTestId('confirm-team-management'));
        });
        expect(actions.deleteTeam).toHaveBeenCalledWith(selectedTeamSlug);
        // Simulate an error
        actions.deleteTeam = jest.fn(() => Promise.reject('Test Error'));
        await act(async () => {
            await fireEvent.click(getByTestId(`action_cell-${selectedTeamSlug}-delete-button`));
        });
        await waitFor(() => {
            expect(getByTestId('confirm-team-management')).toBeInTheDocument();
            fireEvent.click(getByTestId('confirm-team-management'));
        });
        expect(actions.deleteTeam).rejects.toEqual('Test Error');
    });
});
