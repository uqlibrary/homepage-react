import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

import { Badge, Button, Grid, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { breadcrumbs } from 'config/routes';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { addClass, removeClass, standardText } from 'helpers/general';
import { useAccountContext } from 'context';

import SidebarSpacesList from 'modules/Pages/BookableSpaces/SidebarSpacesList';
import SidebarFilters from 'modules/Pages/BookableSpaces/SidebarFilters';
import {
    FACILITY_TYPE_CHECKBOX,
    FACILITY_TYPE_SLIDER,
    FILTER_CURRENTLY_OPEN,
    FILTER_SPACE_CAPACITY,
} from './spacesHelpers';
import { displayToastErrorMessage, displayToastMessage } from '../Admin/BookableSpaces/bookableSpacesAdminHelpers';

const uqStLuciaDefaultLocation = {
    latitude: -27.497975,
    longitude: 153.012385,
};

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
const BookableSpacesListWrapperDiv = styled('div')(({ theme }) => ({
    backgroundColor: 'rgb(243, 243, 244)',
    marginBottom: '-50px',
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
    '& .popupSpacesList, .popupFilterList': {
        position: 'absolute',
        top: 0,
        right: 0,
        height: 'calc(100% - 56px)',
        width: '20rem',
        maxWidth: '50%',
        zIndex: 997,
        paddingLeft: '0.5rem',
        marginTop: 0,
    },
    '& .hide': {
        display: 'none',
    },
}));
const schoolBuildingBackgroundimage =
    'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23000%27%3e%3cg fill=%27none%27 stroke=%27%2351247A%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%27.75%27%3e%3cpath d=%27M5.48 14.29H1.71v-4.6c0-.46.38-.83.83-.83h2.94m5.04-.03h2.94c.45 0 .83.37.83.83v4.63h-3.77m-1.69-2.2a.79.79 0 0 0-.83-.75.79.79 0 0 0-.83.75v2.2h1.69v-2.2zM8 5.06V1.7m0 .01h2.23a.3.3 0 0 1 .29.29v1.11c0 .15-.12.29-.29.29H8zm0 5.06a.83.83 0 0 1 0 1.66.83.83 0 0 1 0-1.66zm0 0%27%3e%3c/path%3e%3cpath d=%27M10.52 7.52A2.47 2.47 0 0 0 8 5.09a2.49 2.49 0 0 0-2.52 2.43v6.77h5.04zm-7.12 3h.43M3.4 12.6h.43m8.37-2.08h.43m-.43 2.08h.43%27%3e%3c/path%3e%3c/g%3e%3c/svg%3e")';
const StyledSpaceListOpenButton = styled(Button)(({ theme }) => ({
    position: 'absolute',
    top: '0.25rem',
    right: '1rem',
    zIndex: 998,
    display: 'flex',
    alignItems: 'center',
    columnGap: '0.25rem',
    '& span': {
        marginLeft: '0.25rem',
        textTransform: 'capitalize',
        fontSize: '1rem',
    },
    backgroundColor: '#fff',
    textDecoration: 'underline',
    '&:hover, :focus': {
        backgroundColor: '#fff',
        '& > span:first-of-type > span': {
            backgroundColor: theme.palette.primary.main,
            color: '#fff',
        },
    },

    backgroundImage: schoolBuildingBackgroundimage,
    paddingLeft: '40px',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '35px 35px',
    minHeight: '50px',
    backgroundPosition: 'left center',
}));
const StyledFilterOpenButton = styled(Button)(({ theme }) => ({
    position: 'absolute',
    top: '0.25rem',
    left: '11rem', // have the button sit on the right of the filter sidebar, so the labels slide inside it
    zIndex: 998,
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    columnGap: '0.25rem',
    paddingLeft: 0,
    marginLeft: '-0.5rem',
    textDecoration: 'underline',
    '&:hover, :focus': {
        backgroundColor: '#fff',
        '& > span:first-of-type > span': {
            backgroundColor: theme.palette.primary.main,
            color: '#fff',
        },
    },
    '& span': {
        textTransform: 'capitalize',
        fontSize: '1rem',
    },
}));
const StyledMapWrapperDiv = styled('div')(() => ({
    position: 'absolute',
    // left: '28%',
    width: '100%',
    height: '100%',
    // maxWidth: '71.6665%',
    flexDirection: 'row',
    flexGrow: 0,
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
    const FACILITY_TYPE_NAME_CAPACITY = 'Bookable Capacity';

    const [selectedFacilityTypes, setSelectedFacilityTypes] = useState([]);
    const [showFilterSelectorPopup, setShowFilterSelectorPopup] = useState(!isMobileView);
    const [showSpacesSelectorPopup, setShowSpacesSelectorPopup] = useState(isDesktopView);
    const [previousToggledSpaceButton, setPreviousToggledSpaceButton] = useState(null);
    const [isFavouriteActionInProgress, setIsFavouriteActionInProgress] = useState(false);

    const [isMazeMapScriptReady, setIsMazeMapScriptReady] = React.useState(false);
    const [isMazeMapReady, setIsMazeMapReady] = React.useState(false);
    const [mapContainer, setMapContainer] = React.useState(null);
    const mazeMapInstanceRef = useRef(null);
    const mazeMarkersRef = useRef([]);

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
        }
    }, [bookableSpacesRoomList, bookableSpacesRoomListError, bookableSpacesRoomListLoading]);

    // Load MazeMaps assets
    React.useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `/${process.env.PUBLIC_PATH || ''}vendor/mazemap/mazemap.min.css`;
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = `/${process.env.PUBLIC_PATH || ''}vendor/mazemap/mazemap.min.js`;
        script.type = 'text/javascript';
        script.async = true;
        script.onload = () => setIsMazeMapScriptReady(true);
        document.body.appendChild(script);

        return () => {
            document.head.removeChild(link);
            document.body.removeChild(script);
        };
    }, []);

    // Initialise MazeMaps map once script has loaded and container div is mounted
    React.useEffect(() => {
        if (!isMazeMapScriptReady || !mapContainer) return;

        mazeMapInstanceRef.current = new window.Mazemap.Map({
            container: 'mazemap-container',
            campuses: 406, // UQ St Lucia campus ID
            center: { lng: uqStLuciaDefaultLocation.longitude, lat: uqStLuciaDefaultLocation.latitude },
            zoom: 18,
            zLevel: 1,
            RTLTextPlugin: null,
        });

        mazeMapInstanceRef.current.on('load', () => {
            mazeMapInstanceRef.current.resize();
            setIsMazeMapReady(true);
        });

        // eslint-disable-next-line consistent-return
        return () => {
            mazeMapInstanceRef.current?.remove();
            mazeMapInstanceRef.current = null;
            setIsMazeMapReady(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMazeMapScriptReady, mapContainer]);

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

    function showSpace(space, facilityTypeToGroup, selectedFacilityTypes) {
        if (space?.space_draftmode) {
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
                const hasMatchInGroup = selectedFiltersInGroup?.some(filterId => {
                    const filter = selectedFacilityTypes?.find(f => f?.facility_type_id === filterId);
                    if (filter?.facility_special_action) {
                        if (filter?.facility_special_action === FILTER_CURRENTLY_OPEN) {
                            return isLocationOpen(space?.space_opening_hours_id, weeklyHours);
                        } else if (filter?.facility_special_action === FILTER_SPACE_CAPACITY) {
                            return (
                                !!space?.space_capacity &&
                                space?.space_capacity >= capacityFilterValue[0] &&
                                space?.space_capacity <= capacityFilterValue[1]
                            );
                        }
                    } else {
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
    const getFilteredFacilityTypeList = (bookableSpacesRoomList, facilityTypeList) => {
        // get a list of the filters used in spaces
        const spaceFilters = bookableSpacesRoomList?.data?.locations
            ?.flatMap(location => location?.facility_types || [])
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
                        facility_type_children: (group?.facility_type_children || [])?.filter(child =>
                            spaceFiltersSet?.has(child?.facility_type_id),
                        ),
                    }))
                    ?.filter(group => group?.facility_type_children?.length > 0),
            },
        };

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
                    facility_type_id: 9999, // must be unique!
                    facility_type_name: 'Currently open',
                    filterRejectAvailable: false, // do not show a "filter-reject" orange checkbox
                    facility_special_action: FILTER_CURRENTLY_OPEN,
                    facility_type: FACILITY_TYPE_CHECKBOX,
                },
            ],
        };
        !!filterOpenFacilityType && filteredFacilityTypeList?.data?.facility_type_groups?.push(filterOpenFacilityType);

        // manually add a "Choose number of people" filter
        const filterCapacityFacilityType = filteredFacilityTypeList?.data?.facility_type_groups && {
            facility_type_group_id: nextFacilityTypeId(filteredFacilityTypeList),
            facility_type_group_name: FACILITY_TYPE_NAME_CAPACITY,
            facility_type_group_order: -998, // force to second inlist
            facility_type_group_loads_open: 1,
            facility_type_group_type: 'choose-many',
            filterType: FACILITY_TYPE_SLIDER, // what sort of filter is this? checkbox and slider available
            facility_type_children: [
                {
                    facility_type_id: 9998, // must be unique!
                    facility_type_name: 'Space capacity',
                    filterRejectAvailable: false, // do not show a "filter-reject" orange checkbox
                    facility_special_action: FILTER_SPACE_CAPACITY,
                    facility_type: FACILITY_TYPE_SLIDER,
                },
            ],
        };
        !!filterOpenFacilityType &&
            filteredFacilityTypeList?.data?.facility_type_groups?.push(filterCapacityFacilityType);

        return filteredFacilityTypeList;
    };
    const toggleFilterPopupVisibility = e => {
        setShowFilterSelectorPopup(!showFilterSelectorPopup);
    };
    const toggleSpacesListPopupVisibility = e => {
        setShowSpacesSelectorPopup(!showSpacesSelectorPopup);
    };
    const filterToggleButtonIcon = (
        // https://www.streamlinehq.com/icons/ultimate-regular-free?search=filter&icon=ico_lPqwMEdpHFHOBRpU
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            height="24"
            width="24"
            aria-hidden="true"
            focusable="false"
        >
            <desc>Open and close the filter sidebar</desc>
            <path
                stroke="#51247a"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M23.2 2.05391c0.0067 -0.10242 -0.0077 -0.20512 -0.0422 -0.30176 -0.0346 -0.09665 -0.0886 -0.18519 -0.1587 -0.26015 -0.0701 -0.07497 -0.1548 -0.13478 -0.2489 -0.17573 -0.0941 -0.04095 -0.1956 -0.06217 -0.2982 -0.06236H1.49997c-0.10267 0.00004 -0.20424 0.02117 -0.29842 0.06207 -0.09418 0.0409 -0.17896 0.1007 -0.249081 0.1757 -0.070124 0.075 -0.124102 0.1636 -0.158589 0.26031 -0.034488 0.09671 -0.048751 0.19947 -0.041906 0.30192 0.175881 2.449 1.147846 4.7733 2.767696 6.61847 1.61985 1.84512 3.7987 3.10992 6.2043 3.60152v9.875c0.00006 0.1425 0.04071 0.2821 0.11721 0.4023 0.07649 0.1202 0.18562 0.2162 0.31472 0.2766 0.1291 0.0605 0.2727 0.0829 0.414 0.0647 0.1414 -0.0183 0.2746 -0.0764 0.3841 -0.1676l3 -2.5c0.0845 -0.0703 0.1526 -0.1583 0.1993 -0.2579 0.0466 -0.0995 0.0708 -0.2081 0.0707 -0.3181v-7.375c2.4064 -0.4906 4.5862 -1.755 6.2069 -3.60031C22.0515 6.82832 23.024 4.50352 23.2 2.05391Z"
                strokeWidth="1.5"
            />
        </svg>
    );

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

    const facilityTypeToGroup = {};
    getFilteredFacilityTypeList(bookableSpacesRoomList, facilityTypeList)?.data?.facility_type_groups?.forEach(
        group => {
            group?.facility_type_children?.forEach(child => {
                facilityTypeToGroup[child?.facility_type_id] = group?.facility_type_group_id;
            });
        },
    );
    const filteredSpaceLocations = bookableSpacesRoomList?.data?.locations?.filter(space => {
        return showSpace(space, facilityTypeToGroup, selectedFacilityTypes);
    });

    const sortedSpaceLocations = filteredSpaceLocations
        ? [...filteredSpaceLocations].sort((a, b) => {
              const aFav = isSpaceFavourited(a);
              const bFav = isSpaceFavourited(b);
              if (aFav && !bFav) return -1;
              /* istanbul ignore next */
              if (!aFav && bFav) return 1;
              return 0;
          })
        : filteredSpaceLocations;
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

        // highlight it
        const spacePanel = document.querySelector(`#space-${space?.space_id} > div:first-of-type`);
        addClass(spacePanel, 'highlightPanel');
        addClass(spacePanel, 'mobileHighlightPanel');

        setTimeout(() => {
            removeClass(spacePanel, 'highlightPanel');
        }, 3000);

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
    };
    // Add/update markers whenever the filtered spaces list or map readiness changes
    // eslint-disable-next-line consistent-return
    React.useEffect(() => {
        if (!isMazeMapReady || !mazeMapInstanceRef.current) return;

        // Remove previous markers
        mazeMarkersRef.current.forEach(marker => marker.remove());
        mazeMarkersRef.current = [];

        sortedSpaceLocations
            ?.filter(m => !!m?.space_latitude && !!m?.space_longitude)
            ?.forEach(mapPoint => {
                const marker = new window.Mazemap.MazeMarker({ color: '#51247a' })
                    .setLngLat([mapPoint.space_longitude, mapPoint.space_latitude])
                    .addTo(mazeMapInstanceRef.current);

                const markerEl = marker.getElement();
                markerEl.setAttribute('role', 'img');
                markerEl.addEventListener('click', e => {
                    handleMarkerClick(e, mapPoint); // mapPoint captured via closure
                });

                mazeMarkersRef.current.push(marker);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortedSpaceLocations, isMazeMapReady]);
    const showMap = () => {
        return <StyledMapWrapperDiv id="mazemap-container" ref={setMapContainer} />;
    };
    const activeFilterCount = selectedFacilityTypes?.filter(ft => !!ft?.selected || !!ft?.unselected)?.length;
    const activeFilterCountBadge = () => {
        return activeFilterCount === 0 ? null : (
            <Badge
                badgeContent={activeFilterCount}
                max={selectedFacilityTypes?.length}
                color="primary"
                style={{ marginRight: '0.3rem' }} // it tries to sit too far to the right
                data-testid="space-filter-count"
            />
        );
    };
    function neededPaddingRight() {
        if (activeFilterCount === 0) {
            return 0;
        }
        if (activeFilterCount > 9) {
            return '1rem';
        }
        return '0.75rem';
    }
    return (
        <BookableSpacesListWrapperDiv>
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
                    // mobile and tablet
                    return (
                        <StyledLayoutWrapper data-testid="library-spaces">
                            <div>
                                <StyledFilterOpenButton
                                    id="toggleFilterButton"
                                    data-testid="spaces-open-filter-button"
                                    onClick={() => toggleFilterPopupVisibility()}
                                    title="Open and close the filter sidebar"
                                >
                                    {filterToggleButtonIcon}{' '}
                                    <span style={{ paddingRight: neededPaddingRight() }}>
                                        <span>{!!showFilterSelectorPopup ? 'Hide Filters' : 'Show Filters'}</span>
                                    </span>
                                    {activeFilterCountBadge()}
                                </StyledFilterOpenButton>
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
                                />
                            </div>
                            {isDesktopView && (
                                <>
                                    <StyledSpaceListOpenButton
                                        id="toggleSpacesListButton"
                                        // className="controlSpacesListButton"
                                        data-testid="spaces-open-spaces-list-button"
                                        onClick={() => toggleSpacesListPopupVisibility()}
                                        title="Open and close the spaces sidebar"
                                    >
                                        <span
                                            style={{
                                                paddingRight: sortedSpaceLocations?.length > 10 ? '1rem' : '0.5rem',
                                                // covers 1 and 2 digit
                                                // will need more ifs when we have more data: > 100, > 1000
                                            }}
                                        >
                                            <span>
                                                {!!showSpacesSelectorPopup ? 'Hide Spaces list' : 'Show Spaces list'}
                                            </span>
                                        </span>
                                        {visibleSpacesCountBadge()}
                                    </StyledSpaceListOpenButton>
                                    <div
                                        className={
                                            showSpacesSelectorPopup
                                                ? 'spacesListHolder spacesList' // only controls placement of +/- on map
                                                : 'spacesListHolder hide'
                                        }
                                    >
                                        <SidebarSpacesList
                                            filteredSpaceLocations={sortedSpaceLocations}
                                            weeklyHours={weeklyHours}
                                            weeklyHoursLoading={weeklyHoursLoading}
                                            weeklyHoursError={weeklyHoursError}
                                            StyledStandardCard={StyledStandardCard}
                                            showAllData={!isMobileView}
                                            suppliedClassName={showSpacesSelectorPopup ? 'popupSpacesList' : 'hide'}
                                            spacesFavouritesList={spacesFavouritesList}
                                            isLoggedIn={isLoggedIn}
                                            onFavouriteToggle={handleFavouriteAction}
                                            isFavouriteActionInProgress={isFavouriteActionInProgress}
                                            onSpaceExpand={space => {
                                                const map = mazeMapInstanceRef.current;
                                                if (!map || !space?.space_longitude || !space?.space_latitude) return;
                                                map.flyTo({
                                                    center: [space.space_longitude, space.space_latitude],
                                                    zoom: 20,
                                                    curve: 0.5,
                                                    speed: 1.6,
                                                });
                                            }}
                                        />
                                    </div>
                                </>
                            )}

                            <div id="mapWrapper" className="mapHolder" style={{ height: '100%' }}>
                                {showMap()}
                            </div>
                        </StyledLayoutWrapper>
                    );
                }
            })()}
        </BookableSpacesListWrapperDiv>
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
