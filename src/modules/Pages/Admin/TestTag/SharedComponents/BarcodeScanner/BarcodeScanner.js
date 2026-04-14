import React, { useEffect, useRef, useState } from 'react';
import { QrCodeScanner, VolumeOff, VolumeUp } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import { Scanner, useDevices, prepareZXingModule } from '@yudiel/react-qr-scanner';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Cookies from 'js-cookie';
import Typography from '@mui/material/Typography';
import locale from './locale';

export const BARCODE_SCANNER_SOUND_PREF_COOKIE = 'TNT_BARCODE_SCANNER_SOUND_PREF';
export const BARCODE_SCANNER_DEFAULT_DEVICE_ID_COOKIE = 'TNT_BARCODE_SCANNER_DEFAULT_DEVICE_ID_COOKIE';

// override to use our own copy of the wasm file
/* istanbul ignore next */
prepareZXingModule({
    overrides: {
        locateFile: (path, prefix) => {
            // source: https://fastly.jsdelivr.net/npm/zxing-wasm@2.2.4/dist/reader/zxing_reader.wasm
            // project: https://github.com/Sec-ant/zxing-wasm
            if (path.endsWith('.wasm')) return process.env.BARCODE_SCANNER_WASM_PATH;
            return prefix + path;
        },
    },
});

/**
 * @param {Array<string>} detectedCodes
 * @param {object} ctx
 */
/* istanbul ignore next */
const barcodeTracker = (detectedCodes, ctx) => {
    detectedCodes.forEach(detectedCode => {
        const { boundingBox, cornerPoints } = detectedCode;

        // Draw bounding box
        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 4;
        ctx.strokeRect(boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height);

        // Draw corner points
        ctx.fillStyle = '#FF0000';
        cornerPoints.forEach(point => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
            ctx.fill();
        });
    });
};

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
    zIndex: {
        modal: 1_000_000,
        tooltip: 1_100_000,
    },
});

/**
 * @param {boolean} hasError
 * @return {React.JSX.Element}
 */
const displayError = hasError => (
    <Box
        sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'grey.400',
        }}
    >
        {/* diagonal line */}
        <Box
            component="svg"
            sx={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
            }}
        >
            <line x1="0" y1="0" x2="100%" y2="100%" stroke="currentColor" strokeWidth="2" />
        </Box>
        {/* dashed box */}
        <Box
            sx={{
                position: 'absolute',
                inset: 16,
                border: '2px dashed',
                borderColor: 'grey.700',
                borderRadius: 2,
            }}
        />
        {/* error message */}
        <Typography
            variant="body2"
            sx={{
                position: 'relative',
                bgcolor: 'rgba(0,0,0,0.6)',
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
            }}
        >
            {hasError ? locale.error.scanner : locale.error.noCamera}
        </Typography>
    </Box>
);

