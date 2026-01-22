import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { slugifyName } from 'helpers/general';
import { locale } from 'modules/Pages/Admin/BookableSpaces/bookablespaces.locale';

const otherSpacesIcon = new L.divIcon({
    html:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 149 178"><circle fill="#F00" cx="74" cy="75" r="48"/></svg>',
    className: 'other-space-icon',
});

const draggableIcon = new L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 149 178">
            <path fill="#cc756b'" stroke="#FFF" stroke-width="6" stroke-miterlimit="10" d="M126 23l-6-6A69 69 0 0 0 74 1a69 69 0 0 0-51 22A70 70 0 0 0 1 74c0 21 7 38 22 52l43 47c6 6 11 6 16 0l48-51c12-13 18-29 18-48 0-20-8-37-22-51z"/>
            <circle fill="#fff" cx="74" cy="75" r="61"/>
            <circle fill="#FFF" cx="74" cy="75" r="48"/>
            </svg>`,
    className: 'draggable-icon',
    iconSize: [24, 40],
    iconAnchor: [12, 40],
});

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

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`campus-tabpanel-${index}`}
            aria-labelledby={`campus-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}
CustomTabPanel.propTypes = {
    children: PropTypes.any,
    value: PropTypes.number,
    index: PropTypes.number,
};

const SpaceLocationMap = ({ formValues, setFormValues, campusCoordinateList, bookableSpacesRoomList }) => {
    console.log('SpaceLocationMap campusCoordinateList=', campusCoordinateList);
    console.log('SpaceLocationMap formValues=', formValues);

    const tabList = campusCoordinateList.map((c, index) => {
        return { id: index, label: c.campus_name, coords: [c.campus_latitude, c.campus_longitude] };
    });

    const initialisePosition = () => {
        if (!!formValues.space_latitude && !!formValues.space_longitude) {
            return [formValues.space_latitude, formValues.space_longitude];
        }

        // show some point so the map works
        return locale.locations.greatCourtCoordinates;
    };
    const [position, setPositionLocal] = useState(initialisePosition());
    const setPosition = p => {
        setPositionLocal(p);

        setFormValues({
            ...formValues,
            ['space_latitude']: p.lat,
            ['space_longitude']: p.lng,
        });
    };

    const markerRef = React.useRef(null);
    function DraggableMarker() {
        const draggable = true;
        const eventHandlers = React.useMemo(
            () => ({
                dragend() {
                    const marker = markerRef.current;
                    if (marker !== null) {
                        console.log('marker', marker);
                        console.log('marker.getLatLng()', marker.getLatLng());
                        setPosition(marker.getLatLng());
                    }
                },
            }),
            [],
        );

        return (
            <Marker
                draggable={draggable}
                eventHandlers={eventHandlers}
                position={position}
                ref={markerRef}
                icon={draggableIcon}
            >
                <Popup minWidth={90}>Drag the market to the closest location to the space</Popup>
            </Marker>
        );
    }

    const [mapCampusId, setMapCampusPanel] = useState(0);
    const [map, setMap] = useState(null);
    const handleMapCampusChange = (event, newMapCampusId) => {
        setMapCampusPanel(newMapCampusId);

        map.setView(tabList[newMapCampusId].coords, 17);

        const newMarkerCoords = tabList.at(newMapCampusId).coords;
        const marker = markerRef.current;
        if (marker !== null) {
            setPosition(newMarkerCoords);
            const newValues = {
                ...formValues,
                ['space_latitude']: newMarkerCoords[0],
                ['space_longitude']: newMarkerCoords[1],
            };
            setFormValues(newValues);
        }
    };
    return (
        <>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <StyledTabs value={mapCampusId} onChange={handleMapCampusChange} aria-label="Campus maps">
                        {campusCoordinateList.map((tab, index) => {
                            return (
                                <Tab
                                    key={`${tab.campus_id}-map`}
                                    label={`${tab.campus_name}`}
                                    id={`campus-tab-${index}`}
                                    aria-controls={`campus-tabpanel-${index}`}
                                    data-testid={`tab-${slugifyName(tab.campus_name)}`}
                                    style={{ width: '20%' }}
                                />
                            );
                        })}
                    </StyledTabs>
                </Box>
            </Box>
            <MapContainer ref={setMap} center={position} zoom={17} style={{ width: '200%', height: '500px' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    maxNativeZoom={19}
                    maxZoom={25}
                />
                <DraggableMarker position={locale.locations.greatCourtCoordinates}>
                    <Popup>Space position</Popup>
                </DraggableMarker>
                {bookableSpacesRoomList?.data?.locations?.length > 0 &&
                    bookableSpacesRoomList.data.locations.map((m, index) => {
                        // skip the current space, and any entries without a lat-long
                        if (formValues.space_id === m.space_id || !m.space_latitude || !m.space_longitude) {
                            return null;
                        }

                        // small marker for other spaces on the map
                        return (
                            <Marker
                                key={`mappoint-${index}`}
                                position={[m.space_latitude, m.space_longitude]}
                                icon={otherSpacesIcon}
                            >
                                <Popup>
                                    {m.space_name} - {m.space_type}
                                </Popup>
                            </Marker>
                        );
                    })}
            </MapContainer>
            <Typography component={'p'}>
                Drag the blue icon to the location for this Space as precisely as you can!
            </Typography>
        </>
    );
};
SpaceLocationMap.propTypes = {
    formValues: PropTypes.any,
    setFormValues: PropTypes.func,
    campusCoordinateList: PropTypes.any,
    bookableSpacesRoomList: PropTypes.object,
};

export default React.memo(SpaceLocationMap);
