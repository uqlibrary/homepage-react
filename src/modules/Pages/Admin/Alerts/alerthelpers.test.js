import {
    isValidUrl,
    extractFieldsFromBody,
    getBody,
    getTimeEndOfDayFormatted,
    getTimeNowFormatted,
    makePreviewActionButtonJustNotifyUser,
    manuallyMakeWebComponentBePermanent,
} from './alerthelpers';

function createPreviewShadowRoot(...elementIds) {
    const preview = document.createElement('div');
    preview.id = 'alert-preview';
    const shadowRoot = preview.attachShadow({ mode: 'open' });

    elementIds.forEach(id => {
        const element = document.createElement('div');
        element.id = id;
        shadowRoot.appendChild(element);
    });

    document.body.appendChild(preview);
    return shadowRoot;
}

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

    it('changes the preview link to notify the user', () => {
        jest.useFakeTimers();
        const shadowRoot = createPreviewShadowRoot('alert-link');
        const link = shadowRoot.getElementById('alert-link');
        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
        const values = { linkUrl: '/details' };

        makePreviewActionButtonJustNotifyUser(values);
        jest.advanceTimersByTime(100);

        expect(link).toHaveAttribute('href', '#');
        expect(link).toHaveAttribute('title', 'On the live website, this button will visit /details when clicked');
        expect(link.onclick()).toBe(false);
        expect(alertSpy).toHaveBeenCalledWith('On the live website, this button will visit /details when clicked');
    });

    it('marks the web component permanent and removes its close button', () => {
        jest.useFakeTimers();
        const shadowRoot = createPreviewShadowRoot('alert-close');
        const closeButton = shadowRoot.getElementById('alert-close');
        const webComponent = document.createElement('alert-list');

        manuallyMakeWebComponentBePermanent(webComponent, 'Notice[permanent]');

        expect(webComponent).toHaveAttribute('alertmessage', 'Notice');
        expect(closeButton).toBeInTheDocument();

        jest.advanceTimersByTime(100);

        expect(shadowRoot.getElementById('alert-close')).toBeNull();
    });
});
