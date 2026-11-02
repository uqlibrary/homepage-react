import { useLayoutEffect } from 'react';
import { useForm } from './useForm';

/**
 * useForm, but validation runs before first paint rather than waiting for user interaction.
 *
 * Needed wherever the initial render depends on validity — a submit button that starts disabled until the
 * form is complete, for instance, cannot wait for the user to touch a field first.
 */
export const useValidatedForm = (props = {}) => {
    const form = useForm(props);
    const {
        trigger,
        formState: { isValid, hasValidationError },
    } = form;

    useLayoutEffect(() => {
        if (isValid && !hasValidationError) {
            return;
        }
        (async () => await trigger())();
    }, [isValid, hasValidationError, trigger]);

    return form;
};
