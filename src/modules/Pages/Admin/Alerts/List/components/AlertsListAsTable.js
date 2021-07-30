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

import CloseIcon from '@material-ui/icons/Close';
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
        urgent: {
            backgroundColor: theme.palette.warning.main,
            color: '#fff',
        },
        link: {
            backgroundColor: theme.palette.accent.main,
            color: '#fff',
        },
        checkboxCell: {
            '& input[type="checkbox"]:checked + svg': {
                fill: '#595959',
            },
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
    footerDisplayMinLength,
    alertOrder,
}) => {
    console.log('AlertsListAsTable alertsError = ', alertsError);
    const classes = useStyles2();
    const [page, setPage] = React.useState(0);
    const [deleteActive, setDeleteActive] = React.useState(false);
    const [alertNotice, setAlertNotice] = React.useState('');

    const [rowsPerPage, setRowsPerPage] = React.useState(footerDisplayMinLength);

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
    if (!!alertOrder && !!rows && rows.length > 0) {
        if (alertOrder === 'reverseEnd') {
            userows = rows.sort((a, b) => moment(b.end, 'YYYY-MM-DD hh:mm:ss') - moment(a.end, 'YYYY-MM-DD hh:mm:ss'));
        } else if (alertOrder === 'forwardEnd') {
            userows = rows.sort((a, b) => moment(a.end, 'YYYY-MM-DD hh:mm:ss') - moment(b.end, 'YYYY-MM-DD hh:mm:ss'));
        } else if (alertOrder === 'forwardStart') {
            userows = rows.sort(
                (a, b) => moment(a.start, 'YYYY-MM-DD hh:mm:ss') - moment(b.start, 'YYYY-MM-DD hh:mm:ss'),
            );
        }
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

    const reEnableAllCheckboxes = () => {
        const checkBoxList = document.querySelectorAll('#admin-alerts-list input[type="checkbox"]');
        checkBoxList.forEach(ii => {
            ii.disabled = false;
            ii.parentElement.parentElement.classList.remove('Mui-disabled');
        });
    };

    const clearAllCheckboxes = () => {
        const checkBoxList = document.querySelectorAll('#admin-alerts-list input[type="checkbox"]');
        checkBoxList.forEach(ii => {
            if (ii.checked) {
                ii.click();
            }
        });
    };

    function getNumberCheckboxesSelected() {
        return document.querySelectorAll('#admin-alerts-list tr.alert-data-row :checked').length;
    }

    const handleCheckboxChange = e => {
        const numberCheckboxesSelected = getNumberCheckboxesSelected();

        const thisType = e.target.closest('table').parentElement.id;
        if (!!e.target && !!e.target.checked) {
            console.log('checkbox has been checked');
            // handle a checkbox being turned on
            if (numberCheckboxesSelected === 1) {
                setDeleteActive(true);
            }
            // disable any checkboxes in a different alert list
            const checkBoxList = document.querySelectorAll('#admin-alerts-list input[type="checkbox"]');
            checkBoxList.forEach(ii => {
                const thetype = ii.closest('table').parentElement.id;
                if (thetype !== thisType) {
                    ii.disabled = true;
                    ii.parentElement.parentElement.classList.add('Mui-disabled');
                }
            });
        } else if (!!e.target && !e.target.checked) {
            console.log('checkbox has been UNchecked');
            // handle a checkbox being turned off
            if (numberCheckboxesSelected === 0) {
                setDeleteActive(false);
                reEnableAllCheckboxes();
            }
        }
        setAlertNotice(
            '[n] alert[s] selected'
                .replace('[n]', numberCheckboxesSelected)
                .replace('[s]', numberCheckboxesSelected === 1 ? '' : 's'),
        );
    };

    const deleteSelectedAlerts = () => {
        const checkboxes = document.querySelectorAll('#admin-alerts-list input[type="checkbox"]:checked');
        if (!!checkboxes && checkboxes.length > 0) {
            checkboxes.forEach(c => {
                const alertID = c.value.replace(checkBoxIdPrefix, '');
                console.log('deleting alert with id ', alertID);
                deleteAlert(alertID)
                    .then(() => {
                        console.log('then deleted error status: ', alertsError);
                        console.log('deleted: ', `alert-list-row-${alertID}`);

                        setAlertNotice('');
                        setDeleteActive(false);
                        actions.loadAllAlerts();
                    })
                    .catch(() => {
                        showDeleteFailureConfirmation();
                    });
            });
        }
    };

    const confirmDeleteLocale = numberOfCheckedBoxes => {
        return {
            ...locale.listPage.confirmDelete,
            confirmationTitle: locale.listPage.confirmDelete.confirmationTitle
                .replace('[N]', numberOfCheckedBoxes)
                .replace('alerts', numberOfCheckedBoxes === 1 ? 'alert' : 'alerts'),
        };
    };

    const needsPaginator = userows.length > footerDisplayMinLength;
    return (
        <React.Fragment>
            <ConfirmationBox
                actionButtonColor="secondary"
                actionButtonVariant="contained"
                confirmationBoxId="alert-delete-confirm"
                onAction={deleteSelectedAlerts}
                onClose={hideDeleteConfirmation}
                onCancelAction={hideDeleteConfirmation}
                isOpen={isDeleteConfirmOpen}
                locale={confirmDeleteLocale(getNumberCheckboxesSelected())}
            />
            <ConfirmationBox
                actionButtonColor="primary"
                actionButtonVariant="contained"
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
                    <span style={{ marginLeft: 'auto', paddingTop: 8 }}>
                        <span>{alertNotice}</span>
                        <IconButton
                            onClick={showDeleteConfirmation}
                            aria-label="Delete alert(s)"
                            data-testid={`alert-list-${tableType}-delete-button`}
                        >
                            <DeleteIcon className={`${!!deleteActive ? classes.iconHighlighted : ''}`} />
                        </IconButton>
                        <IconButton
                            onClick={clearAllCheckboxes}
                            aria-label="Clear selected checkboxes"
                            data-testid={`alert-list-${tableType}-deselect-button`}
                            className={classes.iconHighlighted}
                        >
                            <CloseIcon />
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
                                        className="alert-data-row"
                                    >
                                        <TableCell component="td" className={classes.checkboxCell}>
                                            <Checkbox
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
                                                {alert.body.includes('](') && (
                                                    <Chip
                                                        data-testid={`alert-list-link-chip-${alert.id}`}
                                                        label="Link"
                                                        title="This alert has a link out"
                                                        className={classes.link}
                                                    />
                                                )}{' '}
                                                {!!alert.urgent && (
                                                    <Chip
                                                        data-testid={`alert-list-urgent-chip-${alert.id}`}
                                                        label="Urgent"
                                                        title="This is an urgent alert"
                                                        className={classes.urgent}
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
                    {!!needsPaginator && (
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: rows.length }]}
                                    colSpan={3}
                                    count={userows.length}
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
    footerDisplayMinLength: PropTypes.number,
    alertOrder: PropTypes.any,
};

AlertsListAsTable.defaultProps = {
    footerDisplayMinLength: 5, // the number of records required in the alert list before we display the paginator
    alertOrder: false, // what order should we sort the alerts in?
};

export default AlertsListAsTable;
