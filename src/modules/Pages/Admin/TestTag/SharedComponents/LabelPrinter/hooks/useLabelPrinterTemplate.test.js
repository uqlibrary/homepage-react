import { renderHook } from '@testing-library/react';
import useLabelPrinterTemplate, { formatTemplateString } from './useLabelPrinterTemplate';

const mockTemplateStore = {
    gk420t: 'Printer: {{NAME}}\nAsset: {{ASSET_ID}}\nLocation: {{LOCATION}}',
    'zebra-printer': 'Asset ID: {{ASSET_ID}}\nInspection Date: {{DATE}}',
    'test-printer': 'Simple template with {{VALUE}}',
    _19j153101586: 'Printer: {{NAME}}\nAsset: {{ASSET_ID}}\nLocation: {{LOCATION}}',
};

function setup(testProps = {}) {
    const { templates = mockTemplateStore } = testProps;

    const initialProps = templates;

    return renderHook(templates => useLabelPrinterTemplate(templates), {
        initialProps,
    });
}

describe('useLabelPrinterTemplate', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getLabelPrinterTemplate', () => {
        it('should return formatted template for existing printer', () => {
            const { result } = setup();

            const data = { name: 'GK420t', asset_id: 'A-001', location: 'Floor 1' };
            const template = result.current.getLabelPrinterTemplate('GK420t', data);

            expect(template).toEqual({
                name: 'GK420t',
                formattedTemplate: 'Printer: GK420t\nAsset: A-001\nLocation: Floor 1',
            });
        });

        it('should normalise printer key', () => {
            const { result } = setup();

            const data = { name: 'Test', asset_id: 'A-001', location: 'Floor 1' };
            const template = result.current.getLabelPrinterTemplate('GK420T', data);

            expect(template).toEqual({
                name: 'GK420T',
                formattedTemplate: 'Printer: Test\nAsset: A-001\nLocation: Floor 1',
            });
        });

        it('should return null for non-existent printer', () => {
            const { result } = setup();

            const data = { name: 'Test' };
            const template = result.current.getLabelPrinterTemplate('non-existent', data);

            expect(template).toBeNull();
        });

        it('should handle printer key with mixed case', () => {
            const { result } = setup();

            const data = { asset_id: 'A-002', date: '2026-01-22' };
            const template = result.current.getLabelPrinterTemplate('Zebra-Printer', data);

            expect(template).toEqual({
                name: 'Zebra-Printer',
                formattedTemplate: 'Asset ID: A-002\nInspection Date: 2026-01-22',
            });
        });

        it('should handle empty data object', () => {
            const { result } = setup();

            const template = result.current.getLabelPrinterTemplate('test-printer', {});

            expect(template).toEqual({
                name: 'test-printer',
                formattedTemplate: 'Simple template with {{VALUE}}',
            });
        });

        it('should preserve original printer name in return value', () => {
            const { result } = setup();

            const data = { value: 'Test Value' };
            const template = result.current.getLabelPrinterTemplate('TEST-PRINTER', data);

            expect(template.name).toBe('TEST-PRINTER');
        });

        it('should handle printer with hyphens and numbers', () => {
            const customTemplates = {
                'printer-123': 'Template for {{ITEM}}',
            };
            const { result } = setup({ templates: customTemplates });

            const data = { item: 'Test' };
            const template = result.current.getLabelPrinterTemplate('Printer-123', data);

            expect(template).toEqual({
                name: 'Printer-123',
                formattedTemplate: 'Template for Test',
            });
        });

        it('should handle complex data with multiple fields', () => {
            const { result } = setup();

            const data = {
                name: 'Zebra GK420t',
                asset_id: 'ASSET-12345',
                location: 'Building A, Floor 2, Room 201',
            };
            const template = result.current.getLabelPrinterTemplate('gk420t', data);

            expect(template.formattedTemplate).toContain('Zebra GK420t');
            expect(template.formattedTemplate).toContain('ASSET-12345');
            expect(template.formattedTemplate).toContain('Building A, Floor 2, Room 201');
        });

        it('should return function that maintains reference stability', () => {
            const { result, rerender } = setup();

            const initialGetTemplate = result.current.getLabelPrinterTemplate;

            rerender(mockTemplateStore);

            const rerenderGetTemplate = result.current.getLabelPrinterTemplate;

            expect(initialGetTemplate).toBe(rerenderGetTemplate);
        });

        it('should handle printer key with underscores', () => {
            const customTemplates = {
                printer_test_1: 'Template {{DATA}}',
            };
            const { result } = setup({ templates: customTemplates });

            const template = result.current.getLabelPrinterTemplate('PRINTER_TEST_1', { data: 'value' });

            expect(template).toEqual({
                name: 'PRINTER_TEST_1',
                formattedTemplate: 'Template value',
            });
        });
    });

    describe('hasLabelPrinterTemplate', () => {
        it('should return true for existing printer template', () => {
            const { result } = setup();

            const hasTemplate = result.current.hasLabelPrinterTemplate('gk420t');

            expect(hasTemplate).toBe(true);
        });

        it('should return true for existing printer template that starts with a number', () => {
            const { result } = setup();

            const hasTemplate = result.current.hasLabelPrinterTemplate('19j153101586');

            expect(hasTemplate).toBe(true);
        });

        it('should return false for non-existent printer template', () => {
            const { result } = setup();

            const hasTemplate = result.current.hasLabelPrinterTemplate('non-existent');

            expect(hasTemplate).toBe(false);
        });

        it('should normalise printer key', () => {
            const { result } = setup();

            const hasTemplate = result.current.hasLabelPrinterTemplate('GK420T');

            expect(hasTemplate).toBe(true);
        });

        it('should handle mixed case printer keys', () => {
            const { result } = setup();

            const hasTemplate = result.current.hasLabelPrinterTemplate('Zebra-Printer');

            expect(hasTemplate).toBe(true);
        });

        it('should return false for empty string', () => {
            const { result } = setup();

            const hasTemplate = result.current.hasLabelPrinterTemplate('');

            expect(hasTemplate).toBe(false);
        });

        it('should handle printer key with special characters', () => {
            const customTemplates = {
                'printer-test_123': 'Template',
            };
            const { result } = setup({ templates: customTemplates });

            const hasTemplate = result.current.hasLabelPrinterTemplate('Printer-Test_123');

            expect(hasTemplate).toBe(true);
        });

        it('should return false for undefined template store', () => {
            const { result } = setup({ templates: undefined });

            const hasTemplate = result.current.hasLabelPrinterTemplate('any-printer');

            expect(hasTemplate).toBe(false);
        });

        it('should return false for null template store', () => {
            const { result } = setup({ templates: null });

            const hasTemplate = result.current.hasLabelPrinterTemplate('any-printer');

            expect(hasTemplate).toBe(false);
        });

        it('should return function that maintains reference stability', () => {
            const { result, rerender } = setup();

            const initialHasTemplate = result.current.hasLabelPrinterTemplate;

            rerender(mockTemplateStore);

            const rerenderHasTemplate = result.current.hasLabelPrinterTemplate;

            expect(initialHasTemplate).toBe(rerenderHasTemplate);
        });

        it('should check all templates in store', () => {
            const { result } = setup();

            expect(result.current.hasLabelPrinterTemplate('gk420t')).toBe(true);
            expect(result.current.hasLabelPrinterTemplate('zebra-printer')).toBe(true);
            expect(result.current.hasLabelPrinterTemplate('test-printer')).toBe(true);
        });
    });

    describe('formatTemplateString helper', () => {
        it('should replace placeholders with provided data', () => {
            const template = 'Hello {{NAME}}, your ID is {{ID}}';
            const data = { name: 'John', id: '12345' };

            const result = formatTemplateString(template, data);

            expect(result).toBe('Hello John, your ID is 12345');
        });

        it('should handle multiple occurrences of the same placeholder', () => {
            const template = '{{NAME}} - {{NAME}} - {{NAME}}';
            const data = { name: 'Test' };

            const result = formatTemplateString(template, data);

            expect(result).toBe('Test - Test - Test');
        });

        it('should normalise placeholder keys', () => {
            const template = 'Value: {{VALUE}}';
            const data = { value: 'test-value' };

            const result = formatTemplateString(template, data);

            expect(result).toBe('Value: test-value');
        });

        it('should handle empty template string', () => {
            const template = '';
            const data = { name: 'Test' };

            const result = formatTemplateString(template, data);

            expect(result).toBe('');
        });

        it('should handle empty data object', () => {
            const template = 'Static text {{PLACEHOLDER}}';
            const data = {};

            const result = formatTemplateString(template, data);

            expect(result).toBe('Static text {{PLACEHOLDER}}');
        });

        it('should handle template without placeholders', () => {
            const template = 'Just plain text';
            const data = { name: 'Test' };

            const result = formatTemplateString(template, data);

            expect(result).toBe('Just plain text');
        });

        it('should handle special characters in data values', () => {
            const template = 'Value: {{DATA}}';
            const data = { data: 'Test $pecial Ch@rs!' };

            const result = formatTemplateString(template, data);

            expect(result).toBe('Value: Test $pecial Ch@rs!');
        });

        it('should handle numeric data values', () => {
            const template = 'Number: {{NUM}} and String: {{STR}}';
            const data = { num: 123, str: 'text' };

            const result = formatTemplateString(template, data);

            expect(result).toBe('Number: 123 and String: text');
        });

        it('should handle placeholders with mixed case in data keys', () => {
            const template = 'Asset: {{ASSET_ID}}';
            const data = { asset_id: 'A-12345' };

            const result = formatTemplateString(template, data);

            expect(result).toBe('Asset: A-12345');
        });

        it('should handle placeholders with underscores', () => {
            const template = '{{FIRST_NAME}} {{LAST_NAME}}';
            const data = { first_name: 'John', last_name: 'Doe' };

            const result = formatTemplateString(template, data);

            expect(result).toBe('John Doe');
        });
    });
});
