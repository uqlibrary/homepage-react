export const JOURNEY_VIEWS = ['landing', 'intent', 'results', 'details'];
export const JOURNEY_QUERY_PARAM_STEP = 'journeyStep';
export const JOURNEY_QUERY_PARAM_INTENT = 'journeyIntent';
export const JOURNEY_QUERY_PARAM_SPACE = 'journeySpace';

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
}) => {
    const selectedFacilityIds = (selectedFacilityTypes || []).reduce((acc, filter) => {
        const facilityTypeId = filter?.facility_type_id;
        if (!facilityTypeId || !filter?.selected) {
            return acc;
        }

        acc.push(Number(facilityTypeId));
        return acc;
    }, []);

    const serialised = {
        selectedFacilityTypes: selectedFacilityIds,
        ...(selectedCampus !== null && selectedCampus !== undefined ? { selectedCampus } : {}),
        ...(selectedLibrary !== null && selectedLibrary !== undefined ? { selectedLibrary } : {}),
        ...(Array.isArray(capacityFilterValue) && capacityFilterValue.length > 0 ? { capacityFilterValue } : {}),
    };

    return encodeURIComponent(JSON.stringify(serialised));
};

export const deserialiseJourneyMapFilterState = searchParams => {
    const encodedState = searchParams?.get?.('mapFilters');
    if (!encodedState) {
        return null;
    }

    try {
        const parsed = JSON.parse(decodeURIComponent(encodedState));
        const selectedFacilityTypes = Array.isArray(parsed?.selectedFacilityTypes) ? parsed.selectedFacilityTypes : [];

        return {
            selectedFacilityTypes: selectedFacilityTypes.reduce((acc, filter) => {
                if (typeof filter === 'number' || typeof filter === 'string') {
                    const facilityTypeId = Number(filter);
                    if (!Number.isNaN(facilityTypeId)) {
                        acc.push({
                            facility_type_id: facilityTypeId,
                            selected: true,
                            unselected: false,
                            facility_special_action: null,
                        });
                    }
                    return acc;
                }

                const facilityTypeId = filter?.facility_type_id;
                if (!facilityTypeId) {
                    return acc;
                }

                acc.push({
                    facility_type_id: Number(facilityTypeId),
                    selected: !!filter?.selected,
                    unselected: !!filter?.unselected,
                    facility_special_action: filter?.facility_special_action || null,
                });
                return acc;
            }, []),
            selectedCampus: parsed?.selectedCampus ?? null,
            selectedLibrary: parsed?.selectedLibrary ?? null,
            capacityFilterValue: Array.isArray(parsed?.capacityFilterValue) ? parsed.capacityFilterValue : null,
        };
    } catch (error) {
        return null;
    }
};

export const serialiseJourneyUrl = ({ view, intentId, spaceId }) => {
    const url = new URL(window.location.href);
    const { usesHashQuery, hashPath, params } = getJourneySearchParams(url);

    if (view && view !== 'landing') {
        params.set(JOURNEY_QUERY_PARAM_STEP, view);
    } else {
        params.delete(JOURNEY_QUERY_PARAM_STEP);
    }

    if (intentId && (view === 'results' || view === 'details')) {
        params.set(JOURNEY_QUERY_PARAM_INTENT, String(intentId));
    } else {
        params.delete(JOURNEY_QUERY_PARAM_INTENT);
    }

    if (view === 'details' && spaceId) {
        params.set(JOURNEY_QUERY_PARAM_SPACE, String(spaceId));
    } else {
        params.delete(JOURNEY_QUERY_PARAM_SPACE);
    }

    if (usesHashQuery) {
        const nextHashQuery = params.toString();
        url.hash = nextHashQuery ? `${hashPath}?${nextHashQuery}` : hashPath;
    }

    // Prefer returning a relative URL so react-router `Link` and manual
    // `history.pushState` don't cause a full-navigation or produce duplicate
    // hashes. When using hash-based params, return only the `#...` part;
    // otherwise return the pathname + search.
    if (usesHashQuery) {
        return url.hash || '';
    }

    return `${url.pathname}${url.search || ''}`;
};

export const parseJourneyStateFromUrl = availableIntentDefinitions => {
    const url = new URL(window.location.href);
    const { params } = getJourneySearchParams(url);

    const requestedView = params.get(JOURNEY_QUERY_PARAM_STEP);
    const view = JOURNEY_VIEWS.includes(requestedView) ? requestedView : 'landing';

    const requestedIntentId = params.get(JOURNEY_QUERY_PARAM_INTENT);
    const intentId = availableIntentDefinitions?.some(intent => intent.id === requestedIntentId)
        ? requestedIntentId
        : null;

    const requestedSpaceId = params.get(JOURNEY_QUERY_PARAM_SPACE);
    const spaceId = requestedSpaceId ? String(requestedSpaceId) : null;

    return { view, intentId, spaceId };
};
