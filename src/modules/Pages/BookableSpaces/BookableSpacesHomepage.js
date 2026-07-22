import React from 'react';
import PropTypes from 'prop-types';

import { Typography, useMediaQuery, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import ComputerIcon from '@mui/icons-material/Computer';
import FavoriteIcon from '@mui/icons-material/Favorite';
import GroupsIcon from '@mui/icons-material/Groups';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import PersonIcon from '@mui/icons-material/Person';
import TvIcon from '@mui/icons-material/Tv';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';

import { JourneyDetailsView } from 'modules/Pages/BookableSpaces/components/JourneyDetailsView';
import { JourneyResultsView } from 'modules/Pages/BookableSpaces/components/JourneyResultsView';
import { BookableSpacesJourneyView } from 'modules/Pages/BookableSpaces/components/BookableSpacesJourneyView';
import FavouritesList from 'modules/Pages/BookableSpaces/SpacesHomepage/FavouritesList';
import SpacesQuickLinks from 'modules/Pages/BookableSpaces/SpacesHomepage/SpacesQuickLinks';
import {
    JOURNEY_VIEWS,
    getJourneySearchParams,
    serialiseJourneyMapFilterState,
    serialiseJourneyUrl,
    parseJourneyStateFromUrl,
} from 'modules/Pages/BookableSpaces/journeyHelpers';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

const journeyFallbackImage = require('../../../../public/images/spaces/hero-jk-murray-library-gatton-students-outdoor-study.jpg');

const StyledLandingHeroShell = styled('section')(({ theme }) => ({
    background: 'linear-gradient(135deg, #4b2271 0%, #5e2c8d 58%, #6f369f 100%)',
    overflow: 'hidden',
    boxShadow: '0 16px 40px rgba(45, 19, 74, 0.16)',
    [theme.breakpoints.down('sm')]: {
        boxShadow: '0 12px 28px rgba(45, 19, 74, 0.14)',
    },
}));

const StyledLandingHeroLayout = styled('div')(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: '1fr',
    alignItems: 'stretch',
    minHeight: '420px',
    [theme.breakpoints.up('md')]: {
        gridTemplateColumns: 'minmax(0, 0.95fr) minmax(320px, 1.05fr)',
        minHeight: '390px',
    },
}));

const StyledLandingHeroVisual = styled('div')(({ theme }) => ({
    position: 'relative',
    minHeight: '220px',
    background:
        'linear-gradient(180deg, rgba(20, 8, 34, 0.18) 0%, rgba(20, 8, 34, 0.5) 100%), url(' +
        journeyFallbackImage +
        ')',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    order: 1,
    [theme.breakpoints.up('md')]: {
        order: 2,
        minHeight: '100%',
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        background:
            'linear-gradient(135deg, rgba(81, 36, 122, 0.18) 0%, rgba(81, 36, 122, 0.04) 42%, rgba(16, 8, 31, 0.38) 100%)',
    },
}));

const StyledLandingHeroContentColumn = styled('div')(({ theme }) => ({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    padding: '1.25rem',
    order: 2,
    [theme.breakpoints.up('md')]: {
        order: 1,
        padding: '2rem 0 2rem 2rem',
    },
}));

const StyledLandingHeroCard = styled('div')(({ theme }) => ({
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: '640px',
    backgroundColor: '#5a2b87',
    color: '#fff',
    padding: '1.6rem',
    boxShadow: '0 20px 40px rgba(26, 10, 43, 0.28)',
    [theme.breakpoints.up('md')]: {
        marginRight: '-5.5rem',
        padding: '2.25rem 2.5rem',
    },
}));

const StyledLandingHeroInner = styled('div')(({ theme }) => ({
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    [theme.breakpoints.down('md')]: {
        maxWidth: '100%',
    },
}));

