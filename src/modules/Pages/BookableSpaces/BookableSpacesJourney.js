import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import { Box, Button, Chip, Grid, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import ComputerIcon from '@mui/icons-material/Computer';
import FavoriteIcon from '@mui/icons-material/Favorite';
import GroupsIcon from '@mui/icons-material/Groups';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import PersonIcon from '@mui/icons-material/Person';
import TuneIcon from '@mui/icons-material/Tune';
import TvIcon from '@mui/icons-material/Tv';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';

import SidebarFilters from 'modules/Pages/BookableSpaces/SidebarFilters';
import { standardText, StyledPrimaryButton, StyledSecondaryButton } from 'helpers/general';
import { defaultChipStyles, SpaceOpenStatusChip } from 'modules/Pages/BookableSpaces/spacesHelpers';
import JourneySpaceDetailsView from 'modules/Pages/BookableSpaces/JourneySpaceDetailsView';
import JourneyBreadcrumbs from 'modules/Pages/BookableSpaces/JourneyBreadcrumbs';
import {
    JOURNEY_VIEWS,
    serialiseJourneyMapFilterState,
    serialiseJourneyUrl,
    parseJourneyStateFromUrl,
} from 'modules/Pages/BookableSpaces/journeyHelpers';
import { getVisibleSpaceOutage } from 'modules/Pages/Admin/BookableSpaces/Spaces/Form/spaceOutageHelpers';
import { ArticleCard } from 'modules/SharedComponents/Toolbox/ArticleCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import SingleLinkCard from 'modules/HomePage/publicComponents/HelpNavigation/SingleLinkCard';

const browseAllSpacesIcon =
    'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23000%27%3e%3cg fill=%27none%27 stroke=%27%2351247A%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%27.75%27%3e%3cpath d=%27M14.29 7.57V3.89c0-.35-.2-.66-.52-.78L10.4 1.77a.83.83 0 0 0-.63 0L6.2 3.2a.8.8 0 0 1-.63 0L2.29 1.89a.41.41 0 0 0-.55.22c-.03.06-.03.12-.03.15v8.03c0 .34.2.65.52.77l3.34 1.34c.2.08.43.08.63 0m-.29-9.14v4.31m4.18-5.86v3.77%27%3e%3c/path%3e%3cpath d=%27M10.52 7.57a2.94 2.94 0 1 1 0 5.88 2.94 2.94 0 0 1 0-5.88zm3.77 6.72L12.6 12.6%27%3e%3c/path%3e%3c/g%3e%3c/svg%3e")';
const journeyFallbackImage = require('../../../../public/images/spaces/hero-jk-murray-library-gatton-students-outdoor-study.jpg');

const StyledJourneyWrapper = styled('div')(({ theme }) => ({
    backgroundColor: '#fff',
    minHeight: 'calc(100vh - 200px)',
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: '6rem',
    [theme.breakpoints.down('sm')]: {
        paddingBottom: '8rem',
    },
}));

const StyledJourneyPanel = styled('div', {
    shouldForwardProp: prop => prop !== 'hasTopSpacing',
})(({ theme, hasTopSpacing }) => ({
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    rowGap: '2rem',
    padding: `${hasTopSpacing ? '2rem' : '0'} 0 2rem`,
    [theme.breakpoints.down('sm')]: {
        padding: `${hasTopSpacing ? '1rem' : '0'} 0 1rem`,
        rowGap: '1.25rem',
    },
    [theme.breakpoints.down('md')]: {
        maxWidth: '100%',
    },
}));

const StyledBrowseAllSpacesCard = styled('section')(({ theme }) => ({
    marginTop: '2rem',
    backgroundColor: '#f3f3f5',
    borderRadius: '4px',
    padding: '1.5rem',
    [theme.breakpoints.down('sm')]: {
        marginTop: '1.5rem',
        padding: '1.25rem',
    },
}));

const StyledBrowseAllSpacesIcon = styled('span')(() => ({
    display: 'block',
    width: '56px',
    height: '56px',
    backgroundImage: browseAllSpacesIcon,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'contain',
}));

const StyledBrowseAllSpacesLink = styled('button')(({ theme }) => ({
    marginTop: '1.25rem',
    border: 0,
    padding: 0,
    background: 'transparent',
    color: theme.palette.primary.main,
    fontSize: '1.25rem',
    lineHeight: 1.3,
    fontWeight: 500,
    textAlign: 'left',
    textDecoration: 'underline',
    cursor: 'pointer',
    fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
    transition: 'color 200ms ease-out, text-decoration 200ms ease-out, background-color 200ms ease-out',
    '&:hover, &:focus': {
        backgroundColor: theme.palette.primary.main,
        color: '#fff',
        textDecoration: 'underline',
    },
    '&:focus-visible': {
        outline: `3px solid ${theme.palette.primary.main}`,
        outlineOffset: '2px',
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: '1.1rem',
    },
}));
const chipStyles = {
    fontSize: '1rem',
    marginBottom: '0.5rem !important',
    '& span': {
        padding: '12px 16px',
    },
};
// Result card with proper styling - clickable full card
const StyledResultCardLink = styled(Link)(({ theme }) => ({
    width: '100%',
    padding: '0 0 4rem 0',
    textTransform: 'none',
    justifyContent: 'flex-start',
    border: `${theme.palette.designSystem.border}`,
    borderRadius: theme.palette.designSystem.borderRadius,
    backgroundColor: '#fff',
    color: 'inherit',
    fontSize: '1rem',
    marginBottom: '1.5rem',
    '&:hover, &focus': {
        textDecoration: 'none',
        backgroundColor: theme.palette.designSystem.panelBackgroundColor,
    },
    '& h3': {
        fontWeight: 500,
        color: theme.palette.designSystem.headingColor,
        fontSize: '1.5rem',
        marginBottom: '0.5rem',
        fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
    },
    '& .resultBody': {
        ...standardText(theme),
    },
}));

const StyledLandingHeroShell = styled('section')(({ theme }) => ({
    background: 'linear-gradient(135deg, #4b2271 0%, #5e2c8d 58%, #6f369f 100%)',
    overflow: 'hidden',
    boxShadow: '0 16px 40px rgba(45, 19, 74, 0.16)',
    [theme.breakpoints.down('sm')]: {
        boxShadow: '0 12px 28px rgba(45, 19, 74, 0.14)',
    },
}));

const StyledLandingHeroLayout = styled('div')(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: '1fr',
    alignItems: 'stretch',
    minHeight: '420px',
    [theme.breakpoints.up('md')]: {
        gridTemplateColumns: 'minmax(0, 0.95fr) minmax(320px, 1.05fr)',
        minHeight: '390px',
    },
}));

const StyledLandingHeroVisual = styled('div')(({ theme }) => ({
    position: 'relative',
    minHeight: '220px',
    background:
        'linear-gradient(180deg, rgba(20, 8, 34, 0.18) 0%, rgba(20, 8, 34, 0.5) 100%), url(' +
        journeyFallbackImage +
        ')',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    order: 1,
    [theme.breakpoints.up('md')]: {
        order: 2,
        minHeight: '100%',
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        background:
            'linear-gradient(135deg, rgba(81, 36, 122, 0.18) 0%, rgba(81, 36, 122, 0.04) 42%, rgba(16, 8, 31, 0.38) 100%)',
    },
}));

const StyledLandingHeroContentColumn = styled('div')(({ theme }) => ({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    padding: '1.25rem',
    order: 2,
    [theme.breakpoints.up('md')]: {
        order: 1,
        padding: '2rem 0 2rem 2rem',
    },
}));

const StyledLandingHeroCard = styled('div')(({ theme }) => ({
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: '640px',
    backgroundColor: '#5a2b87',
    color: '#fff',
    padding: '1.6rem',
    boxShadow: '0 20px 40px rgba(26, 10, 43, 0.28)',
    [theme.breakpoints.up('md')]: {
        marginRight: '-5.5rem',
        padding: '2.25rem 2.5rem',
    },
}));

const StyledLandingHeroInner = styled('div')(({ theme }) => ({
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    [theme.breakpoints.down('md')]: {
        maxWidth: '100%',
    },
}));

