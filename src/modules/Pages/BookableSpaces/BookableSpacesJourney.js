import React from 'react';
import PropTypes from 'prop-types';

import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    IconButton,
    Stack,
    Typography,
    useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TuneIcon from '@mui/icons-material/Tune';

import SidebarFilters from 'modules/Pages/BookableSpaces/SidebarFilters';
import BookableSpacesMap from 'modules/Pages/BookableSpaces/BookableSpacesMap';
import SpaceDetails from 'modules/Pages/BookableSpaces/SpaceDetails';

const StyledJourneyWrapper = styled('div')(({ theme }) => ({
    marginInline: '2rem',
    minHeight: '80vh',
    background: 'linear-gradient(180deg, #4f2784 0%, #5f3697 100%)',
    borderRadius: '16px',
    padding: '1.5rem',
    color: '#fff',
    [theme.breakpoints.down('sm')]: {
        marginInline: '0.5rem',
        borderRadius: '12px',
        padding: '1rem',
    },
}));

const StyledJourneyPanel = styled('div')(({ theme }) => ({
    maxWidth: '980px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    rowGap: '1rem',
    [theme.breakpoints.up('md')]: {
        rowGap: '1.25rem',
    },
}));

const StyledIntentGrid = styled('div')(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
    gap: '0.75rem',
    [theme.breakpoints.up('sm')]: {
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
    [theme.breakpoints.up('md')]: {
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    },
}));

const StyledIntentButton = styled(Button)(() => ({
    justifyContent: 'flex-start',
    textTransform: 'none',
    borderRadius: '12px',
    minHeight: '3.25rem',
    fontWeight: 600,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    color: '#fff',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.22)',
    },
}));

const StyledResultCard = styled(Card)(() => ({
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease-in-out',
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    '& .MuiCardContent-root:last-child': {
        paddingBottom: '1rem',
    },
}));

const StyledDetailSurface = styled('div')(() => ({
    backgroundColor: '#fff',
    color: '#1f1230',
    borderRadius: '12px',
    padding: '1rem',
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
}));

const StyledCarouselControl = styled(IconButton)(() => ({
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    color: '#fff',
    '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
}));

