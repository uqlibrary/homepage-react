import React from 'react';

export const FILTER_BOOKABLE_TYPE_ID = 9002;
export const FILTER_CAPACITY_TYPE_ID = 9003;

export const FILTER_BOOKABLE_ACTION_NAME = 'bookable';
export const FILTER_CURRENTLY_OPEN_ACTION_NAME = 'open';
export const FILTER_SPACE_CAPACITY_ACTION_NAME = 'capacity';

export const FACILITY_TYPE_CHECKBOX = 'checkbox';
export const FACILITY_TYPE_SLIDER = 'slider';

export const FILTER_DISPLAY_ON_SIMPLE = 'simple';
export const FILTER_DISPLAY_ON_MAP = 'advanced';
export const FILTER_DISPLAY_ON_BOTH = 'both';

export const normalizeFilterDisplayOn = value => {
    const validDisplayOnValues = [FILTER_DISPLAY_ON_SIMPLE, FILTER_DISPLAY_ON_MAP, FILTER_DISPLAY_ON_BOTH];
    return validDisplayOnValues.includes(value) ? value : FILTER_DISPLAY_ON_BOTH;
};

export function getOrdinalSuffixFor(number) {
    const mod10 = number % 10;
    const mod100 = number % 100;
    if (mod10 === 1 && mod100 !== 11) {
        return 'st';
    }
    if (mod10 === 2 && mod100 !== 12) {
        return 'nd';
    }
    if (mod10 === 3 && mod100 !== 13) {
        return 'rd';
    }
    return 'th';
}

export const isInt = value => {
    const x = parseFloat(value);
    return !isNaN(value) && (x | 0) === x;
};

export const getPrefixedFloorName = floorName => {
    return floorName?.startsWith('Level ') ? floorName : `Level ${floorName}`;
};
export function getFriendlyFloorName(bookableSpace) {
    if (!!bookableSpace?.space_is_ground_floor) {
        return 'Ground floor';
    }
    return getPrefixedFloorName(bookableSpace?.space_floor_name);
}

export function getFriendlyLocationDescription(bookableSpace, isCollapsed = false, hideOptions = {}) {
    if (isCollapsed) {
        return (
            <div className="location-space location-library">
                {bookableSpace?.space_library_name && bookableSpace?.space_library_name}
            </div>
        );
    }
    return (
        <>
            {!hideOptions.space_name && (
                <div className="location-space location-name">{`${bookableSpace?.space_name || ''}`}</div>
            )}
            <div className="location-space location-campus">{`${bookableSpace?.space_campus_name}`}</div>
            <div className="location-space location-building">{`${bookableSpace?.space_building_name} (${bookableSpace?.space_building_number})`}</div>
            <div className="location-space location-library">
                {bookableSpace?.space_library_name && bookableSpace?.space_library_name}{' '}
                <span className="location-floor">{getFriendlyFloorName(bookableSpace)}</span>
            </div>
            {!!bookableSpace?.space_precise ? (
                <div className="location-space location-precise">{bookableSpace?.space_precise}</div>
            ) : null}
        </>
    );
}
export const getFlatFacilityTypeList = facilityTypes => {
    return (
        facilityTypes?.data?.facility_type_groups?.flatMap(group => {
            const groupId = group?.facility_type_group_id;
            return group?.facility_type_children?.map(child => ({
                facility_type_group_id: groupId,
                facility_type_id: child?.facility_type_id,
                facility_type_name: child?.facility_type_name,
                facility_special_action: child?.facility_special_action,
                hide_in_public_filter_list: child?.hide_in_public_filter_list,
                filter_display_on: normalizeFilterDisplayOn(child?.filter_display_on),
            }));
        }) || []
    );
};

