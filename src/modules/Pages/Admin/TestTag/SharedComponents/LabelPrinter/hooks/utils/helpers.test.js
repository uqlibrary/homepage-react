import { normalisePlaceholderKey } from './helpers';

describe('helpers', () => {
    describe('normalisePlaceholderKey', () => {
        it('should convert lowercase string to uppercase', () => {
            expect(normalisePlaceholderKey('test')).toBe('TEST');
        });

        it('should keep uppercase string unchanged', () => {
            expect(normalisePlaceholderKey('TEST')).toBe('TEST');
        });

        it('should convert mixed case string to uppercase', () => {
            expect(normalisePlaceholderKey('TeSt')).toBe('TEST');
        });

        it('should handle empty string', () => {
            expect(normalisePlaceholderKey('')).toBe('');
        });

        it('should handle string with numbers', () => {
            expect(normalisePlaceholderKey('test123')).toBe('TEST123');
        });

        it('should handle string with special characters', () => {
            expect(normalisePlaceholderKey('test_key')).toBe('TEST_KEY');
        });

        it('should handle string with spaces', () => {
            expect(normalisePlaceholderKey('test key')).toBe('TEST KEY');
        });
    });
});
