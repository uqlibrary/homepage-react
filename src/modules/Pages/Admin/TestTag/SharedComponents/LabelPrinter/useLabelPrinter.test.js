import { renderHook, waitFor } from 'test-utils';
import { useCookies } from 'react-cookie';
import useLabelPrinter, {
    COOKIE_PRINTER_PREFERENCE,
    isKnownPrinter,
    disabledUnknownPrinters,
    removeNoNamePrinters,
} from './useLabelPrinter';
import { printerRegistry } from './LabelPrinterRegister';
import labelPrinterTemplate from './LabelPrinterTemplate';

jest.mock('react-cookie');

function setup(testProps = {}) {
    const defaultProps = {
        printerCode: 'zebra',
        shouldRemoveNoNamePrinters: true,
        shouldDisableUnknownPrinters: true,
        ...testProps,
    };

    return renderHook(() => useLabelPrinter(defaultProps));
}

describe('useLabelPrinter', () => {
    let mockSetCookie;
    let mockGetAvailablePrinters;
    let mockPrinterInstance;

    beforeEach(() => {
        mockSetCookie = jest.fn();
        mockGetAvailablePrinters = jest.fn();
        mockPrinterInstance = {
            getAvailablePrinters: mockGetAvailablePrinters,
        };

        useCookies.mockReturnValue([{}, mockSetCookie]);
        printerRegistry.zebra = jest.fn(() => mockPrinterInstance);
        printerRegistry.emulator = jest.fn(() => mockPrinterInstance);

        labelPrinterTemplate.Printer1 = {};
        labelPrinterTemplate.Printer2 = {};
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Hook behavior', () => {
        it('returns default values on initial render', () => {
            mockGetAvailablePrinters.mockResolvedValue([]);

            const { result } = setup();

            expect(result.current.printerCode).toBe('zebra');
            expect(result.current.printer).toBe(mockPrinterInstance);
            expect(result.current.availablePrinters).toEqual([]);
            expect(result.current.printerPreference).toBeNull();
        });

        it('uses printerCode from props', () => {
            mockGetAvailablePrinters.mockResolvedValue([]);

            const { result } = setup({ printerCode: 'emulator' });

            expect(result.current.printerCode).toBe('emulator');
            expect(printerRegistry.emulator).toHaveBeenCalled();
        });

        it('retrieves printer preference from cookies', () => {
            useCookies.mockReturnValue([{ [COOKIE_PRINTER_PREFERENCE]: 'Printer1' }, mockSetCookie]);
            mockGetAvailablePrinters.mockResolvedValue([]);

            const { result } = setup();

            expect(result.current.printerPreference).toBe('Printer1');
        });

        it('returns null preference when cookie is not set', () => {
            useCookies.mockReturnValue([{}, mockSetCookie]);
            mockGetAvailablePrinters.mockResolvedValue([]);

            const { result } = setup();

            expect(result.current.printerPreference).toBeNull();
        });

        it('provides setPrinterPreference function that sets cookie', () => {
            mockGetAvailablePrinters.mockResolvedValue([]);

            const { result } = setup();

            result.current.setPrinterPreference('Printer2');

            expect(mockSetCookie).toHaveBeenCalledWith(COOKIE_PRINTER_PREFERENCE, 'Printer2', { path: '/' });
        });

        it('fetches and sets available printers', async () => {
            const printers = [{ name: 'Printer1' }, { name: 'Printer2' }];
            mockGetAvailablePrinters.mockResolvedValue(printers);

            const { result } = setup();

            await waitFor(() => {
                expect(result.current.availablePrinters).toHaveLength(2);
            });

            expect(result.current.availablePrinters).toEqual([
                { name: 'Printer1', noconfig: false },
                { name: 'Printer2', noconfig: false },
            ]);
            expect(mockGetAvailablePrinters).toHaveBeenCalled();
        });

        it('filters out printers without names when shouldRemoveNoNamePrinters is true', async () => {
            const printers = [{ name: 'Printer1' }, { name: '' }, { name: 'Printer2' }, { name: null }];
            mockGetAvailablePrinters.mockResolvedValue(printers);

            const { result } = setup({ shouldRemoveNoNamePrinters: true });

            await waitFor(() => {
                expect(result.current.availablePrinters).toHaveLength(2);
            });

            expect(result.current.availablePrinters).toEqual([
                { name: 'Printer1', noconfig: false },
                { name: 'Printer2', noconfig: false },
            ]);
        });

        it('keeps printers without names when shouldRemoveNoNamePrinters is false', async () => {
            const printers = [{ name: 'Printer1' }, { name: '' }, { name: 'Printer2' }];
            mockGetAvailablePrinters.mockResolvedValue(printers);

            const { result } = setup({ shouldRemoveNoNamePrinters: false });

            await waitFor(() => {
                expect(result.current.availablePrinters).toHaveLength(3);
            });

            expect(result.current.availablePrinters).toEqual([
                { name: 'Printer1', noconfig: false },
                { name: '', noconfig: true },
                { name: 'Printer2', noconfig: false },
            ]);
        });

        it('marks unknown printers when shouldDisableUnknownPrinters is true', async () => {
            const printers = [{ name: 'Printer1' }, { name: 'UnknownPrinter' }];
            mockGetAvailablePrinters.mockResolvedValue(printers);

            const { result } = setup({ shouldDisableUnknownPrinters: true });

            await waitFor(() => {
                expect(result.current.availablePrinters).toHaveLength(2);
            });

            expect(result.current.availablePrinters[0]).toEqual({ name: 'Printer1', noconfig: false });
            expect(result.current.availablePrinters[1]).toEqual({ name: 'UnknownPrinter', noconfig: true });
        });

        it('does not mark unknown printers when shouldDisableUnknownPrinters is false', async () => {
            const printers = [{ name: 'Printer1' }, { name: 'UnknownPrinter' }];
            mockGetAvailablePrinters.mockResolvedValue(printers);

            const { result } = setup({ shouldDisableUnknownPrinters: false });

            await waitFor(() => {
                expect(result.current.availablePrinters).toHaveLength(2);
            });

            // When shouldDisableUnknownPrinters is false, printers are returned as-is
            expect(result.current.availablePrinters).toEqual(printers);
        });
        it('applies both filters when both are enabled', async () => {
            const printers = [
                { name: 'Printer1' },
                { name: '' },
                { name: 'UnknownPrinter' },
                { name: 'Printer2' },
                { name: null },
            ];
            mockGetAvailablePrinters.mockResolvedValue(printers);

            const { result } = setup({
                shouldRemoveNoNamePrinters: true,
                shouldDisableUnknownPrinters: true,
            });

            await waitFor(() => {
                expect(result.current.availablePrinters).toHaveLength(3);
            });

            expect(result.current.availablePrinters).toEqual([
                { name: 'Printer1', noconfig: false },
                { name: 'UnknownPrinter', noconfig: true },
                { name: 'Printer2', noconfig: false },
            ]);
        });

        it('updates available printers when printerCode changes', async () => {
            const zebraPrinters = [{ name: 'ZebraPrinter' }];
            const emulatorPrinters = [{ name: 'EmulatorPrinter' }];

            // Setup mock to return different printers based on which registry is called
            const mockZebraInstance = {
                getAvailablePrinters: jest.fn().mockResolvedValue(zebraPrinters),
            };
            const mockEmulatorInstance = {
                getAvailablePrinters: jest.fn().mockResolvedValue(emulatorPrinters),
            };

            printerRegistry.zebra = jest.fn(() => mockZebraInstance);
            printerRegistry.emulator = jest.fn(() => mockEmulatorInstance);

            const { result, rerender } = renderHook(
                ({ printerCode, shouldRemoveNoNamePrinters, shouldDisableUnknownPrinters }) =>
                    useLabelPrinter({ printerCode, shouldRemoveNoNamePrinters, shouldDisableUnknownPrinters }),
                {
                    initialProps: {
                        printerCode: 'zebra',
                        shouldRemoveNoNamePrinters: true,
                        shouldDisableUnknownPrinters: true,
                    },
                },
            );

            await waitFor(() => {
                expect(result.current.availablePrinters).toEqual([{ name: 'ZebraPrinter', noconfig: true }]);
            });

            // Rerender with new printerCode
            rerender({
                printerCode: 'emulator',
                shouldRemoveNoNamePrinters: true,
                shouldDisableUnknownPrinters: true,
            });

            await waitFor(() => {
                expect(result.current.availablePrinters).toEqual([{ name: 'EmulatorPrinter', noconfig: true }]);
            });
        });
        describe('coverage', () => {
            it('handles empty printer list', async () => {
                mockGetAvailablePrinters.mockResolvedValue([]);

                const { result } = setup();

                await waitFor(() => {
                    expect(result.current.availablePrinters).toEqual([]);
                });
            });

            it('handles null printer instance', async () => {
                printerRegistry.zebra = jest.fn(() => null);

                const { result } = setup();

                await waitFor(() => {
                    expect(result.current.availablePrinters).toEqual([]);
                });

                expect(result.current.printer).toBeNull();
            });

            it('handles undefined printer instance', async () => {
                printerRegistry.zebra = jest.fn(() => undefined);

                const { result } = setup();

                await waitFor(() => {
                    expect(result.current.availablePrinters).toEqual([]);
                });

                expect(result.current.printer).toBeUndefined();
            });

            it('handles getAvailablePrinters returning null', async () => {
                mockGetAvailablePrinters.mockResolvedValue(null);

                const { result } = setup();

                await waitFor(() => {
                    expect(result.current.availablePrinters).toEqual([]);
                });
            });

            it('handles getAvailablePrinters returning undefined', async () => {
                mockGetAvailablePrinters.mockResolvedValue(undefined);

                const { result } = setup();

                await waitFor(() => {
                    expect(result.current.availablePrinters).toEqual([]);
                });
            });
        });
    });

    describe('isKnownPrinter', () => {
        beforeEach(() => {
            labelPrinterTemplate.KnownPrinter1 = {};
            labelPrinterTemplate.KnownPrinter2 = {};
        });

        it('returns true for known printer', () => {
            expect(isKnownPrinter('KnownPrinter1')).toBe(true);
            expect(isKnownPrinter('KnownPrinter2')).toBe(true);
        });

        it('returns false for unknown printer', () => {
            expect(isKnownPrinter('UnknownPrinter')).toBe(false);
        });

        describe('coverage', () => {
            it('returns false for empty string', () => {
                expect(isKnownPrinter('')).toBe(false);
            });

            it('returns false for null', () => {
                expect(isKnownPrinter(null)).toBe(false);
            });

            it('returns false for undefined', () => {
                expect(isKnownPrinter(undefined)).toBe(false);
            });

            it('returns false when called without arguments', () => {
                expect(isKnownPrinter()).toBe(false);
            });
        });
    });

    describe('disabledUnknownPrinters', () => {
        beforeEach(() => {
            labelPrinterTemplate.Printer1 = {};
            labelPrinterTemplate.Printer2 = {};
        });

        it('marks unknown printers with noconfig when enabled', async () => {
            const printers = [{ name: 'Printer1' }, { name: 'UnknownPrinter' }, { name: 'Printer2' }];

            const result = await disabledUnknownPrinters(printers, true);

            expect(result).toEqual([
                { name: 'Printer1', noconfig: false },
                { name: 'UnknownPrinter', noconfig: true },
                { name: 'Printer2', noconfig: false },
            ]);
        });

        it('returns original list when disabled', async () => {
            const printers = [{ name: 'Printer1' }, { name: 'UnknownPrinter' }];

            const result = await disabledUnknownPrinters(printers, false);

            expect(result).toEqual(printers);
        });

        describe('coverage', () => {
            it('handles empty array', async () => {
                const result = await disabledUnknownPrinters([], true);

                expect(result).toEqual([]);
            });

            it('handles printers without name property', async () => {
                const printers = [{ noconfig: false }, { id: 1 }];

                const result = await disabledUnknownPrinters(printers, true);

                expect(result).toEqual([{ noconfig: true }, { id: 1, noconfig: true }]);
            });

            it('preserves existing properties', async () => {
                const printers = [{ name: 'Printer1', id: 1, status: 'online' }];

                const result = await disabledUnknownPrinters(printers, true);

                expect(result).toEqual([{ name: 'Printer1', id: 1, status: 'online', noconfig: false }]);
            });

            it('handles mixed case printer names', async () => {
                labelPrinterTemplate.Printer1 = {}; // Exact match
                const printers = [{ name: 'Printer1' }, { name: 'printer1' }];

                const result = await disabledUnknownPrinters(printers, true);

                expect(result[0].noconfig).toBe(false); // 'Printer1' is in template
                expect(result[1].noconfig).toBe(true); // 'printer1' not in template (case sensitive)
            });
        });
    });

    describe('removeNoNamePrinters', () => {
        it('removes printers without names when enabled', async () => {
            const printers = [{ name: 'Printer1' }, { name: '' }, { name: 'Printer2' }, { name: null }];

            const result = await removeNoNamePrinters(printers, true);

            expect(result).toEqual([{ name: 'Printer1' }, { name: 'Printer2' }]);
        });

        it('returns original list when disabled', async () => {
            const printers = [{ name: 'Printer1' }, { name: '' }, { name: null }];

            const result = await removeNoNamePrinters(printers, false);

            expect(result).toEqual(printers);
        });
        describe('coverage', () => {
            it('handles empty array', async () => {
                const result = await removeNoNamePrinters([], true);

                expect(result).toEqual([]);
            });

            it('handles undefined printers list', async () => {
                const result = await removeNoNamePrinters(undefined, true);

                expect(result).toEqual([]);
            });

            it('handles printers without name property', async () => {
                const printers = [{ id: 1 }, { status: 'online' }];

                const result = await removeNoNamePrinters(printers, true);

                expect(result).toEqual([]);
            });

            it('keeps printers with falsy but defined names when disabled', async () => {
                const printers = [{ name: 0 }, { name: false }];

                const result = await removeNoNamePrinters(printers, false);

                expect(result).toEqual(printers);
            });

            it('filters out printers with undefined name', async () => {
                const printers = [{ name: 'Printer1' }, { name: undefined }, { name: 'Printer2' }];

                const result = await removeNoNamePrinters(printers, true);

                expect(result).toEqual([{ name: 'Printer1' }, { name: 'Printer2' }]);
            });

            it('preserves all properties of kept printers', async () => {
                const printers = [
                    { name: 'Printer1', id: 1, status: 'online' },
                    { name: '', id: 2 },
                    { name: 'Printer2', id: 3, port: 9100 },
                ];

                const result = await removeNoNamePrinters(printers, true);

                expect(result).toEqual([
                    { name: 'Printer1', id: 1, status: 'online' },
                    { name: 'Printer2', id: 3, port: 9100 },
                ]);
            });
        });
    });

    describe('COOKIE_PRINTER_PREFERENCE constant', () => {
        it('has the correct value', () => {
            expect(COOKIE_PRINTER_PREFERENCE).toBe('TNT_LABEL_PRINTER_PREFERENCE');
        });
    });
});
