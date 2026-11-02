import React from 'react';
import BarcodeScanner, {
    BARCODE_SCANNER_DEFAULT_DEVICE_ID_COOKIE,
    BARCODE_SCANNER_SOUND_PREF_COOKIE,
} from './BarcodeScanner';
import Cookies from 'js-cookie';
import { render, screen, waitFor } from 'test-utils';
import userEvent from '@testing-library/user-event';
import { useDevices } from '@yudiel/react-qr-scanner';
import locale from './locale';
import { act } from '@testing-library/react';

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
    const mockDocumentVisibilityEvent = display => {
        Object.defineProperty(document, 'visibilityState', {
            value: display ? 'visible' : 'hidden',
            configurable: true,
        });
        document.dispatchEvent(new Event('visibilitychange'));
    };
    const mockAppFocusEvent = () => mockDocumentVisibilityEvent(true);
    const mockAppBlurEvent = () => mockDocumentVisibilityEvent(false);
    const mockFocusEvent = () => window.dispatchEvent(new Event('focus'));
    const mockBlurEvent = () => window.dispatchEvent(new Event('blur'));
    const mockTorchAvailability = () => {
        const mockVideo = document.createElement('video');
        Object.defineProperty(mockVideo, 'srcObject', {
            value: {
                getVideoTracks: jest.fn().mockReturnValue([
                    {
                        getCapabilities: jest.fn().mockReturnValue({ torch: true }),
                        applyConstraints: jest.fn().mockResolvedValue(),
                    },
                ]),
            },
        });
        jest.spyOn(document, 'querySelectorAll').mockReturnValue([mockVideo]);
    };

    it('should allow device selection', async () => {
        const { useDevices } = require('@yudiel/react-qr-scanner');
        useDevices.mockReturnValue([]);

        // trigger 1st render (no devices)
        const { rerender, getByTestId, findByRole } = setup();
        expect(Cookies.set).not.toHaveBeenCalled();
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
        expect(Cookies.set).not.toHaveBeenCalled();
        expect(selectInput).toBeEnabled();
        // should auto-select 1st device
        expect(select).toHaveTextContent('Mock Camera 1');

        // manually select 2nd device
        await userEvent.click(await findByRole('combobox', { name: /camera/i }));
        const option = await findByRole('option', { name: /Camera mock-device-2/i });
        await userEvent.click(option);

        // should update selected device
        expect(select).toHaveTextContent('Camera mock-device-2');
        expect(Cookies.set).toHaveBeenCalledWith(BARCODE_SCANNER_DEFAULT_DEVICE_ID_COOKIE, 'mock-device-2');
    });

    it('should remember device selection', async () => {
        Cookies.get.mockImplementation(key =>
            key === BARCODE_SCANNER_DEFAULT_DEVICE_ID_COOKIE ? 'mock-device-2' : null,
        );

        useDevices.mockReturnValue([
            {
                deviceId: 'mock-device-1',
                label: 'Mock Camera 1',
            },
            {
                deviceId: 'mock-device-2',
            },
        ]);

        const { getByTestId } = setup();
        expect(Cookies.set).not.toHaveBeenCalled();
        await openScanner();

        await waitFor(async () =>
            expect(getByTestId('barcode-scanner-device-select')).toHaveTextContent('Camera mock-device-2'),
        );
    });

    it('should allow toggling torch', async () => {
        const { queryByTestId } = setup();
        await openScanner();
        mockTorchAvailability();

        await waitFor(() => {
            expect(queryByTestId('FlashlightOnIcon')).toBeInTheDocument();
            expect(queryByTestId('FlashlightOffIcon')).not.toBeInTheDocument();
        });

        await userEvent.click(screen.getByTestId('barcode-scanner-toggle-torch-button'));
        await waitFor(() => {
            expect(queryByTestId('FlashlightOnIcon')).not.toBeInTheDocument();
            expect(queryByTestId('FlashlightOffIcon')).toBeInTheDocument();
        });

        await userEvent.click(screen.getByTestId('barcode-scanner-toggle-torch-button'));
        await waitFor(() => {
            expect(queryByTestId('FlashlightOnIcon')).toBeInTheDocument();
            expect(queryByTestId('FlashlightOffIcon')).not.toBeInTheDocument();
        });
    });

    it('should allow toggling scanner beep', async () => {
        Cookies.get.mockImplementation(key => (key === BARCODE_SCANNER_SOUND_PREF_COOKIE ? 'true' : null));

        const { queryByTestId } = setup();
        expect(Cookies.set).not.toHaveBeenCalled();
        await openScanner();
        await waitFor(() => {
            expect(queryByTestId('VolumeUpIcon')).toBeInTheDocument();
            expect(queryByTestId('VolumeOffIcon')).not.toBeInTheDocument();
        });

        await userEvent.click(screen.getByTestId('barcode-scanner-toggle-beep-button'));
        await waitFor(() => {
            expect(queryByTestId('VolumeUpIcon')).not.toBeInTheDocument();
            expect(queryByTestId('VolumeOffIcon')).toBeInTheDocument();
            expect(Cookies.set).toHaveBeenCalledWith(BARCODE_SCANNER_SOUND_PREF_COOKIE, false);
        });

        await userEvent.click(screen.getByTestId('barcode-scanner-toggle-beep-button'));
        await waitFor(() => {
            expect(queryByTestId('VolumeUpIcon')).toBeInTheDocument();
            expect(queryByTestId('VolumeOffIcon')).not.toBeInTheDocument();
            expect(Cookies.set).toHaveBeenCalledWith(BARCODE_SCANNER_SOUND_PREF_COOKIE, true);
        });
    });

    describe('behaviour', () => {
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

        it("should toggle scanner according to app's visibility events", async () => {
            setup();
            await openScanner();
            assertScannerOpenState();

            // hide via visibilitychange
            await act(mockAppBlurEvent);
            await waitFor(assertScannerCloseState);

            // show via visibilitychange - reopens because isScanningRef.current is still true
            await act(mockAppFocusEvent);
            await waitFor(assertScannerOpenState);

            // hide via window blur
            await act(mockBlurEvent);
            await waitFor(assertScannerCloseState);

            // show via window focus - reopens because isScanningRef.current is still true
            await act(mockFocusEvent);
            await waitFor(assertScannerOpenState);

            await closeScanner();
            // should not re-open scanner when already close
            await act(mockFocusEvent);
            await act(mockBlurEvent);
            await act(mockFocusEvent);
            await waitFor(assertScannerCloseState);
            await act(mockAppFocusEvent);
            await act(mockAppBlurEvent);
            await waitFor(assertScannerCloseState);
        });

        it('should not reopen scanner on focus if it was manually closed', async () => {
            setup();
            await openScanner();
            assertScannerOpenState();

            // manually close - sets isScanningRef.current = false
            await closeScanner();
            await waitFor(assertScannerCloseState);

            // regain focus - should NOT reopen
            await act(mockFocusEvent);
            await waitFor(assertScannerCloseState);

            // visible via visibilitychange - should NOT reopen
            await act(mockAppFocusEvent);
            await waitFor(assertScannerCloseState);
        });

        it('should reset torch when scanner is hidden', async () => {
            setup();
            await openScanner();
            // mock track so torch can be toggled on
            mockTorchAvailability();

            await userEvent.click(screen.getByTestId('barcode-scanner-toggle-torch-button'));
            await waitFor(() => expect(screen.queryByTestId('FlashlightOffIcon')).toBeInTheDocument());

            // hide - torch should reset
            await act(mockBlurEvent);
            assertScannerCloseState();

            // show - torch should be off again
            await act(mockFocusEvent);
            assertScannerOpenState();
            expect(screen.queryByTestId('FlashlightOnIcon')).toBeInTheDocument(); // torch off = FlashlightOn shown
            expect(screen.queryByTestId('FlashlightOffIcon')).not.toBeInTheDocument();
        });

        it('should remove event listeners on unmount', () => {
            const removeSpy = jest.spyOn(document, 'removeEventListener');
            const windowRemoveSpy = jest.spyOn(window, 'removeEventListener');

            const { unmount } = setup();
            unmount();

            expect(removeSpy).toHaveBeenCalledWith('visibilitychange', expect.any(Function));
            expect(windowRemoveSpy).toHaveBeenCalledWith('blur', expect.any(Function));
            expect(windowRemoveSpy).toHaveBeenCalledWith('focus', expect.any(Function));
            expect(windowRemoveSpy).toHaveBeenCalledWith('unhandledrejection', expect.any(Function));
        });
    });

    describe('body scroll state', () => {
        it('should pause body scroll when scanner opens', async () => {
            const setPropertySpy = jest.spyOn(document.body.style, 'setProperty');

            setup();
            await openScanner();

            await waitFor(() => expect(setPropertySpy).toHaveBeenCalledWith('overflow', 'hidden', 'important'));
        });

        it('should restore body scroll when scanner closes', async () => {
            document.body.style.overflow = 'visible';
            const setPropertySpy = jest.spyOn(document.body.style, 'setProperty');

            setup();
            await openScanner();
            setPropertySpy.mockClear();
            await closeScanner();

            expect(setPropertySpy).toHaveBeenCalledWith('overflow', 'visible');
        });
    });

    describe('errorHandling', () => {
        it('should display error message when there are no cameras available', async () => {
            useDevices.mockReturnValue([]);

            const { getByText } = setup();
            await openScanner();

            await waitFor(() => expect(getByText(locale.error.noCamera)).toBeInTheDocument());
        });

        it('should display error message when dependencies fail to load', async () => {
            setup();
            await openScanner();

            await act(async () => {
                const event = new Event('unhandledrejection');
                event.reason = new Error('test error');
                window.dispatchEvent(event);
            });

            expect(await screen.findByText(locale.error.scanner)).toBeInTheDocument();
        });
    });
});
