import React from 'react';
import BarcodeScanner, { BARCODE_SCANNER_SOUND_PREF_COOKIE } from './BarcodeScanner';
import Cookies from 'js-cookie';
import { render, screen, waitFor } from 'test-utils';
import userEvent from '@testing-library/user-event';
import { useDevices } from '@yudiel/react-qr-scanner';

const scannedCodeMock = 'TEST_CODE';
const mockScannedCode = jest.fn().mockReturnValue(scannedCodeMock);

// mock react-qr-scanner
jest.mock('@yudiel/react-qr-scanner', () => {
    const React = require('react');

    // replace scanner with a button, so we can mock code scans
    const Scanner = jest.fn(({ onScan }) => (
        <button data-testid="trigger-mock-code-scan" onClick={() => onScan([{ rawValue: mockScannedCode() }])}>
            trigger-scan
        </button>
    ));
    const useDevices = jest.fn(() => [{ deviceId: 'mock-device-1', label: 'Mock Camera 1' }]);

    return {
        __esModule: true,
        prepareZXingModule: jest.fn(),
        useDevices,
        Scanner,
    };
});

// mock cookies
jest.mock('js-cookie', () => ({
    get: jest.fn(),
    set: jest.fn(),
}));

function setup(testProps = {}, renderer = render) {
    const props = {
        onScan: jest.fn(),
        formats: ['code_128'],
        ...testProps,
    };

    return {
        ...renderer(<BarcodeScanner {...props} />),
        props,
    };
}

describe('BarcodeScanner', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const assertScannerCloseState = () => {
        expect(screen.queryByTestId('barcode-scanner-open-button')).toBeInTheDocument();
        expect(screen.queryByTestId('barcode-scanner-close-button')).not.toBeInTheDocument();
    };

    const assertScannerOpenState = () => {
        expect(screen.queryByTestId('barcode-scanner-open-button')).not.toBeInTheDocument();
        expect(screen.queryByTestId('barcode-scanner-close-button')).toBeInTheDocument();
    };

    const openScanner = async () => await userEvent.click(screen.getByTestId('barcode-scanner-open-button'));
    const closeScanner = async () => await userEvent.click(screen.getByTestId('barcode-scanner-close-button'));
    const mockCodeScan = async () => await userEvent.click(screen.getByTestId('trigger-mock-code-scan'));

    it('should allow device selection', async () => {
        const { useDevices } = require('@yudiel/react-qr-scanner');
        useDevices.mockReturnValue([]);

        // trigger 1st render (no devices)
        const { rerender, getByTestId, findByRole } = setup();
        assertScannerCloseState();
        await openScanner();
        assertScannerOpenState();
        const select = getByTestId('barcode-scanner-device-select');
        const selectInput = getByTestId('barcode-scanner-device-select-input');
        expect(selectInput).toBeDisabled();

        useDevices.mockReturnValue([
            {
                deviceId: 'mock-device-1',
                label: 'Mock Camera 1',
            },
            {
                deviceId: 'mock-device-2',
            },
        ]);
        // trigger 2nd render (devices available) - select should be enabled
        setup({}, rerender);
        expect(selectInput).toBeEnabled();
        // should auto-select 1st device
        expect(select).toHaveTextContent('Mock Camera 1');

        // manually select 2nd device
        await userEvent.click(screen.getByRole('combobox', { name: /camera/i }));
        const option = await findByRole('option', { name: /Camera mock-device-2/i });
        await userEvent.click(option);

        // should update selected device
        expect(select).toHaveTextContent('Camera mock-device-2');
    });

    it('should allow toggling scanner beep', async () => {
        Cookies.get.mockReturnValue('true');

        setup();
        await openScanner();
        await userEvent.click(screen.getByTestId('barcode-scanner-toggle-beep-button'));

        expect(Cookies.set).toHaveBeenCalledWith(BARCODE_SCANNER_SOUND_PREF_COOKIE, false);
    });

    it('should call onScan and close the scanner when a code is scanned', async () => {
        const { props } = setup();
        assertScannerCloseState();
        await openScanner();
        assertScannerOpenState();
        await mockCodeScan();

        await waitFor(() => {
            expect(props.onScan).toHaveBeenCalledWith(scannedCodeMock);
        });
        assertScannerCloseState();
    });

    it('should not close the scanner if the scanned code is empty', async () => {
        mockScannedCode.mockReturnValue('');
        const { props } = setup();
        assertScannerCloseState();
        await openScanner();
        assertScannerOpenState();
        await mockCodeScan();

        expect(props.onScan).not.toHaveBeenCalled();
        assertScannerOpenState();
    });

    it('should restore body scroll when scanner closes', async () => {
        document.body.style.overflow = 'visible';
        const setPropertySpy = jest.spyOn(document.body.style, 'setProperty');

        setup();
        await openScanner();
        expect(setPropertySpy).toHaveBeenCalledWith('overflow', 'hidden', 'important');

        await closeScanner();
        expect(setPropertySpy).toHaveBeenCalledWith('overflow', 'visible');
    });
});
