import React from 'react';
import Box from '@mui/material/Box';
import { getFileSizeString } from '../../../../DigitalLearningObjects/dlorHelpers';
import Close from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

const List = ({ onClear, file }) => {
    return (
        <Box sx={{ my: 3 }}>
            <>
                {file.name} {getFileSizeString(file.size / 1000)}{' '}
                <IconButton onClick={onClear}>
                    <Close fontSize="small" />
                </IconButton>
            </>
        </Box>
    );
};

export default React.memo(List);
