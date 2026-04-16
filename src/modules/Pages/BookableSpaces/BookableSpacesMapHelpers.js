export const OFF_ROUTE_REROUTE_DISTANCE_METERS = 20;
export const MIN_BEARING_UPDATE_DEGREES = 1;
export const LARGE_BEARING_DELTA_DEGREES = 24;
export const FOLLOW_USER_RECENTER_DISTANCE_METERS = 4;

const MAX_WEBKIT_COMPASS_ACCURACY_DEGREES = 35;
const ORIENTATION_SMOOTHING_FACTOR = 0.45;
const FOLLOW_USER_RECENTER_DURATION_MS = 350;

export const formatDistance = distanceMeters => {
    if (!Number.isFinite(distanceMeters)) {
        return null;
    }

    if (distanceMeters >= 1000) {
        return `${(distanceMeters / 1000).toFixed(1)} km`;
    }

    return `${Math.round(distanceMeters)} m`;
};

export const supportsDeviceOrientation = () =>
    typeof window !== 'undefined' && typeof window.DeviceOrientationEvent !== 'undefined';

export const normalizeAngle = angle => {
    if (!Number.isFinite(Number(angle))) {
        return null;
    }

    const normalizedAngle = Number(angle) % 360;

    return normalizedAngle < 0 ? normalizedAngle + 360 : normalizedAngle;
};

export const getShortestAngleDelta = (fromAngle, toAngle) => {
    if (!Number.isFinite(Number(fromAngle)) || !Number.isFinite(Number(toAngle))) {
        return 0;
    }

    return ((toAngle - fromAngle + 540) % 360) - 180;
};

export const smoothAngle = (currentAngle, targetAngle, factor = ORIENTATION_SMOOTHING_FACTOR) => {
    if (!Number.isFinite(Number(targetAngle))) {
        return null;
    }

    if (!Number.isFinite(Number(currentAngle))) {
        return normalizeAngle(targetAngle);
    }

    return normalizeAngle(currentAngle + getShortestAngleDelta(currentAngle, targetAngle) * factor);
};

const getScreenOrientationAngle = () => {
    if (typeof window === 'undefined') {
        return 0;
    }

    if (Number.isFinite(Number(window?.screen?.orientation?.angle))) {
        return Number(window.screen.orientation.angle);
    }

    if (Number.isFinite(Number(window.orientation))) {
        return Number(window.orientation);
    }

    return 0;
};

export const getDeviceHeading = (event, { allowRelativeAlpha = false } = {}) => {
    if (Number.isFinite(Number(event?.webkitCompassHeading))) {
        const compassAccuracy = Number(event?.webkitCompassAccuracy);

        if (Number.isFinite(compassAccuracy) && compassAccuracy > MAX_WEBKIT_COMPASS_ACCURACY_DEGREES) {
            return null;
        }

        return normalizeAngle(Number(event.webkitCompassHeading));
    }

    if (!Number.isFinite(Number(event?.alpha))) {
        return null;
    }

    if (event?.absolute !== true && !allowRelativeAlpha) {
        return null;
    }

    return normalizeAngle(360 - Number(event.alpha) + getScreenOrientationAngle());
};

export const setMapBearing = (mapInstance, bearing) => {
    const normalizedBearing = normalizeAngle(bearing);

    if (!mapInstance || !Number.isFinite(normalizedBearing)) {
        return;
    }

    if (typeof mapInstance.setBearing === 'function') {
        mapInstance.setBearing(normalizedBearing);
        return;
    }

    if (typeof mapInstance.rotateTo === 'function') {
        mapInstance.rotateTo(normalizedBearing, { duration: 0 });
    }
};

export const centerMapOnPosition = (mapInstance, position) => {
    if (!mapInstance || !position) {
        return;
    }

    const nextCenter = [position.lng, position.lat];

    if (typeof mapInstance.easeTo === 'function') {
        mapInstance.easeTo({
            center: nextCenter,
            duration: FOLLOW_USER_RECENTER_DURATION_MS,
            essential: true,
        });
        return;
    }

    if (typeof mapInstance.panTo === 'function') {
        mapInstance.panTo(nextCenter, {
            duration: FOLLOW_USER_RECENTER_DURATION_MS,
        });
        return;
    }

    if (typeof mapInstance.setCenter === 'function') {
        mapInstance.setCenter(nextCenter);
    }
};

