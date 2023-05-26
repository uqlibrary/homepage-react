import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { DataGrid } from '@mui/x-data-grid';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    tableMarginTop: {
        marginTop: theme.spacing(2),
    },
}));

const DataTable = props => {
    const classes = useStyles();
    const { rows = [], columns = [], rowId, ...rest } = props;
    delete rest.editMode;
    delete rest.getRowId;

    // add new row stuff here
    return (
        <Box display={'flex'} height={400} width={'100%'}>
            <Box flexGrow={1}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    editMode="row"
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
