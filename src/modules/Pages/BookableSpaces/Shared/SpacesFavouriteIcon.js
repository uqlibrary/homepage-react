import React from 'react';
import PropTypes from 'prop-types';

import { useAccountContext } from 'context';

import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { Tooltip } from '@mui/material';
import { useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    displayToastErrorMessage,
    displayToastMessage,
} from 'modules/Pages/Admin/BookableSpaces/bookableSpacesAdminHelpers';

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

export const SpacesFavouriteIcon = ({
    actions,
    bookableSpace,
    isFavourite,
    iconPosition,
    ariaLabel,
    isDetailPage = false,
}) => {
    const { account } = useAccountContext();
    const isLoggedIn = !!account?.id;
    const theme = useTheme();

    const [isFavouriteActionInProgress, setIsFavouriteActionInProgress] = React.useState(false);

    const onFavouriteToggle = async (actionType, spaceId) => {
        // matching name of action in object key for easy lookup
        const successMessages = {};
        successMessages.addSpaceFavourite = 'Space added to favourites';
        successMessages.removeSpaceFavourite = 'Space removed from favourites';
        const failureMessages = {};
        failureMessages.addSpaceFavourite = 'Sorry, an error occurred - the space was not added to favourites.';
        failureMessages.removeSpaceFavourite = 'SSorry, an error occurred - the space was not removed from favourites.';

        /* istanbul ignore next */
        if (isFavouriteActionInProgress) {
            return;
        }
        setIsFavouriteActionInProgress(spaceId);
        try {
            await actions[actionType](spaceId);
            displayToastMessage(successMessages[actionType]);
        } catch {
            displayToastErrorMessage(failureMessages[actionType]);
        } finally {
            setTimeout(() => {
                setIsFavouriteActionInProgress(false);
            }, 1000); // show the spinny for a moment, even if it's really fast
        }
    };

    if (!isLoggedIn || !onFavouriteToggle) {
        return null;
    }
    if (!!isFavouriteActionInProgress && (!!isDetailPage || isFavouriteActionInProgress === bookableSpace.space_id)) {
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
            <StyledTooltip title={ariaLabel ? `${ariaLabel}` : 'Remove from Favourites'} arrow className={iconPosition}>
                <IconButton
                    onClick={() => onFavouriteToggle('removeSpaceFavourite', bookableSpace?.space_id)}
                    data-testid={`space-${bookableSpace?.space_id}-detail-unfavourite`}
                    size="large"
                >
                    <StarIcon
                        sx={{
                            fill: theme.palette.primary.main,
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
SpacesFavouriteIcon.propTypes = {
    actions: PropTypes.any,
    bookableSpace: PropTypes.any,
    isFavourite: PropTypes.bool,
    isDetailPage: PropTypes.bool,
    iconPosition: PropTypes.any,
    ariaLabel: PropTypes.string,
};
export default SpacesFavouriteIcon;
