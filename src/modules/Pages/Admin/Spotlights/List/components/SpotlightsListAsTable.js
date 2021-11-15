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
import {
    formatDate,
    getTimeMondayComing,
    isCurrentSpotlight,
    isPastSpotlight,
    isScheduledSpotlight,
} from 'modules/Pages/Admin/Spotlights/spotlighthelpers';

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
        tableHeader: {
            width: 50,
            padding: 0,
            textAlign: 'center',
            color: '#666',
            borderColor: '#fff',
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
        tableHeading: {
            marginBottom: -6,
            textAlign: 'left',
            fontSize: '1.5em',
            marginTop: '0.9em',
            marginLeft: 6,
            '& span': {
                fontSize: '0.8em',
                fontWeight: 300,
            },
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
            paddingRight: 10,
            '& h4': {
                fontWeight: '300',
                display: 'inline',
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
    spotlightsError,
    saveSpotlightChange,
    deleteSpotlightBulk,
    footerDisplayMinLength,
    canDragRows,
    canUnpublish,
    canTextFilter,
}) => {
    console.log('top: spotlightsError = ', spotlightsError);
    console.log('top: ', tableType, ' rows = ', rows);
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
    const [orderBy, setOrderBy] = React.useState(
        orderByDefault[tableType] || /* istanbul ignore next */ ORDERBY_WEIGHT,
    );

    const [page, setPage] = useState(0);
    const [deleteActive, setDeleteActive] = useState(false);
    const [spotlightNotice, setSpotlightNotice] = useState('');
    const [userows, setUserows] = useState([]);
    const [staticUserows, setStaticUserows] = useState([]);
    const [selectedSpotlight, setSelectedSpotlight] = useState(null);
    const [publishUnpublishLocale, setPublishUnpublishLocale] = useState({});
    const [textSearch, setTextSearch] = useState('');

    const [draggedId, setDraggedId] = useState(false);

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
            console.log('rowList = ', rowList);
            if (!rowList) {
                return;
            }

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

            if (!!draggedId) {
                // briefly mark the dragged row with a style, so the user knows what they did
                setTimeout(() => {
                    // rows arent immediately available :(
                    const draggedRow = document.getElementById(`spotlight-list-row-${draggedId}`);
                    console.log('displayTheRows: draggedRow = ', draggedRow);
                    !!draggedRow && (draggedRow.style.backgroundColor = '#bbd8f5'); // colour: info light
                }, 200);
                setTimeout(() => {
                    const draggedRow = document.getElementById(`spotlight-list-row-${draggedId}`);
                    !!draggedRow && (draggedRow.style.transition = 'background-color 3s linear');
                    !!draggedRow && (draggedRow.style.backgroundColor = 'inherit');
                }, 700);

                setDraggedId(false);
            }
        },
        [tableType, draggedId],
    );

    React.useEffect(() => {
        if (!!rows && rows.length === 0) {
            setUserows([]);
            setPage(0); // make it redraw when all displayed rows in a table are deleted
            return;
        }

        displayTheRows(rows);
    }, [rows, displayTheRows]);

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

    const headerCountIndicator = ' - [N] spotlights'
        .replace('[N]', userows.length)
        .replace('[s]', userows.length > 1 ? 's' : '');

    const navigateToEditForm = spotlightid => {
        console.log('navigateToEditForm');
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
        } /* istanbul ignore else */ else if (!!e.target && !e.target.checked) {
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

    const reweightSpotlights = () => {
        console.log('reweightSpotlights: userows=', userows);
        const listUnchanged = userows.map(s => s);
        // const list = userows.map(s => s);
        setUserows(prevState => {
            console.log('reweightSpotlights prevState = ', prevState);
            const data = [...prevState];

            data.map(s => {
                // sort current then scheduled and then past
                if (isPastSpotlight(s)) {
                    s.spotlightType = 3; // past
                } /* istanbul ignore next */ else if (isScheduledSpotlight(s)) {
                    // console.log('check scheduled', s.id, s.title.substr(0, 20), s.start, s.weight);
                    s.spotlightType = 2; // scheduled
                } else {
                    // console.log('check current', s.id, s.title.substr(0, 20), s.start, s.weight);
                    s.spotlightType = 1; // current
                }
                return s;
            })
                .sort((a, b) => {
                    // sort by type then start date
                    // this will make the scheduled spotlights appear as the last spotlight, as they become current
                    const thisStartDate = formatDate(a.start, 'YYYYMMDDHHmmss');
                    const prevStartDate = formatDate(b.start, 'YYYYMMDDHHmmss');
                    const thisEndDate = formatDate(a.end, 'YYYYMMDDHHmmss');
                    const prevEndDate = formatDate(b.end, 'YYYYMMDDHHmmss');
                    if (isPastSpotlight(a)) {
                        return a.spotlightType - b.spotlightType || Number(thisEndDate) - Number(prevEndDate);
                    } /* istanbul ignore next */ else if (isScheduledSpotlight(a)) {
                        return a.spotlightType - b.spotlightType || Number(thisStartDate) - Number(prevStartDate);
                    } else {
                        return a.spotlightType - b.spotlightType || a.weight - b.weight;
                    }
                })
                .map((s, index) => {
                    return {
                        ...s,
                        weight: isPastSpotlight(s) ? 0 : (Number(index) + 1) * 10,
                    };
                })
                .forEach(s => {
                    const currentRow = listUnchanged.map(t => t).find(r => r.id === s.id);
                    const newValues = {
                        ...currentRow,
                        active: !!currentRow.active ? 1 : 0,
                        weight: s.weight,
                    };

                    // (!isPastSpotlight(s) || s.weight !== currentRow.weight) &&
                    //     console.log(
                    //         'will',
                    //         s.weight === currentRow.weight ? 'NOT' : '',
                    //         'update weight on',
                    //         newValues.id,
                    //         newValues.title.substr(0, 20),
                    //         'start: ',
                    //         newValues.start,
                    //         'weight: ',
                    //         newValues.weight,
                    //         ' (was ',
                    //         currentRow.weight,
                    //         ')',
                    //         // eslint-disable-next-line no-nested-ternary
                    //         isPastSpotlight(s) ? 'past' : isScheduledSpotlight(s) ? 'scheduled' : 'current',
                    //     );

                    // update the display of Order
                    // only current spotlights display the order value
                    if (!!isCurrentSpotlight(s)) {
                        const selector = `#spotlight-list-row-${currentRow.id} .order`;
                        const weightCell = document.querySelector(selector);
                        console.log('weightCell = ', weightCell);
                        !!weightCell && (weightCell.innerHTML = newValues.weight / 10);
                    }
                });
            console.log('reweight: setting userows to:', data);
            return data;
        });

        console.log('after reweight: userows = ', userows);
    };

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

    function deleteListOfSpotlights(spotlightIDsToBeDeleted) {
        console.log('spotlightIDsToBeDeleted = ', spotlightIDsToBeDeleted);

        deleteSpotlightBulk(spotlightIDsToBeDeleted)
            .then(() => {
                console.log('returned bulk delete checkboxes');
                console.log('deleteSelectedSpotlights tableType=', tableType, 'userows=', userows);
                console.log('deleteListOfSpotlights: spotlightsError = ', spotlightsError);
                /* istanbul ignore next */
                if (!!spotlightsError) {
                    console.log('deleteSpotlightBulk failed!');
                    showDeleteFailureConfirmation();
                } else {
                    console.log('deleteSpotlightBulk success!');
                    console.log('deleteListOfSpotlights: will reorder');
                    reweightSpotlights();
                    console.log('deleteListOfSpotlights: reneable checkboxes');
                    reEnableAllCheckboxes();
                    console.log('deleteListOfSpotlights: clear delete marking');
                    clearAllDeleteMarkingCheckboxes();
                    setSpotlightNotice('');
                    setDeleteActive(false);
                }
            })
            .catch(
                /* istanbul ignore next */ x => {
                    console.log('Promise.all fail', x);
                    showDeleteFailureConfirmation();
                },
            );
    }

    const deleteSelectedSpotlights = () => {
        const checkboxes = document.querySelectorAll('.markForDeletion input[type="checkbox"]:checked');
        /* istanbul ignore else */
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
    /* istanbul ignore next */
    function moveItemInArray(arr, oldIndex, newIndex) {
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

    /* istanbul ignore next */
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

        // so we can briefly mark the dragged row with a style, so the user knows what they did, when the save returns
        setDraggedId(draggableId);

        const thisspotlight = [...userows].find(s => s.id === draggableId);
        console.log('thisspotlight = ', thisspotlight);
        // set the weight on the edited spotlight to + 5, then let the Backend resort it to 10s on save
        let newWeight;
        if (destination.index > source.index) {
            newWeight = destination.index * 10 + 15; // dragging right
        } else {
            newWeight = destination.index * 10 + 5; // dragging left
        }
        const thisspotlight2 = {
            ...cleanSpotlight(thisspotlight),
            weight: newWeight,
        };

        // react-beautiful-dnd relies on the order of the array, rather than an index
        // reorder the array so we dont get a flash of the original order while we wait for the new array to load
        const reweightedRows = [...userows]
            .map((r, index) => {
                if (index === source.index) {
                    console.log('source: ', index, ' from ', source.index, ' to ', destination.index);
                    r.weight = destination.index * 10 + 5;
                }
                return r;
            })
            .sort((a, b) => {
                return a.weight - b.weight;
            });
        const oldIndex = userows.find(r => r.id === draggableId).weight / 10 - 1;
        const newIndex = reweightedRows.find(r => r.id === draggableId).weight / 10 - 1;
        moveItemInArray(userows, oldIndex, newIndex);

        saveSpotlightChange(thisspotlight2)
            .then(() => {
                // do nothing, we assume success
                console.log('saveSpotlightChange success');
            })
            .catch(() => {
                showSaveFailureConfirmation();
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
        /* istanbul ignore next */
        if (!selectedSpotlight) {
            return;
        }
        const updateableRow = rows.find(r => r.id === selectedSpotlight);
        /* istanbul ignore next */
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
        const isAsc = orderBy === property && /* istanbul ignore next */ sortOrder === 'asc';
        setSetOrder(isAsc ? /* istanbul ignore next */ 'desc' : 'asc');
        setOrderBy(property);
    };

    function descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        /* istanbul ignore else */
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        /* istanbul ignore next */
        return 0;
    }

    function getComparator(order, orderBy) {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    /* istanbul ignore next */
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

        // if (filterTerm === '') {
        //     clearFilter();
        //     return;
        // }

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
            <DragDropContext onDragEnd={onDragEnd}>
                <TableContainer
                    id={`spotlight-list-${tableType}`}
                    data-testid={`spotlight-list-${tableType}`}
                    component={Paper}
                    style={{ marginTop: 20 }}
                >
                    <Table className={classes.table} aria-label="custom pagination table" style={{ minHeight: 200 }}>
                        <TableHead>
                            <TableRow md-row="" className="md-row">
                                <TableCell component="th" scope="row" className={classes.tableHeader} colSpan="8">
                                    <Grid
                                        data-testid={`headerRow-${tableType}`}
                                        className={`${classes.headerRow} ${
                                            !!deleteActive ? classes.headerRowHighlighted : ''
                                        }`}
                                        container
                                    >
                                        <Grid item xs={12} md={!!deleteActive ? 5 : 12}>
                                            <h3 className={classes.tableHeading}>
                                                {headertag}
                                                <span data-testid={`headerRow-count-${tableType}`}>
                                                    {headerCountIndicator}
                                                </span>
                                            </h3>
                                        </Grid>
                                        <Grid item xs={12} md={7} container justify="flex-end">
                                            {!!deleteActive && (
                                                <span
                                                    className="deleteManager"
                                                    style={{ marginLeft: 'auto', paddingTop: 8 }}
                                                >
                                                    <span>{spotlightNotice}</span>
                                                    <IconButton
                                                        onClick={showDeleteConfirmation}
                                                        aria-label={
                                                            locale.listPage.tooltips.deleteSelectedSpotlightsButton
                                                        }
                                                        data-testid={`spotlight-list-${tableType}-delete-button`}
                                                        title={locale.listPage.tooltips.deleteSelectedSpotlightsButton}
                                                    >
                                                        <DeleteIcon
                                                            className={`${
                                                                !!deleteActive
                                                                    ? classes.iconHighlighted
                                                                    : /* istanbul ignore next */ ''
                                                            }`}
                                                        />
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={clearAllDeleteMarkingCheckboxes}
                                                        aria-label={
                                                            locale.listPage.tooltips.clearSelectedSpotlightsButton
                                                        }
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
                                </TableCell>
                            </TableRow>
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
                                                <SortIcon fontSize="small" style={{ transform: 'scaleX(-1)' }} />
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
                                                style={{ position: 'absolute', bottom: '10%', right: 50 }}
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
                                        direction={
                                            orderBy === ORDERBY_END_DATE ? /* istanbul ignore next */ sortOrder : 'asc'
                                        }
                                        onClick={createSortHandler(ORDERBY_END_DATE)}
                                    >
                                        {locale.form.labels.unpublishDate}
                                    </TableSortLabel>
                                </TableCell>
                                {!!canUnpublish && (
                                    <TableCell component="th" scope="row" style={{ width: 50, padding: 8 }}>
                                        <TableSortLabel
                                            active={orderBy === ORDERBY_PUBLISHEDFLAG}
                                            direction={
                                                orderBy === ORDERBY_PUBLISHEDFLAG
                                                    ? /* istanbul ignore next */ sortOrder
                                                    : 'asc'
                                            }
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
                                                                        className={`${classes.tableCell} ${classes.h4}`}
                                                                    >
                                                                        <h4
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
                                            !spotlightsLoading && rowsPerPage > 0 && userows.length > 0
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
    spotlightsError: PropTypes.any,
    saveSpotlightChange: PropTypes.any,
    deleteSpotlightBulk: PropTypes.any,
    footerDisplayMinLength: PropTypes.number,
    // spotlightOrder: PropTypes.any,
    canDragRows: PropTypes.bool,
    canUnpublish: PropTypes.bool,
    canTextFilter: PropTypes.bool,
};

SpotlightsListAsTable.defaultProps = {
    footerDisplayMinLength: 5, // the number of records required in the spotlight list before we display the paginator
    // spotlightOrder: false, // what order should we sort the spotlights in? false means unspecified
    canDragRows: false, // does this section allow drag and drop
    canUnpublish: false, // does this section allow the user to have a publish/unpublish checbox?
    canTextFilter: false, // show the 'text filter' input field
};

export default React.memo(SpotlightsListAsTable);
