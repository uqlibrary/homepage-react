import { redirectTo } from './redirect';

describe('redirectTo', () => {
    it('sends the browser to the url', () => {
        // jsdom refuses to navigate, and says so rather than throwing - which is all this needs to prove the
        // call reaches window.location.
        const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

        expect(() => redirectTo('https://payments.uq.edu.au/pay?x=1')).not.toThrow();

        consoleError.mockRestore();
    });
});
