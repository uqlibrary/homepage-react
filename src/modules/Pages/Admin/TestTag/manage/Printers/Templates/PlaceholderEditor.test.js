import React from 'react';
import Immutable from 'immutable';
import { rtlRender, WithReduxStore, userEvent, waitFor } from 'test-utils';
import PlaceholderEditor from './PlaceholderEditor';
import locale from 'modules/Pages/Admin/TestTag/testTag.locale';

jest.mock('data/actions', () => ({
    clearPrinterTemplateListError: jest.fn(() => () => Promise.resolve()),
    clearPrinterTemplatePasteData: jest.fn(() => () => Promise.resolve()),
}));

const actions = require('data/actions');

const existingRow = {
    printer_template_var_id: 1,
    printer_template_var_name: 'TEST_VAR',
    printer_template_var_label: 'Test Variable',
    printer_template_var_value: '10',
};

let onChange;
let setIsEditing;

const defaultState = {
    testTagPrinterTemplatePasteDataReducer: { field: null, value: null },
};

function setup(testProps = {}, renderer = rtlRender) {
    const { state = {}, ...props } = testProps;
    const newState = { ...defaultState, ...state };
    return renderer(
        <WithReduxStore initialState={Immutable.Map(newState)}>
            <PlaceholderEditor
                label="Test Label"
                onChange={onChange}
                value={[]}
                setIsEditing={setIsEditing}
                disableVirtualization
                InputLabelProps={{ htmlFor: 'test-input', id: 'test-label', 'data-testid': 'test-input-label' }}
                {...props}
            />
        </WithReduxStore>,
    );
}

