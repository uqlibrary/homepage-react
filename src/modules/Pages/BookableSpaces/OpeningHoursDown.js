import React from 'react';
import PropTypes from 'prop-types';

import { Box, Stack, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

import { spaceOpeningHours } from 'modules/Pages/BookableSpaces/spacesHelpers';

const StyledHeadingTypography = styled(Typography)(() => ({
    fontSize: '1rem',
    fontWeight: 400,
}));

export const OpeningHoursDown = ({
    weeklyHoursLoading,
    weeklyHoursError,
    weeklyHours,
    bookableSpace,
    showShortList = true,
}) => {
    console.log('OpeningHoursDown weeklyHours=', weeklyHours?.locations);
    const theme = useTheme();

    const spaceId = bookableSpace?.space_id;

    if (weeklyHoursLoading === true) {
        return null;
    }
    if (!!weeklyHoursError) {
        return (
            <>
                <p data-testid={`space-${spaceId}-weekly-hours-error`}>
                    General opening hours currently unavailable - please try again later.
                </p>
            </>
        );
    }

    if (weeklyHours?.locations?.length === 0) {
        return ''; // we don't get the building opening hours for this location
    }

    const openingHoursList = spaceOpeningHours(bookableSpace, weeklyHours);
    console.log('OpeningHoursDown openingHoursList=', openingHoursList);

    if (!openingHoursList || openingHoursList?.length === 0) {
        return ''; // no opening hours
    }

    const displayList = showShortList ? openingHoursList?.slice(0, 2) : openingHoursList;
    return (
        <>
            <Box>
                <StyledHeadingTypography component="h4" variant="body2" sx={{ mb: 1 }}>
                    {bookableSpace?.space_library_name} opening hours
                </StyledHeadingTypography>
                <Stack spacing={0}>
                    {displayList?.map((d, i) => {
                        const isToday = d?.dayName === 'Today';
                        const colorByDay = isToday ? theme.palette.primary.main : theme.palette.designSystem.bodyCopy;
                        return (
                            <Box
                                key={i}
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: '7.5rem 1fr',
                                    gap: '0.5rem',
                                    py: 0.75,
                                    borderBottom: i < weeklyHours.length - 1 ? '1px solid #f0ecf7' : 'none',
                                    backgroundColor: isToday
                                        ? theme.palette.designSystem.purple.purple50
                                        : 'transparent',
                                    px: isToday ? 1 : 0,
                                    borderRadius: isToday ? '4px' : 0,
                                    mx: isToday ? -1 : 0,
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{ fontWeight: isToday ? 700 : 400, color: colorByDay }}
                                    data-testid={`space-${bookableSpace?.space_id}-openingHours-${i}`}
                                >
                                    {d?.dayName}
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: isToday ? 600 : 400, color: colorByDay }}>
                                    {d?.rendered}
                                </Typography>
                            </Box>
                        );
                    })}
                </Stack>
            </Box>
        </>
    );
};
OpeningHoursDown.propTypes = {
    weeklyHoursLoading: PropTypes.any,
    weeklyHoursError: PropTypes.any,
    weeklyHours: PropTypes.any,
    bookableSpace: PropTypes.any,
    showShortList: PropTypes.bool,
};

export default React.memo(OpeningHoursDown);
