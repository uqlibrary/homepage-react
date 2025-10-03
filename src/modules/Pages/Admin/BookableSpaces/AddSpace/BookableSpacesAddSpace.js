import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useAccountContext } from 'context';
import { useCookies } from 'react-cookie';

import Autocomplete from '@mui/material/Autocomplete';
import { Grid } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { isValidUrl, standardText, StyledPrimaryButton, StyledSecondaryButton } from 'helpers/general';

import { HeaderBar } from 'modules/Pages/Admin/BookableSpaces/HeaderBar';
import {
    addBreadcrumbsToSiteHeader,
    displayToastMessage,
    spacesAdminLink,
    springshareLocations,
} from 'modules/Pages/Admin/BookableSpaces/helpers';
import { getFriendlyLocationDescription } from '../../../BookableSpaces/spacesHelpers';

const AddSpacePage = ({ children }) => {
    return (
        <StandardPage title="Spaces">
            <HeaderBar pageTitle="Add a new Space" currentPage="add-space" />
            <section aria-live="assertive">
                <StandardCard standardCardId="location-list-card" noPadding noHeader style={{ border: 'none' }}>
                    {children}
                </StandardCard>
            </section>
        </StandardPage>
    );
};

const StyledErrorMessageTypography = styled(Typography)(({ theme }) => ({
    ...standardText(theme),
    color: theme.palette.error.light,
    marginTop: 4,
}));

