import { useForm as useReactHookForm } from 'react-hook-form';
import { isEmpty, omit, pick } from 'lodash';

// Server errors are stored under react-hook-form's reserved `root` field, so they can never collide with a
// real field name coming back from an API.
export const SERVER_ERROR_NAMESPACE = 'root';
export const SERVER_ERROR_KEY = 'serverError';

const SERVER_ERROR_PATH = `${SERVER_ERROR_NAMESPACE}.${SERVER_ERROR_KEY}`;

/**
 * Record a whole-of-form server error, e.g. a 500 or a network failure.
 */
export const setServerError = (setError, error) => {
    setError(SERVER_ERROR_PATH, {
        type: 'custom',
        message: error.message,
        status: error.status,
        original: error.original || error,
    });
};

/**
 * Record server errors against the individual fields they belong to.
 *
 * Our APIs reject invalid submissions with a field-keyed map, e.g.
 *   { phone: ['This is not a valid Australian phone number'] }
 * Each entry becomes an error on that field, so it renders inline rather than only in a banner.
 * Fields absent from the form are ignored by react-hook-form, so an unknown key is harmless.
 */
export const setServerFieldErrors = (setError, fieldErrors) => {
    Object.entries(fieldErrors ?? {}).forEach(([field, messages]) => {
        setError(field, {
            type: 'server',
            message: Array.isArray(messages) ? messages.join(' ') : messages,
        });
    });
};

const getServerError = errors => errors[SERVER_ERROR_NAMESPACE]?.[SERVER_ERROR_KEY];

/**
 * Wrap a submit callback so any error it throws is captured as a server error rather than escaping as an
 * unhandled rejection. Anything the callback throws is assumed to be an API failure.
 */
const safelyHandleSubmit = attributes => callback =>
    attributes.handleSubmit(async (data, event) => {
        try {
            event?.preventDefault();
            await callback(data);
        } catch (error) {
            attributes.setServerError(error);
        }
    });

/**
 * react-hook-form's useForm, extended with error categorisation and server-error handling.
 *
 * Validation errors and server errors are kept apart: `validationErrors` never contains the server error, and
 * `serverError` is never mistaken for a field. Defaults to `onChange` so a submit button bound to validity
 * updates as the user types.
 */
export const useForm = (props = {}) => {
    const attributes = useReactHookForm({ mode: 'onChange', ...props });
    const { errors } = attributes.formState;

    attributes.formState.isSubmitFailure = attributes.formState.isSubmitted && !attributes.formState.isSubmitSuccessful;
    attributes.formState.hasError = !isEmpty(errors);

    attributes.formState.validationErrors = omit(errors, [SERVER_ERROR_NAMESPACE]);
    attributes.formState.hasValidationError = !isEmpty(attributes.formState.validationErrors);

    attributes.formState.serverError = getServerError(errors);
    attributes.formState.hasServerError = !isEmpty(pick(errors[SERVER_ERROR_NAMESPACE] ?? {}, [SERVER_ERROR_KEY]));

    attributes.setServerError = error => setServerError(attributes.setError, error);
    attributes.setServerFieldErrors = fieldErrors => setServerFieldErrors(attributes.setError, fieldErrors);
    attributes.resetServerErrors = () => attributes.clearErrors(SERVER_ERROR_PATH);

    attributes.safelyHandleSubmit = safelyHandleSubmit(attributes);

    return attributes;
};
