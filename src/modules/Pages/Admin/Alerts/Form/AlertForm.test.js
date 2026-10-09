import React from 'react';
import { fireEvent, rtlRender, userEvent } from 'test-utils';

import AlertForm from './AlertForm';
import { breadcrumbs } from 'config/routes';
import { formatDate } from 'modules/Pages/Admin/dateTimeHelper';

const mockNavigate = jest.fn();

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockNavigate,
}));

const defaultValues = {
    id: '',
    dateList: [{ startDate: '2030-05-01T09:00', endDate: '2030-05-01T17:00' }],
    startDateDefault: '2030-05-01T09:00',
    endDateDefault: '2030-05-01T17:00',
    minimumDate: '2030-05-01T09:00',
    alertTitle: '',
    enteredbody: '',
    linkRequired: false,
    priorityType: 'info',
    permanentAlert: false,
    linkTitle: '',
    linkUrl: '',
    type: 'add',
    systems: [],
};

function setup(testProps = {}) {
    const actions = {
        clearAlerts: jest.fn(),
        clearAnAlert: jest.fn(),
        createAlert: jest.fn(),
        saveAlertChange: jest.fn(),
        ...testProps.actions,
    };
    const mergedDefaults = { ...defaultValues, ...testProps.defaults };
    const props = {
        alertLoading: false,
        alertResponse: null,
        alertStatus: null,
        alertError: null,
        ...testProps,
        defaults: {
            ...mergedDefaults,
            dateList: mergedDefaults.dateList.map(dateRange => ({ ...dateRange })),
            systems: [...mergedDefaults.systems],
        },
        actions,
    };

    return rtlRender(
        <>
            <uq-site-header data-testid="alert-form-site-header" />
            <div id="StandardPage">
                <div>
                    <div id="previewWrapper" />
                </div>
                <AlertForm {...props} />
            </div>
        </>,
    );
}

