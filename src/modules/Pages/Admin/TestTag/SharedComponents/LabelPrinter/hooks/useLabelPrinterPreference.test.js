import { renderHook, act } from '@testing-library/react';
import { useCookies } from 'react-cookie';
import useLabelPrinterPreference, {
    extractCorePrinterName,
    printerToCookieString,
    parsePrinterFromCookieString,
} from './useLabelPrinterPreference';

jest.mock('react-cookie', () => ({
    useCookies: jest.fn(),
}));

const mockSetCookie = jest.fn();

function setup(testProps = {}) {
    const { cookieName = 'testPrinterCookie', cookies = {} } = testProps;

    // Mock useCookies to return test cookies and mock setter
    useCookies.mockReturnValue([cookies, mockSetCookie]);

    const initialProps = cookieName;

    return renderHook(cookieName => useLabelPrinterPreference(cookieName), {
        initialProps,
    });
}

describe('useLabelPrinterPreference', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('hook functionality', () => {
        it('should initialize with undefined preference when no cookie exists', () => {
            const { result } = setup({ cookies: {} });

            const [printerPreference] = result.current;
            expect(printerPreference).toBeUndefined();
        });

        it('should parse existing cookie value on initialization', () => {
            const cookieValue = JSON.stringify({
                name: 'GK420t ZPL Printer',
                shortName: 'GK420t',
            });
            const { result } = setup({
                cookies: { testPrinterCookie: cookieValue },
            });

            const [printerPreference] = result.current;
            expect(printerPreference).toEqual({
                name: 'GK420t ZPL Printer',
                shortName: 'GK420t',
            });
        });

        it('should call setCookie when setting printer preference', () => {
            const { result } = setup();

            const [, setPrinterPreference] = result.current;

            act(() => {
                setPrinterPreference('GK420t ZPL Printer');
            });

            expect(mockSetCookie).toHaveBeenCalledWith(
                'testPrinterCookie',
                JSON.stringify({ name: 'GK420t ZPL Printer', shortName: 'GK420t' }),
                { path: '/' },
            );
        });

        it('should use correct cookie name when setting preference', () => {
            const customCookieName = 'myCustomCookie';
            const { result } = setup({ cookieName: customCookieName });

            const [, setPrinterPreference] = result.current;

            act(() => {
                setPrinterPreference('Test Printer');
            });

            expect(mockSetCookie).toHaveBeenCalledWith(customCookieName, expect.any(String), { path: '/' });
        });

        it('should handle setting preference multiple times', () => {
            const { result } = setup();

            const [, setPrinterPreference] = result.current;

            act(() => {
                setPrinterPreference('Printer 1');
            });

            act(() => {
                setPrinterPreference('Printer 2');
            });

            expect(mockSetCookie).toHaveBeenCalledTimes(2);
            expect(mockSetCookie).toHaveBeenNthCalledWith(
                1,
                'testPrinterCookie',
                JSON.stringify({ name: 'Printer 1', shortName: 'Printer' }),
                { path: '/' },
            );
            expect(mockSetCookie).toHaveBeenNthCalledWith(
                2,
                'testPrinterCookie',
                JSON.stringify({ name: 'Printer 2', shortName: 'Printer' }),
                { path: '/' },
            );
        });

        it('should handle invalid cookie value gracefully', () => {
            const { result } = setup({
                cookies: { testPrinterCookie: 'invalid json string' },
            });

            const [printerPreference] = result.current;
            expect(printerPreference).toBeNull();
        });

        it('should handle empty string cookie value', () => {
            const { result } = setup({
                cookies: { testPrinterCookie: '' },
            });

            const [printerPreference] = result.current;
            expect(printerPreference).toBeNull();
        });

        it('should handle null cookie value', () => {
            const { result } = setup({
                cookies: { testPrinterCookie: null },
            });

            const [printerPreference] = result.current;
            expect(printerPreference).toBeNull();
        });

        it('should encode printer name correctly when setting preference', () => {
            const { result } = setup();

            const [, setPrinterPreference] = result.current;

            act(() => {
                setPrinterPreference('GK420t ZPL Printer (USB)');
            });

            const encodedValue = mockSetCookie.mock.calls[0][1];
            const decoded = JSON.parse(encodedValue);

            expect(decoded).toEqual({
                name: 'GK420t ZPL Printer (USB)',
                shortName: 'GK420t',
            });
        });

        it('should handle printer names with special characters', () => {
            const { result } = setup();

            const [, setPrinterPreference] = result.current;

            act(() => {
                setPrinterPreference('Printer-123/v2 (USB-Port)');
            });

            expect(mockSetCookie).toHaveBeenCalledWith(
                'testPrinterCookie',
                expect.stringContaining('Printer-123/v2 (USB-Port)'),
                { path: '/' },
            );
        });

        it('should work with different cookie names', () => {
            const { result: result1 } = setup({ cookieName: 'cookie1' });
            const { result: result2 } = setup({ cookieName: 'cookie2' });

            const [, setPrinter1] = result1.current;
            const [, setPrinter2] = result2.current;

            act(() => {
                setPrinter1('Printer 1');
            });

            act(() => {
                setPrinter2('Printer 2');
            });

            expect(mockSetCookie).toHaveBeenCalledWith('cookie1', expect.any(String), { path: '/' });
            expect(mockSetCookie).toHaveBeenCalledWith('cookie2', expect.any(String), { path: '/' });
        });

        it('should handle object cookie values that are already parsed', () => {
            const objectCookie = { name: 'Test Printer', shortName: 'Test' };
            const { result } = setup({
                cookies: { testPrinterCookie: objectCookie },
            });

            const [printerPreference] = result.current;
            expect(printerPreference).toEqual(objectCookie);
        });
    });

    describe('extractCorePrinterName helper', () => {
        it('should extract core printer name from full printer string', () => {
            const result = extractCorePrinterName('GK420t ZPL Printer (USB)');
            expect(result).toBe('GK420t');
        });

        it('should return same value for single word printer name', () => {
            const result = extractCorePrinterName('Zebra');
            expect(result).toBe('Zebra');
        });

        it('should handle empty string', () => {
            const result = extractCorePrinterName('');
            expect(result).toBe('');
        });

        it('should handle printer name with trailing spaces', () => {
            const result = extractCorePrinterName('Printer123 ');
            expect(result).toBe('Printer123');
        });

        it('should handle printer name with leading spaces', () => {
            const result = extractCorePrinterName(' Printer123 Model');
            expect(result).toBe('');
        });

        it('should extract hyphenated printer names', () => {
            const result = extractCorePrinterName('GK420t-USB Printer Model');
            expect(result).toBe('GK420t-USB');
        });
    });

    describe('printerToCookieString helper', () => {
        it('should convert printer name to cookie string format', () => {
            const result = printerToCookieString('GK420t ZPL Printer');
            const parsed = JSON.parse(result);

            expect(parsed).toHaveProperty('name', 'GK420t ZPL Printer');
            expect(parsed).toHaveProperty('shortName', 'GK420t');
        });

        it('should handle single word printer name', () => {
            const result = printerToCookieString('Zebra');
            const parsed = JSON.parse(result);

            expect(parsed).toEqual({
                name: 'Zebra',
                shortName: 'Zebra',
            });
        });

        it('should handle empty printer name', () => {
            const result = printerToCookieString('');
            const parsed = JSON.parse(result);

            expect(parsed).toEqual({
                name: '',
                shortName: '',
            });
        });
    });

    describe('parsePrinterFromCookieString helper', () => {
        it('should parse valid JSON cookie string', () => {
            const cookieString = JSON.stringify({ name: 'GK420t ZPL Printer', shortName: 'GK420t' });
            const result = parsePrinterFromCookieString(cookieString);

            expect(result).toEqual({
                name: 'GK420t ZPL Printer',
                shortName: 'GK420t',
            });
        });

        it('should return null for invalid JSON string', () => {
            const result = parsePrinterFromCookieString('invalid json');

            expect(result).toBeNull();
        });

        it('should return null for malformed JSON', () => {
            const result = parsePrinterFromCookieString('{"name": "test"');

            expect(result).toBeNull();
        });

        it('should return value as-is when not a string', () => {
            const objectValue = { name: 'Test', shortName: 'Test' };
            const result = parsePrinterFromCookieString(objectValue);

            expect(result).toEqual(objectValue);
        });

        it('should return value as-is for non-string types like numbers', () => {
            const result = parsePrinterFromCookieString(123);

            expect(result).toBe(123);
        });

        it('should handle empty string', () => {
            const result = parsePrinterFromCookieString('');

            expect(result).toBeNull();
        });

        it('should handle null cookie value', () => {
            const result = parsePrinterFromCookieString(null);

            expect(result).toBeNull();
        });

        it('should handle undefined cookie value', () => {
            const result = parsePrinterFromCookieString(undefined);

            expect(result).toBeUndefined();
        });

        it('should return parsed object when JSON contains null', () => {
            const cookieString = JSON.stringify(null);
            const result = parsePrinterFromCookieString(cookieString);

            expect(result).toBeNull();
        });

        it('should parse cookie string with extra properties', () => {
            const cookieString = JSON.stringify({
                name: 'Printer',
                shortName: 'Printer',
                extra: 'data',
            });
            const result = parsePrinterFromCookieString(cookieString);

            expect(result).toEqual({
                name: 'Printer',
                shortName: 'Printer',
                extra: 'data',
            });
        });
    });
});
