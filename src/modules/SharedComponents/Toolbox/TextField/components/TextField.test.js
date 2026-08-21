import React from 'react';
import { rtlRender, screen, fireEvent, waitFor } from 'test-utils';
import { useForm } from 'modules/SharedComponents/Toolbox/ReactHookForm';
import { Field } from 'modules/SharedComponents/Toolbox/ReactHookForm';
import { required, maxLengthValidator } from 'helpers/validation';
import TextField from './TextField';

// Rendered through a real Field, so these exercise the whole form layer rather than the wrapper alone.
function setup({ fieldProps = {}, formProps = {} } = {}) {
    const Harness = () => {
        const { control } = useForm({ defaultValues: { first_name: '' }, ...formProps });
        return (
            <Field
                control={control}
                name="first_name"
                component={TextField}
                textFieldId="first-name"
                label="First name"
                {...fieldProps}
            />
        );
    };
    return rtlRender(<Harness />);
}

describe('TextField', () => {
    it('renders with ids derived from textFieldId', () => {
        setup();

        expect(screen.getByTestId('first-name')).toBeInTheDocument();
        expect(screen.getByTestId('first-name-input')).toBeInTheDocument();
        expect(screen.getByTestId('first-name-label')).toHaveTextContent('First name');
    });

    it('marks the input for analytics', () => {
        setup();
        expect(screen.getByTestId('first-name-input')).toHaveAttribute('data-analyticsid', 'first-name-input');
    });

    it('falls back to the field name when no textFieldId is given', () => {
        setup({ fieldProps: { textFieldId: undefined } });
        expect(screen.getByTestId('first_name-input')).toBeInTheDocument();
    });

    it('shows the current value and reports changes back to the form', async () => {
        setup();
        const input = screen.getByTestId('first-name-input');

        fireEvent.change(input, { target: { value: 'Jane' } });

        await waitFor(() => expect(input).toHaveValue('Jane'));
    });

    it('renders an empty string rather than an uncontrolled input when the value is missing', () => {
        setup({ formProps: { defaultValues: {} } });
        expect(screen.getByTestId('first-name-input')).toHaveValue('');
    });

    it('shows a validation error in the helper text once the field is invalid', async () => {
        setup({ fieldProps: { validate: [required] } });
        const input = screen.getByTestId('first-name-input');

        fireEvent.change(input, { target: { value: 'Jane' } });
        await waitFor(() => expect(screen.queryByTestId('first-name-helper-text')).not.toBeInTheDocument());

        fireEvent.change(input, { target: { value: '' } });
        await waitFor(() =>
            expect(screen.getByTestId('first-name-helper-text')).toHaveTextContent('This field is required'),
        );
    });

    it('reports the first failing validator only', async () => {
        setup({ fieldProps: { validate: [required, maxLengthValidator(3)] } });
        const input = screen.getByTestId('first-name-input');

        fireEvent.change(input, { target: { value: 'Jane' } });
        await waitFor(() =>
            expect(screen.getByTestId('first-name-helper-text')).toHaveTextContent('Must be 3 characters or less'),
        );

        fireEvent.change(input, { target: { value: '' } });
        await waitFor(() =>
            expect(screen.getByTestId('first-name-helper-text')).toHaveTextContent('This field is required'),
        );
    });

    it('prefers an explicitly supplied error over the one the form reports', () => {
        setup({ fieldProps: { errorText: 'This is not a valid Australian phone number' } });

        expect(screen.getByTestId('first-name-helper-text')).toHaveTextContent(
            'This is not a valid Australian phone number',
        );
    });

    // Rendered-and-hidden is not the same as not rendered: MUI shifts the input down 16px to make room for a
    // label using a sibling selector, and a display:none label still matches it. A hidden label therefore
    // reserved space for itself and pushed the field out of line with anything beside it.
    it('does not render a hidden label at all, so it reserves no space', () => {
        setup({ fieldProps: { hideLabel: true } });

        expect(screen.queryByTestId('first-name-label')).not.toBeInTheDocument();
    });

    it('still names the field when its label is hidden', () => {
        setup({ fieldProps: { hideLabel: true } });

        expect(screen.getByRole('textbox', { name: 'First name' })).toBeInTheDocument();
    });

    it('can be disabled', () => {
        setup({ fieldProps: { disabled: true } });
        expect(screen.getByTestId('first-name-input')).toBeDisabled();
    });

    it('passes extra props through to the underlying input', () => {
        setup({ fieldProps: { inputProps: { maxLength: 65 }, placeholder: 'First name and other initials' } });

        const input = screen.getByTestId('first-name-input');
        expect(input).toHaveAttribute('maxLength', '65');
        expect(input).toHaveAttribute('placeholder', 'First name and other initials');
    });

    it('does not leak internal props onto the DOM input', () => {
        setup();
        const input = screen.getByTestId('first-name-input');

        expect(input).not.toHaveAttribute('state');
        expect(input).not.toHaveAttribute('inputRef');
    });

    it('stays controlled when used on its own, outside a form', () => {
        // rendered directly rather than through Field, which would always supply a value
        rtlRender(<TextField textFieldId="standalone" label="Standalone" onChange={jest.fn()} />);

        expect(screen.getByTestId('standalone-input')).toHaveValue('');
    });

    describe('accessibility', () => {
        it('is named by its visible label, without a duplicate aria-label', () => {
            setup();

            // an aria-label would silently replace the visible label as the accessible name
            expect(screen.getByLabelText('First name')).toBe(screen.getByTestId('first-name-input'));
            expect(screen.getByTestId('first-name-input')).not.toHaveAttribute('aria-label');
        });

        it('names the input directly when its label is hidden', () => {
            setup({ fieldProps: { hideLabel: true } });

            expect(screen.getByTestId('first-name-input')).toHaveAttribute('aria-label', 'First name');
        });

        it('keeps the visible label within an overridden accessible name (WCAG 2.5.3)', () => {
            setup({ fieldProps: { textFieldId: 'dob-day', label: 'Day', ariaLabel: 'Date of birth day' } });

            const input = screen.getByTestId('dob-day-input');
            expect(input).toHaveAttribute('aria-label', 'Date of birth day');
            // a speech-input user says "Day" - the accessible name must contain what they can see
            expect(input.getAttribute('aria-label').toLowerCase()).toContain('day');
        });

        it('announces its error by associating it with the input and marking it invalid', async () => {
            setup({ fieldProps: { validate: [required] } });
            const input = screen.getByTestId('first-name-input');

            fireEvent.change(input, { target: { value: 'Jane' } });
            fireEvent.change(input, { target: { value: '' } });

            await waitFor(() => expect(input).toHaveAttribute('aria-invalid', 'true'));
            expect(input).toHaveAttribute('aria-describedby', 'first-name-helper-text');
            // the description has to actually exist for the reference to resolve
            expect(screen.getByTestId('first-name-helper-text')).toHaveAttribute('id', 'first-name-helper-text');
        });

        it('is not marked invalid while it is valid', () => {
            setup();
            expect(screen.getByTestId('first-name-input')).toHaveAttribute('aria-invalid', 'false');
        });
    });
});