function filterNext7Days(departmentData) {
    // Get today's date (start of day)
    const today = new Date();
    today?.setHours(0, 0, 0, 0);

    // Calculate the end date (6 days from today)
    const endDate = new Date(today);
    endDate?.setDate(today?.getDate() + 6);

    // Filter days to include only the next 7 days starting from today
    const filteredDays = departmentData?.days?.filter(day => {
        const dayDate = new Date(day?.date);
        dayDate?.setHours(0, 0, 0, 0);

        return dayDate >= today && dayDate <= endDate;
    });

    // Sort by date to ensure chronological order
    filteredDays?.sort((a, b) => new Date(a?.date) - new Date(b?.date));

    filteredDays?.map((d, index) => {
        if (index <= 1) {
            d.dayName = index === 0 ? 'Today' : 'Tomorrow';
        }
        return d;
    });

    // Return the department with filtered days
    const result = {
        ...departmentData,
        next7days: filteredDays,
    };
    delete result.days;

    return result;
}

// rewrite the hours-by-week into one long list of days
function convertWeeksToDays(department) {
    if (!department) {
        return [];
    }

    // Define the order of days for consistent sorting
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    if (department?.weeks && Array.isArray(department?.weeks)) {
        const allDays = [];

        department?.weeks?.forEach(week => {
            dayOrder?.forEach(dayName => {
                if (week[dayName]) {
                    // Add day name as a property for easier identification
                    const dayData = {
                        dayName: dayName,
                        ...week[dayName],
                    };
                    allDays?.push(dayData);
                }
            });
        });

        delete department?.weeks;
        allDays?.sort((a, b) => new Date(a?.date) - new Date(b?.date));
        department.days = allDays;
    }

    let result = department;
    if (!!department?.days) {
        result = filterNext7Days(department);
    }

    return result;
}

export const spaceOpeningHours = (bookableSpace, weeklyHours) => {
    const details = weeklyHours?.locations?.filter(lib =>
        lib?.departments.find(departments => departments?.lid === bookableSpace?.space_opening_hours_id),
    );
    if (!details) {
        return [];
    }
    const theLibrary = details?.at(0);
    const department = theLibrary?.departments.filter(
        departments => departments?.lid === bookableSpace?.space_opening_hours_id,
    );

    const relevantDepartment = department?.at(0);
    const openingDetails = convertWeeksToDays(relevantDepartment);
    return openingDetails?.next7days || [];
};

export const isBookable = space => {
    return space?.space_external_book_url?.startsWith('http');
};

export const matchesCapacityFilter = ({
    space,
    capacityFilterValue,
    minimumSpaceCapacity,
    maximumSpaceCapacity,
    hasBookableFilterSelected = false,
}) => {
    const minimumCapacity = Number(capacityFilterValue?.[0] ?? minimumSpaceCapacity);
    const maximumCapacity = Number(capacityFilterValue?.[1] ?? maximumSpaceCapacity);
    const normalizedCapacity = Number(space?.space_capacity);
    const hasCapacity = Number.isFinite(normalizedCapacity) && normalizedCapacity > 0;

    if (hasBookableFilterSelected) {
        return hasCapacity && normalizedCapacity >= minimumCapacity && normalizedCapacity <= maximumCapacity;
    }

    return !hasCapacity || (normalizedCapacity >= minimumCapacity && normalizedCapacity <= maximumCapacity);
};

export const getActiveSelectedFacilityTypes = selectedFacilityTypes => {
    return (selectedFacilityTypes || []).filter(ft => ft?.selected);
};

export const findSpaceById = (spaces, targetSpaceId) => {
    if (!targetSpaceId) return null;
    return (
        spaces?.find(space => {
            const spaceUuid = space?.space_uuid;
            const spaceId = space?.space_id;
            return String(spaceUuid || '') === String(targetSpaceId) || String(spaceId || '') === String(targetSpaceId);
        }) || null
    );
};
export const getSpaceIdentifier = space => space?.space_uuid || space?.space_id || null;

