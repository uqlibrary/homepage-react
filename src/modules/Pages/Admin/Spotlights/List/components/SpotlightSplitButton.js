import React from 'react';
import PropTypes from 'prop-types';

import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grid from '@material-ui/core/Grid';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

import { useConfirmationState } from 'hooks';

import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { default as locale } from 'modules/Pages/Admin/Spotlights/spotlightsadmin.locale';

// based on https://material-ui.com/components/button-group/ "Split button"

const useStyles = makeStyles(() => ({
    parent: {
        position: 'relative',
        minHeight: 50,
    },
    menuWrapper: {
        marginTop: -75,
    },
}));
export const SpotlightSplitButton = ({
    cantDelete,
    deleteSpotlightById,
    hideMainButton,
    mainButtonLabel,
    navigateToCloneForm,
    navigateToEditForm,
    navigateToView,
    confirmDeleteLocale,
    showViewByHistoryOption,
    spotlight,
}) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const [isDeleteConfirmOpen, showDeleteConfirmation, hideDeleteConfirmation] = useConfirmationState();

    const handleToggle = () => {
        setOpen(prevOpen => !prevOpen);
    };

    const handleClose = event => {
        /* istanbul ignore next */
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    return (
        <React.Fragment>
            <ConfirmationBox
                actionButtonColor="secondary"
                actionButtonVariant="contained"
                confirmationBoxId="spotlight-delete-confirm"
                onAction={() => deleteSpotlightById(spotlight.id)}
                onClose={hideDeleteConfirmation}
                onCancelAction={hideDeleteConfirmation}
                isOpen={isDeleteConfirmOpen}
                locale={confirmDeleteLocale(1)}
            />
            <Grid container direction="column" alignItems="center">
                <Grid item xs={12} className={classes.parent}>
                    <ButtonGroup variant="contained" color="primary" ref={anchorRef} aria-label="split button">
                        {!hideMainButton && (
                            <Button
                                children={mainButtonLabel}
                                color="primary"
                                data-testid={`spotlight-list-item-${mainButtonLabel.toLowerCase()}-${spotlight.id}`}
                                id={`spotlight-list-item-${mainButtonLabel.toLowerCase()}-${spotlight.id}`}
                                onClick={() =>
                                    mainButtonLabel === 'Edit'
                                        ? navigateToEditForm(spotlight.id)
                                        : navigateToView(spotlight.id)
                                }
                                className={classes.editButton}
                                variant="contained"
                            />
                        )}
                        <Button
                            color="primary"
                            className={classes.editButton}
                            size="small"
                            aria-controls={open ? 'split-button-menu' : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-label="More actions"
                            aria-haspopup="menu"
                            data-testid={`spotlight-list-arrowicon-${spotlight.id}`}
                            onClick={handleToggle}
                            title="More actions"
                        >
                            <ArrowDropDownIcon />
                        </Button>
                    </ButtonGroup>
                    <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                        {({ TransitionProps, placement }) => (
                            <Grow
                                {...TransitionProps}
                                style={{
                                    transformOrigin:
                                        placement === 'bottom'
                                            ? 'center top'
                                            : /* istanbul ignore next */ 'center bottom',
                                    zIndex: 1,
                                }}
                            >
                                <Paper className={classes.menuWrapper}>
                                    <ClickAwayListener onClickAway={handleClose}>
                                        <MenuList id="split-button-menu">
                                            <MenuItem
                                                data-testid={`${spotlight.id}-clone-button`}
                                                key={`${spotlight.id}-clone-button`}
                                                onClick={() => navigateToCloneForm(spotlight.id)}
                                            >
                                                {locale.form.splitButton.labels.clone}
                                            </MenuItem>
                                            {!cantDelete && (
                                                <MenuItem
                                                    data-testid={`${spotlight.id}-delete-button`}
                                                    key={`${spotlight.id}-delete-button`}
                                                    onClick={showDeleteConfirmation}
                                                >
                                                    {locale.form.splitButton.labels.delete}
                                                </MenuItem>
                                            )}
                                            <MenuItem
                                                data-testid={`${spotlight.id}-viewbyhistory-button`}
                                                key={`${spotlight.id}-viewbyhistory-button`}
                                                onClick={() => showViewByHistoryOption(spotlight)}
                                            >
                                                {locale.form.splitButton.labels.history}
                                            </MenuItem>
                                        </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                            </Grow>
                        )}
                    </Popper>
                </Grid>
            </Grid>
        </React.Fragment>
    );
};

SpotlightSplitButton.propTypes = {
    spotlight: PropTypes.any,
    mainButtonLabel: PropTypes.string,
    cantDelete: PropTypes.bool,
    deleteSpotlightById: PropTypes.func,
    navigateToCloneForm: PropTypes.func,
    navigateToEditForm: PropTypes.func,
    navigateToView: PropTypes.func,
    navigateToMainFunction: PropTypes.func,
    confirmDeleteLocale: PropTypes.func,
    showViewByHistoryOption: PropTypes.func,
    hideMainButton: PropTypes.bool,
};

SpotlightSplitButton.defaultProps = {
    mainButtonLabel: 'Edit',
    hideMainButton: false,
    cantDelete: false,
};

export default SpotlightSplitButton;
