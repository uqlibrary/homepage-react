import React from 'react';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import RouteOutlinedIcon from '@mui/icons-material/RouteOutlined';
import { ART_TRAIL_MAP_POIS } from './mapPois';
import { TAB_ICON_SX } from '../appShellStyles';
import { trailPages } from '../pages';
import DefaultArtwork from '../../../../../../public/images/artTrail/UQRAP_River-Artwork-RGB.jpg';

const stripInlineMarkup = value => value?.replace(/<[^>]+>/g, '') ?? '';

const tabs = [
    {
        id: 'trail',
        label: 'Trail',
        ariaLabel: 'Art Trail in sequential order',
        icon: <RouteOutlinedIcon sx={TAB_ICON_SX} />,
        pages: trailPages,
    },
    {
        id: 'map',
        label: 'Map',
        ariaLabel: 'Art Trail by location on a map',
        icon: <MapOutlinedIcon sx={TAB_ICON_SX} />,
        page: {
            pageTitle: 'Art Trail Map of St Lucia campus',
        },
    },
];

const menuArtworkItems = ART_TRAIL_MAP_POIS.filter(
    (poi, index, pois) => pois.findIndex(candidate => candidate.trailStepIndex === poi.trailStepIndex) === index,
).map(poi => {
    const label =
        `${poi.menuTitle || poi.popupTitle || ''} ${poi.menuDescription || poi.popupDescription || ''}`.trim();

    return {
        id: poi.id,
        label,
        ariaLabel: stripInlineMarkup(label),
        thumbnailSrc: poi.popupThumbnailSrc,
        thumbnailAlt: poi.popupThumbnailAlt,
        trailStepIndex: poi.trailStepIndex,
    };
});

const menuItems = [
    {
        id: 'trail-overview',
        label: 'Indigenous art and Library discovery trail',
        ariaLabel: 'Indigenous art and Library discovery trail',
        thumbnailSrc: DefaultArtwork,
        thumbnailAlt: 'Continue your journey thumbnail',
        trailStepIndex: 0,
    },
    ...menuArtworkItems,
    {
        id: 'continue-your-journey',
        ariaLabel: 'Continue your journey',
        label: 'Continue your journey',
        thumbnailSrc: DefaultArtwork,
        thumbnailAlt: 'Continue your journey thumbnail',
        trailStepIndex: 9,
    },
];

export { tabs, menuItems };
