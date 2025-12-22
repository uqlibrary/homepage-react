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

const SpaceLocationMap = ({ formValues, setFormValues }) => {
    // const STLUCIA_CAMPUS_ID = 1;

    const STLUCIA_TAB_ID = 0;
    const PACE_TAB_ID = 1;
    const GATTON_TAB_ID = 2;
    const HERSTON_TAB_ID = 3;

    const tabList = [
        // a central location, for centering on the initial panel load
        { id: STLUCIA_TAB_ID, label: 'St Lucia', coords: [-27.497975, 153.012385] },
        { id: PACE_TAB_ID, label: 'Pace', coords: [-27.49979, 153.03066] },
        { id: GATTON_TAB_ID, label: 'Gatton', coords: [-27.55383, 152.33584] },
        { id: HERSTON_TAB_ID, label: 'Herston', coords: [-27.44874, 153.02774] },
    ];

    const centreGreatCourt = [-27.49745, 153.01337];

    // a list of locations to help the admin user find the building they want
    const libraryBuildingsLocationGuides1 = [
        // needs better display names?
        { name: 'Armus', position: [-27.49904, 153.01453] },
        { name: 'Law', position: [-27.49718, 153.01214] },
        { name: 'Pace', position: tabList.find(c => c.id === PACE_TAB_ID).coords },
        { name: 'BSL', position: [-27.49695, 153.01136] },
        { name: 'Central', position: [-27.49607, 153.01355] },
        { name: 'DHESL', position: [-27.5, 153.01322] },
        { name: 'Duhig Tower', position: [-27.49645, 153.01431] },
        { name: 'Gatton', position: tabList.find(c => c.id === GATTON_TAB_ID).coords },
        // can add more here
    ];

    const initialCentre = tabList.find(c => c.id === STLUCIA_TAB_ID).coords;

    const preposition =
        !!formValues.space_latitude && !!formValues.space_longitude
            ? [formValues.space_latitude, formValues.space_longitude]
            : centreGreatCourt;
    const [position, setPosition2] = useState(preposition);
    const setPosition = p => {
        setPosition2(p);

        const newValues = {
            ...formValues,
            ['space_latitude']: p.lat,
            ['space_longitude']: p.lng,
        };
        setFormValues(newValues);
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

        const newMarketCoords = tabList.find(c => c.id === newMapCampusId).coords;
        const marker = markerRef.current;
        if (marker !== null) {
            setPosition(newMarketCoords);
            const newValues = {
                ...formValues,
                ['space_latitude']: newMarketCoords[0],
                ['space_longitude']: newMarketCoords[1],
            };
            setFormValues(newValues);
        }
    };
    function a11yProps(index) {
        return {
            id: `campus-tab-${index}`,
            'aria-controls': `campus-tabpanel-${index}`,
        };
    }

    return (
        <>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <StyledTabs value={mapCampusId} onChange={handleMapCampusChange} aria-label="Campus maps">
                        {tabList.map((tab, index) => {
                            return (
                                <Tab
                                    key={`${tab.label}-map`}
                                    label={`${tab.label}`}
                                    {...a11yProps(index)}
                                    data-testid={`tab-${slugifyName(tab.label)}`}
                                    style={{ width: '20%' }}
                                />
                            );
                        })}
                    </StyledTabs>
                </Box>
            </Box>
            <MapContainer
                ref={setMap}
                center={initialCentre}
                zoom={17}
                // scrollWheelZoom={false}
                style={{ width: '200%', height: '500px' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    maxNativeZoom={19}
                    maxZoom={25}
                />
                <DraggableMarker position={centreGreatCourt}>
                    {/* setNewCentreIn={setNewCentre}>*/}
                    <Popup>St Lucia campus</Popup> {/* move this point */}
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
                Drag the icon to the location for this Space as precisely as you can!
            </Typography>
        </>
    );
};
SpaceLocationMap.propTypes = {
    formValues: PropTypes.any,
    setFormValues: PropTypes.func,
};

export default React.memo(SpaceLocationMap);
