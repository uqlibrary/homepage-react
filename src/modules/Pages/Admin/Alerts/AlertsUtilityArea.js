import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

import SimpleBackdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import Drawer from '@mui/material/Drawer';
import { styled } from '@mui/material/styles';

/**
 * a block that shows:
 * - page heading
 * - utility buttons (help, add alert, anything else we want to put up here)
 * - the help drawer
 */

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
    '& .paper': {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(2, 4, 3),
        width: 500,
        [theme.breakpoints.down('md')]: {
            width: 200,
        },
    },
}));

const StyledActionButtonPlacer = styled('div')(({ theme }) => ({
    float: 'right',
    marginTop: 16,
    marginRight: 16,
}));

export const AlertsUtilityArea = ({
    actions,
    helpButtonLabel = 'Help',
    helpContent,
    history,
    showAddButton = false,
}) => {
    const [lightboxOpen, setLightboxOpen] = useState(false);

    const openHelpLightbox = () => {
        setLightboxOpen(true);
    };

    const closeHelpLightbox = () => {
        setLightboxOpen(false);
    };

    const navigateToAddPage = () => {
        actions.clearAnAlert();
        history.push('/admin/alerts/add');
    };

    return (
        <Fragment>
            {!!helpContent && (
                <StyledActionButtonPlacer>
                    <Button
                        children={helpButtonLabel}
                        color="secondary"
                        data-testid="admin-alerts-help-button"
                        id="admin-alerts-help-button"
                        onClick={openHelpLightbox}
                        variant="contained"
                    />
                </StyledActionButtonPlacer>
            )}
            {!!showAddButton && (
                <StyledActionButtonPlacer>
                    <Button
                        children="Add alert"
                        color="primary"
                        data-testid="admin-alerts-help-display-button"
                        onClick={() => navigateToAddPage()}
                        variant="contained"
                    />
                </StyledActionButtonPlacer>
            )}
            <StyledDrawer
                anchor="right"
                open={lightboxOpen}
                onClose={closeHelpLightbox}
                closeAfterTransition
                BackdropComponent={SimpleBackdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={lightboxOpen}>
                    <div className={'paper'}>
                        <h2>{helpContent?.title || /* istanbul ignore next */ 'TBA'}</h2>
                        <div>{helpContent?.text || /* istanbul ignore next */ ''}</div>
                        <div>
                            <Button
                                variant="contained"
                                color="primary"
                                className={'button'}
                                children={helpContent?.buttonLabel || 'Close'}
                                onClick={closeHelpLightbox}
                            />
                        </div>
                    </div>
                </Fade>
            </StyledDrawer>
        </Fragment>
    );
};

AlertsUtilityArea.propTypes = {
    actions: PropTypes.any,
    helpContent: PropTypes.any,
    helpButtonLabel: PropTypes.string,
    history: PropTypes.object,
    showAddButton: PropTypes.bool,
};
