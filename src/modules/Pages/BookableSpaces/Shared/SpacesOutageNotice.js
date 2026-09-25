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
        marginBottom: 0,
    },
}));

const StatusText = styled('span')(({ theme }) => ({
    fontWeight: 700,
    color: theme.palette.designSystem.headingColor,
}));

const MONTH_SHORT_LABELS = {
    Jan: 'Jan.',
    Feb: 'Feb.',
    Mar: 'Mar.',
    Apr: 'Apr.',
    May: 'May',
    Jun: 'Jun.',
    Jul: 'Jul.',
    Aug: 'Aug.',
    Sep: 'Sept.',
    Oct: 'Oct.',
    Nov: 'Nov.',
    Dec: 'Dec.',
};

const formatShortMonth = date => MONTH_SHORT_LABELS[date.format('MMM')];

const formatShortMonthDate = date => `${date.format('D')} ${formatShortMonth(date)} ${date.format('YYYY')}`;

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
            return formatShortMonthDate(startDate);
        }

        if (sameYear) {
            return `${startDate.format('D')} ${formatShortMonth(startDate)} to ${endDate.format('D')} ${formatShortMonth(endDate)} ${endDate.format('YYYY')}`;
        }

        return `${formatShortMonthDate(startDate)} to ${formatShortMonthDate(endDate)}`;
    }

    if (startDate.isSame(endDate, 'day')) {
        return `${startDate.format('h:mma')} to ${endDate.format('h:mma')} on ${formatShortMonthDate(startDate)}`;
    }

    if (sameYear) {
        return `${startDate.format('h:mma')} ${startDate.format('D')} ${formatShortMonth(startDate)} to ${endDate.format('h:mma')} ${endDate.format('D')} ${formatShortMonth(endDate)} ${endDate.format('YYYY')}`;
    }

    return `${startDate.format('h:mma')} ${formatShortMonthDate(startDate)} to ${endDate.format('h:mma')} ${formatShortMonthDate(endDate)}`;
};
export const formatSpaceOutageUntilForPublicNotice = (endValue, currentTime, showTimePublic = true) => {
    const endDate = parseSpaceOutageDate(endValue);
    if (!endDate) {
        return formatSpaceOutageDateTimeForPublicNotice(endValue);
    }

    if (!showTimePublic) {
        return formatShortMonthDate(endDate);
    }

    const now = currentTime ? moment(currentTime) : moment();
    if (endDate.isSame(now, 'day')) {
        return `${endDate.format('h:mma')} on ${formatShortMonthDate(endDate)}`;
    }

    return `${endDate.format('h:mma')} ${formatShortMonthDate(endDate)}`;
};

export const SpacesOutageNotice = ({ bookableSpace, visibleOutage, hideReason }) => {
    if (!visibleOutage) {
        return null;
    }
    return (
        // -notice
        <StyledOutageNotice data-testid={`space-${bookableSpace?.space_id}-outage`}>
            <UserAttention
                hasTitle={false}
                tone={visibleOutage.tone}
                variant="aligned"
                testId={`space-${bookableSpace?.space_id}-outage-wrapper`}
            >
                <Typography variant="body2" data-testid={`space-${bookableSpace?.space_id}-outage-message`}>
                    {visibleOutage.status === 'Current' ? (
                        <>
                            <StatusText>Currently unavailable</StatusText>
                            {` until ${formatSpaceOutageUntilForPublicNotice(
                                visibleOutage.outage?.space_outage_end,
                                undefined,
                                getSpaceOutageShowTimePublic(visibleOutage.outage),
                            )}.`}
                        </>
                    ) : (
                        <>
                            <StatusText>Unavailable</StatusText>
                            {` ${formatSpaceOutageRangeForPublicNotice(
                                visibleOutage.outage?.space_outage_start,
                                visibleOutage.outage?.space_outage_end,
                                getSpaceOutageShowTimePublic(visibleOutage.outage),
                            )}.`}
                        </>
                    )}
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
SpacesOutageNotice.propTypes = {
    bookableSpace: PropTypes.any,
    visibleOutage: PropTypes.any,
    hideReason: PropTypes.any,
};

export default SpacesOutageNotice;
