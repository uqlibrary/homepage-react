import React from 'react';

import {
    FOLLOW_USER_RECENTER_DISTANCE_METERS,
    LARGE_BEARING_DELTA_DEGREES,
    MIN_BEARING_UPDATE_DEGREES,
    centerMapOnPosition,
    getDeviceHeading,
    getGeolocationErrorMessage,
    getLiveRoutingOrigin,
    getShortestAngleDelta,
    haversineDistanceMeters,
    normalizeAngle,
    normalizeLngLat,
    setMapBearing,
    smoothAngle,
} from './BookableSpacesMapHelpers';

const createUserLocationChevronElement = () => {
    const markerEl = document.createElement('div');
    markerEl.style.cssText = [
        'width: 37px',
        'height: 37px',
        'display: flex',
        'align-items: center',
        'justify-content: center',
        'pointer-events: none',
    ].join('; ');

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '37');
    svg.setAttribute('height', '37');
    svg.setAttribute('viewBox', '0 0 32 32');
    svg.setAttribute('data-user-heading-chevron', 'true');
    svg.style.cssText = [
        'display: block',
        'overflow: visible',
        'transform-origin: 50% 50%',
        'transition: transform 120ms linear',
        'filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.22))',
    ].join('; ');

    const outerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    outerCircle.setAttribute('cx', '16');
    outerCircle.setAttribute('cy', '16');
    outerCircle.setAttribute('r', '12.2');
    outerCircle.setAttribute('fill', '#ffffff');
    svg.appendChild(outerCircle);

    const innerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    innerCircle.setAttribute('cx', '16');
    innerCircle.setAttribute('cy', '16');
    innerCircle.setAttribute('r', '10.5');
    innerCircle.setAttribute('fill', '#1b78d6');
    svg.appendChild(innerCircle);

    const chevron = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    chevron.setAttribute('d', 'M16 7 L22.5 21.4 L16 18.4 L9.5 21.4 Z');
    chevron.setAttribute('fill', '#ffffff');
    chevron.setAttribute('stroke', '#ffffff');
    chevron.setAttribute('stroke-linejoin', 'round');
    chevron.setAttribute('stroke-width', '0.8');
    svg.appendChild(chevron);

    markerEl.appendChild(svg);

    return markerEl;
};

const setUserLocationMarkerHeading = (userLocationMarkerRef, heading, mapBearing = 0) => {
    const markerElement = userLocationMarkerRef.current?.getElement?.();
    const chevronElement = markerElement?.querySelector?.('[data-user-heading-chevron="true"]');

    if (!chevronElement) {
        return;
    }

    const normalizedHeading = Number.isFinite(Number(heading)) ? normalizeAngle(heading) : 0;
    const normalizedMapBearing = Number.isFinite(Number(mapBearing)) ? normalizeAngle(mapBearing) : 0;
    const relativeHeading = normalizeAngle(normalizedHeading - normalizedMapBearing);

    chevronElement.style.transform = `rotate(${relativeHeading}deg)`;
};

