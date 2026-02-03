import { getDeptLabelPrintingEnabled, getDefaultDeptPrinter } from './labelPrinting';
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
});
