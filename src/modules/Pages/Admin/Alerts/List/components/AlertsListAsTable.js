import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';

// from https://codesandbox.io/s/hier2
// per https://material-ui.com/components/tables/#custom-pagination-actions

const useStyles1 = makeStyles(theme => ({
    root: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
    },
}));

function TablePaginationActions(props) {
    const classes = useStyles1();
    const theme = useTheme();
    const { count, page, rowsPerPage, onChangePage } = props;

    const handleFirstPageButtonClick = event => {
        onChangePage(event, 0);
    };

    const handleBackButtonClick = event => {
        onChangePage(event, page - 1);
    };

    const handleNextButtonClick = event => {
        onChangePage(event, page + 1);
    };

    const handleLastPageButtonClick = event => {
        onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <div className={classes.root}>
            <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </div>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

const useStyles2 = makeStyles(
    theme => ({
        table: {
            minWidth: 500,
        },
        editButton: {
            backgroundColor: theme.palette.accent.main,
            color: theme.palette.white.main,
            padding: '1em',
        },
    }),
    { withTheme: true },
);

export default function AlertsListAsTable(rows, alertsLoading, hasFooter = false) {
    const classes = useStyles2();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    if (!!alertsLoading) {
        return (
            <Grid
                item
                xs={'auto'}
                style={{
                    width: 80,
                    marginRight: 20,
                    marginBottom: 6,
                    opacity: 0.3,
                }}
            >
                <CircularProgress color="primary" size={20} data-testid="loading-admin-alerts" />
            </Grid>
        );
    }

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="custom pagination table">
                <TableHead>
                    <TableRow md-row="" className="md-row">
                        <TableCell component="th" scope="row" />
                        <TableCell component="th" scope="row">
                            Alert
                        </TableCell>
                        <TableCell component="th" scope="row" align="center">
                            Publish Date
                        </TableCell>
                        <TableCell component="th" scope="row" align="center">
                            Unpublish Date
                        </TableCell>
                        <TableCell component="th" scope="row" />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rowsPerPage > 0 && rows.length > 0 ? (
                        rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(alert => {
                            return (
                                <TableRow
                                    key={alert.id}
                                    // id={`row-${alert.id}`}
                                    data-testid={`alert-list-row-${alert.id}`}
                                >
                                    <TableCell component="td">
                                        <Checkbox
                                            classes={{ root: classes.checkbox }}
                                            inputProps={{ 'aria-labelledby': `alert-list-item-title-${alert.id}` }}
                                        />
                                    </TableCell>
                                    <TableCell component="td" className="alertText">
                                        <h4
                                            style={{ display: 'inline' }}
                                            id={`alert-list-item-title-${alert.id}`}
                                        >{`${alert.title}`}</h4>{' '}
                                        {`${alert.message}`}
                                    </TableCell>
                                    <TableCell component="td" align="center" className="startDate">
                                        {alert.startDate}
                                    </TableCell>
                                    <TableCell component="td" align="center" className="endDate">
                                        {alert.endDate}
                                    </TableCell>
                                    <TableCell component="td">
                                        <a
                                            className={classes.editButton}
                                            data-testid={`alert-list-item-edit-${alert.id}`}
                                            id={`alert-list-item-edit-${alert.id}`}
                                            href={`/admin/alerts/edit/${alert.id}`}
                                        >
                                            Edit
                                        </a>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    ) : (
                        <TableRow id="no-alerts">
                            <TableCell component="td">
                                <p>No alerts</p>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
                {!!hasFooter && rows.length > 0 && (
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                colSpan={3}
                                count={rows.length}
                                // id="alert-list-footer"
                                rowsPerPage={rowsPerPage}
                                page={page}
                                SelectProps={{
                                    inputProps: { 'aria-label': 'rows per page' },
                                    native: true,
                                }}
                                onChangePage={handleChangePage}
                                onChangeRowsPerPage={handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                )}
            </Table>
        </TableContainer>
    );
}
