import React from 'react';
import { useDropzone } from 'react-dropzone';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import { allowedFileTypes } from './general';
import Typography from '@mui/material/Typography';
import CloudUpload from '@mui/icons-material/CloudUpload';
import Grid from '@mui/material/Grid';

const StyledDropzone = styled('div', {
    shouldForwardProp: prop => !['isDragActive', 'isDragAccept', 'isDragReject', 'hasRejection'].includes(prop),
})(({ theme, isDragActive, isDragAccept, isDragReject, hasRejection }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: '1 1 0%',
    padding: 24,
    borderWidth: 2,
    borderRadius: 8,
    borderStyle: 'dashed',
    borderColor:
        isDragReject || (hasRejection && !isDragActive)
            ? theme.palette.error.main
            : isDragAccept
              ? theme.palette.success.main
              : isDragActive
                ? theme.palette.primary.main
                : theme.palette.divider,
    backgroundColor: '#eee',
    color: theme.palette.text.secondary,
    outline: 'none',
    cursor: 'pointer',
    transition: 'border-color 0.24s ease-in-out',
}));

export const validator = file =>
    /^[A-Za-z0-9_-]+\.[A-Za-z0-9]+$/.test(file.name) && file.name.length <= 45
        ? null
        : { code: 'invalid-file-name', message: 'File name is invalid' };

const Selector = ({ onChange }) => {
    const [hasRejection, setHasRejection] = React.useState(false);
    const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
        validator,
        accept: allowedFileTypes,
        multiple: false,
        onDrop: files => {
            setHasRejection(false);
            !!files.length && onChange?.(files[0]);
        },
        onDropRejected: () => setHasRejection(true),
    });

    return (
        <Box sx={{ my: 3 }}>
            <StyledDropzone
                {...getRootProps()}
                hasRejection={hasRejection}
                isDragActive={isDragActive}
                isDragAccept={isDragAccept}
                isDragReject={isDragReject}
                data-testid="dlor-object-file-selector"
            >
                <input {...getInputProps()} />
                <Grid container sx={{ width: '100%' }} alignItems="center">
                    <Grid item xs={12} sm={8}>
                        <Typography component="div" sx={{ fontSize: 12, fontWeight: 400, mt: '14px', mb: '14px' }}>
                            Please ensure:
                            <ul>
                                <li>files are under 5GB in size</li>
                                <li>file names begin with a letter and are less than 45 characters long</li>
                                <li>
                                    file names contain only upper and lowercase alphanumeric characters, hyphens and
                                    underscores
                                </li>
                                <li>file names must not contain any spaces</li>
                                <li>
                                    file names have only a single period which precedes the file extension: e.g. “.pdf”,
                                    “.mov”, “.tiff”, “.wav” etc.
                                </li>
                                <li>
                                    file names have one of the following extensions: 7z, avi, csv, docx, epub, fbx, gif,
                                    gsheet, gz, h5p, html, jpe, jpeg, jpg, json, m1v, m2v, m4a, mk3d, mks, mkv, mov,
                                    mp3, mp4, mp4v, mpe, mpeg, mpg, mxf, obj pptx, ods, pdf, png, qt, rar, scorm, stl,
                                    tar, tif, tiff, wav, wma, wmv, xla, xlc, xlm, xls, xlsx, xlt, xlw, xml, zip
                                </li>
                            </ul>
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                                height: '100%',
                            }}
                        >
                            <CloudUpload sx={{ fontSize: 36 }} />
                            <Typography sx={{ fontSize: 14, maxWidth: 200 }}>
                                Click here to select files, or drag files into this area to upload
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </StyledDropzone>
        </Box>
    );
};

Selector.prototype = {
    onChange: PropTypes.func.isRequired,
};

export default React.memo(Selector);
