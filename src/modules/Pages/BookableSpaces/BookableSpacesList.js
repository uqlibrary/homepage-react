import React, { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { useCookies } from 'react-cookie';

import { Grid, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { breadcrumbs } from 'config/routes';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { addClass, removeClass, standardText } from 'helpers/general';
import { useAccountContext } from 'context';

import BookableSpacesMap from 'modules/Pages/BookableSpaces/BookableSpacesMap';
import SidebarSpacesList from 'modules/Pages/BookableSpaces/SidebarSpacesList';
import SidebarFilters from 'modules/Pages/BookableSpaces/SidebarFilters';
import {
    FACILITY_TYPE_CHECKBOX,
    FACILITY_TYPE_SLIDER,
    FILTER_BOOKABLE_ACTION_NAME,
    FILTER_BOOKABLE_TYPE_ID,
    FILTER_CAPACITY_TYPE_ID,
    FILTER_CURRENTLY_OPEN_ACTION_NAME,
    FILTER_SPACE_CAPACITY_ACTION_NAME,
} from './spacesHelpers';
import { displayToastErrorMessage, displayToastMessage } from '../Admin/BookableSpaces/bookableSpacesAdminHelpers';
import { CAMPUS_DUTTON_PARK } from 'config/locale';

const StyledStandardCard = styled(StandardCard)(({ theme }) => ({
    ...standardText(theme),
    fontWeight: '400 !important',
    '& .MuiCardHeader-root': {
        paddingBottom: 0,
    },
    '& .MuiCardContent-root': {
        paddingBlock: 0,
    },
    '&.mobileHighlightPanel': {
        // do clever things here for mobile
    },
    transition: 'background-color 1s linear, border 1s linear',
    '&.highlightPanel': {
        border: `1px solid ${theme.palette.primary.main}`,
        backgroundColor: '#eee9f2', // purple-50
        transition: 'background-color 1s linear, border 1s linear',
    },
}));
const StyledBookableSpacesListWrapperDiv = styled('div')(({ theme }) => ({
    backgroundColor: 'rgb(243, 243, 244)',
    marginBottom: '-50px',

    /* move the mazemaps floor indicator when the filter sidebar is open */
    '&:has(.filterSideBar.popupFilterList) .mapboxgl-ctrl-bottom-left': {
        left: '21.1rem',
    },

    [theme.breakpoints.up('lg')]: {
        '&:has(.spacesListHolder.hide)': {
            '& .mapHolder': {
                '& .leaflet-control-container': {
                    position: 'absolute',
                    left: '195px',
                },
            },
        },
        '&:has(.spacesListHolder.spacesList)': {
            '& .mapHolder': {
                '& .leaflet-control-container': {
                    position: 'absolute',
                    left: '330px',
                },
            },
        },
    },
}));
const StyledBookableSpaceGridItem = styled(Grid)(() => ({
    marginTop: '12px',
}));

const StyledLayoutWrapper = styled('div')(() => ({
    position: 'relative',
    height: '99vh',
    marginInline: '2rem',
    overflow: 'hidden',
    '& .popupFilterList': {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '20rem',
        maxWidth: '50%',
        zIndex: 997,
    },
    '& .popupSpacesList': {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '20rem',
        maxWidth: '50%',
        zIndex: 997,
        paddingLeft: '0.5rem',
    },
    '& .popupSpacesSidebar': {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '20rem',
        maxWidth: '50%',
        zIndex: 997,
        paddingLeft: '0.5rem',
        height: 'fit-content',
    },
    '& .hide': {
        display: 'none',
    },
}));
const StyledSidebarTab = styled('button')(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 998,
    width: '1.5rem',
    height: '4.5rem',
    padding: 0,
    border: `1px solid ${theme.palette.primary.light}`,
    backgroundColor: '#fff',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2px',
    color: theme.palette.primary.main,
    '&:hover, &:focus-visible': {
        backgroundColor: theme.palette.primary.main,
        color: '#fff',
        outline: `2px solid ${theme.palette.primary.dark}`,
        outlineOffset: '1px',
    },
    '& .tab-count': {
        fontSize: '0.6rem',
        fontWeight: 'bold',
        lineHeight: 1,
    },
    '&.filterTab': {
        borderRadius: '0 6px 6px 0',
        borderLeft: 'none',
    },
    '&.spacesTab': {
        borderRadius: '6px 0 0 6px',
        borderRight: 'none',
    },
}));

