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
    group,
    item,
    canClone,
    canDelete,
    canUnschedule,
    onPreview,
    deletePanelById,
    mainButtonLabel,
    navigateToCloneForm,
    navigateToEditForm,
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
                confirmationBoxId="panel-delete-confirm"
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
                            children={canEdit ? 'Edit' : 'View'}
                            color="primary"
                            data-testid={`panel-list-item-${mainButtonLabel.toLowerCase()}-${row.panel_id}-${group}`}
                            id={`panel-list-item-${mainButtonLabel.toLowerCase()}-${row.panel_id}-${group}`}
                            onClick={() => (canEdit ? navigateToEditForm(row.panel_id) : handlePreview(row, item))}
                            variant="contained"
                        />
                        <Button
                            color="primary"
                            size="small"
                            aria-controls={open ? 'split-button-menu' : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-label="More actions"
                            aria-haspopup="menu"
                            data-testid={`alert-list-arrowicon-${row.panel_id}-${(group && group) || 'none'}`}
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
                                                    data-testid={`${row.panel_id}-preview-button-${group}`}
                                                    key={`${row.panel_id}-preview-button-${group}`}
                                                    onClick={() => handlePreview(row, item)}
                                                >
                                                    View
                                                </MenuItem>
                                            ) : null
                                            // (
                                            //     <MenuItem
                                            //         data-testid={`${alertId}-edit-button`}
                                            //         key={`${alertId}-edit-button`}
                                            //         onClick={() => navigateToEditForm(row.panel_id)}
                                            //     >
                                            //         Edit
                                            //     </MenuItem>
                                            // )
                                            }
                                            {!!canClone && (
                                                <MenuItem
                                                    data-testid={`${row.panel_id}-clone-button-${group}`}
                                                    key={`${row.panel_id}-clone-button`}
                                                    onClick={() => navigateToCloneForm(row.panel_id)}
                                                >
                                                    Clone
                                                </MenuItem>
                                            )}
                                            {!!(canDelete || canUnschedule) && (
                                                <MenuItem
                                                    data-testid={`${row.panel_id}-delete-button`}
                                                    key={`${row.panel_id}-delete-button`}
                                                    onClick={showDeleteConfirmation}
                                                >
                                                    {canDelete ? 'Delete' : 'Unschedule'}
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
    group: PropTypes.string,
    canClone: PropTypes.bool,
    canDelete: PropTypes.bool,
    canUnschedule: PropTypes.bool,
    onPreview: PropTypes.func,
    mainButtonLabel: PropTypes.string,
    deletePanelById: PropTypes.func,
    navigateToCloneForm: PropTypes.func,
    navigateToEditForm: PropTypes.func,
    confirmDeleteLocale: PropTypes.func,
};

PromoPanelSplitButton.defaultProps = {
    mainButtonLabel: 'Edit',
    align: '',
};

export default PromoPanelSplitButton;
