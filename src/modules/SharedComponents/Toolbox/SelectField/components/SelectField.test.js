import React from 'react';
import { rtlRender, screen, waitFor, userEvent } from 'test-utils';
import { Field, useForm } from 'modules/SharedComponents/Toolbox/ReactHookForm';
import { required } from 'helpers/validation';
import SelectField from './SelectField';

const titles = ['Mr', 'Mrs', 'Ms', 'Dr'].map(title => ({ value: title, label: title }));

function setup({ fieldProps = {}, formProps = {} } = {}) {
    const Harness = () => {
        const { control } = useForm({ defaultValues: { title: '' }, ...formProps });
        return (
            <Field
                control={control}
                name="title"
                component={SelectField}
                selectFieldId="title"
                label="Title"
                options={titles}
                {...fieldProps}
            />
        );
    };
    return rtlRender(<Harness />);
}

// The menu opens from the display element, not the root, so that is what a user clicks.
const openMenu = async () => await userEvent.click(screen.getByTestId('title-select'));

describe('SelectField', () => {
    it('renders with ids derived from selectFieldId', () => {
        setup();

        expect(screen.getByTestId('title-select')).toBeInTheDocument();
        expect(screen.getByTestId('title-input')).toBeInTheDocument();
        expect(screen.getByTestId('title-label')).toHaveTextContent('Title');
    });

    it('shows the placeholder in the collapsed control when nothing is selected', () => {
        setup({ fieldProps: { placeholder: 'Select a title', hideLabel: true } });

        expect(screen.getByTestId('title-select')).toHaveTextContent('Select a title');
    });

    it('marks the select for analytics', () => {
        setup();
        expect(screen.getByTestId('title-select')).toHaveAttribute('data-analyticsid', 'title-select');
    });

    it('falls back to the field name when no selectFieldId is given', () => {
        setup({ fieldProps: { selectFieldId: undefined } });
        expect(screen.getByTestId('title-select')).toBeInTheDocument();
    });

    it('offers every option once opened', async () => {
        setup();

        await openMenu();

        await waitFor(() => expect(screen.getByTestId('title-option-Mr')).toBeInTheDocument());
        titles.forEach(({ value }) => expect(screen.getByTestId(`title-option-${value}`)).toBeInTheDocument());
    });

    it('reports the chosen option back to the form', async () => {
        setup();

        await openMenu();
        await userEvent.click(await screen.findByTestId('title-option-Dr'));

        await waitFor(() => expect(screen.getByTestId('title-select')).toHaveTextContent('Dr'));
    });

    it('renders a placeholder choice when asked for one', async () => {
        setup({ fieldProps: { placeholder: 'Select' } });

        await openMenu();

        expect(await screen.findByTestId('title-option-placeholder')).toHaveTextContent('Select');
    });

    it('renders no placeholder by default', async () => {
        setup();

        await openMenu();
        await screen.findByTestId('title-option-Mr');

        expect(screen.queryByTestId('title-option-placeholder')).not.toBeInTheDocument();
    });

    it('copes with being given no options at all', () => {
        setup({ fieldProps: { options: undefined } });
        expect(screen.getByTestId('title-select')).toBeInTheDocument();
    });

    it('clears the validation error once a choice is made', async () => {
        setup({ fieldProps: { validate: [required] } });

        await openMenu();
        await userEvent.click(await screen.findByTestId('title-option-Dr'));

        await waitFor(() => expect(screen.queryByTestId('title-helper-text')).not.toBeInTheDocument());
    });

    it('prefers an explicitly supplied error over the one the form reports', () => {
        setup({ fieldProps: { errorText: 'Please choose a title' } });

        expect(screen.getByTestId('title-helper-text')).toHaveTextContent('Please choose a title');
    });

    it('marks itself required', () => {
        const { container } = setup({ fieldProps: { required: true } });
        expect(container.querySelector('.Mui-required')).toBeInTheDocument();
    });

    it('can be disabled', () => {
        const { container } = setup({ fieldProps: { disabled: true } });
        expect(container.querySelector('.Mui-disabled')).toBeInTheDocument();
    });

    it('can hide its label', () => {
        setup({ fieldProps: { hideLabel: true } });
        expect(screen.queryByTestId('title-label')).not.toBeInTheDocument();
    });

    it('renders an empty selection rather than an uncontrolled input when the value is missing', () => {
        setup({ formProps: { defaultValues: {} } });
        // MUI puts a zero-width space in the display element when nothing is selected, so the value the form
        // sees is what matters here
        expect(screen.getByTestId('title-input')).toHaveValue('');
    });

    it('stays controlled when used on its own, outside a form', () => {
        // rendered directly rather than through Field, which would always supply a value
        rtlRender(<SelectField selectFieldId="standalone" label="Standalone" options={titles} onChange={jest.fn()} />);

        expect(screen.getByTestId('standalone-input')).toHaveValue('');
    });

    describe('accessibility', () => {
        // The element a user focuses is the display div, not the native input MUI hides, so every assertion
        // here is deliberately made against the combobox.
        it('exposes the combobox as the focusable control', () => {
            setup();
            const combobox = screen.getByTestId('title-select');

            expect(combobox).toHaveAttribute('role', 'combobox');
            expect(combobox).toHaveAttribute('tabindex', '0');
        });

        it('names the combobox from its visible label', () => {
            setup();

            expect(screen.getByTestId('title-select').getAttribute('aria-labelledby')).toContain('title-label');
            expect(screen.getByTestId('title-label')).toHaveAttribute('id', 'title-label');
        });

        it('names the combobox directly when its label is hidden, leaving no dangling reference', () => {
            setup({ fieldProps: { hideLabel: true } });
            const combobox = screen.getByTestId('title-select');

            // MUI would otherwise point aria-labelledby at the combobox itself, which out-ranks aria-label
            // and would leave the field announced as its own selected value
            expect(combobox).not.toHaveAttribute('aria-labelledby');
            expect(combobox).toHaveAttribute('aria-label', 'Title');
        });

        it('keeps the visible label within an overridden accessible name (WCAG 2.5.3)', () => {
            setup({ fieldProps: { hideLabel: true, label: 'Day', ariaLabel: 'Date of birth day' } });

            const combobox = screen.getByTestId('title-select');
            expect(combobox).toHaveAttribute('aria-label', 'Date of birth day');
            expect(combobox.getAttribute('aria-label').toLowerCase()).toContain('day');
        });

        it('announces its error by associating it with the combobox and marking it invalid', () => {
            setup({ fieldProps: { errorText: 'Please choose a title' } });
            const combobox = screen.getByTestId('title-select');

            expect(combobox).toHaveAttribute('aria-invalid', 'true');
            expect(combobox).toHaveAttribute('aria-describedby', 'title-helper-text');
            // the description has to actually exist for the reference to resolve
            expect(screen.getByTestId('title-helper-text')).toHaveAttribute('id', 'title-helper-text');
        });

        it('is not marked invalid, and describes nothing, while it is valid', () => {
            setup();
            const combobox = screen.getByTestId('title-select');

            expect(combobox).toHaveAttribute('aria-invalid', 'false');
            expect(combobox).not.toHaveAttribute('aria-describedby');
        });
    });
});
