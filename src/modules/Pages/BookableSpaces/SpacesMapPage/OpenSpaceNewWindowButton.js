import React from 'react';
import PropTypes from 'prop-types';

import { styled } from '@mui/material/styles';
import { Tooltip } from '@mui/material';

import { serialiseJourneyUrl } from 'modules/Pages/BookableSpaces/journeyHelpers';

const StyledAnchor = styled('a')(() => ({
    display: 'inline-flex',
    paddingRight: 0,
    padding: '0.25rem',
    '&:hover, &:hover *': {
        // not focus, hover only
        backgroundColor: 'rgba(0, 0, 0, 0.04) !important',
        borderRadius: '50%',
    },
}));
const StyledTooltip = styled(Tooltip)(() => ({
    padding: '0.25rem',
}));

export const OpenSpaceNewWindowButton = ({ spaceDetails }) => {
    const detailUrl = React.useMemo(
        () =>
            serialiseJourneyUrl({
                view: 'details',
                spaceId: spaceDetails?.space_uuid || spaceDetails?.space_id || null,
            }),
        [spaceDetails?.space_uuid, spaceDetails?.space_id],
    );

    return (
        <StyledAnchor
            href={detailUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open Space ${spaceDetails?.space_name} in a new window`}
            data-testid={`space-${spaceDetails.space_id}-new-window`}
        >
            <StyledTooltip title="Open this space in a new window" arrow>
                <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" height="20" width="20">
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
            </StyledTooltip>
        </StyledAnchor>
    );
};
OpenSpaceNewWindowButton.propTypes = {
    spaceDetails: PropTypes.object,
};

export default OpenSpaceNewWindowButton;
