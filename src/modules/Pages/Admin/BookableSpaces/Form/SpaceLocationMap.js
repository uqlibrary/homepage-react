import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L, { Icon } from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { slugifyName } from 'helpers/general';
import { locale } from 'modules/Pages/Admin/BookableSpaces/bookablespaces.locale';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});
const pinIcon = new Icon({
    iconUrl: '/images/Pin-2--Streamline-Ultimate-red.png',
    iconSize: [35, 35], // size of the icon
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
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

const SpaceLocationMap = ({ formValues, setFormValues, campusCoordinateList }) => {
    console.log('SpaceLocationMap campusCoordinateList=', campusCoordinateList);
    console.log('SpaceLocationMap formValues=', formValues);

    const ST_LUCIA_COORDINATES = [-27.49718, 153.01214];

    const tabList = campusCoordinateList.map((c, index) => {
        return { id: index, label: c.campus_name, coords: [c.campus_latitude, c.campus_longitude] };
    });

    // a list of locations to help the admin user find the building they want
    const libraryBuildingsLocationGuides1 = [
        // needs better display names? (only shows in popups)
        { name: 'Law', position: ST_LUCIA_COORDINATES },
        { name: 'Armus', position: [-27.49904, 153.01453] },
        { name: 'Pace', position: [-27.49979, 153.03066] },
        { name: 'BSL', position: [-27.49695, 153.01136] },
        { name: 'Central', position: [-27.49607, 153.01355] },
        { name: 'DHESL', position: [-27.5, 153.01322] },
        { name: 'Duhig Tower', position: [-27.49645, 153.01431] },
        { name: 'JK Murray', position: [-27.55383, 152.33584] },
        // can add more here
    ];

    const initialisePosition = () => {
        if (!!formValues.space_latitude && !!formValues.space_longitude) {
            return [formValues.space_latitude, formValues.space_longitude];
        }

        // show some point so the map works
        return ST_LUCIA_COORDINATES;
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
            <Marker draggable={draggable} eventHandlers={eventHandlers} position={position} ref={markerRef}>
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
                {libraryBuildingsLocationGuides1.length > 0 &&
                    libraryBuildingsLocationGuides1?.map((m, index) => {
                        // show the major Libraries on the map, to help the admin locate the Space
                        const locationKey = `mappoint-space-${index}`;
                        return (
                            <Marker key={locationKey} position={[m.position[0], m.position[1]]} icon={pinIcon}>
                                <Popup>{m.name}</Popup>
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
};

export default React.memo(SpaceLocationMap);
