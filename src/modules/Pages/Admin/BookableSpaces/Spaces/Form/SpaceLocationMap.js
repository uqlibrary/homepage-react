import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { slugifyName } from 'helpers/general';
import { locale } from 'modules/Pages/Admin/BookableSpaces/bookablespaces.locale';

const StyledTabs = styled(Tabs)(({ theme }) => ({
    '& > div > div': {
        columnGap: '0.25rem',
    },
    '& button': {
        border: theme.palette.designSystem.border,
        borderRadiusTopLeft: '0.5rem',
        borderRadiusTopRight: '0.5rem',
        width: '15%',
        textTransform: 'none',
        fontWeight: 400,
        fontSize: '16px',
    },
}));

const SpaceLocationMap = ({
    formValues,
    setFormValues,
    campusCoordinateList,
    bookableSpacesRoomList,
    initialCampus = 0,
}) => {
    const tabList = campusCoordinateList?.map((c, index) => ({
        id: index,
        label: c?.campus_name,
        coords: { lng: c?.campus_longitude, lat: c?.campus_latitude },
    }));

    const getInitialLngLat = () => {
        if (formValues?.space_latitude && formValues?.space_longitude) {
            return { lng: formValues.space_longitude, lat: formValues.space_latitude };
        }
        const defaultCoords = locale?.locations?.greatCourtCoordinates;
        return { lng: defaultCoords[1], lat: defaultCoords[0] };
    };

    const [isMazeMapScriptReady, setIsMazeMapScriptReady] = React.useState(false);
    const [isMazeMapReady, setIsMazeMapReady] = React.useState(false);
    const [showResetButton, setShowResetButton] = React.useState(false);
    const [mapContainer, setMapContainer] = React.useState(null);
    const mazeMapInstanceRef = React.useRef(null);
    const draggableMarkerRef = React.useRef(null);
    const otherMarkersRef = React.useRef([]);
    const initialViewRef = React.useRef(null);

    const [mapCampusId, setMapCampusId] = useState(0);

    const isNearInitialCenter = React.useCallback(map => {
        const initialView = initialViewRef.current;
        if (!map || !initialView) return true;

        const center = map.getCenter?.();
        if (!center) return true;

        const lngDiff = Math.abs(center.lng - initialView.lng);
        const latDiff = Math.abs(center.lat - initialView.lat);
        return lngDiff < 0.0002 && latDiff < 0.0002;
    }, []);

    const updateResetButtonVisibility = React.useCallback(
        map => {
            setShowResetButton(!isNearInitialCenter(map));
        },
        [isNearInitialCenter],
    );

    const resetMapPosition = React.useCallback(() => {
        const map = mazeMapInstanceRef.current;
        const initialView = initialViewRef.current;
        if (!map || !initialView) return;

        map.flyTo({ center: [initialView.lng, initialView.lat], zoom: initialView.zoom });
        if (Number.isFinite(initialView.zLevel)) {
            map.setZLevel(initialView.zLevel);
        }
        setShowResetButton(false);
    }, []);

    React.useEffect(() => {
        // Always reload the script rather than reusing window.Mazemap — after
        // map.remove() the internal Mapbox GL/MazeMap state can be left dirty,
        // and reusing it on the next mount causes markers to appear off-map.
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
            delete window.Mazemap;
        };
    }, []);

    React.useEffect(() => {
        if (!isMazeMapScriptReady || !mapContainer) {
            return () => {};
        }

        const { lng, lat } = getInitialLngLat();

        mazeMapInstanceRef.current = new window.Mazemap.Map({
            container: mapContainer,
            campuses: 'uq',
            center: { lng, lat },
            zoom: 17,
            zLevel: formValues?.space_zlevel ?? 1,
            RTLTextPlugin: null,
        });

        initialViewRef.current = {
            lng,
            lat,
            zoom: 17,
            zLevel: Number(formValues?.space_zlevel ?? 1),
        };
        setShowResetButton(false);

        mazeMapInstanceRef.current.on('moveend', () => {
            updateResetButtonVisibility(mazeMapInstanceRef.current);
        });

        mazeMapInstanceRef.current.on('load', () => {
            mazeMapInstanceRef.current.resize();
            updateResetButtonVisibility(mazeMapInstanceRef.current);
            setIsMazeMapReady(true);
        });

        return () => {
            draggableMarkerRef.current?.remove();
            draggableMarkerRef.current = null;
            otherMarkersRef.current.forEach(m => {
                m.remove();
            });
            otherMarkersRef.current = [];
            mazeMapInstanceRef.current?.remove();
            mazeMapInstanceRef.current = null;
            initialViewRef.current = null;
            setShowResetButton(false);
            setIsMazeMapReady(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMazeMapScriptReady, mapContainer]);

    React.useEffect(() => {
        if (!isMazeMapReady || !mazeMapInstanceRef.current) return;

        const { lng, lat } = getInitialLngLat();

        // Draggable marker for the current space
        const el = document.createElement('div');
        el.style.cssText = 'width: 24px; height: 40px; cursor: grab;';
        el.setAttribute('role', 'img');
        el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 149 178">
            <path fill="#51247a" stroke="#FFF" stroke-width="6" stroke-miterlimit="10" d="M126 23l-6-6A69 69 0 0 0 74 1a69 69 0 0 0-51 22A70 70 0 0 0 1 74c0 21 7 38 22 52l43 47c6 6 11 6 16 0l48-51c12-13 18-29 18-48 0-20-8-37-22-51z"/>
            <circle fill="#fff" cx="74" cy="75" r="48"/>
        </svg>`;

        draggableMarkerRef.current = new window.Mazemap.ZLevelMarker(el, { offset: [0, -20] })
            .setLngLat([lng, lat])
            .addTo(mazeMapInstanceRef.current);

        mazeMapInstanceRef.current.on('click', e => {
            const { lng: newLng, lat: newLat } = e.lngLat;
            const zLevel = mazeMapInstanceRef.current.zLevel;
            console.log('SpaceLocationMap click — lat:', newLat, 'lng:', newLng, 'zLevel:', zLevel);
            draggableMarkerRef.current.setLngLat([newLng, newLat]);
            setFormValues(prev => ({
                ...prev,
                space_latitude: newLat,
                space_longitude: newLng,
                space_zlevel: zLevel,
            }));
        });

        // Keep space_zlevel current whenever the user changes floors without re-clicking
        mazeMapInstanceRef.current.on('zlevel', e => {
            const zLevel = e.zLevel ?? mazeMapInstanceRef.current.zLevel;
            console.log('SpaceLocationMap floor changed — zLevel:', zLevel);
            setFormValues(prev => ({ ...prev, space_zlevel: zLevel }));
        });

        // Static markers for other spaces
        otherMarkersRef.current.forEach(m => m.remove());
        otherMarkersRef.current = [];

        bookableSpacesRoomList?.data?.locations
            ?.filter(m => m.space_id !== formValues?.space_id && !!m.space_latitude && !!m.space_longitude)
            ?.forEach(mapPoint => {
                const otherEl = document.createElement('div');
                otherEl.style.cssText = 'width: 16px; height: 16px; cursor: pointer;';
                otherEl.innerHTML =
                    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 149 178"><circle fill="#F00" cx="74" cy="75" r="48"/></svg>';

                const otherMarker = new window.Mazemap.ZLevelMarker(otherEl, { offset: [0, 0] })
                    .setLngLat([mapPoint.space_longitude, mapPoint.space_latitude])
                    .addTo(mazeMapInstanceRef.current);

                const popup = new window.Mazemap.Popup({ closeButton: false, offset: [0, -8] }).setText(
                    `${mapPoint.space_name} - ${mapPoint.space_type}`,
                );

                otherEl.addEventListener('mouseenter', () => {
                    popup
                        .setLngLat([mapPoint.space_longitude, mapPoint.space_latitude])
                        .addTo(mazeMapInstanceRef.current);
                });
                otherEl.addEventListener('mouseleave', () => popup.remove());

                otherMarkersRef.current.push(otherMarker);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMazeMapReady]);

    React.useEffect(() => {
        setMapCampusId(initialCampus);
    }, [initialCampus]);

    const handleMapCampusChange = (event, newCampusId) => {
        setMapCampusId(newCampusId);
        const coords = tabList?.[newCampusId]?.coords;
        if (!coords || !mazeMapInstanceRef.current) return;

        mazeMapInstanceRef.current.flyTo({ center: coords, zoom: 17 });
        draggableMarkerRef.current?.setLngLat([coords.lng, coords.lat]);
        initialViewRef.current = {
            lng: Number(coords.lng),
            lat: Number(coords.lat),
            zoom: 17,
            zLevel: Number(mazeMapInstanceRef.current.zLevel ?? formValues?.space_zlevel ?? 1),
        };
        setShowResetButton(false);

        setFormValues(prev => ({
            ...prev,
            space_latitude: coords.lat,
            space_longitude: coords.lng,
        }));
    };

    return (
        <>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <StyledTabs
                        value={mapCampusId}
                        onChange={handleMapCampusChange}
                        aria-label="Campus maps"
                        data-testid="spaces-campus-maps-tabs"
                    >
                        {campusCoordinateList?.map((tab, index) => {
                            return (
                                <Tab
                                    key={`${tab?.campus_id}-map`}
                                    label={`${tab?.campus_name}`}
                                    id={`campus-tab-${index}`}
                                    aria-controls={`campus-tabpanel-${index}`}
                                    data-testid={`tab-${slugifyName(tab?.campus_name)}`}
                                    style={{ width: '20%' }}
                                />
                            );
                        })}
                    </StyledTabs>
                </Box>
            </Box>
            <div style={{ position: 'relative' }}>
                <div id="space-location-mazemap" ref={setMapContainer} style={{ width: '100%', height: '500px' }} />
                {showResetButton && (
                    <Button
                        variant="contained"
                        size="small"
                        onClick={resetMapPosition}
                        data-testid="reset-map-position-button"
                        sx={{
                            position: 'absolute',
                            bottom: 12,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            zIndex: 20,
                            borderRadius: '999px',
                            textTransform: 'none',
                        }}
                    >
                        Reset map
                    </Button>
                )}
            </div>
            <Typography component={'p'}>
                Click on the map to move the marker to the location for this Space as precisely as you can!
            </Typography>
            <Typography component={'p'}>Small red dots indicate existing Space locations.</Typography>
        </>
    );
};
SpaceLocationMap.propTypes = {
    formValues: PropTypes.any,
    setFormValues: PropTypes.func,
    campusCoordinateList: PropTypes.any,
    bookableSpacesRoomList: PropTypes.object,
    initialCampus: PropTypes.number,
};

export default React.memo(SpaceLocationMap);
