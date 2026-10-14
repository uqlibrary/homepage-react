import React from 'react';
import { rtlRender, screen, fireEvent, waitFor, WithRouter } from '../../../../../../utils/test-utils';
import { useCookies } from 'react-cookie';
import { useAccountContext } from 'context';
import DlorForm from './DlorForm';

jest.mock('react-cookie', () => ({
    useCookies: jest.fn(),
}));

jest.mock('context', () => ({
    useAccountContext: jest.fn(),
}));

jest.mock('modules/SharedComponents/RichTextEditor', () => ({
    RichTextEditor: ({ id, testId, value, onChange }) => (
        <textarea id={id} data-testid={testId} value={value || ''} onChange={e => onChange(e.target.value)} />
    ),
}));

jest.mock('modules/Pages/DigitalLearningObjects/SharedComponents/FuzzySearch', () => ({
    __esModule: true,
    default: ({ onSelectedItemsChange }) => (
        <input
            data-testid="fuzzy-search"
            onChange={e =>
                onSelectedItemsChange([{ keyword: e.target.value, keyword_vocabulary_id: 101, score: 1 }])
            }
        />
    ),
}));

jest.mock('modules/SharedComponents/Toolbox/ConfirmDialogBox', () => ({
    ConfirmationBox: ({ isOpen, locale, onAction, onCancelAction, onClose }) => {
        if (!isOpen) return null;
        return (
            <div data-testid={`dialogbox-${locale.confirmationTitle}`}>
                <button type="button" onClick={onAction}>Action</button>
                <button type="button" onClick={onCancelAction}>Cancel</button>
                <button type="button" onClick={onClose}>Close</button>
            </div>
        );
    },
}));

jest.mock('modules/SharedComponents/Toolbox/Loaders', () => ({
    InlineLoader: ({ message }) => <div data-testid="inline-loader">{message}</div>,
}));

const adminAccount = {
    id: 'u1234567',
    groups: ['lib_dlor_admins'],
};

const validFilters = [
    {
        facet_type_slug: 'subject',
        facet_type_name: 'Subject',
        facet_type_number: 'zero-or-more',
        facet_type_required: false,
        facet_list: [{ facet_id: 10, facet_name: 'Math' }],
    },
];

const validFormDefaults = {
    object_title: 'A valid title',
    object_description: '<p>Alpha beta gamma delta epsilon adds many meaningful words to support the object description requirement.</p>',
    object_summary: 'This summary already contains enough detail.',
    object_publishing_user: 'u123456',
    object_review_date_next: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString().slice(0, 10),
    object_link_url: 'https://example.com/object',
    object_link_interaction_type: 'none',
    object_link_file_type: 'pdf',
    object_owning_team_id: 1,
    facets: [],
    object_keywords: ['Alpha'],
    object_status: 'new',
    object_is_featured: 0,
    object_restrict_to: 'none',
    object_download_instructions: '<p>Download instructions</p>',
    object_admin_notes: '',
    team_name_edit: 'Team One',
    team_manager_edit: 'Manager',
    team_email_edit: 'manager@example.com',
    team_admin_username_edit: 'u123456',
    notificationText: '',
    object_keywords_string: 'Alpha',
};

const baseProps = {
    actions: {
        loadOwningTeams: jest.fn(),
        loadAllFilters: jest.fn(),
        loadFileTypeList: jest.fn(),
        createDlor: jest.fn().mockResolvedValue({}),
        updateDlor: jest.fn(),
        requestNewKeyword: jest.fn().mockResolvedValue({}),
        clearADlor: jest.fn(),
        loadDlorAdminNotes: jest.fn(),
        saveDlorAdminNote: jest.fn(),
    },
    dlorItemSaving: false,
    dlorSavedItemError: null,
    dlorSavedItem: null,
    dlorItemLoading: false,
    dlorItem: null,
    dlorTeamList: [{ team_id: 1, team_name: 'Team One', team_members: [] }],
    dlorTeamListLoading: false,
    dlorTeamListError: null,
    dlorFilterList: validFilters,
    dlorFilterListLoading: false,
    dlorFilterListError: null,
    dlorFileTypeList: [{ object_link_file_type: 'pdf' }],
    dlorFileTypeListLoading: false,
    dlorFileTypeListError: null,
    dlorAdminNotes: [],
    dlorKeywords: [{ keyword: 'Alpha', keyword_vocabulary_id: 101, synonyms: [] }],
    formDefaults: validFormDefaults,
    mode: 'add',
};

