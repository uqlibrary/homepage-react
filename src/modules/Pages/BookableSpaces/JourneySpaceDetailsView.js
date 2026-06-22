import React from 'react';
import PropTypes from 'prop-types';

import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { pluralise } from 'helpers/general';
import { StyledPrimaryButton } from 'helpers/general';
import BookableSpacesMap from 'modules/Pages/BookableSpaces/BookableSpacesMap';
import { getSpaceHoursStatus, spaceOpeningHours } from 'modules/Pages/BookableSpaces/spacesHelpers';
import {
    formatSpaceOutageRangeForPublicNotice,
    formatSpaceOutageUntilForPublicNotice,
    getSpaceOutageShowTimePublic,
    getVisibleSpaceOutage,
} from 'modules/Pages/Admin/BookableSpaces/Spaces/Form/spaceOutageHelpers';
import UserAttention from 'modules/SharedComponents/Toolbox/UserAttention';

const journeyFallbackDetailImage = require('../../../../public/images/digital-learning-hub-hero-shot-wide.png');

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
        label: 'Currently closed',
        sx: { backgroundColor: '#fdecea', color: '#b71c1c', borderColor: '#ffcdd2', border: '1px solid' },
    },
};

const StyledDetailSurface = styled('div')(({ theme }) => ({
    backgroundColor: '#f9f8fa',
    color: '#1f1230',
    borderRadius: '12px',
    padding: '1.5rem',
    border: `1px solid ${theme.palette.designSystem.borderColor}`,
}));

