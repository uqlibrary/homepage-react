import React from 'react';
import { rtlRender, WithRouter, userEvent, waitFor, WithReduxStore } from 'test-utils';
import Immutable from 'immutable';

import locale from '../../../testTag.locale';
import userData from '../../../../../../../data/mock/data/testing/testAndTag/testTagUser';

import PrinterTemplates from './PrinterTemplates';
import printerTemplateData from '../../../../../../../data/mock/data/records/testAndTag/test_tag_printer_templates_uql';
import { transformRow } from './utils';

jest.mock('./PlaceholderEditor', () => {
    const React = require('react');
    // eslint-disable-next-line react/prop-types
    return function MockPlaceholderEditor({ onChange, value, label, setIsEditing }) {
        return (
            <div data-testid="mock-placeholder-editor">
                <span>{label}</span>
                <button
                    data-testid="mock-placeholder-editor-trigger"
                    onClick={() => onChange?.({ target: { value } }, value)}
                >
                    trigger
                </button>
                <button data-testid="mock-placeholder-editor-start-editing" onClick={() => setIsEditing?.(true)}>
                    start editing
                </button>
                <button data-testid="mock-placeholder-editor-stop-editing" onClick={() => setIsEditing?.(false)}>
                    stop editing
                </button>
            </div>
        );
    };
});

const mockSetCookie = jest.fn();
const mockCookies = {};
jest.mock('react-cookie', () => ({
    useCookies: jest.fn(() => [mockCookies, mockSetCookie]),
}));

jest.mock('data/actions', () => ({
    loadPrinterTemplateList: jest.fn(() => () => Promise.resolve()),
    addPrinterTemplate: jest.fn(() => () => Promise.resolve()),
    updatePrinterTemplate: jest.fn(() => () => Promise.resolve()),
    clearPrinterTemplateListError: jest.fn(() => () => Promise.resolve()),
}));

const mockGetConnectionStatus = jest.fn();
const mockPrint = jest.fn().mockResolvedValue('ok');
const mockSetPrinter = jest.fn().mockResolvedValue({ name: 'Emulator' });

jest.mock('../../../SharedComponents/LabelPrinter', () => ({
    ...jest.requireActual('../../../SharedComponents/LabelPrinter'),
    useLabelPrinter: jest.fn(() => ({
        printerCode: 'Emulator',
        printer: {
            code: 'emulator',
            getAvailablePrinters: jest.fn().mockResolvedValue([{ name: 'Emulator' }]),
            getConnectionStatus: mockGetConnectionStatus,
            setPrinter: mockSetPrinter,
            print: mockPrint,
        },
        availablePrinters: [{ name: 'Emulator' }, { name: 'GK420t' }],
    })),
}));

const actions = require('data/actions');

const adminUser = { ...userData, privileges: { ...userData.privileges, can_admin: 1 } };
const defaultState = {
    accountReducer: {
        accountLoading: false,
        account: { tnt: adminUser },
    },
    testTagPrinterTemplateReducer: {
        printerTemplateList: printerTemplateData.data,
        printerTemplateListLoading: false,
        printerTemplateListError: null,
    },
};

