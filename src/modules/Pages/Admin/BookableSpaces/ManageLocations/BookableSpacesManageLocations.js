import React from 'react';
import PropTypes from 'prop-types';
import { useCookies } from 'react-cookie';

import Button from '@mui/material/Button';
import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

import EditIcon from '@mui/icons-material/Edit';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { baseButtonStyles, pluralise } from 'helpers/general';

import { HeaderBar } from 'modules/Pages/Admin/BookableSpaces/HeaderBar';
import {
    addBreadcrumbsToSiteHeader,
    closeDeletionConfirmation,
    closeDialog,
    displayToastMessage,
    showGenericConfirmAndDeleteDialog,
    springshareLocations,
} from '../bookableSpacesAdminHelpers';

const StyledMainDialog = styled('dialog')(({ theme }) => ({
    width: '80%',
    border: '1px solid rgba(38, 85, 115, 0.15)',
    maxWidth: '1136px',
    '& h2': {
        paddingInline: '1rem',
    },
    '& .dialogRow': {
        padding: '0.5rem 1rem',
        '& h3': {
            marginBottom: 0,
            marginTop: '0.5rem',
        },
        '& label': {
            fontWeight: 500,
            display: 'block',
        },
        '& input[type="text"]': {
            padding: '0.5rem',
            width: '90%',
        },
        '& input:not(:valid)': {
            outline: '1px solid red',
        },
        '& :focus-visible': {
            outlineColor: theme.palette.primary.light,
        },
        '& ul': {
            marginBlock: 0,
        },
        '& li': {
            paddingBlock: '0.5rem',
            '& input[type="radio"], & label': {
                display: 'inline',
            },
        },
        '& ul.radioList li': {
            listStyle: 'none',
        },
    },
    '& .dialogRowSideBySide': {
        display: 'flex',
        justifyContent: 'flex-start',
        columnGap: '0.5rem',
        alignItems: 'flex-start',
        '& div': {
            marginBottom: '0.2rem',
        },
        '& div:not(:first-of-type)': {
            fontWeight: '300',
        },
    },
    '& .dialogFooter': {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '1rem',
        '& button': {
            marginLeft: '0.5rem',
        },
    },
}));
const StyledConfirmationButtons = styled('div')(() => ({
    display: 'flex',
    justifyContent: 'space-between',
}));
const StyledButton = styled(Button)(({ theme }) => ({
    ...baseButtonStyles,
    backgroundColor: theme.palette.primary.light,
    borderColor: theme.palette.primary.light,
    color: '#fff',
    alignItems: 'center',
    gap: '.5rem',
    position: 'relative',
    transition: 'background-color 200ms ease-out, color 200ms ease-out, border 200ms ease-out',
    '&.secondary': {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderColor: theme.palette.primary.light,
        color: theme.palette.primary.light,
        '&:hover': {
            backgroundColor: theme.palette.primary.light,
            borderColor: theme.palette.primary.light,
            color: '#fff',
        },
    },
    '&.alert': {
        backgroundColor: '#d62929',
        borderColor: '#d62929',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#fff',
            color: '#d62929',
        },
    },
    '&.primary': {
        '&:hover': {
            backgroundColor: '#fff',
            borderColor: '#51247a',
            color: '#51247a',
            textDecoration: 'underline',
        },
    },
}));
const StyledEditButton = styled(Button)(({ theme }) => ({
    '& svg': {
        color: 'grey',
        height: '1rem',
    },
    display: 'flex',
    alignItems: 'center',
    marginLeft: '-0.5rem',
    paddingLeft: 0,
    textTransform: 'capitalize',
    lineHeight: 'normal',
    justifyContent: 'flex-start',
    '&:hover, &:focus': {
        backgroundColor: 'transparent',
        transition: 'color 200ms ease-out, text-decoration 200ms ease-out, background-color 200ms ease-out',
        '& svg': {
            color: 'black',
        },
        '& span': {
            color: '#fff',
            backgroundColor: theme.palette.primary.light,
        },
    },
    '& span': {
        fontSize: '1rem',
    },
    '& .MuiTouchRipple-root': {
        display: 'none', // remove mui ripple
    },
}));
const StyledRow = styled('div')(() => ({
    marginBlock: '0.2rem',
}));
const StyledGroundFloorIndicatorSpan = styled('span')(() => ({
    paddingLeft: '0.25rem',
}));

const getIdentifierForFloorGroundFloorIndicator = floorId => `groundfloor-for-${floorId}`;

