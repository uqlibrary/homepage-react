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

// based on https://material-ui.com/components/button-group/ "Split button"

const useStyles = makeStyles(
    theme => ({
        parent: {
            position: 'relative',
            minHeight: 50,
        },
        menuWrapper: {
            marginTop: -50,
        },
        editButton: {
            backgroundColor: theme.palette.accent.main,
            color: '#fff',
            '&:hover': {
                backgroundColor: theme.palette.accent.dark,
            },
        },
    }),
    { withTheme: true },
);
export const SplitButton = ({
    alertId,
    deleteAlertById,
    mainButtonLabel,
    navigateToCloneForm,
    navigateToEditForm,
    navigateToView,
    confirmDeleteLocale,
}) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const [isDeleteConfirmOpen, showDeleteConfirmation, hideDeleteConfirmation] = useConfirmationState();

    const handleToggle = () => {
        setOpen(prevOpen => !prevOpen);
    };

    const handleClose = event => {
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
                confirmationBoxId="alert-delete-confirm"
                onAction={() => deleteAlertById(alertId)}
                onClose={hideDeleteConfirmation}
                onCancelAction={hideDeleteConfirmation}
                isOpen={isDeleteConfirmOpen}
                locale={confirmDeleteLocale(1)}
            />
            <Grid container direction="column" alignItems="center">
                <Grid item xs={12} className={classes.parent}>
                    <ButtonGroup variant="contained" color="primary" ref={anchorRef} aria-label="split button">
                        <Button
                            children={mainButtonLabel}
                            color="primary"
                            data-testid={`alert-list-item-${mainButtonLabel.toLowerCase()}-${alertId}`}
                            id={`alert-list-item-${mainButtonLabel.toLowerCase()}-${alertId}`}
                            onClick={() =>
                                mainButtonLabel === 'Edit' ? navigateToEditForm(alertId) : navigateToView(alertId)
                            }
                            className={classes.editButton}
                            variant="contained"
                        />
                        <Button
                            color="primary"
                            className={classes.editButton}
                            size="small"
                            aria-controls={open ? 'split-button-menu' : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-label="Select alert action"
                            aria-haspopup="menu"
                            data-testid={`alert-list-arrowicon-${alertId}`}
                            onClick={handleToggle}
                        >
                            <ArrowDropDownIcon />
                        </Button>
                    </ButtonGroup>
                    <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                        {({ TransitionProps, placement }) => (
                            <Grow
                                {...TransitionProps}
                                style={{
                                    transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                                    zIndex: 1,
                                }}
                            >
                                <Paper className={classes.menuWrapper}>
                                    <ClickAwayListener onClickAway={handleClose}>
                                        <MenuList id="split-button-menu">
                                            <MenuItem
                                                data-testid={`${alertId}-clone-button`}
                                                key={`${alertId}-clone-button`}
                                                onClick={() => navigateToCloneForm(alertId)}
                                            >
                                                Clone
                                            </MenuItem>
                                            <MenuItem
                                                data-testid={`${alertId}-delete-button`}
                                                key={`${alertId}-delete-button`}
                                                onClick={showDeleteConfirmation}
                                            >
                                                Delete
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

SplitButton.propTypes = {
    alertId: PropTypes.string,
    mainButtonLabel: PropTypes.string,
    deleteAlertById: PropTypes.func,
    navigateToCloneForm: PropTypes.func,
    navigateToEditForm: PropTypes.func,
    navigateToView: PropTypes.func,
    navigateToMainFunction: PropTypes.func,
    confirmDeleteLocale: PropTypes.func,
};

SplitButton.defaultProps = {
    mainButtonLabel: 'Edit',
};

export default SplitButton;
