import React from 'react';
import PropTypes from 'prop-types';
import { useCookies } from 'react-cookie';

import Button from '@mui/material/Button';
import { Grid } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import WarningOutlined from '@mui/icons-material/WarningOutlined';

import {
    baseButtonStyles,
    pluralise,
    removeClass,
    slugifyName,
    StyledPrimaryButton,
    StyledSecondaryButton,
} from 'helpers/general';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';

import { HeaderBar } from 'modules/Pages/Admin/BookableSpaces/HeaderBar';
import {
    addBreadcrumbsToSiteHeader,
    closeDeletionConfirmation,
    closeDialog,
    displayToastMessage,
    showGenericConfirmAndDeleteDialog,
} from '../bookableSpacesAdminHelpers';
import { getFlatFacilityTypeList } from 'modules/Pages/BookableSpaces/spacesHelpers';

const StyledMainDialog = styled('dialog')(({ theme }) => ({
    width: '80%',
    border: '1px solid rgba(38, 85, 115, 0.15)',
    maxWidth: '1136px',
    '& h2': {
        paddingInline: '1rem',
    },
    '& .dialogRow': {
        padding: '0.5rem 1rem',
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
    },

    '& .dialogFooter': {
        '& div': {
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '1rem',
            '& button': {
                marginLeft: '0.5rem',
            },
        },
        '& svg': {
            width: '1rem',
            height: '1rem',
            color: theme.palette.error.light,
            '&.hidden': {
                display: 'none',
            },
        },
    },
}));
// a primary button, but with a red color
const StyledDeleteButton = styled(Button)(({ theme }) => ({
    ...baseButtonStyles,
    backgroundColor: theme.palette.error.light,
    borderColor: theme.palette.error.light,
    color: '#fff',
    alignItems: 'center',
    gap: '.5rem',
    position: 'relative',
    transition: 'background-color 200ms ease-out, color 200ms ease-out, border 200ms ease-out',
    '&:hover': {
        backgroundColor: '#fff',
        color: theme.palette.error.light,
    },
}));
const StyledEditIconButton = styled(IconButton)(() => ({
    paddingInline: 0,
    marginRight: '0.25rem',
}));

