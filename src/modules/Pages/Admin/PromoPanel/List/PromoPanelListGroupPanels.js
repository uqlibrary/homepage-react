import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import Chip from '@mui/material/Chip';
import DeleteIcon from '@mui/icons-material/Delete';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import ListItemText from '@mui/material/ListItemText';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { PromoPanelPreview } from '../PromoPanelPreview';
import { Typography } from '@mui/material';
import { PromoPanelSplitButton } from './PromoPanelSplitButton';
import CircularProgress from '@mui/material/CircularProgress';

import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { useConfirmationState } from 'hooks';
import { default as locale } from 'modules/Pages/Admin/PromoPanel/promopanel.locale';

import { scrollToTopOfPage } from 'helpers/general';
import PromoPanelScheduleHeaders from './PromoPanelScheduleHeaders';
import { filterPanelList } from '../promoPanelHelpers';
import PromoPanelAddSchedule from './PromoPanelAddSchedule';
import PromoPanelAddNewDefault from './PromoPanelAddNewDefault';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const moment = require('moment');

const StyledTableRowGroup = styled(TableRow)(() => ({
    backgroundColor: '#51247a',
    color: '#fff',
    fontWeight: 'bold',
    borderBottom: 'none',
    '& .cellGroupName': {
        marginTop: 0,
        marginBottom: 0,
        paddingTop: 5,
        paddingBottom: 0,
        fontWeight: 900,
        borderBottom: 'none',
        color: '#FFF',
    },
}));

const StyledTableRow = styled(TableRow)(() => ({
    borderBottom: '1px solid #bbb',
    '&.cellGroupRowOdd': {
        backgroundColor: '#eee',
    },
    '&.cellGroupRowEven': {
        backgroundColor: 'none',
    },
    '& .cellEmpty': {
        borderBottom: 'none',
    },
    '& .cellGroupDetails': {
        marginTop: 0,
        marginBottom: 0,
        paddingTop: 0,
        paddingBottom: 5,
        fontWeight: 400,
        borderBottom: 'none',
    },
}));

