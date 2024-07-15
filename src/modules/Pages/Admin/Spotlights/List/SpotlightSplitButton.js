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
import { default as locale } from 'modules/Pages/Admin/Spotlights/spotlightsadmin.locale';
import { isPastSpotlight, navigateToEditForm } from 'modules/Pages/Admin/Spotlights/spotlighthelpers';

// based on https://material-ui.com/components/button-group/ "Split button"
export const SpotlightSplitButton = ({
    deleteSpotlightById,
    mainButtonLabel = 'Edit',
    navigateToCloneForm,
    navigateToView,
    confirmDeleteLocale = false,
    showViewByHistoryOption,
    spotlight,
    history,
    allowedArrowActions = [],
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

    function deleteLocale() {
        // when delete isnt supplied, we have to not let the function fire
        if (allowedArrowActions.includes('delete') && typeof confirmDeleteLocale === 'function') {
            return confirmDeleteLocale(1);
        }
        return {
            ...locale.listPage.confirmDelete,
            confirmationTitle: 'should not appear',
        };
    }

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
                locale={deleteLocale()}
            />
            <Grid container direction="column" alignItems="center">
                <Grid item xs={12} sx={{ position: 'relative', minHeight: 50 }}>
                    <ButtonGroup
                        variant="contained"
                        color="primary"
                        ref={anchorRef}
                        aria-label="split button"
                        style={{ float: 'right' }}
                    >
                        {mainButtonLabel === 'Edit' && (
                            <Button
                                children={mainButtonLabel}
                                color="primary"
                                data-testid={`spotlight-list-item-edit-${spotlight.id}`}
                                id={`spotlight-list-item-edit-${spotlight.id}`}
                                onClick={() => navigateToEditForm(spotlight.id, history)}
                                className={'editButton'}
                                variant="contained"
                            />
                        )}
                        {mainButtonLabel === 'View' && (
                            <Button
                                children={mainButtonLabel}
                                color="primary"
                                data-testid={`spotlight-list-item-view-${spotlight.id}`}
                                id={`spotlight-list-item-view-${spotlight.id}`}
                                onClick={() => navigateToView(spotlight.id, history)}
                                className={'editButton'}
                                variant="contained"
                            />
                        )}
                        {mainButtonLabel === 'Clone' && (
                            <Button
                                children={mainButtonLabel}
                                color="primary"
                                data-testid={`spotlight-list-item-clone-${spotlight.id}`}
                                id={`spotlight-list-item-clone-${spotlight.id}`}
                                onClick={() => navigateToCloneForm(spotlight.id, history)}
                                className={'editButton'}
                                variant="contained"
                            />
                        )}
                        {allowedArrowActions.length > 0 && (
                            <Button
                                color="primary"
                                className={'editButton'}
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
                        )}
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
                                    minWidth: 60,
                                }}
                            >
                                <Paper sx={{ marginTop: '-75px' }}>
                                    <ClickAwayListener onClickAway={handleClose}>
                                        <MenuList id="split-button-menu">
                                            {allowedArrowActions.includes('clone') && (
                                                <MenuItem
                                                    data-testid={`${spotlight.id}-clone-button`}
                                                    key={`${spotlight.id}-clone-button`}
                                                    onClick={() => navigateToCloneForm(spotlight.id, history)}
                                                >
                                                    {locale.form.splitButton.labels.clone}
                                                </MenuItem>
                                            )}
                                            {allowedArrowActions.includes('delete') && (
                                                <MenuItem
                                                    data-testid={`${spotlight.id}-delete-button`}
                                                    key={`${spotlight.id}-delete-button`}
                                                    onClick={showDeleteConfirmation}
                                                >
                                                    {locale.form.splitButton.labels.delete}
                                                </MenuItem>
                                            )}
                                            {allowedArrowActions.includes('viewbyhistory') && (
                                                <MenuItem
                                                    data-testid={`${spotlight.id}-viewbyhistory-button`}
                                                    key={`${spotlight.id}-viewbyhistory-button`}
                                                    onClick={() =>
                                                        !!showViewByHistoryOption && showViewByHistoryOption(spotlight)
                                                    }
                                                >
                                                    {locale.form.splitButton.labels.history}
                                                </MenuItem>
                                            )}
                                            {mainButtonLabel !== 'Edit' &&
                                                allowedArrowActions.includes('edit') &&
                                                !isPastSpotlight(spotlight) && (
                                                    /* istanbul ignore next */ <MenuItem
                                                        data-testid={`${spotlight.id}-viewbyhistory-button`}
                                                        key={`${spotlight.id}-viewbyhistory-button`}
                                                        onClick={
                                                            /* istanbul ignore next */ () =>
                                                                /* istanbul ignore next */
                                                                navigateToEditForm(spotlight.id, history)
                                                        }
                                                    >
                                                        {locale.form.splitButton.labels.edit}
                                                    </MenuItem>
                                                )}
                                            {mainButtonLabel !== 'View' &&
                                                allowedArrowActions.includes('view') &&
                                                isPastSpotlight(spotlight) && (
                                                    /* istanbul ignore next */ <MenuItem
                                                        data-testid={`${spotlight.id}-viewbyhistory-button`}
                                                        key={`${spotlight.id}-viewbyhistory-button`}
                                                        onClick={
                                                            /* istanbul ignore next */ () =>
                                                                /* istanbul ignore next */ navigateToView(
                                                                    spotlight.id,
                                                                    history,
                                                                )
                                                        }
                                                    >
                                                        {locale.form.splitButton.labels.view}
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

SpotlightSplitButton.propTypes = {
    spotlight: PropTypes.any,
    mainButtonLabel: PropTypes.string,
    deleteSpotlightById: PropTypes.func,
    navigateToCloneForm: PropTypes.func,
    navigateToView: PropTypes.func,
    navigateToMainFunction: PropTypes.func,
    confirmDeleteLocale: PropTypes.any,
    showViewByHistoryOption: PropTypes.func,
    history: PropTypes.any,
    allowedArrowActions: PropTypes.array,
};

export default SpotlightSplitButton;
