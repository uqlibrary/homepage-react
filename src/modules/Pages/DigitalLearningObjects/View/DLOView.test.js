import React from 'react';
import { MemoryRouter } from 'react-router';
import { cleanup, fireEvent, rtlRender, screen, waitFor } from 'test-utils';
import { useCookies } from 'react-cookie';
import { useAccountContext } from 'context';
import { useParams } from 'react-router';
import { DLOView } from './DLOView';

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useParams: jest.fn(),
}));

jest.mock('react-cookie', () => ({
    useCookies: jest.fn(),
}));

jest.mock('context', () => ({
    useAccountContext: jest.fn(),
}));

jest.mock('modules/SharedComponents/Toolbox/StandardPage', () => ({
    // eslint-disable-next-line react/prop-types
    StandardPage: ({ children }) => <div data-testid="standard-page">{children}</div>,
}));

jest.mock('modules/SharedComponents/Toolbox/StandardCard', () => ({
    // eslint-disable-next-line react/prop-types
    StandardCard: ({ children }) => <div data-testid="standard-card">{children}</div>,
}));

jest.mock('modules/SharedComponents/Toolbox/Loaders', () => ({
    // eslint-disable-next-line react/prop-types
    InlineLoader: ({ message }) => <div data-testid="inline-loader">{message}</div>,
}));

jest.mock('modules/Pages/DigitalLearningObjects/SharedComponents/LoginPrompt', () => ({
    __esModule: true,
    default: () => <div data-testid="dlor-homepage-loginprompt" />,
}));

jest.mock('modules/SharedComponents/Toolbox/ConfirmDialogBox', () => ({
    // eslint-disable-next-line react/prop-types
    ConfirmationBox: ({ isOpen, locale, onAction }) => {
        if (!isOpen) return null;

        return (
            <div data-testid="dialogbox-dlor-save-notification">
                {/* eslint-disable-next-line react/prop-types */}
                <h2 data-testid="message-title">{locale.confirmationTitle}</h2>
                <button type="button" onClick={onAction}>
                    OK
                </button>
            </div>
        );
    },
}));

jest.mock('modules/Pages/DigitalLearningObjects/dlorHelpers', () => ({
    ...jest.requireActual('modules/Pages/DigitalLearningObjects/dlorHelpers'),
    getDlorViewPageUrl: uuid => `#${uuid}`,
}));

jest.mock('modules/Pages/Admin/DigitalLearningObjects/dlorAdminHelpers', () => ({
    ...jest.requireActual('modules/Pages/Admin/DigitalLearningObjects/dlorAdminHelpers'),
    dlorAdminLink: path => `#${path}`,
}));

const makeObject = (overrides = {}) => ({
    object_id: 1,
    object_public_uuid: 'object-1',
    object_title: 'A test object',
    object_summary: 'A summary of the test object',
    object_description: '<p>Details about the test object.</p>',
    object_download_instructions: '<p>Download instructions</p>',
    object_link_url: 'https://example.com/object',
    object_link_interaction_type: 'none',
    object_link_file_type: '',
    object_link_size: 0,
    object_is_featured: 0,
    object_cultural_advice: false,
    is_popular: false,
    object_series_name: '',
    object_series_id: null,
    object_series: [],
    object_restrict_to: 'none',
    object_review_date_next: '2026-01-15',
    object_keywords: ['research skills'],
    object_filters: [],
    owner: { publishing_user_username: 'another-user' },
    ...overrides,
});

const makeActions = () => ({
    loadOwningTeams: jest.fn(),
    loadDlorFavourites: jest.fn(),
    clearADlor: jest.fn(),
    loadADLOR: jest.fn(),
    saveDlorDemographics: jest.fn().mockResolvedValue({}),
    addFavourite: jest.fn().mockResolvedValue({}),
    removeFavourite: jest.fn().mockResolvedValue({}),
});

const renderDLOView = (overrides = {}, account = {}) => {
    const actions = {
        ...makeActions(),
        ...(overrides.actions || {}),
    };
    useAccountContext.mockReturnValue({ account });
    const props = {
        dlorItem: makeObject(),
        dlorItemLoading: false,
        dlorItemError: null,
        accountLoading: false,
        dlorUpdatedItem: null,
        dlorItemUpdating: false,
        dlorUpdatedItemError: null,
        dlorFavouritesList: [],
        dlorTeamList: [],
        dlorTeamListLoading: false,
        dlorTeamListError: null,
        ...overrides,
        actions,
    };
    const view = rtlRender(
        <MemoryRouter>
            <DLOView {...props} />
        </MemoryRouter>,
    );

    return { ...view, actions, props };
};