const intentDefinitions = [
    { id: 'quiet', label: 'Quiet space', matchers: [/quiet/i, /low noise/i] },
    { id: 'collaborative', label: 'Collaborative space', matchers: [/collaborative/i, /group/i, /communal/i] },
    { id: 'computer', label: 'Computer access', matchers: [/computer/i, /byod/i] },
    { id: 'bookable', label: 'Bookable room', matchers: [/bookable/i, /meeting room/i, /training room/i] },
    { id: 'postgrad', label: 'Postgraduate space', matchers: [/postgraduate/i] },
    { id: 'av', label: 'AV equipment', matchers: [/av equipment/i] },
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
    const [showAdvancedFilters, setShowAdvancedFilters] = React.useState(false);

    const selectedIntent = intentDefinitions.find(intent => intent.id === selectedIntentId) || null;

    const detailImages = React.useMemo(() => {
        if (!selectedSpace) return [];
        const imageUrl = selectedSpace?.space_photo_url;
        if (!imageUrl) {
            return [
                {
                    src: null,
                    alt: 'Placeholder image for this space',
                },
            ];
        }
        return [
            {
                src: imageUrl,
                alt: selectedSpace?.space_photo_description || selectedSpace?.space_name || 'Space image',
            },
        ];
    }, [selectedSpace]);

    React.useEffect(() => {
        setActiveImageIndex(0);
    }, [selectedSpace]);

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

    return (
        <StyledJourneyWrapper data-testid="spaces-journey-wrapper">
            <StyledJourneyPanel>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography component="h1" variant={isMobileView ? 'h5' : 'h4'} sx={{ fontWeight: 700 }}>
                        Find a learning space
                    </Typography>
                    <Button
                        variant="text"
                        startIcon={<TuneIcon />}
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                        sx={{ color: '#fff', textTransform: 'none', fontWeight: 600 }}
                    >
                        Advanced filters
                    </Button>
                </Stack>

                {showAdvancedFilters && (
                    <StyledDetailSurface>
                        <SidebarFilters
                            facilityTypeList={facilityTypeList}
                            facilityTypeListLoading={facilityTypeListLoading}
                            facilityTypeListError={facilityTypeListError}
                            selectedFacilityTypes={selectedFacilityTypes}
                            setSelectedFacilityTypes={setSelectedFacilityTypes}
                            filteredFacilityTypeList={filteredFacilityTypeList}
                            suppliedClassName={null}
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
                        />
                    </StyledDetailSurface>
                )}

                {view === 'landing' && (
                    <StyledDetailSurface>
                        <Typography component="h2" variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                            Start with what you need
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            Explore spaces by vibe, study style, and room type. You can always refine with advanced filters.
                        </Typography>
                        <Button variant="contained" onClick={goToIntentSelection} sx={{ textTransform: 'none' }}>
                            Get started
                        </Button>
                    </StyledDetailSurface>
                )}

                {view === 'intent' && (
                    <>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Button
                                variant="text"
                                startIcon={<ArrowBackIcon />}
                                onClick={() => setView('landing')}
                                sx={{ color: '#fff', textTransform: 'none' }}
                            >
                                Back
                            </Button>
                        </Stack>
                        <Typography component="h2" variant="h5" sx={{ fontWeight: 700 }}>
                            What sort of space would you like to find?
                        </Typography>
                        <StyledIntentGrid>
                            {intentDefinitions.map(intent => (
                                <StyledIntentButton key={intent.id} onClick={() => handleIntentSelect(intent)}>
                                    {intent.label}
                                </StyledIntentButton>
                            ))}
                        </StyledIntentGrid>
                    </>
                )}

                {view === 'results' && (
                    <>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                            <Button
                                variant="text"
                                startIcon={<ArrowBackIcon />}
                                onClick={() => setView('intent')}
                                sx={{ color: '#fff', textTransform: 'none' }}
                            >
                                Back
                            </Button>
                            {!!selectedIntent && <Chip label={selectedIntent.label} sx={{ backgroundColor: '#fff' }} />}
                        </Stack>
                        <Typography component="h2" variant="h5" sx={{ fontWeight: 700 }}>
                            {selectedIntent?.label || 'Matching spaces'}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.95 }}>
                            Showing {filteredSpaceLocations?.length || 0}
                            {typeof totalSpaceCount === 'number' ? ` of ${totalSpaceCount}` : ''} spaces
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            <Button
                                variant="outlined"
                                onClick={handleClearJourneyFilters}
                                sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)', textTransform: 'none' }}
                            >
                                Reset quick filters
                            </Button>
                        </Stack>
                        <Stack spacing={1}>
                            {filteredSpaceLocations?.map(space => (
                                <StyledResultCard
                                    key={space?.space_id}
                                    onClick={() => {
                                        setSelectedSpace(space);
                                        setView('details');
                                    }}
                                >
                                    <CardContent>
                                        <Typography sx={{ fontWeight: 700 }}>
                                            {space?.space_name}
                                        </Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                            {space?.space_library_name}
                                        </Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                            {space?.space_type_details?.space_type_name || space?.space_type}
                                        </Typography>
                                    </CardContent>
                                </StyledResultCard>
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
                            sx={{ color: '#fff', textTransform: 'none', alignSelf: 'flex-start' }}
                        >
                            Back to results
                        </Button>
                        <StyledDetailSurface>
                            <Typography component="h2" variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                                {selectedSpace?.space_name}
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                {selectedSpace?.space_library_name}
                            </Typography>

                            <StyledImageCarousel>
                                {detailImages?.[activeImageIndex]?.src ? (
                                    <img src={detailImages[activeImageIndex].src} alt={detailImages[activeImageIndex].alt} />
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
                                    <>
                                        <StyledCarouselControl
                                            aria-label="Previous image"
                                            onClick={() =>
                                                setActiveImageIndex(
                                                    (activeImageIndex - 1 + detailImages.length) % detailImages.length,
                                                )
                                            }
                                            sx={{ left: 8 }}
                                        >
                                            <ChevronLeftIcon />
                                        </StyledCarouselControl>
                                        <StyledCarouselControl
                                            aria-label="Next image"
                                            onClick={() => setActiveImageIndex((activeImageIndex + 1) % detailImages.length)}
                                            sx={{ right: 8 }}
                                        >
                                            <ChevronRightIcon />
                                        </StyledCarouselControl>
                                    </>
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
                            <div style={{ height: isMobileView ? '260px' : '320px', borderRadius: '10px', overflow: 'hidden' }}>
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