import { renderHook } from 'test-utils';
import { useCreatePrinter } from './ZebraClass';

// Mock zebra-browser-print-wrapper
const mockGetAvailablePrinters = jest.fn();
const mockCheckPrinterStatus = jest.fn();
const mockSetPrinter = jest.fn();
const mockPrint = jest.fn();

jest.mock('zebra-browser-print-wrapper', () => {
    return jest.fn().mockImplementation(() => ({
        getAvailablePrinters: mockGetAvailablePrinters,
        checkPrinterStatus: mockCheckPrinterStatus,
        setPrinter: mockSetPrinter,
        print: mockPrint,
    }));
});

describe('ZebraClass', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('useCreatePrinter hook', () => {
        it('should return an object with expected properties', () => {
            const { result } = renderHook(() => useCreatePrinter());

            expect(result.current).toHaveProperty('code');
            expect(result.current).toHaveProperty('getAvailablePrinters');
            expect(result.current).toHaveProperty('getConnectionStatus');
            expect(result.current).toHaveProperty('setPrinter');
            expect(result.current).toHaveProperty('print');
        });

        it('should return code as "zebra"', () => {
            const { result } = renderHook(() => useCreatePrinter());

            expect(result.current.code).toBe('zebra');
        });

        it('should return getAvailablePrinters as a function', () => {
            const { result } = renderHook(() => useCreatePrinter());

            expect(typeof result.current.getAvailablePrinters).toBe('function');
        });

        it('should return getConnectionStatus as a function', () => {
            const { result } = renderHook(() => useCreatePrinter());

            expect(typeof result.current.getConnectionStatus).toBe('function');
        });

        it('should return setPrinter as a function', () => {
            const { result } = renderHook(() => useCreatePrinter());

            expect(typeof result.current.setPrinter).toBe('function');
        });

        it('should return print as a function', () => {
            const { result } = renderHook(() => useCreatePrinter());

            expect(typeof result.current.print).toBe('function');
        });
    });

    describe('printer functionality', () => {
        it('should call getAvailablePrinters from wrapper', async () => {
            const mockPrinters = [{ name: 'Zebra Printer 1' }, { name: 'Zebra Printer 2' }];
            mockGetAvailablePrinters.mockResolvedValueOnce(mockPrinters);

            const { result } = renderHook(() => useCreatePrinter());
            const printers = await result.current.getAvailablePrinters();

            expect(mockGetAvailablePrinters).toHaveBeenCalled();
            expect(printers).toEqual(mockPrinters);
        });

        it('should return connection status when printer is ready', async () => {
            const mockStatus = {
                isReadyToPrint: true,
                isError: false,
                errors: [],
            };
            mockCheckPrinterStatus.mockResolvedValueOnce(mockStatus);

            const { result } = renderHook(() => useCreatePrinter());
            const status = await result.current.getConnectionStatus();

            expect(mockCheckPrinterStatus).toHaveBeenCalled();
            expect(status).toEqual({
                ready: true,
                error: false,
                errors: [],
            });
        });

        it('should return connection status when printer has error', async () => {
            const mockStatus = {
                isReadyToPrint: false,
                isError: true,
                errors: ['Paper jam', 'Low ink'],
            };
            mockCheckPrinterStatus.mockResolvedValueOnce(mockStatus);

            const { result } = renderHook(() => useCreatePrinter());
            const status = await result.current.getConnectionStatus();

            expect(mockCheckPrinterStatus).toHaveBeenCalled();
            expect(status).toEqual({
                ready: false,
                error: true,
                errors: ['Paper jam', 'Low ink'],
            });
        });

        it('should call setPrinter from wrapper', async () => {
            const selectedPrinter = { name: 'Zebra Printer 1' };
            mockSetPrinter.mockResolvedValueOnce(undefined);

            const { result } = renderHook(() => useCreatePrinter());
            await result.current.setPrinter(selectedPrinter);

            expect(mockSetPrinter).toHaveBeenCalledWith(selectedPrinter);
        });

        it('should call print from wrapper with print data', async () => {
            const printData = '^XA^FO50,50^ADN,36,20^FDTest Label^FS^XZ';
            mockPrint.mockResolvedValueOnce(undefined);

            const { result } = renderHook(() => useCreatePrinter());
            await result.current.print(printData);

            expect(mockPrint).toHaveBeenCalledWith(printData);
        });
    });

    describe('error handling - catch blocks (coverage)', () => {
        describe('getAvailablePrinters error handling', () => {
            it('should return empty array when getAvailablePrinters throws error', async () => {
                const error = new Error('Zebra Browser Print not running');
                mockGetAvailablePrinters.mockRejectedValueOnce(error);

                const { result } = renderHook(() => useCreatePrinter());
                const printers = await result.current.getAvailablePrinters();

                expect(mockGetAvailablePrinters).toHaveBeenCalled();
                expect(printers).toEqual([]);
            });

            it('should handle network errors when getting available printers', async () => {
                const networkError = new Error('Network request failed');
                mockGetAvailablePrinters.mockRejectedValueOnce(networkError);

                const { result } = renderHook(() => useCreatePrinter());
                const printers = await result.current.getAvailablePrinters();

                expect(printers).toEqual([]);
            });
        });

        describe('getConnectionStatus error handling', () => {
            it('should return error status when checkPrinterStatus throws error', async () => {
                const error = new Error('Printer communication failed');
                mockCheckPrinterStatus.mockRejectedValueOnce(error);

                const { result } = renderHook(() => useCreatePrinter());
                const status = await result.current.getConnectionStatus();

                expect(mockCheckPrinterStatus).toHaveBeenCalled();
                expect(status).toEqual({
                    ready: false,
                    error: true,
                    errors: ['Zebra Browser Print application is not running'],
                });
            });

            it('should handle timeout errors when checking connection status', async () => {
                const timeoutError = new Error('Connection timeout');
                mockCheckPrinterStatus.mockRejectedValueOnce(timeoutError);

                const { result } = renderHook(() => useCreatePrinter());
                const status = await result.current.getConnectionStatus();

                expect(status.ready).toBe(false);
                expect(status.error).toBe(true);
                expect(status.errors).toContain('Zebra Browser Print application is not running');
            });

            it('should handle application not running error', async () => {
                const appError = new Error('Zebra Browser Print application is not running');
                mockCheckPrinterStatus.mockRejectedValueOnce(appError);

                const { result } = renderHook(() => useCreatePrinter());
                const status = await result.current.getConnectionStatus();

                expect(status).toEqual({
                    ready: false,
                    error: true,
                    errors: ['Zebra Browser Print application is not running'],
                });
            });
        });

        describe('setPrinter error handling', () => {
            it('should handle error gracefully when setPrinter fails', async () => {
                const error = new Error('Failed to connect to printer');
                mockSetPrinter.mockRejectedValueOnce(error);

                const { result } = renderHook(() => useCreatePrinter());
                const selectedPrinter = { name: 'Zebra Printer 1' };

                // Should not throw, but handle gracefully
                await expect(result.current.setPrinter(selectedPrinter)).resolves.not.toThrow();

                expect(mockSetPrinter).toHaveBeenCalledWith(selectedPrinter);
            });

            it('should handle invalid printer selection error', async () => {
                const invalidError = new Error('Printer not found');
                mockSetPrinter.mockRejectedValueOnce(invalidError);

                const { result } = renderHook(() => useCreatePrinter());

                // Should not throw error to caller
                await expect(result.current.setPrinter({ name: 'Invalid Printer' })).resolves.not.toThrow();
            });

            it('should handle null printer selection', async () => {
                const nullError = new Error('Printer is null');
                mockSetPrinter.mockRejectedValueOnce(nullError);

                const { result } = renderHook(() => useCreatePrinter());

                // Should not throw error to caller
                await expect(result.current.setPrinter(null)).resolves.not.toThrow();
            });
        });

        describe('print error handling', () => {
            it('should throw error when print fails', async () => {
                const error = new Error('Printer is offline');
                mockPrint.mockRejectedValueOnce(error);

                const { result } = renderHook(() => useCreatePrinter());
                const printData = '^XA^FO50,50^ADN,36,20^FDTest Label^FS^XZ';

                await expect(result.current.print(printData)).rejects.toThrow(
                    'Unable to print. Please ensure Zebra Browser Print is running.',
                );

                expect(mockPrint).toHaveBeenCalledWith(printData);
            });

            it('should handle paper jam error during print', async () => {
                const paperJamError = new Error('Paper jam detected');
                mockPrint.mockRejectedValueOnce(paperJamError);

                const { result } = renderHook(() => useCreatePrinter());
                const printData = '^XA^FO50,50^ADN,36,20^FDTest Label^FS^XZ';

                await expect(result.current.print(printData)).rejects.toThrow(
                    'Unable to print. Please ensure Zebra Browser Print is running.',
                );
            });

            it('should handle printer not set error', async () => {
                const notSetError = new Error('No printer selected');
                mockPrint.mockRejectedValueOnce(notSetError);

                const { result } = renderHook(() => useCreatePrinter());

                await expect(result.current.print('test data')).rejects.toThrow(
                    'Unable to print. Please ensure Zebra Browser Print is running.',
                );
            });

            it('should handle communication error during print', async () => {
                const commError = new Error('Communication timeout');
                mockPrint.mockRejectedValueOnce(commError);

                const { result } = renderHook(() => useCreatePrinter());
                const printData = '^XA^FO50,50^ADN,36,20^FDTest Label^FS^XZ';

                await expect(result.current.print(printData)).rejects.toThrow(
                    'Unable to print. Please ensure Zebra Browser Print is running.',
                );
            });

            it('should attempt to call print wrapper even if error occurs', async () => {
                mockPrint.mockRejectedValueOnce(new Error('Print failed'));

                const { result } = renderHook(() => useCreatePrinter());

                await expect(result.current.print('test')).rejects.toThrow(
                    'Unable to print. Please ensure Zebra Browser Print is running.',
                );

                expect(mockPrint).toHaveBeenCalledWith('test');
            });
        });
    });
});
