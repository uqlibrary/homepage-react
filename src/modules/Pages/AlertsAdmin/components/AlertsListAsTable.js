import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
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

const useStyles2 = makeStyles({
    table: {
        minWidth: 500,
    },
    editButton: {
        backgroundColor: '#0e62eb',
        color: '#fff',
        padding: '1em',
    },
});

export default function AlertsListAsTable(rows, dataLoading, hasFooter = false) {
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

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="custom pagination table">
                <TableHead>
                    <TableRow md-row="" className="md-row">
                        <TableCell component="th" scope="row" />
                        <TableCell component="th" scope="row">
                            Alert
                        </TableCell>
                        <TableCell component="th" scope="row">
                            Publish Date
                        </TableCell>
                        <TableCell component="th" scope="row">
                            Unpublish Date
                        </TableCell>
                        <TableCell component="th" scope="row" />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(rowsPerPage > 0 ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : rows).map(
                        alert => {
                            const startDate =
                                moment(alert.start).format('m') === '0'
                                    ? moment(alert.start).format('dddd D/MMM/YYYY ha')
                                    : moment(alert.start).format('dddd D/MMM/YYYY h.mma');
                            const endDate =
                                moment(alert.end).format('m') === '0'
                                    ? moment(alert.end).format('dddd D/MMM/YYYY ha')
                                    : moment(alert.end).format('dddd D/MMM/YYYY h.mma');
                            // Strip markdown from the body
                            const linkRegex = alert.body.match(/\[([^\]]+)\]\(([^)]+)\)/);
                            let message = alert.body;
                            if (!!linkRegex && linkRegex.length === 3) {
                                message = message.replace(linkRegex[0], '').replace('  ', ' ');
                            }
                            return (
                                <TableRow key={alert.id} id={alert.id}>
                                    <TableCell component="td">
                                        <Checkbox />
                                    </TableCell>
                                    <TableCell component="td">
                                        <b>{`${alert.title}`}</b> {`${message}`}
                                    </TableCell>
                                    <TableCell component="td" align="center">
                                        {startDate}
                                    </TableCell>
                                    <TableCell component="td" align="center">
                                        {endDate}
                                    </TableCell>
                                    <TableCell component="td">
                                        <a
                                            className={classes.editButton}
                                            data-testid="alert-list-edit"
                                            disabled={dataLoading}
                                            id="alert-list-edit-button"
                                            href={`/admin/alerts/edit/${alert.id}`}
                                        >
                                            Edit
                                        </a>
                                    </TableCell>
                                </TableRow>
                            );
                        },
                    )}
                </TableBody>
                {!!hasFooter && (
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                colSpan={3}
                                count={rows.length}
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
