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

export const BARCODE_SCANNER_SOUND_PREF_COOKIE = 'TNT_BARCODE_SCANNER_SOUND_PREF';

// override to use our own copy of the wasm file
/* istanbul ignore next */
prepareZXingModule({
    overrides: {
        locateFile: (path, prefix) => {
            // source: https://fastly.jsdelivr.net/npm/zxing-wasm@2.2.4/dist/reader/zxing_reader.wasm
            // project: https://github.com/Sec-ant/zxing-wasm
            if (path.endsWith('.wasm')) return process.env.ZXING_WASM_PATH;
            return prefix + path;
        },
    },
});

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

/**
 * @param {Array<string>} detectedCodes
 * @param {object} ctx
 */
/* istanbul ignore next */
const tracker = (detectedCodes, ctx) => {
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

const BarcodeScanner = ({ onScan, formats }) => {
    const devices = useDevices();
    const [isScanning, setIsScanning] = useState(false);
    const [isBeepSoundEnabled, setIsBeepSoundEnabled] = useState(
        Cookies.get(BARCODE_SCANNER_SOUND_PREF_COOKIE) !== 'false',
    );
    const [selectedDeviceId, setSelectedDeviceId] = useState();
    const overflowStyleRef = useRef(document.body.style.overflow);

    // auto-select first device
    useEffect(() => {
        if (selectedDeviceId || !devices?.length) return;
        setSelectedDeviceId(devices?.[0]?.deviceId);
    }, [devices]);

    const toggleBeep = () => {
        Cookies.set(BARCODE_SCANNER_SOUND_PREF_COOKIE, !isBeepSoundEnabled);
        setIsBeepSoundEnabled(prev => !prev);
    };
    const pauseBodyScroll = () => document.body.style.setProperty('overflow', 'hidden', 'important');
    const resumeBodyScroll = () =>
        document.body.style.setProperty('overflow', /* istanbul ignore next */ overflowStyleRef.current || '');
    const openScanner = () => {
        pauseBodyScroll();
        setIsScanning(true);
    };
    const closeScanner = () => {
        resumeBodyScroll();
        setIsScanning(false);
    };
    const handleScan = scannedCodes => {
        const firstScannedCode = scannedCodes?.[0]?.rawValue;
        if (!firstScannedCode?.trim()) return;
        onScan(firstScannedCode.trim());
        closeScanner();
    };

    if (!isScanning) {
        return (
            <IconButton
                data-testid="barcode-scanner-open-button"
                size="small"
                aria-label="Open scanner"
                onClick={openScanner}
            >
                <QrCodeScanner />
            </IconButton>
        );
    }

    return (
        <ThemeProvider theme={darkTheme}>
            <Dialog fullScreen disableScrollLock={false} open={isScanning}>
                <DialogTitle>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                        }}
                    >
                        <FormControl sx={{ flexGrow: 1 }}>
                            <InputLabel id="device-id-label">Camera</InputLabel>
                            <Select
                                data-testid="barcode-scanner-device-select"
                                inputProps={{ 'data-testid': 'barcode-scanner-device-select-input' }}
                                label="Camera"
                                labelId="device-id-label"
                                disabled={devices.length <= 1}
                                value={selectedDeviceId ?? ''}
                                onChange={e => setSelectedDeviceId(e.target.value)}
                            >
                                {devices.map(device => (
                                    <MenuItem key={device.deviceId} value={device.deviceId}>
                                        {device.label || `Camera ${device.deviceId}`}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <IconButton
                            data-testid="barcode-scanner-toggle-beep-button"
                            title="toggle beep"
                            onClick={toggleBeep}
                            sx={{ color: theme => theme.palette.grey[500] }}
                        >
                            {isBeepSoundEnabled ? <VolumeUp /> : <VolumeOff />}
                        </IconButton>

                        <IconButton
                            data-testid="barcode-scanner-close-button"
                            title="close scanner"
                            onClick={closeScanner}
                            sx={{ color: theme => theme.palette.grey[500] }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent dividers sx={{ m: 0, p: 0 }}>
                    <Scanner
                        onScan={handleScan}
                        formats={formats}
                        sound={isBeepSoundEnabled}
                        components={{
                            torch: true,
                            finder: true,
                            zoom: false,
                            onOff: false,
                            tracker,
                        }}
                        constraints={{
                            deviceId: selectedDeviceId,
                            facingMode: 'environment',
                            aspectRatio: 1,
                            width: { ideal: 1920 },
                            height: { ideal: 1080 },
                        }}
                    />
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
