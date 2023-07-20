import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import { DataGrid } from '@mui/x-data-grid';

const rootId = 'data_table';

const DataTable = ({ rows = [], columns = [], id, rowId, autoHeight = true, height, ...rest }) => {
    const componentId = `${rootId}-${id}`;
    delete rest.editMode;
    delete rest.getRowId;

    return (
        <Box display={'flex'} {...(autoHeight === false ? { height: height ?? 400 } : {})} width={'100%'}>
            <Box flexGrow={1} id={`${componentId}`} data-testid={`${componentId}`}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    editMode="row"
                    disableColumnMenu
                    disableColumnFilter
                    getRowId={row => row?.[rowId]}
                    autoHeight={autoHeight}
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    {...rest}
                />
            </Box>
        </Box>
    );
};

DataTable.propTypes = {
    rows: PropTypes.array,
    columns: PropTypes.array,
    id: PropTypes.string.isRequired,
    rowId: PropTypes.string.isRequired,
    toolbarComponent: PropTypes.object,
    autoHeight: PropTypes.bool,
    height: PropTypes.number,
};

export default React.memo(DataTable);
