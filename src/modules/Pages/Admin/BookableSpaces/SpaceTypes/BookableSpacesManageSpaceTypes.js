import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useCookies } from 'react-cookie';
import { useAccountContext } from 'context';

import FormControl from '@mui/material/FormControl';
import { Grid } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';

import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import DoneIcon from '@mui/icons-material/Done';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';

import { addClass, removeClass, slugifyName, standardText } from 'helpers/general';

import { getFriendlyLocationDescription } from 'modules/Pages/BookableSpaces/spacesHelpers';
import {
    addBreadcrumbsToSiteHeader,
    spacesAdminLink,
} from 'modules/Pages/Admin/BookableSpaces/bookableSpacesAdminHelpers';
import SpacesAdminPage from 'modules/Pages/Admin/BookableSpaces/SpacesAdminPage';

const backgroundColorColumn = '#f0f0f0';
const borderColour = '1px solid rgb(224 224 224 / 1)';

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
const StyledTablePagination = styled(TablePagination)(() => ({
    overflow: 'hidden',
    '& .MuiTablePagination-toolbar': {
        display: 'flex !important',
        alignItems: 'center !important',
        justifyContent: 'center !important',
        gap: 0,
        flexWrap: 'wrap',
        paddingInline: 0,
    },
    '& .MuiTablePagination-spacer': {
        display: 'none',
    },
    '& .MuiTablePagination-selectLabel, .MuiTablePagination-input, .MuiTablePagination-displayedRows, .MuiTablePagination-actions ': {
        flexShrink: 0,
    },
    '& .MuiTablePagination-input': {
        marginLeft: 0,
        '& select': {
            paddingLeft: 0,
        },
    },
    '& .MuiTablePagination-actions': {
        marginLeft: '0 !important',
    },
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
const StyledStickyTableCell = styled(TableCell)(() => ({
    position: 'sticky',
    backgroundColor: backgroundColorColumn,
    left: 0,
    '< div:first-of-type': {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginInline: '-1px',
    },
    '& .spaceDescription': {
        display: 'flex',
        justifyContent: 'space-between',
    },
}));
const TableWrapper = styled('div')(() => ({
    '&.expanded': {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '95vw',
        height: '92vh',
        zIndex: 100,
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginInline: '20px',
        border: 'thick solid black',
        marginTop: '4px',
        borderRadius: '10px',
        '& .tableContainer': {
            height: '90%',
        },
    },
}));
const StyledFilterWrapperDiv = styled('div')(() => ({
    display: 'flex',
    columnGap: '1rem',
    marginBottom: '1rem',
}));
const StyledExpandCollapseTableIconButton = styled(IconButton)(({ theme }) => ({
    transform: 'scale(-1, 1)',
    transformOrigin: 'center',
    backgroundColor: theme.palette.primary.main,
    border: `1px solid ${theme.palette.primary.main}`,
    color: 'white',
    '&:hover, &:focus': {
        backgroundColor: 'white',
        color: theme.palette.primary.main,
    },
    marginRight: '1rem',
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

    const { account } = useAccountContext();

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

    // the filters we will show on the page
    const [availableFilters, setAvailableFilters2] = useState([
        { filterType: 'campus', filterValue: CAMPUS_ID_UNSELECTED },
    ]);
    const setAvailableFilters = availableFilters => {
        console.log('setAvailableFilters', availableFilters);
        setAvailableFilters2(availableFilters);
    };
    const resetAvailableFilters = (filterTypeName, filterTypeValue) => {
        const newFilterTypes =
            availableFilters?.filter(g => {
                return g.filterType !== filterTypeName;
            }) || [];
        newFilterTypes.push({
            filterType: filterTypeName,
            filterValue: filterTypeValue,
        });
        setAvailableFilters(newFilterTypes);
    };

    React.useEffect(() => {
        if (campusListError === false && campusListLoading === false && !!campusList) {
            const campusIdList = [
                ...new Set(bookableSpacesRoomList?.data?.locations?.map(space => space.space_campus_id)),
            ];

            const availableCampusList = campusList?.filter(c => campusIdList.includes(c.campus_id));
            availableCampusList.unshift({
                campus_id: CAMPUS_ID_UNSELECTED,
                campus_number: 'none',
                campus_name: 'Show all campuses',
                libraries: [],
            });

            resetAvailableFilters('campus', availableCampusList);
        }
    }, [campusListError, campusListLoading, campusList, bookableSpacesRoomList?.data?.locations]);

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

    const [selectedFilters, setSelectedFilters2] = useState([
        { filterType: 'campus', filterValue: CAMPUS_ID_UNSELECTED },
        { filterType: 'library', filterValue: LIBRARY_ID_UNSELECTED },
        { filterType: 'floor', filterValue: FLOOR_ID_UNSELECTED },
    ]);
    const setSelectedFilters = newFilter => {
        console.log('setSelectedFilters', newFilter);
        setSelectedFilters2(newFilter);
    };

    const doesSpaceShow = (space, currentLocationFilters) => {
        let showSpaceByFilter = true;
        currentLocationFilters.forEach(f => {
            if (f.filterType === 'campus') {
                if (f.filterValue !== CAMPUS_ID_UNSELECTED && space.space_campus_id !== f.filterValue) {
                    showSpaceByFilter = false;
                }
            } else if (f.filterType === 'library') {
                if (f.filterValue !== LIBRARY_ID_UNSELECTED && space.space_library_id !== f.filterValue) {
                    showSpaceByFilter = false;
                }
            } else if (f.filterType === 'floor') {
                if (f.filterValue !== FLOOR_ID_UNSELECTED && space.space_floor_id !== f.filterValue) {
                    showSpaceByFilter = false;
                }
            }
        });
        return showSpaceByFilter;
    };

    const resetDisplayedRows = latestUpdate => {
        console.log('resetDisplayedRows latestUpdate=', latestUpdate);
        // if we have just set data to UseState, they aren't available yet - weird! :(
        const usedFilters = latestUpdate?.location ? latestUpdate.location : selectedFilters;
        let suppliedPageNum = 'pagination' in latestUpdate ? latestUpdate.pagination : pageNum;
        let suppliedRowsPerPage = rowsPerPage;
        if (latestUpdate?.rowsPerPage) {
            suppliedRowsPerPage = latestUpdate.rowsPerPage;
            suppliedPageNum = 0;
        }

        let numRow = 0;
        let displayedRowsLocal = [...displayedRows];
        bookableSpacesRoomList?.data?.locations?.forEach(space => {
            const showSpaceByFilter = doesSpaceShow(space, usedFilters);

            displayedRowsLocal = displayedRowsLocal.filter(r => {
                return r.spaceId !== space.space_id;
            });
            const spaceRow = document.getElementById(`space-${space.space_id}`);
            if (!!showSpaceByFilter && showSpaceByPagination(numRow, suppliedPageNum, suppliedRowsPerPage)) {
                removeClass(spaceRow, 'hiddenRow');
                displayedRowsLocal.push({
                    spaceId: space.space_id,
                    showSpace: true,
                });
            } else {
                addClass(spaceRow, 'hiddenRow');
                displayedRowsLocal.push({
                    spaceId: space.space_id,
                    showSpace: false,
                });
            }
            if (!!showSpaceByFilter) {
                numRow++;
            }
        });

        setDisplayedRows(displayedRowsLocal);
    };
    const resetSelectedFilters = (filterTypeName, filterTypeValue) => {
        console.log('resetSelectedFilters', filterTypeName, filterTypeValue);
        let newFilterTypes = selectedFilters?.filter(g => {
            return g.filterType !== filterTypeName;
        });
        newFilterTypes.push({
            filterType: filterTypeName,
            filterValue: filterTypeValue,
        });
        if (filterTypeName === 'campus') {
            newFilterTypes = newFilterTypes?.filter(g => {
                return g.filterType !== 'library';
            });
            newFilterTypes.push({
                filterType: 'library',
                filterValue: LIBRARY_ID_UNSELECTED,
            });
        }
        if (filterTypeName === 'campus' || filterTypeName === 'library') {
            newFilterTypes = newFilterTypes?.filter(g => {
                return g.filterType !== 'floor';
            });
            newFilterTypes.push({
                filterType: 'floor',
                filterValue: FLOOR_ID_UNSELECTED,
            });
        }
        setSelectedFilters(newFilterTypes);
        console.log('resetSelectedFilters newFilterTypes=', newFilterTypes);

        // show-hide Spaces according to selected filters

        resetDisplayedRows({ location: newFilterTypes });
    };
    const isCampusSelected =
        selectedFilters?.find(f => f.filterType === 'campus')?.filterValue !== CAMPUS_ID_UNSELECTED;
    const isLibrarySelected =
        !!isCampusSelected &&
        selectedFilters?.find(f => f.filterType === 'library')?.filterValue !== LIBRARY_ID_UNSELECTED;

    function hasFacility(facilityType, bookableSpace) {
        return bookableSpace?.facility_types?.some(spaceFacility => {
            return spaceFacility.facility_type_id === facilityType.facility_type_id;
        });
    }

    const getColumnBackgroundColor = ii => (ii % 2 === 0 ? backgroundColorColumn : '#fff');

    const handleChangePage = (event, newPageNum) => {
        console.log('handleChangePage', newPageNum, event);
        setPageNum(newPageNum);
        resetDisplayedRows({ pagination: newPageNum });
    };
    const handleChangeRowsPerPage = event => {
        const newRowsPerPage = parseInt(event.target.value, 10);

        const current = new Date();
        const nextYear = new Date();
        nextYear.setFullYear(current.getFullYear() + 1);
        setCookie(paginatorCookieName, newRowsPerPage, { expires: nextYear });

        setRowsPerPage(newRowsPerPage);
        setPageNum(0);
        resetDisplayedRows({ rowsPerPage: newRowsPerPage });
    };

    const expandButtonElementId = spaceId => `expand-button-space-${spaceId}`;
    const collapseButtonElementId = spaceId => `collapse-button-space-${spaceId}`;
    // const spaceExtraElementsId = spaceId => `space-more-${spaceId}`;
    const spaceDescriptionElementsId = spaceId => `space-description-${spaceId}`;
    const expandSpace = spaceId => {
        const spaceDescription = document.getElementById(spaceDescriptionElementsId(spaceId));
        !!spaceDescription && (spaceDescription.style.display = 'block');

        const expandButton = document.getElementById(expandButtonElementId(spaceId));
        !!expandButton && (expandButton.style.display = 'none');
        const collapseButton = document.getElementById(collapseButtonElementId(spaceId));
        !!collapseButton && (collapseButton.style.display = 'inline-flex');
    };
    const collapseSpace = spaceId => {
        const spaceDescription = document.getElementById(spaceDescriptionElementsId(spaceId));
        !!spaceDescription && (spaceDescription.style.display = 'none');

        const expandButton = document.getElementById(expandButtonElementId(spaceId));
        !!expandButton && (expandButton.style.display = 'inline-flex');
        const collapseButton = document.getElementById(collapseButtonElementId(spaceId));
        !!collapseButton && (collapseButton.style.display = 'none');
    };

    function prefilterFacilityData(data) {
        // first ensure sorted in sort order
        const sortedGroups = [...data?.facility_type_groups]?.sort(
            (a, b) => a.facility_type_group_order - b.facility_type_group_order,
        );

        // then add an overall sort order, to help us to tiger stripe the columns
        let overallCounter = 1;
        return sortedGroups?.map(group => {
            // sort the facility types alphabetically (they should already be, but...)
            const sortedChildren = [...group.facility_type_children]?.sort((a, b) =>
                a.facility_type_name.localeCompare(b.facility_type_name),
            );

            const childrenWithCounter = sortedChildren?.map(child => ({
                ...child,
                overall_order: overallCounter++,
            }));

            return {
                ...group,
                facility_type_children: childrenWithCounter,
            };
        });
    }

    const expandTable = e => {
        const thisButton = document.getElementById('table-pushout-button');
        !!thisButton && (thisButton.style.display = 'none');

        const otherButton = document.getElementById('table-pushin-button');
        !!otherButton && (otherButton.style.display = 'inline-flex');

        const tableEtc = document.getElementById('wrappedTableList');
        addClass(tableEtc, 'expanded');
    };

    const collapseTable = e => {
        const thisButton = document.getElementById('table-pushin-button');
        !!thisButton && (thisButton.style.display = 'none');

        const otherButton = document.getElementById('table-pushout-button');
        !!otherButton && (otherButton.style.display = 'inline-flex');

        const tableEtc = document.getElementById('wrappedTableList');
        removeClass(tableEtc, 'expanded');
    };

    const openEditSpacePage = e => {
        const buttonClicked = e.target.closest('button');
        const spaceuuid = !!buttonClicked && buttonClicked.getAttribute('data-spaceuuid');
        !!spaceuuid && (window.location.href = spacesAdminLink(`/admin/spaces/edit/${spaceuuid}`, account));
        /* istanbul ignore next */
        !spaceuuid && console.log('no valid button clicked');
    };

    const selectFilter = prop => e => {
        console.log('selectFilter', prop, e);
        resetSelectedFilters(prop, e.target.value);
    };

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

        console.log('Inline space type saved (UI only)', {
            spaceTypeId: editingSpaceTypeId,
            spaceTypeName,
            spaceTypeDescription,
        });
        setEditingSpaceTypeId(null);
    };

    function displayListOfBookableSpaceTypes() {
        const groupedSpaceTypes =
            bookableSpacesRoomList?.data?.locations?.reduce((acc, space) => {
                const details = space?.space_type_details || {};
                const fallbackId = space?.space_type_id;
                const spaceTypeId = details?.space_type_id ?? fallbackId;

                // Ignore rows where a usable type id is not present.
                if (spaceTypeId === undefined || spaceTypeId === null || spaceTypeId === '') {
                    return acc;
                }

                const key = String(spaceTypeId);
                if (!acc[key]) {
                    acc[key] = {
                        spaceTypeId,
                        spaceTypeName: details?.space_type_name || 'Unspecified',
                        spaceTypeDescription: details?.space_type_description || '-',
                        spacesCount: 0,
                    };
                }

                acc[key].spacesCount += 1;
                return acc;
            }, {}) || {};

        const spaceTypeRows = Object.values(groupedSpaceTypes).sort((a, b) => {
            return Number(a.spaceTypeId) - Number(b.spaceTypeId);
        });

        return (
            <StyledStandardCard fullHeight>
                <StyledTableContainer className="tableContainer">
                    <Table
                        size="small"
                        aria-label="Bookable space types table"
                        sx={{ width: '100%', tableLayout: 'fixed' }}
                    >
                        <StyledTableHead>
                            <StyledHeaderTableRow>
                                <StyledHeadingFacilityTableCell sx={{ width: '5rem' }}>
                                    ID
                                </StyledHeadingFacilityTableCell>
                                <StyledHeadingFacilityTableCell sx={{ textAlign: 'left' }}>
                                    Space Type
                                </StyledHeadingFacilityTableCell>
                                <StyledHeadingFacilityTableCell>Description</StyledHeadingFacilityTableCell>
                                <StyledHeadingFacilityTableCell sx={{ width: '8rem' }}>
                                    Allocated Spaces
                                </StyledHeadingFacilityTableCell>
                                <StyledHeadingFacilityTableCell sx={{ width: '9rem' }}>
                                    Actions
                                </StyledHeadingFacilityTableCell>
                            </StyledHeaderTableRow>
                        </StyledTableHead>
                        <TableBody>
                            {spaceTypeRows.length === 0 && (
                                <StyledTableRow>
                                    <TableCell colSpan={5}>
                                        <Typography variant="body2">No space types found.</Typography>
                                    </TableCell>
                                </StyledTableRow>
                            )}
                            {spaceTypeRows.map(row => {
                                const effectiveRow = getEffectiveSpaceType(row);
                                const isEditing = editingSpaceTypeId === String(row.spaceTypeId);

                                return (
                                    <StyledTableRow key={`space-type-${row.spaceTypeId}`}>
                                        <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                                            {effectiveRow.spaceTypeId}
                                        </TableCell>
                                        <TableCell>
                                            {isEditing ? (
                                                <TextField
                                                    size="small"
                                                    fullWidth
                                                    variant="standard"
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
                                        <TableCell sx={{ whiteSpace: 'normal', overflowWrap: 'anywhere' }}>
                                            {isEditing ? (
                                                <TextField
                                                    size="small"
                                                    fullWidth
                                                    variant="standard"
                                                    multiline
                                                    minRows={1}
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
                                        <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                                            {effectiveRow.spacesCount}
                                        </TableCell>
                                        <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                                            {isEditing ? (
                                                <>
                                                    <IconButton
                                                        aria-label={`Save space type ${effectiveRow.spaceTypeName}`}
                                                        size="small"
                                                        onClick={saveInlineEdit}
                                                    >
                                                        <DoneIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton
                                                        aria-label={`Cancel editing ${effectiveRow.spaceTypeName}`}
                                                        size="small"
                                                        onClick={cancelInlineEdit}
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
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton
                                                        aria-label={`Delete space type ${effectiveRow.spaceTypeName}`}
                                                        size="small"
                                                        onClick={() =>
                                                            console.log('Delete space type clicked', {
                                                                spaceTypeId: effectiveRow.spaceTypeId,
                                                            })
                                                        }
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
            </StyledStandardCard>
        );
    }

    return (
        <SpacesAdminPage systemTitle="Space Types" pageTitle="Manage Space Types" currentPageSlug="spacetypes">
            <Grid container spacing={3} className="aaaaaaaaa">
                {(() => {
                    if (!!bookableSpacesRoomListLoading || !!weeklyHoursLoading || !!facilityTypeListLoading) {
                        return (
                            <StyledBookableSpaceGridItem item xs={12} md={9}>
                                <InlineLoader message="Loading" />
                            </StyledBookableSpaceGridItem>
                        );
                    } else if (!!bookableSpacesRoomListError || !!facilityTypeListError) {
                        return (
                            <StyledBookableSpaceGridItem item xs={12} md={9}>
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
                            <StyledBookableSpaceGridItem item xs={12} md={9}>
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
