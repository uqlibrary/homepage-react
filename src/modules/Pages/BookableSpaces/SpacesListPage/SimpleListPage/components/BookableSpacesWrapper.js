import React from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router';

import { useMediaQuery, useTheme } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import GroupsIcon from '@mui/icons-material/Groups';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import PersonIcon from '@mui/icons-material/Person';
import TvIcon from '@mui/icons-material/Tv';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import FoodIcon from '@mui/icons-material/Fastfood';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import { SpacesHomePage } from 'modules/Pages/BookableSpaces/SpacesHomepage/SpacesHomePage';

import { JourneyDetailsView } from 'modules/Pages/BookableSpaces/SpacesListPage/SimpleListPage/components/JourneyDetailsView';
import { JourneyResultsView } from 'modules/Pages/BookableSpaces/SpacesListPage/SimpleListPage/components/JourneyResultsView';

import {
    findSpaceById,
    parseJourneyStateFromUrl,
    JOURNEY_VIEWS,
} from 'modules/Pages/BookableSpaces/Shared/spacesHelpers';
import { BookableSpacesJourneyView } from './BookableSpacesJourneyView';

const JOURNEY_VIEW_STATE_STORAGE_KEY = 'bookableSpacesJourneyViewState';

const journeyFallbackImage = require('../../../../../../../public/images/spaces/hero-jk-murray-library-gatton-students-outdoor-study.jpg');

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
        description: 'For group study and discussion.',
        icon: GroupsIcon,
        IconSvg:
            'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23000%27%3e%3cg fill=%27none%27 stroke=%27%2351247A%27 stroke-width=%27.75%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpath d=%27M5.914 11.344 4.23 12.602v-2.516H2.543a.829.829 0 0 1-.828-.828V2.543c0-.457.37-.828.828-.828h9.227a.83.83 0 0 1 .832.828v2.516M4.23 4.23h5.856M4.23 6.742h1.684%27%3e%3c/path%3e%3cpath d=%27M14.285 11.77h-1.683v2.515l-2.516-2.515H7.57V6.742h6.715zm-1.683-3.34H9.258m3.344 1.656H9.258%27%3e%3c/path%3e%3c/g%3e%3c/svg%3e")',
        matchers: [/group study/i],
    },
    {
        id: 'food',
        label: 'Near kitchens or cafés',
        description: 'Close to food options or places to eat.',
        icon: FoodIcon,
        IconSvg:
            'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23000%27%3e%3cg fill=%27none%27 stroke=%27%2351247A%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%27.75%27%3e%3cpath d=%27M5.06 14.29H2.97L1.71 5.06h7.12l-.2 1.51%27%3e%3c/path%3e%3cpath d=%27M4.66 10.94 5.9 1.71l2.52.43M7.57 12.6h5.86v.83c0 .46-.37.83-.83.83H8.43a.83.83 0 0 1-.83-.83v-.83zm1.69-4.17h2.51c.92 0 1.69.74 1.69 1.68v.83H7.57v-.83c0-.94.77-1.68 1.69-1.68zm-1.69 2.51h5.86a.83.83 0 0 1 0 1.66H7.57a.83.83 0 0 1 0-1.66zm0 0%27%3e%3c/path%3e%3c/g%3e%3c/svg%3e")',
        matchers: [/Food – retail outlet/i, /Kitchen/i, /Toilets \(all\)/i, /Vending machine/i],
    },
    {
        id: 'bookable',
        label: 'Bookable room',
        description: 'Reserve a room or desk.',
        icon: MeetingRoomIcon,
        IconSvg:
            'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23000%27%3e%3cg stroke=%27%2351247A%27 stroke-width=%27.75%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpath d=%27M2.543 3.398H13.43a.83.83 0 0 1 .828.832v9.227a.829.829 0 0 1-.828.828H2.543a.829.829 0 0 1-.828-.828V4.23a.83.83 0 0 1 .828-.832zm-.828 3.344h12.57M5.059 4.656V1.715m5.882 2.941V1.715%27 fill=%27none%27%3e%3c/path%3e%3cpath d=%27M4.43 8.828c-.118 0-.2.086-.2.2 0 .117.082.202.2.202a.196.196 0 0 0 .199-.203c.027-.086-.086-.199-.2-.199zm0 2.942c-.118 0-.2.085-.2.203 0 .113.082.199.2.199a.195.195 0 0 0 .199-.2.196.196 0 0 0-.2-.202zM8 8.828c-.113 0-.2.086-.2.2 0 .117.087.202.2.202.113 0 .2-.085.2-.203 0-.086-.087-.199-.2-.199zm0 2.942c-.113 0-.2.085-.2.203 0 .113.087.199.2.199.113 0 .2-.086.2-.2a.196.196 0 0 0-.2-.202zm3.57-2.942a.195.195 0 0 0-.199.2c0 .117.086.202.2.202a.194.194 0 0 0 .199-.203c0-.086-.083-.199-.2-.199zm0 2.942a.196.196 0 0 0-.199.203c0 .113.086.199.2.199a.194.194 0 0 0 .199-.2.194.194 0 0 0-.2-.202zm0 0%27%3e%3c/path%3e%3c/g%3e%3c/svg%3e")',
        matchers: [/bookable/i],
    },
    {
        id: 'postgrad',
        label: 'Postgraduate space',
        description: 'For research and higher-degree study.',
        icon: PersonIcon,
        IconSvg:
            'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23000%27%3e%3cg fill=%27none%27 stroke=%27%2351247A%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%27.75%27%3e%3cpath d=%27M10.94 4.66a2.94 2.94 0 1 1-5.88 0V1.7h5.85v2.95zm-8.4 9.63a5.46 5.46 0 0 1 10.92 0M1.71 1.71H14.3M5.06 4.23h5.85M2.54 1.71v4.2%27%3e%3c/path%3e%3cpath d=%27M5.2 9.6 8 11.77l2.8-2.17%27%3e%3c/path%3e%3c/g%3e%3c/svg%3e")',
        matchers: [/Postgraduate only space/i],
    },
    {
        id: 'lowlightpower',
        label: 'Low light with power',
        description: 'Dim lighting, lamps and power for devices.',
        icon: TvIcon,
        IconSvg:
            'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23000%27%3e%3cg fill=%27none%27 stroke=%27%2351247A%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-miterlimit=%278%27 stroke-width=%27.75%27%3e%3cpath d=%27M14.11 10.69H2.17a.45.45 0 0 1-.46-.46c0-.06 0-.12.06-.17l2.29-4.97h8.11l2.29 4.97c.11.23 0 .46-.23.57 0 .06-.06.06-.12.06zm0 0%27%3e%3c/path%3e%3cpath d=%27m3.03 14.52 1.26-3.9 1.25 3.9m5.2 0 1.26-3.9 1.26 3.9m-2.8-5.55L9.6 6.8H6.63l-.86 2.17m6.4-3.83V3.43c0-.97-.74-1.72-1.71-1.72h-3.2c-.46 0-.86.4-.86.86v.86h3.43V1.71%27%3e%3c/path%3e%3c/g%3e%3c/svg%3e")',
        matchers: [/Low light/i, /Desk lamps/i, /USB-C large device charging/i, /USB-C small device charging/i],
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
    showFavouriteSpacesOnly = false,
}) => {
    const url = new URL(currentUrl);
    const hashValue = url.hash || '';
    const isHashRouting = hashValue.startsWith('#/');

    const hasSelectedFacilityFilters = (selectedFacilityTypes || []).some(
        filter => filter?.selected || filter?.unselected,
    );
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
        url.hash = '#/spaces/mapresults';
        return url.toString();
    }

    url.pathname = '/spaces/mapresults';
    url.search = '';
    url.hash = '';
    return url.toString();
};

