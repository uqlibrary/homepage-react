import React from 'react';
import PropTypes from 'prop-types';
import { useCookies } from 'react-cookie';

import Button from '@mui/material/Button';
import { Grid } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import WarningOutlined from '@mui/icons-material/WarningOutlined';

import { addClass, baseButtonStyles, removeClass } from 'helpers/general';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { pluralise, scrollToTopOfPage, slugifyName, StyledPrimaryButton, StyledSecondaryButton } from 'helpers/general';

import { HeaderBar } from 'modules/Pages/Admin/BookableSpaces/HeaderBar';
import {
    addBreadcrumbsToSiteHeader,
    closeDeletionConfirmation,
    displayToastMessage,
    getFlatFacilityTypeList,
    showGenericConfirmAndDeleteDialog,
    closeDialog,
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
    bookableSpacesRoomListLoading,
    bookableSpacesRoomListError,
}) => {
    console.log('load facilityTypeList', facilityTypeList, facilityTypeListLoading, facilityTypeListError);
    // console.log('load facilityTypeAdded', facilityTypeAdded, facilityTypeAdding, facilityTypeAddError);
    console.log('load facilityTypeUpdated', facilityTypeUpdated, facilityTypeUpdating, facilityTypeUpdateError);
    // console.log(
    //     'load facilityTypeGroupAdded',
    //     facilityTypeGroupAdded,
    //     facilityTypeGroupAdding,
    //     facilityTypeAddGroupError,
    // );
    // console.log('facilityTypeList?.data?.facility_type_groups', facilityTypeList?.data?.facility_type_groups);

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
    // const clearUserWarningMessage = () => {
    //     const warningtextElement = document.getElementById(warningTextId);
    //     !!warningtextElement && warningtextElement.remove();
    //
    //     const warningIcon = document.getElementById('warning-icon');
    //     addClass(warningIcon, 'hidden');
    // };

    const displayUserWarningMessage = warningMessage => {
        const warningMessageNode = document.createTextNode(warningMessage);

        const primaryTextElement = document.createElement('span');
        !!primaryTextElement && (primaryTextElement.id = warningTextId);
        !!primaryTextElement && !!warningMessageNode && primaryTextElement.appendChild(warningMessageNode);

        const dialogMessageElement = document.getElementById('dialogMessage');
        !!dialogMessageElement && !!primaryTextElement && dialogMessageElement.appendChild(primaryTextElement);

        const warningIcon = document.getElementById('warning-icon');
        removeClass(warningIcon, 'hidden');
    };

    // function closeDialog(e = null) {
    //     const dialog = !e ? document.getElementById('popupDialog') : e.target.closest('dialog');
    //     !!dialog && dialog.close();
    //
    //     clearUserWarningMessage();
    //
    //     const dialogBodyElement = document.getElementById('dialogBody');
    //     !!dialogBodyElement && (dialogBodyElement.innerHTML = '');
    //
    //     const addNewButton = document.getElementById('addNewButton');
    //     !!addNewButton && (addNewButton.innerText = 'Add new');
    //     !!addNewButton && (addNewButton.style.display = 'inline');
    //     removeAnyListeners(addNewButton);
    //
    //     const deleteButton = document.getElementById('deleteButton');
    //     !!deleteButton && (deleteButton.style.display = 'inline'); // if we hid it, unhide it
    //     removeAnyListeners(deleteButton);
    //
    //     const saveButton = document.getElementById('saveButton');
    //     removeAnyListeners(saveButton);
    // }

    function deleteFacilityType(e, facilityTypeDetails) {
        const successMessage = `${facilityTypeDetails?.facility_type_name} deleted`;
        const failureMessage = `catch: deleting facility type ${facilityTypeDetails?.facility_type_name} failed:`;

        closeDeletionConfirmation(); // close delete conf dialog
        closeDialog(); // close main dialog

        const facilityTypeid = facilityTypeDetails.facility_type_id;
        actions
            .deleteSpacesFacilityType(facilityTypeid)
            .then(() => {
                console.log('deleteFacilityType then');
                displayToastMessage(successMessage, false);
                actions.loadBookableSpaceCampusChildren();
            })
            .catch(e => {
                console.log(failureMessage, e);
                displayToastMessage(
                    '[BSMF-009] Sorry, an error occurred and the facility type was not deleted - the admins have been informed.',
                );
                // })
                // .finally(() => {
                //     showSavingProgress(false);
            });
    }

    function openConfirmDeleteDialog(e, facilityTypeDetails) {
        const line1 = `Do you really want to delete ${facilityTypeDetails.facility_type_name}?`;
        const confirmationOKButton = document.getElementById('confDialogOkButton');
        !!confirmationOKButton &&
            confirmationOKButton.addEventListener('click', e => deleteFacilityType(e, facilityTypeDetails));
        showGenericConfirmAndDeleteDialog(line1, '');
        document.activeElement.blur();
        // don't put focus on 'no' button, it doesn't work well with these daft primary and secondary buttons
    }

    const saveChangeToFacilityType = () => {
        // const form = e.target.closest('form');

        // const formData = new FormData(form);
        // const data = !!formData && Object.fromEntries(formData);
        // console.log('saveChangeToFacilityType data=', data);

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
                    console.log(`Successfully updated facility type: ${valuesToSend.facility_type_name}`);
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
                    console.log('------------------');
                });
    };

    const openDialogForEditFacilityType = e => {
        const buttonClicked = e.target.closest('button');
        const _facilityTypeId = buttonClicked.getAttribute('data-facilitytypeid');
        const facilityTypeId = !!_facilityTypeId && parseInt(_facilityTypeId, 10);

        // show the form
        const flatFacilityTypeList = getFlatFacilityTypeList(facilityTypeList);
        const facilityTypeDetails = flatFacilityTypeList.find(item => item.facility_type_id === facilityTypeId);
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
        const plural = pluralise('Space', count);
        const warningMessage =
            count > 0
                ? `This facility type will be removed from ${count} ${plural} if you delete it. The ${plural} will not be deleted.`
                : 'This facility type can be deleted - it is not currently showing for any Spaces.';
        displayUserWarningMessage(warningMessage);

        const saveButton = document.getElementById('saveButton');
        !!saveButton && saveButton.addEventListener('click', saveChangeToFacilityType);

        const deleteButton = document.getElementById('deleteButton');
        !!deleteButton && deleteButton.addEventListener('click', e => openConfirmDeleteDialog(e, facilityTypeDetails));

        const dialog = document.getElementById('popupDialog');
        !!dialog && dialog.showModal();
    };

    const saveNewFacilityType = e => {
        console.log('e=', e);
        console.log('e.target=', e.target);
        const form = e.target.closest('form');
        console.log('form=', form);

        const formData = !!form && new FormData(form);
        console.log('formData=', formData);
        const data = !!formData && Object.fromEntries(formData);
        console.log('data=', data);

        // validate form
        const failureMessage = !data.facility_type_name && 'Please enter a facility type name';
        console.log('data.facility_type_name=', data.facility_type_name);
        console.log('failureMessage=', failureMessage);
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
        const buttonClicked = e.target.closest('button');
        const groupId = buttonClicked.getAttribute('data-groupid');

        const thisGroup = facilityTypeList?.data?.facility_type_groups.find(
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

    const handleChange = prop => e => {
        const theNewValue = e.target.value;

        console.log('handleChange', prop, theNewValue, formValues);

        if (prop.startsWith('facilitytype-')) {
            const facilityTypeid = parseInt(prop.replace('facilitytype-', ''), 10);
            const updatedData = formValues?.facility_types?.map(f =>
                f?.facility_type_id === facilityTypeid ? { ...f, facility_type_name: theNewValue } : f,
            );
            setFormValues({
                ...formValues,
                facility_types: updatedData,
            });
        } else {
            setFormValues({
                ...formValues,
                [prop]: theNewValue,
            });
        }
    };

    const addFormDefaultLabel = 'Add new Facility group';
    const isAddNewGroupFormClosed = () => {
        const addNewForm = document.getElementById('add-new-facility-group-form');
        console.log('addNewForm?.style.display=', addNewForm?.style.display);
        return addNewForm?.style.display === 'none';
    };
    const openAddNewGroupForm = (addNewForm, formShowHideButton) => {
        addNewForm.style.display = 'block';
        !!formShowHideButton && (formShowHideButton.innerText = 'Clear new Group form');
        setFormValues({
            ...formValues,
            ['addNew']: true,
        });
        if (saveButtonVisibility !== saveButtonVisibilityAlwaysVisible) {
            console.log('setSaveButtonVisibility at 2 to', saveButtonVisibilityCurrentlyVisible);
            setSaveButtonVisibility(saveButtonVisibilityCurrentlyVisible);
        }
    };
    const closeAddNewGroupForm = (addNewForm, formShowHideButton) => {
        addNewForm.style.display = 'none';
        !!formShowHideButton && (formShowHideButton.innerText = addFormDefaultLabel);
        const tempFormValues = { ...formValues };
        delete tempFormValues.newGroupName;
        delete tempFormValues.firstGroupEntryName;
        setFormValues({
            ...tempFormValues,
            ['addNew']: false,
        });
        console.log('saveButtonVisibility=', saveButtonVisibility);
        if (saveButtonVisibility !== saveButtonVisibilityAlwaysVisible) {
            console.log('setSaveButtonVisibility at 3', saveButtonVisibilityHidden);
            setSaveButtonVisibility(saveButtonVisibilityHidden);
        }
    };
    const showHideAddCampusForm = () => {
        const addNewForm = document.getElementById('add-new-facility-group-form');
        if (!addNewForm) {
            console.log('showHideAddCampusForm no form to open');
            return null;
        }

        const formShowHideButton = document.getElementById('showHideAddCampusFormButton');
        if (isAddNewGroupFormClosed()) {
            console.log('showHideAddCampusForm opening form');
            openAddNewGroupForm(addNewForm, formShowHideButton);

            const newGroupnamebutton = document.getElementById('newGroupname');
            !!newGroupnamebutton && newGroupnamebutton.setAttribute('required', true);
            const firstGroupEntrybutton = document.getElementById('firstGroupEntry');
            !!firstGroupEntrybutton && firstGroupEntrybutton.setAttribute('required', true);

            if (saveButtonVisibility !== saveButtonVisibilityAlwaysVisible) {
                console.log(
                    'showHideAddCampusForm setSaveButtonVisibility at 4 to',
                    saveButtonVisibilityCurrentlyVisible,
                );
                setSaveButtonVisibility(saveButtonVisibilityCurrentlyVisible);
            }
        } else {
            console.log('showHideAddCampusForm closing form');
            const newGroupnamebutton = document.getElementById('newGroupname');
            !!newGroupnamebutton && newGroupnamebutton.setAttribute('required', false);
            const firstGroupEntrybutton = document.getElementById('firstGroupEntry');
            !!firstGroupEntrybutton && firstGroupEntrybutton.setAttribute('required', false);
            console.log('showHideAddCampusForm ere');
            closeAddNewGroupForm(addNewForm, formShowHideButton);
            console.log('showHideAddCampusForm after');
        }
        document.activeElement.blur();
        return true;
    };

    return (
        <StandardPage title="Spaces">
            <HeaderBar pageTitle="Manage Facility types" currentPage="manage-facilities" />

            <section aria-live="assertive">
                <StandardCard standardCardId="location-list-card" noPadding noHeader style={{ border: 'none' }}>
                    <Grid container>
                        {(() => {
                            if (
                                !!facilityTypeUpdating ||
                                !!facilityTypeGroupAdding ||
                                !!facilityTypeAdding ||
                                !!facilityTypeListLoading
                            ) {
                                return (
                                    <Grid item xs={12}>
                                        <InlineLoader message="Loading" />
                                    </Grid>
                                );
                            } else if (!!facilityTypeListError) {
                                return (
                                    <Grid item xs={12}>
                                        <p data-testid="apiError">Something went wrong - please try again later.</p>
                                    </Grid>
                                );
                            } else {
                                const sortedGroups =
                                    facilityTypeList?.data?.facility_type_groups?.sort(
                                        (a, b) => a.facility_type_group_order - b.facility_type_group_order,
                                    ) || [];

                                const formDisplay = dataAvailable =>
                                    !!dataAvailable
                                        ? { marginBottom: '2rem', display: 'none' }
                                        : { marginBottom: '2rem' };
                                return (
                                    <>
                                        <Grid item xs={12}>
                                            <StyledPrimaryButton
                                                id="showHideAddCampusFormButton"
                                                style={{
                                                    marginBottom: '2rem',
                                                    textTransform: 'initial',
                                                }}
                                                children={addFormDefaultLabel}
                                                onClick={showHideAddCampusForm}
                                                data-testid="add-new-group-button"
                                            />
                                        </Grid>

                                        {facilityTypeList?.data?.facility_type_groups?.length === 0 && (
                                            <Grid item xs={12}>
                                                <p data-testid="space-facility-types-empty-message">
                                                    No facility types currently in system.
                                                </p>
                                            </Grid>
                                        )}

                                        <Grid
                                            item
                                            xs={12}
                                            id="add-new-facility-group-form"
                                            style={formDisplay(!!facilityTypeList?.data?.facility_type_groups)}
                                        >
                                            <Typography component={'h3'} variant={'h6'}>
                                                New Facility group
                                            </Typography>
                                            <FormControl variant="standard" fullWidth>
                                                <InputLabel htmlFor="newGroupname">
                                                    Name of new Facility type group
                                                </InputLabel>
                                                <Input
                                                    id="newGroupname"
                                                    value={formValues?.newGroupName || ''}
                                                    onChange={handleChange('newGroupName')}
                                                    inputProps={{
                                                        maxLength: 255,
                                                        'data-testid': 'new-group-name',
                                                    }}
                                                />
                                            </FormControl>
                                            <FormControl variant="standard" fullWidth>
                                                <InputLabel htmlFor="firstGroupEntry">
                                                    Name of first Facility type in group
                                                </InputLabel>
                                                <Input
                                                    id="firstGroupEntry"
                                                    value={formValues?.firstGroupEntryName || ''}
                                                    onChange={handleChange('firstGroupEntryName')}
                                                    inputProps={{
                                                        maxLength: 255,
                                                        'data-testid': 'new-group-first',
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>

                                        {sortedGroups.map(group => (
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
                                                <Typography
                                                    component={'h3'}
                                                    variant={'h6'}
                                                    style={{ whiteSpace: 'nowrap' }}
                                                >
                                                    {group.facility_type_group_name}
                                                </Typography>

                                                {group.facility_type_children.map(facilityType => {
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
                                                                <EditIcon style={{ width: '1rem', height: '1rem' }} />
                                                            </StyledEditIconButton>
                                                            <Typography
                                                                component={'span'}
                                                                variant={'p'}
                                                                data-testid={`facilitytype-name-${facilityTypeId}`}
                                                            >
                                                                {formValues.facility_types?.find(
                                                                    f =>
                                                                        f?.facility_type_id ===
                                                                        facilityType?.facility_type_id,
                                                                )?.facility_type_name ||
                                                                    facilityType.facility_type_name}
                                                            </Typography>
                                                        </div>
                                                    );
                                                })}

                                                <IconButton
                                                    color="primary"
                                                    data-testid={`add-group-${group.facility_type_group_id}-button`}
                                                    id={`add-group-${group.facility_type_group_id}-button`}
                                                    onClick={openDialogAddTypeToGroupForm}
                                                    data-groupid={group.facility_type_group_id}
                                                    style={{ paddingInline: 0, display: 'block' }}
                                                    aria-label={`Add another facility type for ${group.facility_type_group_name}`}
                                                >
                                                    <AddIcon
                                                        data-testid={`add-type-${slugifyName(
                                                            group.facility_type_group_name,
                                                        )}`}
                                                    />
                                                </IconButton>
                                            </Grid>
                                        ))}

                                        {/* {!!saveButtonVisibility && (*/}
                                        {/*    <Grid item xs={12} style={{ marginTop: '2rem' }}>*/}
                                        {/*        <StyledPrimaryButton*/}
                                        {/*            id="saveChange"*/}
                                        {/*            data-testid="spaces-facilitytypes-save-button"*/}
                                        {/*            fullWidth*/}
                                        {/*            children="Save changes"*/}
                                        {/*            onClick={saveChange}*/}
                                        {/*            onKeyUp={saveChange}*/}
                                        {/*            style={{ width: 'auto' }}*/}
                                        {/*        />*/}
                                        {/*    </Grid>*/}
                                        {/* )}*/}
                                    </>
                                );
                            }
                        })()}
                    </Grid>
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
                                <p id="dialogMessage" data-testid="dialogMessage">
                                    <WarningOutlined className="hidden" id="warning-icon" data-testid="warning-icon" />
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
