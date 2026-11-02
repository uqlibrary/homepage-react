import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useParams } from 'react-router';
import { useAccountContext } from 'context';

import { DLOEdit } from './DLOEdit';
import {
    getFileSizeString,
    getMinutesFromTotalSeconds,
    getSecondsFromTotalSeconds,
} from 'modules/Pages/DigitalLearningObjects/dlorHelpers';

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

jest.mock('modules/SharedComponents/Toolbox/StandardCard', () => ({
    StandardCard: ({ title, children }) => <div data-testid="standard-card" data-title={title}>{children}</div>,
}));

jest.mock('modules/Pages/Admin/DigitalLearningObjects//SharedDlorComponents/DlorAdminBreadcrumbs', () => ({
    __esModule: true,
    default: ({ breadCrumbList }) => <div data-testid="breadcrumbs">{breadCrumbList?.[0]?.title}</div>,
}));

jest.mock('modules/Pages/DigitalLearningObjects/dlorHelpers', () => ({
    getFileSizeString: jest.fn(),
    getMinutesFromTotalSeconds: jest.fn(),
    getSecondsFromTotalSeconds: jest.fn(),
}));

jest.mock('modules/Pages/Admin/DigitalLearningObjects/Form/DlorForm', () => ({
    __esModule: true,
    default: ({ formDefaults, mode, dlorItem }) => (
        <div data-testid="dlor-form" data-mode={mode} data-title={formDefaults?.object_title}>
            <span data-testid="dlor-title">{formDefaults?.object_title}</span>
            <span data-testid="dlor-keywords">{formDefaults?.object_keywords?.join('|')}</span>
            <span data-testid="dlor-link-size-unit">{formDefaults?.object_link_size_units}</span>
            <span data-testid="dlor-link-size-amount">{formDefaults?.object_link_size_amount}</span>
            <span data-testid="dlor-link-duration-minutes">{formDefaults?.object_link_duration_minutes}</span>
            <span data-testid="dlor-link-duration-seconds">{formDefaults?.object_link_duration_seconds}</span>
            <span data-testid="dlor-item-title">{dlorItem?.object_title}</span>
        </div>
    ),
}));

const baseProps = {
    actions: {
        loadOwningTeams: jest.fn(),
        loadDlorKeywords: jest.fn(),
        clearADlor: jest.fn(),
        loadADLOR: jest.fn(),
    },
    dlorItemLoading: false,
    dlorItemError: null,
    dlorItem: null,
    dlorItemUpdating: false,
    dlorUpdatedItemError: null,
    dlorUpdatedItem: null,
    dlorTeamList: null,
    dlorTeamListLoading: false,
    dlorTeamListError: null,
    dlorFilterList: [],
    dlorFilterListLoading: false,
    dlorFilterListError: null,
    dlorAdminNotesLoading: false,
    dlorAdminNotesLoaded: false,
    dlorAdminNotesLoadError: null,
    dlorAdminNotes: [],
    dlorKeywords: null,
    dlorKeywordsLoading: false,
    dlorKeywordsError: null,
};

const renderDloEdit = (props = {}) => {
    const actions = {
        ...baseProps.actions,
        ...(props.actions || {}),
    };

    return render(<DLOEdit {...baseProps} {...props} actions={actions} />);
};

const sampleDlorItem = {
    object_title: 'A useful object',
    object_description: '<p>Something descriptive</p>',
    object_summary: 'A short summary',
    object_owning_team_id: 2,
    object_link_url: 'https://example.com/object',
    object_download_instructions: 'Download this resource',
    owner: {
        publishing_user_username: 'u1234567',
        publishing_user_email: 'owner@example.com',
        team_name: 'Team Two',
        team_manager: 'Manager Two',
        team_email: 'team@example.com',
        team_admin_username: 'u123456',
    },
    object_keywords: ['Alpha', 'Beta'],
    object_filters: [{ filter_key: 'subject', filter_values: [{ id: 7 }] }],
    object_link_interaction_type: 'download',
    object_link_file_type: 'pdf',
    object_link_size: 2048,
    object_is_featured: 0,
    object_cultural_advice: 0,
    object_status: 'new',
    object_review_date_next: '2026-02-01',
    object_restrict_to: 'none',
    object_public_uuid: 'abc-123',
};

