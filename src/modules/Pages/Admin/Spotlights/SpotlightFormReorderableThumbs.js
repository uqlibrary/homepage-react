import React from 'react';
import PropTypes from 'prop-types';

import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';
import { isCurrentSpotlight } from './spotlighthelpers';

const useStyles = makeStyles(() => ({
    hasBorder: {
        height: 60,
        marginRight: 5,
        border: '3px solid black',
    },
    noBorder: {
        height: 60,
        marginRight: 5,
    },
    placeholderBlock: {
        height: 54,
        width: 157,
        backgroundColor: 'grey',
        border: '3px solid black',
        display: 'inline-block',
    },
}));

export const SpotlightFormReorderableThumbs = ({
    currentSpotlights,
    currentSpotlightsLoading,
    currentValues,
    tableType,
}) => {
    console.log('SpotlightFormReorderableThumbs currentValues = ', currentValues);
    console.log('SpotlightFormReorderableThumbs currentSpotlights = ', currentSpotlights);
    console.log('SpotlightFormReorderableThumbs !!currentSpotlights = ', !!currentSpotlights);
    !!currentSpotlights &&
        console.log('SpotlightFormReorderableThumbs currentSpotlights.length = ', currentSpotlights.length);
    console.log('SpotlightFormReorderableThumbs currentSpotlightsLoading = ', currentSpotlightsLoading);
    const classes = useStyles();

    if (!isCurrentSpotlight(currentValues)) {
        return (
            <Grid item xs={10} align="left">
                <p>Reordering only available for current spotlights</p>
            </Grid>
        );
    }

    if (!!currentSpotlightsLoading) {
        return (
            <Grid
                item
                xs={'auto'}
                style={{
                    width: 80,
                    marginRight: 20,
                    marginBottom: 6,
                    opacity: 0.3,
                }}
            >
                <CircularProgress color="primary" size={20} />
            </Grid>
        );
    }

    if (!!currentSpotlights) {
        return (
            <Grid item xs={'auto'}>
                <p>Current spotlights:</p>
                <p>(Drag and drop the placeholder to re-order this spotlight)</p>
                {currentSpotlights.map(s => (
                    <img
                        id={`reorder-img-${s.id}`}
                        alt={s.id === currentValues.id ? currentValues.img_alt : s.img_alt}
                        key={`reorder-img-${s.id}`}
                        src={s.id === currentValues.id ? currentValues.img_url : s.img_url}
                        title={s.id === currentValues.id ? currentValues.img_alt : s.img_alt}
                        className={`${s.id === currentValues.id ? classes.hasBorder : classes.noBorder}`}
                    />
                ))}
                {!!isCurrentSpotlight(currentValues) && tableType === 'add' && (
                    <span id="reorder-img-placeholder" className={classes.placeholderBlock}>
                        {' '}
                    </span>
                )}
                {!!isCurrentSpotlight(currentValues) &&
                    ['edit', 'clone'].includes(tableType) &&
                    currentSpotlights.length > 0 &&
                    !currentSpotlights.find(s => s.id === currentValues.id) && (
                        <img
                            id={`reorder-img-${currentValues.id}`}
                            alt={currentValues.img_alt}
                            key={`reorder-img-${currentValues.id}`}
                            src={currentValues.img_url}
                            title={currentValues.img_alt}
                            className={classes.hasBorder}
                        />
                    )}
            </Grid>
        );
    }

    console.log('currentSpotlights = ', currentSpotlights);

    return <p>No current spotlights</p>;
};

SpotlightFormReorderableThumbs.propTypes = {
    currentSpotlights: PropTypes.any,
    currentSpotlightsLoading: PropTypes.any,
    currentValues: PropTypes.any,
    tableType: PropTypes.string,
};

export default SpotlightFormReorderableThumbs;