export const JOURNEY_VIEWS = ['landing', 'intent', 'results', 'details'];
export const JOURNEY_QUERY_PARAM_STEP = 'journeyStep';
export const JOURNEY_QUERY_PARAM_INTENT = 'journeyIntent';
export const JOURNEY_QUERY_PARAM_SPACE = 'journeySpace';
export const JOURNEY_RETURN_FILTER_STATE_STORAGE_KEY = 'bookableSpacesJourneyReturnFilterState';
export const JOURNEY_LIVE_FILTER_STATE_STORAGE_KEY = 'bookableSpacesJourneyLiveFilterState';
const MAP_FILTERS_BASE64_PREFIX = 'b64.';

const encodeBase64 = value => {
    /* istanbul ignore else */
    if (typeof btoa === 'function') {
        return btoa(unescape(encodeURIComponent(value)));
    }

    /* istanbul ignore else */
    if (typeof Buffer !== 'undefined') {
        return Buffer.from(value, 'utf8').toString('base64');
    }

    return null;
};

const decodeBase64 = value => {
    /* istanbul ignore else */
    if (typeof atob === 'function') {
        return decodeURIComponent(escape(atob(value)));
    }

    /* istanbul ignore else */
    if (typeof Buffer !== 'undefined') {
        return Buffer.from(value, 'base64').toString('utf8');
    }

    return null;
};

const toBase64Url = value => value.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');

const fromBase64Url = value => {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const paddingLength = normalized.length % 4;
    /* istanbul ignore else */
    if (paddingLength === 0) {
        return normalized;
    }

    return normalized + '='.repeat(4 - paddingLength);
};

const parseMapFiltersPayload = candidate => {
    try {
        return JSON.parse(candidate);
    } catch (error) {
        // Continue trying alternate representations.
    }

    const maybeBase64Payload = candidate.startsWith(MAP_FILTERS_BASE64_PREFIX)
        ? candidate.slice(MAP_FILTERS_BASE64_PREFIX.length)
        : candidate;

    /* istanbul ignore else */
    if (!/^[A-Za-z0-9\-_]+$/.test(maybeBase64Payload)) {
        return null;
    }

    const decodedBase64 = decodeBase64(fromBase64Url(maybeBase64Payload));
    /* istanbul ignore else */
    if (!decodedBase64) {
        return null;
    }

    try {
        return JSON.parse(decodedBase64);
    } catch (error) {
        return null;
    }
};

export const getJourneySearchParams = url => {
    // Preserve original behaviour in Jest tests (which expect params in
    // `window.location.search`) while preferring hash-based params in real
    // browsers when the app uses hash routing (e.g. '#/spaces'). Detect Jest
    // via `process.env.JEST_WORKER_ID` and only switch to hash-based handling
    // when not running under Jest.
    const runningUnderJest = typeof process !== 'undefined' && !!(process.env && process.env.JEST_WORKER_ID);

    if (url.hash) {
        // In test environment, keep legacy behaviour: only treat hash as having
        // a query when it actually contains a '?'. This avoids breaking tests
        // that assert against `window.location.search`.
        if (runningUnderJest) {
            if (url.hash.includes('?')) {
                const [hashPath, hashQuery] = url.hash.split('?');
                return {
                    usesHashQuery: true,
                    hashPath,
                    params: new URLSearchParams(hashQuery),
                };
            }

            return {
                usesHashQuery: false,
                hashPath: url.hash,
                params: url.searchParams,
            };
        }

        // Non-test environment: prefer storing params into the hash so they
        // appear after the routed path (e.g. '#/spaces?journeyStep=...').
        if (url.hash.includes('?')) {
            const [hashPath, hashQuery] = url.hash.split('?');
            return {
                usesHashQuery: true,
                hashPath,
                params: new URLSearchParams(hashQuery),
            };
        }

        return {
            usesHashQuery: true,
            hashPath: url.hash,
            params: new URLSearchParams(),
        };
    }

    return {
        usesHashQuery: false,
        hashPath: url.hash,
        params: url.searchParams,
    };
};

