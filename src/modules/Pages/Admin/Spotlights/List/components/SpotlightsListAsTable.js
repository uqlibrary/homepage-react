import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { useCookies } from 'react-cookie';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import InputLabel from '@material-ui/core/InputLabel';
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
import ScheduleIcon from '@material-ui/icons/Schedule';

import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';

import { TablePaginationActions } from './TablePaginationActions';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { useConfirmationState } from 'hooks';
import { default as locale } from '../../spotlightsadmin.locale';
import SpotlightSplitButton from './SpotlightSplitButton';

const moment = require('moment');

// original based on https://codesandbox.io/s/hier2
// per https://material-ui.com/components/tables/#custom-pagination-actions

const useStyles = makeStyles(
    theme => ({
        table: {
            // minWidth: 500,
            // tableLayout: 'fixed',
        },
        tableCell: {
            padding: 0,
        },
        scheduledIconCell: {
            padding: 0,
        },
        startDate: {
            whiteSpace: 'pre', // makes moment format able to take a carriage return
            padding: 0,
        },
        endDate: {
            whiteSpace: 'pre',
            padding: 0,
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
        checkboxCell: {
            '& input[type="checkbox"]:checked + svg': {
                fill: '#595959',
            },
            padding: 0,
        },
        toggle: {
            whiteSpace: 'nowrap',
        },
        publishedCell: {
            padding: 0,
            textAlign: 'center',
        },
        h4: {
            fontWeight: '300',
            display: 'inline',
        },
        currentDisplay: {
            '& td': {
                '& span': {
                    fontWeight: 'bold',
                },
                '& h4': {
                    fontWeight: 'bold',
                },
            },
        },
        reorderWarning: {
            fontStyle: 'italic',
            fontSize: '0.8em',
        },
    }),
    { withTheme: true },
);
export const SpotlightsListAsTable = ({
    rows,
    headertag,
    tableType,
    spotlightsLoading,
    spotlightError,
    history,
    actions,
    deleteSpotlight,
    footerDisplayMinLength,
    canFilterByAttribute,
    canDragRows,
}) => {
    console.log('spotlightError = ', spotlightError);
    const classes = useStyles();
    const [page, setPage] = useState(0);
    const [deleteActive, setDeleteActive] = useState(false);
    const [spotlightNotice, setSpotlightNotice] = useState('');
    const [showScheduled, setShowScheduled] = useState(false);
    const [showUnPublished, setShowUnPublished] = useState(false);
    const [userows, setUserows] = useState([]);
    const [cookies, setCookie] = useCookies();

    const paginatorCookieName = `spotlightAdminPaginatorSize${tableType}`;
    const [rowsPerPage, setRowsPerPage] = useState(
        (!cookies[paginatorCookieName] && footerDisplayMinLength) || parseInt(cookies[paginatorCookieName], 10),
    );

    const [isDeleteConfirmOpen, showDeleteConfirmation, hideDeleteConfirmation] = useConfirmationState();
    const [
        isDeleteFailureConfirmationOpen,
        showDeleteFailureConfirmation,
        hideDeleteFailureConfirmation,
    ] = useConfirmationState();

    const displayTheRows = React.useCallback(
        rowList => {
            if (rowList.length === 0) {
                setUserows([]);
                return;
            }

            let localRows = rowList
                .sort((a, b) => a.weight - b.weight) // the api doesnt sort it?!?!
                .map((row, index) => {
                    if (tableType !== 'past') {
                        // change "!== past" to test by passed in attribute for 'candragdrop?
                        row.weight = (index + 1) * 10;
                        // reset the weights to a clean 10 step, in case they arent already,
                        // so it is easy to insert one in the middle during drag and drop
                    }
                    return row;
                });
            if (!!canFilterByAttribute && !showScheduled) {
                localRows = localRows.filter(row => !moment(row.start).isAfter(moment()));
            }
            if (!!canFilterByAttribute && !showUnPublished) {
                localRows = localRows.filter(row => !!row.active);
            }

            // might be used by Past section if we add sortable columns?
            // if (!!spotlightOrder && !!rows && rows.length > 0) {
            //     if (spotlightOrder === 'reverseEnd') {
            //         setUserows(userows.sort(
            //             (a, b) => moment(b.end, 'YYYY-MM-DD hh:mm:ss') - moment(a.end, 'YYYY-MM-DD hh:mm:ss'),
            //         ));
            //     } else if (spotlightOrder === 'forwardEnd') {
            //         setUserows(userows.sort(
            //             (a, b) => moment(a.end, 'YYYY-MM-DD hh:mm:ss') - moment(b.end, 'YYYY-MM-DD hh:mm:ss'),
            //         ));
            //     } else if (spotlightOrder === 'forwardStart') {
            //         setUserows(userows.sort(
            //             (a, b) => moment(a.start, 'YYYY-MM-DD hh:mm:ss') - moment(b.start, 'YYYY-MM-DD hh:mm:ss'),
            //         ));
            //     }
            // }
            // console.log('userows = (will display rows): ', userows);
            setUserows(localRows);
        },
        [canFilterByAttribute, showScheduled, showUnPublished, tableType],
    );

    React.useEffect(() => {
        displayTheRows(rows);

        // make it redraw when all displayed rows in a table are deleted
        rows.length === 0 && setPage(0);
    }, [rows, displayTheRows]);

    // React.useEffect(() => {
    //     console.log('useRows have changed ', userows);
    //     userows.length === 0 && setPage(0);
    // }, [userows]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const checkBoxIdPrefix = 'checkbox-';

    const handleChangeRowsPerPage = event => {
        const numberOfRows = parseInt(event.target.value, 10);

        const current = new Date();
        const nextYear = new Date();
        nextYear.setFullYear(current.getFullYear() + 1);
        setCookie(paginatorCookieName, numberOfRows, { expires: nextYear });

        setRowsPerPage(numberOfRows);
        setPage(0);
    };

    const headerCountIndicator = '';
    // const headerCountIndicator = ' - [N] spotlight[s] total'
    //     .replace('[N]', rows.length)
    //     .replace('[s]', rows.length > 1 ? 's' : '');

    const navigateToEditForm = spotlightid => {
        history.push(`/admin/spotlights/edit/${spotlightid}`);

        const topOfPage = document.getElementById('StandardPage');
        !!topOfPage && topOfPage.scrollIntoView();
    };

    const navigateToCloneForm = spotlightid => {
        history.push(`/admin/spotlights/clone/${spotlightid}`);

        const topOfPage = document.getElementById('StandardPage');
        !!topOfPage && topOfPage.scrollIntoView();
    };

    const navigateToView = spotlightid => {
        history.push(`/admin/spotlights/view/${spotlightid}`);

        const topOfPage = document.getElementById('StandardPage');
        !!topOfPage && topOfPage.scrollIntoView();
    };

    const reEnableAllCheckboxes = () => {
        const checkBoxList = document.querySelectorAll('#admin-spotlights-list input[type="checkbox"]');
        checkBoxList.forEach(ii => {
            ii.disabled = false;
            ii.parentElement.parentElement.classList.remove('Mui-disabled');
        });
    };

    const clearAllCheckboxes = () => {
        const checkBoxList = document.querySelectorAll('#admin-spotlights-list input[type="checkbox"]');
        checkBoxList.forEach(ii => {
            if (ii.checked) {
                ii.click();
            }
        });
    };

    function getNumberCheckboxesSelected() {
        return document.querySelectorAll('#admin-spotlights-list tr.spotlight-data-row :checked').length;
    }

    const handleCheckboxChange = e => {
        console.log('handleCheckboxChange ', e.target);
        const numberCheckboxesSelected = getNumberCheckboxesSelected();

        const thisType = e.target.closest('table').parentElement.id;
        if (!!e.target && !!e.target.checked) {
            // handle a checkbox being turned on
            if (numberCheckboxesSelected === 1) {
                setDeleteActive(true);
            }
            // disable any checkboxes in a different spotlight list
            const checkBoxList = document.querySelectorAll('#admin-spotlights-list table input[type="checkbox"]');
            checkBoxList.forEach(ii => {
                const thetype = ii.closest('table').parentElement.id;
                if (thetype !== thisType) {
                    ii.disabled = true;
                    ii.parentElement.parentElement.classList.add('Mui-disabled');
                }
            });
        } else if (!!e.target && !e.target.checked) {
            // handle a checkbox being turned off
            if (numberCheckboxesSelected === 0) {
                setDeleteActive(false);
                reEnableAllCheckboxes();
            }
        }
        setSpotlightNotice(
            '[n] spotlight[s] selected'
                .replace('[n]', numberCheckboxesSelected)
                .replace('[s]', numberCheckboxesSelected === 1 ? '' : 's'),
        );
    };

    function deleteSpotlightById(spotlightID) {
        deleteSpotlight(spotlightID)
            .then(() => {
                setSpotlightNotice('');
                setDeleteActive(false);
                actions.loadAllSpotlights();
            })
            .catch(() => {
                showDeleteFailureConfirmation();
            });
    }

    const deleteSelectedSpotlights = () => {
        const checkboxes = document.querySelectorAll('#admin-spotlights-list input[type="checkbox"]:checked');
        if (!!checkboxes && checkboxes.length > 0) {
            checkboxes.forEach(c => {
                const spotlightID = c.value.replace(checkBoxIdPrefix, '');
                deleteSpotlightById(spotlightID);
            });
        }
    };

    const confirmDeleteLocale = numberOfCheckedBoxes => {
        return {
            ...locale.listPage.confirmDelete,
            confirmationTitle: locale.listPage.confirmDelete.confirmationTitle
                .replace('[N]', numberOfCheckedBoxes)
                .replace('spotlights', numberOfCheckedBoxes === 1 ? 'spotlight' : 'spotlights'),
        };
    };

    const showHideScheduled = () => {
        !!showScheduled && setPage(0); // if we are going from 'show' to 'hide', go to page 0
        setShowScheduled(prevState => !prevState);
    };
    const showHideUnPublished = () => {
        !!showUnPublished && setPage(0); // if we are going from 'show' to 'hide', go to page 0
        setShowUnPublished(prevState => !prevState);
    };

    function persistRow(r, filtereduserows) {
        const currentRow = rows.find(row => row.id === r.id);
        // theres a fair bit of junk accumulated in rows for display - just pull out the right fields
        const rowToUpdate = {
            id: currentRow.id,
            start: currentRow.start,
            end: currentRow.end,
            title: currentRow.title,
            url: currentRow.url,
            img_url: currentRow.img_url,
            img_alt: currentRow.img_alt,
            active: currentRow.active,
            weight: r.weight,
        };
        console.log('send for save: ', rowToUpdate);
        actions
            .saveSpotlightChange(rowToUpdate)
            .then(() => {
                // we have to visually update it manually (thats how react-beautiful-dnd works)
                rows.forEach(row => {
                    filtereduserows.forEach(fr => {
                        if (fr.id === row.id && fr.weight !== row.weight) {
                            // we have the option here of setting all the values from the db
                            // in case it has updated? but that seems overkill
                            row.weight = fr.weight;
                            console.log('setting ', fr.id, ' to ', fr.weight);
                        }
                    });
                });
                rows.sort((a, b) => a.weight - b.weight);
                // setUserows(rows);
            })
            .catch(e => {
                // TODO
                console.log('spotlightError = ', spotlightError);
                console.log('an error on save occurred: ', e);
            });
    }

    // https://stackoverflow.com/a/5306832/1246313
    function arrayMove(arr, oldIndex, newIndex) {
        if (newIndex >= arr.length) {
            let k = newIndex - arr.length + 1;
            while (k--) {
                arr.push(undefined);
            }
        }
        arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
        return arr; // for testing
    }

    const onDragEnd = result => {
        console.log('onDragEnd ', result);
        // must synchronously update state (and server) to reflect drag result
        const { destination, source, draggableId } = result;
        if (!destination) {
            console.log('onDragEnd: result.destination was not set');
            return;
        }
        console.log('DRAGGING ', source.index + 1, ' TO ', destination.index + 1);

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            console.log('onDragEnd: result.destination was unchanged');
            return;
        }

        let counter = 1;
        let filtereduserows = [];
        rows.forEach((row, index) => {
            // newrow is an array that has an updated weight for the affected rows
            // the shifted row will end in 5 and the unmoved rows be a multiple of 10, eg drop row 2 between 5 and 6
            // and the new row will have weight 45, was-row 5 will have weight 40 and was-row 6 will have weight 50
            const newWeight =
                row.id !== draggableId
                    ? counter * 10 // apart from the moved item, we just count through the items, in 10s
                    : destination.index * 10 + 5; // set moved item to the nearest item plus 5 to insert between 2 rows
            const newrow = {
                ...row,
                weight: newWeight,
            };
            if (row.id !== draggableId) {
                counter++;
            }
            filtereduserows[index] = newrow;
        });

        // now make them all even 10s (so future drags also works by putting '5' on a record)
        filtereduserows = filtereduserows.sort((a, b) => {
            return a.weight - b.weight;
        });
        filtereduserows.forEach((row, index) => {
            row.weight = (index + 1) * 10;
        });

        // react-beautiful-dnd relies on the order of the array, rather than an index
        // reorder the array so we dont get a flash of the original order while we wait for the new array to load
        filtereduserows.sort((a, b) => a.weight - b.weight);
        const oldIndex = rows.find(r => r.id === draggableId).weight / 10 - 1;
        const newIndex = filtereduserows.find(r => r.id === draggableId).weight / 10 - 1;
        console.log('reorder ', draggableId, ' from ', oldIndex, ' to ', newIndex);
        arrayMove(userows, oldIndex, newIndex);

        // now persist the changed record to the DB
        filtereduserows.forEach(reWeightedRow => {
            rows.map(r => {
                if (reWeightedRow.id === r.id && reWeightedRow.weight !== r.weight) {
                    // then do the save
                    console.log('persist ', reWeightedRow.id);
                    persistRow(reWeightedRow, filtereduserows);
                }
            });
        });
    };

    const needsPaginator = rows.length > footerDisplayMinLength;

    if (!!spotlightsLoading) {
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

    const isLocalDev = ['dev-homepage.library.uq.edu.au', 'localhost'].includes(location.hostname);
    const dragandDropReorderUnavailable = (!showScheduled || !showUnPublished) && canFilterByAttribute;
    return (
        <Fragment>
            <ConfirmationBox
                actionButtonColor="secondary"
                actionButtonVariant="contained"
                confirmationBoxId="spotlight-delete-confirm"
                onAction={deleteSelectedSpotlights}
                onClose={hideDeleteConfirmation}
                onCancelAction={hideDeleteConfirmation}
                isOpen={isDeleteConfirmOpen}
                locale={confirmDeleteLocale(getNumberCheckboxesSelected())}
            />
            <ConfirmationBox
                actionButtonColor="primary"
                actionButtonVariant="contained"
                confirmationBoxId="spotlight-delete-error-dialog"
                onAction={hideDeleteFailureConfirmation}
                onClose={hideDeleteFailureConfirmation}
                hideCancelButton
                isOpen={isDeleteFailureConfirmationOpen}
                locale={locale.listPage.deleteError}
            />
            <Grid
                data-testid={`headerRow-${tableType}`}
                className={`${classes.headerRow} ${!!deleteActive ? classes.headerRowHighlighted : ''}`}
                container
            >
                <Grid item xs={12} md={canFilterByAttribute ? 5 : 12}>
                    <h3 style={{ marginBottom: 6 }}>
                        {headertag}
                        <span
                            style={{ fontSize: '0.9em', fontWeight: 300 }}
                            data-testid={`headerRow-count-${tableType}`}
                        >
                            {headerCountIndicator}
                        </span>
                    </h3>
                </Grid>
                <Grid item xs={12} md={7} container justify="flex-end">
                    {!deleteActive && !!canFilterByAttribute && (
                        <span className={classes.toggle}>
                            <InputLabel
                                style={{ color: 'rgba(0, 0, 0, 0.87)', display: 'inline' }}
                                title={locale.listPage.tooltips.hideShowScheduledCheckbox}
                            >
                                <Checkbox
                                    checked={showScheduled}
                                    data-testid="spotlights-hideshow-scheduled"
                                    onChange={showHideScheduled}
                                    name="showScheduled"
                                    inputProps={{
                                        'aria-label': locale.listPage.tooltips.hideShowScheduledCheckbox,
                                    }}
                                />
                                {locale.listPage.labels.hideShowScheduledCheckbox}
                            </InputLabel>
                        </span>
                    )}
                    {!deleteActive && !!canFilterByAttribute && (
                        <span className={classes.toggle}>
                            <InputLabel
                                style={{ color: 'rgba(0, 0, 0, 0.87)', display: 'inline' }}
                                title={locale.listPage.tooltips.hideShowUnpublishedCheckbox}
                            >
                                <Checkbox
                                    checked={showUnPublished}
                                    data-testid="spotlights-hideshow-unpublished"
                                    onChange={showHideUnPublished}
                                    name="showUnPublished"
                                    inputProps={{
                                        'aria-label': locale.listPage.tooltips.hideShowUnpublishedCheckbox,
                                    }}
                                />
                                {locale.listPage.labels.hideShowUnpublishedCheckbox}
                            </InputLabel>
                        </span>
                    )}
                    {!!deleteActive && (
                        <span className="deleteManager" style={{ marginLeft: 'auto', paddingTop: 8 }}>
                            <span>{spotlightNotice}</span>
                            <IconButton
                                onClick={showDeleteConfirmation}
                                aria-label={locale.listPage.tooltips.deleteSelectedSpotlightsButton}
                                data-testid={`spotlight-list-${tableType}-delete-button`}
                                title={locale.listPage.tooltips.deleteSelectedSpotlightsButton}
                            >
                                <DeleteIcon className={`${!!deleteActive ? classes.iconHighlighted : ''}`} />
                            </IconButton>
                            <IconButton
                                onClick={clearAllCheckboxes}
                                aria-label={locale.listPage.tooltips.clearSelectedSpotlightsButton}
                                data-testid={`spotlight-list-${tableType}-deselect-button`}
                                className={classes.iconHighlighted}
                                title={locale.listPage.tooltips.clearSelectedSpotlightsButton}
                            >
                                <CloseIcon />
                            </IconButton>
                        </span>
                    )}
                </Grid>
            </Grid>
            {dragandDropReorderUnavailable && (
                <Grid container>
                    <Grid item xs={12} align="right" className={classes.reorderWarning}>
                        {locale.listPage.dragAndDropRestrictionMessage}
                    </Grid>
                </Grid>
            )}
            <DragDropContext onDragEnd={onDragEnd}>
                <TableContainer
                    id={`spotlight-list-${tableType}`}
                    data-testid={`spotlight-list-${tableType}`}
                    component={Paper}
                >
                    <Table className={classes.table} aria-label="custom pagination table" style={{ minHeight: 200 }}>
                        <TableHead>
                            <TableRow md-row="" className="md-row">
                                {isLocalDev && canDragRows && (
                                    <TableCell component="th" scope="row" style={{ width: 10 }}>
                                        dev
                                        <br />
                                        order
                                    </TableCell>
                                )}
                                <TableCell component="th" scope="row" style={{ width: 50, padding: 0 }} />
                                <TableCell component="th" scope="row" style={{ width: 200 }}>
                                    Spotlight
                                </TableCell>
                                <TableCell component="th" scope="row" />
                                <TableCell component="th" scope="row" align="center" style={{ padding: 0 }}>
                                    Publish date
                                </TableCell>
                                <TableCell component="th" scope="row" align="center" style={{ padding: 8 }}>
                                    Unpublish date
                                </TableCell>
                                <TableCell component="th" scope="row" align="center" style={{ width: 50, padding: 8 }}>
                                    Published?
                                </TableCell>
                                <TableCell component="th" scope="row" />
                            </TableRow>
                        </TableHead>
                        <Droppable droppableId={`droppable-section-${tableType}`}>
                            {droppableProvided => (
                                <TableBody ref={droppableProvided.innerRef} {...droppableProvided.droppableProps}>
                                    {rowsPerPage > 0 &&
                                        userows.length > 0 &&
                                        userows
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((spotlight, rowindex) => {
                                                console.log('userows has ', spotlight);
                                                const isScheduled = moment(spotlight.start).isAfter(moment());
                                                return (
                                                    <Draggable
                                                        draggableId={spotlight.id}
                                                        index={rowindex}
                                                        key={spotlight.id}
                                                        isDragDisabled={dragandDropReorderUnavailable || !canDragRows}
                                                    >
                                                        {draggableProvided => (
                                                            <TableRow
                                                                // key={spotlight.id}
                                                                id={`spotlight-list-row-${spotlight.id}`}
                                                                data-testid={`spotlight-list-row-${spotlight.id}`}
                                                                className={`spotlight-data-row ${
                                                                    !!showScheduled && !isScheduled
                                                                        ? classes.currentDisplay
                                                                        : ''
                                                                }`}
                                                                // index={rowindex}
                                                                {...draggableProvided.draggableProps}
                                                                {...draggableProvided.dragHandleProps}
                                                                ref={draggableProvided.innerRef}
                                                                role="row"
                                                            >
                                                                {isLocalDev && canDragRows && (
                                                                    <TableCell
                                                                        component="td"
                                                                        className={`${classes.tableCell} ${
                                                                            !!isScheduled
                                                                                ? classes.scheduledDisplay
                                                                                : ''
                                                                        }`}
                                                                    >
                                                                        {' '}
                                                                        {spotlight.weight}
                                                                    </TableCell>
                                                                )}
                                                                <TableCell
                                                                    component="td"
                                                                    className={`${classes.checkboxCell}`}
                                                                    style={{ width: 50, padding: 0 }}
                                                                >
                                                                    <Checkbox
                                                                        id={`spotlight-list-item-checkbox-${spotlight.id}`}
                                                                        inputProps={{
                                                                            'aria-label': `Select spotlight "${spotlight.title}" as needs deletion`,
                                                                            'data-testid': `spotlight-list-item-checkbox-${spotlight.id}`,
                                                                        }}
                                                                        onChange={handleCheckboxChange}
                                                                        value={`${checkBoxIdPrefix}${spotlight.id}`}
                                                                    />
                                                                </TableCell>
                                                                <TableCell
                                                                    component="td"
                                                                    className={`${classes.tableCell}`}
                                                                    style={{ width: 200 }}
                                                                >
                                                                    <img
                                                                        alt={spotlight.img_alt}
                                                                        src={spotlight.img_url}
                                                                        style={{ width: 220, minHeight: 80 }}
                                                                    />
                                                                </TableCell>
                                                                <TableCell
                                                                    component="td"
                                                                    className={`${classes.tableCell}`}
                                                                >
                                                                    {isScheduled && (
                                                                        <div style={{ float: 'left', width: 30 }}>
                                                                            <ScheduleIcon
                                                                                data-testid={`spotlight-scheduled-icon-${spotlight.id}`}
                                                                            />
                                                                        </div>
                                                                    )}
                                                                    <h4
                                                                        className={`${classes.h4}`}
                                                                        id={`spotlight-list-item-title-${spotlight.id}`}
                                                                    >{`${spotlight.title}`}</h4>{' '}
                                                                </TableCell>
                                                                <TableCell
                                                                    component="td"
                                                                    align="center"
                                                                    className={`${classes.startDate}`}
                                                                    style={{ padding: 0 }}
                                                                >
                                                                    <span title={spotlight.startDateLong}>
                                                                        {spotlight.startDateDisplay}
                                                                    </span>
                                                                </TableCell>
                                                                <TableCell
                                                                    component="td"
                                                                    align="center"
                                                                    className={`${classes.endDate}`}
                                                                    style={{ padding: 8 }}
                                                                >
                                                                    <span title={spotlight.endDateLong}>
                                                                        {spotlight.endDateDisplay}
                                                                    </span>
                                                                </TableCell>
                                                                <TableCell
                                                                    component="td"
                                                                    className={`${classes.publishedCell}`}
                                                                    style={{ width: 50, padding: 8 }}
                                                                >
                                                                    <span>{!!spotlight.active ? 'yes' : 'no'}</span>
                                                                </TableCell>
                                                                <TableCell
                                                                    component="td"
                                                                    id={`spotlight-list-action-block-${spotlight.id}`}
                                                                    data-testid={`spotlight-list-action-block-${spotlight.id}`}
                                                                    className={`${classes.tableCell}`}
                                                                >
                                                                    <SpotlightSplitButton
                                                                        spotlightId={spotlight.id}
                                                                        deleteSpotlightById={deleteSpotlightById}
                                                                        mainButtonLabel={
                                                                            tableType === 'past' ? 'View' : 'Edit'
                                                                        }
                                                                        navigateToCloneForm={navigateToCloneForm}
                                                                        navigateToEditForm={navigateToEditForm}
                                                                        navigateToView={navigateToView}
                                                                        confirmDeleteLocale={confirmDeleteLocale}
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                        )}
                                                    </Draggable>
                                                );
                                            })}
                                    <TableRow
                                        id={`spotlight-list-no-spotlights-${tableType}`}
                                        data-testid={`spotlight-list-no-spotlights-${tableType}`}
                                        style={
                                            rowsPerPage > 0 && userows.length > 0
                                                ? { display: 'none' }
                                                : { display: 'table-row' }
                                        }
                                    >
                                        <TableCell component="td">
                                            <p>No spotlights</p>
                                        </TableCell>
                                    </TableRow>
                                    {droppableProvided.placeholder}
                                </TableBody>
                            )}
                        </Droppable>
                        {!!needsPaginator && (
                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: rows.length }]}
                                        colSpan={5}
                                        count={userows.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        SelectProps={{
                                            inputProps: {
                                                'aria-label': 'rows per page',
                                                'data-testid': 'admin-spotlights-list-paginator-select',
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
            </DragDropContext>
        </Fragment>
    );
};

SpotlightsListAsTable.propTypes = {
    rows: PropTypes.array,
    headertag: PropTypes.string,
    tableType: PropTypes.string,
    spotlightsLoading: PropTypes.any,
    spotlightError: PropTypes.any,
    history: PropTypes.object,
    actions: PropTypes.any,
    deleteSpotlight: PropTypes.any,
    footerDisplayMinLength: PropTypes.number,
    // spotlightOrder: PropTypes.any,
    canFilterByAttribute: PropTypes.bool,
    canDragRows: PropTypes.bool,
};

SpotlightsListAsTable.defaultProps = {
    footerDisplayMinLength: 5, // the number of records required in the spotlight list before we display the paginator
    // spotlightOrder: false, // what order should we sort the spotlights in? false means unspecified
    canFilterByAttribute: false, // does this section display filtering of scheduled and unpublished spotlights?
    canDragRows: true, // does this section allow drag and drop
};

export default SpotlightsListAsTable;
