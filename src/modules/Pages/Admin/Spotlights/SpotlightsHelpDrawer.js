import React from 'react';
import PropTypes from 'prop-types';

import SimpleBackdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import { makeStyles } from '@material-ui/styles';
import Drawer from '@material-ui/core/Drawer';

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
            [theme.breakpoints.down('sm')]: {
                width: 200,
            },
        },
    }),
    { withTheme: true },
);
export const SpotlightsHelpDrawer = ({ open, helpContent, closeHelpLightbox }) => {
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
                    <h2>{helpContent?.title || /* istanbul ignore next */ 'TBA'}</h2>
                    <div>{helpContent?.text || /* istanbul ignore next */ ''}</div>
                    <div>
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            children={helpContent?.buttonLabel || 'Close'}
                            onClick={closeHelpLightbox}
                        />
                    </div>
                </div>
            </Fade>
        </Drawer>
    );
};

SpotlightsHelpDrawer.propTypes = {
    // actions: PropTypes.any,
    helpContent: PropTypes.any,
    // helpButtonLabel: PropTypes.string,
    // history: PropTypes.object,
    // showAddButton: PropTypes.bool,
    open: PropTypes.any,
    setHelpLightboxOpen: PropTypes.any,
    closeHelpLightbox: PropTypes.any,
};

// SpotlightsHelpDrawer.defaultProps = {
//     helpButtonLabel: 'Help',
//     showAddButton: false,
// };
