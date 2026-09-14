import { isValidUrl } from './Form/AlertForm';
import { makePreviewActionButtonJustNotifyUser, manuallyMakeWebComponentBePermanent } from './alerthelpers';

describe('alerts', () => {
    it('should correctly validate an url', () => {
        expect(isValidUrl('x')).toBe(false);
        expect(isValidUrl('ftp://x.com')).toBe(false);
        expect(isValidUrl('https://x.c')).toBe(false);
        expect(isValidUrl('http://apple')).toBe(false);
        expect(isValidUrl('https://uq.edu.au')).toBe(true);
    });

    // These two poll for the reusable alert web component's shadow DOM (which the e2e tests mock away),
    // so they are exercised here against a stubbed shadow root and fake timers.
    describe('alert preview shadow-DOM tweaks', () => {
        afterEach(() => {
            jest.useRealTimers();
            jest.restoreAllMocks();
        });

        it('makePreviewActionButtonJustNotifyUser rewrites the preview link once it appears', () => {
            jest.useFakeTimers();
            const link = { setAttribute: jest.fn(), onclick: null };
            const getById = jest.spyOn(document, 'getElementById');
            getById.mockReturnValueOnce(null); // preview not rendered on the first tick
            getById.mockReturnValue({ shadowRoot: { getElementById: () => link } });

            makePreviewActionButtonJustNotifyUser({ linkUrl: 'https://example.com/page' });

            jest.advanceTimersByTime(100); // first tick: nothing to rewrite yet
            expect(link.setAttribute).not.toHaveBeenCalled();

            jest.advanceTimersByTime(100); // second tick: link found and rewritten
            expect(link.setAttribute).toHaveBeenCalledWith('href', '#');
            expect(link.setAttribute).toHaveBeenCalledWith(
                'title',
                expect.stringContaining('https://example.com/page'),
            );

            // the interval clears once done, so no further polling happens
            const callsAfterRewrite = getById.mock.calls.length;
            jest.advanceTimersByTime(300);
            expect(getById).toHaveBeenCalledTimes(callsAfterRewrite);
        });

        it('manuallyMakeWebComponentBePermanent strips the marker and removes the close button', () => {
            jest.useFakeTimers();
            const closeButton = { remove: jest.fn() };
            const getById = jest.spyOn(document, 'getElementById');
            getById.mockReturnValueOnce(null); // preview not rendered on the first tick
            getById.mockReturnValue({ shadowRoot: { getElementById: () => closeButton } });
            const webComponent = { setAttribute: jest.fn() };

            manuallyMakeWebComponentBePermanent(webComponent, 'Closed for [permanent] maintenance');
            expect(webComponent.setAttribute).toHaveBeenCalledWith('alertmessage', 'Closed for  maintenance');

            jest.advanceTimersByTime(100); // first tick: close button not there yet
            expect(closeButton.remove).not.toHaveBeenCalled();

            jest.advanceTimersByTime(100); // second tick: close button found and removed
            expect(closeButton.remove).toHaveBeenCalledTimes(1);
        });
    });
});