const BookableSpacesWrapper = ({
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
    onResetAllFilters,
    initialView = 'landing',
    showFavouriteSpacesOnly: controlledShowFavouriteSpacesOnly,
    setShowFavouriteSpacesOnly: setControlledShowFavouriteSpacesOnly,
}) => {
    const location = useLocation();
    const theme = useTheme();
    const isDesktopResultsLayout = useMediaQuery(theme.breakpoints.up('lg'));
    const [view, setView] = React.useState(initialView || 'landing');
    const [selectedIntentId, setSelectedIntentId] = React.useState(null);
    const [selectedSpace, setSelectedSpace] = React.useState(null);
    const [internalShowFavouriteSpacesOnly, setInternalShowFavouriteSpacesOnly] = React.useState(false);
    const hasHydratedJourneyViewStateRef = React.useRef(false);
    const isFavouriteFilterControlled = controlledShowFavouriteSpacesOnly !== undefined;
    const showFavouriteSpacesOnly = isFavouriteFilterControlled
        ? controlledShowFavouriteSpacesOnly
        : internalShowFavouriteSpacesOnly;
    const setShowFavouriteSpacesOnly = React.useCallback(
        nextValue => {
            if (isFavouriteFilterControlled && typeof setControlledShowFavouriteSpacesOnly === 'function') {
                setControlledShowFavouriteSpacesOnly(nextValue);
                return;
            }

            setInternalShowFavouriteSpacesOnly(nextValue);
        },
        [isFavouriteFilterControlled, setControlledShowFavouriteSpacesOnly],
    );
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
    const persistJourneyViewState = React.useCallback(nextState => {
        if (typeof window === 'undefined' || !window.sessionStorage) {
            return;
        }

        window.sessionStorage.setItem(JOURNEY_VIEW_STATE_STORAGE_KEY, JSON.stringify(nextState));
    }, []);
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

    React.useEffect(() => {
        if (hasHydratedJourneyViewStateRef.current || typeof window === 'undefined' || !window.sessionStorage) {
            return;
        }

        const currentRoutePath = `${location.pathname}${location.search}${location.hash}`;
        if (!currentRoutePath.includes('/spaces/results') && !currentRoutePath.includes('/spaces/detail/')) {
            hasHydratedJourneyViewStateRef.current = true;
            return;
        }

        const rawState = window.sessionStorage.getItem(JOURNEY_VIEW_STATE_STORAGE_KEY);
        if (!rawState) {
            hasHydratedJourneyViewStateRef.current = true;
            return;
        }

        try {
            const parsedState = JSON.parse(rawState);
            if (parsedState?.intentId) {
                setSelectedIntentId(parsedState.intentId);
                if (parsedState.intentId === favouriteIntentDefinition.id) {
                    setShowFavouriteSpacesOnly(true);
                } else {
                    const requestedIntent = availableIntentDefinitions.find(
                        intent => intent.id === parsedState.intentId,
                    );
                    if (requestedIntent) {
                        applyIntentFilters(requestedIntent, { replaceExistingFilters: true });
                    }
                }
            }
            if (parsedState?.view === 'details') {
                setView('details');
            } else if (parsedState?.view === 'results') {
                setView('results');
            }

            if (parsedState?.spaceId) {
                const resolvedSpace = findSpaceById(spacesForUrlLookup, parsedState.spaceId);
                if (resolvedSpace) {
                    setSelectedSpace(resolvedSpace);
                }
            }
        } catch {
            // Ignore malformed state and keep the route-derived view.
        } finally {
            hasHydratedJourneyViewStateRef.current = true;
        }
    }, [
        applyIntentFilters,
        availableIntentDefinitions,
        location.hash,
        location.pathname,
        location.search,
        setSelectedIntentId,
        setSelectedSpace,
        setShowFavouriteSpacesOnly,
        spacesForUrlLookup,
    ]);

    React.useEffect(() => {
        if (typeof window === 'undefined' || !window.sessionStorage) {
            return;
        }

        if (view === 'landing') {
            window.sessionStorage.removeItem(JOURNEY_VIEW_STATE_STORAGE_KEY);
            return;
        }

        persistJourneyViewState({
            view,
            intentId: selectedIntentId || null,
            spaceId: selectedSpace?.space_id || selectedSpace?.space_uuid || null,
        });
    }, [persistJourneyViewState, selectedIntentId, selectedSpace?.space_id, selectedSpace?.space_uuid, view]);

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
    const lastHydratedUrlIntentKeyRef = React.useRef(null);

    const applyIntentFilters = React.useCallback(
        (intent, { replaceExistingFilters = false } = {}) => {
            const existingFilters = Array.isArray(selectedFacilityTypes) ? selectedFacilityTypes : [];
            const sourceFacilityGroups =
                filteredFacilityTypeList?.data?.facility_type_groups || facilityTypeList?.data?.facility_type_groups;
            if (!sourceFacilityGroups?.length) {
                lastAppliedIntentIdRef.current = null;
                return false;
            }

            const sourceEntries = sourceFacilityGroups.flatMap(group =>
                (Array.isArray(group?.facility_type_children) ? group.facility_type_children : []).map(child => ({
                    facilityTypeId: Number(child?.facility_type_id),
                    facilityTypeName: child?.facility_type_name || '',
                    facilityTypeGroupId: group?.facility_type_group_id,
                    facilitySpecialAction: child?.facility_special_action || null,
                })),
            );
            const sourceNameById = new Map(
                sourceEntries
                    .filter(entry => Number.isFinite(entry.facilityTypeId))
                    .map(entry => [entry.facilityTypeId, entry.facilityTypeName]),
            );

            const sourceFilters = sourceEntries
                .filter(entry => Number.isFinite(entry.facilityTypeId))
                .map(entry => ({
                    facility_type_group_id: entry.facilityTypeGroupId,
                    facility_type_id: entry.facilityTypeId,
                    facility_type_name: entry.facilityTypeName || null,
                    selected: false,
                    unselected: false,
                    facility_special_action: entry.facilitySpecialAction,
                }));

            const hasActiveExistingFilters = existingFilters.some(filter => filter?.selected || filter?.unselected);
            const shouldUseExistingFiltersAsBase =
                !replaceExistingFilters && existingFilters.length > 0 && hasActiveExistingFilters;
            const baseFilters = shouldUseExistingFiltersAsBase ? existingFilters : sourceFilters;

            if (!baseFilters.length) {
                lastAppliedIntentIdRef.current = null;
                return false;
            }

            const nextFilters = baseFilters.map(filter => {
                const normalizedFacilityTypeId = Number(filter?.facility_type_id);
                const resolvedFacilityTypeName =
                    filter?.facility_type_name || sourceNameById.get(normalizedFacilityTypeId) || '';
                const isIntentMatch = intent?.matchers?.some(matcher => matcher.test(resolvedFacilityTypeName));
                return {
                    ...filter,
                    facility_type_id: Number.isFinite(normalizedFacilityTypeId)
                        ? normalizedFacilityTypeId
                        : filter?.facility_type_id,
                    facility_type_name: resolvedFacilityTypeName || null,
                    selected: isIntentMatch,
                    unselected: false,
                };
            });

            if (!nextFilters.some(filter => filter?.selected)) {
                if (replaceExistingFilters) {
                    const hasDifferenceFromExisting =
                        existingFilters.length !== nextFilters.length ||
                        nextFilters.some((nextFilter, index) => {
                            const existingFilter = existingFilters[index] || {};
                            return (
                                Number(existingFilter?.facility_type_id) !== Number(nextFilter?.facility_type_id) ||
                                !!existingFilter?.selected !== !!nextFilter?.selected ||
                                !!existingFilter?.unselected !== !!nextFilter?.unselected
                            );
                        });

                    if (hasDifferenceFromExisting) {
                        setSelectedFacilityTypes(nextFilters);
                    }
                }

                lastAppliedIntentIdRef.current = null;
                return false;
            }

            const hasStateDifference = nextFilters.some((nextFilter, index) => {
                const existingFilter = baseFilters[index];
                return (
                    !!nextFilter?.selected !== !!existingFilter?.selected ||
                    !!nextFilter?.unselected !== !!existingFilter?.unselected
                );
            });

            if (!hasStateDifference) {
                lastAppliedIntentIdRef.current = intent?.id || null;
                return true;
            }

            lastAppliedIntentIdRef.current = intent?.id || null;
            setSelectedFacilityTypes(nextFilters);
            return true;
        },
        [facilityTypeList, filteredFacilityTypeList, selectedFacilityTypes, setSelectedFacilityTypes],
    );

    const navigateToView = React.useCallback(nextView => {
        if (!JOURNEY_VIEWS.includes(nextView)) {
            return;
        }
        setView(nextView);
    }, []);

    const goToLegacyBrowse = () => {
        const nextUrl = buildLegacyBrowseNavigationUrl({
            currentUrl: window.location.href,
            selectedFacilityTypes,
            selectedCampus,
            selectedLibrary,
            capacityFilterValue,
            showFavouriteSpacesOnly,
        });
        window.location.assign(nextUrl);
    };

    const handleIntentSelect = intent => {
        setSelectedIntentId(intent.id);
        setSelectedSpace(null);
        persistJourneyViewState({ view: 'results', intentId: intent.id, spaceId: null });
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
            applyIntentFilters(intent, { replaceExistingFilters: true });
        }
        navigateToView('results', { intentId: intent.id, spaceId: null });
    };

    const activateFavouritesResults = React.useCallback(() => {
        setShowFavouriteSpacesOnly(true);
        setSelectedIntentId(favouriteIntentDefinition.id);
        setSelectedSpace(null);
        persistJourneyViewState({ view: 'results', intentId: favouriteIntentDefinition.id, spaceId: null });
        lastAppliedIntentIdRef.current = null;
        navigateToView('results', { intentId: favouriteIntentDefinition.id, spaceId: null });
    }, [navigateToView, persistJourneyViewState, setShowFavouriteSpacesOnly]);

    const handleClearJourneyFilters = () => {
        onResetAllFilters?.();
        if (typeof window !== 'undefined' && window.sessionStorage) {
            window.sessionStorage.removeItem('bookableSpacesJourneyLiveFilterState');
            window.sessionStorage.removeItem(JOURNEY_VIEW_STATE_STORAGE_KEY);
        }
        setSelectedIntentId(null);
        setShowFavouriteSpacesOnly(false);
        lastAppliedIntentIdRef.current = null;
    };

    const getIntentLandingUrl = React.useCallback(intent => {
        if (!intent?.id) {
            return '/spaces/results';
        }

        return `/spaces/results/filters=${encodeURIComponent(String(intent.id))}`;
    }, []);

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

    const urlJourneyState = React.useMemo(
        () => parseJourneyStateFromUrl(availableIntentDefinitions),
        [availableIntentDefinitions, location.hash, location.pathname, location.search],
    );

    const currentPath = `${location.pathname}${location.hash}`;
    const isDetailsRoute =
        currentPath.startsWith('/spaces/detail/') ||
        currentPath.startsWith('/spaces/details/') ||
        currentPath.includes('#/spaces/detail/') ||
        currentPath.includes('#/spaces/details/');
    const isResultsRoute =
        currentPath.startsWith('/spaces/results') ||
        currentPath.startsWith('/spaces/mapresults') ||
        currentPath.includes('#/spaces/results') ||
        currentPath.includes('#/spaces/mapresults');
    const currentUrlIntentKey =
        urlJourneyState?.view === 'results' && urlJourneyState?.intentId
            ? `${currentPath}::${urlJourneyState.intentId}`
            : null;

    const spacesForUrlLookup = React.useMemo(
        () => [
            ...(Array.isArray(allSpaceLocations) ? allSpaceLocations : []),
            ...(Array.isArray(filteredSpaceLocations) ? filteredSpaceLocations : []),
            ...(highlightedSpace ? [highlightedSpace] : []),
        ],
        [allSpaceLocations, filteredSpaceLocations, highlightedSpace],
    );

    React.useEffect(() => {
        if (isDetailsRoute) {
            const detailToken = currentPath.includes('/spaces/detail/') ? '/spaces/detail/' : '/spaces/details/';
            const requestedSpaceId = decodeURIComponent(currentPath.split(detailToken)[1] || '');

            if (view !== 'details') {
                setView('details');
            }

            const resolvedSpace = findSpaceById(spacesForUrlLookup, requestedSpaceId);
            if (resolvedSpace) {
                if (
                    String(selectedSpace?.space_id || selectedSpace?.space_uuid) !==
                    String(resolvedSpace?.space_id || resolvedSpace?.space_uuid)
                ) {
                    setSelectedSpace(resolvedSpace);
                }
                persistJourneyViewState({
                    view: 'details',
                    intentId: selectedIntentId || null,
                    spaceId: resolvedSpace?.space_id || resolvedSpace?.space_uuid || null,
                });
            } else if (selectedSpace) {
                setSelectedSpace(null);
            }

            return;
        }

        if (isResultsRoute) {
            if (view !== 'results') {
                setView('results');
            }
            if (selectedSpace) {
                setSelectedSpace(null);
            }

            if (currentUrlIntentKey && lastHydratedUrlIntentKeyRef.current !== currentUrlIntentKey) {
                setSelectedIntentId(urlJourneyState.intentId);
                setShowFavouriteSpacesOnly(urlJourneyState.intentId === favouriteIntentDefinition.id);

                let didApplyIntent = urlJourneyState.intentId === favouriteIntentDefinition.id;

                if (urlJourneyState.intentId !== favouriteIntentDefinition.id) {
                    const requestedIntent = availableIntentDefinitions.find(
                        intent => intent.id === urlJourneyState.intentId,
                    );
                    if (requestedIntent) {
                        didApplyIntent = applyIntentFilters(requestedIntent, { replaceExistingFilters: true });
                    }
                }

                if (didApplyIntent) {
                    lastHydratedUrlIntentKeyRef.current = currentUrlIntentKey;
                }
            }
        }
    }, [
        applyIntentFilters,
        availableIntentDefinitions,
        currentPath,
        isDetailsRoute,
        isResultsRoute,
        persistJourneyViewState,
        selectedIntentId,
        selectedSpace,
        spacesForUrlLookup,
        urlJourneyState,
        view,
        setShowFavouriteSpacesOnly,
    ]);

    React.useEffect(() => {
        if (!selectedIntentId || view !== 'results' || selectedIntentId === favouriteIntentDefinition.id) {
            return;
        }

        const shouldForceIntentRetry =
            !!currentUrlIntentKey && lastHydratedUrlIntentKeyRef.current !== currentUrlIntentKey;

        if (!shouldForceIntentRetry && lastAppliedIntentIdRef.current === selectedIntentId) {
            return;
        }

        const requestedIntent = availableIntentDefinitions.find(intent => intent.id === selectedIntentId) || null;
        if (!requestedIntent) {
            return;
        }

        const didApplyIntent = applyIntentFilters(requestedIntent, {
            replaceExistingFilters: shouldForceIntentRetry,
        });

        if (didApplyIntent && shouldForceIntentRetry) {
            lastHydratedUrlIntentKeyRef.current = currentUrlIntentKey;
        }
    }, [
        applyIntentFilters,
        availableIntentDefinitions,
        currentUrlIntentKey,
        filteredFacilityTypeList,
        selectedFacilityTypes,
        selectedIntentId,
        view,
    ]);

    React.useEffect(() => {
        if (view === 'details') {
            journeyTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [view]);

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
                <SpacesHomePage
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
                    getIntentLandingUrl={getIntentLandingUrl}
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
                        onResetAllFilters={onResetAllFilters}
                        isLoggedIn={isLoggedIn}
                        hasFavouriteSpaces={hasFavourites}
                        hasJourneyMapFilterState={false}
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

BookableSpacesWrapper.propTypes = {
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
    onResetAllFilters: PropTypes.func,
    initialView: PropTypes.oneOf(['landing', 'results', 'details']),
    showFavouriteSpacesOnly: PropTypes.bool,
    setShowFavouriteSpacesOnly: PropTypes.func,
};

export default React.memo(BookableSpacesWrapper);