describe('AlertForm', () => {
    beforeEach(() => {
        window.scrollTo = jest.fn();
    });

    afterEach(() => {
        jest.useRealTimers();
        mockNavigate.mockClear();
    });

    it('renders the fields and disables creation until required values are entered', () => {
        const { getByTestId } = setup();

        expect(getByTestId('alert-form-site-header')).toHaveAttribute(
            'secondleveltitle',
            breadcrumbs.alertsadmin.title,
        );
        expect(getByTestId('alert-form-site-header')).toHaveAttribute(
            'secondlevelurl',
            breadcrumbs.alertsadmin.pathname,
        );
        expect(getByTestId('admin-alerts-form-title').querySelector('input')).toHaveValue('');
        expect(getByTestId('admin-alerts-form-body').querySelector('textarea')).toHaveValue('');
        expect(getByTestId('admin-alerts-form-start-date-0').querySelector('input')).toHaveValue('2030-05-01T09:00');
        expect(getByTestId('admin-alerts-form-end-date-0').querySelector('input')).toHaveValue('2030-05-01T17:00');
        // No title or message provided, so Save button should be disabled
        expect(getByTestId('admin-alerts-form-button-save')).toBeDisabled();
    });

    it('shows and clears errors', () => {
        const { getByTestId } = setup();
        const titleInput = getByTestId('admin-alerts-form-title').querySelector('input');
        const bodyInput = getByTestId('admin-alerts-form-body').querySelector('textarea');
        const startDateInput = getByTestId('admin-alerts-form-start-date-0').querySelector('input');
        const endDateInput = getByTestId('admin-alerts-form-end-date-0').querySelector('input');

        fireEvent.click(getByTestId('admin-alerts-form-checkbox-linkrequired'));
        const linkUrlInput = getByTestId('admin-alerts-form-link-url').querySelector('input');

        expect(titleInput).toHaveAttribute('aria-invalid', 'true');
        expect(bodyInput).toHaveAttribute('aria-invalid', 'true');
        expect(linkUrlInput).toHaveAttribute('aria-invalid', 'true');

        fireEvent.change(titleInput, { target: { value: 'Library notice' } });
        fireEvent.change(bodyInput, { target: { value: 'Important message' } });
        expect(titleInput).toHaveAttribute('aria-invalid', 'false');
        expect(bodyInput).toHaveAttribute('aria-invalid', 'false');

        fireEvent.change(linkUrlInput, { target: { value: 'not-a-url' } });
        expect(linkUrlInput).toHaveAttribute('aria-invalid', 'true');
        fireEvent.change(linkUrlInput, { target: { value: 'https://example.org' } });
        expect(linkUrlInput).toHaveAttribute('aria-invalid', 'false');

        expect(startDateInput).toHaveAttribute('aria-invalid', 'false');
        expect(endDateInput).toHaveAttribute('aria-invalid', 'false');
        fireEvent.change(startDateInput, { target: { value: '2030-04-30T17:00' } });
        expect(startDateInput).toHaveAttribute('aria-invalid', 'true');
        fireEvent.change(endDateInput, { target: { value: '2030-04-30T17:00' } });
        expect(endDateInput).toHaveAttribute('aria-invalid', 'true');
        fireEvent.change(startDateInput, { target: { value: '2030-05-02T09:00' } });
        expect(startDateInput).toHaveAttribute('aria-invalid', 'false');
        expect(endDateInput).toHaveAttribute('aria-invalid', 'true');
        fireEvent.change(endDateInput, { target: { value: '2030-05-02T17:00' } });
        expect(endDateInput).toHaveAttribute('aria-invalid', 'false');
    });

    it('creates an alert with the entered content and date range', async () => {
        const createAlert = jest.fn();
        const { getByTestId } = setup({ actions: { createAlert } });

        fireEvent.change(getByTestId('admin-alerts-form-title').querySelector('input'), {
            target: { value: 'Library notice' },
        });
        fireEvent.change(getByTestId('admin-alerts-form-body').querySelector('textarea'), {
            target: { value: 'Important message' },
        });

        expect(getByTestId('admin-alerts-form-button-save')).toBeEnabled();
        await userEvent.click(getByTestId('admin-alerts-form-button-save'));

        expect(createAlert).toHaveBeenCalledWith([
            {
                id: null,
                title: 'Library notice',
                body: 'Important message',
                priority_type: 'info',
                start: '2030-05-01 09:00:00',
                end: '2030-05-01 17:00:00',
                systems: [],
            },
        ]);
    });

    it('creates one alert for each date range in the date set', async () => {
        const createAlert = jest.fn();
        const { getByRole, getByTestId } = setup({ actions: { createAlert } });

        // add a new date range to the existing dates added in the setup() function
        await userEvent.click(getByRole('button', { name: 'Add a date set' }));

        expect(getByTestId('admin-alerts-form-row-1')).toBeInTheDocument();
        // get default populated date values
        const secondStart = getByTestId('admin-alerts-form-start-date-1').querySelector('input').value;
        const secondEnd = getByTestId('admin-alerts-form-end-date-1').querySelector('input').value;

        fireEvent.change(getByTestId('admin-alerts-form-title').querySelector('input'), {
            target: { value: 'Library notice' },
        });
        fireEvent.change(getByTestId('admin-alerts-form-body').querySelector('textarea'), {
            target: { value: 'Important message' },
        });

        await userEvent.click(getByTestId('admin-alerts-form-button-save'));

        expect(createAlert).toHaveBeenCalledWith([
            {
                id: null,
                title: 'Library notice',
                body: 'Important message',
                priority_type: 'info',
                start: '2030-05-01 09:00:00',
                end: '2030-05-01 17:00:00',
                systems: [],
            },
            {
                id: null,
                title: 'Library notice',
                body: 'Important message',
                priority_type: 'info',
                start: formatDate(secondStart),
                end: formatDate(secondEnd),
                systems: [],
            },
        ]);
    });

    it('creates alerts with every form value and all added date ranges', async () => {
        const createAlert = jest.fn();
        const { getByRole, getByTestId } = setup({ actions: { createAlert } });
        const dateRanges = [
            { startDate: '2030-05-04T09:30', endDate: '2030-05-04T17:30' },
            { startDate: '2030-05-05T10:00', endDate: '2030-05-05T18:00' },
            { startDate: '2030-05-06T11:15', endDate: '2030-05-06T19:15' },
        ];

        await userEvent.click(getByRole('button', { name: 'Add a date set' }));
        await userEvent.click(getByRole('button', { name: 'Add a date set' }));

        fireEvent.change(getByTestId('admin-alerts-form-title').querySelector('input'), {
            target: { value: 'Updated library notice' },
        });
        fireEvent.change(getByTestId('admin-alerts-form-body').querySelector('textarea'), {
            target: { value: 'Scheduled maintenance' },
        });
        await userEvent.click(getByTestId('admin-alerts-form-checkbox-linkrequired'));
        fireEvent.change(getByTestId('admin-alerts-form-link-title').querySelector('input'), {
            target: { value: 'Service information' },
        });
        fireEvent.change(getByTestId('admin-alerts-form-link-url').querySelector('input'), {
            target: { value: 'https://example.org/service' },
        });
        await userEvent.click(getByTestId('admin-alerts-form-checkbox-permanent'));

        for (const system of ['homepage', 'primo', 'espace']) {
            await userEvent.click(getByTestId(`admin-alerts-form-checkbox-system-${system}`));
        }

        fireEvent.mouseDown(getByRole('combobox'));
        await userEvent.click(getByTestId('admin-alerts-form-option-urgent'));

        dateRanges.forEach(({ startDate, endDate }, index) => {
            fireEvent.change(getByTestId(`admin-alerts-form-start-date-${index}`).querySelector('input'), {
                target: { value: startDate },
            });
            fireEvent.change(getByTestId(`admin-alerts-form-end-date-${index}`).querySelector('input'), {
                target: { value: endDate },
            });
            expect(getByTestId(`admin-alerts-form-start-date-${index}`).querySelector('input')).toHaveValue(startDate);
            expect(getByTestId(`admin-alerts-form-end-date-${index}`).querySelector('input')).toHaveValue(endDate);
        });

        expect(getByTestId('admin-alerts-form-checkbox-linkrequired').querySelector('input')).toBeChecked();
        expect(getByTestId('admin-alerts-form-checkbox-permanent').querySelector('input')).toBeChecked();
        expect(getByTestId('admin-alerts-form-button-save')).toBeEnabled();

        await userEvent.click(getByTestId('admin-alerts-form-button-save'));

        expect(createAlert).toHaveBeenCalledWith(
            dateRanges.map(({ startDate, endDate }) => ({
                id: null,
                title: 'Updated library notice',
                body: 'Scheduled maintenance[permanent][Service information](https://example.org/service)',
                priority_type: 'urgent',
                start: formatDate(startDate),
                end: formatDate(endDate),
                systems: ['homepage', 'primo', 'espace'],
            })),
        );
    });

    it('shows link fields when link-required is checked and validates the URL', () => {
        const { getByTestId } = setup({
            defaults: { alertTitle: 'Library notice', enteredbody: 'Important message' },
        });

        fireEvent.click(getByTestId('admin-alerts-form-checkbox-linkrequired'));

        expect(getByTestId('admin-alerts-form-link-title')).toBeVisible();
        expect(getByTestId('admin-alerts-form-link-url')).toBeVisible();
        expect(getByTestId('admin-alerts-form-button-save')).toBeDisabled();

        fireEvent.change(getByTestId('admin-alerts-form-link-title').querySelector('input'), {
            target: { value: 'More information' },
        });
        fireEvent.change(getByTestId('admin-alerts-form-link-url').querySelector('input'), {
            target: { value: 'https://uq.edu.au' },
        });

        expect(getByTestId('admin-alerts-form-button-save')).toBeEnabled();
    });

    it('adds and removes a selected system', () => {
        const { getByTestId } = setup();
        const homepageCheckbox = getByTestId('admin-alerts-form-checkbox-system-homepage').querySelector('input');

        fireEvent.click(homepageCheckbox);
        expect(homepageCheckbox).toBeChecked();

        fireEvent.click(homepageCheckbox);
        expect(homepageCheckbox).not.toBeChecked();
    });

    it('adds and removes a date row', async () => {
        const { getByRole, getByTestId, getAllByRole, queryByTestId } = setup();

        await userEvent.click(getByRole('button', { name: 'Add a date set' }));

        expect(getByTestId('admin-alerts-form-row-1')).toBeInTheDocument();
        expect(getAllByRole('button', { name: 'Remove this date set' })).toHaveLength(2);

        await userEvent.click(getAllByRole('button', { name: 'Remove this date set' })[0]);

        expect(queryByTestId('admin-alerts-form-row-1')).not.toBeInTheDocument();
        expect(getByTestId('admin-alerts-form-row-0')).toBeInTheDocument();
    });

    it('shows and hides the alert preview', async () => {
        const { getByTestId } = setup({
            defaults: { alertTitle: 'Library notice', enteredbody: 'Important message' },
        });
        const previewContainer = document.getElementById('previewWrapper').parentElement;

        await userEvent.click(getByTestId('admin-alerts-form-button-preview'));

        expect(document.getElementById('alert-preview')).toHaveAttribute('alerttitle', 'Library notice');
        expect(previewContainer).toHaveStyle({ visibility: 'visible', opacity: '1' });

        await userEvent.click(getByTestId('admin-alerts-form-button-preview'));

        expect(document.getElementById('alert-preview')).toBeNull();
        expect(previewContainer).toHaveStyle({ visibility: 'hidden', opacity: '0' });
    });

    it('renders a permanent preview without the permanence marker', () => {
        jest.useFakeTimers();
        const { getByTestId } = setup({
            defaults: { alertTitle: 'Library notice', enteredbody: 'Important message', permanentAlert: true },
        });

        fireEvent.click(getByTestId('admin-alerts-form-button-preview'));
        expect(document.getElementById('alert-preview')).toHaveAttribute('alertmessage', 'Important message');
    });

    it('sets up a preview link when an alert link is required', () => {
        jest.useFakeTimers();
        const { getByTestId } = setup({
            defaults: {
                alertTitle: 'Library notice',
                enteredbody: 'Important message',
                linkRequired: true,
                linkTitle: 'More information',
                linkUrl: 'https://uq.edu.au',
            },
        });

        fireEvent.change(getByTestId('admin-alerts-form-body').querySelector('textarea'), {
            target: { value: 'Updated important message' },
        });
        fireEvent.click(getByTestId('admin-alerts-form-button-preview'));

        // uq-alert doesnt initialise in this test so we have to manually
        // attach a shadow DOM to it, to test the link within the alert preview
        const alertPreview = document.getElementById('alert-preview');
        const link = document.createElement('a');
        link.id = 'alert-link';
        alertPreview.attachShadow({ mode: 'open' }).appendChild(link);
        jest.advanceTimersByTime(100);

        // now we can test the link
        expect(link).toHaveAttribute('href', '#');
        expect(link).toHaveAttribute(
            'title',
            'On the live website, this button will visit https://uq.edu.au when clicked',
        );
    });

    it('clears the form when cancelled', async () => {
        const clearAlerts = jest.fn();
        const clearAnAlert = jest.fn();
        const { getByTestId } = setup({
            actions: { clearAlerts, clearAnAlert },
            defaults: {
                alertTitle: 'Library notice',
                enteredbody: 'Important message',
                dateList: [{ startDate: '2030-05-02T10:00', endDate: '2030-05-02T18:00' }],
                linkRequired: true,
                linkTitle: 'More information',
                linkUrl: 'https://uq.edu.au',
                permanentAlert: true,
                systems: ['homepage'],
            },
        });
        const standardPage = document.getElementById('StandardPage');
        standardPage.scrollIntoView = jest.fn();
        const titleInput = getByTestId('admin-alerts-form-title').querySelector('input');
        const bodyInput = getByTestId('admin-alerts-form-body').querySelector('textarea');
        const startDateInput = getByTestId('admin-alerts-form-start-date-0').querySelector('input');
        const endDateInput = getByTestId('admin-alerts-form-end-date-0').querySelector('input');
        const linkRequiredCheckbox = getByTestId('admin-alerts-form-checkbox-linkrequired').querySelector('input');
        const linkTitleInput = getByTestId('admin-alerts-form-link-title').querySelector('input');
        const linkUrlInput = getByTestId('admin-alerts-form-link-url').querySelector('input');
        const permanentCheckbox = getByTestId('admin-alerts-form-checkbox-permanent').querySelector('input');
        const homepageCheckbox = getByTestId('admin-alerts-form-checkbox-system-homepage').querySelector('input');

        expect(titleInput).toHaveValue('Library notice');
        expect(bodyInput).toHaveValue('Important message');
        expect(startDateInput).toHaveValue('2030-05-02T10:00');
        expect(endDateInput).toHaveValue('2030-05-02T18:00');
        expect(linkRequiredCheckbox).toBeChecked();
        expect(linkTitleInput).toHaveValue('More information');
        expect(linkUrlInput).toHaveValue('https://uq.edu.au');
        expect(permanentCheckbox).toBeChecked();
        expect(homepageCheckbox).toBeChecked();

        await userEvent.click(getByTestId('admin-alerts-form-button-cancel'));

        expect(titleInput).toHaveValue('');
        expect(bodyInput).toHaveValue('');
        expect(startDateInput).toHaveValue('2030-05-01T09:00');
        expect(endDateInput).toHaveValue('2030-05-01T17:00');
        expect(linkRequiredCheckbox).not.toBeChecked();
        expect(linkTitleInput).toHaveValue('');
        expect(linkUrlInput).toHaveValue('');
        expect(permanentCheckbox).not.toBeChecked();
        expect(homepageCheckbox).not.toBeChecked();
        expect(clearAlerts).toHaveBeenCalledTimes(1);
        expect(clearAnAlert).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/admin/alerts');
        expect(standardPage.scrollIntoView).toHaveBeenCalledTimes(1);
    });

    it('clears the form after confirming a successful add', async () => {
        const { findByTestId, getByTestId } = setup({
            alertResponse: { id: 12 },
            alertStatus: 'saved',
            defaults: {
                alertTitle: 'Library notice',
                enteredbody: 'Important message',
                dateList: [{ startDate: '2030-05-02T10:00', endDate: '2030-05-02T18:00' }],
                linkRequired: true,
                linkTitle: 'More information',
                linkUrl: 'https://uq.edu.au',
                permanentAlert: true,
                systems: ['homepage'],
            },
        });
        const standardPage = document.getElementById('StandardPage');
        standardPage.scrollIntoView = jest.fn();
        const titleInput = getByTestId('admin-alerts-form-title').querySelector('input');
        const bodyInput = getByTestId('admin-alerts-form-body').querySelector('textarea');
        const startDateInput = getByTestId('admin-alerts-form-start-date-0').querySelector('input');
        const endDateInput = getByTestId('admin-alerts-form-end-date-0').querySelector('input');
        const linkRequiredCheckbox = getByTestId('admin-alerts-form-checkbox-linkrequired').querySelector('input');
        const permanentCheckbox = getByTestId('admin-alerts-form-checkbox-permanent').querySelector('input');
        const homepageCheckbox = getByTestId('admin-alerts-form-checkbox-system-homepage').querySelector('input');

        expect(titleInput).toHaveValue('Library notice');
        expect(bodyInput).toHaveValue('Important message');
        expect(startDateInput).toHaveValue('2030-05-02T10:00');
        expect(endDateInput).toHaveValue('2030-05-02T18:00');
        expect(linkRequiredCheckbox).toBeChecked();
        expect(permanentCheckbox).toBeChecked();
        expect(homepageCheckbox).toBeChecked();

        await userEvent.click(await findByTestId('confirm-alert-add-save-succeeded'));

        expect(titleInput).toHaveValue('');
        expect(bodyInput).toHaveValue('');
        expect(startDateInput).toHaveValue('2030-05-01T09:00');
        expect(endDateInput).toHaveValue('2030-05-01T17:00');
        expect(linkRequiredCheckbox).not.toBeChecked();
        expect(permanentCheckbox).not.toBeChecked();
        expect(homepageCheckbox).not.toBeChecked();
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('shows plural confirmation details after multiple alerts are cloned', async () => {
        const { findByTestId, getByTestId } = setup({
            alertResponse: [{ id: 12 }, { id: 13 }],
            alertStatus: 'saved',
            defaults: {
                type: 'clone',
                alertTitle: 'Library notice',
                enteredbody: 'Important message',
                body: 'Important message',
                startDate: '2030-05-01T09:00',
                endDate: '2030-05-01T17:00',
            },
        });

        await findByTestId('confirm-alert-clone-save-succeeded');

        expect(getByTestId('message-title')).toHaveTextContent('2 alerts have been cloned');
    });

    it('updates an existing alert', async () => {
        const saveAlertChange = jest.fn();
        const { getByTestId } = setup({
            actions: { saveAlertChange },
            defaults: {
                id: 42,
                type: 'edit',
                alertTitle: 'Library notice',
                enteredbody: 'Important message',
                dateList: [{ startDate: '2030-05-03T11:00', endDate: '2030-05-03T19:00' }],
                updatedBy: 'Alex Example',
            },
        });
        expect(getByTestId('admin-alerts-form-updated-by')).toHaveTextContent('Last Updated by: Alex Example');

        fireEvent.change(getByTestId('admin-alerts-form-title').querySelector('input'), {
            target: { value: 'Updated notice' },
        });
        fireEvent.change(getByTestId('admin-alerts-form-body').querySelector('textarea'), {
            target: { value: 'Updated message' },
        });

        await userEvent.click(getByTestId('admin-alerts-form-button-save'));

        expect(saveAlertChange).toHaveBeenCalledWith({
            id: 42,
            title: 'Updated notice',
            body: 'Updated message',
            priority_type: 'info',
            start: '2030-05-03 11:00:00',
            end: '2030-05-03 19:00:00',
            systems: [],
        });
    });

    it('saves every edited form value through the UI', async () => {
        const saveAlertChange = jest.fn();
        const { getByRole, getByTestId } = setup({
            actions: { saveAlertChange },
            defaults: {
                id: 42,
                type: 'edit',
                alertTitle: 'Existing notice',
                enteredbody: 'Existing message',
                dateList: [{ startDate: '2030-05-03T11:00', endDate: '2030-05-03T19:00' }],
                startDateDefault: '2030-05-03T11:00',
                endDateDefault: '2030-05-03T19:00',
                minimumDate: '2030-05-03T11:00',
            },
        });
        const startDate = '2030-05-04T09:30';
        const endDate = '2030-05-05T17:30';

        fireEvent.change(getByTestId('admin-alerts-form-title').querySelector('input'), {
            target: { value: 'Edited library notice' },
        });
        fireEvent.change(getByTestId('admin-alerts-form-body').querySelector('textarea'), {
            target: { value: 'Updated service information' },
        });
        await userEvent.click(getByTestId('admin-alerts-form-checkbox-linkrequired'));
        fireEvent.change(getByTestId('admin-alerts-form-link-title').querySelector('input'), {
            target: { value: 'Read the update' },
        });
        fireEvent.change(getByTestId('admin-alerts-form-link-url').querySelector('input'), {
            target: { value: 'https://example.org/updated' },
        });
        await userEvent.click(getByTestId('admin-alerts-form-checkbox-permanent'));

        for (const system of ['homepage', 'primo', 'espace']) {
            await userEvent.click(getByTestId(`admin-alerts-form-checkbox-system-${system}`));
        }

        fireEvent.mouseDown(getByRole('combobox'));
        await userEvent.click(getByTestId('admin-alerts-form-option-extreme'));
        fireEvent.change(getByTestId('admin-alerts-form-start-date-0').querySelector('input'), {
            target: { value: startDate },
        });
        fireEvent.change(getByTestId('admin-alerts-form-end-date-0').querySelector('input'), {
            target: { value: endDate },
        });

        expect(getByTestId('admin-alerts-form-button-save')).toBeEnabled();
        await userEvent.click(getByTestId('admin-alerts-form-button-save'));

        expect(saveAlertChange).toHaveBeenCalledWith({
            id: 42,
            title: 'Edited library notice',
            body: 'Updated service information[permanent][Read the update](https://example.org/updated)',
            priority_type: 'extreme',
            start: formatDate(startDate),
            end: formatDate(endDate),
            systems: ['homepage', 'primo', 'espace'],
        });
    });

    it('shows a closeable "added" confirmation', async () => {
        const clearAlerts = jest.fn();
        const clearAnAlert = jest.fn();
        const { findByTestId } = setup({
            actions: { clearAlerts, clearAnAlert },
            alertResponse: { id: 12 },
            alertStatus: 'saved',
        });

        await userEvent.click(await findByTestId('cancel-alert-add-save-succeeded'));

        expect(clearAlerts).toHaveBeenCalledTimes(1);
        expect(clearAnAlert).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/admin/alerts');
    });

    it('shows a closeable "cloned" confirmation', async () => {
        const clearAlerts = jest.fn();
        const clearAnAlert = jest.fn();
        const { findByTestId } = setup({
            actions: { clearAlerts, clearAnAlert },
            alertResponse: { id: 12 },
            alertStatus: 'saved',
            defaults: { type: 'clone' },
        });

        await userEvent.click(await findByTestId('cancel-alert-clone-save-succeeded'));

        expect(clearAlerts).toHaveBeenCalledTimes(1);
        expect(clearAnAlert).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/admin/alerts');
    });

    it('shows a closeable "saved" confirmation', async () => {
        const clearAlerts = jest.fn();
        const clearAnAlert = jest.fn();
        const { findByTestId } = setup({
            actions: { clearAlerts, clearAnAlert },
            alertResponse: { id: 42 },
            alertStatus: 'saved',
            defaults: { id: 42, type: 'edit' },
        });

        await userEvent.click(await findByTestId('confirm-alert-edit-save-succeeded'));

        expect(clearAlerts).toHaveBeenCalledTimes(1);
        expect(clearAnAlert).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/admin/alerts');
    });
});
