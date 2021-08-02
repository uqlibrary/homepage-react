import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

// based on https://material-ui.com/components/button-group/ "Split button"

const useStyles = makeStyles(
    theme => ({
        parent: {
            position: 'relative',
        },
        child2: {
            // position: 'absolute',
            // top: -50,
            // left: -50,
            // backgroundColor: '#fff',
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
    // confirmDeleteLocale,
}) => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    // const [selectedIndex, setSelectedIndex] = React.useState(1);

    // const handleClick = () => {
    //     console.info(`You clicked ${options[selectedIndex]}`);
    // };

    // const handleMenuItemClick = (event, index) => {
    //     setSelectedIndex(index);
    //     setOpen(false);
    // };

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
        <Grid container direction="column" alignItems="center">
            <Grid item xs={12} className={classes.parent}>
                <ButtonGroup variant="contained" color="primary" ref={anchorRef} aria-label="split button">
                    <Button
                        children={mainButtonLabel}
                        color="primary"
                        data-testid={`alert-list-item-edit-${alertId}`}
                        id={`alert-list-item-edit-${alertId}`}
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
                        aria-label="select merge strategy"
                        aria-haspopup="menu"
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
                            <Paper className={classes.child2}>
                                <ClickAwayListener onClickAway={handleClose}>
                                    <MenuList id="split-button-menu">
                                        <MenuItem
                                            key={`${alertId}-edit-button`}
                                            // disabled={index === 2}
                                            // selected={index === selectedIndex}
                                            onClick={() =>
                                                mainButtonLabel === 'Edit'
                                                    ? navigateToEditForm(alertId)
                                                    : navigateToView(alertId)
                                            }
                                        >
                                            {mainButtonLabel}
                                        </MenuItem>
                                        <MenuItem
                                            key={`${alertId}-delete-button`}
                                            // disabled={index === 2}
                                            // selected={index === selectedIndex}
                                            onClick={event => deleteAlertById(event, alertId)}
                                        >
                                            Delete
                                        </MenuItem>
                                        <MenuItem
                                            key={`${alertId}-clone-button`}
                                            // disabled={index === 2}
                                            // selected={index === selectedIndex}
                                            onClick={() => navigateToCloneForm(alertId)}
                                        >
                                            Clone
                                        </MenuItem>
                                        {mainButtonLabel === 'Edit' && (
                                            <MenuItem
                                                key={`${alertId}-view-button`}
                                                // disabled={index === 2}
                                                // selected={index === selectedIndex}
                                                onClick={() => navigateToView(alertId)}
                                            >
                                                View
                                            </MenuItem>
                                        )}
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </Grid>
        </Grid>
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
    // confirmDeleteLocale: PropTypes.func,
};

SplitButton.defaultProps = {
    mainButtonLabel: 'Edit',
};

export default SplitButton;
