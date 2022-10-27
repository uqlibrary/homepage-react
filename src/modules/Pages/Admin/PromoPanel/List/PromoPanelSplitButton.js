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

const useStyles = makeStyles(() => ({
    parent: {
        position: 'relative',
    },
    menuWrapper: {
        marginTop: -50,
    },
}));
export const PromoPanelSplitButton = ({
    canEdit,
    align,
    row,
    item,
    canClone,
    canDelete,
    alertId,
    onPreview,
    deletePanelById,
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
        /* istanbul ignore next */
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    const handlePreview = row => {
        setOpen(false);
        onPreview(row);
    };
    return (
        <React.Fragment>
            <ConfirmationBox
                actionButtonColor="secondary"
                actionButtonVariant="contained"
                confirmationBoxId="alert-delete-confirm"
                onAction={() => deletePanelById(row.panel_id)}
                onClose={hideDeleteConfirmation}
                onCancelAction={hideDeleteConfirmation}
                isOpen={isDeleteConfirmOpen}
                locale={confirmDeleteLocale(1)}
            />
            <Grid container direction="column" alignItems={!!align ? align : 'center'}>
                <Grid item xs={12} className={classes.parent}>
                    <ButtonGroup variant="contained" color="primary" ref={anchorRef} aria-label="split button">
                        <Button
                            children={canEdit ? 'Edit' : 'Preview'}
                            color="primary"
                            data-testid={`alert-list-item-${mainButtonLabel.toLowerCase()}-${alertId}`}
                            id={`alert-list-item-${mainButtonLabel.toLowerCase()}-${alertId}`}
                            onClick={() => (canEdit ? navigateToEditForm(alertId) : navigateToView(alertId))}
                            variant="contained"
                        />
                        <Button
                            color="primary"
                            size="small"
                            aria-controls={open ? 'split-button-menu' : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-label="More actions"
                            aria-haspopup="menu"
                            data-testid={`alert-list-arrowicon-${alertId}`}
                            onClick={handleToggle}
                            title="More actions"
                        >
                            <ArrowDropDownIcon />
                        </Button>
                    </ButtonGroup>
                    <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition>
                        {({ TransitionProps, placement }) => (
                            <Grow
                                {...TransitionProps}
                                style={{
                                    transformOrigin:
                                        placement === 'bottom' ? 'center top' : /* istanbul ignore next */ 'center top',
                                    zIndex: 9999,
                                }}
                            >
                                <Paper className={classes.menuWrapper}>
                                    <ClickAwayListener onClickAway={handleClose}>
                                        <MenuList id="split-button-menu">
                                            {!!canEdit ? (
                                                <MenuItem
                                                    data-testid={`${alertId}-preview-button`}
                                                    key={`${alertId}-preview-button`}
                                                    onClick={() => handlePreview(row, item)}
                                                >
                                                    Preview
                                                </MenuItem>
                                            ) : (
                                                <MenuItem
                                                    data-testid={`${alertId}-edit-button`}
                                                    key={`${alertId}-edit-button`}
                                                    onClick={() => navigateToEditForm(alertId)}
                                                >
                                                    Edit
                                                </MenuItem>
                                            )}
                                            {!!canClone && (
                                                <MenuItem
                                                    data-testid={`${alertId}-clone-button`}
                                                    key={`${alertId}-clone-button`}
                                                    onClick={() => navigateToCloneForm(alertId)}
                                                >
                                                    Clone
                                                </MenuItem>
                                            )}
                                            {!!canDelete && (
                                                <MenuItem
                                                    data-testid={`${alertId}-delete-button`}
                                                    key={`${alertId}-delete-button`}
                                                    onClick={showDeleteConfirmation}
                                                >
                                                    Delete
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
        </React.Fragment>
    );
};

PromoPanelSplitButton.propTypes = {
    row: PropTypes.object,
    align: PropTypes.string,
    item: PropTypes.object,
    canEdit: PropTypes.bool,
    canClone: PropTypes.bool,
    canDelete: PropTypes.bool,
    alertId: PropTypes.string,
    onPreview: PropTypes.func,
    mainButtonLabel: PropTypes.string,
    deleteAlertById: PropTypes.func,
    navigateToCloneForm: PropTypes.func,
    navigateToEditForm: PropTypes.func,
    navigateToView: PropTypes.func,
    navigateToMainFunction: PropTypes.func,
    confirmDeleteLocale: PropTypes.func,
};

PromoPanelSplitButton.defaultProps = {
    mainButtonLabel: 'Edit',
    align: '',
};

export default PromoPanelSplitButton;
