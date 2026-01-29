import { renderHook } from 'test-utils';
import { useCreatePrinter } from './EmulatorClass';

// Mock fetch
global.fetch = jest.fn();

describe('EmulatorClass', () => {
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

        it('should return code as "emulator"', () => {
            const { result } = renderHook(() => useCreatePrinter());

            expect(result.current.code).toBe('emulator');
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
        it('should return available printers', async () => {
            const { result } = renderHook(() => useCreatePrinter());

            const printers = await result.current.getAvailablePrinters();

            expect(Array.isArray(printers)).toBe(true);
            expect(printers).toHaveLength(3);
            expect(printers[0]).toHaveProperty('name', 'Emulator');
            expect(printers[1]).toHaveProperty('name', 'New printer');
            expect(printers[2]).toHaveProperty('name', null);
        });

        it('should return connection status as ready', async () => {
            const { result } = renderHook(() => useCreatePrinter());

            const status = await result.current.getConnectionStatus();

            expect(status).toEqual({
                ready: true,
                error: false,
                errors: [],
            });
        });

        it('should set printer and return the selected printer', async () => {
            const { result } = renderHook(() => useCreatePrinter());
            const selectedPrinter = { name: 'Test Printer' };

            const returnedPrinter = await result.current.setPrinter(selectedPrinter);

            expect(returnedPrinter).toEqual(selectedPrinter);
        });

        it('should call fetch with correct parameters when printing', async () => {
            const { result } = renderHook(() => useCreatePrinter());
            const mockResponse = { ok: true };
            global.fetch.mockResolvedValueOnce(mockResponse);
            const printData = '^XA^FO50,50^ADN,36,20^FDTest Label^FS^XZ';

            await result.current.print(printData);

            expect(global.fetch).toHaveBeenCalledWith('http://127.0.0.1:9102', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/zpl',
                },
                body: printData,
            });
        });
    });
});