const renderForm = (props = {}) => {
    const actions = {
        ...baseProps.actions,
        ...(props.actions || {}),
    };

    rtlRender(
        <WithRouter>
            <DlorForm {...baseProps} {...props} actions={actions} />
        </WithRouter>,
    );

    return actions;
};

const getFieldInput = testId => {
    const element = screen.getByTestId(testId);
    return element.querySelector('input, textarea') || element;
};

const advanceToStep = stepIndex => {
    for (let i = 0; i < stepIndex; i += 1) {
        fireEvent.click(screen.getByTestId('dlor-form-next-button'));
    }
};

describe('DlorForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useCookies.mockReturnValue([{}, jest.fn()]);
        useAccountContext.mockReturnValue({ account: adminAccount });
    });

    it('shows a loading state while the form is still fetching dependencies', () => {
        renderForm({
            dlorTeamListLoading: true,
            dlorFilterList: undefined,
            dlorFilterListLoading: false,
        });

        expect(screen.getByTestId('inline-loader')).toHaveTextContent('Loading');
    });

    it('blocks access when the current account cannot edit the object', () => {
        useAccountContext.mockReturnValue({ account: { id: 'guest-user', groups: [] } });

        renderForm();

        expect(screen.getByTestId('dlor-form-no-access')).toBeInTheDocument();
    });

    it('creates a DLO with valid data and allows save', async () => {
        const actions = renderForm();

        advanceToStep(3);

        expect(screen.getByTestId('admin-dlor-save-button-submit')).not.toBeDisabled();

        fireEvent.click(screen.getByTestId('admin-dlor-save-button-submit'));

        await waitFor(() => {
            expect(actions.createDlor).toHaveBeenCalledTimes(1);
        });

        expect(actions.createDlor).toHaveBeenCalledWith(
            expect.objectContaining({
                object_title: 'A valid title',
                object_keywords: ['Alpha'],
            }),
            true,
        );
    });

    it('lets a user select a filter facet before saving', async () => {
        const actions = renderForm();

        advanceToStep(3);
        const subjectCheckbox = screen.getByTestId('filter-subject-math').querySelector('input');
        fireEvent.click(subjectCheckbox);

        expect(subjectCheckbox).toBeChecked();

        fireEvent.click(screen.getByTestId('admin-dlor-save-button-submit'));

        await waitFor(() => {
            expect(actions.createDlor).toHaveBeenCalledTimes(1);
        });

        expect(actions.createDlor).toHaveBeenCalledWith(
            expect.objectContaining({
                facets: [10],
            }),
            true,
        );
    });

    it('opens the keyword request modal and submits a new tag request', async () => {
        const actions = renderForm();

        advanceToStep(3);
        fireEvent.click(screen.getByTestId('dlor-request-keyword-button'));

        fireEvent.change(getFieldInput('requested_keyword'), {
            target: { value: 'New Tag' },
        });
        fireEvent.change(getFieldInput('request_reason'), {
            target: { value: 'Need this tag for course materials.' },
        });
        fireEvent.click(screen.getByTestId('admin-dlor-form-keyword-confirm'));

        await waitFor(() => {
            expect(actions.requestNewKeyword).toHaveBeenCalledTimes(1);
        });

        expect(actions.requestNewKeyword).toHaveBeenCalledWith(
            expect.objectContaining({
                requested_keyword: 'New Tag',
                request_reason: 'Need this tag for course materials.',
            }),
        );
    });

    it('suggests a summary when the description changes and lets the user accept it', async () => {
        renderForm({
            formDefaults: {
                ...validFormDefaults,
                object_description: '<p>Many words in a sentence. This sentence is long enough to trigger a suggestion.</p>',
            },
        });

        advanceToStep(1);
        fireEvent.change(screen.getByTestId('object-description'), {
            target: { value: '<p>This is a very long description with enough content to create a suggestion summary for the object.</p>' },
        });

        await waitFor(() => {
            expect(screen.getByTestId('admin-dlor-suggest-summary')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByTestId('admin-dlor-suggest-summary-button'));

        await waitFor(() => {
            expect(getFieldInput('object-summary').value).toEqual(expect.any(String));
        });
    });
});
