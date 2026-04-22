import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import { spaceOpeningHours } from 'modules/Pages/BookableSpaces/spacesHelpers';

const StyledHeadingTypography = styled(Typography)(() => ({
    fontSize: '1rem',
    fontWeight: 400,
}));

export const OpeningHoursDown = ({ weeklyHoursLoading, weeklyHoursError, weeklyHours, bookableSpace }) => {
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

    if (!openingHoursList || openingHoursList?.length === 0) {
        return ''; // no opening hours
    }

    return (
        <>
            <StyledHeadingTypography component={'h4'} variant={'h6'}>
                {bookableSpace?.space_library_name} opening hours
            </StyledHeadingTypography>
            <div style={{ overflowX: 'scroll' }} tabIndex="0">
                {openingHoursList
                    ?.slice(0, 2) // onlyy today and tomorrow, to make the display shorter
                    ?.map(d => (
                        <div>
                            {d?.dayName}: {d?.rendered}
                        </div>
                    ))}
            </div>
        </>
    );
};
OpeningHoursDown.propTypes = {
    weeklyHoursLoading: PropTypes.any,
    weeklyHoursError: PropTypes.any,
    weeklyHours: PropTypes.any,
    bookableSpace: PropTypes.any,
};

export default React.memo(OpeningHoursDown);