const BarcodeScanner = ({ onScan, formats }) => {
    const devices = useDevices();
    const hasDevices = !!devices?.length;
    const [hasError, setHasError] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [isBeepSoundEnabled, setIsBeepSoundEnabled] = useState(
        Cookies.get(BARCODE_SCANNER_SOUND_PREF_COOKIE) !== 'false',
    );
    const [selectedDeviceId, setSelectedDeviceId] = useState(Cookies.get(BARCODE_SCANNER_DEFAULT_DEVICE_ID_COOKIE));
    const bodyOverflowStyleRef = useRef(document.body.style.overflow);

    // using setTimeout to schedule it in the macrotask queue seems to fix edged cases
    const pauseBodyScroll = () =>
        setTimeout(() => document.body.style.setProperty('overflow', 'hidden', 'important'), 10);
    const resumeBodyScroll = () =>
        document.body.style.setProperty('overflow', /* istanbul ignore next */ bodyOverflowStyleRef.current || '');

    const openScanner = () => {
        setIsScanning(true);
    };

    const closeScanner = () => {
        resumeBodyScroll();
        setIsScanning(false);
    };

    const handleDeviceChange = e => {
        // "remember" selected device selection
        Cookies.set(BARCODE_SCANNER_DEFAULT_DEVICE_ID_COOKIE, e.target.value);
        setSelectedDeviceId(e.target.value);
    };

    const handleBeepToggle = () => {
        // "remember" sound beep pref
        Cookies.set(BARCODE_SCANNER_SOUND_PREF_COOKIE, !isBeepSoundEnabled);
        setIsBeepSoundEnabled(prev => !prev);
    };

    const handleScan = scannedCodes => {
        const firstScannedCode = scannedCodes?.[0]?.rawValue;
        if (!firstScannedCode?.trim()) return;
        onScan(firstScannedCode.trim());
        closeScanner();
    };

    const handleError = error => {
        console.error('BarcodeScanner error:', error);
        setHasError(true);
    };

    // handle app events
    useEffect(() => {
        const handleVisibilityChange = () => setIsScanning(document.visibilityState === 'visible');
        const handleBlur = () => setIsScanning(false);
        const handleFocus = () => setIsScanning(true);
        // handles disable/enable scanner according to app's visibility events
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleBlur);
        window.addEventListener('focus', handleFocus);

        // handles dependency library errors - we can't predict the error message in here, so we'll assume all
        // unhandledrejection errors to be dependency library errors
        window.addEventListener('unhandledrejection', handleError);

        // cleanup
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('unhandledrejection', handleError);
        };
    }, []);

    // handles auto-selecting first available device
    useEffect(() => {
        // bail if there are no devices or selectedDeviceId is already valid
        if (
            !hasDevices ||
            (selectedDeviceId && devices?.find?.(d => String(d.deviceId) === String(selectedDeviceId)))
        ) {
            return;
        }
        // default to 1st device
        setSelectedDeviceId(devices?.[0]?.deviceId);
    }, [devices]);

    if (!isScanning) {
        return (
            <IconButton
                data-testid="barcode-scanner-open-button"
                size="small"
                aria-label={locale.buttons.open}
                onClick={openScanner}
            >
                <QrCodeScanner />
            </IconButton>
        );
    }

    return (
        <ThemeProvider theme={darkTheme}>
            <Dialog
                open
                fullScreen
                disableScrollLock={false}
                TransitionProps={{
                    // `pauseBodyScroll` only works properly when assigned to `onEnter`
                    onEnter: pauseBodyScroll,
                    // the below can't be easily tested
                    // onExited: resumeBodyScroll
                }}
            >
                <DialogTitle>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                        }}
                    >
                        {/* camera selection dropdown */}
                        <FormControl sx={{ flexGrow: 1 }}>
                            <InputLabel id="device-id-label">{locale.form.device}</InputLabel>
                            <Select
                                data-testid="barcode-scanner-device-select"
                                inputProps={{
                                    'data-testid': 'barcode-scanner-device-select-input',
                                }}
                                label={locale.form.device}
                                labelId="device-id-label"
                                disabled={hasError || devices.length <= 1}
                                value={selectedDeviceId ?? ''}
                                onChange={handleDeviceChange}
                            >
                                {devices.map(device => (
                                    <MenuItem key={device.deviceId} value={device.deviceId}>
                                        {device.label || `Camera ${device.deviceId}`}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {/* beep toggle button */}
                        <IconButton
                            data-testid="barcode-scanner-toggle-beep-button"
                            title={locale.buttons.toggleBeep}
                            onClick={handleBeepToggle}
                            disabled={hasError}
                            sx={{
                                color: theme => theme.palette.grey[500],
                            }}
                        >
                            {isBeepSoundEnabled ? <VolumeUp /> : <VolumeOff />}
                        </IconButton>
                        {/* close dialog button */}
                        <IconButton
                            data-testid="barcode-scanner-close-button"
                            title={locale.buttons.open}
                            onClick={closeScanner}
                            sx={{
                                color: theme => theme.palette.grey[500],
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent dividers sx={{ m: 0, p: 0, position: 'relative' }}>
                    {!hasDevices || hasError ? (
                        displayError(hasError)
                    ) : (
                        <Scanner
                            onScan={handleScan}
                            onError={handleError}
                            formats={formats}
                            sound={isBeepSoundEnabled}
                            components={{
                                torch: true,
                                finder: true,
                                zoom: false,
                                onOff: false,
                                tracker: barcodeTracker,
                            }}
                            constraints={{
                                deviceId: selectedDeviceId,
                                facingMode: 'environment',
                                aspectRatio: 1,
                                width: { ideal: 1920 },
                                height: { ideal: 1080 },
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </ThemeProvider>
    );
};

BarcodeScanner.propTypes = {
    onScan: PropTypes.func.isRequired,
    formats: PropTypes.arrayOf(PropTypes.string),
};

export default React.memo(BarcodeScanner);
