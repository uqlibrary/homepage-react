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

const useStyles = makeStyles(() => ({
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
    scheduledDisplay: {
        fontWeight: '300',
        '& h4': {
            fontWeight: '300',
        },
    },
}));
export const SpotlightsListAsTable = ({
    rows,
    headertag,
    tableType,
    spotlightsLoading,
    history,
    actions,
    deleteSpotlight,
    footerDisplayMinLength,
    allowFilter,
}) => {
    const classes = useStyles();
    const [page, setPage] = useState(0);
    const [deleteActive, setDeleteActive] = useState(false);
    const [spotlightNotice, setSpotlightNotice] = useState('');
    const [showFuture, setShowFuture] = useState(true);
    const [showUnPublished, setShowUnPublished] = useState(true);
    const [userows, setUserows] = useState([]);
    const [cookies, setCookie] = useCookies();

    const [rowsPerPage, setRowsPerPage] = useState(
        (!cookies.spotlightAdminPaginatorSize && footerDisplayMinLength) ||
            parseInt(cookies.spotlightAdminPaginatorSize, 10),
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

            let localRows = rowList.map((row, index) => {
                if (tableType !== 'past') {
                    // change "!== past" to test by passed in attribute for 'candragdrop?
                    row.weight = (index + 1) * 10;
                    // reset the weights to a clean 10 step, in case they arent already,
                    // so it is easy to insert one in the middle during drag and drop
                }
                return row;
            });
            console.log('localRows = ', localRows);

            if (!!allowFilter && !!showFuture) {
                localRows = localRows.filter(row => !moment(row.start).isAfter(moment()));
                console.log('2 localRows future: ', localRows);
            }
            if (!!allowFilter && !!showUnPublished) {
                localRows = localRows.filter(row => !!row.active);
                console.log('3 localRows unpublished = ', localRows);
            }

            console.log('4 localRows = ', localRows);

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
        [allowFilter, showFuture, showUnPublished, tableType],
    );

    React.useEffect(() => {
        console.log('rows have changed ', rows.length);
        displayTheRows(rows);

        // make it redraw when all displayed rows in a table are deleted
        rows.length === 0 && setPage(0);
    }, [rows, displayTheRows]);

    React.useEffect(() => {
        console.log('useRows have changed ', userows);
    }, [userows]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const checkBoxIdPrefix = 'checkbox-';

    const handleChangeRowsPerPage = event => {
        const numberOfRows = parseInt(event.target.value, 10);

        const current = new Date();
        const nextYear = new Date();
        nextYear.setFullYear(current.getFullYear() + 1);
        setCookie('spotlightAdminPaginatorSize', numberOfRows, { expires: nextYear });

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
        const numberCheckboxesSelected = getNumberCheckboxesSelected();

        const thisType = e.target.closest('table').parentElement.id;
        if (!!e.target && !!e.target.checked) {
            // handle a checkbox being turned on
            if (numberCheckboxesSelected === 1) {
                setDeleteActive(true);
            }
            // disable any checkboxes in a different spotlight list
            const checkBoxList = document.querySelectorAll('#admin-spotlights-list input[type="checkbox"]');
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
        setShowFuture(prevState => !prevState);
    };
    const showHideUnPublished = () => {
        setShowUnPublished(prevState => !prevState);
    };

    // after a drag and drop save, this updates the display
    function moveRow(r, filtereduserows) {
        actions
            .saveSpotlightChange(r)
            .then(() => {
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
                console.log('after: ');
                rows.forEach(row => console.log(row.id, ' ', row.weight, ' ', row.title));
                setUserows(rows);
            })
            .catch(() => {
                // TODO
            });
    }

    const onDragEnd = result => {
        console.log('onDragEnd: result = ', result);
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

        console.log('draggableId = ', draggableId);
        let counter = 1;
        let filtereduserows = [];
        rows.forEach((row, index) => {
            const newWeight =
                row.id !== draggableId
                    ? counter * 10 // apart from the moved item, we just count through the items, in 10s
                    : destination.index * 10 + 5; // the moved item gets the nearest item plus 5
            console.log('newrow = ', row.id, row.weight, newWeight);
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

        // now persist the changed record to the DB
        filtereduserows.forEach(reWeightedRow => {
            rows.map(r => {
                if (reWeightedRow.id === r.id && reWeightedRow.weight !== r.weight) {
                    moveRow(r, filtereduserows);
                }
            });
        });
    };

    const needsPaginator = userows.length > footerDisplayMinLength;

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
            {!deleteActive && (
                <Grid
                    data-testid={`headerRow-${tableType}`}
                    className={`${classes.headerRow} ${!!deleteActive ? classes.headerRowHighlighted : ''}`}
                    container
                >
                    <Grid item xs={12} md={allowFilter ? 7 : 12}>
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
                    {allowFilter && (
                        <Grid item xs={12} md={2}>
                            <p className={classes.toggle}>
                                <InputLabel
                                    style={{ color: 'rgba(0, 0, 0, 0.87)' }}
                                    title="Check and uncheck to show and hide scheduled spotlights in the list"
                                >
                                    <Checkbox
                                        checked={showFuture}
                                        onChange={showHideScheduled}
                                        name="showFuture"
                                        inputProps={{ 'aria-label': 'primary checkbox' }}
                                    />
                                    Hide scheduled
                                </InputLabel>
                            </p>
                        </Grid>
                    )}
                    {allowFilter && (
                        <Grid item xs={12} md={3}>
                            <p className={classes.toggle}>
                                <InputLabel
                                    style={{ color: 'rgba(0, 0, 0, 0.87)' }}
                                    title="Check and uncheck to show and hide unpublished spotlights in the list"
                                >
                                    <Checkbox
                                        checked={showUnPublished}
                                        onChange={showHideUnPublished}
                                        name="showUnPublished"
                                        inputProps={{ 'aria-label': 'primary checkbox' }}
                                    />
                                    Hide unpublished
                                </InputLabel>
                            </p>
                        </Grid>
                    )}
                </Grid>
            )}
            {/* {allowFilter && (*/}
            {/*    <Grid container>*/}
            {/*        <Grid item xs={0} md={6} />*/}
            {/*        <Grid item xs={12} md={6}>*/}
            {/*            You can only drag-and-drop when all spotlights are displayed*/}
            {/*        </Grid>*/}
            {/*    </Grid>*/}
            {/* )}*/}
            {!!deleteActive && (
                <span className="deleteManager" style={{ marginLeft: 'auto', paddingTop: 8 }}>
                    <span>{spotlightNotice}</span>
                    <IconButton
                        onClick={showDeleteConfirmation}
                        aria-label="Delete spotlight(s)"
                        data-testid={`spotlight-list-${tableType}-delete-button`}
                        title="Delete spotlight(s)"
                    >
                        <DeleteIcon className={`${!!deleteActive ? classes.iconHighlighted : ''}`} />
                    </IconButton>
                    <IconButton
                        onClick={clearAllCheckboxes}
                        aria-label="Deselect all"
                        data-testid={`spotlight-list-${tableType}-deselect-button`}
                        className={classes.iconHighlighted}
                        title="Deselect all"
                    >
                        <CloseIcon />
                    </IconButton>
                </span>
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
                                <TableCell component="th" scope="row" style={{ width: 10 }}>
                                    W
                                </TableCell>
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
                                                const isScheduled = moment(spotlight.start).isAfter(moment());
                                                return (
                                                    <Draggable
                                                        draggableId={spotlight.id}
                                                        index={rowindex}
                                                        key={spotlight.id}
                                                    >
                                                        {draggableProvided => (
                                                            <TableRow
                                                                // key={spotlight.id}
                                                                id={`spotlight-list-row-${spotlight.id}`}
                                                                data-testid={`spotlight-list-row-${spotlight.id}`}
                                                                className="spotlight-data-row"
                                                                // index={rowindex}
                                                                {...draggableProvided.draggableProps}
                                                                {...draggableProvided.dragHandleProps}
                                                                ref={draggableProvided.innerRef}
                                                                role="row"
                                                            >
                                                                <TableCell
                                                                    component="td"
                                                                    className={`${classes.tableCell} ${
                                                                        !!isScheduled ? classes.scheduledDisplay : ''
                                                                    }`}
                                                                >
                                                                    {' '}
                                                                    {spotlight.weight}
                                                                </TableCell>
                                                                <TableCell
                                                                    component="td"
                                                                    className={`${classes.checkboxCell} ${
                                                                        !!isScheduled ? classes.scheduledDisplay : ''
                                                                    }`}
                                                                >
                                                                    <Checkbox
                                                                        id={`spotlight-list-item-checkbox-${spotlight.id}`}
                                                                        inputProps={{
                                                                            'aria-labelledby': `spotlight-list-item-title-${spotlight.id}`,
                                                                            'data-testid': `spotlight-list-item-checkbox-${spotlight.id}`,
                                                                        }}
                                                                        onChange={handleCheckboxChange}
                                                                        value={`${checkBoxIdPrefix}${spotlight.id}`}
                                                                    />
                                                                </TableCell>
                                                                <TableCell
                                                                    component="td"
                                                                    className={`${classes.tableCell} ${
                                                                        !!isScheduled ? classes.scheduledDisplay : ''
                                                                    }`}
                                                                >
                                                                    <img
                                                                        alt={spotlight.img_alt}
                                                                        src={spotlight.img_url}
                                                                        style={{ width: 220, minHeight: 80 }}
                                                                    />
                                                                </TableCell>
                                                                <TableCell
                                                                    component="td"
                                                                    className={`${classes.tableCell} ${
                                                                        !!isScheduled ? classes.scheduledDisplay : ''
                                                                    }`}
                                                                >
                                                                    {isScheduled && (
                                                                        <div style={{ float: 'left', width: 30 }}>
                                                                            <ScheduleIcon
                                                                                data-testid={`spotlight-scheduled-icon-${spotlight.id}`}
                                                                            />
                                                                        </div>
                                                                    )}
                                                                    <h4
                                                                        style={{ display: 'inline' }}
                                                                        id={`spotlight-list-item-title-${spotlight.id}`}
                                                                    >{`${spotlight.title}`}</h4>{' '}
                                                                </TableCell>
                                                                <TableCell
                                                                    component="td"
                                                                    align="center"
                                                                    className={`${classes.startDate} ${
                                                                        !!isScheduled ? classes.scheduledDisplay : ''
                                                                    }`}
                                                                >
                                                                    <span title={spotlight.startDateLong}>
                                                                        {spotlight.startDateDisplay}
                                                                    </span>
                                                                </TableCell>
                                                                <TableCell
                                                                    component="td"
                                                                    align="center"
                                                                    className={`${classes.endDate} ${
                                                                        !!isScheduled ? classes.scheduledDisplay : ''
                                                                    }`}
                                                                >
                                                                    <span title={spotlight.endDateLong}>
                                                                        {spotlight.endDateDisplay}
                                                                    </span>
                                                                </TableCell>
                                                                <TableCell
                                                                    component="td"
                                                                    className={`${classes.publishedCell} ${
                                                                        !!isScheduled ? classes.scheduledDisplay : ''
                                                                    }`}
                                                                >
                                                                    <span>{!!spotlight.active ? 'yes' : 'no'}</span>
                                                                </TableCell>
                                                                <TableCell
                                                                    component="td"
                                                                    id={`spotlight-list-action-block-${spotlight.id}`}
                                                                    data-testid={`spotlight-list-action-block-${spotlight.id}`}
                                                                    className={`${classes.tableCell} ${
                                                                        !!isScheduled ? classes.scheduledDisplay : ''
                                                                    }`}
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
                                        colSpan={3}
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
    footerDisplayMinLength: PropTypes.number,
    // spotlightOrder: PropTypes.any,
    allowFilter: PropTypes.bool,
};

SpotlightsListAsTable.defaultProps = {
    footerDisplayMinLength: 5, // the number of records required in the spotlight list before we display the paginator
    // spotlightOrder: false, // what order should we sort the spotlights in? false means unspecified
    allowFilter: false, // does this table display filtering of scheduled and unpublished spotlights?
};

export default SpotlightsListAsTable;