const intentDefinitions = [
    {
        id: 'quiet',
        label: 'Quiet space',
        description: 'Find a peaceful spot to focus.',
        icon: VolumeOffIcon,
        IconSvg:
            'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23000%27%3e%3cg fill=%27none%27 stroke=%27%2351247A%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%27.75%27%3e%3cpath d=%27M1.71 4.66A3.69 3.69 0 0 1 4.7 1.8a3.76 3.76 0 0 1 4.57 3.68A4.5 4.5 0 0 1 7.7 8.91a2.13 2.13 0 0 0-.98 2.03c.03.46.03.92-.02 1.35a2.51 2.51 0 0 1-4.98-.52%27%3e%3c/path%3e%3cpath d=%27M3.48 5.57c.12-.83.9-1.43 1.72-1.34.83.11 1.43.88 1.34 1.71m7.75.8h-2.52m0-2.51 1.69-1.69m-1.69 6.72 1.69 1.68%27%3e%3c/path%3e%3c/g%3e%3c/svg%3e")',
        matchers: [/quiet/i, /low noise/i],
    },
    {
        id: 'collaborative',
        label: 'Collaborative space',
        description: 'Work together with your team.',
        icon: GroupsIcon,
        IconSvg:
            'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23000%27%3e%3cg fill=%27none%27 stroke=%27%2351247A%27 stroke-width=%27.75%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpath d=%27M5.914 11.344 4.23 12.602v-2.516H2.543a.829.829 0 0 1-.828-.828V2.543c0-.457.37-.828.828-.828h9.227a.83.83 0 0 1 .832.828v2.516M4.23 4.23h5.856M4.23 6.742h1.684%27%3e%3c/path%3e%3cpath d=%27M14.285 11.77h-1.683v2.515l-2.516-2.515H7.57V6.742h6.715zm-1.683-3.34H9.258m3.344 1.656H9.258%27%3e%3c/path%3e%3c/g%3e%3c/svg%3e")',
        matchers: [/collaborative/i, /group/i, /communal/i],
    },
    {
        id: 'computer',
        label: 'Computer access',
        description: 'Access library computers and software.',
        icon: ComputerIcon,
        IconSvg:
            'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23000%27%3e%3cpath fill=%27none%27 stroke=%27%2351247A%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%27.75%27 d=%27M13.03 9.14V3.7a.83.83 0 0 0-.83-.83H3.8a.83.83 0 0 0-.83.83v5.45zm1.17 2.6c.2.43 0 .92-.43 1.12a.73.73 0 0 1-.34.08H2.54a.83.83 0 0 1-.83-.83c0-.11.03-.22.1-.34l1.16-2.6h10.06zm-7.03-.51h1.69%27%3e%3c/path%3e%3c/svg%3e")',
        matchers: [/computer/i, /byod/i],
    },
    {
        id: 'bookable',
        label: 'Bookable room',
        description: 'Reserve a private or group meeting room.',
        icon: MeetingRoomIcon,
        IconSvg:
            'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23000%27%3e%3cg stroke=%27%2351247A%27 stroke-width=%27.75%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpath d=%27M2.543 3.398H13.43a.83.83 0 0 1 .828.832v9.227a.829.829 0 0 1-.828.828H2.543a.829.829 0 0 1-.828-.828V4.23a.83.83 0 0 1 .828-.832zm-.828 3.344h12.57M5.059 4.656V1.715m5.882 2.941V1.715%27 fill=%27none%27%3e%3c/path%3e%3cpath d=%27M4.43 8.828c-.118 0-.2.086-.2.2 0 .117.082.202.2.202a.196.196 0 0 0 .199-.203c.027-.086-.086-.199-.2-.199zm0 2.942c-.118 0-.2.085-.2.203 0 .113.082.199.2.199a.195.195 0 0 0 .199-.2.196.196 0 0 0-.2-.202zM8 8.828c-.113 0-.2.086-.2.2 0 .117.087.202.2.202.113 0 .2-.085.2-.203 0-.086-.087-.199-.2-.199zm0 2.942c-.113 0-.2.085-.2.203 0 .113.087.199.2.199.113 0 .2-.086.2-.2a.196.196 0 0 0-.2-.202zm3.57-2.942a.195.195 0 0 0-.199.2c0 .117.086.202.2.202a.194.194 0 0 0 .199-.203c0-.086-.083-.199-.2-.199zm0 2.942a.196.196 0 0 0-.199.203c0 .113.086.199.2.199a.194.194 0 0 0 .199-.2.194.194 0 0 0-.2-.202zm0 0%27%3e%3c/path%3e%3c/g%3e%3c/svg%3e")',
        matchers: [/bookable/i, /meeting room/i, /training room/i],
    },
    {
        id: 'postgrad',
        label: 'Postgraduate space',
        description: 'Dedicated spaces for research and higher-degree study.',
        icon: PersonIcon,
        IconSvg:
            'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23000%27%3e%3cg fill=%27none%27 stroke=%27%2351247A%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%27.75%27%3e%3cpath d=%27M10.94 4.66a2.94 2.94 0 1 1-5.88 0V1.7h5.85v2.95zm-8.4 9.63a5.46 5.46 0 0 1 10.92 0M1.71 1.71H14.3M5.06 4.23h5.85M2.54 1.71v4.2%27%3e%3c/path%3e%3cpath d=%27M5.2 9.6 8 11.77l2.8-2.17%27%3e%3c/path%3e%3c/g%3e%3c/svg%3e")',
        matchers: [/postgraduate/i],
    },
    {
        id: 'av',
        label: 'AV equipment',
        description: 'Spaces equipped with screens, projectors and audio.',
        icon: TvIcon,
        IconSvg:
            'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23000%27%3e%3cg fill=%27none%27 stroke=%27%2351247A%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%27.75%27%3e%3cpath d=%27M3.8 10.09h8.37m-2.08 4.2H5.9l-.43-4.2h5.04zM8 4.23c.8 0 1.46.66 1.46 1.46a1.46 1.46 0 0 1-2.92 0c0-.8.66-1.46 1.46-1.46zm1.83 4.2a2.4 2.4 0 0 0-3.37-.26c-.09.09-.2.17-.26.26%27%3e%3c/path%3e%3cpath d=%27M3.8 8.43H2.54a.83.83 0 0 1-.83-.83V2.54c0-.45.38-.83.83-.83h10.89c.48 0 .86.38.86.83v5.03c0 .46-.38.83-.83.83H12.2%27%3e%3c/path%3e%3c/g%3e%3c/svg%3e")',
        matchers: [/av equipment/i],
    },
];

