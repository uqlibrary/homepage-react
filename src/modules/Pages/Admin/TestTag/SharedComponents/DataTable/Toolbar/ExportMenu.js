import React from 'react';
import PropTypes from 'prop-types';
import { GridToolbarExport } from '@mui/x-data-grid';

/**
 * @param {string} id
 * @return {function(): Element}
 */
const ExportMenu = ({ id }) => (
    <GridToolbarExport
        id={`${id}-export-menu`}
        data-testid={`${id}-export-menu`}
        style={{ justifyContent: 'flex-end' }}
        csvOptions={{
            fileName: id,
            utf8WithBom: true,
            allColumns: true,
        }}
    />
);

ExportMenu.propTypes = {
    id: PropTypes.string.isRequired,
};

export default React.memo(ExportMenu);
