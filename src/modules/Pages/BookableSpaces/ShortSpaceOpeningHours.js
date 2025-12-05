import React from 'react';
import PropTypes from 'prop-types';

import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { standardText } from 'helpers/general';
import { spaceOpeningHours } from './spacesHelpers';

const StyledParagraphTypography = styled(Typography)(({ theme }) => ({
    ...standardText(theme),
}));

export const ShortSpaceOpeningHours = ({ weeklyHoursLoading, weeklyHoursError, weeklyHours, bookableSpace }) => {
    const spaceId = bookableSpace?.space_id;

    const overrideMessage = (prefix = 'Note: ') =>
        !!bookableSpace?.space_opening_hours_override ? (
            <p data-testid={`space-${spaceId}-override_opening_hours-short`}>
                {prefix} {bookableSpace?.space_opening_hours_override}
            </p>
        ) : (
            ''
        );

    if (weeklyHoursLoading === true) {
        return null;
    }
    if (!!weeklyHoursError) {
        return <>{overrideMessage()}</>;
    }

    if (weeklyHoursLoading === false && weeklyHoursError === false && weeklyHours?.locations?.length === 0) {
        return overrideMessage(''); // we don't get the building opening hours for this location
    }

    const openingHoursList = spaceOpeningHours(bookableSpace, weeklyHours);

    if (!openingHoursList || openingHoursList.length === 0) {
        return overrideMessage(''); // no springshare opening hours
    }

    const todaysHours = openingHoursList.find(o => (o.dayName = 'Today'));

    return (
        <>
            <StyledParagraphTypography component={'p'}>
                <b>{bookableSpace?.space_library_name} opening hours</b> - Today: {todaysHours.rendered}{' '}
                {bookableSpace?.space_opening_hours_override && `(${bookableSpace?.space_opening_hours_override})`}
            </StyledParagraphTypography>
        </>
    );
};

ShortSpaceOpeningHours.propTypes = {
    weeklyHoursLoading: PropTypes.any,
    weeklyHoursError: PropTypes.any,
    weeklyHours: PropTypes.any,
    bookableSpace: PropTypes.any,
};

export default React.memo(ShortSpaceOpeningHours);
