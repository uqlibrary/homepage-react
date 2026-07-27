import React from 'react';
import { PropTypes } from 'prop-types';

import moment from 'moment/moment';

import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import UserAttention from 'modules/SharedComponents/Toolbox/UserAttention';
import {
    getSpaceOutageShowTimePublic,
    parseSpaceOutageDate,
} from 'modules/Pages/Admin/BookableSpaces/Spaces/Form/spaceOutageHelpers';

const StyledOutageNotice = styled('div')(() => ({
    marginBlock: '0.5rem',
    '& p': {
        marginTop: '0.5rem',
    },
}));

export const formatSpaceOutageDateTimeForPublicNotice = value => {
    const parsedDate = parseSpaceOutageDate(value);
    if (!parsedDate) {
        return 'Not set';
    }

    return parsedDate.format('DD/MM/YYYY h:mma');
};
export const formatSpaceOutageRangeForPublicNotice = (startValue, endValue, showTimePublic = true) => {
    const startDate = parseSpaceOutageDate(startValue);
    const endDate = parseSpaceOutageDate(endValue);

    if (!startDate || !endDate) {
        return `${formatSpaceOutageDateTimeForPublicNotice(startValue)} to ${formatSpaceOutageDateTimeForPublicNotice(
            endValue,
        )}`;
    }

    const sameYear = startDate.isSame(endDate, 'year');

    if (!showTimePublic) {
        if (startDate.isSame(endDate, 'day')) {
            return startDate.format('D MMMM YYYY');
        }

        if (sameYear) {
            return `${startDate.format('D MMMM')} to ${endDate.format('D MMMM YYYY')}`;
        }

        return `${startDate.format('D MMMM YYYY')} to ${endDate.format('D MMMM YYYY')}`;
    }

    if (startDate.isSame(endDate, 'day')) {
        return `${startDate.format('h:mma')} to ${endDate.format('h:mma')} on ${startDate.format('D MMMM YYYY')}`;
    }

    if (sameYear) {
        return `${startDate.format('h:mma D MMMM')} to ${endDate.format('h:mma D MMMM YYYY')}`;
    }

    return `${startDate.format('h:mma D MMMM YYYY')} to ${endDate.format('h:mma D MMMM YYYY')}`;
};
export const formatSpaceOutageUntilForPublicNotice = (endValue, currentTime, showTimePublic = true) => {
    const endDate = parseSpaceOutageDate(endValue);
    if (!endDate) {
        return formatSpaceOutageDateTimeForPublicNotice(endValue);
    }

    if (!showTimePublic) {
        return endDate.format('D MMMM YYYY');
    }

    const now = currentTime ? moment(currentTime) : moment();
    if (endDate.isSame(now, 'day')) {
        return `${endDate.format('h:mma')} on ${endDate.format('D MMMM YYYY')}`;
    }

    return endDate.format('h:mma D MMMM YYYY');
};

export const SpaceOutageNotice = ({ bookableSpace, visibleOutage, hideReason }) => {
    if (!visibleOutage) {
        return null;
    }
    return (
        // -notice
        <StyledOutageNotice data-testid={`space-${bookableSpace?.space_id}-outage`}>
            <UserAttention
                titleText={visibleOutage.status === 'Current' ? 'Current closure' : 'Upcoming closure'}
                tone={visibleOutage.tone}
                variant="aligned"
                testId={`space-${bookableSpace?.space_id}-outage-wrapper`}
            >
                <Typography variant="body2" data-testid={`space-${bookableSpace?.space_id}-outage-message`}>
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
                {!hideReason && !!visibleOutage.reason && (
                    <Typography variant="body2" data-testid={`space-${bookableSpace?.space_id}-outage-reason`}>
                        Reason: {visibleOutage.reason}
                    </Typography>
                )}
            </UserAttention>
        </StyledOutageNotice>
    );
};
SpaceOutageNotice.propTypes = {
    bookableSpace: PropTypes.any,
    visibleOutage: PropTypes.any,
    hideReason: PropTypes.any,
};

export default SpaceOutageNotice;
