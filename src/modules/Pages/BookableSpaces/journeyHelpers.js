export const JOURNEY_VIEWS = ['landing', 'intent', 'results', 'details'];
export const JOURNEY_QUERY_PARAM_STEP = 'journeyStep';
export const JOURNEY_QUERY_PARAM_INTENT = 'journeyIntent';
export const JOURNEY_QUERY_PARAM_SPACE = 'journeySpace';

export const getJourneySearchParams = url => {
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

    return url.toString();
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
