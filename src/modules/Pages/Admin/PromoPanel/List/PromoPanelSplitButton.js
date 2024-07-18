import React from 'react';
import PropTypes from 'prop-types';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grid from '@mui/material/Grid';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';

import { useConfirmationState } from 'hooks';

import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';

// based on https://material-ui.com/components/button-group/ "Split button"
export const PromoPanelSplitButton = ({
    canEdit,
    align = /* istanbul ignore next */ '',
    row,
    group,
    item,
    canClone,
    canDelete,
    canUnschedule,
    onPreview,
    deletePanelById,
    navigateToCloneForm,
    navigateToEditForm,
    confirmDeleteLocale,
}) => {
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
                actionButtonColor="primary"
                cancelButtonColor="secondary"
                actionButtonVariant="contained"
                confirmationBoxId="panel-delete-confirm"
                onAction={() => deletePanelById(row.panel_id)}
                onClose={hideDeleteConfirmation}
                onCancelAction={hideDeleteConfirmation}
                isOpen={isDeleteConfirmOpen}
                locale={confirmDeleteLocale(1)}
            />
            <Grid container direction="column" alignItems={!!align ? align : /* istanbul ignore next */ 'center'}>
                <Grid item xs={12} sx={{ position: 'relative' }}>
                    {/* <ButtonGroup variant="contained" color="primary" ref={anchorRef} aria-label="split button">
                        <Button
                            children={canEdit ? 'Edit' : 'View'}
                            color="primary"
                            data-testid={`panel-list-item-${mainButtonLabel.toLowerCase()}-${row.panel_id}-${(group &&
                                group) ||
                                /* istanbul ignore next  'none'}`}
                            id={`panel-list-item-${mainButtonLabel.toLowerCase()}-${row.panel_id}-${(group && group) ||
                                /* istanbul ignore next  'none'}`}
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
                            data-testid={`alert-list-arrowicon-${row.panel_id}-${(group && group) ||
                                /* istanbul ignore next  'none'}`}
                            onClick={handleToggle}
                            title="More actions"
                        >
                            <ArrowDropDownIcon />
                        </Button>
                    </ButtonGroup> */}
                    <ButtonGroup variant="contained" color="primary" ref={anchorRef} aria-label="split button">
                        <Button
                            children={'View'}
                            color="primary"
                            data-testid={`panel-list-item-preview-${row.panel_id}-${(group && group) ||
                                /* istanbul ignore next */ 'none'}`}
                            id={`panel-list-item-preview-${row.panel_id}-${(group && group) ||
                                /* istanbul ignore next */ 'none'}`}
                            onClick={() => handlePreview(row, item)}
                            variant="contained"
                        />
                        <Button
                            color="primary"
                            size="small"
                            aria-controls={open ? 'split-button-menu' : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-label="More actions"
                            aria-haspopup="menu"
                            data-testid={`panel-list-arrowicon-${row.panel_id}-${(group && group) ||
                                /* istanbul ignore next */ 'none'}`}
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
                                <Paper sx={{ marginTop: '-50px' }}>
                                    <ClickAwayListener onClickAway={handleClose}>
                                        <MenuList id="split-button-menu">
                                            {!!canEdit && (
                                                <MenuItem
                                                    data-testid={`${row.panel_id}-edit-button-${(!!group && group) ||
                                                        'none'}`}
                                                    key={`${row.panel_id}-edit-button-${group}`}
                                                    onClick={() => navigateToEditForm(row.panel_id)}
                                                >
                                                    Edit
                                                </MenuItem>
                                            )}
                                            {!!canClone && (
                                                <MenuItem
                                                    data-testid={`${row.panel_id}-clone-button-${(group && group) ||
                                                        /* istanbul ignore next */ 'none'}`}
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
    deletePanelById: PropTypes.func,
    navigateToCloneForm: PropTypes.func,
    navigateToEditForm: PropTypes.func,
    confirmDeleteLocale: PropTypes.func,
};

export default PromoPanelSplitButton;
