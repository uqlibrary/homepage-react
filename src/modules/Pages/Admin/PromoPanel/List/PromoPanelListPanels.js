import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
// import Select from '@material-ui/core/Select';
// import MenuItem from '@material-ui/core/MenuItem';
// import Checkbox from '@material-ui/core/Checkbox';
// import ListItemText from '@material-ui/core/ListItemText';
// import FormControl from '@material-ui/core/FormControl';
// import InputLabel from '@material-ui/core/InputLabel';
// import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { PromoPanelPreview } from '../PromoPanelPreview';
import { Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

import { PromoPanelSplitButton } from './PromoPanelSplitButton';

import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { useConfirmationState } from 'hooks';
import { default as locale } from '../../../../../locale/promopanel.locale';
import { scrollToTopOfPage } from 'modules/Pages/Admin/Spotlights/spotlighthelpers';
// import { filterPanelList } from '../promoPanelHelpers';

const moment = require('moment');

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
        headerRowHidden: {
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
            borderBottom: 'none',
        },
        removedChip: {
            textDecoration: 'line-through',
        },
    }),
    { withTheme: true },
);
export const PromoPanelListPanels = ({
    actions,
    isLoading,
    panelList,
    // knownGroups,
    // showBulkDelete,
    // showFilter,
    isPastPanels,
    title,
    canEdit,
    canClone,
    canDelete,
    panelError,
    history,
    showPast,
    hideAlloc,
}) => {
    // *** COMMENTED OUT PENDING FEEDBACK ON BULK ACTIONS ***
    // const [isDeleteConfirmOpen, showDeleteConfirmation, hideDeleteConfirmation] = useConfirmationState();
    const [
        isDeleteFailureConfirmationOpen,
        showDeleteFailureConfirmation,
        hideDeleteFailureConfirmation,
    ] = useConfirmationState();

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewPanel, setPreviewPanel] = useState({});
    // *** COMMENTED OUT PENDING FEEDBACK ON BULK ACTIONS ***
    // const [deleteActive, setDeleteActive] = useState(false);
    // const [panelNotice, setPanelNotice] = useState('');
    // const [selectorGroupNames, setSelectorGroupNames] = React.useState([]);
    const [filteredPanels, setFilteredPanels] = React.useState(panelList);

    React.useEffect(() => {
        let filteredList = panelList;
        if (hideAlloc) {
            filteredList = panelList.filter(item => item.default_panels_for.length < 1 && item.panel_schedule < 1);
        }
        if (!hideAlloc && showPast) {
            const pastSchedules = filteredList.filter(
                panel => panel.hasOwnProperty('is_past') && panel.is_past === true,
            );
            filteredList = pastSchedules;
        }
        setFilteredPanels(filteredList);
    }, [panelList, hideAlloc, showPast]);

    React.useEffect(() => {}, [filteredPanels]);

    const classes = useStyles2();
    const regex = /(<([^>]+)>)/gi;
    // *** COMMENTED OUT PENDING FEEDBACK ON BULK ACTIONS ***
    // const clearAllCheckboxes = () => {
    //     const checkBoxList = document.querySelectorAll('#admin-promoPanel-list input[type="checkbox"]');
    //     checkBoxList.forEach(ii => {
    //         if (ii.checked) {
    //             ii.click();
    //         }
    //     });
    //     setDeleteActive(false);
    // };
    // *** COMMENTED OUT PENDING FEEDBACK ON BULK ACTIONS ***
    // const reEnableAllCheckboxes = () => {
    //     const checkBoxList = document.querySelectorAll('#admin-promoPanel-list input[type="checkbox"]');
    //     checkBoxList.forEach(ii => {
    //         ii.disabled = false;
    //         ii.parentElement.parentElement.classList.remove('Mui-disabled');
    //     });
    // };
    // *** COMMENTED OUT PENDING FEEDBACK ON BULK ACTIONS ***
    // const isDefaultPanel = value => value && value.length > 0;
    const confirmDeleteLocale = () => {
        return {
            ...locale.listPage.confirmDelete,
            confirmationTitle: locale.listPage.confirmDelete.confirmationTitle,
        };
    };
    // *** COMMENTED OUT PENDING FEEDBACK ON BULK ACTIONS ***
    // const checkBoxIdPrefix = 'list-checkbox-';

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
    // *** COMMENTED OUT PENDING FEEDBACK ON BULK ACTIONS ***
    // function getNumberCheckboxesSelected() {
    //     return document.querySelectorAll('#admin-promoPanel-list tr.promoPanel-data-row :checked').length;
    // }
    // const handleCheckboxChange = e => {
    //     const numberCheckboxesSelected = getNumberCheckboxesSelected();

    //     const thisType = e.target.closest('table').parentElement.id;
    //     /* istanbul ignore else */
    //     if (!!e.target && !!e.target.checked) {
    //         // handle a checkbox being turned on
    //         if (numberCheckboxesSelected === 1) {
    //             setDeleteActive(true);
    //         }
    //         // disable any checkboxes in a different alert list
    //         const checkBoxList = document.querySelectorAll('#admin-promoPanel-list input[type="checkbox"]');
    //         checkBoxList.forEach(ii => {
    //             const thetype = ii.closest('table').parentElement.id;
    //             if (thetype !== thisType) {
    //                 ii.disabled = true;
    //                 ii.parentElement.parentElement.classList.add('Mui-disabled');
    //             }
    //         });
    //     } /* istanbul ignore else */ else if (!!e.target && !e.target.checked) {
    //         // handle a checkbox being turned off
    //         if (numberCheckboxesSelected === 0) {
    //             setDeleteActive(false);
    //             reEnableAllCheckboxes();
    //         }
    //     }
    //     setPanelNotice(
    //         '[n] panel[s] selected'
    //             .replace('[n]', numberCheckboxesSelected)
    //             .replace('[s]', numberCheckboxesSelected === 1 ? '' : 's'),
    //     );
    // };
    // ** COMMENTED OUT PENDING FEEDBACK ON BULK ACTIONS **
    // const headerCountIndicator = rowCount => {
    //     return '[N] panel[s] selected'.replace('[N]', rowCount).replace('[s]', rowCount > 1 ? 's' : '');
    // };
    /* istanbul ignore next */
    function deletePanelById(id) {
        actions
            .deletePanel(id)
            .then(() => {
                // setPanelNotice('');
                // setDeleteActive(false);
                actions.loadPromoPanelList();
            })
            .catch(() => {
                showDeleteFailureConfirmation();
            });
    }
    // ** COMMENTED OUT PENDING FEEDBACK ON BULK ACTIONS **
    // const deleteSelectedPanels = () => {
    //     const checkboxes = document.querySelectorAll('#admin-promoPanel-list input[type="checkbox"]:checked');
    //     /* istanbul ignore else */
    //     if (!!checkboxes && checkboxes.length > 0) {
    //         checkboxes.forEach(c => {
    //             const id = c.value.replace(checkBoxIdPrefix, '');
    //             deletePanelById(id);
    //         });
    //     }
    // };

    const navigateToEditForm = panelId => {
        history.push(`/admin/promopanel/edit/${panelId}`);
        scrollToTopOfPage();
    };

    const navigateToCloneForm = panelId => {
        history.push(`/admin/promopanel/clone/${panelId}`);
        scrollToTopOfPage();
    };
    // COMMENTED OUT AS THERE IS PRESENTLY NO FILTER FOR THIS
    // const handleGroupFilterChange = event => {
    //     const {
    //         target: { value },
    //     } = event;

    //     const selections = typeof value === 'string' ? value.split(',') : value;

    //     setSelectorGroupNames(selections);

    //     // clearAllCheckboxes();

    //     setFilteredPanels(filterPanelList(panelList, selections));
    //     // Filter the selection, and store in filteredPanels.
    // };

    return (
        <React.Fragment>
            {/*
                ** COMMENTED OUT PENDING FEEDBACK ON BULK ACTIONS **
                <ConfirmationBox
                actionButtonColor="secondary"
                actionButtonVariant="contained"
                confirmationBoxId="panel-delete-confirm"
                onAction={deleteSelectedPanels}
                onClose={hideDeleteConfirmation}
                onCancelAction={hideDeleteConfirmation}
                isOpen={isDeleteConfirmOpen}
                locale={confirmDeleteLocale(getNumberCheckboxesSelected())}
            /> */}
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
                {/* FILTER COMMENTED OUT PENDING FEEDBACK */}
                {/* {!!showFilter && (
                    <Grid container alignItems={'flex-end'} style={{ marginBottom: 10 }}>
                        <Grid item xs={1} style={{ paddingBottom: 5 }}>
                            Filter By:
                        </Grid>
                        <Grid item xs={4}>

                            <FormControl className={classes.dropdown} fullWidth title={locale.form.tooltips.groupField}>
                                <InputLabel id="group-selector">Filter by group</InputLabel>
                                <Select
                                    labelId="group-selector"
                                    id="demo-multiple-checkbox"
                                    label="Filter by group"
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

                        </Grid>
                    </Grid>
                )} */}

                {/*
                    *** COMMENTED OUT PENDING FEEDBACK REGARDING BULK ACTIONS ***
                    {!!deleteActive && showBulkDelete && (
                    <div
                        data-testid={'headerRow-panelList'}
                        className={`${classes.headerRow} ${classes.headerRowHighlighted}`}
                    >
                        <div>
                            <h3 style={{ marginBottom: 6 }}>
                                {headertag}
                                <span
                                    style={{ fontSize: '0.9em', fontWeight: 300 }}
                                    data-testid={'headerRow-count-panelList'}
                                >
                                    {getNumberCheckboxesSelected() > 0
                                        ? headerCountIndicator(getNumberCheckboxesSelected())
                                        : null}
                                </span>
                            </h3>
                        </div>

                        <span className="deleteManager" style={{ marginLeft: 'auto', paddingTop: 8 }}>
                            <IconButton
                                onClick={showDeleteConfirmation}
                                aria-label="Delete panel(s)"
                                data-testid={'panel-list-panel-delete-button'}
                                title="Delete panel(s)"
                            >
                                <DeleteIcon
                                    className={`${
                                        !!deleteActive ? classes.iconHighlighted :  ''
                                    }`}
                                />
                            </IconButton>
                            <IconButton
                                onClick={clearAllCheckboxes}
                                aria-label="Deselect all"
                                data-testid={'panel-list-panel-deselect-button'}
                                className={classes.iconHighlighted}
                                title="Deselect all"
                            >
                                <CloseIcon />
                            </IconButton>
                        </span>
                    </div>
                )} */}

                <TableContainer component={Paper}>
                    <Table
                        sx={{ minWidth: 650 }}
                        size="small"
                        aria-label="a dense table"
                        id={`admin-promoPanel-list${isPastPanels ? 'past' : ''}`}
                        data-testid={`admin-promoPanel-list${isPastPanels ? 'past' : ''}`}
                    >
                        <TableHead>
                            <TableRow>
                                {/* {showBulkDelete && <TableCell component="th" scope="row" />} */}

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
                            {!!isLoading && (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        <CircularProgress
                                            id={`spinner${isPastPanels ? 'past' : ''}`}
                                            color="primary"
                                            size={38}
                                            thickness={3}
                                            aria-label="Loading Alerts"
                                        />
                                    </TableCell>
                                </TableRow>
                            )}
                            {filteredPanels.length < 1 && (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        There are no panels matching the selected filter
                                    </TableCell>
                                </TableRow>
                            )}
                            {filteredPanels.map(item => {
                                const isDefaultPanel = item.default_panels_for.length > 0;
                                const typeList =
                                    item.default_panels_for.length > 0 ? item.default_panels_for : item.panel_schedule;
                                return (
                                    <React.Fragment key={item.panel_id}>
                                        <TableRow className={`promoPanel-data-row ${classes.cellGroupRow}`}>
                                            {
                                                // ** COMMENTED OUT PENDING FEEDBACK RE: BULK ACTIONS ***
                                                // showBulkDelete && (
                                                // <TableCell component="td" scope="row"
                                                // className={classes.checkboxCell}>
                                                //     {!isDefaultPanel && (
                                                //         <Checkbox
                                                //         id={`panel-table-item-checkbox-${item.panel_id}`}
                                                //         inputProps={{
                                                //         'aria-labelledby': `panel-list-item-title-${item.panel_id}`,
                                                //         'data-testid': `panel-list-item-checkbox-${item.panel_id}`,
                                                //         }}
                                                //         onChange={handleCheckboxChange}
                                                //         value={`${checkBoxIdPrefix}${item.panel_id}`}
                                                //         />
                                                //     )}
                                                // </TableCell>
                                                // )
                                            }
                                            <TableCell component="td" className={classes.cellGroupName}>
                                                <Typography variant="body1">{item.panel_title}</Typography>
                                            </TableCell>
                                            <TableCell component="td" className={classes.cellGroupName}>
                                                <Typography variant="body1" className={classes.ellipsis}>
                                                    {(!!item.panel_content && item.panel_content.replace(regex, ' ')) ||
                                                        /* istanbul ignore next */ ' '}
                                                </Typography>
                                            </TableCell>
                                            <TableCell component="td" className={classes.cellGroupName}>
                                                <Typography variant="body1">
                                                    {moment(item.panel_created_at).format('ddd D MMM YYYY h:mma')}
                                                </Typography>
                                            </TableCell>
                                            <TableCell component="td" className={classes.cellGroupName}>
                                                <PromoPanelSplitButton
                                                    align="flex-end"
                                                    alertId={alert.id}
                                                    canEdit={canEdit}
                                                    pastPanels={isPastPanels}
                                                    canClone={canClone}
                                                    canDelete={canDelete && !isDefaultPanel}
                                                    onPreview={item => onPreviewOpen(item)}
                                                    row={item}
                                                    deletePanelById={row => deletePanelById(row)}
                                                    mainButtonLabel={'Edit'}
                                                    navigateToCloneForm={navigateToCloneForm}
                                                    navigateToEditForm={row => navigateToEditForm(row)}
                                                    // navigateToView={navigateToView}
                                                    confirmDeleteLocale={confirmDeleteLocale}
                                                />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell />
                                            <TableCell colSpan={4}>
                                                {typeList &&
                                                    typeList.map(type => {
                                                        return (
                                                            <Chip
                                                                key={type.usergroup_group}
                                                                data-testid={'alert-list-urgent-chip-'}
                                                                label={`${isDefaultPanel ? 'Default: ' : ''} ${
                                                                    type.usergroup_group_name
                                                                }`}
                                                                title={type.usergroup_group_name}
                                                                className={isDefaultPanel ? classes.defaultChip : ''}
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
    isPastPanels: PropTypes.bool,
    title: PropTypes.string,
    showBulkDelete: PropTypes.bool,
    showFilter: PropTypes.bool,
    canEdit: PropTypes.bool,
    canClone: PropTypes.bool,
    canDelete: PropTypes.bool,
    knownGroups: PropTypes.array,
    isLoading: PropTypes.bool,
    headertag: PropTypes.string,
    history: PropTypes.object,
    actions: PropTypes.any,
    panelError: PropTypes.string,
    showPast: PropTypes.bool,
    hideAlloc: PropTypes.bool,
};

PromoPanelListPanels.defaultProps = {
    panelList: [],
    showCurrent: true,
    showPast: true,
    hideAlloc: false,
};

export default PromoPanelListPanels;
