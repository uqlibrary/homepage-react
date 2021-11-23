import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Box from '@material-ui/core/Box';
import CheckIcon from '@material-ui/icons/Check';
import Warning from '@material-ui/icons/Warning';

import { default as locale } from '../../spotlightsadmin.locale';

import moment from 'moment';

import { addConstantsToDisplayValues, ImageSizeIsPoor } from 'modules/Pages/Admin/Spotlights/spotlighthelpers';

const useStyles = makeStyles(theme => ({
    lightboxStyle: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: 900,
        backgroundColor: '#fff',
        border: '2px solid #000',
        boxShadow: 24,
        padding: 50,
        '& img': {
            maxWidth: 800,
            border: '1px solid grey',
            textAlign: 'center',
        },
        '& li': {
            marginBottom: 10,
            padding: 10,
            '&:hover': {
                backgroundColor: theme.palette.secondary.main,
                transition: 'background-color 1s ease',
            },
            '& p': {
                marginBottom: 0,
                marginTop: 1,
            },
        },
    },
    lightboxModalStyle: {
        overflow: 'scroll',
    },
    warningDimensions: {
        color: theme.palette.warning.main,
        fontWeight: 'bold',
    },
}));

export const SpotlightViewHistory = ({
    isLightboxOpen,
    handleLightboxClose,
    navigateToCloneForm,
    spotlights,
    spotlightImgUrl,
}) => {
    const classes = useStyles();

    const [imgWeight, setImgWeight] = useState(null);
    const [imgHeight, setImgHeight] = useState(null);
    const [imgRatio, setImgRatio] = useState(null);

    const getDimensionsSentenceFromUrl = imgUrl => {
        if (imgUrl === '') {
            return '';
        }

        // from https://stackoverflow.com/questions/11442712/get-width-height-of-remote-image-from-url
        const img = new Image();
        function setSizes() {
            !!this.naturalWidth && setImgWeight(this.naturalWidth);
            !!this.naturalHeight && setImgHeight(this.naturalHeight);
            !!this.naturalWidth && setImgRatio((this.naturalWidth / this.naturalHeight).toFixed(2));
        }
        img.addEventListener('load', setSizes);
        imgUrl.startsWith('http') && (img.src = imgUrl);

        return (
            <div
                className={`${
                    ImageSizeIsPoor(imgWeight, imgHeight) ? classes.warningDimensions : /* istanbul ignore next */ ''
                }`}
            >
                {!ImageSizeIsPoor(imgWeight, imgHeight) ? (
                    /* istanbul ignore next */
                    <CheckIcon fontSize="small" style={{ color: 'green', height: 15 }} />
                ) : (
                    <Warning fontSize="small" style={{ height: 15 }} />
                )}
                {addConstantsToDisplayValues(
                    locale.form.upload.currentDimensionsNotification,
                    imgWeight,
                    imgHeight,
                    imgRatio,
                )}
            </div>
        );
    };

    return (
        <Modal
            open={isLightboxOpen}
            onClose={handleLightboxClose}
            aria-labelledby="lightboxTitle"
            aria-label="See past usages of this image"
            className={classes.lightboxModalStyle}
            data-testid="spotlights-lightbox-holder"
        >
            <Box className={classes.lightboxStyle}>
                <Button
                    children="Close"
                    color="primary"
                    data-testid="spotlights-lightbox-close-button"
                    onClick={handleLightboxClose}
                    style={{ float: 'right' }}
                    variant="contained"
                />
                <img src={spotlightImgUrl} alt="The image we can see previous usages of" />
                <div data-testid="spotlights-lightbox-dimensions" style={{ textAlign: 'center' }}>
                    {getDimensionsSentenceFromUrl(spotlightImgUrl)}
                </div>
                <h2 id="lightboxTitle" data-testid="spotlights-lightbox-title">
                    {locale.lightbox.title}
                </h2>
                <ul>
                    {spotlights.map(s => {
                        const dateDuringHour = 'ddd D MMM YYYY h.mma';
                        const dateOnTheHour = dateDuringHour.replace('h.mma', 'ha');
                        const startDateDisplay = moment(s.start).format(
                            moment(s.start).format('m') === '0' ? dateOnTheHour : dateDuringHour,
                        );
                        const endDateDisplay = moment(s.end).format(
                            moment(s.end).format('m') === '0' ? dateOnTheHour : dateDuringHour,
                        );

                        return (
                            <li key={`${s.id}-lightbox`}>
                                <p>
                                    <strong>{locale.lightbox.linkTitle}</strong>: {s.title}
                                    <Button
                                        style={{ float: 'right' }}
                                        children="Clone"
                                        color="primary"
                                        data-testid="spotlights-lightbox-clone-button"
                                        onClick={() => navigateToCloneForm(s.id)}
                                        variant="contained"
                                    />
                                </p>
                                <p>
                                    <strong>{locale.lightbox.ariaLabel}</strong>: {s.img_alt}
                                </p>
                                <p>
                                    <strong>{locale.lightbox.link}</strong>: {s.link}
                                </p>
                                <p>
                                    <strong>{locale.lightbox.startDate}</strong>: {startDateDisplay}
                                    {locale.lightbox.dateDivider}
                                    <strong>{locale.lightbox.endDate}</strong>: {endDateDisplay}
                                </p>
                                <p>
                                    <strong>{locale.lightbox.publicationStatus}</strong>: {s.active ? 'yes' : 'no'}
                                </p>
                            </li>
                        );
                    })}
                </ul>
            </Box>
        </Modal>
    );
};

SpotlightViewHistory.propTypes = {
    isLightboxOpen: PropTypes.bool,
    handleLightboxClose: PropTypes.func,
    navigateToCloneForm: PropTypes.func,
    spotlightImgUrl: PropTypes.string,
    spotlights: PropTypes.array,
};

SpotlightViewHistory.defaultProps = {
    spotlights: [],
};

export default React.memo(SpotlightViewHistory);
