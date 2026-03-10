import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { mui1theme } from 'config';
import DLOList from './DLOList';

jest.mock('../../../../../public/images/digital-learning-hub-hero-shot-wide.png', () => 'mock-hero-image');

jest.mock('modules/SharedComponents/Toolbox/StandardPage', () => ({
    StandardPage: ({ children }) => <div data-testid="standard-page">{children}</div>,
}));

jest.mock('modules/SharedComponents/Toolbox/Loaders', () => ({
    InlineLoader: () => <div data-testid="inline-loader">Loading</div>,
}));

jest.mock('modules/Pages/DigitalLearningObjects/SharedComponents/LoginPrompt', () => () => (
    <div data-testid="login-prompt" />
));

jest.mock('modules/Pages/DigitalLearningObjects/SharedComponents/HeroCard', () => () => (
    <div data-testid="hero-card" />
));

describe('DLOList access branch coverage', () => {
    it('uses false branch when dlorTeamList is not an array', () => {
        const props = {
            actions: {
                loadOwningTeams: jest.fn(),
                loadDlorFavourites: jest.fn(),
                loadAllDLORs: jest.fn(),
                loadCurrentDLORs: jest.fn(),
                loadAllFilters: jest.fn(),
            },
            dlorList: [
                {
                    object_id: 1,
                    object_public_uuid: 'abc-123',
                    object_title: 'Object title',
                    object_summary: 'Object summary',
                    object_description: 'Object description',
                    object_keywords: ['keyword'],
                    object_filters: [
                        {
                            filter_key: 'topic',
                            filter_values: [{ id: 10, name: 'Topic One' }],
                        },
                    ],
                    object_restrict_to: null,
                    object_cultural_advice: false,
                    object_is_featured: 0,
                    is_popular: false,
                    object_series_name: '',
                    owner: {
                        publishing_user_username: 'different-user',
                    },
                },
            ],
            dlorListLoading: false,
            dlorListError: null,
            dlorFilterList: [
                {
                    facet_type_id: 1,
                    facet_type_slug: 'topic',
                    facet_type_name: 'Topic',
                    facet_type_help_public: '',
                    facet_list: [{ facet_id: 10, facet_name: 'Topic One', facet_show_help: false }],
                },
            ],
            dlorFilterListLoading: false,
            dlorFilterListError: null,
            account: {
                id: 'uquser1',
                mail: 'uquser1@uq.edu.au',
                user_group: 'UG',
                groups: [],
            },
            dlorFavouritesList: [],
            dlorTeamList: null,
            dlorTeamListLoading: false,
            dlorTeamListError: null,
        };

        render(
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={mui1theme}>
                    <MemoryRouter>
                        <DLOList {...props} />
                    </MemoryRouter>
                </ThemeProvider>
            </StyledEngineProvider>,
        );

        expect(screen.queryByTestId('admin-dlor-team-admin-menu-button')).not.toBeInTheDocument();
        expect(screen.getByTestId('dlor-homepage-request-new-item')).toBeInTheDocument();
    });
});
