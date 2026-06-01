import { renderHook } from '@testing-library/react';
import { useLabelPrinterTemplateStore, transformTemplateListToStore } from './useLabelPrinterTemplateStore';
import { useSelector } from 'react-redux';

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
}));

describe('useLabelPrinterTemplateStore', () => {
    const mockActions = { loadPrinterTemplateList: jest.fn() };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockRawTemplateList = [
        {
            printer_template_id: 1,
            printer_template_name: 'Template',
            printer_template_rendered: 'Code',
            identifiers: [{ printer_template_identifier_value: 'GK420t' }],
        },
    ];

    it('should return transformed printerTemplateList from Redux store', () => {
        useSelector.mockReturnValue({
            printerTemplateList: mockRawTemplateList,
            printerTemplateListLoading: false,
            printerTemplateListError: null,
        });

        const { result } = renderHook(() => useLabelPrinterTemplateStore(mockActions));

        expect(result.current.printerTemplateList).toEqual([
            { id: 1, name: 'Template', code: 'Code', printers: ['GK420t'] },
        ]);
    });

    it('should return empty transformed list when store list is empty', () => {
        useSelector.mockReturnValue({
            printerTemplateList: [],
            printerTemplateListLoading: false,
            printerTemplateListError: null,
        });

        const { result } = renderHook(() => useLabelPrinterTemplateStore(mockActions));

        expect(result.current.printerTemplateList).toEqual([]);
    });

    it('should call loadPrinterTemplateList when list is empty and not loading', () => {
        useSelector.mockReturnValue({
            printerTemplateList: [],
            printerTemplateListLoading: false,
            printerTemplateListError: null,
        });

        renderHook(() => useLabelPrinterTemplateStore(mockActions));

        expect(mockActions.loadPrinterTemplateList).toHaveBeenCalledTimes(1);
    });

    it('should NOT call loadPrinterTemplateList when list already has items', () => {
        useSelector.mockReturnValue({
            printerTemplateList: mockRawTemplateList,
            printerTemplateListLoading: false,
            printerTemplateListError: null,
        });

        renderHook(() => useLabelPrinterTemplateStore(mockActions));

        expect(mockActions.loadPrinterTemplateList).not.toHaveBeenCalled();
    });

    it('should NOT call loadPrinterTemplateList when loading is in progress', () => {
        useSelector.mockReturnValue({
            printerTemplateList: [],
            printerTemplateListLoading: true,
            printerTemplateListError: null,
        });

        renderHook(() => useLabelPrinterTemplateStore(mockActions));

        expect(mockActions.loadPrinterTemplateList).not.toHaveBeenCalled();
    });

    describe('transformTemplateListToStore', () => {
        it('should transform a raw template to store format', () => {
            const rawList = [
                {
                    printer_template_id: 1,
                    printer_template_name: 'GK420t Template',
                    printer_template_rendered: 'Hello {*NAME*}',
                    identifiers: [{ printer_template_identifier_value: 'GK420t' }],
                },
            ];

            const result = transformTemplateListToStore(rawList);

            expect(result).toEqual([{ id: 1, name: 'GK420t Template', code: 'Hello {*NAME*}', printers: ['GK420t'] }]);
        });

        it('should map multiple identifiers to the printers array', () => {
            const rawList = [
                {
                    printer_template_id: 2,
                    printer_template_name: 'Multi Printer',
                    printer_template_rendered: 'Code',
                    identifiers: [
                        { printer_template_identifier_value: 'GK420t' },
                        { printer_template_identifier_value: 'Zebra' },
                    ],
                },
            ];

            const result = transformTemplateListToStore(rawList);

            expect(result[0].printers).toEqual(['GK420t', 'Zebra']);
        });

        it('should handle a template with no identifiers', () => {
            const rawList = [
                {
                    printer_template_id: 3,
                    printer_template_name: 'No Printers',
                    printer_template_rendered: 'Code',
                    identifiers: [],
                },
            ];

            const result = transformTemplateListToStore(rawList);

            expect(result[0].printers).toEqual([]);
        });

        it('should return empty array for an empty template list', () => {
            const result = transformTemplateListToStore([]);

            expect(result).toEqual([]);
        });

        it('should transform multiple templates preserving order', () => {
            const rawList = [
                {
                    printer_template_id: 1,
                    printer_template_name: 'Template A',
                    printer_template_rendered: 'Code A',
                    identifiers: [{ printer_template_identifier_value: 'P1' }],
                },
                {
                    printer_template_id: 2,
                    printer_template_name: 'Template B',
                    printer_template_rendered: 'Code B',
                    identifiers: [{ printer_template_identifier_value: 'P2' }],
                },
            ];

            const result = transformTemplateListToStore(rawList);

            expect(result).toHaveLength(2);
            expect(result[0]).toEqual({ id: 1, name: 'Template A', code: 'Code A', printers: ['P1'] });
            expect(result[1]).toEqual({ id: 2, name: 'Template B', code: 'Code B', printers: ['P2'] });
        });
    });
});
