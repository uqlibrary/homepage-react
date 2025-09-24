import React from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

import EditIcon from '@mui/icons-material/Edit';

import { HeaderBar } from 'modules/Pages/Admin/BookableSpaces/HeaderBar';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { pluralise } from 'helpers/general';
import { addBreadcrumbsToSiteHeader, displayToastMessage } from '../helpers';

const StyledStandardCard = styled(StandardCard)(() => ({
    '& .MuiCardHeader-root': {
        paddingBottom: 0,
    },
    '& .MuiCardContent-root': {
        paddingBlock: 0,
    },
}));
const StyledMainDialog = styled('dialog')(({ theme }) => ({
    width: '80%',
    border: '1px solid rgba(38, 85, 115, 0.15)',
    maxWidth: '1136px',
    '& h2': {
        paddingInline: '1rem',
    },
    '& .dialogRow': {
        padding: '1rem',
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
    backgroundColor: theme.palette.primary.light,
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: theme.palette.primary.light,
    borderRadius: '.25rem',
    boxSizing: 'border-box',
    color: '#fff',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '.5rem',
    fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: 1,
    padding: '1rem 1.5rem',
    position: 'relative',
    textAlign: 'center',
    textDecoration: 'none',
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
const StyledGridItem = styled(Grid)(() => ({
    marginTop: '12px',
}));
const StyledBusyIconDiv = styled('div')(() => ({
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    opacity: '80%',
    zIndex: 99,
    position: 'absolute',
    top: 0,
    paddingTop: '4rem',
    marginTop: '12px',
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

export const BookableSpacesManageLocations = ({ actions, campusList, campusListLoading, campusListError }) => {
    React.useEffect(() => {
        addBreadcrumbsToSiteHeader([
            '<li class="uq-breadcrumb__item"><span class="uq-breadcrumb__link">Location management</span></li>',
        ]);

        if (campusListError === null && campusListLoading === null && campusList === null) {
            actions.loadBookableSpaceCampusChildren();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function showBusyIcon(id) {
        const busyWhileSavingIcon = document.getElementById(id);
        !!busyWhileSavingIcon && (busyWhileSavingIcon.style.display = 'block');
        return busyWhileSavingIcon;
    }

    function hideBusyIcon(busyWhileSavingIcon) {
        !!busyWhileSavingIcon && (busyWhileSavingIcon.style.display = 'none');
    }

    function removeAnyListeners(element) {
        if (!element) {
            return false;
        }
        // we cant actually generically remove listeners - but we can start form scratch
        const clonedElement = element.cloneNode(true);
        element.replaceWith(clonedElement);
        return clonedElement;
    }

    function closeDialog(e = null) {
        const dialog = !e ? document.getElementById('popupDialog') : e.target.closest('dialog');
        !!dialog && dialog.close();

        const dialogBodyElement = document.getElementById('dialogBody');
        !!dialogBodyElement && (dialogBodyElement.innerHTML = '');

        const addNewButton = document.getElementById('addNewButton');
        !!addNewButton && (addNewButton.innerText = 'Add new');
        !!addNewButton && (addNewButton.style.display = 'inline');
        removeAnyListeners(addNewButton);

        const deleteButton = document.getElementById('deleteButton');
        !!deleteButton && (deleteButton.style.display = 'inline');
        removeAnyListeners(deleteButton);

        const saveButton = document.getElementById('saveButton');
        removeAnyListeners(saveButton);
    }

    function saveNewSite(e) {
        const form = e.target.closest('form');

        const formData = new FormData(form);
        const data = !!formData && Object.fromEntries(formData);
        console.log('saveNewSite data', data);
        const locationType = data?.locationType;

        // validate form
        if (!data.campus_name || !data.campus_id_displayed) {
            displayToastMessage('Please enter campus name and number', true);
            return false;
        }

        closeDialog(e);

        const busyWhileSavingIcon = showBusyIcon('busy-icon-while-saving');
        !!locationType &&
            actions
                .addBookableSpaceLocation(data)
                .then(() => {
                    displayToastMessage('Campus added', false);

                    actions.loadBookableSpaceCampusChildren();
                })
                .catch(e => {
                    console.log('catch: adding new campus failed:', e);
                    displayToastMessage('Sorry, an error occurred - the admins have been informed');
                })
                .finally(() => {
                    hideBusyIcon(busyWhileSavingIcon);
                });
    }

    const campusFormCore = (campusDetails = {}, formType = 'add') => {
        const campusName = campusDetails?.campus_name ?? '';
        const campusIdDisplayed = campusDetails?.campus_id_displayed ?? '';
        return `<div>
            <input  name="locationType" type="hidden" value="campus" />
            <div class="dialogRow" data-testid="${formType}-campus-name">
                <label for="campusName">Campus name</label>
                <input id="campusName" name="campus_name" type="text" value="${campusName}" required maxlength="255" />
            </div>
            <div class="dialogRow" data-testid="${formType}-campus-number">
                <label for="campusNumber">Campus number</label>
                <input id="campusNumber" name="campus_id_displayed" type="text" value="${campusIdDisplayed}" required maxlength="10" />
            </div>
        </div>`;
    };

    function saveNewBuilding(e) {
        const form = e.target.closest('form');
        console.log('saveNewBuilding form=', form);

        const formData = new FormData(form);
        const data = !!formData && Object.fromEntries(formData);
        console.log('saveNewBuilding data', data);
        const locationType = data?.locationType;

        // validate form
        if (!data.building_name || !data.building_id_displayed) {
            displayToastMessage('Please enter building name and number', true);
            return false;
        }

        closeDialog(e);

        const busyWhileSavingIcon = showBusyIcon('busy-icon-while-saving');
        !!locationType &&
            actions
                .addBookableSpaceLocation(data)
                .then(() => {
                    displayToastMessage('Building added', false);

                    actions.loadBookableSpaceCampusChildren();
                })
                .catch(e => {
                    console.log('catch: adding new building failed:', e);
                    displayToastMessage('Sorry, an error occurred - the admins have been informed');
                })
                .finally(() => {
                    hideBusyIcon(busyWhileSavingIcon);
                });
    }

    const saveChangeToSite = e => {
        const form = e.target.closest('form');

        const formData = new FormData(form);
        const data = !!formData && Object.fromEntries(formData);
        console.log('saveChangeToSite data=', data);
        const locationType = data?.locationType;
        const locationId = data[`${locationType}Id`];

        // validate form
        const failureMessage =
            (!data.campus_name || !data.campus_id_displayed) && 'Please enter campus name and number';
        if (!!failureMessage) {
            displayToastMessage(failureMessage, true);
            return false;
        }

        const busyWhileSavingIcon = showBusyIcon('busy-icon-while-saving');
        closeDialog(e);

        !!locationType &&
            !!locationId &&
            actions
                .updateBookableSpaceLocation(Object.fromEntries(formData))
                .then(() => {
                    displayToastMessage('Change to campus saved', false);
                    actions.loadBookableSpaceCampusChildren();
                })
                .catch(e => {
                    console.log('catch: saving campus ', locationId, 'failed:', e);
                    displayToastMessage('Sorry, an error occurred - the admins have been informed');
                })
                .finally(() => {
                    hideBusyIcon(busyWhileSavingIcon);
                });
    };

    function buildingCoreForm(buildingDetails = {}) {
        return `<input name="locationType" type="hidden" value="building" />
            <div class="dialogRow" data-testid="building-name">
                <label for="buildingName">Building name</label>
                <input id="buildingName" name="building_name" type="text" value="${buildingDetails?.building_name ||
                    ''}" required  maxlength="255" />
            </div>
            <div class="dialogRow" data-testid="building-number">
                <label for="buildingNumber">Building number</label>
                <input id="buildingNumber" name="building_id_displayed" type="text" value="${buildingDetails?.building_id_displayed ||
                    ''}" required  maxlength="10" />
            </div>`;
    }

    function showAddBuildingForm(e, campusDetails) {
        console.log('showAddBuildingForm');
        const formBody = `<h2>Add a building to ${campusDetails?.campus_name ||
            'unknown'} campus</h2>${buildingCoreForm()}`;
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
        !!saveButton && saveButton.removeEventListener('click', saveChangeToSite);
        !!saveButton && saveButton.addEventListener('click', saveNewBuilding);

        const dialog = document.getElementById('popupDialog');
        !!dialog && dialog.showModal();
    }

    function closeDeletionConfirmation() {
        const dialog = document.getElementById('confirmationDialog');
        !!dialog && dialog.close();

        const confirmationCancelButton = document.getElementById('confDialogCancelButton');
        removeAnyListeners(confirmationCancelButton);

        const confirmationOKButton = document.getElementById('confDialogOkButton');
        removeAnyListeners(confirmationOKButton);
    }

    function deleteLocation(locationType, locationId, successMessage, failureMessage) {
        console.log('deleteLocation', locationType, locationId);
        const busyWhileSavingIcon = showBusyIcon('busy-icon-while-saving');

        closeDeletionConfirmation(); // close delete conf dialog
        closeDialog(); // close main dialog

        !!locationType &&
            !!locationId &&
            actions
                .deleteBookableSpaceLocation({ locationType, locationId })
                .then(() => {
                    console.log('deleteLocation then');
                    displayToastMessage(successMessage, false);
                    actions.loadBookableSpaceCampusChildren();
                })
                .catch(e => {
                    console.log(failureMessage, e);
                    displayToastMessage('Sorry, an error occurred - the admins have been informed');
                })
                .finally(() => {
                    hideBusyIcon(busyWhileSavingIcon);
                });
    }

    function deleteSite(e, campusDetails) {
        console.log('deleteSite', campusDetails);
        const locationType = 'campus';
        const locationId = campusDetails?.campus_id;
        const successMessage = `${campusDetails?.campus_name} campus deleted`;
        const failureMessage = `catch: deleting campus ${locationId} failed:`;
        console.log('deleteSite', locationType, locationId);
        deleteLocation(locationType, locationId, successMessage, failureMessage);
    }

    function deleteBuilding(e, buildingDetails) {
        const locationType = 'building';
        const locationId = buildingDetails?.building_id;
        const successMessage = `${buildingDetails?.building_name} deleted`;
        const failureMessage = `catch: deleting building ${locationId} failed:`;
        deleteLocation(locationType, locationId, successMessage, failureMessage);
    }

    function deleteFloor(e, floorDetails) {
        console.log('floorDetails=', floorDetails);
        const locationType = 'floor';
        const locationId = floorDetails?.floor_id;
        const successMessage = `Floor ${floorDetails?.floor_name} in ${floorDetails?.building_name} deleted`;
        const failureMessage = `catch: deleting floor ${floorDetails.floor_id} failed:`;
        deleteLocation(locationType, locationId, successMessage, failureMessage);
    }

    function confirmAndDeleteLocation(line1, line2) {
        const confirmationMessageElement = document.getElementById('confDialogMessage');
        !!confirmationMessageElement && (confirmationMessageElement.innerHTML = `<p>${line1}</p><p>${line2}</p>`);

        const confirmationCancelButton = document.getElementById('confDialogCancelButton');
        !!confirmationCancelButton && confirmationCancelButton.addEventListener('click', closeDeletionConfirmation);

        const dialog = document.getElementById('confirmationDialog');
        !!dialog && dialog.showModal();
    }

    function confirmAndDeleteSite(e, campusDetails) {
        const line1 = `Do you really want to delete ${campusDetails.campus_name} campus?`;
        const line2 = 'This will also delete associated buildings.';
        const confirmationOKButton = document.getElementById('confDialogOkButton');
        !!confirmationOKButton && confirmationOKButton.addEventListener('click', e => deleteSite(e, campusDetails));
        confirmAndDeleteLocation(line1, line2);
    }

    function confirmAndDeleteBuilding(e, buildingDetails) {
        const line1 = `Do you really want to delete ${buildingDetails.building_name}?`;
        const line2 = 'This will also delete associated floors.';
        const confirmationOKButton = document.getElementById('confDialogOkButton');
        !!confirmationOKButton &&
            confirmationOKButton.addEventListener('click', e => deleteBuilding(e, buildingDetails));
        confirmAndDeleteLocation(line1, line2);
    }

    function confirmAndDeleteFloor(e, floorDetails) {
        const line1 = `Do you really want to delete floor ${floorDetails.floor_name}?`;
        const line2 = 'This will also delete associated rooms.';
        const confirmationOKButton = document.getElementById('confDialogOkButton');
        !!confirmationOKButton && confirmationOKButton.addEventListener('click', e => deleteFloor(e, floorDetails));
        confirmAndDeleteLocation(line1, line2);
    }

    function showEditSiteForm(campusId) {
        const campusDetails = campusId > 0 && campusList.find(s => s.campus_id === campusId);

        if (!campusDetails) {
            console.log(`Can't find campus with campus_id = "${campusId}" in campuslist from api`);
            displayToastMessage('Sorry, something went wrong');
            return;
        }

        const formBody = `<h2 data-testid="edit-campus-dialog-heading">Edit campus details</h2>
            <input  name="campusId" type="hidden" value="${campusDetails.campus_id}" />${campusFormCore(
            campusDetails,
            'edit',
        )}<div class="dialogRow">
                <h3 data-testid="campus-building-label">Buildings</h3>
                ${
                    campusDetails?.buildings?.length > 0
                        ? `<ul data-testid="campus-building-list">${campusDetails.buildings
                              .map(
                                  building => `<li>${building.building_name} (${building.building_id_displayed}) </li>`,
                              )
                              .join('')}</ul>`
                        : ''
                }
                ${campusDetails?.buildings?.length === 0 ? '<p>No buildings</p>' : ''}
            </div>`;

        if (!!formBody) {
            const dialogBodyElement = document.getElementById('dialogBody');
            !!dialogBodyElement && (dialogBodyElement.innerHTML = formBody);

            const saveButton = document.getElementById('saveButton');
            !!saveButton && saveButton.addEventListener('click', saveChangeToSite);

            const addNewButton = document.getElementById('addNewButton');
            !!addNewButton && (addNewButton.innerText = 'Add building');
            !!addNewButton && addNewButton.addEventListener('click', e => showAddBuildingForm(e, campusDetails));

            const deleteButton = document.getElementById('deleteButton');
            !!deleteButton && deleteButton.addEventListener('click', e => confirmAndDeleteSite(e, campusDetails));

            const dialog = document.getElementById('popupDialog');
            !!dialog && dialog.showModal();
        }
    }

    const saveChangeToBuilding = e => {
        const form = e.target.closest('form');

        const formData = new FormData(form);
        const data = !!formData && Object.fromEntries(formData);
        console.log('saveChangeToBuilding data=', data);
        const locationType = data?.locationType;
        const locationId = data[`${locationType}Id`];

        // validate form
        const failureMessage =
            (!data.building_name || !data.building_id_displayed) && 'Please enter building name and number';
        if (!!failureMessage) {
            displayToastMessage(failureMessage, true);
            return false;
        }

        const busyWhileSavingIcon = showBusyIcon('busy-icon-while-saving');
        closeDialog(e);

        !!locationType &&
            !!locationId &&
            actions
                .updateBookableSpaceLocation(Object.fromEntries(formData))
                .then(() => {
                    displayToastMessage('Change to building saved', false);
                    actions.loadBookableSpaceCampusChildren();
                })
                .catch(e => {
                    console.log('catch: saving building ', locationId, 'failed:', e);
                    displayToastMessage('Sorry, an error occurred - the admins have been informed');
                })
                .finally(() => {
                    hideBusyIcon(busyWhileSavingIcon);
                });
    };

    function saveNewFloor(e) {
        const form = e.target.closest('form');
        console.log('saveNewFloor form=', form);

        const formData = new FormData(form);
        const data = !!formData && Object.fromEntries(formData);
        console.log('saveNewFloor data', data);
        const locationType = data?.locationType;

        // validate form
        if (!data.floor_name) {
            displayToastMessage('Please enter floor name', true);
            return false;
        }

        const busyWhileSavingIcon = showBusyIcon('busy-icon-while-saving');
        closeDialog(e);

        !!locationType &&
            actions
                .addBookableSpaceLocation(data)
                .then(newFloor => {
                    if (!!data.isGroundFloor && data?.isGroundFloor === 'Y') {
                        const buildingData = {
                            locationType: 'building',
                            buildingId: data.buildingId,
                            ground_floor_id: newFloor.data.floor_id,
                        };
                        return actions.updateBookableSpaceLocation(buildingData);
                    } else {
                        return true;
                    }
                })
                .then(() => {
                    displayToastMessage('Floor added', false);

                    actions.loadAllBookableSpacesRooms();
                })
                .catch(e => {
                    console.log('catch: adding new floor failed:', e);
                    displayToastMessage('Sorry, an error occurred - the admins have been informed');
                })
                .finally(() => {
                    hideBusyIcon(busyWhileSavingIcon);
                });
    }

    const floorCoreForm = floorDetails => `<input name="locationType" type="hidden" value="floor" />
        <div class="dialogRow" data-testid="floor-name">
            <label for="displayedFloorId">Floor name</label>
            <input id="displayedFloorId" name="floor_name" type="text" required value="${floorDetails?.floor_name ??
                ''}"  maxlength="10" />
        </div>`;

    function showAddFloorForm(e, buildingDetails, currentGroundFloorDetails) {
        const groundFloorDescription = !!currentGroundFloorDetails
            ? `Current ground floor is Floor ${currentGroundFloorDetails.floor_name}`
            : 'No floor is currently marked as the ground floor';
        const formBody = `<h2>Add a floor to ${buildingDetails?.building_name || 'unknown building'}</h2>
            <input name="buildingId" type="hidden" value="${buildingDetails?.building_id}" />
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
        !!saveButton && saveButton.removeEventListener('click', saveChangeToBuilding);
        !!saveButton && saveButton.addEventListener('click', saveNewFloor);

        const dialog = document.getElementById('popupDialog');
        !!dialog && dialog.showModal();
    }

    function showEditBuildingForm(buildingId, buildingSiteId) {
        const buildingDetails =
            buildingId > 0 &&
            campusList.flatMap(campus => campus.buildings).find(building => building.building_id === buildingId);

        if (!buildingDetails) {
            console.log(`Can't find building with building_id = "${buildingId}" in campus list from api`);
            displayToastMessage('Sorry, something went wrong');
            return;
        }

        const formBody = `<h2>Edit building details</h2>
            <input name="buildingId" type="hidden" value="${buildingDetails?.building_id}" />
            <input name="ground_floor_id_old" type="hidden" value="${buildingDetails?.ground_floor_id ??
                ''}" />${buildingCoreForm(buildingDetails)}<div class="dialogRow" data-testid="building-floor-list">
                <h3>Floors - Choose ground floor:</h3>
                ${buildingDetails?.floors?.length > 0 &&
                    '<ul class="radioList">' +
                        buildingDetails?.floors
                            .map(floor => {
                                const checked = floor.floor_id === buildingDetails.ground_floor_id ? ' checked' : '';
                                return `<li>
                                            <input type="radio" id="groundFloor-${floor.floor_id}" name="ground_floor_id" ${checked} value="${floor.floor_id}" />
                                            <label for="groundFloor-${floor.floor_id}">Floor ${floor.floor_name}</label> 
                                        </li>`;
                            })
                            .join('') +
                        `<li>
                            <input type="radio" id="groundFloor-none" name="ground_floor_id" ${
                                !buildingDetails.ground_floor_id ? ' checked' : ''
                            } />
                            <label for="groundFloor-none">None</label> 
                        </li>
                    </ul>`}
                        
                ${buildingDetails?.floors?.length === 0 ? '<p>No floors</p>' : ''}
                </div>
                
                <div class="dialogRow" data-testid="building-campus-list">
                    <h3>Change Campus</h3>
                    <ul class="radioList" data-testid="change-campus">
                    ${campusList
                        .map(campus => {
                            const checked = campus.campus_id === buildingSiteId ? ' checked' : '';
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
        const currentGroundFloorDetails = buildingDetails.floors.find(
            f => buildingDetails.ground_floor_id === f.floor_id,
        );
        !!addNewButton &&
            addNewButton.addEventListener('click', e =>
                showAddFloorForm(e, buildingDetails, currentGroundFloorDetails),
            );

        const saveButton = document.getElementById('saveButton');
        !!saveButton && saveButton.addEventListener('click', saveChangeToBuilding);

        const deleteButton = document.getElementById('deleteButton');
        !!deleteButton && deleteButton.addEventListener('click', e => confirmAndDeleteBuilding(e, buildingDetails));

        const dialog = document.getElementById('popupDialog');
        !!dialog && dialog.showModal();
    }

    const saveChangeToFloor = e => {
        const form = e.target.closest('form');

        const formData = new FormData(form);
        const data = !!formData && Object.fromEntries(formData);
        console.log('saveChangeToFloor data=', data);
        const locationType = data?.locationType;
        const locationId = data[`${locationType}Id`];

        // validate form
        const failureMessage = !data.floor_name && 'Please enter floor name';
        if (!!failureMessage) {
            displayToastMessage(failureMessage, true);
            return false;
        }

        const busyWhileSavingIcon = showBusyIcon('busy-icon-while-saving');
        closeDialog(e);

        !!locationType &&
            !!locationId &&
            actions
                .updateBookableSpaceLocation(Object.fromEntries(formData))
                .then(() => {
                    displayToastMessage('Changes to floor saved', false);
                    actions.loadBookableSpaceCampusChildren();
                })
                .catch(e => {
                    console.log('catch: saving floor ', locationId, 'failed:', e);
                    displayToastMessage('Sorry, an error occurred - the admins have been informed');
                })
                .finally(() => {
                    hideBusyIcon(busyWhileSavingIcon);
                });
    };

    function showEditFloorForm(floorId) {
        const floorDetails =
            floorId > 0 &&
            (() => {
                for (const campus of campusList) {
                    for (const building of campus.buildings) {
                        const floor = building.floors.find(floor => floor.floor_id === floorId);
                        if (floor) {
                            return {
                                ...floor,
                                building_name: building.building_name,
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
        !!deleteButton && deleteButton.addEventListener('click', e => confirmAndDeleteFloor(e, floorDetails));

        const dialog = document.getElementById('popupDialog');
        !!dialog && dialog.showModal();
    }

    function showAddSiteForm() {
        const formBody = `<h2 data-testid="add-campus-heading">Add campus</h2>${campusFormCore()}`;

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
            !!saveButton && saveButton.addEventListener('click', saveNewSite);
        }
    }

    function getLocationLayout(campusList) {
        return (
            <>
                {campusList.map(campus => [
                    <StyledRow
                        key={`campus-${campus.campus_id}`}
                        data-testid={'spaces-campus-entry'}
                        style={{ paddingLeft: '4rem' }}
                    >
                        <StyledEditButton
                            onClick={() => showEditSiteForm(campus.campus_id)}
                            aria-label={`Edit ${campus.campus_name} campus details`}
                            data-testid={`edit-campus-${campus.campus_id}-button`}
                        >
                            <span id={`campus-${campus.campus_id}`}>{campus.campus_name}</span>
                            <EditIcon />
                        </StyledEditButton>
                    </StyledRow>,
                    ...campus.buildings.flatMap(building => [
                        <StyledRow key={`building-${building.building_id}`} style={{ paddingLeft: '8rem' }}>
                            <StyledEditButton
                                color="primary"
                                onClick={() => showEditBuildingForm(building.building_id, campus.campus_id)}
                                aria-label={`Edit ${building.building_name} details`}
                                data-testid={`edit-building-${building.building_id}-button`}
                            >
                                <span id={`building-${building.building_id}`}>{`${building.building_name}`}</span>
                                <span style={{ paddingLeft: '0.5rem' }}>{`(${building.floors.length} ${pluralise(
                                    'Floor',
                                    building.floors.length,
                                )})`}</span>
                                <EditIcon />
                            </StyledEditButton>
                        </StyledRow>,
                        ...building.floors.map(floor => (
                            <StyledRow key={`location-floor-${floor.floor_id}`} style={{ paddingLeft: '12rem' }}>
                                <StyledEditButton
                                    color="primary"
                                    // onClick={() => showEditSiteForm(campus.campus_id)}
                                    onClick={() => showEditFloorForm(floor.floor_id)}
                                    aria-label={`Edit Floor ${floor.floor_name}`}
                                    data-testid={`edit-floor-${floor.floor_id}-button`}
                                >
                                    <span id={`floor-${floor.floor_id}`}>{floor.floor_name}</span>
                                    {building.ground_floor_id === floor.floor_id && (
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
                <StyledButton
                    className={'primary'}
                    style={{ marginLeft: '4rem', marginTop: '2rem' }}
                    children={'Add new Campus'}
                    onClick={showAddSiteForm}
                    data-testid="add-new-campus-button"
                />
            </>
        );
    }

    return (
        <StandardPage title="Spaces">
            <HeaderBar pageTitle="Manage locations" currentPage="manage-locations" />

            <section aria-live="assertive">
                <StandardCard standardCardId="location-list-card" noPadding noHeader style={{ border: 'none' }}>
                    <Grid container spacing={3} style={{ position: 'relative' }}>
                        {(() => {
                            if (!!campusListLoading) {
                                return (
                                    <StyledGridItem item xs={12} md={9}>
                                        <InlineLoader message="Loading" />
                                    </StyledGridItem>
                                );
                            } else if (!!campusListError) {
                                return (
                                    <StyledGridItem item xs={12} md={9}>
                                        <StyledStandardCard fullHeight>
                                            <p>Something went wrong - please try again later.</p>
                                        </StyledStandardCard>
                                    </StyledGridItem>
                                );
                            } else if (!campusList || campusList.length === 0) {
                                return (
                                    <StyledGridItem item xs={12} md={9}>
                                        <StyledStandardCard fullHeight>
                                            <p>No spaces currently in system - please try again soon.</p>
                                        </StyledStandardCard>
                                    </StyledGridItem>
                                );
                            } else {
                                return (
                                    <StyledGridItem data-testid="spaces-location-wrapper">
                                        {getLocationLayout(campusList)}
                                    </StyledGridItem>
                                );
                            }
                        })()}
                        <StyledBusyIconDiv id="busy-icon-while-saving" style={{ display: 'none' }}>
                            <InlineLoader message="Saving" />
                        </StyledBusyIconDiv>
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
                            children={'primary'}
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
};

export default React.memo(BookableSpacesManageLocations);
