import { isValidImageUrl } from './SpotlightForm';

describe('SpotlightForm component', () => {
    it('should correctly validate an url', () => {
        expect(isValidImageUrl('x')).toBe(false);
        expect(isValidImageUrl('ftp://x.com')).toBe(false);
        expect(isValidImageUrl('https://x.c')).toBe(false);
        expect(isValidImageUrl('http://apple')).toBe(false);
        expect(isValidImageUrl('https://uq.edu.au')).toBe(true);
    });
});
