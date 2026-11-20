import { action, category, event } from './trackingEvents';
import {
    FILTER_CAPACITY_TYPE_ID,
    FILTER_SPACE_CAPACITY_ACTION_NAME,
    getActiveSelectedFacilityTypes,
    getFlatFacilityTypeList,
} from './spacesHelpers';

let lastTrackedPageView = null;

const normalizeFilterGroupKey = groupName =>
    String(groupName || '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');

export const buildSpacesActiveFilters = ({
    facilityTypeGroups = [],
    selectedFacilityTypes = [],
    capacityFilterValue,
    minimumSpaceCapacity,
    maximumSpaceCapacity,
    showFavouriteSpacesOnly = false,
} = {}) => {
    const groupNamesById = new Map(
        facilityTypeGroups
            .filter(
                group =>
                    group?.facility_type_group_id !== null &&
                    group?.facility_type_group_id !== undefined &&
                    group?.facility_type_group_name,
            )
            .map(group => [String(group.facility_type_group_id), group.facility_type_group_name]),
    );
    const facilityTypeNamesById = new Map(
        getFlatFacilityTypeList({ data: { facility_type_groups: facilityTypeGroups } })
            .filter(
                filter =>
                    filter?.facility_type_id !== null &&
                    filter?.facility_type_id !== undefined &&
                    filter?.facility_type_name,
            )
            .map(filter => [String(filter.facility_type_id), filter.facility_type_name]),
    );
    const filtersByGroup = new Map();
    const activeFacilityTypes = getActiveSelectedFacilityTypes(selectedFacilityTypes).filter(
        filter =>
            Number(filter?.facility_type_id) !== FILTER_CAPACITY_TYPE_ID &&
            filter?.facility_special_action !== FILTER_SPACE_CAPACITY_ACTION_NAME,
    );

    activeFacilityTypes.forEach(filter => {
        const groupId = filter?.facility_type_group_id;
        const groupName = filter?.facility_type_group_name || groupNamesById.get(String(groupId));
        const groupKey =
            normalizeFilterGroupKey(groupName) ||
            (groupId !== null && groupId !== undefined ? `group_${String(groupId)}` : 'other');
        const selectedTypes = filtersByGroup.get(groupKey) || [];
        selectedTypes.push(
            filter?.facility_type_name ||
                facilityTypeNamesById.get(String(filter?.facility_type_id)) ||
                String(filter?.facility_type_id),
        );
        filtersByGroup.set(groupKey, selectedTypes);
    });

    const activeFilters = Object.fromEntries(filtersByGroup);
    const hasActiveCapacityFilter =
        Array.isArray(capacityFilterValue) &&
        capacityFilterValue.length === 2 &&
        (Number(capacityFilterValue[0]) !== Number(minimumSpaceCapacity) ||
            Number(capacityFilterValue[1]) !== Number(maximumSpaceCapacity));

    if (hasActiveCapacityFilter) {
        activeFilters.capacity = {
            min: Number(capacityFilterValue[0]),
            max: Number(capacityFilterValue[1]),
        };
    }
    if (showFavouriteSpacesOnly) {
        activeFilters.favourites = true;
    }

    return activeFilters;
};

export const getSpacesClickContext = ({
    selectedCampus,
    campusList,
    selectedLibrary,
    librariesForCampus,
    facilityTypeList,
    filteredFacilityTypeList,
    selectedFacilityTypes,
    capacityFilterValue,
    minimumSpaceCapacity,
    maximumSpaceCapacity,
    showFavouriteSpacesOnly,
} = {}) => {
    const selectedCampusName =
        Number(selectedCampus) === 0
            ? 'All campuses'
            : campusList?.find(campus => Number(campus.campus_id) === Number(selectedCampus))?.campus_name || null;
    const selectedLibraryName =
        Number(selectedLibrary) === 0
            ? 'All libraries'
            : librariesForCampus?.find(library => Number(library.library_id) === Number(selectedLibrary))
                  ?.library_name || null;
    const facilityTypeGroups = [
        ...(Array.isArray(facilityTypeList?.data?.facility_type_groups)
            ? facilityTypeList.data.facility_type_groups
            : []),
        ...(Array.isArray(filteredFacilityTypeList?.data?.facility_type_groups)
            ? filteredFacilityTypeList.data.facility_type_groups
            : []),
    ];

    return {
        click_campus: selectedCampusName,
        click_library: selectedLibraryName,
        click_active_filters: buildSpacesActiveFilters({
            facilityTypeGroups,
            selectedFacilityTypes,
            capacityFilterValue,
            minimumSpaceCapacity,
            maximumSpaceCapacity,
            showFavouriteSpacesOnly,
        }),
    };
};

