import React from 'react';
import PropTypes from 'prop-types';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ButtonGroup from '@mui/material/ButtonGroup';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grid from '@mui/material/Grid';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { styled } from '@mui/material/styles';

import { useConfirmationState } from 'hooks';

import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { standardText, StyledPrimaryButton } from 'helpers/general';

export const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
    ...standardText(theme),
}));

// based on https://material-ui.com/components/button-group/ "Split button"
export const AlertSplitButton = ({
    alertId,
    deleteAlertById,
    mainButtonLabel = 'Edit',
    navigateToCloneForm,
    navigateToEditForm,
    navigateToView,
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

    return (
        <React.Fragment>
            <ConfirmationBox
                confirmationBoxId="alert-delete-confirm"
                onAction={() => deleteAlertById(alertId)}
                onClose={hideDeleteConfirmation}
                onCancelAction={hideDeleteConfirmation}
                isOpen={isDeleteConfirmOpen}
                locale={confirmDeleteLocale(1)}
            />
            <Grid container direction="column" alignItems="center">
                <Grid item xs={12} sx={{ position: 'relative', minHeight: 50 }}>
                    <ButtonGroup variant="contained" color="primary" ref={anchorRef} aria-label="split button">
                        <StyledPrimaryButton
                            children={mainButtonLabel}
                            data-testid={`alert-list-item-${mainButtonLabel.toLowerCase()}-${alertId}`}
                            id={`alert-list-item-${mainButtonLabel.toLowerCase()}-${alertId}`}
                            onClick={() =>
                                mainButtonLabel === 'Edit' ? navigateToEditForm(alertId) : navigateToView(alertId)
                            }
                            sx={{ borderColor: '#51247a !important' }}
                        />
                        <StyledPrimaryButton
                            size="small"
                            aria-controls={open ? 'split-button-menu' : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-label="More actions"
                            aria-haspopup="menu"
                            data-testid={`alert-list-arrowicon-${alertId}`}
                            onClick={handleToggle}
                            title="More actions"
                            sx={{ paddingInline: 0 }}
                        >
                            <ArrowDropDownIcon />
                        </StyledPrimaryButton>
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
                                <Paper sx={{ marginTop: '-50px' }}>
                                    <ClickAwayListener onClickAway={handleClose}>
                                        <MenuList id="split-button-menu">
                                            <StyledMenuItem
                                                data-testid={`${alertId}-clone-button`}
                                                key={`${alertId}-clone-button`}
                                                onClick={() => navigateToCloneForm(alertId)}
                                            >
                                                Clone
                                            </StyledMenuItem>
                                            <StyledMenuItem
                                                data-testid={`${alertId}-delete-button`}
                                                key={`${alertId}-delete-button`}
                                                onClick={showDeleteConfirmation}
                                            >
                                                Delete
                                            </StyledMenuItem>
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

AlertSplitButton.propTypes = {
    alertId: PropTypes.string,
    mainButtonLabel: PropTypes.string,
    deleteAlertById: PropTypes.func,
    navigateToCloneForm: PropTypes.func,
    navigateToEditForm: PropTypes.func,
    navigateToView: PropTypes.func,
    navigateToMainFunction: PropTypes.func,
    confirmDeleteLocale: PropTypes.func,
};

export default AlertSplitButton;
