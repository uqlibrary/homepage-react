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

    const overrideMessage = !!bookableSpace?.space_opening_hours_override ? (
        <p data-testid={`space-${spaceId}-override_opening_hours`}>
            Note: {bookableSpace?.space_opening_hours_override}
        </p>
    ) : (
        ''
    );

    if (weeklyHoursLoading === true) {
        return null;
    }
    if (!!weeklyHoursError) {
        return (
            <>
                <p data-testid={`space-${spaceId}-weekly-hours-error`}>
                    General opening hours currently unavailable - please try again later.
                </p>
                {overrideMessage}
            </>
        );
    }

    if (weeklyHours?.locations?.length === 0) {
        return overrideMessage; // we don't get the building opening hours for this location
    }

    const openingHoursList = spaceOpeningHours(bookableSpace, weeklyHours);

    if (!openingHoursList || openingHoursList.length === 0) {
        return overrideMessage; // no opening hours
    }

    return (
        <>
            <StyledHeadingTypography component={'h4'} variant={'h6'}>
                {bookableSpace?.space_library_name} opening hours
            </StyledHeadingTypography>
            <div style={{ overflowX: 'scroll' }} tabIndex="0">
                {overrideMessage}
                {openingHoursList
                    ?.slice(0, 2) // onlyy today and tomorrow, to make the display shorter
                    .map(d => (
                        <div>
                            {d.dayName}: {d.rendered}
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
