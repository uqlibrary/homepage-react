import React from 'react';
import PropTypes from 'prop-types';

import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { standardText } from 'helpers/general';
import { spaceOpeningHours } from 'modules/Pages/BookableSpaces/spacesHelpers';

const StyledParagraphTypography = styled(Typography)(({ theme }) => ({
    ...standardText(theme),
}));

export const OpeningHoursShort = ({ weeklyHoursLoading, weeklyHoursError, weeklyHours, bookableSpace }) => {
    if (weeklyHoursLoading === true) {
        return null;
    }
    if (!!weeklyHoursError) {
        return null;
    }

    if (weeklyHoursLoading === false && weeklyHoursError === false && weeklyHours?.locations?.length === 0) {
        return null; // we don't get the building opening hours for this location
    }

    const openingHoursList = spaceOpeningHours(bookableSpace, weeklyHours);

    if (!openingHoursList || openingHoursList?.length === 0) {
        return null; // no springshare opening hours
    }

    const todaysHours = openingHoursList?.find(o => o?.dayName === 'Today');

    const spaceOpeningHoursMessage = () => (
        <>
            <b>Opening hours</b> Today: {todaysHours?.rendered}
        </>
    );
    return (
        <>
            <StyledParagraphTypography component={'p'}>{spaceOpeningHoursMessage()}</StyledParagraphTypography>
        </>
    );
};

OpeningHoursShort.propTypes = {
    weeklyHoursLoading: PropTypes.any,
    weeklyHoursError: PropTypes.any,
    weeklyHours: PropTypes.any,
    bookableSpace: PropTypes.any,
};

export default React.memo(OpeningHoursShort);
