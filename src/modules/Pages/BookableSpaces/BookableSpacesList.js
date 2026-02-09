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

// const StyledMainWrapperDiv = styled('div')(() => ({
//     // position: 'relative',
//     marginTop: '1px',
//     display: 'flex',
//     marginBottom: '-50px', // bring footer up
//     marginInline: '2rem',
// }));
// const StyledPageWrapperDiv = styled('div')(() => ({
//     position: 'relative',
// }));
const StyledMobileWrapper = styled('div')(({ theme }) => ({
    position: 'relative',
    height: '99vh',
    marginInline: '2rem',
    '& .narrowFilterList': {
        //
    },
    '& .mapHolder': {
        [theme.breakpoints.up('lg')]: {
            '& .leaflet-control-container': {
                position: 'absolute',
                left: '310px',
            },
        },
    },
    '& .popupSpacesList, .popupFilterList': {
        position: 'absolute',
        top: 0,
        right: 0,
        height: '100%',
        width: '20rem',
        maxWidth: '50%',
        zIndex: 2000,
        paddingTop: '2rem',
        marginTop: 0,
    },
    '& .spacesList': {
        position: 'absolute',
        width: '20rem',
        maxWidth: '50%',
        zIndex: 2000,
        marginTop: '-2px', // small gap, fix
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
    left: '0.25rem',
    zIndex: 2001,
    display: 'flex',
    alignItems: 'center',
    columnGap: '0.25rem',
    '& span': {
        marginLeft: '0.25rem',
        textTransform: 'capitalize',
        fontSize: '1rem',
    },
    backgroundColor: '#fff',
    '&:hover, :focus': {
        backgroundColor: '#fff',
    },
    marginTop: '10px',

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
    right: '0.25rem',
    zIndex: 2001,
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    columnGap: '0.25rem',
    '&:hover, :focus': {
        backgroundColor: '#fff',
    },
    '& span': {
        textTransform: 'capitalize',
        fontSize: '1rem',
    },
}));
const StyledMapWrapperDiv = styled('div')(({ theme }) => ({
    position: 'absolute',
    // left: '28%',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    // maxWidth: '71.6665%',

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
    console.log('BookableSpacesList width', isMobileView, isTabletView, isDesktopView);

    const [selectedFacilityTypes, setSelectedFacilityTypes] = React.useState([]);
    const [filtersForceShown, setFiltersForceShown] = React.useState(isDesktopView);
    const [spacesListForceShown, setSpacesListForceShown] = React.useState(true);

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
    const openCloseFilterBlock = e => {
        console.log('openCloseFilterBlock');
        setFiltersForceShown(!filtersForceShown);
    };
    const openCloseSpacesListBlock = e => {
        console.log('openCloseSpacesListBlock');
        setSpacesListForceShown(!spacesListForceShown);
    };
    const filterOpenCloseButtonIcon = (
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

    // const searchSliderIcon = (
    //     // https://www.streamlinehq.com/icons/ultimate-regular-free?search=slider&icon=ico_2WutdSYuSihh0yLC
    //     <svg
    //         xmlns="http://www.w3.org/2000/svg"
    //         fill="none"
    //         viewBox="0 0 24 24"
    //         height="24"
    //         width="24"
    //         aria-hidden="true"
    //         focusable="false"
    //     >
    //         <desc>Show-Hide the list of Spaces</desc>
    //         <g
    //             transform="rotate(-90 12 12)"
    //             stroke="#51247a"
    //             strokeLinecap="round"
    //             strokeLinejoin="round"
    //             strokeMiterlimit="10"
    //             strokeWidth="1.5"
    //         >
    //             <path d="M4.25 9.14999c0 0.6 -0.4 1.00001 -1 1.00001h-1.5c-0.6 0 -1 -0.40001 -1 -1.00001v-3c0 -0.6 0.4 -1 1 -1h1.5c0.6 0 1 0.4 1 1v3Z" />
    //             <path d="M2.5 5.14999V0.75" />
    //             <path d="M2.5 10.15v3" />
    //             <path d="M9.75 18.25c0 0.6 -0.4 1 -1 1h-1.5c-0.6 0 -1 -0.4 -1 -1v-4.5c0 -0.6 0.4 -1 1 -1h1.5c0.6 0 1 0.4 1 1v4.5Z" />
    //             <path d="M8 12.75v-3" />
    //             <path d="M8 19.25v4" />
    //             <path d="M16.55 16.85c0 0.6 -0.4 1 -1 1h-1.5c-0.6 0 -1 -0.4 -1 -1v-4c0 -0.6 0.4 -1 1 -1h1.5c0.6 0 1 0.4 1 1v4Z" />
    //             <path d="M14.8 17.85v4" />
    //             <path d="m17.25 6.85001 3 -3.60001 3 3.60001" />
    //             <path d="M20.25 3.25v15.6" />
    //         </g>
    //     </svg>
    // );

    const facilityTypeToGroup = {};
    getFilteredFacilityTypeList(bookableSpacesRoomList, facilityTypeList)?.data?.facility_type_groups?.forEach(
        group => {
            group.facility_type_children.forEach(child => {
                facilityTypeToGroup[child.facility_type_id] = group.facility_type_group_id;
            });
        },
    );
    const filteredSpaceLocations = bookableSpacesRoomList?.data?.locations?.filter(s => {
        const spaceFacilityTypes = s?.facility_types?.map(item => item.facility_type_id);
        return spaceAppears(spaceFacilityTypes, facilityTypeToGroup, selectedFacilityTypes);
    });
    const showMap = () => {
        return (
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
        );
    };
    return (
        <div style={{ backgroundColor: 'rgb(243, 243, 244)' }}>
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
                    // } else if (!!isDesktopView) {
                    //     return (
                    //         <StyledPageWrapperDiv>
                    //             <StyledMainWrapperDiv
                    //                 id="spacesContent"
                    //                 data-testid="library-spaces"
                    //                 style={{ height: '99vh' }}
                    //             >
                    //                 <SidebarFilters
                    //                     facilityTypeList={facilityTypeList}
                    //                     facilityTypeListLoading={facilityTypeListLoading}
                    //                     facilityTypeListError={facilityTypeListError}
                    //                     selectedFacilityTypes={selectedFacilityTypes}
                    //                     setSelectedFacilityTypes={setSelectedFacilityTypes}
                    //                     filteredFacilityTypeList={getFilteredFacilityTypeList(
                    //                         bookableSpacesRoomList,
                    //                         facilityTypeList,
                    //                     )}
                    //                 />
                    //                 <SidebarSpacesList
                    //                     filteredSpaceLocations={filteredSpaceLocations}
                    //                     weeklyHours={weeklyHours}
                    //                     weeklyHoursLoading={weeklyHoursLoading}
                    //                     weeklyHoursError={weeklyHoursError}
                    //                     StyledStandardCard={StyledStandardCard}
                    //                     showAllData
                    //                 />
                    //                 {showMap()}
                    //             </StyledMainWrapperDiv>
                    //         </StyledPageWrapperDiv>
                    //     );
                } else {
                    // mobile and tablet
                    return (
                        <StyledMobileWrapper id="StyledMobileWrapperTemp">
                            <StyledFilterOpenButton
                                id="openCloseFilterButton"
                                // className="controlFilterButton"
                                data-testid="spaces-open-filter-button"
                                onClick={() => openCloseFilterBlock()}
                                title="Open and close the filter popup"
                            >
                                {filterOpenCloseButtonIcon}{' '}
                                <span>{!!filtersForceShown ? 'Hide Filters' : 'Show Filters'}</span>
                            </StyledFilterOpenButton>
                            <div className="sidebarFilters">
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
                                    className={filtersForceShown ? 'popupFilterList' : 'hide'}
                                />
                            </div>
                            {isDesktopView && (
                                <>
                                    <StyledSpaceListOpenButton
                                        id="openCloseSpacesListButton"
                                        // className="controlSpacesListButton"
                                        data-testid="spaces-open-spaces-list-button"
                                        onClick={() => openCloseSpacesListBlock()}
                                        title="Open and close the filter popup"
                                    >
                                        <span>{!!spacesListForceShown ? 'Hide Spaces list' : 'Show Spaces list'}</span>
                                    </StyledSpaceListOpenButton>
                                    <div className={spacesListForceShown ? 'spacesList' : 'hide'}>
                                        <SidebarSpacesList
                                            filteredSpaceLocations={filteredSpaceLocations}
                                            weeklyHours={weeklyHours}
                                            weeklyHoursLoading={weeklyHoursLoading}
                                            weeklyHoursError={weeklyHoursError}
                                            StyledStandardCard={StyledStandardCard}
                                            showAllData={!isMobileView}
                                            className={filtersForceShown ? 'popupSpacesList' : 'hide'}
                                        />
                                    </div>
                                </>
                            )}

                            <div id="mapWrapper" className="mapHolder">
                                {showMap()}
                            </div>
                        </StyledMobileWrapper>
                    );
                }
            })()}
        </div>
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
