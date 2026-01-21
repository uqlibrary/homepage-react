import React, { useState } from 'react';

import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';

import Typography from '@mui/material/Typography';
import { locale } from 'modules/Pages/Admin/BookableSpaces/bookablespaces.locale';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const CampusLocationMap = (campusCentre = null) => {
    const initialCentre =
        campusCentre?.space_latitude && campusCentre?.space_longitude
            ? [campusCentre.space_latitude, campusCentre.space_longitude]
            : locale.locations.greatCourtCoordinates;

    const [position, setPosition2] = useState(locale.locations.greatCourtCoordinates);
    const setPosition = p => {
        const campusLatitudeField = document.getElementById('campus_latitude');
        !!campusLatitudeField && (campusLatitudeField.value = p.lat);
        console.log('set campus_latitude to ', p.lat);
        const campusLongitudeField = document.getElementById('campus_longitude');
        !!campusLongitudeField && (campusLongitudeField.value = p.lng);
        console.log('set campus_longitude to ', p.lng);
        setPosition2(p);
    };

    const markerRef = React.useRef(null);
    function DraggableMarker() {
        const draggable = true;
        const eventHandlers = React.useMemo(
            () => ({
                dragend() {
                    const marker = markerRef.current;
                    if (marker !== null) {
                        setPosition(marker.getLatLng());
                    }
                },
            }),
            [],
        );

        return (
            <Marker draggable={draggable} eventHandlers={eventHandlers} position={position} ref={markerRef}>
                <Popup minWidth={90}>Centre the campus</Popup>
            </Marker>
        );
    }

    return (
        <>
            <MapContainer
                center={initialCentre}
                zoom={15}
                // scrollWheelZoom={false}
                style={{ width: '100%', height: '300px' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    maxNativeZoom={19}
                    maxZoom={25}
                />
                <DraggableMarker position={locale.locations.greatCourtCoordinates} />
            </MapContainer>
            <Typography component={'p'}>
                Drill out on the map to find the campus, then drag the blue icon to roughly the centre of the campus.
                <br />
                This will be used to help you find locations of Spaces on creation and edit.
            </Typography>
        </>
    );
};

export default React.memo(CampusLocationMap);
