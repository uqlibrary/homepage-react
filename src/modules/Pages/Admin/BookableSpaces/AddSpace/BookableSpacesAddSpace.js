import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAccountContext } from 'context';

import { Grid } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { StyledPrimaryButton, StyledSecondaryButton } from 'helpers/general';

import { HeaderBar } from 'modules/Pages/Admin/BookableSpaces/HeaderBar';
import {
    addBreadcrumbsToSiteHeader,
    displayToastMessage,
    spacesAdminLink,
} from 'modules/Pages/Admin/BookableSpaces/helpers';

export const BookableSpacesAddSpace = ({
    actions,
    bookableSpacesRoomAdding,
    bookableSpacesRoomAddError,
    bookableSpacesRoomAddResult,
    campusList,
    campusListLoading,
    campusListError,
}) => {
    console.log(
        'bookableSpacesRoomAddResult',
        bookableSpacesRoomAdding,
        bookableSpacesRoomAddError,
        bookableSpacesRoomAddResult,
    );
    console.log('campusList', campusListLoading, campusListError, campusList);

    const { account } = useAccountContext();

    const [formValues, setFormValues2] = React.useState([]);
    const setFormValues = newValues => {
        console.log('setFormValues', newValues);
        setFormValues2(newValues);
    };
    const [confirmationOpen, setConfirmationOpen] = React.useState(false);

    useEffect(() => {
        addBreadcrumbsToSiteHeader([
            '<li class="uq-breadcrumb__item"><span class="uq-breadcrumb__link">Add a Space</span></li>',
        ]);
        if (campusListLoading === null && campusListError === null && campusList === null) {
            actions.loadBookableSpaceCampusChildren();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (
            campusListLoading === false &&
            campusListError === false &&
            campusList?.length > 0 &&
            formValues.length === 0
        ) {
            const currentCampus = campusList?.at(0);
            const currentCampusBuildings = currentCampus?.buildings;
            const currentBuilding = currentCampusBuildings?.at(0);
            const currentBuildingFloors = currentBuilding?.floors;
            const currentFloor = currentBuildingFloors?.at(0);

            const newValues = {
                ...formValues,
                ['campus_id']: currentCampus.campus_id,
                ['building_id']: currentBuilding.building_id,
                ['floor_id']: currentFloor.floor_id,
            };
            setFormValues(newValues);
        }
    }, [campusList, campusListError, campusListLoading, formValues]);

    useEffect(() => {
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

    const currentCampus = !!formValues.campus_id && campusList?.find(c => c.campus_id === formValues.campus_id);
    const currentCampusBuildings = currentCampus?.buildings;
    const currentBuilding = currentCampusBuildings?.find(b => b.building_id === formValues.building_id);
    const currentBuildingFloors = currentBuilding?.floors;
    const currentFloor = currentBuildingFloors?.find(f => f.floor_id === formValues.floor_id);

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
                                <Grid item xs={12}>
                                    <Typography component={'h3'} variant={'h6'}>
                                        Location
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <FormControl variant="standard" fullWidth>
                                        <InputLabel id="add-space-select-campus-label">Campus</InputLabel>
                                        <Select
                                            labelId="add-space-select-campus-label"
                                            id="add-space-select-campus"
                                            // value={formValues.campus_id}
                                            value={currentCampus?.campus_id || 1}
                                            label="Campus"
                                            onChange={handleChange('campus_id')}
                                        >
                                            {!!campusList &&
                                                campusList.length > 0 &&
                                                campusList.map((campus, index) => (
                                                    <MenuItem value={campus.campus_id} key={`select-campus-${index}`}>
                                                        {campus.campus_name}
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={4}>
                                    <FormControl variant="standard" fullWidth>
                                        <InputLabel id="add-space-select-building-label">Building</InputLabel>
                                        <Select
                                            labelId="add-space-select-building-label"
                                            id="add-space-select-building"
                                            value={currentBuilding?.building_id || 1}
                                            label="Building"
                                            onChange={handleChange('building_id')}
                                        >
                                            {!!currentCampusBuildings &&
                                                currentCampusBuildings.length > 0 &&
                                                currentCampusBuildings.map((building, index) => (
                                                    <MenuItem
                                                        value={building.building_id}
                                                        key={`select-building-${index}`}
                                                    >
                                                        {building.building_name}
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={4}>
                                    <FormControl variant="standard" fullWidth>
                                        <InputLabel id="add-space-select-floor-label">Floor</InputLabel>
                                        <Select
                                            labelId="add-space-select-floor-label"
                                            id="add-space-select-floor"
                                            value={currentFloor?.floor_id || 1}
                                            label="Floor"
                                            onChange={handleChange('floor_id')}
                                        >
                                            {!!currentBuildingFloors &&
                                                currentBuildingFloors?.length > 0 &&
                                                currentBuildingFloors?.map((floor, index) => (
                                                    <MenuItem value={floor.floor_id} key={`select-floor-${index}`}>
                                                        {floor.floor_name}
                                                    </MenuItem>
                                                ))}
                                        </Select>
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
    campusList: PropTypes.any,
    campusListLoading: PropTypes.any,
    campusListError: PropTypes.any,
};

export default React.memo(BookableSpacesAddSpace);
