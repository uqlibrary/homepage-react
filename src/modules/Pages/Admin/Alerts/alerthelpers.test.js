import {
    isValidUrl,
    extractFieldsFromBody,
    getBody,
    getTimeEndOfDayFormatted,
    getTimeNowFormatted,
    makePreviewActionButtonJustNotifyUser,
    manuallyMakeWebComponentBePermanent,
} from './alerthelpers';

describe('alert helpers', () => {
    afterEach(() => {
        jest.useRealTimers();
        jest.restoreAllMocks();
        document.getElementById('alert-preview')?.remove();
    });

    it('should correctly validate an url', () => {
        expect(isValidUrl('')).toBe(false);
        expect(isValidUrl('http://x.c')).toBe(false);
        expect(isValidUrl('x')).toBe(false);
        expect(isValidUrl('ftp://x.com')).toBe(false);
        expect(isValidUrl('https://x.c')).toBe(false);
        expect(isValidUrl('http://apple')).toBe(false);
        expect(isValidUrl('https://uq.edu.au')).toBe(true);
    });

    it('formats the current time and end of day', () => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date(2024, 0, 2, 15, 4));

        expect(getTimeNowFormatted()).toBe('2024-01-02T15:04');
        expect(getTimeEndOfDayFormatted()).toBe('2024-01-02T23:59');
    });

    it('builds alert bodies with optional permanence and link markup', () => {
        expect(getBody({ enteredbody: 'Notice' })).toBe('Notice');
        expect(getBody({ enteredbody: 'Notice', permanentAlert: true })).toBe('Notice[permanent]');
        expect(
            getBody({ enteredbody: 'Notice', linkRequired: true, linkTitle: 'Read more', linkUrl: '/details' }),
        ).toBe('Notice[Read more](/details)');
        expect(
            getBody({
                enteredbody: 'Notice',
                permanentAlert: true,
                linkRequired: true,
                linkTitle: 'Read more',
                linkUrl: '/details',
            }),
        ).toBe('Notice[permanent][Read more](/details)');
    });

    it('extracts permanence and link fields from alert body text', () => {
        expect(extractFieldsFromBody('Notice')).toEqual({
            isPermanent: false,
            linkRequired: false,
            linkTitle: '',
            linkUrl: '',
            message: 'Notice',
        });
        expect(extractFieldsFromBody('Notice[permanent][Read more](/details)')).toEqual({
            isPermanent: true,
            linkRequired: true,
            linkTitle: 'Read more',
            linkUrl: '/details',
            message: 'Notice',
        });
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
        expect(link.setAttribute).toHaveBeenCalledWith('title', expect.stringContaining('https://example.com/page'));

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
