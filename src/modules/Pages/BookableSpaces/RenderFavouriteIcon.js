import React from 'react';
import PropTypes from 'prop-types';

import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { Tooltip } from '@mui/material';

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
                <IconButton
                    onClick={() => onFavouriteToggle('removeSpaceFavourite', bookableSpace?.space_id)}
                    aria-label="Remove from Favourites"
                    data-testid={`spaces-detail-${bookableSpace?.space_id}-unfavourite`}
                    title="Remove from Favourites"
                    size="large"
                    sx={{ padding: 0 }}
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
            </Tooltip>
        );
    }

    return (
        <Tooltip title="Add to Favourites" arrow>
            <IconButton
                onClick={() => onFavouriteToggle('addSpaceFavourite', bookableSpace?.space_id)}
                aria-label="Add to Favourites"
                data-testid={`spaces-detail-${bookableSpace?.space_id}-favourite`}
                title="Add to Favourites"
                size="large"
                sx={{ padding: 0 }}
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
