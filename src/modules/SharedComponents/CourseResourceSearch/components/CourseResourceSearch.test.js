import { isRepeatingString } from './HomePageSearch';

describe('Component HomePageSearch', () => {
    it('should detect long repeating strings (book-on-keyboard problem)', () => {
        expect(isRepeatingString('PHIL1001')).toBe(false);
        expect(isRepeatingString('the quick brown dog jumped over the lazy dog')).toBe(false);
        expect(isRepeatingString('sss')).toBe(false);

        expect(isRepeatingString('``````````````````````````````````````````````````')).toBe(true);
        expect(isRepeatingString('ssss')).toBe(true);
    });
});
