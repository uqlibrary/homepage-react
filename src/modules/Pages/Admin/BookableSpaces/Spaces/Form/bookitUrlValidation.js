export const getBookitUrlQueryParamError = spaceExternalBookUrl => {
    if (!spaceExternalBookUrl) {
        return null;
    }

    try {
        const parsedUrl = new URL(spaceExternalBookUrl);
        const isUqBookitDomain = parsedUrl?.hostname?.toLowerCase() === 'uqbookit.uq.edu.au';

        if (!isUqBookitDomain) {
            return null;
        }

        const standardParamNames = Array.from(parsedUrl.searchParams.keys());
        const hashValue = parsedUrl?.hash || '';
        const hashWithoutPrefix = hashValue.startsWith('#') ? hashValue.slice(1) : hashValue;
        const hashQueryString = hashWithoutPrefix.includes('?')
            ? hashWithoutPrefix.split('?').slice(1).join('?')
            : '';
        const hashParamNames = Array.from(new URLSearchParams(hashQueryString).keys());
        const allParamNames = [...standardParamNames, ...hashParamNames];

        if (allParamNames.length === 0) {
            return null;
        }

        const invalidParameterNames = allParamNames.filter(paramName => paramName !== 'group');
        if (invalidParameterNames.length > 0) {
            return 'For uqbookit.uq.edu.au links, only the lower-case "group" query parameter is allowed.';
        }

        return null;
    } catch {
        return null;
    }
};
