import React from 'react';
import PropTypes from 'prop-types';

import { useAccountContext } from 'context';

import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';

const topLeft = {
    padding: '0.25rem',
    '&.topLeft': {
        // on the results page, we have to position it absolutely over the main panel, because we cant put a button within a link!
        position: 'absolute',
        marginTop: 0,
        top: '1.5rem',
        left: '1.25rem',
    },
};
const StyledTooltip = styled(Tooltip)(() => topLeft);
const StyledCircularProgress = styled(CircularProgress)(() => topLeft);

export const SpaceFavouriteIcon = ({
    bookableSpace,
    isFavourite,
    onFavouriteToggle,
    isFavouriteActionInProgress,
    iconPosition,
}) => {
    const { account } = useAccountContext();
    const isLoggedIn = !!account?.id;

    if (!isLoggedIn || !onFavouriteToggle) {
        return null;
    }
    if (!!isFavouriteActionInProgress && isFavouriteActionInProgress === bookableSpace.space_id) {
        return (
            <StyledCircularProgress
                color="inherit"
                size={25}
                id={`${bookableSpace.space_id}-favorite-progress`}
                className={iconPosition}
            />
        );
    }
    if (isFavourite === undefined) {
        return <span style={{ width: '24px' }}> </span>; // placeholder to minimise movement
    }

    if (isFavourite) {
        return (
            <StyledTooltip title="Remove from Favourites" arrow className={iconPosition}>
                <IconButton
                    onClick={() => onFavouriteToggle('removeSpaceFavourite', bookableSpace?.space_id)}
                    aria-label="Remove from Favourites"
                    data-testid={`space-${bookableSpace?.space_id}-detail-unfavourite`}
                    size="large"
                >
                    <StarIcon
                        sx={{
                            fill: '#FFD700',
                            cursor: isFavouriteActionInProgress ? 'not-allowed' : 'pointer',
                            fontSize: '1.5rem',
                            flexShrink: 0,
                        }}
                    />
                </IconButton>
            </StyledTooltip>
        );
    }

    return (
        <StyledTooltip title="Add to Favourites" arrow className={iconPosition}>
            <IconButton
                onClick={() => onFavouriteToggle('addSpaceFavourite', bookableSpace?.space_id)}
                aria-label="Add to Favourites"
                data-testid={`space-${bookableSpace?.space_id}-detail-favourite`}
                size="large"
            >
                <StarBorderIcon
                    sx={{
                        fill: '#666',
                        cursor: isFavouriteActionInProgress ? 'not-allowed' : 'pointer',
                        fontSize: '1.5rem',
                        flexShrink: 0,
                    }}
                />
            </IconButton>
        </StyledTooltip>
    );
};
SpaceFavouriteIcon.propTypes = {
    bookableSpace: PropTypes.any,
    isFavourite: PropTypes.bool,
    onFavouriteToggle: PropTypes.func,
    isFavouriteActionInProgress: PropTypes.any,
    iconPosition: PropTypes.any,
};
export default SpaceFavouriteIcon;