const StyledLandingHighlightPanel = styled('section')(({ theme }) => ({
    position: 'relative',
    minHeight: '300px',
    borderRadius: '4px',
    overflow: 'hidden',
    backgroundColor: '#34204f',
    display: 'flex',
    alignItems: 'center',
    padding: '1rem',
    boxShadow: '0 14px 34px rgba(31, 18, 48, 0.16)',
    boxSizing: 'border-box',
    [theme.breakpoints.down('md')]: {
        minHeight: 'auto',
        alignItems: 'stretch',
    },
    [theme.breakpoints.down('sm')]: {
        padding: '0.75rem',
    },
}));

const StyledLandingHighlightPanelMedia = styled('div')(() => ({
    position: 'absolute',
    inset: 0,
    backgroundColor: '#1a0a25',
    backgroundImage:
        'linear-gradient(140deg, rgba(18, 10, 29, 0.22) 0%, rgba(18, 10, 29, 0.6) 72%, rgba(18, 10, 29, 0.78) 100%), url(' +
        journeyFallbackImage +
        ')',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
}));

const StyledLandingHighlightTextCard = styled('div')(({ theme }) => ({
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: '31rem',
    margin: 0,
    backgroundColor: 'rgba(90, 43, 135, 0.92)',
    color: '#fff',
    padding: '1.25rem 1.35rem',
    boxShadow: '0 16px 30px rgba(23, 11, 37, 0.35)',
    boxSizing: 'border-box',
    borderRadius: '4px',
    [theme.breakpoints.down('sm')]: {
        maxWidth: '100%',
        padding: '1rem 1.05rem',
    },
}));

const StyledLandingHighlightAsideContent = styled('div')(() => ({
    display: 'flex',
    flexDirection: 'column',
    marginTop: 'auto',
    marginBottom: 'auto',
}));
const StyledFavouritesContainerGrid = styled(Grid)(() => ({
    marginTop: '-24px',
    paddingLeft: 0,
    '& a': {
        boxSizing: 'border-box',
        minWidth: { xs: '100%', sm: '100%' },
    },
}));

const StyledHeaderWithLinkToAllGridItem = styled(Grid)(({ theme }) => ({
    marginTop: '-32px',
    paddingBottom: theme.spacing(3),
    '& h2': {
        marginTop: '22px',
        fontSize: '32px',
        fontWeight: 500,
        display: 'inline-block',
        marginRight: '16px',
    },
    // ensure heading doesn't capture pointer above the inline link
    '& h2, & h2 *': {
        zIndex: 0,
    },
    '& a': {
        color: theme.palette.primary.main,
        fontWeight: 500,
        display: 'inline-block',
        paddingBlock: '2px',
        textDecoration: 'underline',
        transition: 'color 200ms ease-out, text-decoration 200ms ease-out, background-color 200ms ease-out',
        '&:hover': {
            color: '#fff',
            backgroundColor: theme.palette.primary.main,
        },
    },
}));

const StyledSeeAllLink = styled(Link)(({ theme }) => ({
    marginLeft: theme.spacing(0),
    paddingBlock: '2px',
    display: 'inline-block',
    textDecoration: 'underline',
    transition: 'color 200ms ease-out, text-decoration 200ms ease-out, background-color 200ms ease-out',
    color: theme.palette.primary.main,
    zIndex: 1,
    pointerEvents: 'auto',
    '&:hover': {
        color: '#fff',
        backgroundColor: theme.palette.primary.main,
        textDecoration: 'underline',
    },
    '&, & *': {
        color: 'inherit',
    },
}));

const StyledResultsSplitLayout = styled(Box)(({ theme }) => ({
    display: 'grid',
    gap: '1.5rem',
    gridTemplateColumns: 'minmax(0, 4fr) minmax(0, 8fr)',
    alignItems: 'start',
    width: '100%',
    [theme.breakpoints.down('lg')]: {
        gridTemplateColumns: '1fr',
        width: '100%',
    },
}));

const StyledResultsSidebarPanel = styled(Box)(({ theme }) => ({
    padding: '0',
    position: 'sticky',
    top: '1rem',
    [theme.breakpoints.down('lg')]: {
        position: 'relative',
        top: 'auto',
    },
}));

const intentDefinitions = [
    {
        id: 'quiet',
        label: 'Quiet space',
        description: 'Find a peaceful spot to focus.',
        icon: VolumeOffIcon,
        IconSvg:
            'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23000%27%3e%3cg fill=%27none%27 stroke=%27%2351247A%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%27.75%27%3e%3cpath d=%27M1.71 4.66A3.69 3.69 0 0 1 4.7 1.8a3.76 3.76 0 0 1 4.57 3.68A4.5 4.5 0 0 1 7.7 8.91a2.13 2.13 0 0 0-.98 2.03c.03.46.03.92-.02 1.35a2.51 2.51 0 0 1-4.98-.52%27%3e%3c/path%3e%3cpath d=%27M3.48 5.57c.12-.83.9-1.43 1.72-1.34.83.11 1.43.88 1.34 1.71m7.75.8h-2.52m0-2.51 1.69-1.69m-1.69 6.72 1.69 1.68%27%3e%3c/path%3e%3c/g%3e%3c/svg%3e")',
        matchers: [/quiet/i, /low noise/i],
    },
    {
        id: 'collaborative',
        label: 'Collaborative space',
        description: 'Work together with your team.',
        icon: GroupsIcon,
        IconSvg:
            'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23000%27%3e%3cg fill=%27none%27 stroke=%27%2351247A%27 stroke-width=%27.75%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpath d=%27M5.914 11.344 4.23 12.602v-2.516H2.543a.829.829 0 0 1-.828-.828V2.543c0-.457.37-.828.828-.828h9.227a.83.83 0 0 1 .832.828v2.516M4.23 4.23h5.856M4.23 6.742h1.684%27%3e%3c/path%3e%3cpath d=%27M14.285 11.77h-1.683v2.515l-2.516-2.515H7.57V6.742h6.715zm-1.683-3.34H9.258m3.344 1.656H9.258%27%3e%3c/path%3e%3c/g%3e%3c/svg%3e")',
        matchers: [/collaborative/i, /group/i, /communal/i],
    },
    {
        id: 'computer',
        label: 'Computer access',
        description: 'Access library computers and software.',
        icon: ComputerIcon,
        IconSvg:
            'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23000%27%3e%3cpath fill=%27none%27 stroke=%27%2351247A%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%27.75%27 d=%27M13.03 9.14V3.7a.83.83 0 0 0-.83-.83H3.8a.83.83 0 0 0-.83.83v5.45zm1.17 2.6c.2.43 0 .92-.43 1.12a.73.73 0 0 1-.34.08H2.54a.83.83 0 0 1-.83-.83c0-.11.03-.22.1-.34l1.16-2.6h10.06zm-7.03-.51h1.69%27%3e%3c/path%3e%3c/svg%3e")',
        matchers: [/computer/i, /byod/i],
    },
    {
        id: 'bookable',
        label: 'Bookable room',
        description: 'Reserve a private or group meeting room.',
        icon: MeetingRoomIcon,
        IconSvg:
            'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23000%27%3e%3cg stroke=%27%2351247A%27 stroke-width=%27.75%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpath d=%27M2.543 3.398H13.43a.83.83 0 0 1 .828.832v9.227a.829.829 0 0 1-.828.828H2.543a.829.829 0 0 1-.828-.828V4.23a.83.83 0 0 1 .828-.832zm-.828 3.344h12.57M5.059 4.656V1.715m5.882 2.941V1.715%27 fill=%27none%27%3e%3c/path%3e%3cpath d=%27M4.43 8.828c-.118 0-.2.086-.2.2 0 .117.082.202.2.202a.196.196 0 0 0 .199-.203c.027-.086-.086-.199-.2-.199zm0 2.942c-.118 0-.2.085-.2.203 0 .113.082.199.2.199a.195.195 0 0 0 .199-.2.196.196 0 0 0-.2-.202zM8 8.828c-.113 0-.2.086-.2.2 0 .117.087.202.2.202.113 0 .2-.085.2-.203 0-.086-.087-.199-.2-.199zm0 2.942c-.113 0-.2.085-.2.203 0 .113.087.199.2.199.113 0 .2-.086.2-.2a.196.196 0 0 0-.2-.202zm3.57-2.942a.195.195 0 0 0-.199.2c0 .117.086.202.2.202a.194.194 0 0 0 .199-.203c0-.086-.083-.199-.2-.199zm0 2.942a.196.196 0 0 0-.199.203c0 .113.086.199.2.199a.194.194 0 0 0 .199-.2.194.194 0 0 0-.2-.202zm0 0%27%3e%3c/path%3e%3c/g%3e%3c/svg%3e")',
        matchers: [/bookable/i, /meeting room/i, /training room/i],
    },
    {
        id: 'postgrad',
        label: 'Postgraduate space',
        description: 'Dedicated spaces for research and higher-degree study.',
        icon: PersonIcon,
        IconSvg:
            'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23000%27%3e%3cg fill=%27none%27 stroke=%27%2351247A%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%27.75%27%3e%3cpath d=%27M10.94 4.66a2.94 2.94 0 1 1-5.88 0V1.7h5.85v2.95zm-8.4 9.63a5.46 5.46 0 0 1 10.92 0M1.71 1.71H14.3M5.06 4.23h5.85M2.54 1.71v4.2%27%3e%3c/path%3e%3cpath d=%27M5.2 9.6 8 11.77l2.8-2.17%27%3e%3c/path%3e%3c/g%3e%3c/svg%3e")',
        matchers: [/postgraduate/i],
    },
    {
        id: 'av',
        label: 'AV equipment',
        description: 'Spaces equipped with screens, projectors and audio.',
        icon: TvIcon,
        IconSvg:
            'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27 fill=%27%23000%27%3e%3cg fill=%27none%27 stroke=%27%2351247A%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%27.75%27%3e%3cpath d=%27M3.8 10.09h8.37m-2.08 4.2H5.9l-.43-4.2h5.04zM8 4.23c.8 0 1.46.66 1.46 1.46a1.46 1.46 0 0 1-2.92 0c0-.8.66-1.46 1.46-1.46zm1.83 4.2a2.4 2.4 0 0 0-3.37-.26c-.09.09-.2.17-.26.26%27%3e%3c/path%3e%3cpath d=%27M3.8 8.43H2.54a.83.83 0 0 1-.83-.83V2.54c0-.45.38-.83.83-.83h10.89c.48 0 .86.38.86.83v5.03c0 .46-.38.83-.83.83H12.2%27%3e%3c/path%3e%3c/g%3e%3c/svg%3e")',
        matchers: [/av equipment/i],
    },
];

