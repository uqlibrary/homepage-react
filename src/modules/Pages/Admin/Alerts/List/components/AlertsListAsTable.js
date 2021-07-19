import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
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

import DeleteIcon from '@material-ui/icons/Delete';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';

import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { useConfirmationState } from 'hooks';
import { default as locale } from '../../alertsadmin.locale';

const moment = require('moment');

// original based on https://codesandbox.io/s/hier2
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
            color: '#fff',
            '&:hover': {
                backgroundColor: theme.palette.accent.dark,
            },
        },
        startDate: {
            whiteSpace: 'pre', // makes moment format able to take a carriage return
        },
        endDate: {
            whiteSpace: 'pre',
        },
        headerRow: {
            display: 'flex',
            padding: '0 0.5rem',
        },
        headerRowHighlighted: {
            backgroundColor: theme.palette.accent.main,
            color: '#fff',
        },
        iconHighlighted: {
            color: '#fff',
        },
    }),
    { withTheme: true },
);

export default function AlertsListAsTable(rows, headertag, alertsLoading, history, hasFooter = false) {
    const classes = useStyles2();
    const [page, setPage] = React.useState(0);
    const [deleteActive, setDeleteActive] = React.useState(false);
    const [alertNotice, setAlertNotice] = React.useState('');

    const defaultNumberOfRowsToDisplay = 5;
    const [rowsPerPage, setRowsPerPage] = React.useState(defaultNumberOfRowsToDisplay);

    const [isOpen, showConfirmation, hideConfirmation] = useConfirmationState();

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const tableType = headertag.replace(' alerts', '').toLowerCase();

    let userows = rows;
    // anything which is planning to show a footer should be reversed into 'show newest first' order
    if (!!hasFooter && !!rows && rows.length > 0) {
        userows = rows.sort((a, b) => moment(b.end, 'YYYY-MM-DD hh:mm:ss') - moment(a.end, 'YYYY-MM-DD hh:mm:ss'));
    }

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

    const navigateToEditForm = alertid => {
        history.push(`/admin/alerts/edit/${alertid}`);
    };

    const handleCheckboxChange = e => {
        const numberOfCheckedBoxes = document.querySelectorAll('#admin-alerts-list :checked').length - 1;

        if (!!e.target && !!e.target.checked) {
            console.log('checkbox has been checked');
            // handle a checkbox being turned on
            if (numberOfCheckedBoxes === 1) {
                setDeleteActive(true);
            }
        } else if (!!e.target && !e.target.checked) {
            console.log('checkbox has been UNchecked');
            // handle a checkbox being turned off
            if (numberOfCheckedBoxes === 0) {
                setDeleteActive(false);
            }
        }
        setAlertNotice(
            '[n] alert[s] selected'
                .replace('[n]', numberOfCheckedBoxes)
                .replace('[s]', numberOfCheckedBoxes === 1 ? '' : 's'),
        );
    };

    const confirmDelete = () => {
        // const checkboxes0 = document.querySelectorAll('input[type="checkbox"]');
        // const checkboxes = document.querySelectorAll('#admin-alerts-list :checked');

        showConfirmation();
    };

    // for next phase
    const deleteSelectedAlerts = () => {
        const checkboxes = document.querySelectorAll('#admin-alerts-list input[type="checkbox"]:checked');
        console.log('checkboxes = ', checkboxes);
    };

    const numberOfCheckedBoxes = document.querySelectorAll('#admin-alerts-list :checked').length - 1;

    const confirmDeleteLocale = numberOfCheckedBoxes => {
        return {
            ...locale.listPage.confirmDelete,
            confirmationTitle: locale.listPage.confirmDelete.confirmationTitle
                .replace('[N]', numberOfCheckedBoxes)
                .replace('alerts', numberOfCheckedBoxes === 1 ? 'alert' : 'alerts'),
        };
    };

    return (
        <React.Fragment>
            <ConfirmationBox
                confirmationBoxId="alert-delete-dialog"
                onAction={() => deleteSelectedAlerts()}
                onClose={hideConfirmation}
                onCancelAction={hideConfirmation}
                isOpen={isOpen}
                locale={confirmDeleteLocale(numberOfCheckedBoxes)}
            />
            <div
                // id={`headerRow-${tableType}`}
                data-testid={`headerRow-${tableType}`}
                className={`${classes.headerRow} ${!!deleteActive ? classes.headerRowHighlighted : ''}`}
            >
                <h3>{headertag}</h3>
                {!!deleteActive && (
                    <span
                        style={{ marginLeft: 'auto', paddingTop: 8 }}
                        // id={`delete-${tableType}`}
                    >
                        <span>{alertNotice}</span>
                        <IconButton
                            onClick={confirmDelete}
                            aria-label="Delete alert(s)"
                            // id={`training-list-${tableType}-delete-button`}
                            data-testid={`training-list-${tableType}-delete-button`}
                        >
                            <DeleteIcon className={`${!!deleteActive ? classes.iconHighlighted : ''}`} />
                        </IconButton>
                    </span>
                )}
            </div>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="custom pagination table">
                    <TableHead>
                        <TableRow md-row="" className="md-row">
                            <TableCell component="th" scope="row" />
                            <TableCell component="th" scope="row">
                                Alert
                            </TableCell>
                            <TableCell component="th" scope="row" align="center">
                                Publish date
                            </TableCell>
                            <TableCell component="th" scope="row" align="center">
                                Unpublish date
                            </TableCell>
                            <TableCell component="th" scope="row" />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rowsPerPage > 0 && userows.length > 0 ? (
                            userows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(alert => {
                                return (
                                    <TableRow
                                        key={alert.id}
                                        // id={`row-${alert.id}`}
                                        data-testid={`alert-list-row-${alert.id}`}
                                    >
                                        <TableCell component="td">
                                            <Checkbox
                                                classes={{ root: classes.checkbox }}
                                                id={`alert-list-item-checkbox-${alert.id}`}
                                                inputProps={{
                                                    'aria-labelledby': `alert-list-item-title-${alert.id}`,
                                                    'data-testid': `alert-list-item-checkbox-${alert.id}`,
                                                }}
                                                onChange={handleCheckboxChange}
                                                value={`checkbox-${alert.id}`}
                                            />
                                        </TableCell>
                                        <TableCell component="td" className="alertText">
                                            <h4
                                                style={{ display: 'inline' }}
                                                id={`alert-list-item-title-${alert.id}`}
                                            >{`${alert.title}`}</h4>{' '}
                                            {`${alert.message.replace('[permanent]', '')}`}
                                            <div>
                                                {!!alert.urgent && (
                                                    <Chip
                                                        data-testid={`alert-list-urgent-chip-${alert.id}`}
                                                        label="Urgent"
                                                        title="This is an urgent alert"
                                                    />
                                                )}{' '}
                                                {alert.body.includes('](') && (
                                                    <Chip
                                                        data-testid={`alert-list-link-chip-${alert.id}`}
                                                        label="Link"
                                                        title="This alert has a link out"
                                                    />
                                                )}{' '}
                                                {alert.body.includes('[permanent]') && (
                                                    <Chip
                                                        data-testid={`alert-list-permanent-chip-${alert.id}`}
                                                        label="Permanent"
                                                        title="This alert cannot be dismissed"
                                                    />
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell component="td" align="center" className={classes.startDate}>
                                            <span title={alert.startDateLong}>{alert.startDateDisplay}</span>
                                        </TableCell>
                                        <TableCell component="td" align="center" className={classes.endDate}>
                                            <span title={alert.endDateLong}>{alert.endDateDisplay}</span>
                                        </TableCell>
                                        <TableCell component="td">
                                            <Button
                                                children="Edit"
                                                color="primary"
                                                data-testid={`alert-list-item-edit-${alert.id}`}
                                                id={`alert-list-item-edit-${alert.id}`}
                                                onClick={() => navigateToEditForm(alert.id)}
                                                className={classes.editButton}
                                                variant="contained"
                                            />
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
                    {!!hasFooter && userows.length > 0 && (
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: rows.length }]}
                                    colSpan={3}
                                    count={userows.length}
                                    // id="alert-list-footer"
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    SelectProps={{
                                        inputProps: {
                                            'aria-label': 'rows per page',
                                            'data-testid': 'admin-alerts-list-paginator-select',
                                        },
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
        </React.Fragment>
    );
}
