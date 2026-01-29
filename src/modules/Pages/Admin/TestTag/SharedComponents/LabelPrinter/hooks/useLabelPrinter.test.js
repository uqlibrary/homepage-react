import { renderHook, waitFor } from '@testing-library/react';
import useLabelPrinter, { removeNoNamePrinters, getAvailablePrinters } from './useLabelPrinter';
import printerRegistry from '../printers';
import useLabelPrinterTemplate from './useLabelPrinterTemplate';

jest.mock('../printers', () => ({
    printerRegistry: {
        zebra: jest.fn(),
        emulator: jest.fn(),
        unknown: jest.fn(),
    },
}));

jest.mock('./useLabelPrinterTemplate');

const mockPrinters = [
    { name: 'Printer 1', id: '1' },
    { name: 'Printer 2', id: '2' },
    { name: '', id: '3' },
    { name: 'Printer 4', id: '4' },
];

const mockTemplateStore = {
    'printer-1': 'template1',
    'printer-2': 'template2',
};

function setup(testProps = {}) {
    const {
        printerCode = 'zebra',
        templateStore = mockTemplateStore,
        shouldRemoveNoNamePrinters = true,
        shouldDisableUnknownPrinters = true,
        availablePrinters = mockPrinters,
        hasLabelPrinterTemplate = jest.fn(name => name === 'Printer 1' || name === 'Printer 2'),
        ...props
    } = testProps;

    const printerInstanceMock = {
        getAvailablePrinters: jest.fn().mockResolvedValue(availablePrinters),
    };

    printerRegistry[printerCode] = jest.fn(() => printerInstanceMock);

    useLabelPrinterTemplate.mockReturnValue({
        hasLabelPrinterTemplate,
    });

    const initialProps = {
        printerCode,
        templateStore,
        shouldRemoveNoNamePrinters,
        shouldDisableUnknownPrinters,
        ...props,
    };

    return renderHook(props => useLabelPrinter(props), { initialProps });
}

