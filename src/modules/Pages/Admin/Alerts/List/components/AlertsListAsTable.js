import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
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

import { TablePaginationActions } from './TablePaginationActions';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { useConfirmationState } from 'hooks';
import { default as locale } from '../../alertsadmin.locale';

const moment = require('moment');

// original based on https://codesandbox.io/s/hier2
// per https://material-ui.com/components/tables/#custom-pagination-actions

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
export const AlertsListAsTable = ({
    rows,
    headertag,
    alertsLoading,
    alertsError,
    history,
    actions,
    deleteAlert,
    hasFooter,
}) => {
    console.log('AlertsListAsTable alertsError = ', alertsError);
    const classes = useStyles2();
    const [page, setPage] = React.useState(0);
    const [deleteActive, setDeleteActive] = React.useState(false);
    const [alertNotice, setAlertNotice] = React.useState('');

    const defaultNumberOfRowsToDisplay = 5;
    const [rowsPerPage, setRowsPerPage] = React.useState(defaultNumberOfRowsToDisplay);

    const [isDeleteConfirmOpen, showDeleteConfirmation, hideDeleteConfirmation] = useConfirmationState();
    const [
        isDeleteFailureConfirmationOpen,
        showDeleteFailureConfirmation,
        hideDeleteFailureConfirmation,
    ] = useConfirmationState();

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const checkBoxIdPrefix = 'checkbox-';

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const tableType = headertag.replace(' alerts', '').toLowerCase();
    console.log('AlertsListAsTable ', tableType, ' rows = ', rows);

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
                    height: 200, // default to some space for the blocks
                }}
            >
                <InlineLoader message="Loading" />
            </Grid>
        );
    }

    const navigateToEditForm = alertid => {
        history.push(`/admin/alerts/edit/${alertid}`);

        const topOfPage = document.getElementById('StandardPage');
        !!topOfPage && topOfPage.scrollIntoView();
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

    function handleShowDeleteFailureConfirmation(numRequestsSuccess, numRequestsActual, numRequests) {
        if (numRequestsActual === numRequests && numRequestsSuccess < numRequests) {
            console.log('count: numRequestsSuccess = ', numRequestsSuccess, '; numRequests = ', numRequests);
            showDeleteFailureConfirmation();
        }
    }

    const deleteSelectedAlerts = () => {
        const checkboxes = document.querySelectorAll('#admin-alerts-list input[type="checkbox"]:checked');
        if (!!checkboxes && checkboxes.length > 0) {
            let numRequestsActual = 0;
            let numRequestsSuccess = 0;
            checkboxes.forEach(c => {
                const alertID = c.value.replace(checkBoxIdPrefix, '');
                console.log('deleting alert with id ', alertID);
                numRequestsActual++;
                deleteAlert(alertID)
                    .then(response => {
                        numRequestsSuccess++;
                        console.log('response was ', response);
                        console.log('then deleted error status: ', alertsError);
                        console.log('deleted: ', `alert-list-row-${alertID}`);

                        setAlertNotice('');
                        setDeleteActive(false);
                        actions.loadAllAlerts();

                        handleShowDeleteFailureConfirmation(numRequestsSuccess, numRequestsActual, checkboxes.length);
                    })
                    .catch(x => {
                        console.log('There was an error deleting ', x);
                        handleShowDeleteFailureConfirmation(numRequestsSuccess, numRequestsActual, checkboxes.length);
                    });
            });
        }
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
                confirmationBoxId="alert-delete-confirm"
                onAction={deleteSelectedAlerts}
                onClose={hideDeleteConfirmation}
                onCancelAction={hideDeleteConfirmation}
                isOpen={isDeleteConfirmOpen}
                locale={confirmDeleteLocale(numberOfCheckedBoxes)}
            />
            <ConfirmationBox
                confirmationBoxId="alert-delete-error-dialog"
                onAction={hideDeleteFailureConfirmation}
                onClose={hideDeleteFailureConfirmation}
                hideCancelButton
                isOpen={isDeleteFailureConfirmationOpen}
                locale={locale.listPage.deleteError}
            />
            <div
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
                            onClick={showDeleteConfirmation}
                            aria-label="Delete alert(s)"
                            // id={`training-list-${tableType}-delete-button`}
                            data-testid={`training-list-${tableType}-delete-button`}
                        >
                            <DeleteIcon className={`${!!deleteActive ? classes.iconHighlighted : ''}`} />
                        </IconButton>
                    </span>
                )}
            </div>
            <TableContainer id={`alert-list-${tableType}`} data-testid={`alert-list-${tableType}`} component={Paper}>
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
                        {rowsPerPage > 0 &&
                            userows.length > 0 &&
                            userows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(alert => {
                                return (
                                    <TableRow
                                        key={alert.id}
                                        id={`alert-list-row-${alert.id}`}
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
                                                value={`${checkBoxIdPrefix}${alert.id}`}
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
                            })}
                        <TableRow
                            id={`alert-list-no-alerts-${tableType}`}
                            data-testid={`alert-list-no-alerts-${tableType}`}
                            style={
                                rowsPerPage > 0 && userows.length > 0 ? { display: 'none' } : { display: 'table-row' }
                            }
                        >
                            <TableCell component="td">
                                <p>No alerts</p>
                            </TableCell>
                        </TableRow>
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
};

AlertsListAsTable.propTypes = {
    rows: PropTypes.array,
    headertag: PropTypes.string,
    alertsLoading: PropTypes.any,
    alertsError: PropTypes.any,
    history: PropTypes.object,
    actions: PropTypes.any,
    deleteAlert: PropTypes.any,
    hasFooter: PropTypes.bool,
};

AlertsListAsTable.defaultProps = {
    hasFooter: false,
};

export default AlertsListAsTable;
