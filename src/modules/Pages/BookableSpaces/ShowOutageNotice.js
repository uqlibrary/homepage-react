import React from 'react';
import { PropTypes } from 'prop-types';

import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import UserAttention from 'modules/SharedComponents/Toolbox/UserAttention';
import {
    formatSpaceOutageRangeForPublicNotice,
    formatSpaceOutageUntilForPublicNotice,
    getSpaceOutageShowTimePublic,
} from '../Admin/BookableSpaces/Spaces/Form/spaceOutageHelpers';

const StyledOutageNotice = styled('div')(() => ({
    marginBlock: '0.5rem',
    '& p': {
        marginTop: '0.5rem',
    },
}));

export const ShowOutageNotice = ({ bookableSpace, visibleOutage, isCollapsed }) => {
    return (
        <StyledOutageNotice data-testid={`space-${bookableSpace?.space_id}-outage-notice`}>
            <UserAttention
                titleText={visibleOutage.status === 'Current' ? 'Current closure' : 'Upcoming closure'}
                tone={visibleOutage.tone}
                variant="aligned"
                testId={`space-${bookableSpace?.space_id}-outage`}
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
                {!isCollapsed && !!visibleOutage.reason && (
                    <Typography variant="body2" data-testid={`space-${bookableSpace?.space_id}-outage-reason`}>
                        Reason: {visibleOutage.reason}
                    </Typography>
                )}
            </UserAttention>
        </StyledOutageNotice>
    );
};
ShowOutageNotice.propTypes = {
    bookableSpace: PropTypes.any,
    visibleOutage: PropTypes.any,
    isCollapsed: PropTypes.any,
};

export default ShowOutageNotice;
