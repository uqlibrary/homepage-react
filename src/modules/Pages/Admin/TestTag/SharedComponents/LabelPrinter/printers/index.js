import { default as useZebraPrinter } from './ZebraClass';
import { default as useEmulatorPrinter } from './EmulatorClass';

export const printerRegistry = {
    zebra: useZebraPrinter,
    emulator: useEmulatorPrinter,
    // Future printer APIs can be registered here
};
export default printerRegistry;
