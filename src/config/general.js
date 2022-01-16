const converter = require('number-to-words');

export const numberToWords = value => {
    const ordinal = converter.toWordsOrdinal(value);
    return ordinal.charAt(0).toUpperCase() + ordinal.slice(1);
};

// Authentication
export const SESSION_COOKIE_NAME = 'UQLID';
export const SESSION_USER_GROUP_COOKIE_NAME = 'UQLID_USER_GROUP';
export const TOKEN_NAME = 'X-Uql-Token';

// URLS - values are set in webpack build
export const STAGING_URL = 'https://homepage-staging.library.uq.edu.au/';
export const API_URL = process.env.API_URL || 'https://api.library.uq.edu.au/staging/';
export const APP_URL = process.env.APP_URL || STAGING_URL;

export const AUTH_URL_LOGIN = process.env.AUTH_LOGIN_URL || 'https://auth.library.uq.edu.au/login';
export const AUTH_URL_LOGOUT = process.env.AUTH_LOGOUT_URL || 'https://auth.library.uq.edu.au/logout';

// note: we have to use the SAME session storage as reusable, because reusable does the logout,
// where this MUST be removed
export const STORAGE_ACCOUNT_KEYNAME = 'userAccount';