export const BookableSpacesManageFacilities = ({
    actions,
    facilityTypeList,
    facilityTypeListLoading,
    facilityTypeListError,
    facilityTypeAdding,
    facilityTypeAddError,
    facilityTypeAdded,
    facilityTypeGroupAdding,
    facilityTypeAddGroupError,
    facilityTypeGroupAdded,
    facilityTypeUpdating,
    facilityTypeUpdateError,
    facilityTypeUpdated,
    bookableSpacesRoomList,
}) => {
    console.log('load facilityTypeList', facilityTypeList, facilityTypeListLoading, facilityTypeListError);
    console.log('load facilityTypeUpdated', facilityTypeUpdated, facilityTypeUpdating, facilityTypeUpdateError);

    const [cookies, setCookie] = useCookies();

    // saveButtonVisibility values
    const saveButtonVisibilityHidden = 0; // Always hidden
    const saveButtonVisibilityCurrentlyVisible = 1; // Visible when New form open
    const saveButtonVisibilityAlwaysVisible = 2; // Always visible because there are facility type entries
    const [saveButtonVisibility, setSaveButtonVisibility2] = React.useState(saveButtonVisibilityHidden);
    const setSaveButtonVisibility = v => {
        console.log('setSaveButtonVisibility', v);
        setSaveButtonVisibility2(v);
    };
    const [formValues, setFormValues2] = React.useState([]);
    const setFormValues = v => {
        console.log('setFormValues', v);
        setFormValues2(v);
    };

    React.useEffect(() => {
        addBreadcrumbsToSiteHeader([
            '<li class="uq-breadcrumb__item"><span class="uq-breadcrumb__link">Location management</span></li>',
        ]);

        setFormValues({
            ...[],
            ['facility_types']: [],
        });

        if (facilityTypeListError === null && facilityTypeListLoading === null && facilityTypeList === null) {
            actions.loadAllFacilityTypes(); // get facility types
            actions.loadAllBookableSpacesRooms(); // get bookableSpacesRoomList
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        // initial the form on load
        const facilityTypeListHasLoaded =
            facilityTypeListError === false &&
            facilityTypeListLoading === false &&
            facilityTypeList?.data?.facility_type_groups?.length > 0;
        if (facilityTypeListHasLoaded) {
            setFormValues({
                ['facility_types']: getFlatFacilityTypeList(facilityTypeList),
            });
            setSaveButtonVisibility(saveButtonVisibilityAlwaysVisible);
        }
    }, [facilityTypeListLoading, facilityTypeListError, facilityTypeList]);

    const warningTextId = 'warningtext';
    const displayUserWarningMessage = (warningMessage, showWarningIcon) => {
        const warningMessageNode = document.createTextNode(warningMessage);

        const primaryTextElement = document.createElement('span');
        !!primaryTextElement && (primaryTextElement.id = warningTextId);
        !!primaryTextElement && !!warningMessageNode && primaryTextElement.appendChild(warningMessageNode);

        const dialogMessageElement = document.getElementById('dialogMessageContent');
        !!dialogMessageElement && !!primaryTextElement && dialogMessageElement.appendChild(primaryTextElement);

        const warningIcon = document.getElementById('warning-icon');
        !!showWarningIcon && removeClass(warningIcon, 'hidden');
    };

    const saveChangeToFacilityType = () => {
        const valuesToSend = {
            facility_type_name: document.getElementById('facility_type_name')?.value,
            facility_type_id: document.getElementById('facility_type_id')?.value,
        };

        closeDialog();

        const cypressTestCookie = cookies.hasOwnProperty('CYPRESS_TEST_DATA') ? cookies.CYPRESS_TEST_DATA : null;
        if (!!cypressTestCookie && window.location.host === 'localhost:2020' && cypressTestCookie === 'active') {
            setCookie('CYPRESS_DATA_SAVED', valuesToSend);
        }

        !!valuesToSend.facility_type_name &&
            !!valuesToSend.facility_type_id &&
            actions
                .updateSpacesFacilityType(valuesToSend)
                .then(() => {
                    displayToastMessage('Facility type updated', false);
                    // return { success: true, id: valuesToSend.facility_type_id };
                })
                .catch(e => {
                    console.log(
                        'catch: updating facility type (',
                        valuesToSend?.facility_type_id,
                        valuesToSend?.facility_type_name,
                        ') failed:',
                        e,
                    );
                    displayToastMessage(
                        '[BSMF-008] Sorry, an error occurred - Updating the Facility type failed. The admins have been informed.',
                    );
                    // return { success: false, id: valuesToSend.facility_type_id, error: e };
                })
                .finally(() => {
                    // Reload facility types only once after all operations complete
                    actions.loadAllFacilityTypes();
                });
    };

    function deleteFacilityType(e, facilityTypeDetails) {
        closeDeletionConfirmation(); // close delete conf dialog
        closeDialog(); // close main dialog

        const facilityTypeid = facilityTypeDetails.facility_type_id;
        actions
            .deleteSpacesFacilityType(facilityTypeid)
            .then(() => {
                const successMessage = `${facilityTypeDetails?.facility_type_name} deleted`;
                displayToastMessage(successMessage, false);
            })
            .catch(e => {
                const failureMessage = `catch: deleting facility type ${facilityTypeDetails?.facility_type_name} failed:`;
                console.log(failureMessage, e);
                displayToastMessage(
                    '[BSMF-009] Sorry, an error occurred and the facility type was not deleted - the admins have been informed.',
                );
            })
            .finally(() => {
                // actions.loadBookableSpaceCampusChildren();
                actions.loadAllFacilityTypes();
            });
    }

    function openConfirmDeleteFacilityTypeDialog(e, facilityTypeDetails) {
        const line1 = `Do you really want to delete ${facilityTypeDetails.facility_type_name}?`;
        const confirmationOKButton = document.getElementById('confDialogOkButton');
        !!confirmationOKButton &&
            confirmationOKButton.addEventListener('click', e => deleteFacilityType(e, facilityTypeDetails));
        showGenericConfirmAndDeleteDialog(line1, '');
        document.activeElement.blur();
        // don't put focus on 'no' button, it doesn't work well with these daft primary and secondary buttons
    }

    const openDialogForEditFacilityType = e => {
        const buttonClicked = e.target.closest('button');
        const _facilityTypeId = buttonClicked.getAttribute('data-facilitytypeid');
        const facilityTypeId = !!_facilityTypeId && parseInt(_facilityTypeId, 10);

        // show the form
        const flatFacilityTypeList = getFlatFacilityTypeList(facilityTypeList);
        const facilityTypeDetails = flatFacilityTypeList?.find(item => item.facility_type_id === facilityTypeId);
        const formBody = `<div>
                <h2 data-testid="add-facility-type-heading">Edit a Facility Type</h2>
                <input type="hidden" name="facility_type_id" id="facility_type_id" value="${facilityTypeId}" />
                <div class="dialogRow">
                    <label for="facility_type_name">Facility type name</label>
                    <input type="text" name="facility_type_name" id="facility_type_name" data-testid="facility_type_name" value="${facilityTypeDetails.facility_type_name}" required />
                </div>
            </div>`;
        const dialogBodyElement = document.getElementById('dialogBody');
        !!dialogBodyElement && (dialogBodyElement.innerHTML = formBody);

        // add a deletion warning message about how many Spaces are affected
        const spacesWithThisFacilityType = bookableSpacesRoomList?.data?.locations?.filter(location => {
            return location.facility_types.some(facilityType => facilityType.facility_type_id === facilityTypeId);
        });
        const count = spacesWithThisFacilityType?.length || 0;
        const pluralSpace = pluralise('Space', count);
        const pluralArticle = `${pluralise('The', count, 'Those')}`;
        const pluralMsg = `This facility type will be removed from ${count} ${pluralSpace} if you delete it. ${pluralArticle} ${pluralSpace} will not be deleted.`;
        const warningMessage =
            count > 0 ? pluralMsg : 'This facility type can be deleted - it is not currently showing for any Spaces.';
        displayUserWarningMessage(warningMessage, count > 0);

        const saveButton = document.getElementById('saveButton');
        !!saveButton && saveButton.addEventListener('click', saveChangeToFacilityType);

        const deleteButton = document.getElementById('deleteButton');
        !!deleteButton &&
            deleteButton.addEventListener('click', e => openConfirmDeleteFacilityTypeDialog(e, facilityTypeDetails));

        const dialog = document.getElementById('popupDialog');
        !!dialog && dialog.showModal();
    };

    const saveNewFacilityType = e => {
        //
        const form = e.target.closest('form');

        const formData = !!form && new FormData(form);
        const data = !!formData && Object.fromEntries(formData);

        // validate form
        const failureMessage = !data.facility_type_name && 'Please enter a facility type name';
        if (!!failureMessage) {
            displayToastMessage(failureMessage, true);
            return false;
        }

        const valuesToSend = {
            facility_type__group_id: data.facility_type__group_id,
            facility_type_name: data.facility_type_name,
        };

        // showSavingProgress(true);
        closeDialog(e);

        const cypressTestCookie = cookies.hasOwnProperty('CYPRESS_TEST_DATA') ? cookies.CYPRESS_TEST_DATA : null;
        if (!!cypressTestCookie && window.location.host === 'localhost:2020' && cypressTestCookie === 'active') {
            setCookie('CYPRESS_DATA_SAVED', valuesToSend);
        }

        actions
            .createSpacesFacilityType(valuesToSend)
            .then(() => {
                displayToastMessage('Facility type created', false);
                actions.loadAllFacilityTypes(); // reload facility types
            })
            .catch(e => {
                console.log(
                    'catch: saving facility type (',
                    data.facility_type__group_id,
                    data.facility_type_name,
                    ') failed:',
                    e,
                );
                displayToastMessage(
                    '[BSMF-001] Sorry, an error occurred and the facility type was not created - the admins have been informed',
                );
            });
        return true;
    };

    const openDialogAddTypeToGroupForm = e => {
        // here
        const buttonClicked = e.target.closest('button');
        const groupId = buttonClicked.getAttribute('data-groupid');

        const thisGroup = facilityTypeList?.data?.facility_type_groups?.find(
            g => g.facility_type_group_id === parseInt(groupId, 10),
        );
        const groupname = thisGroup?.facility_type_group_name;
        const formBody = `<div>
                <h2 data-testid="add-facility-type-heading">Add a Facility Type to ${groupname}</h2>
                <input type="hidden" name="facility_type__group_id" value="${groupId}" />
                <div class="dialogRow">
                    <label for="newFacilityType">New Facility type for Group</label>
                    <input type="text" name="facility_type_name" id="newFacilityType" data-testid="facility_type_name" value="" required />
                </div>
            </div>`;

        const dialogBodyElement = document.getElementById('dialogBody');
        !!dialogBodyElement && (dialogBodyElement.innerHTML = formBody);

        const saveButton = document.getElementById('saveButton');
        !!saveButton && saveButton.addEventListener('click', saveNewFacilityType);

        const deleteButton = document.getElementById('deleteButton');
        !!deleteButton && (deleteButton.style.display = 'none');

        const dialog = document.getElementById('popupDialog');
        !!dialog && dialog.showModal();
    };

    const saveNewFacilityTypeGroup = e => {
        const form = e.target.closest('form');

        const formData = !!form && new FormData(form);
        const data = !!formData && Object.fromEntries(formData);

        // validate form
        const failureMessage =
            (!data.facility_type_name || !data.facility_type_group_name) && 'Please enter both fields.';
        if (!!failureMessage) {
            displayToastMessage(failureMessage, true);
            return false;
        }

        closeDialog(e);

        const groupValuesToSend = {
            facility_type_group_name: data.facility_type_group_name,
            facility_type_group_order: 0,
            // 'facility_type_group_type' => (one of: 'choose-one', 'choose-many'), // TODO
        };

        let groupCreated = false;
        actions
            .createSpacesFacilityTypeGroup(groupValuesToSend)
            .then(response => {
                groupCreated = true;
                const typeValuesToSend = {
                    facility_type__group_id: response?.data?.facility_type_group_id,
                    facility_type_name: data.facility_type_name,
                };
                // const cypressTestCookie = cookies.hasOwnProperty('CYPRESS_TEST_DATA') ? cookies.CYPRESS_TEST_DATA : null;
                // if (
                //     !!cypressTestCookie &&
                //     window.location.host === 'localhost:2020' &&
                //     cypressTestCookie === 'active'
                // ) {
                //     setCookie('CYPRESS_DATA_SAVED', typeValuesToSend);
                // }
                actions.createSpacesFacilityType(typeValuesToSend);
            })
            .then(() => {
                displayToastMessage('Facility type created', false);
                actions.loadAllFacilityTypes(); // reload facility types
            })
            .catch(e => {
                if (groupCreated) {
                    // type create failed
                    console.log(
                        'catch: saving facility type (',
                        data.facility_type__group_id,
                        data.facility_type_name,
                        ') failed:',
                        e,
                    );
                    displayToastMessage(
                        '[BSMF-002] Sorry, an error occurred and the facility type was not created - the admins have been informed',
                    );
                } else {
                    // group create failed
                    console.log(
                        'catch: saving facility type (',
                        data.facility_type__group_id,
                        data.facility_type_name,
                        ') failed:',
                        e,
                    );
                    displayToastMessage(
                        '[BSMF-010] Sorry, an error occurred and the facility group and type was not created - the admins have been informed',
                    );
                }
            });
        return true;
    };
    const openDialogAddGroup = () => {
        const formBody = `<div id="add-new-facility-group-form" style="margin-bottom: 2rem; display: block;">
            <h3>New Facility type group</h3>
            <div class="dialogRow">
                <label for="newGroupname">Name of new Facility type group</label>
                <div>
                    <input aria-invalid="false" id="newGroupname" name="facility_type_group_name" type="text" maxlength="255" data-testid="new-group-name" required>
                </div>
            </div>
            <div class="dialogRow">
                <label for="firstGroupEntry">Name of first Facility type in this new group</label>
                <div>
                    <input aria-invalid="false" id="firstGroupEntry" name="facility_type_name" type="text" maxlength="255" data-testid="new-group-first" required>
                </div>
            </div>
        </div>`;

        const dialogBodyElement = document.getElementById('dialogBody');
        !!dialogBodyElement && (dialogBodyElement.innerHTML = formBody);

        const saveButton = document.getElementById('saveButton');
        !!saveButton && saveButton.addEventListener('click', saveNewFacilityTypeGroup);

        const deleteButton = document.getElementById('deleteButton');
        !!deleteButton && (deleteButton.style.display = 'none');

        const dialog = document.getElementById('popupDialog');
        !!dialog && dialog.showModal();
    };

    const updateFacilityTypeGroup = e => {
        const form = e.target.closest('form');

        const formData = !!form && new FormData(form);
        const data = !!formData && Object.fromEntries(formData);

        const failureMessage = !data.facility_type_group_name && 'Please enter a facility group type name';
        if (!!failureMessage) {
            displayToastMessage(failureMessage, true);
            return false;
        }

        const valuesToSend = {
            facility_type_group_name: data.facility_type_group_name,
            facility_type_group_loads_open: data.facility_type_group_loads_open,
        };

        closeDialog();

        const cypressTestCookie = cookies.hasOwnProperty('CYPRESS_TEST_DATA') ? cookies.CYPRESS_TEST_DATA : null;
        if (!!cypressTestCookie && window.location.host === 'localhost:2020' && cypressTestCookie === 'active') {
            setCookie('CYPRESS_DATA_SAVED', valuesToSend);
        }

        actions
            .updateSpacesFacilityGroup(valuesToSend, data.facility_type_group_id)
            .then(() => {
                displayToastMessage('Facility type updated', false);
                // return { success: true, id: valuesToSend.facility_type_group_id };
            })
            .catch(e => {
                console.log('updateSpacesFacilityGroup ERROR');
                console.log(
                    'catch: updating facility type (',
                    valuesToSend?.facility_type_group_id,
                    valuesToSend?.facility_type_group_name,
                    ') failed:',
                    e,
                );
                displayToastMessage(
                    '[BSMF-008] Sorry, an error occurred - Updating the Facility type failed. The admins have been informed.',
                );
                // return { success: false, id: valuesToSend.facility_type_group_id, error: e };
            })
            .finally(() => {
                // Reload facility types only once after all operations complete
                actions.loadAllFacilityTypes();
            });
    };

    const deleteFacilityTypeGroup = (e, facilityTypeGroupDetails) => {
        const successMessage = `${facilityTypeGroupDetails?.facility_type_group_name} deleted`;
        const failureMessage = `catch: deleting facility type group ${facilityTypeGroupDetails?.facility_type_group_name} failed:`;

        closeDeletionConfirmation(); // close delete conf dialog
        closeDialog(); // close main dialog

        const facilityTypeid = facilityTypeGroupDetails.facility_type_group_id;
        actions
            .deleteSpacesFacilityTypeGroup(facilityTypeid)
            .then(() => {
                displayToastMessage(successMessage, false);
            })
            .catch(e => {
                console.log('deleteSpacesFacilityTypeGroup failed', failureMessage, e);
                displayToastMessage(
                    '[BSMF-011] Sorry, an error occurred and the facility group was not deleted - the admins have been informed.',
                );
            })
            .finally(() => {
                // actions.loadBookableSpaceCampusChildren();
                actions.loadAllFacilityTypes();
            });
    };

    function countSpacesWithFacilityTypeGroup(targetGroupId) {
        const facilityTypeGroups = facilityTypeList?.data?.facility_type_groups;
        const targetGroups =
            facilityTypeGroups?.find(group => group.facility_type_group_id === parseInt(targetGroupId, 10)) || {};
        const targetFacilityTypeIds = targetGroups?.facility_type_children?.map(child => child.facility_type_id) || [];

        const allSpaces = bookableSpacesRoomList?.data?.locations;
        const spaces = allSpaces?.filter(s =>
            s.facility_types.some(ft => targetFacilityTypeIds?.includes(ft.facility_type_id)),
        );
        return spaces?.length || 0;
    }

    function openConfirmDeleteFacilityGroupDialog(e, facilityGroupDetails) {
        console.log('facilityGroupDetails=', facilityGroupDetails);
        const line1 = `Do you really want to delete ${facilityGroupDetails.facility_type_group_name}?`;
        const confirmationOKButton = document.getElementById('confDialogOkButton');
        !!confirmationOKButton &&
            confirmationOKButton.addEventListener('click', e => deleteFacilityTypeGroup(e, facilityGroupDetails));
        showGenericConfirmAndDeleteDialog(line1, '');
        document.activeElement.blur();
        // don't put focus on 'no' button, it doesn't work well with these daft primary and secondary buttons
    }

    const openDialogForEditGroup = e => {
        const buttonClicked = e.target.closest('button');
        const groupId = buttonClicked.getAttribute('data-groupid');
        const thisGroup =
            facilityTypeList?.data?.facility_type_groups?.find(
                g => g.facility_type_group_id === parseInt(groupId, 10),
            ) || {};
        console.log('buttonClicked=', buttonClicked);
        console.log('groupId=', groupId);
        console.log('thisGroup=', thisGroup);

        const facilityGroupName = thisGroup?.facility_type_group_name || /* istanbul ignore next */ 'unknown';
        const facilityOpenRadioOn = thisGroup?.facility_type_group_loads_open === 1 ? 'checked' : '';
        const facilityOpenRadioOff = thisGroup?.facility_type_group_loads_open === 1 ? '' : 'checked';
        const formBody = `<div id="add-new-facility-group-form" style="margin-bottom: 2rem; display: block;">
            <h3>Edit Facility type group</h3>
            <input type="hidden" id="facility_type_group_id" name="facility_type_group_id" value="${groupId}" />
            <div class="dialogRow">
                <label for="facility_type_group_name">Facility type group Name</label>
                <div>
                    <input type="text" data-testid="facility_type_group_name" value="${facilityGroupName}" id="facility_type_group_name" name="facility_type_group_name" maxlength="255" required>
                </div>
            </div>
            <div class="dialogRow">
                    <label for="facility_type_group_loads_open">Facility type group loads Open or Collapsed in sidebar</label>
                    <div>
                        <input style="display: inline" type="radio" data-testid="facility_type_group_loads_open-open" value="1" ${facilityOpenRadioOn} id="facility_type_group_loads_open-open" name="facility_type_group_loads_open" />
                        <label style="display: inline; font-weight: 400" for="facility_type_group_loads_open-open">Open</label>
                        <input style="display: inline" type="radio" data-testid="facility_type_group_loads_open-collapsed" value="0" ${facilityOpenRadioOff} id="facility_type_group_loads_open-collapsed" name="facility_type_group_loads_open" />
                        <label style="display: inline; font-weight: 400" for="facility_type_group_loads_open-collapsed">Collapsed</label>
                    </div>
            </div>
        </div>`;

        // add a deletion warning message about how many Spaces are affected
        const count = countSpacesWithFacilityTypeGroup(groupId);
        const plural = pluralise('Space', count);
        const warningMessage =
            count > 0
                ? `This facility group's child types will be removed from ${count} ${plural} if you delete it. ${pluralise(
                      'The',
                      count,
                      'Those',
                  )} ${plural} will not be deleted.`
                : 'This facility group can be deleted - none of its child types are currently showing for any Spaces.';
        displayUserWarningMessage(warningMessage, count > 0);

        const dialogBodyElement = document.getElementById('dialogBody');
        console.log('dialogBodyElement=', dialogBodyElement);
        !!dialogBodyElement && (dialogBodyElement.innerHTML = formBody);

        const saveButton = document.getElementById('saveButton');
        !!saveButton && saveButton.addEventListener('click', updateFacilityTypeGroup);

        const deleteButton = document.getElementById('deleteButton');
        !!deleteButton &&
            deleteButton.addEventListener('click', e => openConfirmDeleteFacilityGroupDialog(e, thisGroup));

        const dialog = document.getElementById('popupDialog');
        !!dialog && dialog.showModal();
    };

    const writeFilterTypeController = group => {
        const groupName = group.facility_type_group_name;
        const groupId = group.facility_type_group_id;
        return (
            <>
                <div style={{ display: 'flex' }}>
                    <Typography component={'h3'} variant={'h6'} style={{ whiteSpace: 'nowrap' }}>
                        {groupName}
                    </Typography>
                    <IconButton
                        color="primary"
                        data-testid={`edit-group-${groupId}-button`}
                        id={`edit-group-${groupId}-button`}
                        onClick={openDialogForEditGroup}
                        aria-label={`Edit facility type ${groupName}`}
                        data-groupid={groupId}
                    >
                        <EditIcon
                            style={{
                                width: '1rem',
                                height: '1rem',
                            }}
                        />
                    </IconButton>
                </div>
                <Typography component={'div'} variant={'p'}>
                    {group?.facility_type_group_loads_open ? 'Loads open' : 'Loads collapsed'}
                </Typography>

                {group?.facility_type_children?.map(facilityType => {
                    const facilityTypeId = facilityType.facility_type_id;
                    return (
                        <div key={`facilitytype-list-${facilityTypeId}`}>
                            <StyledEditIconButton
                                color="primary"
                                data-testid={`edit-facility-type-${facilityTypeId}-button`}
                                id={`edit-facility-type-${facilityTypeId}-button`}
                                onClick={openDialogForEditFacilityType}
                                data-facilitytypeid={facilityTypeId}
                                aria-label={`Edit facility type ${facilityType.facility_type_name}`}
                            >
                                <EditIcon
                                    style={{
                                        width: '1rem',
                                        height: '1rem',
                                    }}
                                />
                            </StyledEditIconButton>
                            <Typography
                                component={'span'}
                                variant={'p'}
                                data-testid={`facilitytype-name-${facilityTypeId}`}
                            >
                                {formValues.facility_types?.find(
                                    f => f?.facility_type_id === facilityType?.facility_type_id,
                                )?.facility_type_name || facilityType.facility_type_name}
                            </Typography>
                        </div>
                    );
                })}

                <IconButton
                    color="primary"
                    data-testid={`add-group-${groupId}-button`}
                    id={`add-group-${groupId}-button`}
                    onClick={openDialogAddTypeToGroupForm}
                    data-groupid={groupId}
                    style={{
                        paddingInline: 0,
                        display: 'block',
                    }}
                    aria-label={`Add another facility type for ${group.facility_type_group_name}`}
                >
                    <AddIcon data-testid={`add-type-${slugifyName(group.facility_type_group_name)}`} />
                </IconButton>
            </>
        );
    };
    return (
        <StandardPage title="Spaces">
            <HeaderBar pageTitle="Manage Facility types" currentPage="manage-facilities" />

            <section aria-live="assertive">
                <StandardCard standardCardId="location-list-card" noPadding noHeader style={{ border: 'none' }}>
                    <>
                        {(() => {
                            if (
                                !!facilityTypeUpdating ||
                                !!facilityTypeGroupAdding ||
                                !!facilityTypeAdding ||
                                !!facilityTypeListLoading
                            ) {
                                return (
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <InlineLoader message="Loading" />
                                        </Grid>
                                    </Grid>
                                );
                            } else if (!!facilityTypeListError) {
                                return (
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <p data-testid="apiError">Something went wrong - please try again later.</p>
                                        </Grid>
                                    </Grid>
                                );
                            } else {
                                return (
                                    <>
                                        <Grid container>
                                            <Grid item xs={12}>
                                                <StyledPrimaryButton
                                                    style={{ marginBottom: '2rem' }}
                                                    onClick={openDialogAddGroup}
                                                    data-testid="add-new-group-button"
                                                >
                                                    Add new Facility type group
                                                </StyledPrimaryButton>
                                            </Grid>
                                        </Grid>
                                        {facilityTypeList?.data?.facility_type_groups?.length === 0 && (
                                            <Grid container>
                                                <Grid item xs={12}>
                                                    <p data-testid="space-facility-types-empty-message">
                                                        No facility types currently in system.
                                                    </p>
                                                </Grid>
                                            </Grid>
                                        )}

                                        {/* {!!facilityTypeList?.data?.facility_type_groups &&*/}
                                        {/*    facilityTypeList?.data?.facility_type_groups.length > 0 && (*/}
                                        {/*        <Grid container>*/}
                                        {/*            {(*/}
                                        {/*                facilityTypeList?.data?.facility_type_groups?.sort((a, b) =>*/}
                                        {/*                    a.facility_type_group_name.localeCompare(*/}
                                        {/*                        b.facility_type_group_name,*/}
                                        {/*                    ),*/}
                                        {/*                ) || []*/}
                                        {/*            )?.map(group => {*/}
                                        {/*                return (*/}
                                        {/*                    <Grid item xs={12}>*/}
                                        {/*                        {group.facility_type_group_name}*/}
                                        {/*                    </Grid>*/}
                                        {/*                );*/}
                                        {/*            })}*/}
                                        {/*        </Grid>*/}
                                        {/*    )}*/}
                                        {!!facilityTypeList?.data?.facility_type_groups &&
                                            facilityTypeList?.data?.facility_type_groups.length > 0 && (
                                                <Grid container>
                                                    {(
                                                        facilityTypeList?.data?.facility_type_groups?.sort((a, b) =>
                                                            a.facility_type_group_name.localeCompare(
                                                                b.facility_type_group_name,
                                                            ),
                                                        ) || []
                                                    )?.map(group => {
                                                        return (
                                                            <Grid
                                                                item
                                                                xs={12}
                                                                sm={3}
                                                                data-testid={`facilitygroup-${slugifyName(
                                                                    group.facility_type_group_name,
                                                                )}`}
                                                                key={group.facility_type_group_name}
                                                                style={{ maxWidth: '200px' }}
                                                            >
                                                                {writeFilterTypeController(group)}
                                                            </Grid>
                                                        );
                                                    })}
                                                </Grid>
                                            )}
                                    </>
                                );
                            }
                        })()}
                    </>
                    <dialog id="confirmationDialog" className="confirmationDialog" data-testid="confirmation-dialog">
                        <p id="confDialogMessage" data-testid="confirmation-dialog-message" />
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <StyledSecondaryButton
                                id="confDialogCancelButton"
                                children={'No'}
                                data-testid="confirmation-dialog-reject-button"
                            />
                            <StyledPrimaryButton
                                id="confDialogOkButton"
                                children={'Yes'}
                                data-testid="confirmation-dialog-accept-button"
                            />
                        </div>
                    </dialog>
                    <StyledMainDialog id={'popupDialog'} closedby="any" data-testid="main-dialog">
                        <form>
                            <div id="dialogBody" />
                            <div id="dialogFooter" className={'dialogFooter'}>
                                <p
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'flex-start',
                                        alignItems: 'flex-start',
                                        columnGap: '0.5rem',
                                        marginLeft: '1rem',
                                    }}
                                    id="dialogMessage"
                                    data-testid="dialogMessage"
                                >
                                    <WarningOutlined className="hidden" id="warning-icon" data-testid="warning-icon" />
                                    <span id="dialogMessageContent" />
                                </p>
                                <div>
                                    <div>
                                        <StyledDeleteButton
                                            id={'deleteButton'}
                                            className={'alert'}
                                            children={'Delete'}
                                            data-testid="dialog-delete-button"
                                        />
                                    </div>
                                    <div>
                                        <StyledSecondaryButton
                                            className={'secondary'}
                                            children={'Cancel'}
                                            onClick={closeDialog}
                                            data-testid="dialog-cancel-button"
                                        />
                                        <StyledPrimaryButton
                                            id={'saveButton'}
                                            className={'primary'}
                                            children={'Save'}
                                            // onClick={saveNewFacilityType}
                                            data-testid="dialog-save-button"
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </StyledMainDialog>
                </StandardCard>
            </section>
        </StandardPage>
    );
};

BookableSpacesManageFacilities.propTypes = {
    actions: PropTypes.any,
    facilityTypeList: PropTypes.any,
    facilityTypeListLoading: PropTypes.any,
    facilityTypeListError: PropTypes.any,
    facilityTypeAdding: PropTypes.any,
    facilityTypeAddError: PropTypes.any,
    facilityTypeAdded: PropTypes.any,
    facilityTypeGroupAdding: PropTypes.any,
    facilityTypeAddGroupError: PropTypes.any,
    facilityTypeGroupAdded: PropTypes.any,
    facilityTypeUpdating: PropTypes.any,
    facilityTypeUpdateError: PropTypes.any,
    facilityTypeUpdated: PropTypes.any,
    bookableSpacesRoomList: PropTypes.any,
    bookableSpacesRoomListLoading: PropTypes.any,
    bookableSpacesRoomListError: PropTypes.any,
};

export default React.memo(BookableSpacesManageFacilities);