describe('useLabelPrinter', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('removeNoNamePrinters helper', () => {
        it('should remove printers without names when flag is true', async () => {
            const result = await removeNoNamePrinters(mockPrinters, true);
            expect(result).toHaveLength(3);
            expect(result).toEqual([
                { name: 'Printer 1', id: '1' },
                { name: 'Printer 2', id: '2' },
                { name: 'Printer 4', id: '4' },
            ]);
        });

        it('should not remove printers when flag is false', async () => {
            const result = await removeNoNamePrinters(mockPrinters, false);
            expect(result).toHaveLength(4);
            expect(result).toEqual(mockPrinters);
        });

        it('should handle empty array', async () => {
            const result = await removeNoNamePrinters([], true);
            expect(result).toEqual([]);
        });

        it('should handle undefined printers list', async () => {
            const result = await removeNoNamePrinters(undefined, true);
            expect(result).toEqual([]);
        });

        it('should handle printers with null names', async () => {
            const printersWithNull = [
                { name: null, id: '1' },
                { name: 'Valid', id: '2' },
            ];
            const result = await removeNoNamePrinters(printersWithNull, true);
            expect(result).toEqual([{ name: 'Valid', id: '2' }]);
        });
    });

    describe('getAvailablePrinters helper', () => {
        it('should return available printers from printer instance', async () => {
            const mockPrinterInstance = {
                getAvailablePrinters: jest.fn().mockResolvedValue(mockPrinters),
            };

            const result = await getAvailablePrinters(mockPrinterInstance);

            expect(mockPrinterInstance.getAvailablePrinters).toHaveBeenCalled();
            expect(result).toEqual(mockPrinters);
        });

        it('should return empty array when printer instance returns null', async () => {
            const mockPrinterInstance = {
                getAvailablePrinters: jest.fn().mockResolvedValue(null),
            };

            const result = await getAvailablePrinters(mockPrinterInstance);

            expect(result).toEqual([]);
        });

        it('should return empty array when printer instance returns undefined', async () => {
            const mockPrinterInstance = {
                getAvailablePrinters: jest.fn().mockResolvedValue(undefined),
            };

            const result = await getAvailablePrinters(mockPrinterInstance);

            expect(result).toEqual([]);
        });

        it('should return empty array when printer instance is null', async () => {
            const result = await getAvailablePrinters(null);

            expect(result).toEqual([]);
        });

        it('should return empty array when printer instance is undefined', async () => {
            const result = await getAvailablePrinters(undefined);

            expect(result).toEqual([]);
        });

        it('should return empty array when printer instance has no getAvailablePrinters method', async () => {
            const incompletePrinterInstance = {};

            // When the object exists but the method doesn't, optional chaining still throws
            await expect(getAvailablePrinters(incompletePrinterInstance)).rejects.toThrow(
                'printerInstance.getAvailablePrinters is not a function',
            );
        });

        it('should handle empty array response from printer instance', async () => {
            const mockPrinterInstance = {
                getAvailablePrinters: jest.fn().mockResolvedValue([]),
            };

            const result = await getAvailablePrinters(mockPrinterInstance);

            expect(result).toEqual([]);
        });

        it('should handle promise rejection gracefully', async () => {
            const mockPrinterInstance = {
                getAvailablePrinters: jest.fn().mockRejectedValue(new Error('Printer error')),
            };

            await expect(getAvailablePrinters(mockPrinterInstance)).rejects.toThrow('Printer error');
        });
    });

    describe('hook initialization', () => {
        it('should initialize with default values', async () => {
            const { result } = setup();

            expect(result.current.printerCode).toBe('zebra');
            expect(result.current.printer).toBeDefined();
            expect(result.current.availablePrinters).toEqual([]);

            await waitFor(() => {
                expect(result.current.availablePrinters.length).toBeGreaterThan(0);
            });
        });

        it('should create printer instance from registry', () => {
            const { result } = setup({ printerCode: 'zebra' });

            expect(printerRegistry.zebra).toHaveBeenCalled();
            expect(result.current.printer).toBeDefined();
            expect(result.current.printerCode).toBe('zebra');
        });

        it('should create emulator printer instance', () => {
            const { result } = setup({ printerCode: 'emulator' });

            expect(printerRegistry.emulator).toHaveBeenCalled();
            expect(result.current.printerCode).toBe('emulator');
        });
    });

    describe('available printers filtering', () => {
        it('should fetch and filter available printers with defaults', async () => {
            const { result } = setup();

            await waitFor(() => {
                expect(result.current.availablePrinters).toHaveLength(3);
            });

            // Should remove no-name printers
            expect(result.current.availablePrinters).toEqual([
                { name: 'Printer 1', id: '1', noconfig: false },
                { name: 'Printer 2', id: '2', noconfig: false },
                { name: 'Printer 4', id: '4', noconfig: true },
            ]);
        });

        it('should not remove no-name printers when shouldRemoveNoNamePrinters is false', async () => {
            const { result } = setup({ shouldRemoveNoNamePrinters: false });

            await waitFor(() => {
                expect(result.current.availablePrinters).toHaveLength(4);
            });

            expect(result.current.availablePrinters[2]).toEqual({ name: '', id: '3', noconfig: true });
        });

        it('should not disable unknown printers when shouldDisableUnknownPrinters is false', async () => {
            const { result } = setup({ shouldDisableUnknownPrinters: false });

            await waitFor(() => {
                expect(result.current.availablePrinters.length).toBeGreaterThan(0);
            });

            result.current.availablePrinters.forEach(printer => {
                expect(printer.noconfig).toBeUndefined();
            });
        });

        it('should mark printers without templates as noconfig', async () => {
            const hasLabelPrinterTemplate = jest.fn(name => name === 'Printer 1');
            const { result } = setup({ hasLabelPrinterTemplate });

            await waitFor(() => {
                expect(result.current.availablePrinters).toHaveLength(3);
            });

            expect(result.current.availablePrinters[0].noconfig).toBe(false);
            expect(result.current.availablePrinters[1].noconfig).toBe(true);
            expect(result.current.availablePrinters[2].noconfig).toBe(true);
        });

        it('should handle empty available printers list', async () => {
            const { result } = setup({ availablePrinters: [] });

            await waitFor(() => {
                expect(result.current.availablePrinters).toEqual([]);
            });
        });

        it('should handle null response from getAvailablePrinters', async () => {
            const printerInstanceMock = {
                getAvailablePrinters: jest.fn().mockResolvedValue(null),
            };
            printerRegistry.zebra = jest.fn(() => printerInstanceMock);

            const { result } = setup();

            await waitFor(() => {
                expect(result.current.availablePrinters).toEqual([]);
            });
        });

        it('should handle undefined response from getAvailablePrinters', async () => {
            const printerInstanceMock = {
                getAvailablePrinters: jest.fn().mockResolvedValue(undefined),
            };
            printerRegistry.zebra = jest.fn(() => printerInstanceMock);

            const { result } = setup();

            await waitFor(() => {
                expect(result.current.availablePrinters).toEqual([]);
            });
        });
    });

    describe('printer instance changes', () => {
        it('should update printer instance when printerCode changes', async () => {
            const { result, rerender } = setup({ printerCode: 'zebra' });

            expect(result.current.printerCode).toBe('zebra');
            expect(printerRegistry.zebra).toHaveBeenCalled();

            // Change printer code
            rerender({ printerCode: 'emulator', templateStore: mockTemplateStore });

            expect(result.current.printerCode).toBe('emulator');
            expect(printerRegistry.emulator).toHaveBeenCalled();
        });

        it('should refetch available printers when printer instance changes', async () => {
            const zebraPrinters = [{ name: 'Zebra Printer', id: 'z1' }];
            const emulatorPrinters = [{ name: 'Emulator Printer', id: 'e1' }];

            const zebraMock = {
                getAvailablePrinters: jest.fn().mockResolvedValue(zebraPrinters),
            };
            const emulatorMock = {
                getAvailablePrinters: jest.fn().mockResolvedValue(emulatorPrinters),
            };

            printerRegistry.zebra = jest.fn(() => zebraMock);
            printerRegistry.emulator = jest.fn(() => emulatorMock);

            const hasLabelPrinterTemplate = jest.fn(() => true);
            const { result, rerender } = setup({
                printerCode: 'zebra',
                availablePrinters: zebraPrinters,
                hasLabelPrinterTemplate,
            });

            await waitFor(() => {
                expect(result.current.availablePrinters).toHaveLength(1);
                expect(result.current.availablePrinters[0].name).toBe('Zebra Printer');
            });

            // Change to emulator - need to update the mock to return emulator printers
            printerRegistry.emulator = jest.fn(() => ({
                getAvailablePrinters: jest.fn().mockResolvedValue(emulatorPrinters),
            }));

            rerender({
                printerCode: 'emulator',
                templateStore: mockTemplateStore,
                shouldRemoveNoNamePrinters: true,
                shouldDisableUnknownPrinters: true,
            });

            await waitFor(
                () => {
                    expect(result.current.availablePrinters).toHaveLength(1);
                    expect(result.current.availablePrinters[0].name).toBe('Emulator Printer');
                },
                { timeout: 2000 },
            );
        });
    });

    describe('template store integration', () => {
        it('should use hasLabelPrinterTemplate from useLabelPrinterTemplate hook', async () => {
            const hasLabelPrinterTemplate = jest.fn(() => true);
            const { result } = setup({ hasLabelPrinterTemplate });

            await waitFor(() => {
                expect(result.current.availablePrinters.length).toBeGreaterThan(0);
            });

            expect(useLabelPrinterTemplate).toHaveBeenCalledWith(mockTemplateStore);
        });

        it('should pass custom templateStore to useLabelPrinterTemplate', async () => {
            const customTemplateStore = { 'custom-printer': 'custom-template' };
            setup({ templateStore: customTemplateStore });

            expect(useLabelPrinterTemplate).toHaveBeenCalledWith(customTemplateStore);
        });

        it('should handle empty templateStore', async () => {
            const hasLabelPrinterTemplate = jest.fn(() => false);
            const { result } = setup({ templateStore: {}, hasLabelPrinterTemplate });

            await waitFor(() => {
                expect(result.current.availablePrinters.length).toBeGreaterThan(0);
            });

            result.current.availablePrinters.forEach(printer => {
                expect(printer.noconfig).toBe(true);
            });
        });
    });

    describe('effect dependencies', () => {
        it('should refetch printers when shouldRemoveNoNamePrinters changes', async () => {
            const { result, rerender } = setup({ shouldRemoveNoNamePrinters: true });

            await waitFor(() => {
                expect(result.current.availablePrinters).toHaveLength(3);
            });

            rerender({
                printerCode: 'zebra',
                templateStore: mockTemplateStore,
                shouldRemoveNoNamePrinters: false,
            });

            await waitFor(() => {
                expect(result.current.availablePrinters).toHaveLength(4);
            });
        });

        it('should refetch printers when shouldDisableUnknownPrinters changes', async () => {
            const { result, rerender } = setup({ shouldDisableUnknownPrinters: true });

            await waitFor(() => {
                expect(result.current.availablePrinters[2].noconfig).toBeDefined();
            });

            rerender({
                printerCode: 'zebra',
                templateStore: mockTemplateStore,
                shouldDisableUnknownPrinters: false,
            });

            await waitFor(() => {
                result.current.availablePrinters.forEach(printer => {
                    expect(printer.noconfig).toBeUndefined();
                });
            });
        });
    });

    describe('error handling', () => {
        it('should handle printer instance without getAvailablePrinters method', async () => {
            const incompletePrinterMock = {};
            printerRegistry.zebra = jest.fn(() => incompletePrinterMock);

            const { result } = setup();

            await waitFor(() => {
                expect(result.current.availablePrinters).toEqual([]);
            });
        });

        it('should handle null printer instance', async () => {
            printerRegistry.zebra = jest.fn(() => null);

            const { result } = setup();

            await waitFor(() => {
                expect(result.current.availablePrinters).toEqual([]);
            });
        });

        it('should handle undefined printer instance', async () => {
            printerRegistry.zebra = jest.fn(() => undefined);

            const { result } = setup();

            await waitFor(() => {
                expect(result.current.availablePrinters).toEqual([]);
            });
        });

        it('should handle getAvailablePrinters promise rejection', async () => {
            const printerInstanceMock = {
                getAvailablePrinters: jest.fn().mockRejectedValue(new Error('Printer error')),
            };
            printerRegistry.zebra = jest.fn(() => printerInstanceMock);

            const { result } = setup();

            // Should not crash and should maintain empty array
            await waitFor(() => {
                expect(result.current.availablePrinters).toEqual([]);
            });
        });
    });
});
