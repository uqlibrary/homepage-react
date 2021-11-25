import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Box from '@material-ui/core/Box';

import SpotlightSizeWarningByUrl from 'modules/Pages/Admin/Spotlights/SpotlightSizeWarningByUrl';
import { default as locale } from 'modules/Pages/Admin/Spotlights/spotlightsadmin.locale';

import moment from 'moment';

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
}));

export const SpotlightViewHistory = ({
    isLightboxOpen,
    handleLightboxClose,
    navigateToCloneForm,
    spotlights,
    spotlightImageUrl,
}) => {
    // modal does something weird - when there are a lot of spotlights (> 3) the top sits just off the screen
    // supply a margin top value that varies wih how many spotlights we have
    const multiSpotlightMarginSize = ((spotlights.length > 2 ? spotlights.length - 2 : 0) / 2) * 100;
    const styleProps = {
        marginSpecial: {
            marginTop: multiSpotlightMarginSize,
        },
    };

    // per https://mui.com/styles/basics/#adapting-based-on-props
    const classes = useStyles(styleProps);

    return (
        <Modal
            open={isLightboxOpen}
            onClose={handleLightboxClose}
            aria-labelledby="lightboxTitle"
            className={classes.lightboxModalStyle}
            data-testid="spotlights-lightbox-holder"
            disableScrollLock
        >
            <Box className={`${classes.lightboxStyle} ${classes.marginSpecial}`}>
                <img src={spotlightImageUrl} alt="The image we can see previous usages of" />
                <div data-testid="spotlights-lightbox-dimensions" style={{ textAlign: 'center' }}>
                    <SpotlightSizeWarningByUrl spotlightImageUrl={spotlightImageUrl} />
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
                                    <strong>{locale.lightbox.link}</strong>: {s.url}
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
                <div>
                    <Button
                        children="Close"
                        color="secondary"
                        data-testid="spotlights-lightbox-close-button"
                        onClick={handleLightboxClose}
                        style={{ float: 'right' }}
                        variant="contained"
                    />
                </div>
            </Box>
        </Modal>
    );
};

SpotlightViewHistory.propTypes = {
    isLightboxOpen: PropTypes.bool,
    handleLightboxClose: PropTypes.func,
    navigateToCloneForm: PropTypes.func,
    spotlightImageUrl: PropTypes.string,
    spotlights: PropTypes.array,
};

SpotlightViewHistory.defaultProps = {
    spotlights: [],
};

export default React.memo(SpotlightViewHistory);
