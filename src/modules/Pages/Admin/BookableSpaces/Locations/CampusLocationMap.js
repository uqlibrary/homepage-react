import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@mui/material/Typography';
import { locale } from 'modules/Pages/Admin/BookableSpaces/bookablespaces.locale';

const CampusLocationMap = ({ campusCentre = null } = {}) => {
    const defaultCoords = locale?.locations?.greatCourtCoordinates;
    const initialLat = Number(campusCentre?.campus_latitude ?? defaultCoords[0]);
    const initialLng = Number(campusCentre?.campus_longitude ?? defaultCoords[1]);

    const [isMazeMapScriptReady, setIsMazeMapScriptReady] = React.useState(false);
    const [mapContainer, setMapContainer] = React.useState(null);
    const mazeMapInstanceRef = React.useRef(null);
    const markerRef = React.useRef(null);

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

        // MazeMap calls api.mazemap.com which returns 401 in dev (no credentials).
        // Intercept those requests and return an empty-but-valid campus collection
        // so MazeMap doesn't crash internally when it tries to .map() over the result.
        const origFetch = window.fetch;
        window.fetch = (url, ...args) => {
            if (typeof url === 'string' && url.includes('api.mazemap.com')) {
                return Promise.resolve(
                    new Response(JSON.stringify({ campuses: [] }), {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' },
                    }),
                );
            }
            return origFetch(url, ...args);
        };

        return () => {
            window.fetch = origFetch;
            document.head.removeChild(link);
            document.body.removeChild(script);
            delete window.Mazemap;
        };
    }, []);

    React.useEffect(() => {
        if (!isMazeMapScriptReady || !mapContainer) {
            return () => {};
        }

        mazeMapInstanceRef.current = new window.Mazemap.Map({
            container: mapContainer,
            campuses: 'all',
            center: { lng: initialLng, lat: initialLat },
            zoom: 15,
            zLevel: 1,
            RTLTextPlugin: null,
        });

        mazeMapInstanceRef.current.on('load', () => {
            mazeMapInstanceRef.current.resize();

            const el = document.createElement('div');
            el.style.cssText = 'width: 24px; height: 40px; cursor: grab;';
            el.setAttribute('role', 'img');
            el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 149 178">
                <path fill="#51247a" stroke="#FFF" stroke-width="6" stroke-miterlimit="10" d="M126 23l-6-6A69 69 0 0 0 74 1a69 69 0 0 0-51 22A70 70 0 0 0 1 74c0 21 7 38 22 52l43 47c6 6 11 6 16 0l48-51c12-13 18-29 18-48 0-20-8-37-22-51z"/>
                <circle fill="#fff" cx="74" cy="75" r="48"/>
            </svg>`;

            markerRef.current = new window.Mazemap.ZLevelMarker(el, { offset: [0, -20] })
                .setLngLat([initialLng, initialLat])
                .addTo(mazeMapInstanceRef.current);

            mazeMapInstanceRef.current.on('click', e => {
                const { lng, lat } = e.lngLat;
                const zLevel = mazeMapInstanceRef.current.zLevel;
                console.log('CampusLocationMap click — lat:', lat, 'lng:', lng, 'zLevel:', zLevel);
                markerRef.current.setLngLat([lng, lat]);
                const campusLatitudeField = document.getElementById('campus_latitude');
                if (campusLatitudeField) campusLatitudeField.value = lat;
                const campusLongitudeField = document.getElementById('campus_longitude');
                if (campusLongitudeField) campusLongitudeField.value = lng;
            });
        });

        return () => {
            markerRef.current?.remove();
            markerRef.current = null;
            mazeMapInstanceRef.current?.remove();
            mazeMapInstanceRef.current = null;
        };
    }, [isMazeMapScriptReady, mapContainer, initialLat, initialLng]);

    return (
        <>
            <div id="campus-location-mazemap" ref={setMapContainer} style={{ width: '100%', height: '300px' }} />
            <Typography component={'p'}>
                Drill out on the map to find the campus, then click to place the pin at roughly the centre of the
                campus.
                <br />
                This will be used to help you find locations of Spaces on creation and edit.
            </Typography>
        </>
    );
};

CampusLocationMap.propTypes = {
    campusCentre: PropTypes.object,
};

export default React.memo(CampusLocationMap);
