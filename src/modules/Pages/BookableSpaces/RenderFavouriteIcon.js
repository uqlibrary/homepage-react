import React from 'react';
import PropTypes from 'prop-types';

import { Tooltip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import CircularProgress from '@mui/material/CircularProgress';

export const RenderFavouriteIcon = ({
    bookableSpace,
    isFavourite,
    isLoggedIn,
    onFavouriteToggle,
    isFavouriteActionInProgress,
}) => {
    if (!isLoggedIn || !onFavouriteToggle) {
        return null;
    }
    if (!!isFavouriteActionInProgress && isFavouriteActionInProgress === bookableSpace.space_id) {
        return <CircularProgress color="inherit" size={25} id={`${bookableSpace.space_id}-favorite-progress`} />;
    }
    if (isFavourite === undefined) {
        return <span style={{ width: '24px' }}> </span>; // placeholder to minimise movement
    }

    if (isFavourite) {
        return (
            <Tooltip title="Remove from Favourites" arrow>
                <StarIcon
                    onClick={() => onFavouriteToggle('removeSpaceFavourite', bookableSpace?.space_id)}
                    sx={{
                        fill: '#FFD700',
                        cursor: isFavouriteActionInProgress ? 'not-allowed' : 'pointer',
                        fontSize: '1.5rem',
                        flexShrink: 0,
                    }}
                    data-testid={`favourite-star-${bookableSpace?.space_id}`}
                />
            </Tooltip>
        );
    }

    return (
        <Tooltip title="Add to Favourites" arrow>
            <StarBorderIcon
                onClick={() => onFavouriteToggle('addSpaceFavourite', bookableSpace?.space_id)}
                sx={{
                    fill: '#666',
                    cursor: isFavouriteActionInProgress ? 'not-allowed' : 'pointer',
                    fontSize: '1.5rem',
                    flexShrink: 0,
                }}
                data-testid={`favourite-star-outline-${bookableSpace?.space_id}`}
            />
        </Tooltip>
    );
};
RenderFavouriteIcon.propTypes = {
    bookableSpace: PropTypes.any,
    isFavourite: PropTypes.bool,
    isLoggedIn: PropTypes.bool,
    onFavouriteToggle: PropTypes.func,
    isFavouriteActionInProgress: PropTypes.any,
};
export default RenderFavouriteIcon;
