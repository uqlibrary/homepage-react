/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useCookies } from 'react-cookie';
import { makeStyles } from '@material-ui/core/styles';
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
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { PromoPanelPreview } from '../PromoPanelPreview';
import { Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

import { PromoPanelSplitButton } from './PromoPanelSplitButton';

import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';

// import { TablePaginationActions } from './TablePaginationActions';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { useConfirmationState } from 'hooks';
import { default as locale } from '../promoPanelAdmin.locale';
import ReactSeventeenAdapter from '@wojtekmaj/enzyme-adapter-react-17';
import { getClassNumberFromPieces } from 'data/actions';
// import AlertSplitButton from './AlertSplitButton';
// import { scrollToTopOfPage, systemList } from '../alerthelpers';

const moment = require('moment');

// original based on https://codesandbox.io/s/hier2
// per https://material-ui.com/components/tables/#custom-pagination-actions

const useStyles2 = makeStyles(
    theme => ({
        cellGroupRowOdd: {
            backgroundColor: '#eee',
        },
        cellGroupRowEven: {
            backgroundColor: 'none',
        },
        ellipsis: {
            maxWidth: 500, // percentage also works
            display: 'inline-block',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
        cellGroupName: {
            marginTop: 0,
            marginBottom: 0,
            paddingTop: 5,
            paddingBottom: 0,
            fontWeight: 400,
            borderBottom: 'none',
            borderTop: '1px solid #aaa',
        },
        cellGroupDetails: {
            marginTop: 0,
            marginBottom: 0,
            paddingTop: 0,
            paddingBottom: 5,
            fontWeight: 400,
            borderBottom: 'none',
        },
        cellGroupDetailsLast: {
            marginTop: 0,
            marginBottom: 0,
            paddingTop: 0,
            paddingBottom: 20,
            fontWeight: 400,
            borderBottom: 'none',
        },
        table: {
            minWidth: 500,
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
            backgroundColor: theme.palette.primary.main,
            color: '#fff',
        },
        iconHighlighted: {
            color: '#fff',
        },
        chipblock: {
            '&>div': {
                marginBottom: 4,
            },
            '&>div>div': {
                marginBottom: 4,
            },
        },
        defaultChip: {
            backgroundColor: theme.palette.primary.main,
            color: '#fff',
            fontWeight: 'bold',
        },
        urgent: {
            backgroundColor: theme.palette.warning.light,
            color: '#000',
        },
        extreme: {
            backgroundColor: theme.palette.error.main,
            color: '#fff',
        },
        system: {
            backgroundColor: '#666666',
            color: '#fff',
        },
        checkboxCell: {
            '& input[type="checkbox"]:checked + svg': {
                fill: '#222',
            },
        },
        removedChip: {
            textDecoration: 'line-through',
        },
    }),
    { withTheme: true },
);
export const PromoPanelListPanels = ({
    panelList,
    title,
    canEdit,
    canClone,
    canDelete,
    isLoading,
    rows,
    headertag,
    alertsLoading,
    history,
    actions,
    deletePanel,
    footerDisplayMinLength,
    alertOrder,
}) => {
    const [isDeleteConfirmOpen, showDeleteConfirmation, hideDeleteConfirmation] = useConfirmationState();
    const [
        isDeleteFailureConfirmationOpen,
        showDeleteFailureConfirmation,
        hideDeleteFailureConfirmation,
    ] = useConfirmationState();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewPanel, setPreviewPanel] = useState({});
    const [deleteActive, setDeleteActive] = useState(false);
    const [alertNotice, setAlertNotice] = useState('');
    const classes = useStyles2();
    const rowMarker = 0;
    const regex = /(<([^>]+)>)/gi;
    const clearAllCheckboxes = () => {
        const checkBoxList = document.querySelectorAll('#admin-promoPanel-list input[type="checkbox"]');
        checkBoxList.forEach(ii => {
            if (ii.checked) {
                ii.click();
            }
        });
    };
    const reEnableAllCheckboxes = () => {
        const checkBoxList = document.querySelectorAll('#admin-promoPanel-list input[type="checkbox"]');
        checkBoxList.forEach(ii => {
            ii.disabled = false;
            ii.parentElement.parentElement.classList.remove('Mui-disabled');
        });
    };


    const confirmDeleteLocale = numberOfCheckedBoxes => {
        return {
            ...locale.listPage.confirmDelete,
            confirmationTitle: locale.listPage.confirmDelete.confirmationTitle
                .replace('[N]', numberOfCheckedBoxes)
                .replace('alerts', numberOfCheckedBoxes === 1 ? 'alert' : 'alerts'),
        };
    };
    const checkBoxIdPrefix = 'list-checkbox-';

    const onPreviewOpen = (row, item) => {
        console.log('Rowz', row);
        const scheduled = !!row.panel_start && !!row.panel_end ? true : false;
        console.log('zscheduled?', scheduled);
        const groups = Array.from(row.user_types, item => item.user_type);
        console.log('zgroups', groups);
        setPreviewPanel({
            name: row.admin_notes,
            title: row.panel_title,
            content: row.panel_content,
            group: groups,
            start: row.panel_start,
            end: row.panel_end,
            scheduled: scheduled,
        });
        // console.log('Sending to preview', previewPanel);
        setPreviewOpen(true);
    };
    function getNumberCheckboxesSelected() {
        return document.querySelectorAll('#admin-promoPanel-list tr.promoPanel-data-row :checked').length;
    }
    const handlePreviewClose = () => setPreviewOpen(false);
    const handleCheckboxChange = e => {
        const numberCheckboxesSelected = getNumberCheckboxesSelected();

        const thisType = e.target.closest('table').parentElement.id;
        /* istanbul ignore else */
        if (!!e.target && !!e.target.checked) {
            // handle a checkbox being turned on
            if (numberCheckboxesSelected === 1) {
                setDeleteActive(true);
            }
            // disable any checkboxes in a different alert list
            const checkBoxList = document.querySelectorAll('#admin-promoPanel-list input[type="checkbox"]');
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
            '[n] panel[s] selected'
                .replace('[n]', numberCheckboxesSelected)
                .replace('[s]', numberCheckboxesSelected === 1 ? '' : 's'),
        );
    };
    const headerCountIndicator = (rowCount) => {
        console.log(rowCount);
            return ('[N] panel[s] selected'.replace('[N]', rowCount).replace('[s]', rowCount > 1 ? 's' : ''));
    }
    function deletePanelById(id) {
        console.log('deleting', id)
        deletePanel(id)
            .then(() => {
                setPanelNotice('');
                setDeleteActive(false);
                actions.loadAllPanels();
            })
            .catch(() => {
                showDeleteFailureConfirmation();
            });
    }
    const deleteSelectedPanels = () => {
        const checkboxes = document.querySelectorAll('#admin-promoPanel-list input[type="checkbox"]:checked');
        /* istanbul ignore else */
        if (!!checkboxes && checkboxes.length > 0) {
            checkboxes.forEach(c => {
                const id = c.value.replace(checkBoxIdPrefix, '');
                deletePanelById(id);
            });
        }
    };

    // const needsPaginator = userows.length > footerDisplayMinLength;

    return (
        <React.Fragment>
        <ConfirmationBox
                actionButtonColor="secondary"
                actionButtonVariant="contained"
                confirmationBoxId="panel-delete-confirm"
                onAction={deleteSelectedPanels}
                onClose={hideDeleteConfirmation}
                onCancelAction={hideDeleteConfirmation}
                isOpen={isDeleteConfirmOpen}
                locale={confirmDeleteLocale(getNumberCheckboxesSelected())}
            />
            <ConfirmationBox
                actionButtonColor="primary"
                actionButtonVariant="contained"
                confirmationBoxId="panel-delete-error-dialog"
                onAction={hideDeleteFailureConfirmation}
                onClose={hideDeleteFailureConfirmation}
                hideCancelButton
                isOpen={isDeleteFailureConfirmationOpen}
                locale={locale.listPage.deleteError}
            />
        <StandardCard title={title} customBackgroundColor="#F7F7F7">
            <div
                    data-testid={`headerRow-panelList`}
                    className={`${classes.headerRow} ${!!deleteActive ? classes.headerRowHighlighted : ''}`}
                >
                    <div>
                        <h3 style={{ marginBottom: 6 }}>
                            {headertag}
                            <span
                                style={{ fontSize: '0.9em', fontWeight: 300 }}
                                data-testid={`headerRow-count-panelList`}
                            >
                                {getNumberCheckboxesSelected() > 0 ? headerCountIndicator(getNumberCheckboxesSelected()): null}
                            </span>
                        </h3>
                    </div>
                    {!!deleteActive && (
                        <span className="deleteManager" style={{ marginLeft: 'auto', paddingTop: 8 }}>
                            
                            <IconButton
                                onClick={showDeleteConfirmation}
                                aria-label="Delete panel(s)"
                                data-testid={`panel-list-panel-delete-button`}
                                title="Delete panel(s)"
                            >
                                <DeleteIcon
                                    className={`${
                                        !!deleteActive ? classes.iconHighlighted : /* istanbul ignore next */ ''
                                    }`}
                                />
                            </IconButton>
                            <IconButton
                                onClick={clearAllCheckboxes}
                                aria-label="Deselect all"
                                data-testid={`panel-list-panel-deselect-button`}
                                className={classes.iconHighlighted}
                                title="Deselect all"
                            >
                                <CloseIcon />
                            </IconButton>
                        </span>
                    )}
                </div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table" id="admin-promoPanel-list">
                    <TableHead>
                        <TableRow>
                        <TableCell component="th" scope="row" />
                            <TableCell component="th" scope="row">
                                Name
                            </TableCell>
                            <TableCell component="th" scope="row">
                                Preview Content
                            </TableCell>
                            <TableCell component="th" scope="row">
                                Created
                            </TableCell>
                            <TableCell component="th" scope="row" align="right" style={{ paddingRight: 25 }}>
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {(!!isLoading || panelList.length < 1) && (
                            <TableRow>
                                <TableCell colSpan={5} align='center'>
                                    <CircularProgress
                                        id="spinner"
                                        color='primary'
                                        size={38}
                                        thickness={3}
                                        aria-label="Loading Alerts"
                                    />
                                </TableCell>
                            </TableRow>
                             
                        )}
                        {panelList.map(item => {
                            return (
                                <React.Fragment key={item.panel_id}>
                                    <TableRow className={`promoPanel-data-row ${classes.cellGroupRow}`}>
                                        <TableCell component="td" scope="row" className={classes.checkboxCell}>
                                            <Checkbox
                                                id={`panel-table-item-checkbox-${item.panel_id}`}
                                                inputProps={{
                                                    'aria-labelledby': `panel-list-item-title-${item.panel_id}`,
                                                    'data-testid': `panel-list-item-checkbox-${item.panel_id}`,
                                                }}
                                                onChange={handleCheckboxChange}
                                                value={`${checkBoxIdPrefix}${item.panel_id}`}
                                            />
                                        </TableCell>
                                        <TableCell component="td" scope="row" className={classes.cellGroupName}>
                                            <Typography variant="body1">{item.admin_notes}</Typography>
                                        </TableCell>
                                        <TableCell component="td" scope="row" className={classes.cellGroupName}>
                                            <Typography variant="body1" className={classes.ellipsis}>
                                                {(!!item.panel_content && item.panel_content.replace(regex, ' ')) ||
                                                    ' '}
                                            </Typography>
                                        </TableCell>
                                        <TableCell component="td" scope="row" className={classes.cellGroupName}>
                                            <Typography variant="body1">
                                                {moment(item.panel_created_at).format('dddd DD/MM/YYYY HH:mm a')}
                                            </Typography>
                                        </TableCell>
                                        <TableCell component="td" scope="row" className={classes.cellGroupName}>
                                            <PromoPanelSplitButton
                                                align="flex-end"
                                                alertId={alert.id}
                                                canEdit={canEdit}
                                                canClone={canClone}
                                                canDelete={canDelete}
                                                onPreview={item => onPreviewOpen(item)}
                                                row={item}
                                                // deleteAlertById={deleteAlertById}
                                                mainButtonLabel={'Edit'}
                                                // navigateToCloneForm={navigateToCloneForm}
                                                // navigateToEditForm={navigateToEditForm}
                                                // navigateToView={navigateToView}
                                                confirmDeleteLocale={confirmDeleteLocale}
                                            />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell/>
                                        <TableCell colSpan={4}>
                                            {item.user_types.map(type => {
                                                console.log('Type', type);
                                                return (
                                                    <Chip
                                                        key={type.user_type}
                                                        data-testid={'alert-list-urgent-chip-'}
                                                        label={`${type.is_default_panel ? 'Default: ' : ''} ${
                                                            type.user_type_name
                                                        }`}
                                                        title={type.user_type_name}
                                                        className={type.is_default_panel ? classes.defaultChip : ''}
                                                    />
                                                );
                                            })}
                                        </TableCell>
                                    </TableRow>
                                </React.Fragment>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <PromoPanelPreview
                isPreviewOpen={previewOpen}
                previewName={previewPanel.name}
                handlePreviewClose={handlePreviewClose}
                previewTitle={previewPanel.title}
                previewContent={previewPanel.content}
                previewGroup={previewPanel.group}
                previewScheduled={previewPanel.scheduled}
                previewStart={previewPanel.start}
                previewEnd={previewPanel.end}
            />
        </StandardCard>
        </React.Fragment>
    );
};

PromoPanelListPanels.propTypes = {
    panelList: PropTypes.array,
    title: PropTypes.string,
    canEdit: PropTypes.bool,
    canClone: PropTypes.bool,
    canDelete: PropTypes.bool,
    rows: PropTypes.array,
    isLoading: PropTypes.bool,
    headertag: PropTypes.string,
    alertsLoading: PropTypes.any,
    history: PropTypes.object,
    actions: PropTypes.any,
    deletePanel: PropTypes.func,
    footerDisplayMinLength: PropTypes.number,
    alertOrder: PropTypes.any,
};

PromoPanelListPanels.defaultProps = {
    panelList: [],
    footerDisplayMinLength: 5, // the number of records required in the alert list before we display the paginator
    alertOrder: false, // what order should we sort the alerts in? false means unspecified
};

export default PromoPanelListPanels;
