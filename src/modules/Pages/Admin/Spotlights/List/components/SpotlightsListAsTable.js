import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { useCookies } from 'react-cookie';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import TextField from '@material-ui/core/TextField';
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
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import SortIcon from '@material-ui/icons/Sort';

import { TablePaginationActions } from './TablePaginationActions';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { useConfirmationState } from 'hooks';
import { default as locale } from '../../spotlightsadmin.locale';
import SpotlightSplitButton from './SpotlightSplitButton';

import moment from 'moment';
import { getTimeMondayComing } from 'modules/Pages/Admin/Spotlights/spotlighthelpers';
import { destroy } from 'repositories/generic';
import { SPOTLIGHT_DELETE_API } from 'repositories/routes';

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
    saveSpotlightChange,
    footerDisplayMinLength,
    canDragRows,
    canUnpublish,
    canTextFilter,
    reweightSpotlights,
}) => {
    const classes = useStyles();

    const ORDERBY_WEIGHT = 'weight';
    const ORDERBY_STARTDATE = 'start';
    const ORDERBY_END_DATE = 'end';
    const ORDERBY_PUBLISHEDFLAG = 'active';

    const [sortOrder, setSetOrder] = React.useState(tableType === 'past' ? 'desc' : 'asc');
    const orderByDefault = {
        current: ORDERBY_WEIGHT,
        scheduled: ORDERBY_STARTDATE,
        past: ORDERBY_END_DATE,
    };
    const [orderBy, setOrderBy] = React.useState(orderByDefault[tableType] || ORDERBY_WEIGHT);

    const [page, setPage] = useState(0);
    const [deleteActive, setDeleteActive] = useState(false);
    const [spotlightNotice, setSpotlightNotice] = useState('');
    const [userows, setUserows] = useState([]);
    const [staticUserows, setStaticUserows] = useState([]);
    const [selectedSpotlight, setSelectedSpotlight] = useState(null);
    const [publishUnpublishLocale, setPublishUnpublishLocale] = useState({});
    const [textSearch, setTextSearch] = useState('');
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
    const [
        isPublishUnpublishConfirmationOpen,
        showPublishUnpublishConfirmation,
        hidePublishUnpublishConfirmation,
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
            setStaticUserows(localRows);
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
    //     console.log('*** useEffect useRows', tableType, userows.length);
    // }, [tableType, userows]);

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

    const headerCountIndicator = ' ([N])'.replace('[N]', userows.length).replace('[s]', userows.length > 1 ? 's' : '');

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

    function undisplayRemovedSpotlights(spotlightIDList) {
        console.log('undisplayRemovedSpotlights then ', spotlightIDList);
        setSpotlightNotice('');
        setDeleteActive(false);

        // remove from current display
        setUserows(prevState => {
            console.log('undisplayRemovedSpotlights prevState = ', prevState);
            let data = [...prevState];
            spotlightIDList.forEach(s => {
                data = data.filter(r => r.id !== s);
            });
            console.log('undisplayRemovedSpotlights, resetting userows to ', [...data]);
            return data;
        });

        clearAllDeleteMarkingCheckboxes();
    }

    const cleanSpotlight = s => {
        // theres a fair bit of junk accumulated in rows for display - just pull out the right fields
        return {
            id: s.id,
            start: s.start,
            end: s.end,
            title: s.title,
            url: s.url,
            img_url: s.img_url,
            img_alt: s.img_alt,
            weight: s.weight,
            active: s.active,
        };
    };

    function persistRowReorder(r, filtereduserows) {
        const currentRow = rows.find(row => row.id === r.id);
        const rowToUpdate = {
            ...cleanSpotlight(currentRow),
            weight: r.weight,
        };
        console.log('rowToUpdate = ', r.weight, rowToUpdate.weight);
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

    function deleteListOfSpotlights(spotlightIDsToBeDeleted) {
        console.log('spotlightIDsToBeDeleted = ', spotlightIDsToBeDeleted);
        const successfulDelete = [];
        // use allSettled ?
        // this is in a loop, so it could be quite large - avoid the dispatch method and use Promises directly
        Promise.all(
            spotlightIDsToBeDeleted.map(spotlightID => {
                console.log('call SPOTLIGHT_DELETE_API:', SPOTLIGHT_DELETE_API({ id: spotlightID }));
                const result = destroy(SPOTLIGHT_DELETE_API({ id: spotlightID }))
                    .then(() => {
                        console.log('deleteSelectedSpotlights success', spotlightID);
                        successfulDelete.push(spotlightID);
                        return true;
                    })
                    .catch(() => {
                        // we check this later to see if we should display an error dialog
                        return false;
                    });
                console.log('SPOTLIGHT_DELETE_API', spotlightID, 'result = ', result);
                return result;
            }),
        )
            .then(result => {
                console.log('Promise.all success bulk delete checkboxes: ', result);
                console.log('deleteSelectedSpotlights', tableType, tableType, 'userows=', userows);
                // did all promises return success?
                if (!!result.includes(false)) {
                    console.log('got an error');
                    showDeleteFailureConfirmation();
                } else {
                    console.log('NOT got an error');
                    reweightSpotlights(saveSpotlightChange);
                }
                reEnableAllCheckboxes();
                clearAllDeleteMarkingCheckboxes();
                undisplayRemovedSpotlights(successfulDelete);
            })
            .catch(x => {
                console.log('Promise.all fail', x);
            });
    }

    const deleteSelectedSpotlights = () => {
        const checkboxes = document.querySelectorAll('.markForDeletion input[type="checkbox"]:checked');
        if (!!checkboxes && checkboxes.length > 0) {
            // make an array of ids that the promise cam loop over
            const spotlightIDsToBeDeleted = [];
            for (const c of checkboxes) {
                const spotlightID = c.value.replace(checkBoxIdPrefix, '');
                console.log('checkbox ', c.value, spotlightID);
                spotlightIDsToBeDeleted.push(spotlightID);
            }
            deleteListOfSpotlights(spotlightIDsToBeDeleted);
        }
    };

    const handleDeleteSplitAction = spotlightID => {
        console.log('deleteSpotlightById ', spotlightID);
        deleteListOfSpotlights([spotlightID]);
    };

    const confirmDeleteLocale = numberOfCheckedBoxes => {
        return {
            ...locale.listPage.confirmDelete,
            confirmationTitle: locale.listPage.confirmDelete.confirmationTitle
                .replace('[N]', numberOfCheckedBoxes)
                .replace('spotlights', numberOfCheckedBoxes === 1 ? 'spotlight' : 'spotlights'),
        };
    };

    // https://stackoverflow.com/a/5306832/1246313
    let hasDraggedAndDropped = false;
    function arrayMove(arr, oldIndex, newIndex) {
        if (newIndex >= arr.length) {
            let k = newIndex - arr.length + 1;
            while (k--) {
                arr.push(undefined);
            }
        }
        arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
        hasDraggedAndDropped = true;
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

                    const weightCell = document.querySelector(`#spotlight-list-row-${reWeightedRow.id} .order`);
                    console.log('weightCell = ', weightCell);
                    !!weightCell && (weightCell.innerHTML = reWeightedRow.weight / 10);
                }
            });
        });
    };

    const confirmPublishUnpublishLocale = isCurrentlyActive => {
        return !!isCurrentlyActive ? locale.listPage.confirmUnpublish : locale.listPage.confirmPublish;
    };

    const handlePublishCheckbox = () => event => {
        console.log('handlePublishCheckbox event = ', event);
        const checkboxId = event.target?.id.replace('spotlight-published-', '');
        console.log('checkboxId = ', checkboxId);
        const spotlight = userows.find(r => r.id === checkboxId);
        setPublishUnpublishLocale(confirmPublishUnpublishLocale(spotlight.active));
        setSelectedSpotlight(checkboxId);
        showPublishUnpublishConfirmation(true);
    };

    const handlePublishCheckboxConfirmation = () => {
        if (!selectedSpotlight) {
            return;
        }
        const updateableRow = rows.find(r => r.id === selectedSpotlight);
        const newState = !!updateableRow && !updateableRow.active ? 1 : 0;
        const rowToUpdate = {
            ...cleanSpotlight(updateableRow),
            active: newState,
        };
        console.log('rowToUpdate = ', newState, rowToUpdate.active);

        setUserows(prevState => {
            const data = [...prevState];
            data.map(r => r.id === selectedSpotlight && (r.active = newState));
            return data;
        });

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
        if (!!hasDraggedAndDropped) {
            // we dont resort immediately after a drag and drop - it overrides the drag redisplay :(
            hasDraggedAndDropped = false;
            return array;
        }
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map(el => el[0]);
    }

    const sortOrderAllowsDragAndDrop = orderBy === ORDERBY_WEIGHT && sortOrder === 'asc';

    const endsThisWeek = spotlight => {
        // used to display to the user that come monday morning this spotlight will be gone
        // (specifically meant to address when ALL the spotlights finish this week and none are scheduled)
        return moment(spotlight.end) <= getTimeMondayComing();
    };

    const clearFilter = () => {
        setTextSearch('');
        setUserows(staticUserows);
    };

    const filterRows = e => {
        const filterTerm = e.target?.value;

        if (filterTerm === '') {
            clearFilter();
            return;
        }

        setTextSearch(filterTerm);
        setUserows(
            [...staticUserows].filter(r => {
                const lowercaseLinkAria = r.title.toLowerCase();
                const lowercaseImgAlt = r.img_alt.toLowerCase();
                return (
                    lowercaseLinkAria.includes(filterTerm.toLowerCase()) ||
                    lowercaseImgAlt.includes(filterTerm.toLowerCase())
                );
            }),
        );
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
            <ConfirmationBox
                actionButtonColor="secondary"
                actionButtonVariant="contained"
                confirmationBoxId="spotlight-confirm-publish-unpublish-dialog"
                onAction={hidePublishUnpublishConfirmation}
                onClose={hidePublishUnpublishConfirmation}
                onCancelAction={() => handlePublishCheckboxConfirmation()}
                isOpen={isPublishUnpublishConfirmationOpen}
                locale={publishUnpublishLocale}
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
                                <TableCell
                                    component="th"
                                    scope="row"
                                    style={{ width: 50, padding: 0, textAlign: 'center', color: '#666' }}
                                >
                                    <DeleteOutlinedIcon />
                                </TableCell>
                                {tableType === 'current' && (
                                    <TableCell component="th" scope="row" style={{ width: 10, padding: 0 }}>
                                        <TableSortLabel
                                            active={orderBy === ORDERBY_WEIGHT}
                                            direction={orderBy === ORDERBY_WEIGHT ? sortOrder : 'asc'}
                                            onClick={createSortHandler(ORDERBY_WEIGHT)}
                                        >
                                            {/* indicates drag and drop available - only when sorting by weight!! */}
                                            {sortOrderAllowsDragAndDrop ? (
                                                <SortIcon
                                                    fontSize="small"
                                                    style={{
                                                        transform: 'scaleX(-1)',
                                                    }}
                                                    // InputProps={{
                                                    //     'aria-label': 'order by weight. Drag and drop available',
                                                    // }}
                                                />
                                            ) : (
                                                <span style={{ width: 20 }} />
                                            )}
                                            Order
                                        </TableSortLabel>
                                    </TableCell>
                                )}
                                <TableCell component="th" scope="row" style={{ width: 220 }}>
                                    Spotlight
                                </TableCell>
                                <TableCell component="th" scope="row" style={{ width: 260 }}>
                                    {!!canTextFilter && (
                                        <div style={{ position: 'relative' }}>
                                            <TextField
                                                data-testid="spotlights-list-clear-text-field"
                                                inputProps={{
                                                    maxLength: 25,
                                                    'aria-label': locale.listPage.textSearch.ariaLabel,
                                                }}
                                                onChange={filterRows}
                                                label={locale.listPage.textSearch.displayLabel}
                                                value={textSearch}
                                            />
                                            <CloseIcon
                                                id="spotlights-list-clear-text-filter-clear-button"
                                                data-testid="spotlights-list-clear-text-filter-clear-button"
                                                color="disabled"
                                                fontSize="small"
                                                style={{
                                                    position: 'absolute',
                                                    bottom: '10%',
                                                    right: 50,
                                                }}
                                                onClick={clearFilter}
                                            />
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell component="th" scope="row" style={{ padding: 0 }}>
                                    <TableSortLabel
                                        active={orderBy === ORDERBY_STARTDATE}
                                        direction={orderBy === ORDERBY_STARTDATE ? sortOrder : 'asc'}
                                        onClick={createSortHandler(ORDERBY_STARTDATE)}
                                    >
                                        {locale.form.labels.publishDate}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell component="th" scope="row" style={{ padding: 8 }}>
                                    <TableSortLabel
                                        active={orderBy === ORDERBY_END_DATE}
                                        direction={orderBy === ORDERBY_END_DATE ? sortOrder : 'asc'}
                                        onClick={createSortHandler(ORDERBY_END_DATE)}
                                    >
                                        {locale.form.labels.unpublishDate}
                                    </TableSortLabel>
                                </TableCell>
                                {!!canUnpublish && (
                                    <TableCell component="th" scope="row" style={{ width: 50, padding: 8 }}>
                                        <TableSortLabel
                                            active={orderBy === ORDERBY_PUBLISHEDFLAG}
                                            direction={orderBy === ORDERBY_PUBLISHEDFLAG ? sortOrder : 'asc'}
                                            onClick={createSortHandler(ORDERBY_PUBLISHEDFLAG)}
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
                                                                            className={`order ${classes.tableCell}`}
                                                                            style={{ textAlign: 'center' }}
                                                                        >
                                                                            {spotlight.weight / 10}
                                                                            {/* display a simple 1, 2, 3, ... */}
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
                                                                            title={spotlight.img_alt}
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
                                                                        className={classes.startDate}
                                                                        style={{ padding: 0 }}
                                                                    >
                                                                        <span title={spotlight.startDateLong}>
                                                                            {spotlight.startDateDisplay}
                                                                        </span>
                                                                    </TableCell>
                                                                    <TableCell
                                                                        component="td"
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
    saveSpotlightChange: PropTypes.any,
    footerDisplayMinLength: PropTypes.number,
    // spotlightOrder: PropTypes.any,
    canDragRows: PropTypes.bool,
    canUnpublish: PropTypes.bool,
    canTextFilter: PropTypes.bool,
    reweightSpotlights: PropTypes.any,
};

SpotlightsListAsTable.defaultProps = {
    footerDisplayMinLength: 5, // the number of records required in the spotlight list before we display the paginator
    // spotlightOrder: false, // what order should we sort the spotlights in? false means unspecified
    canDragRows: false, // does this section allow drag and drop
    canUnpublish: false, // does this section allow the user to have a publish/unpublish checbox?
    canTextFilter: false, // show the 'text filter' input field
};

export default SpotlightsListAsTable;
