import React from 'react';
import PropTypes from 'prop-types';

import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

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

const StyledPageWrapperDiv = styled('div')(() => ({
    position: 'relative',
    marginTop: '1px',
    display: 'flex',
    marginBottom: '-50px', // bring footer up
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
                } else if (
                    !!bookableSpacesRoomListError ||
                    !!facilityTypeListError ||
                    !bookableSpacesRoomList?.data?.locations ||
                    bookableSpacesRoomList?.data?.locations?.length === 0
                ) {
                    // handle errors and empty data here
                    const generalApiError = !!bookableSpacesRoomListError || !!facilityTypeListError;
                    const systemEmpty =
                        !generalApiError &&
                        (!bookableSpacesRoomList?.data?.locations ||
                            bookableSpacesRoomList?.data?.locations?.length === 0);
                    return (
                        <StandardPage title="Library spaces" standardPageId="topofcontent">
                            <section aria-live="assertive">
                                <StyledFullPageStandardCard standardCardId="location-list-card" noPadding noHeader>
                                    <Grid container spacing={3} data-testid="library-spaces">
                                        <Grid container spacing={3} data-testid="library-spaces">
                                            <StyledBookableSpaceGridItem item xs={12} md={9}>
                                                <StyledStandardCard fullHeight>
                                                    {!!generalApiError && (
                                                        <p data-testid="spaces-error">
                                                            Something went wrong - please try again later.
                                                        </p>
                                                    )}
                                                    {!!systemEmpty && (
                                                        <p data-testid="no-spaces">
                                                            No locations found yet - please try again soon.
                                                        </p>
                                                    )}
                                                </StyledStandardCard>
                                            </StyledBookableSpaceGridItem>
                                        </Grid>
                                    </Grid>
                                </StyledFullPageStandardCard>
                            </section>
                        </StandardPage>
                    );
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

                    return (
                        <StyledPageWrapperDiv
                            id="spacesContent"
                            data-testid="library-spaces"
                            style={{ height: '99vh' }}
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
                            />
                            <SidebarSpacesList
                                filteredSpaceLocations={filteredSpaceLocations}
                                weeklyHours={weeklyHours}
                                weeklyHoursLoading={weeklyHoursLoading}
                                weeklyHoursError={weeklyHoursError}
                                StyledStandardCard={StyledStandardCard}
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
