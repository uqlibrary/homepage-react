import { default as locale } from 'modules/Pages/Admin/Spotlights/spotlightsadmin.locale';
import { scrollToTopOfPage } from 'helpers/general';

const moment = require('moment-timezone');

export const FILTER_STORAGE_NAME = 'spotlights-admin-filter-term'; // match to SpotlightsListAsTable

export const addConstantsToDisplayValues = (displayText, imageWidthIn, imageHeightIn, ratio) => {
    return displayText
        .replace('[WIDTH]', imageWidthIn)
        .replace('[HEIGHT]', imageHeightIn)
        .replace('[RATIO]', ratio)
        .replace('[MAXFILESIZE]', locale.form.upload.maxSize / 1000);
};

export function isPastSpotlight(spotlight) {
    return moment(spotlight.end).isBefore(moment());
}

export function isScheduledSpotlight(spotlight) {
    return moment(spotlight.start).isAfter(moment());
}

export function isCurrentSpotlight(spotlight) {
    return !isPastSpotlight(spotlight) && !isScheduledSpotlight(spotlight);
}

// https://stackoverflow.com/a/5306832/1246313
/* istanbul ignore next */
export function moveItemInArray(arr, oldIndex, newIndex) {
    if (newIndex >= arr.length) {
        let k = newIndex - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
    return arr; // for testing
}

export const getWeightAfterDrag = (destination, tableType, originalWeight) => {
    const isDestinationLeftOfOriginal = destination * 10 < originalWeight;
    const addToWeight = tableType !== 'edit' || isDestinationLeftOfOriginal ? 5 : 15;
    return destination * 10 + addToWeight;
};

export const navigateToEditForm = (spotlightid, history) => {
    history.push(`/admin/spotlights/edit/${spotlightid}`);
    scrollToTopOfPage();
};

export const navigateToCloneForm = (spotlightid, history) => {
    history.push(`/admin/spotlights/clone/${spotlightid}`);
    scrollToTopOfPage();
};

export const navigateToView = (spotlightid, history) => {
    history.push(`/admin/spotlights/view/${spotlightid}`);
    scrollToTopOfPage();
};

export function filterSpotlights(r, filterTerm) {
    const lowercaseLinkAria = r?.title?.toLowerCase() || /* istanbul ignore next */ '';
    // eslint-disable-next-line camelcase
    const lowercaseImgAlt = r?.img_alt?.toLowerCase() || /* istanbul ignore next */ '';
    // eslint-disable-next-line camelcase
    const lowercaseAdminNotes = r?.admin_notes?.toLowerCase() || /* istanbul ignore next */ '';
    return (
        lowercaseLinkAria.includes(filterTerm.toLowerCase()) ||
        lowercaseImgAlt.includes(filterTerm.toLowerCase()) ||
        lowercaseAdminNotes.includes(filterTerm.toLowerCase())
    );
}
