import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAccountContext } from 'context';
import { useCookies } from 'react-cookie';

import { Grid } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StyledPrimaryButton, StyledSecondaryButton } from 'helpers/general';

import { HeaderBar } from 'modules/Pages/Admin/BookableSpaces/HeaderBar';
import {
    addBreadcrumbsToSiteHeader,
    displayToastMessage,
    spacesAdminLink,
} from 'modules/Pages/Admin/BookableSpaces/helpers';

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
}) => {
    console.log('addResult', bookableSpacesRoomAdding, bookableSpacesRoomAddError, bookableSpacesRoomAddResult);
    console.log('campusList', campusListLoading, campusListError, campusList);
    console.log('spacesRoomList', bookableSpacesRoomListLoading, bookableSpacesRoomListError, bookableSpacesRoomList);

    const { account } = useAccountContext();
    const [cookies, setCookie] = useCookies();

    const [location, setLocation1] = React.useState({});
    const setLocation = newValues => {
        console.log('setLocation', newValues);
        setLocation1(newValues);
    };
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
            actions.loadAllBookableSpacesRooms();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const validCampusList = campusList => campusList?.filter(c => c.buildings?.length > 0) || [];
    const validBuildingList = buildingList => buildingList?.filter(b => b.floors.length > 0) || [];

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

            locnTemp.currentCampusBuildings = validBuildingList(locnTemp?.currentCampus?.buildings || []);
            locnTemp.currentBuilding = locnTemp.currentCampusBuildings?.at(0) || {};
            locnTemp.building_id = locnTemp.currentBuilding?.building_id;

            locnTemp.currentBuildingFloors = locnTemp.currentBuilding?.floors || [];
            locnTemp.currentFloor = locnTemp.currentBuildingFloors?.at(0) || {};
            locnTemp.floor_id = locnTemp.currentFloor?.floor_id;
            console.log('setLocation 1');
            setLocation({
                ...location,
                ...locnTemp,
            });

            const newValues = {
                ...formValues,
                ['campus_id']: locnTemp.campus_id,
                ['building_id']: locnTemp.building_id,
                ['floor_id']: locnTemp.floor_id,
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

        const updatedLocation = {};
        if (prop === 'campus_id') {
            updatedLocation.currentCampusList = validCampusList(campusList);
            updatedLocation.currentCampus = !!formValues.campus_id
                ? updatedLocation.currentCampusList?.find(c => c.campus_id === theNewValue)
                : {};
            updatedLocation.campus_id = updatedLocation.currentCampus?.campus_id;

            updatedLocation.currentCampusBuildings = validBuildingList(updatedLocation?.currentCampus?.buildings);
            updatedLocation.currentBuilding = updatedLocation.currentCampusBuildings?.at(0);
            updatedLocation.building_id = updatedLocation.currentBuilding?.building_id;

            updatedLocation.currentBuildingFloors = updatedLocation.currentBuilding?.floors;
            updatedLocation.currentFloor = updatedLocation.currentBuildingFloors?.at(0);
            updatedLocation.floor_id = updatedLocation.currentFloor?.floor_id;
            console.log('setLocation 2');
            setLocation({
                ...location,
                ...updatedLocation,
            });
        } else if (prop === 'building_id') {
            updatedLocation.currentCampusList = validCampusList(campusList);
            updatedLocation.currentCampus = !!formValues.campus_id
                ? updatedLocation.currentCampusList?.find(c => c.campus_id === formValues.campus_id)
                : {};
            updatedLocation.campus_id = updatedLocation.currentCampus?.campus_id;

            updatedLocation.currentCampusBuildings = updatedLocation.currentCampus?.buildings;
            updatedLocation.currentBuilding = updatedLocation.currentCampusBuildings?.find(
                b => b.building_id === theNewValue,
            );
            updatedLocation.building_id = updatedLocation.currentBuilding?.building_id;

            updatedLocation.currentBuildingFloors = updatedLocation.currentBuilding?.floors;
            updatedLocation.currentFloor = updatedLocation.currentBuildingFloors?.at(0);
            updatedLocation.floor_id = updatedLocation.currentFloor?.floor_id;
            console.log('setLocation 3');
            setLocation({
                ...location,
                ...updatedLocation,
            });
        }

        const newLocation = {};
        if (!!updatedLocation?.campus_id) {
            newLocation.campus_id = updatedLocation?.campus_id;
        }
        if (!!updatedLocation?.building_id) {
            newLocation.building_id = updatedLocation?.building_id;
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

    const formValid = valuesToSend => {
        if (!valuesToSend.space_name || !valuesToSend.space_type || !valuesToSend.space_floor_id) {
            return false;
        }

        return true;
    };

    const createNewSpace = () => {
        const valuesToSend = {};

        valuesToSend.locationType = 'space';

        valuesToSend.space_floor_id = formValues.floor_id;
        valuesToSend.space_name = formValues.space_name;
        // valuesToSend.space_precise = '?'; // TODO missing setting
        // valuesToSend.space_description = '?';
        // valuesToSend.space_photo_url = '?';
        // valuesToSend.space_photo_description = '?';
        valuesToSend.space_type = formValues.space_type;
        // valuesToSend.space_opening_hours_id = '?';
        // valuesToSend.space_services_page = '?';
        // valuesToSend.space_opening_hours_override = '?';
        // valuesToSend.space_latitude = '?';
        // valuesToSend.space_longitude = '?';

        if (!formValid(valuesToSend)) {
            document.activeElement.blur();
            displayToastMessage('Please enter all required fields', true);
            return;
        }

        const cypressTestCookie = cookies.hasOwnProperty('CYPRESS_TEST_DATA') ? cookies.CYPRESS_TEST_DATA : null;
        if (!!cypressTestCookie && window.location.host === 'localhost:2020' && cypressTestCookie === 'active') {
            setCookie('CYPRESS_DATA_SAVED', valuesToSend);
        }

        console.log('createNewSpace valuesToSend=', valuesToSend);
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

    console.log('@@@@ location=', location);
    console.log('@@@@ formValues?.campus_id=', formValues?.campus_id);

    // const spaceTypeList =
    //     bookableSpacesRoomListLoading === false &&
    //     bookableSpacesRoomListError === false &&
    //     bookableSpacesRoomList?.data?.locations
    //         .map(location => location.space_type)
    //         .filter((spaceType, index, array) => array.indexOf(spaceType) === index);
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
    console.log('spaceTypeList=', spaceTypeList);

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
                        <p data-testid="add-space-error">Something went wrong - please try again later.</p>
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
                            No buildings currently in system - please{' '}
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
                                <FormControl variant="standard" fullWidth>
                                    <InputLabel htmlFor="space_name">Space name *</InputLabel>
                                    <Input
                                        id="space_name"
                                        data-testid="space-name"
                                        required
                                        value={formValues?.space_name || ''}
                                        onChange={handleChange('space_name')}
                                    />
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
                                />
                                {spaceTypeList && spaceTypeList.length > 0 && (
                                    <datalist id="space-type-list">
                                        {spaceTypeList.map((spaceType, index) => (
                                            <option key={`spacetype-datalist-${index}`} value={spaceType} />
                                        ))}
                                    </datalist>
                                )}
                            </Grid>
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
                                    >
                                        {!!location.currentCampusList &&
                                            location.currentCampusList.length > 0 &&
                                            location.currentCampusList.map((campus, index) => (
                                                <MenuItem value={campus.campus_id} key={`select-campus-${index}`}>
                                                    {campus.campus_name}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={4}>
                                <FormControl variant="standard" fullWidth>
                                    <InputLabel id="add-space-select-building-label">Building *</InputLabel>
                                    <Select
                                        labelId="add-space-select-building-label"
                                        id="add-space-select-building"
                                        data-testid="add-space-select-building"
                                        value={formValues?.building_id}
                                        label="Building"
                                        onChange={handleChange('building_id')}
                                        required
                                    >
                                        {!!location.currentCampusBuildings &&
                                            location.currentCampusBuildings.length > 0 &&
                                            location.currentCampusBuildings.map((building, index) => (
                                                <MenuItem value={building.building_id} key={`select-building-${index}`}>
                                                    {building.building_name}
                                                </MenuItem>
                                            ))}
                                    </Select>
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
                                        {!!location.currentBuildingFloors &&
                                            location.currentBuildingFloors?.length > 0 &&
                                            location.currentBuildingFloors?.map((floor, index) => (
                                                <MenuItem value={floor.floor_id} key={`select-floor-${index}`}>
                                                    {floor.floor_name}{' '}
                                                    {location.currentBuilding.ground_floor_id === floor.floor_id
                                                        ? ' (Ground floor)'
                                                        : ''}
                                                    {`${
                                                        window.location.host === 'localhost:2020' // perhaps remove when dev complete
                                                            ? ' [' +
                                                              location.currentBuilding.building_name +
                                                              ' - ' +
                                                              floor.floor_id +
                                                              ']'
                                                            : ''
                                                    }`}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography component={'p'} variant={'p'}>
                                    Required fields are marked with *
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
};

export default React.memo(BookableSpacesAddSpace);
