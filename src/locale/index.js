import { default as pages } from './pages';
import { default as global } from './global';
import { default as validationErrors } from './validationErrors';

export const locale = {
    ...pages,
    ...global,
    ...validationErrors,
};
