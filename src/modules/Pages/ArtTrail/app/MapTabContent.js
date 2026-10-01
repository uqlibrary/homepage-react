import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { visuallyHidden } from '@mui/utils';

import Hero from './SharedComponents/Hero';

import { mapClassNames, markerClassNames, popupClassNames } from './appShellStyles';
import { ART_TRAIL_MAP_POIS } from './config/mapPois';
import { loadMazemapAssets, createMazemapPoiMarkers, createUserLocationControl, stripHtml } from './utils/mapUtils';

const mapTableRows = ART_TRAIL_MAP_POIS.filter(
    (poi, index, pois) => pois.findIndex(candidate => candidate.trailStepIndex === poi.trailStepIndex) === index,
);

const MapTabContent = ({ active, onSelectTrailPage, handleMapEvent }) => {
    const [mapUnavailable, setMapUnavailable] = useState(false);
    const mapContainerRef = useRef(null);
    const artworkTableRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerInstancesRef = useRef([]);
    const activePopupRef = useRef(null);
    const geolocateControlRef = useRef(null);
    const geolocateTriggerTimeoutRef = useRef(null);

    const closeActivePopup = () => {
        activePopupRef.current?.remove?.();
        activePopupRef.current = null;
    };

    useEffect(() => {
        let cancelled = false;
        const cancelInitialization = () => {
            cancelled = true;
        };

        if (!active || /jsdom/i.test(window.navigator.userAgent)) {
            closeActivePopup();
            return cancelInitialization;
        }

        setMapUnavailable(false);

        const handleSelectTrailPageFromMap = (stepIndex, label) => {
            closeActivePopup();
            onSelectTrailPage?.(stepIndex);
            handleMapEvent?.(label, 'mapLink');
        };

        if (mapInstanceRef.current) {
            mapInstanceRef.current.resize?.();
            return cancelInitialization;
        }

        loadMazemapAssets()
            .then(Mazemap => {
                /* istanbul ignore if */
                if (cancelled || !mapContainerRef.current || mapInstanceRef.current) {
                    return;
                }

                if (!Mazemap?.Map) {
                    setMapUnavailable(true);
                    return;
                }

                mapInstanceRef.current = new Mazemap.Map({
                    container: mapContainerRef.current,
                    campuses: 'uq',
                    center: { lat: -27.49634, lng: 153.01405 },
                    bearing: -16,
                    zoom: 18.4,
                    zLevel: -1,
                    zLevelControl: false,
                    RTLTextPlugin: null,
                });

                markerInstancesRef.current = createMazemapPoiMarkers({
                    Mazemap,
                    map: mapInstanceRef.current,
                    onSelectTrailPage: handleSelectTrailPageFromMap,
                    handleMapEvent,
                    activePopupRef,
                    markerClassNames,
                    popupClassNames,
                });

                const geolocateControl = createUserLocationControl(Mazemap);

                if (geolocateControl && mapInstanceRef.current.addControl) {
                    geolocateControlRef.current = geolocateControl;
                    mapInstanceRef.current.addControl(geolocateControl, 'top-right');
                    geolocateControl._container?.classList.add(mapClassNames.hiddenGeolocateControl);
                    geolocateTriggerTimeoutRef.current = window.setTimeout(() => {
                        try {
                            geolocateControl.trigger?.();
                        } catch (error) {
                            // Ignore geolocation failures such as permission denials.
                        }
                    }, 0);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setMapUnavailable(true);
                }
            });

        return cancelInitialization;
    }, [active, handleMapEvent, onSelectTrailPage]);

    useEffect(() => {
        return () => {
            window.clearTimeout(geolocateTriggerTimeoutRef.current);
            closeActivePopup();
            markerInstancesRef.current.forEach(marker => marker?.remove?.());
            markerInstancesRef.current = [];
            if (geolocateControlRef.current && mapInstanceRef.current?.removeControl) {
                mapInstanceRef.current.removeControl(geolocateControlRef.current);
            }
            geolocateControlRef.current = null;
            mapInstanceRef.current?.remove?.();
            mapInstanceRef.current = null;
        };
    }, []);

    return (
        <Grid container direction="column" wrap="nowrap">
            <Hero title="Art Trail Map of St Lucia campus" />
            <Link
                href="#art-trail-artwork-locations"
                onClick={event => {
                    event.preventDefault();
                    artworkTableRef.current?.focus();
                }}
                sx={{
                    ...visuallyHidden,
                    '&:focus': {
                        position: 'relative',
                        width: 'auto',
                        height: 'auto',
                        margin: 1,
                        padding: 1,
                        overflow: 'visible',
                        clip: 'auto',
                        whiteSpace: 'normal',
                        zIndex: 1,
                    },
                }}
            >
                Skip to artwork locations
            </Link>
            <Grid container direction="row" columnSpacing={2.5} data-testid="pageContent">
                <Grid xs={12} sm={6}>
                    <Box
                        sx={{
                            position: 'relative',
                            width: '100%',
                            height: 'auto',
                            aspectRatio: '4 / 3',
                            overflow: 'hidden',
                        }}
                    >
                        {mapUnavailable ? (
                            <Box role="status" sx={{ height: '100%', display: 'grid', placeItems: 'center', p: 2 }}>
                                Map is unavailable
                            </Box>
                        ) : (
                            <Box
                                ref={mapContainerRef}
                                data-testid="mazemap-container"
                                role="region"
                                aria-label="MazeMaps campus map"
                                sx={{ position: 'absolute', inset: 0, height: '100%', width: '100%' }}
                            />
                        )}
                    </Box>
                </Grid>
                <Grid xs={12} sm={6}>
                    <TableContainer>
                        <Table
                            ref={artworkTableRef}
                            id="art-trail-artwork-locations"
                            tabIndex={-1}
                            aria-label="Art Trail artwork locations"
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell>Artwork</TableCell>
                                    <TableCell>Location</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {mapTableRows.map(poi => {
                                    const tableLinkLabel = stripHtml(poi.tableLinkText);
                                    const accessibleLinkTitle = `${tableLinkLabel}, ${poi.popupLevelLabel}`;

                                    return (
                                        <TableRow key={poi.trailStepIndex}>
                                            <TableCell>
                                                <Link
                                                    href={`#${poi.id}`}
                                                    title={accessibleLinkTitle}
                                                    aria-label={accessibleLinkTitle}
                                                    onClick={event => {
                                                        event.preventDefault();
                                                        onSelectTrailPage?.(poi.trailStepIndex);
                                                    }}
                                                    dangerouslySetInnerHTML={{ __html: poi.tableLinkText }}
                                                />
                                            </TableCell>
                                            <TableCell>{poi.popupLevelLabel}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </Grid>
    );
};

MapTabContent.propTypes = {
    active: PropTypes.bool,
    onSelectTrailPage: PropTypes.func,
    handleMapEvent: PropTypes.func,
};

export default MapTabContent;
