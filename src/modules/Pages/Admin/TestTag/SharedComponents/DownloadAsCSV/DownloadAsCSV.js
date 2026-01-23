import React from 'react';
import { rowsToCSVString, downloadCSVFile } from '../../helpers/csv';
import moment from 'moment/moment';
import IconButton from '@mui/material/IconButton';
import { Download } from '@mui/icons-material';
import PropTypes from 'prop-types';

/**
 * @param {string[]} headers
 * @param {(string | number | null | undefined)[][]} data
 * @param {string} filename
 * @returns {void}
 */
const handleClick = (headers, data, filename) =>
    downloadCSVFile(rowsToCSVString([headers, ...data]), `${filename}-${moment().format('YYYYMMDDHHmmss')}`);

const DownloadAsCSV = ({ filename, contents, disabled }) => {
    return (
        <IconButton
            aria-label={'Download as CSV'}
            title={'Download as CSV'}
            data-testid={'download-as-csv'}
            onClick={() => {
                const { headers, data } = contents();
                handleClick(headers, data, filename);
            }}
            disabled={disabled}
        >
            <Download />
        </IconButton>
    );
};

DownloadAsCSV.propTypes = {
    filename: PropTypes.string,
    contents: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

export default React.memo(DownloadAsCSV);
