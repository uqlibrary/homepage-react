import React from 'react';
import { rtlRender, screen, fireEvent, waitFor, WithRouter, cleanup } from '../../../../../../utils/test-utils';
import { useCookies } from 'react-cookie';
import { useAccountContext } from 'context';
import { scrollToTopOfPage } from 'helpers/general';
import 'moment-timezone';
import DlorForm from './DlorForm';

jest.mock('react-cookie', () => ({
    useCookies: jest.fn(),
}));

jest.mock('context', () => ({
    useAccountContext: jest.fn(),
}));

jest.mock('helpers/general', () => ({
    ...jest.requireActual('helpers/general'),
    scrollToTopOfPage: jest.fn(),
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
            onChange={e => onSelectedItemsChange([{ keyword: e.target.value, keyword_vocabulary_id: 101, score: 1 }])}
        />
    ),
}));

jest.mock('modules/SharedComponents/Toolbox/ConfirmDialogBox', () => ({
    ConfirmationBox: ({ isOpen, locale, onAction, onCancelAction, onClose }) => {
        if (!isOpen) return null;
        return (
            <div data-testid={`dialogbox-${locale.confirmationTitle}`}>
                <button type="button" onClick={onAction}>
                    Action
                </button>
                <button type="button" onClick={onCancelAction}>
                    Cancel
                </button>
                <button type="button" onClick={onClose}>
                    Close
                </button>
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
    object_description:
        '<p>Alpha beta gamma delta epsilon adds many meaningful words to support the object description requirement.</p>',
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

const renderFormWithResult = (props = {}) => {
    const actions = {
        ...baseProps.actions,
        ...(props.actions || {}),
    };

    const view = rtlRender(
        <WithRouter>
            <DlorForm {...baseProps} {...props} actions={actions} />
        </WithRouter>,
    );

    return { ...view, actions };
};

const renderForm = (props = {}) => renderFormWithResult(props).actions;

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

        renderForm({
            dlorTeamList: undefined,
            formDefaults: {
                ...validFormDefaults,
                object_publishing_user: 'another-user',
                object_owning_team_id: 0,
            },
        });

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

    it('removes a selected filter facet before saving', async () => {
        const actions = renderForm();

        advanceToStep(3);
        const subjectCheckbox = screen.getByTestId('filter-subject-math').querySelector('input');
        fireEvent.click(subjectCheckbox);
        expect(subjectCheckbox).toBeChecked();

        fireEvent.click(subjectCheckbox);
        expect(subjectCheckbox).not.toBeChecked();
        fireEvent.click(screen.getByTestId('admin-dlor-save-button-submit'));

        await waitFor(() => {
            expect(actions.createDlor).toHaveBeenCalledTimes(1);
        });

        expect(actions.createDlor).toHaveBeenCalledWith(expect.objectContaining({ facets: [] }), true);
    });

    it('uses fuzzy-search selections when saving keywords', async () => {
        const actions = renderForm();

        advanceToStep(3);
        fireEvent.change(screen.getByTestId('fuzzy-search'), { target: { value: 'Beta' } });
        fireEvent.click(screen.getByTestId('admin-dlor-save-button-submit'));

        await waitFor(() => {
            expect(actions.createDlor).toHaveBeenCalledTimes(1);
        });

        expect(actions.createDlor).toHaveBeenCalledWith(
            expect.objectContaining({
                object_keyword_ids: [101],
                object_keywords: ['Beta'],
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

    it('closes the keyword request modal without submitting', () => {
        const actions = renderForm();

        advanceToStep(3);
        fireEvent.click(screen.getByTestId('dlor-request-keyword-button'));
        fireEvent.change(getFieldInput('requested_keyword'), { target: { value: 'New Tag' } });
        fireEvent.click(screen.getByTestId('admin-dlor-form-keyword-cancel'));

        expect(screen.queryByTestId('dialogbox-Request a new tag')).not.toBeInTheDocument();
        expect(actions.requestNewKeyword).not.toHaveBeenCalled();
    });

    it('suggests a summary when the description changes and lets the user accept it', async () => {
        renderForm({
            formDefaults: {
                ...validFormDefaults,
                object_description: '<pre>A long description with no sentence ending.</pre>',
            },
        });

        advanceToStep(1);
        const longDescription = `<pre>${Array(40).fill('longword').join(' ')}</pre>`;
        fireEvent.change(screen.getByTestId('object-description'), {
            target: { value: longDescription },
        });

        await waitFor(() => {
            expect(screen.getByTestId('admin-dlor-suggest-summary')).toBeInTheDocument();
        });

        const suggestion = screen.getByTestId('admin-dlor-suggest-summary-content').textContent;
        expect(suggestion.length).toBeLessThanOrEqual(150);
        expect(suggestion).not.toContain('.');

        fireEvent.click(screen.getByTestId('admin-dlor-suggest-summary-button'));

        await waitFor(() => {
            expect(getFieldInput('object-summary').value).toEqual(expect.any(String));
        });
    });

    it('closes the summary suggestion when its close control is clicked', async () => {
        renderForm();

        advanceToStep(1);
        fireEvent.change(screen.getByTestId('object-description'), {
            target: { value: '<pre>A description without a sentence ending.</pre>' },
        });

        await waitFor(() => {
            expect(screen.getByTestId('admin-dlor-suggest-summary')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByTestId('admin-dlor-suggest-summary-close-button'));

        expect(screen.queryByTestId('admin-dlor-suggest-summary')).not.toBeInTheDocument();
    });

    it.each([
        [
            'short text without sentence punctuation',
            '<p>A short summary without punctuation</p>',
            'A short summary without punctuation',
        ],
        ['text containing a line break', '<pre>First line\nSecond line</pre>', 'First line'],
    ])('suggests a summary for %s', async (_description, description, expectedSummary) => {
        renderForm({
            formDefaults: {
                ...validFormDefaults,
                object_description: '',
            },
        });

        advanceToStep(1);
        fireEvent.change(screen.getByTestId('object-description'), { target: { value: description } });

        await waitFor(() => {
            expect(screen.getByTestId('admin-dlor-suggest-summary-content')).toHaveTextContent(expectedSummary);
        });
    });

    it('validates empty team contact fields while editing team details', () => {
        renderForm({
            mode: 'edit',
            dlorItem: {
                object_public_uuid: 'edit-empty-team-contact',
                object_owning_team_id: 1,
                object_link_interaction_type: 'none',
            },
            formDefaults: {
                ...validFormDefaults,
                team_manager_edit: '',
                team_admin_username_edit: '',
                team_email_edit: '',
            },
        });

        fireEvent.click(screen.getByTestId('object-form-teamid-change'));

        expect(screen.getByTestId('dlor-form-team-manager-edit')).toBeInTheDocument();
        expect(screen.getByTestId('error-message-team-admin-username')).toBeInTheDocument();
        expect(screen.getByTestId('error-message-team-email-edit')).toBeInTheDocument();
    });

    it('saves an object without a link interaction type or download instructions', async () => {
        const actions = renderForm({
            formDefaults: {
                ...validFormDefaults,
                object_link_interaction_type: undefined,
                object_download_instructions: '',
            },
        });

        advanceToStep(2);
        expect(getFieldInput('download_instructions')).toHaveValue('');
        advanceToStep(1);
        fireEvent.click(screen.getByTestId('admin-dlor-save-button-submit'));

        await waitFor(() => {
            expect(actions.createDlor).toHaveBeenCalledTimes(1);
        });

        expect(actions.createDlor).toHaveBeenCalledWith(
            expect.objectContaining({
                object_link_interaction_type: undefined,
                object_link_file_type: 'new',
                object_download_instructions: '',
            }),
            true,
        );
    });

    it('loads supporting data and surfaces missing/error states', async () => {
        const actions = renderForm({
            dlorTeamList: undefined,
            dlorFilterList: undefined,
            dlorFileTypeList: undefined,
        });

        await waitFor(() => {
            expect(actions.loadOwningTeams).toHaveBeenCalled();
            expect(actions.loadAllFilters).toHaveBeenCalled();
            expect(actions.loadFileTypeList).toHaveBeenCalled();
        });

        cleanup();
        renderForm({ dlorFilterList: [] });
        expect(screen.getByTestId('dlor-homepage-noresult')).toBeInTheDocument();

        cleanup();
        renderForm({ dlorTeamListError: 'Team fetch failed' });
        expect(screen.getByTestId('dlor-form-addedit-error')).toHaveTextContent('Team fetch failed');

        cleanup();
        renderForm({
            dlorTeamList: validFilters,
            dlorFilterListError: 'Filter fetch failed',
        });
        expect(screen.getByTestId('dlor-homepage-error')).toHaveTextContent('Filter fetch failed');
    });

    it('uses safe defaults when optional values are empty', () => {
        renderForm({
            formDefaults: {
                ...validFormDefaults,
                object_publishing_user: '',
                object_keywords_string: '',
                object_title: '',
                object_summary: '',
                object_status: '',
                object_restrict_to: '',
                object_link_url: '',
                object_link_file_type: undefined,
            },
        });

        expect(getFieldInput('object-publishing-user')).toHaveValue('');
        advanceToStep(1);
        expect(getFieldInput('object-title')).toHaveValue('');
        expect(getFieldInput('object-summary')).toHaveValue('');
        expect(screen.getByRole('radio', { name: 'Draft' })).toBeChecked();
        expect(getFieldInput('object-restrict-to')).toHaveValue('none');

        advanceToStep(1);
        expect(getFieldInput('object-link-url')).toHaveValue('');
    });

    it('shows publication status controls for non-admin edits unless the object is submitted', () => {
        useAccountContext.mockReturnValue({ account: { id: 'object-owner', groups: [] } });
        renderForm({
            mode: 'edit',
            dlorItem: { object_public_uuid: 'editable-object', object_owning_team_id: 1 },
            formDefaults: {
                ...validFormDefaults,
                object_publishing_user: 'object-owner',
                object_status: 'current',
            },
        });
        advanceToStep(1);
        expect(screen.getByText('Object publication status')).toBeInTheDocument();

        cleanup();
        useAccountContext.mockReturnValue({ account: { id: 'object-owner', groups: [] } });
        renderForm({
            mode: 'edit',
            dlorItem: { object_public_uuid: 'submitted-object', object_owning_team_id: 1 },
            formDefaults: {
                ...validFormDefaults,
                object_publishing_user: 'object-owner',
                object_status: 'submitted',
            },
        });
        advanceToStep(1);
        expect(screen.queryByText('Object publication status')).not.toBeInTheDocument();
    });

    it('renders validation badges for invalid ownership, description, links and filter panels', () => {
        renderForm({
            mode: 'edit',
            dlorItem: {
                object_public_uuid: 'edit-uuid',
                object_owning_team_id: 'new',
                object_title: 'Short',
                object_link_interaction_type: 'view',
                object_link_file_type: 'new',
                object_status: 'new',
                object_public_uuid: 'edit-uuid',
            },
            formDefaults: {
                ...validFormDefaults,
                object_title: 'Short',
                object_description: '<p>Short</p>',
                object_summary: 'Short',
                object_publishing_user: 'a',
                object_review_date_next: '2099-12-31',
                object_link_url: 'not-a-url',
                object_link_interaction_type: 'view',
                object_link_duration_minutes: '0',
                object_link_duration_seconds: '0',
                object_link_file_type: 'new',
                object_owning_team_id: 'new',
                team_name_new: '',
                team_manager_new: '',
                team_admin_username_new: '',
                team_email_new: 'bad-email',
                facets: [],
                object_keywords: [],
            },
            dlorFilterList: [
                {
                    facet_type_slug: 'subject',
                    facet_type_name: 'Subject',
                    facet_type_number: 'one-or-more',
                    facet_type_required: true,
                    facet_list: [{ facet_id: 10, facet_name: 'Math' }],
                },
            ],
            dlorTeamList: [
                { team_id: 1, team_name: 'Team One', team_members: [] },
                { team_id: 2, team_name: 'Team Two', team_members: [] },
            ],
        });

        expect(screen.getByTestId('dlor-panel-validity-indicator-0')).toBeInTheDocument();
        expect(screen.getByTestId('dlor-panel-validity-indicator-1')).toBeInTheDocument();
        expect(screen.getByTestId('dlor-panel-validity-indicator-2')).toBeInTheDocument();
        expect(screen.getByTestId('dlor-panel-validity-indicator-3')).toBeInTheDocument();
    });

    it('validates required facets for add and edit forms with both facet representations', () => {
        const requiredSubjectFilter = {
            ...validFilters[0],
            facet_type_required: true,
        };

        renderForm({
            dlorFilterList: [requiredSubjectFilter],
            formDefaults: { ...validFormDefaults, facets: [999] },
        });
        expect(screen.getByTestId('dlor-panel-validity-indicator-3')).toBeInTheDocument();

        cleanup();
        renderForm({
            mode: 'edit',
            dlorFilterList: [requiredSubjectFilter],
            formDefaults: {
                ...validFormDefaults,
                facets: [{ filter_key: 'subject', filter_values: [{ id: 10 }, { id: 5 }] }],
            },
        });
        expect(screen.queryByTestId('dlor-panel-validity-indicator-3')).not.toBeInTheDocument();

        cleanup();
        renderForm({
            mode: 'edit',
            dlorFilterList: [requiredSubjectFilter],
            formDefaults: { ...validFormDefaults, facets: [10] },
        });
        expect(screen.queryByTestId('dlor-panel-validity-indicator-3')).not.toBeInTheDocument();

        cleanup();
        renderForm({
            mode: 'edit',
            dlorFilterList: [requiredSubjectFilter],
            formDefaults: { ...validFormDefaults, facets: null },
        });
        expect(screen.getByTestId('dlor-panel-validity-indicator-3')).toBeInTheDocument();
    });

    it('serializes nested facet values when saving an edited object', async () => {
        const actions = renderForm({
            mode: 'edit',
            dlorItem: {
                object_public_uuid: 'edit-deep-facets',
                object_owning_team_id: 1,
                object_admin_notes: '',
            },
            dlorFilterList: [
                {
                    ...validFilters[0],
                    facet_type_required: true,
                },
            ],
            formDefaults: {
                ...validFormDefaults,
                facets: [{ filter_key: 'subject', filter_values: [{ id: 10 }, { id: 5 }] }],
            },
            actions: {
                ...baseProps.actions,
                updateDlor: jest.fn().mockResolvedValue({}),
            },
        });

        advanceToStep(3);
        fireEvent.click(screen.getByTestId('admin-dlor-save-button-submit'));

        await waitFor(() => {
            expect(actions.updateDlor).toHaveBeenCalledTimes(1);
        });

        expect(actions.updateDlor).toHaveBeenCalledWith(
            'edit-deep-facets',
            expect.objectContaining({ facets: [5, 10] }),
            true,
        );
    });

    it('hydrates keyword strings, toggles link interaction states, and checks boolean fields', async () => {
        const siteHeader = document.createElement('uq-site-header');
        document.body.appendChild(siteHeader);

        renderForm({
            formDefaults: {
                ...validFormDefaults,
                object_keywords_string: 'Alpha|Beta',
            },
            dlorFileTypeList: [
                {
                    object_link_file_type: 'pdf',
                    object_link_interaction_type: 'download',
                },
            ],
            dlorKeywords: [
                { keyword: 'Alpha', keyword_vocabulary_id: 101, synonyms: [] },
                { keyword: 'Beta', keyword_vocabulary_id: 102, synonyms: [] },
            ],
        });

        expect(siteHeader.getAttribute('secondleveltitle')).toBe('Digital learning hub admin');
        expect(siteHeader.getAttribute('secondLevelUrl')).toContain('admin');

        fireEvent.click(screen.getByTestId('dlor-form-next-button'));
        fireEvent.click(screen.getByTestId('object-is-featured'));
        expect(screen.getByTestId('object-is-featured').querySelector('input')).toBeChecked();

        fireEvent.click(screen.getByTestId('object-is-featured'));
        expect(screen.getByTestId('object-is-featured').querySelector('input')).not.toBeChecked();

        fireEvent.click(screen.getByTestId('dlor-form-next-button'));
        const linkInteractionSelect = screen.getByTestId('object-link-interaction-type');
        expect(linkInteractionSelect).toBeInTheDocument();

        fireEvent.mouseDown(linkInteractionSelect.querySelector('[role="combobox"]'));
        fireEvent.click(screen.getByRole('option', { name: /can View/i }));
        expect(screen.getByTestId('object-link-duration-minutes')).toBeInTheDocument();

        fireEvent.mouseDown(linkInteractionSelect.querySelector('[role="combobox"]'));
        fireEvent.click(screen.getByRole('option', { name: /can Download/i }));
        expect(screen.getByTestId('object-link-size-amount')).toBeInTheDocument();
        expect(screen.getByTestId('object-link-file-type')).toBeInTheDocument();

        const fileTypeSelect = screen.getByTestId('object-link-file-type');
        fireEvent.mouseDown(fileTypeSelect.querySelector('[role="combobox"]'));
        fireEvent.click(screen.getByRole('option', { name: 'New type' }));
        expect(screen.getByTestId('dlor-admin-form-new-file-type')).toBeInTheDocument();
        fireEvent.change(getFieldInput('dlor-admin-form-new-file-type'), {
            target: { value: 'mp4' },
        });

        fireEvent.mouseDown(screen.getByTestId('object-link-file-type').querySelector('[role="combobox"]'));
        fireEvent.click(screen.getByRole('option', { name: 'pdf' }));
        expect(screen.queryByTestId('dlor-admin-form-new-file-type')).not.toBeInTheDocument();

        fireEvent.mouseDown(linkInteractionSelect.querySelector('[role="combobox"]'));
        fireEvent.click(screen.getByRole('option', { name: /No message/i }));
        expect(screen.queryByTestId('object-link-file-type')).not.toBeInTheDocument();
        document.body.removeChild(siteHeader);
    });

    it('opens the team editor for an edited object and preserves its team contact fields', () => {
        renderForm({
            mode: 'edit',
            dlorItem: {
                object_public_uuid: 'edit-admin-note',
                object_owning_team_id: 1,
                object_title: 'Updated object',
                object_link_interaction_type: 'view',
                object_link_file_type: 'pdf',
                object_admin_notes: '',
            },
            formDefaults: {
                ...validFormDefaults,
                object_owning_team_id: 1,
                object_link_interaction_type: 'view',
                object_link_file_type: 'pdf',
                team_manager_edit: 'Manager',
                team_email_edit: 'manager@example.com',
                team_admin_username_edit: 'u123456',
            },
        });

        fireEvent.click(screen.getByTestId('object-form-teamid-change'));
        expect(screen.getByTestId('dlor-form-team-manager-edit')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('object-form-teamid-change'));
        expect(screen.queryByTestId('dlor-form-team-manager-edit')).not.toBeInTheDocument();
    });

    it('shows non-admin submission messaging and creates a new team when the owning team is changed', () => {
        useAccountContext.mockReturnValue({ account: { id: 'u123456', groups: [] } });

        renderForm({
            dlorSavedItem: { data: { object_public_uuid: 'non-admin-submission' } },
            dlorTeamList: [
                { team_id: 1, team_name: 'Team One', team_members: [] },
                { team_id: 2, team_name: 'Team Two', team_members: [] },
            ],
            formDefaults: {
                ...validFormDefaults,
                object_publishing_user: 'u123456',
                object_owning_team_id: 1,
                object_status: 'new',
                object_link_interaction_type: 'none',
            },
        });

        const teamSelect = screen.getByTestId('object-owning-team').querySelector('[role="combobox"]');
        fireEvent.mouseDown(teamSelect);
        fireEvent.click(screen.getByRole('option', { name: 'Create a team' }));
        expect(screen.getByTestId('dlor-form-team-name-new')).toBeInTheDocument();
        expect(screen.getByTestId('dialogbox-Your request has been submitted')).toBeInTheDocument();
    });

    it('accepts complete contact details for a newly selected team', () => {
        renderForm({
            formDefaults: {
                ...validFormDefaults,
                team_name_new: 'New team',
                team_manager_new: 'Team Manager',
                team_admin_username_new: 'u765432',
                team_email_new: 'manager@example.com',
            },
        });

        fireEvent.mouseDown(screen.getByTestId('object-owning-team').querySelector('[role="combobox"]'));
        fireEvent.click(screen.getByRole('option', { name: 'Create a team' }));

        expect(screen.queryByTestId('dlor-panel-validity-indicator-0')).not.toBeInTheDocument();
    });

    it('saves edited admin notes after the update flow', async () => {
        const actions = renderForm({
            mode: 'edit',
            dlorItem: {
                object_public_uuid: 'edit-admin-note',
                object_owning_team_id: 1,
                object_title: 'Updated object',
                object_link_interaction_type: 'view',
                object_link_file_type: 'pdf',
                object_admin_notes: '',
            },
            formDefaults: {
                ...validFormDefaults,
                object_owning_team_id: 1,
                object_link_interaction_type: 'view',
                object_link_file_type: 'pdf',
                object_link_duration_minutes: '1',
                object_link_duration_seconds: '30',
                object_admin_notes: '<p>Updated admin note</p>',
                team_manager_edit: 'Manager',
                team_email_edit: 'manager@example.com',
                team_admin_username_edit: 'u123456',
            },
            dlorAdminNotes: [
                {
                    object_admin_username: 'previous-admin',
                    object_admin_note_content: '<p>Existing admin note</p>',
                    created_at: '01/01/2026 10:00',
                },
            ],
            actions: {
                ...baseProps.actions,
                updateDlor: jest.fn().mockResolvedValue({}),
                saveDlorAdminNote: jest.fn(),
            },
        });

        fireEvent.change(screen.getByTestId('object-admin-notes'), {
            target: { value: '<p>Revised admin note</p>' },
        });
        fireEvent.click(screen.getByText('Existing Admin Notes'));
        expect(screen.getByTestId('admin-note-username-0')).toHaveTextContent('previous-admin');
        expect(screen.getByTestId('admin-note-content-0')).toHaveTextContent('Existing admin note');

        advanceToStep(3);
        fireEvent.click(screen.getByTestId('admin-dlor-save-button-submit'));

        await waitFor(() => {
            expect(actions.updateDlor).toHaveBeenCalledTimes(1);
        });
        expect(actions.saveDlorAdminNote).toHaveBeenCalledWith('edit-admin-note', '<p>Revised admin note</p>');
    });

    it('fires the DLO admin cancel action when the cancel button is used', () => {
        renderForm();

        fireEvent.click(screen.getByTestId('admin-dlor-form-button-cancel'));

        expect(screen.getByTestId('admin-dlor-form-button-cancel')).toBeInTheDocument();
    });

    it('renders radio and unknown facet types and updates selections', () => {
        renderForm({
            dlorFilterList: [
                {
                    facet_type_slug: 'subject',
                    facet_type_name: 'Subject',
                    facet_type_required: false,
                    facet_type_number: 'one-or-more',
                    facet_list: [{ facet_id: 10, facet_name: 'Math' }],
                },
                {
                    facet_type_slug: 'format',
                    facet_type_name: 'Format',
                    facet_type_required: false,
                    facet_type_number: 'exactly-one',
                    facet_list: [
                        { facet_id: 11, facet_name: 'Guide' },
                        { facet_id: 12, facet_name: 'Workshop' },
                    ],
                },
                {
                    facet_type_slug: 'custom_type',
                    facet_type_name: 'Custom type',
                    facet_type_required: false,
                    facet_type_number: 'unknown-type',
                    facet_list: [{ facet_id: 99, facet_name: 'Custom thing' }],
                },
            ],
            formDefaults: {
                ...validFormDefaults,
                facets: [11],
            },
        });

        advanceToStep(3);
        expect(screen.getByText('unknown facet type')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('filter-subject-math').querySelector('input'));
        fireEvent.click(screen.getByRole('radio', { name: 'Workshop' }));
        expect(screen.getByRole('radio', { name: 'Workshop' })).toBeChecked();
    });

    it('changes summary and download instructions through their editors', () => {
        renderForm();

        advanceToStep(1);
        fireEvent.change(getFieldInput('object-summary'), {
            target: { value: 'A manually updated summary' },
        });
        expect(getFieldInput('object-summary')).toHaveValue('A manually updated summary');

        fireEvent.click(screen.getByTestId('dlor-form-next-button'));
        fireEvent.change(screen.getByTestId('download_instructions'), {
            target: { value: '<p>Revised instructions</p>' },
        });
        expect(screen.getByTestId('download_instructions')).toHaveValue('<p>Revised instructions</p>');
    });

    it.each(['add', 'edit'])('accepts a review date change in %s mode', mode => {
        renderForm({
            mode,
            dlorItem: {
                object_public_uuid: 'review-date-object',
                object_owning_team_id: 1,
            },
        });

        const reviewDate = getFieldInput('object-review-date');
        fireEvent.change(reviewDate, { target: { value: '15/10/2026' } });
        fireEvent.blur(reviewDate);

        expect(reviewDate).toHaveValue('15/10/2026');
    });

    it('allows the object owner to edit without admin privileges', () => {
        useAccountContext.mockReturnValue({ account: { id: 'object-owner', groups: [] } });

        renderForm({
            formDefaults: {
                ...validFormDefaults,
                object_publishing_user: 'object-owner',
            },
        });

        expect(screen.queryByTestId('dlor-form-no-access')).not.toBeInTheDocument();
    });

    it('allows an owning-team admin to edit without admin privileges', () => {
        useAccountContext.mockReturnValue({ account: { id: 'team-admin', groups: [] } });

        renderForm({
            dlorTeamList: [
                {
                    team_id: 1,
                    team_name: 'Team One',
                    team_members: [{ team_admin_username: 'team-admin' }],
                },
            ],
            formDefaults: {
                ...validFormDefaults,
                object_publishing_user: 'another-user',
            },
        });

        expect(screen.queryByTestId('dlor-form-no-access')).not.toBeInTheDocument();
    });

    it('denies edit access when the matching team does not include the current user', () => {
        useAccountContext.mockReturnValue({ account: { id: 'different-user', groups: [] } });

        renderForm({
            dlorTeamList: [{ team_id: 1, team_name: 'Team One', team_members: [] }],
            formDefaults: {
                ...validFormDefaults,
                object_publishing_user: 'object-owner',
            },
        });

        expect(screen.getByTestId('dlor-form-no-access')).toBeInTheDocument();
    });

    it('keeps an edited file type when switching interaction types', () => {
        renderForm({
            mode: 'edit',
            dlorItem: {
                object_public_uuid: 'edit-file-type',
                object_owning_team_id: 1,
            },
            formDefaults: {
                ...validFormDefaults,
                object_link_interaction_type: 'view',
                object_link_file_type: 'pdf',
                object_link_types: [
                    {
                        object_link_file_type: 'pdf',
                        object_link_interaction_type: 'download',
                    },
                ],
            },
        });

        advanceToStep(2);
        const interactionSelect = screen.getByTestId('object-link-interaction-type');
        fireEvent.mouseDown(interactionSelect.querySelector('[role="combobox"]'));
        fireEvent.click(screen.getByRole('option', { name: /can Download/i }));

        const fileTypeSelect = screen.getByTestId('object-link-file-type');
        expect(fileTypeSelect).toBeInTheDocument();
        fireEvent.mouseDown(fileTypeSelect.querySelector('[role="combobox"]'));
        expect(screen.getByRole('option', { name: 'pdf' })).toBeInTheDocument();
    });

    it.each([
        ['invalid long address', 'not-a-valid-address', 'dlor-form-error-message-object-link-url'],
        ['previewable video address', 'https://www.youtube.com/watch?v=abc12345', 'object-link-url-preview'],
    ])('handles a %s', (_description, objectLinkUrl, expectedTestId) => {
        renderForm({
            formDefaults: {
                ...validFormDefaults,
                object_link_url: objectLinkUrl,
                object_link_interaction_type: 'view',
            },
        });

        advanceToStep(2);

        expect(screen.getByTestId(expectedTestId)).toBeInTheDocument();
    });

    it('syncs owner defaults after the form defaults change', async () => {
        const view = renderFormWithResult();
        const updatedFormDefaults = {
            ...validFormDefaults,
            object_publishing_user: 'u7654321',
            object_publishing_user_email: 'updated@example.com',
        };

        view.rerender(
            <WithRouter>
                <DlorForm {...baseProps} formDefaults={updatedFormDefaults} actions={view.actions} />
            </WithRouter>,
        );

        await waitFor(() => {
            expect(getFieldInput('object-publishing-user')).toHaveValue('u7654321');
        });
    });

    it('navigates back to the previous form step', () => {
        renderForm();

        advanceToStep(1);
        fireEvent.click(screen.getByTestId('dlor-form-back-button'));

        expect(screen.getByTestId('object-publishing-user')).toBeInTheDocument();
        expect(screen.queryByTestId('object-description')).not.toBeInTheDocument();
    });

    it('opens and closes the notification lightbox for edited objects', () => {
        renderForm({
            mode: 'edit',
            dlorItem: {
                object_public_uuid: 'edit-notify',
                object_title: 'Example object',
                object_owning_team_id: 1,
                object_link_interaction_type: 'view',
            },
            formDefaults: {
                ...validFormDefaults,
                object_status: 'current',
                object_title: 'Example object',
            },
        });

        advanceToStep(3);
        fireEvent.click(screen.getByTestId('choose-notify').querySelector('input'));
        expect(screen.getByTestId('notify-reedit-button')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('notify-reedit-button'));
        expect(screen.getByTestId('notify-lightbox-modal')).toBeInTheDocument();

        fireEvent.change(screen.getByTestId('notificationText'), {
            target: { value: '<p>There has been a major update.</p>' },
        });

        fireEvent.click(screen.getByTestId('notify-lightbox-close-button'));
    });

    it('saves a new object with custom team, deep facets and admin note data', async () => {
        const actions = renderForm({
            dlorSavedItem: {
                data: {
                    object_public_uuid: 'new-object-uuid',
                },
            },
            formDefaults: {
                ...validFormDefaults,
                object_owning_team_id: 'new',
                object_link_interaction_type: 'download',
                object_link_file_type: 'new',
                new_file_type: 'mp4',
                object_link_size_amount: '2.5',
                object_link_size_units: 'MB',
                team_name_new: 'Team One',
                team_manager_new: 'Manager',
                team_email_new: 'manager@example.com',
                team_admin_username_new: 'u123456',
                object_admin_notes: '<p>Admin note for this new object.</p>',
                object_publishing_user_email: 'test@example.com',
                facets: [{ filter_key: 'subject', id: 10 }],
            },
            dlorFilterList: [
                {
                    facet_type_slug: 'subject',
                    facet_type_name: 'Subject',
                    facet_type_required: false,
                    facet_type_number: 'zero-or-more',
                    facet_list: [{ facet_id: 10, facet_name: 'Math' }],
                },
            ],
            actions: {
                ...baseProps.actions,
                createDlor: jest.fn().mockResolvedValue({ data: { object_public_uuid: 'new-object-uuid' } }),
            },
        });

        advanceToStep(3);
        fireEvent.click(screen.getByTestId('admin-dlor-save-button-submit'));

        await waitFor(() => {
            expect(actions.createDlor).toHaveBeenCalledTimes(1);
        });

        expect(actions.createDlor).toHaveBeenCalledWith(
            expect.objectContaining({
                object_link_file_type: 'mp4',
                team_name: 'Team One',
                team_manager: 'Manager',
                team_email: 'manager@example.com',
                team_admin_username: 'u123456',
            }),
            true,
        );
        expect(actions.saveDlorAdminNote).toHaveBeenCalledWith(
            'new-object-uuid',
            '<p>Admin note for this new object.</p>',
        );
    });

    it('saves an edited object in view mode, clears notification text, and covers update flow', async () => {
        const actions = renderForm({
            mode: 'edit',
            dlorItem: {
                object_public_uuid: 'edit-update',
                object_owning_team_id: 1,
                object_title: 'Updated object',
                object_link_interaction_type: 'view',
                object_link_file_type: 'pdf',
                object_admin_notes: '',
            },
            dlorTeamList: [
                { team_id: 1, team_name: 'Team One', team_members: [] },
                { team_id: 2, team_name: 'Team Two', team_members: [] },
            ],
            formDefaults: {
                ...validFormDefaults,
                object_owning_team_id: 1,
                object_link_interaction_type: 'view',
                object_link_file_type: 'pdf',
                object_link_duration_minutes: '5',
                object_link_duration_seconds: '30',
                team_manager_edit: 'Manager',
                team_email_edit: 'manager@example.com',
                team_admin_username_edit: 'u123456',
                object_admin_notes: '',
            },
            actions: {
                ...baseProps.actions,
                updateDlor: jest.fn().mockResolvedValue({}),
            },
        });

        fireEvent.mouseDown(screen.getByLabelText(/Owning Team/i));
        fireEvent.click(screen.getByRole('option', { name: 'Team Two' }));

        advanceToStep(3);
        fireEvent.click(screen.getByTestId('admin-dlor-save-button-submit'));

        await waitFor(() => {
            expect(actions.updateDlor).toHaveBeenCalledTimes(1);
        });

        expect(actions.updateDlor).toHaveBeenCalledWith(
            'edit-update',
            expect.objectContaining({
                notificationText: '',
                object_link_size: 330,
            }),
            true,
        );
    });

    it('keeps notification text when sending an update and removes link types from the payload', async () => {
        const setCookie = jest.fn();
        useCookies.mockReturnValue([{ CYPRESS_TEST_DATA: 'active' }, setCookie]);

        const actions = renderForm({
            mode: 'edit',
            dlorItem: {
                object_public_uuid: 'edit-notification',
                object_owning_team_id: 1,
                object_admin_notes: '',
            },
            formDefaults: {
                ...validFormDefaults,
                object_status: 'current',
                object_link_interaction_type: 'view',
                object_link_file_type: 'pdf',
                object_link_duration_minutes: '1',
                object_link_duration_seconds: '30',
                object_link_types: [{ object_link_file_type: 'pdf', object_link_interaction_type: 'view' }],
                notificationText: '',
                object_admin_notes: '',
            },
            actions: {
                ...baseProps.actions,
                updateDlor: jest.fn().mockResolvedValue({}),
            },
        });

        advanceToStep(3);
        fireEvent.click(screen.getByTestId('choose-notify').querySelector('input'));
        fireEvent.click(screen.getByTestId('notify-reedit-button'));
        fireEvent.change(screen.getByTestId('notificationText'), {
            target: { value: '<p>Notification to send</p>' },
        });
        fireEvent.click(screen.getByTestId('notify-lightbox-close-button'));
        fireEvent.click(screen.getByTestId('admin-dlor-save-button-submit'));

        await waitFor(() => {
            expect(actions.updateDlor).toHaveBeenCalledTimes(1);
        });

        const savedValues = actions.updateDlor.mock.calls[0][1];
        expect(savedValues.notificationText).toBe('<p>Notification to send</p>');
        expect(savedValues).not.toHaveProperty('object_link_types');
        expect(setCookie).not.toHaveBeenCalled();
    });

    it('uses the error confirmation message when saving fails', () => {
        renderForm({ dlorSavedItemError: 'Save failed' });

        expect(screen.getByTestId('dialogbox-Save failed')).toBeInTheDocument();
    });

    it('runs the confirmation dialog action callback', () => {
        const actions = renderForm({
            dlorSavedItem: {
                data: {
                    object_id: 'saved-id',
                    object_public_uuid: 'saved-uuid',
                },
            },
            mode: 'add',
            formDefaults: {
                ...validFormDefaults,
                object_owning_team_id: 1,
            },
        });

        fireEvent.click(screen.getByTestId('dialogbox-The object has been created').querySelector('button'));
        expect(actions.clearADlor).toHaveBeenCalledTimes(1);
    });

    it('runs the confirmation dialog action for an edited object', () => {
        const actions = renderForm({
            mode: 'edit',
            dlorSavedItem: {
                data: {
                    object_id: 'saved-id',
                    object_public_uuid: 'saved-uuid',
                },
            },
            dlorItem: {
                object_public_uuid: 'saved-uuid',
                object_owning_team_id: 1,
            },
        });

        fireEvent.click(screen.getByTestId('dialogbox-Changes have been saved').querySelector('button'));

        expect(actions.clearADlor).toHaveBeenCalledTimes(1);
        expect(scrollToTopOfPage).toHaveBeenCalledTimes(1);
    });

    it('runs the confirmation dialog cancel callback', () => {
        renderForm({
            dlorSavedItem: {
                data: {
                    object_id: 'saved-id',
                    object_public_uuid: 'saved-uuid',
                },
            },
            mode: 'add',
            formDefaults: {
                ...validFormDefaults,
                object_owning_team_id: 1,
            },
        });

        fireEvent.click(screen.getByTestId('dialogbox-The object has been created').querySelectorAll('button')[1]);
    });

    it('runs the confirmation dialog close callback', () => {
        renderForm({
            dlorSavedItem: {
                data: {
                    object_id: 'saved-id',
                    object_public_uuid: 'saved-uuid',
                },
            },
            mode: 'add',
            formDefaults: {
                ...validFormDefaults,
                object_owning_team_id: 1,
            },
        });

        fireEvent.click(screen.getByTestId('dialogbox-The object has been created').querySelectorAll('button')[2]);
    });
});