const StyledDetailImage = styled('div')(({ theme }) => ({
    width: '100%',
    backgroundColor: '#ece8f3',
    borderRadius: '12px',
    overflow: 'hidden',
    minHeight: '240px',
    border: `1px solid ${theme.palette.designSystem.borderColor}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& img': {
        width: '100%',
        height: '100%',
        maxHeight: '420px',
        objectFit: 'cover',
        display: 'block',
    },
    [theme.breakpoints.down('sm')]: {
        minHeight: '200px',
        '& img': {
            maxHeight: '260px',
        },
    },
}));

const SpaceOpenStatusChip = ({ space, weeklyHours, weeklyHoursLoading, weeklyHoursError }) => {
    const visibleOutage = getVisibleSpaceOutage(space?.space_outages);
    if (visibleOutage?.status === 'Current') {
        return (
            <Chip
                size="small"
                label="Currently closed"
                sx={{
                    backgroundColor: '#fdecea',
                    color: '#b71c1c',
                    border: '1px solid #ffcdd2',
                    fontWeight: 600,
                }}
            />
        );
    }

    const status = !weeklyHoursLoading && !weeklyHoursError ? getSpaceHoursStatus(space, weeklyHours) : null;
    if (!status) return null;

    const config = HOURS_STATUS_CONFIG[status];
    if (!config) return null;

    return (
        <Chip
            size="small"
            label={config.label}
            sx={{
                ...config.sx,
                fontWeight: 600,
            }}
        />
    );
};

const JourneySpaceDetailsView = ({
    selectedSpace,
    weeklyHours,
    weeklyHoursLoading,
    weeklyHoursError,
    showBackButton = true,
    backLabel = 'Back to results',
    onBack,
    showFavouriteControls = false,
    isLoggedIn = false,
    isSelectedSpaceFavourite = false,
    favouriteButtonLabel = 'Add to favourites',
    isFavouriteActionInProgress = false,
    onFavouriteToggle,
    showMap = true,
}) => {
    const theme = useTheme();
    const isMobileView = useMediaQuery(theme.breakpoints.down('sm'));

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

        if (uniqueImages.length === 0) {
            return [
                {
                    src: journeyFallbackDetailImage,
                    alt: 'Placeholder image for this space',
                },
            ];
        }

        return uniqueImages;
    }, [selectedSpace]);

    const spaceHours = React.useMemo(
        () => (!weeklyHoursLoading && !weeklyHoursError ? spaceOpeningHours(selectedSpace, weeklyHours) || [] : []),
        [selectedSpace, weeklyHours, weeklyHoursLoading, weeklyHoursError],
    );

    const visibleOutage = React.useMemo(() => getVisibleSpaceOutage(selectedSpace?.space_outages), [
        selectedSpace?.space_outages,
    ]);

    if (!selectedSpace) {
        return null;
    }

    return (
        <>
            {showBackButton && (
                <Button
                    variant="text"
                    startIcon={<ArrowBackIcon />}
                    onClick={onBack}
                    sx={{ textTransform: 'none', alignSelf: 'flex-start' }}
                >
                    {backLabel}
                </Button>
            )}

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                    gap: '1.5rem',
                    alignItems: 'start',
                }}
            >
                <StyledDetailImage>
                    {detailImages?.[0]?.src ? (
                        <img
                            src={detailImages[0].src}
                            alt={detailImages[0].alt}
                            onError={event => {
                                event.currentTarget.onerror = null;
                                event.currentTarget.src = journeyFallbackDetailImage;
                            }}
                        />
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
                            No image available
                        </Box>
                    )}
                </StyledDetailImage>

                <Stack spacing={2} sx={{ pt: { xs: 0, md: 0.5 } }}>
                    <Box>
                        <Typography
                            component="h2"
                            variant="h5"
                            sx={{ fontWeight: 700, color: '#1f1230', mb: 0.5, lineHeight: 1.2 }}
                        >
                            {selectedSpace?.space_name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                            {selectedSpace?.space_library_name}
                        </Typography>
                        {!!(selectedSpace?.space_type_details?.space_type_name || selectedSpace?.space_type) && (
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap' }}>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        display: 'inline-block',
                                        px: 1.25,
                                        py: 0.25,
                                        borderRadius: '20px',
                                        backgroundColor: '#ede8f5',
                                        color: '#51247a',
                                        fontWeight: 600,
                                        letterSpacing: 0.3,
                                    }}
                                >
                                    {selectedSpace?.space_type_details?.space_type_name || selectedSpace?.space_type}
                                </Typography>
                                {isSelectedSpaceFavourite && (
                                    <Chip
                                        data-testid={`spaces-journey-favourite-chip-${selectedSpace?.space_id}`}
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
                                    space={selectedSpace}
                                    weeklyHours={weeklyHours}
                                    weeklyHoursLoading={weeklyHoursLoading}
                                    weeklyHoursError={weeklyHoursError}
                                />
                            </Stack>
                        )}
                    </Box>

                    {!!visibleOutage && (
                        <UserAttention
                            titleText={visibleOutage.status === 'Current' ? 'Current closure' : 'Upcoming closure'}
                            tone={visibleOutage.tone}
                            variant="aligned"
                        >
                            <Typography
                                variant="body2"
                                data-testid={`spaces-journey-outage-message-${selectedSpace?.space_id}`}
                            >
                                {visibleOutage.status === 'Current'
                                    ? `Currently unavailable until ${formatSpaceOutageUntilForPublicNotice(
                                          visibleOutage.outage?.space_outage_end,
                                          undefined,
                                          getSpaceOutageShowTimePublic(visibleOutage.outage),
                                      )}.`
                                    : `Closed ${formatSpaceOutageRangeForPublicNotice(
                                          visibleOutage.outage?.space_outage_start,
                                          visibleOutage.outage?.space_outage_end,
                                          getSpaceOutageShowTimePublic(visibleOutage.outage),
                                      )}.`}
                            </Typography>
                            {!!visibleOutage.reason && (
                                <Typography
                                    variant="body2"
                                    data-testid={`spaces-journey-outage-reason-${selectedSpace?.space_id}`}
                                >
                                    Reason: {visibleOutage.reason}
                                </Typography>
                            )}
                        </UserAttention>
                    )}

                    {!!(selectedSpace?.space_type_details?.space_type_description || selectedSpace?.space_description) && (
                        <Box sx={{ borderLeft: '3px solid #51247a', pl: 1.5 }}>
                            {!!selectedSpace?.space_type_details?.space_type_description && (
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: '#4f4d57',
                                        mb: selectedSpace?.space_description ? 1 : 0,
                                    }}
                                >
                                    {selectedSpace.space_type_details.space_type_description}
                                </Typography>
                            )}
                            {!!selectedSpace?.space_description && (
                                <Typography variant="body2" sx={{ color: '#666' }}>
                                    {String(selectedSpace.space_description)
                                        .replace(/<[^>]*>/g, ' ')
                                        .trim()}
                                </Typography>
                            )}
                        </Box>
                    )}

                    {showFavouriteControls && isLoggedIn && !!selectedSpace?.space_id && (
                        <Box>
                            <StyledPrimaryButton
                                variant={isSelectedSpaceFavourite ? 'contained' : 'outlined'}
                                disabled={isFavouriteActionInProgress}
                                onClick={() => onFavouriteToggle?.(selectedSpace)}
                                sx={{ textTransform: 'none' }}
                            >
                                {favouriteButtonLabel}
                            </StyledPrimaryButton>
                        </Box>
                    )}
                </Stack>
            </Box>

            <StyledDetailSurface>
                <Typography
                    component="h3"
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        mb: 2,
                        color: '#1f1230',
                        pb: 1,
                        borderBottom: '1px solid #ddd8e4',
                    }}
                >
                    Space details
                </Typography>
                <Stack spacing={2.5}>
                    {!!selectedSpace?.space_external_book_url ? (
                        <Box>
                            <StyledPrimaryButton
                                variant="contained"
                                component="a"
                                href={selectedSpace.space_external_book_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ textTransform: 'none' }}
                            >
                                Book this space
                            </StyledPrimaryButton>
                        </Box>
                    ) : (
                        <Typography variant="body2" sx={{ color: '#4f4d57' }}>
                            No booking required.
                        </Typography>
                    )}

                    {!!(selectedSpace?.space_capacity && selectedSpace.space_capacity > 0) && (
                        <Typography variant="body2" sx={{ color: '#4f4d57' }}>
                            <strong>Capacity:</strong> {selectedSpace.space_capacity}{' '}
                            {pluralise('person', selectedSpace.space_capacity, 'people')}
                        </Typography>
                    )}

                    {selectedSpace?.facility_types?.length > 0 && (
                        <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.75, color: '#1f1230' }}>
                                Facilities
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {selectedSpace.facility_types.map(f => (
                                    <Chip
                                        key={f.facility_type_id}
                                        label={f.facility_type_name}
                                        size="small"
                                        variant="outlined"
                                        sx={{ borderColor: '#c9bfdf', color: '#51247a' }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    )}

                    {spaceHours.length > 0 && (
                        <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: '#1f1230' }}>
                                {selectedSpace?.space_library_name} opening hours
                            </Typography>
                            <Stack spacing={0}>
                                {spaceHours.map((d, i) => {
                                    const isToday = d?.dayName === 'Today';
                                    return (
                                        <Box
                                            key={i}
                                            sx={{
                                                display: 'grid',
                                                gridTemplateColumns: '7.5rem 1fr',
                                                gap: '0.5rem',
                                                py: 0.75,
                                                borderBottom: i < spaceHours.length - 1 ? '1px solid #f0ecf7' : 'none',
                                                backgroundColor: isToday ? '#f9f6fe' : 'transparent',
                                                px: isToday ? 1 : 0,
                                                borderRadius: isToday ? '4px' : 0,
                                                mx: isToday ? -1 : 0,
                                            }}
                                        >
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontWeight: isToday ? 700 : 400,
                                                    color: isToday ? '#51247a' : '#1f1230',
                                                }}
                                            >
                                                {d?.dayName}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: isToday ? '#51247a' : '#4f4d57',
                                                    fontWeight: isToday ? 600 : 400,
                                                }}
                                            >
                                                {d?.rendered}
                                            </Typography>
                                        </Box>
                                    );
                                })}
                            </Stack>
                        </Box>
                    )}
                </Stack>
            </StyledDetailSurface>

            {showMap && (
                <StyledDetailSurface sx={{ p: 0, overflow: 'hidden' }}>
                    <Typography
                        component="h3"
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            color: '#1f1230',
                            px: '1.5rem',
                            pt: '1.25rem',
                            pb: '1rem',
                            borderBottom: '1px solid #ddd8e4',
                        }}
                    >
                        Location
                    </Typography>
                    <div style={{ height: isMobileView ? '260px' : '340px' }}>
                        <BookableSpacesMap
                            sortedSpaceLocations={[selectedSpace]}
                            spacesFavouritesList={null}
                            onMarkerClick={() => null}
                            centreLatLong={selectedSpace}
                        />
                    </div>
                </StyledDetailSurface>
            )}
        </>
    );
};

SpaceOpenStatusChip.propTypes = {
    space: PropTypes.object,
    weeklyHours: PropTypes.any,
    weeklyHoursLoading: PropTypes.bool,
    weeklyHoursError: PropTypes.any,
};

JourneySpaceDetailsView.propTypes = {
    selectedSpace: PropTypes.object,
    weeklyHours: PropTypes.any,
    weeklyHoursLoading: PropTypes.bool,
    weeklyHoursError: PropTypes.any,
    showBackButton: PropTypes.bool,
    backLabel: PropTypes.string,
    onBack: PropTypes.func,
    showFavouriteControls: PropTypes.bool,
    isLoggedIn: PropTypes.bool,
    isSelectedSpaceFavourite: PropTypes.bool,
    favouriteButtonLabel: PropTypes.string,
    isFavouriteActionInProgress: PropTypes.bool,
    onFavouriteToggle: PropTypes.func,
    showMap: PropTypes.bool,
};

export default React.memo(JourneySpaceDetailsView);
