import React, { useImperativeHandle, useRef } from 'react';
import PropTypes from 'prop-types';
import { createRoot } from 'react-dom/client';

import Typography from '@mui/material/Typography';
import { styled, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

import { addClass, removeClass } from 'helpers/general';
import { CAMPUS_ST_LUCIA } from 'config/locale';
import { mui1theme } from 'config/theme';
import {
    formatSpaceOutageRangeForPublicNotice,
    formatSpaceOutageUntilForPublicNotice,
    getSpaceOutageShowTimePublic,
    getVisibleSpaceOutage,
} from 'modules/Pages/Admin/BookableSpaces/Spaces/Form/spaceOutageHelpers';
import UserAttention from 'modules/SharedComponents/Toolbox/UserAttention';

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

const StyledPopupBookingLink = styled('a')(() => ({
    display: 'inline-block',
    marginTop: '0.5rem',
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

            {!!space?.space_external_book_url && (
                <div>
                    <StyledPopupBookingLink
                        href={space.space_external_book_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-testid={`space-${space?.space_id}-map-popup-booking-link`}
                    >
                        Book this space
                    </StyledPopupBookingLink>
                </div>
            )}

            {!!visibleOutage && (
                <StyledPopupOutageNotice data-testid={`space-${space?.space_id}-map-popup-outage-notice`}>
                    <UserAttention
                        titleText={visibleOutage.status === 'Current' ? 'Current closure' : 'Upcoming closure'}
                        tone={visibleOutage.tone}
                        variant="aligned"
                    >
                        <Typography variant="body2" data-testid={`space-${space?.space_id}-map-popup-outage-message`}>
                            {visibleOutage.status === 'Current'
                                ? `Currently unavailable until ${formatSpaceOutageUntilForPublicNotice(
                                      visibleOutage.outage?.space_outage_end,
                                      undefined,
                                      getSpaceOutageShowTimePublic(visibleOutage.outage),
                                  )}.`
                                  : `Closed ${formatSpaceOutageRangeForPublicNotice(
                                      visibleOutage.outage?.space_outage_start,
                                      visibleOutage.outage?.space_outage_end,
                                      getSpaceOutageShowTimePublic(visibleOutage.outage),
                                  )}.`}
                        </Typography>
                        {!!visibleOutage.reason && (
                            <Typography variant="body2" data-testid={`space-${space?.space_id}-map-popup-outage-reason`}>
                                Reason: {visibleOutage.reason}
                            </Typography>
                        )}
                    </UserAttention>
                </StyledPopupOutageNotice>
            )}

            {isFavourite && <StyledFavouriteNote>One of your favourite spaces</StyledFavouriteNote>}
        </StyledPopupContent>
    );
};

BookableSpacesMapPopupContent.propTypes = {
    space: PropTypes.object,
    isFavourite: PropTypes.bool,
};

const BookableSpacesMap = React.forwardRef(
    ({ sortedSpaceLocations, spacesFavouritesList, onMarkerClick, centreLatLong }, ref) => {
        const [isMazeMapScriptReady, setIsMazeMapScriptReady] = React.useState(false);
        const [isMazeMapReady, setIsMazeMapReady] = React.useState(false);
        const [isMazeMapAvailable, setIsMazeMapAvailable] = React.useState(true);
        const [mapContainer, setMapContainer] = React.useState(null);
        const mazeMapInstanceRef = useRef(null);
        const mazeMarkersRef = useRef(new Map());
        const selectedMarkerElRef = useRef(null);
        const activePopupRef = useRef(null);
        const activePopupRootRef = useRef(null);

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

        const disableMazeMap = React.useCallback(() => {
            clearActivePopup();
            mazeMapInstanceRef.current?.remove?.();
            mazeMapInstanceRef.current = null;
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
                return;
            }

            const selectedCampusId = Number(centreLatLong?.space_campus_id);
            const mapCampuses = Number.isFinite(selectedCampusId) && selectedCampusId > 0 ? [selectedCampusId] : 'all';

            try {
                mazeMapInstanceRef.current = new window.Mazemap.Map({
                    container: 'mazemap-container',
                    campuses: mapCampuses,
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
                mazeMapInstanceRef.current.resize();
                setIsMazeMapReady(true);
            });

            mazeMapInstanceRef.current.on('error', () => {
                disableMazeMap();
            });

            // eslint-disable-next-line consistent-return
            return () => {
                clearActivePopup();
                mazeMapInstanceRef.current?.remove();
                mazeMapInstanceRef.current = null;
                setIsMazeMapReady(false);
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [isMazeMapScriptReady, mapContainer, isMazeMapAvailable, disableMazeMap]);

        // eslint-disable-next-line consistent-return
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

        return <StyledMapWrapperDiv id="mazemap-container" ref={setMapContainer} />;
    },
);

BookableSpacesMap.displayName = 'BookableSpacesMap';

BookableSpacesMap.propTypes = {
    sortedSpaceLocations: PropTypes.any,
    spacesFavouritesList: PropTypes.any,
    onMarkerClick: PropTypes.func.isRequired,
    centreLatLong: PropTypes.object,
};

export default BookableSpacesMap;
