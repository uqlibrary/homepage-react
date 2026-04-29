import React from 'react';
import PropTypes from 'prop-types';

import { Box, Button, Chip, Grid, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ComputerIcon from '@mui/icons-material/Computer';
import GroupsIcon from '@mui/icons-material/Groups';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import PersonIcon from '@mui/icons-material/Person';
import TuneIcon from '@mui/icons-material/Tune';
import TvIcon from '@mui/icons-material/Tv';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';

import SidebarFilters from 'modules/Pages/BookableSpaces/SidebarFilters';
import BookableSpacesMap from 'modules/Pages/BookableSpaces/BookableSpacesMap';
import SpaceDetails from 'modules/Pages/BookableSpaces/SpaceDetails';

const carouselAnimationDurationMs = 220;

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
    display: 'flex',
    flexDirection: 'column',
    rowGap: '2rem',
    padding: '2rem',
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

const StyledAdvancedFiltersPanel = styled(StyledDetailSurface)(({ theme }) => ({
    '& .filterSideBar.journeyFilterSidebar': {
        maxWidth: '100%',
        flexBasis: '100%',
        width: '100%',
        overflowY: 'visible',
        paddingTop: 0,
    },
    '& .filterSideBar.journeyFilterSidebar > div': {
        width: '100%',
    },
    '& .filterSideBar.journeyFilterSidebar .sidebarSelector': {
        width: '100%',
    },
    '& .filterSideBar.journeyFilterSidebar .sidebarSelector .MuiInputBase-root': {
        width: '100%',
    },
    '& .filterSideBar.journeyFilterSidebar .sidebarSelector .MuiSelect-select': {
        width: '100%',
        boxSizing: 'border-box',
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
        paddingBlock: '12px',
    },
    '& .filterSideBar.journeyFilterSidebar [data-testid^="filter-group-block-"] h3': {
        marginBottom: 0,
    },
    '& .filterSideBar.journeyFilterSidebar [id^="filter-group-list-"]': {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '0.5rem 1rem',
        width: '100%',
        paddingTop: '0.75rem',
    },
    '& .filterSideBar.journeyFilterSidebar [id^="filter-group-list-"] > li': {
        marginLeft: 0,
        minWidth: 0,
    },
    '& .filterSideBar.journeyFilterSidebar [id^="filter-group-list-"] > li label': {
        width: '100%',
    },
    [theme.breakpoints.up('sm')]: {
        '& .filterSideBar.journeyFilterSidebar [id^="filter-group-list-"]': {
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        },
    },
    [theme.breakpoints.up('md')]: {
        '& .filterSideBar.journeyFilterSidebar [id^="filter-group-list-"]': {
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        },
    },
}));

const StyledImageCarousel = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: '12px',
    overflow: 'hidden',
    backgroundColor: '#d5d5da',
    minHeight: '240px',
    [theme.breakpoints.up('md')]: {
        minHeight: '340px',
    },
    '& img': {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
    },
    '& .carouselViewport': {
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: 'inherit',
        zIndex: 1,
    },
    '& .carouselImage': {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        pointerEvents: 'none',
    },
    '& .slideInFromRight': {
        animation: `bsjSlideInFromRight ${carouselAnimationDurationMs}ms ease both`,
        zIndex: 2,
    },
    '& .slideInFromLeft': {
        animation: `bsjSlideInFromLeft ${carouselAnimationDurationMs}ms ease both`,
        zIndex: 2,
    },
    '& .slideOutToLeft': {
        animation: `bsjSlideOutToLeft ${carouselAnimationDurationMs}ms ease both`,
        zIndex: 1,
    },
    '& .slideOutToRight': {
        animation: `bsjSlideOutToRight ${carouselAnimationDurationMs}ms ease both`,
        zIndex: 1,
    },
    '@keyframes bsjSlideInFromRight': {
        from: { transform: 'translateX(100%)' },
        to: { transform: 'translateX(0)' },
    },
    '@keyframes bsjSlideInFromLeft': {
        from: { transform: 'translateX(-100%)' },
        to: { transform: 'translateX(0)' },
    },
    '@keyframes bsjSlideOutToLeft': {
        from: { transform: 'translateX(0)' },
        to: { transform: 'translateX(-100%)' },
    },
    '@keyframes bsjSlideOutToRight': {
        from: { transform: 'translateX(0)' },
        to: { transform: 'translateX(100%)' },
    },
}));

