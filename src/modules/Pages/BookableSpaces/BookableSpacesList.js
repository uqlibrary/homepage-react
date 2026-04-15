import React, { useCallback, useState, useRef } from 'react';
import PropTypes from 'prop-types';

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
    FILTER_CURRENTLY_OPEN,
    FILTER_SPACE_CAPACITY,
} from './spacesHelpers';
import { displayToastErrorMessage, displayToastMessage } from '../Admin/BookableSpaces/bookableSpacesAdminHelpers';

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
    const FACILITY_TYPE_NAME_CAPACITY = 'Bookable Capacity';

    const [selectedFacilityTypes, setSelectedFacilityTypes] = useState([]);
    const [showFilterSelectorPopup, setShowFilterSelectorPopup] = useState(!isMobileView);
    const [showSpacesSelectorPopup, setShowSpacesSelectorPopup] = useState(isDesktopView);
    const [previousToggledSpaceButton, setPreviousToggledSpaceButton] = useState(null);
    const [isFavouriteActionInProgress, setIsFavouriteActionInProgress] = useState(false);

    const mapRef = useRef(null);

    const handleSpaceExpand = useCallback(space => {
        mapRef.current?.flyToSpace(space);
    }, []);

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
            showSpace(space, ftg, selectedFacilityTypes),
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
    }, [bookableSpacesRoomList, facilityTypeList, selectedFacilityTypes, capacityFilterValue, spacesFavouritesList]);
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

    const activeFilterCount = selectedFacilityTypes?.filter(ft => !!ft?.selected || !!ft?.unselected)?.length;
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

                            <div id="mapWrapper" className="mapHolder" style={{ height: '100%' }}>
                                <BookableSpacesMap
                                    ref={mapRef}
                                    sortedSpaceLocations={sortedSpaceLocations}
                                    spacesFavouritesList={spacesFavouritesList}
                                    onMarkerClick={handleMarkerClick}
                                />
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
