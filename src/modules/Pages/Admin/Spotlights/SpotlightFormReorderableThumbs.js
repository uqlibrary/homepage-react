import React from 'react';
import PropTypes from 'prop-types';

import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';

import { default as locale } from 'modules/Pages/Admin/Spotlights/spotlightsadmin.locale';
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

    const isAddAction = tableType => !['edit', 'clone'].includes(tableType);

    // if they drag a new image in, reuse this as the thumb
    const currentImage = values => {
        const firstFile = !!values.uploadedFile && !!values.uploadedFile[0] ? values.uploadedFile[0] : false;
        if (!!firstFile && !!firstFile.preview) {
            return firstFile.preview;
        }
        return values.img_url;
    };

    console.log('SpotlightFormReorderableThumbs xx currentValues = ', currentValues);
    if (!!currentSpotlights) {
        return (
            <Grid item xs={'auto'}>
                <h3>{locale.form.header}</h3>
                <p>
                    {isAddAction(tableType)
                        ? locale.form.reorderThumbs.usesPlaceholder
                        : locale.form.reorderThumbs.usesCurrentImage}
                </p>
                {currentSpotlights.map(s => {
                    return (
                        <img
                            id={`reorder-img-${s.id}`}
                            alt={s.id === currentValues.id ? currentValues.img_alt : s.img_alt}
                            key={`reorder-img-${s.id}`}
                            src={s.id === currentValues.id ? currentImage(currentValues) : s.img_url}
                            title={s.id === currentValues.id ? currentValues.img_alt : s.img_alt}
                            className={`${s.id === currentValues.id ? classes.hasBorder : classes.noBorder}`}
                        />
                    );
                })}
                {isAddAction(tableType) && (
                    <span id="reorder-img-placeholder" className={classes.placeholderBlock}>
                        {' '}
                    </span>
                )}
                {!isAddAction(tableType) &&
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
