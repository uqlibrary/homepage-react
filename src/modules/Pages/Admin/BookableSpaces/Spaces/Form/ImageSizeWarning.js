import React from 'react';
import PropTypes from 'prop-types';

import CheckIcon from '@mui/icons-material/Check';
import Warning from '@mui/icons-material/Warning';

import { locale } from 'modules/Pages/Admin/BookableSpaces/bookablespaces.locale';

import { styled } from '@mui/material/styles';

const StyledWarning = styled('p')(({ theme }) => ({
    color: theme.palette.warning.main,
    fontWeight: 'bold',
}));
const addConstantsToDisplayValues = (displayText, imageWidthIn, imageHeightIn, ratio) => {
    return displayText
        .replace('[WIDTH]', imageWidthIn)
        .replace('[HEIGHT]', imageHeightIn)
        .replace('[RATIO]', ratio)
        .replace('[MAXFILESIZE]', locale.form.upload.maxSize / 1000);
};

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

export const ImageSizeWarning = ({ imgWidth, imgHeight }) => {
    const outputMessage = addConstantsToDisplayValues(
        locale.form.upload.currentDimensionsNotification,
        imgWidth,
        imgHeight,
        (imgWidth / imgHeight).toFixed(2),
    );
    if (isImageSizeQuestionable(imgWidth, imgHeight)) {
        return (
            <>
                <StyledWarning>
                    <Warning fontSize="small" style={{ height: 15 }} />
                    {outputMessage}
                </StyledWarning>
                <div>{locale.form.upload.dimensionsWarning}</div>
            </>
        );
    }
    return (
        <div>
            <CheckIcon fontSize="small" style={{ color: 'green', height: 15 }} />
            {outputMessage}
        </div>
    );
};

ImageSizeWarning.propTypes = {
    imgWidth: PropTypes.any,
    imgHeight: PropTypes.any,
};

export default React.memo(ImageSizeWarning);