export const trackSpacesPageView = (pageTitle, pageViewKey) => {
    window.dataLayer = window.dataLayer || [];
    if (
        pageViewKey &&
        lastTrackedPageView?.dataLayer === window.dataLayer &&
        lastTrackedPageView.pageViewKey === pageViewKey
    ) {
        return;
    }

    const trackingData = {
        event: event.PAGE_VIEW,
        page_title: pageTitle,
    };
    console.log('GA PAGETITLE PUSH', trackingData);
    window.dataLayer.push(trackingData);
    lastTrackedPageView = pageViewKey ? { dataLayer: window.dataLayer, pageViewKey } : null;
};

export const trackSpacesNavigationClick = parameters => {
    window.dataLayer = window.dataLayer || [];
    const trackingData = {
        event: event.CLICK,
        click_category: category.NAVIGATION,
        click_action: action.CLICK,
        click_space_name: null,
        click_campus: null,
        click_library: null,
        click_active_filters: {},
        ...parameters,
    };
    console.log('GA SPACES CLICK PUSH', JSON.stringify(trackingData, null, 2));
    window.dataLayer.push(trackingData);
};

export const getSpacesSpaceName = space =>
    [space?.space_type_details?.space_type_name, space?.space_name].filter(Boolean).join(' ') || null;

export const trackSpacesFavouriteClick = ({ isFavourite, ...parameters }) => {
    window.dataLayer = window.dataLayer || [];
    const trackingData = {
        event: event.CLICK,
        click_category: category.SPACE,
        click_action: isFavourite ? action.DESELECT : action.SELECT,
        click_url: null,
        click_space_name: null,
        click_campus: null,
        click_library: null,
        click_active_filters: {},
        ...parameters,
    };
    console.log('GA SPACES CLICK PUSH', JSON.stringify(trackingData, null, 2));
    window.dataLayer.push(trackingData);
};

export const trackSpacesFilterSelection = ({ filterName, selection, clickClass, clickContext }) => {
    window.dataLayer = window.dataLayer || [];
    const trackingData = {
        event: event.CLICK,
        click_category: category.FILTERS,
        click_action: action.SELECT,
        click_label: `${filterName}=${selection}`,
        click_class: clickClass,
        click_url: null,
        click_space_name: null,
        ...clickContext,
    };
    console.log('GA SPACES CLICK PUSH', JSON.stringify(trackingData, null, 2));
    window.dataLayer.push(trackingData);
};

export const trackSpacesFilterGroupToggle = ({ isExpanded, filterName, clickClass, clickContext }) => {
    window.dataLayer = window.dataLayer || [];
    const trackingData = {
        event: event.CLICK,
        click_category: category.FILTERS,
        click_action: isExpanded ? action.EXPAND : action.COLLAPSE,
        click_label: filterName,
        click_class: clickClass,
        click_url: null,
        click_space_name: null,
        ...clickContext,
    };
    console.log('GA SPACES CLICK PUSH', JSON.stringify(trackingData, null, 2));
    window.dataLayer.push(trackingData);
};

export const trackSpacesFilterCheckbox = ({ isChecked, filterGroupName, filterName, clickClass, clickContext }) => {
    window.dataLayer = window.dataLayer || [];
    const trackingData = {
        event: event.CLICK,
        click_category: category.FILTERS,
        click_action: isChecked ? action.SELECT : action.DESELECT,
        click_label: `${filterGroupName}=${filterName}`,
        click_class: clickClass,
        click_url: null,
        click_space_name: null,
        ...clickContext,
    };
    console.log('GA SPACES CLICK PUSH', JSON.stringify(trackingData, null, 2));
    window.dataLayer.push(trackingData);
};