const favouriteIntentDefinition = {
    id: 'favourite',
    label: 'Favourite spaces',
    description: 'Start with spaces you have already saved to your favourites.',
    icon: FavoriteIcon,
    matchers: [],
};

const findSpaceById = (spaces, targetSpaceId) => {
    if (!targetSpaceId) return null;
    return (
        spaces?.find(space => {
            const spaceUuid = space?.space_uuid;
            const spaceId = space?.space_id;
            return String(spaceUuid || '') === String(targetSpaceId) || String(spaceId || '') === String(targetSpaceId);
        }) || null
    );
};

const getSpaceIdentifier = space => space?.space_uuid || space?.space_id || null;

const getIntentFilterIds = (facilityGroups, intent) => {
    const ids = [];
    facilityGroups?.forEach(group => {
        group?.facility_type_children?.forEach(child => {
            const name = child?.facility_type_name || '';
            if (intent?.matchers?.some(matcher => matcher.test(name))) {
                ids.push(child?.facility_type_id);
            }
        });
    });
    return ids;
};

const SpaceItemCard = ({
    space,
    setSelectedSpace,
    navigateToView,
    selectedIntentId,
    favouriteSpaceIds,
    weeklyHours,
    weeklyHoursLoading,
    weeklyHoursError,
}) => {
    const theme = useTheme();
    const visibleOutage = getVisibleSpaceOutage(space?.space_outages);
    return (
        <>
            <StyledResultCardLink
                data-testid={`spaces-result-list-item-${space.space_id}`}
                to={serialiseJourneyUrl({
                    view: 'results',
                    intentId: getSpaceIdentifier(space).id,
                })}
                onClick={() => {
                    setSelectedSpace(space);
                    navigateToView('details', {
                        intentId: selectedIntentId,
                        spaceId: getSpaceIdentifier(space),
                    });
                }}
            >
                <Stack sx={{ p: '1.5rem', textAlign: 'left' }}>
                    <Typography component="h3" data-testid={`space-journey-result-item-${space?.space_id}-name`}>
                        {space?.space_name}
                    </Typography>
                    <Typography
                        className="resultBody"
                        sx={{ mb: 0.5 }}
                        data-testid={`space-journey-result-item-${space?.space_id}-library-name`}
                    >
                        {space?.space_library_name}
                    </Typography>
                    <Typography
                        className="resultBody"
                        data-testid={`space-journey-result-item-${space?.space_id}-space-type`}
                    >
                        {space?.space_type_details?.space_type_name || space?.space_type}
                    </Typography>
                    <Box
                        sx={{
                            mb: space?.space_type_details?.space_type_description || space?.space_description ? 1 : 0,
                            mt: 0.5,
                        }}
                    >
                        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                            {favouriteSpaceIds.has(String(space?.space_id)) && (
                                <Chip
                                    data-testid={`spaces-journey-result-item-${space?.space_id}-favourite-chip`}
                                    label="Favourite"
                                    size="small"
                                    sx={{
                                        backgroundColor: '#fff8e1',
                                        color: '#7a5a00',
                                        borderColor: '#ffe082',
                                        border: '1px solid',
                                        fontWeight: 700,
                                        fontSize: '1rem',
                                    }}
                                />
                            )}
                            <SpaceOpenStatusChip
                                space={space}
                                weeklyHours={weeklyHours}
                                weeklyHoursLoading={weeklyHoursLoading}
                                weeklyHoursError={weeklyHoursError}
                                chipStyles={chipStyles}
                            />
                            {!!visibleOutage && visibleOutage.status !== 'Current' && (
                                <Chip
                                    data-testid={`spaces-journey-result-item-${space?.space_id}-outage-chip`}
                                    label="Upcoming closure"
                                    size="small"
                                    sx={{
                                        ...chipStyles,
                                        ...defaultChipStyles(theme),
                                        backgroundColor: theme.palette.designSystem.alert.warning,
                                        fontWeight: 700,
                                    }}
                                />
                            )}
                        </Stack>
                    </Box>
                    {!!space?.space_type_details?.space_type_description && (
                        <Typography
                            className="resultBody"
                            data-testid={`spaces-journey-result-item-${space?.space_id}-space-type-description`}
                            sx={{
                                mb: space?.space_description ? 0.75 : 0,
                            }}
                        >
                            {space.space_type_details.space_type_description}
                        </Typography>
                    )}
                    {!!space?.space_description && (
                        <Typography
                            className="resultBody"
                            sx={{ fontStyle: 'italic' }}
                            data-testid={`spaces-journey-result-item-${space?.space_id}-description`}
                        >
                            {String(space.space_description)
                                .replace(/<[^>]*>/g, ' ')
                                .trim()}
                        </Typography>
                    )}
                </Stack>
            </StyledResultCardLink>
        </>
    );
};
SpaceItemCard.propTypes = {
    space: PropTypes.object,
    setSelectedSpace: PropTypes.func,
    navigateToView: PropTypes.func,
    selectedIntentId: PropTypes.any,
    favouriteSpaceIds: PropTypes.any,
    weeklyHours: PropTypes.any,
    weeklyHoursLoading: PropTypes.bool,
    weeklyHoursError: PropTypes.any,
};

