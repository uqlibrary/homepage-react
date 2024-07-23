import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useCookies } from 'react-cookie';
import Chip from '@mui/material/Chip';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';

import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';

import { TablePaginationActions } from './TablePaginationActions';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { useConfirmationState } from 'hooks';
import { default as locale } from '../alertsadmin.locale';
import AlertSplitButton from './AlertSplitButton';
import { systemList } from '../alerthelpers';
import { scrollToTopOfPage } from 'helpers/general';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const moment = require('moment');

// original based on https://codesandbox.io/s/hier2
// per https://material-ui.com/components/tables/#custom-pagination-actions

const StyledHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    padding: '0 0.5rem',
    '&.headerRowHighlighted': {
        backgroundColor: theme.palette.primary.main,
        color: '#fff',
    },
    '& .iconHighlighted': {
        color: '#fff',
    },
}));

const StyledTable = styled(Table)(({ theme }) => ({
    '&.table': {
        minWidth: 500,
    },
    '& .startDate': {
        whiteSpace: 'pre', // makes moment format able to take a carriage return
    },
    '& .endDate': {
        whiteSpace: 'pre',
    },
    '& .chipblock': {
        '&>div': {
            marginBottom: 4,
        },
        '&>div>div': {
            marginBottom: 4,
        },
    },
    '& .urgent': {
        backgroundColor: theme.palette.warning.light,
        color: '#000',
    },
    '& .extreme': {
        backgroundColor: theme.palette.error.main,
        color: '#fff',
    },
    '& .system': {
        backgroundColor: '#666666',
        color: '#fff',
    },
    '& .checkboxCell': {
        '& input[type="checkbox"]:checked + svg': {
            fill: '#595959',
        },
    },
    '& .removedChip': {
        textDecoration: 'line-through',
    },
    '& .screenreader': {
        position: 'absolute',
        left: -9999,
    },
}));

