import { ASKUS_SPRINGSHARE_ID, FRYER_SPRINGSHARE_ID, GATTON_SPRINGSHARE_ID } from 'config/locale';
import { addClass, removeClass } from 'helpers/general';

const nameLookupTable = {
    [ASKUS_SPRINGSHARE_ID]: 'AskUs chat assistance',
    [FRYER_SPRINGSHARE_ID]: 'Fryer Library',
    [GATTON_SPRINGSHARE_ID]: 'the JK Murray Library',
};
export const VEMCOUNT_LOCATION_DATA_EXPECTED_BUT_MISSING = 'Missing';

export const vemcountPercentByLocation = (vemcountZoneId, locationList) => {
    const vemcountWrapper = locationList.filter(location => location.id === vemcountZoneId);
    const vemcountData = vemcountWrapper.length > 0 ? vemcountWrapper[0] : null;
    if (vemcountZoneId !== null && vemcountWrapper.length === 0) {
        return VEMCOUNT_LOCATION_DATA_EXPECTED_BUT_MISSING;
    }
    return (vemcountData?.headCount / vemcountData?.capacity) * 100;
};

export const getVemcountPercentage = (vemcountZoneId, locationList) => {
    if (vemcountZoneId === null) {
        return null;
    }
    const minimumDisplayedPercentage = 5;
    const maxmumDisplayedPercentage = 100;

    const vemcountBusynessPercent = vemcountPercentByLocation(vemcountZoneId, locationList);
    let calculatedBusyness;
    if (vemcountBusynessPercent === VEMCOUNT_LOCATION_DATA_EXPECTED_BUT_MISSING) {
        calculatedBusyness = vemcountBusynessPercent;
    } else if (!!isNaN(vemcountBusynessPercent)) {
        calculatedBusyness = VEMCOUNT_LOCATION_DATA_EXPECTED_BUT_MISSING;
    } else if (vemcountBusynessPercent < minimumDisplayedPercentage) {
        calculatedBusyness = minimumDisplayedPercentage;
    } else if (vemcountBusynessPercent > maxmumDisplayedPercentage) {
        calculatedBusyness = maxmumDisplayedPercentage;
    } else {
        calculatedBusyness = Math.floor(vemcountBusynessPercent);
    }

    return calculatedBusyness;
};

export const getTextForBusyness = (location, busyLookup) => {
    if (
        location.lid === ASKUS_SPRINGSHARE_ID ||
        !location?.busyness ||
        location.busyness === VEMCOUNT_LOCATION_DATA_EXPECTED_BUT_MISSING ||
        !location?.isCurrentlyOpen
    ) {
        return null;
    }
    let busyinessIndex = 4; // Very busy
    if (location.busyness <= 25) {
        busyinessIndex = 1; // 'Not busy';
    } else if (location.busyness <= 50) {
        busyinessIndex = 2; // 'Moderate';
    } else if (location.busyness <= 75) {
        busyinessIndex = 3; // 'Busy';
    }
    return busyLookup.hasOwnProperty(busyinessIndex) ? busyLookup[busyinessIndex] : /* istanbul ignore next */ null;
};

export const ariaLabelForLocation = location => {
    let libraryName = `the ${location?.displayName} Library`;

    if (nameLookupTable.hasOwnProperty(location?.lid)) {
        libraryName = nameLookupTable[location.lid];
    }

    let openingHours = location?.openingHours;
    if (openingHours === 'See location') {
        return `Click through to the location page for ${libraryName} hours and busy level.`;
    }

    openingHours = openingHours?.trim().replace(' - ', ' to ');
    openingHours = openingHours?.toLowerCase();

    let locationType = 'study space';
    if (location?.lid === ASKUS_SPRINGSHARE_ID) {
        locationType = 'operating hours today';
    }

    const libraryNameTemp = String(libraryName);
    const firstChar = libraryNameTemp?.charAt(0);
    const otherChar = libraryNameTemp?.slice(1);
    const capitaliseLibraryName =
        libraryNameTemp.length > 0 ? firstChar.toUpperCase() + otherChar : /* istanbul ignore next */ '';
    let response = `${capitaliseLibraryName} ${locationType} is open ${openingHours}.`;

    const busynessLabels = {
        1: 'not busy',
        2: 'moderately busy',
        3: 'quite busy',
        4: 'very busy',
    };
    const business = getTextForBusyness(location, busynessLabels);
    if (!!business) {
        response += ` This space is currently ${business}.`;
    }

    return response;
};

export const setLocationPanelAsClosed = () => {
    const locationsPanel = document.getElementById('locations-wrapper');
    !!locationsPanel && locationsPanel.setAttribute('inert', 'true');
    !!locationsPanel && removeClass(locationsPanel, 'locations-wrapper-open');
    const openerButton = document.getElementById('location-dialog-controller');
    !!openerButton && removeClass(openerButton, 'panel-open');
    !!openerButton && addClass(openerButton, 'panel-closed');
};

export const setLocationPanelAsOpen = () => {
    const locationsPanel = document.getElementById('locations-wrapper');
    !!locationsPanel && locationsPanel.removeAttribute('inert');
    !!locationsPanel && addClass(locationsPanel, 'locations-wrapper-open');
    // change icon
    const openerButton = document.getElementById('location-dialog-controller');
    !!openerButton && addClass(openerButton, 'panel-open');
    !!openerButton && removeClass(openerButton, 'panel-closed');
};