export const useLiveNavigationGeolocation = ({
    isMazeMapReady,
    mazeMapInstanceRef,
    navigationTarget,
    pendingInitialLiveRouteRef,
    geolocationWatchIdRef,
    userLocationMarkerRef,
    setLiveNavigationState,
}) => {
    React.useEffect(() => {
        const clearGeolocationWatch = () => {
            if (geolocationWatchIdRef.current !== null && navigator.geolocation) {
                navigator.geolocation.clearWatch(geolocationWatchIdRef.current);
                geolocationWatchIdRef.current = null;
            }
        };

        if (!isMazeMapReady || !mazeMapInstanceRef.current) {
            return clearGeolocationWatch;
        }

        if (!navigationTarget) {
            clearGeolocationWatch();
            setLiveNavigationState({
                status: 'idle',
                position: null,
                accuracy: null,
                error: '',
            });
            userLocationMarkerRef.current?.remove();
            userLocationMarkerRef.current = null;
            pendingInitialLiveRouteRef.current = false;
            return clearGeolocationWatch;
        }

        if (!navigator.geolocation) {
            setLiveNavigationState({
                status: 'unsupported',
                position: null,
                accuracy: null,
                error: 'Live step tracking is not supported in this browser.',
            });
            pendingInitialLiveRouteRef.current = false;
            return clearGeolocationWatch;
        }

        pendingInitialLiveRouteRef.current = true;
        setLiveNavigationState(current => ({
            status: current.position ? 'watching' : 'locating',
            position: current.position,
            accuracy: current.accuracy ?? null,
            error: '',
        }));

        const handleSuccess = position => {
            setLiveNavigationState({
                status: 'watching',
                position: {
                    lat: Number(position.coords.latitude),
                    lng: Number(position.coords.longitude),
                },
                accuracy: Number.isFinite(Number(position.coords.accuracy)) ? Number(position.coords.accuracy) : null,
                error: '',
            });
        };

        const handleError = error => {
            if (error?.code === error?.PERMISSION_DENIED || error?.code === error?.POSITION_UNAVAILABLE) {
                pendingInitialLiveRouteRef.current = false;
            }

            setLiveNavigationState(current => ({
                status: 'error',
                position: current.position,
                accuracy: current.accuracy ?? null,
                error: getGeolocationErrorMessage(error),
            }));
        };

        navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 12000,
        });

        geolocationWatchIdRef.current = navigator.geolocation.watchPosition(handleSuccess, handleError, {
            enableHighAccuracy: true,
            maximumAge: 5000,
            timeout: 15000,
        });

        return clearGeolocationWatch;
    }, [
        geolocationWatchIdRef,
        isMazeMapReady,
        mazeMapInstanceRef,
        navigationTarget,
        pendingInitialLiveRouteRef,
        setLiveNavigationState,
        userLocationMarkerRef,
    ]);
};

export const useUserLocationMarker = ({
    isMazeMapReady,
    mazeMapInstanceRef,
    liveNavigationState,
    orientationHeadingRef,
    orientationState,
    userLocationMarkerRef,
}) => {
    React.useEffect(() => {
        if (!isMazeMapReady || !mazeMapInstanceRef.current) {
            return;
        }

        if (!liveNavigationState.position) {
            userLocationMarkerRef.current?.remove();
            userLocationMarkerRef.current = null;
            return;
        }

        if (!userLocationMarkerRef.current) {
            const markerElement = createUserLocationChevronElement();

            userLocationMarkerRef.current = new window.Mazemap.ZLevelMarker(markerElement, {
                offset: [0, 0],
            })
                .setLngLat([liveNavigationState.position.lng, liveNavigationState.position.lat])
                .addTo(mazeMapInstanceRef.current);

            const renderedMarkerElement = userLocationMarkerRef.current.getElement?.();
            if (renderedMarkerElement) {
                renderedMarkerElement.style.zIndex = '11';
            }

            setUserLocationMarkerHeading(
                userLocationMarkerRef,
                orientationState.enabled ? orientationHeadingRef.current : 0,
                mazeMapInstanceRef.current?.getBearing?.() ?? 0,
            );
        } else {
            userLocationMarkerRef.current.setLngLat([
                liveNavigationState.position.lng,
                liveNavigationState.position.lat,
            ]);
        }

        if (!orientationState.enabled) {
            setUserLocationMarkerHeading(userLocationMarkerRef, 0, 0);
        }
    }, [
        isMazeMapReady,
        liveNavigationState.position,
        mazeMapInstanceRef,
        orientationHeadingRef,
        orientationState.enabled,
        userLocationMarkerRef,
    ]);
};

export const useInitialLiveReroute = ({
    liveNavigationState,
    navigationOrigin,
    navigationTarget,
    mazeMapInstanceRef,
    pendingInitialLiveRouteRef,
    rerouteRequest,
    setRerouteRequest,
}) => {
    React.useEffect(() => {
        if (
            !pendingInitialLiveRouteRef.current ||
            !navigationTarget ||
            !liveNavigationState.position ||
            rerouteRequest.active
        ) {
            return;
        }

        const fallbackZLevel =
            mazeMapInstanceRef.current?.getZLevel?.() ??
            navigationTarget?.space_zlevel ??
            navigationOrigin?.space_zlevel;
        const nextOrigin = getLiveRoutingOrigin(liveNavigationState.position, fallbackZLevel);

        if (!nextOrigin) {
            return;
        }

        pendingInitialLiveRouteRef.current = false;
        setRerouteRequest({
            active: true,
            origin: nextOrigin,
            reason: '',
        });
    }, [
        liveNavigationState.position,
        mazeMapInstanceRef,
        navigationOrigin?.space_zlevel,
        navigationTarget,
        pendingInitialLiveRouteRef,
        rerouteRequest.active,
        setRerouteRequest,
    ]);
};