function setup(testProps = {}, renderer = rtlRender) {
    const { state = {}, ...props } = testProps;
    const _state = {
        ...defaultState,
        ...state,
    };
    return renderer(
        <WithReduxStore initialState={Immutable.Map(_state)}>
            <WithRouter>
                <PrinterTemplates {...props} />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('PrinterTemplates', () => {
    beforeEach(() => {
        actions.loadPrinterTemplateList.mockReturnValue(() => Promise.resolve());
        actions.addPrinterTemplate.mockReturnValue(() => Promise.resolve());
        actions.updatePrinterTemplate.mockReturnValue(() => Promise.resolve());
        mockCookies.TNT_LABEL_PRINTER_PREFERENCE = {
            name: 'Emulator',
            shortName: 'Emulator',
            templateId: 1,
            templateName: 'Zebra',
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
        delete mockCookies.TNT_LABEL_PRINTER_PREFERENCE;
    });

    it('renders component with template list', () => {
        const { getByText, getByTestId } = setup();
        expect(getByText(locale.pages.manage.printertemplates.header.pageSubtitle('', 'Library'))).toBeInTheDocument();
        expect(getByText('UQL Standard Template')).toBeInTheDocument();
        expect(getByText('UQL Template B')).toBeInTheDocument();
        expect(getByTestId('printer-template-management-data-table-toolbar-add-button')).toBeInTheDocument();
    });

    it('shows loading indicator when list is loading', () => {
        const { getByRole } = setup({
            state: {
                testTagPrinterTemplateReducer: {
                    printerTemplateList: [],
                    printerTemplateListLoading: true,
                    printerTemplateListError: null,
                },
            },
        });
        expect(getByRole('progressbar')).toBeInTheDocument();
    });

    it('catches error on loadPrinterTemplateList', async () => {
        actions.loadPrinterTemplateList.mockReturnValue(() => Promise.reject('Load error'));

        const { getByText } = setup();
        await waitFor(() => {
            expect(
                getByText(locale.pages.manage.printertemplates.header.pageSubtitle('', 'Library')),
            ).toBeInTheDocument();
        });
        expect(actions.loadPrinterTemplateList).toHaveBeenCalled();
        expect(
            getByText(locale.config.alerts.error(locale.pages.manage.printertemplates.snackbar.loadFail)),
        ).toBeInTheDocument();
    });

    it('shows error alert from reducer error state', async () => {
        const { getByText } = setup({
            state: {
                testTagPrinterTemplateReducer: {
                    printerTemplateList: printerTemplateData.data,
                    printerTemplateListLoading: false,
                    printerTemplateListError: 'Store error',
                },
            },
        });

        await waitFor(() => {
            expect(getByText(locale.config.alerts.error('Store error'))).toBeInTheDocument();
        });
    });

    it('opens Add dialog when Add button is clicked', async () => {
        const { getByTestId, getByText } = setup();

        await waitFor(() => {
            expect(getByTestId('printer-template-management-data-table-toolbar-add-button')).toBeEnabled();
        });

        await userEvent.click(getByTestId('printer-template-management-data-table-toolbar-add-button'));

        await waitFor(() => {
            expect(getByText(locale.pages.manage.printertemplates.dialogAdd.confirmationTitle)).toBeInTheDocument();
        });
        expect(getByTestId('update_dialog-printer-template-management')).toBeInTheDocument();
    });

    it('closes Add dialog when Cancel button is clicked', async () => {
        const { getByTestId, queryByTestId } = setup();

        await waitFor(() => {
            expect(getByTestId('printer-template-management-data-table-toolbar-add-button')).toBeEnabled();
        });

        await userEvent.click(getByTestId('printer-template-management-data-table-toolbar-add-button'));
        expect(queryByTestId('printer_template_name-input')).toBeInTheDocument();

        await userEvent.click(getByTestId('update_dialog-cancel-button'));
        expect(queryByTestId('printer_template_name-input')).not.toBeInTheDocument();
    });

    it('calls addPrinterTemplate with correct data on Add submit', async () => {
        const { getByTestId } = setup();

        await waitFor(() => {
            expect(getByTestId('printer-template-management-data-table-toolbar-add-button')).toBeEnabled();
        });

        await userEvent.click(getByTestId('printer-template-management-data-table-toolbar-add-button'));

        await waitFor(() => {
            expect(getByTestId('printer_template_name-input')).toBeInTheDocument();
        });

        // Fill printer_template_name
        await userEvent.type(getByTestId('printer_template_name-input'), 'New Template');

        // Add an identifier chip via freeSolo
        await userEvent.type(getByTestId('identifiers-input'), 'NEW_PRINTER');
        await userEvent.keyboard('{Enter}');

        // Type in template code (accordion is expanded by default for 'add')
        await userEvent.type(getByTestId('printer_template_code-input'), '^XA^XZ');

        expect(getByTestId('update_dialog-action-button')).not.toHaveAttribute('disabled');

        await userEvent.click(getByTestId('update_dialog-action-button'));

        await waitFor(() => {
            expect(actions.addPrinterTemplate).toHaveBeenCalledWith(
                expect.objectContaining({
                    printer_template_name: 'New Template',
                    printer_template_code: '^XA^XZ',
                }),
            );
        });
    });

    it('shows error alert when addPrinterTemplate fails', async () => {
        actions.addPrinterTemplate.mockReturnValue(() => Promise.reject('Add error'));

        const { getByTestId, getByText } = setup();

        await waitFor(() => {
            expect(getByTestId('printer-template-management-data-table-toolbar-add-button')).toBeEnabled();
        });

        await userEvent.click(getByTestId('printer-template-management-data-table-toolbar-add-button'));

        await waitFor(() => {
            expect(getByTestId('printer_template_name-input')).toBeInTheDocument();
        });

        await userEvent.type(getByTestId('printer_template_name-input'), 'Fail Template');

        await userEvent.type(getByTestId('identifiers-input'), 'FAIL_PRINTER');
        await userEvent.keyboard('{Enter}');

        await userEvent.type(getByTestId('printer_template_code-input'), '^XA^XZ');

        expect(getByTestId('update_dialog-action-button')).not.toHaveAttribute('disabled');

        await userEvent.click(getByTestId('update_dialog-action-button'));

        expect(
            getByText(locale.config.alerts.error(locale.pages.manage.printertemplates.snackbar.addFail)),
        ).toBeInTheDocument();
    });

    it('shows printer selector dialog when print button is clicked in Add mode', async () => {
        global.fetch = jest.fn();
        const mockResponse = { ok: true };
        global.fetch.mockResolvedValue(mockResponse);
        // Override the mock to return ready: false for this test
        mockGetConnectionStatus.mockResolvedValue({ ready: true });

        const { getByTestId, queryByTestId, getByRole, getByText } = setup();

        await waitFor(() => {
            expect(getByTestId('printer-template-management-data-table-toolbar-add-button')).toBeEnabled();
        });

        await userEvent.click(getByTestId('printer-template-management-data-table-toolbar-add-button'));

        await waitFor(() => {
            expect(getByTestId('printer_template_name-input')).toBeInTheDocument();
        });

        // Fill printer_template_name
        await userEvent.type(getByTestId('printer_template_name-input'), 'New Template');

        // Add an identifier chip via freeSolo
        await userEvent.type(getByTestId('identifiers-input'), 'NEW_PRINTER');
        await userEvent.keyboard('{Enter}');

        // Type in template code (accordion is expanded by default for 'add')
        await userEvent.type(getByTestId('printer_template_code-input'), '^XA^XZ');

        expect(getByTestId('update_dialog-accessory-button')).not.toHaveAttribute('disabled');

        await userEvent.click(getByTestId('update_dialog-accessory-button'));

        await waitFor(() => {
            expect(getByTestId('dialogbox-label-printer')).toBeInTheDocument();
        });
        await userEvent.click(getByTestId('label_printer_selector-printer-template-management-input'));
        await userEvent.click(getByRole('option', { name: 'Emulator' }));

        expect(getByTestId('label_printer_selector-printer-template-management-input')).toHaveValue('Emulator');

        // coverage
        await userEvent.click(getByTestId('cancel-label-printer'));
        await waitFor(() => {
            expect(queryByTestId('dialogbox-label-printer')).not.toBeInTheDocument();
        });

        // reopen
        await userEvent.click(getByTestId('update_dialog-accessory-button'));

        await waitFor(() => {
            expect(getByTestId('dialogbox-label-printer')).toBeInTheDocument();
        });
        expect(getByTestId('label_printer_selector-printer-template-management-input')).toHaveValue('Emulator');

        await userEvent.click(getByTestId('confirm-label-printer'));

        expect(getByText('Print job sent to Emulator.')).toBeInTheDocument();
    });

    // coverage for print errors
    describe('coverage - print errors', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });
        afterAll(() => {
            mockGetConnectionStatus.mockResolvedValue({ ready: true });
        });

        it('should show alert when printer is not ready', async () => {
            global.fetch = jest.fn();
            const mockResponse = { ok: true };
            global.fetch.mockResolvedValueOnce(mockResponse);
            // Override the mock to return ready: false for this test
            mockGetConnectionStatus.mockResolvedValue({ ready: false });

            const { getByTestId, getByRole, getByText, queryByTestId } = setup();

            await waitFor(() => {
                expect(getByText('UQL Standard Template')).toBeVisible();
            });

            await userEvent.click(getByTestId('action_cell-1-edit-button'));

            await waitFor(() => {
                expect(getByTestId('printer_template_name-input')).toBeInTheDocument();
            });

            expect(getByTestId('update_dialog-accessory-button')).not.toHaveAttribute('disabled');

            await userEvent.click(getByTestId('update_dialog-accessory-button'));

            await waitFor(() => {
                expect(getByTestId('dialogbox-label-printer')).toBeInTheDocument();
            });
            await userEvent.click(getByTestId('label_printer_selector-printer-template-management-input'));
            await userEvent.click(getByRole('option', { name: 'Emulator' }));

            expect(getByTestId('label_printer_selector-printer-template-management-input')).toHaveValue('Emulator');

            await userEvent.click(getByTestId('confirm-label-printer'));

            await waitFor(() => {
                expect(queryByTestId('confirmation_alert-error-alert')).toHaveTextContent(
                    'The selected printer is not ready.',
                );
            });
        }, 20000);
        it('should show alert when printer connection fails', async () => {
            global.fetch = jest.fn();
            const mockResponse = { ok: false };
            global.fetch.mockResolvedValueOnce(mockResponse);
            mockSetPrinter.mockRejectedValueOnce({ ok: false });

            const { getByTestId, getByRole, getByText, queryByTestId } = setup();

            await waitFor(() => {
                expect(getByText('UQL Standard Template')).toBeVisible();
            });

            await userEvent.click(getByTestId('action_cell-1-edit-button'));

            await waitFor(() => {
                expect(getByTestId('printer_template_name-input')).toBeInTheDocument();
            });

            expect(getByTestId('update_dialog-accessory-button')).not.toHaveAttribute('disabled');

            await userEvent.click(getByTestId('update_dialog-accessory-button'));

            await waitFor(() => {
                expect(getByTestId('dialogbox-label-printer')).toBeInTheDocument();
            });
            await userEvent.click(getByTestId('label_printer_selector-printer-template-management-input'));
            await userEvent.click(getByRole('option', { name: 'Emulator' }));

            expect(getByTestId('label_printer_selector-printer-template-management-input')).toHaveValue('Emulator');

            await userEvent.click(getByTestId('confirm-label-printer'));

            await waitFor(() => {
                expect(queryByTestId('confirmation_alert-error-alert')).toHaveTextContent(
                    'Unable to connect to the selected printer',
                );
            });
        }, 20000);
    });
    it('opens Edit dialog when edit button is clicked', async () => {
        const { getByTestId, getByText } = setup();

        expect(getByText('UQL Standard Template')).toBeVisible();

        await userEvent.click(getByTestId('action_cell-1-edit-button'));

        expect(getByText(locale.pages.manage.printertemplates.dialogEdit.confirmationTitle)).toBeInTheDocument();

        await waitFor(() => {
            expect(getByTestId('printer_template_name-input')).toBeInTheDocument();
        });
    });

    it('calls updatePrinterTemplate with correct data on Edit submit', async () => {
        const transformedRows = transformRow(printerTemplateData.data);
        const firstRow = transformedRows[0];

        const { getByTestId, getByText } = setup();

        await waitFor(() => {
            expect(getByText('UQL Standard Template')).toBeVisible();
        });

        await userEvent.click(getByTestId('action_cell-1-edit-button'));

        await waitFor(() => {
            expect(getByTestId('printer_template_name-input')).toBeInTheDocument();
        });

        const nameInput = getByTestId('printer_template_name-input');
        await userEvent.clear(nameInput);
        await userEvent.type(nameInput, 'Updated Template Name');

        await waitFor(() => {
            expect(getByTestId('update_dialog-action-button')).not.toHaveAttribute('disabled');
        });

        await userEvent.click(getByTestId('update_dialog-action-button'));

        await waitFor(() => {
            expect(actions.updatePrinterTemplate).toHaveBeenCalledWith(
                firstRow.printer_template_id,
                expect.objectContaining({ printer_template_name: 'Updated Template Name' }),
            );
        });
    });

    it('shows printer selector dialog when print button is clicked in Edit mode', async () => {
        global.fetch = jest.fn();
        const mockResponse = { ok: true };
        global.fetch.mockResolvedValue(mockResponse);
        // Override the mock to return ready: false for this test
        mockGetConnectionStatus.mockResolvedValue({ ready: true });
        const { getByTestId, getByRole, getByText } = setup();

        await waitFor(() => {
            expect(getByText('UQL Standard Template')).toBeVisible();
        });

        await userEvent.click(getByTestId('action_cell-1-edit-button'));

        await waitFor(() => {
            expect(getByTestId('printer_template_name-input')).toBeInTheDocument();
        });

        expect(getByTestId('update_dialog-accessory-button')).not.toHaveAttribute('disabled');

        await userEvent.click(getByTestId('update_dialog-accessory-button'));

        await waitFor(() => {
            expect(getByTestId('dialogbox-label-printer')).toBeInTheDocument();
        });
        await userEvent.click(getByTestId('label_printer_selector-printer-template-management-input'));
        await userEvent.click(getByRole('option', { name: 'Emulator' }));

        expect(getByTestId('label_printer_selector-printer-template-management-input')).toHaveValue('Emulator');

        await userEvent.click(getByTestId('confirm-label-printer'));
        expect(getByText('Print job sent to Emulator.')).toBeInTheDocument();
    });

    it('shows error alert when updatePrinterTemplate fails', async () => {
        actions.updatePrinterTemplate.mockReturnValue(() => Promise.reject('Update error'));

        const { getByTestId, getByText } = setup();

        await waitFor(() => {
            expect(getByText('UQL Standard Template')).toBeVisible();
        });

        await userEvent.click(getByTestId('action_cell-1-edit-button'));

        await waitFor(() => {
            expect(getByTestId('update_dialog-action-button')).not.toHaveAttribute('disabled');
        });

        await userEvent.click(getByTestId('update_dialog-action-button'));

        await waitFor(() => {
            expect(
                getByText(locale.config.alerts.error(locale.pages.manage.printertemplates.snackbar.updateFail)),
            ).toBeInTheDocument();
        });
    });

    it('renders in mobile view with full screen dialog styles', () => {
        const createMatchMedia = width => query => ({
            matches: require('css-mediaquery').match(query, { width }),
            addListener: () => {},
            removeListener: () => {},
        });
        const originalMatchMedia = window.matchMedia;
        window.matchMedia = createMatchMedia(375);

        const { getByTestId } = setup();
        expect(getByTestId('printer-template-management-data-table-toolbar-add-button')).toBeInTheDocument();

        window.matchMedia = originalMatchMedia;
    });
});
