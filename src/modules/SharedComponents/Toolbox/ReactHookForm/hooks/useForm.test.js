import { renderHook, act, waitFor } from 'test-utils';
import { useForm, setServerError, setServerFieldErrors, SERVER_ERROR_NAMESPACE, SERVER_ERROR_KEY } from './useForm';

describe('setServerError', () => {
    it('records the error against the reserved root namespace', () => {
        const setError = jest.fn();
        setServerError(setError, { message: 'It broke', status: 500 });

        expect(setError).toHaveBeenCalledWith(`${SERVER_ERROR_NAMESPACE}.${SERVER_ERROR_KEY}`, {
            type: 'custom',
            message: 'It broke',
            status: 500,
            original: { message: 'It broke', status: 500 },
        });
    });

    it('keeps an already-wrapped original error rather than re-wrapping it', () => {
        const setError = jest.fn();
        const original = { detail: 'the underlying cause' };
        setServerError(setError, { message: 'It broke', status: 500, original });

        expect(setError.mock.calls[0][1].original).toBe(original);
    });
});

describe('setServerFieldErrors', () => {
    it('sets an error on each field named by the API', () => {
        const setError = jest.fn();
        setServerFieldErrors(setError, {
            phone: ['This is not a valid Australian phone number'],
            mail: ['This email address is taken'],
        });

        expect(setError).toHaveBeenCalledTimes(2);
        expect(setError).toHaveBeenCalledWith('phone', {
            type: 'server',
            message: 'This is not a valid Australian phone number',
        });
        expect(setError).toHaveBeenCalledWith('mail', {
            type: 'server',
            message: 'This email address is taken',
        });
    });

    it('joins multiple messages for the one field', () => {
        const setError = jest.fn();
        setServerFieldErrors(setError, { phone: ['Too short.', 'Must be numeric.'] });

        expect(setError).toHaveBeenCalledWith('phone', {
            type: 'server',
            message: 'Too short. Must be numeric.',
        });
    });

    it('accepts a bare string as well as a list', () => {
        const setError = jest.fn();
        setServerFieldErrors(setError, { phone: 'Just the one message' });

        expect(setError).toHaveBeenCalledWith('phone', { type: 'server', message: 'Just the one message' });
    });

    it('does nothing when there are no field errors', () => {
        const setError = jest.fn();
        setServerFieldErrors(setError, {});
        setServerFieldErrors(setError, undefined);
        setServerFieldErrors(setError, null);

        expect(setError).not.toHaveBeenCalled();
    });
});

