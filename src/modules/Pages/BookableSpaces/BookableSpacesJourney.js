import React from 'react';
import PropTypes from 'prop-types';

import { Box, Button, Chip, Grid, Stack, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ComputerIcon from '@mui/icons-material/Computer';
import FavoriteIcon from '@mui/icons-material/Favorite';
import GroupsIcon from '@mui/icons-material/Groups';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import PersonIcon from '@mui/icons-material/Person';
import TuneIcon from '@mui/icons-material/Tune';
import TvIcon from '@mui/icons-material/Tv';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';

import SidebarFilters from 'modules/Pages/BookableSpaces/SidebarFilters';
import { getSpaceHoursStatus } from 'modules/Pages/BookableSpaces/spacesHelpers';
import JourneySpaceDetailsView from 'modules/Pages/BookableSpaces/JourneySpaceDetailsView';
import { getVisibleSpaceOutage } from 'modules/Pages/Admin/BookableSpaces/Spaces/Form/spaceOutageHelpers';
import { ArticleCard } from 'modules/SharedComponents/Toolbox/ArticleCard';

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

const StyledJourneyPanel = styled('div')(({ theme }) => ({
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    rowGap: '2rem',
    padding: '4rem 2rem 2rem',
    [theme.breakpoints.down('sm')]: {
        padding: '1rem',
        rowGap: '1.25rem',
    },
    [theme.breakpoints.down('md')]: {
        maxWidth: '100%',
    },
}));

// Intent card — clickable card matching UQ Library homepage card grid style
const StyledIntentCard = styled('button')(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: '8px',
    padding: '1.75rem',
    textAlign: 'left',
    cursor: 'pointer',
    color: theme.palette.text.primary,
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'box-shadow 0.2s ease-in-out, border-color 0.2s ease-in-out',
    fontFamily: 'inherit',
    '&:hover': {
        borderColor: theme.palette.primary.main,
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
    },
    '&:focus-visible': {
        outline: `3px solid ${theme.palette.primary.main}`,
        outlineOffset: '2px',
    },
}));

// Result card with proper styling - clickable full card
const StyledResultCardButton = styled(Button)(({ theme }) => ({
    width: '100%',
    padding: '0',
    textTransform: 'none',
    justifyContent: 'flex-start',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: '8px',
    backgroundColor: '#fff',
    color: 'inherit',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
        borderColor: theme.palette.primary.main,
        transform: 'translateY(-2px)',
    },
    '&:active': {
        transform: 'translateY(0)',
    },
}));

