import React, { useImperativeHandle, useRef } from 'react';
import PropTypes from 'prop-types';

import { CircularProgress, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import MinimizeIcon from '@mui/icons-material/Minimize';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';

import { addClass, removeClass } from 'helpers/general';
import {
    OFF_ROUTE_REROUTE_DISTANCE_METERS,
    buildLegacyRoutingParams,
    buildStepInstruction,
    formatDistance,
    formatDurationDetailed,
    getDisplayedTurnType,
    getDistanceToNavigationStepMeters,
    getDistanceToRouteMeters,
    getLiveRoutingOrigin,
    getLngLatZLevel,
    getNormalizedStepTurnType,
    getRemainingDistanceMeters,
    getStepTurnRotation,
    haversineDistanceMeters,
    lowercaseFirstCharacter,
    normalizeLngLat,
    supportsDeviceOrientation,
} from './BookableSpacesMapHelpers';
import {
    useFollowUserOnMap,
    useInitialLiveReroute,
    useLiveNavigationGeolocation,
    useOrientationTracking,
    useUserLocationMarker,
} from './BookableSpacesMapHooks';

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
    '& .map-popup-title': {
        fontSize: '1.1rem',
        fontWeight: 700,
        lineHeight: 1.2,
    },
    '& .map-popup-navigate-button': {
        appearance: 'none',
        backgroundColor: '#2f72ea',
        border: 0,
        borderRadius: '4px',
        boxShadow:
            '0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)',
        color: '#ffffff',
        cursor: 'pointer',
        display: 'flex',
        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
        fontSize: '0.875rem',
        fontWeight: 500,
        justifyContent: 'center',
        letterSpacing: '0.02857em',
        lineHeight: 1.75,
        margin: '8px auto 0',
        minWidth: '64px',
        padding: '6px 16px',
        textTransform: 'uppercase',
        transition:
            'background-color 200ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    },
    '& .map-popup-navigate-button:hover': {
        backgroundColor: '#1565c0',
        boxShadow:
            '0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12)',
    },
    '& .map-popup-navigate-button:disabled': {
        backgroundColor: 'rgba(0, 0, 0, 0.12)',
        boxShadow: 'none',
        color: 'rgba(0, 0, 0, 0.26)',
        cursor: 'default',
    },
}));