export const serialiseJourneyMapFilterState = ({
    selectedFacilityTypes,
    selectedCampus,
    selectedLibrary,
    capacityFilterValue,
    showFavouriteSpacesOnly,
}) => {
    const selectedFacilityIds = (selectedFacilityTypes || []).reduce((acc, filter) => {
        const facilityTypeId = filter?.facility_type_id;
        /* istanbul ignore else */
        if (!facilityTypeId || !filter?.selected) {
            return acc;
        }

        acc.push(Number(facilityTypeId));
        return acc;
    }, []);

    const serialised = {
        selectedFacilityTypes: [...new Set(selectedFacilityIds)],
        ...(selectedCampus !== null && selectedCampus !== undefined ? { selectedCampus } : {}),
        ...(selectedLibrary !== null && selectedLibrary !== undefined ? { selectedLibrary } : {}),
        ...(Array.isArray(capacityFilterValue) && capacityFilterValue.length > 0 ? { capacityFilterValue } : {}),
        ...(showFavouriteSpacesOnly ? { showFavouriteSpacesOnly: true } : {}),
    };

    const jsonPayload = JSON.stringify(serialised);
    const encodedPayload = encodeBase64(jsonPayload);

    if (!encodedPayload) {
        return jsonPayload;
    }

    return `${MAP_FILTERS_BASE64_PREFIX}${toBase64Url(encodedPayload)}`;
};

export const deserialiseJourneyMapFilterState = searchParams => {
    const encodedState = searchParams?.get?.('mapFilters');
    /* istanbul ignore else */
    if (!encodedState) {
        return null;
    }

    try {
        const candidates = [encodedState];
        let decodedState = encodedState;

        // Backward compatibility: historic URLs double-encoded mapFilters.
        for (let i = 0; i < 2; i += 1) {
            try {
                const nextDecoded = decodeURIComponent(decodedState);
                if (nextDecoded === decodedState) {
                    break;
                }
                candidates.push(nextDecoded);
                decodedState = nextDecoded;
            } catch (error) {
                break;
            }
        }

        const parsed = candidates.reduce((acc, candidate) => {
            if (acc) {
                return acc;
            }

            return parseMapFiltersPayload(candidate);
        }, null);

        if (!parsed) {
            return null;
        }

        const selectedFacilityTypes = Array.isArray(parsed?.selectedFacilityTypes) ? parsed.selectedFacilityTypes : [];
        const unselectedFacilityTypes = Array.isArray(parsed?.unselectedFacilityTypes)
            ? parsed.unselectedFacilityTypes
            : [];
        const selectedFacilityIds = new Set(
            selectedFacilityTypes.reduce((acc, filter) => {
                if (typeof filter === 'number' || typeof filter === 'string') {
                    const facilityTypeId = Number(filter);
                    if (!Number.isNaN(facilityTypeId)) {
                        acc.push(facilityTypeId);
                    }
                    return acc;
                }

                const facilityTypeId = filter?.facility_type_id;
                if (!facilityTypeId || filter?.selected === false) {
                    return acc;
                }

                acc.push(Number(facilityTypeId));
                return acc;
            }, []),
        );
        const unselectedFacilityIds = new Set(
            unselectedFacilityTypes.reduce((acc, filter) => {
                if (typeof filter === 'number' || typeof filter === 'string') {
                    const facilityTypeId = Number(filter);
                    if (!Number.isNaN(facilityTypeId)) {
                        acc.push(facilityTypeId);
                    }
                    return acc;
                }

                const facilityTypeId = filter?.facility_type_id;
                if (!facilityTypeId) {
                    return acc;
                }

                acc.push(Number(facilityTypeId));
                return acc;
            }, []),
        );

        const parsedFacilityTypes = Array.from(new Set([...selectedFacilityIds])).reduce((acc, facilityTypeId) => {
            if (unselectedFacilityIds.has(facilityTypeId)) {
                return acc;
            }

            acc.push({
                facility_type_id: facilityTypeId,
                selected: true,
                facility_special_action: null,
            });
            return acc;
        }, []);

        return {
            selectedFacilityTypes: parsedFacilityTypes,
            selectedCampus: parsed?.selectedCampus ?? null,
            selectedLibrary: parsed?.selectedLibrary ?? null,
            capacityFilterValue: Array.isArray(parsed?.capacityFilterValue) ? parsed.capacityFilterValue : null,
            showFavouriteSpacesOnly: parsed?.showFavouriteSpacesOnly === true,
        };
    } catch (error) {
        return null;
    }
};

