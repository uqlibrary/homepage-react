import React from 'react';
import PropTypes from 'prop-types';

import SimpleBackdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import { makeStyles } from '@mui/styles';
import Drawer from '@mui/material/Drawer';

const useStyles = makeStyles(
    theme => ({
        drawer: {
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
        },
        paper: {
            backgroundColor: theme.palette.background.paper,
            padding: theme.spacing(2, 4, 3),
            width: 500,
            [theme.breakpoints.down('md')]: {
                width: 200,
            },
        },
    }),
    { withTheme: true },
);
export const PromoPanelHelpDrawer = ({ open, helpContent, closeHelpLightbox }) => {
    const classes = useStyles();

    return (
        <Drawer
            anchor="right"
            className={classes.drawer}
            open={open}
            onClose={closeHelpLightbox}
            closeAfterTransition
            BackdropComponent={SimpleBackdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={open}>
                <div className={classes.paper}>
                    <h2 data-testid="help-drawer-title" id="help-drawer-title">
                        {helpContent?.title || /* istanbul ignore next */ 'TBA'}
                    </h2>
                    <div>{helpContent?.text || /* istanbul ignore next */ ''}</div>
                    <div>
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            children={helpContent?.buttonLabel || 'Close'}
                            data-testid="promopanel-helpdrawer-close-button"
                            id="promopanel-helpdrawer-close-button"
                            onClick={closeHelpLightbox}
                        />
                    </div>
                </div>
            </Fade>
        </Drawer>
    );
};

PromoPanelHelpDrawer.propTypes = {
    helpContent: PropTypes.any,
    open: PropTypes.any,
    setHelpLightboxOpen: PropTypes.any,
    closeHelpLightbox: PropTypes.any,
};

export default PromoPanelHelpDrawer;
