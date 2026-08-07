/* eslint-disable camelcase */
import React, { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { loadDrupalArticles } from 'data/actions/drupalArticlesActions';

import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';

import { Box, Button, Grid, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';

import { breadcrumbs } from 'config/routes';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { addClass, removeClass, standardText } from 'helpers/general';
import { useAccountContext } from 'context';

import BookableSpacesWrapper from 'modules/Pages/BookableSpaces/SpacesListPage/SimpleListPage/components/BookableSpacesWrapper';
import SidebarSpacesList from 'modules/Pages/BookableSpaces/SpacesListPage/MapListPage/components/SidebarSpacesList';

import BookableSpacesMap from 'modules/Pages/BookableSpaces/Shared/BookableSpacesMap';
import SidebarFilters from 'modules/Pages/BookableSpaces/Shared/SidebarFilters';
import {
    FACILITY_TYPE_CHECKBOX,
    FACILITY_TYPE_SLIDER,
    FILTER_BOOKABLE_ACTION_NAME,
    FILTER_BOOKABLE_TYPE_ID,
    FILTER_CAPACITY_TYPE_ID,
    FILTER_CURRENTLY_OPEN_ACTION_NAME,
    FILTER_DISPLAY_ON_MAP,
    FILTER_DISPLAY_ON_BOTH,
    FILTER_DISPLAY_ON_SIMPLE,
    FILTER_SPACE_CAPACITY_ACTION_NAME,
    getActiveSelectedFacilityTypes,
    getFlatFacilityTypeList,
    isBookable,
    JOURNEY_LIVE_FILTER_STATE_STORAGE_KEY,
    normalizeFilterDisplayOn,
} from 'modules/Pages/BookableSpaces/Shared/spacesHelpers';
import {
    displayToastErrorMessage,
    displayToastMessage,
} from 'modules/Pages/Admin/BookableSpaces/bookableSpacesAdminHelpers';
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
        height: '100%',
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

export const buildJourneyNavigationUrl = ({
    currentUrl,
    selectedFacilityTypes,
    selectedCampus,
    selectedLibrary,
    capacityFilterValue,
    showFavouriteSpacesOnly = false,
}) => {
    const url = new URL(currentUrl);
    const hashValue = url.hash || '';
    const isHashRouting = hashValue.startsWith('#/');

    const hasSelectedFacilityFilters = (selectedFacilityTypes || []).some(filter => filter?.selected);
    const normalizedSelectedCampus = Number(selectedCampus);
    const normalizedSelectedLibrary = Number(selectedLibrary);
    const hasActiveCampusSelection = Number.isFinite(normalizedSelectedCampus) && normalizedSelectedCampus > 1;
    const hasActiveLibrarySelection = Number.isFinite(normalizedSelectedLibrary) && normalizedSelectedLibrary !== 0;
    const hasActiveCapacitySelection = Array.isArray(capacityFilterValue) && capacityFilterValue.length > 0;
    const hasActiveFavouritesSelection = Boolean(showFavouriteSpacesOnly);
    const hasActiveJourneyFilters =
        hasSelectedFacilityFilters ||
        hasActiveCampusSelection ||
        hasActiveLibrarySelection ||
        hasActiveCapacitySelection ||
        hasActiveFavouritesSelection;

    if (isHashRouting) {
        url.search = '';
        url.hash = hasActiveJourneyFilters ? '#/spaces/results' : '#/spaces';
        return url.toString();
    }

    url.pathname = hasActiveJourneyFilters ? '/spaces/results' : '/spaces';
    url.search = '';
    url.hash = '';

    return url.toString();
};

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
    drupalArticleList,
    forceAdvanced = false,
    // isFavouriteActionInProgress,
}) => {
    const { account } = useAccountContext();
    const isLoggedIn = !!account?.id;

    const dispatch = useDispatch();
    React.useEffect(() => {
        if (!drupalArticleList || drupalArticleList?.length < 1) {
            dispatch(loadDrupalArticles());
        }
    }, [drupalArticleList, dispatch]);

    const servicesAndSpacesArticles = React.useMemo(
        () =>
            drupalArticleList?.filter(article =>
                article?.categories?.some(cat => cat.toLowerCase() === 'services and spaces'),
            ) ?? [],
        [drupalArticleList],
    );

    const theme = useTheme();
    const isMobileView = useMediaQuery(theme.breakpoints.down('sm')) || false;
    const _isTabletViewJust = useMediaQuery(theme.breakpoints.down('lg')) || false;
    const isTabletView = isMobileView ? false : _isTabletViewJust;
    const isDesktopView = !isTabletView && !isMobileView;

    const FACILITY_TYPE_NAME_AVAILABILITY = 'Availability';

    const FIRST_CAMPUS_ID = 1;
    const ALL_CAMPUSES_ID = 0;
    const ALL_LIBRARIES_ID = 0;
    const ZOOM_IN_TO_LIBRARY = 20;

    const [campusList, setCampusList] = useState([]);
    const [librariesForCampus, setCampusLibraryList] = useState([]);

    const [selectedFacilityTypes, setSelectedFacilityTypes2] = useState([]);
    const setSelectedFacilityTypes = useCallback(x => {
        return setSelectedFacilityTypes2(x);
    }, []);
    const [showFilterSelectorPopup, setShowFilterSelectorPopup] = useState(!isMobileView);
    const [showSpacesSelectorPopup, setShowSpacesSelectorPopup] = useState(isDesktopView);
    const [expandedSpaceId, setExpandedSpaceId] = useState(null);
    const [isFavouriteActionInProgress, setIsFavouriteActionInProgress] = useState(false);
    const [showFavouriteSpacesOnly, setShowFavouriteSpacesOnly] = useState(false);
    const [isMapReady, setIsMapReady] = useState(false);
    const useJourneyExperience = React.useMemo(() => !forceAdvanced, [forceAdvanced]);

    const mapRef = useRef(null);

    const highlightPanel = space => {
        const spacePanel = document.querySelector(`#space-${space?.space_id} > div:first-of-type`);
        addClass(spacePanel, 'highlightPanel');
        addClass(spacePanel, 'mobileHighlightPanel');

        setTimeout(() => {
            removeClass(spacePanel, 'highlightPanel');
        }, 3000);
    };

    const handleSpaceSelect = useCallback(space => {
        highlightPanel(space);

        // show space's location on the map
        mapRef.current?.flyToSpace(space, ZOOM_IN_TO_LIBRARY);
    }, []);

    const [selectedLibrary, setSelectedLibrary] = React.useState(ALL_LIBRARIES_ID);

    const handleSpaceToggle = useCallback(
        (space, shouldExpand) => {
            if (!space?.space_id) {
                return;
            }

            if (shouldExpand) {
                setExpandedSpaceId(space.space_id);
                handleSpaceSelect(space);
                return;
            }

            if (expandedSpaceId === space.space_id) {
                setExpandedSpaceId(null);
            }
        },
        [expandedSpaceId, handleSpaceSelect],
    );

    const [cookies, setCookie, removeCookie] = useCookies();
    const ALL_CAMPUSES_SELECTION_STORAGE_KEY = 'bookableSpacesAllCampusesSelected';

    const getCampusCookieValue = React.useCallback(() => {
        const spacesPreferredCampus = cookies?.UQLspacesPreferredCampus;
        if (typeof spacesPreferredCampus === 'string' && spacesPreferredCampus.trim() !== '') {
            return spacesPreferredCampus;
        }

        if (typeof document === 'undefined') {
            return null;
        }

        const campusCookie = document.cookie
            .split(';')
            .map(cookie => cookie.trim())
            .find(cookie => cookie.startsWith('UQLspacesPreferredCampus='));

        if (!campusCookie) {
            return null;
        }

        const cookieValue = campusCookie.split('=').slice(1).join('=');
        return cookieValue ? decodeURIComponent(cookieValue) : null;
    }, [cookies?.UQLspacesPreferredCampus]);
    const getPersistedAllCampusesSelection = React.useCallback(() => {
        if (typeof window === 'undefined' || !window.sessionStorage) {
            return false;
        }
        return window.sessionStorage.getItem(ALL_CAMPUSES_SELECTION_STORAGE_KEY) === 'true';
    }, []);

    const correctedCampusId = useCallback(
        campusId => {
            const normalizedCampusId = Number(campusId);
            if (normalizedCampusId === ALL_CAMPUSES_ID) {
                return ALL_CAMPUSES_ID;
            }
            if (!Number.isFinite(normalizedCampusId) || normalizedCampusId <= 0) {
                return ALL_CAMPUSES_ID;
            }
            if (!campusList?.length) {
                return ALL_CAMPUSES_ID;
            }
            return campusList?.find(c => c.campus_id === normalizedCampusId) ? normalizedCampusId : ALL_CAMPUSES_ID;
        },
        [campusList],
    );
    const getCampusInitialState = React.useCallback(() => {
        if (getPersistedAllCampusesSelection()) {
            return ALL_CAMPUSES_ID;
        }

        const spacesPreferredCampus = getCampusCookieValue();
        if (typeof spacesPreferredCampus === 'string' && spacesPreferredCampus.trim() !== '') {
            const parsedCampusId = Number.parseInt(spacesPreferredCampus, 10);
            if (Number.isNaN(parsedCampusId) || parsedCampusId === ALL_CAMPUSES_ID) {
                return ALL_CAMPUSES_ID;
            }
            return parsedCampusId;
        }
        return ALL_CAMPUSES_ID;
    }, [getCampusCookieValue, getPersistedAllCampusesSelection]);
    const [selectedCampus, setSelectedCampus] = React.useState(() => getCampusInitialState());
    const hasInitialisedCampusFromCookie = React.useRef(false);

    React.useEffect(() => {
        if (!campusList?.length || hasInitialisedCampusFromCookie.current) {
            return;
        }

        const campusIdFromStore = getCampusInitialState();
        const derivedCampusId = correctedCampusId(campusIdFromStore);
        if (selectedCampus !== derivedCampusId) {
            setSelectedCampus(derivedCampusId);
        }
        hasInitialisedCampusFromCookie.current = true;
    }, [campusList, correctedCampusId, getCampusInitialState, selectedCampus]);

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

        const normalizedSelectedCampusId = Number(selectedCampusId);
        const fallbackCampusId =
            normalizedSelectedCampusId === ALL_CAMPUSES_ID ? FIRST_CAMPUS_ID : normalizedSelectedCampusId;
        const spacesListForCampus = spacesList?.filter(s => s.space_campus_id === fallbackCampusId);

        const buildingsOnCampus =
            !!spacesListForCampus &&
            Object.values(
                // just get one location per building, to stop reweighting of space locations
                spacesListForCampus?.reduce(
                    (
                        acc,
                        {
                            space_building_name: spaceBuildingName,
                            space_building_number: spaceBuildingNumber,
                            space_latitude: spaceLatitude,
                            space_longitude: spaceLongitude,
                            space_campus_id: spaceCampusId,
                            space_campus_name: spaceCampusName,
                        },
                    ) => {
                        if (!acc[spaceBuildingNumber]) {
                            acc[spaceBuildingNumber] = {
                                building_number: spaceBuildingNumber,
                                building_name: spaceBuildingName,
                                building_latitude: spaceLatitude,
                                building_longitude: spaceLongitude,
                                building_campus_id: spaceCampusId,
                                building_campus_name: spaceCampusName,
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

        buildingsOnCampus?.map(building => {
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
            fallbackCampusId,
            buildingsOnCampus.at(0).building_campus_name,
        );
    }

    const hasUserOverriddenCampusSelectionRef = React.useRef(false);
    const lastPersistedCampusIdRef = React.useRef(null);

    const persistCampusPreference = useCallback(
        campusSelection => {
            const normalizedCampusSelection = correctedCampusId(campusSelection);
            if (lastPersistedCampusIdRef.current === normalizedCampusSelection) {
                return;
            }

            lastPersistedCampusIdRef.current = normalizedCampusSelection;

            if (normalizedCampusSelection === ALL_CAMPUSES_ID) {
                removeCookie('UQLspacesPreferredCampus', { path: '/' });
                if (typeof window !== 'undefined' && window.sessionStorage) {
                    window.sessionStorage.setItem(ALL_CAMPUSES_SELECTION_STORAGE_KEY, 'true');
                }
                return;
            }

            if (typeof window !== 'undefined' && window.sessionStorage) {
                window.sessionStorage.removeItem(ALL_CAMPUSES_SELECTION_STORAGE_KEY);
            }

            const current = new Date();
            const nextYear = new Date();
            nextYear.setFullYear(current.getFullYear() + 1);
            setCookie('UQLspacesPreferredCampus', normalizedCampusSelection, { expires: nextYear, path: '/' });
        },
        [correctedCampusId, removeCookie, setCookie],
    );

    React.useEffect(() => {
        if (!hasInitialisedCampusFromCookie.current || !hasUserOverriddenCampusSelectionRef.current) {
            return;
        }

        persistCampusPreference(selectedCampus);
    }, [persistCampusPreference, selectedCampus]);

    const handleCampusSelection = e => {
        const campusId = Number(e?.target?.value);
        if (Number.isNaN(campusId)) {
            return;
        }
        hasUserOverriddenCampusSelectionRef.current = true;
        setSelectedCampus(campusId);

        setSelectedLibrary(ALL_LIBRARIES_ID); // clear the library on changing campus

        setExpandedSpaceId(null);
        persistCampusPreference(campusId);

        const locationOfCentreOfCampus = getLatLngCentreOfCampus(bookableSpacesRoomList?.data?.locations, campusId);
        !!locationOfCentreOfCampus && mapRef.current?.flyToSpace(locationOfCentreOfCampus);
    };

    const handleLibrarySelection = e => {
        const libraryId = Number(e?.target?.value);
        if (Number.isNaN(libraryId)) {
            return;
        }
        hasUserOverriddenCampusSelectionRef.current = true;
        setSelectedLibrary(libraryId);

        if (libraryId === ALL_LIBRARIES_ID) {
            // all libraries chosen
            const locationOfCentreOfCampus = getLatLngCentreOfCampus(
                bookableSpacesRoomList?.data?.locations,
                selectedCampus,
            );
            !!locationOfCentreOfCampus && mapRef.current?.flyToSpace(locationOfCentreOfCampus);
        } else {
            // particular library chosen
            const libraryDetails = bookableSpacesRoomList?.data?.locations?.find(s => s.space_library_id === libraryId);
            !!libraryDetails && mapRef.current?.flyToSpace(libraryDetails, ZOOM_IN_TO_LIBRARY);
        }
    };

    const minimumSpaceCapacity = 1;
    const [capacityFilterValue, setCapacityFilterValue] = React.useState([]);
    const [maximumSpaceCapacity, setMaximumSpaceCapacity] = React.useState(50);
    const JOURNEY_VIEW_STATE_STORAGE_KEY = 'bookableSpacesJourneyViewState';

    const resetAllSpaceFilters = useCallback(() => {
        const resetFacilityTypes = (selectedFacilityTypes || []).map(filter => ({
            ...filter,
            selected: false,
            unselected: false,
        }));

        setSelectedFacilityTypes(resetFacilityTypes);
        setCapacityFilterValue([minimumSpaceCapacity, maximumSpaceCapacity]);
        setShowFavouriteSpacesOnly(false);

        if (typeof window !== 'undefined') {
            window.sessionStorage.removeItem(JOURNEY_LIVE_FILTER_STATE_STORAGE_KEY);
            window.sessionStorage.setItem(
                JOURNEY_VIEW_STATE_STORAGE_KEY,
                JSON.stringify({ view: 'results', intentId: null, spaceId: null }),
            );
        }
    }, [maximumSpaceCapacity, minimumSpaceCapacity, selectedFacilityTypes, setSelectedFacilityTypes]);

    const goToJourney = () => {
        const nextUrl = buildJourneyNavigationUrl({
            currentUrl: window.location.href,
            selectedFacilityTypes,
            selectedCampus,
            selectedLibrary,
            capacityFilterValue,
            showFavouriteSpacesOnly,
        });
        window.location.assign(nextUrl);
    };

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
            const spaceMaxCapacity = bookableSpacesRoomList?.data?.locations?.reduce(
                function findMax(highestCapacity, current) {
                    return highestCapacity &&
                        typeof current.space_capacity === 'number' &&
                        highestCapacity.space_capacity < current.space_capacity
                        ? current
                        : highestCapacity;
                },
            );
            const calculatedMaxCapaity = !!bookableSpacesRoomList?.data?.locations && spaceMaxCapacity?.space_capacity;
            setMaximumSpaceCapacity(calculatedMaxCapaity);
            if (!Array.isArray(capacityFilterValue) || capacityFilterValue.length === 0) {
                setCapacityFilterValue([minimumSpaceCapacity, calculatedMaxCapaity]);
            }

            const currentCampusList = Object.values(
                bookableSpacesRoomList?.data?.locations?.reduce(
                    (
                        acc,
                        {
                            space_campus_id: spaceCampusId,
                            space_campus_name: spaceCampusName,
                            space_campus_number: spaceCampusNumber,
                        },
                    ) => {
                        if (!acc[spaceCampusId]) {
                            acc[spaceCampusId] = {
                                campus_id: spaceCampusId,
                                campus_number: spaceCampusNumber,
                                campus_name: spaceCampusName,
                                campus_space_count: 0,
                            };
                        }
                        acc[spaceCampusId].campus_space_count++;
                        return acc;
                    },
                    {},
                ),
            );
            setCampusList(currentCampusList);

            // build list for library selector
            // get libraries on this campus, one entry per library (not per space)
            const currentLibraryList = Object.values(
                bookableSpacesRoomList?.data?.locations?.reduce(
                    (
                        acc,
                        {
                            space_campus_id: spaceCampusId,
                            space_library_id: spaceLibraryId,
                            space_library_name: spaceLibraryName,
                        },
                    ) => {
                        const shouldIncludeLibraryForCurrentCampus =
                            selectedCampus === ALL_CAMPUSES_ID || spaceCampusId === selectedCampus;

                        if (shouldIncludeLibraryForCurrentCampus) {
                            if (!acc[spaceLibraryId]) {
                                acc[spaceLibraryId] = {
                                    library_id: spaceLibraryId,
                                    library_name: spaceLibraryName,
                                    library_space_count: 0,
                                };
                            }
                            acc[spaceLibraryId].library_space_count++;
                        }
                        return acc;
                    },
                    {},
                ),
            );
            // add an 'all' option
            currentLibraryList?.length > 0 &&
                currentLibraryList.unshift({
                    library_id: ALL_LIBRARIES_ID,
                    library_name: 'All libraries',
                    library_space_count: 0,
                });
            currentLibraryList?.length > 0 && setCampusLibraryList(currentLibraryList);
        }
    }, [
        selectedCampus,
        bookableSpacesRoomList,
        bookableSpacesRoomListError,
        bookableSpacesRoomListLoading,
        capacityFilterValue,
    ]);

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
            for (const [, dayData] of Object.entries(week)) {
                if (dayData?.date === currentDate) {
                    return dayData?.times?.currently_open ?? null;
                }
            }
        }
        return null; // Date not found in data
    }

    function showSpace(space, facilityTypeToGroup, selectedFacilityTypes, selectedCurrentCampus, selectedLibrary) {
        if (space?.space_draftmode) {
            return false;
        }

        if (showFavouriteSpacesOnly && isLoggedIn) {
            const isFavouriteSpace = (spacesFavouritesList || []).some(
                favourite => String(favourite?.space_id) === String(space?.space_id),
            );
            if (!isFavouriteSpace) {
                return false;
            }
        }

        if (selectedCurrentCampus !== ALL_CAMPUSES_ID && space.space_campus_id !== selectedCurrentCampus) {
            return false;
        }

        if (!!selectedLibrary && space.space_library_id !== selectedLibrary) {
            return false;
        }

        const spaceFacilityTypes = space?.facility_types?.map(item => item?.facility_type_id);

        // Create a map of facility_type_id to group_id for quick lookup
        // Group selected filters by their facility type group
        const selectedFiltersByGroup = {};
        const rejectedFilters = [];

        selectedFacilityTypes?.forEach(filter => {
            if (filter?.selected) {
                const groupId = facilityTypeToGroup[filter?.facility_type_id] ?? filter?.facility_type_group_id;
                if (groupId !== null && groupId !== undefined) {
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
                const hasMatchInGroup = selectedFiltersInGroup?.some(filterId => {
                    const filter = selectedFacilityTypes?.find(f => f?.facility_type_id === filterId);
                    if (filter?.facility_special_action === FILTER_CURRENTLY_OPEN_ACTION_NAME) {
                        return isLocationOpen(space?.space_opening_hours_id, weeklyHours);
                    } else if (
                        filter?.facility_special_action === FILTER_SPACE_CAPACITY_ACTION_NAME &&
                        selectedFiltersInGroup.includes(FILTER_BOOKABLE_TYPE_ID)
                    ) {
                        return (
                            isBookable(space) &&
                            !!space?.space_capacity &&
                            space?.space_capacity >= capacityFilterValue[0] &&
                            space?.space_capacity <= capacityFilterValue[1]
                        );
                    } else if (
                        filter?.facility_special_action === FILTER_BOOKABLE_ACTION_NAME &&
                        !selectedFiltersInGroup.includes(FILTER_CAPACITY_TYPE_ID)
                    ) {
                        // we only check the bookable action on its own if we aren't checking the capacity action
                        return isBookable(space);
                    } else {
                        // We could specifically exclude FILTER_BOOKABLE_ACTION_NAME here, but we don't need to because
                        // it doesn't have a matching filter.
                        // regular checkbox from admin-managed facility-types
                        return spaceFacilityTypes?.includes(filterId);
                    }
                });
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
    const getFilteredFacilityTypeList = useCallback(
        (bookableSpacesRoomList, facilityTypeList) => {
            // get a list of the filters used in spaces
            const campusFilterValue = correctedCampusId(selectedCampus);
            const isAllCampusesSelected = campusFilterValue === ALL_CAMPUSES_ID;
            const spaceFilters = bookableSpacesRoomList?.data?.locations
                ?.filter(space => isAllCampusesSelected || space.space_campus_id === campusFilterValue)
                ?.flatMap(space => space?.facility_types || [])
                ?.map(facilityType => facilityType?.facility_type_id);
            const spaceFiltersSet = new Set(spaceFilters);

            // filter facility types so we only show the checkboxes where there is an associated space
            // (this will remove the group completely if it has no shown checkboxes)
            const filteredFacilityTypeList = {
                ...facilityTypeList,
                data: {
                    ...facilityTypeList?.data,
                    facility_type_groups: facilityTypeList?.data?.facility_type_groups
                        ?.map(group => ({
                            ...group,
                            facility_type_children: (group?.facility_type_children || [])?.filter(child => {
                                const isHiddenInPublicFilterList =
                                    child?.hide_in_public_filter_list === true ||
                                    child?.hide_in_public_filter_list === 1 ||
                                    child?.hide_in_public_filter_list === '1';
                                const displayOn = normalizeFilterDisplayOn(child?.filter_display_on);
                                const isVisibleInCurrentView =
                                    displayOn === FILTER_DISPLAY_ON_BOTH ||
                                    (useJourneyExperience && displayOn === FILTER_DISPLAY_ON_SIMPLE) ||
                                    (!useJourneyExperience && displayOn === FILTER_DISPLAY_ON_MAP);
                                return (
                                    spaceFiltersSet?.has(child?.facility_type_id) &&
                                    !isHiddenInPublicFilterList &&
                                    isVisibleInCurrentView
                                );
                            }),
                        }))
                        ?.filter(group => group?.facility_type_children?.length > 0),
                },
            };

            // manually add filters
            const filterCapacityFacilityType = filteredFacilityTypeList?.data?.facility_type_groups && {
                facility_type_group_id: nextFacilityTypeId(filteredFacilityTypeList),
                facility_type_group_name: FACILITY_TYPE_NAME_AVAILABILITY,
                facility_type_group_order: -998, // force to second in list
                facility_type_group_loads_open: 1,
                facility_type_group_type: 'choose-many',
                filterType: FACILITY_TYPE_CHECKBOX, // what sort of filter is this? checkbox and slider available
                facility_type_children: [
                    {
                        facility_type_id: 9001, // must be unique!
                        facility_type_name: 'Currently open',
                        facility_special_action: FILTER_CURRENTLY_OPEN_ACTION_NAME,
                        facility_type: FACILITY_TYPE_CHECKBOX,
                        filter_display_on: FILTER_DISPLAY_ON_BOTH,
                    },
                    {
                        facility_type_id: FILTER_BOOKABLE_TYPE_ID, // must be unique!
                        facility_type_name: 'Bookable',
                        facility_special_action: FILTER_BOOKABLE_ACTION_NAME,
                        facility_type: FACILITY_TYPE_CHECKBOX,
                        filter_display_on: FILTER_DISPLAY_ON_BOTH,
                    },
                    {
                        facility_type_id: FILTER_CAPACITY_TYPE_ID, // must be unique!
                        facility_type_name: 'Space capacity',
                        facility_special_action: FILTER_SPACE_CAPACITY_ACTION_NAME,
                        facility_type: FACILITY_TYPE_SLIDER,
                        filter_display_on: FILTER_DISPLAY_ON_BOTH,
                    },
                ],
            };
            filteredFacilityTypeList?.data?.facility_type_groups?.push(filterCapacityFacilityType);

            return filteredFacilityTypeList;
        },
        [correctedCampusId, selectedCampus, useJourneyExperience],
    );
    const filteredFacilityTypeList = React.useMemo(
        () => getFilteredFacilityTypeList(bookableSpacesRoomList, facilityTypeList),
        [bookableSpacesRoomList, facilityTypeList, getFilteredFacilityTypeList],
    );

    const hasHydratedFilterStateRef = React.useRef(false);

    const getAppliedFacilityFilters = React.useCallback(() => {
        return (selectedFacilityTypes || []).reduce((acc, filter) => {
            if (!filter?.selected) {
                return acc;
            }

            acc.push({
                facility_type_group_id: filter?.facility_type_group_id,
                facility_type_id: filter?.facility_type_id,
                selected: true,
                facility_special_action: filter?.facility_special_action,
            });
            return acc;
        }, []);
    }, [selectedFacilityTypes]);

    const persistLiveFilterState = React.useCallback(
        (nextSelectedFacilityTypes, nextSelectedCampus = selectedCampus, nextSelectedLibrary = selectedLibrary) => {
            if (typeof window === 'undefined' || !window.sessionStorage) {
                return;
            }

            const appliedFacilityFilters = (nextSelectedFacilityTypes || []).reduce((acc, filter) => {
                if (!filter?.selected) {
                    return acc;
                }

                acc.push({
                    facility_type_group_id: filter?.facility_type_group_id,
                    facility_type_id: filter?.facility_type_id,
                    selected: true,
                    facility_special_action: filter?.facility_special_action,
                });
                return acc;
            }, []);

            const normalizedCampusId = Number(nextSelectedCampus);
            const normalizedLibraryId = Number(nextSelectedLibrary);
            const hasAppliedCampusFilter =
                Number.isFinite(normalizedCampusId) && normalizedCampusId !== ALL_CAMPUSES_ID;
            const hasAppliedLibraryFilter =
                Number.isFinite(normalizedLibraryId) && normalizedLibraryId !== ALL_LIBRARIES_ID;

            const hasCapacityRange = Array.isArray(capacityFilterValue) && capacityFilterValue.length >= 2;
            const hasAppliedCapacityFilter =
                hasCapacityRange &&
                (Number(capacityFilterValue[0]) !== Number(minimumSpaceCapacity) ||
                    Number(capacityFilterValue[1]) !== Number(maximumSpaceCapacity));

            const hasAppliedFavouriteFilter = Boolean(showFavouriteSpacesOnly);

            const statePayload = {
                ...(appliedFacilityFilters.length > 0 ? { selectedFacilityTypes: appliedFacilityFilters } : {}),
                ...(hasAppliedCampusFilter ? { selectedCampus: normalizedCampusId } : {}),
                ...(hasAppliedLibraryFilter ? { selectedLibrary: normalizedLibraryId } : {}),
                ...(hasAppliedCapacityFilter ? { capacityFilterValue } : {}),
                ...(hasAppliedFavouriteFilter ? { showFavouriteSpacesOnly: true } : {}),
            };

            if (Object.keys(statePayload).length === 0) {
                window.sessionStorage.removeItem(JOURNEY_LIVE_FILTER_STATE_STORAGE_KEY);
                return;
            }

            window.sessionStorage.setItem(JOURNEY_LIVE_FILTER_STATE_STORAGE_KEY, JSON.stringify(statePayload));
        },
        [
            ALL_CAMPUSES_ID,
            ALL_LIBRARIES_ID,
            capacityFilterValue,
            maximumSpaceCapacity,
            minimumSpaceCapacity,
            selectedCampus,
            selectedLibrary,
            showFavouriteSpacesOnly,
        ],
    );

    React.useEffect(() => {
        if (hasHydratedFilterStateRef.current || typeof window === 'undefined' || !window.sessionStorage) {
            return;
        }

        const rawState = window.sessionStorage?.getItem(JOURNEY_LIVE_FILTER_STATE_STORAGE_KEY);
        if (!rawState) {
            hasHydratedFilterStateRef.current = true;
            return;
        }

        const flatFacilityTypeList = getFlatFacilityTypeList(filteredFacilityTypeList);
        if (!flatFacilityTypeList?.length) {
            return;
        }

        try {
            const parsedState = JSON.parse(rawState);

            const appliedFacilityFilters = Array.isArray(parsedState?.selectedFacilityTypes)
                ? parsedState.selectedFacilityTypes.filter(filter => filter?.selected)
                : [];

            if (appliedFacilityFilters.length > 0) {
                setSelectedFacilityTypes(appliedFacilityFilters);
            }
            if (parsedState?.selectedCampus !== null && parsedState?.selectedCampus !== undefined) {
                setSelectedCampus(Number(parsedState.selectedCampus));
            }
            if (parsedState?.selectedLibrary !== null && parsedState?.selectedLibrary !== undefined) {
                setSelectedLibrary(Number(parsedState.selectedLibrary));
            }
            if (Array.isArray(parsedState?.capacityFilterValue) && parsedState.capacityFilterValue.length > 0) {
                setCapacityFilterValue(parsedState.capacityFilterValue);
            }
            setShowFavouriteSpacesOnly(parsedState?.showFavouriteSpacesOnly === true);
        } catch (error) {
            // Ignore malformed state and continue with defaults.
        } finally {
            hasHydratedFilterStateRef.current = true;
        }
    }, [
        filteredFacilityTypeList,
        setCapacityFilterValue,
        setSelectedCampus,
        setSelectedFacilityTypes,
        setSelectedLibrary,
        setShowFavouriteSpacesOnly,
    ]);

    React.useEffect(() => {
        if (!hasHydratedFilterStateRef.current || typeof window === 'undefined' || !window.sessionStorage) {
            return;
        }

        persistLiveFilterState(getAppliedFacilityFilters(), selectedCampus, selectedLibrary);
    }, [
        capacityFilterValue,
        getAppliedFacilityFilters,
        persistLiveFilterState,
        selectedCampus,
        selectedLibrary,
        showFavouriteSpacesOnly,
    ]);

    const toggleFilterPopupVisibility = () => {
        setShowFilterSelectorPopup(!showFilterSelectorPopup);
    };
    const toggleSpacesListPopupVisibility = () => {
        setShowSpacesSelectorPopup(!showSpacesSelectorPopup);
    };
    const handleFavouriteAction = async (action, spaceId) => {
        /* istanbul ignore next */
        if (isFavouriteActionInProgress) {
            return;
        }
        const isAddFavouriteAction = action === 'addSpaceFavourite';
        setIsFavouriteActionInProgress(spaceId);
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

    // function isSpaceFavourited(space) {
    //     return spacesFavouritesList?.some(fav => fav.space_id === space?.space_id);
    // }

    // Memoize so that MazeMaps state changes (isMazeMapScriptReady, isMazeMapReady, mapContainer)
    // don't cause SidebarSpacesList to receive a new array reference and re-render unnecessarily.

    const sortedSpaceLocations = React.useMemo(() => {
        const allFilterTypes = {};
        getFilteredFacilityTypeList(bookableSpacesRoomList, facilityTypeList)?.data?.facility_type_groups?.forEach(
            group => {
                group?.facility_type_children?.forEach(child => {
                    allFilterTypes[child?.facility_type_id] = group?.facility_type_group_id;
                });
            },
        );
        const filtered = bookableSpacesRoomList?.data?.locations?.filter(space =>
            showSpace(space, allFilterTypes, selectedFacilityTypes, correctedCampusId(selectedCampus), selectedLibrary),
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
        selectedLibrary,
        showFavouriteSpacesOnly,
        isLoggedIn,
    ]);
    // const visibleSpacesCountBadge = () => {
    //     return sortedSpaceLocations?.length > 0 &&
    //         sortedSpaceLocations?.length < bookableSpacesRoomList?.data?.locations?.length ? (
    //         <Badge
    //             badgeContent={sortedSpaceLocations?.length}
    //             max={bookableSpacesRoomList?.data?.locations?.length}
    //             color="primary"
    //             style={{ marginRight: '0.3rem' }} // it tries to sit too far to the right
    //             data-testid="space-space-count"
    //         />
    //     ) : null;
    // };

    React.useEffect(() => {
        if (useJourneyExperience || !sortedSpaceLocations?.length || sortedSpaceLocations.length !== 1) {
            return;
        }

        const singleVisibleSpace = sortedSpaceLocations[0];
        if (!singleVisibleSpace || expandedSpaceId === singleVisibleSpace.space_id) {
            return;
        }

        const tryAutoSelect = attempt => {
            if (isMapReady && typeof mapRef.current?.flyToSpace === 'function') {
                setExpandedSpaceId(singleVisibleSpace.space_id);
                handleSpaceSelect(singleVisibleSpace);
                return;
            }

            if (attempt < 8) {
                window.setTimeout(() => tryAutoSelect(attempt + 1), 100);
            }
        };

        tryAutoSelect(0);
    }, [sortedSpaceLocations, expandedSpaceId, useJourneyExperience, isMapReady, handleSpaceSelect]);

    const handleMarkerClick = (e, space) => {
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

        setExpandedSpaceId(space?.space_id ?? null);
    };

    const activeFilterCount =
        (getActiveSelectedFacilityTypes(selectedFacilityTypes)?.length || 0) + (showFavouriteSpacesOnly ? 1 : 0);
    const hasActiveFilters = (activeFilterCount || 0) > 0;
    const mapViewToggleLabel = hasActiveFilters ? 'Hide map' : 'Help me find a space';
    const highlightedSpace = React.useMemo(() => {
        const validHighlightedSpaces =
            bookableSpacesRoomList?.data?.locations?.filter(
                space => space?.space_highlighted && !space?.space_draftmode,
            ) || [];

        if (validHighlightedSpaces.length === 0) {
            return null;
        }

        if (validHighlightedSpaces.length === 1) {
            return validHighlightedSpaces[0];
        }

        const randomIndex = Math.floor(Math.random() * validHighlightedSpaces.length);
        return validHighlightedSpaces[randomIndex];
    }, [bookableSpacesRoomList?.data?.locations]);

    return (
        <StyledBookableSpacesListWrapperDiv>
            {(() => {
                if (!!bookableSpacesRoomListLoading || !!facilityTypeListLoading || !!weeklyHoursLoading) {
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
                } else if (useJourneyExperience) {
                    return (
                        <BookableSpacesWrapper
                            filteredSpaceLocations={sortedSpaceLocations}
                            allSpaceLocations={bookableSpacesRoomList?.data?.locations || []}
                            totalSpaceCount={bookableSpacesRoomList?.data?.locations?.length || 0}
                            highlightedSpace={highlightedSpace}
                            isLoggedIn={isLoggedIn}
                            spacesFavouritesList={spacesFavouritesList}
                            servicesAndSpacesArticles={servicesAndSpacesArticles}
                            selectedFacilityTypes={selectedFacilityTypes}
                            setSelectedFacilityTypes={setSelectedFacilityTypes}
                            filteredFacilityTypeList={filteredFacilityTypeList}
                            facilityTypeList={facilityTypeList}
                            facilityTypeListLoading={facilityTypeListLoading}
                            facilityTypeListError={facilityTypeListError}
                            minimumSpaceCapacity={minimumSpaceCapacity}
                            maximumSpaceCapacity={maximumSpaceCapacity}
                            capacityFilterValue={capacityFilterValue}
                            setCapacityFilterValue={setCapacityFilterValue}
                            campusList={campusList}
                            selectedCampus={correctedCampusId(selectedCampus)}
                            handleCampusSelection={handleCampusSelection}
                            activeFilterCount={activeFilterCount}
                            librariesForCampus={librariesForCampus}
                            selectedLibrary={selectedLibrary}
                            handleLibrarySelection={handleLibrarySelection}
                            weeklyHours={weeklyHours}
                            weeklyHoursLoading={weeklyHoursLoading}
                            weeklyHoursError={weeklyHoursError}
                            onFavouriteToggle={handleFavouriteAction}
                            isFavouriteActionInProgress={isFavouriteActionInProgress}
                            showFavouriteSpacesOnly={showFavouriteSpacesOnly}
                            setShowFavouriteSpacesOnly={setShowFavouriteSpacesOnly}
                            onResetAllFilters={resetAllSpaceFilters}
                            hasFavouriteSpaces={(spacesFavouritesList || []).length > 0}
                            hasJourneyMapFilterState={false}
                        />
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
                                    filteredFacilityTypeList={filteredFacilityTypeList}
                                    suppliedClassName={showFilterSelectorPopup ? 'popupFilterList' : 'hide'}
                                    minimumSpaceCapacity={minimumSpaceCapacity}
                                    maximumSpaceCapacity={maximumSpaceCapacity}
                                    capacityFilterValue={capacityFilterValue}
                                    setCapacityFilterValue={setCapacityFilterValue}
                                    campusList={campusList}
                                    selectedCampus={correctedCampusId(selectedCampus)}
                                    handleCampusSelection={handleCampusSelection}
                                    activeFilterCount={activeFilterCount}
                                    librariesForCampus={librariesForCampus}
                                    selectedLibrary={selectedLibrary}
                                    handleLibrarySelection={handleLibrarySelection}
                                    onResetAllFilters={resetAllSpaceFilters}
                                    hasJourneyMapFilterState={false}
                                    showFavouriteSpacesOnly={showFavouriteSpacesOnly}
                                    setShowFavouriteSpacesOnly={setShowFavouriteSpacesOnly}
                                    isLoggedIn={isLoggedIn}
                                    hasFavouriteSpaces={(spacesFavouritesList || []).length > 0}
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
                                        style={{ right: showSpacesSelectorPopup ? '20.5rem' : '0' }}
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
                                            onSpaceSelect={handleSpaceSelect}
                                            onSpaceToggle={handleSpaceToggle}
                                            expandedSpaceId={expandedSpaceId}
                                        />
                                    </div>
                                </>
                            )}

                            <div id="mapWrapper" className="mapHolder" style={{ height: '100%', position: 'relative' }}>
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 12,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        zIndex: 1000,
                                        display: 'flex',
                                        gap: 1,
                                        flexWrap: 'wrap',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Button
                                        data-testid="spaces-advanced-go-to-journey"
                                        variant="contained"
                                        startIcon={<TravelExploreIcon />}
                                        onClick={goToJourney}
                                        sx={{
                                            textTransform: 'none',
                                            backgroundColor: '#51247a',
                                            color: '#fff',
                                            fontWeight: 600,
                                            border: '2px solid rgba(255, 255, 255, 0.85)',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
                                            '&:hover': {
                                                backgroundColor: '#3c1a5b',
                                                borderColor: '#fff',
                                            },
                                        }}
                                    >
                                        {mapViewToggleLabel}
                                    </Button>
                                </Box>
                                <BookableSpacesMap
                                    ref={mapRef}
                                    sortedSpaceLocations={sortedSpaceLocations}
                                    spacesFavouritesList={spacesFavouritesList}
                                    onMarkerClick={handleMarkerClick}
                                    centreLatLong={getLatLngCentreOfCampus(
                                        bookableSpacesRoomList?.data?.locations,
                                        correctedCampusId(selectedCampus),
                                    )}
                                    onMapReady={setIsMapReady}
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
    drupalArticleList: PropTypes.array,
    drupalArticlesLoading: PropTypes.bool,
    drupalArticlesError: PropTypes.bool,
    forceAdvanced: PropTypes.bool,
    // isFavouriteActionInProgress: PropTypes.any,
};

export default React.memo(BookableSpacesList);
