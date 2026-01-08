import ZebraBrowserPrintWrapper from 'zebra-browser-print-wrapper';
import { isTest } from 'helpers/general';

class BasePrinterClass {
    constructor() {
        if (this.constructor === BasePrinterClass) {
            throw new Error('Abstract classes cannot be instantiated.');
        }

        this.isTesting = isTest();
        this.code = 'generic';
        this.printer = null;
    }

    async getAvailablePrinters() {
        throw new Error('Method must be implemented.');
    }

    async getDefaultPrinter() {
        throw new Error('Method must be implemented.');
    }

    async getConnectionStatus() {
        throw new Error('Method must be implemented.');
    }

    async useDefaultPrinter() {
        throw new Error('Method must be implemented.');
    }

    async setPrinter() {
        throw new Error('Method must be implemented.');
    }

    async print() {
        throw new Error('Method must be implemented.');
    }

    debug() {
        return this.printer;
    }
}

class ZplClass extends BasePrinterClass {
    constructor() {
        super();
        this.code = 'zpl';
        this.printer = new ZebraBrowserPrintWrapper();
    }

    async getAvailablePrinters() {
        return await this.printer.getAvailablePrinters();
    }

    async getDefaultPrinter() {
        return await this.printer.getDefaultPrinter();
        // {
        //     name: 'Emulator',
        //     deviceType: 'printer',
        //     connection: 'network',
        //     uid: '127.0.0.1',
        //     provider: 'com.zebra.ds.webdriver.desktop.provider.DefaultDeviceProvider',
        //     manufacturer: 'Zebra Technologies',
        //     version: 0,
        // };
    }

    async getConnectionStatus() {
        // return { ready: true, error: false, errors: [] };
        const status = await this.printer.checkPrinterStatus();
        return { ready: status.isReadyToPrint || false, error: status.isError || false, errors: status.errors || [] };
    }

    async useDefaultPrinter() {
        const defaultPrinter = await this.getDefaultPrinter();
        if (defaultPrinter) {
            await this.setPrinter(defaultPrinter);
            return defaultPrinter;
        }
        throw new Error('No default printer found');
    }

    async setPrinter(printer) {
        await this.printer.setPrinter(printer);
    }

    async print(data) {
        console.log('Sending print data to printer...');
        // await this.printer.print(data);
        await fetch('http://127.0.0.1:9101', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/zpl',
            },
            body: data,
        }).then(response => {
            console.log('Print response status:', response.status);
            return response;
        });
    }
}

export default ZplClass;
