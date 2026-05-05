import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useCookies } from 'react-cookie';
import { useAccountContext } from 'context';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Grid } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import Menu from '@mui/material/Menu';
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
import Typography from '@mui/material/Typography';

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import EditIcon from '@mui/icons-material/Edit';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';

import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import DoneIcon from '@mui/icons-material/Done';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import SouthIcon from '@mui/icons-material/South';
import NorthIcon from '@mui/icons-material/North';

import { addClass, removeClass, slugifyName, standardText } from 'helpers/general';

import { getFriendlyLocationDescription, isBookable } from 'modules/Pages/BookableSpaces/spacesHelpers';
import { getSpaceOutageStatus } from 'modules/Pages/Admin/BookableSpaces/Spaces/Form/spaceOutageHelpers';
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
    whiteSpace: 'nowrap',
}));
const StyledTableHead = styled(TableHead)(() => ({
    '& th:first-of-type': {
        position: 'sticky',
        left: 0,
    },
}));

const StyledHeadingFacilityTableCell = styled(TableCell)(() => ({
    whiteSpace: 'break-spaces',
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
        backgroundColor: 'rgb(189 186 186)',
        '& th, & td': {
            backgroundColor: 'rgb(189 186 186)',
        },
    },
    '&.hiddenRow': {
        display: 'none',
    },
    '& button': {
        paddingBlock: 0,
        '&:hover, &:focus': {
            backgroundColor: 'inherit',
            color: '#fff',
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
const StyledTableWrapperDiv = styled('div')(() => ({
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

const GreenTick = ({ title, dataTestId }) => {
    return <DoneIcon titleAccess={title} style={{ stroke: 'green' }} data-testid={dataTestId} />;
};
GreenTick.propTypes = {
    title: PropTypes.string,
    dataTestId: PropTypes.string,
};

const CAMPUS_ID_UNSELECTED = '';
const LIBRARY_ID_UNSELECTED = '';
const FLOOR_ID_UNSELECTED = '';
const SPACE_TYPE_ID_UNSELECTED = '';
const SPACE_SORT_NAME = 'name';
const SPACE_SORT_CREATED = 'created';
const SPACE_SORT_UPDATED = 'updated';
const SPACE_SORT_DIRECTION_ASC = 'asc';
const SPACE_SORT_DIRECTION_DESC = 'desc';

export const BookableSpacesManageSpaces = ({
    actions,
    bookableSpacesRoomList,
    bookableSpacesRoomListIncludesDrafts,
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
    const [sortType, setSortType] = useState(SPACE_SORT_NAME);
    const [sortDirection, setSortDirection] = useState(SPACE_SORT_DIRECTION_ASC);
    const [sortMenuAnchor, setSortMenuAnchor] = useState(null);

    const sortTypeLabelMap = {
        [SPACE_SORT_NAME]: 'Sort by name',
        [SPACE_SORT_CREATED]: 'Sort by creation date',
        [SPACE_SORT_UPDATED]: 'Sort by last changed',
    };

    const getDateEpoch = dateString => {
        if (!dateString) {
            return 0;
        }
        const timestamp = Date.parse(dateString);
        return Number.isNaN(timestamp) ? 0 : timestamp;
    };

    const getSortedSpaces = (spaces, sortingType = sortType, sortingDirection = sortDirection) => {
        const sourceSpaces = [...(spaces || [])];
        const compareByName = (a, b) => (a?.space_name || '').localeCompare(b?.space_name || '');
        const directionMultiplier = sortingDirection === SPACE_SORT_DIRECTION_DESC ? -1 : 1;

        if (sortingType === SPACE_SORT_CREATED) {
            return sourceSpaces.sort((a, b) => {
                const dateDiff = getDateEpoch(a?.created_at) - getDateEpoch(b?.created_at);
                if (dateDiff !== 0) {
                    return dateDiff * directionMultiplier;
                }
                return compareByName(a, b);
            });
        }
        if (sortingType === SPACE_SORT_UPDATED) {
            return sourceSpaces.sort((a, b) => {
                const dateDiff = getDateEpoch(a?.updated_at) - getDateEpoch(b?.updated_at);
                if (dateDiff !== 0) {
                    return dateDiff * directionMultiplier;
                }
                return compareByName(a, b);
            });
        }
        return sourceSpaces.sort((a, b) => compareByName(a, b) * directionMultiplier);
    };

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
                return g?.filterType !== filterTypeName;
            }) || [];
        newFilterTypes?.push({
            filterType: filterTypeName,
            filterValue: filterTypeValue,
        });
        setAvailableFilters(newFilterTypes);
    };

    React.useEffect(() => {
        if (campusListError === false && campusListLoading === false && !!campusList) {
            const campusIdList = [
                ...new Set(bookableSpacesRoomList?.data?.locations?.map(space => space?.space_campus_id)),
            ];

            const availableCampusList = campusList?.filter(c => campusIdList?.includes(c?.campus_id));
            availableCampusList?.unshift({
                campus_id: CAMPUS_ID_UNSELECTED,
                campus_number: 'none',
                campus_name: 'Show all campuses',
                libraries: [],
            });

            resetAvailableFilters('campus', availableCampusList);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [campusListError, campusListLoading, campusList, bookableSpacesRoomList?.data?.locations]);

    React.useEffect(() => {
        addBreadcrumbsToSiteHeader([
            '<li class="uq-breadcrumb__item"><span class="uq-breadcrumb__link">Manage Spaces</span></li>',
        ]);
        if (
            (bookableSpacesRoomListError === null &&
                bookableSpacesRoomListLoading === null &&
                bookableSpacesRoomList === null) ||
            (bookableSpacesRoomListLoading === false &&
                bookableSpacesRoomListError === false &&
                !!bookableSpacesRoomList &&
                bookableSpacesRoomListIncludesDrafts !== true)
        ) {
            actions.loadAllBookableSpacesRooms({ includeDrafts: true });
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
        return index >= pageNumLocal * rowsPerPageLocal && index < (pageNumLocal + 1) * rowsPerPageLocal;
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
            getSortedSpaces(bookableSpacesRoomList?.data?.locations, sortType, sortDirection)?.map((space, index) => {
                usableRows?.push({
                    spaceId: space?.space_id,
                    showSpace: showSpaceByPagination(index, pageNum, rowsPerPage),
                });
            });
            setDisplayedRows(usableRows);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        bookableSpacesRoomListError,
        bookableSpacesRoomListLoading,
        bookableSpacesRoomList,
        campusListError,
        campusListLoading,
        campusList,
        sortType,
        sortDirection,
    ]);

    const [selectedFilters, setSelectedFilters2] = useState([
        { filterType: 'campus', filterValue: CAMPUS_ID_UNSELECTED },
        { filterType: 'library', filterValue: LIBRARY_ID_UNSELECTED },
        { filterType: 'floor', filterValue: FLOOR_ID_UNSELECTED },
        { filterType: 'spaceType', filterValue: SPACE_TYPE_ID_UNSELECTED },
        { filterType: 'draftOnly', filterValue: false },
    ]);
    const setSelectedFilters = newFilter => {
        console.log('setSelectedFilters', newFilter);
        setSelectedFilters2(newFilter);
    };

    const doesSpaceShow = (space, currentLocationFilters) => {
        let showSpaceByFilter = true;
        currentLocationFilters?.forEach(f => {
            if (f?.filterType === 'campus') {
                if (f?.filterValue !== CAMPUS_ID_UNSELECTED && space?.space_campus_id !== f?.filterValue) {
                    showSpaceByFilter = false;
                }
            } else if (f?.filterType === 'library') {
                if (f?.filterValue !== LIBRARY_ID_UNSELECTED && space?.space_library_id !== f?.filterValue) {
                    showSpaceByFilter = false;
                }
            } else if (f?.filterType === 'floor') {
                if (f?.filterValue !== FLOOR_ID_UNSELECTED && space?.space_floor_id !== f?.filterValue) {
                    showSpaceByFilter = false;
                }
            } else if (f?.filterType === 'spaceType') {
                if (f?.filterValue !== SPACE_TYPE_ID_UNSELECTED) {
                    const spaceTypeId = space?.space_type_id;
                    if (!!spaceTypeId) {
                        if (String(spaceTypeId) !== String(f?.filterValue)) {
                            showSpaceByFilter = false;
                        }
                    } else if (String(space?.space_type || '') !== String(f?.filterValue)) {
                        showSpaceByFilter = false;
                    }
                }
            } else if (f?.filterType === 'draftOnly' && f?.filterValue === true) {
                if (!space?.space_draftmode) {
                    showSpaceByFilter = false;
                }
            }
        });
        return showSpaceByFilter;
    };

    const resetDisplayedRows = latestUpdate => {
        console.log('resetDisplayedRows latestUpdate=', latestUpdate);
        // if we have just set data to UseState, they aren't available yet - weird! :(
        const usedFilters = latestUpdate?.location ? latestUpdate?.location : selectedFilters;
        const usedSortType = latestUpdate?.sortingType || sortType;
        const usedSortDirection = latestUpdate?.sortingDirection || sortDirection;
        let suppliedPageNum = 'pagination' in latestUpdate ? latestUpdate?.pagination : pageNum;
        let suppliedRowsPerPage = rowsPerPage;
        if (latestUpdate?.rowsPerPage) {
            suppliedRowsPerPage = latestUpdate?.rowsPerPage;
            suppliedPageNum = 0;
        }

        let numRow = 0;
        let displayedRowsLocal = [...displayedRows];
        getSortedSpaces(bookableSpacesRoomList?.data?.locations, usedSortType, usedSortDirection)?.forEach(space => {
            const showSpaceByFilter = doesSpaceShow(space, usedFilters);

            displayedRowsLocal = displayedRowsLocal?.filter(r => {
                return r?.spaceId !== space?.space_id;
            });
            const spaceRow = document.getElementById(`space-${space?.space_id}`);
            if (!!showSpaceByFilter && showSpaceByPagination(numRow, suppliedPageNum, suppliedRowsPerPage)) {
                removeClass(spaceRow, 'hiddenRow');
                displayedRowsLocal?.push({
                    spaceId: space?.space_id,
                    showSpace: true,
                });
            } else {
                addClass(spaceRow, 'hiddenRow');
                displayedRowsLocal?.push({
                    spaceId: space?.space_id,
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
            return g?.filterType !== filterTypeName;
        });
        newFilterTypes?.push({
            filterType: filterTypeName,
            filterValue: filterTypeValue,
        });
        if (filterTypeName === 'campus') {
            newFilterTypes = newFilterTypes?.filter(g => {
                return g?.filterType !== 'library';
            });
            newFilterTypes?.push({
                filterType: 'library',
                filterValue: LIBRARY_ID_UNSELECTED,
            });
        }
        if (filterTypeName === 'campus' || filterTypeName === 'library') {
            newFilterTypes = newFilterTypes?.filter(g => {
                return g?.filterType !== 'floor';
            });
            newFilterTypes?.push({
                filterType: 'floor',
                filterValue: FLOOR_ID_UNSELECTED,
            });
        }
        setSelectedFilters(newFilterTypes);
        setPageNum(0);
        console.log('resetSelectedFilters newFilterTypes=', newFilterTypes);

        // show-hide Spaces according to selected filters

        resetDisplayedRows({ location: newFilterTypes, pagination: 0 });
    };
    const isCampusSelected =
        selectedFilters?.find(f => f?.filterType === 'campus')?.filterValue !== CAMPUS_ID_UNSELECTED;

    function hasFacility(facilityType, bookableSpace) {
        return bookableSpace?.facility_types?.some(spaceFacility => {
            return spaceFacility?.facility_type_id === facilityType?.facility_type_id;
        });
    }

    // function getSpaceUnavailabilityStatus(bookableSpace) {
    //     const outageStatuses = (bookableSpace?.space_outages || []).map(spaceOutage => {
    //         const outageStatus = getSpaceOutageStatus(spaceOutage);
    //         return outageStatus;
    //     });
    //
    //     if (outageStatuses.includes('Current')) {
    //         return 'Current';
    //     }
    //     if (outageStatuses.includes('Upcoming')) {
    //         return 'Upcoming';
    //     }
    //
    //     return null;
    // }

    const getColumnBackgroundColor = ii => (ii % 2 === 0 ? backgroundColorColumn : '#fff');

    const handleChangePage = (event, newPageNum) => {
        console.log('handleChangePage', newPageNum, event);
        setPageNum(newPageNum);
        resetDisplayedRows({ pagination: newPageNum });
    };
    const handleChangeRowsPerPage = event => {
        const newRowsPerPage = parseInt(event?.target?.value, 10);

        const current = new Date();
        const nextYear = new Date();
        nextYear?.setFullYear(current?.getFullYear() + 1);
        setCookie(paginatorCookieName, newRowsPerPage, { expires: nextYear });

        setRowsPerPage(newRowsPerPage);
        setPageNum(0);
        resetDisplayedRows({ rowsPerPage: newRowsPerPage });
    };

    const openSortMenu = event => {
        setSortMenuAnchor(event?.currentTarget);
    };

    const closeSortMenu = () => {
        setSortMenuAnchor(null);
    };

    const handleSortSelection = selectedSortType => {
        const nextSortDirection =
            selectedSortType === sortType && sortDirection === SPACE_SORT_DIRECTION_ASC
                ? SPACE_SORT_DIRECTION_DESC
                : SPACE_SORT_DIRECTION_ASC;

        setSortType(selectedSortType);
        setSortDirection(nextSortDirection);
        setPageNum(0);
        resetDisplayedRows({
            pagination: 0,
            sortingType: selectedSortType,
            sortingDirection: nextSortDirection,
        });
        closeSortMenu();
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
            (a, b) => a?.facility_type_group_order - b?.facility_type_group_order,
        );

        // then add an overall sort order, to help us to tiger stripe the columns
        let overallCounter = 1;
        return sortedGroups?.map(group => {
            // sort the facility types alphabetically (they should already be, but...)
            const sortedChildren = [...group?.facility_type_children]?.sort((a, b) =>
                a?.facility_type_name?.localeCompare(b?.facility_type_name),
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

    const expandTable = () => {
        const thisButton = document.getElementById('table-pushout-button');
        !!thisButton && (thisButton.style.display = 'none');

        const otherButton = document.getElementById('table-pushin-button');
        !!otherButton && (otherButton.style.display = 'inline-flex');

        const tableEtc = document.getElementById('wrappedTableList');
        addClass(tableEtc, 'expanded');
    };

    const collapseTable = () => {
        const thisButton = document.getElementById('table-pushin-button');
        !!thisButton && (thisButton.style.display = 'none');

        const otherButton = document.getElementById('table-pushout-button');
        !!otherButton && (otherButton.style.display = 'inline-flex');

        const tableEtc = document.getElementById('wrappedTableList');
        removeClass(tableEtc, 'expanded');
    };

    const openEditSpacePage = e => {
        const buttonClicked = e?.target?.closest('button');
        const spaceuuid = !!buttonClicked && buttonClicked?.getAttribute('data-spaceuuid');
        !!spaceuuid && (window.location.href = spacesAdminLink(`/admin/spaces/edit/${spaceuuid}`, account));
        /* istanbul ignore next */
        !spaceuuid && console.log('no valid button clicked');
    };

    const [deleteCandidate, setDeleteCandidate] = useState(null);

    const openDeleteConfirmation = space => {
        setDeleteCandidate(space);
    };

    const closeDeleteConfirmation = () => {
        setDeleteCandidate(null);
    };

    const confirmDeleteSpace = () => {
        if (!deleteCandidate) {
            return;
        }
        actions.deleteBookableSpace(deleteCandidate.spaceId).then(() => {
            actions.loadAllBookableSpacesRooms({ includeDrafts: true });
        });
        setDeleteCandidate(null);
    };

    const selectFilter = prop => e => {
        console.log('selectFilter', prop, e);
        const filterValue = e?.target?.hasOwnProperty('checked') ? e?.target?.checked : e?.target?.value;
        resetSelectedFilters(prop, filterValue);
    };

    function displayListOfBookableSpaces() {
        const tableDescription = 'Manage Spaces';

        const sortedFacilityTypeGroups = prefilterFacilityData(facilityTypeList?.data);
        const sortedSpaces = getSortedSpaces(bookableSpacesRoomList?.data?.locations, sortType, sortDirection);

        const campusFilterTypes = availableFilters?.find(ft => ft?.filterType === 'campus')?.filterValue;
        const selectedCampusId = selectedFilters?.find(f => f?.filterType === 'campus')?.filterValue;
        const selectedCampus =
            !!campusFilterTypes &&
            !!campusFilterTypes &&
            campusFilterTypes?.length > 0 &&
            campusFilterTypes?.find(campus => campus?.campus_id === selectedCampusId);
        const selectedLibraryId = selectedFilters?.find(f => f?.filterType === 'library')?.filterValue;
        const selectedLibrary =
            !!selectedCampus && selectedCampus?.libraries?.find(library => library?.library_id === selectedLibraryId);
        const selectedCampusFloors = selectedCampus?.libraries?.flatMap(library => library?.floors || []) || [];
        const availableFloors = selectedLibrary?.floors || selectedCampusFloors;
        const floorFilterTypes = [
            ...new Map(availableFloors?.map(floor => [floor?.floor_id, floor])).values(),
        ]?.sort((a, b) => a?.floor_name?.localeCompare(b?.floor_name));
        const selectedSpaceType = selectedFilters?.find(f => f?.filterType === 'spaceType')?.filterValue;
        const knownSpaceTypes =
            bookableSpacesRoomList?.data?.known_space_types
                ?.map(spaceType => ({
                    id: String(spaceType?.space_type_id),
                    label: spaceType?.space_type_name,
                }))
                ?.filter(spaceType => !!spaceType?.id && !!spaceType?.label) || [];
        const fallbackSpaceTypes = [
            ...new Map(
                (bookableSpacesRoomList?.data?.locations || [])
                    ?.map(space => {
                        const id = !!space?.space_type_id
                            ? String(space?.space_type_id)
                            : String(space?.space_type || '');
                        const label = space?.space_type || id;
                        return [id, { id, label }];
                    })
                    ?.filter(([id, spaceType]) => !!id && !!spaceType?.label),
            ).values(),
        ];
        const spaceTypeFilterTypes =
            (knownSpaceTypes?.length > 0 ? knownSpaceTypes : fallbackSpaceTypes)
                ?.sort((a, b) => a?.label?.localeCompare(b?.label))
                ?.map(spaceType => ({
                    ...spaceType,
                    id: String(spaceType?.id),
                })) || [];
        const bookableColumnId = 0;
        return (
            <>
                <StyledTableWrapperDiv
                    id="wrappedTableList"
                    style={{ backgroundColor: '#fff' }}
                    data-testid="table-wrapper"
                >
                    <div data-testid="tablefilter" style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <StyledExpandCollapseTableIconButton
                                color="primary"
                                id="table-pushout-button"
                                data-testid="table-pushout-button"
                                onClick={expandTable}
                                aria-label="Expand the table to full window"
                                style={{ display: 'inline-flex' }}
                            >
                                <OpenInFullIcon />
                            </StyledExpandCollapseTableIconButton>
                            <StyledExpandCollapseTableIconButton
                                color="primary"
                                id="table-pushin-button"
                                data-testid="table-pushin-button"
                                onClick={collapseTable}
                                aria-label="Expand the table to full window"
                                style={{ display: 'none' }}
                            >
                                <CloseFullscreenIcon />
                            </StyledExpandCollapseTableIconButton>
                            <Typography component={'h3'} variant={'h6'}>
                                Filter the list:
                            </Typography>
                        </div>
                        <StyledFilterWrapperDiv>
                            <FormControl variant="standard" fullWidth>
                                <InputLabel id="filter-by-campus-label" htmlFor="filter-by-campus-input">
                                    By campus
                                </InputLabel>
                                <Select
                                    id="filter-by-campus"
                                    labelId="filter-by-campus-label"
                                    data-testid="filter-by-campus"
                                    value={
                                        selectedFilters?.find(f => f?.filterType === 'campus')?.filterValue ||
                                        CAMPUS_ID_UNSELECTED
                                    }
                                    onChange={selectFilter('campus')}
                                    inputProps={{
                                        id: 'filter-by-campus-input',
                                        title: 'Filter the displayed Spaces by campus',
                                    }}
                                >
                                    {!!campusFilterTypes &&
                                        !!campusFilterTypes &&
                                        campusFilterTypes?.length > 0 &&
                                        campusFilterTypes?.map((campus, index) => (
                                            <MenuItem
                                                value={campus?.campus_id}
                                                key={`filter-by-campus-menuitem-${index}`}
                                                selected={campus?.campus_id === 99999}
                                            >
                                                {campus.campus_name}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                            <FormControl variant="standard" fullWidth>
                                <InputLabel
                                    id="filter-by-library-label"
                                    htmlFor="filter-by-library-input"
                                    shrink
                                    disabled={!isCampusSelected}
                                >
                                    By library
                                </InputLabel>
                                <Select
                                    id="filter-by-library"
                                    labelId="filter-by-library-label"
                                    data-testid="filter-by-library"
                                    displayEmpty
                                    value={
                                        selectedFilters?.find(f => f?.filterType === 'library')?.filterValue ||
                                        LIBRARY_ID_UNSELECTED
                                    }
                                    renderValue={selectedValue => {
                                        if (selectedValue === LIBRARY_ID_UNSELECTED) {
                                            return 'Show all libraries';
                                        }
                                        return (
                                            selectedCampus?.libraries?.find(
                                                library => String(library?.library_id) === String(selectedValue),
                                            )?.library_name || 'Show all libraries'
                                        );
                                    }}
                                    onChange={selectFilter('library')}
                                    inputProps={{
                                        id: 'filter-by-library-input',
                                        title: 'Filter the displayed Spaces by library',
                                    }}
                                    disabled={!isCampusSelected}
                                >
                                    <MenuItem value={LIBRARY_ID_UNSELECTED}>Show all libraries</MenuItem>
                                    {selectedCampus?.libraries
                                        ?.sort((a, b) => a?.library_name?.localeCompare(b?.library_name))
                                        ?.map((library, index) => (
                                            <MenuItem
                                                value={library?.library_id}
                                                key={`filter-by-library-menuitem-${index}`}
                                                selected={library?.library_id === 99999}
                                            >
                                                {library?.library_name}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                            <FormControl variant="standard" fullWidth>
                                <InputLabel
                                    id="filter-by-floor-label"
                                    htmlFor="filter-by-floor-input"
                                    shrink
                                    disabled={!isCampusSelected}
                                >
                                    By level
                                </InputLabel>
                                <Select
                                    id="filter-by-floor"
                                    labelId="filter-by-floor-label"
                                    data-testid="filter-by-floor"
                                    displayEmpty
                                    value={
                                        selectedFilters?.find(f => f?.filterType === 'floor')?.filterValue ||
                                        FLOOR_ID_UNSELECTED
                                    }
                                    renderValue={selectedValue => {
                                        if (selectedValue === FLOOR_ID_UNSELECTED) {
                                            return 'Show all levels';
                                        }
                                        const selectedFloor = floorFilterTypes?.find(
                                            floor => String(floor?.floor_id) === String(selectedValue),
                                        );
                                        return selectedFloor?.floor_name || 'Show all levels';
                                    }}
                                    onChange={selectFilter('floor')}
                                    inputProps={{
                                        id: 'filter-by-floor-input',
                                        title: 'Filter the displayed Spaces by level',
                                    }}
                                    disabled={!isCampusSelected}
                                >
                                    <MenuItem value={FLOOR_ID_UNSELECTED}>Show all levels</MenuItem>
                                    {floorFilterTypes?.map((floor, index) => (
                                        <MenuItem
                                            value={floor?.floor_id}
                                            key={`filter-by-floor-menuitem-${index}`}
                                            selected={floor?.floor_id === 99999}
                                        >
                                            {floor?.floor_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl variant="standard" fullWidth>
                                <InputLabel id="filter-by-space-type-label" htmlFor="filter-by-space-type-input" shrink>
                                    By space type
                                </InputLabel>
                                <Select
                                    id="filter-by-space-type"
                                    labelId="filter-by-space-type-label"
                                    data-testid="filter-by-space-type"
                                    displayEmpty
                                    value={selectedSpaceType || SPACE_TYPE_ID_UNSELECTED}
                                    renderValue={selectedValue => {
                                        if (selectedValue === SPACE_TYPE_ID_UNSELECTED) {
                                            return 'Show all space types';
                                        }
                                        return (
                                            spaceTypeFilterTypes?.find(
                                                spaceType => String(spaceType?.id) === String(selectedValue),
                                            )?.label || 'Show all space types'
                                        );
                                    }}
                                    onChange={selectFilter('spaceType')}
                                    inputProps={{
                                        id: 'filter-by-space-type-input',
                                        title: 'Filter the displayed Spaces by space type',
                                    }}
                                >
                                    <MenuItem value={SPACE_TYPE_ID_UNSELECTED}>Show all space types</MenuItem>
                                    {spaceTypeFilterTypes?.map((spaceType, index) => (
                                        <MenuItem value={spaceType?.id} key={`filter-by-space-type-menuitem-${index}`}>
                                            {spaceType?.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </StyledFilterWrapperDiv>
                        <div data-testid="filter-by-draftmode-wrapper">
                            <FormControlLabel
                                label="Show drafts only"
                                control={
                                    <Checkbox
                                        checked={
                                            selectedFilters?.find(f => f?.filterType === 'draftOnly')?.filterValue ||
                                            false
                                        }
                                        onChange={selectFilter('draftOnly')}
                                        data-testid="filter-by-draftmode"
                                    />
                                }
                            />
                        </div>
                    </div>
                    <StyledTableContainer className="tableContainer">
                        <Table
                            aria-label={tableDescription}
                            aria-describedby="tableDescriptionElement"
                            data-testid="space-table"
                        >
                            <StyledTableHead>
                                {facilityTypeList?.data?.facility_type_groups?.length > 0 && (
                                    // top row of the two-row table head, to label the facilities block
                                    <StyledHeaderTableRow data-testid="spaces-dashboard-header-row">
                                        <TableCell
                                            component="th"
                                            sx={{
                                                borderBottomWidth: 0,
                                                paddingBlock: 0,
                                                backgroundColor: '#fff',
                                                textAlign: 'right',
                                            }}
                                            key={'header-cell-0'}
                                        >
                                            Filters:
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            sx={{
                                                borderBottomWidth: 0,
                                                borderTop: borderColour,
                                                textAlign: 'center',
                                                borderLeft: borderColour,
                                                backgroundColor: backgroundColorColumn,
                                                verticalAlign: 'bottom',
                                                paddingBottom: '4rem',
                                            }}
                                            rowSpan={2}
                                        >
                                            Bookable
                                        </TableCell>
                                        {sortedFacilityTypeGroups?.map((group, index) => {
                                            return (
                                                <TableCell
                                                    key={`header-cell-${index}`}
                                                    component="th"
                                                    colSpan={group?.facility_type_children?.length}
                                                    sx={{
                                                        borderBottomWidth: 0,
                                                        borderTop: borderColour,
                                                        textAlign: 'center',
                                                        backgroundColor: `${index % 2 === 0 ? '#fff' : '#f0f0f0'}`,
                                                        borderLeft: borderColour,
                                                    }}
                                                >
                                                    {group?.facility_type_group_name}
                                                </TableCell>
                                            );
                                        })}
                                    </StyledHeaderTableRow>
                                )}
                                <StyledHeaderTableRow>
                                    <StyledStickyTableCell
                                        component="th"
                                        sx={{ backgroundColor: { backgroundColorColumn }, verticalAlign: 'bottom' }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'flex-start',
                                            }}
                                        >
                                            <Button
                                                variant="outlined"
                                                onClick={openSortMenu}
                                                data-testid="spaces-sort-button"
                                                aria-controls={sortMenuAnchor ? 'spaces-sort-menu' : undefined}
                                                aria-haspopup="true"
                                                aria-expanded={sortMenuAnchor ? 'true' : undefined}
                                                sx={{
                                                    textTransform: 'none',
                                                    marginBottom: '0.35rem',
                                                    backgroundColor: '#fff',
                                                }}
                                                endIcon={
                                                    sortDirection === SPACE_SORT_DIRECTION_ASC ? (
                                                        <NorthIcon fontSize="small" />
                                                    ) : (
                                                        <SouthIcon fontSize="small" />
                                                    )
                                                }
                                            >
                                                {sortTypeLabelMap[sortType]}
                                            </Button>
                                            <Menu
                                                id="spaces-sort-menu"
                                                anchorEl={sortMenuAnchor}
                                                open={!!sortMenuAnchor}
                                                onClose={closeSortMenu}
                                                MenuListProps={{
                                                    'aria-labelledby': 'spaces-sort-button',
                                                }}
                                            >
                                                <MenuItem
                                                    selected={sortType === SPACE_SORT_NAME}
                                                    onClick={() => handleSortSelection(SPACE_SORT_NAME)}
                                                >
                                                    Sort by name
                                                    {sortType === SPACE_SORT_NAME &&
                                                        (sortDirection === SPACE_SORT_DIRECTION_ASC ? (
                                                            <NorthIcon
                                                                fontSize="small"
                                                                style={{ marginLeft: '0.4rem' }}
                                                            />
                                                        ) : (
                                                            <SouthIcon
                                                                fontSize="small"
                                                                style={{ marginLeft: '0.4rem' }}
                                                            />
                                                        ))}
                                                </MenuItem>
                                                <MenuItem
                                                    selected={sortType === SPACE_SORT_CREATED}
                                                    onClick={() => handleSortSelection(SPACE_SORT_CREATED)}
                                                >
                                                    Sort by creation date
                                                    {sortType === SPACE_SORT_CREATED &&
                                                        (sortDirection === SPACE_SORT_DIRECTION_ASC ? (
                                                            <NorthIcon
                                                                fontSize="small"
                                                                style={{ marginLeft: '0.4rem' }}
                                                            />
                                                        ) : (
                                                            <SouthIcon
                                                                fontSize="small"
                                                                style={{ marginLeft: '0.4rem' }}
                                                            />
                                                        ))}
                                                </MenuItem>
                                                <MenuItem
                                                    selected={sortType === SPACE_SORT_UPDATED}
                                                    onClick={() => handleSortSelection(SPACE_SORT_UPDATED)}
                                                >
                                                    Sort by last changed
                                                    {sortType === SPACE_SORT_UPDATED &&
                                                        (sortDirection === SPACE_SORT_DIRECTION_ASC ? (
                                                            <NorthIcon
                                                                fontSize="small"
                                                                style={{ marginLeft: '0.4rem' }}
                                                            />
                                                        ) : (
                                                            <SouthIcon
                                                                fontSize="small"
                                                                style={{ marginLeft: '0.4rem' }}
                                                            />
                                                        ))}
                                                </MenuItem>
                                            </Menu>
                                            <div>Spaces:</div>
                                        </div>
                                    </StyledStickyTableCell>
                                    {sortedFacilityTypeGroups?.map(group =>
                                        group?.facility_type_children?.map(facilityType => (
                                            <StyledHeadingFacilityTableCell
                                                component="th"
                                                key={`facilitytype-${facilityType?.facility_type_id}`}
                                                sx={{
                                                    backgroundColor: getColumnBackgroundColor(
                                                        facilityType?.overall_order,
                                                    ),
                                                    borderLeft: borderColour,
                                                }}
                                            >
                                                {facilityType?.facility_type_name}
                                            </StyledHeadingFacilityTableCell>
                                        )),
                                    )}
                                </StyledHeaderTableRow>
                            </StyledTableHead>
                            <TableBody>
                                {displayedRows?.length > 0 &&
                                    sortedSpaces
                                        ?.filter(space =>
                                            displayedRows?.find(u => u?.spaceId === space?.space_id && !!u?.showSpace),
                                        )
                                        ?.map(bookableSpace => {
                                            // Determine if there are current and/or upcoming outages
                                            const outages = bookableSpace?.space_outages || [];
                                            const hasCurrentOutage = outages.some(
                                                o => getSpaceOutageStatus(o) === 'Current',
                                            );
                                            const hasUpcomingOutage = outages.some(
                                                o => getSpaceOutageStatus(o) === 'Upcoming',
                                            );

                                            return (
                                                <StyledTableRow
                                                    key={`space-${bookableSpace?.space_id}`}
                                                    id={`space-${bookableSpace?.space_id}`}
                                                    data-testid={`space-${bookableSpace?.space_id}`}
                                                >
                                                    <StyledStickyTableCell
                                                        component="th"
                                                        scope="col"
                                                        style={{ paddingBlock: '0.5rem' }}
                                                    >
                                                        <div>
                                                            {hasCurrentOutage && (
                                                                <HighlightOffIcon
                                                                    style={{
                                                                        width: '1rem',
                                                                        marginRight: '0.35rem',
                                                                        color: '#d32f2f',
                                                                        verticalAlign: 'text-bottom',
                                                                    }}
                                                                    titleAccess="This Space is currently unavailable"
                                                                    data-testid={`space-${bookableSpace?.space_id}-outage-current-icon`}
                                                                />
                                                            )}
                                                            {hasUpcomingOutage && (
                                                                <ErrorOutlineIcon
                                                                    style={{
                                                                        width: '1rem',
                                                                        marginRight: '0.35rem',
                                                                        color: '#ed6c02',
                                                                        verticalAlign: 'text-bottom',
                                                                    }}
                                                                    titleAccess="This Space has upcoming scheduled unavailability"
                                                                    data-testid={`space-${bookableSpace?.space_id}-outage-upcoming-icon`}
                                                                />
                                                            )}
                                                            {!!bookableSpace?.space_draftmode && (
                                                                <WarningAmberIcon
                                                                    style={{
                                                                        width: '1rem',
                                                                        marginRight: '0.35rem',
                                                                        color: '#ed6c02',
                                                                        verticalAlign: 'text-bottom',
                                                                    }}
                                                                    titleAccess="This Space is currently in draft mode"
                                                                    data-testid={`space-${bookableSpace?.space_id}-draftmode-icon`}
                                                                />
                                                            )}
                                                            <span data-testid={`space-${bookableSpace?.space_id}-name`}>
                                                                {bookableSpace?.space_name}
                                                            </span>
                                                            <IconButton
                                                                color="primary"
                                                                data-testid={`edit-space-${bookableSpace?.space_id}-button`}
                                                                data-spaceuuid={bookableSpace?.space_uuid}
                                                                onClick={openEditSpacePage}
                                                                aria-label={`Edit ${bookableSpace?.space_name}`}
                                                            >
                                                                <EditIcon style={{ width: '1rem' }} />
                                                            </IconButton>
                                                            <IconButton
                                                                color="error"
                                                                data-testid={`delete-space-${bookableSpace?.space_id}-button`}
                                                                onClick={() =>
                                                                    openDeleteConfirmation({
                                                                        spaceId: bookableSpace?.space_id,
                                                                        spaceUuid: bookableSpace?.space_uuid,
                                                                        spaceName: bookableSpace?.space_name,
                                                                    })
                                                                }
                                                                aria-label={`Delete ${bookableSpace?.space_name}`}
                                                            >
                                                                <DeleteOutlineIcon style={{ width: '1rem' }} />
                                                            </IconButton>
                                                        </div>
                                                        <div className="spaceDescription">
                                                            {bookableSpace?.space_type}
                                                            <IconButton
                                                                id={expandButtonElementId(bookableSpace?.space_id)}
                                                                data-testid={`space-${bookableSpace?.space_id}-expand-button`}
                                                                onClick={() => expandSpace(bookableSpace?.space_id)}
                                                                aria-label="Expand Space details"
                                                                style={{ display: 'inline-flex' }}
                                                            >
                                                                <KeyboardArrowDownIcon />
                                                            </IconButton>
                                                            <IconButton
                                                                id={collapseButtonElementId(bookableSpace?.space_id)}
                                                                data-testid={`space-${bookableSpace?.space_id}-collapse-button`}
                                                                onClick={() => collapseSpace(bookableSpace?.space_id)}
                                                                aria-label="Collapse Space details"
                                                                style={{ display: 'none' }}
                                                            >
                                                                <KeyboardArrowUpIcon />
                                                            </IconButton>
                                                        </div>

                                                        <div
                                                            id={spaceDescriptionElementsId(bookableSpace?.space_id)}
                                                            data-testid={spaceDescriptionElementsId(
                                                                bookableSpace?.space_id,
                                                            )}
                                                            style={{ display: 'none' }}
                                                        >
                                                            {getFriendlyLocationDescription(bookableSpace)}
                                                        </div>
                                                    </StyledStickyTableCell>
                                                    <TableCell
                                                        data-testid={`space-${bookableSpace?.space_id}-facilitytype-bookable`}
                                                        sx={{
                                                            backgroundColor: getColumnBackgroundColor(bookableColumnId),
                                                            textAlign: 'center',
                                                            borderInline: borderColour,
                                                        }}
                                                        title={
                                                            isBookable(bookableSpace)
                                                                ? 'Space is bookable'
                                                                : 'Space IS NOT bookable'
                                                        }
                                                    >
                                                        {isBookable(bookableSpace) && (
                                                            <GreenTick
                                                                title="Space is bookable"
                                                                dataTestId={`tick-${bookableSpace?.space_id}-facilitytype-bookable`}
                                                            />
                                                        )}
                                                    </TableCell>
                                                    {sortedFacilityTypeGroups?.length > 0 &&
                                                        sortedFacilityTypeGroups?.map(group => {
                                                            return group?.facility_type_children?.map(facilityType => {
                                                                const facilitySlug = slugifyName(
                                                                    facilityType?.facility_type_name,
                                                                );
                                                                return (
                                                                    <TableCell
                                                                        key={`space-${bookableSpace?.space_id}-facilitytype-${facilitySlug}`}
                                                                        data-testid={`space-${bookableSpace?.space_id}-facilitytype-${facilitySlug}`}
                                                                        sx={{
                                                                            backgroundColor: getColumnBackgroundColor(
                                                                                facilityType?.overall_order,
                                                                            ),
                                                                            textAlign: 'center',
                                                                            borderInline: borderColour,
                                                                        }}
                                                                        title={
                                                                            hasFacility(facilityType, bookableSpace)
                                                                                ? `Space has ${facilityType?.facility_type_name}`
                                                                                : `Space DOES NOT have ${facilityType?.facility_type_name}`
                                                                        }
                                                                    >
                                                                        {hasFacility(facilityType, bookableSpace) && (
                                                                            <GreenTick
                                                                                title={`Space has ${facilityType?.facility_type_name}`}
                                                                                dataTestId={`tick-${bookableSpace?.space_id}-facilitytype-${facilitySlug}`}
                                                                            />
                                                                        )}
                                                                    </TableCell>
                                                                );
                                                            });
                                                        })}
                                                </StyledTableRow>
                                            );
                                        })}
                            </TableBody>
                        </Table>
                    </StyledTableContainer>

                    <StyledTablePagination
                        data-testid="pagination-block"
                        // dont use: { label: 'All', value: rows.length }
                        // as it gives a dupe key error when the length happens to match a value
                        // in the list. Nor do we want them loading vast numbers of records - they
                        // can jump to the next page
                        rowsPerPageOptions={[5, 10, 25, 100]}
                        count={sortedSpaces?.filter(s => doesSpaceShow(s, selectedFilters))?.length}
                        rowsPerPage={rowsPerPage}
                        page={pageNum}
                        SelectProps={{
                            inputProps: {
                                'aria-label': 'spaces per page',
                                'data-testid': 'admin-spaces-list-paginator-select',
                            },
                            native: true,
                        }}
                        component="div"
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </StyledTableWrapperDiv>
            </>
        );
    }

    return (
        <SpacesAdminPage systemTitle="Spaces" pageTitle="Manage Spaces" currentPageSlug="dashboard">
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
                        bookableSpacesRoomList?.data?.locations?.length === 0
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
                                {displayListOfBookableSpaces()}
                            </StyledBookableSpaceGridItem>
                        );
                    }
                })()}
            </Grid>
            <Dialog open={!!deleteCandidate} onClose={closeDeleteConfirmation} data-testid="spaces-delete-dialog">
                <DialogContent>
                    <DialogContentText data-testid="spaces-delete-dialog-message">
                        Do you wish to delete this space?
                    </DialogContentText>
                </DialogContent>
                <DialogActions data-testid="spaces-delete-dialog-actions">
                    <Button onClick={closeDeleteConfirmation} data-testid="spaces-delete-cancel-button">
                        Cancel
                    </Button>
                    <Button
                        onClick={confirmDeleteSpace}
                        color="error"
                        variant="contained"
                        data-testid="spaces-delete-confirm-button"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </SpacesAdminPage>
    );
};

BookableSpacesManageSpaces.propTypes = {
    actions: PropTypes.any,
    bookableSpacesRoomList: PropTypes.any,
    bookableSpacesRoomListIncludesDrafts: PropTypes.bool,
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

export default React.memo(BookableSpacesManageSpaces);
