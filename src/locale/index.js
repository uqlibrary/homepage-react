import { default as validationErrors } from './validationErrors';
import { default as forms } from './forms';
import { default as pages } from './pages';
import { default as global } from './global';
import { default as menu } from './menu';
import { default as templates } from './templates';

export const locale = {
    ...validationErrors,
    ...forms,
    ...pages,
    ...global,
    ...menu,
    ...templates,
};
