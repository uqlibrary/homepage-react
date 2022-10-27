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
import { PromoPanelSplitButton } from './PromoPanelSplitButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';

// import { TablePaginationActions } from './TablePaginationActions';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { useConfirmationState } from 'hooks';
import { default as locale } from '../promoPanelAdmin.locale';
import ReactSeventeenAdapter from '@wojtekmaj/enzyme-adapter-react-17';
import { getClassNumberFromPieces } from 'data/actions';
// import AlertSplitButton from './AlertSplitButton';
import { scrollToTopOfPage } from 'modules/Pages/Admin/Spotlights/spotlighthelpers';

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
export const PromoPanelListTable = ({
        actions,
        isLoading,
        panelList,
        deletePanel,
        history,
        title,
        canEdit,
        canClone,
        canDelete,
        headertag,
        panelError
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
    const [PanelNotice, setPanelNotice] = useState('');
    const classes = useStyles2();
    const clearAllCheckboxes = () => {
        const checkBoxList = document.querySelectorAll('#admin-promoPanel-table input[type="checkbox"]');
        checkBoxList.forEach(ii => {
            if (ii.checked) {
                ii.click();
            }
        });
    };
    let rowMarker = 0;
    const confirmDeleteLocale = numberOfCheckedBoxes => {
        return {
            ...locale.listPage.confirmDelete,
            confirmationTitle: locale.listPage.confirmDelete.confirmationTitle
                .replace('[N]', numberOfCheckedBoxes)
                .replace('alerts', numberOfCheckedBoxes === 1 ? 'alert' : 'alerts'),
        };
    };

    const checkBoxIdPrefix = 'table-checkbox-';
    
    // const headerCountIndicator = '[N] alert[s]'.replace('[N]', rows.length).replace('[s]', rows.length > 1 ? 's' : '');

    const headerCountIndicator = (rowCount) => {
        console.log(rowCount);
            return ('[N] panel[s] selected'.replace('[N]', rowCount).replace('[s]', rowCount > 1 ? 's' : ''));
    }

    const reEnableAllCheckboxes = () => {
            const checkBoxList = document.querySelectorAll('#admin-promoPanel-table input[type="checkbox"]');
            checkBoxList.forEach(ii => {
                ii.disabled = false;
                ii.parentElement.parentElement.classList.remove('Mui-disabled');
            });
    };

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
            const checkBoxList = document.querySelectorAll('#admin-promoPanel-table input[type="checkbox"]');
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
        setPanelNotice(
            '[n] panel[s] selected'
                .replace('[n]', numberCheckboxesSelected)
                .replace('[s]', numberCheckboxesSelected === 1 ? '' : 's'),
        );
    };

    

    const onPreviewOpen = (row, item) => {
        console.log('Row', row);
        console.log('item', item);
        const scheduled = !!row.panel_start && !!row.panel_end ? true : false;
        console.log('scheduled?', scheduled);
        // console.log('Value', value);
        setPreviewPanel({
            name: row.admin_notes,
            title: row.panel_title,
            content: row.panel_content,
            group: [item.user_type],
            start: row.panel_start,
            end: row.panel_end,
            scheduled: scheduled,
        });
        // console.log('Sending to preview', previewPanel);
        setPreviewOpen(true);
    };
    const handlePreviewClose = () => setPreviewOpen(false);
    
    function getNumberCheckboxesSelected() {
        return document.querySelectorAll('#admin-promoPanel-table tr.promoPanel-data-row :checked').length;
    }
    function deletePanelById(id) {
        console.log('deleting', id)
        console.log('actions', actions)
        actions.deletePanel(id)
            .then(() => {
                setPanelNotice('');
                setDeleteActive(false);
                actions.loadPromoPanelUserList();
                clearAllCheckboxes();
            })
            .catch((e) => {
                console.log("Thrown an error", e);
                showDeleteFailureConfirmation();
            });
    }
    const deleteSelectedPanels = () => {
        const checkboxes = document.querySelectorAll('#admin-promoPanel-table input[type="checkbox"]:checked');
        /* istanbul ignore else */
        if (!!checkboxes && checkboxes.length > 0) {
            checkboxes.forEach(c => {
                const id = c.value.replace(checkBoxIdPrefix, '');
                deletePanelById(id);
            });
            
        }
       
    };
    const navigateToEditForm = alertid => {
       console.log("ID", alertid)
        // history.push(`/admin/promopanel/edit/${alertid}`);
        scrollToTopOfPage();
    };
    // const needsPaginator = userows.length > footerDisplayMinLength;
    console.log("PANEL ERROR", panelError)
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
                showAdditionalInformation
                additionalInformation={panelError}
            />
       
            <StandardCard title={title} customBackgroundColor="#F7F7F7">
                <div
                    data-testid={`headerRow-table`}
                    className={`${classes.headerRow} ${!!deleteActive ? classes.headerRowHighlighted : ''}`}
                >
                    <div>
                        <h3 style={{ marginBottom: 6 }}>
                            {headertag}
                            <span
                                style={{ fontSize: '0.9em', fontWeight: 300 }}
                                data-testid={`headerRow-count-table`}
                            >
                                {getNumberCheckboxesSelected() > 0 ? headerCountIndicator(getNumberCheckboxesSelected()): null}
                            </span>
                        </h3>
                    </div>
                    {!!deleteActive && (
                        <span className="deleteManager" style={{ marginLeft: 'auto', paddingTop: 8 }}>
                            
                            <IconButton
                                onClick={showDeleteConfirmation}
                                aria-label="Delete alert(s)"
                                data-testid={`panel-list-table-delete-button`}
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
                                data-testid={`panel-list-table-deselect-button`}
                                className={classes.iconHighlighted}
                                title="Deselect all"
                            >
                                <CloseIcon />
                            </IconButton>
                        </span>
                    )}
                </div>
                <TableContainer component={Paper}>
                    <Table  size="small" aria-label="a dense table" id={`admin-promoPanel-table`}>
                        <TableHead>
                            <TableRow>
                            
                                    
                                <TableCell component="th" scope="row">
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    <Typography variant="body1">Panel Name</Typography>
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    <Typography variant="body1">From</Typography>
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    <Typography variant="body1">To</Typography>
                                </TableCell>
                                <TableCell component="th" scope="row" align="right" style={{ paddingRight: 25 }}>
                                    <Typography variant="body1">Actions</Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/* Start of a Group and it's Panels */}
                            {(!!isLoading || panelList.length < 1) && (
                                <TableRow>
                                    <TableCell colSpan={6} align='center'>
                                        <CircularProgress
                                            id="ListTableSpinner"
                                            color='primary'
                                            size={38}
                                            thickness={3}
                                            aria-label="Loading Table Panels"
                                        />
                                    </TableCell>
                                </TableRow>
                                
                            )}
                            {!isLoading && panelList.map((item, id) => {
                                rowMarker = 0;
                                return (
                                    <React.Fragment key={id}>
                                        
                                            
                                        
                                        <TableRow className={classes.cellGroupRow}>
                                        
                                            <TableCell colSpan={6} component="td" scope="row" className={classes.cellGroupName}>
                                                <Typography variant="body1">{item.user_type_name}</Typography>
                                            </TableCell>
                                            
                                        </TableRow>

                                        {item.panels.map((row, id) => {
                                            rowMarker++;
                                            return (
                                                <TableRow
                                                    className={`promoPanel-data-row ${
                                                        rowMarker % 2 === 0
                                                            ? classes.cellGroupRowEven
                                                            : classes.cellGroupRowOdd
                                                    }`}
                                                    key={id}
                                                >
                                                    <TableCell className={classes.checkboxCell}>
                                                        <Checkbox
                                                        id={`panel-table-item-checkbox-${row.panel_id}`}
                                                        inputProps={{
                                                            'aria-labelledby': `panel-table-item-title-${row.panel_id}`,
                                                            'data-testid': `panel-list-table-checkbox-${row.panel_id}`,
                                                        }}
                                                        onChange={handleCheckboxChange}
                                                        value={`${checkBoxIdPrefix}${row.panel_id}`}
                                                        />
                                                    </TableCell>
                                                    <TableCell className={classes.cellGroupDetails}>
                                                        <Typography variant="body1">
                                                            <strong>{row.panel_title}</strong>
                                                            <br />
                                                            {row.admin_notes}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell className={classes.cellGroupDetails}>
                                                        <Typography variant="body1">
                                                            {!!!row.is_default_panel && !!!row.is_default
                                                                ? moment(row.panel_start).format('dddd DD/MM/YYYY HH:mm a')
                                                                : 'Default'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell className={classes.cellGroupDetails}>
                                                        <Typography variant="body1">
                                                            {' '}
                                                            {!!!row.is_default && !!!row.is_default_panel
                                                                ? moment(row.panel_end).format('dddd DD/MM/YYYY HH:mm a')
                                                                : ''}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell className={classes.cellGroupDetails}>
                                                        <PromoPanelSplitButton
                                                            alertId={alert.id}
                                                            canEdit={canEdit}
                                                            canClone={canClone}
                                                            canDelete={canDelete}
                                                            onPreview={row => onPreviewOpen(row, item)}
                                                            row={row}
                                                            align={'flex-end'}
                                                            deletePanelById={(row) => {console.log("checking row", row); deletePanelById(row)}}
                                                            mainButtonLabel={'Edit'}
                                                            // navigateToCloneForm={navigateToCloneForm}
                                                            navigateToEditForm={(row) => navigateToEditForm(row)}
                                                            // navigateToView={navigateToView}
                                                            confirmDeleteLocale={confirmDeleteLocale}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
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

PromoPanelListTable.propTypes = {
    panelList: PropTypes.array,
    title: PropTypes.string,
    canEdit: PropTypes.bool,
    canClone: PropTypes.bool,
    canDelete: PropTypes.bool,
    isLoading: PropTypes.bool,
    rows: PropTypes.array,
    headertag: PropTypes.string,
    alertsLoading: PropTypes.any,
    history: PropTypes.object,
    actions: PropTypes.any,
    deletePanel: PropTypes.any,
    footerDisplayMinLength: PropTypes.number,
    alertOrder: PropTypes.any,
    panelError: PropTypes.string
};

PromoPanelListTable.defaultProps = {
    footerDisplayMinLength: 5, // the number of records required in the alert list before we display the paginator
    alertOrder: false, // what order should we sort the alerts in? false means unspecified
    panelError: ''
};

export default PromoPanelListTable;
