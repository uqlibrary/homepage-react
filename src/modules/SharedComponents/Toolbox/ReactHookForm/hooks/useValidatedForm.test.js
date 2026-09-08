import { renderHook, waitFor } from 'test-utils';
import { useValidatedForm } from './useValidatedForm';

describe('useValidatedForm', () => {
    it('reports errors without the user having touched anything', async () => {
        const { result } = renderHook(() =>
            useValidatedForm({
                defaultValues: { phone: '' },
                resolver: values => ({
                    values,
                    errors: !values.phone ? { phone: { type: 'required', message: 'Required' } } : {},
                }),
            }),
        );

        // no interaction, no submit - validation has already run
        await waitFor(() => expect(result.current.formState.hasValidationError).toBe(true));
        expect(result.current.formState.validationErrors.phone.message).toBe('Required');
    });

    it('leaves a form that starts out valid alone', async () => {
        const resolver = jest.fn(values => ({ values, errors: {} }));
        const { result } = renderHook(() => useValidatedForm({ defaultValues: { phone: '0400000000' }, resolver }));

        await waitFor(() => expect(result.current.formState.isValid).toBe(true));
        expect(result.current.formState.hasValidationError).toBe(false);
    });

    it('returns everything useForm does', () => {
        const { result } = renderHook(() => useValidatedForm());

        expect(typeof result.current.safelyHandleSubmit).toBe('function');
        expect(typeof result.current.setServerError).toBe('function');
        expect(typeof result.current.setServerFieldErrors).toBe('function');
        expect(typeof result.current.resetServerErrors).toBe('function');
    });
});
