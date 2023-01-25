import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import ListItemText from '@material-ui/core/ListItemText';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { PromoPanelPreview } from '../PromoPanelPreview';
import { Typography } from '@material-ui/core';
import { PromoPanelSplitButton } from './PromoPanelSplitButton';
import CircularProgress from '@material-ui/core/CircularProgress';

import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { useConfirmationState } from 'hooks';
import { default as locale } from '../../../../../locale/promopanel.locale';

import { scrollToTopOfPage } from 'modules/Pages/Admin/Spotlights/spotlighthelpers';
import PromoPanelScheduleHeaders from './PromoPanelScheduleHeaders';
import { filterPanelList } from '../promoPanelHelpers';
import PromoPanelAddSchedule from './PromoPanelAddSchedule';
import PromoPanelAddNewDefault from './PromoPanelAddNewDefault';

const moment = require('moment');

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
    history,
    canEdit,
    canClone,
    panelError,
    knownGroups,
    promoPanelSaving,
}) => {
    // eslint-disable-next-line no-unused-vars
    const [isUnscheduleConfirmOpen, showUnscheduleConfirmation, hideUnscheduleConfirmation] = useConfirmationState();
    const [
        isUnscheduleFailureConfirmationOpen,
        showUnscheduleFailureConfirmation,
        hideUnscheduleFailureConfirmation,
    ] = useConfirmationState();
    const [isAddingSchedule, setIsAddingSchedule] = React.useState(false);

    const [isAddingDefault, setIsAddingDefault] = React.useState(false);

    const [groupName, setGroupName] = React.useState('');
    const [selectorGroupNames, setSelectorGroupNames] = React.useState([]);
    const [filteredPanels, setFilteredPanels] = React.useState(userPanelList);
    /* istanbul ignore next */
    React.useEffect(() => {
        if (selectorGroupNames.length > 0) {
            setFilteredPanels(filterPanelList(userPanelList, selectorGroupNames, true));
        } else {
            setFilteredPanels(userPanelList);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userPanelList]);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewPanel, setPreviewPanel] = useState({});
    const classes = useStyles2();
    // *** COMMENTED OUT PENDING FEEDBACK REGARDING BULK ACTIONS
    // const clearAllCheckboxes = () => {
    //     const checkBoxList = document.querySelectorAll('#admin-promoPanel-table input[type="checkbox"]');
    //     checkBoxList.forEach(ii => {
    //         if (ii.checked) {
    //             ii.click();
    //         }
    //     });
    // };
    let rowMarker = 0;
    const confirmUnscheduleLocale = () => {
        return {
            ...locale.listPage.confirmUnschedule,
            confirmationTitle: locale.listPage.confirmUnschedule.confirmationTitle,
        };
    };

    // COMMENTED OUT PENDING FEEDBACK REGARDING BULK ACTIONS
    // const checkBoxIdPrefix = 'table-checkbox-';

    // function getNumberCheckboxesSelected() {
    //     return document.querySelectorAll('#admin-promoPanel-table tr.promoPanel-data-row :checked').length;
    // }

    const onAddSchedule = groupName => {
        setGroupName(groupName);
        setIsAddingSchedule(true);
    };
    const onAddNewDefault = groupName => {
        setGroupName(groupName);
        setIsAddingDefault(true);
    };
    // Ignoring, as there may be changes to filter, at the present without filter type is always string
    /* istanbul ignore next */
    const handleGroupFilterChange = event => {
        const {
            target: { value },
        } = event;

        const selections = typeof value === 'string' ? value.split(',') : value;

        setSelectorGroupNames(selections);
        // clearAllCheckboxes();

        setFilteredPanels(filterPanelList(userPanelList, selections, true));
        // Filter the selection, and store in filteredPanels.
    };

    const onPreviewOpen = row => {
        // const scheduled = !!row.panel_start && !!row.panel_end ? true : false;
        const scheduled = false;
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
    // ** COMMENTED OUT PENDING FEEDBACK REGARDING BULK ACTIONS
    // function deletePanelById(id) {
    //     actions
    //         .deletePanel(id)
    //         .then(() => {
    //             actions.loadPromoPanelUserList();
    //             // clearAllCheckboxes();
    //         })
    //         .catch(() => {
    //             showUnscheduleFailureConfirmation();
    //         });
    // }
    function unschedulePanelById(row) {
        actions
            .unschedulePanel(row.panel_schedule_id)
            .then(() => {
                actions.loadPromoPanelUserList();
                // clearAllCheckboxes();
            })
            /* istanbul ignore next */
            .catch(
                /* istanbul ignore next */ () => {
                    /* istanbul ignore next */
                    showUnscheduleFailureConfirmation();
                },
            );
    }
    // ** COMMENTED OUT PENDING FEEDBACK REGARDING BULK ACTIONS
    // const unscheduleSelectedPanels = () => {
    //     const checkboxes = document.querySelectorAll('#admin-promoPanel-table input[type="checkbox"]:checked');
    //     /* istanbul ignore else */
    //     if (!!checkboxes && checkboxes.length > 0) {
    //         checkboxes.forEach(c => {
    //             const id = c.value.replace(checkBoxIdPrefix, '');
    //             deletePanelById(id);
    //         });
    //     }
    // };
    const navigateToEditForm = alertid => {
        actions.updateScheduleQueuelength(0);
        history.push(`/admin/promopanel/edit/${alertid}`);
        scrollToTopOfPage();
    };
    const navigateToCloneForm = panelId => {
        actions.updateScheduleQueuelength(0);
        history.push(`/admin/promopanel/clone/${panelId}`);
        scrollToTopOfPage();
    };

    const schedulePanel = (panel, group, start, end) => {
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
    const setDefaultPanel = (panel, group) => {
        actions.saveDefaultUserTypePanel({ id: panel, usergroup: group }).then(setIsAddingDefault(false));
    };
    const handleCloseGroupSchedule = () => {
        setIsAddingSchedule(false);
    };
    /* istanbul ignore next */
    const handleCloseGroupDefault = () => {
        setIsAddingDefault(false);
    };

    return (
        <React.Fragment>
            {/*
            ** COMMENTED OUT PENDING FEEDBACK REGARDING BULK ACTIONS
            <ConfirmationBox
                actionButtonColor="secondary"
                actionButtonVariant="contained"
                confirmationBoxId="panel-unschedule-confirm"
                onAction={unscheduleSelectedPanels}
                onClose={hideUnscheduleConfirmation}
                onCancelAction={hideUnscheduleConfirmation}
                isOpen={isUnscheduleConfirmOpen}
                locale={confirmUnscheduleLocale(getNumberCheckboxesSelected())}
            /> */}
            <ConfirmationBox
                actionButtonColor="primary"
                actionButtonVariant="contained"
                confirmationBoxId="panel-delete-error-dialog"
                onAction={hideUnscheduleFailureConfirmation}
                onClose={hideUnscheduleFailureConfirmation}
                hideCancelButton
                isOpen={isUnscheduleFailureConfirmationOpen}
                locale={locale.listPage.unscheduleError}
                showAdditionalInformation
                additionalInformation={panelError}
            />
            <StandardCard title={'Default and scheduled panels'} customBackgroundColor="#F7F7F7">
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
                                id="group-filter"
                                data-testid="group-filter"
                                label="Filter by group"
                                multiple
                                value={selectorGroupNames}
                                onChange={handleGroupFilterChange}
                                renderValue={selected => {
                                    return selected.join(', ');
                                }}
                            >
                                {knownGroups.map(group => (
                                    <MenuItem
                                        key={group.group}
                                        value={group.group}
                                        data-testid={`filter-select-${group.group}`}
                                    >
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
                            {(!!isLoading || !!promoPanelSaving) && (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        <CircularProgress
                                            data-testid="ListTableSpinner-groupPanels"
                                            id="ListTableSpinner-groupPanels"
                                            color="primary"
                                            size={38}
                                            thickness={3}
                                            aria-label="Loading Table Panels"
                                        />
                                    </TableCell>
                                </TableRow>
                            )}
                            {!isLoading &&
                                !promoPanelSaving &&
                                filteredPanels.map((item, id) => {
                                    rowMarker = 0;
                                    return (
                                        <React.Fragment key={id}>
                                            <TableRow className={classes.tableRowGroup}>
                                                <TableCell colSpan={4} component="td" className={classes.cellGroupName}>
                                                    <Typography
                                                        data-testid={`block-${item.usergroup_group}`}
                                                        variant="body1"
                                                        style={{ paddingBottom: 5 }}
                                                    >
                                                        {item.usergroup_group_name}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell colSpan={2} component="td" style={{ textAlign: 'right' }}>
                                                    <Button
                                                        style={{ marginRight: 5 }}
                                                        variant="contained"
                                                        data-testid={`schedule-panel-${item.usergroup_group}`}
                                                        id={`schedule-panel-${item.usergroup_group}`}
                                                        onClick={() => onAddSchedule(item.usergroup_group)}
                                                    >
                                                        Schedule panel
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        onClick={() => onAddNewDefault(item.usergroup_group)}
                                                        data-testid={`default-panel-${item.usergroup_group}`}
                                                        id={`default-panel-${item.usergroup_group}`}
                                                    >
                                                        Set Default
                                                    </Button>
                                                </TableCell>
                                            </TableRow>

                                            {item.scheduled_panels.length > 0 &&
                                                item.scheduled_panels.map((row, id) => {
                                                    if (
                                                        row.panel_schedule_end_time &&
                                                        moment(row.panel_schedule_end_time).toDate() > new moment()
                                                    ) {
                                                        rowMarker++;
                                                        return (
                                                            <>
                                                                <TableRow
                                                                    className={`${
                                                                        classes.tableRow
                                                                    } promoPanel-data-row ${
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
                                                                            {moment(
                                                                                row.panel_schedule_start_time,
                                                                            ).format('dddd DD/MM/YYYY HH:mm a')}
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
                                                                            onPreview={
                                                                                /* istanbul ignore next */ row =>
                                                                                    onPreviewOpen(row, item)
                                                                            }
                                                                            row={row}
                                                                            group={item.usergroup_group}
                                                                            align={'flex-end'}
                                                                            deletePanelById={() =>
                                                                                unschedulePanelById(row)
                                                                            }
                                                                            mainButtonLabel={'Edit'}
                                                                            navigateToCloneForm={navigateToCloneForm}
                                                                            navigateToEditForm={row =>
                                                                                navigateToEditForm(row)
                                                                            }
                                                                            confirmDeleteLocale={
                                                                                confirmUnscheduleLocale
                                                                            }
                                                                        />
                                                                    </TableCell>
                                                                </TableRow>
                                                            </>
                                                        );
                                                    } else {
                                                        return null;
                                                    }
                                                })}
                                            {!!item.default_panel && Object.keys(item.default_panel).length > 0 && (
                                                <>
                                                    <TableRow
                                                        className={`${classes.tableRow} promoPanel-data-row ${
                                                            rowMarker % 2 === 0
                                                                ? classes.cellGroupRowEven
                                                                : /* istanbul ignore next */ classes.cellGroupRowOdd
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
                                                                id={`panel-table-default-checkbox-${item.default_panel.panel_id}-${item.usergroup_group}`}
                                                                inputProps={{
                                                                    'aria-label': `panel-table-default-checkbox-${item.default_panel.panel_id}-${item.usergroup_group}`,
                                                                    'data-testid': `panel-table-default-checkbox-${item.default_panel.panel_id}-${item.usergroup_group}`,
                                                                }}
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
                                                                onPreview={() => onPreviewOpen(item.default_panel)}
                                                                row={item.default_panel}
                                                                group={item.usergroup_group}
                                                                align={'flex-end'}
                                                                deletePanelById={item => {
                                                                    /* istanbul ignore next */
                                                                    unschedulePanelById(item.default_panel);
                                                                }}
                                                                mainButtonLabel={'Edit'}
                                                                navigateToCloneForm={navigateToCloneForm}
                                                                navigateToEditForm={row => navigateToEditForm(row)}
                                                                confirmDeleteLocale={confirmUnscheduleLocale}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                </>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </StandardCard>
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
            <PromoPanelAddNewDefault
                isAddingDefault={isAddingDefault}
                groupName={groupName}
                promoPanelList={promoPanelList}
                handleAddGroupDefault={setDefaultPanel}
                handleCloseGroupDefault={handleCloseGroupDefault}
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
    promoPanelSaving: PropTypes.bool,
};

PromoPanelListGroupPanels.defaultProps = {
    panelError: '',
};

export default PromoPanelListGroupPanels;