const BookableSpacesJourney = ({
    filteredSpaceLocations,
    allSpaceLocations,
    totalSpaceCount,
    highlightedSpace,
    isLoggedIn,
    spacesFavouritesList,
    servicesAndSpacesArticles,
    selectedFacilityTypes,
    setSelectedFacilityTypes,
    filteredFacilityTypeList,
    facilityTypeList,
    facilityTypeListLoading,
    facilityTypeListError,
    minimumSpaceCapacity,
    maximumSpaceCapacity,
    capacityFilterValue,
    setCapacityFilterValue,
    campusList,
    selectedCampus,
    handleCampusSelection,
    activeFilterCount,
    librariesForCampus,
    selectedLibrary,
    handleLibrarySelection,
    weeklyHours,
    weeklyHoursLoading,
    weeklyHoursError,
    onFavouriteToggle,
    isFavouriteActionInProgress,
}) => {
    const theme = useTheme();
    const isDesktopResultsLayout = useMediaQuery(theme.breakpoints.up('lg'));
    const journeyTopRef = React.useRef(null);
    const [view, setView] = React.useState('landing');
    const [selectedIntentId, setSelectedIntentId] = React.useState(null);
    const [selectedSpace, setSelectedSpace] = React.useState(null);
    const [showAdvancedFilters, setShowAdvancedFilters] = React.useState(false);
    const canShowAdvancedFilters = view === 'results';
    const shouldShowAdvancedFilters = canShowAdvancedFilters && (isDesktopResultsLayout || showAdvancedFilters);
    const hasFavourites = isLoggedIn && (spacesFavouritesList?.length || 0) > 0;

    const availableIntentDefinitions = React.useMemo(
        () => (hasFavourites ? [favouriteIntentDefinition, ...intentDefinitions] : intentDefinitions),
        [hasFavourites],
    );

    const selectedIntent = availableIntentDefinitions.find(intent => intent.id === selectedIntentId) || null;
    const favouriteSpaceIds = React.useMemo(
        () => new Set((spacesFavouritesList || []).map(favourite => String(favourite?.space_id))),
        [spacesFavouritesList],
    );
    const validCampusList = React.useMemo(
        () =>
            (campusList || []).filter(campus => {
                const hasId = campus?.campus_id !== null && campus?.campus_id !== undefined;
                const hasName = typeof campus?.campus_name === 'string' && campus.campus_name.trim().length > 0;
                const hasSpaces = Number(campus?.campus_space_count) > 0;
                return hasId && hasName && hasSpaces;
            }),
        [campusList],
    );
    const validCampusIds = React.useMemo(
        () => new Set(validCampusList.map(campus => String(campus.campus_id))),
        [validCampusList],
    );
    const intentSpaceLocations = React.useMemo(() => {
        const spacesWithIntentApplied =
            selectedIntentId !== favouriteIntentDefinition.id
                ? filteredSpaceLocations || []
                : (filteredSpaceLocations || []).filter(space => favouriteSpaceIds.has(String(space?.space_id)));

        // Exclude orphaned spaces with no valid campus assignment from journey results.
        if (validCampusIds.size === 0) {
            return spacesWithIntentApplied;
        }

        return spacesWithIntentApplied.filter(space => validCampusIds.has(String(space?.space_campus_id)));
    }, [filteredSpaceLocations, favouriteSpaceIds, selectedIntentId, validCampusIds]);
    const isSelectedSpaceFavourite = favouriteSpaceIds.has(String(selectedSpace?.space_id));
    const handleJourneyFavouriteToggle = async space => {
        if (!space?.space_id || !onFavouriteToggle || !isLoggedIn) {
            return;
        }
        const action = favouriteSpaceIds.has(String(space.space_id)) ? 'removeSpaceFavourite' : 'addSpaceFavourite';
        await onFavouriteToggle(action, space.space_id);
    };
    let favouriteButtonLabel = 'Add to favourites';
    if (isSelectedSpaceFavourite) {
        favouriteButtonLabel = 'Remove from favourites';
    }
    if (isFavouriteActionInProgress) {
        favouriteButtonLabel = 'Updating favourites...';
    }
    React.useEffect(() => {
        if (!canShowAdvancedFilters) {
            setShowAdvancedFilters(false);
            return;
        }

        if (isDesktopResultsLayout) {
            setShowAdvancedFilters(true);
        }
    }, [canShowAdvancedFilters, isDesktopResultsLayout]);

    const lastAppliedIntentIdRef = React.useRef(null);

    const applyIntentFilters = React.useCallback(
        intent => {
            const ids = getIntentFilterIds(filteredFacilityTypeList?.data?.facility_type_groups, intent);
            if (!selectedFacilityTypes?.length) return;
            const nextFilters = selectedFacilityTypes.map(filter => ({
                ...filter,
                selected: ids.includes(filter.facility_type_id),
                unselected: false,
            }));
            lastAppliedIntentIdRef.current = intent?.id || null;
            setSelectedFacilityTypes(nextFilters);
        },
        [filteredFacilityTypeList, selectedFacilityTypes, setSelectedFacilityTypes],
    );

    // Keep browser history and journey views aligned so browser Back stays inside journey steps.
    const journeyHistoryRef = React.useRef(['landing']);

    const buildHistoryState = React.useCallback((nextView, nextIntentId = null, nextSpaceId = null) => {
        return {
            journeyView: nextView,
            journeyIntentId: nextIntentId,
            journeySpaceId: nextSpaceId ? String(nextSpaceId) : null,
        };
    }, []);

    const writeJourneyHistory = React.useCallback(
        ({ nextView, nextIntentId = null, nextSpaceId = null, method = 'replaceState' }) => {
            const nextUrl = serialiseJourneyUrl({
                view: nextView,
                intentId: nextIntentId,
                spaceId: nextSpaceId,
            });
            const nextState = buildHistoryState(nextView, nextIntentId, nextSpaceId);

            window.history[method](nextState, '', nextUrl);
        },
        [buildHistoryState],
    );

    const navigateToView = React.useCallback(
        (
            nextView,
            { pushHistory = true, intentId = selectedIntentId, spaceId = getSpaceIdentifier(selectedSpace) } = {},
        ) => {
            if (!JOURNEY_VIEWS.includes(nextView)) {
                return;
            }

            const currentHistory = journeyHistoryRef.current;
            const lastView = currentHistory[currentHistory.length - 1];
            if (nextView === lastView) {
                setView(nextView);
                return;
            }

            currentHistory.push(nextView);
            if (pushHistory) {
                writeJourneyHistory({
                    nextView,
                    nextIntentId: intentId,
                    nextSpaceId: spaceId,
                    method: 'pushState',
                });
            }
            setView(nextView);
        },
        [selectedIntentId, selectedSpace, writeJourneyHistory],
    );

    const goToLegacyBrowse = () => {
        const url = new URL(window.location.href);
        const encodedMapFilters = serialiseJourneyMapFilterState({
            selectedFacilityTypes,
            selectedCampus,
            selectedLibrary,
            capacityFilterValue,
        });
        // The advanced/map view is reached by adding ?advanced=1
        // Support both standard query params and hash-router query params (#/path?param=val)
        if (url.hash.includes('?')) {
            const [hashPath, hashQuery] = url.hash.split('?');
            const hashParams = new URLSearchParams(hashQuery);
            hashParams.set('advanced', '1');
            hashParams.set('mapFilters', encodedMapFilters);
            hashParams.set('autoSelectFirstSpace', '1');
            url.hash = `${hashPath}?${hashParams.toString()}`;
        } else {
            url.searchParams.set('advanced', '1');
            url.searchParams.set('mapFilters', encodedMapFilters);
            url.searchParams.set('autoSelectFirstSpace', '1');
        }
        window.location.assign(url.toString());
    };

    const handleIntentSelect = intent => {
        setSelectedIntentId(intent.id);
        setSelectedSpace(null);
        if (intent.id === favouriteIntentDefinition.id) {
            const clearedFilters = (selectedFacilityTypes || []).map(filter => ({
                ...filter,
                selected: false,
                unselected: false,
            }));
            lastAppliedIntentIdRef.current = null;
            setSelectedFacilityTypes(clearedFilters);
        } else {
            applyIntentFilters(intent);
        }
        navigateToView('results', { intentId: intent.id, spaceId: null });
    };

    const handleClearJourneyFilters = () => {
        const nextFilters = selectedFacilityTypes.map(filter => ({
            ...filter,
            selected: false,
            unselected: false,
        }));
        setSelectedFacilityTypes(nextFilters);
        setSelectedIntentId(null);
        lastAppliedIntentIdRef.current = null;
    };

    const landingHighlights = React.useMemo(
        () =>
            (servicesAndSpacesArticles || []).slice(0, 3).map(article => ({
                title: article?.title || 'Library update',
                description: article?.description || '',
                categories:
                    Array.isArray(article?.categories) && article.categories.length > 0
                        ? article.categories
                        : ['Services and spaces'],
                image: article?.image || journeyFallbackImage,
                imagePosition: 'center',
                canonical_url: article?.canonical_url || null,
            })),
        [servicesAndSpacesArticles],
    );

    const highlightSpaceDescription = React.useMemo(() => {
        if (!highlightedSpace?.space_description) return '';
        return String(highlightedSpace.space_description)
            .replace(/<[^>]*>/g, ' ')
            .replace(/\s{2,}/g, ' ')
            .trim();
    }, [highlightedSpace]);

    React.useEffect(() => {
        const spacesForLookup = [
            ...(Array.isArray(filteredSpaceLocations) ? filteredSpaceLocations : []),
            ...(highlightedSpace ? [highlightedSpace] : []),
        ];
        const parsedState = parseJourneyStateFromUrl(availableIntentDefinitions);

        let nextView = parsedState.view;
        let nextIntentId = parsedState.intentId;
        let nextSelectedSpace = null;

        if (nextView === 'landing' || nextView === 'intent') {
            nextIntentId = null;
        }

        if (nextView === 'details') {
            nextSelectedSpace = findSpaceById(spacesForLookup, parsedState.spaceId);
            if (!nextSelectedSpace) {
                nextView = nextIntentId ? 'results' : 'landing';
            }
        }

        setView(nextView);
        setSelectedIntentId(nextIntentId || null);
        setSelectedSpace(nextSelectedSpace);
        journeyHistoryRef.current = [nextView];

        if (!nextIntentId || nextView !== 'results') {
            lastAppliedIntentIdRef.current = null;
        }

        writeJourneyHistory({
            nextView,
            nextIntentId: nextIntentId || null,
            nextSpaceId: getSpaceIdentifier(nextSelectedSpace) || null,
            method: 'replaceState',
        });
    }, [
        availableIntentDefinitions,
        filteredFacilityTypeList,
        filteredSpaceLocations,
        highlightedSpace,
        selectedFacilityTypes,
        writeJourneyHistory,
    ]);

    React.useEffect(() => {
        if (!selectedIntentId || view !== 'results' || selectedIntentId === favouriteIntentDefinition.id) {
            return;
        }

        const requestedIntent = availableIntentDefinitions.find(intent => intent.id === selectedIntentId) || null;
        if (!requestedIntent || lastAppliedIntentIdRef.current === selectedIntentId) {
            return;
        }

        applyIntentFilters(requestedIntent);
    }, [applyIntentFilters, availableIntentDefinitions, selectedIntentId, view]);

    React.useEffect(() => {
        const historyTop = journeyHistoryRef.current[journeyHistoryRef.current.length - 1];
        if (historyTop !== view) {
            return;
        }

        writeJourneyHistory({
            nextView: view,
            nextIntentId: selectedIntentId,
            nextSpaceId: getSpaceIdentifier(selectedSpace) || null,
            method: 'replaceState',
        });
    }, [selectedIntentId, selectedSpace, view, writeJourneyHistory]);

    React.useEffect(() => {
        const handlePopState = event => {
            const currentHistory = journeyHistoryRef.current;
            const parsedState = parseJourneyStateFromUrl(availableIntentDefinitions);
            let targetView = event?.state?.journeyView || parsedState.view;
            const targetIntentId = event?.state?.journeyIntentId || parsedState.intentId;
            const targetSpaceId = event?.state?.journeySpaceId || parsedState.spaceId;

            if (!JOURNEY_VIEWS.includes(targetView)) {
                return;
            }

            const spacesForLookup = [
                ...(Array.isArray(filteredSpaceLocations) ? filteredSpaceLocations : []),
                ...(highlightedSpace ? [highlightedSpace] : []),
            ];
            let targetSelectedSpace = null;
            if (targetView === 'details') {
                targetSelectedSpace = findSpaceById(spacesForLookup, targetSpaceId);
                if (!targetSelectedSpace) {
                    targetView = targetIntentId ? 'results' : 'landing';
                }
            }

            while (currentHistory.length > 1 && currentHistory[currentHistory.length - 1] !== targetView) {
                currentHistory.pop();
            }

            if (currentHistory[currentHistory.length - 1] !== targetView) {
                currentHistory.push(targetView);
            }

            setSelectedIntentId(targetView === 'results' || targetView === 'details' ? targetIntentId || null : null);
            setSelectedSpace(targetView === 'details' ? targetSelectedSpace : null);
            navigateToView(targetView, { pushHistory: false, intentId: targetIntentId, spaceId: targetSpaceId });
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [availableIntentDefinitions, filteredSpaceLocations, highlightedSpace, navigateToView]);

    React.useEffect(() => {
        if (view === 'details') {
            journeyTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [view]);

    return (
        <StyledJourneyWrapper data-testid="spaces-journey-wrapper" ref={journeyTopRef}>
            <JourneyBreadcrumbs
                view={view}
                selectedIntent={selectedIntent}
                selectedIntentId={selectedIntentId}
                navigateToView={navigateToView}
                setSelectedIntentId={setSelectedIntentId}
                setSelectedSpace={setSelectedSpace}
            />
            {view === 'landing' && (
                <StyledLandingHeroShell>
                    <StyledLandingHeroInner data-testid="spaces-journey-landing-hero-inner">
                        <StyledLandingHeroLayout data-testid="spaces-journey-landing-hero-layout">
                            <StyledLandingHeroContentColumn data-testid="spaces-journey-landing-hero-content-column">
                                <StyledLandingHeroCard data-testid="spaces-journey-landing-hero-card">
                                    <Typography
                                        component="h1"
                                        sx={{
                                            margin: 0,
                                            fontWeight: 400,
                                            lineHeight: 1.12,
                                            fontSize: { xs: '2.05rem', md: '2.8rem' },
                                            letterSpacing: '-0.02em',
                                        }}
                                    >
                                        Find study spaces
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            mt: 2,
                                            maxWidth: '30rem',
                                            color: 'rgba(255, 255, 255, 0.88)',
                                            lineHeight: 1.7,
                                            fontSize: { xs: '1rem', md: '1.08rem' },
                                        }}
                                    >
                                        Discover study space options across UQ libraries.
                                    </Typography>
                                </StyledLandingHeroCard>
                            </StyledLandingHeroContentColumn>
                            <StyledLandingHeroVisual
                                data-testid="spaces-journey-landing-hero-visual"
                                aria-hidden="true"
                            />
                        </StyledLandingHeroLayout>
                    </StyledLandingHeroInner>
                </StyledLandingHeroShell>
            )}
            <StandardPage standardPageId="spaces-journey-content-standard-page">
                {/* personalised content — only visible on landing when logged in */}
                {view === 'landing' && isLoggedIn && (spacesFavouritesList || []).length > 0 && (
                    <>
                        <Box
                            className="spaces-journey-favourites"
                            sx={{
                                mb: 3,
                                pt: '64px',
                                // '& a[data-testid^="spaces-journey-favourite-card-"]:hover': {
                                //     backgroundColor: '#fff !important',
                            }}
                        >
                            <StyledHeaderWithLinkToAllGridItem item xs={12}>
                                <Typography component={'h2'}>Your favourite spaces</Typography>
                                <StyledSeeAllLink
                                    data-testid="spaces-homepage-favourites-all-link"
                                    to={serialiseJourneyUrl({
                                        view: 'results',
                                        intentId: favouriteIntentDefinition.id,
                                    })}
                                    onClick={e => {
                                        e.preventDefault();
                                        setSelectedIntentId(favouriteIntentDefinition.id);
                                        navigateToView('results', { intentId: favouriteIntentDefinition.id });
                                    }}
                                >
                                    See all favourites
                                </StyledSeeAllLink>
                            </StyledHeaderWithLinkToAllGridItem>
                            <StyledFavouritesContainerGrid
                                component={'ul'}
                                container
                                spacing={3}
                                data-testid="spaces-homepage-favourites-block"
                            >
                                {(() => {
                                    // Build lookup of available spaces for resolving favourites.
                                    // This homepage-only block should ignore the current campus filter so
                                    // favourites remain visible on the landing page regardless of campus.
                                    const fullSpaceLookup = [
                                        ...(Array.isArray(allSpaceLocations) ? allSpaceLocations : []),
                                        ...(Array.isArray(filteredSpaceLocations) ? filteredSpaceLocations : []),
                                        ...(highlightedSpace ? [highlightedSpace] : []),
                                    ];
                                    const uniq = new Map();
                                    (spacesFavouritesList || []).forEach(f => {
                                        const candidateId = f?.space_id || f?.favourite_id || null;
                                        if (!candidateId) return;
                                        const resolved = findSpaceById(fullSpaceLookup, candidateId);
                                        if (!resolved) return; // exclude favourites that don't resolve to a known space
                                        if (!uniq.has(String(resolved.space_id))) {
                                            uniq.set(String(resolved.space_id), f);
                                        }
                                    });
                                    const favouritesToShow = Array.from(uniq.values()).slice(0, 3);
                                    return favouritesToShow.map((fav, idx) => {
                                        const space = findSpaceById(fullSpaceLookup, fav?.space_id) || null;
                                        const landingSpaceId = space?.space_id || fav?.space_id;
                                        const landingUrl = serialiseJourneyUrl({
                                            view: 'details',
                                            intentId: selectedIntentId,
                                            spaceId: getSpaceIdentifier(space) || landingSpaceId,
                                        });
                                        return (
                                            <SingleLinkCard
                                                key={fav?.space_id || `fav-${idx}`}
                                                testId={`spaces-journey-favourite-card-${idx + 1}`}
                                                cardHeading={space?.space_name || fav?.label || String(fav?.space_id)}
                                                sx={{
                                                    marginBottom: '0px !important',
                                                    pr: { xs: '10px' },
                                                    pl: { xs: 0 },
                                                }}
                                                landingUrl={landingUrl}
                                                shortParagraph={space?.space_library_name || ''}
                                                fillContainer
                                                showH3
                                                onClick={() => {
                                                    if (space) {
                                                        setSelectedSpace(space);
                                                        navigateToView('details', {
                                                            intentId: selectedIntentId,
                                                            spaceId: getSpaceIdentifier(space),
                                                        });
                                                    } else {
                                                        const nextSpaceId = space?.space_id || fav?.space_id;
                                                        const nextUrl = serialiseJourneyUrl({
                                                            view: 'details',
                                                            intentId: selectedIntentId,
                                                            spaceId: getSpaceIdentifier(space) || nextSpaceId,
                                                        });
                                                        window.history.pushState(
                                                            {
                                                                journeyView: 'details',
                                                                journeyIntentId: selectedIntentId,
                                                                journeySpaceId: String(
                                                                    getSpaceIdentifier(space) || nextSpaceId,
                                                                ),
                                                            },
                                                            '',
                                                            nextUrl,
                                                        );
                                                    }
                                                }}
                                            />
                                        );
                                    });
                                })()}
                            </StyledFavouritesContainerGrid>
                        </Box>
                    </>
                )}
                {view === 'landing' && (
                    <Box
                        className="spaces-journey-favourites"
                        sx={{
                            mb: 3,
                            pt: !isLoggedIn ? '32px' : '0px',
                            // '& a[data-testid^="spaces-journey-favourite-card-"]:hover': {
                            //     backgroundColor: '#fff !important',
                        }}
                    >
                        <StyledHeaderWithLinkToAllGridItem item xs={12}>
                            <Typography
                                component={'h2'}
                                sx={{ fontSize: '32px', fontWeight: 500, marginBottom: '16px' }}
                            >
                                Find a study space
                            </Typography>
                            <StyledSeeAllLink
                                to={serialiseJourneyUrl({ view: 'results' })}
                                onClick={e => {
                                    e.preventDefault();
                                    navigateToView('results');
                                }}
                                data-testid="spaces-journey-showall"
                            >
                                View all spaces
                            </StyledSeeAllLink>
                        </StyledHeaderWithLinkToAllGridItem>
                        <Grid
                            container
                            spacing={3}
                            sx={{
                                mt: '-24px',
                                '& li.MuiGrid-item': {
                                    pt: 0,
                                },
                                '& a': {
                                    boxSizing: 'border-box',
                                    width: '100%',
                                    minWidth: { xs: 0, sm: 'auto' },
                                },
                            }}
                        >
                            {(() => {
                                const intentsToShow = (availableIntentDefinitions || []).filter(
                                    intent => intent && intent.id !== favouriteIntentDefinition.id,
                                );
                                return intentsToShow.map((intent, idx) => {
                                    const landingUrl = serialiseJourneyUrl({ view: 'results', intentId: intent.id });
                                    return (
                                        <SingleLinkCard
                                            key={intent.id || `intent-${idx}`}
                                            testId={`spaces-journey-intent-card-${intent.id || idx}`}
                                            iconBackgroundImage={intent.IconSvg || null}
                                            cardHeading={intent.label}
                                            landingUrl={landingUrl}
                                            shortParagraph={intent.description || ''}
                                            fillContainer
                                            sx={{ pr: { xs: '10px' }, pl: { xs: 0 } }}
                                            onClick={() => handleIntentSelect(intent)}
                                            showH3
                                        />
                                    );
                                });
                            })()}
                        </Grid>
                        <StyledBrowseAllSpacesCard data-testid="spaces-journey-browse-all-card">
                            <StyledBrowseAllSpacesIcon aria-hidden="true" />
                            <Typography
                                component="h3"
                                sx={{
                                    margin: '0.75rem 0 0',
                                    fontSize: { xs: '1.5rem', md: '1.75rem' },
                                    lineHeight: 1.2,
                                    fontWeight: 500,
                                    color: '#19191c',
                                }}
                            >
                                Browse all spaces
                            </Typography>
                            <Typography
                                component="p"
                                sx={{
                                    mt: 1,
                                    mb: 0,
                                    fontSize: { xs: '1rem', md: '1.1rem' },
                                    lineHeight: 1.5,
                                    color: '#35353a',
                                }}
                            >
                                Explore all library study spaces on the map!
                            </Typography>
                            <StyledBrowseAllSpacesLink
                                data-testid="spaces-journey-landing-browse-all"
                                type="button"
                                onClick={goToLegacyBrowse}
                            >
                                Browse all library study spaces
                            </StyledBrowseAllSpacesLink>
                        </StyledBrowseAllSpacesCard>
                    </Box>
                )}
                <StyledJourneyPanel data-testid="spaces-homepage-content" hasTopSpacing={view !== 'landing'}>
                    <Stack direction="row" justifyContent="flex-start" alignItems="center">
                        {canShowAdvancedFilters && !isDesktopResultsLayout && (
                            <StyledSecondaryButton
                                startIcon={<TuneIcon />}
                                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                sx={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    ...(showAdvancedFilters
                                        ? {
                                              backgroundColor: 'primary.main',
                                              color: '#fff',
                                              borderColor: 'primary.main',
                                              '&:hover, &:focus': {
                                                  backgroundColor: 'primary.main',
                                                  color: '#fff',
                                                  borderColor: 'primary.main',
                                              },
                                          }
                                        : {}),
                                }}
                                aria-label={
                                    activeFilterCount > 0
                                        ? `Advanced filters, ${activeFilterCount} filter${
                                              activeFilterCount === 1 ? '' : 's'
                                          } applied`
                                        : 'Advanced filters'
                                }
                            >
                                Advanced filters
                                {activeFilterCount > 0 && (
                                    <Box
                                        component="span"
                                        sx={{
                                            minWidth: '1.35rem',
                                            height: '1.35rem',
                                            px: 0.45,
                                            borderRadius: '999px',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            lineHeight: 1,
                                            backgroundColor: showAdvancedFilters ? '#fff' : '#51247a',
                                            color: showAdvancedFilters ? '#51247a' : '#fff',
                                        }}
                                    >
                                        {activeFilterCount}
                                    </Box>
                                )}
                            </StyledSecondaryButton>
                        )}
                    </Stack>

                    {view === 'landing' && (
                        <Stack spacing={3}>
                            <Box
                                sx={{
                                    display: 'grid',
                                    gap: '1.5rem',
                                    gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
                                    alignItems: 'stretch',
                                }}
                            >
                                {landingHighlights.map((item, index) => (
                                    <ArticleCard
                                        key={item.canonical_url || item.title || index}
                                        article={item}
                                        articleindex={index}
                                        cardId={`spaces-journey-landing-feature-card-${index + 1}`}
                                        linkTestId={`spaces-journey-landing-feature-link-${index + 1}`}
                                        imageTestId={`spaces-journey-landing-feature-image-${index + 1}`}
                                        contentTestId={`spaces-journey-landing-feature-content-${index + 1}`}
                                        eyebrowTestId={`spaces-journey-landing-feature-eyebrow-${index + 1}`}
                                        titleTestId={`spaces-journey-landing-feature-title-${index + 1}`}
                                        textTestId={`spaces-journey-landing-feature-text-${index + 1}`}
                                    />
                                ))}
                            </Box>

                            {!!highlightedSpace && (
                                <StyledLandingHighlightPanel data-testid="spaces-journey-landing-highlight-panel">
                                    <StyledLandingHighlightPanelMedia
                                        aria-hidden="true"
                                        sx={
                                            highlightedSpace?.space_photo_url
                                                ? {
                                                      backgroundImage:
                                                          'linear-gradient(140deg, rgba(18, 10, 29, 0.22) 0%, rgba(18, 10, 29, 0.6) 72%, rgba(18, 10, 29, 0.78) 100%), url(' +
                                                          highlightedSpace.space_photo_url +
                                                          '), url(' +
                                                          journeyFallbackImage +
                                                          ')',
                                                      backgroundSize: 'cover',
                                                      backgroundPosition: 'center',
                                                  }
                                                : undefined
                                        }
                                    />
                                    <Grid
                                        container
                                        spacing={2.5}
                                        alignItems="stretch"
                                        sx={{
                                            position: 'relative',
                                            zIndex: 1,
                                            width: '100%',
                                            [theme.breakpoints.down('lg')]: {
                                                margin: 0,
                                                width: '100%',
                                            },
                                        }}
                                    >
                                        <Grid
                                            item
                                            xs={12}
                                            lg={7}
                                            data-testid="spaces-journey-landing-highlight-primary"
                                            sx={{
                                                [theme.breakpoints.down('lg')]: {
                                                    pl: '0 !important',
                                                    pr: '0 !important',
                                                },
                                            }}
                                        >
                                            <StyledLandingHighlightTextCard data-testid="spaces-journey-landing-highlight-text-card">
                                                <Typography
                                                    component="h3"
                                                    variant="h6"
                                                    data-testid="spaces-journey-landing-highlight-title"
                                                    sx={{
                                                        fontWeight: 700,
                                                        mb: 0.8,
                                                        color: '#fff',
                                                    }}
                                                >
                                                    Study Space highlight
                                                </Typography>
                                                {!!highlightedSpace?.space_name && (
                                                    <Typography
                                                        component="h4"
                                                        variant="subtitle1"
                                                        data-testid="spaces-journey-landing-highlight-space-name"
                                                        sx={{
                                                            fontWeight: 600,
                                                            mb: 0.8,
                                                            color: 'rgba(255,255,255,0.88)',
                                                        }}
                                                    >
                                                        {highlightedSpace.space_name}
                                                        {!!highlightedSpace.space_library_name &&
                                                            ' — ' + highlightedSpace.space_library_name}
                                                    </Typography>
                                                )}
                                                {!!highlightedSpace && (
                                                    <Box sx={{ mb: 1.2 }}>
                                                        <SpaceOpenStatusChip
                                                            space={highlightedSpace}
                                                            weeklyHours={weeklyHours}
                                                            weeklyHoursLoading={weeklyHoursLoading}
                                                            weeklyHoursError={weeklyHoursError}
                                                            chipStyles={chipStyles}
                                                        />
                                                    </Box>
                                                )}
                                                {!!highlightedSpace?.space_type_details?.space_type_description && (
                                                    <Typography
                                                        variant="body2"
                                                        data-testid="spaces-journey-landing-highlight-body-1"
                                                        sx={{ color: 'rgba(255,255,255,0.9)', lineHeight: 1.6, mb: 1 }}
                                                    >
                                                        {highlightedSpace.space_type_details.space_type_description}
                                                    </Typography>
                                                )}
                                                {!!highlightSpaceDescription && (
                                                    <Typography
                                                        variant="body2"
                                                        data-testid="spaces-journey-landing-highlight-body-2"
                                                        sx={{
                                                            color: 'rgba(255,255,255,0.82)',
                                                            lineHeight: 1.55,
                                                            mb: 1.5,
                                                        }}
                                                    >
                                                        {highlightSpaceDescription}
                                                    </Typography>
                                                )}
                                                <Button
                                                    data-testid="spaces-journey-landing-highlight-view-space"
                                                    variant="contained"
                                                    onClick={() => {
                                                        setSelectedSpace(highlightedSpace);
                                                        navigateToView('details', {
                                                            intentId: selectedIntentId,
                                                            spaceId: getSpaceIdentifier(highlightedSpace),
                                                        });
                                                    }}
                                                    sx={{
                                                        textTransform: 'none',
                                                        alignSelf: 'flex-start',
                                                        backgroundColor: '#fff',
                                                        color: '#51247a',
                                                        fontWeight: 700,
                                                        '&:hover': { backgroundColor: '#f3ebff' },
                                                    }}
                                                >
                                                    View this space
                                                </Button>
                                            </StyledLandingHighlightTextCard>
                                        </Grid>
                                        <Grid
                                            item
                                            xs={12}
                                            lg={5}
                                            data-testid="spaces-journey-landing-highlight-secondary"
                                            sx={{
                                                [theme.breakpoints.down('lg')]: {
                                                    pl: '0 !important',
                                                    pr: '0 !important',
                                                },
                                            }}
                                        >
                                            <Box
                                                data-testid="spaces-journey-landing-highlight-offered-box"
                                                sx={{
                                                    backgroundColor: '#ffffff',
                                                    border: '1px solid #ddd8e4',
                                                    borderRadius: '4px',
                                                    p: '1rem',
                                                    height: '100%',
                                                    boxSizing: 'border-box',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                }}
                                            >
                                                <StyledLandingHighlightAsideContent data-testid="spaces-journey-landing-highlight-offered-content">
                                                    <Typography
                                                        component="h4"
                                                        variant="subtitle1"
                                                        data-testid="spaces-journey-landing-highlight-offered-title"
                                                        sx={{ fontWeight: 700, mb: 1 }}
                                                    >
                                                        What's offered here
                                                    </Typography>
                                                    {highlightedSpace?.facility_types?.length > 0 ? (
                                                        <Box
                                                            data-testid="spaces-journey-landing-highlight-offered-chips"
                                                            sx={{
                                                                display: 'flex',
                                                                flexWrap: 'wrap',
                                                                gap: '0.5rem',
                                                                mt: 0.5,
                                                            }}
                                                        >
                                                            {highlightedSpace.facility_types.map(ft => (
                                                                <Chip
                                                                    key={ft.facility_type_id}
                                                                    label={ft.facility_type_name}
                                                                    size="small"
                                                                    variant="outlined"
                                                                    sx={{
                                                                        borderColor: '#c9bfdf',
                                                                        color: '#51247a',
                                                                        fontSize: '0.8rem',
                                                                    }}
                                                                />
                                                            ))}
                                                        </Box>
                                                    ) : (
                                                        <Typography
                                                            variant="body2"
                                                            sx={{ color: '#4f4d57', mt: 0.5 }}
                                                            data-testid="spaces-journey-landing-highlight-offered-empty"
                                                        >
                                                            No facilities listed for this space.
                                                        </Typography>
                                                    )}
                                                </StyledLandingHighlightAsideContent>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </StyledLandingHighlightPanel>
                            )}
                        </Stack>
                    )}

                    {/* {view === 'intent' && (
                        <>
                            <Typography component="h2" variant="h5" sx={{ fontWeight: 700, color: '#1f1230' }}>
                                What sort of space would you like to find?
                            </Typography>
                            <Grid container spacing={3}>
                                {availableIntentDefinitions.map(intent => {
                                    const IconComponent = intent.icon;
                                    return (
                                        <Grid item xs={12} sm={6} md={4} key={intent.id}>
                                            <StyledIntentCard onClick={() => handleIntentSelect(intent)}>
                                                <Box className="panelBodyWrapper">
                                                    <Box>
                                                        <Box className="panelIcon">
                                                            <IconComponent />
                                                        </Box>
                                                        <Typography component="h3" className="cardHeading">
                                                            {intent.label}
                                                        </Typography>
                                                        <Typography className="intentDescription">
                                                            {intent.description}
                                                        </Typography>
                                                    </Box>
                                                    <Box className="arrowSvgWrapper">
                                                        <UqArrowForwardIcon />
                                                    </Box>
                                                </Box>
                                            </StyledIntentCard>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </>
                    )} */}

                    {view === 'results' && (
                        <>
                            <StyledResultsSplitLayout>
                                {shouldShowAdvancedFilters && (
                                    <StyledResultsSidebarPanel>
                                        <SidebarFilters
                                            facilityTypeList={facilityTypeList}
                                            facilityTypeListLoading={facilityTypeListLoading}
                                            facilityTypeListError={facilityTypeListError}
                                            selectedFacilityTypes={selectedFacilityTypes}
                                            setSelectedFacilityTypes={setSelectedFacilityTypes}
                                            filteredFacilityTypeList={filteredFacilityTypeList}
                                            suppliedClassName="journeyFilterSidebar"
                                            minimumSpaceCapacity={minimumSpaceCapacity}
                                            maximumSpaceCapacity={maximumSpaceCapacity}
                                            capacityFilterValue={capacityFilterValue}
                                            setCapacityFilterValue={setCapacityFilterValue}
                                            campusList={campusList}
                                            selectedCampus={selectedCampus}
                                            handleCampusSelection={handleCampusSelection}
                                            activeFilterCount={activeFilterCount}
                                            librariesForCampus={librariesForCampus}
                                            selectedLibrary={selectedLibrary}
                                            handleLibrarySelection={handleLibrarySelection}
                                            onApplyAllFilters={() => {
                                                if (!isDesktopResultsLayout) {
                                                    setShowAdvancedFilters(false);
                                                }
                                            }}
                                            showBottomActionButtons
                                        />
                                    </StyledResultsSidebarPanel>
                                )}
                                <Box>
                                    <Typography
                                        component="h2"
                                        variant="h5"
                                        sx={{ fontWeight: 700, color: '#1f1230' }}
                                        data-testid="spaces-journey-results-heading"
                                    >
                                        Search results
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        sx={{ color: '#666', mt: 1.5 }}
                                        data-testid="spaces-journey-result-count"
                                    >
                                        Showing {intentSpaceLocations?.length || 0}
                                        {typeof totalSpaceCount === 'number' ? ` of ${totalSpaceCount}` : ''} spaces
                                    </Typography>
                                    <Stack direction="row" spacing={1} sx={{ mt: 1.5, marginBottom: '2rem' }}>
                                        <StyledSecondaryButton onClick={handleClearJourneyFilters}>
                                            Reset quick filters
                                        </StyledSecondaryButton>
                                        <StyledSecondaryButton onClick={goToLegacyBrowse}>
                                            View on map
                                        </StyledSecondaryButton>
                                    </Stack>
                                    {(intentSpaceLocations?.length || 0) > 0 ? (
                                        <Stack
                                            component="ul"
                                            spacing={1.5}
                                            sx={{ mt: 1.5, pl: 0 }}
                                            data-testid="spaces-result-list"
                                        >
                                            {intentSpaceLocations?.map(space => {
                                                return (
                                                    <Stack
                                                        component="li"
                                                        key={space?.space_id}
                                                        data-testid={`spaces-result-list-${space.space_id}`}
                                                        sx={{ position: 'relative' }}
                                                    >
                                                        <SpaceItemCard
                                                            space={space}
                                                            setSelectedSpace={setSelectedSpace}
                                                            navigateToView={navigateToView}
                                                            selectedIntentId={selectedIntentId}
                                                            favouriteSpaceIds={favouriteSpaceIds}
                                                            weeklyHours={weeklyHours}
                                                            weeklyHoursLoading={weeklyHoursLoading}
                                                            weeklyHoursError={weeklyHoursError}
                                                        />
                                                        {!!space?.space_external_book_url && (
                                                            <Box
                                                                sx={{
                                                                    mt: 1.5,
                                                                    pt: 1.5,
                                                                    position: 'absolute',
                                                                    bottom: '3rem',
                                                                    left: '1.5rem',
                                                                }}
                                                            >
                                                                <StyledPrimaryButton
                                                                    component="a"
                                                                    href={space?.space_external_book_url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    size="small"
                                                                    sx={{ textTransform: 'none' }}
                                                                >
                                                                    Book this space
                                                                </StyledPrimaryButton>
                                                            </Box>
                                                        )}
                                                    </Stack>
                                                );
                                            })}
                                        </Stack>
                                    ) : (
                                        <Box
                                            sx={{
                                                mt: 1.5,
                                                p: 2,
                                                width: '100%',
                                                boxSizing: 'border-box',
                                                border: '1px dashed #c8bed6',
                                                borderRadius: '12px',
                                                backgroundColor: '#faf7ff',
                                            }}
                                        >
                                            <Typography sx={{ fontWeight: 700, color: '#1f1230' }}>
                                                No results match your criteria
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#666', mt: 0.75 }}>
                                                Try clearing some filters or selecting a different campus to widen your
                                                search.
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </StyledResultsSplitLayout>
                        </>
                    )}

                    {view === 'details' && !!selectedSpace && (
                        <JourneySpaceDetailsView
                            selectedSpace={selectedSpace}
                            weeklyHours={weeklyHours}
                            weeklyHoursLoading={weeklyHoursLoading}
                            weeklyHoursError={weeklyHoursError}
                            showBackButton={false}
                            showFavouriteControls
                            isSelectedSpaceFavourite={isSelectedSpaceFavourite}
                            favouriteButtonLabel={favouriteButtonLabel}
                            isFavouriteActionInProgress={isFavouriteActionInProgress}
                            onFavouriteToggle={handleJourneyFavouriteToggle}
                            showMap
                            narrowView={false}
                        />
                    )}
                </StyledJourneyPanel>
            </StandardPage>
        </StyledJourneyWrapper>
    );
};

BookableSpacesJourney.propTypes = {
    filteredSpaceLocations: PropTypes.array,
    allSpaceLocations: PropTypes.array,
    totalSpaceCount: PropTypes.number,
    highlightedSpace: PropTypes.object,
    isLoggedIn: PropTypes.bool,
    spacesFavouritesList: PropTypes.array,
    servicesAndSpacesArticles: PropTypes.array,
    selectedFacilityTypes: PropTypes.array,
    setSelectedFacilityTypes: PropTypes.func,
    filteredFacilityTypeList: PropTypes.object,
    facilityTypeList: PropTypes.object,
    facilityTypeListLoading: PropTypes.bool,
    facilityTypeListError: PropTypes.any,
    minimumSpaceCapacity: PropTypes.number,
    maximumSpaceCapacity: PropTypes.number,
    capacityFilterValue: PropTypes.array,
    setCapacityFilterValue: PropTypes.func,
    campusList: PropTypes.array,
    selectedCampus: PropTypes.number,
    handleCampusSelection: PropTypes.func,
    activeFilterCount: PropTypes.number,
    librariesForCampus: PropTypes.array,
    selectedLibrary: PropTypes.number,
    handleLibrarySelection: PropTypes.func,
    weeklyHours: PropTypes.any,
    weeklyHoursLoading: PropTypes.bool,
    weeklyHoursError: PropTypes.any,
    onFavouriteToggle: PropTypes.func,
    isFavouriteActionInProgress: PropTypes.bool,
};

export default React.memo(BookableSpacesJourney);
