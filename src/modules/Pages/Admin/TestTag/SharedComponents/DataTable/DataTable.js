import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import { DataGrid } from '@mui/x-data-grid';

const DataTable = props => {
    const { rows = [], columns = [], rowId, ...rest } = props;
    delete rest.editMode;
    delete rest.getRowId;

    return (
        <Box display={'flex'} height={400} width={'100%'}>
            <Box flexGrow={1}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    editMode="row"
                    disableColumnMenu
                    disableColumnFilter
                    disableColumnSort
                    getRowId={row => row?.[rowId]}
                    {...rest}
                />
            </Box>
        </Box>
    );
};

DataTable.propTypes = {
    rows: PropTypes.array,
    columns: PropTypes.array,
    rowId: PropTypes.string.isRequired,
    toolbarComponent: PropTypes.object,
};

export default React.memo(DataTable);
