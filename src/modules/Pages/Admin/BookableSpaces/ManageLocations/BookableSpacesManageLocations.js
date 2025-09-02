import React from 'react';
import PropTypes from 'prop-types';

import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

import EditIcon from '@mui/icons-material/Edit';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { breadcrumbs } from 'config/routes';
import { pluralise } from 'helpers/general';

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
    height: '80%',
    border: '1px solid rgba(38, 85, 115, 0.15)',
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

export const BookableSpacesManageLocations = ({ actions, siteList, siteListLoading, siteListError }) => {
    React.useEffect(() => {
        const siteHeader = document.querySelector('uq-site-header');
        !!siteHeader && siteHeader.setAttribute('secondleveltitle', breadcrumbs.bookablespacesadmin.title);
        !!siteHeader && siteHeader.setAttribute('secondLevelUrl', breadcrumbs.bookablespacesadmin.pathname);

        if (siteListError === null && siteListLoading === null && siteList === null) {
            actions.loadBookableSpaceSites();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function displayToastMessage(message, isError = true) {
        const backgroundColor = isError ? '#D62929' : '#4aa74e';
        const icon = isError
            ? 'url("data:image/svg+xml,%3csvg viewBox=%270 0 24 24%27 fill=%27none%27 xmlns=%27http://www.w3.org/2000/svg%27%3e%3cpath d=%27M20.127 18.545a1.18 1.18 0 0 1-1.055 1.706H4.929a1.18 1.18 0 0 1-1.055-1.706l7.072-14.143a1.179 1.179 0 0 1 2.109 0l7.072 14.143Z%27 stroke=%27%23fff%27 stroke-width=%271.5%27%3e%3c/path%3e%3cpath d=%27M12 9v4%27 stroke=%27%23fff%27 stroke-width=%271.5%27 stroke-linecap=%27round%27%3e%3c/path%3e%3ccircle cx=%2711.9%27 cy=%2716.601%27 r=%271.1%27 fill=%27%23fff%27%3e%3c/circle%3e%3c/svg%3e")'
            : 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27%23fff%27 viewBox=%270 0 16 16%27%3E%3Cg stroke=%27%23fff%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%27.75%27%3E%3Cpath fill=%27none%27 d=%27M9.258 10.516h-.43A.829.829 0 0 1 8 9.687V7.602c0-.23-.2-.43-.43-.43h-.425%27/%3E%3Cpath d=%27M7.8 5.059a.194.194 0 0 0-.198.199c0 .113.085.199.199.199a.195.195 0 0 0 .199-.2.195.195 0 0 0-.2-.198zm0 0%27/%3E%3Cpath fill=%27none%27 d=%27M8 1.715c3.457 0 6.285 2.828 6.285 6.285 0 3.457-2.828 6.285-6.285 6.285-3.457 0-6.285-2.828-6.285-6.285 0-3.457 2.828-6.285 6.285-6.285zm0 0%27/%3E%3C/g%3E%3C/svg%3E")';
        const html = `
            <style id="locations-toast-styles">
                body {
                    position: relative;
                }
                .toast {
                    background-color: ${backgroundColor};
                    color: #fff;
                    padding: .5rem 1.5rem .5rem 2.5rem;
                    background-image: ${icon};
                    background-repeat: no-repeat;
                    background-size: 1.5rem;
                    background-position: 0.75rem center;
                    position: fixed;
                    bottom: 0.5rem;
                    left: 0.5rem;
                    transition: opacity 500ms ease-out;
                    p {
                        font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                        font-size: 1rem;
                        font-weight: 400;
                        letter-spacing: 0.16px;
                        line-height: 25.6px;
                    }
                }
            </style>
            <div id="toast-corner-message" class="toast" data-testid="toast-corner-message">
                <p>${message}</p>
            </div>
        `;

        const template = document.createElement('template');
        !!html && !!template && (template.innerHTML = html);
        const body = document.querySelector('body');
        !!body && !!template && body.appendChild(template.content.cloneNode(true));
        const hideDelay = 3000;
        setTimeout(() => {
            const toast = document.getElementById('toast-corner-message');
            !!toast && (toast.style.opacity = 0);
        }, hideDelay);
        setTimeout(() => {
            const toast = document.getElementById('toast-corner-message');
            !!toast && toast.remove();
            const styles = document.getElementById('locations-toast-styles');
            !!styles && styles.remove();
        }, hideDelay + 1000);
    }

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
        if (!data.site_name || !data.site_id_displayed) {
            displayToastMessage('Please enter site name and number', true);
            return false;
        }

        closeDialog(e);

        const busyWhileSavingIcon = showBusyIcon('busy-icon-while-saving');
        !!locationType &&
            actions
                .addBookableSpaceLocation(data)
                .then(() => {
                    displayToastMessage('Site added', false);

                    actions.loadBookableSpaceSites();
                })
                .catch(e => {
                    console.log('catch: adding new site failed:', e);
                    displayToastMessage('Sorry, an error occurred - the admins have been informed');
                })
                .finally(() => {
                    hideBusyIcon(busyWhileSavingIcon);
                });
    }

    const siteFormCore = (siteDetails = {}, formType = 'add') => {
        const siteName = siteDetails?.site_name ?? '';
        const siteIdDisplayed = siteDetails?.site_id_displayed ?? '';
        return `<div>
            <input  name="locationType" type="hidden" value="site" />
            <div class="dialogRow" data-testid="${formType}-campus-name">
                <label for="siteName">Site name</label>
                <input id="siteName" name="site_name" type="text" value="${siteName}" required maxlength="255" />
            </div>
            <div class="dialogRow" data-testid="${formType}-campus-number">
                <label for="siteNumber">Site number</label>
                <input id="siteNumber" name="site_id_displayed" type="text" value="${siteIdDisplayed}" required maxlength="10" />
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

                    actions.loadBookableSpaceSites();
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
        const failureMessage = (!data.site_name || !data.site_id_displayed) && 'Please enter site name and number';
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
                    displayToastMessage('Change to site saved', false);
                    actions.loadBookableSpaceSites();
                })
                .catch(e => {
                    console.log('catch: saving site ', locationId, 'failed:', e);
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
                    ''}" required />
            </div>
            <div class="dialogRow" data-testid="building-number">
                <label for="buildingNumber">Building number</label>
                <input id="buildingNumber" name="building_id_displayed" type="text" value="${buildingDetails?.building_id_displayed ||
                    ''}" required />
            </div>`;
    }

    function showAddBuildingForm(e, siteDetails) {
        console.log('showAddBuildingForm');
        const formBody = `<h2>Add a building to ${siteDetails?.site_name ||
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
                    actions.loadBookableSpaceSites();
                })
                .catch(e => {
                    console.log(failureMessage, e);
                    displayToastMessage('Sorry, an error occurred - the admins have been informed');
                })
                .finally(() => {
                    hideBusyIcon(busyWhileSavingIcon);
                });
    }

    function deleteSite(e, siteDetails) {
        console.log('deleteSite', siteDetails);
        const locationType = 'site';
        const locationId = siteDetails?.site_id;
        const successMessage = `${siteDetails?.site_name} campus deleted`;
        const failureMessage = `catch: deleting site ${locationId} failed:`;
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
        const successMessage = `Floor ${floorDetails?.floor_id_displayed} in ${floorDetails?.building_name} deleted`;
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

    function confirmAndDeleteSite(e, siteDetails) {
        const line1 = `Do you really want to delete ${siteDetails.site_name} campus?`;
        const line2 = 'This will also delete associated buildings.';
        const confirmationOKButton = document.getElementById('confDialogOkButton');
        !!confirmationOKButton && confirmationOKButton.addEventListener('click', e => deleteSite(e, siteDetails));
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
        const line1 = `Do you really want to delete floor ${floorDetails.floor_id_displayed}?`;
        const line2 = 'This will also delete associated rooms.';
        const confirmationOKButton = document.getElementById('confDialogOkButton');
        !!confirmationOKButton && confirmationOKButton.addEventListener('click', e => deleteFloor(e, floorDetails));
        confirmAndDeleteLocation(line1, line2);
    }

    function showEditSiteForm(siteId) {
        const siteDetails = siteId > 0 && siteList.find(s => s.site_id === siteId);

        if (!siteDetails) {
            console.log(`Can't find site with site_id = "${siteId}" in sitelist from api`);
            displayToastMessage('Sorry, something went wrong');
            return;
        }

        const formBody = `<h2 data-testid="edit-campus-dialog-heading">Edit campus details</h2>
            <input  name="siteId" type="hidden" value="${siteDetails.site_id}" />${siteFormCore(
            siteDetails,
            'edit',
        )}<div class="dialogRow">
                <h3 data-testid="campus-building-label">Buildings</h3>
                ${
                    siteDetails?.buildings?.length > 0
                        ? `<ul data-testid="campus-building-list">${siteDetails.buildings
                              .map(
                                  building => `<li>${building.building_name} (${building.building_id_displayed}) </li>`,
                              )
                              .join('')}</ul>`
                        : ''
                }
                ${siteDetails?.buildings?.length === 0 ? '<p>No buildings</p>' : ''}
            </div>`;

        if (!!formBody) {
            const dialogBodyElement = document.getElementById('dialogBody');
            !!dialogBodyElement && (dialogBodyElement.innerHTML = formBody);

            const saveButton = document.getElementById('saveButton');
            !!saveButton && saveButton.addEventListener('click', saveChangeToSite);

            const addNewButton = document.getElementById('addNewButton');
            !!addNewButton && (addNewButton.innerText = 'Add building');
            !!addNewButton && addNewButton.addEventListener('click', e => showAddBuildingForm(e, siteDetails));

            const deleteButton = document.getElementById('deleteButton');
            !!deleteButton && deleteButton.addEventListener('click', e => confirmAndDeleteSite(e, siteDetails));

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
                    actions.loadBookableSpaceSites();
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
        if (!data.floor_id_displayed) {
            displayToastMessage('Please enter floor name', true);
            return false;
        }

        const busyWhileSavingIcon = showBusyIcon('busy-icon-while-saving');
        closeDialog(e);

        !!locationType &&
            actions
                .addBookableSpaceLocation(data)
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
            <input id="displayedFloorId" name="floor_id_displayed" type="text" required value="${floorDetails?.floor_id_displayed ??
                ''}" />
        </div>`;

    function showAddFloorForm(e, buildingDetails) {
        console.log('showAddFloorForm');
        const formBody = `<h2>Add a floor to ${buildingDetails?.building_name ||
            'unknown building'}</h2>${floorCoreForm()}`;
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

    function showEditBuildingForm(buildingId) {
        const buildingDetails =
            buildingId > 0 &&
            siteList.flatMap(site => site.buildings).find(building => building.building_id === buildingId);

        if (!buildingDetails) {
            console.log(`Can't find building with building_id = "${buildingId}" in sitelist from api`);
            displayToastMessage('Sorry, something went wrong');
            return;
        }

        const formBody = `<h2>Edit building details</h2>
            <input name="buildingId" type="hidden" value="${buildingDetails?.building_id}" />
            <input name="ground_floor_id_old" type="hidden" value="${buildingDetails?.ground_floor_id ??
                ''}" />${buildingCoreForm(buildingDetails)}<div class="dialogRow" data-testid="building-floor-list">
                <h3>Floors - Choose ground floor:</h3>
                ${buildingDetails?.floors?.length > 0 &&
                    '<ul>' +
                        buildingDetails?.floors
                            .map(floor => {
                                const checked = floor.floor_id === buildingDetails.ground_floor_id ? ' checked' : '';
                                return `<li>
                                            <input type="radio" id="groundFloor-${floor.floor_id}" name="ground_floor_id" ${checked} value="${floor.floor_id}" />
                                            <label for="groundFloor-${floor.floor_id}">Floor ${floor.floor_id_displayed}</label> 
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
            </div>`;

        const dialogBodyElement = document.getElementById('dialogBody');
        !!dialogBodyElement && (dialogBodyElement.innerHTML = formBody);

        const addNewButton = document.getElementById('addNewButton');
        !!addNewButton && (addNewButton.innerText = 'Add floor');
        !!addNewButton && addNewButton.addEventListener('click', e => showAddFloorForm(e, buildingDetails));

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
        const failureMessage = !data.floor_id_displayed && 'Please enter floor name';
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
                    actions.loadBookableSpaceSites();
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
                for (const site of siteList) {
                    for (const building of site.buildings) {
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
            console.log(`Can't find floor with floor_id = "${floorId}" in sitelist from api`);
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
        const formBody = `<h2 data-testid="add-campus-heading">Add campus</h2>${siteFormCore()}`;

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

    function getLocationLayout(siteList) {
        return (
            <>
                {siteList.map(site => [
                    <StyledRow
                        key={`site-${site.site_id}`}
                        data-testid={'spaces-site-entry'}
                        style={{ paddingLeft: '4rem' }}
                    >
                        <StyledEditButton
                            onClick={() => showEditSiteForm(site.site_id)}
                            aria-label={`Edit ${site.site_name} campus details`}
                            data-testid={`edit-campus-${site.site_id}-button`}
                        >
                            <span id={`site-${site.site_id}`}>{site.site_name}</span>
                            <EditIcon />
                        </StyledEditButton>
                    </StyledRow>,
                    ...site.buildings.flatMap(building => [
                        <StyledRow key={`building-${building.building_id}`} style={{ paddingLeft: '8rem' }}>
                            <StyledEditButton
                                color="primary"
                                onClick={() => showEditBuildingForm(building.building_id)}
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
                                    // onClick={() => showEditSiteForm(site.site_id)}
                                    onClick={() => showEditFloorForm(floor.floor_id)}
                                    aria-label={`Edit Floor ${floor.floor_id_displayed}`}
                                    data-testid={`edit-floor-${floor.floor_id}-button`}
                                >
                                    <span id={`floor-${floor.floor_id}`}>{floor.floor_id_displayed}</span>
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
        <StandardPage title="Library bookable spaces Location management">
            <section aria-live="assertive">
                <StandardCard standardCardId="location-list-card" noPadding noHeader style={{ border: 'none' }}>
                    <Grid container spacing={3} style={{ position: 'relative' }}>
                        {(() => {
                            if (!!siteListLoading) {
                                return (
                                    <StyledGridItem item xs={12} md={9}>
                                        <InlineLoader message="Loading" />
                                    </StyledGridItem>
                                );
                            } else if (!!siteListError) {
                                return (
                                    <StyledGridItem item xs={12} md={9}>
                                        <StyledStandardCard fullHeight>
                                            <p>Something went wrong - please try again later.</p>
                                        </StyledStandardCard>
                                    </StyledGridItem>
                                );
                            } else if (!siteList || siteList.length === 0) {
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
                                        {getLocationLayout(siteList)}
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
    siteList: PropTypes.any,
    siteListLoading: PropTypes.any,
    siteListError: PropTypes.any,
};

export default React.memo(BookableSpacesManageLocations);
