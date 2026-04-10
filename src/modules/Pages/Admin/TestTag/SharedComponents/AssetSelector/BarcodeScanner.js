/* istanbul ignore file */
import React, { useEffect, useState } from 'react';
import { QrCodeScanner } from '@mui/icons-material';
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

// override to use our own copy of the wasm file
prepareZXingModule({
    overrides: {
        locateFile: (path, prefix) => {
            // source: https://fastly.jsdelivr.net/npm/zxing-wasm@2.2.4/dist/reader/zxing_reader.wasm
            // project: https://github.com/Sec-ant/zxing-wasm
            if (path.endsWith('.wasm')) return process.env.ZXING_WASM_URL;
            return prefix + path;
        },
    },
});

/**
 * @param {Array<string>} detectedCodes
 * @param {object} ctx
 */
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
    const [selectedDeviceId, setSelectedDeviceId] = useState();

    useEffect(() => {
        const firstDeviceId = devices?.[0]?.deviceId;
        if (!firstDeviceId || String(selectedDeviceId) === String(firstDeviceId)) return;
        setSelectedDeviceId(firstDeviceId);
    }, [devices, selectedDeviceId]);

    const closeScanner = () => setIsScanning(false);
    const handleScan = scannedCodes => {
        const firstScannedCode = scannedCodes?.[0]?.rawValue;
        if (!firstScannedCode) return;
        onScan(firstScannedCode);
        closeScanner();
    };

    if (!isScanning) {
        return (
            <IconButton aria-label="Open scanner" onClick={() => setIsScanning(true)}>
                <QrCodeScanner />
            </IconButton>
        );
    }

    return (
        <Dialog fullScreen open={isScanning} onClose={() => setIsScanning(false)}>
            <DialogTitle sx={{ p: 2 }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <FormControl sx={{ flexGrow: 1 }}>
                        <InputLabel id="deviceId-label">Camera</InputLabel>
                        <Select
                            disabled={devices.length <= 1}
                            label="Camera"
                            labelId="deviceId-label"
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
                        title="close scanner"
                        onClick={closeScanner}
                        sx={{ color: theme => theme.palette.grey[500] }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent dividers sx={{ p: 2 }}>
                <Scanner
                    onScan={handleScan}
                    formats={formats}
                    components={{
                        audio: true,
                        torch: true,
                        zoom: true,
                        finder: true,
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
    );
};

BarcodeScanner.propTypes = {
    onScan: PropTypes.func.isRequired,
    formats: PropTypes.arrayOf(PropTypes.string),
};

export default React.memo(BarcodeScanner);
