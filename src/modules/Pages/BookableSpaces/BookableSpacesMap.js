import React, { useImperativeHandle, useRef } from 'react';
import PropTypes from 'prop-types';

import { styled } from '@mui/material/styles';

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

const BookableSpacesMap = React.forwardRef(
    ({ sortedSpaceLocations, spacesFavouritesList, onMarkerClick, centreLatLong }, ref) => {
        console.log('BookableSpacesMap load centreLatLong=', centreLatLong);

        const [isMazeMapScriptReady, setIsMazeMapScriptReady] = React.useState(false);
        const [isMazeMapReady, setIsMazeMapReady] = React.useState(false);
        const [mapContainer, setMapContainer] = React.useState(null);
        const mazeMapInstanceRef = useRef(null);
        const mazeMarkersRef = useRef(new Map());
        const selectedMarkerElRef = useRef(null);
        const activePopupRef = useRef(null);

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
            // const longitude = !!centreLatLong.space_longitude ? centreLatLong.space_longitude : centreLatLong[1];
            // const latitude = !!centreLatLong.space_longitude ? centreLatLong.space_latitude : centreLatLong[0];

            mazeMapInstanceRef.current = new window.Mazemap.Map({
                container: 'mazemap-container',
                campuses: 'all',
                center: { lat: centreLatLong.space_latitude, lng: centreLatLong.space_longitude },
                zoom: zoomLevelForCampus(centreLatLong.space_campus_id),
                zLevel: 1,
                RTLTextPlugin: null,
            });

            mazeMapInstanceRef.current.on('load', () => {
                mazeMapInstanceRef.current.resize();
                setIsMazeMapReady(true);
            });

            // eslint-disable-next-line consistent-return
            return () => {
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

        return <StyledMapWrapperDiv id="mazemap-container" ref={setMapContainer} />;
    },
);

BookableSpacesMap.displayName = 'BookableSpacesMap';

BookableSpacesMap.propTypes = {
    sortedSpaceLocations: PropTypes.any,
    spacesFavouritesList: PropTypes.any,
    onMarkerClick: PropTypes.func.isRequired,
    centreLatLong: PropTypes.array,
};

export default BookableSpacesMap;
