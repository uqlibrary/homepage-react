import React from 'react';
import Box from '@mui/material/Box';
import { getFileSizeString } from '../../../../DigitalLearningObjects/dlorHelpers';
import Close from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { Tooltip } from '@mui/material';
import PropTypes from 'prop-types';

const List = ({ onClear, file }) => (
    <Box sx={{ my: 3, display: 'flex', alignItems: 'center' }}>
        <span data-testid="dlor-object-file-list-filename">
            {file.name} {getFileSizeString(file.size / 1000)}
        </span>{' '}
        <Tooltip
            componentsProps={{
                tooltip: {
                    sx: { maxWidth: 200, textAlign: 'center' },
                },
            }}
            title="Click to remove file. The file will be deleted upon submitting the form."
        >
            <IconButton onClick={onClear} data-testid="dlor-object-file-list-clear">
                <Close fontSize="small" />
            </IconButton>
        </Tooltip>
    </Box>
);

List.prototype = {
    onClear: PropTypes.func.isRequired,
    file: PropTypes.object,
};

export default React.memo(List);
