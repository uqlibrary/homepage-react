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
import Typography from '@mui/material/Typography';

import EditIcon from '@mui/icons-material/Edit';

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

export const BookableSpacesDashboard = ({
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

    const [useRows, setUseRows2] = useState([]);
    const setUseRows = rows => {
        console.log('setUseRows', rows);
        setUseRows2(rows);
    };

    const [cookies, setCookie] = useCookies();

    const paginatorCookieName = 'spaces-list-paginator';
    const [rowsPerPage, setRowsPerPage] = React.useState(
        !!cookies[paginatorCookieName] ? parseInt(cookies[paginatorCookieName], 10) : 5,
    );
    const [pageNum, setPageNum] = React.useState(0);

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
            '<li class="uq-breadcrumb__item"><span class="uq-breadcrumb__link">Manage Spaces</span></li>',
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
            setUseRows(usableRows);
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

    const resetUserows = latestUpdate => {
        console.log('resetUserows latestUpdate=', latestUpdate);
        // if we have just set data to UseState, they aren't available yet - weird! :(
        const usedFilters = latestUpdate?.location ? latestUpdate.location : selectedFilters;
        let suppliedPageNum = latestUpdate?.pagination ? latestUpdate.pagination : pageNum;
        let suppliedRowsPerPage = rowsPerPage;
        if (latestUpdate?.rowsPerPage) {
            suppliedRowsPerPage = latestUpdate.rowsPerPage;
            suppliedPageNum = 0;
        }

        let numRow = 0;
        let useRowsLocal = [...useRows];
        bookableSpacesRoomList?.data?.locations?.forEach(space => {
            const showSpaceByFilter = doesSpaceShow(space, usedFilters);

            useRowsLocal = useRowsLocal.filter(r => {
                return r.spaceId !== space.space_id;
            });
            const spaceRow = document.getElementById(`space-${space.space_id}`);
            if (!!showSpaceByFilter && showSpaceByPagination(numRow, suppliedPageNum, suppliedRowsPerPage)) {
                removeClass(spaceRow, 'hiddenRow');
                useRowsLocal.push({
                    spaceId: space.space_id,
                    showSpace: true,
                });
            } else {
                addClass(spaceRow, 'hiddenRow');
                useRowsLocal.push({
                    spaceId: space.space_id,
                    showSpace: false,
                });
            }
            if (!!showSpaceByFilter) {
                numRow++;
            }
        });

        setUseRows(useRowsLocal);
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

        resetUserows({ location: newFilterTypes });
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
        setPageNum(newPageNum);
        resetUserows({ pagination: newPageNum });
    };
    const handleChangeRowsPerPage = event => {
        const newRowsPerPage = parseInt(event.target.value, 10);

        const current = new Date();
        const nextYear = new Date();
        nextYear.setFullYear(current.getFullYear() + 1);
        setCookie(paginatorCookieName, newRowsPerPage, { expires: nextYear });

        setRowsPerPage(newRowsPerPage);
        setPageNum(0);
        resetUserows({ rowsPerPage: newRowsPerPage });
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

    function displayListOfBookableSpaces() {
        const tableDescription = 'Manage Spaces';

        const sortedFacilityTypeGroups = prefilterFacilityData(facilityTypeList?.data);

        const campusFilterTypes = availableFilters?.find(ft => ft.filterType === 'campus')?.filterValue;
        const selectedCampusId = selectedFilters?.find(f => f.filterType === 'campus')?.filterValue;
        const selectedCampus =
            !!campusFilterTypes &&
            !!campusFilterTypes &&
            campusFilterTypes?.length > 0 &&
            campusFilterTypes?.find(campus => campus.campus_id === selectedCampusId);
        const selectedLibraryId = selectedFilters?.find(f => f.filterType === 'library')?.filterValue;
        const selectedLibrary =
            !!selectedCampus && selectedCampus?.libraries?.find(library => library.library_id === selectedLibraryId);
        return (
            <>
                <TableWrapper id="wrappedTableList" style={{ backgroundColor: '#fff' }} data-testid="table-wrapper">
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
                                        selectedFilters?.find(f => f.filterType === 'campus')?.filterValue ||
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
                                                value={campus.campus_id}
                                                key={`filter-by-campus-menuitem-${index}`}
                                                selected={campus.campus_id === 99999}
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
                                    disabled={!isCampusSelected}
                                >
                                    By library
                                </InputLabel>
                                <Select
                                    id="filter-by-library"
                                    labelId="filter-by-library-label"
                                    data-testid="filter-by-library"
                                    value={
                                        selectedFilters?.find(f => f.filterType === 'library')?.filterValue ||
                                        LIBRARY_ID_UNSELECTED
                                    }
                                    onChange={selectFilter('library')}
                                    inputProps={{
                                        id: 'filter-by-library-input',
                                        title: 'Filter the displayed Spaces by library',
                                    }}
                                    disabled={!isCampusSelected}
                                >
                                    {selectedCampus?.libraries
                                        ?.sort((a, b) => a.library_name.localeCompare(b.library_name))
                                        ?.map((library, index) => (
                                            <MenuItem
                                                value={library.library_id}
                                                key={`filter-by-library-menuitem-${index}`}
                                                selected={library.library_id === 99999}
                                            >
                                                {library.library_name}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                            <FormControl variant="standard" fullWidth>
                                <InputLabel
                                    id="filter-by-floor-label"
                                    htmlFor="filter-by-floor-input"
                                    disabled={!isLibrarySelected}
                                >
                                    By floor
                                </InputLabel>
                                <Select
                                    id="filter-by-floor"
                                    labelId="filter-by-floor-label"
                                    data-testid="filter-by-floor"
                                    value={
                                        selectedFilters?.find(f => f.filterType === 'floor')?.filterValue ||
                                        FLOOR_ID_UNSELECTED
                                    }
                                    onChange={selectFilter('floor')}
                                    inputProps={{
                                        id: 'filter-by-floor-input',
                                        title: 'Filter the displayed Spaces by floor',
                                    }}
                                    disabled={!isLibrarySelected}
                                >
                                    {!!selectedLibrary &&
                                        selectedLibrary?.floors.map((floor, index) => (
                                            <MenuItem
                                                value={floor.floor_id}
                                                key={`filter-by-floor-menuitem-${index}`}
                                                selected={floor.floor_id === 99999}
                                            >
                                                {floor.floor_name}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </StyledFilterWrapperDiv>
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
                                        {sortedFacilityTypeGroups?.map((group, index) => {
                                            return (
                                                <TableCell
                                                    key={`header-cell-${index}`}
                                                    component="th"
                                                    colSpan={group.facility_type_children?.length}
                                                    sx={{
                                                        borderBottomWidth: 0,
                                                        borderTop: borderColour,
                                                        textAlign: 'center',
                                                        backgroundColor: `${index % 2 === 0 ? '#fff' : '#f0f0f0'}`,
                                                        borderLeft: borderColour,
                                                    }}
                                                >
                                                    {group.facility_type_group_name}
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
                                        Spaces:
                                    </StyledStickyTableCell>
                                    {sortedFacilityTypeGroups?.map(group =>
                                        group?.facility_type_children?.map(facilityType => (
                                            <StyledHeadingFacilityTableCell
                                                component="th"
                                                key={`facilitytype-${facilityType.facility_type_id}`}
                                                sx={{
                                                    backgroundColor: getColumnBackgroundColor(
                                                        facilityType.overall_order,
                                                    ),
                                                    borderLeft: borderColour,
                                                }}
                                            >
                                                {facilityType.facility_type_name}
                                            </StyledHeadingFacilityTableCell>
                                        )),
                                    )}
                                </StyledHeaderTableRow>
                            </StyledTableHead>
                            <TableBody>
                                {useRows?.length > 0 &&
                                    bookableSpacesRoomList?.data?.locations
                                        ?.filter(space =>
                                            useRows.find(u => u.spaceId === space.space_id && !!u.showSpace),
                                        )
                                        ?.map(bookableSpace => {
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
                                                            <IconButton
                                                                color="primary"
                                                                data-testid={`edit-space-${bookableSpace?.space_id}-button`}
                                                                data-spaceuuid={bookableSpace?.space_uuid}
                                                                onClick={openEditSpacePage}
                                                                aria-label={`Edit ${bookableSpace?.space_name}`}
                                                            >
                                                                <EditIcon style={{ width: '1rem' }} />
                                                            </IconButton>
                                                            {bookableSpace?.space_name}
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

                                                    {sortedFacilityTypeGroups?.length > 0 &&
                                                        sortedFacilityTypeGroups?.map(group => {
                                                            return group?.facility_type_children?.map(facilityType => {
                                                                const facilitySlug = slugifyName(
                                                                    facilityType.facility_type_name,
                                                                );
                                                                return (
                                                                    <TableCell
                                                                        key={`space-${bookableSpace?.space_id}-facilitytype-${facilitySlug}`}
                                                                        data-testid={`space-${bookableSpace?.space_id}-facilitytype-${facilitySlug}`}
                                                                        sx={{
                                                                            backgroundColor: getColumnBackgroundColor(
                                                                                facilityType.overall_order,
                                                                            ),
                                                                            textAlign: 'center',
                                                                            borderInline: borderColour,
                                                                        }}
                                                                        title={
                                                                            hasFacility(facilityType, bookableSpace)
                                                                                ? `Space has ${facilityType.facility_type_name}`
                                                                                : `Space DOES NOT have ${facilityType.facility_type_name}`
                                                                        }
                                                                    >
                                                                        {hasFacility(facilityType, bookableSpace) && (
                                                                            <DoneIcon
                                                                                titleAccess={`Space has ${facilityType.facility_type_name}`}
                                                                                style={{ stroke: 'green' }}
                                                                                data-testid={`tick-${bookableSpace?.space_id}-facilitytype-${facilitySlug}`}
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
                        // dont use
                        // { label: 'All', value: rows.length }
                        // as it gives a dupe key error when the length happens to match a value
                        // in the list. Nor do we want them loading vast numbers of records - they
                        // can jump to the next page
                        rowsPerPageOptions={[5, 10, 25, 100]}
                        count={
                            bookableSpacesRoomList?.data?.locations?.filter(s => doesSpaceShow(s, selectedFilters))
                                ?.length
                        }
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
                </TableWrapper>
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
                                {displayListOfBookableSpaces()}
                            </StyledBookableSpaceGridItem>
                        );
                    }
                })()}
            </Grid>
        </SpacesAdminPage>
    );
};

BookableSpacesDashboard.propTypes = {
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

export default React.memo(BookableSpacesDashboard);
