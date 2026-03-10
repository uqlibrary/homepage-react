import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useCookies } from 'react-cookie';

import { Grid } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';

import DoneIcon from '@mui/icons-material/Done';

import { addClass, removeClass, standardText } from 'helpers/general';

import { addBreadcrumbsToSiteHeader } from 'modules/Pages/Admin/BookableSpaces/bookableSpacesAdminHelpers';
import SpacesAdminPage from 'modules/Pages/Admin/BookableSpaces/SpacesAdminPage';

const StyledStandardCard = styled(StandardCard)(() => ({
    '& .MuiCardHeader-root': {
        paddingBottom: 0,
    },
    '& .MuiCardContent-root': {
        paddingBlock: 0,
    },
}));
const StyledBookableSpaceGridItem = styled(Grid)(() => ({
    marginTop: '12px',
}));
const StyledTableContainer = styled(TableContainer)(() => ({
    position: 'relative',
    overflow: 'auto',
}));
const StyledTableHead = styled(TableHead)(() => ({}));

const StyledHeadingFacilityTableCell = styled(TableCell)(() => ({
    whiteSpace: 'normal',
    textAlign: 'center',
}));

const StyledHeaderTableRow = styled(TableRow)(({ theme }) => ({
    '& th, & td': {
        ...standardText(theme),
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '& th, & td': {
        ...standardText(theme),
    },
    '&:hover': {
        backgroundColor: 'rgb(245 245 245)',
        '& th, & td': {
            backgroundColor: 'rgb(245 245 245)',
        },
    },
    '&.hiddenRow': {
        display: 'none',
    },
    '& button': {
        paddingBlock: 0,
        '&:hover, &:focus': {
            backgroundColor: 'inherit',
        },
    },
}));

const CAMPUS_ID_UNSELECTED = '';
const LIBRARY_ID_UNSELECTED = '';
const FLOOR_ID_UNSELECTED = '';

export const BookableSpacesManageSpaceTypes = ({
    actions,
    bookableSpacesRoomList,
    bookableSpacesRoomListLoading,
    bookableSpacesRoomListError,
    weeklyHours,
    weeklyHoursLoading,
    weeklyHoursError,
    facilityTypeList,
    facilityTypeListLoading,
    facilityTypeListError,
    campusList,
    campusListLoading,
    campusListError,
}) => {
    console.log(
        'TOP bookableSpacesRoomList',
        bookableSpacesRoomListLoading,
        bookableSpacesRoomListError,
        bookableSpacesRoomList,
    );
    console.log('TOP weeklyHours', weeklyHoursLoading, weeklyHoursError, weeklyHours);
    console.log('TOP facilityTypeList', facilityTypeListLoading, facilityTypeListError, facilityTypeList);

    const [displayedRows, setDisplayedRows2] = useState([]);
    const setDisplayedRows = rows => {
        console.log('setDisplayedRows', rows);
        setDisplayedRows2(rows);
    };

    const [cookies, setCookie] = useCookies();

    const paginatorCookieName = 'spaces-list-paginator';
    const [rowsPerPage, setRowsPerPage] = React.useState(
        !!cookies[paginatorCookieName] ? parseInt(cookies[paginatorCookieName], 10) : 5,
    );
    const [pageNum, setPageNum] = React.useState(0);
    const [editingSpaceTypeId, setEditingSpaceTypeId] = useState(null);
    const [editingDraft, setEditingDraft] = useState({
        spaceTypeName: '',
        spaceTypeDescription: '',
    });
    const [spaceTypeEdits, setSpaceTypeEdits] = useState({});
    const [deleteCandidate, setDeleteCandidate] = useState(null);
    const [isAddSpaceTypeDialogOpen, setIsAddSpaceTypeDialogOpen] = useState(false);
    const [addSpaceTypeDraft, setAddSpaceTypeDraft] = useState({
        spaceTypeName: '',
        spaceTypeDescription: '',
    });

    // the filters we will show on the page
    // React.useEffect(() => {
    //     if (campusListError === false && campusListLoading === false && !!campusList) {
    //         const campusIdList = [
    //             ...new Set(bookableSpacesRoomList?.data?.locations?.map(space => space.space_campus_id)),
    //         ];

    //         const availableCampusList = campusList?.filter(c => campusIdList.includes(c.campus_id));
    //         availableCampusList.unshift({
    //             campus_id: CAMPUS_ID_UNSELECTED,
    //             campus_number: 'none',
    //             campus_name: 'Show all campuses',
    //             libraries: [],
    //         });

    //         resetAvailableFilters('campus', availableCampusList);
    //     }
    // }, [campusListError, campusListLoading, campusList, bookableSpacesRoomList?.data?.locations]);

    React.useEffect(() => {
        addBreadcrumbsToSiteHeader([
            '<li class="uq-breadcrumb__item"><span class="uq-breadcrumb__link">Manage Space Types</span></li>',
        ]);
        if (
            bookableSpacesRoomListError === null &&
            bookableSpacesRoomListLoading === null &&
            bookableSpacesRoomList === null
        ) {
            actions.loadAllBookableSpacesRooms();
        }
        if (weeklyHoursError === null && weeklyHoursLoading === null && weeklyHours === null) {
            actions.loadWeeklyHours();
        }
        if (facilityTypeListError === null && facilityTypeListLoading === null && facilityTypeList === null) {
            actions.loadAllFacilityTypes();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const showSpaceByPagination = (index, pageNumLocal, rowsPerPageLocal) => {
        return index >= pageNumLocal * rowsPerPage && index < (pageNumLocal + 1) * rowsPerPageLocal;
    };
    React.useEffect(() => {
        if (
            bookableSpacesRoomListError === false &&
            bookableSpacesRoomListLoading === false &&
            !!bookableSpacesRoomList
        ) {
            // because we don't want campusList available before bookableSpacesRoomList (race condition)
            if (campusListError === null && campusListLoading === null && campusList === null) {
                actions.loadBookableSpaceCampusChildren();
            }
            // initialise the shown rows to the first N according to the paginator widget
            const usableRows = [];
            bookableSpacesRoomList?.data?.locations?.map((space, index) => {
                usableRows.push({
                    spaceId: space.space_id,
                    showSpace: showSpaceByPagination(index, pageNum, rowsPerPage),
                });
            });
            setDisplayedRows(usableRows);
        }
    }, [
        bookableSpacesRoomListError,
        bookableSpacesRoomListLoading,
        bookableSpacesRoomList,
        campusListError,
        campusListLoading,
        campusList,
    ]);
    const getEffectiveSpaceType = row => {
        const key = String(row.spaceTypeId);
        const editValues = spaceTypeEdits[key] || {};
        return {
            ...row,
            ...editValues,
        };
    };

    const startInlineEdit = row => {
        const effectiveRow = getEffectiveSpaceType(row);
        setEditingSpaceTypeId(String(row.spaceTypeId));
        setEditingDraft({
            spaceTypeName: effectiveRow.spaceTypeName || '',
            spaceTypeDescription: effectiveRow.spaceTypeDescription || '',
        });
    };

    const cancelInlineEdit = () => {
        setEditingSpaceTypeId(null);
        setEditingDraft({
            spaceTypeName: '',
            spaceTypeDescription: '',
        });
    };

    const saveInlineEdit = () => {
        if (!editingSpaceTypeId) {
            return;
        }

        const spaceTypeName = editingDraft.spaceTypeName?.trim() || 'Unspecified';
        const spaceTypeDescription = editingDraft.spaceTypeDescription?.trim() || '-';

        setSpaceTypeEdits(prev => ({
            ...prev,
            [editingSpaceTypeId]: {
                spaceTypeName,
                spaceTypeDescription,
            },
        }));
        actions.updateBookableSpaceType(
            {
                space_type_name: spaceTypeName,
                space_type_description: spaceTypeDescription,
            },
            editingSpaceTypeId,
        );

        setEditingSpaceTypeId(null);
    };

    const openDeleteConfirmation = row => {
        setDeleteCandidate(row);
    };

    const closeDeleteConfirmation = () => {
        setDeleteCandidate(null);
    };

    const confirmDeleteSpaceType = () => {
        if (!deleteCandidate) {
            return;
        }

        console.log('Delete space type confirmed', {
            spaceTypeId: deleteCandidate.spaceTypeId,
        });
        setDeleteCandidate(null);
    };

    const openAddSpaceTypeDialog = () => {
        setIsAddSpaceTypeDialogOpen(true);
    };

    const closeAddSpaceTypeDialog = () => {
        setIsAddSpaceTypeDialogOpen(false);
        setAddSpaceTypeDraft({
            spaceTypeName: '',
            spaceTypeDescription: '',
        });
    };

    const submitAddSpaceType = () => {
        const spaceTypeName = addSpaceTypeDraft.spaceTypeName?.trim();
        const spaceTypeDescription = addSpaceTypeDraft.spaceTypeDescription?.trim() || '';
        if (!spaceTypeName) {
            return;
        }

        const request = {
            space_type_name: spaceTypeName,
            space_type_description: spaceTypeDescription,
        };

        actions.createBookableSpaceType(request);

        closeAddSpaceTypeDialog();
    };

    function displayListOfBookableSpaceTypes() {
        const knownSpaceTypes = bookableSpacesRoomList?.data?.known_space_types || [];

        const spaceTypeRows = knownSpaceTypes
            .map(spaceType => ({
                spaceTypeId: spaceType?.space_type_id,
                spaceTypeName: spaceType?.space_type_name || 'Unspecified',
                spaceTypeDescription: spaceType?.space_type_description || '-',
                spacesCount: spaceType?.spaces_count || 0,
            }))
            .filter(row => row.spaceTypeId !== undefined && row.spaceTypeId !== null && row.spaceTypeId !== '')
            .sort((a, b) => {
                return Number(a.spaceTypeId) - Number(b.spaceTypeId);
            });

        return (
            <StyledStandardCard fullHeight data-testid="space-types-card">
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                    <Button variant="contained" onClick={openAddSpaceTypeDialog} data-testid="space-types-add-button">
                        Add new space type
                    </Button>
                </div>
                <StyledTableContainer className="tableContainer" data-testid="space-types-table-container">
                    <Table
                        size="small"
                        aria-label="Bookable space types table"
                        sx={{ width: '100%', tableLayout: 'fixed' }}
                        data-testid="space-types-table"
                    >
                        <StyledTableHead data-testid="space-types-table-head">
                            <StyledHeaderTableRow data-testid="space-types-table-header-row">
                                <StyledHeadingFacilityTableCell
                                    sx={{ width: '5rem' }}
                                    data-testid="space-types-header-id"
                                >
                                    ID
                                </StyledHeadingFacilityTableCell>
                                <StyledHeadingFacilityTableCell
                                    sx={{ textAlign: 'left' }}
                                    data-testid="space-types-header-name"
                                >
                                    Space Type
                                </StyledHeadingFacilityTableCell>
                                <StyledHeadingFacilityTableCell data-testid="space-types-header-description">
                                    Description
                                </StyledHeadingFacilityTableCell>
                                <StyledHeadingFacilityTableCell
                                    sx={{ width: '8rem' }}
                                    data-testid="space-types-header-count"
                                >
                                    Allocated Spaces
                                </StyledHeadingFacilityTableCell>
                                <StyledHeadingFacilityTableCell
                                    sx={{ width: '9rem' }}
                                    data-testid="space-types-header-actions"
                                >
                                    Actions
                                </StyledHeadingFacilityTableCell>
                            </StyledHeaderTableRow>
                        </StyledTableHead>
                        <TableBody data-testid="space-types-table-body">
                            {spaceTypeRows.length === 0 && (
                                <StyledTableRow data-testid="space-types-empty-row">
                                    <TableCell colSpan={5} data-testid="space-types-empty-cell">
                                        <Typography variant="body2" data-testid="space-types-empty-message">
                                            No space types found.
                                        </Typography>
                                    </TableCell>
                                </StyledTableRow>
                            )}
                            {spaceTypeRows.map(row => {
                                const effectiveRow = getEffectiveSpaceType(row);
                                const isEditing = editingSpaceTypeId === String(row.spaceTypeId);
                                const hasAllocatedSpaces = Number(effectiveRow.spacesCount) > 0;
                                const rowTestIdPrefix = `space-type-row-${effectiveRow.spaceTypeId}`;

                                return (
                                    <StyledTableRow key={`space-type-${row.spaceTypeId}`} data-testid={rowTestIdPrefix}>
                                        <TableCell
                                            align="center"
                                            sx={{ whiteSpace: 'nowrap' }}
                                            data-testid={`${rowTestIdPrefix}-id`}
                                        >
                                            {effectiveRow.spaceTypeId}
                                        </TableCell>
                                        <TableCell data-testid={`${rowTestIdPrefix}-name`}>
                                            {isEditing ? (
                                                <TextField
                                                    size="small"
                                                    fullWidth
                                                    variant="standard"
                                                    data-testid={`${rowTestIdPrefix}-name-input`}
                                                    value={editingDraft.spaceTypeName}
                                                    sx={{
                                                        '& .MuiInputBase-input': {
                                                            fontSize: '0.875rem',
                                                            lineHeight: 1.43,
                                                        },
                                                    }}
                                                    onChange={e =>
                                                        setEditingDraft(prev => ({
                                                            ...prev,
                                                            spaceTypeName: e.target.value,
                                                        }))
                                                    }
                                                />
                                            ) : (
                                                effectiveRow.spaceTypeName
                                            )}
                                        </TableCell>
                                        <TableCell
                                            sx={{ whiteSpace: 'normal', overflowWrap: 'anywhere' }}
                                            data-testid={`${rowTestIdPrefix}-description`}
                                        >
                                            {isEditing ? (
                                                <TextField
                                                    size="small"
                                                    fullWidth
                                                    variant="standard"
                                                    multiline
                                                    minRows={1}
                                                    data-testid={`${rowTestIdPrefix}-description-input`}
                                                    value={editingDraft.spaceTypeDescription}
                                                    sx={{
                                                        '& .MuiInputBase-inputMultiline': {
                                                            fontSize: '0.875rem',
                                                            lineHeight: 1.43,
                                                            overflow: 'hidden',
                                                        },
                                                    }}
                                                    onChange={e =>
                                                        setEditingDraft(prev => ({
                                                            ...prev,
                                                            spaceTypeDescription: e.target.value,
                                                        }))
                                                    }
                                                />
                                            ) : (
                                                <Typography variant="body2">
                                                    {effectiveRow.spaceTypeDescription}
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            sx={{ whiteSpace: 'nowrap' }}
                                            data-testid={`${rowTestIdPrefix}-count`}
                                        >
                                            {effectiveRow.spacesCount}
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            sx={{ whiteSpace: 'nowrap' }}
                                            data-testid={`${rowTestIdPrefix}-actions`}
                                        >
                                            {isEditing ? (
                                                <>
                                                    <IconButton
                                                        aria-label={`Save space type ${effectiveRow.spaceTypeName}`}
                                                        size="small"
                                                        onClick={saveInlineEdit}
                                                        data-testid={`${rowTestIdPrefix}-save-button`}
                                                    >
                                                        <DoneIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton
                                                        aria-label={`Cancel editing ${effectiveRow.spaceTypeName}`}
                                                        size="small"
                                                        onClick={cancelInlineEdit}
                                                        data-testid={`${rowTestIdPrefix}-cancel-button`}
                                                    >
                                                        <CloseIcon fontSize="small" />
                                                    </IconButton>
                                                </>
                                            ) : (
                                                <>
                                                    <IconButton
                                                        aria-label={`Edit space type ${effectiveRow.spaceTypeName}`}
                                                        size="small"
                                                        onClick={() => startInlineEdit(row)}
                                                        data-testid={`${rowTestIdPrefix}-edit-button`}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton
                                                        aria-label={`Delete space type ${effectiveRow.spaceTypeName}`}
                                                        size="small"
                                                        disabled={hasAllocatedSpaces}
                                                        onClick={() => openDeleteConfirmation(effectiveRow)}
                                                        data-testid={`${rowTestIdPrefix}-delete-button`}
                                                    >
                                                        <DeleteOutlineIcon fontSize="small" />
                                                    </IconButton>
                                                </>
                                            )}
                                        </TableCell>
                                    </StyledTableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </StyledTableContainer>
                <Dialog
                    open={!!deleteCandidate}
                    onClose={closeDeleteConfirmation}
                    data-testid="space-types-delete-dialog"
                >
                    <DialogContent>
                        <DialogContentText data-testid="space-types-delete-dialog-message">
                            Are you sure you wish to delete this space type?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions data-testid="space-types-delete-dialog-actions">
                        <Button onClick={closeDeleteConfirmation} data-testid="space-types-delete-cancel-button">
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmDeleteSpaceType}
                            color="error"
                            variant="contained"
                            data-testid="space-types-delete-confirm-button"
                        >
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={isAddSpaceTypeDialogOpen}
                    onClose={closeAddSpaceTypeDialog}
                    data-testid="space-types-add-dialog"
                >
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Space type name"
                            fullWidth
                            variant="standard"
                            value={addSpaceTypeDraft.spaceTypeName}
                            onChange={e =>
                                setAddSpaceTypeDraft(prev => ({
                                    ...prev,
                                    spaceTypeName: e.target.value,
                                }))
                            }
                            data-testid="space-types-add-name-input"
                        />
                        <TextField
                            margin="dense"
                            label="Space type description"
                            fullWidth
                            variant="standard"
                            multiline
                            minRows={2}
                            value={addSpaceTypeDraft.spaceTypeDescription}
                            onChange={e =>
                                setAddSpaceTypeDraft(prev => ({
                                    ...prev,
                                    spaceTypeDescription: e.target.value,
                                }))
                            }
                            data-testid="space-types-add-description-input"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeAddSpaceTypeDialog} data-testid="space-types-add-cancel-button">
                            Cancel
                        </Button>
                        <Button
                            onClick={submitAddSpaceType}
                            variant="contained"
                            disabled={!addSpaceTypeDraft.spaceTypeName?.trim()}
                            data-testid="space-types-add-ok-button"
                        >
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
            </StyledStandardCard>
        );
    }

    return (
        <SpacesAdminPage systemTitle="Space Types" pageTitle="Manage Space Types" currentPageSlug="spacetypes">
            <Grid container spacing={3} className="aaaaaaaaa">
                {(() => {
                    if (!!bookableSpacesRoomListLoading || !!weeklyHoursLoading || !!facilityTypeListLoading) {
                        return (
                            <StyledBookableSpaceGridItem item xs={12} md={9} data-testid="space-types-loading">
                                <InlineLoader message="Loading" />
                            </StyledBookableSpaceGridItem>
                        );
                    } else if (!!bookableSpacesRoomListError || !!facilityTypeListError) {
                        return (
                            <StyledBookableSpaceGridItem item xs={12} md={9} data-testid="space-types-error">
                                <StyledStandardCard fullHeight>
                                    <p>Something went wrong - please try again later.</p>
                                </StyledStandardCard>
                            </StyledBookableSpaceGridItem>
                        );
                    } else if (
                        !bookableSpacesRoomList?.data?.locations ||
                        bookableSpacesRoomList?.data?.locations.length === 0
                    ) {
                        return (
                            <StyledBookableSpaceGridItem item xs={12} md={9} data-testid="space-types-no-spaces">
                                <StyledStandardCard fullHeight>
                                    <p>No spaces currently in system - please try again soon.</p>
                                </StyledStandardCard>
                            </StyledBookableSpaceGridItem>
                        );
                    } else {
                        return (
                            <StyledBookableSpaceGridItem item xs={12} style={{ marginTop: 0, paddingTop: 0 }}>
                                {displayListOfBookableSpaceTypes()}
                            </StyledBookableSpaceGridItem>
                        );
                    }
                })()}
            </Grid>
        </SpacesAdminPage>
    );
};

BookableSpacesManageSpaceTypes.propTypes = {
    actions: PropTypes.any,
    bookableSpacesRoomList: PropTypes.any,
    bookableSpacesRoomListLoading: PropTypes.bool,
    bookableSpacesRoomListError: PropTypes.any,
    weeklyHours: PropTypes.any,
    weeklyHoursLoading: PropTypes.bool,
    weeklyHoursError: PropTypes.any,
    facilityTypeList: PropTypes.any,
    facilityTypeListLoading: PropTypes.any,
    facilityTypeListError: PropTypes.any,
    campusList: PropTypes.any,
    campusListLoading: PropTypes.any,
    campusListError: PropTypes.any,
};

export default React.memo(BookableSpacesManageSpaceTypes);
