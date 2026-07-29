import React from 'react';
import PropTypes from 'prop-types';
import { useForm as useReactHookForm } from 'react-hook-form';
import { render, screen, waitFor, fireEvent } from 'test-utils';
import Field, { validateHandler } from './Field';

// A minimal field component. It records what it was handed so the tests can assert on the decorated field,
// and renders the error so validation wiring is observable from the DOM.
let lastProps = null;
const Probe = props => {
    lastProps = props;
    return (
        <React.Fragment>
            <input data-testid="probe-input" value={props.value ?? ''} onChange={props.onChange} />
            <span data-testid="probe-error">{props.state?.error ?? ''}</span>
        </React.Fragment>
    );
};

Probe.propTypes = {
    value: PropTypes.any,
    onChange: PropTypes.func,
    state: PropTypes.shape({
        error: PropTypes.string,
    }),
};

function setup({ fieldProps = {}, formProps = {} } = {}) {
    const Harness = () => {
        const { control } = useReactHookForm({ mode: 'onChange', defaultValues: { myField: '' }, ...formProps });
        return <Field name="myField" control={control} component={Probe} {...fieldProps} />;
    };
    return render(<Harness />);
}

describe('validateHandler', () => {
    it('returns undefined when validators is not an array', async () => {
        expect(await validateHandler('a', {}, undefined)).toBeUndefined();
        expect(await validateHandler('a', {}, null)).toBeUndefined();
        expect(await validateHandler('a', {}, 'not an array')).toBeUndefined();
    });

    it('returns undefined when there are no validators', async () => {
        expect(await validateHandler('a', {}, [])).toBeUndefined();
    });

    it('skips entries that are not functions', async () => {
        expect(await validateHandler('a', {}, [null, undefined, 'nope', 42])).toBeUndefined();
    });

    it('skips validators that do not return a string', async () => {
        const validators = [() => undefined, () => null, () => 42, () => true];
        expect(await validateHandler('a', {}, validators)).toBeUndefined();
    });

    it('treats a whitespace-only message as valid', async () => {
        expect(await validateHandler('a', {}, [() => '   '])).toBeUndefined();
        expect(await validateHandler('a', {}, [() => ''])).toBeUndefined();
    });

    it('returns the trimmed message of a failing validator', async () => {
        expect(await validateHandler('a', {}, [() => '  Required  '])).toBe('Required');
    });

    it('returns the first failure, checking left to right', async () => {
        const first = jest.fn(() => 'first error');
        const second = jest.fn(() => 'second error');
        expect(await validateHandler('a', {}, [first, second])).toBe('first error');
        expect(second).not.toHaveBeenCalled();
    });

    it('keeps checking past validators that pass', async () => {
        expect(await validateHandler('a', {}, [() => undefined, () => 'second error'])).toBe('second error');
    });

    it('awaits async validators', async () => {
        expect(await validateHandler('a', {}, [async () => 'async error'])).toBe('async error');
        expect(await validateHandler('a', {}, [async () => undefined])).toBeUndefined();
    });

    it('passes the value and all form values to each validator', async () => {
        const validator = jest.fn(() => undefined);
        await validateHandler('the value', { other: 'field' }, [validator]);
        expect(validator).toHaveBeenCalledWith('the value', { other: 'field' });
    });
});

describe('Field', () => {
    beforeEach(() => {
        lastProps = null;
    });

    it('renders the given component with the decorated field', () => {
        setup();
        expect(screen.getByTestId('probe-input')).toBeInTheDocument();
        expect(lastProps.name).toBe('myField');
        // decorated by our Controller. React 18 consumes `ref` rather than passing it on as a prop, so the
        // nulled ref is not visible here - the field's ref is handed over as `inputRef` instead.
        expect(lastProps.ref).toBeUndefined();
        expect(lastProps.inputRef).toEqual(expect.anything());
        expect(lastProps.state).toEqual({ error: undefined, defaultValue: '' });
    });

    it('passes extra props through to the component', () => {
        setup({ fieldProps: { label: 'My label', textFieldId: 'my-field' } });
        expect(lastProps.label).toBe('My label');
        expect(lastProps.textFieldId).toBe('my-field');
    });

    it('updates the value on change', async () => {
        setup();
        fireEvent.change(screen.getByTestId('probe-input'), { target: { value: 'typed' } });
        await waitFor(() => expect(screen.getByTestId('probe-input')).toHaveValue('typed'));
    });

    it('surfaces a validation error through the decorated field state', async () => {
        setup({ fieldProps: { validate: [value => (!value ? 'Required' : undefined)] } });
        fireEvent.change(screen.getByTestId('probe-input'), { target: { value: 'x' } });
        await waitFor(() => expect(screen.getByTestId('probe-error')).toHaveTextContent(''));

        fireEvent.change(screen.getByTestId('probe-input'), { target: { value: '' } });
        await waitFor(() => expect(screen.getByTestId('probe-error')).toHaveTextContent('Required'));
    });

    it('applies normalize to a change event value', async () => {
        setup({ fieldProps: { normalize: value => String(value).toUpperCase() } });
        fireEvent.change(screen.getByTestId('probe-input'), { target: { value: 'shout' } });
        await waitFor(() => expect(screen.getByTestId('probe-input')).toHaveValue('SHOUT'));
    });

    it('applies normalize when the component reports a raw value rather than an event', async () => {
        setup({ fieldProps: { normalize: value => `normalized:${value}` } });
        lastProps.onChange('raw');
        await waitFor(() => expect(screen.getByTestId('probe-input')).toHaveValue('normalized:raw'));
    });

    it('leaves onChange alone when no normalize is given', async () => {
        setup();
        fireEvent.change(screen.getByTestId('probe-input'), { target: { value: 'as typed' } });
        await waitFor(() => expect(screen.getByTestId('probe-input')).toHaveValue('as typed'));
    });

    it('uses a supplied controller in place of the default', () => {
        const CustomController = jest.fn(({ render: renderProp }) =>
            renderProp({ field: { name: 'myField', onChange: jest.fn(), value: 'from custom' } }),
        );
        setup({ fieldProps: { controller: CustomController } });
        expect(CustomController).toHaveBeenCalled();
        expect(lastProps.value).toBe('from custom');
    });

    it('merges supplied rules with the validate handler', () => {
        const CustomController = jest.fn(({ render: renderProp }) =>
            renderProp({ field: { name: 'myField', onChange: jest.fn(), value: '' } }),
        );
        setup({ fieldProps: { controller: CustomController, rules: { required: true } } });
        const { rules } = CustomController.mock.calls[0][0];
        expect(rules.required).toBe(true);
        expect(typeof rules.validate).toBe('function');
    });

    it('validates through the rules handler it builds, with and without validators', async () => {
        const CustomController = jest.fn(({ render: renderProp }) =>
            renderProp({ field: { name: 'myField', onChange: jest.fn(), value: '' } }),
        );
        setup({ fieldProps: { controller: CustomController, validate: [() => 'Boom'] } });
        expect(await CustomController.mock.calls[0][0].rules.validate('v', {})).toBe('Boom');

        CustomController.mockClear();
        setup({ fieldProps: { controller: CustomController } });
        expect(await CustomController.mock.calls[0][0].rules.validate('v', {})).toBeUndefined();
    });
});