export const BookableSpacesAddSpace = ({
    actions,
    bookableSpacesRoomAdding,
    bookableSpacesRoomAddError,
    bookableSpacesRoomAddResult,
    campusList,
    campusListLoading,
    campusListError,
    bookableSpacesRoomList,
    bookableSpacesRoomListLoading,
    bookableSpacesRoomListError,
    weeklyHours,
    weeklyHoursLoading,
    weeklyHoursError,
}) => {
    console.log('addResult', bookableSpacesRoomAdding, bookableSpacesRoomAddError, bookableSpacesRoomAddResult);
    console.log('campusList', campusListLoading, campusListError, campusList);
    console.log('spacesRoomList', bookableSpacesRoomListLoading, bookableSpacesRoomListError, bookableSpacesRoomList);
    console.log('weeklyHours', weeklyHoursLoading, weeklyHoursError, weeklyHours);

    const { account } = useAccountContext();
    const [cookies, setCookie] = useCookies();

    const [location, setLocation1] = useState({});
    const setLocation = newValues => {
        console.log('setLocation', newValues);
        setLocation1(newValues);
    };
    const [formValues, setFormValues2] = useState([]);
    const setFormValues = newValues => {
        console.log('setFormValues', newValues);
        setFormValues2(newValues);
    };
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [errorMessages, setErrorMessages2] = useState([]);
    const setErrorMessages = m => {
        console.log('setErrorMessages', m);
        setErrorMessages2(m);
    };

    const [selectedSpringshareOption, setSpringshareOption2] = useState(null);
    const setSpringshareOption = newValue => {
        console.log('setSpringshareOption', newValue);
        setSpringshareOption2(newValue);
    };

    // const [savingProgressShown, showSavingProgress2] = useState(false);
    // const showSavingProgress = x => {
    //     console.log('showSavingProgress', x);
    //     showSavingProgress2(x);
    // };

    const basePhotoDescriptionFieldLabel = 'Description of photo to assist people using screen readers';
    const noSpringshareHoursLabel = 'No Springshare opening hours will display (click to change)';

    useEffect(() => {
        addBreadcrumbsToSiteHeader([
            '<li class="uq-breadcrumb__item"><span class="uq-breadcrumb__link">Add a Space</span></li>',
        ]);
        if (campusListLoading === null && campusListError === null && campusList === null) {
            actions.loadBookableSpaceCampusChildren(); // get campusList
            actions.loadAllBookableSpacesRooms(); // get bookableSpacesRoomList
            actions.loadWeeklyHours(); // get weeklyHours
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const validCampusList = campusList => campusList?.filter(c => c.libraries?.length > 0) || [];
    const validLibraryList = libraryList => libraryList?.filter(l => l.floors.length > 0) || [];

    const springshareList = React.useMemo(() => {
        if (
            weeklyHoursLoading !== false ||
            weeklyHoursError !== false ||
            !weeklyHours?.locations ||
            !Array.isArray(weeklyHours.locations)
        ) {
            return [];
        }

        const unselectedOption = {
            id: -1,
            display_name: noSpringshareHoursLabel,
        };
        const newVar = [unselectedOption, ...springshareLocations(weeklyHours)];
        console.log('calculate springshareList=', newVar);
        return newVar;
    }, [weeklyHoursLoading, weeklyHoursError, weeklyHours]);

    useEffect(() => {
        console.log('@@@ formValues=', formValues);
        if (
            campusListLoading === false &&
            campusListError === false &&
            campusList?.length > 0 &&
            formValues.length === 0
        ) {
            const locnTemp = {};
            locnTemp.currentCampusList = validCampusList(campusList);
            locnTemp.currentCampus = locnTemp.currentCampusList.at(0) || {};
            locnTemp.campus_id = locnTemp.currentCampus?.campus_id;

            locnTemp.currentCampusLibraries = validLibraryList(locnTemp?.currentCampus?.libraries || []);
            locnTemp.currentLibrary = locnTemp.currentCampusLibraries?.at(0) || {};
            locnTemp.library_id = locnTemp.currentLibrary?.library_id;

            locnTemp.currentLibraryFloors = locnTemp.currentLibrary?.floors || [];
            locnTemp.currentFloor = locnTemp.currentLibraryFloors?.at(0) || {};
            locnTemp.floor_id = locnTemp.currentFloor?.floor_id;
            console.log('setLocation 1');
            setLocation({
                ...location,
                ...locnTemp,
            });

            const newValues = {
                ...formValues,
                ['campus_id']: locnTemp.campus_id,
                ['library_id']: locnTemp.library_id,
                ['floor_id']: locnTemp.floor_id,
                ['library_springshare_id']: locnTemp.currentLibrary.library_springshare_id,
            };
            setFormValues(newValues);

            console.log('@@@ springshareList=', springshareList);
            setSpringshareOption({
                id: locnTemp.currentLibrary.library_springshare_id, // preset the springshare id
                display_name: springshareList.find(s => s.id === locnTemp.currentLibrary.library_springshare_id)
                    ?.display_name,
            });
        }
    }, [campusList, campusListError, campusListLoading, formValues]);

    useEffect(() => {
        // showSavingProgress(false);
        setConfirmationOpen(
            !bookableSpacesRoomAdding && (!!bookableSpacesRoomAddError || !!bookableSpacesRoomAddResult),
        );
    }, [bookableSpacesRoomAdding, bookableSpacesRoomAddError, bookableSpacesRoomAddResult]);

    const handleSpringshareSelection = (event, newValue) => {
        console.log('handleSpringshareSelection newValue', newValue);
        console.log('handleSpringshareSelection e', event);
        let newSpringshare = { id: -1, display_name: noSpringshareHoursLabel };
        if (!!newValue?.id && !!newValue.display_name) {
            newSpringshare = newValue;
        } else if (!!newValue?.id) {
            const newValueId = newValue?.id;
            newSpringshare = {
                id: newValueId,
                display_name: springshareList?.find(s => s.id === newValueId)?.display_name || noSpringshareHoursLabel,
            };
        }
        console.log('newSpringshare', newSpringshare);
        setSpringshareOption(newSpringshare);

        setFormValues({
            ...formValues,
            ['space_opening_hours_id']: newSpringshare.id,
        });
    };

    // validate fields value
    const formValid = valuesToSend => {
        const errorMessages = [];
        if (!valuesToSend.space_name) {
            errorMessages.push({ field: 'space_name', message: 'A Name is required.' });
        }
        if (!valuesToSend.space_type) {
            errorMessages.push({ field: 'space_type', message: 'A Type is required.' });
        }
        if (!valuesToSend.space_floor_id) {
            errorMessages.push({ field: 'space_floor_id', message: 'A location is required.' });
        }
        if (!!valuesToSend.space_photo_url && !valuesToSend.space_photo_description) {
            // if a photo is supplied then it must have an accessible description; the photo itself is not required
            errorMessages.push({
                field: 'space_photo_description',
                message: 'When a photo is supplied, a description must be supplied.',
            });
        }
        if (!!valuesToSend.space_photo_url && !isValidUrl(valuesToSend.space_photo_url)) {
            errorMessages.push({ field: 'space_photo_url', message: 'The photo is not valid.' });
        }
        if (!!valuesToSend.space_services_page && !isValidUrl(valuesToSend.space_services_page)) {
            errorMessages.push({
                field: 'space_services_page',
                message: 'Please supply a valid "About" page, or clear the field.',
            });
        }

        return errorMessages.length > 0 ? errorMessages : true;
    };

    const handleFieldCompletion = e => {
        console.log('handleFieldCompletion', e?.target, e);
        const validationResult = formValid(formValues);
        console.log('validationResult=', validationResult);
        if (validationResult !== true) {
            setErrorMessages(validationResult);
        }
    };

    const reportErrorMessage = fieldName => {
        return errorMessages?.find(m => m.field === fieldName)?.message;
    };

    // const reportCurrentLibraryAboutPage = location => {
    //     console.log('location?.currentCampusLibraries=', location?.currentCampusLibraries);
    //     console.log('location=', location);
    //     console.log('formValues=', formValues);
    //     return location?.currentLibrary?.library_about_page_default ? (
    //         <a href="{location?.currentLibrary?.library_about_page_default}">
    //             {location?.currentLibrary?.library_about_page_default}
    //         </a>
    //     ) : (
    //         'none'
    //     );
    // };

    const handleChange = prop => e => {
        const theNewValue =
            e.target.hasOwnProperty('checked') && e.target.type !== 'radio' ? e.target.checked : e.target.value;
        console.log('handleChange', prop, theNewValue);

        const updatedLocation = {};
        if (prop === 'campus_id') {
            updatedLocation.currentCampusList = validCampusList(campusList);
            updatedLocation.currentCampus = !!formValues.campus_id
                ? updatedLocation.currentCampusList?.find(c => c.campus_id === theNewValue)
                : {};
            updatedLocation.campus_id = updatedLocation.currentCampus?.campus_id;

            updatedLocation.currentCampusLibraries = validLibraryList(updatedLocation?.currentCampus?.libraries);
            updatedLocation.currentLibrary = updatedLocation.currentCampusLibraries?.at(0);
            updatedLocation.library_id = updatedLocation.currentLibrary?.library_id;

            updatedLocation.currentLibraryFloors = updatedLocation.currentLibrary?.floors;
            updatedLocation.currentFloor = updatedLocation.currentLibraryFloors?.at(0);
            updatedLocation.floor_id = updatedLocation.currentFloor?.floor_id;
            console.log('setLocation 2');
            setLocation({
                ...location,
                ...updatedLocation,
            });
            const librarySpringshareId = updatedLocation?.currentLibrary?.library_springshare_id || -1;
            setSpringshareOption({
                id: librarySpringshareId,
                display_name:
                    springshareList?.find(s => s.id === librarySpringshareId)?.display_name || noSpringshareHoursLabel,
            });
        } else if (prop === 'library_id') {
            updatedLocation.currentCampusList = validCampusList(campusList);
            updatedLocation.currentCampus = !!formValues.campus_id
                ? updatedLocation.currentCampusList?.find(c => c.campus_id === formValues.campus_id)
                : {};
            updatedLocation.campus_id = updatedLocation.currentCampus?.campus_id;

            updatedLocation.currentCampusLibraries = validLibraryList(updatedLocation?.currentCampus?.libraries || []);
            updatedLocation.currentLibrary = updatedLocation.currentCampusLibraries?.find(
                l => l.library_id === theNewValue,
            );
            updatedLocation.library_id = updatedLocation.currentLibrary?.library_id;

            updatedLocation.currentLibraryFloors = updatedLocation.currentLibrary?.floors;
            updatedLocation.currentFloor = updatedLocation.currentLibraryFloors?.at(0);
            updatedLocation.floor_id = updatedLocation.currentFloor?.floor_id;
            console.log('setLocation 3');
            setLocation({
                ...location,
                ...updatedLocation,
            });
            setSpringshareOption({
                id: updatedLocation.currentLibrary.library_springshare_id,
                display_name: springshareList.find(s => s.id === updatedLocation.currentLibrary.library_springshare_id)
                    ?.display_name,
            });
        } else if (prop === 'space_photo_url') {
            const photoDescriptionField = document.getElementById('space_photo_description');
            const photoDescriptionFieldLabel = document.getElementById('space_photo_description-label');
            let newRequiredValue = false;
            if (theNewValue !== '' && theNewValue.length > 0) {
                // a url has been entered - the description should be required
                newRequiredValue = true;

                !!photoDescriptionFieldLabel &&
                    (photoDescriptionFieldLabel.textContent = basePhotoDescriptionFieldLabel + ' *');
            } else {
                !!photoDescriptionFieldLabel &&
                    (photoDescriptionFieldLabel.textContent = basePhotoDescriptionFieldLabel);
            }
            !!photoDescriptionField && photoDescriptionField.setAttribute('required', newRequiredValue);
        }

        const newLocation = {};
        if (!!updatedLocation?.campus_id) {
            newLocation.campus_id = updatedLocation?.campus_id;
        }
        if (!!updatedLocation?.library_id) {
            newLocation.library_id = updatedLocation?.library_id;
        }
        if (!!updatedLocation?.floor_id) {
            newLocation.floor_id = updatedLocation?.floor_id;
        }
        const newValues = {
            ...formValues,
            ...newLocation,
            [prop]: theNewValue,
        };

        console.log('handleChange newValues=', newValues);
        setFormValues(newValues);
    };

    function navigateToPage(spacesPath) {
        window.location.href = spacesAdminLink(spacesPath, account);
    }

    const createNewSpace = () => {
        console.log('createNewSpace formValues=', formValues);

        // showSavingProgress(true);

        const valuesToSend = {};
        valuesToSend.space_floor_id = formValues.floor_id;
        valuesToSend.space_name = formValues.space_name;
        valuesToSend.space_precise = formValues.space_precise;
        valuesToSend.space_description = formValues.space_description;
        valuesToSend.space_photo_url = formValues.space_photo_url;
        valuesToSend.space_photo_description = formValues.space_photo_description;
        valuesToSend.space_type = formValues.space_type;
        valuesToSend.space_opening_hours_id = formValues.space_opening_hours_id;
        valuesToSend.space_services_page = formValues.space_services_page;
        valuesToSend.space_opening_hours_override = formValues.space_opening_hours_override;
        valuesToSend.space_latitude = formValues.space_latitude;
        valuesToSend.space_longitude = formValues.space_longitude;

        const validationResult = formValid(valuesToSend);
        console.log('validationResult=', validationResult);
        if (validationResult !== true) {
            setErrorMessages(validationResult);

            document.activeElement.blur();
            const message = `<p data-count="${
                validationResult.length
            }">These errors occurred:</p><ul>${validationResult.map(m => `<li>${m.message}</li>`).join('')}</ul>`;
            displayToastMessage(message, true);
            return;
        }

        const cypressTestCookie = cookies.hasOwnProperty('CYPRESS_TEST_DATA') ? cookies.CYPRESS_TEST_DATA : null;
        if (!!cypressTestCookie && window.location.host === 'localhost:2020' && cypressTestCookie === 'active') {
            setCookie('CYPRESS_DATA_SAVED', valuesToSend);
        }

        console.log('createNewSpace valuesToSend=', valuesToSend);
        actions
            .addBookableSpaceLocation(valuesToSend, 'space')
            .then(() => {})
            .catch(e => {
                console.log('catch: adding new space failed:', e);
            });
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

    console.log('@@@@ location=', location);
    console.log('@@@@ formValues?.campus_id=', formValues?.campus_id);

    const spaceTypeList = React.useMemo(() => {
        if (
            bookableSpacesRoomListLoading === false &&
            bookableSpacesRoomListError === false &&
            bookableSpacesRoomList?.data?.locations &&
            Array.isArray(bookableSpacesRoomList.data.locations)
        ) {
            return bookableSpacesRoomList.data.locations
                .map(location => location.space_type)
                .filter(
                    (spaceType, index, array) =>
                        spaceType && // Remove null/undefined values
                        spaceType.trim() !== '' && // Remove empty strings
                        array.indexOf(spaceType) === index, // Remove duplicates
                )
                .sort(); // Sort alphabetically for better UX
        }
        return [];
    }, [bookableSpacesRoomListLoading, bookableSpacesRoomListError, bookableSpacesRoomList]);

    const reportCurrentLibraryAboutPage = location => (
        <>
            {location?.currentLibrary?.library_about_page_default ? (
                <a
                    target="_blank"
                    href={location?.currentLibrary?.library_about_page_default}
                    data-testid="add-space-about-page"
                >
                    {location?.currentLibrary?.library_about_page_default}
                </a>
            ) : (
                <span data-testid="add-space-about-page">none</span>
            )}
        </>
    );

    // if (!!savingProgressShown) {
    //     return <InlineLoader message="Saving" />;
    // } else
    if (!!campusListLoading || !formValues?.campus_id) {
        return (
            <Grid container>
                <Grid item xs={12}>
                    <InlineLoader message="Loading" />
                </Grid>
            </Grid>
        );
    } else if (!!campusListError || !!bookableSpacesRoomListError) {
        return (
            <AddSpacePage>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <div data-testid="add-space-error">
                            <p>Something went wrong - please try again later.</p>
                            {!!campusListError && <p>Locations currently unavailable</p>}
                            {!!bookableSpacesRoomListError && <p>Space types currently unavailable</p>}
                        </div>
                    </Grid>
                </Grid>
            </AddSpacePage>
        );
    } else if (
        !location.currentCampusList ||
        location.currentCampusList.length === 0 ||
        (bookableSpacesRoomListLoading === false &&
            bookableSpacesRoomListError === false &&
            !bookableSpacesRoomList?.data?.locations)
    ) {
        return (
            <AddSpacePage>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <p data-testid="add-space-no-locations">
                            No Libraries currently in system - please{' '}
                            <a href={spacesAdminLink('/manage/locations', account)}>create campus locations</a> and then
                            try again.
                        </p>
                    </Grid>
                </Grid>
            </AddSpacePage>
        );
    } else {
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

                <AddSpacePage>
                    <form id="spaces-addedit-form">
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Typography component={'h3'} variant={'h6'}>
                                    About
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl variant="standard" fullWidth>
                                    <InputLabel htmlFor="space_name">Space name *</InputLabel>
                                    <Input
                                        id="space_name"
                                        data-testid="space-name"
                                        required
                                        value={formValues?.space_name || ''}
                                        onChange={handleChange('space_name')}
                                        onBlur={handleFieldCompletion}
                                    />
                                    <StyledErrorMessageTypography component={'div'}>
                                        {reportErrorMessage('space_name')}
                                    </StyledErrorMessageTypography>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="space_type"
                                    data-testid="space-type"
                                    label="Space type"
                                    variant="standard"
                                    fullWidth
                                    required
                                    value={formValues?.space_type || ''}
                                    onChange={handleChange('space_type')}
                                    inputProps={{
                                        list: 'space-type-list',
                                    }}
                                    onBlur={handleFieldCompletion}
                                />
                                <StyledErrorMessageTypography component={'div'}>
                                    {reportErrorMessage('space_type')}
                                </StyledErrorMessageTypography>
                                {spaceTypeList && spaceTypeList.length > 0 && (
                                    <datalist id="space-type-list">
                                        {spaceTypeList.map((spaceType, index) => (
                                            <option key={`spacetype-datalist-${index}`} value={spaceType} />
                                        ))}
                                    </datalist>
                                )}
                            </Grid>
                            <Grid item xs={12}>
                                {/* will upgrade this to ckeditor (or replacement) eventually*/}
                                <TextField
                                    id="space_description"
                                    label="Space description"
                                    variant="standard"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    value={formValues?.space_description || ''}
                                    onChange={handleChange('space_description')}
                                    inputProps={{
                                        'data-testid': 'add-space-description',
                                    }}
                                    onBlur={handleFieldCompletion}
                                />
                                <StyledErrorMessageTypography component={'div'}>
                                    {reportErrorMessage('space_description')}
                                </StyledErrorMessageTypography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography component={'p'}>
                                    The "About" page for this Library:{' '}
                                    <span>{reportCurrentLibraryAboutPage(location)}</span>
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl variant="standard" fullWidth>
                                    <InputLabel htmlFor="space_services_page">
                                        Use a different page for this Space:
                                    </InputLabel>
                                    <Input
                                        id="space_services_page"
                                        data-testid="space_services_page"
                                        value={formValues?.space_services_page || ''}
                                        onChange={handleChange('space_services_page')}
                                        onBlur={handleFieldCompletion}
                                    />
                                    <StyledErrorMessageTypography component={'div'}>
                                        {reportErrorMessage('space_services_page')}
                                    </StyledErrorMessageTypography>
                                </FormControl>
                            </Grid>
                            {/* <Grid item xs={6}>*/}
                            {/*    <FormControl variant="standard" fullWidth>*/}
                            {/*        <InputLabel htmlFor="space_latitude">*/}
                            {/*            Latitude (to be replaced with map picker)*/}
                            {/*        </InputLabel>*/}
                            {/*        <Input*/}
                            {/*            id="space_latitude"*/}
                            {/*            data-testid="space_latitude"*/}
                            {/*            value={formValues?.space_latitude || ''}*/}
                            {/*            onChange={handleChange('space_latitude')}*/}
                            {/*            onBlur={handleFieldCompletion}*/}
                            {/*        />*/}
                            {/*        <StyledErrorMessageTypography component={'div'}>{reportErrorMessage('space_latitude')}</StyledErrorMessageTypography>*/}
                            {/*    </FormControl>*/}
                            {/* </Grid>*/}
                            {/* <Grid item xs={6}>*/}
                            {/*    <FormControl variant="standard" fullWidth>*/}
                            {/*        <InputLabel htmlFor="space_longitude">Longitude</InputLabel>*/}
                            {/*        <Input*/}
                            {/*            id="space_longitude"*/}
                            {/*            data-testid="space_longitude"*/}
                            {/*            value={formValues?.space_longitude || ''}*/}
                            {/*            onChange={handleChange('space_longitude')}*/}
                            {/*            onBlur={handleFieldCompletion}*/}
                            {/*        />*/}
                            {/*        <StyledErrorMessageTypography component={'div'}>{reportErrorMessage('space_longitude')}</StyledErrorMessageTypography>*/}
                            {/*    </FormControl>*/}
                            {/* </Grid>*/}
                            <Grid item xs={12}>
                                <Typography component={'h3'} variant={'h6'}>
                                    Location
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <FormControl variant="standard" fullWidth>
                                    <InputLabel id="add-space-select-campus-label">Campus *</InputLabel>
                                    <Select
                                        labelId="add-space-select-campus-label"
                                        id="add-space-select-campus"
                                        data-testid="add-space-select-campus"
                                        value={formValues?.campus_id} //  || 1
                                        label="Campus"
                                        onChange={handleChange('campus_id')}
                                        required
                                        // onBlur={handleFieldCompletion}
                                    >
                                        {!!location.currentCampusList &&
                                            location.currentCampusList.length > 0 &&
                                            location.currentCampusList.map((campus, index) => (
                                                <MenuItem value={campus.campus_id} key={`select-campus-${index}`}>
                                                    {campus.campus_name}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                    {/* <StyledErrorMessageTypography component={'div'}>{reportErrorMessage('??')}</StyledErrorMessageTypography>*/}
                                </FormControl>
                            </Grid>
                            <Grid item xs={4}>
                                <FormControl variant="standard" fullWidth>
                                    <InputLabel id="add-space-select-library-label">Library *</InputLabel>
                                    <Select
                                        labelId="add-space-select-library-label"
                                        id="add-space-select-library"
                                        data-testid="add-space-select-library"
                                        value={formValues?.library_id}
                                        label="Library"
                                        onChange={handleChange('library_id')}
                                        required
                                        // onBlur={handleFieldCompletion}
                                    >
                                        {!!location.currentCampusLibraries &&
                                            location.currentCampusLibraries.length > 0 &&
                                            location.currentCampusLibraries.map((library, index) => (
                                                <MenuItem value={library.library_id} key={`select-library-${index}`}>
                                                    {library.library_name || library.building_name}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                    {/* <StyledErrorMessageTypography component={'div'}>{reportErrorMessage('??')}</StyledErrorMessageTypography>*/}
                                </FormControl>
                            </Grid>
                            <Grid item xs={4}>
                                <FormControl variant="standard" fullWidth>
                                    <InputLabel id="add-space-select-floor-label">Floor *</InputLabel>
                                    <Select
                                        labelId="add-space-select-floor-label"
                                        id="add-space-select-floor"
                                        data-testid="add-space-select-floor"
                                        value={formValues?.floor_id}
                                        label="Floor"
                                        onChange={handleChange('floor_id')}
                                        required
                                    >
                                        {!!location.currentLibraryFloors &&
                                            location.currentLibraryFloors?.length > 0 &&
                                            location.currentLibraryFloors?.map((floor, index) => {
                                                const libraryName =
                                                    location.currentLibrary.library_name ||
                                                    location.currentLibrary.building_name;
                                                return (
                                                    <MenuItem value={floor.floor_id} key={`select-floor-${index}`}>
                                                        {floor.floor_name}{' '}
                                                        {location.currentLibrary.ground_floor_id === floor.floor_id
                                                            ? ' (Ground floor)'
                                                            : ''}
                                                        {`${
                                                            window.location.host === 'localhost:2020' // to make the Select more readable to we poor devs, also makes more accurate test
                                                                ? ' [' + libraryName + ' - ' + floor.floor_id + ']'
                                                                : ''
                                                        }`}
                                                    </MenuItem>
                                                );
                                            })}
                                    </Select>
                                    {/* <StyledErrorMessageTypography component={'div'}>{reportErrorMessage('??')}</StyledErrorMessageTypography>*/}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl variant="standard" fullWidth>
                                    <InputLabel htmlFor="space_precise">
                                        Description of Space placement within the Library
                                    </InputLabel>
                                    <Input
                                        id="space_precise"
                                        data-testid="add-space-precise-location"
                                        value={formValues?.space_precise || ''}
                                        onChange={handleChange('space_precise')}
                                        onBlur={handleFieldCompletion}
                                    />
                                    <StyledErrorMessageTypography component={'div'}>
                                        {reportErrorMessage('space_precise')}
                                    </StyledErrorMessageTypography>
                                </FormControl>
                                <div data-testid="add-space-pretty-location">
                                    <Typography component={'h4'} variant={'h6'}>
                                        "Pretty" location
                                    </Typography>
                                    {getFriendlyLocationDescription({
                                        space_is_ground_floor:
                                            location?.currentFloor?.floor_id ===
                                            location?.currentLibrary?.ground_floor_id,
                                        space_floor_name: location?.currentFloor?.floor_name,
                                        space_precise: formValues?.space_precise,
                                        space_library_name: location?.currentLibrary?.library_name,
                                        space_building_name: location?.currentLibrary?.building_name,
                                        space_building_number: location?.currentLibrary?.building_number,
                                        space_campus_name: location?.currentCampus?.campus_name,
                                    })}
                                </div>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography component={'h3'} variant={'h6'}>
                                    Opening hours
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Autocomplete
                                    data-testid="add-space-springshare-id"
                                    options={springshareList}
                                    value={selectedSpringshareOption}
                                    onChange={handleSpringshareSelection}
                                    getOptionLabel={option => option?.display_name || noSpringshareHoursLabel}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    renderInput={params => (
                                        <TextField
                                            {...params}
                                            label="Choose the Springshare Library to use for Opening hours"
                                            placeholder="Choose a Library..."
                                            variant="outlined"
                                            InputProps={{
                                                ...params.InputProps,
                                                'data-testid': 'add-space-springshare-search-input-field',
                                            }}
                                            inputProps={{
                                                ...params.inputProps,
                                                'data-testid': 'add-space-springshare-id-autocomplete-input-wrapper',
                                                'aria-label': 'Search for a Library',
                                            }}
                                        />
                                    )}
                                    // onBlur={handleFieldCompletion}
                                />
                                <StyledErrorMessageTypography component={'div'}>
                                    {reportErrorMessage('space_opening_hours_id')}
                                </StyledErrorMessageTypography>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl variant="standard" fullWidth>
                                    <InputLabel htmlFor="space_opening_hours_override">
                                        An extra line about opening hours, specific to this Space
                                    </InputLabel>
                                    <Input
                                        id="space_opening_hours_override"
                                        data-testid="space-opening-hours-override"
                                        value={formValues?.space_opening_hours_override || ''}
                                        onChange={handleChange('space_opening_hours_override')}
                                        onBlur={handleFieldCompletion}
                                    />
                                    <StyledErrorMessageTypography component={'div'}>
                                        {reportErrorMessage('space_opening_hours_override')}
                                    </StyledErrorMessageTypography>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography component={'h3'} variant={'h6'}>
                                    Imagery
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl variant="standard" fullWidth>
                                    <InputLabel htmlFor="space_photo_url">
                                        Image url (this will eventually be drag and drop)
                                    </InputLabel>
                                    <Input
                                        id="space_photo_url"
                                        data-testid="space-photo-url"
                                        value={formValues?.space_photo_url || ''}
                                        onChange={handleChange('space_photo_url')}
                                        onBlur={handleFieldCompletion}
                                    />
                                    <StyledErrorMessageTypography component={'div'}>
                                        {reportErrorMessage('space_photo_url')}
                                    </StyledErrorMessageTypography>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                {/* this WONT be upgraded to CK, because it should just be plain text! */}
                                <TextField
                                    id="space_photo_description"
                                    label={basePhotoDescriptionFieldLabel}
                                    variant="standard"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    value={formValues?.space_photo_description || ''}
                                    onChange={handleChange('space_photo_description')}
                                    inputProps={{
                                        'data-testid': 'add-space-photo-description',
                                    }}
                                    onBlur={handleFieldCompletion}
                                />
                                <StyledErrorMessageTypography component={'div'}>
                                    {reportErrorMessage('space_photo_description')}
                                </StyledErrorMessageTypography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography component={'p'} variant={'p'} sx={{ textAlign: 'right' }}>
                                    Required fields are marked with a *
                                </Typography>
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
                                    onClick={createNewSpace}
                                />
                            </Grid>
                        </Grid>
                    </form>
                </AddSpacePage>
            </>
        );
    }
};

AddSpacePage.propTypes = {
    children: PropTypes.node,
};

BookableSpacesAddSpace.propTypes = {
    actions: PropTypes.any,
    bookableSpacesRoomAdding: PropTypes.any,
    bookableSpacesRoomAddError: PropTypes.any,
    bookableSpacesRoomAddResult: PropTypes.any,
    campusList: PropTypes.any,
    campusListLoading: PropTypes.any,
    campusListError: PropTypes.any,
    bookableSpacesRoomList: PropTypes.any,
    bookableSpacesRoomListLoading: PropTypes.any,
    bookableSpacesRoomListError: PropTypes.any,
    weeklyHours: PropTypes.any,
    weeklyHoursLoading: PropTypes.any,
    weeklyHoursError: PropTypes.any,
};

export default React.memo(BookableSpacesAddSpace);