export const BookableSpacesList = ({
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
    spacesFavouritesList,
}) => {
    const { account } = useAccountContext();
    const isLoggedIn = !!account?.id;
    console.log(
        'BookableSpacesList load facilityTypeList:',
        facilityTypeListLoading,
        facilityTypeListError,
        facilityTypeList,
    );
    console.log('BookableSpacesList load weeklyHours:', weeklyHoursLoading, weeklyHoursError, weeklyHours);
    console.log(
        'BookableSpacesList load bookableSpacesRoomList:',
        bookableSpacesRoomListLoading,
        bookableSpacesRoomListError,
        bookableSpacesRoomList,
    );

    const theme = useTheme();
    const isMobileView = useMediaQuery(theme.breakpoints.down('sm')) || false;
    const _isTabletViewJust = useMediaQuery(theme.breakpoints.down('lg')) || false;
    const isTabletView = isMobileView ? false : _isTabletViewJust;
    const isDesktopView = !isTabletView && !isMobileView;

    const FACILITY_TYPE_NAME_CURRENTLY_OPEN = 'Open';
    const FACILITY_TYPE_NAME_CAPACITY = 'Bookable';

    const CAMPUS_INDEX_ST_LUCIA = 1;

    const [campusList, setCampusList] = useState([]);

    const [selectedFacilityTypes, setSelectedFacilityTypes2] = useState([]);
    const setSelectedFacilityTypes = x => {
        console.log('setSelectedFacilityTypes', x);
        return setSelectedFacilityTypes2(x);
    };
    const [showFilterSelectorPopup, setShowFilterSelectorPopup] = useState(!isMobileView);
    const [showSpacesSelectorPopup, setShowSpacesSelectorPopup] = useState(isDesktopView);
    const [previousToggledSpaceButton, setPreviousToggledSpaceButton] = useState(null);
    const [isFavouriteActionInProgress, setIsFavouriteActionInProgress] = useState(false);
    const [activeNavigationSpace, setActiveNavigationSpace] = useState(null);

    const mapRef = useRef(null);
    const mapWrapperRef = useRef(null);

    const highlightPanel = space => {
        const spacePanel = document.querySelector(`#space-${space?.space_id} > div:first-of-type`);
        addClass(spacePanel, 'highlightPanel');
        addClass(spacePanel, 'mobileHighlightPanel');

        setTimeout(() => {
            removeClass(spacePanel, 'highlightPanel');
        }, 3000);
    };

    const handleSpaceExpand = useCallback(space => {
        console.log('### handleSpaceExpand space=', space);

        highlightPanel(space);

        // show space's location on the map
        mapRef.current?.flyToSpace(space);
    }, []);

    const handleNavigate = useCallback(
        space => {
            const isStartingNavigation = activeNavigationSpace?.space_id !== space?.space_id;

            setActiveNavigationSpace(current => (current?.space_id === space?.space_id ? null : space));

            if (!isStartingNavigation) {
                return;
            }

            setShowFilterSelectorPopup(false);
            setShowSpacesSelectorPopup(false);

            window.requestAnimationFrame(() => {
                const mapWrapperElement = mapWrapperRef.current;

                if (!mapWrapperElement) {
                    return;
                }

                const topOffset = mapWrapperElement.getBoundingClientRect().top + window.scrollY;

                window.scrollTo({
                    top: Math.max(0, topOffset),
                    behavior: 'smooth',
                });
            });
        },
        [activeNavigationSpace?.space_id],
    );

    const [cookies, setCookie] = useCookies();
    const getCampusInitialState = () => {
        const spacesPreferredCampus = cookies.UQLspacesPreferredCampus;
        if (!!spacesPreferredCampus) {
            return parseInt(spacesPreferredCampus, 10);
        }
        return CAMPUS_INDEX_ST_LUCIA;
    };
    const [selectedCampus, setSelectedCampus] = React.useState(getCampusInitialState());

    // based on https://stackoverflow.com/a/42234774
    // this isn't the formula I am used to, which has much more trig, but it seems good enough
    function getLatLngCentreOfCampus(spacesList, selectedCampusId) {
        function radiansToDegrees(rad) {
            return (rad * 180) / Math.PI;
        }
        function degreesToRadians(degr) {
            return (degr * Math.PI) / 180;
        }
        function formattedGeolocatedLocation(latitude, longitude, campusId, campusName) {
            const DUTTON_PARK_FLOOR_LEVEL = 6; // we only occupy level 6 at Dutton Park
            return {
                space_latitude: latitude,
                space_longitude: longitude,
                space_campus_id: campusId,
                space_campus_name: campusName,
                space_zlevel: campusName === CAMPUS_DUTTON_PARK ? DUTTON_PARK_FLOOR_LEVEL : null,
            };
        }

        const normalizedSpacesList = Array.isArray(spacesList) ? spacesList : [];
        const normalizedCampusId = Number(selectedCampusId);

        const spacesListForCampus = normalizedSpacesList.filter(
            space => Number(space?.space_campus_id) === normalizedCampusId,
        );

        /* eslint-disable camelcase */
        const buildingsOnCampus = Object.values(
            // just get one location per building, to stop reweighting of space locations
            spacesListForCampus.reduce(
                (
                    acc,
                    {
                        space_building_name,
                        space_building_number,
                        space_latitude,
                        space_longitude,
                        space_campus_id,
                        space_campus_name,
                    },
                ) => {
                    if (!acc[space_building_number]) {
                        acc[space_building_number] = {
                            building_number: space_building_number,
                            building_name: space_building_name,
                            building_latitude: space_latitude,
                            building_longitude: space_longitude,
                            building_campus_id: space_campus_id,
                            building_campus_name: space_campus_name,
                        };
                    }
                    return acc;
                },
                {},
            ),
        );

        if (buildingsOnCampus.length === 0) {
            // this is probably unreachable - there cant be no buildings at this point
            return null;
        }

        if (buildingsOnCampus.length === 1) {
            return formattedGeolocatedLocation(
                buildingsOnCampus.at(0).building_latitude,
                buildingsOnCampus.at(0).building_longitude,
                buildingsOnCampus.at(0).building_campus_id,
                buildingsOnCampus.at(0).building_campus_name,
            );
        }

        let X = 0.0;
        let Y = 0.0;
        let Z = 0.0;

        buildingsOnCampus.forEach(building => {
            const lat = degreesToRadians(building.building_latitude);
            const lon = degreesToRadians(building.building_longitude);

            const a = Math.cos(lat) * Math.cos(lon);
            const b = Math.cos(lat) * Math.sin(lon);
            const c = Math.sin(lat);

            X += a;
            Y += b;
            Z += c;
        });

        const numberOfCoords = buildingsOnCampus.length;
        X /= numberOfCoords;
        Y /= numberOfCoords;
        Z /= numberOfCoords;

        const lon = Math.atan2(Y, X);
        const hyp = Math.sqrt(X * X + Y * Y);
        const lat = Math.atan2(Z, hyp);

        return formattedGeolocatedLocation(
            radiansToDegrees(lat),
            radiansToDegrees(lon),
            selectedCampusId,
            buildingsOnCampus.at(0).building_campus_name,
        );
    }

    const handleCampusSelection = e => {
        const campusId = e?.target?.value;
        console.log('BookableSpacesList campus::handleCampusSelection', campusId, e);
        console.log('BookableSpacesList campus::handleCampusSelection bookableSpacesRoomList=', bookableSpacesRoomList);
        setSelectedCampus(campusId);

        const current = new Date();
        const nextYear = new Date();
        nextYear.setFullYear(current.getFullYear() + 1);
        setCookie('UQLspacesPreferredCampus', campusId, { expires: nextYear });

        const locationOfCentreOfCampus = getLatLngCentreOfCampus(bookableSpacesRoomList?.data?.locations, campusId);
        console.log('### locationOfCentreOfCampus=', locationOfCentreOfCampus);
        !!locationOfCentreOfCampus && mapRef.current?.flyToSpace(locationOfCentreOfCampus);
    };

    const minimumSpaceCapacity = 1;
    const [capacityFilterValue, setCapacityFilterValue] = React.useState([]);
    const [maximumSpaceCapacity, setMaximumSpaceCapacity] = React.useState(50);

    React.useEffect(() => {
        const siteHeader = document.querySelector('uq-site-header');
        !!siteHeader &&
            !!breadcrumbs?.bookablespaces?.title &&
            siteHeader.setAttribute('secondleveltitle', breadcrumbs.bookablespaces.title);
        !!siteHeader &&
            !!breadcrumbs?.bookablespaces?.title &&
            siteHeader.setAttribute('secondLevelUrl', breadcrumbs.bookablespaces.pathname);
        actions.loadAllBookableSpacesRooms();
        if (weeklyHoursError === null && weeklyHoursLoading === null && weeklyHours === null) {
            actions.loadWeeklyHours();
        }
        if (facilityTypeListError === null && facilityTypeListLoading === null && facilityTypeList === null) {
            actions.loadAllFacilityTypes();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (isLoggedIn && spacesFavouritesList === null) {
            actions.loadSpacesFavourites();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoggedIn]);

    React.useEffect(() => {
        if (
            !bookableSpacesRoomListError &&
            !bookableSpacesRoomListLoading &&
            !!bookableSpacesRoomList?.data?.locations
        ) {
            // the space with the highest capacity
            const spaceMaxCapacity = bookableSpacesRoomList?.data?.locations?.reduce(function findMax(
                highestCapacity,
                current,
            ) {
                return highestCapacity &&
                    typeof current.space_capacity === 'number' &&
                    highestCapacity.space_capacity < current.space_capacity
                    ? current
                    : highestCapacity;
            });
            const calculatedMaxCapaity = !!bookableSpacesRoomList?.data?.locations && spaceMaxCapacity?.space_capacity;
            setMaximumSpaceCapacity(calculatedMaxCapaity);
            setCapacityFilterValue([minimumSpaceCapacity, calculatedMaxCapaity]);

            /* eslint-disable camelcase */
            const currentCampusList = Object.values(
                bookableSpacesRoomList?.data?.locations?.reduce(
                    (acc, { space_campus_id, space_campus_name, space_campus_number }) => {
                        if (!acc[space_campus_id]) {
                            acc[space_campus_id] = {
                                campus_id: space_campus_id,
                                campus_number: space_campus_number,
                                campus_name: space_campus_name,
                                campus_space_count: 0,
                            };
                        }
                        acc[space_campus_id].campus_space_count++;
                        return acc;
                    },
                    {},
                ),
            );
            setCampusList(currentCampusList);
        }
    }, [bookableSpacesRoomList, bookableSpacesRoomListError, bookableSpacesRoomListLoading]);

    // this will need to be passed space.space_opening_hours_override later when AD-797 is done
    function isLocationOpen(locationId, hoursData) {
        if (!locationId) {
            return false;
            // this needs more work - see AD-797
        }
        function getDateStringInTimezone(offsetHours = 10) {
            const date = new Date();
            const offsetMs = offsetHours * 60 * 60 * 1000;
            const localTime = new Date(date.getTime() + offsetMs);

            const year = localTime.getUTCFullYear();
            const month = String(localTime.getUTCMonth() + 1).padStart(2, '0');
            const day = String(localTime.getUTCDate()).padStart(2, '0');

            return `${year}-${month}-${day}`;
        }
        const currentDate = getDateStringInTimezone();

        // Find matching location by lid (springshare library id)
        const openingHoursLocationData = hoursData?.locations?.find(loc => loc?.lid === locationId) || {};

        const displayedDepartments = ['Collections and space', 'Study space', 'Service and collections'];
        if (!!openingHoursLocationData?.departments) {
            const newdept = openingHoursLocationData?.departments?.filter(dept => {
                return !!dept?.name ? displayedDepartments?.includes(dept?.name) : false;
            });
            openingHoursLocationData.departments = newdept;
        } else {
            openingHoursLocationData.departments = [];
        }

        if (!openingHoursLocationData) {
            return null;
        }

        // data is already stripped down to only the single department of interest
        const department =
            !!openingHoursLocationData?.departments && openingHoursLocationData?.departments.length > 0
                ? openingHoursLocationData?.departments[0]
                : null;
        if (!department) {
            return null;
        }

        for (const week of department?.weeks) {
            for (const [dayName, dayData] of Object.entries(week)) {
                if (dayData?.date === currentDate) {
                    return dayData?.times?.currently_open ?? null;
                }
            }
        }
        return null; // Date not found in data
    }

    const isBookable = space => {
        return space?.space_external_book_url?.startsWith('http');
    };

    function showSpace(space, facilityTypeToGroup, selectedFacilityTypes, selectedCurrentCampus) {
        console.log(
            'showSpace',
            space.space_name,
            '; campus=',
            space.space_campus_id,
            ';selectedCurrentCampus=',
            selectedCurrentCampus,
        );
        if (space?.space_draftmode) {
            return false;
        }

        if (space.space_campus_id !== selectedCurrentCampus) {
            return false;
        }

        const spaceFacilityTypes = space?.facility_types?.map(item => item?.facility_type_id);

        // Create a map of facility_type_id to group_id for quick lookup
        // Group selected filters by their facility type group
        const selectedFiltersByGroup = {};
        const rejectedFilters = [];

        selectedFacilityTypes?.forEach(filter => {
            if (filter?.selected) {
                const groupId = facilityTypeToGroup[filter?.facility_type_id];
                if (groupId) {
                    if (!selectedFiltersByGroup[groupId]) {
                        selectedFiltersByGroup[groupId] = [];
                    }
                    selectedFiltersByGroup[groupId].push(filter?.facility_type_id);
                }
            }

            // Collect rejected facility types
            if (filter?.unselected) {
                rejectedFilters?.push(filter?.facility_type_id);
            }
        });

        // check if space should be excluded due to rejected facility types
        if (rejectedFilters?.length > 0) {
            const hasRejectedFacility = rejectedFilters?.some(rejectedId => {
                // we have no "don't include" for currently-open
                // we have no "don't include" for capacity
                return spaceFacilityTypes?.includes(rejectedId);
            });
            if (hasRejectedFacility) {
                return false;
            }
        }

        // If no inclusion filters are selected, show all spaces (that haven't been rejected)
        if (Object.keys(selectedFiltersByGroup)?.length === 0) {
            return true;
        }

        // AND between groups
        for (const groupId in selectedFiltersByGroup) {
            if (Object.hasOwn(selectedFiltersByGroup, groupId)) {
                const selectedFiltersInGroup = selectedFiltersByGroup[groupId];

                // OR within group
                console.log('====');
                console.log('selectedFiltersInGroup', selectedFiltersInGroup);
                const hasMatchInGroup = selectedFiltersInGroup?.some(filterId => {
                    const filter = selectedFacilityTypes?.find(f => f?.facility_type_id === filterId);
                    console.log(space.space_id, filterId, 'facility_special_action=', filter?.facility_special_action);
                    if (filter?.facility_special_action === FILTER_CURRENTLY_OPEN_ACTION_NAME) {
                        console.log('filter: FILTER_CURRENTLY_OPEN_ACTION_NAME');
                        return isLocationOpen(space?.space_opening_hours_id, weeklyHours);
                    } else if (
                        filter?.facility_special_action === FILTER_SPACE_CAPACITY_ACTION_NAME &&
                        selectedFiltersInGroup.includes(FILTER_BOOKABLE_TYPE_ID)
                    ) {
                        const capacityResult =
                            isBookable(space) &&
                            !!space?.space_capacity &&
                            space?.space_capacity >= capacityFilterValue[0] &&
                            space?.space_capacity <= capacityFilterValue[1];
                        console.log(
                            'filter: FILTER_SPACE_CAPACITY_ACTION_NAME',
                            space?.space_capacity,
                            space?.space_external_book_url,
                            capacityFilterValue[0],
                            capacityFilterValue[1],
                            '=',
                            capacityResult,
                        );
                        return capacityResult;
                    } else if (
                        filter?.facility_special_action === FILTER_BOOKABLE_ACTION_NAME &&
                        !selectedFiltersInGroup.includes(FILTER_CAPACITY_TYPE_ID)
                    ) {
                        // we only check the bookable action on its own if we aren't checking the capacity action
                        console.log('filter: FILTER_BOOKABLE_ACTION_NAME');
                        return isBookable(space);
                    } else {
                        // we could specifically exclude FILTER_BOOKABLE_ACTION_NAME here, but we dont need to because it doesnt have a matching filter
                        // regular checkbox from admin-managed facility-types
                        const result = spaceFacilityTypes?.includes(filterId);
                        console.log('filter: default - check', filterId, 'is in', spaceFacilityTypes, '=', result);
                        return result;
                    }
                });
                console.log('hasMatchInGroup=', hasMatchInGroup);
                if (!hasMatchInGroup) {
                    return false;
                }
            }
        }
        return true;
    }

    const nextFacilityTypeId = filteredFacilityTypeList => {
        return (
            Math.max(...filteredFacilityTypeList?.data?.facility_type_groups?.map(g => g?.facility_type_group_id)) + 1
        );
    };
    const getFilteredFacilityTypeList = (bookableSpacesRoomList, facilityTypeList) => {
        // get a list of the filters used in spaces
        const spaceFilters = bookableSpacesRoomList?.data?.locations
            ?.filter(space => space.space_campus_id === selectedCampus)
            ?.flatMap(space => space?.facility_types || [])
            ?.map(facilityType => facilityType?.facility_type_id);
        console.log('getFilteredFacilityTypeList selectedCampus=', selectedCampus, 'spaceFilters=', spaceFilters);
        const spaceFiltersSet = new Set(spaceFilters);
        console.log('getFilteredFacilityTypeList spaceFiltersSet=', spaceFiltersSet);

        // filter facility types so we only show the checkboxes where there is an associated space
        // (this will remove the group completely if it has no shown checkboxes)
        const filteredFacilityTypeList = {
            ...facilityTypeList,
            data: {
                ...facilityTypeList?.data,
                facility_type_groups: facilityTypeList?.data?.facility_type_groups
                    ?.map(group => ({
                        ...group,
                        facility_type_children: (group?.facility_type_children || [])?.filter(child =>
                            spaceFiltersSet?.has(child?.facility_type_id),
                        ),
                    }))
                    ?.filter(group => group?.facility_type_children?.length > 0),
            },
        };
        console.log('filteredFacilityTypeList=', filteredFacilityTypeList);

        // manually add a "Currently Open" filter
        const filterOpenFacilityType = filteredFacilityTypeList?.data?.facility_type_groups && {
            facility_type_group_id: nextFacilityTypeId(filteredFacilityTypeList),
            facility_type_group_name: FACILITY_TYPE_NAME_CURRENTLY_OPEN,
            facility_type_group_order: -999, // force to top of list
            facility_type_group_loads_open: 1,
            facility_type_group_type: 'choose-many',
            filterType: FACILITY_TYPE_CHECKBOX, // what sort of filter is this? checkbox and slider available
            facility_type_children: [
                {
                    facility_type_id: 9001, // must be unique!
                    facility_type_name: 'Currently open',
                    facility_special_action: FILTER_CURRENTLY_OPEN_ACTION_NAME,
                    facility_type: FACILITY_TYPE_CHECKBOX,
                },
            ],
        };
        !!filterOpenFacilityType && filteredFacilityTypeList?.data?.facility_type_groups?.push(filterOpenFacilityType);

        // manually add a "Bookable/Choose number of people" filter
        const filterCapacityFacilityType = filteredFacilityTypeList?.data?.facility_type_groups && {
            facility_type_group_id: nextFacilityTypeId(filteredFacilityTypeList),
            facility_type_group_name: FACILITY_TYPE_NAME_CAPACITY,
            facility_type_group_order: -998, // force to second in list
            facility_type_group_loads_open: 1,
            facility_type_group_type: 'choose-many',
            filterType: FACILITY_TYPE_CHECKBOX, // what sort of filter is this? checkbox and slider available
            facility_type_children: [
                {
                    facility_type_id: FILTER_BOOKABLE_TYPE_ID, // must be unique!
                    facility_type_name: 'Bookable',
                    facility_special_action: FILTER_BOOKABLE_ACTION_NAME,
                    facility_type: FACILITY_TYPE_CHECKBOX,
                },
                {
                    facility_type_id: FILTER_CAPACITY_TYPE_ID, // must be unique!
                    facility_type_name: 'Space capacity',
                    facility_special_action: FILTER_SPACE_CAPACITY_ACTION_NAME,
                    facility_type: FACILITY_TYPE_SLIDER,
                },
            ],
        };
        !!filterOpenFacilityType &&
            filteredFacilityTypeList?.data?.facility_type_groups?.push(filterCapacityFacilityType);

        console.log(
            'getFilteredFacilityTypeList::filteredFacilityTypeList=',
            filteredFacilityTypeList?.data?.facility_type_groups,
        );
        return filteredFacilityTypeList;
    };
    const toggleFilterPopupVisibility = e => {
        setShowFilterSelectorPopup(!showFilterSelectorPopup);
    };
    const toggleSpacesListPopupVisibility = e => {
        setShowSpacesSelectorPopup(!showSpacesSelectorPopup);
    };
    const handleFavouriteAction = async (action, spaceId) => {
        /* istanbul ignore next */
        if (isFavouriteActionInProgress) return;
        const isAddFavouriteAction = action === 'addSpaceFavourite';
        setIsFavouriteActionInProgress(true);
        try {
            await actions[action](spaceId);
            displayToastMessage(isAddFavouriteAction ? 'Space added to favourites' : 'Space removed from favourites');
        } catch {
            displayToastErrorMessage(
                isAddFavouriteAction
                    ? 'Sorry, an error occurred - the space was not added to favourites.'
                    : 'Sorry, an error occurred - the space was not removed from favourites.',
            );
        } finally {
            setTimeout(() => {
                setIsFavouriteActionInProgress(false);
            }, 1000);
        }
    };

    function isSpaceFavourited(space) {
        return spacesFavouritesList?.some(fav => fav.space_id === space?.space_id);
    }

    // Memoize so that MazeMaps state changes (isMazeMapScriptReady, isMazeMapReady, mapContainer)
    // don't cause SidebarSpacesList to receive a new array reference and re-render unnecessarily.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const sortedSpaceLocations = React.useMemo(() => {
        const ftg = {};
        getFilteredFacilityTypeList(bookableSpacesRoomList, facilityTypeList)?.data?.facility_type_groups?.forEach(
            group => {
                group?.facility_type_children?.forEach(child => {
                    ftg[child?.facility_type_id] = group?.facility_type_group_id;
                });
            },
        );
        const filtered = bookableSpacesRoomList?.data?.locations?.filter(space =>
            showSpace(space, ftg, selectedFacilityTypes, selectedCampus),
        );
        if (!filtered) return filtered;
        return [...filtered].sort((a, b) => {
            const aFav = spacesFavouritesList?.some(fav => fav.space_id === a?.space_id);
            const bFav = spacesFavouritesList?.some(fav => fav.space_id === b?.space_id);
            if (aFav && !bFav) return -1;
            /* istanbul ignore next */
            if (!aFav && bFav) return 1;
            return 0;
        });
        // capacityFilterValue is read inside showSpace via closure; include it so the list
        // recomputes when the slider changes even though it is not a direct parameter.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        bookableSpacesRoomList,
        facilityTypeList,
        selectedFacilityTypes,
        capacityFilterValue,
        spacesFavouritesList,
        selectedCampus,
    ]);
    const visibleSpacesCountBadge = () => {
        return sortedSpaceLocations?.length > 0 &&
            sortedSpaceLocations?.length < bookableSpacesRoomList?.data?.locations?.length ? (
            <Badge
                badgeContent={sortedSpaceLocations?.length}
                max={bookableSpacesRoomList?.data?.locations?.length}
                color="primary"
                style={{ marginRight: '0.3rem' }} // it tries to sit too far to the right
                data-testid="space-space-count"
            />
        ) : null;
    };

    const handleMarkerClick = useCallback(
        (e, space) => {
            // Stop the click from opening the popup
            e?.originalEvent?.stopPropagation();

            // scroll the spaces sidebar to the relevant space
            const spaceElement = document.getElementById(`space-${space?.space_id}`);
            !!spaceElement &&
                typeof spaceElement?.scrollIntoView === 'function' &&
                spaceElement?.scrollIntoView({
                    behavior: 'smooth',
                });

            highlightPanel(space);

            !!spaceElement && spaceElement?.focus();

            // if we opened one earlier, close it now (so they don't have masses of them open)
            if (!!previousToggledSpaceButton) {
                previousToggledSpaceButton?.click();
            }

            // expand it, if not already open
            const toggleSpaceButton = document.getElementById(`toggle-panel-button-space-${space?.space_id}`);
            if (
                !!toggleSpaceButton &&
                toggleSpaceButton.hasAttribute('aria-expanded') &&
                toggleSpaceButton.getAttribute('aria-expanded') === 'false'
            ) {
                toggleSpaceButton.click();
                setPreviousToggledSpaceButton(toggleSpaceButton);
            }
        },
        [previousToggledSpaceButton],
    );

    const handleNavigationClose = useCallback(() => {
        setActiveNavigationSpace(null);
    }, []);

    const activeFilterCount = selectedFacilityTypes?.filter(ft => !!ft?.selected || !!ft?.unselected)?.length;
    const campusCentre = React.useMemo(
        () => getLatLngCentreOfCampus(bookableSpacesRoomList?.data?.locations, selectedCampus),
        [bookableSpacesRoomList?.data?.locations, selectedCampus],
    );

    return (
        <StyledBookableSpacesListWrapperDiv>
            {(() => {
                if (!!bookableSpacesRoomListLoading || !!weeklyHoursLoading || !!facilityTypeListLoading) {
                    return (
                        <Grid container spacing={3} data-testid="library-spaces">
                            <StyledBookableSpaceGridItem item xs={12} md={9}>
                                <InlineLoader message="Loading" />
                            </StyledBookableSpaceGridItem>
                        </Grid>
                    );
                } else if (!!bookableSpacesRoomListError || !!facilityTypeListError) {
                    // but not weeklyHoursError as we handle bad hours internally
                    return (
                        <StandardPage title="Library spaces">
                            <p data-testid="spaces-error">Something went wrong - please try again later.</p>
                        </StandardPage>
                    );
                } else if (
                    !bookableSpacesRoomList?.data?.locations ||
                    bookableSpacesRoomList?.data?.locations?.length === 0
                ) {
                    return (
                        <StandardPage title="Library spaces">
                            <p data-testid="no-spaces">No locations found yet - please try again soon.</p>
                        </StandardPage>
                    );
                } else {
                    return (
                        <StyledLayoutWrapper data-testid="library-spaces">
                            <div>
                                <StyledSidebarTab
                                    id="toggleFilterButton"
                                    data-testid="spaces-open-filter-button"
                                    onClick={() => toggleFilterPopupVisibility()}
                                    title={showFilterSelectorPopup ? 'Hide filters' : 'Show filters'}
                                    aria-expanded={showFilterSelectorPopup}
                                    aria-label={showFilterSelectorPopup ? 'Hide filters' : 'Show filters'}
                                    className="filterTab"
                                    style={{ left: showFilterSelectorPopup ? 'min(20rem, 50%)' : '0' }}
                                >
                                    {showFilterSelectorPopup ? (
                                        <ChevronLeftIcon fontSize="small" />
                                    ) : (
                                        <ChevronRightIcon fontSize="small" />
                                    )}
                                    {activeFilterCount > 0 && <span className="tab-count">{activeFilterCount}</span>}
                                </StyledSidebarTab>
                                <SidebarFilters
                                    facilityTypeList={facilityTypeList}
                                    facilityTypeListLoading={facilityTypeListLoading}
                                    facilityTypeListError={facilityTypeListError}
                                    selectedFacilityTypes={selectedFacilityTypes}
                                    setSelectedFacilityTypes={setSelectedFacilityTypes}
                                    filteredFacilityTypeList={getFilteredFacilityTypeList(
                                        bookableSpacesRoomList,
                                        facilityTypeList,
                                    )}
                                    suppliedClassName={showFilterSelectorPopup ? 'popupFilterList' : 'hide'}
                                    minimumSpaceCapacity={minimumSpaceCapacity}
                                    maximumSpaceCapacity={maximumSpaceCapacity}
                                    capacityFilterValue={capacityFilterValue}
                                    setCapacityFilterValue={setCapacityFilterValue}
                                    campusList={campusList}
                                    selectedCampus={selectedCampus}
                                    handleCampusSelection={handleCampusSelection}
                                    activeFilterCount={activeFilterCount}
                                />
                            </div>
                            {isDesktopView && (
                                <>
                                    <StyledSidebarTab
                                        id="toggleSpacesListButton"
                                        data-testid="spaces-open-spaces-list-button"
                                        onClick={() => toggleSpacesListPopupVisibility()}
                                        title={showSpacesSelectorPopup ? 'Hide spaces list' : 'Show spaces list'}
                                        aria-expanded={showSpacesSelectorPopup}
                                        aria-label={showSpacesSelectorPopup ? 'Hide spaces list' : 'Show spaces list'}
                                        className="spacesTab"
                                        style={{ right: showSpacesSelectorPopup ? '20rem' : '0' }}
                                    >
                                        {showSpacesSelectorPopup ? (
                                            <ChevronRightIcon fontSize="small" />
                                        ) : (
                                            <ChevronLeftIcon fontSize="small" />
                                        )}
                                        {sortedSpaceLocations?.length > 0 &&
                                            sortedSpaceLocations?.length <
                                                bookableSpacesRoomList?.data?.locations?.length && (
                                                <span className="tab-count">{sortedSpaceLocations.length}</span>
                                            )}
                                    </StyledSidebarTab>
                                    <div
                                        className={
                                            showSpacesSelectorPopup
                                                ? 'spacesListHolder spacesList' // only controls placement of +/- on map
                                                : 'spacesListHolder hide'
                                        }
                                    >
                                        <SidebarSpacesList
                                            filteredSpaceLocations={sortedSpaceLocations}
                                            totalSpaceCount={bookableSpacesRoomList?.data?.locations?.length || 0}
                                            activeFilterCount={activeFilterCount}
                                            weeklyHours={weeklyHours}
                                            weeklyHoursLoading={weeklyHoursLoading}
                                            weeklyHoursError={weeklyHoursError}
                                            StyledStandardCard={StyledStandardCard}
                                            showAllData={!isMobileView}
                                            suppliedClassName={showSpacesSelectorPopup ? 'popupSpacesSidebar' : 'hide'}
                                            spacesFavouritesList={spacesFavouritesList}
                                            isLoggedIn={isLoggedIn}
                                            onFavouriteToggle={handleFavouriteAction}
                                            isFavouriteActionInProgress={isFavouriteActionInProgress}
                                            onSpaceExpand={handleSpaceExpand}
                                        />
                                    </div>
                                </>
                            )}

                            <div id="mapWrapper" ref={mapWrapperRef} className="mapHolder" style={{ height: '100%' }}>
                                <BookableSpacesMap
                                    ref={mapRef}
                                    sortedSpaceLocations={sortedSpaceLocations}
                                    spacesFavouritesList={spacesFavouritesList}
                                    onMarkerClick={handleMarkerClick}
                                    onNavigate={handleNavigate}
                                    activeNavigationSpaceId={activeNavigationSpace?.space_id ?? null}
                                    centreLatLong={campusCentre}
                                    navigationTarget={activeNavigationSpace}
                                    navigationOrigin={campusCentre}
                                    onNavigationClose={handleNavigationClose}
                                />
                            </div>
                        </StyledLayoutWrapper>
                    );
                }
            })()}
        </StyledBookableSpacesListWrapperDiv>
    );
};

BookableSpacesList.propTypes = {
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
    spacesFavouritesList: PropTypes.any,
};

export default React.memo(BookableSpacesList);