export const useFollowUserOnMap = ({
    isMazeMapReady,
    mazeMapInstanceRef,
    navigationTarget,
    liveNavigationState,
    isManualStepSelectionActive,
}) => {
    React.useEffect(() => {
        if (
            !isMazeMapReady ||
            !mazeMapInstanceRef.current ||
            !navigationTarget ||
            !liveNavigationState.position ||
            liveNavigationState.status !== 'watching' ||
            isManualStepSelectionActive
        ) {
            return;
        }

        const currentMapCenter = normalizeLngLat(mazeMapInstanceRef.current.getCenter?.());
        const distanceFromUserMeters = haversineDistanceMeters(currentMapCenter, liveNavigationState.position);

        if (Number.isFinite(distanceFromUserMeters) && distanceFromUserMeters < FOLLOW_USER_RECENTER_DISTANCE_METERS) {
            return;
        }

        centerMapOnPosition(mazeMapInstanceRef.current, liveNavigationState.position);
    }, [
        isManualStepSelectionActive,
        isMazeMapReady,
        liveNavigationState.position,
        liveNavigationState.status,
        mazeMapInstanceRef,
        navigationTarget,
    ]);
};

export const useOrientationTracking = ({
    isMazeMapReady,
    mazeMapInstanceRef,
    orientationState,
    orientationHeadingRef,
    userLocationMarkerRef,
}) => {
    const hasAbsoluteOrientationRef = React.useRef(false);

    React.useEffect(() => {
        if (!isMazeMapReady || !mazeMapInstanceRef.current || !orientationState.enabled) {
            return undefined;
        }

        const handleDeviceOrientation = event => {
            const isAbsoluteReading = Number.isFinite(Number(event?.webkitCompassHeading)) || event?.absolute === true;

            if (isAbsoluteReading) {
                hasAbsoluteOrientationRef.current = true;
            }

            const nextHeading = getDeviceHeading(event, {
                allowRelativeAlpha: !hasAbsoluteOrientationRef.current,
            });

            if (!Number.isFinite(nextHeading)) {
                return;
            }

            const previousHeading = orientationHeadingRef.current;
            const angleDelta = Math.abs(getShortestAngleDelta(previousHeading, nextHeading));
            const smoothedHeading =
                Number.isFinite(previousHeading) && angleDelta >= LARGE_BEARING_DELTA_DEGREES
                    ? normalizeAngle(nextHeading)
                    : smoothAngle(previousHeading, nextHeading);

            if (!Number.isFinite(smoothedHeading)) {
                return;
            }

            orientationHeadingRef.current = smoothedHeading;

            if (
                Number.isFinite(previousHeading) &&
                Math.abs(getShortestAngleDelta(previousHeading, smoothedHeading)) < MIN_BEARING_UPDATE_DEGREES
            ) {
                return;
            }

            setMapBearing(mazeMapInstanceRef.current, smoothedHeading);
            setUserLocationMarkerHeading(userLocationMarkerRef, smoothedHeading, smoothedHeading);
        };

        hasAbsoluteOrientationRef.current = false;
        window.addEventListener('deviceorientationabsolute', handleDeviceOrientation, true);
        window.addEventListener('deviceorientation', handleDeviceOrientation, true);

        return () => {
            window.removeEventListener('deviceorientationabsolute', handleDeviceOrientation, true);
            window.removeEventListener('deviceorientation', handleDeviceOrientation, true);
        };
    }, [isMazeMapReady, mazeMapInstanceRef, orientationHeadingRef, orientationState.enabled, userLocationMarkerRef]);

    React.useEffect(() => {
        if (!isMazeMapReady || !mazeMapInstanceRef.current || orientationState.enabled) {
            return;
        }

        orientationHeadingRef.current = null;
        setMapBearing(mazeMapInstanceRef.current, 0);
        setUserLocationMarkerHeading(userLocationMarkerRef, 0, 0);
    }, [isMazeMapReady, mazeMapInstanceRef, orientationHeadingRef, orientationState.enabled, userLocationMarkerRef]);
};