const favouriteIntentDefinition = {
    id: 'favourite',
    label: 'Favourite spaces',
    description: 'Start with spaces you have already saved to your favourites.',
    icon: FavoriteIcon,
    matchers: [],
};

export const buildLegacyBrowseNavigationUrl = ({
    currentUrl,
    selectedFacilityTypes,
    selectedCampus,
    selectedLibrary,
    capacityFilterValue,
}) => {
    const url = new URL(currentUrl);
    const encodedMapFilters = serialiseJourneyMapFilterState({
        selectedFacilityTypes,
        selectedCampus,
        selectedLibrary,
        capacityFilterValue,
    });
    const searchParams = new URLSearchParams();
    searchParams.set('mapFilters', encodedMapFilters);
    searchParams.set('autoSelectFirstSpace', '1');

    const journeySearchParams = getJourneySearchParams(url);
    const userValue = journeySearchParams.params.get('user');
    if (userValue !== null) {
        searchParams.set('user', userValue);
    }

    const hashValue = url.hash || '';
    const isHashRouting = hashValue.startsWith('#/');

    if (isHashRouting) {
        url.search = '';
        url.hash = `#/spaces/mapresults?${searchParams.toString()}`;
        return url.toString();
    }

    url.pathname = '/spaces/mapresults';
    url.search = searchParams.toString();
    url.hash = '';
    return url.toString();
};

const findSpaceById = (spaces, targetSpaceId) => {
    if (!targetSpaceId) return null;
    return (
        spaces?.find(space => {
            const spaceUuid = space?.space_uuid;
            const spaceId = space?.space_id;
            return String(spaceUuid || '') === String(targetSpaceId) || String(spaceId || '') === String(targetSpaceId);
        }) || null
    );
};

const getSpaceIdentifier = space => space?.space_uuid || space?.space_id || null;

const getIntentFilterIds = (facilityGroups, intent) => {
    const ids = [];
    facilityGroups?.forEach(group => {
        group?.facility_type_children?.forEach(child => {
            const name = child?.facility_type_name || '';
            if (intent?.matchers?.some(matcher => matcher.test(name))) {
                ids.push(child?.facility_type_id);
            }
        });
    });
    return ids;
};

const JourneyLandingView = ({
    isLoggedIn,
    spacesFavouritesList,
    isFavouriteActionInProgress = false,
    handleJourneyFavouriteToggle,
    allSpaceLocations,
    filteredSpaceLocations,
    highlightedSpace,
    availableIntentDefinitions,
    favouriteIntentDefinition,
    selectedIntentId,
    handleIntentSelect,
    navigateToView,
    activateFavouritesResults,
    setSelectedSpace,
    setSelectedIntentId,
    goToLegacyBrowse,
}) => {
    const hasFavourites = isLoggedIn && (spacesFavouritesList?.length || 0) > 0;
    const availableIntentDefinitionsForLanding = React.useMemo(
        () => (hasFavourites ? [favouriteIntentDefinition, ...availableIntentDefinitions] : availableIntentDefinitions),
        [availableIntentDefinitions, favouriteIntentDefinition, hasFavourites],
    );

    return (
        <>
            <StyledLandingHeroShell>
                <StyledLandingHeroInner data-testid="spaces-journey-landing-hero-inner">
                    <StyledLandingHeroLayout data-testid="spaces-journey-landing-hero-layout">
                        <StyledLandingHeroContentColumn data-testid="spaces-journey-landing-hero-content-column">
                            <StyledLandingHeroCard data-testid="spaces-journey-landing-hero-card">
                                <Typography
                                    component="h1"
                                    sx={{
                                        margin: 0,
                                        fontWeight: 400,
                                        lineHeight: 1.12,
                                        fontSize: { xs: '2.05rem', md: '2.8rem' },
                                        letterSpacing: '-0.02em',
                                    }}
                                >
                                    Find study spaces
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        mt: 2,
                                        maxWidth: '30rem',
                                        color: 'rgba(255, 255, 255, 0.88)',
                                        lineHeight: 1.7,
                                        fontSize: { xs: '1rem', md: '1.08rem' },
                                    }}
                                >
                                    Discover study space options across UQ libraries.
                                </Typography>
                            </StyledLandingHeroCard>
                        </StyledLandingHeroContentColumn>
                        <StyledLandingHeroVisual data-testid="spaces-journey-landing-hero-visual" aria-hidden="true" />
                    </StyledLandingHeroLayout>
                </StyledLandingHeroInner>
            </StyledLandingHeroShell>
            <div style={{ paddingTop: '64px' }}>
                <StandardPage standardPageId="spaces-journey-content-standard-page">
                    {isLoggedIn && (spacesFavouritesList || []).length > 0 && (
                        <FavouritesList
                            favouriteIntentDefinition={favouriteIntentDefinition}
                            setSelectedIntentId={setSelectedIntentId}
                            navigateToView={navigateToView}
                            activateFavouritesResults={activateFavouritesResults}
                            allSpaceLocations={allSpaceLocations}
                            filteredSpaceLocations={filteredSpaceLocations}
                            highlightedSpace={highlightedSpace}
                            spacesFavouritesList={spacesFavouritesList}
                            selectedIntentId={selectedIntentId}
                            setSelectedSpace={setSelectedSpace}
                            handleJourneyFavouriteToggle={handleJourneyFavouriteToggle}
                            isFavouriteActionInProgress={isFavouriteActionInProgress}
                            findSpaceById={findSpaceById}
                            getSpaceIdentifier={getSpaceIdentifier}
                        />
                    )}
                    <SpacesQuickLinks
                        navigateToView={navigateToView}
                        availableIntentDefinitionsForLanding={availableIntentDefinitionsForLanding}
                        favouriteIntentDefinition={favouriteIntentDefinition}
                        handleIntentSelect={handleIntentSelect}
                        goToLegacyBrowse={goToLegacyBrowse}
                        serialiseJourneyUrl={serialiseJourneyUrl}
                    />
                </StandardPage>
            </div>
        </>
    );
};

