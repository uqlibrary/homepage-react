import { default as useZebraPrinter } from './printers/ZebraClass';
import { default as useEmulatorPrinter } from './printers/EmulatorClass';

export const printerRegistry = {
    zebra: useZebraPrinter,
    emulator: useEmulatorPrinter,
    // Future printer APIs can be registered here
};
export default printerRegistry;
