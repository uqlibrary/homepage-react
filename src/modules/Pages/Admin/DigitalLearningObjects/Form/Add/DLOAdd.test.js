import React from 'react';
import { rtlRender, screen, waitFor, WithRouter } from '../../../../../../../utils/test-utils';
import { useAccountContext } from 'context';
import { isDlorAdminUser } from 'helpers/access';
import { DLOAdd } from './DLOAdd';

jest.mock('context', () => ({
    useAccountContext: jest.fn(),
}));

jest.mock('helpers/access', () => ({
    isDlorAdminUser: jest.fn(),
}));

jest.mock('modules/SharedComponents/Toolbox/StandardPage', () => ({
    StandardPage: ({ title, children }) => (
        <div data-testid="standard-page" data-title={title}>
            {children}
        </div>
    ),
}));

jest.mock('modules/Pages/Admin/DigitalLearningObjects//SharedDlorComponents/DlorAdminBreadcrumbs', () => ({
    __esModule: true,
    default: ({ breadCrumbList }) => <div data-testid="breadcrumbs">{breadCrumbList?.[0]?.title}</div>,
}));

jest.mock('modules/Pages/DigitalLearningObjects/SharedComponents/InformationBox', () => ({
    __esModule: true,
    default: ({ prompt }) => <div data-testid="info-box">{prompt}</div>,
}));

jest.mock('modules/Pages/Admin/DigitalLearningObjects/Form/DlorForm', () => ({
    __esModule: true,
    default: ({ formDefaults, mode, actions }) => (
        <div
            data-testid="dlor-form"
            data-mode={mode}
            data-status={formDefaults?.object_status}
            data-owner={formDefaults?.object_publishing_user}
            data-keywords={formDefaults?.object_keywords_string}
        >
            {JSON.stringify({ formDefaults, mode, hasActions: !!actions })}
        </div>
    ),
}));

const baseProps = {
    actions: {
        loadDlorKeywords: jest.fn(),
    },
    dlorItemCreating: false,
    dlorCreatedItemError: null,
    dlorCreatedItem: null,
    dlorTeamList: [],
    dlorTeamListLoading: false,
    dlorTeamListError: null,
    dlorFileTypeList: [],
    dlorFileTypeListLoading: false,
    dlorFileTypeListError: null,
    dlorFilterList: [],
    dlorFilterListLoading: false,
    dlorFilterListError: null,
    dlorAdminNotesLoading: false,
    dlorAdminNotesLoaded: false,
    dlorAdminNotesLoadError: null,
    dlorAdminNotes: [],
    dlorKeywords: [],
    dlorKeywordsLoading: false,
    dlorKeywordsError: null,
};

const renderDloAdd = (props = {}) => {
    const actions = {
        ...baseProps.actions,
        ...(props.actions || {}),
    };

    rtlRender(
        <WithRouter>
            <DLOAdd {...baseProps} {...props} actions={actions} />
        </WithRouter>,
    );

    return actions;
};

describe('DLOAdd', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useAccountContext.mockReturnValue({ account: { id: 'u1234567' } });
        isDlorAdminUser.mockReturnValue(true);
    });

    it('loads keywords for admin users when none are available and passes the default add values', async () => {
        const actions = renderDloAdd();

        await waitFor(() => {
            expect(actions.loadDlorKeywords).toHaveBeenCalledTimes(1);
        });

        expect(screen.queryByTestId('info-box')).not.toBeInTheDocument();
        expect(screen.getByTestId('dlor-form')).toHaveAttribute('data-status', 'new');
        expect(screen.getByTestId('dlor-form')).toHaveAttribute('data-owner', 'u1234567');
    });

    it('shows the user guidance panel and submitted status for non-admin submitters', async () => {
        useAccountContext.mockReturnValue({ account: { id: 'guest-user' } });
        isDlorAdminUser.mockReturnValue(false);

        const actions = renderDloAdd({
            dlorKeywords: [{ keyword: 'Alpha' }],
        });

        await waitFor(() => {
            expect(actions.loadDlorKeywords).not.toHaveBeenCalled();
        });

        expect(screen.getByTestId('info-box')).toHaveTextContent(
            'Submit this form to request your digital learning object to be added to the Digital Learning Hub.',
        );
        expect(screen.getByTestId('dlor-form')).toHaveAttribute('data-status', 'submitted');
    });

    it('does not request keywords while a lookup is already in progress', async () => {
        const actions = renderDloAdd({
            dlorKeywords: [],
            dlorKeywordsLoading: true,
        });

        await waitFor(() => {
            expect(actions.loadDlorKeywords).not.toHaveBeenCalled();
        });
    });

    it('does not request keywords if the keyword request previously failed', async () => {
        const actions = renderDloAdd({
            dlorKeywords: [],
            dlorKeywordsError: new Error('request failed'),
        });

        await waitFor(() => {
            expect(actions.loadDlorKeywords).not.toHaveBeenCalled();
        });
    });
});
