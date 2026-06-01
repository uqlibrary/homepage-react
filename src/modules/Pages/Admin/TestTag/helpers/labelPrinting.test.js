import { getDeptLabelPrintingEnabled, getDefaultDeptPrinter, hasPrinterError, hasTemplateError } from './labelPrinting';
import { LABEL_PRINTING } from '../config/labelPrinting';

jest.mock('../config/labelPrinting', () => ({
    LABEL_PRINTING: {
        enabled: true,
        DEPT1: {
            enabled: true,
            defaultPrinter: 'Printer-A',
        },
        DEPT2: {
            enabled: false,
            defaultPrinter: 'Printer-B',
        },
        DEPT3: {
            enabled: true,
            defaultPrinter: '',
        },
        DEPT4: {
            enabled: true,
        },
    },
}));

describe('labelPrinting helpers', () => {
    describe('getDeptLabelPrintingEnabled', () => {
        it('should return false when LABEL_PRINTING is globally disabled', () => {
            LABEL_PRINTING.enabled = false;
            const result = getDeptLabelPrintingEnabled('DEPT1');
            expect(result).toBe(false);
            LABEL_PRINTING.enabled = true; // Reset
        });

        it('should return true when department has label printing enabled', () => {
            const result = getDeptLabelPrintingEnabled('DEPT1');
            expect(result).toBe(true);
        });

        it('should return false when department has label printing disabled', () => {
            const result = getDeptLabelPrintingEnabled('DEPT2');
            expect(result).toBe(false);
        });

        it('should return false when department does not exist', () => {
            const result = getDeptLabelPrintingEnabled('NON_EXISTENT_DEPT');
            expect(result).toBe(false);
        });

        it('should return false when department exists but enabled property is undefined', () => {
            const result = getDeptLabelPrintingEnabled('DEPT_WITHOUT_ENABLED');
            expect(result).toBe(false);
        });

        it('should return false when userDept is null', () => {
            const result = getDeptLabelPrintingEnabled(null);
            expect(result).toBe(false);
        });

        it('should return false when userDept is undefined', () => {
            const result = getDeptLabelPrintingEnabled(undefined);
            expect(result).toBe(false);
        });

        it('should return false when userDept is empty string', () => {
            const result = getDeptLabelPrintingEnabled('');
            expect(result).toBe(false);
        });
    });

    describe('getDefaultDeptPrinter', () => {
        it('should return null when LABEL_PRINTING is globally disabled', () => {
            LABEL_PRINTING.enabled = false;
            const result = getDefaultDeptPrinter('DEPT1');
            expect(result).toBeNull();
            LABEL_PRINTING.enabled = true; // Reset
        });

        it('should return the default printer when department exists and has a printer configured', () => {
            const result = getDefaultDeptPrinter('DEPT1');
            expect(result).toBe('Printer-A');
        });

        it('should return the default printer even when department label printing is disabled', () => {
            const result = getDefaultDeptPrinter('DEPT2');
            expect(result).toBe('Printer-B');
        });

        it('should return null when department does not exist', () => {
            const result = getDefaultDeptPrinter('NON_EXISTENT_DEPT');
            expect(result).toBeNull();
        });

        it('should return null when department exists but has no defaultPrinter property', () => {
            const result = getDefaultDeptPrinter('DEPT4');
            expect(result).toBeNull();
        });

        it('should return null when department has empty string as defaultPrinter', () => {
            const result = getDefaultDeptPrinter('DEPT3');
            expect(result).toBeNull();
        });

        it('should return null when userDept is null', () => {
            const result = getDefaultDeptPrinter(null);
            expect(result).toBeNull();
        });

        it('should return null when userDept is undefined', () => {
            const result = getDefaultDeptPrinter(undefined);
            expect(result).toBeNull();
        });

        it('should return null when userDept is empty string', () => {
            const result = getDefaultDeptPrinter('');
            expect(result).toBeNull();
        });
    });

    describe('hasPrinterError', () => {
        const validPrinters = [{ name: 'Printer1' }, { name: 'Printer2' }, { name: 'Printer3' }];

        it('returns true when printerPreference is null', () => {
            expect(hasPrinterError(null, validPrinters)).toBe(true);
        });

        it('returns true when printerPreference is undefined', () => {
            expect(hasPrinterError(undefined, validPrinters)).toBe(true);
        });

        it('returns true when printerPreference is empty string', () => {
            expect(hasPrinterError('', validPrinters)).toBe(true);
        });

        it('returns true when availablePrinters array is empty', () => {
            expect(hasPrinterError({ name: 'Printer1' }, [])).toBe(true);
        });

        it('returns true when all printers have no name property', () => {
            const printersWithoutNames = [{ random: true }, { random: false }];
            expect(hasPrinterError({ name: 'Printer1' }, printersWithoutNames)).toBe(true);
        });

        it('returns true when all printers have undefined name', () => {
            const printersWithUndefinedNames = [{ name: undefined }, { name: undefined }];
            expect(hasPrinterError({ name: 'Printer1' }, printersWithUndefinedNames)).toBe(true);
        });

        it('returns true when all printers have null name', () => {
            const printersWithNullNames = [{ name: null }, { name: null }];
            expect(hasPrinterError({ name: 'Printer1' }, printersWithNullNames)).toBe(true);
        });

        it('returns true when printerPreference does not match any available printer', () => {
            expect(hasPrinterError({ name: 'NonExistentPrinter' }, validPrinters)).toBe(true);
        });

        it('returns false when printerPreference matches a valid printer', () => {
            expect(hasPrinterError({ name: 'Printer1' }, validPrinters)).toBe(false);
        });
        it('handles printers with only some having names correctly', () => {
            const mixedPrinters = [{ name: 'Printer1' }, { name: undefined }, { name: 'Printer2' }];
            // Should return false since there's at least one valid printer and it matches
            expect(hasPrinterError({ name: 'Printer1' }, mixedPrinters)).toBe(false);
            // Should return true since Printer3 doesn't exist
            expect(hasPrinterError({ name: 'Printer3' }, mixedPrinters)).toBe(true);
        });

        it('handles empty string printerPreference even with valid printers', () => {
            expect(hasPrinterError({ name: '' }, validPrinters)).toBe(true);
        });

        it('returns false for valid scenario with multiple printers', () => {
            const largePrinterList = [
                { name: 'Printer1' },
                { name: 'Printer2' },
                { name: 'Printer3' },
                { name: 'Printer4' },
            ];
            expect(hasPrinterError({ name: 'Printer2' }, largePrinterList)).toBe(false);
            expect(hasPrinterError({ name: 'Printer3' }, largePrinterList)).toBe(false);
        });

        describe('coverage', () => {
            it('returns true when availablePrinters parameter is not provided (uses default)', () => {
                // Test the default parameter branch
                expect(hasPrinterError({ name: 'Printer1' })).toBe(true);
            });

            it('handles array with null/undefined printer objects', () => {
                const printersWithNullEntries = [{ name: 'Printer1' }, null, undefined, { name: 'Printer2' }];
                // The optional chaining printer?.name should handle null/undefined entries
                expect(hasPrinterError({ name: 'Printer1' }, printersWithNullEntries)).toBe(false);
                expect(hasPrinterError({ name: 'Printer2' }, printersWithNullEntries)).toBe(false);
            });

            it('handles array with only null/undefined entries', () => {
                const onlyNullEntries = [null, undefined, null];
                // Should return true since no valid printers exist
                expect(hasPrinterError({ name: 'Printer1' }, onlyNullEntries)).toBe(true);
            });

            it('handles mixed array with null entries', () => {
                const mixedArray = [
                    null,
                    { name: 'Printer1', templateId: 1 },
                    undefined,
                    { name: 'Printer2', templateId: 2 },
                ];
                expect(hasPrinterError({ name: 'Printer2' }, mixedArray)).toBe(false);
                expect(hasPrinterError({ name: 'Printer1' }, mixedArray)).toBe(false);
            });
        });
    });

    describe('hasTemplateError', () => {
        it('returns true when printerPreference is null', () => {
            expect(hasTemplateError(null)).toBe(true);
        });

        it('returns true when printerPreference is undefined', () => {
            expect(hasTemplateError(undefined)).toBe(true);
        });

        it('returns true when printerPreference is an empty object', () => {
            expect(hasTemplateError({})).toBe(true);
        });

        it('returns true when printerPreference has no templateId property', () => {
            expect(hasTemplateError({ name: 'Printer1' })).toBe(true);
        });
        it('returns true when templateId is 0', () => {
            expect(hasTemplateError({ templateId: 0 })).toBe(true);
        });
        it('returns true when templateId is null (property exists)', () => {
            expect(hasTemplateError({ templateId: null })).toBe(true);
        });

        it('returns true when templateId is undefined but the key exists', () => {
            expect(hasTemplateError({ templateId: undefined })).toBe(true);
        });

        it('returns false when printerPreference has a templateId property', () => {
            expect(hasTemplateError({ name: 'Printer1', templateId: 1 })).toBe(false);
        });
    });
});
