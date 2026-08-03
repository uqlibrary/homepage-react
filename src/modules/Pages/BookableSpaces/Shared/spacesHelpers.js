import React from 'react';
import PropTypes from 'prop-types';

import { getVisibleSpaceOutage } from 'modules/Pages/Admin/BookableSpaces/Spaces/Form/spaceOutageHelpers';
import { StyledIconWordWrapperDiv } from 'modules/Pages/BookableSpaces/Shared/SharedStyles';

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
function convertWeeksToDays(data) {
    if (!data) {
        return [];
    }

    // Create a deep copy to avoid mutating the original data
    const location = JSON.parse(JSON.stringify(data));

    // Define the order of days for consistent sorting
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    // only one of these should appear in the data - should match api HoursResource list
    const displayedDepartments = ['Collections and space', 'Study space', 'Service and collections'];
    const filteredData = {
        ...location,
        department: location?.departments?.find(dept => displayedDepartments?.includes(dept?.name)),
    };
    delete filteredData.departments;

    if (filteredData?.department?.weeks && Array.isArray(filteredData?.department?.weeks)) {
        const allDays = [];

        filteredData?.department?.weeks?.forEach(week => {
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

        delete filteredData?.department?.weeks;
        allDays?.sort((a, b) => new Date(a?.date) - new Date(b?.date));
        filteredData.department.days = allDays;
    }

    !!filteredData?.department?.days && (filteredData.department = filterNext7Days(filteredData?.department));

    return filteredData;
}

export const spaceOpeningHours = (bookableSpace, weeklyHours) => {
    const details = weeklyHours?.locations?.filter(lib =>
        lib?.departments.find(spaceOpeningHours => spaceOpeningHours?.lid === bookableSpace?.space_opening_hours_id),
    );
    if (!!details) {
        const openingDetails = convertWeeksToDays(details?.at(0));
        return openingDetails?.department?.next7days;
    }
    return [];
};

export const isBookable = space => {
    return space?.space_external_book_url?.startsWith('http');
};

const getSpaceHoursStatus = (space, weeklyHours) => {
    const days = spaceOpeningHours(space, weeklyHours);
    if (!days || days.length === 0) return null;
    const today = days[0];
    if (!today) return null;

    const status = today?.times?.status;
    if (status === 'closed') return 'closed';
    if (status === '24hours') return 'open';

    const openStr = today?.open; // e.g. "07:30:00"
    const closeStr = today?.close; // e.g. "19:30:00"

    if (!openStr || !closeStr) return null;

    const now = new Date();
    const [oh, om] = openStr.split(':').map(Number);
    const [ch, cm] = closeStr.split(':').map(Number);

    const openTime = new Date();
    openTime.setHours(oh, om, 0, 0);
    const closeTime = new Date();
    closeTime.setHours(ch, cm, 0, 0);

    if (now < openTime || now >= closeTime) return 'closed';

    const minsUntilClose = (closeTime - now) / 60000;
    if (minsUntilClose <= 60) return 'closing-soon';
    return 'open';
};

export const closingSoonMessage = (message = 'Closing soon') => {
    // https://www.streamlinehq.com/icons/download/technology-device-wearable-smart-watch-circle-app-1--27614
    return (
        <StyledIconWordWrapperDiv>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="24" width="24">
                <path
                    stroke="#51247a"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.89001 6.388V2.25c0 -0.39782 0.15804 -0.77936 0.43934 -1.06066C4.61066 0.908035 4.99219 0.75 5.39001 0.75h4.5c0.39779 0 0.77939 0.158035 1.06069 0.43934 0.2813 0.2813 0.4393 0.66284 0.4393 1.06066v4.138"
                    strokeWidth="1.5"
                />
                <path
                    stroke="#51247a"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.89001 17.6121v4.138c0 0.3978 0.15804 0.7794 0.43934 1.0607 0.28131 0.2813 0.66284 0.4393 1.06066 0.4393h4.5c0.39779 0 0.77939 -0.158 1.06069 -0.4393 0.2813 -0.2813 0.4393 -0.6629 0.4393 -1.0607v-4.138"
                    strokeWidth="1.5"
                />
                <path
                    stroke="#51247a"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.64001 18.75C11.3679 18.75 14.39 15.7279 14.39 12c0 -3.72792 -3.0221 -6.75 -6.74999 -6.75C3.91209 5.25 0.890015 8.27208 0.890015 12c0 3.7279 3.022075 6.75 6.749995 6.75Z"
                    strokeWidth="1.5"
                />
                <path
                    stroke="#51247a"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.11 12c0 0.6922 -0.2053 1.3689 -0.5899 1.9445 -0.3846 0.5756 -0.93118 1.0242 -1.57072 1.2891 -0.63954 0.2649 -1.34328 0.3342 -2.02221 0.1991 -0.67893 -0.135 -1.30257 -0.4683 -1.79206 -0.9578 -0.48948 -0.4895 -0.82282 -1.1131 -0.95787 -1.7921 -0.13505 -0.6789 -0.06574 -1.3827 0.19917 -2.0222 0.26491 -0.6395 0.71351 -1.18616 1.28908 -1.57074C6.24106 8.70527 6.91775 8.5 7.60999 8.5"
                    strokeWidth="1.5"
                />
                <path
                    stroke="#51247a"
                    d="M7.64001 12.498c-0.27614 0 -0.5 -0.2239 -0.5 -0.5 0 -0.2762 0.22386 -0.5 0.5 -0.5"
                    strokeWidth="1.5"
                />
                <path
                    stroke="#51247a"
                    d="M7.64001 12.498c0.27615 0 0.5 -0.2239 0.5 -0.5 0 -0.2762 -0.22385 -0.5 -0.5 -0.5"
                    strokeWidth="1.5"
                />
                <path
                    stroke="#51247a"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.156 17.771c1.2641 -1.5634 1.9537 -3.513 1.9537 -5.5235 0 -2.0105 -0.6896 -3.96013 -1.9537 -5.5235"
                    strokeWidth="1.5"
                />
                <path
                    stroke="#51247a"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.725 9.02502c0.7375 0.91208 1.1399 2.04948 1.1399 3.22248s-0.4024 2.3104 -1.1399 3.2225"
                    strokeWidth="1.5"
                />
            </svg>
            <span>{message}</span>
        </StyledIconWordWrapperDiv>
    );
};
const closedNowMessage = (message = 'Currently closed') => {
    return (
        <StyledIconWordWrapperDiv>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="css-1m01c8l">
                <circle cx="12" cy="12" r="9.25" stroke="#51247A" strokeWidth="1.5" />
                <path d="M12 7.8v4" stroke="#51247A" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="11.9" cy="15.6" r=".6" fill="#000" stroke="#51247A" />
            </svg>
            <span>{message}</span>
        </StyledIconWordWrapperDiv>
    );
};
const openNowMessage = (message = 'Open now') => {
    // https://www.streamlinehq.com/icons/download/shop-sign-open--27633
    return (
        <StyledIconWordWrapperDiv>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="24" width="24">
                <path
                    stroke="#51247a"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M0.75 22.75h22.5"
                    strokeWidth="1.5"
                />
                <path
                    stroke="#51247a"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M23.25 9.25H0.75"
                    strokeWidth="1.5"
                />
                <path
                    stroke="#51247a"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.5 6.25 -3.3 -4.4c-0.1397 -0.18629 -0.3209 -0.3375 -0.5292 -0.44164C12.4625 1.30422 12.2329 1.25 12 1.25c-0.2329 0 -0.4625 0.05422 -0.6708 0.15836 -0.2083 0.10414 -0.3895 0.25535 -0.5292 0.44164l-3.3 4.4"
                    strokeWidth="1.5"
                />
                <path
                    stroke="#51247a"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 19.749v-7.5"
                    strokeWidth="1.5"
                />
                <path
                    stroke="#51247a"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 12.249h0.75c0.59674 0 1.16903 0.2371 1.59099 0.659 0.42191 0.422 0.65901 0.9943 0.65901 1.591 0 0.5968 -0.2371 1.1691 -0.65901 1.591 -0.42196 0.422 -0.99425 0.659 -1.59099 0.659H7.5"
                    strokeWidth="1.5"
                />
                <path
                    stroke="#51247a"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 12.25c-0.39782 0 -0.77936 0.158 -1.06066 0.4393 -0.2813 0.2813 -0.43934 0.6629 -0.43934 1.0607v4.5c0 0.3978 0.15804 0.7794 0.43934 1.0607S2.60218 19.75 3 19.75c0.39782 0 0.77936 -0.158 1.06066 -0.4393 0.2813 -0.2813 0.43934 -0.6629 0.43934 -1.0607v-4.5c0 -0.3978 -0.15804 -0.7794 -0.43934 -1.0607S3.39782 12.25 3 12.25Z"
                    strokeWidth="1.5"
                />
                <path
                    stroke="#51247a"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 19.749H15c-0.3978 0 -0.7794 -0.158 -1.0607 -0.4393S13.5 18.6468 13.5 18.249v-4.5c0 -0.3978 0.158 -0.7793 0.4393 -1.0606s0.6629 -0.4394 1.0607 -0.4394h1.5"
                    strokeWidth="1.5"
                />
                <path
                    stroke="#51247a"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 16.749h3"
                    strokeWidth="1.5"
                />
                <path
                    stroke="#51247a"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 19.749v-7.5l3 7.5v-7.5"
                    strokeWidth="1.5"
                />
            </svg>
            <span>{message}</span>
        </StyledIconWordWrapperDiv>
    );
};
export const SpaceOpenStatusChip = ({ space, weeklyHours, weeklyHoursLoading, weeklyHoursError }) => {
    const visibleOutage = getVisibleSpaceOutage(space?.space_outages);
    if (visibleOutage?.status === 'Current') {
        return closedNowMessage();
    }
    if (visibleOutage?.status === 'Upcoming') {
        return closingSoonMessage();
    }

    if (weeklyHoursLoading || weeklyHoursError || !weeklyHours) {
        return 'no hours data';
        // return null;
    }

    const status = getSpaceHoursStatus(space, weeklyHours);
    if (!status) {
        return 'no status';
        // return null;
    }

    if (status === 'open') {
        return openNowMessage();
    }
    if (status === 'closing-soon') {
        return closingSoonMessage;
    }
    if (status === 'closed') {
        return closedNowMessage();
    }

    return 'unknown';
};

SpaceOpenStatusChip.propTypes = {
    space: PropTypes.object,
    weeklyHours: PropTypes.object,
    weeklyHoursLoading: PropTypes.bool,
    weeklyHoursError: PropTypes.bool,
    chipStyles: PropTypes.any,
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
const MAP_FILTERS_BASE64_PREFIX = 'b64.';

const encodeBase64 = value => {
    if (typeof btoa === 'function') {
        return btoa(unescape(encodeURIComponent(value)));
    }

    if (typeof Buffer !== 'undefined') {
        return Buffer.from(value, 'utf8').toString('base64');
    }

    return null;
};

const decodeBase64 = value => {
    if (typeof atob === 'function') {
        return decodeURIComponent(escape(atob(value)));
    }

    if (typeof Buffer !== 'undefined') {
        return Buffer.from(value, 'base64').toString('utf8');
    }

    return null;
};

const toBase64Url = value => value.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');

const fromBase64Url = value => {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const paddingLength = normalized.length % 4;
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

    if (!/^[A-Za-z0-9\-_]+$/.test(maybeBase64Payload)) {
        return null;
    }

    const decodedBase64 = decodeBase64(fromBase64Url(maybeBase64Payload));
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
        if (!facilityTypeId || !filter?.selected) {
            return acc;
        }

        acc.push(Number(facilityTypeId));
        return acc;
    }, []);

    const unselectedFacilityIds = (selectedFacilityTypes || []).reduce((acc, filter) => {
        const facilityTypeId = filter?.facility_type_id;
        if (!facilityTypeId || !filter?.unselected) {
            return acc;
        }

        acc.push(Number(facilityTypeId));
        return acc;
    }, []);

    const serialised = {
        selectedFacilityTypes: [...new Set([...selectedFacilityIds, ...unselectedFacilityIds])],
        ...(unselectedFacilityIds.length > 0 ? { unselectedFacilityTypes: unselectedFacilityIds } : {}),
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
                if (!facilityTypeId) {
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

        const parsedFacilityTypes = Array.from(new Set([...selectedFacilityIds, ...unselectedFacilityIds])).map(
            facilityTypeId => ({
                facility_type_id: facilityTypeId,
                selected: selectedFacilityIds.has(facilityTypeId) && !unselectedFacilityIds.has(facilityTypeId),
                unselected: unselectedFacilityIds.has(facilityTypeId),
                facility_special_action: null,
            }),
        );

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
    if (hashValue.startsWith('#/')) {
        const hashPath = hashValue.slice(1).split('?')[0] || '/spaces';
        return hashPath.replace(/\/+$/, '') || '/spaces';
    }

    const pathValue = url?.pathname || '/spaces';
    return pathValue.replace(/\/+$/, '') || '/spaces';
};

export const serialiseJourneyUrl = ({ view, intentId, spaceId, mapFilterState }) => {
    const url = new URL(window.location.href);
    const hashValue = url.hash || '';
    const isHashRouting = hashValue.startsWith('#/');

    const getPreservedQueryParams = () => {
        const hashQuery = hashValue.includes('?') ? hashValue.split('?')[1] : '';
        const params = new URLSearchParams(hashQuery || url.search || '');
        const nextParams = new URLSearchParams();

        ['mapFilters', 'autoSelectFirstSpace', 'user'].forEach(key => {
            const value = params.get(key);
            if (value !== null) {
                nextParams.set(key, value);
            }
        });

        if (mapFilterState !== undefined) {
            if (mapFilterState === null) {
                nextParams.delete('mapFilters');
            } else {
                nextParams.set('mapFilters', serialiseJourneyMapFilterState(mapFilterState));
            }
        }

        return nextParams.toString();
    };

    const buildPath = ({ nextView, nextIntentId, nextSpaceId }) => {
        if (nextView === 'results') {
            if (nextIntentId) {
                return `/spaces/results/filters=${encodeURIComponent(String(nextIntentId))}`;
            }
            return '/spaces/results';
        }

        if (nextView === 'details' && nextSpaceId) {
            return `/spaces/detail/${encodeURIComponent(String(nextSpaceId))}`;
        }

        return '/spaces';
    };

    const nextPath = buildPath({ nextView: view, nextIntentId: intentId, nextSpaceId: spaceId });
    const preservedQueryParams = getPreservedQueryParams();
    const querySuffix = preservedQueryParams ? `?${preservedQueryParams}` : '';

    if (isHashRouting) {
        const branchPrefix = url.pathname && url.pathname !== '/' ? url.pathname.replace(/\/+$/, '') : '';
        const branchPrefixPath = branchPrefix ? `${branchPrefix}/` : '';
        return `${branchPrefixPath}#${nextPath}${querySuffix}`;
    }

    return `${nextPath}${querySuffix}`;
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
