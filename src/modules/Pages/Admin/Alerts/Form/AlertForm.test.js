import React from 'react';
import { fireEvent, rtlRender, userEvent } from 'test-utils';

import AlertForm from './AlertForm';
import { breadcrumbs } from 'config/routes';

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
    const props = {
        alertLoading: false,
        alertResponse: null,
        alertStatus: null,
        alertError: null,
        ...testProps,
        defaults: { ...defaultValues, ...testProps.defaults },
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
        expect(getByTestId('admin-alerts-form-button-save')).toBeDisabled();
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

        const preview = document.getElementById('alert-preview');
        const link = document.createElement('a');
        link.id = 'alert-link';
        preview.attachShadow({ mode: 'open' }).appendChild(link);
        jest.advanceTimersByTime(100);

        expect(link).toHaveAttribute('href', '#');
        expect(link).toHaveAttribute(
            'title',
            'On the live website, this button will visit https://uq.edu.au when clicked',
        );
    });

    it('clears the form and returns to the alert list when cancelled', async () => {
        const clearAlerts = jest.fn();
        const clearAnAlert = jest.fn();
        const { getByTestId } = setup({ actions: { clearAlerts, clearAnAlert } });
        const standardPage = document.getElementById('StandardPage');
        standardPage.scrollIntoView = jest.fn();

        await userEvent.click(getByTestId('admin-alerts-form-button-cancel'));

        expect(clearAlerts).toHaveBeenCalledTimes(1);
        expect(clearAnAlert).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/admin/alerts');
        expect(standardPage.scrollIntoView).toHaveBeenCalledTimes(1);
    });

    it('clears the form after confirming a successful add', async () => {
        const { findByTestId, getByTestId } = setup({
            alertResponse: { id: 12 },
            alertStatus: 'saved',
            defaults: { alertTitle: 'Library notice', enteredbody: 'Important message' },
        });

        await userEvent.click(await findByTestId('confirm-alert-add-save-succeeded'));

        expect(getByTestId('admin-alerts-form-title').querySelector('input')).toHaveValue('');
        expect(getByTestId('admin-alerts-form-body').querySelector('textarea')).toHaveValue('');
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
        await userEvent.click(getByTestId('confirm-alert-clone-save-succeeded'));
        expect(getByTestId('admin-alerts-form-start-date-0').querySelector('input').value).toMatch(
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/,
        );
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
            start: '2030-05-01 09:00:00',
            end: '2030-05-01 17:00:00',
            systems: [],
        });
    });

    it('returns to the list from a successful add confirmation', async () => {
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

    it('returns to the list from a successful clone confirmation', async () => {
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

    it('returns to the list after confirming an edit save', async () => {
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
