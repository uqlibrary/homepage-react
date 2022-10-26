import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/styles';
import { PromoPanelHelpDrawer } from './PromoPanelHelpDrawer';
// import { default as locale } from 'modules/Pages/Admin/PromoPanel/promoPanelAdmin.locale';

/**
 * a block that shows:
 * - page heading
 * - utility buttons (help, add spotlight, anything else we want to put up here)
 * - the help drawer
 */

const useStyles = makeStyles(() => ({
    actionButtonPlacer: {
        float: 'right',
        marginTop: 16,
        marginRight: 16,
    },
}));
export const PromoPanelUtilityArea = ({ actions, helpButtonLabel, helpContent, history, showAddButton }) => {
    const classes = useStyles();

    const [helpLightboxOpen, setHelpLightboxOpen] = useState(false);

    const navigateToAddPage = () => {
        actions.clearASpotlight();
        history.push('/admin/promopanel/add');
    };

    const openHelpLightbox = () => setHelpLightboxOpen(true);
    const closeHelpLightbox = () => setHelpLightboxOpen(false);

    return (
        <Fragment>
            {!!helpContent && (
                <div className={classes.actionButtonPlacer}>
                    <Button
                        children={helpButtonLabel}
                        color="secondary"
                        data-testid="admin-promopanel-help-button"
                        id="admin-promopanel-help-button"
                        onClick={openHelpLightbox}
                        variant="contained"
                    />
                </div>
            )}
            {!!showAddButton && (
                <div className={classes.actionButtonPlacer}>
                    <Button
                        children="Add panel"
                        color="primary"
                        data-testid="admin-promopanel-add-display-button"
                        onClick={() => navigateToAddPage()}
                        variant="contained"
                    />
                </div>
            )}
            <PromoPanelHelpDrawer
                helpContent={helpContent}
                closeHelpLightbox={closeHelpLightbox}
                open={helpLightboxOpen}
            />
        </Fragment>
    );
};

PromoPanelUtilityArea.propTypes = {
    actions: PropTypes.any,
    helpContent: PropTypes.any,
    helpButtonLabel: PropTypes.string,
    history: PropTypes.object,
    showAddButton: PropTypes.bool,
};

PromoPanelUtilityArea.defaultProps = {
    helpButtonLabel: 'Help',
    showAddButton: false,
};
