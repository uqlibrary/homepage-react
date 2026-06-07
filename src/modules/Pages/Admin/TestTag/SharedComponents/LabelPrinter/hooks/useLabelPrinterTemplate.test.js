import { renderHook } from '@testing-library/react';
import useLabelPrinterTemplate, { formatTemplateString } from './useLabelPrinterTemplate';

const mockTemplateStore = [
    { id: 1, name: 'gk420t', code: 'Printer: {*NAME*}\nAsset: {*ASSET_ID*}\nLocation: {*LOCATION*}' },
    { id: 2, name: 'zebra-printer', code: 'Asset ID: {*ASSET_ID*}\nInspection Date: {*DATE*}' },
    { id: 3, name: 'test-printer', code: 'Simple template with {*VALUE*}' },
    { id: 4, name: '19j153101586', code: 'Printer: {*NAME*}\nAsset: {*ASSET_ID*}\nLocation: {*LOCATION*}' },
];

const mockTemplateStoreWithPrinters = [
    { id: 1, name: 'Template A', code: 'Code A', printers: ['GK420t', 'Zebra'] },
    { id: 2, name: 'Template B', code: 'Code B', printers: ['GK420t'] },
    { id: 3, name: 'Template C', code: 'Code C', printers: ['Zebra'] },
    { id: 4, name: 'Template D', code: 'Code D', printers: [] },
];

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

    describe('getLabelPrinterFormattedTemplate', () => {
        it('should return formatted template for existing printer', () => {
            const { result } = setup();

            const data = { name: 'gk420t', asset_id: 'A-001', location: 'Floor 1' };
            const template = result.current.getLabelPrinterFormattedTemplate(1, data);

            expect(template).toEqual({
                id: 1,
                formattedTemplate: 'Printer: gk420t\nAsset: A-001\nLocation: Floor 1',
            });
        });

        it('should normalise printer key', () => {
            const { result } = setup();

            const data = { name: 'Test', asset_id: 'A-001', location: 'Floor 1' };
            const template = result.current.getLabelPrinterFormattedTemplate(1, data);

            expect(template).toEqual({
                id: 1,
                formattedTemplate: 'Printer: Test\nAsset: A-001\nLocation: Floor 1',
            });
        });

        it('should return null for non-existent printer', () => {
            const { result } = setup();

            const data = { name: 'Test' };
            const template = result.current.getLabelPrinterFormattedTemplate(0, data);

            expect(template).toBeNull();
        });

        it('should handle printer key with mixed case', () => {
            const { result } = setup();

            const data = { asset_id: 'A-002', date: '2026-01-22' };
            const template = result.current.getLabelPrinterFormattedTemplate(2, data);

            expect(template).toEqual({
                id: 2,
                formattedTemplate: 'Asset ID: A-002\nInspection Date: 2026-01-22',
            });
        });

        it('should handle empty data object', () => {
            const { result } = setup();

            const template = result.current.getLabelPrinterFormattedTemplate(3, {});

            expect(template).toEqual({
                id: 3,
                formattedTemplate: 'Simple template with {*VALUE*}',
            });
        });

        it('should preserve original printer name in return value', () => {
            const { result } = setup();

            const data = { value: 'Test Value' };
            const template = result.current.getLabelPrinterFormattedTemplate(3, data);

            expect(template.id).toBe(3);
        });

        it('should handle complex data with multiple fields', () => {
            const { result } = setup();

            const data = {
                name: 'Zebra gk420t',
                asset_id: 'ASSET-12345',
                location: 'Building A, Floor 2, Room 201',
            };
            const template = result.current.getLabelPrinterFormattedTemplate(1, data);

            expect(template.formattedTemplate).toContain('Zebra gk420t');
            expect(template.formattedTemplate).toContain('ASSET-12345');
            expect(template.formattedTemplate).toContain('Building A, Floor 2, Room 201');
        });

        it('should return function that maintains reference stability', () => {
            const { result, rerender } = setup();

            const initialGetTemplate = result.current.getLabelPrinterFormattedTemplate;

            rerender(mockTemplateStore);

            const rerenderGetTemplate = result.current.getLabelPrinterFormattedTemplate;

            expect(initialGetTemplate).toBe(rerenderGetTemplate);
        });
    });
    describe('formatTemplateString helper', () => {
        it('should replace placeholders with provided data', () => {
            const template = 'Hello {*NAME*}, your ID is {*ID*}';
            const data = { name: 'John', id: '12345' };

            const result = formatTemplateString(template, data);

            expect(result).toBe('Hello John, your ID is 12345');
        });

        it('should handle multiple occurrences of the same placeholder', () => {
            const template = '{*NAME*} - {*NAME*} - {*NAME*}';
            const data = { name: 'Test' };

            const result = formatTemplateString(template, data);

            expect(result).toBe('Test - Test - Test');
        });

        it('should normalise placeholder keys', () => {
            const template = 'Value: {*VALUE*}';
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
            const template = 'Static text {*PLACEHOLDER*}';
            const data = {};

            const result = formatTemplateString(template, data);

            expect(result).toBe('Static text {*PLACEHOLDER*}');
        });

        it('should handle template without placeholders', () => {
            const template = 'Just plain text';
            const data = { name: 'Test' };

            const result = formatTemplateString(template, data);

            expect(result).toBe('Just plain text');
        });

        it('should handle special characters in data values', () => {
            const template = 'Value: {*DATA*}';
            const data = { data: 'Test $pecial Ch@rs!' };

            const result = formatTemplateString(template, data);

            expect(result).toBe('Value: Test $pecial Ch@rs!');
        });

        it('should handle numeric data values', () => {
            const template = 'Number: {*NUM*} and String: {*STR*}';
            const data = { num: 123, str: 'text' };

            const result = formatTemplateString(template, data);

            expect(result).toBe('Number: 123 and String: text');
        });

        it('should handle placeholders with mixed case in data keys', () => {
            const template = 'Asset: {*ASSET_ID*}';
            const data = { asset_id: 'A-12345' };

            const result = formatTemplateString(template, data);

            expect(result).toBe('Asset: A-12345');
        });

        it('should handle placeholders with underscores', () => {
            const template = '{*FIRST_NAME*} {*LAST_NAME*}';
            const data = { first_name: 'John', last_name: 'Doe' };

            const result = formatTemplateString(template, data);

            expect(result).toBe('John Doe');
        });
    });

    describe('getAllLabelTemplatesForPrinter', () => {
        it('should return templates matching the given printer name', () => {
            const { result } = setup({ templates: mockTemplateStoreWithPrinters });

            const templates = result.current.getAllLabelTemplatesForPrinter('GK420t');

            expect(templates).toEqual([
                { id: 1, name: 'Template A', code: 'Code A', printers: ['GK420t', 'Zebra'] },
                { id: 2, name: 'Template B', code: 'Code B', printers: ['GK420t'] },
            ]);
        });

        it('should return empty array when no templates match', () => {
            const { result } = setup({ templates: mockTemplateStoreWithPrinters });

            const templates = result.current.getAllLabelTemplatesForPrinter('UnknownPrinter');

            expect(templates).toEqual([]);
        });

        it('should return only templates whose printers include the given printer', () => {
            const { result } = setup({ templates: mockTemplateStoreWithPrinters });

            const templates = result.current.getAllLabelTemplatesForPrinter('Zebra');

            expect(templates).toHaveLength(2);
            expect(templates.every(template => template.printers.includes('Zebra'))).toBe(true);
        });

        it('should not include templates without the given printer', () => {
            const { result } = setup({ templates: mockTemplateStoreWithPrinters });

            const templates = result.current.getAllLabelTemplatesForPrinter('GK420t');

            expect(templates.find(template => template.id === 3)).toBeUndefined();
            expect(templates.find(template => template.id === 4)).toBeUndefined();
        });

        it('should return empty array when template store is empty', () => {
            const { result } = setup({ templates: [] });

            const templates = result.current.getAllLabelTemplatesForPrinter('GK420t');

            expect(templates).toEqual([]);
        });

        it('should return undefined when template store is undefined', () => {
            const { result } = renderHook(() => useLabelPrinterTemplate(undefined));

            const templates = result.current.getAllLabelTemplatesForPrinter('GK420t');

            expect(templates).toBeUndefined();
        });
    });
});