describe('useForm', () => {
    const renderUseForm = (props = {}) => renderHook(() => useForm(props));

    it('can be called with no options at all', () => {
        const { result } = renderHook(() => useForm());

        expect(result.current.formState.hasError).toBe(false);
        expect(result.current.control._options.mode).toBe('onChange');
    });

    it('starts with no errors of either kind', () => {
        const { result } = renderUseForm();

        expect(result.current.formState.hasError).toBe(false);
        expect(result.current.formState.hasValidationError).toBe(false);
        expect(result.current.formState.hasServerError).toBe(false);
        expect(result.current.formState.serverError).toBeUndefined();
        expect(result.current.formState.validationErrors).toEqual({});
        expect(result.current.formState.isSubmitFailure).toBe(false);
    });

    it('defaults to validating on change, and lets the caller override it', () => {
        expect(renderUseForm().result.current.control._options.mode).toBe('onChange');
        expect(renderUseForm({ mode: 'onBlur' }).result.current.control._options.mode).toBe('onBlur');
    });

    it('classifies a field error as a validation error, not a server error', async () => {
        const { result } = renderUseForm();

        act(() => result.current.setError('phone', { message: 'Required' }));

        await waitFor(() => expect(result.current.formState.hasValidationError).toBe(true));
        expect(result.current.formState.validationErrors.phone.message).toBe('Required');
        expect(result.current.formState.hasError).toBe(true);
        expect(result.current.formState.hasServerError).toBe(false);
    });

    it('classifies a server error separately from validation errors', async () => {
        const { result } = renderUseForm();

        act(() => result.current.setServerError({ message: 'Service unavailable', status: 503 }));

        await waitFor(() => expect(result.current.formState.hasServerError).toBe(true));
        expect(result.current.formState.serverError.message).toBe('Service unavailable');
        expect(result.current.formState.serverError.status).toBe(503);
        // a server error must never masquerade as a field
        expect(result.current.formState.validationErrors).toEqual({});
        expect(result.current.formState.hasValidationError).toBe(false);
        expect(result.current.formState.hasError).toBe(true);
    });

    it('maps field-keyed server errors onto their fields', async () => {
        const { result } = renderUseForm({ defaultValues: { phone: '' } });

        act(() => result.current.setServerFieldErrors({ phone: ['Not a valid number'] }));

        await waitFor(() => expect(result.current.formState.hasValidationError).toBe(true));
        expect(result.current.formState.validationErrors.phone.message).toBe('Not a valid number');
    });

    it('clears the server error without touching validation errors', async () => {
        const { result } = renderUseForm();

        act(() => {
            result.current.setError('phone', { message: 'Required' });
            result.current.setServerError({ message: 'It broke' });
        });
        await waitFor(() => expect(result.current.formState.hasServerError).toBe(true));

        act(() => result.current.resetServerErrors());

        await waitFor(() => expect(result.current.formState.hasServerError).toBe(false));
        expect(result.current.formState.hasValidationError).toBe(true);
    });

    it('reports a failed submission', async () => {
        const { result } = renderUseForm();

        await act(async () => await result.current.safelyHandleSubmit(jest.fn())());

        await waitFor(() => expect(result.current.formState.isSubmitted).toBe(true));
        expect(result.current.formState.isSubmitFailure).toBe(false);
    });

    describe('safelyHandleSubmit', () => {
        it('calls the callback with the form values', async () => {
            const callback = jest.fn();
            const { result } = renderUseForm({ defaultValues: { phone: '0400000000' } });

            await act(async () => await result.current.safelyHandleSubmit(callback)());

            expect(callback).toHaveBeenCalledWith({ phone: '0400000000' });
            expect(result.current.formState.hasServerError).toBe(false);
        });

        it('turns anything the callback throws into a server error', async () => {
            const { result } = renderUseForm();
            const failing = jest.fn(() => {
                throw new Error('API exploded');
            });

            await act(async () => await result.current.safelyHandleSubmit(failing)());

            await waitFor(() => expect(result.current.formState.hasServerError).toBe(true));
            expect(result.current.formState.serverError.message).toBe('API exploded');
        });

        it('turns a rejected promise into a server error', async () => {
            const { result } = renderUseForm();
            const failing = jest.fn(() => Promise.reject(new Error('Network down')));

            await act(async () => await result.current.safelyHandleSubmit(failing)());

            await waitFor(() => expect(result.current.formState.serverError.message).toBe('Network down'));
        });

        it('prevents the default form submission when given an event', async () => {
            const callback = jest.fn();
            const { result } = renderUseForm();
            const preventDefault = jest.fn();

            await act(
                async () =>
                    await result.current.safelyHandleSubmit(callback)({
                        preventDefault,
                        persist: jest.fn(),
                        target: {},
                    }),
            );

            expect(preventDefault).toHaveBeenCalled();
            expect(callback).toHaveBeenCalled();
        });

        it('does not run the callback while the form is invalid', async () => {
            const callback = jest.fn();
            const { result } = renderUseForm({ defaultValues: { phone: '' } });

            act(() => result.current.register('phone', { required: 'Required' }));
            await act(async () => await result.current.safelyHandleSubmit(callback)());

            expect(callback).not.toHaveBeenCalled();
            await waitFor(() => expect(result.current.formState.isSubmitFailure).toBe(true));
        });
    });
});