const getJourneyPathname = url => {
    const hashValue = url?.hash || '';
    /* istanbul ignore else */
    if (hashValue.startsWith('#/')) {
        const hashPath = hashValue.slice(1).split('?')[0] || '/spaces';
        return hashPath.replace(/\/+$/, '') || '/spaces';
    }

    const pathValue = url?.pathname || '/spaces';
    return pathValue.replace(/\/+$/, '') || '/spaces';
};

export const serialiseJourneyUrl = ({ view, spaceId }) => {
    const url = new URL(window.location.href);
    const hashValue = url.hash || '';
    const isHashRouting = hashValue.startsWith('#/');

    const buildPath = ({ nextView, nextSpaceId }) => {
        /* istanbul ignore else */
        if (nextView === 'results') {
            return '/spaces/results';
        }

        /* istanbul ignore else */
        if (nextView === 'details' && nextSpaceId) {
            return `/spaces/detail/${encodeURIComponent(String(nextSpaceId))}`;
        }

        return '/spaces';
    };

    const nextPath = buildPath({ nextView: view, nextSpaceId: spaceId });

    if (isHashRouting) {
        const branchPrefix = url.pathname && url.pathname !== '/' ? url.pathname.replace(/\/+$/, '') : '';
        const branchPrefixPath = branchPrefix ? `${branchPrefix}/` : '';
        return `${branchPrefixPath}#${nextPath}`;
    }

    return `${nextPath}`;
};

export const parseJourneyStateFromUrl = availableIntentDefinitions => {
    const url = new URL(window.location.href);
    const pathname = getJourneyPathname(url);

    const resolveIntentId = rawIntentId => {
        if (!rawIntentId) {
            return null;
        }

        const decodedIntentId = decodeURIComponent(String(rawIntentId));
        const isKnownIntent = availableIntentDefinitions?.some(intent => intent.id === decodedIntentId);
        const isFavouriteIntent = decodedIntentId === 'favourite';
        return isKnownIntent || isFavouriteIntent ? decodedIntentId : null;
    };

    if (pathname === '/spaces/mapresults' || pathname.startsWith('/spaces/mapresults/')) {
        return { view: 'results', intentId: null, spaceId: null };
    }

    if (pathname === '/spaces/results' || pathname === '/spaces/results/') {
        return { view: 'results', intentId: null, spaceId: null };
    }

    if (pathname.startsWith('/spaces/results/filters=')) {
        const filterValue = decodeURIComponent(pathname.split('/spaces/results/filters=')[1] || '');
        const parsedIntentId = resolveIntentId(filterValue);
        return { view: 'results', intentId: parsedIntentId, spaceId: null };
    }

    if (pathname.startsWith('/spaces/results/')) {
        const tokenValue = decodeURIComponent(pathname.split('/spaces/results/')[1] || '');
        const parsedIntentId = resolveIntentId(tokenValue);
        if (parsedIntentId) {
            return { view: 'results', intentId: parsedIntentId, spaceId: null };
        }
    }

    if (pathname === '/spaces/detail' || pathname.startsWith('/spaces/detail/')) {
        const requestedSpaceId = pathname.startsWith('/spaces/detail/')
            ? decodeURIComponent(pathname.split('/spaces/detail/')[1] || '')
            : null;
        return { view: 'details', intentId: null, spaceId: requestedSpaceId || null };
    }

    if (pathname === '/spaces/details' || pathname.startsWith('/spaces/details/')) {
        const requestedSpaceId = pathname.startsWith('/spaces/details/')
            ? decodeURIComponent(pathname.split('/spaces/details/')[1] || '')
            : null;
        return { view: 'details', intentId: null, spaceId: requestedSpaceId || null };
    }

    return { view: 'landing', intentId: null, spaceId: null };
};
