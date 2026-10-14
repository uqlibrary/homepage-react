import React from 'react';
import { render, screen } from '@testing-library/react';
import { useParams } from 'react-router';
import { useAccountContext } from 'context';

import { DLOTeamEdit } from './DLOTeamEdit';

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useParams: jest.fn(),
}));

jest.mock('context', () => ({
    useAccountContext: jest.fn(),
}));

jest.mock('modules/SharedComponents/Toolbox/StandardPage', () => ({
    StandardPage: ({ title, children }) => <div data-testid="standard-page" data-title={title}>{children}</div>,
}));

jest.mock('modules/Pages/Admin/DigitalLearningObjects/SharedDlorComponents/DlorAdminBreadcrumbs', () => ({
    __esModule: true,
    default: ({ breadCrumbList }) => (
        <div data-testid="breadcrumbs">{breadCrumbList?.map(item => item.title).join(', ')}</div>
    ),
}));

jest.mock('modules/Pages/Admin/DigitalLearningObjects/Team/DlOTeamForm', () => ({
    __esModule: true,
    default: props => (
        <div data-testid="team-form">
            <div data-testid="mode">{props.mode}</div>
            <div data-testid="saving">{String(props.dlorTeamSaving)}</div>
            <div data-testid="error">{String(props.dlorSavedTeamError || '')}</div>
            <div data-testid="saved-team">{props.dlorSavedTeam ? 'saved' : 'none'}</div>
            <div data-testid="team-id">{props.formDefaults?.team_id || 'none'}</div>
            <div data-testid="team-name">{props.formDefaults?.team_name || ''}</div>
            <div data-testid="team-admin-username">{props.formDefaults?.team_admin_username || ''}</div>
        </div>
    ),
}));

describe('DLOTeamEdit', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useParams.mockReturnValue({ dlorTeamId: '42' });
        useAccountContext.mockReturnValue({ account: { id: 'u1234567', groups: ['lib_dlor_admins'] } });
    });

    it('renders the edit page metadata and passes the loaded team details to the form', () => {
        const actions = { loadADLORTeam: jest.fn() };
        const siteHeader = document.createElement('uq-site-header');
        document.body.appendChild(siteHeader);

        render(
            <DLOTeamEdit
                actions={actions}
                dlorTeam={{ data: { team_id: 42, team_name: 'Alpha team', team_admin_username: 'admin1' } }}
                dlorTeamLoading={false}
                dlorTeamError={null}
                dlorItemUpdating={false}
                dlorUpdatedItemError={null}
                dlorUpdatedItem={null}
            />,
        );

        expect(screen.getByTestId('standard-page')).toHaveAttribute('data-title', 'Digital Learning Hub - Edit Team');
        expect(screen.getByTestId('breadcrumbs')).toHaveTextContent('Team management, Edit team: Alpha team');
        expect(screen.getByTestId('mode')).toHaveTextContent('edit');
        expect(screen.getByTestId('team-id')).toHaveTextContent('42');
        expect(screen.getByTestId('team-name')).toHaveTextContent('Alpha team');
        expect(screen.getByTestId('team-admin-username')).toHaveTextContent('admin1');
        expect(actions.loadADLORTeam).toHaveBeenCalledWith('42');
        expect(siteHeader.getAttribute('secondleveltitle')).toBe('Digital learning hub admin');
        expect(siteHeader.getAttribute('secondLevelUrl')).toBe('/admin/dlor');

        document.body.removeChild(siteHeader);
    });

    it('falls back to the first team member username and passes the current save state through to the form', () => {
        const actions = { loadADLORTeam: jest.fn() };

        render(
            <DLOTeamEdit
                actions={actions}
                dlorTeam={{
                    data: {
                        team_id: 99,
                        team_name: 'Beta team',
                        team_members: [{ team_admin_username: 'member-1' }],
                    },
                }}
                dlorTeamLoading={false}
                dlorTeamError={null}
                dlorItemUpdating={true}
                dlorUpdatedItemError="Update failed"
                dlorUpdatedItem={{ team_id: 99 }}
            />,
        );

        expect(screen.getByTestId('saving')).toHaveTextContent('true');
        expect(screen.getByTestId('error')).toHaveTextContent('Update failed');
        expect(screen.getByTestId('saved-team')).toHaveTextContent('saved');
        expect(screen.getByTestId('team-admin-username')).toHaveTextContent('member-1');
    });
});
