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

// AWS WAF CAPTCHA on the public membership application form.
export const AWS_WAF_CAPTCHA_INTEGRATION_URL = process.env.AWS_WAF_CAPTCHA_INTEGRATION_URL || '';
export const AWS_WAF_CAPTCHA_API_KEY = process.env.AWS_WAF_CAPTCHA_API_KEY || '';
export const AWS_WAF_TOKEN_HEADER = 'x-aws-waf-token';
// The domain AWS WAF mints the token for. By default WAF uses the host of the protected resource
// (api.library.uq.edu.au), but the puzzle runs on the homepage host (homepage-*.library.uq.edu.au in dev/staging,
// www.library.uq.edu.au in production), so the SDK is told - via window.awsWafCookieDomainList - to scope the
// token to the shared apex instead: the common parent of every homepage host and the API host, valid on them all.
// This apex must also be in the web ACL's token domain list and the CAPTCHA API key.
export const AWS_WAF_CAPTCHA_TOKEN_DOMAIN = process.env.AWS_WAF_CAPTCHA_TOKEN_DOMAIN || 'library.uq.edu.au';
export const isMembershipCaptchaConfigured = () => !!AWS_WAF_CAPTCHA_INTEGRATION_URL && !!AWS_WAF_CAPTCHA_API_KEY;

// note: we have to use the SAME session storage key as reusable
export const STORAGE_ACCOUNT_KEYNAME = 'userAccount';