describe('DLOEdit', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useAccountContext.mockReturnValue({ account: { id: 'u1234567' } });
        useParams.mockReturnValue({ dlorId: 'abc-123' });
        getFileSizeString.mockImplementation((value, type) => {
            if (type === 'unit') return 'KB';
            if (type === 'amount') return '2';
            return '';
        });
        getMinutesFromTotalSeconds.mockReturnValue('3');
        getSecondsFromTotalSeconds.mockReturnValue('45');
    });

    it('loads team and keyword data before rendering the edit form', async () => {
        const actions = {
            loadOwningTeams: jest.fn(),
            loadDlorKeywords: jest.fn(),
            clearADlor: jest.fn(),
            loadADLOR: jest.fn(),
        };

        renderDloEdit({
            actions,
            dlorItem: sampleDlorItem,
            dlorKeywords: null,
            dlorTeamList: null,
        });

        await waitFor(() => {
            expect(actions.loadOwningTeams).toHaveBeenCalledTimes(1);
        });

        await waitFor(() => {
            expect(actions.loadDlorKeywords).toHaveBeenCalledTimes(1);
        });

        await waitFor(() => {
            expect(actions.clearADlor).toHaveBeenCalledTimes(1);
        });

        await waitFor(() => {
            expect(actions.loadADLOR).toHaveBeenCalledWith('abc-123', true);
        });

        expect(screen.getByTestId('dlor-form')).toHaveAttribute('data-mode', 'edit');
        expect(screen.getByTestId('dlor-form')).toHaveAttribute('data-title', 'A useful object');
    });

    it('renders an error card when the DLO lookup fails', () => {
        renderDloEdit({
            dlorItemError: 'Something went wrong',
            dlorItem: null,
        });

        expect(screen.getByTestId('dlor-form-error')).toHaveTextContent('Something went wrong');
        expect(screen.getByTestId('standard-card')).toHaveAttribute('data-title', 'Edit an Object for the Digital Learning Hub');
    });

    it('maps download metrics into the edit defaults', () => {
        renderDloEdit({
            dlorItem: {
                ...sampleDlorItem,
                object_link_interaction_type: 'download',
            },
            dlorKeywords: ['Alpha'],
            dlorTeamList: [],
        });

        expect(screen.getByTestId('dlor-link-size-unit')).toHaveTextContent('KB');
        expect(screen.getByTestId('dlor-link-size-amount')).toHaveTextContent('2');
        expect(getFileSizeString).toHaveBeenCalledWith(2048, 'unit');
        expect(getFileSizeString).toHaveBeenCalledWith(2048, 'amount');
    });

    it('maps view metrics into the edit defaults', () => {
        renderDloEdit({
            dlorItem: {
                ...sampleDlorItem,
                object_link_interaction_type: 'view',
                object_link_size: 183,
            },
            dlorKeywords: ['Alpha'],
            dlorTeamList: [],
        });

        expect(screen.getByTestId('dlor-link-duration-minutes')).toHaveTextContent('3');
        expect(screen.getByTestId('dlor-link-duration-seconds')).toHaveTextContent('45');
        expect(getMinutesFromTotalSeconds).toHaveBeenCalledWith(183);
        expect(getSecondsFromTotalSeconds).toHaveBeenCalledWith(183);
    });

    it('returns blank sizing values when the object has no link interaction type', () => {
        renderDloEdit({
            dlorItem: {
                ...sampleDlorItem,
                object_link_interaction_type: 'none',
            },
            dlorKeywords: ['Alpha'],
            dlorTeamList: [],
        });

        expect(screen.getByTestId('dlor-link-size-unit')).toHaveTextContent('');
        expect(screen.getByTestId('dlor-link-duration-minutes')).toHaveTextContent('');
    });

    it('renders the edit form even before the DLO payload is loaded', () => {
        renderDloEdit({
            dlorItem: null,
            dlorItemError: null,
            dlorKeywords: [],
            dlorTeamList: [],
        });

        expect(screen.getByTestId('dlor-form')).toHaveAttribute('data-mode', 'edit');
        expect(screen.getByTestId('dlor-form')).not.toHaveAttribute('data-title');
    });
});
