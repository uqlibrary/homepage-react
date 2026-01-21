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

            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

            const { result } = renderHook(() => useCreatePrinter());
            await result.current.print(printData);

            expect(consoleSpy).toHaveBeenCalledWith('Sending print data to printer...');
            expect(mockPrint).toHaveBeenCalledWith(printData);

            consoleSpy.mockRestore();
        });
    });
});
