import React from 'react';
import { useForm as useReactHookForm } from 'react-hook-form';
import { render, screen } from 'test-utils';
import Controller, { getDecoratedField } from './Controller';

describe('getDecoratedField', () => {
    const field = { name: 'myField', value: 'a value', onChange: jest.fn(), ref: 'the ref' };

    it('moves the field ref to inputRef and nulls ref', () => {
        const decorated = getDecoratedField(field, {}, {});
        expect(decorated.inputRef).toBe('the ref');
        expect(decorated.ref).toBeNull();
    });

    it('keeps the rest of the field intact', () => {
        const decorated = getDecoratedField(field, {}, {});
        expect(decorated.name).toBe('myField');
        expect(decorated.value).toBe('a value');
        expect(decorated.onChange).toBe(field.onChange);
    });

    it('exposes the error message when the field has one', () => {
        const decorated = getDecoratedField(field, { error: { message: 'Required' } }, {});
        expect(decorated.state.error).toBe('Required');
    });

    it('leaves the error undefined when the field has none', () => {
        expect(getDecoratedField(field, {}, {}).state.error).toBeUndefined();
        expect(getDecoratedField(field, { error: undefined }, {}).state.error).toBeUndefined();
    });

    it('reads the default value for this field out of the form state', () => {
        const decorated = getDecoratedField(field, {}, { defaultValues: { myField: 'the default' } });
        expect(decorated.state.defaultValue).toBe('the default');
    });

    it('reads a nested default value by path', () => {
        const nested = { ...field, name: 'section.myField' };
        const decorated = getDecoratedField(nested, {}, { defaultValues: { section: { myField: 'nested' } } });
        expect(decorated.state.defaultValue).toBe('nested');
    });

    it('copes with no form state and with no default for the field', () => {
        expect(getDecoratedField(field, {}, undefined).state.defaultValue).toBeUndefined();
        expect(getDecoratedField(field, {}, {}).state.defaultValue).toBeUndefined();
        expect(getDecoratedField(field, {}, { defaultValues: { other: 'x' } }).state.defaultValue).toBeUndefined();
    });
});

describe('Controller', () => {
    function setup({ controllerProps = {}, formProps = {} } = {}) {
        const Harness = () => {
            const { control } = useReactHookForm({ defaultValues: { myField: 'initial' }, ...formProps });
            return (
                <Controller
                    name="myField"
                    control={control}
                    render={({ field }) => <span data-testid="rendered">{String(field.value)}</span>}
                    {...controllerProps}
                />
            );
        };
        return render(<Harness />);
    }

    it('renders via the render prop with the decorated field', () => {
        setup();
        expect(screen.getByTestId('rendered')).toHaveTextContent('initial');
    });

    it('hands the render prop the decorated field, fieldState and formState', () => {
        const renderProp = jest.fn(() => <span data-testid="rendered" />);
        setup({ controllerProps: { render: renderProp } });

        const args = renderProp.mock.calls[0][0];
        expect(args.field.ref).toBeNull();
        expect(args.field.inputRef).toEqual(expect.anything());
        expect(args.field.state).toEqual({ error: undefined, defaultValue: 'initial' });
        expect(args.fieldState).toBeDefined();
        expect(args.formState).toBeDefined();
    });

    it('falls back to an empty default value when no state is given', () => {
        setup({ formProps: { defaultValues: {} } });
        expect(screen.getByTestId('rendered')).toHaveTextContent('');
    });

    it('uses the default value supplied via the state prop', () => {
        setup({ formProps: { defaultValues: {} }, controllerProps: { state: { defaultValue: 'from state' } } });
        expect(screen.getByTestId('rendered')).toHaveTextContent('from state');
    });
});