const StyledCarouselControl = styled(IconButton)(() => ({
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 1,
    pointerEvents: 'auto',
    backgroundColor: 'rgba(20, 20, 20, 0.62)',
    color: '#fff',
    border: '1px solid rgba(255, 255, 255, 0.45)',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.25)',
    opacity: 1,
    visibility: 'visible',
    '&:hover': {
        backgroundColor: 'rgba(20, 20, 20, 0.78)',
    },
}));

const StyledCarouselControlsLayer = styled('div')(() => ({
    position: 'absolute',
    inset: 0,
    zIndex: 20,
    pointerEvents: 'none',
}));

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

const demoCarouselImages = [
    '/images/spotlights/43f8c480-e1e9-11ea-8b42-656cb34d5c84.jpg',
    '/images/spotlights/babcccc0-e0e4-11ea-b159-6dfe174e1a21.jpg',
    '/images/spotlights/f9ff71b0-d77e-11ea-8881-93befcabdbc2.jpg',
];

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
}) => {
    const theme = useTheme();
    const isMobileView = useMediaQuery(theme.breakpoints.down('sm'));
    const [view, setView] = React.useState('landing');
    const [selectedIntentId, setSelectedIntentId] = React.useState(null);
    const [selectedSpace, setSelectedSpace] = React.useState(null);
    const [activeImageIndex, setActiveImageIndex] = React.useState(0);
    const [previousImageIndex, setPreviousImageIndex] = React.useState(null);
    const [isCarouselAnimating, setIsCarouselAnimating] = React.useState(false);
    const [carouselDirection, setCarouselDirection] = React.useState('next');
    const [showAdvancedFilters, setShowAdvancedFilters] = React.useState(false);
    const carouselAnimationTimeoutRef = React.useRef(null);
    const canShowAdvancedFilters = view === 'results';

    const selectedIntent = intentDefinitions.find(intent => intent.id === selectedIntentId) || null;

    const detailImages = React.useMemo(() => {
        if (!selectedSpace) return [];

        const resolvedImages = [];
        const pushImage = image => {
            if (!image) return;
            if (typeof image === 'string') {
                resolvedImages.push({
                    src: image,
                    alt: selectedSpace?.space_photo_description || selectedSpace?.space_name || 'Space image',
                });
                return;
            }
            if (typeof image === 'object') {
                const src = image.src || image.url || image.space_photo_url;
                if (!src) return;
                resolvedImages.push({
                    src,
                    alt:
                        image.alt ||
                        image.description ||
                        selectedSpace?.space_photo_description ||
                        selectedSpace?.space_name ||
                        'Space image',
                });
            }
        };

        [selectedSpace?.space_photo_urls, selectedSpace?.space_photos, selectedSpace?.space_images].forEach(
            candidate => {
                if (Array.isArray(candidate)) {
                    candidate.forEach(pushImage);
                }
            },
        );

        pushImage(selectedSpace?.space_photo_url);

        const uniqueImages = resolvedImages.filter(
            (image, index, arr) => !!image?.src && arr.findIndex(i => i.src === image.src) === index,
        );

        const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
        if (isLocalhost && uniqueImages.length <= 1) {
            const demoImages = demoCarouselImages.map(src => ({
                src,
                alt: `${selectedSpace?.space_name || 'Space'} demo image`,
            }));

            if (uniqueImages.length === 1) {
                return [uniqueImages[0], ...demoImages.slice(0, 2)];
            }
            return demoImages;
        }

        if (uniqueImages.length === 0) {
            return [
                {
                    src: null,
                    alt: 'Placeholder image for this space',
                },
            ];
        }

        return uniqueImages;
    }, [selectedSpace]);

    React.useEffect(() => {
        setActiveImageIndex(0);
        setPreviousImageIndex(null);
        setIsCarouselAnimating(false);
        setCarouselDirection('next');
    }, [selectedSpace]);

    React.useEffect(() => {
        return () => {
            if (carouselAnimationTimeoutRef.current) {
                clearTimeout(carouselAnimationTimeoutRef.current);
            }
        };
    }, []);

    React.useEffect(() => {
        if (!canShowAdvancedFilters && showAdvancedFilters) {
            setShowAdvancedFilters(false);
        }
    }, [canShowAdvancedFilters, showAdvancedFilters]);

    const handleCarouselChange = direction => {
        if (detailImages.length <= 1 || isCarouselAnimating) return;

        const nextIndex =
            direction === 'prev'
                ? (activeImageIndex - 1 + detailImages.length) % detailImages.length
                : (activeImageIndex + 1) % detailImages.length;

        setPreviousImageIndex(activeImageIndex);
        setCarouselDirection(direction);
        setActiveImageIndex(nextIndex);
        setIsCarouselAnimating(true);

        if (carouselAnimationTimeoutRef.current) {
            clearTimeout(carouselAnimationTimeoutRef.current);
        }
        carouselAnimationTimeoutRef.current = setTimeout(() => {
            setIsCarouselAnimating(false);
            setPreviousImageIndex(null);
        }, carouselAnimationDurationMs);
    };

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

    const goToIntentSelection = () => {
        setSelectedSpace(null);
        setView('intent');
    };

    const goToLegacyBrowse = () => {
        const url = new URL(window.location.href);
        url.searchParams.delete('journey');
        url.searchParams.delete('newJourney');
        url.searchParams.delete('legacyMap');
        window.location.assign(url.toString());
    };

    const handleIntentSelect = intent => {
        setSelectedIntentId(intent.id);
        applyIntentFilters(intent);
        setView('results');
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

    const landingHighlights = [
        {
            title: 'Discover spaces faster',
            text:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        },
        {
            title: 'Match to your study style',
            text:
                'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        },
        {
            title: 'Refine with confidence',
            text:
                'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        },
    ];

    const landingSupportItems = [
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.',
        'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    ];

    let activeImageAnimationClass = '';
    if (isCarouselAnimating) {
        activeImageAnimationClass = carouselDirection === 'next' ? 'slideInFromRight' : 'slideInFromLeft';
    }

    return (
        <StyledJourneyWrapper data-testid="spaces-journey-wrapper">
            <StyledJourneyPanel>
                <Stack
                    direction="row"
                    justifyContent={canShowAdvancedFilters ? 'space-between' : 'flex-start'}
                    alignItems="center"
                >
                    <Typography
                        component="h1"
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
                            sx={{ textTransform: 'none', fontWeight: 600 }}
                        >
                            Advanced filters
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
                        />
                    </StyledAdvancedFiltersPanel>
                )}

                {view === 'landing' && (
                    <Stack spacing={3}>
                        <StyledDetailSurface>
                            <Stack spacing={2}>
                                <Typography component="h2" variant="h5" sx={{ fontWeight: 700, color: '#1f1230' }}>
                                    Start with what you need
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#1f1230', maxWidth: '70ch' }}>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </Typography>
                                <Stack direction={isMobileView ? 'column' : 'row'} spacing={1.5}>
                                    <Button
                                        variant="contained"
                                        onClick={goToIntentSelection}
                                        sx={{ textTransform: 'none', alignSelf: 'flex-start' }}
                                    >
                                        Get started
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={goToLegacyBrowse}
                                        sx={{ textTransform: 'none', alignSelf: 'flex-start' }}
                                    >
                                        Browse all study spaces
                                    </Button>
                                </Stack>
                            </Stack>
                        </StyledDetailSurface>

                        <Box
                            sx={{
                                display: 'grid',
                                gap: '1.5rem',
                                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
                                alignItems: 'stretch',
                            }}
                        >
                            {landingHighlights.map(item => (
                                <StyledDetailSurface
                                    key={item.title}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        minHeight: { xs: 'auto', md: '190px' },
                                    }}
                                >
                                    <Typography component="h3" variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                        {item.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#4f4d57' }}>
                                        {item.text}
                                    </Typography>
                                </StyledDetailSurface>
                            ))}
                        </Box>

                        <StyledDetailSurface>
                            <Grid container spacing={3} alignItems="stretch">
                                <Grid item xs={12} md={7}>
                                    <Typography component="h3" variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                        Study Space highlight
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#4f4d57', mb: 1.5 }}>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                        incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices
                                        gravida dictum fusce ut placerat orci nulla.
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#4f4d57' }}>
                                        This is a placeholder. it could have images, text, rich text, etc. blandit
                                        volutpat maecenas volutpat blandit aliquam etiam erat velit scelerisque.
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={5}>
                                    <Box
                                        sx={{
                                            backgroundColor: '#ffffff',
                                            border: '1px solid #ddd8e4',
                                            borderRadius: '10px',
                                            p: '1rem',
                                            height: '100%',
                                            boxSizing: 'border-box',
                                        }}
                                    >
                                        <Typography component="h4" variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                                            What's offered here
                                        </Typography>
                                        <Stack component="ul" spacing={1} sx={{ pl: '1.25rem', m: 0 }}>
                                            {landingSupportItems.map(item => (
                                                <Typography
                                                    component="li"
                                                    variant="body2"
                                                    key={item}
                                                    sx={{ color: '#4f4d57' }}
                                                >
                                                    {item}
                                                </Typography>
                                            ))}
                                        </Stack>
                                    </Box>
                                </Grid>
                            </Grid>
                        </StyledDetailSurface>
                    </Stack>
                )}

                {view === 'intent' && (
                    <>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Button
                                variant="text"
                                startIcon={<ArrowBackIcon />}
                                onClick={() => setView('landing')}
                                sx={{ textTransform: 'none' }}
                            >
                                Back
                            </Button>
                        </Stack>
                        <Typography component="h2" variant="h5" sx={{ fontWeight: 700, color: '#1f1230' }}>
                            What sort of space would you like to find?
                        </Typography>
                        <Grid container spacing={3}>
                            {intentDefinitions.map(intent => {
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
                                onClick={() => setView('intent')}
                                sx={{ textTransform: 'none' }}
                            >
                                Back
                            </Button>
                            {!!selectedIntent && <Chip label={selectedIntent.label} variant="outlined" />}
                        </Stack>
                        <Typography component="h2" variant="h5" sx={{ fontWeight: 700, color: '#1f1230' }}>
                            {selectedIntent?.label || 'Matching spaces'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666' }}>
                            Showing {filteredSpaceLocations?.length || 0}
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
                            {filteredSpaceLocations?.map(space => (
                                <StyledResultCardButton
                                    key={space?.space_id}
                                    onClick={() => {
                                        setSelectedSpace(space);
                                        setView('details');
                                    }}
                                >
                                    <Box sx={{ p: '1.5rem', width: '100%', textAlign: 'left' }}>
                                        <Typography sx={{ fontWeight: 700, color: '#1f1230', mb: 0.5 }}>
                                            {space?.space_name}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                                            {space?.space_library_name}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: '#999',
                                                mb:
                                                    space?.space_type_details?.space_type_description ||
                                                    space?.space_description
                                                        ? 1
                                                        : 0,
                                            }}
                                        >
                                            {space?.space_type_details?.space_type_name || space?.space_type}
                                        </Typography>
                                        {!!space?.space_type_details?.space_type_description && (
                                            <Typography
                                                variant="body2"
                                                sx={{ color: '#4f4d57', mb: space?.space_description ? 0.75 : 0 }}
                                            >
                                                {space.space_type_details.space_type_description}
                                            </Typography>
                                        )}
                                        {!!space?.space_description && (
                                            <Typography variant="body2" sx={{ color: '#666', fontStyle: 'italic' }}>
                                                {String(space.space_description)
                                                    .replace(/<[^>]*>/g, ' ')
                                                    .trim()}
                                            </Typography>
                                        )}
                                    </Box>
                                </StyledResultCardButton>
                            ))}
                        </Stack>
                    </>
                )}

                {view === 'details' && !!selectedSpace && (
                    <>
                        <Button
                            variant="text"
                            startIcon={<ArrowBackIcon />}
                            onClick={() => setView('results')}
                            sx={{ textTransform: 'none', alignSelf: 'flex-start' }}
                        >
                            Back to results
                        </Button>
                        <StyledDetailSurface>
                            <Typography component="h2" variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#1f1230' }}>
                                {selectedSpace?.space_name}
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 2, color: '#666' }}>
                                {selectedSpace?.space_library_name}
                            </Typography>

                            <StyledImageCarousel>
                                {detailImages?.[activeImageIndex]?.src ? (
                                    <div className="carouselViewport">
                                        {isCarouselAnimating && detailImages?.[previousImageIndex]?.src && (
                                            <img
                                                className={`carouselImage ${
                                                    carouselDirection === 'next' ? 'slideOutToLeft' : 'slideOutToRight'
                                                }`}
                                                src={detailImages[previousImageIndex].src}
                                                alt={detailImages[previousImageIndex].alt}
                                            />
                                        )}
                                        <img
                                            className={`carouselImage ${activeImageAnimationClass}`}
                                            src={detailImages[activeImageIndex].src}
                                            alt={detailImages[activeImageIndex].alt}
                                        />
                                    </div>
                                ) : (
                                    <Box
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#53515b',
                                            fontWeight: 600,
                                        }}
                                    >
                                        Image placeholder
                                    </Box>
                                )}

                                {detailImages.length > 1 && (
                                    <StyledCarouselControlsLayer>
                                        <StyledCarouselControl
                                            aria-label="Previous image"
                                            onClick={() => handleCarouselChange('prev')}
                                            sx={{ left: 8 }}
                                        >
                                            <ChevronLeftIcon />
                                        </StyledCarouselControl>
                                        <StyledCarouselControl
                                            aria-label="Next image"
                                            onClick={() => handleCarouselChange('next')}
                                            sx={{ right: 8 }}
                                        >
                                            <ChevronRightIcon />
                                        </StyledCarouselControl>
                                    </StyledCarouselControlsLayer>
                                )}
                            </StyledImageCarousel>

                            <Typography variant="body1" sx={{ mt: 2, mb: 1 }}>
                                {selectedSpace?.space_description
                                    ? String(selectedSpace.space_description).replace(/<[^>]*>/g, ' ')
                                    : 'Space details will appear here.'}
                            </Typography>

                            <Typography component="h3" variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 700 }}>
                                Space details
                            </Typography>
                            <SpaceDetails
                                weeklyHours={weeklyHours}
                                weeklyHoursLoading={weeklyHoursLoading}
                                weeklyHoursError={weeklyHoursError}
                                bookableSpace={selectedSpace}
                                collapsed={false}
                                isExpanded
                                showToggle={false}
                            />

                            <Typography component="h3" variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 700 }}>
                                Map
                            </Typography>
                            <div
                                style={{
                                    height: isMobileView ? '260px' : '320px',
                                    borderRadius: '10px',
                                    overflow: 'hidden',
                                }}
                            >
                                <BookableSpacesMap
                                    sortedSpaceLocations={[selectedSpace]}
                                    spacesFavouritesList={null}
                                    onMarkerClick={() => null}
                                    centreLatLong={selectedSpace}
                                />
                            </div>
                        </StyledDetailSurface>
                    </>
                )}
            </StyledJourneyPanel>
        </StyledJourneyWrapper>
    );
};

BookableSpacesJourney.propTypes = {
    filteredSpaceLocations: PropTypes.array,
    totalSpaceCount: PropTypes.number,
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
};

export default React.memo(BookableSpacesJourney);
