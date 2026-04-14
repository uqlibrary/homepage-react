import React from 'react';
import PropTypes from 'prop-types';
import { GridToolbarExport } from '@mui/x-data-grid';

/**
 * @param {string} id
 * @return {function(): Element}
 */
const ExportMenu = ({ id }) => {
    return (
        <GridToolbarExport
            id={`${id}-data-table-toolbar-export-menu`}
            data-testid={`${id}-data-table-toolbar-export-menu`}
            style={{ justifyContent: 'flex-end' }}
            csvOptions={{
                fileName: id,
                utf8WithBom: true,
                allColumns: true,
            }}
        />
    );
};

ExportMenu.propTypes = {
    id: PropTypes.string.isRequired,
};

export default React.memo(ExportMenu);