export const AlertsListAsTable = ({
    rows,
    headertag,
    alertsLoading,
    actions,
    deleteAlert,
    footerDisplayMinLength,
    alertOrder,
}) => {
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [deleteActive, setDeleteActive] = useState(false);
    const [alertNotice, setAlertNotice] = useState('');
    const [cookies, setCookie] = useCookies();

    const [rowsPerPage, setRowsPerPage] = useState(
        (!cookies.alertAdminPaginatorSize && footerDisplayMinLength) || parseInt(cookies.alertAdminPaginatorSize, 10),
    );

    const [isDeleteConfirmOpen, showDeleteConfirmation, hideDeleteConfirmation] = useConfirmationState();
    const [
        isDeleteFailureConfirmationOpen,
        showDeleteFailureConfirmation,
        hideDeleteFailureConfirmation,
    ] = useConfirmationState();

    React.useEffect(() => {
        // make it redraw when all displayed rows in a table are deleted
        setPage(0);
    }, [rows]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const checkBoxIdPrefix = 'checkbox-';

    const handleChangeRowsPerPage = event => {
        const numberOfRows = parseInt(event.target.value, 10);

        const current = new Date();
        const nextYear = new Date();
        nextYear.setFullYear(current.getFullYear() + 1);
        setCookie('alertAdminPaginatorSize', numberOfRows, { expires: nextYear });

        setRowsPerPage(numberOfRows);
        setPage(0);
    };

    const tableType = headertag.replace(' alerts', '').toLowerCase();

    const headerCountIndicator = '[N] alert[s]'.replace('[N]', rows.length).replace('[s]', rows.length > 1 ? 's' : '');

    let userows = rows;
    if (!!alertOrder && !!rows && rows.length > 0) {
        // (fake switch to allow istanbul on else if :( )
        switch (alertOrder) {
            case 'reverseEnd':
                userows = rows.sort(
                    (a, b) => moment(b.end, 'YYYY-MM-DD hh:mm:ss') - moment(a.end, 'YYYY-MM-DD hh:mm:ss'),
                );
                break;
            /* istanbul ignore next */
            case 'forwardEnd':
                userows = rows.sort(
                    (a, b) => moment(a.end, 'YYYY-MM-DD hh:mm:ss') - moment(b.end, 'YYYY-MM-DD hh:mm:ss'),
                );
                break;
            /* istanbul ignore next */
            case 'forwardStart':
                userows = rows.sort(
                    (a, b) => moment(a.start, 'YYYY-MM-DD hh:mm:ss') - moment(b.start, 'YYYY-MM-DD hh:mm:ss'),
                );
                break;
            /* istanbul ignore next */
            default:
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
        navigate(`/admin/alerts/edit/${alertid}`);
        scrollToTopOfPage();
    };

    const navigateToCloneForm = alertid => {
        navigate(`/admin/alerts/clone/${alertid}`);
        scrollToTopOfPage();
    };

    const navigateToView = alertid => {
        navigate(`/admin/alerts/view/${alertid}`);
        scrollToTopOfPage();
    };

    /* istanbul ignore next */
    const reEnableAllCheckboxes = () => {
        // is tested but coverage failing
        const checkBoxList = document.querySelectorAll('#admin-alerts-list input[type="checkbox"]');
        checkBoxList.forEach(ii => {
            ii.disabled = false;
            ii.parentElement.parentElement.classList.remove('Mui-disabled');
        });
    };

    /* istanbul ignore next */
    const clearAllCheckboxes = () => {
        // is tested but coverage failing
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

    /* istanbul ignore next */
    const handleCheckboxChange = e => {
        // is tested but coverage failing
        const numberCheckboxesSelected = getNumberCheckboxesSelected();

        const thisType = e.target.closest('table').parentElement.id;
        /* istanbul ignore else */
        if (!!e.target && !!e.target.checked) {
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
        } /* istanbul ignore else */ else if (!!e.target && !e.target.checked) {
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

    /* istanbul ignore next */
    function deleteAlertById(alertID) {
        // this is called, but the coverage isn't happening
        deleteAlert(alertID)
            .then(() => {
                setAlertNotice('');
                setDeleteActive(false);
                actions.loadAllAlerts();
            })
            .catch(() => {
                showDeleteFailureConfirmation();
            });
    }

    /* istanbul ignore next */
    const deleteSelectedAlerts = () => {
        // is tested but coverage failing
        const checkboxes = document.querySelectorAll('#admin-alerts-list input[type="checkbox"]:checked');
        /* istanbul ignore else */
        if (!!checkboxes && checkboxes.length > 0) {
            checkboxes.forEach(c => {
                const alertID = c.value.replace(checkBoxIdPrefix, '');
                deleteAlertById(alertID);
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
            <StyledHeader
                data-testid={`headerRow-${tableType}`}
                className={`${!!deleteActive ? /* istanbul ignore next */ 'headerRowHighlighted' : ''}`}
            >
                <div>
                    <h3 style={{ marginBottom: 6 }}>
                        {headertag}
                        <span
                            style={{ fontSize: '0.9em', fontWeight: 300 }}
                            data-testid={`headerRow-count-${tableType}`}
                        >
                            {' '}
                            - {headerCountIndicator}
                        </span>
                    </h3>
                </div>
                {!!deleteActive && (
                    /* istanbul ignore next */ <span
                        className="deleteManager"
                        style={{ marginLeft: 'auto', paddingTop: 8 }}
                    >
                        <span>{alertNotice}</span>
                        <IconButton
                            onClick={showDeleteConfirmation}
                            aria-label="Delete alert(s)"
                            data-testid={`alert-list-${tableType}-delete-button`}
                            title="Delete alert(s)"
                            size="large"
                        >
                            <DeleteIcon
                                className={`${
                                    !!deleteActive
                                        ? /* istanbul ignore next */ 'iconHighlighted'
                                        : /* istanbul ignore next */ ''
                                }`}
                            />
                        </IconButton>
                        <IconButton
                            onClick={clearAllCheckboxes}
                            aria-label="Deselect all"
                            data-testid={`alert-list-${tableType}-deselect-button`}
                            className={'iconHighlighted'}
                            title="Deselect all"
                            size="large"
                        >
                            <CloseIcon />
                        </IconButton>
                    </span>
                )}
            </StyledHeader>
            <TableContainer id={`alert-list-${tableType}`} data-testid={`alert-list-${tableType}`} component={Paper}>
                <StyledTable className={'table'} aria-label="custom pagination table" style={{ minHeight: 200 }}>
                    <TableHead>
                        <TableRow md-row="" className="md-row">
                            <TableCell component="th" scope="row" align="center">
                                <span className={'screenreader'}>Select</span>
                            </TableCell>
                            <TableCell component="th" scope="row">
                                Alert
                            </TableCell>
                            <TableCell component="th" scope="row" align="center">
                                Publish date
                            </TableCell>
                            <TableCell component="th" scope="row" align="center">
                                Unpublish date
                            </TableCell>
                            <TableCell component="th" scope="row" align="center">
                                <span className={'screenreader'}>Actions</span>
                            </TableCell>
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
                                        <TableCell component="td" className={'checkboxCell'}>
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
                                            <div className={'chipblock'}>
                                                {!!alert && alert.priority_type === 'urgent' && (
                                                    <Chip
                                                        data-testid={`alert-list-urgent-chip-${alert.id}`}
                                                        label="Urgent"
                                                        title={locale.form.tooltips.priority.level.urgent}
                                                        className={'urgent'}
                                                    />
                                                )}{' '}
                                                {!!alert && alert.priority_type === 'extreme' && (
                                                    <Chip
                                                        data-testid={`alert-list-urgent-chip-${alert.id}`}
                                                        label="Extreme"
                                                        title={locale.form.tooltips.priority.level.extreme}
                                                        className={'extreme'}
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
                                                {!!alert.systems &&
                                                    alert.systems.length > 0 &&
                                                    alert.systems.map((systemSlug, index) => {
                                                        const ss = systemList.find(s => s.slug === systemSlug);
                                                        return (
                                                            <div
                                                                key={`alert-list-system-chip-${ss?.slug ||
                                                                    /* istanbul ignore next */ index}`}
                                                                style={{ marginLeft: 3, display: 'inline' }}
                                                            >
                                                                <Chip
                                                                    data-testid={`alert-list-system-chip-${
                                                                        alert.id
                                                                    }-${ss?.slug || /* istanbul ignore next */ index}`}
                                                                    label={`System: ${ss?.title ||
                                                                        /* istanbul ignore next */ ss?.slug ||
                                                                        /* istanbul ignore next */ 'Unrecognised'}`}
                                                                    title={`This alert is restricted to the ${ss?.title ||
                                                                        /* istanbul ignore next */ ss?.slug ||
                                                                        /* istanbul ignore next */ 'Unrecognised'} system`}
                                                                    className={`system ${!!ss?.removed &&
                                                                        /* istanbul ignore next */ 'removedChip'}`}
                                                                />
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                        </TableCell>
                                        <TableCell component="td" align="center" className={'startDate'}>
                                            <span title={alert.startDateLong}>{alert.startDateDisplay}</span>
                                        </TableCell>
                                        <TableCell component="td" align="center" className={'endDate'}>
                                            <span title={alert.endDateLong}>{alert.endDateDisplay}</span>
                                        </TableCell>
                                        <TableCell
                                            component="td"
                                            id={`alert-list-action-block-${alert.id}`}
                                            data-testid={`alert-list-action-block-${alert.id}`}
                                        >
                                            <AlertSplitButton
                                                alertId={alert.id}
                                                deleteAlertById={deleteAlertById}
                                                mainButtonLabel={tableType === 'past' ? 'View' : 'Edit'}
                                                navigateToCloneForm={navigateToCloneForm}
                                                navigateToEditForm={navigateToEditForm}
                                                navigateToView={navigateToView}
                                                confirmDeleteLocale={confirmDeleteLocale}
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
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    ActionsComponent={TablePaginationActions}
                                />
                            </TableRow>
                        </TableFooter>
                    )}
                </StyledTable>
            </TableContainer>
        </React.Fragment>
    );
};

AlertsListAsTable.propTypes = {
    rows: PropTypes.array,
    headertag: PropTypes.string,
    alertsLoading: PropTypes.any,
    actions: PropTypes.any,
    deleteAlert: PropTypes.any,
    footerDisplayMinLength: PropTypes.number,
    alertOrder: PropTypes.any,
};

AlertsListAsTable.defaultProps = {
    footerDisplayMinLength: 5, // the number of records required in the alert list before we display the paginator
    alertOrder: false, // what order should we sort the alerts in? false means unspecified
};

export default AlertsListAsTable;