describe('DLOView', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useParams.mockReturnValue({ dlorId: 'object-1' });
        useAccountContext.mockReturnValue({ account: {} });
        useCookies.mockReturnValue([{}, jest.fn()]);
        window.scrollTo = jest.fn();
        window.history.replaceState({}, '', '/');
        window.dataLayer = [];
        document.title = '';
    });

    afterEach(() => {
        jest.useRealTimers();
        delete window.dataLayer;
    });

    it('loads the object, teams and favourites and updates the page title', async () => {
        const { actions } = renderDLOView(
            {
                accountLoading: false,
                dlorItem: makeObject({ object_title: 'Loaded object' }),
                dlorFavouritesList: undefined,
                dlorTeamList: undefined,
            },
            { id: 'student-1' },
        );

        await waitFor(() => {
            expect(actions.loadOwningTeams).toHaveBeenCalledTimes(1);
            expect(actions.loadDlorFavourites).toHaveBeenCalledTimes(1);
            expect(actions.clearADlor).toHaveBeenCalledTimes(1);
            expect(actions.loadADLOR).toHaveBeenCalledWith('object-1', true);
        });
        expect(document.title).toBe('Loaded object');
        expect(window.dataLayer).toContainEqual(
            expect.objectContaining({ event: 'pageview', page_title: 'Loaded object' }),
        );
    });

    it('does not load the object until the account has loaded', () => {
        const { actions } = renderDLOView({ accountLoading: true });

        expect(actions.clearADlor).not.toHaveBeenCalled();
        expect(actions.loadADLOR).not.toHaveBeenCalled();
    });

    it.each([{ dlorItemLoading: true }, { dlorItemLoading: null }, { dlorItemUpdating: true }])(
        'shows a loader while the object is loading or updating',
        props => {
            renderDLOView(props);

            expect(screen.getByTestId('inline-loader')).toHaveTextContent('Loading');
        },
    );

    it('renders object loading errors and empty results', () => {
        renderDLOView({ dlorItemError: 'Object request failed' });
        expect(screen.getByTestId('dlor-detailpage-error')).toHaveTextContent('Object request failed');

        const { rerender, props } = renderDLOView({ dlorItem: {} });
        expect(screen.getByTestId('dlor-detailpage-empty')).toBeInTheDocument();

        rerender(
            <MemoryRouter>
                <DLOView {...props} dlorItem={null} dlorItemError={null} />
            </MemoryRouter>,
        );
        expect(screen.getByTestId('dlor-detailpage-empty')).toBeInTheDocument();
    });

    it('renders object metadata, featured tags, series links, and preview details', () => {
        const object = makeObject({
            object_public_uuid: 'featured-object',
            object_title: 'Artificial Intelligence - Digital Essentials',
            object_description: '<p>Types of AI and using AI in your studies.</p>',
            object_link_url: 'https://www.youtube.com/watch?v=video12345',
            object_link_interaction_type: 'view',
            object_link_file_type: 'video',
            object_link_size: 2864,
            object_is_featured: 1,
            is_popular: true,
            object_cultural_advice: true,
            object_series_name: 'Digital Essentials',
            object_series_id: 8,
            object_series: [
                {
                    series_object_uuid: 'other-object',
                    series_object_title: 'First series item',
                    series_object_order: 0,
                },
                {
                    series_object_uuid: 'featured-object',
                    series_object_title: 'Current series item',
                    series_object_order: 1,
                },
            ],
            object_filters: [
                { filter_key: 'topic', filter_values: [{ id: 1, name: 'Assignments' }] },
                { filter_key: 'item_type', filter_values: [{ id: 2, name: 'Module' }] },
                { filter_key: 'media_format', filter_values: [{ id: 3, name: 'H5P' }] },
                {
                    filter_key: 'licence',
                    filter_values: [{ id: 4, name: 'UQ copyright', help: 'https://guides.example.com/licence' }],
                },
                {
                    filter_key: 'graduate_attributes',
                    filter_values: [{ id: 5, name: 'Accomplished scholars' }],
                },
                { filter_key: 'subject', filter_values: [{ id: 6, name: 'Science' }] },
            ],
            object_keywords: ['research skills', 'generative AI'],
            object_review_date_next: '2026-01-15',
        });
        renderDLOView(
            {
                dlorItem: object,
                dlorFavouritesList: [{ object_public_uuid: object.object_public_uuid }],
            },
            { id: 'student-1', firstName: 'Jane', mail: 'jane@example.com', user_group: 'UG' },
        );

        expect(
            screen.getByRole('heading', { name: 'Artificial Intelligence - Digital Essentials' }),
        ).toBeInTheDocument();
        expect(screen.getByText('Featured')).toBeInTheDocument();
        expect(screen.getByText('Popular')).toBeInTheDocument();
        expect(screen.getByText('Cultural advice')).toBeInTheDocument();
        expect(screen.getByText('Series: Digital Essentials')).toBeInTheDocument();
        expect(screen.getByTestId('dlor-detailpage-cultural-advice')).toBeInTheDocument();
        expect(screen.getByTestId('dlor-detailpage-cultural-advice')).toHaveTextContent(
            'Aboriginal and Torres Strait Islander peoples are warned',
        );
        expect(screen.getByTestId('dlor-detailpage-featured-custom-indicator')).toBeInTheDocument();
        expect(screen.getByTestId('dlor-detailpage-popular-custom-indicator')).toBeInTheDocument();
        expect(screen.getByTestId('dlor-detailpage-object-series-name-custom-indicator')).toBeInTheDocument();
        expect(screen.getByTestId('favorite-star-icon')).toBeInTheDocument();
        expect(screen.getByTestId('detailpage-preview')).toBeInTheDocument();
        expect(screen.getByTitle('Embedded youtube')).toHaveAttribute(
            'src',
            expect.stringContaining('embed/video12345'),
        );
        expect(screen.getByTestId('detailpage-clicklink')).toHaveTextContent('Access the object');
        expect(screen.getByTestId('detailpage-filter-topic')).toHaveTextContent('Assignments');
        expect(screen.getByTestId('detailpage-filter-item-type')).toHaveTextContent('Module');
        expect(screen.getByTestId('detailpage-filter-media-format')).toHaveTextContent('H5P');
        expect(screen.getByTestId('detailpage-filter-licence')).toHaveTextContent('UQ copyright');
        expect(screen.getByTestId('detailpage-filter-graduate-attributes')).toHaveTextContent('Accomplished scholars');
        expect(screen.getByTestId('detailpage-filter-subject')).toHaveTextContent('Science');
        expect(screen.getByRole('link', { name: 'View the help for this filter' })).toHaveAttribute(
            'href',
            'https://guides.example.com/licence',
        );
        expect(screen.getByTestId('detailpage-metadata-keywords')).toHaveTextContent('Generative AI');
        expect(screen.getByTestId('detailpage-last-updated')).toHaveTextContent('15 Jan, 2026');
        expect(screen.getByTestId('detailpage-authenticated-link-url')).toHaveAttribute(
            'href',
            expect.stringContaining('featured-object'),
        );
        expect(screen.getByTestId('dlor-view-series-item-other-object-order-0')).toHaveTextContent('First series item');
        expect(screen.getByTestId('dlor-view-series-item-featured-object-order-1')).toHaveTextContent(
            'Current series item',
        );
    });

    it('renders a default access description and omits empty metadata', () => {
        renderDLOView({
            dlorItem: makeObject({
                object_review_date_next: '',
                object_keywords: undefined,
                object_filters: [],
            }),
        });

        expect(screen.getByTestId('detailpage-visibility')).toHaveTextContent('Anyone can access this object.');
        expect(screen.queryByTestId('detailpage-last-updated')).not.toBeInTheDocument();
        expect(screen.queryByTestId('detailpage-metadata-keywords')).not.toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'Details' })).not.toBeInTheDocument();
        expect(screen.getByTestId('dlor-detailpage')).toBeInTheDocument();
        expect(screen.getByTestId('dlor-homepage-loginprompt')).toBeInTheDocument();
        expect(screen.getByTestId('detailpage-notify-button')).toHaveAttribute('aria-disabled', 'true');
        expect(screen.getByTestId('detailpage-demographics-button')).toHaveAttribute('aria-disabled', 'true');
    });

    it.each([
        ['uquser', 'This object is available to UQ staff and students.'],
        ['uqstaff', 'This object is available to UQ staff members only.'],
        ['uqlibrarystaff', 'This object is available to UQ Library staff members only.'],
    ])('renders the %s access description', (restriction, description) => {
        renderDLOView(
            { dlorItem: makeObject({ object_restrict_to: restriction }) },
            { id: 'library-staff', user_group: 'LIBRARYSTAFFB' },
        );

        expect(screen.getByTestId('detailpage-visibility')).toHaveTextContent(description);
    });

    it.each([
        ['view', 'video', 2864, /Access the object \(video 47m 44s\)/],
        ['view', 'video', 0, /Access the object \(video\)/],
        ['view', '', 2864, /Access the object \(47m 44s\)/],
        ['download', 'XLS', 3400000, /Access the object \(XLS 3\.4 GB\)/],
        ['download', 'XLS', 0, /Access the object \(XLS\)/],
        ['download', '', 3400000, /Access the object \(3\.4 GB\)/],
        ['none', '', 0, 'Access the object'],
    ])('formats the get-it button for %s interaction records', (interaction, fileType, size, expectedLabel) => {
        renderDLOView({
            dlorItem: makeObject({
                object_link_interaction_type: interaction,
                object_link_file_type: fileType,
                object_link_size: size,
            }),
        });

        expect(screen.getByTestId('detailpage-clicklink')).toHaveTextContent(expectedLabel);
    });

    it('does not preview non-YouTube links', () => {
        renderDLOView({ dlorItem: makeObject({ object_link_url: 'https://example.com/object' }) });

        expect(screen.queryByTestId('detailpage-preview')).not.toBeInTheDocument();
    });

    it('navigates directly to the object link and opens its favorites actions', async () => {
        const { actions } = renderDLOView(
            {
                dlorItem: makeObject({ object_link_url: '#object-link' }),
                dlorFavouritesList: [],
            },
            { id: 'student-1', user_group: 'UG' },
        );

        fireEvent.click(screen.getByTestId('detailpage-clicklink'));
        expect(window.location.hash).toBe('#object-link');

        fireEvent.click(screen.getByTestId('favorite-star-outline-icon'));
        await waitFor(() => expect(actions.addFavourite).toHaveBeenCalledWith('object-1'));
    });

    it('removes a previously saved favorite', async () => {
        const { actions } = renderDLOView(
            {
                dlorItem: makeObject(),
                dlorFavouritesList: [{ object_public_uuid: 'object-1' }],
            },
            { id: 'student-1', user_group: 'UG' },
        );

        fireEvent.click(screen.getByTestId('favorite-star-icon'));
        await waitFor(() => expect(actions.removeFavourite).toHaveBeenCalledWith('object-1'));
    });

    it('shows access-denied messages for public users with each restriction', () => {
        const restrictions = [
            ['uqstaff', 'You need to be a UQ staff member to access this object'],
            ['uqlibrarystaff', 'You need to be a UQ Library staff member to access this object'],
            ['uquser', 'You need to be a UQ staff or student to access this object'],
        ];

        restrictions.forEach(([restriction, message]) => {
            cleanup();
            renderDLOView(
                {
                    dlorItem: makeObject({ object_restrict_to: restriction }),
                },
                { id: 'community-user', user_group: 'COMMU' },
            );

            expect(screen.getByTestId('access-denied-message')).toHaveTextContent(message);
            expect(screen.queryByTestId('dlor-detailpage')).not.toBeInTheDocument();
        });
    });

    it('closes demographics and notification dialogs when cancelled', () => {
        renderDLOView({}, { id: 'student-1', firstName: 'Jane', mail: 'jane@example.com', user_group: 'UG' });

        fireEvent.click(screen.getByTestId('detailpage-demographics-button'));
        fireEvent.click(screen.getByTestId('demographics-cancel'));
        expect(screen.getByTestId('demographics-cancel')).not.toBeVisible();

        fireEvent.click(screen.getByTestId('detailpage-notify-button'));
        fireEvent.click(screen.getByTestId('notifications-cancel'));
        expect(screen.getByTestId('notifications-cancel')).not.toBeVisible();
    });

    it('shows demographics inputs, validates required values, and saves the demographics payload', async () => {
        const { actions } = renderDLOView(
            {
                actions: { saveDlorDemographics: jest.fn().mockResolvedValue({}) },
            },
            { id: 'student-1', firstName: 'Jane', mail: 'jane@example.com', user_group: 'UG' },
        );

        fireEvent.click(screen.getByTestId('detailpage-demographics-button'));
        const capture = screen.getByTestId('demographics-capture');
        expect(capture).toBeDisabled();

        fireEvent.change(screen.getByTestId('view-demographics-subject-code').querySelector('input'), {
            target: { value: 'PHIL1001' },
        });
        expect(capture).toBeDisabled();
        fireEvent.change(screen.getByTestId('view-demographics-school-name').querySelector('input'), {
            target: { value: 'School of Mathematics' },
        });
        fireEvent.change(screen.getByTestId('view-demographics-other-comments').querySelector('input'), {
            target: { value: 'Research comments' },
        });
        expect(capture).toBeEnabled();
        fireEvent.click(capture);

        await waitFor(() => expect(actions.saveDlorDemographics).toHaveBeenCalledTimes(1));
        expect(actions.saveDlorDemographics).toHaveBeenCalledWith({
            dlorUuid: 'object-1',
            demographics: {
                subject: 'PHIL1001',
                school: 'School of Mathematics',
                comments: 'Research comments',
            },
            subscribeRequest: {
                userName: '',
                userEmail: '',
                loggedin: true,
            },
        });
        expect(await screen.findByTestId('dialogbox-dlor-save-notification')).toHaveTextContent(
            'Demographic information saved',
        );
    });

    it('validates notification email and submits notification details', async () => {
        const { actions } = renderDLOView(
            {
                actions: { saveDlorDemographics: jest.fn().mockResolvedValue({}) },
                dlorUpdatedItem: { data: { subscription: true } },
            },
            { id: 'student-1', firstName: 'Jane', mail: 'jane@example.com', user_group: 'UG' },
        );

        fireEvent.click(screen.getByTestId('detailpage-notify-button'));
        const capture = screen.getByTestId('notifications-capture');
        expect(capture).toBeEnabled();
        fireEvent.change(screen.getByTestId('view-notify-userEmail').querySelector('input'), {
            target: { value: 'invalid-email' },
        });
        expect(capture).toBeDisabled();
        expect(screen.getByTestId('dlor-form-error-message-object-publishing-user')).toBeInTheDocument();

        fireEvent.change(screen.getByTestId('view-notify-userEmail').querySelector('input'), {
            target: { value: 'jane.updated@example.com' },
        });
        expect(capture).toBeEnabled();
        fireEvent.click(capture);

        await waitFor(() => expect(actions.saveDlorDemographics).toHaveBeenCalledTimes(1));
        expect(actions.saveDlorDemographics).toHaveBeenCalledWith({
            dlorUuid: 'object-1',
            demographics: { subject: '', school: '', comments: '' },
            subscribeRequest: {
                userName: 'Jane',
                userEmail: 'jane.updated@example.com',
                loggedin: true,
            },
        });
        expect(await screen.findByTestId('dialogbox-dlor-save-notification')).toHaveTextContent(
            'Please check your email to confirm your subscription request.',
        );
    });

    it('reports an existing subscription after a notify submission', async () => {
        const { actions } = renderDLOView(
            {
                actions: { saveDlorDemographics: jest.fn().mockResolvedValue({}) },
                dlorUpdatedItem: { data: { subscription: false } },
            },
            { id: 'student-1', firstName: 'Jane', mail: 'jane@example.com', user_group: 'UG' },
        );

        fireEvent.click(screen.getByTestId('detailpage-notify-button'));
        fireEvent.click(screen.getByTestId('notifications-capture'));

        await waitFor(() => expect(actions.saveDlorDemographics).toHaveBeenCalledTimes(1));
        expect(await screen.findByTestId('dialogbox-dlor-save-notification')).toHaveTextContent(
            'You are already subscribed',
        );
    });

    it('shows a save-error confirmation after demographics submission fails', async () => {
        const { actions } = renderDLOView(
            {
                actions: { saveDlorDemographics: jest.fn().mockResolvedValue({}) },
                dlorUpdatedItemError: 'Request failed',
            },
            { id: 'student-1', firstName: 'Jane', mail: 'jane@example.com', user_group: 'UG' },
        );

        fireEvent.click(screen.getByTestId('detailpage-demographics-button'));
        fireEvent.change(screen.getByTestId('view-demographics-subject-code').querySelector('input'), {
            target: { value: 'PHIL1001' },
        });
        fireEvent.change(screen.getByTestId('view-demographics-school-name').querySelector('input'), {
            target: { value: 'School of Mathematics' },
        });
        fireEvent.click(screen.getByTestId('demographics-capture'));

        await waitFor(() => expect(actions.saveDlorDemographics).toHaveBeenCalledTimes(1));
        expect(await screen.findByTestId('dialogbox-dlor-save-notification')).toHaveTextContent(
            'There was a problem saving your supplied information - please try again later.',
        );
    });
});
