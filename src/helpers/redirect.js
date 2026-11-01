/**
 * Leave the app for an external URL.
 *
 * A one-line wrapper, but a necessary one: `window.location` cannot be replaced or spied on under jsdom, so
 * code that calls it directly cannot be tested without the test environment fighting back. Going through here
 * gives every such navigation one seam to stand in for, and one place to look for them.
 */
export const redirectTo = url => window.location.assign(url);

export default redirectTo;
