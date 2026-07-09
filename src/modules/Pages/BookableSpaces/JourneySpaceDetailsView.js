import React from 'react';
import PropTypes from 'prop-types';

import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { baseButtonStyles, baseHoverFocusStyles, pluralise } from 'helpers/general';
import { StyledPrimaryButton } from 'helpers/general';
import BookableSpacesMap from 'modules/Pages/BookableSpaces/BookableSpacesMap';
import {
    getFriendlyLocationDescription,
    getSpaceHoursStatus,
    spaceOpeningHours,
} from 'modules/Pages/BookableSpaces/spacesHelpers';
import {
    formatSpaceOutageRangeForPublicNotice,
    formatSpaceOutageUntilForPublicNotice,
    getSpaceOutageShowTimePublic,
    getVisibleSpaceOutage,
} from 'modules/Pages/Admin/BookableSpaces/Spaces/Form/spaceOutageHelpers';
import UserAttention from 'modules/SharedComponents/Toolbox/UserAttention';

import { useAccountContext } from 'context';
import { OpeningHoursDown } from './OpeningHoursDown';

const journeyFallbackDetailImage = require('../../../../public/images/digital-learning-hub-hero-shot-wide.png');

const StyledDetailSurface = styled('div')(({ theme }) => ({
    color: theme.palette.designSystem.bodyCopy,
}));
const StyledSpaceTitleTypography = styled(Typography)(({ theme }) => ({
    fontFamily: theme.palette.designSystem.fontFamilyH1,
    fontWeight: 500,
    color: theme.palette.designSystem.headingColor,
    // marginBottom: '1rem',
    lineHeight: 1.2,
}));
const StyledNameTypography = styled(Typography)(({ theme }) => ({
    color: theme.palette.designSystem.bodyCopy,
    marginBottom: '1rem',
    fontSize: '1rem',
}));
const StyledFriendlyLocationDiv = styled('div')(() => ({
    marginBottom: '1rem',
    '& .location-space': {
        lineHeight: 1.25,
    },
    '& .location-floor': {
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
    },
}));
const StyledH3Typography = styled(Typography)(({ theme }) => ({
    fontSize: '24px',
    marginBottom: '1rem',
    color: theme.palette.designSystem.headingColor,
    paddingBotom: '0.5rem',
}));
const StyledH4Typography = styled(Typography)(({ theme }) => ({
    fontWeight: 500,
    fontSize: '20px',
    color: theme.palette.designSystem.headingColor,
}));
const StyledDetailImage = styled('div')(({ theme }) => ({
    width: '100%',
    backgroundColor: '#ece8f3',
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
const StyledMissingImageBox = styled(Box)(({ theme }) => ({
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.designSystem.bodyCopy,
    fontWeight: 600,
}));
const StyledHeadingChip = styled(Chip)(() => ({
    fontSize: '1rem',
    marginBottom: '0.5rem !important',
    '& span': {
        padding: '12px 16px',
    },
}));
const StyledBodyChip = styled(Chip)(({ theme }) => ({
    fontSize: '1rem',
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    '& span': {
        padding: '12px 16px',
        fontWeight: 400,
    },
}));
const StyledSpaceDescriptionTypography = styled(Typography)(({ theme }) => ({
    color: theme.palette.designSystem.bodyCopy,
    fontSize: '1rem',
}));
const StyledTopBox = styled(Box)(() => ({
    display: 'grid',
    gap: '1.5rem',
    alignItems: 'start',
    gridTemplateColumns: '1fr',
    '&.horizontallayout': {
        gridTemplateColumns: '1fr 1fr',
    },
    // '&.verticallayout': {
    //     gridTemplateColumns: '1fr',
    // },
}));

const StyledTightLinkButton = styled(Button)(({ theme }) => ({
    ...baseButtonStyles,
    padding: 0,
    borderColor: '#fff',
    textDecoration: 'underline',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    color: theme.palette.primary.main,
    borderRadius: 0,
    '&:hover, &:focus': {
        ...baseHoverFocusStyles,
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
        color: '#fff',
    },
}));

const defaultChipStyles = theme => {
    return {
        borderColor: theme.palette.designSystem.bodyCopy,
        border: '1px solid',
        color: theme.palette.designSystem.bodyCopy,
        fontWeight: 600,
    };
};
const SpaceOpenStatusChip = ({ space, weeklyHours, weeklyHoursLoading, weeklyHoursError }) => {
    const chipTestId = `spaces-${space?.space_id}-details-outage-chip`;
    const theme = useTheme();
    const openingHoursConfig = (status, theme) => {
        if (status === 'open') {
            return {
                label: 'Open now',
                sx: {
                    ...defaultChipStyles(theme),
                    backgroundColor: theme.palette.designSystem.alert.info,
                },
            };
        }
        if (status === 'closing-soon') {
            return {
                label: 'Closing soon',
                sx: {
                    ...defaultChipStyles(theme),
                    backgroundColor: theme.palette.designSystem.alert.warning,
                },
            };
        }
        if (status === 'closed') {
            return {
                label: 'Currently closed',
                sx: {
                    ...defaultChipStyles(theme),
                    backgroundColor: theme.palette.designSystem.alert.error,
                },
            };
        }
        return null;
    };
    const visibleOutage = getVisibleSpaceOutage(space?.space_outages);
    if (visibleOutage?.status === 'Current') {
        const config = openingHoursConfig('closed', theme);
        return (
            <StyledHeadingChip
                data-testid={chipTestId}
                size="small"
                label={config.label}
                sx={{
                    ...config?.sx,
                }}
            />
        );
    }

    const status = !weeklyHoursLoading && !weeklyHoursError ? getSpaceHoursStatus(space, weeklyHours) : null;
    if (!status) {
        return null;
    }

    const config = openingHoursConfig(status, theme);
    if (!config) {
        return null;
    }
    return (
        <StyledHeadingChip
            data-testid={chipTestId}
            size="small"
            label={config.label}
            sx={{
                ...config.sx,
            }}
        />
    );
};

SpaceOpenStatusChip.propTypes = {
    space: PropTypes.object,
    weeklyHours: PropTypes.any,
    weeklyHoursLoading: PropTypes.bool,
    weeklyHoursError: PropTypes.any,
};

const OpenSpaceNewWindowButton = ({ spaceDetails }) => {
    return (
        <a
            href={`/spaces?journeyStep=details&journeySpace=${spaceDetails?.space_uuid}`}
            target="_blank"
            style={{ display: 'inline-flex', pr: 0 }}
            aria-label={`Open Space ${spaceDetails?.space_name} in a new window`}
        >
            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                <path
                    d="m6.743 9.257-2.514 2.514-2.515 2.515M14.286 5.486V1.714h-3.772"
                    stroke="#000"
                    strokeWidth=".75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M1.714 10.514v3.772h3.772M14.286 1.714 9.257 6.743"
                    stroke="#000"
                    strokeWidth=".75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </a>
    );
};
OpenSpaceNewWindowButton.propTypes = {
    spaceDetails: PropTypes.object,
};
const JourneySpaceDetailsView = ({
    selectedSpace,
    weeklyHours,
    weeklyHoursLoading,
    weeklyHoursError,
    showBackButton = true,
    narrowView = true,
    backLabel = 'Back to results',
    onBack,
    showFavouriteControls = false,
    isSelectedSpaceFavourite = false,
    favouriteButtonLabel = 'Add to favourites',
    isFavouriteActionInProgress = false,
    onFavouriteToggle,
    showMap = true,
}) => {
    const theme = useTheme();
    const isMobileView = useMediaQuery(theme.breakpoints.down('sm')); // must be called unconditionally
    const isMobileLayout = narrowView || isMobileView;

    const { account } = useAccountContext();
    const isLoggedIn = !!account?.id;

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

    // const spaceHours = React.useMemo(
    //     () => (!weeklyHoursLoading && !weeklyHoursError ? spaceOpeningHours(selectedSpace, weeklyHours) || [] : []),
    //     [selectedSpace, weeklyHours, weeklyHoursLoading, weeklyHoursError],
    // );

    const visibleOutage = React.useMemo(
        () => getVisibleSpaceOutage(selectedSpace?.space_outages),
        [selectedSpace?.space_outages],
    );

    if (!selectedSpace) {
        return null;
    }

    console.log('### selectedSpace=', selectedSpace);
    return (
        <>
            {showBackButton ? (
                <Button
                    variant="text"
                    startIcon={<ArrowBackIcon />}
                    onClick={onBack}
                    sx={{ textTransform: 'none', alignSelf: 'flex-start' }}
                >
                    {backLabel}
                </Button>
            ) : null}

            <StyledTopBox id="sdsdsdf" className={isMobileLayout ? 'verticallayout' : 'horizontallayout'}>
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
                        <StyledMissingImageBox>No image available</StyledMissingImageBox>
                    )}
                </StyledDetailImage>
                <Stack spacing={2} sx={{ pt: { xs: 0, md: 0.5 } }}>
                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <StyledSpaceTitleTypography
                                component="h2"
                                variant="h5"
                                data-testid={`spaces-${selectedSpace?.space_id}-details-name`}
                            >
                                {selectedSpace?.space_name}
                            </StyledSpaceTitleTypography>
                            {narrowView && <OpenSpaceNewWindowButton spaceId={selectedSpace} />}
                        </Box>
                        {/* <StyledNameTypography variant="body2">{selectedSpace?.space_library_name}</StyledNameTypography>*/}
                        <StyledFriendlyLocationDiv data-testid={`space-${selectedSpace?.space_id}-friendly-location`}>
                            {getFriendlyLocationDescription(selectedSpace, false, { space_name: true })}
                        </StyledFriendlyLocationDiv>{' '}
                        {!!(selectedSpace?.space_type_details?.space_type_name || selectedSpace?.space_type) && (
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap' }}>
                                <StyledHeadingChip
                                    label={
                                        selectedSpace?.space_type_details?.space_type_name || selectedSpace?.space_type
                                    }
                                    size="small"
                                    sx={{
                                        ...defaultChipStyles(theme),
                                        backgroundColor: theme.palette.designSystem.purple.purple50,
                                        fontWeight: 700,
                                    }}
                                />
                                {isSelectedSpaceFavourite && (
                                    <StyledHeadingChip
                                        data-testid={`spaces-${selectedSpace?.space_id}-detail-favourite-chip`}
                                        label="Favourite"
                                        size="small"
                                        sx={{
                                            ...defaultChipStyles(theme),
                                            backgroundColor: theme.palette.designSystem.alert.info,
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
                                    data-testid={`space-${selectedSpace?.space_id}-outage-reason`}
                                >
                                    Reason: {visibleOutage.reason}
                                </Typography>
                            )}
                        </UserAttention>
                    )}

                    {!!(
                        selectedSpace?.space_type_details?.space_type_description || selectedSpace?.space_description
                    ) && (
                        <Box>
                            {!!selectedSpace?.space_type_details?.space_type_description && (
                                <StyledSpaceDescriptionTypography
                                    data-testid={`spaces-${selectedSpace.space_id}-details-space-type-description`}
                                    variant="body2"
                                    sx={{
                                        mb: selectedSpace?.space_description ? 1 : 0,
                                    }}
                                >
                                    {selectedSpace.space_type_details.space_type_description}
                                </StyledSpaceDescriptionTypography>
                            )}
                            {!!selectedSpace?.space_description && (
                                <StyledSpaceDescriptionTypography
                                    variant="body2"
                                    data-testid={`space-${selectedSpace?.space_id}-details-description`}
                                >
                                    {String(selectedSpace.space_description)
                                        .replace(/<[^>]*>/g, ' ')
                                        .trim()}
                                </StyledSpaceDescriptionTypography>
                            )}
                        </Box>
                    )}

                    {showFavouriteControls && isLoggedIn && !!selectedSpace?.space_id && (
                        <Box>
                            <StyledTightLinkButton
                                variant={isSelectedSpaceFavourite ? 'contained' : 'outlined'}
                                disabled={isFavouriteActionInProgress}
                                onClick={() => onFavouriteToggle?.(selectedSpace)}
                            >
                                {favouriteButtonLabel}
                            </StyledTightLinkButton>
                        </Box>
                    )}
                </Stack>
            </StyledTopBox>

            <StyledDetailSurface>
                <StyledH3Typography component="h3" variant="h6">
                    Space details
                </StyledH3Typography>
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
                        <Typography variant="body2">No booking required.</Typography>
                    )}

                    {!!(selectedSpace?.space_capacity && selectedSpace.space_capacity > 0) && (
                        <Box>
                            <Typography component="h4" style={{ display: 'inline' }}>
                                Capacity
                            </Typography>
                            <Typography variant="body2" style={{ display: 'inline' }}>
                                : {selectedSpace.space_capacity}{' '}
                                {pluralise('person', selectedSpace.space_capacity, 'people')}
                            </Typography>
                        </Box>
                    )}

                    {selectedSpace?.facility_types?.length > 0 && (
                        <Box data-testid={`space-${selectedSpace.space_id}-facility`}>
                            <StyledH4Typography component="h4" variant="body2" sx={{ mb: 0.75 }}>
                                Facilities
                            </StyledH4Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {selectedSpace.facility_types.map(f => (
                                    <StyledBodyChip
                                        key={f.facility_type_id}
                                        label={f.facility_type_name}
                                        size="small"
                                        variant="outlined"
                                        data-testid={`space-${selectedSpace.space_id}-facility-${f?.facility_type_id}`}
                                    />
                                ))}
                            </Box>
                        </Box>
                    )}

                    <OpeningHoursDown
                        weeklyHoursLoading={weeklyHoursLoading}
                        weeklyHoursError={weeklyHoursError}
                        weeklyHours={weeklyHours}
                        bookableSpace={selectedSpace}
                        showShortList={false}
                    />
                </Stack>
            </StyledDetailSurface>

            {showMap && (
                <StyledDetailSurface sx={{ p: 0, overflow: 'hidden' }}>
                    <StyledH3Typography component="h3" variant="h6" sx={{ pb: '1rem' }}>
                        Location
                    </StyledH3Typography>
                    <div style={{ height: isMobileLayout ? '260px' : '340px' }}>
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

JourneySpaceDetailsView.propTypes = {
    selectedSpace: PropTypes.object,
    weeklyHours: PropTypes.any,
    weeklyHoursLoading: PropTypes.bool,
    weeklyHoursError: PropTypes.any,
    showBackButton: PropTypes.bool,
    narrowView: PropTypes.bool,
    backLabel: PropTypes.string,
    onBack: PropTypes.func,
    showFavouriteControls: PropTypes.bool,
    isSelectedSpaceFavourite: PropTypes.bool,
    favouriteButtonLabel: PropTypes.string,
    isFavouriteActionInProgress: PropTypes.bool,
    onFavouriteToggle: PropTypes.func,
    showMap: PropTypes.bool,
};

export default React.memo(JourneySpaceDetailsView);
