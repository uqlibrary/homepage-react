import React from 'react';
import PropTypes from 'prop-types';

import makeStyles from '@mui/styles/makeStyles';
import CheckIcon from '@mui/icons-material/Check';
import Warning from '@mui/icons-material/Warning';

import { default as locale } from 'modules/Pages/Admin/Spotlights/spotlightsadmin.locale';

import { addConstantsToDisplayValues } from 'modules/Pages/Admin/Spotlights/spotlighthelpers';

const useStyles = makeStyles(theme => ({
    warningDimensions: {
        color: theme.palette.warning.main,
        fontWeight: 'bold',
    },
}));

const isImageSizeQuestionable = (imageWidthIn, imageHeightIn) => {
    const ratio = (imageWidthIn / imageHeightIn).toFixed(2);
    return (
        imageWidthIn < locale.form.upload.ideal.width - locale.form.upload.heightWidthFlex ||
        imageWidthIn > locale.form.upload.ideal.width + locale.form.upload.heightWidthFlex ||
        /* istanbul ignore next */
        imageHeightIn < locale.form.upload.ideal.height - locale.form.upload.heightWidthFlex ||
        /* istanbul ignore next */
        imageHeightIn > locale.form.upload.ideal.height + locale.form.upload.heightWidthFlex ||
        /* istanbul ignore next */
        ratio < locale.form.upload.minRatio ||
        /* istanbul ignore next */
        ratio > locale.form.upload.maxRatio
    );
};

export const SpotlightSizeWarning = ({ imgWidth, imgHeight }) => {
    const classes = useStyles();

    const outputMessage = addConstantsToDisplayValues(
        locale.form.upload.currentDimensionsNotification,
        imgWidth,
        imgHeight,
        (imgWidth / imgHeight).toFixed(2),
    );
    if (isImageSizeQuestionable(imgWidth, imgHeight)) {
        return (
            <React.Fragment>
                <p className={classes.warningDimensions}>
                    <Warning fontSize="small" style={{ height: 15 }} />
                    {outputMessage}
                </p>
                <div>{locale.form.upload.dimensionsWarning}</div>
            </React.Fragment>
        );
    }
    return (
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
