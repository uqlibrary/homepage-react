import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import Box from '@material-ui/core/Box';

import { default as locale } from 'modules/Pages/Admin/Spotlights/spotlightsadmin.locale';

import moment from 'moment';

const useStyles = makeStyles(theme => ({
    lightboxStyle: {
        minWidth: '90%',
        paddingTop: 20,
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
        '& [aria-labelledby="lightboxTitle"]': {
            color: 'blue',
        },
    },
    dialogPaper: {
        // make the block take up more of the page
        width: '90%',
        maxWidth: 'inherit',
    },
    thisWeekNotify: {
        fontWeight: 'bold',
        color: theme.palette.warning.main,
    },
}));

export const SpotlightsViewByImage = ({
    isLightboxOpen,
    handleLightboxClose,
    spotlights,
    showViewByHistoryLightbox,
}) => {
    const classes = useStyles();

    return (
        <Dialog
            open={isLightboxOpen}
            onClose={handleLightboxClose}
            aria-labelledby="lightboxTitle"
            data-testid="spotlights-viewbyimage-lightbox-holder"
            style={{ minWidth: '90%', maxWidth: '99%' }} // needed?
            PaperProps={{ classes: { root: classes.dialogPaper } }}
        >
            <DialogTitle>
                <p id="lightboxTitle" data-testid="spotlights-viewbyimage-lightbox-title">
                    {locale.viewByImage.title}
                    <Button
                        children="Close"
                        color="secondary"
                        data-testid="spotlights-viewbyimage-lightbox-close-button"
                        onClick={handleLightboxClose}
                        style={{ float: 'right' }}
                        variant="contained"
                    />
                </p>
            </DialogTitle>
            <DialogContent style={{ minWidth: '90%', maxWidth: '99%' }}>
                <Box className={classes.lightboxStyle}>
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                        }}
                    >
                        {!!spotlights &&
                            spotlights.length > 0 &&
                            spotlights
                                .sort(
                                    (a, b) =>
                                        moment(b.end, 'YYYY-MM-DD hh:mm:ss') - moment(a.end, 'YYYY-MM-DD hh:mm:ss'),
                                )
                                .map((s, index) => {
                                    return (
                                        <a
                                            id={`${s.id}-lightbox-item`}
                                            key={`${s.id}-lightbox-item`}
                                            style={{
                                                marginBottom: 10,
                                                marginRight: 10,
                                            }}
                                            onClick={() => showViewByHistoryLightbox(s)}
                                            onKeyDown={() => showViewByHistoryLightbox(s)}
                                        >
                                            <img
                                                src={s.img_url}
                                                alt={s.img_alt}
                                                width={250}
                                                height={92}
                                                loading={index > 20 ? 'lazy' : null}
                                            />
                                        </a>
                                    );
                                })}
                    </div>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

SpotlightsViewByImage.propTypes = {
    handleLightboxClose: PropTypes.func,
    isLightboxOpen: PropTypes.bool,
    showViewByHistoryLightbox: PropTypes.func,
    spotlightImageUrl: PropTypes.string,
    spotlights: PropTypes.array,
};

SpotlightsViewByImage.defaultProps = {
    spotlights: [],
};

export default React.memo(SpotlightsViewByImage);