const StyledNavigationPanel = styled('div')(() => ({
    position: 'absolute',
    bottom: '1rem',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'min(21.5rem, calc(100% - 2rem))',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: '14px',
    boxShadow: '0 18px 40px rgba(25, 42, 70, 0.22)',
    padding: '1.25rem',
    zIndex: 20,
    overflow: 'hidden',
    '& .navigation-panel-close': {
        position: 'absolute',
        top: '0.4rem',
        right: '0.4rem',
        zIndex: 1,
    },
    '& .navigation-panel-minimize': {
        position: 'absolute',
        top: '0.4rem',
        right: '2.5rem',
        zIndex: 1,
    },
    '& .navigation-panel-scroll': {
        overflow: 'visible',
        padding: 0,
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
    '& .navigation-card': {
        color: '#1f2f4d',
        fontFamily: 'Open Sans, Geneva, Helvetica, Arial, sans-serif',
    },
    '& .navigation-card-title': {
        fontSize: '1.9rem',
        fontWeight: 700,
        lineHeight: 1.1,
        margin: '0 2.5rem 1rem 0',
    },
    '& .navigation-metrics': {
        display: 'grid',
        gap: '0.7rem',
        marginBottom: '1.1rem',
    },
    '& .navigation-metric-row': {
        alignItems: 'baseline',
        display: 'flex',
        justifyContent: 'space-between',
        gap: '0.75rem',
    },
    '& .navigation-metric-label': {
        color: '#24324c',
        fontSize: '1rem',
        fontWeight: 700,
    },
    '& .navigation-metric-value': {
        color: '#24324c',
        fontSize: '0.95rem',
        fontWeight: 400,
        textAlign: 'right',
    },
    '& .navigation-active-step-card': {
        alignItems: 'center',
        display: 'flex',
        gap: '0.85rem',
        backgroundColor: '#dfe8f6',
        borderRadius: '12px',
        marginBottom: '1rem',
        padding: '0.9rem 1rem',
    },
    '& .navigation-active-step-icon': {
        alignItems: 'center',
        color: '#1d2f4b',
        display: 'flex',
        flexShrink: 0,
        justifyContent: 'center',
        transition: 'transform 120ms ease',
    },
    '& .navigation-active-step-copy': {
        minWidth: 0,
    },
    '& .navigation-active-step-title': {
        color: '#1d2f4b',
        fontSize: '1.05rem',
        fontWeight: 700,
        lineHeight: 1.2,
        marginBottom: '0.25rem',
    },
    '& .navigation-active-step-subtitle': {
        color: '#4d6285',
        fontSize: '0.95rem',
        lineHeight: 1.35,
    },
    '& .navigation-live-status': {
        color: '#6b2f2f',
        fontSize: '0.8rem',
        lineHeight: 1.4,
        marginBottom: '0.85rem',
    },
    '& .navigation-manual-status': {
        color: '#6b2f2f',
        fontSize: '0.8rem',
        lineHeight: 1.4,
        marginBottom: '0.85rem',
    },
    '& .navigation-manual-status-minimized': {
        color: '#6b2f2f',
        fontSize: '0.72rem',
        lineHeight: 1.25,
        marginBottom: '0.5rem',
    },
    '& .navigation-orientation-status': {
        color: '#4d6285',
        fontSize: '0.8rem',
        lineHeight: 1.4,
        marginBottom: '0.85rem',
    },
    '& .navigation-orientation-button': {
        backgroundColor: '#edf3fb',
        color: '#1d2f4b',
        marginBottom: '0.85rem',
        width: '100%',
    },
    '& .navigation-minimized-label': {
        color: '#4d6285',
        fontSize: '0.8rem',
        fontWeight: 700,
        letterSpacing: '0.04em',
        marginBottom: '0.65rem',
        textTransform: 'uppercase',
    },
    '& .navigation-expand-button': {
        backgroundColor: '#edf3fb',
        color: '#1d2f4b',
        width: '100%',
    },
    '& .navigation-controls': {
        display: 'grid',
        gap: '0.75rem',
        gridTemplateColumns: '1fr 1fr',
    },
    '& .navigation-control-button': {
        alignItems: 'center',
        appearance: 'none',
        border: 0,
        borderRadius: '8px',
        cursor: 'pointer',
        display: 'inline-flex',
        fontFamily: 'Open Sans, Geneva, Helvetica, Arial, sans-serif',
        fontSize: '1rem',
        fontWeight: 700,
        gap: '0.2rem',
        justifyContent: 'center',
        minHeight: '2.7rem',
        padding: '0.75rem 1rem',
        transition: 'background-color 120ms ease, color 120ms ease, opacity 120ms ease',
    },
    '& .navigation-control-button-prev': {
        backgroundColor: '#2f72ea',
        color: '#ffffff',
    },
    '& .navigation-control-button-next': {
        backgroundColor: '#2e7d32',
        color: '#ffffff',
    },
    '& .navigation-control-button:disabled': {
        backgroundColor: '#d7dce6',
        color: '#7e8aa0',
        cursor: 'default',
        opacity: 0.65,
    },
    '@media (max-width: 600px)': {
        left: '1rem',
        transform: 'none',
        width: 'auto',
    },
}));

const BookableSpacesMap = React.forwardRef(
    (
        {
            sortedSpaceLocations,
            spacesFavouritesList,
            onMarkerClick,
            onNavigate,
            activeNavigationSpaceId,
            centreLatLong,
            navigationTarget,
            navigationOrigin,
            onNavigationClose,
        },
        ref,
    ) => {
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
        const [isNavigationPanelMinimized, setIsNavigationPanelMinimized] = React.useState(false);
        const [isManualStepSelectionActive, setIsManualStepSelectionActive] = React.useState(false);
        const [isAutomaticResumeStatusVisible, setIsAutomaticResumeStatusVisible] = React.useState(false);
        const [liveNavigationState, setLiveNavigationState] = React.useState({
            status: 'idle',
            position: null,
            accuracy: null,
            error: '',
        });
        const [orientationState, setOrientationState] = React.useState({
            enabled: false,
            supported: supportsDeviceOrientation(),
            permission: 'idle',
            error: '',
        });
        const [rerouteRequest, setRerouteRequest] = React.useState({
            active: false,
            origin: null,
            reason: '',
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
        const orientationHeadingRef = useRef(null);
        const automaticResumeStatusTimeoutRef = useRef(null);
        const pendingInitialLiveRouteRef = useRef(false);
        const rerouteAttemptRef = useRef({
            lastAt: 0,
            lastOrigin: null,
        });

        const ZOOM_CAMPUS_MANY_BUILDINGS = 20;
        const ZOOM_CAMPUS_ONE_BUILDING = 17;
        const CAMPUS_INDEX_ST_LUCIA = 1;

        React.useEffect(() => {
            console.log('BookableSpacesMap centreLatLong changed=', centreLatLong);
        }, [centreLatLong]);

        useLiveNavigationGeolocation({
            isMazeMapReady,
            mazeMapInstanceRef,
            navigationTarget,
            pendingInitialLiveRouteRef,
            geolocationWatchIdRef,
            userLocationMarkerRef,
            setLiveNavigationState,
        });

        useInitialLiveReroute({
            liveNavigationState,
            navigationOrigin,
            navigationTarget,
            mazeMapInstanceRef,
            pendingInitialLiveRouteRef,
            rerouteRequest,
            setRerouteRequest,
        });

        useUserLocationMarker({
            isMazeMapReady,
            mazeMapInstanceRef,
            liveNavigationState,
            orientationHeadingRef,
            orientationState,
            userLocationMarkerRef,
        });

        useFollowUserOnMap({
            isMazeMapReady,
            mazeMapInstanceRef,
            navigationTarget,
            liveNavigationState,
            isManualStepSelectionActive,
        });

        useOrientationTracking({
            isMazeMapReady,
            mazeMapInstanceRef,
            orientationState,
            orientationHeadingRef,
            userLocationMarkerRef,
        });

        const zoomLevelForCampus = _campusId => {
            return _campusId === CAMPUS_INDEX_ST_LUCIA ? ZOOM_CAMPUS_ONE_BUILDING : ZOOM_CAMPUS_MANY_BUILDINGS;
        };

        const setSelectedMarker = (markerEl, space, options = {}) => {
            const { suppressPopup = false } = options;

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

            if (
                !suppressPopup &&
                markerEl &&
                space?.space_longitude &&
                space?.space_latitude &&
                mazeMapInstanceRef.current
            ) {
                const container = document.createElement('div');
                container.style.cssText = 'padding: 2px 4px; font-size: 0.85rem; line-height: 1.4;';

                const nameEl = document.createElement('strong');
                nameEl.className = 'map-popup-title';
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

                if (onNavigate) {
                    container.appendChild(document.createElement('br'));
                    const navigateButton = document.createElement('button');
                    navigateButton.type = 'button';
                    navigateButton.className = 'map-popup-navigate-button';
                    navigateButton.textContent =
                        activeNavigationSpaceId === space?.space_id ? 'Navigation active' : 'Navigate to';
                    navigateButton.disabled = activeNavigationSpaceId === space?.space_id;
                    navigateButton.setAttribute('data-testid', `space-navigate-${space?.space_id}`);
                    navigateButton.addEventListener('click', clickEvent => {
                        clickEvent.preventDefault();
                        clickEvent.stopPropagation();
                        onNavigate(space);
                        activePopupRef.current?.remove();
                        activePopupRef.current = null;
                    });
                    container.appendChild(navigateButton);
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
            flyToSpace(location, options = {}) {
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
                    if (entry?.markerEl) setSelectedMarker(entry.markerEl, location, options);
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
                setNavigationState(current => {
                    if (
                        current.status === 'idle' &&
                        current.steps.length === 0 &&
                        current.currentStepIndex === 0 &&
                        current.totalDistanceMeters === null &&
                        current.totalDurationMinutes === null &&
                        current.title === '' &&
                        current.error === ''
                    ) {
                        return current;
                    }

                    return {
                        status: 'idle',
                        steps: [],
                        currentStepIndex: 0,
                        totalDistanceMeters: null,
                        totalDurationMinutes: null,
                        title: '',
                        error: '',
                    };
                });
                setRerouteRequest(current => {
                    if (!current.active && !current.origin && current.reason === '') {
                        return current;
                    }

                    return {
                        active: false,
                        origin: null,
                        reason: '',
                    };
                });
                return;
            }

            const activeOrigin = rerouteRequest.origin || getLngLatZLevel(navigationOrigin);
            const destination = getLngLatZLevel(navigationTarget);

            if (!activeOrigin || !destination) {
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
                    return threeArgRouteGetter(activeOrigin, destination, options);
                }

                const singleArgRouteGetter = window.Mazemap?.Data?.getAtoBTrip;
                if (typeof singleArgRouteGetter === 'function') {
                    return singleArgRouteGetter(buildLegacyRoutingParams(activeOrigin, destination, options));
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
                    const steps = turnByTurnSteps.map((step, index) => {
                        const stepJson = step?.asJson?.() || {};
                        const maneuverTypeRaw = step?.maneuver?.type || stepJson?.maneuver?.type;
                        const maneuverModifierRaw = step?.maneuver?.modifier || stepJson?.maneuver?.modifier;
                        const stepDistanceMeters =
                            step?.getDistanceMeters?.() ?? stepJson?.distance ?? step?.distance ?? null;
                        const instruction =
                            stepJson?.instruction ||
                            buildStepInstruction({
                                maneuverType: maneuverTypeRaw,
                                maneuverModifier: maneuverModifierRaw,
                                distanceMeters: stepDistanceMeters,
                                destinationName: navigationTarget?.space_name,
                            }) ||
                            maneuverTypeRaw?.replaceAll('_', ' ') ||
                            `Step ${index + 1}`;
                        const maneuverType = getNormalizedStepTurnType({
                            maneuverType: maneuverTypeRaw,
                            maneuverModifier: maneuverModifierRaw,
                            instruction,
                        });

                        return {
                            step,
                            instruction,
                            maneuverType,
                        };
                    });

                    setNavigationState({
                        status: 'ready',
                        steps,
                        currentStepIndex: 0,
                        totalDistanceMeters: trip.getTotalDistanceMeters?.() ?? null,
                        totalDurationMinutes: trip.getTotalDurationMinutes?.() ?? null,
                        title: navigationTarget?.space_name || '',
                        error: '',
                    });
                    setIsManualStepSelectionActive(false);

                    if (rerouteRequest.active) {
                        setRerouteRequest({
                            active: false,
                            origin: rerouteRequest.origin,
                            reason: '',
                        });
                    }

                    const firstStep = steps[0]?.step;
                    if (firstStep) {
                        mazeMapInstanceRef.current.setZLevel(firstStep.zLevel ?? destination.zLevel);
                        mazeMapInstanceRef.current.flyTo({
                            center: firstStep.getStepStartPointLngLat(),
                            zoom: 19,
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

                    if (rerouteRequest.active) {
                        setRerouteRequest(current => ({
                            ...current,
                            active: false,
                        }));
                    }
                });
        }, [isMazeMapReady, navigationOrigin, navigationTarget, rerouteRequest.active, rerouteRequest.origin]);

        React.useEffect(() => {
            if (
                navigationState.status !== 'ready' ||
                !liveNavigationState.position ||
                !navigationState.steps.length ||
                isManualStepSelectionActive
            ) {
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
            isManualStepSelectionActive,
            liveNavigationState.position,
            navigationState.currentStepIndex,
            navigationState.status,
            navigationState.steps,
        ]);

        React.useEffect(() => {
            if (
                navigationState.status !== 'ready' ||
                !liveNavigationState.position ||
                !navigationTarget ||
                navigationState.currentStepIndex < 1 ||
                isManualStepSelectionActive ||
                rerouteRequest.active
            ) {
                return;
            }

            const distanceFromRouteMeters = getDistanceToRouteMeters(
                liveNavigationState.position,
                navigationState.steps,
            );

            if (
                !Number.isFinite(distanceFromRouteMeters) ||
                distanceFromRouteMeters <= OFF_ROUTE_REROUTE_DISTANCE_METERS
            ) {
                return;
            }

            const now = Date.now();
            const lastAttemptAt = rerouteAttemptRef.current.lastAt || 0;
            const lastAttemptOrigin = rerouteAttemptRef.current.lastOrigin;
            const recentlyRetried = now - lastAttemptAt < 8000;
            const sameOriginRetry =
                lastAttemptOrigin && haversineDistanceMeters(lastAttemptOrigin, liveNavigationState.position) < 3;

            if (recentlyRetried && sameOriginRetry) {
                return;
            }

            const fallbackZLevel =
                navigationState.steps[navigationState.currentStepIndex]?.step?.zLevel ??
                mazeMapInstanceRef.current?.getZLevel?.() ??
                navigationTarget?.space_zlevel ??
                navigationOrigin?.space_zlevel;
            const nextOrigin = getLiveRoutingOrigin(liveNavigationState.position, fallbackZLevel);

            if (!nextOrigin) {
                return;
            }

            rerouteAttemptRef.current = {
                lastAt: now,
                lastOrigin: liveNavigationState.position,
            };

            setRerouteRequest({
                active: true,
                origin: nextOrigin,
                reason: 'You moved away from the route. Recalculating from your location.',
            });
        }, [
            isManualStepSelectionActive,
            liveNavigationState.position,
            navigationOrigin?.space_zlevel,
            navigationState.currentStepIndex,
            navigationState.status,
            navigationState.steps,
            navigationTarget,
            rerouteRequest.active,
        ]);

        React.useEffect(() => {
            if (!isManualStepSelectionActive || navigationState.status !== 'ready' || !liveNavigationState.position) {
                return;
            }

            const activeRouteOrigin = rerouteRequest.origin || getLngLatZLevel(navigationOrigin);
            const currentStepPoint =
                navigationState.currentStepIndex === 0
                    ? normalizeLngLat(activeRouteOrigin?.lngLat)
                    : normalizeLngLat(
                          navigationState.steps[navigationState.currentStepIndex]?.step?.getStepStartPointLngLat?.(),
                      );
            const distanceToSelectedStep = getDistanceToNavigationStepMeters(
                liveNavigationState.position,
                navigationState.steps[navigationState.currentStepIndex],
                currentStepPoint,
            );

            const distanceToRouteOrigin =
                navigationState.currentStepIndex === 0
                    ? haversineDistanceMeters(liveNavigationState.position, currentStepPoint)
                    : Number.POSITIVE_INFINITY;

            if (Math.min(distanceToSelectedStep, distanceToRouteOrigin) <= 20) {
                setIsManualStepSelectionActive(false);
                setIsAutomaticResumeStatusVisible(true);
            }
        }, [
            isManualStepSelectionActive,
            liveNavigationState.position,
            navigationOrigin,
            navigationState.currentStepIndex,
            navigationState.status,
            navigationState.steps,
            rerouteRequest.origin,
        ]);

        React.useEffect(() => {
            if (!isAutomaticResumeStatusVisible) {
                return undefined;
            }

            if (automaticResumeStatusTimeoutRef.current) {
                window.clearTimeout(automaticResumeStatusTimeoutRef.current);
            }

            automaticResumeStatusTimeoutRef.current = window.setTimeout(() => {
                setIsAutomaticResumeStatusVisible(false);
                automaticResumeStatusTimeoutRef.current = null;
            }, 1800);

            return () => {
                if (automaticResumeStatusTimeoutRef.current) {
                    window.clearTimeout(automaticResumeStatusTimeoutRef.current);
                    automaticResumeStatusTimeoutRef.current = null;
                }
            };
        }, [isAutomaticResumeStatusVisible]);

        React.useEffect(() => {
            return () => {
                userLocationMarkerRef.current?.remove();
                userLocationMarkerRef.current = null;
                if (automaticResumeStatusTimeoutRef.current) {
                    window.clearTimeout(automaticResumeStatusTimeoutRef.current);
                    automaticResumeStatusTimeoutRef.current = null;
                }
            };
        }, []);

        const currentNavigationStep = navigationState.steps[navigationState.currentStepIndex];
        const nextNavigationStep = navigationState.steps[navigationState.currentStepIndex + 1];
        const currentStepDistance = formatDistance(currentNavigationStep?.step?.getDistanceMeters?.());
        const remainingDistanceMeters =
            getRemainingDistanceMeters(navigationState.steps, navigationState.currentStepIndex) ||
            navigationState.totalDistanceMeters;
        const hasRouteTotals =
            Number.isFinite(navigationState.totalDurationMinutes) &&
            Number.isFinite(navigationState.totalDistanceMeters) &&
            navigationState.totalDistanceMeters > 0 &&
            Number.isFinite(remainingDistanceMeters);
        const remainingDurationMinutes = hasRouteTotals
            ? (navigationState.totalDurationMinutes * remainingDistanceMeters) / navigationState.totalDistanceMeters
            : navigationState.totalDurationMinutes;
        const navigationCardTitle = currentNavigationStep?.maneuverType === 'arrive' ? 'Arrived' : 'On Route';
        const stepTitle = currentNavigationStep?.instruction || 'Continue';
        const displayedTurnType = getDisplayedTurnType(currentNavigationStep, nextNavigationStep);
        const stepTurnRotation = getStepTurnRotation(displayedTurnType);
        let stepSubtitle = `Continue to ${navigationState.title}`;
        let minimizedStepSubtitle = 'Continue on your route';

        if (nextNavigationStep?.instruction) {
            stepSubtitle = `Then ${lowercaseFirstCharacter(nextNavigationStep.instruction)}`;
        } else if (currentStepDistance) {
            stepSubtitle = `Continue for ${currentStepDistance}`;
        }

        if (currentStepDistance) {
            minimizedStepSubtitle = `In ${currentStepDistance}`;
        }

        const liveTrackingError =
            rerouteRequest.reason || (liveNavigationState.status !== 'watching' ? liveNavigationState.error : '');
        const manualStepStatusMessage = isManualStepSelectionActive
            ? 'Manual step browsing is active until you reach the selected step.'
            : '';
        const automaticResumeStatusMessage = isAutomaticResumeStatusVisible ? 'Returning to automatic tracking.' : '';
        const orientationStatusMessage = orientationState.enabled
            ? 'Compass rotation is on. The map follows your phone orientation.'
            : orientationState.error;

        const toggleCompassRotation = React.useCallback(async () => {
            if (orientationState.enabled) {
                setOrientationState(current => ({
                    ...current,
                    enabled: false,
                    error: '',
                }));
                return;
            }

            if (!supportsDeviceOrientation()) {
                setOrientationState(current => ({
                    ...current,
                    supported: false,
                    error: 'Compass rotation is not supported on this device.',
                }));
                return;
            }

            try {
                const requestPermission = window.DeviceOrientationEvent?.requestPermission;

                if (typeof requestPermission === 'function') {
                    const permissionResult = await requestPermission();

                    if (permissionResult !== 'granted') {
                        setOrientationState(current => ({
                            ...current,
                            supported: true,
                            enabled: false,
                            permission: permissionResult,
                            error: 'Compass permission was denied.',
                        }));
                        return;
                    }

                    setOrientationState(current => ({
                        ...current,
                        supported: true,
                        enabled: true,
                        permission: permissionResult,
                        error: '',
                    }));
                    return;
                }

                setOrientationState(current => ({
                    ...current,
                    supported: true,
                    enabled: true,
                    permission: 'granted',
                    error: '',
                }));
            } catch (error) {
                setOrientationState(current => ({
                    ...current,
                    supported: true,
                    enabled: false,
                    error: error?.message || 'Compass rotation could not be enabled.',
                }));
            }
        }, [orientationState.enabled]);

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
                setIsManualStepSelectionActive(true);
                setIsAutomaticResumeStatusVisible(false);

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

        React.useEffect(() => {
            setIsNavigationPanelMinimized(false);
            setIsManualStepSelectionActive(false);
            setIsAutomaticResumeStatusVisible(false);

            if (navigationTarget?.space_id) {
                activePopupRef.current?.remove();
                activePopupRef.current = null;
            }
        }, [navigationTarget?.space_id]);

        return (
            <StyledMapWrapperDiv id="mazemap-container" ref={setMapContainer}>
                {navigationState.status !== 'idle' && (
                    <StyledNavigationPanel data-testid="space-navigation-panel">
                        {navigationState.status === 'ready' && (
                            <IconButton
                                className="navigation-panel-minimize"
                                size="small"
                                onClick={() => setIsNavigationPanelMinimized(current => !current)}
                                aria-label={
                                    isNavigationPanelMinimized ? 'Expand navigation panel' : 'Minimize navigation panel'
                                }
                            >
                                {isNavigationPanelMinimized ? (
                                    <OpenInFullIcon fontSize="small" />
                                ) : (
                                    <MinimizeIcon fontSize="small" />
                                )}
                            </IconButton>
                        )}

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
                                <div className="navigation-card">
                                    {isNavigationPanelMinimized ? (
                                        <>
                                            <div className="navigation-minimized-label">Current step</div>
                                            <div className="navigation-active-step-card">
                                                <div
                                                    className="navigation-active-step-icon"
                                                    aria-hidden="true"
                                                    style={{ transform: `rotate(${stepTurnRotation})` }}
                                                >
                                                    <ArrowUpwardIcon fontSize="large" />
                                                </div>
                                                <div className="navigation-active-step-copy">
                                                    <div className="navigation-active-step-title">{stepTitle}</div>
                                                    <div className="navigation-active-step-subtitle">
                                                        {minimizedStepSubtitle}
                                                    </div>
                                                </div>
                                            </div>

                                            {manualStepStatusMessage && (
                                                <div className="navigation-manual-status-minimized">
                                                    {manualStepStatusMessage}
                                                </div>
                                            )}

                                            {automaticResumeStatusMessage && (
                                                <div className="navigation-orientation-status">
                                                    {automaticResumeStatusMessage}
                                                </div>
                                            )}

                                            <button
                                                type="button"
                                                className="navigation-control-button navigation-expand-button"
                                                onClick={() => setIsNavigationPanelMinimized(false)}
                                            >
                                                Show full navigation
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="navigation-card-title">{navigationCardTitle}</div>

                                            <div className="navigation-metrics">
                                                <div className="navigation-metric-row">
                                                    <span className="navigation-metric-label">Distance Remaining:</span>
                                                    <span className="navigation-metric-value">
                                                        {formatDistance(remainingDistanceMeters) || 'Unavailable'}
                                                    </span>
                                                </div>
                                                <div className="navigation-metric-row">
                                                    <span className="navigation-metric-label">Time Remaining:</span>
                                                    <span className="navigation-metric-value">
                                                        {formatDurationDetailed(remainingDurationMinutes) ||
                                                            'Unavailable'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="navigation-active-step-card">
                                                <div
                                                    className="navigation-active-step-icon"
                                                    aria-hidden="true"
                                                    style={{ transform: `rotate(${stepTurnRotation})` }}
                                                >
                                                    <ArrowUpwardIcon fontSize="large" />
                                                </div>
                                                <div className="navigation-active-step-copy">
                                                    <div className="navigation-active-step-title">{stepTitle}</div>
                                                    <div className="navigation-active-step-subtitle">
                                                        {stepSubtitle}
                                                    </div>
                                                </div>
                                            </div>

                                            {liveTrackingError && (
                                                <div className="navigation-live-status">{liveTrackingError}</div>
                                            )}

                                            {manualStepStatusMessage && (
                                                <div className="navigation-manual-status">
                                                    {manualStepStatusMessage}
                                                </div>
                                            )}

                                            {automaticResumeStatusMessage && (
                                                <div className="navigation-orientation-status">
                                                    {automaticResumeStatusMessage}
                                                </div>
                                            )}

                                            <button
                                                type="button"
                                                className="navigation-control-button navigation-orientation-button"
                                                onClick={toggleCompassRotation}
                                                disabled={!orientationState.supported}
                                            >
                                                {orientationState.enabled
                                                    ? 'Disable Compass Rotation'
                                                    : 'Follow Phone Heading'}
                                            </button>

                                            {orientationStatusMessage && (
                                                <div className="navigation-orientation-status">
                                                    {orientationStatusMessage}
                                                </div>
                                            )}

                                            <div className="navigation-controls">
                                                <button
                                                    type="button"
                                                    className="navigation-control-button navigation-control-button-prev"
                                                    onClick={() =>
                                                        showNavigationStep(navigationState.currentStepIndex - 1)
                                                    }
                                                    disabled={navigationState.currentStepIndex === 0}
                                                >
                                                    <ChevronLeftIcon fontSize="small" />
                                                    Prev
                                                </button>
                                                <button
                                                    type="button"
                                                    className="navigation-control-button navigation-control-button-next"
                                                    onClick={() =>
                                                        showNavigationStep(navigationState.currentStepIndex + 1)
                                                    }
                                                    disabled={
                                                        navigationState.currentStepIndex >=
                                                        navigationState.steps.length - 1
                                                    }
                                                >
                                                    Next
                                                    <ChevronRightIcon fontSize="small" />
                                                </button>
                                            </div>
                                        </>
                                    )}
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
    onNavigate: PropTypes.func,
    activeNavigationSpaceId: PropTypes.number,
    centreLatLong: PropTypes.any,
    navigationTarget: PropTypes.any,
    navigationOrigin: PropTypes.any,
    onNavigationClose: PropTypes.func,
};

export default BookableSpacesMap;
