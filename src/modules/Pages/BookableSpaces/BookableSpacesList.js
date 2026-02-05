import React from 'react';
import PropTypes from 'prop-types';

import { Button, Grid, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import { breadcrumbs } from 'config/routes';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { standardText } from 'helpers/general';

import SidebarSpacesList from 'modules/Pages/BookableSpaces/SidebarSpacesList';
import SidebarFilters from 'modules/Pages/BookableSpaces/SidebarFilters';
import SpaceDetails from 'modules/Pages/BookableSpaces/SpaceDetails';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});
const uqStLuciaDefaultLocation = {
    latitude: -27.497975,
    longitude: 153.012385,
};

const StyledFullPageStandardCard = styled(StandardCard)(() => ({
    border: 'none',
    '& .showsOnlyOnFocus': {
        position: 'absolute',
        left: '-999px',
        top: '-999px',
        '&:focus': {
            position: 'relative',
            top: 'inherit',
            left: 'inherit',
        },
    },
}));
const StyledStandardCard = styled(StandardCard)(({ theme }) => ({
    ...standardText(theme),
    fontWeight: '400 !important',
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

const StyledMainWrapperDiv = styled('div')(() => ({
    position: 'relative',
    marginTop: '1px',
    display: 'flex',
    marginBottom: '-50px', // bring footer up
    marginInline: '2rem',
    '& .narrowSpaceList': {
        //
    },
    '& .wideSpaceList': {
        //
    },
}));
const StyledPageWrapperDiv = styled('div')(() => ({
    position: 'relative',
}));
const StyleFilterOpenButton = styled(Button)(({ theme }) => ({
    position: 'absolute',
    right: '2.25rem',
    top: 0,
    zIndex: 999,

    backgroundColor: '#fff',
    '&:hover, :focus': {
        backgroundColor: '#fff',
    },
}));
const StyledMapWrapperDiv = styled('div')(({ theme }) => ({
    position: 'absolute',
    left: '28%',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    maxWidth: '71.6665%',

    backgroundColor: 'white',
    flexDirection: 'row',
    flexGrow: 0,
    '& .leaflet-popup-content': {
        ...standardText(theme),
    },
    '& .mapPopup': {
        overflowY: 'auto',
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
}) => {
    console.log(
        'BookableSpacesList load facilityTypeList:',
        facilityTypeListLoading,
        facilityTypeListError,
        facilityTypeList,
    );
    console.log('BookableSpacesList load weeklyHours:', weeklyHoursLoading, weeklyHoursError, weeklyHours);

    const [selectedFacilityTypes, setSelectedFacilityTypes] = React.useState([]);
    const [filtersForceShown, setFiltersForceShown] = React.useState(false);

    const theme = useTheme();
    const isMobileView = useMediaQuery(theme.breakpoints.down('sm')) || false;
    const _isTabletViewJust = useMediaQuery(theme.breakpoints.down('lg')) || false;
    const isTabletView = isMobileView ? false : _isTabletViewJust;
    const isDesktopView = !isTabletView && !isMobileView;
    console.log('BookableSpacesList width', isMobileView, isTabletView, isDesktopView);

    React.useEffect(() => {
        const siteHeader = document.querySelector('uq-site-header');
        !!siteHeader && siteHeader.setAttribute('secondleveltitle', breadcrumbs.bookablespaces.title);
        !!siteHeader && siteHeader.setAttribute('secondLevelUrl', breadcrumbs.bookablespaces.pathname);
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

    React.useEffect(() => {
        if (bookableSpacesRoomListError === false && bookableSpacesRoomListLoading === false) {
            // page is loaded
            const spacesContent = document.getElementById('spacesContent');
            !!spacesContent && spacesContent.scrollIntoView({ behavior: 'smooth' });
        }
    }, [bookableSpacesRoomListError, bookableSpacesRoomListLoading]);

    const displayError = message => {
        return (
            <StandardPage title="Library spaces" standardPageId="topofcontent">
                <section aria-live="assertive">
                    <StyledFullPageStandardCard standardCardId="location-list-card" noPadding noHeader>
                        <Grid container spacing={3} data-testid="library-spaces">
                            <Grid container spacing={3} data-testid="library-spaces">
                                <StyledBookableSpaceGridItem item xs={12} md={9}>
                                    <StyledStandardCard fullHeight>
                                        <p data-testid="spaces-error">{message}</p>
                                    </StyledStandardCard>
                                </StyledBookableSpaceGridItem>
                            </Grid>
                        </Grid>
                    </StyledFullPageStandardCard>
                </section>
            </StandardPage>
        );
    };

    function spaceAppears(spaceFacilityTypes, facilityTypeToGroup, selectedFacilityTypes) {
        // Create a map of facility_type_id to group_id for quick lookup
        // Group selected filters by their facility type group
        const selectedFiltersByGroup = {};
        const rejectedFilters = [];

        selectedFacilityTypes?.forEach(filter => {
            if (filter.selected) {
                const groupId = facilityTypeToGroup[filter.facility_type_id];
                if (groupId) {
                    if (!selectedFiltersByGroup[groupId]) {
                        selectedFiltersByGroup[groupId] = [];
                    }
                    selectedFiltersByGroup[groupId].push(filter.facility_type_id);
                }
            }

            // Collect rejected facility types
            if (filter.unselected) {
                rejectedFilters.push(filter.facility_type_id);
            }
        });

        // check if space should be excluded due to rejected facility types
        if (rejectedFilters.length > 0) {
            const hasRejectedFacility = rejectedFilters.some(rejectedId => spaceFacilityTypes?.includes(rejectedId));
            if (hasRejectedFacility) {
                return false;
            }
        }

        // If no inclusion filters are selected, show all spaces (that haven't been rejected)
        if (Object.keys(selectedFiltersByGroup).length === 0) {
            return true;
        }

        // AND between groups
        for (const groupId in selectedFiltersByGroup) {
            const selectedFiltersInGroup = selectedFiltersByGroup[groupId];

            // OR within group
            const hasMatchInGroup = selectedFiltersInGroup.some(filterId => spaceFacilityTypes?.includes(filterId));
            if (!hasMatchInGroup) {
                return false;
            }
        }
        return true;
    }

    const getFilteredFacilityTypeList = (bookableSpacesRoomList, facilityTypeList) => {
        // get a list of the filters used in spaces
        const spaceFilters = bookableSpacesRoomList?.data?.locations
            .flatMap(location => location.facility_types || [])
            .map(facilityType => facilityType.facility_type_id);
        const spaceFiltersSet = new Set(spaceFilters);

        // filter facility types so we only show the checkboxes where there is an associated space
        // (remove the group completely if it has no shown checkboxes)
        return {
            ...facilityTypeList,
            data: {
                ...facilityTypeList?.data,
                facility_type_groups: facilityTypeList?.data?.facility_type_groups
                    .map(group => ({
                        ...group,
                        facility_type_children: (group.facility_type_children || []).filter(child =>
                            spaceFiltersSet.has(child.facility_type_id),
                        ),
                    }))
                    .filter(group => group.facility_type_children.length > 0),
            },
        };
    };
    const openCloseFilterBlock = e => {
        console.log('openCloseFilterBlock');
        setFiltersForceShown(!filtersForceShown);
    };
    return (
        <>
            {(() => {
                if (!!bookableSpacesRoomListLoading || !!weeklyHoursLoading) {
                    return (
                        <Grid container spacing={3} data-testid="library-spaces">
                            <StyledBookableSpaceGridItem item xs={12} md={9}>
                                <InlineLoader message="Loading" />
                            </StyledBookableSpaceGridItem>
                        </Grid>
                    );
                } else if (!!bookableSpacesRoomListError || !!facilityTypeListError) {
                    displayError('Something went wrong - please try again later.');
                } else if (
                    !bookableSpacesRoomList?.data?.locations ||
                    bookableSpacesRoomList?.data?.locations?.length === 0
                ) {
                    displayError('No locations found yet - please try again soon.');
                } else {
                    const facilityTypeToGroup = {};
                    getFilteredFacilityTypeList(
                        bookableSpacesRoomList,
                        facilityTypeList,
                    )?.data?.facility_type_groups?.forEach(group => {
                        group.facility_type_children.forEach(child => {
                            facilityTypeToGroup[child.facility_type_id] = group.facility_type_group_id;
                        });
                    });
                    const filteredSpaceLocations = bookableSpacesRoomList?.data?.locations?.filter(s => {
                        const spaceFacilityTypes = s?.facility_types?.map(item => item.facility_type_id);
                        return spaceAppears(spaceFacilityTypes, facilityTypeToGroup, selectedFacilityTypes);
                    });

                    // https://www.streamlinehq.com/icons/ultimate-regular-free?search=filter&icon=ico_lPqwMEdpHFHOBRpU
                    const filterOpenCloseButton = (
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
                    return (
                        <StyledPageWrapperDiv>
                            <StyleFilterOpenButton
                                style={{ display: isDesktopView ? 'none' : 'block' }}
                                onClick={() => openCloseFilterBlock()}
                                title="Open and close the filter popup"
                            >
                                {filterOpenCloseButton}
                            </StyleFilterOpenButton>
                            <StyledMainWrapperDiv
                                id="spacesContent"
                                data-testid="library-spaces"
                                style={{ height: '99vh' }}
                                className={isDesktopView || filtersForceShown ? 'narrowSpaceList' : 'wideSpaceList'}
                            >
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
                                    className={isDesktopView || filtersForceShown ? 'show' : 'hide'}
                                />
                                <SidebarSpacesList
                                    filteredSpaceLocations={filteredSpaceLocations}
                                    weeklyHours={weeklyHours}
                                    weeklyHoursLoading={weeklyHoursLoading}
                                    weeklyHoursError={weeklyHoursError}
                                    StyledStandardCard={StyledStandardCard}
                                    className={isDesktopView || filtersForceShown ? 'narrow' : 'wide'}
                                />
                                <StyledMapWrapperDiv>
                                    <MapContainer
                                        center={[uqStLuciaDefaultLocation.latitude, uqStLuciaDefaultLocation.longitude]}
                                        zoom={18}
                                        style={{ width: '100%', height: '100%' }}
                                    >
                                        <TileLayer
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            maxNativeZoom={19}
                                            maxZoom={25}
                                        />
                                        {filteredSpaceLocations.length > 0 &&
                                            filteredSpaceLocations
                                                ?.filter(m => !!m.space_latitude && !!m.space_longitude)
                                                ?.map(m => {
                                                    // show the filtered Spaces on the map
                                                    console.log(
                                                        'map point:',
                                                        m.space_name,
                                                        m.space_library_name,
                                                        m.space_latitude,
                                                        m.space_longitude,
                                                    );
                                                    const locationKey = `mappoint-space-${m?.space_id}`;
                                                    return (
                                                        <Marker
                                                            key={locationKey}
                                                            id={locationKey}
                                                            position={[m.space_latitude, m.space_longitude]}
                                                        >
                                                            <Popup className="mapPopup" maxWidth="400px">
                                                                <SpaceDetails
                                                                    weeklyHours={weeklyHours}
                                                                    weeklyHoursLoading={weeklyHoursLoading}
                                                                    weeklyHoursError={weeklyHoursError}
                                                                    bookableSpace={m}
                                                                />
                                                            </Popup>
                                                        </Marker>
                                                    );
                                                })}
                                    </MapContainer>
                                </StyledMapWrapperDiv>
                            </StyledMainWrapperDiv>
                        </StyledPageWrapperDiv>
                    );
                }
            })()}
        </>
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
};

export default React.memo(BookableSpacesList);
