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

// AWS WAF CAPTCHA on the public membership application form. The integration script (jsapi.js) and its encrypted,
// domain-scoped API key are set per environment in the webpack build; when either is empty - local dev without the
// mock, or an environment that has not switched the CAPTCHA on - the form drops the challenge and behaves as
// before. Once solved, the token rides on the create request in the header below, which the API's WAF rule reads.
export const AWS_WAF_CAPTCHA_INTEGRATION_URL = process.env.AWS_WAF_CAPTCHA_INTEGRATION_URL || '';
export const AWS_WAF_CAPTCHA_API_KEY = process.env.AWS_WAF_CAPTCHA_API_KEY || '';
export const AWS_WAF_TOKEN_HEADER = 'x-aws-waf-token';
export const isMembershipCaptchaConfigured = () => !!AWS_WAF_CAPTCHA_INTEGRATION_URL && !!AWS_WAF_CAPTCHA_API_KEY;

// note: we have to use the SAME session storage key as reusable
export const STORAGE_ACCOUNT_KEYNAME = 'userAccount';
