import React from 'react';
import PropTypes from 'prop-types';

import SimpleBackdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import Drawer from '@mui/material/Drawer';
import { styled } from '@mui/material/styles';

const StyledDrawer = styled(Drawer)(({ theme }) => ({
    overflowY: 'scroll',
    '& p': {
        marginBlockStart: 0,
        marginBlockEnd: '1em',
    },
    '& li': {
        marginBlockStart: 0,
        marginBlockEnd: '1em',
    },
    '& dt': {
        fontStyle: 'italic',
    },
    '&. paper': {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(2, 4, 3),
        width: 500,
        [theme.breakpoints.down('md')]: {
            width: 200,
        },
    },
}));
export const SpotlightsHelpDrawer = ({ open, helpContent, closeHelpLightbox }) => {
    return (
        <StyledDrawer
            sx={{
                zIndex: 9999,
            }}
            anchor="right"
            open={open}
            onClose={closeHelpLightbox}
            closeAfterTransition
            BackdropComponent={SimpleBackdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={open}>
                <div className={'paper'}>
                    <h2 data-testid="help-drawer-title">{helpContent?.title || /* istanbul ignore next */ 'TBA'}</h2>
                    <div>{helpContent?.text || /* istanbul ignore next */ ''}</div>
                    <div>
                        <Button
                            variant="contained"
                            color="primary"
                            className={'button'}
                            children={helpContent?.buttonLabel || 'Close'}
                            data-testid="spotlights-helpdrawer-close-button"
                            onClick={closeHelpLightbox}
                        />
                    </div>
                </div>
            </Fade>
        </StyledDrawer>
    );
};

SpotlightsHelpDrawer.propTypes = {
    helpContent: PropTypes.any,
    open: PropTypes.any,
    setHelpLightboxOpen: PropTypes.any,
    closeHelpLightbox: PropTypes.any,
};
