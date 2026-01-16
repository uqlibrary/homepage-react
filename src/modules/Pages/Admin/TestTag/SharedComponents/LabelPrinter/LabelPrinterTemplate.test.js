import templates from './LabelPrinterTemplate';
import logo from './LabelLogo';

describe('LabelPrinterTemplate', () => {
    const printerKeys = Object.keys(templates);

    it('should have zebra and emulator templates defined', () => {
        expect(printerKeys).toHaveLength(3);
        for (const key of printerKeys) {
            const printer = templates[key];
            expect(printer).toHaveProperty('name');
            expect(printer).toHaveProperty('template');
            expect(typeof printer.template).toBe('function');
        }
    });
    it('should generate label template strings correctly', () => {
        const sampleData = {
            logo,
            userId: 'John Doe',
            assetId: 'ABC12345',
            testDate: '2024-06-15',
            dueDate: '2025-06-15',
        };
        // it's generally expected that every template will
        // require every prop value sent. Change this test
        // if that assumption is no longer valid.
        for (const key of printerKeys) {
            const printer = templates[key];
            const template = printer.template(sampleData);
            expect(typeof template).toBe('string');
            expect(template).toContain(logo);
            expect(template).toContain(sampleData.userId);
            expect(template).toContain(sampleData.assetId);
            expect(template).toContain(sampleData.testDate);
            expect(template).toContain(sampleData.dueDate);
        }
    });
});
