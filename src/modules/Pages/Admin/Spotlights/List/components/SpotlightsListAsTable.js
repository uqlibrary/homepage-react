import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { useCookies } from 'react-cookie';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import { makeStyles } from '@material-ui/core/styles';
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
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';

import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import SortIcon from '@material-ui/icons/Sort';

import { TablePaginationActions } from './TablePaginationActions';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { useConfirmationState } from 'hooks';
import { default as locale } from '../../spotlightsadmin.locale';
import SpotlightSplitButton from './SpotlightSplitButton';

import moment from 'moment';
import { getTimeMondayComing } from 'modules/Pages/Admin/Spotlights/spotlighthelpers';

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
        thisWeekNotify: {
            fontWeight: 'bold',
            color: theme.palette.warning.main,
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
    history,
    deleteSpotlight,
    saveSpotlightChange,
    footerDisplayMinLength,
    canDragRows,
    canUnpublish,
}) => {
    const classes = useStyles();

    const orderByWeight = 'weight';
    const orderByStartDate = 'start';
    const orderByEndDate = 'end';
    const orderByPublished = 'active';

    const [sortOrder, setSetOrder] = React.useState(tableType === 'past' ? 'desc' : 'asc');
    const orderByDefault = {
        current: orderByWeight,
        scheduled: orderByStartDate,
        past: orderByEndDate,
    };
    const [orderBy, setOrderBy] = React.useState(orderByDefault[tableType] || orderByWeight);

    const [page, setPage] = useState(0);
    const [deleteActive, setDeleteActive] = useState(false);
    const [spotlightNotice, setSpotlightNotice] = useState('');
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
    const [
        isSaveFailureConfirmationOpen,
        showSaveFailureConfirmation,
        hideSaveFailureConfirmation,
    ] = useConfirmationState();

    const displayTheRows = React.useCallback(
        rowList => {
            const localRows = rowList
                .sort((a, b) => a.weight - b.weight) // the api doesnt sort it?!?!
                .map((row, index) => {
                    if (tableType === 'current') {
                        row.weight = (index + 1) * 10;
                        // reset the weights to a clean 10 step, in case they arent already,
                        // so it is easy to insert one in the middle during drag and drop
                    }
                    return row;
                });
            setUserows(localRows);
        },
        [tableType],
    );

    React.useEffect(() => {
        if (rows.length === 0) {
            setUserows([]);
            setPage(0); // make it redraw when all displayed rows in a table are deleted
            return;
        }

        displayTheRows(rows);

        console.log('useEffect ', rows.length);
    }, [rows, displayTheRows]);

    // React.useEffect(() => {
    //     console.log('useRows have changed ', userows);
    //     //     userows.length === 0 && setPage(0);
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
        const checkBoxList = document.querySelectorAll('.markForDeletion input[type="checkbox"]');
        checkBoxList.forEach(ii => {
            ii.disabled = false;
            ii.parentElement.parentElement.classList.remove('Mui-disabled');
        });
    };

    const clearAllDeleteMarkingCheckboxes = () => {
        const checkBoxList = document.querySelectorAll('.markForDeletion input[type="checkbox"]');
        checkBoxList.forEach(ii => {
            if (ii.checked) {
                ii.click();
            }
        });
    };

    function getNumberCheckboxesSelected() {
        const checkboxes = document.querySelectorAll('.markForDeletion :checked');
        return !!checkboxes && checkboxes.length;
    }

    const handleMarkForDeletion = e => {
        console.log('handleMarkForDeletion ', e.target);
        const numberCheckboxesSelected = getNumberCheckboxesSelected();

        const thisType = e.target.closest('table').parentElement.id;
        if (!!e.target && !!e.target.checked) {
            // handle a checkbox being turned on
            if (numberCheckboxesSelected === 1) {
                setDeleteActive(true);
            }
            // disable any checkboxes in a different spotlight list
            const checkBoxList = document.querySelectorAll('.markForDeletion input[type="checkbox"]');
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
        console.log('deleteSpotlightById ', spotlightID);
        deleteSpotlight(spotlightID)
            .then(() => {
                console.log('deleteSpotlightById then ', spotlightID);
                setSpotlightNotice('');
                setDeleteActive(false);

                // remove from current display
                setUserows(prevState => {
                    console.log('prevState = ', prevState);
                    const data = [...prevState];
                    const toDelete1 = userows
                        .map(r => {
                            return r.id;
                        })
                        .indexOf(spotlightID);
                    data.splice(toDelete1, 1);
                    console.log('userows: ', spotlightID, ' toDelete1 row id: ', toDelete1);
                    console.log('after delete, resetting userows to ', [...data]);
                    return data;
                });

                // Sometimes it fails to update the visual state from the data deletion
                // even though the usestate updates correctly. Hack it so the row goes away
                const rowThatShouldAlreadyBeGone = document.getElementById(`spotlight-list-row-${spotlightID}`);
                !!rowThatShouldAlreadyBeGone && rowThatShouldAlreadyBeGone.remove();
            })
            .catch(() => {
                console.log('deleteSpotlightById failing ', spotlightID);
                showDeleteFailureConfirmation();
            });
    }

    const deleteSelectedSpotlights = () => {
        const checkboxes = document.querySelectorAll('.markForDeletion input[type="checkbox"]:checked');
        if (!!checkboxes && checkboxes.length > 0) {
            checkboxes.forEach(c => {
                const spotlightID = c.value.replace(checkBoxIdPrefix, '');
                deleteSpotlightById(spotlightID);
            });
            reEnableAllCheckboxes();
            clearAllDeleteMarkingCheckboxes();
        }
    };

    const handleDeleteSplitAction = spotlightID => {
        deleteSpotlightById(spotlightID);
        // if they check the checkbox and then use the action button to delete then the other section is left disabled
        const checkboxes = document.querySelectorAll('.markForDeletion input[type="checkbox"]:checked');
        if (!!checkboxes || checkboxes.length === 0) {
            reEnableAllCheckboxes();
        }
        console.log('after handleDeleteSplitAction, userows = ', [...userows]);
    };

    const confirmDeleteLocale = numberOfCheckedBoxes => {
        return {
            ...locale.listPage.confirmDelete,
            confirmationTitle: locale.listPage.confirmDelete.confirmationTitle
                .replace('[N]', numberOfCheckedBoxes)
                .replace('spotlights', numberOfCheckedBoxes === 1 ? 'spotlight' : 'spotlights'),
        };
    };

    function persistRowReorder(r, filtereduserows) {
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
        saveSpotlightChange(rowToUpdate)
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
            })
            .catch(e => {
                console.log('an error on save occurred: ', e);
                showSaveFailureConfirmation();
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
                    persistRowReorder(reWeightedRow, filtereduserows);
                }
            });
        });
    };

    const handlePublishCheckbox = () => event => {
        const checkboxId = event.target?.id.replace('spotlight-published-', '');
        console.log('handlePublishCheckbox checkboxId = ', checkboxId);
        const newState = !!event.target && event.target.checked;
        const updateableRow = rows.find(r => r.id === checkboxId);
        // theres a fair bit of junk accumulated in rows for display - just pull out the right fields
        const rowToUpdate = {
            id: updateableRow.id,
            start: updateableRow.start,
            end: updateableRow.end,
            title: updateableRow.title,
            url: updateableRow.url,
            img_url: updateableRow.img_url,
            img_alt: updateableRow.img_alt,
            weight: updateableRow.weight,
            active: !!newState ? 1 : 0,
        };
        saveSpotlightChange(rowToUpdate)
            .then(() => {
                console.log('saveSpotlightChange then');
                const updatedrows = userows.map(r => {
                    if (r.id === updateableRow.id) {
                        r.active = rowToUpdate.active;
                    }
                    return r;
                });
                setUserows(updatedrows);
            })
            .catch(e => {
                console.log('saveSpotlightChange error');
                console.log('failed to update Publish field = ', e);
                showSaveFailureConfirmation();
            });
    };

    const needsPaginator = tableType === 'past' && rows.length > footerDisplayMinLength;

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

    const createSortHandler = property => () => {
        const isAsc = orderBy === property && sortOrder === 'asc';
        setSetOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    function descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    function getComparator(order, orderBy) {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    function stableSort(array, comparator) {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map(el => el[0]);
    }

    const sortOrderAllowsDragAndDrop = orderBy === orderByWeight && sortOrder === 'asc';

    const endsThisWeek = spotlight => {
        // used to display to the user that come monday morning this spotlight will be gone
        // (specifically meant to address when ALL the spotlights finish this week and none are scheduled)
        return moment(spotlight.end) <= getTimeMondayComing();
    };

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
            <ConfirmationBox
                actionButtonColor="primary"
                actionButtonVariant="contained"
                confirmationBoxId="spotlight-save-error-dialog"
                onAction={hideSaveFailureConfirmation}
                onClose={hideSaveFailureConfirmation}
                hideCancelButton
                isOpen={isSaveFailureConfirmationOpen}
                locale={locale.listPage.saveError}
            />
            <Grid
                data-testid={`headerRow-${tableType}`}
                className={`${classes.headerRow} ${!!deleteActive ? classes.headerRowHighlighted : ''}`}
                container
            >
                <Grid item xs={12} md={!!deleteActive ? 5 : 12}>
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
                                onClick={clearAllDeleteMarkingCheckboxes}
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
            <DragDropContext onDragEnd={onDragEnd}>
                <TableContainer
                    id={`spotlight-list-${tableType}`}
                    data-testid={`spotlight-list-${tableType}`}
                    component={Paper}
                >
                    <Table className={classes.table} aria-label="custom pagination table" style={{ minHeight: 200 }}>
                        <TableHead>
                            <TableRow md-row="" className="md-row">
                                <TableCell component="th" scope="row" style={{ width: 50, padding: 0 }} />
                                {tableType === 'current' && (
                                    <TableCell component="th" scope="row" style={{ width: 10, padding: 0 }}>
                                        <TableSortLabel
                                            active={orderBy === orderByWeight}
                                            direction={orderBy === orderByWeight ? sortOrder : 'asc'}
                                            onClick={createSortHandler(orderByWeight)}
                                        >
                                            {/* indicates drag and drop available - only when sorting by weight!! */}
                                            {sortOrderAllowsDragAndDrop && (
                                                <SortIcon
                                                    fontSize="small"
                                                    style={{
                                                        transform: 'scaleX(-1)',
                                                    }}
                                                    // InputProps={{
                                                    //     'aria-label': 'order by weight. Drag and drop available',
                                                    // }}
                                                />
                                            )}
                                            Order
                                        </TableSortLabel>
                                    </TableCell>
                                )}
                                <TableCell component="th" scope="row" style={{ width: 220 }}>
                                    Spotlight
                                </TableCell>
                                <TableCell component="th" scope="row" style={{ width: 260 }} />
                                <TableCell component="th" scope="row" align="center" style={{ padding: 0 }}>
                                    <TableSortLabel
                                        active={orderBy === orderByStartDate}
                                        direction={orderBy === orderByStartDate ? sortOrder : 'asc'}
                                        onClick={createSortHandler(orderByStartDate)}
                                    >
                                        {locale.form.labels.publishDate}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell component="th" scope="row" align="center" style={{ padding: 8 }}>
                                    <TableSortLabel
                                        active={orderBy === orderByEndDate}
                                        direction={orderBy === orderByEndDate ? sortOrder : 'asc'}
                                        onClick={createSortHandler(orderByEndDate)}
                                    >
                                        {locale.form.labels.unpublishDate}
                                    </TableSortLabel>
                                </TableCell>
                                {!!canUnpublish && (
                                    <TableCell
                                        component="th"
                                        scope="row"
                                        align="center"
                                        style={{ width: 50, padding: 8 }}
                                    >
                                        <TableSortLabel
                                            active={orderBy === orderByPublished}
                                            direction={orderBy === orderByPublished ? sortOrder : 'asc'}
                                            onClick={createSortHandler(orderByPublished)}
                                        >
                                            {locale.form.labels.publishedCheckbox}
                                        </TableSortLabel>
                                    </TableCell>
                                )}
                                <TableCell component="th" scope="row" />
                            </TableRow>
                        </TableHead>
                        <Droppable droppableId={`droppable-section-${tableType}`}>
                            {droppableProvided => (
                                <TableBody ref={droppableProvided.innerRef} {...droppableProvided.droppableProps}>
                                    {rowsPerPage > 0 &&
                                        userows.length > 0 &&
                                        stableSort(userows, getComparator(sortOrder, orderBy))
                                            .slice(
                                                tableType === 'past' ? page * rowsPerPage : 0,
                                                tableType === 'past'
                                                    ? page * rowsPerPage + rowsPerPage
                                                    : userows.length,
                                            )
                                            .map((spotlight, rowindex) => {
                                                // console.log('userows has ', spotlight.id);
                                                return (
                                                    <Draggable
                                                        draggableId={spotlight.id}
                                                        index={rowindex}
                                                        key={spotlight.id}
                                                        isDragDisabled={!sortOrderAllowsDragAndDrop || !canDragRows}
                                                    >
                                                        {draggableProvided => {
                                                            return (
                                                                <TableRow
                                                                    id={`spotlight-list-row-${spotlight.id}`}
                                                                    data-testid={`spotlight-list-row-${spotlight.id}`}
                                                                    className={'spotlight-data-row'}
                                                                    // index={rowindex}
                                                                    {...draggableProvided.draggableProps}
                                                                    {...draggableProvided.dragHandleProps}
                                                                    ref={draggableProvided.innerRef}
                                                                    role="row"
                                                                >
                                                                    <TableCell
                                                                        component="td"
                                                                        className={`markForDeletion ${classes.checkboxCell}`}
                                                                        style={{ width: 50, padding: 0 }}
                                                                    >
                                                                        <Checkbox
                                                                            id={`spotlight-list-item-checkbox-${spotlight.id}`}
                                                                            inputProps={{
                                                                                'aria-label': `Select spotlight "${spotlight.title}" as needs deletion`,
                                                                                'data-testid': `spotlight-list-item-checkbox-${spotlight.id}`,
                                                                            }}
                                                                            onChange={handleMarkForDeletion}
                                                                            value={`${checkBoxIdPrefix}${spotlight.id}`}
                                                                        />
                                                                    </TableCell>
                                                                    {tableType === 'current' && (
                                                                        <TableCell
                                                                            component="td"
                                                                            className={classes.tableCell}
                                                                            style={{ textAlign: 'center' }}
                                                                        >
                                                                            {spotlight.weight}
                                                                        </TableCell>
                                                                    )}
                                                                    <TableCell
                                                                        component="td"
                                                                        className={classes.tableCell}
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
                                                                        className={classes.tableCell}
                                                                    >
                                                                        <h4
                                                                            className={classes.h4}
                                                                            id={`spotlight-list-item-title-${spotlight.id}`}
                                                                        >{`${spotlight.title}`}</h4>{' '}
                                                                    </TableCell>
                                                                    <TableCell
                                                                        component="td"
                                                                        align="center"
                                                                        className={classes.startDate}
                                                                        style={{ padding: 0 }}
                                                                    >
                                                                        <span title={spotlight.startDateLong}>
                                                                            {spotlight.startDateDisplay}
                                                                        </span>
                                                                    </TableCell>
                                                                    <TableCell
                                                                        component="td"
                                                                        align="center"
                                                                        className={`${classes.endDate} ${tableType !==
                                                                            'past' &&
                                                                            !!endsThisWeek(spotlight) &&
                                                                            classes.thisWeekNotify}`}
                                                                        style={{ padding: 8 }}
                                                                    >
                                                                        <span
                                                                            title={`${spotlight.endDateLong} ${
                                                                                tableType !== 'past' &&
                                                                                endsThisWeek(spotlight)
                                                                                    ? ' - ends this week'
                                                                                    : ''
                                                                            }`}
                                                                        >
                                                                            {spotlight.endDateDisplay}
                                                                        </span>
                                                                        {tableType !== 'past' &&
                                                                            endsThisWeek(spotlight) && <span> *</span>}
                                                                    </TableCell>
                                                                    {!!canUnpublish && (
                                                                        <TableCell
                                                                            component="td"
                                                                            className={`${classes.publishedCell} ${classes.checkboxCell}`}
                                                                            style={{ width: 50, padding: 8 }}
                                                                        >
                                                                            <Checkbox
                                                                                checked={!!spotlight.active}
                                                                                id={`spotlight-published-${spotlight.id}`}
                                                                                onChange={handlePublishCheckbox()}
                                                                                inputProps={{
                                                                                    'aria-label': `Mark spotlight "${spotlight.title}" as published or unpublished`,
                                                                                    'data-testid': `spotlight-list-item-publish-${spotlight.id}`,
                                                                                }}
                                                                            />
                                                                        </TableCell>
                                                                    )}
                                                                    <TableCell
                                                                        component="td"
                                                                        id={`spotlight-list-action-block-${spotlight.id}`}
                                                                        data-testid={`spotlight-list-action-block-${spotlight.id}`}
                                                                        className={classes.tableCell}
                                                                        style={{ paddingRight: 10 }}
                                                                    >
                                                                        <SpotlightSplitButton
                                                                            spotlightId={spotlight.id}
                                                                            deleteSpotlightById={
                                                                                handleDeleteSplitAction
                                                                            }
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
                                                            );
                                                        }}
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
                                        // dont use
                                        // { label: 'All', value: rows.length }
                                        // as it gives a dupe key error when the length happens to match a value
                                        // in the list. Nor do we want them loading vast numbers of records - they
                                        // can jump to the next page
                                        rowsPerPageOptions={[5, 10, 25, 100]}
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
    history: PropTypes.object,
    actions: PropTypes.any,
    deleteSpotlight: PropTypes.any,
    saveSpotlightChange: PropTypes.any,
    footerDisplayMinLength: PropTypes.number,
    // spotlightOrder: PropTypes.any,
    canDragRows: PropTypes.bool,
    canUnpublish: PropTypes.bool,
};

SpotlightsListAsTable.defaultProps = {
    footerDisplayMinLength: 5, // the number of records required in the spotlight list before we display the paginator
    // spotlightOrder: false, // what order should we sort the spotlights in? false means unspecified
    canDragRows: false, // does this section allow drag and drop
    canUnpublish: true, // does this section allow the user to have a publish/unpublish checbox?
};

export default SpotlightsListAsTable;
