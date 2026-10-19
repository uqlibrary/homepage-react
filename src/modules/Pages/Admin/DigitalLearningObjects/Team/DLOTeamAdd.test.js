import React from 'react';
import { render, screen } from '@testing-library/react';

import { DLOTeamAdd } from './DLOTeamAdd';
import { useAccountContext } from 'context';

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
            <div data-testid="defaults">
                {JSON.stringify({
                    team_name: props.formDefaults.team_name,
                    team_email: props.formDefaults.team_email,
                    team_manager: props.formDefaults.team_manager,
                    team_admin_username: props.formDefaults.team_admin_username,
                })}
            </div>
        </div>
    ),
}));

describe('DLOTeamAdd', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useAccountContext.mockReturnValue({ account: { id: 'u1234567', groups: ['lib_dlor_admins'] } });
    });

    it('renders the add team page, sets page metadata, and passes the default form values to the form component', () => {
        const siteHeader = document.createElement('uq-site-header');
        document.body.appendChild(siteHeader);

        render(
            <DLOTeamAdd
                actions={{ createDlorTeam: jest.fn() }}
                dlorItemCreating={false}
                dlorCreatedItemError={null}
                dlorCreatedItem={null}
            />,
        );

        expect(screen.getByTestId('standard-page')).toHaveAttribute('data-title', 'Digital Learning Hub - Add a new Team');
        expect(screen.getByTestId('breadcrumbs')).toHaveTextContent('Team management, Add new team');
        expect(screen.getByTestId('mode')).toHaveTextContent('add');
        expect(screen.getByTestId('saving')).toHaveTextContent('false');
        expect(screen.getByTestId('error')).toHaveTextContent('');
        expect(screen.getByTestId('saved-team')).toHaveTextContent('none');
        expect(screen.getByTestId('defaults')).toHaveTextContent(
            JSON.stringify({
                team_name: '',
                team_email: '',
                team_manager: '',
                team_admin_username: '',
            }),
        );
        expect(siteHeader.getAttribute('secondleveltitle')).toBe('Digital learning hub admin');
        expect(siteHeader.getAttribute('secondLevelUrl')).toBe('/admin/dlor');

        document.body.removeChild(siteHeader);
    });

    it('passes through the save-state props to the nested form', () => {
        render(
            <DLOTeamAdd
                actions={{ createDlorTeam: jest.fn() }}
                dlorItemCreating={true}
                dlorCreatedItemError="Team already exists"
                dlorCreatedItem={{ team_id: 99 }}
            />,
        );

        expect(screen.getByTestId('saving')).toHaveTextContent('true');
        expect(screen.getByTestId('error')).toHaveTextContent('Team already exists');
        expect(screen.getByTestId('saved-team')).toHaveTextContent('saved');
    });
});