export const PromoPanelListGroupPanels = ({
    actions,
    isLoading,
    userPanelList,
    promoPanelList,
    canEdit,
    canClone,
    /* istanbul ignore next */
    panelError = '',
    knownGroups,
    promoPanelSaving,
}) => {
    const navigate = useNavigate();
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

        if (!value.includes('000')) {
            setSelectorGroupNames(selections);
            setFilteredPanels(filterPanelList(userPanelList, selections, true));
            // clearAllCheckboxes();

            // Filter the selection, and store in filteredPanels.
        } else {
            setSelectorGroupNames([]);
            setFilteredPanels(filterPanelList(userPanelList, [], true));
        }
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
        navigate(`/admin/promopanel/edit/${alertid}`);
        scrollToTopOfPage();
    };
    const navigateToCloneForm = panelId => {
        actions.updateScheduleQueuelength(0);
        navigate(`/admin/promopanel/clone/${panelId}`);
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
                        <FormControl
                            variant="standard"
                            className={'dropdown'}
                            fullWidth
                            title={locale.form.tooltips.groupField}
                        >
                            <InputLabel id="group-selector">Filter by group</InputLabel>
                            <Select
                                variant="standard"
                                labelId="group-selector"
                                placeholder="Filter by group"
                                id="group-filter"
                                data-testid="group-filter"
                                label="Filter by group"
                                multiple
                                value={selectorGroupNames}
                                onChange={handleGroupFilterChange}
                                renderValue={selected => {
                                    return selected.join(', ');
                                }}
                                onClose={() => {
                                    // This will stop the dropdown being selected after click-away
                                    // MUI Dropdowns seem to require TWO clicks away to deselect
                                    // (one to close the popper, one to close the select)
                                    // Jake didn't want that behavior. This rectifies that.
                                    setTimeout(() => {
                                        document.activeElement.blur();
                                    }, 0);
                                }}
                            >
                                <MenuItem key="clear-All" value="000" align={'right'} data-testid="filter-clear-all">
                                    <Chip
                                        label="Clear selection"
                                        size="small"
                                        icon={<DeleteIcon />}
                                        variant="outlined"
                                    />
                                </MenuItem>
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
                                            <StyledTableRowGroup>
                                                <TableCell colSpan={3} component="td" className={'cellGroupName'}>
                                                    <Typography
                                                        data-testid={`block-${item.usergroup_group}`}
                                                        variant="body1"
                                                        style={{ paddingBottom: 5, fontWeight: 'bold' }}
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
                                            </StyledTableRowGroup>

                                            {item.scheduled_panels.length > 0 &&
                                                item.scheduled_panels.map((row, id) => {
                                                    if (
                                                        row.panel_schedule_end_time &&
                                                        moment(row.panel_schedule_end_time).toDate() > new moment()
                                                    ) {
                                                        rowMarker++;
                                                        return (
                                                            <>
                                                                <StyledTableRow
                                                                    className={`promoPanel-data-row ${
                                                                        rowMarker % 2 === 0
                                                                            ? 'cellGroupRowEven'
                                                                            : 'cellGroupRowOdd'
                                                                    }`}
                                                                    key={id}
                                                                >
                                                                    <TableCell className={'cellEmpty'} />

                                                                    <TableCell className={'cellGroupDetails'}>
                                                                        <Typography variant="body1">
                                                                            <strong>{row.panel_title}</strong>
                                                                            <br />
                                                                            {row.panel_admin_notes}
                                                                        </Typography>
                                                                    </TableCell>

                                                                    <TableCell className={'cellGroupDetails'}>
                                                                        <Typography variant="body1">
                                                                            {moment(
                                                                                row.panel_schedule_start_time,
                                                                            ).format('ddd D MMM YYYY h:mma')}
                                                                        </Typography>
                                                                    </TableCell>
                                                                    <TableCell className={'cellGroupDetails'}>
                                                                        <Typography variant="body1">
                                                                            {moment(row.panel_schedule_end_time).format(
                                                                                'ddd D MMM YYYY h:mma',
                                                                            )}
                                                                        </Typography>
                                                                    </TableCell>
                                                                    <TableCell
                                                                        className={'cellGroupDetails'}
                                                                        style={{ padding: 5 }}
                                                                    >
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
                                                                </StyledTableRow>
                                                            </>
                                                        );
                                                    } else {
                                                        return null;
                                                    }
                                                })}

                                            {!!item.default_panel && Object.keys(item.default_panel).length > 0 && (
                                                <>
                                                    <StyledTableRow
                                                        className={`promoPanel-data-row ${
                                                            rowMarker % 2 !== 0
                                                                ? 'cellGroupRowEven'
                                                                : /* istanbul ignore next */ 'cellGroupRowOdd'
                                                        }`}
                                                        key={id}
                                                    >
                                                        <TableCell className={'cellEmpty'} />

                                                        <TableCell className={'cellGroupDetails'}>
                                                            <Typography variant="body1">
                                                                <strong>{item.default_panel.panel_title}</strong>
                                                                <br />
                                                                {item.default_panel.panel_admin_notes}
                                                            </Typography>
                                                        </TableCell>

                                                        <TableCell className={'cellGroupDetails'}>
                                                            <Typography variant="body1">
                                                                <strong>Default</strong>
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell className={'cellGroupDetails'}>
                                                            <Typography variant="body1" />
                                                        </TableCell>
                                                        <TableCell
                                                            className={'cellGroupDetails'}
                                                            style={{ padding: 5 }}
                                                        >
                                                            <PromoPanelSplitButton
                                                                alertId={alert.id}
                                                                canEdit={canEdit}
                                                                canClone={canClone}
                                                                canDelete={false}
                                                                onPreview={() => onPreviewOpen(item.default_panel)}
                                                                row={item.default_panel}
                                                                group={item.usergroup_group}
                                                                align={'flex-end'}
                                                                deletePanelById={
                                                                    /* istanbul ignore next */ item =>
                                                                        unschedulePanelById(item.default_panel)
                                                                }
                                                                mainButtonLabel={'Edit'}
                                                                navigateToCloneForm={navigateToCloneForm}
                                                                navigateToEditForm={row => navigateToEditForm(row)}
                                                                confirmDeleteLocale={confirmUnscheduleLocale}
                                                            />
                                                        </TableCell>
                                                    </StyledTableRow>
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
    actions: PropTypes.any,
    deletePanel: PropTypes.any,
    footerDisplayMinLength: PropTypes.number,
    alertOrder: PropTypes.any,
    panelError: PropTypes.string,
    knownGroups: PropTypes.array,
    promoPanelSaving: PropTypes.bool,
};

export default PromoPanelListGroupPanels;