const StyledDetailSurface = styled('div')(({ theme }) => ({
    backgroundColor: '#f9f8fa',
    color: '#1f1230',
    borderRadius: '12px',
    padding: '1.5rem',
    border: `1px solid ${theme.palette.designSystem.borderColor}`,
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
    borderRadius: '14px',
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

const StyledAdvancedFiltersPanel = styled(StyledDetailSurface)(({ theme }) => ({
    background: 'linear-gradient(180deg, #fcfbff 0%, #f7f4fc 100%)',
    border: '1px solid #d9d0e8',
    boxShadow: '0 10px 26px rgba(50, 24, 84, 0.08)',
    borderRadius: '16px',
    padding: '1.25rem',
    overflow: 'hidden',
    boxSizing: 'border-box',
    [theme.breakpoints.down('sm')]: {
        padding: '1rem',
    },
    '& .filterSideBar.journeyFilterSidebar, & .filterSideBar.journeyFilterSidebar *': {
        boxSizing: 'border-box',
    },
    '& .filterSideBar.journeyFilterSidebar': {
        maxWidth: '100%',
        flexBasis: '100%',
        width: '100%',
        overflowY: 'visible',
        paddingTop: 0,
        margin: 0,
        backgroundColor: 'transparent',
    },
    '& .filterSideBar.journeyFilterSidebar > div': {
        width: '100%',
    },
    '& .filterSideBar.journeyFilterSidebar .sectionHeading': {
        fontWeight: 700,
        color: '#25153d',
        letterSpacing: '0.01em',
    },
    '& .filterSideBar.journeyFilterSidebar [data-testid="topOfSidebar"]': {
        fontSize: '1.3rem',
        fontWeight: 800,
        lineHeight: 1.2,
        marginBottom: '0.35rem',
    },
    '& .filterSideBar.journeyFilterSidebar [data-testid="space-filter-count"]': {
        fontSize: '0.98rem',
        fontWeight: 600,
        color: '#56456f',
        lineHeight: 1.3,
        marginTop: '0.2rem',
        marginBottom: '0.55rem',
    },
    '& .filterSideBar.journeyFilterSidebar [data-testid="space-filter-count"] span': {
        display: 'inline-block',
        minWidth: '1.2rem',
        marginLeft: '0.35rem',
        padding: '0.08rem 0.45rem',
        borderRadius: '999px',
        backgroundColor: '#ece4f9',
        color: '#432166',
        fontSize: '0.82rem',
        fontWeight: 700,
        textAlign: 'center',
    },
    '& .filterSideBar.journeyFilterSidebar .sidebarSelector': {
        width: '100%',
    },
    '& .filterSideBar.journeyFilterSidebar .sidebarSelector > div': {
        backgroundColor: '#ffffff',
        border: '1px solid #d9d0e8',
        borderRadius: '10px',
        boxShadow: '0 1px 3px rgba(31, 18, 48, 0.06)',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    },
    '& .filterSideBar.journeyFilterSidebar .sidebarSelector > div:focus-within': {
        borderColor: '#6a3ea1',
        boxShadow: '0 0 0 3px rgba(106, 62, 161, 0.15)',
    },
    '& .filterSideBar.journeyFilterSidebar .sidebarSelector .MuiInputBase-root': {
        width: '100%',
    },
    '& .filterSideBar.journeyFilterSidebar .sidebarSelector .MuiSelect-select': {
        width: '100%',
        boxSizing: 'border-box',
        fontWeight: 500,
        color: '#2a1d3f',
    },
    '& .filterSideBar.journeyFilterSidebar [data-testid="sidebarCheckboxes"]': {
        display: 'block',
    },
    '& .filterSideBar.journeyFilterSidebar [data-testid="sidebarCheckboxes"] > div': {
        width: '100%',
    },
    '& .filterSideBar.journeyFilterSidebar [data-testid="sidebarCheckboxes"] > * + *': {
        marginTop: '0.5rem',
    },
    '& .filterSideBar.journeyFilterSidebar [data-testid^="filter-group-block-"]': {
        width: '100%',
        padding: '0.9rem 1rem 1rem',
        marginTop: '0.75rem',
        backgroundColor: '#ffffff',
        border: '1px solid #e2daef',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(31, 18, 48, 0.05)',
        overflow: 'hidden',
    },
    '& .filterSideBar.journeyFilterSidebar [data-testid^="filter-group-block-"] h3': {
        marginBottom: 0,
        fontWeight: 700,
        color: '#25153d',
    },
    '& .filterSideBar.journeyFilterSidebar [id^="filter-group-list-"]': {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '0.55rem 0.75rem',
        width: '100%',
        paddingTop: '0.85rem',
        margin: 0,
        paddingLeft: 0,
    },
    '& .filterSideBar.journeyFilterSidebar [id^="filter-group-list-"] > li': {
        marginLeft: '0 !important',
        paddingLeft: 0,
        minWidth: 0,
        borderRadius: '8px',
        listStyle: 'none',
    },
    '& .filterSideBar.journeyFilterSidebar [id^="filter-group-list-"] > li label': {
        width: '100%',
        borderRadius: '8px',
        padding: '0.25rem 0.35rem 0.25rem 0.15rem',
        transition: 'background-color 0.2s ease, border-color 0.2s ease',
        border: '1px solid transparent',
        textDecoration: 'none',
    },
    '& .filterSideBar.journeyFilterSidebar [id^="filter-group-list-"] > li label:hover': {
        backgroundColor: '#f6f2fc',
        borderColor: '#ddd1ee',
    },
    '& .filterSideBar.journeyFilterSidebar [id^="filter-group-list-"] > li label:hover > span:nth-of-type(2)': {
        backgroundColor: 'transparent',
        color: '#2a1d3f',
        textDecoration: 'none',
    },
    '& .filterSideBar.journeyFilterSidebar [id^="filter-group-list-"] > li label:focus > span:nth-of-type(2)': {
        backgroundColor: 'transparent',
        color: '#2a1d3f',
        textDecoration: 'none',
    },
    '& .filterSideBar.journeyFilterSidebar [id^="filter-group-list-"] > li label:focus-visible > span:nth-of-type(2)': {
        backgroundColor: 'transparent',
        color: '#2a1d3f',
        textDecoration: 'none',
    },
    '& .filterSideBar.journeyFilterSidebar [id^="filter-group-list-"] > li label span': {
        textDecoration: 'none !important',
    },
    '& .filterSideBar.journeyFilterSidebar .MuiCheckbox-root': {
        color: '#6c4f99',
        padding: '6px',
    },
    '& .filterSideBar.journeyFilterSidebar .MuiCheckbox-root.Mui-checked': {
        color: '#51247a',
    },
    '& .filterSideBar.journeyFilterSidebar .MuiCheckbox-root:hover': {
        backgroundColor: 'rgba(81, 36, 122, 0.08)',
    },
    '& .filterSideBar.journeyFilterSidebar .selectedFilterTypeLabel span:last-of-type': {
        color: '#34224f',
        fontWeight: 500,
    },
    '& .filterSideBar.journeyFilterSidebar .selectedFilterTypeLabel:has(.Mui-checked)': {
        backgroundColor: '#f4eefc',
        borderColor: '#cdbbe8',
    },
    '& .filterSideBar.journeyFilterSidebar .selectedFilterTypeLabel:has(.Mui-checked) span:last-of-type': {
        color: '#2a1d3f',
        fontWeight: 600,
    },
    '& .filterSideBar.journeyFilterSidebar .sliderGroupHeading, & .filterSideBar.journeyFilterSidebar h4': {
        color: '#2a1d3f',
        fontWeight: 700,
    },
    '& .filterSideBar.journeyFilterSidebar .MuiSlider-root': {
        color: '#51247a',
    },
    '& .filterSideBar.journeyFilterSidebar .MuiSlider-rail': {
        opacity: 1,
        backgroundColor: '#d9cee9',
    },
    '& .filterSideBar.journeyFilterSidebar .MuiSlider-thumb': {
        border: '2px solid #ffffff',
        boxShadow: '0 1px 4px rgba(37, 21, 61, 0.35)',
    },
    '& .filterSideBar.journeyFilterSidebar button': {
        borderRadius: '9px',
    },
    [theme.breakpoints.up('sm')]: {
        '& .filterSideBar.journeyFilterSidebar [id^="filter-group-list-"]': {
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        },
    },
    [theme.breakpoints.up('md')]: {
        '& .filterSideBar.journeyFilterSidebar [id^="filter-group-list-"]': {
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        },
    },
    [theme.breakpoints.up('xl')]: {
        '& .filterSideBar.journeyFilterSidebar [id^="filter-group-list-"]': {
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        },
    },
}));

const HOURS_STATUS_CONFIG = {
    open: {
        label: 'Open now',
        sx: { backgroundColor: '#e8f5e9', color: '#1b5e20', borderColor: '#a5d6a7', border: '1px solid' },
    },
    'closing-soon': {
        label: 'Closing soon',
        sx: { backgroundColor: '#fff8e1', color: '#e65100', borderColor: '#ffe082', border: '1px solid' },
    },
    closed: {
        label: 'Closed',
        sx: { backgroundColor: '#fdecea', color: '#b71c1c', borderColor: '#ffcdd2', border: '1px solid' },
    },
};

const SpaceOpenStatusChip = ({ space, weeklyHours, weeklyHoursLoading, weeklyHoursError }) => {
    const visibleOutage = getVisibleSpaceOutage(space?.space_outages);
    if (visibleOutage?.status === 'Current') {
        return (
            <Chip
                data-testid={'spaces-journey-open-status-chip-current-outage'}
                label="Currently closed"
                size="small"
                sx={{
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    letterSpacing: '0.01em',
                    backgroundColor: '#fdecea',
                    color: '#b71c1c',
                    borderColor: '#ffcdd2',
                    border: '1px solid',
                }}
            />
        );
    }

    if (weeklyHoursLoading || weeklyHoursError || !weeklyHours) return null;
    const status = getSpaceHoursStatus(space, weeklyHours);
    if (!status) return null;
    const config = HOURS_STATUS_CONFIG[status];
    return (
        <Chip
            data-testid={'spaces-journey-open-status-chip-' + status}
            label={config.label}
            size="small"
            sx={{
                fontWeight: 700,
                fontSize: '0.75rem',
                letterSpacing: '0.01em',
                ...config.sx,
            }}
        />
    );
};

SpaceOpenStatusChip.propTypes = {
    space: PropTypes.object,
    weeklyHours: PropTypes.object,
    weeklyHoursLoading: PropTypes.bool,
    weeklyHoursError: PropTypes.bool,
};

const intentDefinitions = [
    {
        id: 'quiet',
        label: 'Quiet space',
        description: 'Find a peaceful spot to focus. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        icon: VolumeOffIcon,
        matchers: [/quiet/i, /low noise/i],
    },
    {
        id: 'collaborative',
        label: 'Collaborative space',
        description: 'Work together with your team. Sed do eiusmod tempor incididunt ut labore et dolore magna.',
        icon: GroupsIcon,
        matchers: [/collaborative/i, /group/i, /communal/i],
    },
    {
        id: 'computer',
        label: 'Computer access',
        description: 'Access library computers and software. Ut enim ad minim veniam, quis nostrud exercitation.',
        icon: ComputerIcon,
        matchers: [/computer/i, /byod/i],
    },
    {
        id: 'bookable',
        label: 'Bookable room',
        description: 'Reserve a private or group meeting room. Ullamco laboris nisi ut aliquip ex ea commodo.',
        icon: MeetingRoomIcon,
        matchers: [/bookable/i, /meeting room/i, /training room/i],
    },
    {
        id: 'postgrad',
        label: 'Postgraduate space',
        description: 'Dedicated spaces for research and higher-degree study. Duis aute irure dolor in reprehenderit.',
        icon: PersonIcon,
        matchers: [/postgraduate/i],
    },
    {
        id: 'av',
        label: 'AV equipment',
        description: 'Spaces equipped with screens, projectors and audio. Excepteur sint occaecat cupidatat non.',
        icon: TvIcon,
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

const landingHeroHighlights = ['Quiet corners', 'Bookable rooms', 'Computer access', 'Campus-aware filters'];
const JOURNEY_VIEWS = ['landing', 'intent', 'results', 'details'];
const JOURNEY_QUERY_PARAM_STEP = 'journeyStep';
const JOURNEY_QUERY_PARAM_INTENT = 'journeyIntent';
const JOURNEY_QUERY_PARAM_SPACE = 'journeySpace';

const getJourneySearchParams = url => {
    if (url.hash.includes('?')) {
        const [hashPath, hashQuery] = url.hash.split('?');
        return {
            usesHashQuery: true,
            hashPath,
            params: new URLSearchParams(hashQuery),
        };
    }

    return {
        usesHashQuery: false,
        hashPath: url.hash,
        params: url.searchParams,
    };
};

const serialiseJourneyUrl = ({ view, intentId, spaceId }) => {
    const url = new URL(window.location.href);
    const { usesHashQuery, hashPath, params } = getJourneySearchParams(url);

    if (view && view !== 'landing') {
        params.set(JOURNEY_QUERY_PARAM_STEP, view);
    } else {
        params.delete(JOURNEY_QUERY_PARAM_STEP);
    }

    if (intentId && (view === 'results' || view === 'details')) {
        params.set(JOURNEY_QUERY_PARAM_INTENT, String(intentId));
    } else {
        params.delete(JOURNEY_QUERY_PARAM_INTENT);
    }

    if (view === 'details' && spaceId) {
        params.set(JOURNEY_QUERY_PARAM_SPACE, String(spaceId));
    } else {
        params.delete(JOURNEY_QUERY_PARAM_SPACE);
    }

    if (usesHashQuery) {
        const nextHashQuery = params.toString();
        url.hash = nextHashQuery ? `${hashPath}?${nextHashQuery}` : hashPath;
    }

    return url.toString();
};

const parseJourneyStateFromUrl = availableIntentDefinitions => {
    const url = new URL(window.location.href);
    const { params } = getJourneySearchParams(url);

    const requestedView = params.get(JOURNEY_QUERY_PARAM_STEP);
    const view = JOURNEY_VIEWS.includes(requestedView) ? requestedView : 'landing';

    const requestedIntentId = params.get(JOURNEY_QUERY_PARAM_INTENT);
    const intentId = availableIntentDefinitions?.some(intent => intent.id === requestedIntentId)
        ? requestedIntentId
        : null;

    const requestedSpaceId = params.get(JOURNEY_QUERY_PARAM_SPACE);
    const spaceId = requestedSpaceId ? String(requestedSpaceId) : null;

    return { view, intentId, spaceId };
};

const findSpaceById = (spaces, targetSpaceId) => {
    if (!targetSpaceId) return null;
    return spaces?.find(space => String(space?.space_id) === String(targetSpaceId)) || null;
};

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

const BookableSpacesJourney = ({
    filteredSpaceLocations,
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
    const isMobileView = useMediaQuery(theme.breakpoints.down('sm'));
    const journeyTopRef = React.useRef(null);
    const [view, setView] = React.useState('landing');
    const [selectedIntentId, setSelectedIntentId] = React.useState(null);
    const [selectedSpace, setSelectedSpace] = React.useState(null);
    const [showAdvancedFilters, setShowAdvancedFilters] = React.useState(false);
    const canShowAdvancedFilters = view === 'results';
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
    const validCampusIds = React.useMemo(() => new Set(validCampusList.map(campus => String(campus.campus_id))), [
        validCampusList,
    ]);
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
        if (!canShowAdvancedFilters && showAdvancedFilters) {
            setShowAdvancedFilters(false);
        }
    }, [canShowAdvancedFilters, showAdvancedFilters]);

    const applyIntentFilters = intent => {
        const ids = getIntentFilterIds(filteredFacilityTypeList?.data?.facility_type_groups, intent);
        if (!selectedFacilityTypes?.length) return;
        const nextFilters = selectedFacilityTypes.map(filter => ({
            ...filter,
            selected: ids.includes(filter.facility_type_id),
            unselected: false,
        }));
        setSelectedFacilityTypes(nextFilters);
    };

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
        (nextView, { pushHistory = true, intentId = selectedIntentId, spaceId = selectedSpace?.space_id } = {}) => {
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
        [selectedIntentId, selectedSpace?.space_id, writeJourneyHistory],
    );

    const goToIntentSelection = () => {
        setSelectedIntentId(null);
        setSelectedSpace(null);
        navigateToView('intent', { intentId: null, spaceId: null });
    };

    const handleJourneyBack = () => {
        if (journeyHistoryRef.current.length > 1) {
            window.history.back();
            return;
        }
        navigateToView('landing', { pushHistory: false });
    };

    const goToLegacyBrowse = () => {
        const url = new URL(window.location.href);
        // The advanced/map view is reached by adding ?advanced=1
        // Support both standard query params and hash-router query params (#/path?param=val)
        if (url.hash.includes('?')) {
            const [hashPath, hashQuery] = url.hash.split('?');
            const hashParams = new URLSearchParams(hashQuery);
            hashParams.set('advanced', '1');
            url.hash = `${hashPath}?${hashParams.toString()}`;
        } else {
            url.searchParams.set('advanced', '1');
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

        writeJourneyHistory({
            nextView,
            nextIntentId: nextIntentId || null,
            nextSpaceId: nextSelectedSpace?.space_id || null,
            method: 'replaceState',
        });
    }, [availableIntentDefinitions, filteredSpaceLocations, highlightedSpace, writeJourneyHistory]);

    React.useEffect(() => {
        const historyTop = journeyHistoryRef.current[journeyHistoryRef.current.length - 1];
        if (historyTop !== view) {
            return;
        }

        writeJourneyHistory({
            nextView: view,
            nextIntentId: selectedIntentId,
            nextSpaceId: selectedSpace?.space_id || null,
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
            {view === 'landing' && (
                <StyledLandingHeroShell>
                    <StyledLandingHeroInner data-testid="spaces-journey-landing-hero-inner">
                        <StyledLandingHeroLayout data-testid="spaces-journey-landing-hero-layout">
                            <StyledLandingHeroContentColumn data-testid="spaces-journey-landing-hero-content-column">
                                <StyledLandingHeroCard data-testid="spaces-journey-landing-hero-card">
                                    <Typography
                                        component="p"
                                        sx={{
                                            margin: 0,
                                            mb: 1,
                                            fontSize: '0.92rem',
                                            fontWeight: 700,
                                            letterSpacing: '0.08em',
                                            textTransform: 'uppercase',
                                            color: 'rgba(255, 255, 255, 0.74)',
                                        }}
                                    >
                                        Study spaces
                                    </Typography>
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
                                        Find a learning space that suits how you want to study
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
                                        Start with your study style, then refine by campus, facilities and room type to
                                        get to the right space faster.
                                    </Typography>
                                    <Box
                                        data-testid="spaces-journey-landing-hero-highlights"
                                        sx={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: '0.55rem',
                                            mt: 2,
                                        }}
                                    >
                                        {landingHeroHighlights.map(item => (
                                            <Box
                                                key={item}
                                                component="span"
                                                data-testid={`spaces-journey-landing-hero-highlight-${item
                                                    .toLowerCase()
                                                    .replace(/[^a-z0-9]+/g, '-')}`}
                                                sx={{
                                                    px: 1.05,
                                                    py: 0.45,
                                                    borderRadius: '999px',
                                                    border: '1px solid rgba(255, 255, 255, 0.22)',
                                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                    color: '#fff',
                                                    fontSize: '0.82rem',
                                                    fontWeight: 600,
                                                    letterSpacing: '0.01em',
                                                }}
                                            >
                                                {item}
                                            </Box>
                                        ))}
                                    </Box>
                                    <Stack direction={isMobileView ? 'column' : 'row'} spacing={1.5} sx={{ mt: 3 }}>
                                        <Button
                                            data-testid="spaces-journey-landing-get-started"
                                            variant="contained"
                                            onClick={goToIntentSelection}
                                            sx={{
                                                textTransform: 'none',
                                                alignSelf: 'flex-start',
                                                backgroundColor: '#fff',
                                                color: '#51247a',
                                                fontWeight: 700,
                                                '&:hover': {
                                                    backgroundColor: '#f3ebff',
                                                },
                                            }}
                                        >
                                            Get started
                                        </Button>
                                        <Button
                                            data-testid="spaces-journey-landing-browse-all"
                                            variant="outlined"
                                            onClick={goToLegacyBrowse}
                                            sx={{
                                                textTransform: 'none',
                                                alignSelf: 'flex-start',
                                                color: '#fff',
                                                borderColor: 'rgba(255, 255, 255, 0.45)',
                                                '&:hover': {
                                                    borderColor: '#fff',
                                                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                                },
                                            }}
                                        >
                                            Browse all study spaces
                                        </Button>
                                    </Stack>
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
            <StyledJourneyPanel data-testid="spaces-homepage-content">
                <Stack
                    direction="row"
                    justifyContent={canShowAdvancedFilters ? 'space-between' : 'flex-start'}
                    alignItems="center"
                >
                    <Typography
                        component={view === 'landing' ? 'h2' : 'h1'}
                        variant={isMobileView ? 'h5' : 'h4'}
                        sx={{ fontWeight: 700, color: '#1f1230' }}
                    >
                        Find a learning space
                    </Typography>
                    {canShowAdvancedFilters && (
                        <Button
                            variant="outlined"
                            startIcon={<TuneIcon />}
                            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 600,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 1,
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
                                        backgroundColor: '#51247a',
                                        color: '#fff',
                                    }}
                                >
                                    {activeFilterCount}
                                </Box>
                            )}
                        </Button>
                    )}
                </Stack>

                {canShowAdvancedFilters && showAdvancedFilters && (
                    <StyledAdvancedFiltersPanel>
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
                            onApplyAllFilters={() => setShowAdvancedFilters(false)}
                            showBottomActionButtons
                        />
                    </StyledAdvancedFiltersPanel>
                )}

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
                                                    sx={{ fontWeight: 600, mb: 0.8, color: 'rgba(255,255,255,0.88)' }}
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
                                                    sx={{ color: 'rgba(255,255,255,0.82)', lineHeight: 1.55, mb: 1.5 }}
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
                                                        spaceId: highlightedSpace?.space_id,
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
                                                borderRadius: '10px',
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

                {view === 'intent' && (
                    <>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Button
                                variant="text"
                                startIcon={<ArrowBackIcon />}
                                onClick={handleJourneyBack}
                                sx={{ textTransform: 'none' }}
                            >
                                Back
                            </Button>
                        </Stack>
                        <Typography component="h2" variant="h5" sx={{ fontWeight: 700, color: '#1f1230' }}>
                            What sort of space would you like to find?
                        </Typography>
                        <Grid container spacing={3}>
                            {availableIntentDefinitions.map(intent => {
                                const IconComponent = intent.icon;
                                return (
                                    <Grid item xs={12} sm={6} md={4} key={intent.id}>
                                        <StyledIntentCard onClick={() => handleIntentSelect(intent)}>
                                            <IconComponent
                                                sx={{
                                                    fontSize: '2.5rem',
                                                    color: 'primary.main',
                                                    mb: 1.5,
                                                }}
                                            />
                                            <Typography
                                                component="h3"
                                                variant="h6"
                                                sx={{ fontWeight: 700, mb: 1, color: '#1f1230', lineHeight: 1.2 }}
                                            >
                                                {intent.label}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{ color: '#4f4d57', flexGrow: 1, lineHeight: 1.5 }}
                                            >
                                                {intent.description}
                                            </Typography>
                                            <Box sx={{ mt: 2 }}>
                                                <ArrowForwardIcon sx={{ color: 'primary.main', fontSize: '1.25rem' }} />
                                            </Box>
                                        </StyledIntentCard>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </>
                )}

                {view === 'results' && (
                    <>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                            <Button
                                variant="text"
                                startIcon={<ArrowBackIcon />}
                                onClick={handleJourneyBack}
                                sx={{ textTransform: 'none' }}
                            >
                                Back
                            </Button>
                            {!!selectedIntent && <Chip label={selectedIntent.label} variant="outlined" />}
                        </Stack>
                        <Typography component="h2" variant="h5" sx={{ fontWeight: 700, color: '#1f1230' }}>
                            {selectedIntent?.label || 'Matching spaces'}
                        </Typography>

                        {/* Campus picker — visible inline on results, not buried in advanced filters */}
                        {validCampusList?.length > 1 && (
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#1f1230' }}>
                                    Campus
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {validCampusList.map(campus => (
                                        <Button
                                            key={campus.campus_id}
                                            variant={selectedCampus === campus.campus_id ? 'contained' : 'outlined'}
                                            size="small"
                                            onClick={() =>
                                                handleCampusSelection({ target: { value: campus.campus_id } })
                                            }
                                            sx={{ textTransform: 'none' }}
                                        >
                                            {campus.campus_name}
                                        </Button>
                                    ))}
                                </Box>
                            </Box>
                        )}

                        <Typography variant="body2" sx={{ color: '#666' }}>
                            Showing {intentSpaceLocations?.length || 0}
                            {typeof totalSpaceCount === 'number' ? ` of ${totalSpaceCount}` : ''} spaces
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            <Button
                                variant="outlined"
                                onClick={handleClearJourneyFilters}
                                sx={{ textTransform: 'none' }}
                            >
                                Reset quick filters
                            </Button>
                        </Stack>
                        <Stack spacing={1.5}>
                            {intentSpaceLocations?.map(space => {
                                const visibleOutage = getVisibleSpaceOutage(space?.space_outages);
                                const bookableSpaceUrl = space?.space_external_book_url;
                                return (
                                    <Stack key={space?.space_id} spacing={1}>
                                        <StyledResultCardButton
                                            onClick={() => {
                                                setSelectedSpace(space);
                                                navigateToView('details', {
                                                    intentId: selectedIntentId,
                                                    spaceId: space?.space_id,
                                                });
                                            }}
                                        >
                                            <Box sx={{ p: '1.5rem', width: '100%', textAlign: 'left' }}>
                                                <Typography sx={{ fontWeight: 700, color: '#1f1230', mb: 0.5 }}>
                                                    {space?.space_name}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                                                    {space?.space_library_name}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#999' }}>
                                                    {space?.space_type_details?.space_type_name || space?.space_type}
                                                </Typography>
                                                <Box
                                                    sx={{
                                                        mb:
                                                            space?.space_type_details?.space_type_description ||
                                                            space?.space_description
                                                                ? 1
                                                                : 0,
                                                        mt: 0.5,
                                                    }}
                                                >
                                                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                                                        {favouriteSpaceIds.has(String(space?.space_id)) && (
                                                            <Chip
                                                                data-testid={`spaces-journey-favourite-chip-${space?.space_id}`}
                                                                label="Favourite"
                                                                size="small"
                                                                sx={{
                                                                    backgroundColor: '#fff8e1',
                                                                    color: '#7a5a00',
                                                                    borderColor: '#ffe082',
                                                                    border: '1px solid',
                                                                    fontWeight: 700,
                                                                }}
                                                            />
                                                        )}
                                                        <SpaceOpenStatusChip
                                                            space={space}
                                                            weeklyHours={weeklyHours}
                                                            weeklyHoursLoading={weeklyHoursLoading}
                                                            weeklyHoursError={weeklyHoursError}
                                                        />
                                                        {!!visibleOutage && visibleOutage.status !== 'Current' && (
                                                            <Chip
                                                                data-testid={`spaces-journey-outage-chip-${space?.space_id}`}
                                                                label="Upcoming closure"
                                                                size="small"
                                                                sx={{
                                                                    backgroundColor: '#fff8e1',
                                                                    color: '#7a5a00',
                                                                    border: '1px solid #ffe082',
                                                                    fontWeight: 700,
                                                                }}
                                                            />
                                                        )}
                                                    </Stack>
                                                </Box>
                                                {!!space?.space_type_details?.space_type_description && (
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: '#4f4d57',
                                                            mb: space?.space_description ? 0.75 : 0,
                                                        }}
                                                    >
                                                        {space.space_type_details.space_type_description}
                                                    </Typography>
                                                )}
                                                {!!space?.space_description && (
                                                    <Typography
                                                        variant="body2"
                                                        sx={{ color: '#666', fontStyle: 'italic' }}
                                                    >
                                                        {String(space.space_description)
                                                            .replace(/<[^>]*>/g, ' ')
                                                            .trim()}
                                                    </Typography>
                                                )}
                                                {!!bookableSpaceUrl && (
                                                    <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid #e0e0e0' }}>
                                                        <Button
                                                            component="a"
                                                            href={bookableSpaceUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            variant="contained"
                                                            size="small"
                                                            sx={{ textTransform: 'none' }}
                                                        >
                                                            Book this space
                                                        </Button>
                                                    </Box>
                                                )}
                                            </Box>
                                        </StyledResultCardButton>
                                    </Stack>
                                );
                            })}
                        </Stack>
                    </>
                )}

                {view === 'details' && !!selectedSpace && (
                    <JourneySpaceDetailsView
                        selectedSpace={selectedSpace}
                        weeklyHours={weeklyHours}
                        weeklyHoursLoading={weeklyHoursLoading}
                        weeklyHoursError={weeklyHoursError}
                        showBackButton
                        backLabel="Back to results"
                        onBack={handleJourneyBack}
                        showFavouriteControls
                        isLoggedIn={isLoggedIn}
                        isSelectedSpaceFavourite={isSelectedSpaceFavourite}
                        favouriteButtonLabel={favouriteButtonLabel}
                        isFavouriteActionInProgress={isFavouriteActionInProgress}
                        onFavouriteToggle={handleJourneyFavouriteToggle}
                        showMap
                    />
                )}
            </StyledJourneyPanel>
        </StyledJourneyWrapper>
    );
};

BookableSpacesJourney.propTypes = {
    filteredSpaceLocations: PropTypes.array,
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