describe('PlaceholderEditor', () => {
    beforeEach(() => {
        onChange = jest.fn();
        setIsEditing = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders with label and Add button', () => {
        const { getByText, getByRole } = setup();
        expect(getByText('Test Label')).toBeInTheDocument();
        expect(getByRole('button', { name: /Add template variable/i })).toBeInTheDocument();
    });

    it('renders error helper text when error prop is true', () => {
        const { getByText } = setup({ error: true });
        expect(getByText(locale.pages.manage.printertemplates.helperText.vars)).toBeInTheDocument();
    });

    it('does not render error helper text when error prop is omitted', () => {
        const { queryByText } = setup();
        expect(queryByText(locale.pages.manage.printertemplates.helperText.vars)).not.toBeInTheDocument();
    });

    it('renders existing rows with cell content', () => {
        const { getByText } = setup({ value: [existingRow] });
        expect(getByText('TEST_VAR')).toBeInTheDocument();
        expect(getByText('Test Variable')).toBeInTheDocument();
    });

    it('shows Edit and Delete buttons for a row in view mode', () => {
        const { getByRole } = setup({ value: [existingRow] });
        expect(getByRole('menuitem', { name: 'Edit' })).toBeInTheDocument();
        expect(getByRole('menuitem', { name: 'Delete' })).toBeInTheDocument();
    });

    it('shows Save and Cancel buttons when a row enters edit mode', async () => {
        const { getByRole } = setup({ value: [existingRow] });
        await userEvent.click(getByRole('menuitem', { name: 'Edit' }));
        await waitFor(() => {
            expect(getByRole('menuitem', { name: 'Save' })).toBeInTheDocument();
            expect(getByRole('menuitem', { name: 'Cancel' })).toBeInTheDocument();
        });
    });

    it('calls setIsEditing(true) when Edit button is clicked', async () => {
        const { getByRole } = setup({ value: [existingRow] });
        await userEvent.click(getByRole('menuitem', { name: 'Edit' }));
        expect(setIsEditing).toHaveBeenCalledWith(true);
    });

    it('adds a new row in edit mode when Add button is clicked', async () => {
        const { getByRole } = setup({ value: [] });
        await userEvent.click(getByRole('button', { name: /Add template variable/i }));
        await waitFor(() => {
            expect(getByRole('menuitem', { name: 'Save' })).toBeInTheDocument();
            expect(getByRole('menuitem', { name: 'Cancel' })).toBeInTheDocument();
        });
    });

    it('calls onChange with updated rows when Save is clicked', async () => {
        const { getByRole } = setup({ value: [existingRow] });
        await userEvent.click(getByRole('menuitem', { name: 'Edit' }));
        await waitFor(() => expect(getByRole('menuitem', { name: 'Save' })).toBeInTheDocument());
        await userEvent.click(getByRole('menuitem', { name: 'Save' }));
        await waitFor(() => {
            expect(onChange).toHaveBeenCalledWith(null, [
                { ...existingRow, printer_template_var_name: '{{TEST_VAR}}', isNew: false },
            ]);
        });
    });

    it('calls setIsEditing(false) after Save is clicked', async () => {
        const { getByRole } = setup({ value: [existingRow] });
        await userEvent.click(getByRole('menuitem', { name: 'Edit' }));
        await waitFor(() => expect(getByRole('menuitem', { name: 'Save' })).toBeInTheDocument());
        await userEvent.click(getByRole('menuitem', { name: 'Save' }));
        await waitFor(() => {
            expect(setIsEditing).toHaveBeenCalledWith(false);
        });
    });

    it('shows an error alert when saving an invalid row', async () => {
        const invalidRow = { ...existingRow, printer_template_var_name: '' };
        const { getByRole, getByTestId, getByText } = setup({ value: [invalidRow] });

        await userEvent.click(getByRole('menuitem', { name: 'Edit' }));
        await waitFor(() => expect(getByRole('menuitem', { name: 'Save' })).toBeInTheDocument());
        await userEvent.click(getByRole('menuitem', { name: 'Save' }));
        await waitFor(() => {
            expect(getByTestId('confirmation_alert-error-alert')).toBeInTheDocument();
            expect(getByText('All fields must be completed before saving.')).toBeInTheDocument();
        });
    });

    it('does not call onChange when saving an invalid row', async () => {
        const invalidRow = { ...existingRow, printer_template_var_name: '' };
        const { getByRole } = setup({ value: [invalidRow] });

        await userEvent.click(getByRole('menuitem', { name: 'Edit' }));
        await waitFor(() => expect(getByRole('menuitem', { name: 'Save' })).toBeInTheDocument());
        await userEvent.click(getByRole('menuitem', { name: 'Save' }));
        await waitFor(() => expect(setIsEditing).toHaveBeenCalledWith(true));
        expect(onChange).not.toHaveBeenCalled();
    });

    it('deletes a row and calls onChange when Delete is clicked', async () => {
        const { getByRole, queryByText } = setup({ value: [existingRow] });
        await userEvent.click(getByRole('menuitem', { name: 'Delete' }));
        await waitFor(() => {
            expect(onChange).toHaveBeenCalledWith(null, []);
            expect(queryByText('TEST_VAR')).not.toBeInTheDocument();
        });
    });

    it('calls setIsEditing(false) when Cancel is clicked on an existing row', async () => {
        const { getByRole } = setup({ value: [existingRow] });
        await userEvent.click(getByRole('menuitem', { name: 'Edit' }));
        await waitFor(() => expect(getByRole('menuitem', { name: 'Cancel' })).toBeInTheDocument());
        await userEvent.click(getByRole('menuitem', { name: 'Cancel' }));
        expect(setIsEditing).toHaveBeenCalledWith(false);
    });

    it('removes a new row when Cancel is clicked on it', async () => {
        const { getByRole, queryByRole } = setup({ value: [] });
        await userEvent.click(getByRole('button', { name: /Add template variable/i }));
        await waitFor(() => expect(getByRole('menuitem', { name: 'Cancel' })).toBeInTheDocument());
        await userEvent.click(getByRole('menuitem', { name: 'Cancel' }));
        await waitFor(() => expect(queryByRole('menuitem', { name: 'Cancel' })).not.toBeInTheDocument());
    });

    it('works without setIsEditing prop when editing and saving', async () => {
        const { getByRole } = setup({ value: [existingRow], setIsEditing: undefined });
        await userEvent.click(getByRole('menuitem', { name: 'Edit' }));
        await waitFor(() => expect(getByRole('menuitem', { name: 'Save' })).toBeInTheDocument());
        await userEvent.click(getByRole('menuitem', { name: 'Save' }));
        await waitFor(() =>
            expect(onChange).toHaveBeenCalledWith(null, [
                { ...existingRow, printer_template_var_name: '{{TEST_VAR}}', isNew: false },
            ]),
        );
    });

    it('works without setIsEditing prop when cancelling', async () => {
        const { getByRole } = setup({ value: [existingRow], setIsEditing: undefined });
        await userEvent.click(getByRole('menuitem', { name: 'Edit' }));
        await waitFor(() => expect(getByRole('menuitem', { name: 'Cancel' })).toBeInTheDocument());
        await userEvent.click(getByRole('menuitem', { name: 'Cancel' }));
        await waitFor(() => expect(getByRole('menuitem', { name: 'Edit' })).toBeInTheDocument());
    });

    describe('paste event handling', () => {
        it('does not update rows when paste field does not match printer_template_code', () => {
            setup({
                value: [],
                state: {
                    testTagPrinterTemplatePasteDataReducer: {
                        field: 'some_other_field',
                        value: '{{NEWVAR}} template',
                    },
                },
            });
            expect(onChange).not.toHaveBeenCalled();
        });

        it('does not update rows when paste contains no placeholders', () => {
            setup({
                value: [],
                state: {
                    testTagPrinterTemplatePasteDataReducer: {
                        field: 'printer_template_code',
                        value: '^XA ^XZ no placeholders here',
                    },
                },
            });
            expect(onChange).not.toHaveBeenCalled();
        });

        it('does not add rows when paste contains only existing placeholders', () => {
            const existingVarRow = { ...existingRow, printer_template_var_name: '{{BARCODE}}' };
            setup({
                value: [existingVarRow],
                state: {
                    testTagPrinterTemplatePasteDataReducer: {
                        field: 'printer_template_code',
                        value: '{{BARCODE}} only',
                    },
                },
            });
            expect(onChange).not.toHaveBeenCalled();
        });

        it('adds a new row and calls onChange when paste contains a new placeholder', async () => {
            const { getByText } = setup({
                value: [],
                state: {
                    testTagPrinterTemplatePasteDataReducer: {
                        field: 'printer_template_code',
                        value: '^XA {{BARCODE}} ^XZ',
                    },
                },
            });
            await waitFor(() => {
                expect(onChange).toHaveBeenCalledWith(
                    null,
                    expect.arrayContaining([
                        expect.objectContaining({
                            printer_template_var_name: '{{BARCODE}}',
                            printer_template_var_label: '',
                            printer_template_var_value: '',
                        }),
                    ]),
                );
            });
            expect(getByText('BARCODE')).toBeInTheDocument();
        });

        it('adds multiple new rows for multiple new placeholders in paste', async () => {
            setup({
                value: [],
                state: {
                    testTagPrinterTemplatePasteDataReducer: {
                        field: 'printer_template_code',
                        value: '{{BARCODE}} and {{ASSET}}',
                    },
                },
            });
            await waitFor(() => {
                expect(onChange).toHaveBeenCalledWith(
                    null,
                    expect.arrayContaining([
                        expect.objectContaining({ printer_template_var_name: '{{BARCODE}}' }),
                        expect.objectContaining({ printer_template_var_name: '{{ASSET}}' }),
                    ]),
                );
            });
        });

        it('adds only missing placeholders when paste contains mix of new and existing', async () => {
            const existingVarRow = { ...existingRow, printer_template_var_name: '{{BARCODE}}' };
            setup({
                value: [existingVarRow],
                state: {
                    testTagPrinterTemplatePasteDataReducer: {
                        field: 'printer_template_code',
                        value: '{{BARCODE}} {{NEWVAR}}',
                    },
                },
            });
            await waitFor(() => {
                expect(onChange).toHaveBeenCalledWith(null, [
                    existingVarRow,
                    expect.objectContaining({ printer_template_var_name: '{{NEWVAR}}' }),
                ]);
            });
            expect(onChange.mock.calls[0][1]).toHaveLength(2);
        });

        it('dispatches clearPrinterTemplatePasteData when paste with new placeholders is processed', async () => {
            setup({
                value: [],
                state: {
                    testTagPrinterTemplatePasteDataReducer: {
                        field: 'printer_template_code',
                        value: '{{BARCODE}}',
                    },
                },
            });
            await waitFor(() => {
                expect(actions.clearPrinterTemplatePasteData).toHaveBeenCalled();
            });
        });

        it('dispatches clearPrinterTemplatePasteData even when paste has no new placeholders', async () => {
            setup({
                value: [],
                state: {
                    testTagPrinterTemplatePasteDataReducer: {
                        field: 'printer_template_code',
                        value: '^XA ^XZ',
                    },
                },
            });
            await waitFor(() => {
                expect(actions.clearPrinterTemplatePasteData).toHaveBeenCalled();
            });
        });
    });
});