const formatStepDistanceLabel = distanceMeters => {
    const formattedDistance = formatDistance(distanceMeters);

    return formattedDistance ? ` ${formattedDistance}` : '';
};

export const formatDurationDetailed = durationMinutes => {
    if (!Number.isFinite(durationMinutes) || durationMinutes <= 0) {
        return null;
    }

    const totalSeconds = Math.max(1, Math.round(durationMinutes * 60));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${hours} hr ${minutes} min`;
    }

    if (minutes > 0 && seconds > 0) {
        return `${minutes} min ${seconds} s`;
    }

    if (minutes > 0) {
        return `${minutes} min`;
    }

    return `${seconds} s`;
};

export const getNormalizedStepTurnType = ({ maneuverType, maneuverModifier, instruction }) => {
    const normalizedManeuverType = `${maneuverType || ''}`.toLowerCase();
    const normalizedManeuverModifier = `${maneuverModifier || ''}`.toLowerCase();
    const normalizedInstruction = `${instruction || ''}`.toLowerCase();

    if (normalizedManeuverType === 'turn' && normalizedManeuverModifier) {
        return normalizedManeuverModifier;
    }

    if (normalizedManeuverType && normalizedManeuverModifier) {
        return `${normalizedManeuverType}_${normalizedManeuverModifier}`;
    }

    if (normalizedManeuverType) {
        return normalizedManeuverType;
    }

    if (normalizedInstruction.includes('u-turn') || normalizedInstruction.includes('uturn')) {
        return 'uturn';
    }

    if (normalizedInstruction.includes('sharp right')) {
        return 'sharp_right';
    }

    if (normalizedInstruction.includes('slight right') || normalizedInstruction.includes('bear right')) {
        return 'slight_right';
    }

    if (normalizedInstruction.includes('right')) {
        return 'right';
    }

    if (normalizedInstruction.includes('sharp left')) {
        return 'sharp_left';
    }

    if (normalizedInstruction.includes('slight left') || normalizedInstruction.includes('bear left')) {
        return 'slight_left';
    }

    if (normalizedInstruction.includes('left')) {
        return 'left';
    }

    if (
        normalizedInstruction.includes('straight') ||
        normalizedInstruction.includes('forward') ||
        normalizedInstruction.includes('continue')
    ) {
        return 'straight';
    }

    return '';
};

export const buildStepInstruction = ({ maneuverType, maneuverModifier, distanceMeters, destinationName }) => {
    const normalizedType = `${maneuverType || ''}`.toLowerCase();
    const normalizedModifier = `${maneuverModifier || ''}`.toLowerCase();
    const distanceLabel = formatStepDistanceLabel(distanceMeters);

    if (normalizedType === 'turn') {
        if (normalizedModifier === 'left') {
            return `Turn left and walk${distanceLabel}`;
        }

        if (normalizedModifier === 'right') {
            return `Turn right and walk${distanceLabel}`;
        }

        if (normalizedModifier === 'slight_left') {
            return `Turn slightly left and walk${distanceLabel}`;
        }

        if (normalizedModifier === 'slight_right') {
            return `Turn slightly right and walk${distanceLabel}`;
        }

        if (normalizedModifier === 'sharp_left') {
            return `Turn sharply left and walk${distanceLabel}`;
        }

        if (normalizedModifier === 'sharp_right') {
            return `Turn sharply right and walk${distanceLabel}`;
        }

        if (normalizedModifier === 'uturn') {
            return `Make a U-turn and walk${distanceLabel}`;
        }

        return `Continue and walk${distanceLabel}`;
    }

    if (normalizedType === 'stairs_up') {
        return 'Take the stairs up';
    }

    if (normalizedType === 'stairs_down') {
        return 'Take the stairs down';
    }

    if (normalizedType === 'stairs_exit') {
        return 'Exit the stairs';
    }

    if (normalizedType === 'towards_building') {
        return `Head to ${destinationName || 'the building'}`;
    }

    if (normalizedType === 'enter_building') {
        return `Enter ${destinationName || 'the building'}`;
    }

    if (normalizedType === 'arrive') {
        return `Arrive at ${destinationName || 'your destination'}`;
    }

    return `Continue${distanceLabel ? ` for${distanceLabel}` : ''}`;
};

export const getStepTurnRotation = maneuverType => {
    const normalizedType = `${maneuverType || ''}`.toLowerCase();

    if (!normalizedType || normalizedType.includes('straight') || normalizedType.includes('forward')) {
        return '0deg';
    }

    if (normalizedType.includes('sharp_right')) {
        return '125deg';
    }

    if (normalizedType.includes('slight_right') || normalizedType.includes('bear_right')) {
        return '35deg';
    }

    if (normalizedType.includes('right')) {
        return '90deg';
    }

    if (normalizedType.includes('uturn')) {
        return '180deg';
    }

    if (normalizedType.includes('stairs_down')) {
        return '180deg';
    }

    if (normalizedType.includes('stairs_up')) {
        return '0deg';
    }

    if (normalizedType.includes('sharp_left')) {
        return '-125deg';
    }

    if (normalizedType.includes('left')) {
        return '-90deg';
    }

    if (normalizedType.includes('slight_left') || normalizedType.includes('bear_left')) {
        return '-35deg';
    }

    return '0deg';
};

export const getDisplayedTurnType = (currentStep, nextStep) => {
    const currentTurnType = `${currentStep?.maneuverType || ''}`.toLowerCase();
    const nextTurnType = `${nextStep?.maneuverType || ''}`.toLowerCase();
    const currentIsStraight =
        !currentTurnType || currentTurnType.includes('straight') || currentTurnType.includes('forward');
    const nextIsTurn = !!nextTurnType && !nextTurnType.includes('straight') && !nextTurnType.includes('forward');

    if (currentIsStraight && nextIsTurn) {
        return nextTurnType;
    }

    return currentTurnType;
};

export const lowercaseFirstCharacter = text => {
    if (!text) {
        return '';
    }

    return `${text.charAt(0).toLowerCase()}${text.slice(1)}`;
};

export const getRemainingDistanceMeters = (steps, currentStepIndex) => {
    if (!Array.isArray(steps) || !steps.length) {
        return null;
    }

    const remainingDistance = steps.slice(currentStepIndex).reduce((total, navigationStep) => {
        const stepDistance = navigationStep?.step?.getDistanceMeters?.();
        return Number.isFinite(stepDistance) ? total + stepDistance : total;
    }, 0);

    return remainingDistance > 0 ? remainingDistance : null;
};

export const getGeolocationErrorMessage = error => {
    switch (error?.code) {
        case 1:
            return 'Location permission was denied. Live step tracking is unavailable.';
        case 2:
            return 'Your location could not be determined. Live step tracking is unavailable.';
        case 3:
            return 'Location lookup timed out. Live step tracking is unavailable.';
        default:
            return 'Live step tracking is unavailable on this device right now.';
    }
};

export const haversineDistanceMeters = (pointA, pointB) => {
    if (!pointA || !pointB) {
        return Number.POSITIVE_INFINITY;
    }

    const toRadians = degrees => (degrees * Math.PI) / 180;
    const earthRadiusMeters = 6371000;
    const deltaLat = toRadians(pointB.lat - pointA.lat);
    const deltaLng = toRadians(pointB.lng - pointA.lng);
    const lat1 = toRadians(pointA.lat);
    const lat2 = toRadians(pointB.lat);

    const a =
        Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

    return earthRadiusMeters * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

export const normalizeLngLat = lngLatLike => {
    if (Array.isArray(lngLatLike) && lngLatLike.length >= 2) {
        return {
            lng: Number(lngLatLike[0]),
            lat: Number(lngLatLike[1]),
        };
    }

    if (lngLatLike && Number.isFinite(Number(lngLatLike.lng)) && Number.isFinite(Number(lngLatLike.lat))) {
        return {
            lng: Number(lngLatLike.lng),
            lat: Number(lngLatLike.lat),
        };
    }

    return null;
};

const getGeometryCoordinates = stepLike => {
    const stepJson = stepLike?.asJson?.() || stepLike || {};
    return stepJson?.geometry?.coordinates || [];
};

const getProjectedPoint = (point, referenceLatRadians) => {
    const earthRadiusMeters = 6371000;
    const lngRadians = (point.lng * Math.PI) / 180;
    const latRadians = (point.lat * Math.PI) / 180;

    return {
        x: earthRadiusMeters * lngRadians * Math.cos(referenceLatRadians),
        y: earthRadiusMeters * latRadians,
    };
};

const getDistanceToSegmentMeters = (point, segmentStart, segmentEnd) => {
    const referenceLatRadians = (((point.lat + segmentStart.lat + segmentEnd.lat) / 3) * Math.PI) / 180;
    const pointProjected = getProjectedPoint(point, referenceLatRadians);
    const startProjected = getProjectedPoint(segmentStart, referenceLatRadians);
    const endProjected = getProjectedPoint(segmentEnd, referenceLatRadians);
    const deltaX = endProjected.x - startProjected.x;
    const deltaY = endProjected.y - startProjected.y;
    const segmentLengthSquared = deltaX * deltaX + deltaY * deltaY;

    if (segmentLengthSquared === 0) {
        return Math.hypot(pointProjected.x - startProjected.x, pointProjected.y - startProjected.y);
    }

    const projection = Math.max(
        0,
        Math.min(
            1,
            ((pointProjected.x - startProjected.x) * deltaX + (pointProjected.y - startProjected.y) * deltaY) /
                segmentLengthSquared,
        ),
    );

    return Math.hypot(
        pointProjected.x - (startProjected.x + projection * deltaX),
        pointProjected.y - (startProjected.y + projection * deltaY),
    );
};

export const getDistanceToRouteMeters = (position, steps) => {
    if (!position || !Array.isArray(steps) || !steps.length) {
        return Number.POSITIVE_INFINITY;
    }

    let shortestDistance = Number.POSITIVE_INFINITY;

    steps.forEach(navigationStep => {
        const coordinates = getGeometryCoordinates(navigationStep?.step);

        for (let index = 0; index < coordinates.length - 1; index += 1) {
            const segmentStart = normalizeLngLat(coordinates[index]);
            const segmentEnd = normalizeLngLat(coordinates[index + 1]);

            if (!segmentStart || !segmentEnd) {
                continue;
            }

            shortestDistance = Math.min(
                shortestDistance,
                getDistanceToSegmentMeters(position, segmentStart, segmentEnd),
            );
        }
    });

    return shortestDistance;
};

export const getDistanceToNavigationStepMeters = (position, navigationStep, fallbackPoint = null) => {
    if (!position || !navigationStep) {
        return Number.POSITIVE_INFINITY;
    }

    const coordinates = getGeometryCoordinates(navigationStep?.step);
    let shortestDistance = Number.POSITIVE_INFINITY;

    for (let index = 0; index < coordinates.length - 1; index += 1) {
        const segmentStart = normalizeLngLat(coordinates[index]);
        const segmentEnd = normalizeLngLat(coordinates[index + 1]);

        if (!segmentStart || !segmentEnd) {
            continue;
        }

        shortestDistance = Math.min(shortestDistance, getDistanceToSegmentMeters(position, segmentStart, segmentEnd));
    }

    if (Number.isFinite(shortestDistance)) {
        return shortestDistance;
    }

    const normalizedFallbackPoint = normalizeLngLat(fallbackPoint);

    if (normalizedFallbackPoint) {
        return haversineDistanceMeters(position, normalizedFallbackPoint);
    }

    return Number.POSITIVE_INFINITY;
};

export const getLiveRoutingOrigin = (position, zLevel) => {
    if (!position) {
        return null;
    }

    return {
        lngLat: {
            lng: Number(position.lng),
            lat: Number(position.lat),
        },
        zLevel: Number.isFinite(Number(zLevel)) ? Number(zLevel) : 1,
    };
};

export const getLngLatZLevel = location => {
    if (!location?.space_latitude || !location?.space_longitude) {
        return null;
    }

    return {
        lngLat: {
            lng: Number(location.space_longitude),
            lat: Number(location.space_latitude),
        },
        zLevel: Number.isFinite(Number(location?.space_zlevel)) ? Number(location.space_zlevel) : 1,
    };
};

const formatRoutingCoordinate = (lngLat, zLevel, order = 'lng-lat') => {
    if (order === 'lat-lng') {
        return `(${lngLat.lat},${lngLat.lng},${zLevel})`;
    }

    return `(${lngLat.lng},${lngLat.lat},${zLevel})`;
};

export const buildLegacyRoutingParams = (start, destination, options) => ({
    fromLngLatZ: formatRoutingCoordinate(start.lngLat, start.zLevel),
    toLngLatZ: formatRoutingCoordinate(destination.lngLat, destination.zLevel),
    from: formatRoutingCoordinate(start.lngLat, start.zLevel, 'lat-lng'),
    to: formatRoutingCoordinate(destination.lngLat, destination.zLevel, 'lat-lng'),
    srid: 4326,
    accessible: !!options.avoidStairs,
    mode: options.mode,
    campusCollectionTag: options.campusCollectionTag,
});