JourneyLandingView.propTypes = {
    isLoggedIn: PropTypes.bool,
    spacesFavouritesList: PropTypes.array,
    isFavourite: PropTypes.bool,
    handleJourneyFavouriteToggle: PropTypes.func,
    allSpaceLocations: PropTypes.array,
    filteredSpaceLocations: PropTypes.array,
    highlightedSpace: PropTypes.object,
    landingHighlights: PropTypes.array,
    highlightSpaceDescription: PropTypes.string,
    availableIntentDefinitions: PropTypes.array,
    favouriteIntentDefinition: PropTypes.object,
    selectedIntentId: PropTypes.any,
    handleIntentSelect: PropTypes.func,
    navigateToView: PropTypes.func,
    setSelectedSpace: PropTypes.func,
    setSelectedIntentId: PropTypes.func,
    goToLegacyBrowse: PropTypes.func,
    weeklyHours: PropTypes.any,
    weeklyHoursLoading: PropTypes.bool,
    weeklyHoursError: PropTypes.any,
    isFavouriteActionInProgress: PropTypes.bool,
    activateFavouritesResults: PropTypes.func,
};

const BookableSpacesHomepage = ({
    filteredSpaceLocations,
    allSpaceLocations,
    totalSpaceCount,
    highlightedSpace,
    isLoggedIn,
    spacesFavouritesList,
    servicesAndSpacesArticles,
    selectedFacilityTypes,
    setSelectedFacilityTypes,
    filteredFacilityTypeList,
    facilityTypeList,
    facilityTypeListLoading,
    facilityTypeListError,
    minimumSpaceCapacity,
    maximumSpaceCapacity,
    capacityFilterValue,
    setCapacityFilterValue,
    campusList,
    selectedCampus,
    handleCampusSelection,
    activeFilterCount,
    librariesForCampus,
    selectedLibrary,
    handleLibrarySelection,
    weeklyHours,
    weeklyHoursLoading,
    weeklyHoursError,
    onFavouriteToggle,
    isFavouriteActionInProgress,
    initialView = 'landing',
}) => {
    const theme = useTheme();
    const isDesktopResultsLayout = useMediaQuery(theme.breakpoints.up('lg'));
    const [view, setView] = React.useState(initialView || 'landing');
    const [selectedIntentId, setSelectedIntentId] = React.useState(null);
    const [selectedSpace, setSelectedSpace] = React.useState(null);
    const [showFavouriteSpacesOnly, setShowFavouriteSpacesOnly] = React.useState(false);
    const journeyTopRef = React.useRef(null);
    const [showAdvancedFilters, setShowAdvancedFilters] = React.useState(false);
    const canShowAdvancedFilters = view === 'results';
    const shouldShowAdvancedFilters = canShowAdvancedFilters && (isDesktopResultsLayout || showAdvancedFilters);
    const hasFavourites = isLoggedIn && (spacesFavouritesList?.length || 0) > 0;

    const availableIntentDefinitions = React.useMemo(
        () => (hasFavourites ? [favouriteIntentDefinition, ...intentDefinitions] : intentDefinitions),
        [hasFavourites],
    );

    const selectedIntent = availableIntentDefinitions.find(intent => intent.id === selectedIntentId) || null;
    const favouriteSpaceIds = React.useMemo(
        () => new Set((spacesFavouritesList || []).map(favourite => String(favourite?.space_id))),
        [spacesFavouritesList],
    );
    const validCampusList = React.useMemo(
        () =>
            (campusList || []).filter(campus => {
                const hasId = campus?.campus_id !== null && campus?.campus_id !== undefined;
                const hasName = typeof campus?.campus_name === 'string' && campus.campus_name.trim().length > 0;
                const hasSpaces = Number(campus?.campus_space_count) > 0;
                return hasId && hasName && hasSpaces;
            }),
        [campusList],
    );
    const validCampusIds = React.useMemo(
        () => new Set(validCampusList.map(campus => String(campus.campus_id))),
        [validCampusList],
    );
    const intentSpaceLocations = React.useMemo(() => {
        const spacesWithIntentApplied = filteredSpaceLocations || [];

        const spacesWithFavouriteFilterApplied =
            showFavouriteSpacesOnly && hasFavourites
                ? spacesWithIntentApplied.filter(space => favouriteSpaceIds.has(String(space?.space_id)))
                : spacesWithIntentApplied;

        // Exclude orphaned spaces with no valid campus assignment from journey results.
        if (validCampusIds.size === 0) {
            return spacesWithFavouriteFilterApplied;
        }

        return spacesWithFavouriteFilterApplied.filter(space => validCampusIds.has(String(space?.space_campus_id)));
    }, [filteredSpaceLocations, favouriteSpaceIds, hasFavourites, showFavouriteSpacesOnly, validCampusIds]);
    const isSelectedSpaceFavourite = favouriteSpaceIds.has(String(selectedSpace?.space_id));
    const handleJourneyFavouriteToggle = async space => {
        if (!space?.space_id || !onFavouriteToggle || !isLoggedIn) {
            return;
        }
        const action = favouriteSpaceIds.has(String(space.space_id)) ? 'removeSpaceFavourite' : 'addSpaceFavourite';
        await onFavouriteToggle(action, space.space_id);
    };
    React.useEffect(() => {
        if (!canShowAdvancedFilters) {
            setShowAdvancedFilters(false);
            return;
        }

        if (isDesktopResultsLayout) {
            setShowAdvancedFilters(true);
        }
    }, [canShowAdvancedFilters, isDesktopResultsLayout]);

    const lastAppliedIntentIdRef = React.useRef(null);

    const applyIntentFilters = React.useCallback(
        intent => {
            const ids = getIntentFilterIds(filteredFacilityTypeList?.data?.facility_type_groups, intent);
            const existingFilters = Array.isArray(selectedFacilityTypes) ? selectedFacilityTypes : [];
            const facilityTypeEntries = (filteredFacilityTypeList?.data?.facility_type_groups || []).flatMap(group => {
                const children = Array.isArray(group?.facility_type_children) ? group.facility_type_children : [];
                return children
                    .map(child => {
                        const facilityTypeId = Number(child?.facility_type_id);
                        if (!Number.isFinite(facilityTypeId)) {
                            return null;
                        }

                        const existingFilter = existingFilters.find(
                            filter => Number(filter?.facility_type_id) === facilityTypeId,
                        );

                        return {
                            ...(existingFilter || {}),
                            facility_type_id: facilityTypeId,
                            facility_type_name: child?.facility_type_name || existingFilter?.facility_type_name || null,
                            selected: false,
                            unselected: false,
                            facility_special_action: existingFilter?.facility_special_action || null,
                        };
                    })
                    .filter(Boolean);
            });

            const nextFilters = facilityTypeEntries.map(filter => ({
                ...filter,
                selected: ids.includes(Number(filter.facility_type_id)),
                unselected: false,
            }));

            lastAppliedIntentIdRef.current = intent?.id || null;
            setSelectedFacilityTypes(nextFilters);
        },
        [filteredFacilityTypeList, selectedFacilityTypes, setSelectedFacilityTypes],
    );

    // Keep browser history and journey views aligned so browser Back stays inside journey steps.
    const journeyHistoryRef = React.useRef(['landing']);

    const buildHistoryState = React.useCallback((nextView, nextIntentId = null, nextSpaceId = null) => {
        return {
            journeyView: nextView,
            journeyIntentId: nextIntentId,
            journeySpaceId: nextSpaceId ? String(nextSpaceId) : null,
        };
    }, []);

    const writeJourneyHistory = React.useCallback(
        ({ nextView, nextIntentId = null, nextSpaceId = null, method = 'replaceState' }) => {
            const nextUrl = serialiseJourneyUrl({
                view: nextView,
                intentId: nextIntentId,
                spaceId: nextSpaceId,
            });
            const nextState = buildHistoryState(nextView, nextIntentId, nextSpaceId);

            window.history[method](nextState, '', nextUrl);
        },
        [buildHistoryState],
    );

    const navigateToView = React.useCallback(
        (
            nextView,
            { pushHistory = true, intentId = selectedIntentId, spaceId = getSpaceIdentifier(selectedSpace) } = {},
        ) => {
            if (!JOURNEY_VIEWS.includes(nextView)) {
                return;
            }

            const currentHistory = journeyHistoryRef.current;
            const lastView = currentHistory[currentHistory.length - 1];
            if (nextView === lastView) {
                setView(nextView);
                return;
            }

            currentHistory.push(nextView);
            if (pushHistory) {
                writeJourneyHistory({
                    nextView,
                    nextIntentId: intentId,
                    nextSpaceId: spaceId,
                    method: 'pushState',
                });
            }
            setView(nextView);
        },
        [selectedIntentId, selectedSpace, writeJourneyHistory],
    );

    const goToLegacyBrowse = () => {
        const nextUrl = buildLegacyBrowseNavigationUrl({
            currentUrl: window.location.href,
            selectedFacilityTypes,
            selectedCampus,
            selectedLibrary,
            capacityFilterValue,
        });
        window.location.assign(nextUrl);
    };

    const handleIntentSelect = intent => {
        setSelectedIntentId(intent.id);
        setSelectedSpace(null);
        if (intent.id === favouriteIntentDefinition.id) {
            setShowFavouriteSpacesOnly(true);
            const clearedFilters = (selectedFacilityTypes || []).map(filter => ({
                ...filter,
                selected: false,
                unselected: false,
            }));
            lastAppliedIntentIdRef.current = null;
            setSelectedFacilityTypes(clearedFilters);
        } else {
            setShowFavouriteSpacesOnly(false);
            applyIntentFilters(intent);
        }
        navigateToView('results', { intentId: intent.id, spaceId: null });
    };

    const activateFavouritesResults = React.useCallback(() => {
        setShowFavouriteSpacesOnly(true);
        setSelectedIntentId(favouriteIntentDefinition.id);
        setSelectedSpace(null);
        lastAppliedIntentIdRef.current = null;
        navigateToView('results', { intentId: favouriteIntentDefinition.id, spaceId: null });
    }, [navigateToView]);

    const handleClearJourneyFilters = () => {
        const nextFilters = selectedFacilityTypes.map(filter => ({
            ...filter,
            selected: false,
            unselected: false,
        }));
        setSelectedFacilityTypes(nextFilters);
        setSelectedIntentId(null);
        setShowFavouriteSpacesOnly(false);
        lastAppliedIntentIdRef.current = null;
    };

    const landingHighlights = React.useMemo(
        () =>
            (servicesAndSpacesArticles || []).slice(0, 3).map(article => ({
                title: article?.title || 'Library update',
                description: article?.description || '',
                categories:
                    Array.isArray(article?.categories) && article.categories.length > 0
                        ? article.categories
                        : ['Services and spaces'],
                image: article?.image || journeyFallbackImage,
                imagePosition: 'center',
                canonical_url: article?.canonical_url || null,
            })),
        [servicesAndSpacesArticles],
    );

    const highlightSpaceDescription = React.useMemo(() => {
        if (!highlightedSpace?.space_description) return '';
        return String(highlightedSpace.space_description)
            .replace(/<[^>]*>/g, ' ')
            .replace(/\s{2,}/g, ' ')
            .trim();
    }, [highlightedSpace]);

    React.useEffect(() => {
        const spacesForLookup = [
            ...(Array.isArray(allSpaceLocations) ? allSpaceLocations : []),
            ...(Array.isArray(filteredSpaceLocations) ? filteredSpaceLocations : []),
            ...(highlightedSpace ? [highlightedSpace] : []),
        ];
        const parsedState = parseJourneyStateFromUrl(availableIntentDefinitions);

        let nextView = parsedState.view;
        let nextIntentId = parsedState.intentId;
        let nextSelectedSpace = null;

        if (
            nextView === 'landing' &&
            initialView &&
            initialView !== 'landing' &&
            !parsedState.intentId &&
            !parsedState.spaceId
        ) {
            nextView = initialView;
        }

        if (nextView === 'landing' || nextView === 'intent') {
            nextIntentId = null;
        }

        if (nextView === 'details') {
            nextSelectedSpace = findSpaceById(spacesForLookup, parsedState.spaceId);
            if (!nextSelectedSpace) {
                nextView = nextIntentId ? 'results' : 'landing';
            }
        }

        setView(nextView);
        setSelectedIntentId(nextIntentId || null);
        setShowFavouriteSpacesOnly(nextIntentId === favouriteIntentDefinition.id);
        setSelectedSpace(nextSelectedSpace);
        journeyHistoryRef.current = [nextView];

        if (!nextIntentId || nextView !== 'results') {
            lastAppliedIntentIdRef.current = null;
        }

        writeJourneyHistory({
            nextView,
            nextIntentId: nextIntentId || null,
            nextSpaceId: getSpaceIdentifier(nextSelectedSpace) || null,
            method: 'replaceState',
        });
    }, [
        allSpaceLocations,
        availableIntentDefinitions,
        filteredFacilityTypeList,
        filteredSpaceLocations,
        highlightedSpace,
        selectedFacilityTypes,
        writeJourneyHistory,
    ]);

    React.useEffect(() => {
        if (!selectedIntentId || view !== 'results' || selectedIntentId === favouriteIntentDefinition.id) {
            return;
        }

        const requestedIntent = availableIntentDefinitions.find(intent => intent.id === selectedIntentId) || null;
        if (!requestedIntent || lastAppliedIntentIdRef.current === selectedIntentId) {
            return;
        }

        applyIntentFilters(requestedIntent);
    }, [applyIntentFilters, availableIntentDefinitions, selectedIntentId, view]);

    React.useEffect(() => {
        const historyTop = journeyHistoryRef.current[journeyHistoryRef.current.length - 1];
        if (historyTop !== view) {
            return;
        }

        writeJourneyHistory({
            nextView: view,
            nextIntentId: selectedIntentId,
            nextSpaceId: getSpaceIdentifier(selectedSpace) || null,
            method: 'replaceState',
        });
    }, [selectedIntentId, selectedSpace, view, writeJourneyHistory]);

    React.useEffect(() => {
        if (view === 'details') {
            journeyTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [view]);

    React.useEffect(() => {
        const handlePopState = event => {
            const currentHistory = journeyHistoryRef.current;
            const parsedState = parseJourneyStateFromUrl(availableIntentDefinitions);
            let targetView = event?.state?.journeyView || parsedState.view;
            const targetIntentId = event?.state?.journeyIntentId || parsedState.intentId;
            const targetSpaceId = event?.state?.journeySpaceId || parsedState.spaceId;

            if (!JOURNEY_VIEWS.includes(targetView)) {
                return;
            }

            const spacesForLookup = [
                ...(Array.isArray(allSpaceLocations) ? allSpaceLocations : []),
                ...(Array.isArray(filteredSpaceLocations) ? filteredSpaceLocations : []),
                ...(highlightedSpace ? [highlightedSpace] : []),
            ];
            let targetSelectedSpace = null;
            if (targetView === 'details') {
                targetSelectedSpace = findSpaceById(spacesForLookup, targetSpaceId);
                if (!targetSelectedSpace) {
                    targetView = targetIntentId ? 'results' : 'landing';
                }
            }

            while (currentHistory.length > 1 && currentHistory[currentHistory.length - 1] !== targetView) {
                currentHistory.pop();
            }

            if (currentHistory[currentHistory.length - 1] !== targetView) {
                currentHistory.push(targetView);
            }

            setSelectedIntentId(targetView === 'results' || targetView === 'details' ? targetIntentId || null : null);
            setShowFavouriteSpacesOnly(targetIntentId === favouriteIntentDefinition.id);
            setSelectedSpace(targetView === 'details' ? targetSelectedSpace : null);
            navigateToView(targetView, { pushHistory: false, intentId: targetIntentId, spaceId: targetSpaceId });
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [allSpaceLocations, availableIntentDefinitions, filteredSpaceLocations, highlightedSpace, navigateToView]);

    return (
        <BookableSpacesJourneyView
            view={view}
            selectedIntent={selectedIntent}
            selectedIntentId={selectedIntentId}
            selectedSpace={selectedSpace}
            navigateToView={navigateToView}
            setSelectedIntentId={setSelectedIntentId}
            setSelectedSpace={setSelectedSpace}
            journeyTopRef={journeyTopRef}
            renderLandingView={() => (
                <JourneyLandingView
                    isLoggedIn={isLoggedIn}
                    spacesFavouritesList={spacesFavouritesList}
                    isFavourite={spacesFavouritesList?.some(fav => fav.space_id === allSpaceLocations?.space_id)}
                    allSpaceLocations={allSpaceLocations}
                    handleJourneyFavouriteToggle={handleJourneyFavouriteToggle}
                    filteredSpaceLocations={filteredSpaceLocations}
                    highlightedSpace={highlightedSpace}
                    landingHighlights={landingHighlights}
                    highlightSpaceDescription={highlightSpaceDescription}
                    availableIntentDefinitions={availableIntentDefinitions}
                    favouriteIntentDefinition={favouriteIntentDefinition}
                    selectedIntentId={selectedIntentId}
                    handleIntentSelect={handleIntentSelect}
                    navigateToView={navigateToView}
                    activateFavouritesResults={activateFavouritesResults}
                    setSelectedSpace={setSelectedSpace}
                    setSelectedIntentId={setSelectedIntentId}
                    goToLegacyBrowse={goToLegacyBrowse}
                    weeklyHours={weeklyHours}
                    weeklyHoursLoading={weeklyHoursLoading}
                    weeklyHoursError={weeklyHoursError}
                    onFavouriteToggle={onFavouriteToggle}
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
                    selectedCampus={selectedCampus}
                    handleCampusSelection={handleCampusSelection}
                    activeFilterCount={activeFilterCount}
                    librariesForCampus={librariesForCampus}
                    selectedLibrary={selectedLibrary}
                    handleLibrarySelection={handleLibrarySelection}
                    isFavouriteActionInProgress={isFavouriteActionInProgress}
                />
            )}
            renderResultsView={() => (
                <StandardPage standardPageId="spaces-journey-content-standard-page" fullWidth>
                    <JourneyResultsView
                        selectedIntent={selectedIntent}
                        intentSpaceLocations={intentSpaceLocations}
                        totalSpaceCount={totalSpaceCount}
                        selectedIntentId={selectedIntentId}
                        setSelectedSpace={setSelectedSpace}
                        navigateToView={navigateToView}
                        handleClearJourneyFilters={handleClearJourneyFilters}
                        goToLegacyBrowse={goToLegacyBrowse}
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
                        selectedCampus={selectedCampus}
                        handleCampusSelection={handleCampusSelection}
                        activeFilterCount={activeFilterCount}
                        librariesForCampus={librariesForCampus}
                        selectedLibrary={selectedLibrary}
                        handleLibrarySelection={handleLibrarySelection}
                        shouldShowAdvancedFilters={shouldShowAdvancedFilters}
                        isDesktopResultsLayout={isDesktopResultsLayout}
                        showAdvancedFilters={showAdvancedFilters}
                        setShowAdvancedFilters={setShowAdvancedFilters}
                        weeklyHours={weeklyHours}
                        weeklyHoursLoading={weeklyHoursLoading}
                        weeklyHoursError={weeklyHoursError}
                        isFavouriteActionInProgress={isFavouriteActionInProgress}
                        onFavouriteToggle={handleJourneyFavouriteToggle}
                        spacesFavouritesList={spacesFavouritesList}
                        showFavouriteSpacesOnly={showFavouriteSpacesOnly}
                        setShowFavouriteSpacesOnly={setShowFavouriteSpacesOnly}
                        isLoggedIn={isLoggedIn}
                        hasFavouriteSpaces={hasFavourites}
                    />
                </StandardPage>
            )}
            renderDetailsView={() => (
                <StandardPage standardPageId="spaces-journey-content-standard-page">
                    <JourneyDetailsView
                        selectedSpace={selectedSpace}
                        isLoggedIn={isLoggedIn}
                        weeklyHours={weeklyHours}
                        weeklyHoursLoading={weeklyHoursLoading}
                        weeklyHoursError={weeklyHoursError}
                        isSelectedSpaceFavourite={isSelectedSpaceFavourite}
                        isFavouriteActionInProgress={isFavouriteActionInProgress}
                        onFavouriteToggle={handleJourneyFavouriteToggle}
                    />
                </StandardPage>
            )}
        />
    );
};

BookableSpacesHomepage.propTypes = {
    filteredSpaceLocations: PropTypes.array,
    allSpaceLocations: PropTypes.array,
    totalSpaceCount: PropTypes.number,
    highlightedSpace: PropTypes.object,
    isLoggedIn: PropTypes.bool,
    spacesFavouritesList: PropTypes.array,
    servicesAndSpacesArticles: PropTypes.array,
    selectedFacilityTypes: PropTypes.array,
    setSelectedFacilityTypes: PropTypes.func,
    filteredFacilityTypeList: PropTypes.object,
    facilityTypeList: PropTypes.object,
    facilityTypeListLoading: PropTypes.bool,
    facilityTypeListError: PropTypes.any,
    minimumSpaceCapacity: PropTypes.number,
    maximumSpaceCapacity: PropTypes.number,
    capacityFilterValue: PropTypes.array,
    setCapacityFilterValue: PropTypes.func,
    campusList: PropTypes.array,
    selectedCampus: PropTypes.number,
    handleCampusSelection: PropTypes.func,
    activeFilterCount: PropTypes.number,
    librariesForCampus: PropTypes.array,
    selectedLibrary: PropTypes.number,
    handleLibrarySelection: PropTypes.func,
    weeklyHours: PropTypes.any,
    weeklyHoursLoading: PropTypes.bool,
    weeklyHoursError: PropTypes.any,
    onFavouriteToggle: PropTypes.func,
    isFavouriteActionInProgress: PropTypes.any,
    initialView: PropTypes.oneOf(['landing', 'results', 'details']),
};

export default React.memo(BookableSpacesHomepage);