export const BookableSpacesManageLocations = ({
    actions,
    campusList,
    campusListLoading,
    campusListError,
    weeklyHours,
    weeklyHoursLoading,
    weeklyHoursError,
}) => {
    console.log('campusList', campusListLoading, campusListError, campusList);
    console.log('weeklyHours', weeklyHoursLoading, weeklyHoursError, weeklyHours);

    const [cookies, setCookie] = useCookies();

    const [savingProgressShown, showSavingProgress] = React.useState(false);

    React.useEffect(() => {
        addBreadcrumbsToSiteHeader([
            '<li class="uq-breadcrumb__item"><span class="uq-breadcrumb__link">Location management</span></li>',
        ]);

        if (campusListError === null && campusListLoading === null && campusList === null) {
            actions.loadBookableSpaceCampusChildren(); // get campusList
            actions.loadWeeklyHours(); // get weeklyHours
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const springshareList = React.useMemo(() => {
        console.log('springshareList:', weeklyHoursLoading, weeklyHoursError, weeklyHours);
        if (
            weeklyHoursLoading === false &&
            weeklyHoursError === false &&
            weeklyHours?.locations &&
            Array.isArray(weeklyHours.locations)
        ) {
            console.log('springshareLocations(weeklyHours)=', springshareLocations(weeklyHours));
            return springshareLocations(weeklyHours);
        }
        return [];
    }, [weeklyHoursLoading, weeklyHoursError, weeklyHours]);

    function deleteGenericLocation(locationType, locationId, successMessage, failureMessage) {
        console.log('deleteGenericLocation', locationType, locationId);
        showSavingProgress(true);

        closeDeletionConfirmation(); // close delete conf dialog
        closeDialog(); // close main dialog

        !!locationType &&
            !!locationId &&
            actions
                .deleteBookableSpaceLocation({ locationType, locationId })
                .then(() => {
                    console.log('deleteGenericLocation then');
                    displayToastMessage(successMessage, false);
                    actions.loadBookableSpaceCampusChildren();
                })
                .catch(e => {
                    console.log(failureMessage, e);
                    displayToastMessage(
                        '[BSML-004] Sorry, an error occurred and the location was not deleted - the admins have been informed',
                    );
                })
                .finally(() => {
                    showSavingProgress(false);
                });
    }

    const saveChangeToLibrary = e => {
        const form = e.target.closest('form');

        const formData = new FormData(form);
        const data = !!formData && Object.fromEntries(formData);
        console.log('saveChangeToLibrary data=', data);
        const locationType = data?.locationType;
        const locationId = data[`${locationType}Id`];

        // validate form
        const errorMessages = [];
        !data.library_name && errorMessages.push('Please enter the Library name');
        (!data.building_name || !data.building_number) && errorMessages.push('Please enter building name and number');
        if (errorMessages.length > 0) {
            displayToastMessage(errorMessages.join('; '), true);
            return false;
        }

        showSavingProgress(true);
        closeDialog(e);

        const valuesToSend = {
            library_name: data.library_name,
            building_name: data.building_name,
            building_number: data.building_number,
            library_campus_id: data.campus_id,
            building_ground_floor_id: data.building_ground_floor_id,
            library_about_page_default: data.library_about_page_default,
            library_springshare_id: data.library_springshare_id,
        };
        console.log('saveChangeToLibrary valuesToSend', valuesToSend);

        const cypressTestCookie = cookies.hasOwnProperty('CYPRESS_TEST_DATA') ? cookies.CYPRESS_TEST_DATA : null;
        if (!!cypressTestCookie && window.location.host === 'localhost:2020' && cypressTestCookie === 'active') {
            setCookie('CYPRESS_DATA_SAVED', valuesToSend);
        }

        !!locationType &&
            !!locationId &&
            actions
                .updateBookableSpaceLocation(valuesToSend, locationType)
                .then(() => {
                    displayToastMessage('Change to library saved', false);
                    actions.loadBookableSpaceCampusChildren();
                })
                .catch(e => {
                    console.log('catch: saving library ', locationId, 'failed:', e);
                    displayToastMessage(
                        '[BSML-005] Sorry, an error occurred and the Location change did not save - the admins have been informed',
                    );
                })
                .finally(() => {
                    showSavingProgress(false);
                });
        return true;
    };

    const saveChangeToCampus = e => {
        const form = e.target.closest('form');

        const formData = new FormData(form);
        const data = !!formData && Object.fromEntries(formData);
        console.log('saveChangeToCampus data=', data);
        const locationType = data?.locationType;
        const locationId = data[`${locationType}Id`];

        // validate form
        const failureMessage = (!data.campus_name || !data.campus_number) && 'Please enter campus name and number';
        if (!!failureMessage) {
            displayToastMessage(failureMessage, true);
            return false;
        }

        const valuesToSend = {
            campus_name: data.campus_name,
            campus_number: data.campus_number,
        };
        console.log('saveChangeToCampus valuesToSend', valuesToSend);

        showSavingProgress(true);
        closeDialog(e);

        const cypressTestCookie = cookies.hasOwnProperty('CYPRESS_TEST_DATA') ? cookies.CYPRESS_TEST_DATA : null;
        if (!!cypressTestCookie && window.location.host === 'localhost:2020' && cypressTestCookie === 'active') {
            setCookie('CYPRESS_DATA_SAVED', valuesToSend);
        }

        !!locationType &&
            !!locationId &&
            actions
                .updateBookableSpaceLocation(valuesToSend, locationType)
                .then(() => {
                    displayToastMessage('Change to campus saved', false);
                    actions.loadBookableSpaceCampusChildren();
                })
                .catch(e => {
                    console.log('catch: saving campus ', locationId, 'failed:', e);
                    displayToastMessage(
                        '[BSML-003] Sorry, an error occurred and the Location change did not save - the admins have been informed',
                    );
                })
                .finally(() => {
                    showSavingProgress(false);
                });
        return true;
    };

    // allow for having spaces in a building where we don't have a Library
    const displayedLibraryName = libraryDetails =>
        libraryDetails?.library_name || libraryDetails?.building_name || 'unknown Library';

    /*
     * FLOOR FUNCTIONS
     */
    const floorCoreForm = (floorDetails = {}) => {
        const floorNameFieldLabel = Object.keys(floorDetails).length === 0 ? 'New floor name' : 'Floor name';
        return `<input name="locationType" type="hidden" value="floor" />
        <div class="dialogRow" data-testid="floor-name">
            <label for="displayedFloorId">${floorNameFieldLabel}</label>
            <input id="displayedFloorId" name="floor_name" type="text" required value="${floorDetails?.floor_name ??
                ''}"  maxlength="10" />
        </div>`;
    };

    const saveNewFloor = e => {
        const form = e.target.closest('form');
        console.log('saveNewFloor form=', form);

        const formData = new FormData(form);
        const data = !!formData && Object.fromEntries(formData);
        console.log('saveNewFloor data', data);

        // validate form
        if (!data.floor_name) {
            displayToastMessage('Please enter floor name', true);
            return false;
        }

        showSavingProgress(true);
        closeDialog(e);

        const locationType = data?.locationType;
        const valuesToSend = {
            floor_name: data.floor_name,
            floor_library_id: data.libraryId,
        };
        console.log('saveNewFloor valuesToSend=', valuesToSend);

        const cypressTestCookie = cookies.hasOwnProperty('CYPRESS_TEST_DATA') ? cookies.CYPRESS_TEST_DATA : null;
        if (!!cypressTestCookie && window.location.host === 'localhost:2020' && cypressTestCookie === 'active') {
            setCookie('CYPRESS_DATA_SAVED', valuesToSend);
        }

        !!locationType &&
            actions
                .addBookableSpaceLocation(valuesToSend, locationType)
                .then(newFloor => {
                    if (!!data.isGroundFloor && data?.isGroundFloor === 'Y') {
                        const libraryData = {
                            locationType: 'library',
                            libraryId: data.libraryId,
                            ground_floor_id: newFloor.data.floor_id,
                        };
                        return actions.updateBookableSpaceLocation(libraryData, locationType);
                    } else {
                        return true;
                    }
                })
                .then(() => {
                    displayToastMessage('Floor added', false);

                    actions.loadBookableSpaceCampusChildren();
                })
                .catch(e => {
                    console.log('catch: adding new floor failed:', e);
                    displayToastMessage(
                        '[BSML-006] Sorry, an error occurred and the Location change did not save - the admins have been informed',
                    );
                })
                .finally(() => {
                    showSavingProgress(false);
                });
        return true;
    };

    function showAddFloorForm(e, libraryDetails, currentGroundFloorDetails) {
        const groundFloorDescription = !!currentGroundFloorDetails
            ? `Current ground floor is Floor ${currentGroundFloorDetails.floor_name}`
            : 'No floor is currently marked as the ground floor';
        const formBody = `<h2>Add a floor to ${displayedLibraryName(libraryDetails)}</h2>
            <input name="libraryId" type="hidden" value="${libraryDetails?.library_id}" />
            ${floorCoreForm()}
            <div class="dialogRow dialogRowSideBySide" data-testid="mark-ground-floor">
                <input type="checkbox" name="isGroundFloor" value="Y" id="isGroundFloor">
                <label for="isGroundFloor">
                    <div>Mark new floor as Ground floor</div>
                    <div>(${groundFloorDescription})</div>
                    <div>A ground floor is not compulsory!</div>
                </label> 
            </div>`;
        if (!formBody) {
            return;
        }

        const dialogBodyElement = document.getElementById('dialogBody');
        !!dialogBodyElement && (dialogBodyElement.innerHTML = formBody);

        const addNewButton = document.getElementById('addNewButton');
        !!addNewButton && (addNewButton.style.display = 'none');

        const deleteButton = document.getElementById('deleteButton');
        !!deleteButton && (deleteButton.style.display = 'none');

        const saveButton = document.getElementById('saveButton');
        !!saveButton && saveButton.removeEventListener('click', saveChangeToLibrary);
        !!saveButton && saveButton.addEventListener('click', saveNewFloor);

        const dialog = document.getElementById('popupDialog');
        !!dialog && dialog.showModal();
    }

    const saveChangeToFloor = e => {
        const form = e.target.closest('form');

        const formData = new FormData(form);
        const data = !!formData && Object.fromEntries(formData);
        console.log('saveChangeToFloor data=', data);

        // validate form
        const failureMessage = !data.floor_name && 'Please enter floor name';
        if (!!failureMessage) {
            displayToastMessage(failureMessage, true);
            return false;
        }

        showSavingProgress(true);
        closeDialog(e);

        const locationType = data?.locationType;
        const locationId = data[`${locationType}Id`];

        const valuesToSend = {
            floor_name: data.floor_name,
            floor_library_id: data.floor_library_id,
        };
        console.log('saveChangeToLibrary valuesToSend', valuesToSend);

        const cypressTestCookie = cookies.hasOwnProperty('CYPRESS_TEST_DATA') ? cookies.CYPRESS_TEST_DATA : null;
        if (!!cypressTestCookie && window.location.host === 'localhost:2020' && cypressTestCookie === 'active') {
            setCookie('CYPRESS_DATA_SAVED', valuesToSend);
        }

        !!locationType &&
            !!locationId &&
            actions
                .updateBookableSpaceLocation(valuesToSend, locationType)
                .then(() => {
                    displayToastMessage('Changes to floor saved', false);
                    actions.loadBookableSpaceCampusChildren();
                })
                .catch(e => {
                    console.log('catch: saving floor ', locationId, 'failed:', e);
                    displayToastMessage(
                        '[BSML-007] Sorry, an error occurred and the Location change did not save - the admins have been informed',
                    );
                })
                .finally(() => {
                    showSavingProgress(false);
                });
        return true;
    };

    function deleteFloor(e, floorDetails) {
        console.log('floorDetails=', floorDetails);
        const locationType = 'floor';
        const locationId = floorDetails?.floor_id;
        const successMessage = `Floor ${floorDetails?.floor_name} in ${displayedLibraryName(floorDetails)} deleted`;
        const failureMessage = `catch: deleting floor ${floorDetails.floor_id} failed:`;
        deleteGenericLocation(locationType, locationId, successMessage, failureMessage);
    }

    function showConfirmAndDeleteFloorDialog(e, floorDetails) {
        const line1 = `Do you really want to delete floor ${floorDetails.floor_name}?`;
        const line2 = 'This will also delete associated rooms.';
        const confirmationOKButton = document.getElementById('confDialogOkButton');
        !!confirmationOKButton && confirmationOKButton.addEventListener('click', e => deleteFloor(e, floorDetails));
        showGenericConfirmAndDeleteDialog(line1, line2);
    }

    function showEditFloorForm(floorId) {
        const floorDetails =
            floorId > 0 &&
            (() => {
                for (const campus of campusList) {
                    for (const library of campus.libraries) {
                        const floor = library.floors.find(floor => floor.floor_id === floorId);
                        if (floor) {
                            return {
                                ...floor,
                                library_name: displayedLibraryName(library),
                            };
                        }
                    }
                }
                return null;
            })();

        if (!floorDetails) {
            console.log(`Can't find floor with floor_id = "${floorId}" in campus list from api`);
            displayToastMessage('Sorry, something went wrong');
            return;
        }

        const formBody = `
            <h2>Edit floor details</h2>
            <input name="floorId" type="hidden" value="${floorDetails?.floor_id}" />${floorCoreForm(floorDetails)}`;

        const dialogBodyElement = document.getElementById('dialogBody');
        !!dialogBodyElement && (dialogBodyElement.innerHTML = formBody);

        const addNewButton = document.getElementById('addNewButton');
        !!addNewButton && (addNewButton.style.display = 'none');

        const saveButton = document.getElementById('saveButton');
        !!saveButton && saveButton.addEventListener('click', saveChangeToFloor);

        const deleteButton = document.getElementById('deleteButton');
        !!deleteButton && deleteButton.addEventListener('click', e => showConfirmAndDeleteFloorDialog(e, floorDetails));

        const dialog = document.getElementById('popupDialog');
        !!dialog && dialog.showModal();
    }

    /*
     * LIBRARY FUNCTIONS
     */
    function libraryCoreForm(libraryDetails = {}) {
        const libraryNameFieldLabel = Object.keys(libraryDetails).length === 0 ? 'New Library name' : 'Library name';
        return `<input name="locationType" type="hidden" value="library" />
            <div class="dialogRow" data-testid="library-name">
                <label for="libraryName">${libraryNameFieldLabel} *</label>
                <input id="libraryName" name="library_name" type="text" value="${libraryDetails?.library_name ||
                    ''}" required  maxlength="255" />
            </div>
            <div class="dialogRow" data-testid="building-name">
                <label for="buildingName">Building name *</label>
                <input id="buildingName" name="building_name" type="text" value="${libraryDetails?.building_name ||
                    ''}" required  maxlength="255" />
            </div>
            <div class="dialogRow" data-testid="building-number">
                <label for="buildingNumber">Building number *</label>
                <input id="buildingNumber" name="building_number" type="text" value="${libraryDetails?.building_number ||
                    ''}" required  maxlength="10" />
            </div>
            <div class="dialogRow" data-testid="library_springshare_id">
                <h3>Choose the Springshare Opening hours to associate with this Library</h3>
                <ul>
                     <li>
                        <input type="radio" name="library_springshare_id" id="library_springshare_id-0" value="0" checked />
                        <label for="library_springshare_id-0">None</label>
                     </li>
                        ${(!!springshareList &&
                            springshareList.length > 0 &&
                            springshareList
                                .map(springshareItem => {
                                    console.log('libraryDetails=', libraryDetails.library_springshare_id);
                                    console.log('springshareList s=', springshareItem);
                                    const checked =
                                        libraryDetails.library_springshare_id === springshareItem.id ? ' checked' : '';
                                    return `<li style="padding-block: 0.25rem">
                                    <input type="radio" name="library_springshare_id" id="library_springshare_id-${springshareItem.id}" data-testid="library_springshare_id-${springshareItem.id}" value="${springshareItem.id}"${checked} />
                                    <label for="library_springshare_id-${springshareItem.id}">${springshareItem.display_name}</label>
                                 </li>`;
                                })
                                .join('')) ||
                            ''}
                </ul>
            </div>
            <div class="dialogRow" data-testid="library_about_page_default">
                <label for="library_about_page_default">The "About" page for this library (usually the Drupal library page)</label>
                <input id="library_about_page_default" name="library_about_page_default" type="text" value="${libraryDetails?.library_about_page_default ||
                    ''}"  maxlength="255" />
            </div>
            `;
    }

    const saveNewLibrary = e => {
        const form = e.target.closest('form');
        console.log('saveNewLibrary form=', form);

        const formData = new FormData(form);
        const data = !!formData && Object.fromEntries(formData);
        console.log('saveNewLibrary data', data);

        // validate form
        const errorMessages = [];
        !data.library_name && errorMessages.push('Please enter the Library name');
        (!data.building_name || !data.building_number) && errorMessages.push('Please enter building name and number');
        const errorFound = errorMessages.length > 0;
        if (errorFound) {
            displayToastMessage(errorMessages.join('; '), true);
            return false;
        }

        closeDialog(e);
        showSavingProgress(true);

        const locationType = data?.locationType;
        const valuesToSend = {
            library_name: data.library_name,
            building_name: data.building_name,
            building_number: data.building_number,
            library_campus_id: data.library_campus_id,
            library_about_page_default: data.library_about_page_default,
            library_springshare_id: data.library_springshare_id,
        };

        const cypressTestCookie = cookies.hasOwnProperty('CYPRESS_TEST_DATA') ? cookies.CYPRESS_TEST_DATA : null;
        if (!!cypressTestCookie && window.location.host === 'localhost:2020' && cypressTestCookie === 'active') {
            setCookie('CYPRESS_DATA_SAVED', valuesToSend);
        }

        !!locationType &&
            actions
                .addBookableSpaceLocation(valuesToSend, locationType)
                .then(() => {
                    displayToastMessage('Library added', false);

                    actions.loadBookableSpaceCampusChildren();
                })
                .catch(e => {
                    console.log('catch: adding new library failed:', e);
                    displayToastMessage(
                        '[BSML-002] Sorry, an error occurred and the Location change did not save - the admins have been informed',
                    );
                })
                .finally(() => {
                    showSavingProgress(false);
                });
        return true;
    };

    function showAddLibraryForm(e, campusDetails) {
        const formBody = `<h2>Add a library to ${campusDetails?.campus_name || 'unknown'} campus</h2>
            ${libraryCoreForm()}
            <input id="libraryCampusId" name="library_campus_id" type="hidden" value="${campusDetails?.campus_id ||
                ''}" required  maxlength="10" />
            `;
        if (!formBody) {
            return;
        }

        const dialogBodyElement = document.getElementById('dialogBody');
        !!dialogBodyElement && (dialogBodyElement.innerHTML = formBody);

        const addNewButton = document.getElementById('addNewButton');
        !!addNewButton && (addNewButton.style.display = 'none');

        const deleteButton = document.getElementById('deleteButton');
        !!deleteButton && (deleteButton.style.display = 'none');

        const saveButton = document.getElementById('saveButton');
        !!saveButton && saveButton.removeEventListener('click', saveChangeToCampus);
        !!saveButton && saveButton.addEventListener('click', saveNewLibrary);

        const dialog = document.getElementById('popupDialog');
        !!dialog && dialog.showModal();
    }

    function deleteLibrary(e, libraryDetails) {
        const locationType = 'library';
        const locationId = libraryDetails?.library_id;
        const successMessage = `${libraryDetails?.library_name} deleted`;
        const failureMessage = `catch: deleting library ${locationId} failed:`;
        deleteGenericLocation(locationType, locationId, successMessage, failureMessage);
    }

    function showConfirmAndDeleteLibraryDialog(e, libraryDetails) {
        const line1 = `Do you really want to delete ${displayedLibraryName(libraryDetails)}?`;
        const line2 = 'This will also delete associated floors.';
        const confirmationOKButton = document.getElementById('confDialogOkButton');
        !!confirmationOKButton && confirmationOKButton.addEventListener('click', e => deleteLibrary(e, libraryDetails));
        showGenericConfirmAndDeleteDialog(line1, line2);
    }

    function showEditLibraryForm(libraryId, libraryCampusId) {
        const libraryDetails =
            libraryId > 0 &&
            campusList.flatMap(campus => campus.libraries).find(library => library.library_id === libraryId);

        if (!libraryDetails) {
            console.log(`Can't find library with library_id = "${libraryId}" in campus list from api`);
            displayToastMessage('Sorry, something went wrong');
            return;
        }

        const formBody = `<h2>Edit Library details</h2>
            <input name="libraryId" type="hidden" value="${libraryDetails?.library_id}" />
            <input name="ground_floor_id_old" type="hidden" value="${libraryDetails?.ground_floor_id ??
                ''}" />${libraryCoreForm(libraryDetails)}<div class="dialogRow" data-testid="library-floor-list">
                <h3>Floors - Choose ground floor:</h3>
                ${
                    libraryDetails?.floors?.length > 0
                        ? '<ul class="radioList">' +
                          libraryDetails?.floors
                              .map(floor => {
                                  const checked = floor.floor_id === libraryDetails.ground_floor_id ? ' checked' : '';
                                  return `<li>
                                            <input type="radio" id="groundFloor-${floor.floor_id}" name="ground_floor_id" ${checked} value="${floor.floor_id}" />
                                            <label for="groundFloor-${floor.floor_id}">Floor ${floor.floor_name}</label> 
                                        </li>`;
                              })
                              .join('') +
                          `<li>
                            <input type="radio" id="groundFloor-none" name="ground_floor_id" ${
                                !libraryDetails.ground_floor_id ? ' checked' : ''
                            } />
                            <label for="groundFloor-none">None</label> 
                        </li>
                    </ul>`
                        : ''
                }
                        
                ${libraryDetails?.floors?.length === 0 ? '<p>No floors</p>' : ''}
                </div>
                
                <div class="dialogRow" data-testid="library-campus-list">
                    <h3>Change Campus</h3>
                    <ul class="radioList" data-testid="change-campus">
                    ${campusList
                        .map(campus => {
                            const checked = campus.campus_id === libraryCampusId ? ' checked' : '';
                            return `<li>
                                    <input type="radio" id="chooseSite-${campus.campus_id}" name="campus_id" ${checked} value="${campus.campus_id}" />
                                    <label for="chooseSite-${campus.campus_id}">${campus.campus_name}</label> 
                                </li>`;
                        })
                        .join('')}
                    </ul>
                </div>`;

        const dialogBodyElement = document.getElementById('dialogBody');
        !!dialogBodyElement && (dialogBodyElement.innerHTML = formBody);

        const addNewButton = document.getElementById('addNewButton');
        !!addNewButton && (addNewButton.innerText = 'Add floor');
        const currentGroundFloorDetails = libraryDetails.floors.find(
            f => libraryDetails.ground_floor_id === f.floor_id,
        );
        !!addNewButton &&
            addNewButton.addEventListener('click', e => showAddFloorForm(e, libraryDetails, currentGroundFloorDetails));

        const saveButton = document.getElementById('saveButton');
        !!saveButton && saveButton.addEventListener('click', saveChangeToLibrary);

        const deleteButton = document.getElementById('deleteButton');
        !!deleteButton &&
            deleteButton.addEventListener('click', e => showConfirmAndDeleteLibraryDialog(e, libraryDetails));

        const dialog = document.getElementById('popupDialog');
        !!dialog && dialog.showModal();
    }

    /*
     * CAMPUS FUNCTIONS
     */
    const campusCoreForm = (campusDetails = {}) => {
        const campusNameFieldLabel = Object.keys(campusDetails).length === 0 ? 'New campus name' : 'Campus name';
        const formType = Object.keys(campusDetails).length === 0 ? 'add' : 'edit';
        const campusName = campusDetails?.campus_name ?? '';
        const campusNumber = campusDetails?.campus_number ?? '';
        return `<div>
            <input  name="locationType" type="hidden" value="campus" />
            <div class="dialogRow" data-testid="${formType}-campus-name">
                <label for="campusName">${campusNameFieldLabel} *</label>
                <input id="campusName" name="campus_name" type="text" value="${campusName}" required maxlength="255" />
            </div>
            <div class="dialogRow" data-testid="${formType}-campus-number">
                <label for="campusNumber">Campus number *</label>
                <input id="campusNumber" name="campus_number" type="text" value="${campusNumber}" required maxlength="10" />
            </div>
        </div>`;
    };

    const saveNewCampus = e => {
        const form = e.target.closest('form');

        const formData = new FormData(form);
        const data = !!formData && Object.fromEntries(formData);
        console.log('data=', data);

        // validate form
        if (!data.campus_name || !data.campus_number) {
            displayToastMessage('Please enter campus name and number', true);
            return false;
        }

        closeDialog(e);
        showSavingProgress(true);

        const locationType = data?.locationType;
        const valuesToSend = {
            campus_name: data.campus_name,
            campus_number: data.campus_number,
        };
        console.log('saveNewCampus valuesToSend', valuesToSend);

        const cypressTestCookie = cookies.hasOwnProperty('CYPRESS_TEST_DATA') ? cookies.CYPRESS_TEST_DATA : null;
        if (!!cypressTestCookie && window.location.host === 'localhost:2020' && cypressTestCookie === 'active') {
            setCookie('CYPRESS_DATA_SAVED', valuesToSend);
        }

        !!locationType &&
            actions
                .addBookableSpaceLocation(valuesToSend, locationType)
                .then(() => {
                    displayToastMessage('Campus added', false);
                    actions.loadBookableSpaceCampusChildren();
                })
                .catch(e => {
                    console.log('catch: adding new campus failed:', e);
                    displayToastMessage(
                        '[BSML-001] Sorry, an error occurred and the Location change did not save - the admins have been informed.',
                    );
                })
                .finally(() => {
                    showSavingProgress(false);
                });
        return true;
    };

    function showAddCampusForm() {
        const formBody = `<h2 data-testid="add-campus-heading">Add campus</h2>${campusCoreForm()}`;

        if (!!formBody) {
            const dialogBodyElement = document.getElementById('dialogBody');
            !!dialogBodyElement && (dialogBodyElement.innerHTML = formBody);

            const elementId = 'addNewButton';
            const addNewButton = document.getElementById(elementId);
            !!addNewButton && (addNewButton.style.display = 'none');

            const deleteButton = document.getElementById('deleteButton');
            !!deleteButton && (deleteButton.style.display = 'none');

            const dialog = document.getElementById('popupDialog');
            !!dialog && dialog.showModal();

            const saveButton = document.getElementById('saveButton');
            !!saveButton && saveButton.addEventListener('click', saveNewCampus);
        }
    }

    function deleteCampus(e, campusDetails) {
        console.log('deleteCampus', campusDetails);
        const locationType = 'campus';
        const locationId = campusDetails?.campus_id;
        const successMessage = `${campusDetails?.campus_name} campus deleted`;
        const failureMessage = `catch: deleting campus ${locationId} failed:`;
        console.log('deleteCampus', locationType, locationId);
        deleteGenericLocation(locationType, locationId, successMessage, failureMessage);
    }

    function showConfirmAndDeleteCampusDialog(e, campusDetails) {
        const line1 = `Do you really want to delete ${campusDetails.campus_name} campus?`;
        const line2 = 'This will also delete associated Libraries.';
        const confirmationOKButton = document.getElementById('confDialogOkButton');
        !!confirmationOKButton && confirmationOKButton.addEventListener('click', e => deleteCampus(e, campusDetails));
        showGenericConfirmAndDeleteDialog(line1, line2);
    }

    function showEditCampusForm(campusId) {
        const campusDetails = campusId > 0 && campusList.find(s => s.campus_id === campusId);

        if (!campusDetails) {
            console.log(`Can't find campus with campus_id = "${campusId}" in campuslist from api`);
            displayToastMessage('Sorry, something went wrong');
            return;
        }

        const formBody = `<h2 data-testid="edit-campus-dialog-heading">Edit campus details</h2>
            <input  name="campusId" type="hidden" value="${campusDetails.campus_id}" />${campusCoreForm(
            campusDetails,
        )}<div class="dialogRow">
                <h3 data-testid="campus-library-label">Libraries</h3>
                ${
                    campusDetails?.libraries?.length > 0
                        ? `<ul data-testid="campus-library-list">${campusDetails.libraries
                              .map(library => `<li>${displayedLibraryName(library)}</li>`)
                              .join('')}</ul>`
                        : ''
                }
                ${campusDetails?.libraries?.length === 0 ? '<p>No libraries</p>' : ''}
            </div>`;

        if (!!formBody) {
            const dialogBodyElement = document.getElementById('dialogBody');
            !!dialogBodyElement && (dialogBodyElement.innerHTML = formBody);

            const saveButton = document.getElementById('saveButton');
            !!saveButton && saveButton.addEventListener('click', saveChangeToCampus);

            const addNewButton = document.getElementById('addNewButton');
            !!addNewButton && (addNewButton.innerText = 'Add Library');
            !!addNewButton && addNewButton.addEventListener('click', e => showAddLibraryForm(e, campusDetails));

            const deleteButton = document.getElementById('deleteButton');
            !!deleteButton &&
                deleteButton.addEventListener('click', e => showConfirmAndDeleteCampusDialog(e, campusDetails));

            const dialog = document.getElementById('popupDialog');
            !!dialog && dialog.showModal();
        }
    }

    function getPageLayout(campusList) {
        return (
            <>
                {campusList.map(campus => [
                    <StyledRow
                        key={`campus-${campus.campus_id}`}
                        data-testid={'spaces-campus-entry'}
                        style={{ paddingLeft: '4rem' }}
                    >
                        <StyledEditButton
                            onClick={() => showEditCampusForm(campus.campus_id)}
                            aria-label={`Edit ${campus.campus_name} campus details`}
                            data-testid={`edit-campus-${campus.campus_id}-button`}
                        >
                            <span id={`campus-${campus.campus_id}`}>{campus.campus_name}</span>
                            <EditIcon />
                        </StyledEditButton>
                    </StyledRow>,
                    ...campus.libraries.flatMap(library => [
                        <StyledRow key={`library-${library.library_id}`} style={{ paddingLeft: '8rem' }}>
                            <StyledEditButton
                                color="primary"
                                onClick={() => showEditLibraryForm(library.library_id, campus.campus_id)}
                                aria-label={`Edit ${displayedLibraryName(library)} details`}
                                data-testid={`edit-library-${library.library_id}-button`}
                            >
                                <span id={`library-${library.library_id}`}>{`${displayedLibraryName(library)}`}</span>
                                <span style={{ paddingLeft: '0.5rem' }}>{`(${library.floors.length} ${pluralise(
                                    'Floor',
                                    library.floors.length,
                                )})`}</span>
                                <EditIcon />
                            </StyledEditButton>
                        </StyledRow>,
                        ...library.floors.map(floor => (
                            <StyledRow key={`location-floor-${floor.floor_id}`} style={{ paddingLeft: '12rem' }}>
                                <StyledEditButton
                                    color="primary"
                                    // onClick={() => showEditCampusForm(campus.campus_id)}
                                    onClick={() => showEditFloorForm(floor.floor_id)}
                                    aria-label={`Edit Floor ${floor.floor_name}`}
                                    data-testid={`edit-floor-${floor.floor_id}-button`}
                                >
                                    <span id={`floor-${floor.floor_id}`}>{floor.floor_name}</span>
                                    {library.ground_floor_id === floor.floor_id && (
                                        <StyledGroundFloorIndicatorSpan
                                            id={getIdentifierForFloorGroundFloorIndicator(floor.floor_id)}
                                            data-testid={getIdentifierForFloorGroundFloorIndicator(floor.floor_id)}
                                        >
                                            (Ground floor)
                                        </StyledGroundFloorIndicatorSpan>
                                    )}
                                    <EditIcon />
                                </StyledEditButton>
                            </StyledRow>
                        )),
                    ]),
                ])}
            </>
        );
    }

    return (
        <StandardPage title="Spaces">
            <HeaderBar pageTitle="Manage locations" currentPage="manage-locations" />

            <section aria-live="assertive">
                <StandardCard standardCardId="location-list-card" noPadding noHeader style={{ border: 'none' }}>
                    <Grid container spacing={3} style={{ position: 'relative' }}>
                        <Grid item xs={12} md={8} style={{ marginTop: '12px' }}>
                            {(() => {
                                if (!!savingProgressShown) {
                                    return <InlineLoader message="Saving" />;
                                } else if (!!campusListLoading) {
                                    return <InlineLoader message="Loading" />;
                                } else if (!!campusListError) {
                                    return <p>Something went wrong - please try again later.</p>;
                                } else if (!campusList || campusList.length === 0) {
                                    return <p>No spaces currently in system.</p>;
                                } else {
                                    return <div data-testid="spaces-location-wrapper">{getPageLayout(campusList)}</div>;
                                }
                            })()}
                        </Grid>
                        <Grid item xs={12} md={4} style={{ paddingTop: 0 }}>
                            <div style={{ padding: '1rem' }}>
                                <StyledButton
                                    className={'primary'}
                                    style={{ marginLeft: '2rem', marginTop: '2rem', textTransform: 'initial' }}
                                    children={'Add new Campus'}
                                    onClick={showAddCampusForm}
                                    data-testid="add-new-campus-button"
                                />
                            </div>
                        </Grid>
                    </Grid>
                </StandardCard>
                <dialog id="confirmationDialog" className="confirmationDialog" data-testid="confirmation-dialog">
                    <p id="confDialogMessage" data-testid="confirmation-dialog-message" />
                    <StyledConfirmationButtons>
                        <StyledButton
                            id="confDialogCancelButton"
                            className={'secondary'}
                            children={'No'}
                            data-testid="confirmation-dialog-reject-button"
                        />
                        <StyledButton
                            id="confDialogOkButton"
                            className={'primary'}
                            children={'Yes'}
                            data-testid="confirmation-dialog-accept-button"
                        />
                    </StyledConfirmationButtons>
                </dialog>
                <StyledMainDialog id={'popupDialog'} closedby="any" data-testid="main-dialog">
                    <form>
                        <div id="dialogBody" />
                        <div id="dialogFooter" className={'dialogFooter'}>
                            <div>
                                <StyledButton
                                    id={'deleteButton'}
                                    className={'alert'}
                                    children={'Delete'}
                                    data-testid="dialog-delete-button"
                                />
                            </div>
                            <div>
                                <StyledButton
                                    id={'addNewButton'}
                                    className={'secondary'}
                                    data-testid="dialog-addnew-button"
                                >
                                    Add new
                                </StyledButton>
                                <StyledButton
                                    className={'secondary'}
                                    children={'Cancel'}
                                    onClick={closeDialog}
                                    data-testid="dialog-cancel-button"
                                />
                                <StyledButton
                                    id={'saveButton'}
                                    className={'primary'}
                                    children={'Save'}
                                    data-testid="dialog-save-button"
                                />
                            </div>
                        </div>
                    </form>
                </StyledMainDialog>
            </section>
        </StandardPage>
    );
};

BookableSpacesManageLocations.propTypes = {
    actions: PropTypes.any,
    campusList: PropTypes.any,
    campusListLoading: PropTypes.any,
    campusListError: PropTypes.any,
    weeklyHours: PropTypes.any,
    weeklyHoursLoading: PropTypes.any,
    weeklyHoursError: PropTypes.any,
};

export default React.memo(BookableSpacesManageLocations);
