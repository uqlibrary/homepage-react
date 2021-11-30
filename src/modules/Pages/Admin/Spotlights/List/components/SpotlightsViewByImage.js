import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import Box from '@material-ui/core/Box';

import { default as locale } from 'modules/Pages/Admin/Spotlights/spotlightsadmin.locale';

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

export const SpotlightsViewByImage = ({ isLightboxOpen, handleLightboxClose, spotlights }) => {
    const classes = useStyles();

    return (
        <Dialog
            maxWidth="xl"
            open={isLightboxOpen}
            onClose={handleLightboxClose}
            aria-labelledby="lightboxTitle"
            data-testid="spotlights-viewbyimage-lightbox-holder"
        >
            <DialogTitle>
                <Button
                    children="Close"
                    color="secondary"
                    data-testid="spotlights-viewbyimage-lightbox-close-button"
                    onClick={handleLightboxClose}
                    style={{ float: 'right' }}
                    variant="contained"
                />
            </DialogTitle>
            <DialogContent>
                <Box className={classes.lightboxStyle}>
                    <h2 id="lightboxTitle" data-testid="spotlights-viewbyimage-lightbox-title">
                        {locale.viewByImage.title}
                    </h2>
                    <div>
                        {!!spotlights &&
                            spotlights.length > 0 &&
                            spotlights.map(s => {
                                return (
                                    <span key={`${s.id}-lightbox`}>
                                        <img style={{ margin: 10 }} src={s.img_url} alt={s.img_alt} width={200} />
                                    </span>
                                );
                            })}
                    </div>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

SpotlightsViewByImage.propTypes = {
    isLightboxOpen: PropTypes.bool,
    handleLightboxClose: PropTypes.func,
    navigateToCloneForm: PropTypes.func,
    spotlightImageUrl: PropTypes.string,
    spotlights: PropTypes.array,
};

SpotlightsViewByImage.defaultProps = {
    spotlights: [],
};

export default React.memo(SpotlightsViewByImage);
