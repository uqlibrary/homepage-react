/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import { useCookies } from 'react-cookie';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import ListItemText from '@material-ui/core/ListItemText';
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
import PromoPanelScheduleHeaders from './PromoPanelScheduleHeaders';
import { filterPanelList } from '../promoPanelHelpers';
import PromoPanelAddSchedule from './PromoPanelAddSchedule';
const moment = require('moment');

// original based on https://codesandbox.io/s/hier2
// per https://material-ui.com/components/tables/#custom-pagination-actions

const useStyles2 = makeStyles(
    theme => ({
        cellGroupRowOdd: {
            backgroundColor: '#eee',
        },
        cellEmpty: {
            borderBottom: 'none',
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
            color: '#FFF',
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
        tableRow: {
            borderBottom: '1px solid #bbb',
        },
        tableRowGroup: {
            backgroundColor: '#333',
            color: '#fff',
            borderBottom: 'none',
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
            borderBottom: 'none',
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
export const PromoPanelListGroupPanels = ({
    actions,
    isLoading,
    userPanelList,
    promoPanelList,
    deletePanel,
    history,
    title,
    canEdit,
    canClone,
    canDelete,
    headertag,
    panelError,
    knownGroups,
}) => {
    const [isUnscheduleConfirmOpen, showUnscheduleConfirmation, hideUnscheduleConfirmation] = useConfirmationState();
    const [
        isUnscheduleFailureConfirmationOpen,
        showUnscheduleFailureConfirmation,
        hideUnscheduleFailureConfirmation,
    ] = useConfirmationState();
    const [isAddingSchedule, setIsAddingSchedule] = React.useState(false);
    const [groupName, setGroupName] = React.useState('');
    const [selectorGroupNames, setSelectorGroupNames] = React.useState([]);
    const [filteredPanels, setFilteredPanels] = React.useState(userPanelList);
    React.useEffect(() => {
        setFilteredPanels(userPanelList);
    }, [userPanelList]);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewPanel, setPreviewPanel] = useState({});
    const [unscheduleActive, setUnscheduleActive] = useState(false);
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
    const confirmUnscheduleLocale = numberOfCheckedBoxes => {
        return {
            ...locale.listPage.confirmUnschedule,
            confirmationTitle: locale.listPage.confirmUnschedule.confirmationTitle,
        };
    };

    const checkBoxIdPrefix = 'table-checkbox-';

    function getNumberCheckboxesSelected() {
        return document.querySelectorAll('#admin-promoPanel-table tr.promoPanel-data-row :checked').length;
    }

    const onAddSchedule = groupName => {
        setGroupName(groupName);
        setIsAddingSchedule(true);
    };

    const handleGroupDefaultChange = (userGroup, panel) => {};

    const handleGroupFilterChange = event => {
        const {
            target: { value },
        } = event;

        const selections = typeof value === 'string' ? value.split(',') : value;

        setSelectorGroupNames(selections);
        clearAllCheckboxes();

        setFilteredPanels(filterPanelList(userPanelList, selections, true));
        // Filter the selection, and store in filteredPanels.
    };

    const onPreviewOpen = (row, item) => {
        const scheduled = !!row.panel_start && !!row.panel_end ? true : false;
        setPreviewPanel({
            name: row.panel_admin_notes,
            title: row.panel_title,
            content: row.panel_content,
            start: row.panel_start,
            end: row.panel_end,
            scheduled: scheduled,
        });
        setPreviewOpen(true);
    };
    const handlePreviewClose = () => setPreviewOpen(false);

    function deletePanelById(id) {
        actions
            .deletePanel(id)
            .then(() => {
                setPanelNotice('');
                setUnscheduleActive(false);
                actions.loadPromoPanelUserList();
                clearAllCheckboxes();
            })
            .catch(e => {
                showUnscheduleFailureConfirmation();
            });
    }
    function unschedulePanelById(row) {
        console.log('Trapping', row);
        actions
            .unschedulePanel(row.panel_schedule_id)
            .then(() => {
                setPanelNotice('');
                setUnscheduleActive(false);
                actions.loadPromoPanelUserList();
                clearAllCheckboxes();
            })
            .catch(e => {
                showUnscheduleFailureConfirmation();
            });
    }
    const unscheduleSelectedPanels = () => {
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
        history.push(`/admin/promopanel/edit/${alertid}`);
        scrollToTopOfPage();
    };

    const schedulePanel = (panel, group, start, end) => {
        console.log('Schedule Panel!', panel, group, start, end);
        actions
            .saveUserTypePanelSchedule({
                id: panel,
                usergroup: group,
                payload: {
                    panel_schedule_start_time: start,
                    panel_schedule_end_time: end,
                },
            })
            .then(setIsAddingSchedule(false));
    };
    const handleCloseGroupSchedule = () => {
        setGroupName('');
        setIsAddingSchedule(false);
    };
    // const needsPaginator = userows.length > footerDisplayMinLength;

    return (
        <React.Fragment>
            <ConfirmationBox
                actionButtonColor="secondary"
                actionButtonVariant="contained"
                confirmationBoxId="panel-unschedule-confirm"
                onAction={unscheduleSelectedPanels}
                onClose={hideUnscheduleConfirmation}
                onCancelAction={hideUnscheduleConfirmation}
                isOpen={isUnscheduleConfirmOpen}
                locale={confirmUnscheduleLocale(getNumberCheckboxesSelected())}
            />
            <ConfirmationBox
                actionButtonColor="primary"
                actionButtonVariant="contained"
                confirmationBoxId="panel-delete-error-dialog"
                onAction={hideUnscheduleConfirmation}
                onClose={hideUnscheduleConfirmation}
                hideCancelButton
                isOpen={isUnscheduleConfirmOpen}
                locale={locale.listPage.deleteError}
                showAdditionalInformation
                additionalInformation={panelError}
            />

            <Grid container alignItems={'flex-end'} style={{ marginBottom: 10 }}>
                <Grid item xs={1} style={{ paddingBottom: 5 }}>
                    Filter By:
                </Grid>
                <Grid item xs={4}>
                    {/* filter start */}
                    <FormControl className={classes.dropdown} fullWidth title={locale.form.tooltips.groupField}>
                        <InputLabel id="group-selector">Filter by group</InputLabel>
                        <Select
                            labelId="group-selector"
                            id="demo-multiple-checkbox"
                            label="Filter by group"
                            // InputLabel="testing"
                            multiple
                            value={selectorGroupNames}
                            onChange={handleGroupFilterChange}
                            renderValue={selected => {
                                return selected.join(', ');
                            }}
                        >
                            {knownGroups.map(group => (
                                <MenuItem key={group.group} value={group.group}>
                                    <Checkbox checked={selectorGroupNames.indexOf(group.group) > -1} />
                                    <ListItemText primary={`${group.name}`} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {/* filter end */}
                </Grid>
            </Grid>
            <TableContainer component={Paper}>
                <Table size="small" aria-label="a dense table" id={'admin-promoPanel-table'}>
                    <PromoPanelScheduleHeaders />
                    <TableBody>
                        {/* Start of a Group and it's Panels */}
                        {!!isLoading && (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    <CircularProgress
                                        id="ListTableSpinner"
                                        color="primary"
                                        size={38}
                                        thickness={3}
                                        aria-label="Loading Table Panels"
                                    />
                                </TableCell>
                            </TableRow>
                        )}
                        {!isLoading &&
                            filteredPanels.map((item, id) => {
                                rowMarker = 0;
                                return (
                                    <React.Fragment key={id}>
                                        {!!item.default_panel && Object.keys(item.default_panel).length > 0 && (
                                            <>
                                                <TableRow className={classes.tableRowGroup}>
                                                    <TableCell
                                                        colSpan={4}
                                                        component="td"
                                                        scope="row"
                                                        className={classes.cellGroupName}
                                                    >
                                                        <Typography variant="body1" style={{ paddingBottom: 5 }}>
                                                            {item.usergroup_group_name}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell
                                                        colSpan={2}
                                                        component="td"
                                                        scope="row"
                                                        style={{ textAlign: 'right' }}
                                                    >
                                                        <Button
                                                            variant="contained"
                                                            onClick={() => onAddSchedule(item.usergroup_group)}
                                                        >
                                                            Schedule new panel
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>

                                                <TableRow
                                                    className={`${classes.tableRow} promoPanel-data-row ${
                                                        rowMarker % 2 === 0
                                                            ? classes.cellGroupRowEven
                                                            : classes.cellGroupRowOdd
                                                    }`}
                                                    key={id}
                                                >
                                                    <TableCell className={classes.cellEmpty} />

                                                    <TableCell className={classes.cellGroupDetails}>
                                                        <Typography variant="body1">
                                                            <strong>{item.default_panel.panel_title}</strong>
                                                            <br />
                                                            {item.default_panel.panel_admin_notes}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell className={classes.checkboxCell}>
                                                        <Checkbox
                                                            id={`panel-table-default-checkbox-${item.default_panel.panel_id}`}
                                                            inputProps={{
                                                                'aria-labelledby': `panel-table-item-title-${item.default_panel.panel_id}`,
                                                                'data-testid': `panel-list-table-checkbox-${item.default_panel.panel_id}`,
                                                            }}
                                                            // onChange={() => handleGroupDefaultChange(null, item)}
                                                            checked
                                                            disabled
                                                        />
                                                    </TableCell>
                                                    <TableCell className={classes.cellGroupDetails}>
                                                        <Typography variant="body1">Default</Typography>
                                                    </TableCell>
                                                    <TableCell className={classes.cellGroupDetails}>
                                                        <Typography variant="body1" />
                                                    </TableCell>
                                                    <TableCell className={classes.cellGroupDetails}>
                                                        <PromoPanelSplitButton
                                                            alertId={alert.id}
                                                            canEdit={canEdit}
                                                            canClone={canClone}
                                                            canDelete={false}
                                                            onPreview={row => onPreviewOpen(item.default_panel)}
                                                            row={item.default_panel}
                                                            align={'flex-end'}
                                                            deletePanelById={item => {
                                                                unschedulePanelById(item.default_panel);
                                                            }}
                                                            mainButtonLabel={'Edit'}
                                                            navigateToEditForm={row => navigateToEditForm(row)}
                                                            confirmDeleteLocale={confirmUnscheduleLocale}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            </>
                                        )}

                                        {item.scheduled_panels.length > 0 &&
                                            item.scheduled_panels.map((row, id) => {
                                                if (
                                                    row.panel_schedule_end_time &&
                                                    moment(row.panel_schedule_end_time).toDate() > new moment()
                                                ) {
                                                    rowMarker++;
                                                    return (
                                                        <TableRow
                                                            className={`${classes.tableRow} promoPanel-data-row ${
                                                                rowMarker % 2 === 0
                                                                    ? classes.cellGroupRowEven
                                                                    : classes.cellGroupRowOdd
                                                            }`}
                                                            key={id}
                                                        >
                                                            <TableCell className={classes.cellEmpty} />

                                                            <TableCell className={classes.cellGroupDetails}>
                                                                <Typography variant="body1">
                                                                    <strong>{row.panel_title}</strong>
                                                                    <br />
                                                                    {row.panel_admin_notes}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell className={classes.checkboxCell} />
                                                            <TableCell className={classes.cellGroupDetails}>
                                                                <Typography variant="body1">
                                                                    {moment(row.panel_schedule_start_time).format(
                                                                        'dddd DD/MM/YYYY HH:mm a',
                                                                    )}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell className={classes.cellGroupDetails}>
                                                                <Typography variant="body1">
                                                                    {moment(row.panel_schedule_end_time).format(
                                                                        'dddd DD/MM/YYYY HH:mm a',
                                                                    )}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell className={classes.cellGroupDetails}>
                                                                <PromoPanelSplitButton
                                                                    alertId={alert.id}
                                                                    canEdit={canEdit}
                                                                    canClone={canClone}
                                                                    canUnschedule
                                                                    onPreview={row => onPreviewOpen(row, item)}
                                                                    row={row}
                                                                    align={'flex-end'}
                                                                    deletePanelById={() => unschedulePanelById(row)}
                                                                    mainButtonLabel={'Edit'}
                                                                    navigateToEditForm={row => navigateToEditForm(row)}
                                                                    confirmDeleteLocale={confirmUnscheduleLocale}
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                } else {
                                                    return null;
                                                }
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
            <PromoPanelAddSchedule
                isAddingSchedule={isAddingSchedule}
                groupName={groupName}
                promoPanelList={promoPanelList}
                userPanelList={userPanelList}
                handleAddGroupSchedule={schedulePanel}
                handleCloseGroupSchedule={handleCloseGroupSchedule}
            />
        </React.Fragment>
    );
};

PromoPanelListGroupPanels.propTypes = {
    userPanelList: PropTypes.array,
    promoPanelList: PropTypes.array,
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
    panelError: PropTypes.string,
    knownGroups: PropTypes.array,
};

PromoPanelListGroupPanels.defaultProps = {
    footerDisplayMinLength: 5, // the number of records required in the alert list before we display the paginator
    alertOrder: false, // what order should we sort the alerts in? false means unspecified
    panelError: '',
};

export default PromoPanelListGroupPanels;
