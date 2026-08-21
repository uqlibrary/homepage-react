import React from 'react';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import RouteOutlinedIcon from '@mui/icons-material/RouteOutlined';
import { ART_TRAIL_MAP_POIS } from './mapPois';
import { TAB_ICON_SX } from '../appShellStyles';
import { trailPages } from '../pages';

const stripInlineMarkup = value => value?.replace(/<[^>]+>/g, '') ?? '';

const tabs = [
    {
        id: 'trail',
        label: 'Trail',
        icon: <RouteOutlinedIcon sx={TAB_ICON_SX} />,
        pages: trailPages,
    },
    {
        id: 'map',
        label: 'Map',
        icon: <MapOutlinedIcon sx={TAB_ICON_SX} />,
        page: {
            title: 'Map overview',
            body: 'Placeholder map copy can describe the route, entry points, and the sequence of artworks.',
            highlights: ['Route overview', 'Entrances', 'Landmarks'],
        },
    },
];

const menuArtworkItems = ART_TRAIL_MAP_POIS.filter(
    (poi, index, pois) => pois.findIndex(candidate => candidate.trailStepIndex === poi.trailStepIndex) === index,
).map(poi => ({
    id: poi.id,
    label: `${poi.popupTitle || ''} ${stripInlineMarkup(poi.popupDescription)}`.trim(),
    thumbnailSrc: poi.popupThumbnailSrc,
    thumbnailAlt: poi.popupThumbnailAlt,
    trailStepIndex: poi.trailStepIndex,
}));

const menuItems = [
    {
        id: 'trail-overview',
        label: 'Indigenous art and Library discovery trail',
        trailStepIndex: 0,
    },
    ...menuArtworkItems,
    {
        id: 'continue-your-journey',
        label: 'Continue your journey',
        trailStepIndex: 9,
    },
];

export { tabs, menuItems };
