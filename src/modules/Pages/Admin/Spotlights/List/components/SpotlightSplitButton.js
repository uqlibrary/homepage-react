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
import { isPastSpotlight, navigateToEditForm } from 'modules/Pages/Admin/Spotlights/spotlighthelpers';

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
    deleteSpotlightById,
    mainButtonLabel,
    extendedNavigateToCloneForm,
    extendedNavigateToView,
    confirmDeleteLocale,
    showViewByHistoryOption,
    spotlight,
    history,
    allowedArrowActions,
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
                <Grid item xs={12} className={classes.parent}>
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
                                className={classes.editButton}
                                variant="contained"
                            />
                        )}
                        {mainButtonLabel === 'View' && (
                            <Button
                                children={mainButtonLabel}
                                color="primary"
                                data-testid={`spotlight-list-item-view-${spotlight.id}`}
                                id={`spotlight-list-item-view-${spotlight.id}`}
                                onClick={() => extendedNavigateToView(spotlight.id, history)}
                                className={classes.editButton}
                                variant="contained"
                            />
                        )}
                        {mainButtonLabel === 'Clone' && (
                            <Button
                                children={mainButtonLabel}
                                color="primary"
                                data-testid={`spotlight-list-item-clone-${spotlight.id}`}
                                id={`spotlight-list-item-clone-${spotlight.id}`}
                                onClick={() => extendedNavigateToCloneForm(spotlight.id, history)}
                                className={classes.editButton}
                                variant="contained"
                            />
                        )}
                        {allowedArrowActions.length > 0 && (
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
                                <Paper className={classes.menuWrapper}>
                                    <ClickAwayListener onClickAway={handleClose}>
                                        <MenuList id="split-button-menu">
                                            {allowedArrowActions.includes('clone') && (
                                                <MenuItem
                                                    data-testid={`${spotlight.id}-clone-button`}
                                                    key={`${spotlight.id}-clone-button`}
                                                    onClick={() => extendedNavigateToCloneForm(spotlight.id, history)}
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
                                                    <MenuItem
                                                        data-testid={`${spotlight.id}-viewbyhistory-button`}
                                                        key={`${spotlight.id}-viewbyhistory-button`}
                                                        onClick={() =>
                                                            !!showViewByHistoryOption &&
                                                            showViewByHistoryOption(spotlight)
                                                        }
                                                    >
                                                        {locale.form.splitButton.labels.edit}
                                                    </MenuItem>
                                                )}
                                            {mainButtonLabel !== 'View' &&
                                                allowedArrowActions.includes('view') &&
                                                isPastSpotlight(spotlight) && (
                                                    <MenuItem
                                                        data-testid={`${spotlight.id}-viewbyhistory-button`}
                                                        key={`${spotlight.id}-viewbyhistory-button`}
                                                        onClick={() =>
                                                            !!showViewByHistoryOption &&
                                                            showViewByHistoryOption(spotlight)
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
    extendedNavigateToCloneForm: PropTypes.func,
    extendedNavigateToView: PropTypes.func,
    navigateToMainFunction: PropTypes.func,
    confirmDeleteLocale: PropTypes.any,
    showViewByHistoryOption: PropTypes.func,
    history: PropTypes.any,
    allowedArrowActions: PropTypes.array,
};

SpotlightSplitButton.defaultProps = {
    mainButtonLabel: 'Edit',
    confirmDeleteLocale: false,
    allowedArrowActions: [],
};

export default SpotlightSplitButton;
