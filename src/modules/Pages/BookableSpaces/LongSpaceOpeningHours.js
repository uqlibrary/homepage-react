import React from 'react';
import PropTypes from 'prop-types';

import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { spaceOpeningHours } from 'modules/Pages/BookableSpaces/spacesHelpers';

const StyledTable = styled('table')(() => ({
    width: '100%',
    '& caption': {
        position: 'absolute',
        top: 'auto',
        overflow: 'hidden',
        clip: 'rect(1px, 1px, 1px, 1px)',
        width: '1px',
        height: '1px',
        whiteSpace: 'nowrap',
    },
    '& th, & th': {
        textAlign: 'center',
        minWidth: '5em',
    },
}));

export const LongSpaceOpeningHours = ({ weeklyHoursLoading, weeklyHoursError, weeklyHours, bookableSpace }) => {
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

    if (weeklyHoursLoading === false && weeklyHoursError === false && weeklyHours?.locations?.length === 0) {
        return overrideMessage; // we don't get the building opening hours for this location
    }

    const openingHoursList = spaceOpeningHours(bookableSpace, weeklyHours);

    if (!openingHoursList || openingHoursList.length === 0) {
        return overrideMessage; // no opening hours
    }

    return (
        <>
            <Typography component={'h3'} variant={'h6'}>
                {bookableSpace?.space_library_name} opening hours
            </Typography>
            <div style={{ overflowX: 'scroll' }} tabIndex="0">
                <StyledTable>
                    <caption>Opening hours in the coming week for {bookableSpace?.space_library_name}</caption>
                    <thead>
                        <tr>
                            {openingHoursList?.map((d, index) => (
                                <th
                                    key={`space-${spaceId}-opening-th-${index}`}
                                    data-testid={`space-${spaceId}-openingHours-${index}`}
                                    tabIndex="0"
                                    scope="col"
                                    id={`day-${index}`}
                                >
                                    {d.dayName}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {openingHoursList?.map((d, index) => (
                                <td key={`space-${spaceId}-opening-td-${index}`} tabIndex="0" headers={`day-${index}`}>
                                    {d.rendered}
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </StyledTable>
            </div>
            {overrideMessage}
        </>
    );
};
LongSpaceOpeningHours.propTypes = {
    weeklyHoursLoading: PropTypes.any,
    weeklyHoursError: PropTypes.any,
    weeklyHours: PropTypes.any,
    bookableSpace: PropTypes.any,
};

export default React.memo(LongSpaceOpeningHours);
