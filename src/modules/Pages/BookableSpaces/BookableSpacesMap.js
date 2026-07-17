import React, { useImperativeHandle, useRef } from 'react';
import PropTypes from 'prop-types';
import { createRoot } from 'react-dom/client';

import { styled, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

import { mui1theme } from 'config/theme';
import { CAMPUS_ST_LUCIA } from 'config/locale';
import { addClass, removeClass } from 'helpers/general';

import { BookingLink } from 'modules/Pages/BookableSpaces/BookingLink';
import { getVisibleSpaceOutage } from 'modules/Pages/Admin/BookableSpaces/Spaces/Form/spaceOutageHelpers';
import ShowOutageNotice from 'modules/Pages/BookableSpaces/ShowOutageNotice';

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

const StyledResetMapButton = styled('button')(() => ({
    position: 'absolute',
    left: '50%',
    bottom: '14px',
    transform: 'translateX(-50%)',
    zIndex: 20,
    border: '1px solid #d8d8d8',
    borderRadius: '999px',
    background: '#ffffff',
    color: '#1f1f1f',
    fontSize: '12px',
    fontWeight: 600,
    lineHeight: 1,
    padding: '8px 12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.18)',
    cursor: 'pointer',
}));

const StyledPopupContent = styled('div')(() => ({
    padding: '2px 4px',
    fontSize: '0.85rem',
    lineHeight: 1.4,
}));

const StyledPopupOutageNotice = styled('div')(() => ({
    marginTop: '0.5rem',
    '& p': {
        marginTop: '0.5rem',
        marginBottom: 0,
    },
}));

const StyledFavouriteNote = styled('em')(() => ({
    display: 'block',
    marginTop: '0.5rem',
    fontSize: '0.8rem',
    color: '#666',
}));

const StyledPopupBookingDiv = styled('div')(() => ({
    paddingTop: '0.4rem',
}));

export const BookableSpacesMapPopupContent = ({ space, isFavourite = false }) => {
    const visibleOutage = getVisibleSpaceOutage(space?.space_outages);
    const spaceTypeName = space?.space_type_details?.space_type_name ?? space?.space_type;

    return (
        <StyledPopupContent data-testid={`space-${space?.space_id}-map-popup`}>
            <strong>{space?.space_name ?? ''}</strong>

            {!!spaceTypeName && (
                <>
                    <br />
                    <strong>{spaceTypeName}</strong>
                </>
            )}

            {!!space?.space_library_name && (
                <>
                    <br />
                    <span>{space.space_library_name}</span>
                </>
            )}

            <StyledPopupBookingDiv>
                <BookingLink bookableSpace={space} hideNoBookingRequired />
            </StyledPopupBookingDiv>

            {!!visibleOutage && (
                <ShowOutageNotice
                    bookableSpace={space}
                    visibleOutage={visibleOutage}
                    hideReason={!visibleOutage.reason}
                />
            )}

            {isFavourite && (
                <StyledFavouriteNote data-testid={`space-${space?.space_id}-favourite-message`}>
                    One of your favourite spaces
                </StyledFavouriteNote>
            )}
        </StyledPopupContent>
    );
};

BookableSpacesMapPopupContent.propTypes = {
    space: PropTypes.object,
    isFavourite: PropTypes.bool,
};

const BookableSpacesMap = React.forwardRef(
    ({ sortedSpaceLocations, spacesFavouritesList, onMarkerClick, centreLatLong, onMapReady }, ref) => {
        const [isMazeMapScriptReady, setIsMazeMapScriptReady] = React.useState(false);
        const [isMazeMapReady, setIsMazeMapReady] = React.useState(false);
        const [isMazeMapAvailable, setIsMazeMapAvailable] = React.useState(true);
        const [mapContainer, setMapContainer] = React.useState(null);
        const mazeMapInstanceRef = useRef(null);
        const mazeMarkersRef = useRef(new Map());
        const selectedMarkerElRef = useRef(null);
        const activePopupRef = useRef(null);
        const activePopupRootRef = useRef(null);
        const initialViewRef = useRef(null);
        const [showResetButton, setShowResetButton] = React.useState(false);

        const ZOOM_CAMPUS_MANY_BUILDINGS = 17;
        const ZOOM_CAMPUS_ONE_BUILDING = 20;
        const zoomLevelForCampus = _campusName => {
            return _campusName === CAMPUS_ST_LUCIA ? ZOOM_CAMPUS_MANY_BUILDINGS : ZOOM_CAMPUS_ONE_BUILDING;
        };

        const clearActivePopup = () => {
            activePopupRootRef.current?.unmount?.();
            activePopupRootRef.current = null;
            activePopupRef.current?.remove();
            activePopupRef.current = null;
        };

        const isNearInitialCenter = map => {
            const initialView = initialViewRef.current;
            if (!map || !initialView) return true;

            const center = map.getCenter?.();
            if (!center) return true;

            const lngDiff = Math.abs(center.lng - initialView.lng);
            const latDiff = Math.abs(center.lat - initialView.lat);
            return lngDiff < 0.0002 && latDiff < 0.0002;
        };

        const updateResetButtonVisibility = map => {
            setShowResetButton(!isNearInitialCenter(map));
        };

        const resetMapPosition = () => {
            const map = mazeMapInstanceRef.current;
            const initialView = initialViewRef.current;
            if (!map || !initialView) return;

            map.flyTo({
                center: [initialView.lng, initialView.lat],
                zoom: initialView.zoom,
                curve: 0.5,
                speed: 1.6,
            });
            if (Number.isFinite(initialView.zLevel)) {
                map.setZLevel(initialView.zLevel);
            }
            setShowResetButton(false);
        };

        const disableMazeMap = React.useCallback(() => {
            clearActivePopup();
            mazeMapInstanceRef.current?.remove?.();
            mazeMapInstanceRef.current = null;
            initialViewRef.current = null;
            setShowResetButton(false);
            setIsMazeMapReady(false);
            setIsMazeMapAvailable(false);
        }, []);

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

            clearActivePopup();

            if (markerEl && space?.space_longitude && space?.space_latitude && mazeMapInstanceRef.current) {
                const container = document.createElement('div');
                const isFavourite = markerEl.classList.contains('star-marker-el');
                const popupRoot = createRoot(container);
                popupRoot.render(
                    <MuiThemeProvider theme={mui1theme}>
                        <BookableSpacesMapPopupContent space={space} isFavourite={isFavourite} />
                    </MuiThemeProvider>,
                );
                activePopupRootRef.current = popupRoot;

                activePopupRef.current = new window.Mazemap.Popup({
                    closeButton: true,
                    closeOnClick: true,
                    offset: [0, -40],
                    maxWidth: '240px',
                })
                    .setLngLat([space.space_longitude, space.space_latitude])
                    .setDOMContent(container)
                    .addTo(mazeMapInstanceRef.current);
                activePopupRef.current.on('close', () => {
                    activePopupRootRef.current?.unmount?.();
                    activePopupRootRef.current = null;
                    activePopupRef.current = null;
                });
            }
        };

        useImperativeHandle(ref, () => ({
            flyToSpace(location, zoomOverride = null) {
                const map = mazeMapInstanceRef.current;
                if (!map || !location?.space_longitude || !location?.space_latitude || !location?.space_campus_id) {
                    return;
                }

                const doFly = () => {
                    map.flyTo({
                        center: [location.space_longitude, location.space_latitude],
                        zoom: zoomOverride ?? zoomLevelForCampus(location.space_campus_name),
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
            script.onerror = () => setIsMazeMapAvailable(false);
            document.body.appendChild(script);

            const handleWindowError = event => {
                const errorSource = `${event?.filename || ''} ${event?.message || ''} ${event?.error?.stack || ''}`;
                if (errorSource.toLowerCase().includes('mazemap')) {
                    event.preventDefault?.();
                    disableMazeMap();
                }
            };
            window.addEventListener('error', handleWindowError);

            return () => {
                clearActivePopup();
                document.head.removeChild(link);
                document.body.removeChild(script);
                window.removeEventListener('error', handleWindowError);
            };
        }, [disableMazeMap]);

        React.useEffect(() => {
            if (!isMazeMapScriptReady || !mapContainer || !isMazeMapAvailable) {
                onMapReady?.(false);
                return;
            }

            try {
                mazeMapInstanceRef.current = new window.Mazemap.Map({
                    container: 'mazemap-container',
                    campuses: 'uq',
                    center: { lat: centreLatLong.space_latitude, lng: centreLatLong.space_longitude },
                    zoom: zoomLevelForCampus(centreLatLong.space_campus_name),
                    zLevel: centreLatLong?.space_zlevel ?? 1,
                    RTLTextPlugin: null,
                });
            } catch (error) {
                disableMazeMap();
                return;
            }

            mazeMapInstanceRef.current.on('load', () => {
                onMapReady?.(true);
                initialViewRef.current = {
                    lng: Number(centreLatLong.space_longitude),
                    lat: Number(centreLatLong.space_latitude),
                    zoom: zoomLevelForCampus(centreLatLong.space_campus_name),
                    zLevel: Number(centreLatLong?.space_zlevel ?? 1),
                };
                updateResetButtonVisibility(mazeMapInstanceRef.current);
                mazeMapInstanceRef.current.resize();
                setIsMazeMapReady(true);
            });

            mazeMapInstanceRef.current.on('moveend', () => {
                updateResetButtonVisibility(mazeMapInstanceRef.current);
            });

            mazeMapInstanceRef.current.on('error', () => {
                onMapReady?.(false);
                disableMazeMap();
            });

            return () => {
                clearActivePopup();
                mazeMapInstanceRef.current?.remove();
                mazeMapInstanceRef.current = null;
                initialViewRef.current = null;
                setShowResetButton(false);
                setIsMazeMapReady(false);
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [isMazeMapScriptReady, mapContainer, isMazeMapAvailable, disableMazeMap]);

        React.useEffect(() => {
            if (!isMazeMapReady || !mazeMapInstanceRef.current) return;

            mazeMarkersRef.current.forEach(({ marker }) => marker.remove());
            mazeMarkersRef.current = new Map();
            selectedMarkerElRef.current = null;
            clearActivePopup();

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

        if (!isMazeMapAvailable) {
            return <StyledMapWrapperDiv id="mazemap-container" data-testid="mazemap-unavailable" />;
        }

        return (
            <StyledMapWrapperDiv id="mazemap-container" ref={setMapContainer}>
                {showResetButton && (
                    <StyledResetMapButton
                        type="button"
                        onClick={resetMapPosition}
                        data-testid="reset-map-position-button"
                    >
                        Reset map
                    </StyledResetMapButton>
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
    centreLatLong: PropTypes.object,
    onMapReady: PropTypes.func,
};

export default BookableSpacesMap;
