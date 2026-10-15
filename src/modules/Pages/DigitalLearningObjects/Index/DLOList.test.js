import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { mui1theme } from 'config';
import { dlorAdminLink, exportDLORDataToCSV } from 'modules/Pages/Admin/DigitalLearningObjects/dlorAdminHelpers';
import DLOList from './DLOList';

jest.mock('../../../../../public/images/digital-learning-hub-hero-shot-wide.png', () => 'mock-hero-image');

jest.mock('modules/Pages/DigitalLearningObjects/dlorHelpers', () => ({
    ...jest.requireActual('modules/Pages/DigitalLearningObjects/dlorHelpers'),
    getDlorViewPageUrl: uuid => `#${uuid}`,
}));

jest.mock('modules/Pages/Admin/DigitalLearningObjects/dlorAdminHelpers', () => ({
    ...jest.requireActual('modules/Pages/Admin/DigitalLearningObjects/dlorAdminHelpers'),
    dlorAdminLink: jest.fn(() => '#team-manage'),
    exportDLORDataToCSV: jest.fn(),
}));

jest.mock('modules/SharedComponents/Toolbox/StandardPage', () => ({
    // eslint-disable-next-line react/prop-types
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

const makeObjectFilters = () => [
    { filter_key: 'topic', filter_values: [{ id: 10, name: 'Science' }] },
    { filter_key: 'item_type', filter_values: [{ id: 11, name: 'Guide' }] },
    { filter_key: 'media_format', filter_values: [{ id: 12, name: 'PDF' }] },
    { filter_key: 'licence', filter_values: [{ id: 13, name: 'Creative Commons' }] },
    {
        filter_key: 'graduate_attributes',
        filter_values: [
            { id: 14, name: 'Zulu' },
            { id: 18, name: 'Alpha' },
        ],
    },
    { filter_key: 'subject', filter_values: [{ id: 15, name: 'Biology' }] },
    { filter_key: 'audience', filter_values: [{ id: 16, name: 'Undergraduate' }] },
    { filter_key: 'level', filter_values: [{ id: 17, name: 'Advanced' }] },
];

const makeDlor = (overrides = {}) => ({
    object_id: 1,
    object_public_uuid: 'object-1',
    object_title: 'Quantum mechanics guide',
    object_summary: 'A guide to quantum mechanics',
    object_description: 'Learn about wave functions and quantum physics.',
    object_keywords: ['quantum'],
    object_synonyms: ['wave function'],
    object_filters: makeObjectFilters(),
    object_restrict_to: 'none',
    object_cultural_advice: false,
    object_is_featured: 0,
    is_popular: false,
    object_series_name: '',
    object_status: 'current',
    object_publishing_user_email: 'another@example.com',
    owner: { team_id: 1, publishing_user_username: 'another-user' },
    due_for_review: false,
    due_for_unpublish: false,
    is_subscribed: false,
    is_favourited: false,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
    ...overrides,
});

const makeFilterList = () => [
    {
        facet_type_id: 1,
        facet_type_slug: 'topic',
        facet_type_name: 'Topic',
        facet_type_help_public: '<p>Topic help</p>',
        facet_list: [{ facet_id: 10, facet_name: 'Science', facet_show_help: true, facet_help: 'Science help' }],
    },
    {
        facet_type_id: 2,
        facet_type_slug: 'graduate_attributes',
        facet_type_name: 'Graduate attributes',
        facet_type_help_public: '',
        facet_list: [
            { facet_id: 14, facet_name: 'Zulu', facet_show_help: false, facet_help: 'Zulu help' },
            { facet_id: 18, facet_name: 'Alpha', facet_show_help: false, facet_help: '' },
        ],
    },
    {
        facet_type_id: 3,
        facet_type_slug: 'item_type',
        facet_type_name: 'Item type',
        facet_type_help_public: '',
        facet_list: [{ facet_id: 11, facet_name: 'Guide', facet_show_help: false }],
    },
    {
        facet_type_id: 4,
        facet_type_slug: 'media_format',
        facet_type_name: 'Media format',
        facet_type_help_public: '',
        facet_list: [{ facet_id: 12, facet_name: 'PDF', facet_show_help: false }],
    },
    {
        facet_type_id: 5,
        facet_type_slug: 'licence',
        facet_type_name: 'Licence',
        facet_type_help_public: '',
        facet_list: [{ facet_id: 13, facet_name: 'Creative Commons', facet_show_help: false }],
    },
    {
        facet_type_id: 6,
        facet_type_slug: 'subject',
        facet_type_name: 'Subject',
        facet_type_help_public: '',
        facet_list: [{ facet_id: 15, facet_name: 'Biology', facet_show_help: false }],
    },
    {
        facet_type_id: 7,
        facet_type_slug: 'audience',
        facet_type_name: 'Audience',
        facet_type_help_public: '',
        facet_list: [{ facet_id: 16, facet_name: 'Undergraduate', facet_show_help: false }],
    },
    {
        facet_type_id: 8,
        facet_type_slug: 'level',
        facet_type_name: 'Level',
        facet_type_help_public: '',
        facet_list: [{ facet_id: 17, facet_name: 'Advanced', facet_show_help: false }],
    },
];

const defaultActions = {
    loadOwningTeams: jest.fn(),
    loadDlorFavourites: jest.fn(),
    loadAllDLORs: jest.fn(),
    loadCurrentDLORs: jest.fn(),
    loadAllFilters: jest.fn(),
};

const renderDlorList = (overrides = {}, initialEntry = `${window.location.pathname}${window.location.search}`) => {
    const actions = { ...defaultActions, ...(overrides.actions || {}) };
    const props = {
        dlorList: [makeDlor()],
        dlorListLoading: false,
        dlorListError: null,
        dlorFilterList: makeFilterList(),
        dlorFilterListLoading: false,
        dlorFilterListError: null,
        account: null,
        dlorFavouritesList: [],
        dlorTeamList: [{ team_id: 1, team_members: [] }],
        dlorTeamListLoading: false,
        dlorTeamListError: null,
        ...overrides,
        actions,
    };

    return render(
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={mui1theme}>
                <MemoryRouter initialEntries={[initialEntry]}>
                    <DLOList {...props} />
                </MemoryRouter>
            </ThemeProvider>
        </StyledEngineProvider>,
    );
};

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

describe('DLOList state and interaction coverage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        window.history.replaceState({}, '', '/');
        window.dataLayer = [];
    });

    afterEach(() => {
        window.history.replaceState({}, '', '/');
        delete window.dataLayer;
        document.querySelector('uq-site-header')?.remove();
    });

    it('updates the site header when one is present', () => {
        const siteHeader = document.createElement('uq-site-header');
        document.body.appendChild(siteHeader);

        renderDlorList();

        expect(siteHeader.getAttribute('secondleveltitle')).toBeTruthy();
        expect(siteHeader.getAttribute('secondLevelUrl')).toBeTruthy();
    });

    it('loads missing dependencies and shows the empty and filter-error messages', () => {
        const { container } = renderDlorList({
            dlorList: null,
            dlorFilterList: null,
            dlorTeamList: null,
        });

        expect(defaultActions.loadOwningTeams).toHaveBeenCalledTimes(1);
        expect(defaultActions.loadDlorFavourites).toHaveBeenCalledTimes(1);
        expect(defaultActions.loadCurrentDLORs).toHaveBeenCalledTimes(1);
        expect(defaultActions.loadAllFilters).toHaveBeenCalledTimes(1);
        expect(screen.getByTestId('dlor-homepage-filter-error')).toBeInTheDocument();
        expect(screen.getByTestId('dlor-homepage-noresult')).toBeInTheDocument();
        expect(container).toHaveTextContent('We did not find any entries in the system');
    });

    it('loads all objects when a type filter is present and the list has not loaded yet', () => {
        const entry = '/digital-learning-hub?type=featured';
        window.history.replaceState({}, '', entry);
        renderDlorList({ dlorList: null, dlorFilterList: null, dlorTeamList: [] }, entry);

        expect(defaultActions.loadAllDLORs).toHaveBeenCalledTimes(1);
        expect(defaultActions.loadCurrentDLORs).not.toHaveBeenCalled();
    });

    it.each([
        ['filter loading', { dlorFilterListLoading: true }],
        ['null filter loading', { dlorFilterListLoading: null }],
        ['list loading', { dlorListLoading: true }],
        ['null list loading', { dlorListLoading: null }],
    ])('shows a loader while %s', (_label, props) => {
        renderDlorList(props);

        expect(screen.getByTestId('inline-loader')).toHaveTextContent('Loading');
    });

    it('renders list and filter errors and an empty list', () => {
        const { rerender } = renderDlorList({ dlorListError: 'Unable to load objects' });
        expect(screen.getByTestId('dlor-homepage-error')).toHaveTextContent('Unable to load objects');

        rerender(
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={mui1theme}>
                    <MemoryRouter>
                        <DLOList
                            actions={{ ...defaultActions }}
                            dlorList={[makeDlor()]}
                            dlorListLoading={false}
                            dlorListError={null}
                            dlorFilterList={makeFilterList()}
                            dlorFilterListLoading={false}
                            dlorFilterListError="Unable to load filters"
                            account={null}
                            dlorFavouritesList={[]}
                            dlorTeamList={[]}
                            dlorTeamListLoading={false}
                            dlorTeamListError={null}
                        />
                    </MemoryRouter>
                </ThemeProvider>
            </StyledEngineProvider>,
        );
        expect(screen.getByTestId('dlor-homepage-filter-error')).toBeInTheDocument();
        expect(screen.getByTestId('dlor-homepage-panel-object-1')).toBeInTheDocument();

        rerender(
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={mui1theme}>
                    <MemoryRouter>
                        <DLOList
                            actions={{ ...defaultActions }}
                            dlorList={[]}
                            dlorListLoading={false}
                            dlorListError={null}
                            dlorFilterList={makeFilterList()}
                            dlorFilterListLoading={false}
                            dlorFilterListError={null}
                            account={null}
                            dlorFavouritesList={[]}
                            dlorTeamList={[]}
                            dlorTeamListLoading={false}
                            dlorTeamListError={null}
                        />
                    </MemoryRouter>
                </ThemeProvider>
            </StyledEngineProvider>,
        );
        expect(screen.getByTestId('dlor-homepage-noresult')).toBeInTheDocument();
    });

    it('renders item tags and facet labels and navigates to an accessible object', () => {
        const object = makeDlor({
            object_cultural_advice: true,
            object_is_featured: 1,
            is_popular: true,
            object_series_name: 'Physics series',
        });
        renderDlorList({
            dlorList: [object],
            dlorFavouritesList: [{ object_public_uuid: object.object_public_uuid }],
        });

        expect(screen.getByTestId('dlor-homepage-panel-object-1-favourite')).toHaveTextContent('Favourite');
        expect(screen.getByText('Featured')).toBeInTheDocument();
        expect(screen.getByText('Popular')).toBeInTheDocument();
        expect(screen.getByText('Cultural advice')).toBeInTheDocument();
        expect(screen.getByText('Series: Physics series')).toBeInTheDocument();
        expect(screen.getByTestId('dlor-homepage-panel-object-1-footer-type')).toHaveTextContent('Guide');
        expect(screen.getByTestId('dlor-homepage-panel-object-1-footer-media')).toHaveTextContent('PDF');
        expect(screen.getByTestId('dlor-homepage-panel-object-1-footer-topic')).toHaveTextContent('Science');

        fireEvent.click(screen.getByRole('button', { name: /Quantum mechanics guide/ }));

        expect(window.location.hash).toBe('#object-1');
    });

    it('shows a favourite tag when no other object tags are present and sorts favourites first', () => {
        const objects = [
            makeDlor({ object_id: 1, object_public_uuid: 'object-1', object_title: 'Not a favourite' }),
            makeDlor({ object_id: 2, object_public_uuid: 'object-2', object_title: 'Favourite only' }),
        ];
        renderDlorList({
            dlorList: objects,
            dlorFavouritesList: [{ object_public_uuid: 'object-2' }],
        });

        expect(screen.getByTestId('dlor-homepage-panel-object-2-favourite')).toHaveTextContent('Favourite');
        const list = document.getElementById('dlor-homepage-list');
        const favourite = list.querySelector('[data-testid="dlor-homepage-panel-object-2"]');
        const regular = list.querySelector('[data-testid="dlor-homepage-panel-object-1"]');
        expect(favourite.compareDocumentPosition(regular) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });

    it('shows restriction messages and prevents access to restricted objects', () => {
        renderDlorList({
            account: { id: 'community-user', user_group: 'COMMU', groups: [] },
            dlorList: [
                makeDlor({
                    object_public_uuid: 'staff-only',
                    object_id: 2,
                    object_title: 'Staff only object',
                    object_restrict_to: 'uqstaff',
                }),
                makeDlor({
                    object_public_uuid: 'uq-only',
                    object_id: 3,
                    object_title: 'UQ only object',
                    object_restrict_to: 'uquser',
                }),
                makeDlor({
                    object_public_uuid: 'library-only',
                    object_id: 4,
                    object_title: 'Library only object',
                    object_restrict_to: 'uqlibrarystaff',
                }),
            ],
        });

        expect(screen.getByRole('button', { name: /Staff only object - You need to be UQ staff/ })).toHaveAttribute(
            'aria-disabled',
            'true',
        );
        expect(
            screen.getByRole('button', { name: /UQ only object - You need to be a UQ staff or student user/ }),
        ).toHaveAttribute('aria-disabled', 'true');
        expect(screen.queryByText('Library only object')).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: /Staff only object/ }));

        expect(window.location.hash).toBe('');
    });

    it('shows staff-restricted and library-only objects to library staff', () => {
        renderDlorList({
            account: { id: 'library-user', user_group: 'LIBRARYSTAFFB', groups: [] },
            dlorList: [
                makeDlor({
                    object_public_uuid: 'staff-only',
                    object_id: 2,
                    object_title: 'Staff only object',
                    object_restrict_to: 'uqstaff',
                }),
                makeDlor({
                    object_public_uuid: 'library-only',
                    object_id: 3,
                    object_title: 'Library only object',
                    object_restrict_to: 'uqlibrarystaff',
                }),
            ],
        });

        expect(screen.getByRole('button', { name: /Staff only object/ })).toHaveAttribute('aria-disabled', 'false');
        expect(screen.getByText('Library only object')).toBeInTheDocument();
    });

    it('allows UQ users to view objects restricted to UQ users', () => {
        renderDlorList({
            account: { id: 'uq-user', user_group: 'UG', groups: [] },
            dlorList: [
                makeDlor({
                    object_public_uuid: 'uq-only',
                    object_title: 'UQ only object',
                    object_restrict_to: 'uquser',
                }),
            ],
        });

        expect(screen.getByRole('button', { name: /UQ only object/ })).toHaveAttribute('aria-disabled', 'false');
    });

    it('filters objects by checkbox and supports panel, help, sidebar, and reset actions', () => {
        renderDlorList();

        const panel = document.getElementById('sidebar-panel-1');
        const helpPopup = document.getElementById('dlor-list-topic-help-popup');
        const checkbox = screen.getByTestId('checkbox-topic-science').querySelector('input');

        fireEvent.click(screen.getByTestId('panel-minimisation-icon-topic'));
        expect(panel.style.display).toBe('none');
        fireEvent.click(screen.getByTestId('panel-minimisation-icon-topic'));
        expect(panel.style.display).not.toBe('none');

        fireEvent.click(screen.getByRole('button', { name: 'View facet help' }));
        expect(helpPopup.style.display).toBe('block');
        fireEvent.click(screen.getByTestId('panel-help-close-topic'));
        expect(helpPopup.style.display).toBe('none');
        fireEvent.click(screen.getByTestId('panel-minimisation-icon-topic'));

        fireEvent.click(screen.getByLabelText('Show the filters'));
        expect(document.getElementById('filterSidebar').style.display).toBe('block');
        fireEvent.click(screen.getByLabelText('hide the filters'));
        expect(document.getElementById('filterSidebar').style.display).toBe('none');

        fireEvent.click(checkbox);
        expect(checkbox).toBeChecked();
        expect(window.location.search).toContain('filters=10');
        expect(screen.getByTestId('graduate-attributes-detail-container')).toHaveTextContent('Science');

        fireEvent.click(checkbox);
        expect(checkbox).not.toBeChecked();
        expect(screen.queryByTestId('graduate-attributes-detail-container')).not.toBeInTheDocument();

        fireEvent.click(screen.getByTestId('sidebar-filter-reset-button'));
        expect(window.location.search).toBe('');
        expect(panel.style.display).not.toBe('none');
    });

    it('searches by keyboard and clears the search to restore all objects', () => {
        renderDlorList({
            dlorList: [
                makeDlor(),
                makeDlor({
                    object_id: 2,
                    object_public_uuid: 'object-2',
                    object_title: 'Studio safety guide',
                    object_keywords: ['laboratory'],
                    object_description: 'Working safely in the studio',
                }),
            ],
        });

        const input = screen.getByLabelText('Search our digital objects by keyword');
        fireEvent.change(input, { target: { value: 'quantum' } });
        fireEvent.keyUp(input, { key: 'Enter' });

        expect(screen.getByTestId('dlor-homepage-panel-object-1')).toBeInTheDocument();
        expect(screen.queryByTestId('dlor-homepage-panel-object-2')).not.toBeInTheDocument();
        expect(window.location.search).toContain('keyword=quantum');

        fireEvent.click(screen.getByLabelText('clear keyword'));

        expect(input).toHaveValue('');
        expect(screen.getByTestId('dlor-homepage-panel-object-2')).toBeInTheDocument();
        expect(window.location.search).toBe('');
    });

    it('does not filter on a one-character Enter search', () => {
        renderDlorList();

        const input = screen.getByLabelText('Search our digital objects by keyword');
        fireEvent.change(input, { target: { value: 'q' } });
        fireEvent.keyUp(input, { key: 'Enter' });

        expect(screen.getByTestId('dlor-homepage-panel-object-1')).toBeInTheDocument();
        expect(window.location.search).toBe('');
    });

    it('searches by the search button and shows feedback when no objects match', () => {
        renderDlorList();

        const input = screen.getByLabelText('Search our digital objects by keyword');
        fireEvent.change(input, { target: { value: 'notfound' } });
        fireEvent.keyUp(input, { key: 'x' });
        fireEvent.click(screen.getByLabelText('Perform your search'));

        expect(screen.getByTestId('dlor-homepage-empty')).toHaveTextContent("Can't find what you are looking for?");

        fireEvent.keyUp(input, { key: 'Escape' });

        expect(screen.getByTestId('dlor-homepage-panel-object-1')).toBeInTheDocument();
    });

    it('restores keyword and filter selections from the URL', async () => {
        const entry = '/digital-learning-hub?keyword=quantum&filters=10';
        window.history.replaceState({}, '', entry);
        renderDlorList({}, entry);

        const input = screen.getByLabelText('Search our digital objects by keyword');
        const checkbox = screen.getByTestId('checkbox-topic-science').querySelector('input');

        await waitFor(() => expect(checkbox).toBeChecked());
        expect(input).toHaveValue('quantum');
        expect(screen.getByTestId('graduate-attributes-detail-container')).toHaveTextContent('Science');
        await waitFor(() => expect(document.getElementById('sidebar-panel-2').style.display).toBe('none'));
        await new Promise(resolve => setTimeout(resolve, 100));
    });

    it('sorts graduate attribute descriptions alphabetically when several URL filters are selected', async () => {
        const entry = '/digital-learning-hub?filters=14,18';
        window.history.replaceState({}, '', entry);
        renderDlorList({}, entry);

        const names = await screen.findAllByTestId(/graduate-attribute-(14|18)-name/);

        expect(names.map(element => element.textContent)).toEqual(['Alpha', 'Zulu']);
        expect(screen.getByTestId('graduate-attribute-18-description')).toHaveTextContent(
            'no help for this graduate attribute at this time',
        );
        await new Promise(resolve => setTimeout(resolve, 100));
    });

    it('filters the list to favourites selected by the current user', () => {
        const entry = '/digital-learning-hub?type=favourite';
        window.history.replaceState({}, '', entry);
        renderDlorList(
            {
                dlorList: [
                    makeDlor({ object_id: 1, object_public_uuid: 'object-1', object_title: 'Not followed' }),
                    makeDlor({ object_id: 2, object_public_uuid: 'object-2', object_title: 'Followed object' }),
                ],
                dlorFavouritesList: [{ object_public_uuid: 'object-2' }],
            },
            entry,
        );

        expect(screen.getByTestId('dlor-homepage-panel-object-2')).toBeInTheDocument();
        expect(screen.queryByTestId('dlor-homepage-panel-object-1')).not.toBeInTheDocument();
    });

    it('filters objects owned by the current user using email or username', () => {
        const entry = '/digital-learning-hub?type=mine';
        window.history.replaceState({}, '', entry);
        renderDlorList(
            {
                account: { id: 'current-user', mail: 'owner@example.com', user_group: 'UG', groups: [] },
                dlorList: [
                    makeDlor({
                        object_id: 1,
                        object_public_uuid: 'email-match',
                        object_title: 'Owned by email',
                        object_publishing_user_email: 'owner@example.com',
                        owner: { team_id: 1, publishing_user_username: 'another-user' },
                    }),
                    makeDlor({
                        object_id: 2,
                        object_public_uuid: 'username-match',
                        object_title: 'Owned by username',
                        object_publishing_user_email: 'another@example.com',
                        owner: { team_id: 1, publishing_user_username: 'current-user' },
                    }),
                    makeDlor({
                        object_id: 3,
                        object_public_uuid: 'not-owned',
                        object_title: 'Not owned',
                        object_publishing_user_email: 'another@example.com',
                    }),
                ],
            },
            entry,
        );

        expect(screen.getByTestId('dlor-homepage-panel-email-match')).toBeInTheDocument();
        expect(screen.getByTestId('dlor-homepage-panel-username-match')).toBeInTheDocument();
        expect(screen.queryByTestId('dlor-homepage-panel-not-owned')).not.toBeInTheDocument();
    });

    it('filters new and user-submitted items by their status and age', () => {
        const entry = '/digital-learning-hub?type=submitted';
        window.history.replaceState({}, '', entry);
        renderDlorList(
            {
                dlorList: [
                    makeDlor({
                        object_id: 1,
                        object_public_uuid: 'recent-new',
                        object_title: 'Recent new object',
                        object_status: 'new',
                        created_at: new Date().toISOString(),
                    }),
                    makeDlor({
                        object_id: 2,
                        object_public_uuid: 'old-current',
                        object_title: 'Old current object',
                        created_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
                    }),
                ],
            },
            entry,
        );

        expect(screen.getByTestId('dlor-homepage-panel-recent-new')).toBeInTheDocument();
        expect(screen.queryByTestId('dlor-homepage-panel-old-current')).not.toBeInTheDocument();
    });

    it('filters current objects submitted by members of another team', () => {
        const entry = '/digital-learning-hub?type=usersubmitted';
        window.history.replaceState({}, '', entry);
        renderDlorList(
            {
                dlorList: [
                    makeDlor({
                        object_id: 1,
                        object_public_uuid: 'team-submitted',
                        object_title: 'Team-submitted object',
                        owner: { team_id: 2, publishing_user_username: 'other-user' },
                    }),
                    makeDlor({
                        object_id: 2,
                        object_public_uuid: 'default-team',
                        object_title: 'Default-team object',
                    }),
                ],
            },
            entry,
        );

        expect(screen.getByTestId('dlor-homepage-panel-team-submitted')).toBeInTheDocument();
        expect(screen.queryByTestId('dlor-homepage-panel-default-team')).not.toBeInTheDocument();
    });

    it('paginates results and scrolls back to the list heading', () => {
        const objects = Array.from({ length: 11 }, (_, index) =>
            makeDlor({
                object_id: index + 1,
                object_public_uuid: `object-${index + 1}`,
                object_title: `Digital object ${index + 1}`,
            }),
        );
        renderDlorList({ dlorList: objects });

        expect(screen.getByText('Digital object 1')).toBeInTheDocument();
        expect(screen.queryByText('Digital object 11')).not.toBeInTheDocument();

        const scrollIntoView = jest.fn();
        document.getElementById('topOfBody').scrollIntoView = scrollIntoView;
        fireEvent.click(screen.getByRole('button', { name: 'Go to page 2' }));

        expect(screen.getByText('Digital object 11')).toBeInTheDocument();
        expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    });

    it('shows the type chip and removes its query parameter', () => {
        const entry = '/digital-learning-hub?type=featured';
        window.history.replaceState({}, '', entry);
        renderDlorList({ account: { id: 'user-1', user_group: 'UG', groups: [] } }, entry);

        expect(screen.getByTestId('homepage-view-type-chip')).toHaveTextContent('featured');
        fireEvent.click(screen.getByTestId('homepage-view-type-chip'));

        expect(screen.queryByTestId('homepage-view-type-chip')).not.toBeInTheDocument();
    });

    it('opens the team menu and exports the current object list', async () => {
        const objects = [makeDlor()];
        renderDlorList({
            account: { id: 'team-admin', user_group: 'UG', groups: [] },
            dlorList: objects,
            dlorTeamList: [{ team_id: 1, team_members: [{ team_admin_username: 'team-admin' }] }],
        });

        fireEvent.click(screen.getByTestId('admin-dlor-team-admin-menu-button'));
        fireEvent.click(await screen.findByTestId('admin-dlor-export-team-objects--button'));

        expect(exportDLORDataToCSV).toHaveBeenCalledWith(objects, 'dlor_data.csv');
        await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    });

    it('routes team details through the admin link', async () => {
        renderDlorList({
            account: { id: 'team-admin', user_group: 'UG', groups: [] },
            dlorTeamList: [{ team_id: 1, team_members: [{ team_admin_username: 'team-admin' }] }],
        });

        fireEvent.click(screen.getByTestId('admin-dlor-team-admin-menu-button'));
        fireEvent.click(await screen.findByTestId('team-admin-details--button'));

        expect(dlorAdminLink).toHaveBeenCalledWith('/team/manage', expect.objectContaining({ id: 'team-admin' }));
        expect(window.location.hash).toBe('#team-manage');
    });

    it('invokes the team request and dashboard navigation actions', async () => {
        renderDlorList({
            account: { id: 'team-admin', user_group: 'UG', groups: [] },
            dlorTeamList: [{ team_id: 1, team_members: [{ team_admin_username: 'team-admin' }] }],
        });

        const navigationWarning = jest.spyOn(console, 'error').mockImplementation(() => {});

        try {
            fireEvent.click(screen.getByTestId('admin-dlor-team-admin-menu-button'));
            fireEvent.click(await screen.findByTestId('team-admin-submit-object-request'));
            await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());

            fireEvent.click(screen.getByTestId('admin-dlor-team-admin-menu-button'));
            fireEvent.click(await screen.findByTestId('team-dlor-dashboard--button'));
            await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
            await new Promise(resolve => setTimeout(resolve, 0));

            expect(navigationWarning).toHaveBeenCalled();
        } finally {
            navigationWarning.mockRestore();
        }
    });
});
