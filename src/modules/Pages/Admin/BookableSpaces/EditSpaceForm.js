import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Checkbox from '@mui/material/Checkbox';
import { Grid } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { useAccountContext } from 'context';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { isValidUrl, standardText, StyledPrimaryButton, StyledSecondaryButton } from 'helpers/general';

import { displayToastErrorMessage, spacesAdminLink, validLibraryList } from './bookableSpacesAdminHelpers';
import { getFlatFacilityTypeList, getFriendlyLocationDescription } from 'modules/Pages/BookableSpaces/spacesHelpers';
import { ImageUploadDropzone } from './ImageUploadDropzone';

const StyledErrorMessageTypography = styled(Typography)(({ theme }) => ({
    ...standardText(theme),
    color: theme.palette.error.light,
    marginTop: 4,
}));

const StyledFilterWrapper = styled('div')(() => ({
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
}));

const StyledFacilityGroupCheckboxBlock = styled('div')(() => ({
    '& h5': {
        fontWeight: 300,
        fontSize: '1.1rem',
        marginLeft: '0.6rem',
    },
    '& ul': {
        paddingLeft: 0,
        marginRight: '0.5rem',
        marginTop: 0,
    },
    '& li': {
        listStyle: 'none',
        paddingLeft: 0,
        '& label': {
            width: '200px',
            whiteSpace: 'normal',
            overflow: 'auto',
            textOverflow: 'iniital',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            paddingTop: '9px', // 9px: top align checkbox and label, allowing for checkbox hover affect
            transition: 'color 0.2s ease',
            '&:hover': {
                cursor: 'pointer',
                color: 'rgba(0, 0, 0, 1)',
            },
            '& > span:first-child': {
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                marginTop: '-9px', // 9px: top align checkbox and label, allowing for checkbox hover affect
            },
            '& input[type="checkbox"]': {
                margin: 0,
            },
        },
    },
}));
const StyledSpringshareHouseFormControl = styled(FormControl)(() => ({
    border: '1px solid rgba(38, 85, 115, 0.15)',
    borderRadius: '4px',
    padding: '10px',
    '& label': {
        padding: '10px',
    },
    '&.asLoaded': {
        borderColor: 'blue',
        borderWidth: '2px',
    },
}));

