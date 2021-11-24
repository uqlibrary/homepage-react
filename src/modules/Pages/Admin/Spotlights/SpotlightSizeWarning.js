import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';
import Warning from '@material-ui/icons/Warning';

import { default as locale } from './spotlightsadmin.locale';

import { addConstantsToDisplayValues, ImageSizeIsPoor } from 'modules/Pages/Admin/Spotlights/spotlighthelpers';

const useStyles = makeStyles(theme => ({
    warningDimensions: {
        color: theme.palette.warning.main,
        fontWeight: 'bold',
    },
}));

export const SpotlightSizeWarning = ({ imgWidth, imgHeight }) => {
    const classes = useStyles();

    const outputMessage = addConstantsToDisplayValues(
        locale.form.upload.currentDimensionsNotification,
        imgWidth,
        imgHeight,
        (imgWidth / imgHeight).toFixed(2),
    );
    return ImageSizeIsPoor(imgWidth, imgHeight) ? (
        <div className={classes.warningDimensions}>
            <Warning fontSize="small" style={{ height: 15 }} />
            {outputMessage}
        </div>
    ) : (
        /* istanbul ignore next */
        <div>
            <CheckIcon fontSize="small" style={{ color: 'green', height: 15 }} />
            {outputMessage}
        </div>
    );
};

SpotlightSizeWarning.propTypes = {
    imgWidth: PropTypes.any,
    imgHeight: PropTypes.any,
};

export default React.memo(SpotlightSizeWarning);
