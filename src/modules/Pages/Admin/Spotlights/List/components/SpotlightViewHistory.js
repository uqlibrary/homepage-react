import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import Box from '@material-ui/core/Box';

import SpotlightSizeWarningByUrl from 'modules/Pages/Admin/Spotlights/SpotlightSizeWarningByUrl';
import { default as locale } from 'modules/Pages/Admin/Spotlights/spotlightsadmin.locale';

import moment from 'moment';

const useStyles = makeStyles(theme => ({
    lightboxStyle: {
        display: 'flex',
        flexDirection: 'column',
        m: 'auto',
        width: 'fit-content',
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
}));

export const SpotlightViewHistory = ({
    isLightboxOpen,
    handleLightboxClose,
    navigateToCloneForm,
    spotlights,
    spotlightImageUrl,
}) => {
    const classes = useStyles();

    return (
        <Dialog
            maxWidth="xl"
            open={isLightboxOpen}
            onClose={handleLightboxClose}
            aria-labelledby="lightboxTitle"
            data-testid="spotlights-viewbyhistory-lightbox-holder"
        >
            <DialogTitle>
                <Button
                    children="Close"
                    color="secondary"
                    data-testid="spotlights-viewbyhistory-lightbox-close-button"
                    onClick={handleLightboxClose}
                    style={{ float: 'right' }}
                    variant="contained"
                />
            </DialogTitle>
            <DialogContent>
                <Box className={classes.lightboxStyle}>
                    <img
                        style={{ margin: '0 auto' }}
                        src={spotlightImageUrl}
                        alt="The image we can see previous usages of"
                    />
                    <div data-testid="spotlights-viewbyhistory-lightbox-dimensions" style={{ textAlign: 'center' }}>
                        <SpotlightSizeWarningByUrl spotlightImageUrl={spotlightImageUrl} />
                    </div>
                    <h2 id="lightboxTitle" data-testid="spotlights-viewbyhistory-lightbox-title">
                        {locale.viewByHistory.title}
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
                                        <strong>{locale.viewByHistory.linkTitle}</strong>: {s.title}
                                        <Button
                                            style={{ float: 'right' }}
                                            children="Clone"
                                            color="primary"
                                            data-testid="spotlights-viewbyhistory-lightbox-clone-button"
                                            onClick={() => navigateToCloneForm(s.id)}
                                            variant="contained"
                                        />
                                    </p>
                                    <p>
                                        <strong>{locale.viewByHistory.ariaLabel}</strong>: {s.img_alt}
                                    </p>
                                    <p>
                                        <strong>{locale.viewByHistory.link}</strong>: {s.url}
                                    </p>
                                    <p>
                                        <strong>{locale.viewByHistory.startDate}</strong>: {startDateDisplay}
                                        {locale.viewByHistory.dateDivider}
                                        <strong>{locale.viewByHistory.endDate}</strong>: {endDateDisplay}
                                    </p>
                                    <p>
                                        <strong>{locale.viewByHistory.publicationStatus}</strong>:{' '}
                                        {s.active ? 'yes' : 'no'}
                                    </p>
                                </li>
                            );
                        })}
                    </ul>
                </Box>
            </DialogContent>
        </Dialog>
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
