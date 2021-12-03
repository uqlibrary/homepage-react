import { isValidUrl } from './AlertForm';

describe('alerts', () => {
    it('should correctly validate an url', () => {
        expect(isValidUrl('x')).toBe(false);
        expect(isValidUrl('ftp://x.com')).toBe(false);
        expect(isValidUrl('https://x.c')).toBe(false);
        expect(isValidUrl('http://apple')).toBe(false);
        expect(isValidUrl('https://uq.edu.au')).toBe(true);
    });
});
