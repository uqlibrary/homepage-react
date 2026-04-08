import { isValidUrl } from './Form/AlertForm';
import {
    extractFieldsFromBody,
    getBody,
    getTimeEndOfDayFormatted,
    getTimeNowFormatted,
    makePreviewActionButtonJustNotifyUser,
    manuallyMakeWebComponentBePermanent,
    systemList,
} from './alerthelpers';

describe('alerts', () => {
    it('should correctly validate an url', () => {
        expect(isValidUrl('x')).toBe(false);
        expect(isValidUrl('ftp://x.com')).toBe(false);
        expect(isValidUrl('https://x.c')).toBe(false);
        expect(isValidUrl('http://apple')).toBe(false);
        expect(isValidUrl('https://uq.edu.au')).toBe(true);
    });
});

describe('getTimeNowFormatted', () => {
    it('returns a datetime string in the expected format', () => {
        expect(getTimeNowFormatted()).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
    });
});

describe('getTimeEndOfDayFormatted', () => {
    it('returns end of day as a formatted datetime string', () => {
        expect(getTimeEndOfDayFormatted()).toMatch(/T23:59$/);
    });
});

describe('getBody', () => {
    it('returns just the message when no extras', () => {
        expect(getBody({ enteredbody: 'hello', permanentAlert: false, linkRequired: false })).toBe('hello');
    });
    it('appends [permanent] when permanentAlert is true', () => {
        expect(getBody({ enteredbody: 'hello', permanentAlert: true, linkRequired: false })).toBe('hello[permanent]');
    });
    it('appends a markdown link when linkRequired is true', () => {
        expect(
            getBody({ enteredbody: 'hello ', permanentAlert: false, linkRequired: true, linkTitle: 'UQ', linkUrl: 'https://uq.edu.au' }),
        ).toBe('hello [UQ](https://uq.edu.au)');
    });
    it('appends both [permanent] and link', () => {
        expect(
            getBody({ enteredbody: 'hello ', permanentAlert: true, linkRequired: true, linkTitle: 'UQ', linkUrl: 'https://uq.edu.au' }),
        ).toBe('hello [permanent][UQ](https://uq.edu.au)');
    });
});

describe('extractFieldsFromBody', () => {
    it('handles empty content', () => {
        expect(extractFieldsFromBody('')).toEqual({
            isPermanent: false,
            linkRequired: false,
            linkTitle: '',
            linkUrl: '',
            message: '',
        });
    });
    it('handles null content', () => {
        expect(extractFieldsFromBody(null)).toEqual({
            isPermanent: false,
            linkRequired: false,
            linkTitle: '',
            linkUrl: '',
            message: '',
        });
    });
    it('extracts a markdown link from the body', () => {
        expect(extractFieldsFromBody('hello [UQ](https://uq.edu.au)')).toEqual({
            isPermanent: false,
            linkRequired: true,
            linkTitle: 'UQ',
            linkUrl: 'https://uq.edu.au',
            message: 'hello ',
        });
    });
    it('extracts the permanent flag', () => {
        expect(extractFieldsFromBody('hello[permanent]')).toMatchObject({
            isPermanent: true,
            linkRequired: false,
            message: 'hello',
        });
    });
    it('extracts both permanent flag and link', () => {
        expect(extractFieldsFromBody('hello[permanent][UQ](https://uq.edu.au)')).toMatchObject({
            isPermanent: true,
            linkRequired: true,
            linkTitle: 'UQ',
            linkUrl: 'https://uq.edu.au',
        });
    });
});

describe('systemList', () => {
    it('contains the expected systems', () => {
        expect(systemList).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ slug: 'homepage' }),
                expect.objectContaining({ slug: 'primo' }),
                expect.objectContaining({ slug: 'espace' }),
            ]),
        );
    });
});

describe('makePreviewActionButtonJustNotifyUser', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    it('sets up an interval that queries the preview element', () => {
        document.getElementById = jest.fn().mockReturnValue(null);
        makePreviewActionButtonJustNotifyUser({ linkUrl: 'https://uq.edu.au' });
        jest.advanceTimersByTime(100);
        expect(document.getElementById).toHaveBeenCalledWith('alert-preview');
    });

    it('handles a preview element with a shadowRoot', () => {
        const mockPreview = { shadowRoot: { getElementById: jest.fn().mockReturnValue(null) } };
        document.getElementById = jest.fn().mockReturnValue(mockPreview);
        makePreviewActionButtonJustNotifyUser({ linkUrl: 'https://uq.edu.au' });
        jest.advanceTimersByTime(100);
        expect(document.getElementById).toHaveBeenCalledWith('alert-preview');
    });
});

describe('manuallyMakeWebComponentBePermanent', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    it('removes [permanent] from the body when calling setAttribute', () => {
        const webComponent = { setAttribute: jest.fn() };
        document.getElementById = jest.fn().mockReturnValue(null);
        manuallyMakeWebComponentBePermanent(webComponent, 'hello[permanent]world');
        expect(webComponent.setAttribute).toHaveBeenCalledWith('alertmessage', 'helloworld');
    });

    it('sets up an interval that queries the preview element', () => {
        const webComponent = { setAttribute: jest.fn() };
        document.getElementById = jest.fn().mockReturnValue(null);
        manuallyMakeWebComponentBePermanent(webComponent, 'hello');
        jest.advanceTimersByTime(100);
        expect(document.getElementById).toHaveBeenCalledWith('alert-preview');
    });

    it('handles a preview element with a shadowRoot', () => {
        const webComponent = { setAttribute: jest.fn() };
        const mockPreview = { shadowRoot: { getElementById: jest.fn().mockReturnValue(null) } };
        document.getElementById = jest.fn().mockReturnValue(mockPreview);
        manuallyMakeWebComponentBePermanent(webComponent, 'hello');
        jest.advanceTimersByTime(100);
        expect(document.getElementById).toHaveBeenCalledWith('alert-preview');
    });
});
