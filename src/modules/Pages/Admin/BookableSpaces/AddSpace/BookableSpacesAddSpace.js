import React from 'react';
import PropTypes from 'prop-types';
import { useAccountContext } from 'context';

import { Grid } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';

import { HeaderBar } from 'modules/Pages/Admin/BookableSpaces/HeaderBar';
import {
    addBreadcrumbsToSiteHeader,
    displayToastMessage,
    spacesAdminLink,
} from 'modules/Pages/Admin/BookableSpaces/helpers';
import { StyledPrimaryButton, StyledSecondaryButton } from 'helpers/general';

export const BookableSpacesAddSpace = ({
    actions,
    bookableSpacesRoomAdding,
    bookableSpacesRoomAddError,
    bookableSpacesRoomAddResult,
}) => {
    console.log(bookableSpacesRoomAdding, bookableSpacesRoomAddError, bookableSpacesRoomAddResult);

    const { account } = useAccountContext();

    const [formValues, setFormValues] = React.useState([]);
    const [confirmationOpen, setConfirmationOpen] = React.useState(false);

    React.useEffect(() => {
        addBreadcrumbsToSiteHeader([
            '<li class="uq-breadcrumb__item"><span class="uq-breadcrumb__link">Add a Space</span></li>',
        ]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        setConfirmationOpen(
            !bookableSpacesRoomAdding && (!!bookableSpacesRoomAddError || !!bookableSpacesRoomAddResult),
        );
    }, [bookableSpacesRoomAdding, bookableSpacesRoomAddError, bookableSpacesRoomAddResult]);

    const handleChange = prop => e => {
        const theNewValue =
            e.target.hasOwnProperty('checked') && e.target.type !== 'radio' ? e.target.checked : e.target.value;

        const newValues = { ...formValues, [prop]: theNewValue };

        console.log('handleChange newValues=', newValues);
        setFormValues(newValues);
    };

    function navigateToPage(spacesPath) {
        window.location.href = spacesAdminLink(spacesPath, account);
    }

    const formValid = valuesToSend => {
        if (!valuesToSend.space_name || !valuesToSend.space_type) {
            return false;
        }

        return true;
    };

    const saveSpace = () => {
        const valuesToSend = { ...formValues };

        if (!formValid(valuesToSend)) {
            document.activeElement.blur();
            displayToastMessage('Please enter all required fields', true);
            return;
        }

        valuesToSend.locationType = 'space';

        console.log('saveSpace valuesToSend=', valuesToSend);
        actions.addBookableSpaceLocation(valuesToSend);
    };

    const clearForm = () => {
        setConfirmationOpen(false);
        window.location.reload(false);
    };
    function closeConfirmationBox() {
        setConfirmationOpen(false);
    }

    const locale = {
        success: {
            confirmationTitle: 'A Space has been added',
            confirmationMessage: '',
            cancelButtonLabel: 'Add another Space',
            confirmButtonLabel: 'Return to list page',
        },
        error: {
            confirmationTitle: bookableSpacesRoomAddError,
            confirmationMessage: '',
            cancelButtonLabel: 'Add another Space',
            confirmButtonLabel: 'Return to list page',
        },
    };
    return (
        <>
            <ConfirmationBox
                actionButtonColor="primary"
                actionButtonVariant="contained"
                confirmationBoxId="spaces-save-outcome"
                onAction={() => navigateToPage('')}
                hideCancelButton={!locale.success.cancelButtonLabel}
                cancelButtonLabel={locale.success.cancelButtonLabel}
                onCancelAction={() => clearForm()}
                onClose={closeConfirmationBox}
                isOpen={confirmationOpen}
                locale={!!bookableSpacesRoomAddError ? locale.error : locale.success}
                cancelButtonColor="accent"
            />

            <StandardPage title="Spaces">
                <HeaderBar pageTitle="Add a new Space" currentPage="add-space" />

                <section aria-live="assertive">
                    <StandardCard standardCardId="location-list-card" noPadding noHeader style={{ border: 'none' }}>
                        <form id="spaces-addedit-form">
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <FormControl variant="standard" fullWidth>
                                        <InputLabel htmlFor="space_name">Space name *</InputLabel>
                                        <Input
                                            id="space_name"
                                            data-testid="space-name"
                                            required
                                            value={formValues?.space_name || ''}
                                            onChange={handleChange('space_name')}
                                        />
                                        {/* {formValues?.space_name}*/}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl variant="standard" fullWidth>
                                        <InputLabel htmlFor="space_type">Space type *</InputLabel>
                                        <Input
                                            id="space_type"
                                            data-testid="space-type"
                                            required
                                            value={formValues?.space_type || ''}
                                            onChange={handleChange('space_type')}
                                        />
                                        {/* {formValues?.space_type}*/}
                                    </FormControl>
                                </Grid>

                                <Grid item xs={6}>
                                    <StyledSecondaryButton
                                        children="Cancel"
                                        data-testid="admin-spaces-form-button-cancel"
                                        onClick={() => navigateToPage('')}
                                        variant="contained"
                                    />
                                </Grid>
                                <Grid item xs={6} align="right">
                                    <StyledPrimaryButton
                                        data-testid="admin-spaces-save-button-submit"
                                        variant="contained"
                                        children="Save"
                                        onClick={saveSpace}
                                    />
                                </Grid>
                            </Grid>
                        </form>
                    </StandardCard>
                </section>
            </StandardPage>
        </>
    );
};

BookableSpacesAddSpace.propTypes = {
    actions: PropTypes.any,
    bookableSpacesRoomAdding: PropTypes.any,
    bookableSpacesRoomAddError: PropTypes.any,
    bookableSpacesRoomAddResult: PropTypes.any,
};

export default React.memo(BookableSpacesAddSpace);
