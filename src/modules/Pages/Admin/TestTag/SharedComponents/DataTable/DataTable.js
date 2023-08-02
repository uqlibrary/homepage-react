import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import Box from '@material-ui/core/Box';
import { DataGrid } from '@mui/x-data-grid';

const rootId = 'data_table';

const useStyles = makeStyles(() => ({
    root: {
        border: 0,
        '& .MuiDataGrid-main': {
            border: '1px solid rgba(224, 224, 224, 1)',
            borderRadius: 0,
        },
        '& .MuiDataGrid-window': {
            backgroundImage:
                'linear-gradient(left, #fff, rgba(255, 255, 255, 0)),linear-gradient(to left, #fff, rgba(255, 255, 255, 0)),linear-gradient(to right, #d7d1cc, rgba(195, 195, 197, 0)),linear-gradient(to left, #d7d1cc, rgba(195, 195, 197, 0))',
            backgroundPosition: '0 0,100% 0,0 0,100% 0',
            backgroundRepeat: 'no-repeat',
            backgroundColor: 'white',
            backgroundSize: '4em 100%,4em 100%,1em 100%,1em 100%',
            backgroundAttachment: 'local,local,scroll,scroll',
        },
        '& .MuiDataGrid-columnHeaderWrapper': {
            borderBottom: '1px solid rgba(224, 224, 224, 1)',
        },
    },

    columnHeader: {
        '&:focus': {
            outline: 'none !important',
        },
        '&:focus-within': {
            outline: 'none !important',
        },
        '& .MuiDataGrid-iconButtonContainer': {
            paddingLeft: '4px',
            paddingRight: '4px',
        },
    },
    cell: {
        '&:focus': {
            outline: 'none !important',
        },
        '&:focus-within': {
            outline: 'none !important',
        },
    },
}));
const DataTable = ({
    rows = [],
    columns = [],
    id,
    rowId,
    autoHeight = true,
    height,
    defaultSortColumn,
    defaultSortDirection = 'asc',
    classes = {},
    ...rest
}) => {
    const componentId = `${rootId}-${id}`;
    delete rest.editMode;
    delete rest.getRowId;
    const internalClasses = useStyles();

    const [sortModel, setSortModel] = React.useState([
        {
            field: defaultSortColumn ?? '',
            sort: defaultSortDirection,
        },
    ]);

    return (
        <Box display={'flex'} {...(autoHeight === false ? { height: height ?? 400 } : {})} width={'100%'}>
            <Box flexGrow={1} id={`${componentId}`} data-testid={`${componentId}`}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    editMode="row"
                    disableDensitySelector
                    disableColumnMenu
                    disableColumnFilter
                    disableColumnSelector
                    disableSelectionOnClick
                    hideFooterRowCount
                    hideFooterSelectedRowCount
                    getRowId={row => row?.[rowId]}
                    autoHeight={autoHeight}
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    classes={{
                        root: internalClasses.root,
                        columnHeader: internalClasses.columnHeader,
                        cell: internalClasses.cell,
                        ...classes,
                    }}
                    {...(defaultSortColumn
                        ? {
                              sortModel,
                              onSortModelChange: model => setSortModel(model),
                              sortingOrder: ['asc', 'desc'],
                          }
                        : {})}
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
    defaultSortColumn: PropTypes.string,
    defaultSortDirection: PropTypes.oneOf(['asc', 'desc']),
    toolbarComponent: PropTypes.object,
    classes: PropTypes.object,
    autoHeight: PropTypes.bool,
    height: PropTypes.number,
};

export default React.memo(DataTable);
