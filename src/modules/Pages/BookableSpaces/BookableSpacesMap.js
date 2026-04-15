import React, { useImperativeHandle, useRef } from 'react';
import PropTypes from 'prop-types';

import { CircularProgress, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';

import { addClass, removeClass } from 'helpers/general';

const StyledMapWrapperDiv = styled('div')(() => ({
    position: 'absolute',
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    flexGrow: 0,
    '& .selected-marker svg path, & .selected-marker svg polygon': {
        fill: '#e2b400',
    },
    '& .selected-marker.star-marker-el svg': {
        transform: 'scale(1.2)',
        transformOrigin: 'center',
    },
    '& .selected-marker:not(.star-marker-el) svg': {
        transform: 'scale(1.2)',
        transformOrigin: 'bottom center',
    },
    '& .mapboxgl-popup-content': {
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
    },
}));

const StyledNavigationPanel = styled('div')(() => ({
    position: 'absolute',
    right: '1rem',
    bottom: '1rem',
    width: 'min(26rem, calc(100% - 2rem))',
    maxHeight: 'min(36rem, calc(100% - 2rem))',
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderRadius: '12px',
    boxShadow: '0 10px 28px rgba(0, 0, 0, 0.2)',
    padding: '1rem 0 0',
    zIndex: 20,
    overflow: 'hidden',
    '& .navigation-panel-close': {
        position: 'absolute',
        top: '0.5rem',
        right: '0.5rem',
        zIndex: 1,
    },
    '& .navigation-panel-scroll': {
        maxHeight: 'calc(min(36rem, calc(100% - 2rem)) - 4.25rem)',
        overflowY: 'auto',
        padding: '0 0 0.5rem',
    },
    '& .mazemap-gui-route-details-container': {
        paddingRight: '0.25rem',
    },
    '& .navigation-loading, & .navigation-error': {
        alignItems: 'center',
        color: '#424445',
        display: 'flex',
        fontFamily: 'Open Sans, Geneva, Helvetica, Arial, sans-serif',
        gap: '0.75rem',
        minHeight: '7rem',
        padding: '0 1rem 1rem',
    },
    '& .navigation-error': {
        alignItems: 'flex-start',
        color: '#6b2f2f',
        lineHeight: 1.5,
    },
    '& .navigation-route-title': {
        color: '#424445',
        display: 'block',
        fontSize: '14px',
        fontWeight: 600,
        marginLeft: '47px',
        marginRight: '20px',
        marginTop: 0,
        overflowX: 'hidden',
        padding: 0,
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    '& .navigation-route-detail': {
        color: '#676464',
        display: 'block',
        fontFamily: 'Open Sans, Geneva, Helvetica, Arial, sans-serif',
        fontSize: '13px',
        fontWeight: 400,
        lineHeight: 1.4,
        marginLeft: '47px',
        marginRight: '20px',
        whiteSpace: 'pre-wrap',
    },
    '& .navigation-step-button': {
        appearance: 'none',
        background: 'transparent',
        border: 0,
        color: 'inherit',
        cursor: 'pointer',
        display: 'block',
        font: 'inherit',
        margin: 0,
        padding: 0,
        textAlign: 'left',
        width: '100%',
    },
    '& .navigation-step-distance': {
        color: '#676464',
        display: 'block',
        fontSize: '12px',
        marginLeft: '16px',
        marginTop: '0.35rem',
    },
    '& .navigation-step-meta': {
        color: '#676464',
        display: 'block',
        fontSize: '12px',
        marginLeft: '16px',
        marginTop: '0.35rem',
    },
    '& .steps-list li.navigation-active-step': {
        backgroundColor: '#f4f8fd',
        borderRadius: '10px',
    },
    '& .steps-list li.navigation-active-step .item-inner-spacing': {
        color: '#0d4c8b',
        fontWeight: 600,
    },
    '& .navigation-step-toolbar': {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        margin: '0 25px 8px 52px',
    },
    '& .navigation-step-toolbar-copy': {
        color: '#595959',
        fontFamily: 'Open Sans, Geneva, Helvetica, Arial, sans-serif',
        fontSize: '13px',
        lineHeight: 1.4,
        marginRight: '0.75rem',
    },
    '& .navigation-step-toolbar-buttons': {
        display: 'flex',
        flexShrink: 0,
        gap: '0.25rem',
    },
    '& .navigation-step-list': {
        maxHeight: '14rem',
        overflowY: 'auto',
        paddingRight: '0.35rem',
    },
    '@media (max-width: 600px)': {
        left: '1rem',
        right: '1rem',
        width: 'auto',
    },
}));

const waypointStartIcon = `data:image/svg+xml;utf8,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="6" fill="#4b9cf5"/><circle cx="10" cy="10" r="2.5" fill="#ffffff"/></svg>',
)}`;

const waypointEndIcon = `data:image/svg+xml;utf8,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path d="M10 1.75c-3.18 0-5.75 2.57-5.75 5.75 0 4.47 5.75 10.75 5.75 10.75s5.75-6.28 5.75-10.75c0-3.18-2.57-5.75-5.75-5.75Z" fill="#d64242"/><circle cx="10" cy="7.5" r="2.35" fill="#ffffff"/></svg>',
)}`;

const formatDistance = distanceMeters => {
    if (!Number.isFinite(distanceMeters)) {
        return null;
    }

    if (distanceMeters >= 1000) {
        return `${(distanceMeters / 1000).toFixed(1)} km`;
    }

    return `${Math.round(distanceMeters)} m`;
};

const formatDuration = durationMinutes => {
    if (!Number.isFinite(durationMinutes) || durationMinutes <= 0) {
        return null;
    }

    if (durationMinutes >= 60) {
        const hours = Math.floor(durationMinutes / 60);
        const minutes = Math.round(durationMinutes % 60);
        return minutes > 0 ? `${hours} hr ${minutes} min` : `${hours} hr`;
    }

    return `${Math.max(1, Math.round(durationMinutes))} min`;
};

const formatFloorLabel = zLevel => {
    const numericZLevel = Number(zLevel);

    if (!Number.isFinite(numericZLevel)) {
        return null;
    }

    return `Floor ${numericZLevel}`;
};

const getGeolocationErrorMessage = error => {
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

const haversineDistanceMeters = (pointA, pointB) => {
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

const normalizeLngLat = lngLatLike => {
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

const getLngLatZLevel = location => {
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

const buildLegacyRoutingParams = (start, destination, options) => ({
    fromLngLatZ: formatRoutingCoordinate(start.lngLat, start.zLevel),
    toLngLatZ: formatRoutingCoordinate(destination.lngLat, destination.zLevel),
    // Keep the older aliases as a compatibility fallback for SDK builds that still expect lat,lng,z.
    from: formatRoutingCoordinate(start.lngLat, start.zLevel, 'lat-lng'),
    to: formatRoutingCoordinate(destination.lngLat, destination.zLevel, 'lat-lng'),
    srid: 4326,
    accessible: !!options.avoidStairs,
    mode: options.mode,
    campusCollectionTag: options.campusCollectionTag,
});

const BookableSpacesMap = React.forwardRef(
    (
        {
            sortedSpaceLocations,
            spacesFavouritesList,
            onMarkerClick,
            centreLatLong,
            navigationTarget,
            navigationOrigin,
            onNavigationClose,
        },
        ref,
    ) => {
        console.log('BookableSpacesMap load centreLatLong=', centreLatLong);

        const [isMazeMapScriptReady, setIsMazeMapScriptReady] = React.useState(false);
        const [isMazeMapReady, setIsMazeMapReady] = React.useState(false);
        const [mapContainer, setMapContainer] = React.useState(null);
        const [navigationState, setNavigationState] = React.useState({
            status: 'idle',
            steps: [],
            currentStepIndex: 0,
            totalDistanceMeters: null,
            totalDurationMinutes: null,
            title: '',
            error: '',
        });
        const [liveNavigationState, setLiveNavigationState] = React.useState({
            status: 'idle',
            position: null,
            error: '',
        });
        const mazeMapInstanceRef = useRef(null);
        const mazeMarkersRef = useRef(new Map());
        const selectedMarkerElRef = useRef(null);
        const activePopupRef = useRef(null);
        const routeDrawerRef = useRef(null);
        const latestRoutingRequestRef = useRef(0);
        const stepListItemRefs = useRef([]);
        const geolocationWatchIdRef = useRef(null);
        const userLocationMarkerRef = useRef(null);

        const ZOOM_CAMPUS_MANY_BUILDINGS = 20;
        const ZOOM_CAMPUS_ONE_BUILDING = 17;
        const CAMPUS_INDEX_ST_LUCIA = 1;

        const zoomLevelForCampus = _campusId => {
            return _campusId === CAMPUS_INDEX_ST_LUCIA ? ZOOM_CAMPUS_ONE_BUILDING : ZOOM_CAMPUS_MANY_BUILDINGS;
        };

        const setSelectedMarker = (markerEl, space) => {
            if (selectedMarkerElRef.current && selectedMarkerElRef.current !== markerEl) {
                removeClass(selectedMarkerElRef.current, 'selected-marker');
                selectedMarkerElRef.current.style.zIndex = selectedMarkerElRef.current.dataset.baseZindex || '';
            }
            if (markerEl) {
                addClass(markerEl, 'selected-marker');
                markerEl.style.zIndex = '10';
            }
            selectedMarkerElRef.current = markerEl ?? null;

            activePopupRef.current?.remove();
            activePopupRef.current = null;

            if (markerEl && space?.space_longitude && space?.space_latitude && mazeMapInstanceRef.current) {
                const container = document.createElement('div');
                container.style.cssText = 'padding: 2px 4px; font-size: 0.85rem; line-height: 1.4;';

                const nameEl = document.createElement('strong');
                nameEl.textContent = space.space_name ?? '';
                container.appendChild(nameEl);

                const spaceTypeName = space.space_type_details?.space_type_name ?? space.space_type;
                if (spaceTypeName) {
                    container.appendChild(document.createElement('br'));
                    const typeEl = document.createElement('strong');
                    typeEl.textContent = spaceTypeName;
                    container.appendChild(typeEl);
                }

                if (space.space_library_name) {
                    container.appendChild(document.createElement('br'));
                    const libraryEl = document.createElement('span');
                    libraryEl.textContent = space.space_library_name;
                    container.appendChild(libraryEl);
                }

                const isFavourite = markerEl.classList.contains('star-marker-el');
                if (isFavourite) {
                    container.appendChild(document.createElement('br'));
                    const favEl = document.createElement('em');
                    favEl.textContent = 'One of your favourite spaces';
                    favEl.style.cssText = 'font-size: 0.8rem; color: #666;';
                    container.appendChild(favEl);
                }

                activePopupRef.current = new window.Mazemap.Popup({
                    closeButton: true,
                    closeOnClick: true,
                    offset: [0, -40],
                    maxWidth: '240px',
                })
                    .setLngLat([space.space_longitude, space.space_latitude])
                    .setDOMContent(container)
                    .addTo(mazeMapInstanceRef.current);
            }
        };

        useImperativeHandle(ref, () => ({
            flyToSpace(location) {
                console.log('flyToSpace location.space_campus_id=', location.space_campus_id, location);
                !location?.space_campus_id && alert('CAMPUS ID NOT PROVIDED'); // debug
                const map = mazeMapInstanceRef.current;
                if (!map || !location?.space_longitude || !location?.space_latitude || !location?.space_campus_id) {
                    console.log('invalid call to flyToSpace', location);
                    return;
                }

                const doFly = () => {
                    map.flyTo({
                        center: [location.space_longitude, location.space_latitude],
                        zoom: zoomLevelForCampus(location.space_campus_id),
                        curve: 0.5,
                        speed: 1.6,
                    });
                    const entry = mazeMarkersRef.current.get(location?.space_id);
                    if (entry?.markerEl) setSelectedMarker(entry.markerEl, location);
                };

                const targetZLevel = location?.space_zlevel !== null ? parseFloat(location.space_zlevel) : null;
                if (targetZLevel !== null) {
                    // Stop any in-progress camera animation before changing floor,
                    // otherwise MazeMap ignores setZLevel while a flyTo is winding down.
                    map.stop();
                    map.setZLevel(targetZLevel);
                    setTimeout(doFly, 300);
                } else {
                    doFly();
                }
            },
        }));

        // eslint-disable-next-line consistent-return
        React.useEffect(() => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = `/${process.env.PUBLIC_PATH || ''}vendor/mazemap/mazemap.min.css`;
            document.head.appendChild(link);

            const script = document.createElement('script');
            script.src = `/${process.env.PUBLIC_PATH || ''}vendor/mazemap/mazemap.min.js`;
            script.type = 'text/javascript';
            script.async = true;
            script.onload = () => setIsMazeMapScriptReady(true);
            document.body.appendChild(script);

            return () => {
                document.head.removeChild(link);
                document.body.removeChild(script);
            };
        }, []);

        React.useEffect(() => {
            if (!isMazeMapScriptReady || !mapContainer) {
                return;
            }

            mazeMapInstanceRef.current = new window.Mazemap.Map({
                container: 'mazemap-container',
                campuses: 'all',
                center: { lat: centreLatLong.space_latitude, lng: centreLatLong.space_longitude },
                zoom: zoomLevelForCampus(centreLatLong.space_campus_id),
                zLevel: centreLatLong?.space_zlevel ?? 1,
                RTLTextPlugin: null,
            });

            mazeMapInstanceRef.current.on('load', () => {
                routeDrawerRef.current = new window.Mazemap.AtoBTripBasicDrawer(mazeMapInstanceRef.current, {
                    showDirectionArrows: true,
                });
                mazeMapInstanceRef.current.resize();
                setIsMazeMapReady(true);
            });

            // eslint-disable-next-line consistent-return
            return () => {
                routeDrawerRef.current?.remove();
                routeDrawerRef.current = null;
                mazeMapInstanceRef.current?.remove();
                mazeMapInstanceRef.current = null;
                setIsMazeMapReady(false);
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [isMazeMapScriptReady, mapContainer]);

        // eslint-disable-next-line consistent-return
        React.useEffect(() => {
            if (!isMazeMapReady || !mazeMapInstanceRef.current) return;

            mazeMarkersRef.current.forEach(({ marker }) => marker.remove());
            mazeMarkersRef.current = new Map();
            selectedMarkerElRef.current = null;
            activePopupRef.current?.remove();
            activePopupRef.current = null;

            sortedSpaceLocations
                ?.filter(m => !!m?.space_latitude && !!m?.space_longitude)
                ?.forEach(mapPoint => {
                    const isFavourite = spacesFavouritesList?.some(fav => fav.space_id === mapPoint.space_id);

                    let marker;
                    if (isFavourite) {
                        const starEl = document.createElement('div');
                        starEl.style.cssText = 'width: 55px; height: 55px; cursor: pointer;';
                        starEl.classList.add('star-marker-el');
                        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                        svg.setAttribute('width', '55');
                        svg.setAttribute('height', '55');
                        svg.setAttribute('viewBox', '0 0 32 32');
                        svg.style.cssText = 'display:block;overflow:visible;';
                        const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                        poly.setAttribute(
                            'points',
                            '16,2 19.23,10.55 28.36,10.98 21.23,16.70 23.64,25.52 16,20.5 8.36,25.52 10.77,16.70 3.64,10.98 12.77,10.55',
                        );
                        poly.setAttribute('fill', '#51247a');
                        poly.setAttribute('stroke', 'white');
                        poly.setAttribute('stroke-width', '1.5');
                        poly.setAttribute('stroke-linejoin', 'round');
                        svg.appendChild(poly);
                        starEl.appendChild(svg);
                        marker = new window.Mazemap.ZLevelMarker(starEl, { offset: [0, 0] })
                            .setLngLat([mapPoint.space_longitude, mapPoint.space_latitude])
                            .addTo(mazeMapInstanceRef.current);
                    } else {
                        marker = new window.Mazemap.MazeMarker({ color: '#51247a' })
                            .setLngLat([mapPoint.space_longitude, mapPoint.space_latitude])
                            .addTo(mazeMapInstanceRef.current);
                    }

                    const markerEl = marker.getElement();
                    markerEl.setAttribute('role', 'img');
                    if (isFavourite) {
                        markerEl.style.zIndex = '1';
                        markerEl.dataset.baseZindex = '1';
                    } else {
                        markerEl.dataset.baseZindex = '';
                    }
                    markerEl.addEventListener('click', e => {
                        const targetZLevel = mapPoint?.space_zlevel !== null ? parseFloat(mapPoint.space_zlevel) : null;
                        if (targetZLevel !== null) {
                            mazeMapInstanceRef.current?.stop();
                            mazeMapInstanceRef.current?.setZLevel(targetZLevel);
                        }
                        setSelectedMarker(markerEl, mapPoint);
                        onMarkerClick(e, mapPoint, markerEl);
                    });

                    mazeMarkersRef.current.set(mapPoint.space_id, { marker, markerEl });
                });
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [sortedSpaceLocations, isMazeMapReady]);

        React.useEffect(() => {
            if (!isMazeMapReady || !mazeMapInstanceRef.current || !routeDrawerRef.current) {
                return;
            }

            if (!navigationTarget || !navigationOrigin) {
                routeDrawerRef.current.clear();
                setNavigationState({
                    status: 'idle',
                    steps: [],
                    currentStepIndex: 0,
                    totalDistanceMeters: null,
                    totalDurationMinutes: null,
                    title: '',
                    error: '',
                });
                return;
            }

            const start = getLngLatZLevel(navigationOrigin);
            const destination = getLngLatZLevel(navigationTarget);

            if (!start || !destination) {
                setNavigationState({
                    status: 'error',
                    steps: [],
                    currentStepIndex: 0,
                    totalDistanceMeters: null,
                    totalDurationMinutes: null,
                    title: navigationTarget?.space_name || 'Route unavailable',
                    error: 'This space does not have enough location data for navigation.',
                });
                routeDrawerRef.current.clear();
                return;
            }

            const requestId = latestRoutingRequestRef.current + 1;
            latestRoutingRequestRef.current = requestId;

            setNavigationState(current => ({
                ...current,
                status: 'loading',
                steps: [],
                currentStepIndex: 0,
                title: navigationTarget?.space_name || '',
                error: '',
            }));

            const options = {
                campusCollectionTag: 'all',
                connectToStart: true,
                connectToEnd: true,
                includeSteps: true,
                mode: 'PEDESTRIAN',
            };

            const requestTrip = async () => {
                const threeArgRouteGetter =
                    window.Mazemap?.Data?.getAToBTrip ||
                    window.Mazemap?.getAToBTrip ||
                    window.Mazemap?.Data?.getRouteTrip;

                if (typeof threeArgRouteGetter === 'function') {
                    return threeArgRouteGetter(start, destination, options);
                }

                const singleArgRouteGetter = window.Mazemap?.Data?.getAtoBTrip;
                if (typeof singleArgRouteGetter === 'function') {
                    return singleArgRouteGetter(buildLegacyRoutingParams(start, destination, options));
                }

                throw new Error('MazeMap routing API is unavailable.');
            };

            requestTrip()
                .then(trip => {
                    if (latestRoutingRequestRef.current !== requestId) {
                        return;
                    }

                    routeDrawerRef.current?.setAtoBTrip(trip);

                    const turnByTurnSteps = trip.getTurnByTurnSteps?.() || [];
                    const instructionSteps = trip.getInstructionsSteps?.() || [];
                    const steps = turnByTurnSteps.map((step, index) => ({
                        step,
                        instruction:
                            step?.asJson?.()?.instruction ||
                            instructionSteps?.[index]?.instruction ||
                            instructionSteps?.[index]?.text ||
                            step?.maneuver?.type?.replaceAll('_', ' ') ||
                            `Step ${index + 1}`,
                    }));

                    setNavigationState({
                        status: 'ready',
                        steps,
                        currentStepIndex: 0,
                        totalDistanceMeters: trip.getTotalDistanceMeters?.() ?? null,
                        totalDurationMinutes: trip.getTotalDurationMinutes?.() ?? null,
                        title: navigationTarget?.space_name || '',
                        error: '',
                    });

                    const firstStep = steps[0]?.step;
                    if (firstStep) {
                        mazeMapInstanceRef.current.setZLevel(firstStep.zLevel ?? destination.zLevel);
                        mazeMapInstanceRef.current.flyTo({
                            center: firstStep.getStepStartPointLngLat(),
                            zoom: zoomLevelForCampus(navigationTarget.space_campus_id),
                            speed: 1.4,
                        });
                    }
                })
                .catch(error => {
                    if (latestRoutingRequestRef.current !== requestId) {
                        return;
                    }

                    routeDrawerRef.current?.clear();
                    setNavigationState({
                        status: 'error',
                        steps: [],
                        currentStepIndex: 0,
                        totalDistanceMeters: null,
                        totalDurationMinutes: null,
                        title: navigationTarget?.space_name || 'Route unavailable',
                        error: error?.message || 'Unable to load navigation steps for this space.',
                    });
                });
        }, [isMazeMapReady, navigationOrigin, navigationTarget]);

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
                    error: '',
                });
                userLocationMarkerRef.current?.remove();
                userLocationMarkerRef.current = null;
                return clearGeolocationWatch;
            }

            if (!navigator.geolocation) {
                setLiveNavigationState({
                    status: 'unsupported',
                    position: null,
                    error: 'Live step tracking is not supported in this browser.',
                });
                return clearGeolocationWatch;
            }

            const handleSuccess = position => {
                setLiveNavigationState({
                    status: 'watching',
                    position: {
                        lat: Number(position.coords.latitude),
                        lng: Number(position.coords.longitude),
                    },
                    error: '',
                });
            };

            const handleError = error => {
                setLiveNavigationState(current => ({
                    status: 'error',
                    position: current.position,
                    error: getGeolocationErrorMessage(error),
                }));
            };

            geolocationWatchIdRef.current = navigator.geolocation.watchPosition(handleSuccess, handleError, {
                enableHighAccuracy: true,
                maximumAge: 5000,
                timeout: 15000,
            });

            return clearGeolocationWatch;
        }, [isMazeMapReady, navigationTarget]);

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
                userLocationMarkerRef.current = new window.Mazemap.MazeMarker({
                    color: '#1b78d6',
                })
                    .setLngLat([liveNavigationState.position.lng, liveNavigationState.position.lat])
                    .addTo(mazeMapInstanceRef.current);

                const markerElement = userLocationMarkerRef.current.getElement?.();
                if (markerElement) {
                    markerElement.style.zIndex = '11';
                }
            } else {
                userLocationMarkerRef.current.setLngLat([
                    liveNavigationState.position.lng,
                    liveNavigationState.position.lat,
                ]);
            }
        }, [isMazeMapReady, liveNavigationState.position]);

        React.useEffect(() => {
            if (navigationState.status !== 'ready' || !liveNavigationState.position || !navigationState.steps.length) {
                return;
            }

            const currentIndex = navigationState.currentStepIndex;
            let bestIndex = currentIndex;
            let bestDistance = Number.POSITIVE_INFINITY;

            for (let index = currentIndex; index < navigationState.steps.length; index += 1) {
                const stepPoint = normalizeLngLat(navigationState.steps[index]?.step?.getStepStartPointLngLat?.());
                const distance = haversineDistanceMeters(liveNavigationState.position, stepPoint);

                if (distance < bestDistance) {
                    bestDistance = distance;
                    bestIndex = index;
                }
            }

            if (bestIndex !== currentIndex && bestDistance <= 35) {
                setNavigationState(current => ({
                    ...current,
                    currentStepIndex: bestIndex,
                }));
            }
        }, [
            liveNavigationState.position,
            navigationState.currentStepIndex,
            navigationState.status,
            navigationState.steps,
        ]);

        React.useEffect(() => {
            return () => {
                userLocationMarkerRef.current?.remove();
                userLocationMarkerRef.current = null;
            };
        }, []);

        const startDetail = ['Campus map centre', formatFloorLabel(navigationOrigin?.space_zlevel)]
            .filter(Boolean)
            .join(', ');
        const destinationDetail = [
            navigationTarget?.space_library_name,
            formatFloorLabel(navigationTarget?.space_zlevel),
        ]
            .filter(Boolean)
            .join(', ');
        const routeOverviewCopy = [
            formatDistance(navigationState.totalDistanceMeters),
            formatDuration(navigationState.totalDurationMinutes),
        ]
            .filter(Boolean)
            .join(' · ');
        const currentStepSummary = navigationState.steps.length
            ? `Step ${navigationState.currentStepIndex + 1} of ${navigationState.steps.length}`
            : 'Route overview';
        const currentStepDistance = formatDistance(
            navigationState.steps[navigationState.currentStepIndex]?.step?.getDistanceMeters?.(),
        );
        const liveTrackingCopy =
            liveNavigationState.status === 'watching'
                ? 'Live tracking on'
                : liveNavigationState.error || 'Live tracking unavailable';

        const showNavigationStep = React.useCallback(
            nextIndex => {
                const nextStep = navigationState.steps[nextIndex]?.step;
                if (!nextStep || !mazeMapInstanceRef.current) {
                    return;
                }

                setNavigationState(current => ({
                    ...current,
                    currentStepIndex: nextIndex,
                }));

                mazeMapInstanceRef.current.stop();
                if (Number.isFinite(nextStep?.zLevel)) {
                    mazeMapInstanceRef.current.setZLevel(nextStep.zLevel);
                }
                mazeMapInstanceRef.current.flyTo({
                    center: nextStep.getStepStartPointLngLat(),
                    zoom: mazeMapInstanceRef.current.getZoom() < 19 ? 19 : mazeMapInstanceRef.current.getZoom(),
                    speed: 1.2,
                });
            },
            [navigationState.steps],
        );

        React.useEffect(() => {
            if (navigationState.status !== 'ready') {
                return;
            }

            const activeStepElement = stepListItemRefs.current[navigationState.currentStepIndex];
            activeStepElement?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }, [navigationState.currentStepIndex, navigationState.status]);

        return (
            <StyledMapWrapperDiv id="mazemap-container" ref={setMapContainer}>
                {navigationState.status !== 'idle' && (
                    <StyledNavigationPanel data-testid="space-navigation-panel">
                        <IconButton
                            className="navigation-panel-close"
                            size="small"
                            onClick={onNavigationClose}
                            aria-label="Close navigation"
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>

                        <div className="navigation-panel-scroll">
                            {navigationState.status === 'loading' && (
                                <div className="navigation-loading">
                                    <CircularProgress size={18} />
                                    <span>Calculating route…</span>
                                </div>
                            )}

                            {navigationState.status === 'error' && (
                                <div className="navigation-error">{navigationState.error}</div>
                            )}

                            {navigationState.status === 'ready' && (
                                <div className="mazemap-gui-route-details-container">
                                    <div className="mazemap-gui-route-waypoints">
                                        <div className="waypoint-item">
                                            <img className="waypoint-icon" src={waypointStartIcon} alt="Start" />
                                            <h2 className="waypoint-title navigation-route-title">From</h2>
                                            <span className="waypoint-detail navigation-route-detail">
                                                {startDetail}
                                            </span>
                                        </div>
                                        <div className="waypoint-item">
                                            <img className="waypoint-icon" src={waypointEndIcon} alt="Destination" />
                                            <h2 className="waypoint-title navigation-route-title">
                                                To {navigationState.title}
                                            </h2>
                                            <span className="waypoint-detail navigation-route-detail">
                                                {destinationDetail || 'Selected bookable space'}
                                            </span>
                                        </div>
                                    </div>

                                    <hr />

                                    <div className="mazemap-gui-route-meta-container">
                                        <div className="route-metric-info">
                                            <div>
                                                <span className="metric-data">
                                                    {formatDistance(navigationState.totalDistanceMeters) ||
                                                        'Distance unavailable'}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="metric-data">
                                                    {formatDuration(navigationState.totalDurationMinutes) ||
                                                        'Time unavailable'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="route-steps-num">
                                            Walking route from the campus map centre
                                            {routeOverviewCopy ? ` · ${routeOverviewCopy}` : ''}
                                        </div>
                                    </div>

                                    <hr />

                                    <div className="mazemap-route-description-container">
                                        <h2 id="route-details-steps-header">Detailed instructions</h2>
                                        <div className="navigation-step-toolbar">
                                            <div className="navigation-step-toolbar-copy">
                                                <strong>{currentStepSummary}</strong>
                                                {currentStepDistance ? ` · ${currentStepDistance}` : ''}
                                                <br />
                                                {liveTrackingCopy}
                                            </div>
                                            <div className="navigation-step-toolbar-buttons">
                                                <IconButton
                                                    size="small"
                                                    onClick={() =>
                                                        showNavigationStep(navigationState.currentStepIndex - 1)
                                                    }
                                                    disabled={navigationState.currentStepIndex === 0}
                                                    aria-label="Previous step"
                                                >
                                                    <ChevronLeftIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    onClick={() =>
                                                        showNavigationStep(navigationState.currentStepIndex + 1)
                                                    }
                                                    disabled={
                                                        navigationState.currentStepIndex >=
                                                        navigationState.steps.length - 1
                                                    }
                                                    aria-label="Next step"
                                                >
                                                    <ChevronRightIcon fontSize="small" />
                                                </IconButton>
                                            </div>
                                        </div>
                                        <div className="navigation-step-list">
                                            <ol className="steps-list" aria-labelledby="route-details-steps-header">
                                                {navigationState.steps.map((navigationStep, index) => (
                                                    <li
                                                        key={`navigation-step-${index + 1}`}
                                                        ref={element => {
                                                            stepListItemRefs.current[index] = element;
                                                        }}
                                                        className={
                                                            index === navigationState.currentStepIndex
                                                                ? 'navigation-active-step'
                                                                : ''
                                                        }
                                                    >
                                                        <button
                                                            type="button"
                                                            className="navigation-step-button"
                                                            onClick={() => showNavigationStep(index)}
                                                        >
                                                            <span className="item-inner-spacing">
                                                                {navigationStep.instruction}
                                                                {navigationStep?.step && (
                                                                    <span className="navigation-step-meta">
                                                                        Step {index + 1} of{' '}
                                                                        {navigationState.steps.length}
                                                                        {' · '}
                                                                        {formatDistance(
                                                                            navigationStep.step.getDistanceMeters?.(),
                                                                        ) || 'Distance unavailable'}
                                                                        {navigationStep?.step?.maneuver?.type
                                                                            ? ` · ${navigationStep.step.maneuver.type.replaceAll(
                                                                                  '_',
                                                                                  ' ',
                                                                              )}`
                                                                            : ''}
                                                                    </span>
                                                                )}
                                                            </span>
                                                        </button>
                                                    </li>
                                                ))}
                                            </ol>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </StyledNavigationPanel>
                )}
            </StyledMapWrapperDiv>
        );
    },
);

BookableSpacesMap.displayName = 'BookableSpacesMap';

BookableSpacesMap.propTypes = {
    sortedSpaceLocations: PropTypes.any,
    spacesFavouritesList: PropTypes.any,
    onMarkerClick: PropTypes.func.isRequired,
    centreLatLong: PropTypes.any,
    navigationTarget: PropTypes.any,
    navigationOrigin: PropTypes.any,
    onNavigationClose: PropTypes.func,
};

export default BookableSpacesMap;
