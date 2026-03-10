import { normalisePlaceholderKey, normalisePrinterNameKey } from './helpers';

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

    describe('normalisePrinterNameKey', () => {
        it('should convert lowercase string to lowercase', () => {
            expect(normalisePrinterNameKey('printer')).toBe('printer');
        });

        it('should convert uppercase string to lowercase', () => {
            expect(normalisePrinterNameKey('PRINTER')).toBe('printer');
        });

        it('should convert mixed case string to lowercase', () => {
            expect(normalisePrinterNameKey('PrInTeR')).toBe('printer');
        });

        it('should prefix string starting with a number with _', () => {
            expect(normalisePrinterNameKey('123printer')).toBe('_123printer');
        });

        it('should prefix string starting with 0 with _', () => {
            expect(normalisePrinterNameKey('0printer')).toBe('_0printer');
        });

        it('should not prefix string starting with a letter', () => {
            expect(normalisePrinterNameKey('Printer123')).toBe('printer123');
        });

        it('should handle empty string', () => {
            expect(normalisePrinterNameKey('')).toBe('');
        });

        it('should handle string with special characters', () => {
            expect(normalisePrinterNameKey('Printer_Name')).toBe('printer_name');
        });

        it('should handle string with spaces', () => {
            expect(normalisePrinterNameKey('Printer Name')).toBe('printer name');
        });

        it('should handle string starting with special character', () => {
            expect(normalisePrinterNameKey('_printer')).toBe('_printer');
        });
    });
});
