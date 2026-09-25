// Authentication
export const SESSION_COOKIE_NAME = 'UQLID';
export const SESSION_USER_GROUP_COOKIE_NAME = 'UQLID_USER_GROUP';
export const TOKEN_NAME = 'X-Uql-Token';

// URLS - values are set in webpack build
export const LOCALHOST_DOMAIN = 'localhost';
export const LOCALHOST_ALIAS_DOMAIN = 'dev-homepage.library.uq.edu.au';
export const STAGING_URL = 'https://homepage-staging.library.uq.edu.au/';
export const API_URL = process.env.API_URL || 'https://api.library.uq.edu.au/staging/';
export const APP_URL = process.env.APP_URL || STAGING_URL;

export const IS_LOCAL_DEV = APP_URL.includes(LOCALHOST_DOMAIN) || APP_URL.includes(LOCALHOST_ALIAS_DOMAIN);
export const IS_JEST_TEST = !!process.env.JEST_WORKER_ID;
export const IS_PLAYWRIGHT_TEST = !!process.env.PW_IS_RUNNING;
export const IS_TEST = IS_JEST_TEST || IS_PLAYWRIGHT_TEST;

export const AUTH_URL_LOGIN = process.env.AUTH_LOGIN_URL || 'https://auth.library.uq.edu.au/login';
export const AUTH_URL_LOGOUT = process.env.AUTH_LOGOUT_URL || 'https://auth.library.uq.edu.au/logout';

// note: we have to use the SAME session storage key as reusable
export const STORAGE_ACCOUNT_KEYNAME = 'userAccount';
