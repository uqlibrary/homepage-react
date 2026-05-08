import React from 'react';
import { rtlRender, userEvent, waitFor } from 'test-utils';
import PlaceholderEditor from './PlaceholderEditor';
import locale from 'modules/Pages/Admin/TestTag/testTag.locale';

jest.mock('data/actions', () => ({
    clearPrinterTemplateListError: jest.fn(() => () => Promise.resolve()),
}));

const existingRow = {
    printer_template_var_id: 1,
    printer_template_var_name: 'TEST_VAR',
    printer_template_var_label: 'Test Variable',
    printer_template_var_value: '10',
};

let onChange;
let setIsEditing;

function setup(testProps = {}, renderer = rtlRender) {
    return renderer(
        <PlaceholderEditor
            label="Test Label"
            onChange={onChange}
            value={[]}
            setIsEditing={setIsEditing}
            disableVirtualization
            {...testProps}
        />,
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
            expect(onChange).toHaveBeenCalledWith(null, [{ ...existingRow, isNew: false }]);
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
        await waitFor(() => expect(onChange).toHaveBeenCalledWith(null, [{ ...existingRow, isNew: false }]));
    });

    it('works without setIsEditing prop when cancelling', async () => {
        const { getByRole } = setup({ value: [existingRow], setIsEditing: undefined });
        await userEvent.click(getByRole('menuitem', { name: 'Edit' }));
        await waitFor(() => expect(getByRole('menuitem', { name: 'Cancel' })).toBeInTheDocument());
        await userEvent.click(getByRole('menuitem', { name: 'Cancel' }));
        await waitFor(() => expect(getByRole('menuitem', { name: 'Edit' })).toBeInTheDocument());
    });
});
