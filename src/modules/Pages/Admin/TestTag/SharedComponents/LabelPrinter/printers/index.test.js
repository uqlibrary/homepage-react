import registry from './index';

describe('Printer Registry', () => {
    it('should have zebra and emulator printers registered', () => {
        expect(Object.keys(registry)).toHaveLength(2);
        expect(registry).toHaveProperty('zebra');
        expect(registry).toHaveProperty('emulator');
        expect(typeof registry.zebra).toBe('function');
        expect(typeof registry.emulator).toBe('function');

        // instantiate printers and check for expected methods
        const zebraFn = registry.zebra();
        expect(zebraFn).toHaveProperty('code', 'zebra');
        expect(zebraFn).toHaveProperty('getAvailablePrinters');
        expect(zebraFn).toHaveProperty('getDefaultPrinter');
        expect(zebraFn).toHaveProperty('getConnectionStatus');
        expect(zebraFn).toHaveProperty('setPrinter');
        expect(zebraFn).toHaveProperty('print');

        const emulatorFn = registry.emulator();
        expect(emulatorFn).toHaveProperty('code', 'emulator');
        expect(emulatorFn).toHaveProperty('getAvailablePrinters');
        expect(emulatorFn).toHaveProperty('getDefaultPrinter');
        expect(emulatorFn).toHaveProperty('getConnectionStatus');
        expect(emulatorFn).toHaveProperty('setPrinter');
        expect(emulatorFn).toHaveProperty('print');
    });
});