export const EditSpaceForm = ({
    actions,
    bookableSpacesRoomAdding,
    bookableSpacesRoomAddError,
    bookableSpacesRoomAddResult,
    currentCampusList,
    bookableSpacesRoomList,
    bookableSpacesRoomListLoading,
    bookableSpacesRoomListError,
    facilityTypeList,
    facilityTypeListLoading,
    facilityTypeListError,
    formValues,
    setFormValues,
    saveToDb,
    PageWrapper,
    springshareList,
    bookableSpacesRoomUpdating,
    bookableSpacesRoomUpdateError,
    bookableSpacesRoomUpdateResult,
    mode,
}) => {
    console.log(
        'TOP EditSpaceForm bookableSpacesRoomAddResult',
        bookableSpacesRoomAdding,
        bookableSpacesRoomAddError,
        bookableSpacesRoomAddResult,
    );
    console.log(
        'TOP EditSpaceForm bookableSpacesRoomUpdateResult',
        bookableSpacesRoomUpdating,
        bookableSpacesRoomUpdateError,
        bookableSpacesRoomUpdateResult,
    );
    console.log('TOP EditSpaceForm currentCampusList', currentCampusList);
    console.log('TOP EditSpaceForm formValues', Object.keys(formValues).length, formValues);
    console.log(
        'TOP EditSpaceForm bookableSpacesRoomList',
        bookableSpacesRoomListLoading,
        bookableSpacesRoomListError,
        bookableSpacesRoomList,
    );
    console.log('TOP EditSpaceForm facilityTypeList', facilityTypeListLoading, facilityTypeListError, facilityTypeList);
    console.log('TOP EditSpaceForm mode', mode);
    console.log('TOP EditSpaceForm springshareList', springshareList);

    const { account } = useAccountContext();
    // const [cookies, setCookie] = useCookies();

    const [location, setLocation1] = useState({});
    const setLocation = newValues => {
        console.log('setLocation', newValues);
        setLocation1(newValues);
    };

    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [errorMessages, setErrorMessages2] = useState([]);
    const setErrorMessages = m => {
        setErrorMessages2(m);
    };

    const basePhotoDescriptionFieldLabel = 'Description of photo to assist people using screen readers';

    // useEffect(() => {
    //     const currentSpringshare =
    //         (!!springshareList &&
    //             springshareList.length > 0 &&
    //             springshareList?.find(s => s?.id === formValues.space_opening_hours_id)) ||
    //         null;
    //     console.log('currentSpringshare=', currentSpringshare);
    // }, [springshareList]);

    useEffect(() => {
        // showSavingProgress(false);
        setConfirmationOpen(
            !bookableSpacesRoomAdding && (!!bookableSpacesRoomAddError || !!bookableSpacesRoomAddResult),
        );
    }, [bookableSpacesRoomAdding, bookableSpacesRoomAddError, bookableSpacesRoomAddResult]);

    useEffect(() => {
        // showSavingProgress(false);
        setConfirmationOpen(
            !bookableSpacesRoomUpdating && (!!bookableSpacesRoomUpdateError || !!bookableSpacesRoomUpdateResult),
        );
    }, [bookableSpacesRoomUpdating, bookableSpacesRoomUpdateError, bookableSpacesRoomUpdateResult]);

    // validate fields value
    const formValid = valuesToSend => {
        const errorMessages = [];
        if (!valuesToSend?.space_name) {
            errorMessages.push({ field: 'space_name', message: 'A Name is required.' });
        }
        if (!valuesToSend?.space_type) {
            errorMessages.push({ field: 'space_type', message: 'A Type is required.' });
        }
        if (!valuesToSend?.space_floor_id) {
            errorMessages.push({ field: 'space_floor_id', message: 'A location is required.' });
        }
        if (!!valuesToSend?.space_photo_url && !valuesToSend?.space_photo_description) {
            // if a photo is supplied then it must have an accessible description; the photo itself is not required
            errorMessages.push({
                field: 'space_photo_description',
                message: 'When a photo is supplied, a description must be supplied.',
            });
        }
        if (!!valuesToSend?.space_photo_url && !isValidUrl(valuesToSend?.space_photo_url)) {
            errorMessages.push({ field: 'space_photo_url', message: 'The photo is not valid.' });
        }
        if (!!valuesToSend?.space_services_page && !isValidUrl(valuesToSend?.space_services_page)) {
            errorMessages.push({
                field: 'space_services_page',
                message: 'Please supply a valid "About" page, or clear the field.',
            });
        }

        return errorMessages?.length > 0 ? errorMessages : true;
    };

    const handleFieldCompletion = e => {
        // clear what they entered in the new space type field - its already in the dropdown and selected there
        if (e.target.id === 'add-space-type-new') {
            e.target.value = '';
        }

        const validationResult = formValid(formValues);
        if (validationResult !== true) {
            setErrorMessages(validationResult);
        }
    };

    const reportErrorMessage = fieldName => {
        return errorMessages?.find(m => m?.field === fieldName)?.message;
    };

    const handleChange = _prop => e => {
        let theNewValue =
            e?.target?.hasOwnProperty('checked') && e?.target?.type !== 'radio' ? e?.target?.checked : e?.target?.value;

        const updatedLocation = {};
        let prop = _prop;
        if (_prop === 'facility_type_id') {
            prop = 'facility_types';
            const clickedFacilityTypeId = parseInt(e?.target?.id?.replace('filtertype-', ''), 10);
            const newCheckboxAdded = theNewValue;
            if (newCheckboxAdded) {
                // it doesn't exist and we must add it
                theNewValue = [
                    ...(formValues?.facility_types || []),
                    {
                        facility_type_id: clickedFacilityTypeId,
                        facility_type_name: getFlatFacilityTypeList(facilityTypeList)?.find(
                            f => f?.facility_type_id === clickedFacilityTypeId,
                        )?.facility_type_name,
                    },
                ];
            } else {
                // it must exist and we are removing it
                theNewValue = formValues?.facility_types?.filter(f => f?.facility_type_id !== clickedFacilityTypeId);
            }
        } else if (prop === 'space_type_new') {
            // update the form value for the Select, not the text field (which is cleared in the form completion
            prop = 'space_type';
        } else if (prop === 'space_opening_hours_id') {
            const springshareElement = document.querySelector('.asLoaded');
            !!springshareElement &&
                !!springshareElement.classList.contains('asLoaded') &&
                springshareElement.classList.remove('asLoaded');
        } else if (_prop === 'campus_id') {
            updatedLocation.currentCampus =
                !!formValues?.campus_id && !!currentCampusList && currentCampusList.length > 0
                    ? currentCampusList?.find(c => c?.campus_id === theNewValue)
                    : {};
            updatedLocation.campus_id = updatedLocation?.currentCampus?.campus_id;

            updatedLocation.currentCampusLibraries = validLibraryList(updatedLocation?.currentCampus?.libraries);
            updatedLocation.currentLibrary = updatedLocation?.currentCampusLibraries?.at(0);
            updatedLocation.library_id = updatedLocation?.currentLibrary?.library_id;

            updatedLocation.currentLibraryFloors = updatedLocation?.currentLibrary?.floors;
            updatedLocation.currentFloor = updatedLocation?.currentLibraryFloors?.at(0);
            updatedLocation.floor_id = updatedLocation?.currentFloor?.floor_id;
            setLocation({
                ...location,
                ...updatedLocation,
            });
            const springshareElement = document.querySelector('.asLoaded');
            !!springshareElement &&
                !springshareElement.classList.contains('asLoaded') &&
                springshareElement.classList.add('asLoaded');
        } else if (_prop === 'library_id') {
            updatedLocation.currentCampus =
                !!formValues?.campus_id && !!currentCampusList && currentCampusList.length > 0
                    ? currentCampusList?.find(c => c?.campus_id === formValues?.campus_id)
                    : {};
            updatedLocation.campus_id = updatedLocation?.currentCampus?.campus_id;

            updatedLocation.currentCampusLibraries = validLibraryList(updatedLocation?.currentCampus?.libraries || []);
            updatedLocation.currentLibrary = updatedLocation?.currentCampusLibraries?.find(
                l => l?.library_id === theNewValue,
            );
            updatedLocation.library_id = updatedLocation?.currentLibrary?.library_id;

            updatedLocation.currentLibraryFloors = updatedLocation?.currentLibrary?.floors;
            updatedLocation.currentFloor = updatedLocation?.currentLibraryFloors?.at(0);
            updatedLocation.floor_id = updatedLocation?.currentFloor?.floor_id;
            setLocation({
                ...location,
                ...updatedLocation,
            });
            const springshareElement = document.querySelector('.asLoaded');
            !!springshareElement &&
                !springshareElement.classList.contains('asLoaded') &&
                springshareElement.classList.add('asLoaded');
        } else if (_prop === 'space_photo_url') {
            const photoDescriptionField = document.getElementById('space_photo_description');
            const photoDescriptionFieldLabel = document.getElementById('space_photo_description-label');
            let newRequiredValue = false;
            if (theNewValue !== '' && theNewValue?.length > 0) {
                // a url has been entered - the description should be required
                newRequiredValue = true;

                !!photoDescriptionFieldLabel &&
                    (photoDescriptionFieldLabel.textContent = basePhotoDescriptionFieldLabel + ' *');
            } else {
                !!photoDescriptionFieldLabel &&
                    (photoDescriptionFieldLabel.textContent = basePhotoDescriptionFieldLabel);
            }
            !!photoDescriptionField && photoDescriptionField?.setAttribute('required', newRequiredValue);
        }

        const newLocation = {};
        if (!!updatedLocation?.campus_id) {
            newLocation.campus_id = updatedLocation?.campus_id;
        }
        if (!!updatedLocation?.library_id) {
            newLocation.library_id = updatedLocation?.library_id;
            newLocation.space_opening_hours_id = updatedLocation?.currentLibrary?.library_springshare_id || -1;
        }
        if (!!updatedLocation?.floor_id) {
            newLocation.floor_id = updatedLocation?.floor_id;
        }
        const newValues = {
            ...formValues,
            ...newLocation,
            [prop]: theNewValue,
        };

        setFormValues(newValues);
    };

    function navigateToPage(spacesPath) {
        // reload spaces to get new one
        actions.loadAllBookableSpacesRooms().then(() => {
            window.location.href = spacesAdminLink(spacesPath, account);
        });
    }

    function closeConfirmationBox() {
        console.log('closeConfirmationBox');
        setConfirmationOpen(false);
    }
    const returnToDashboard = () => {
        console.log('returnToDashboard');
        navigateToPage('/admin/spaces');
    };
    const clearForm = () => {
        console.log('clearForm');
        window.location.reload(false);
    };
    const reEditRecord = () => {
        console.log('reEditRecord');
        clearForm();
        navigateToPage(window.location.href);
    };

    const spaceTypeList = React.useMemo(() => {
        if (
            bookableSpacesRoomListLoading === false &&
            bookableSpacesRoomListError === false &&
            bookableSpacesRoomList?.data?.locations &&
            Array.isArray(bookableSpacesRoomList?.data?.locations) &&
            bookableSpacesRoomList?.data?.locations?.length > 0
        ) {
            const list = bookableSpacesRoomList?.data?.locations?.map(location => location?.space_type);
            !!formValues?.space_type && list.push(formValues?.space_type);
            const filteredList = list?.filter(
                (spaceType, index, array) =>
                    spaceType && // Remove null/undefined values
                    spaceType?.trim() !== '' && // Remove empty strings
                    array?.indexOf(spaceType) === index, // Remove duplicates
            );
            return filteredList?.sort(); // Sort alphabetically for better UX
        }
        return [];
    }, [bookableSpacesRoomListLoading, bookableSpacesRoomListError, bookableSpacesRoomList, formValues?.space_type]);

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

    // const getFacilityTypes = data => {
    //     const facilityTypes = [];
    //     data?.facility_type_groups?.forEach(group => {
    //         group?.facility_type_children?.forEach(facilityType => {
    //             facilityTypes.push({
    //                 facility_type_id: facilityType?.facility_type_id,
    //                 facility_type_name: `${group?.facility_type_group_name}: ${facilityType?.facility_type_name}`,
    //             });
    //         });
    //     });
    //     return facilityTypes;
    // };
    const showFilterCheckboxes = () => {
        if (facilityTypeList?.data?.facility_type_groups?.length === 0) {
            return <p>No filter types in system.</p>;
        }

        const facilityTypeGroups = facilityTypeList?.data?.facility_type_groups || [];
        const sortedUsedGroups = [...facilityTypeGroups]?.sort(
            (a, b) => a?.facility_type_group_order - b?.facility_type_group_order,
        );

        return (
            <>
                {sortedUsedGroups?.map(group => (
                    <StyledFacilityGroupCheckboxBlock key={group?.facility_type_group_id}>
                        <Typography component={'h5'} variant={'h6'}>
                            {group?.facility_type_group_name}
                        </Typography>
                        <ul data-testid="facility-type-checkbox-list">
                            {group?.facility_type_children && group?.facility_type_children?.length > 0 ? (
                                group?.facility_type_children?.map(facilityType => {
                                    const isChecked = () =>
                                        formValues?.facility_types?.find(
                                            ft => ft?.facility_type_id === facilityType?.facility_type_id,
                                        );
                                    return (
                                        <li
                                            key={`facility-type-listitem-${facilityType?.facility_type_id}`}
                                            data-testid={`facility-type-listitem-${facilityType?.facility_type_id}`}
                                        >
                                            <InputLabel title={facilityType?.facility_type_name}>
                                                <Checkbox
                                                    checked={!!isChecked()}
                                                    data-testid={`filtertype-${facilityType?.facility_type_id}`}
                                                    id={`filtertype-${facilityType?.facility_type_id}`}
                                                    onChange={handleChange('facility_type_id')}
                                                />
                                                {facilityType?.facility_type_name}
                                            </InputLabel>
                                        </li>
                                    );
                                })
                            ) : (
                                <li className="no-items">No facility types available</li>
                            )}
                        </ul>
                    </StyledFacilityGroupCheckboxBlock>
                ))}
            </>
        );
    };

    const handleSaveClick = () => {
        const valuesToSend = {};
        valuesToSend.space_name = formValues?.space_name;
        valuesToSend.space_type = formValues?.space_type;
        valuesToSend.space_floor_id = formValues?.floor_id;
        valuesToSend.space_precise = formValues?.space_precise;
        valuesToSend.space_description = formValues?.space_description;
        valuesToSend.space_photo_url = formValues?.space_photo_url;
        valuesToSend.space_photo_description = formValues?.space_photo_description;
        valuesToSend.space_opening_hours_id = formValues?.space_opening_hours_id;
        valuesToSend.space_services_page = formValues?.space_services_page;
        valuesToSend.space_opening_hours_override = formValues?.space_opening_hours_override;
        valuesToSend.space_latitude = formValues?.space_latitude;
        valuesToSend.space_longitude = formValues?.space_longitude;
        valuesToSend.facility_types = formValues?.facility_types?.map(ft => ft?.facility_type_id);
        valuesToSend.space_id = formValues?.space_id;
        console.log('handleSaveClick valuesToSend=', valuesToSend);

        const validationResult = formValid(valuesToSend);
        if (validationResult !== true) {
            console.log('handleSaveClick validation failed');
            setErrorMessages(validationResult);

            document.activeElement.blur();
            const message =
                `<p data-count="${validationResult?.length}">These errors occurred:</p>` +
                `<ul>${validationResult?.map(m => `<li>${m?.message}</li>`)?.join('')}</ul>`;
            displayToastErrorMessage(message);
        } else {
            console.log('handleSaveClick validation passed');
            saveToDb(valuesToSend);
        }
    };

    const locale = {
        success: {
            confirmationTitle: mode === 'add' ? 'A Space has been added' : 'The Space has been updated',
            confirmationMessage: '',
            confirmButtonLabel: 'Return to dashboard',
            cancelButtonLabel: mode === 'add' ? 'Add another Space' : 'Edit record again',
        },
        error: {
            confirmationTitle: mode === 'add' ? bookableSpacesRoomAddError : bookableSpacesRoomUpdateError,
            confirmationMessage: '',
            confirmButtonLabel: 'Return to dashboard',
            cancelButtonLabel: mode === 'add' ? 'Add another Space' : 'Edit record again',
            alternateActionButtonLabel: 'Close',
        },
    };

    useEffect(() => {
        console.log('currentCampusList', currentCampusList);
        console.log('formValues', formValues);
        console.log('formValues.campus_id', formValues.campus_id);
        const currentCampus =
            (!!currentCampusList &&
                currentCampusList.length > 0 &&
                currentCampusList?.find(c => {
                    const match = c.campus_id === formValues?.campus_id;
                    console.log('c=', match, c);
                    return match;
                })) ||
            {};
        console.log('currentCampus', currentCampus);
        const currentCampusLibraries = validLibraryList(currentCampus?.libraries || []);
        console.log('currentCampusLibraries', currentCampusLibraries);
        console.log('formValues.library_id', formValues.library_id);
        const currentLibrary =
            currentCampusLibraries?.find(l => {
                const match = l.library_id === formValues.library_id;
                console.log('l=', match, l);
                return match;
            }) || {};
        console.log('currentLibrary', currentLibrary);
        const currentLibraryFloors = currentLibrary?.floors || [];
        console.log('currentLibraryFloors', currentLibraryFloors);

        const updatedLocation = {};
        updatedLocation.currentCampus = currentCampus;
        updatedLocation.campus_id = currentCampus?.campus_id;

        updatedLocation.currentCampusLibraries = currentCampusLibraries;
        updatedLocation.currentLibrary = currentLibrary;
        updatedLocation.library_id = currentLibrary?.library_id;

        updatedLocation.currentLibraryFloors = currentLibrary?.floors;
        updatedLocation.currentFloor = currentLibrary?.floors?.find(f => f.floor_id === formValues?.floor_id);
        updatedLocation.floor_id = formValues?.floor_id;
        setLocation({
            // ...location,
            ...updatedLocation,
        });
    }, [currentCampusList, formValues]);

    const handleSuppliedFiles = files => {
        console.log('handleSuppliedFiles', files);
        setFormValues({ ...formValues, ['space_photo_url']: files, hasImage: true });
    };

    const clearSuppliedFile = () => {
        setFormValues(prevState => {
            return { ...prevState, ['space_photo_url']: [], hasImage: false };
        });
    };
    // console.log('RENDER selectedSpringshareOption=', selectedSpringshareOption);
    return (
        <>
            <ConfirmationBox
                confirmationBoxId="spaces-save-outcome"
                isOpen={confirmationOpen}
                onClose={closeConfirmationBox}
                onAction={() => returnToDashboard()}
                //
                hideCancelButton={!locale.success.cancelButtonLabel}
                onCancelAction={() => {
                    mode === 'edit' ? reEditRecord() : clearForm();
                }}
                //
                showAlternateActionButton={!!bookableSpacesRoomUpdateError}
                alternateActionButtonLabel="Close"
                onAlternateAction={closeConfirmationBox}
                //
                locale={!!bookableSpacesRoomAddError || !!bookableSpacesRoomUpdateError ? locale.error : locale.success}
                cancelButtonColor="accent"
            />

            <PageWrapper>
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
                        <Grid item md={5} xs={12}>
                            <FormControl variant="standard" fullWidth>
                                <InputLabel id="add-space-type-label" htmlFor="add-space-type-input">
                                    Choose an existing Space type *
                                </InputLabel>
                                <Select
                                    id="add-space-type"
                                    labelId="add-space-type-label"
                                    data-testid="space-type"
                                    value={formValues?.space_type || ''}
                                    onChange={handleChange('space_type')}
                                    onBlur={handleFieldCompletion}
                                    inputProps={{
                                        id: 'add-space-type-input',
                                        title: 'Choose an existing Space type',
                                    }}
                                >
                                    {!!spaceTypeList &&
                                        spaceTypeList?.length > 0 &&
                                        spaceTypeList?.map((spaceType, index) => {
                                            return (
                                                <MenuItem value={spaceType} key={`spacetype-${index}`}>
                                                    {spaceType}
                                                </MenuItem>
                                            );
                                        })}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item md={1} xs={12} style={{ marginBlock: 'auto', marginInline: 'auto' }}>
                            ...or...
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="add-space-type-new-label">Enter new Space type</InputLabel>
                                <Input
                                    id="add-space-type-new"
                                    labelId="add-space-type-new-label"
                                    data-testid="add-space-type-new"
                                    onChange={handleChange('space_type_new')}
                                    onBlur={handleFieldCompletion}
                                    inputProps={{
                                        'aria-labelledby': 'add-space-type-new-label',
                                    }}
                                />
                                <StyledErrorMessageTypography component={'div'}>
                                    {reportErrorMessage('space_type')}
                                </StyledErrorMessageTypography>
                            </FormControl>
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
                            <Typography component={'h4'} variant={'h6'}>
                                Facility types
                            </Typography>
                            <StyledFilterWrapper>{showFilterCheckboxes()}</StyledFilterWrapper>
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
                                <InputLabel id="add-space-select-campus-label" htmlFor="add-space-select-campus-input">
                                    Campus *
                                </InputLabel>
                                <Select
                                    id="add-space-select-campus"
                                    labelId="add-space-select-campus-label"
                                    data-testid="add-space-select-campus"
                                    value={formValues?.campus_id}
                                    onChange={handleChange('campus_id')}
                                    required
                                    inputProps={{
                                        id: 'add-space-select-campus-input',
                                        'aria-labelledby': 'add-space-select-campus-label',
                                    }}
                                >
                                    {!!currentCampusList &&
                                        currentCampusList?.length > 0 &&
                                        currentCampusList?.map((campus, index) => (
                                            <MenuItem value={campus?.campus_id} key={`select-campus-${index}`}>
                                                {campus?.campus_name}
                                            </MenuItem>
                                        ))}
                                </Select>
                                <StyledErrorMessageTypography component={'div'}>
                                    {reportErrorMessage('??')}
                                </StyledErrorMessageTypography>
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl variant="standard" fullWidth>
                                <InputLabel
                                    id="add-space-select-library-label"
                                    htmlFor="add-space-select-library-input"
                                >
                                    Library *
                                </InputLabel>
                                <Select
                                    id="add-space-select-library"
                                    labelId="add-space-select-library-label"
                                    data-testid="add-space-select-library"
                                    value={formValues?.library_id}
                                    onChange={handleChange('library_id')}
                                    required
                                    inputProps={{
                                        id: 'add-space-select-library-input',
                                        'aria-labelledby': 'add-space-select-library-label',
                                    }}
                                >
                                    {!!location.currentCampusLibraries &&
                                        location.currentCampusLibraries?.length > 0 &&
                                        location.currentCampusLibraries?.map((library, index) => (
                                            <MenuItem value={library?.library_id} key={`select-library-${index}`}>
                                                {library?.library_name || library?.building_name}
                                            </MenuItem>
                                        ))}
                                </Select>
                                <StyledErrorMessageTypography component={'div'}>
                                    {reportErrorMessage('??')}
                                </StyledErrorMessageTypography>
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl variant="standard" fullWidth>
                                <InputLabel id="add-space-select-floor-label" htmlFor="add-space-select-floor-input">
                                    Floor *
                                </InputLabel>
                                <Select
                                    id="add-space-select-floor"
                                    labelId="add-space-select-floor-label"
                                    data-testid="add-space-select-floor"
                                    value={formValues?.floor_id}
                                    onChange={handleChange('floor_id')}
                                    required
                                    inputProps={{
                                        id: 'add-space-select-floor-input',
                                        'aria-labelledby': 'add-space-select-floor-label',
                                    }}
                                >
                                    {!!location?.currentLibrary &&
                                        !!location?.currentLibraryFloors &&
                                        location?.currentLibraryFloors?.length > 0 &&
                                        location?.currentLibraryFloors?.map((floor, index) => {
                                            const libraryName =
                                                location?.currentLibrary?.library_name ||
                                                location?.currentLibrary?.building_name;
                                            return (
                                                <MenuItem value={floor?.floor_id} key={`select-floor-${index}`}>
                                                    {floor?.floor_name}{' '}
                                                    {location?.currentLibrary?.ground_floor_id === floor?.floor_id
                                                        ? ' (Ground floor)'
                                                        : ''}
                                                    {`${
                                                        window.location.host === 'localhost:2020' // to make the Select more readable to we poor devs, also makes more accurate test
                                                            ? ' [' + libraryName + ' - ' + floor?.floor_id + ']'
                                                            : ''
                                                    }`}
                                                </MenuItem>
                                            );
                                        })}
                                </Select>
                                <StyledErrorMessageTypography component={'div'}>
                                    {reportErrorMessage('??')}
                                </StyledErrorMessageTypography>
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
                                        location?.currentFloor?.floor_id === location?.currentLibrary?.ground_floor_id,
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
                            <Typography component={'h4'} variant={'h6'}>
                                Opening hours
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <StyledSpringshareHouseFormControl variant="standard" fullWidth className="asLoaded">
                                <InputLabel id="add-space-springshare-id-label" htmlFor="add-space-springshare-input">
                                    Choose the Springshare Library to use for Opening hours *
                                </InputLabel>
                                <Select
                                    id="add-space-springshare-id"
                                    labelId="add-space-springshare-id-label"
                                    data-testid="add-space-springshare-id"
                                    value={formValues?.space_opening_hours_id} // selectedSpringshareOption
                                    onChange={handleChange('space_opening_hours_id')}
                                    required
                                    inputProps={{
                                        id: 'add-space-springshare-input',
                                        'aria-labelledby': 'add-space-springshare-id-label',
                                    }}
                                >
                                    {!!springshareList &&
                                        springshareList?.length > 0 &&
                                        springshareList?.map((s, index) => {
                                            return (
                                                <MenuItem value={s?.id} key={`select-floor-${index}`}>
                                                    {s.display_name}
                                                </MenuItem>
                                            );
                                        })}
                                </Select>
                                <StyledErrorMessageTypography component={'div'}>
                                    {reportErrorMessage('space_opening_hours_id')}
                                </StyledErrorMessageTypography>
                            </StyledSpringshareHouseFormControl>{' '}
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
                            <Typography component={'p'}>
                                The "About" page for this Library:{' '}
                                <span>{reportCurrentLibraryAboutPage(location)}</span>
                            </Typography>
                            <FormControl variant="standard" fullWidth>
                                <InputLabel htmlFor="space_services_page">
                                    Enter a different page for this Space:
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
                        <Grid item xs={12}>
                            <Typography component={'h3'} variant={'h6'}>
                                Imagery
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl variant="standard" fullWidth>
                                <ImageUploadDropzone
                                    onAddFile={handleSuppliedFiles}
                                    onClearFile={clearSuppliedFile}
                                    currentImage={formValues.space_photo_url}
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
                                onClick={() => navigateToPage('/admin/spaces')}
                                variant="contained"
                            />
                        </Grid>
                        <Grid item xs={6} align="right">
                            <StyledPrimaryButton
                                data-testid="admin-spaces-save-button-submit"
                                variant="contained"
                                children="Save"
                                onClick={() => handleSaveClick()}
                            />
                        </Grid>
                    </Grid>
                </form>
            </PageWrapper>
        </>
    );
};

EditSpaceForm.propTypes = {
    actions: PropTypes.any,
    bookableSpacesRoomAdding: PropTypes.any,
    bookableSpacesRoomAddError: PropTypes.any,
    bookableSpacesRoomAddResult: PropTypes.any,
    currentCampusList: PropTypes.any,
    bookableSpacesRoomList: PropTypes.any,
    bookableSpacesRoomListLoading: PropTypes.any,
    bookableSpacesRoomListError: PropTypes.any,
    facilityTypeList: PropTypes.any,
    facilityTypeListLoading: PropTypes.any,
    facilityTypeListError: PropTypes.any,
    bookableSpacesRoomUpdating: PropTypes.any,
    bookableSpacesRoomUpdateError: PropTypes.any,
    bookableSpacesRoomUpdateResult: PropTypes.any,
    formValues: PropTypes.any,
    setFormValues: PropTypes.any,
    saveToDb: PropTypes.func,
    PageWrapper: PropTypes.any,
    mode: PropTypes.string,
    bookableSpaceGetError: PropTypes.any,
    springshareList: PropTypes.any,
};

export default React.memo(EditSpaceForm);
