import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DLOAdminHomepage from './DLOAdminHomepage';
import {
    exportDemographicsToCSV,
    exportDLORDataToCSV,
    fetchAndExportFavouritesToCSV,
} from 'modules/Pages/Admin/DigitalLearningObjects/dlorAdminHelpers';
import { useAccountContext } from 'context';

jest.mock('context', () => ({
    useAccountContext: jest.fn(),
}));

jest.mock('modules/Pages/Admin/DigitalLearningObjects/dlorAdminHelpers', () => ({
    dlorAdminLink: jest.fn((path = '') => `http://localhost/admin/dlor${path}`),
    exportDemographicsToCSV: jest.fn(),
    exportDLORDataToCSV: jest.fn(),
    fetchAndExportFavouritesToCSV: jest.fn(() => Promise.resolve()),
}));

jest.mock('modules/SharedComponents/Toolbox/StandardPage', () => {
    const StandardPage = ({ children }) => <div data-testid="standard-page">{children}</div>;
    return { StandardPage };
});

jest.mock('modules/SharedComponents/Toolbox/Loaders', () => {
    const InlineLoader = ({ message }) => <div>{message}</div>;
    return { InlineLoader };
});

jest.mock('modules/SharedComponents/Toolbox/ConfirmDialogBox', () => ({
    ConfirmationBox: () => null,
}));

jest.mock('modules/Pages/Admin/DigitalLearningObjects/SharedDlorComponents/VisitHomepage', () => () => null);

jest.mock('modules/Pages/DigitalLearningObjects/dlorHelpers', () => ({
    convertSnakeCaseToKebabCase: value => value,
    getPathRoot: () => '',
}));

const baseProps = {
    actions: {
        loadDlorDemographics: jest.fn(),
        loadAllDLORs: jest.fn(),
        deleteDlor: jest.fn(() => Promise.resolve()),
    },
    dlorList: [
        {
            object_id: 1,
            object_public_uuid: 'abc-123',
            object_status: 'current',
            object_title: 'Object title',
            object_description: 'Object description',
            object_summary: 'Object summary',
            object_keywords: ['keyword'],
            object_is_featured: 0,
            owner: {
                publishing_user_username: 'uqauthor1',
                team_name: 'Team One',
            },
        },
    ],
    dlorListLoading: false,
    dlorListError: null,
    dlorItemDeleteError: null,
    dlorDemographics: [{ key: 'value' }],
    dlorDemographicsLoading: false,
    dlorDemographicsError: null,
};

describe('DLOAdminHomepage menu', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useAccountContext.mockReturnValue({ account: { id: 'uqauthor1' } });
    });

    it('opens the admin menu and shows menu items including dashboard link', async () => {
        render(<DLOAdminHomepage {...baseProps} />);

        fireEvent.click(screen.getByTestId('admin-dlor-menu-button'));

        expect(await screen.findByTestId('admin-dlor-visit-add-series-button')).toBeInTheDocument();
        expect(screen.getByTestId('admin-dlor-visit-manage-series-button')).toBeInTheDocument();
        expect(screen.getByTestId('admin-dlor-visit-manage-teams-button')).toBeInTheDocument();
        expect(screen.getByTestId('admin-dlor-visit-manage-filters-button')).toBeInTheDocument();
        expect(screen.getByTestId('admin-dlor-visit-manage-vocabulary-button')).toBeInTheDocument();
        expect(screen.getByTestId('admin-dlor-visit-add-button')).toBeInTheDocument();
        expect(screen.getByTestId('admin-dlor-schedule-featured-button')).toBeInTheDocument();
        expect(screen.getByTestId('admin-dlor-export-dlordata-button')).toBeInTheDocument();
        expect(screen.getByTestId('admin-dlor-export-demographicsdata-button')).toBeInTheDocument();
        expect(screen.getByTestId('admin-dlor-export-favourites-button')).toBeInTheDocument();
        expect(screen.getByTestId('dlor-admin-dashboard--button')).toBeInTheDocument();
        expect(screen.getByTestId('dlor-admin-public-homepage-link')).toBeInTheDocument();
    });

    it('calls CSV export handlers from menu items', async () => {
        render(<DLOAdminHomepage {...baseProps} />);

        fireEvent.click(screen.getByTestId('admin-dlor-menu-button'));

        fireEvent.click(await screen.findByTestId('admin-dlor-export-dlordata-button'));
        expect(exportDLORDataToCSV).toHaveBeenCalledWith(baseProps.dlorList, 'dlor_data.csv');

        fireEvent.click(screen.getByTestId('admin-dlor-menu-button'));
        fireEvent.click(await screen.findByTestId('admin-dlor-export-demographicsdata-button'));
        expect(exportDemographicsToCSV).toHaveBeenCalledWith(baseProps.dlorDemographics, 'dlor_demographics.csv');

        fireEvent.click(screen.getByTestId('admin-dlor-menu-button'));
        fireEvent.click(await screen.findByTestId('admin-dlor-export-favourites-button'));
        await waitFor(() => {
            expect(fetchAndExportFavouritesToCSV).toHaveBeenCalledWith('dlor_favourites.csv');
        });
    });

    it('closes menu after selecting a menu action', async () => {
        render(<DLOAdminHomepage {...baseProps} />);

        fireEvent.click(screen.getByTestId('admin-dlor-menu-button'));
        expect(await screen.findByTestId('dlor-admin-dashboard--button')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('admin-dlor-export-dlordata-button'));
        await waitFor(() => {
            expect(screen.queryByTestId('dlor-admin-dashboard--button')).not.toBeInTheDocument();
        });
    });

    it('navigates to dashboard from menu item', async () => {
        const originalLocation = window.location;
        delete window.location;
        window.location = {
            ...originalLocation,
            href: 'http://localhost/',
        };

        render(<DLOAdminHomepage {...baseProps} />);

        fireEvent.click(screen.getByTestId('admin-dlor-menu-button'));
        fireEvent.click(await screen.findByTestId('dlor-admin-dashboard--button'));

        expect(window.location.href).toBe('/digital-learning-hub/dashboard');

        window.location = originalLocation;
    });
});
