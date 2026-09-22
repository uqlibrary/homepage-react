import React from 'react';
import { useDropzone } from 'react-dropzone';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';

const StyledDropzone = styled('div')(({ theme, isDragActive, isDragAccept, isDragReject }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: '1 1 0%',
    padding: 24,
    borderWidth: 2,
    borderRadius: 8,
    borderStyle: 'dashed',
    borderColor: isDragAccept
        ? theme.palette.success.main
        : isDragReject
          ? theme.palette.error.main
          : isDragActive
            ? theme.palette.primary.main
            : theme.palette.divider,
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.secondary,
    outline: 'none',
    cursor: 'pointer',
    transition: 'border-color 0.24s ease-in-out',
}));

const Selector = ({ onChange }) => {
    const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
        accept: { 'image/jpeg': [], 'image/png': [] },
        multiple: false,
        onDrop: files => !!files.length && onChange?.(files[0]),
    });

    return (
        <Box sx={{ my: 3 }}>
            <StyledDropzone
                {...getRootProps()}
                isDragActive={isDragActive}
                isDragAccept={isDragAccept}
                isDragReject={isDragReject}
                data-testid="dlor-object-file-selector"
            >
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
                <em>(Only *.jpeg and *.png images will be accepted)</em>
            </StyledDropzone>
        </Box>
    );
};

Selector.prototype = {
    onChange: PropTypes.func.isRequired,
};

export default React.memo(Selector);
