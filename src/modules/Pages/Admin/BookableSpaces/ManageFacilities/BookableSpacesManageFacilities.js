import React from 'react';
import PropTypes from 'prop-types';
import { useCookies } from 'react-cookie';

import { Grid } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import AddIcon from '@mui/icons-material/Add';

import { HeaderBar } from 'modules/Pages/Admin/BookableSpaces/HeaderBar';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { pluralise, scrollToTopOfPage, slugifyName, StyledPrimaryButton, StyledSecondaryButton } from 'helpers/general';
import { addBreadcrumbsToSiteHeader, displayToastMessage } from 'modules/Pages/Admin/BookableSpaces/helpers';

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
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '1rem',
        '& button': {
            marginLeft: '0.5rem',
        },
    },
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
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        // initial the form on load
        if (
            facilityTypeListError === false &&
            facilityTypeListLoading === false &&
            facilityTypeList?.data?.facility_type_groups?.length > 0
        ) {
            const facilityTypesToStore = facilityTypeList?.data?.facility_type_groups?.flatMap(group =>
                group.facility_type_children.map(child => ({
                    facility_type_id: child.facility_type_id,
                    facility_type_name: child.facility_type_name,
                })),
            );
            setFormValues({
                ['facility_types']: facilityTypesToStore,
            });
            console.log('setSaveButtonVisibility at 1, to', saveButtonVisibilityAlwaysVisible);
            setSaveButtonVisibility(saveButtonVisibilityAlwaysVisible);
        }
    }, [facilityTypeListLoading, facilityTypeListError, facilityTypeList]);

    function closeDialog(e = null) {
        const dialog = !e ? document.getElementById('popupDialog') : e.target.closest('dialog');
        !!dialog && dialog.close();
    }

    const saveNewFacilityType = e => {
        const form = e.target.closest('form');

        const formData = new FormData(form);
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
                displayToastMessage('[BSMF-001] Sorry, an error occurred - the admins have been informed');
            });
        return true;
    };

    const displayGroupAddItemForm = e => {
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
                    <input type="text" name="facility_type_name" id="newFacilityType" value="" required />
                </div>
            </div>`;

        const dialogBodyElement = document.getElementById('dialogBody');
        !!dialogBodyElement && (dialogBodyElement.innerHTML = formBody);

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

    const saveChange = e => {
        scrollToTopOfPage();

        console.log('saveChange e=', e);
        console.log('saveChange formValues=', formValues);

        // save type changes
        const formTypesChanged = false;
        console.log('facilityTypeList?.data?.facility_type_groups=', facilityTypeList?.data?.facility_type_groups);
        console.log(
            'facilityTypeList?.data?.facility_type_groups?.facility_type_children=',
            facilityTypeList?.data?.facility_type_groups?.facility_type_children,
        );
        // Collect all the update operations that need to be performed
        const updatePromises = [];

        facilityTypeList?.data?.facility_type_groups?.forEach(ft => {
            ft?.facility_type_children.forEach(c => {
                const matchingFormValue = formValues?.facility_types.find(
                    f => f.facility_type_id === c.facility_type_id,
                );

                if (matchingFormValue.facility_type_name !== c.facility_type_name) {
                    const valuesToSend = {
                        facility_type_name: matchingFormValue.facility_type_name,
                        facility_type_id: matchingFormValue.facility_type_id,
                    };

                    // this is only use to check when we send a single example, but better than nothing
                    const cypressTestCookie = cookies.hasOwnProperty('CYPRESS_TEST_DATA')
                        ? cookies.CYPRESS_TEST_DATA
                        : null;
                    if (!!cypressTestCookie && location.host === 'localhost:2020' && cypressTestCookie === 'active') {
                        console.log('setting CYPRESS_DATA_SAVED to', valuesToSend);
                        setCookie('CYPRESS_DATA_SAVED', valuesToSend);
                    }

                    // Add the promise to our collection instead of handling it immediately
                    const updatePromise = actions
                        .updateSpacesFacilityType(valuesToSend)
                        .then(() => {
                            console.log(`Successfully updated facility type: ${valuesToSend.facility_type_name}`);
                            return { success: true, id: valuesToSend.facility_type_id };
                        })
                        .catch(e => {
                            console.log(
                                'catch: updating facility type (',
                                valuesToSend.facility_type_id,
                                valuesToSend.facility_type_name,
                                ') failed:',
                                e,
                            );
                            return { success: false, id: valuesToSend.facility_type_id, error: e };
                        });

                    updatePromises.push(updatePromise);
                }
            });
        });

        // If there are no updates needed, exit early
        if (updatePromises.length > 0) {
            // Wait for all update operations to complete
            Promise.allSettled(updatePromises)
                .then(results => {
                    // Count successes and failures
                    const successCount = results.filter(result => result.status === 'fulfilled' && result.value.success)
                        .length;
                    const failureCount = results.length - successCount;

                    // Display appropriate toast message
                    if (failureCount === 0) {
                        // All succeeded
                        displayToastMessage(`Facility ${pluralise('type', successCount)} updated`, false);
                    } else {
                        // Some or all failed
                        if (successCount > 0) {
                            displayToastMessage(
                                `[BSMF-002] Update failed: ${successCount} of ${results.length} facility ${pluralise(
                                    'type',
                                    results.length,
                                )} updated successfully. ${failureCount} failed - the admins have been informed`,
                            );
                        } else {
                            displayToastMessage(
                                `[BSMF-003] Update failed: All ${failureCount} facility type updates failed - the admins have been informed`,
                            );
                        }
                    }
                })
                .catch(error => {
                    // This shouldn't happen with allSettled, but just in case
                    console.error('Unexpected error in facility type updates:', error);
                    displayToastMessage(
                        '[BSMF-004] Sorry, an unexpected error occurred - the admins have been informed',
                    );
                    actions.loadAllFacilityTypes();
                })
                .finally(() => {
                    // Reload facility types only once after all operations complete
                    actions.loadAllFacilityTypes();
                    console.log('------------------');
                });
        }

        // save any Group changes
        if (!!formValues.addNew && (!formValues.newGroupName || !formValues.firstGroupEntryName)) {
            console.log('invalid'); // TODO
        }
        if (!!formValues.addNew && !!formValues.newGroupName && !!formValues.firstGroupEntryName) {
            const valuesToSendGroup = {};
            valuesToSendGroup.facility_type_group_name = formValues.newGroupName;
            const cypressTestCookie = cookies.hasOwnProperty('CYPRESS_TEST_DATA') ? cookies.CYPRESS_TEST_DATA : null;
            if (!!cypressTestCookie && location.host === 'localhost:2020' && cypressTestCookie === 'active') {
                console.log('setting CYPRESS_DATA_SAVED to', valuesToSendGroup);
                setCookie('CYPRESS_DATA_SAVED', valuesToSendGroup);
            }
            let groupSaved = false;
            return actions
                .createSpacesFacilityTypeGroup(valuesToSendGroup)
                .then(response => {
                    groupSaved = true;
                    console.log('response:', response);
                    const newGroupId = response?.data?.facility_type_group_id || false;
                    if (!newGroupId) {
                        throw 'Facility Type Group creation failed';
                    }
                    const tempFormValues = { ...formValues };
                    delete tempFormValues.newGroupName;
                    setFormValues(tempFormValues);

                    const valuesToSend = {};
                    valuesToSend.facility_type_name = formValues.firstGroupEntryName;
                    valuesToSend.facility_type__group_id = newGroupId;
                    !!newGroupId && actions.createSpacesFacilityType(valuesToSend);
                })
                .then(() => {
                    displayToastMessage('Group created', false);
                    const tempFormValues = { ...formValues };
                    delete tempFormValues.firstGroupEntryName;
                    setFormValues(tempFormValues);
                })
                .catch(error => {
                    if (!!groupSaved) {
                        // save type failed
                        console.log('save facility type failed', error);
                        displayToastMessage(
                            '[BSMF-005] Sorry, we were unable to create the first type for that group - the admins have been informed',
                        );
                    } else {
                        // save group failed
                        console.log('save facility type group failed', error);
                        displayToastMessage('[BSMF-006] Sorry, an error occurred - the admins have been informed');
                    }
                })
                .finally(() => {
                    actions.loadAllFacilityTypes(); // reload updated values
                });
        }

        return true;
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

    const displayFacilityTypes = () => {
        const sortedGroups =
            facilityTypeList?.data?.facility_type_groups?.sort(
                (a, b) => a.facility_type_group_order - b.facility_type_group_order,
            ) || [];

        const formDisplay = dataAvailable =>
            !!dataAvailable ? { marginBottom: '2rem', display: 'none' } : { marginBottom: '2rem' };
        return (
            <>
                {/* {!!facilityTypeList?.data?.facility_type_groups && (*/}
                <div style={{ margin: '0 0 2rem -2rem' }}>
                    <StyledPrimaryButton
                        id="showHideAddCampusFormButton"
                        style={{ marginLeft: '2rem', marginTop: '2rem', textTransform: 'initial' }}
                        children={addFormDefaultLabel}
                        onClick={showHideAddCampusForm}
                        data-testid="add-new-group-button"
                    />
                </div>
                {/* )}*/}
                {facilityTypeList?.data?.facility_type_groups?.length === 0 && (
                    <p data-testid="space-facility-types-empty-message">No facility types currently in system.</p>
                )}
                <form>
                    <div
                        id="add-new-facility-group-form"
                        style={formDisplay(!!facilityTypeList?.data?.facility_type_groups)}
                    >
                        <Typography component={'h3'} variant={'h6'}>
                            New Facility group
                        </Typography>
                        <FormControl variant="standard" fullWidth>
                            <InputLabel htmlFor="newGroupname">Name of new Facility type group</InputLabel>
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
                            <InputLabel htmlFor="firstGroupEntry">Name of first Facility type in group</InputLabel>
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
                    </div>
                    {/* TODO change to grid */}
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        {sortedGroups.map(group => (
                            <div
                                data-testid={`facilitygroup-${slugifyName(group.facility_type_group_name)}`}
                                key={group.facility_type_group_name}
                                style={{ minWidth: '200px' }}
                            >
                                <Typography component={'h3'} variant={'h6'} style={{ whiteSpace: 'nowrap' }}>
                                    {group.facility_type_group_name}
                                </Typography>

                                <div id={`listWrapper-${group.facility_type_group_id}`}>
                                    {group.facility_type_children.map(facilityType => {
                                        return (
                                            <Input
                                                id={`facilitytype-input-${facilityType.facility_type_id}`}
                                                key={`facilitytype-input-${facilityType.facility_type_id}`}
                                                value={
                                                    formValues.facility_types?.find(
                                                        f => f?.facility_type_id === facilityType?.facility_type_id,
                                                    )?.facility_type_name || facilityType.facility_type_name
                                                }
                                                onChange={handleChange(`facilitytype-${facilityType.facility_type_id}`)}
                                                inputProps={{
                                                    'aria-label': `Edit ${facilityType.facility_type_name} facility type, part of ${facilityType.facility_type_group_name}`,
                                                    // maxLength: 100
                                                    'data-testid': `facilitytype-input-${facilityType.facility_type_id}`,
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                                <IconButton
                                    color="primary"
                                    data-testid={`add-group-${group.facility_type_group_id}-button`}
                                    id={`add-group-${group.facility_type_group_id}-button`}
                                    onClick={displayGroupAddItemForm}
                                    data-groupid={group.facility_type_group_id}
                                >
                                    <AddIcon data-testid={`add-type-${slugifyName(group.facility_type_group_name)}`} />
                                </IconButton>
                            </div>
                        ))}
                    </div>
                    {!!saveButtonVisibility && (
                        <div style={{ marginTop: '2rem' }}>
                            <StyledPrimaryButton
                                id="saveChange"
                                data-testid="spaces-facilitytypes-save-button"
                                fullWidth
                                children="Save changes"
                                onClick={saveChange}
                                onKeyUp={saveChange}
                                style={{ width: 'auto' }}
                            />
                        </div>
                    )}
                </form>
            </>
        );
    };
    return (
        <StandardPage title="Spaces">
            <HeaderBar pageTitle="Manage Facility types" currentPage="manage-facilities" />

            <section aria-live="assertive">
                <StandardCard standardCardId="location-list-card" noPadding noHeader style={{ border: 'none' }}>
                    <Grid container>
                        <Grid item xs={12} md={4} style={{ paddingTop: 0 }}>
                            {(() => {
                                if (
                                    !!facilityTypeUpdating ||
                                    !!facilityTypeGroupAdding ||
                                    !!facilityTypeAdding ||
                                    !!facilityTypeListLoading
                                ) {
                                    return <InlineLoader message="Loading" />;
                                } else if (!!facilityTypeListError) {
                                    return <p data-testid="apiError">Something went wrong - please try again later.</p>;
                                } else {
                                    return (
                                        <div data-testid="spaces-location-wrapper">
                                            {displayFacilityTypes()}
                                            <StyledMainDialog
                                                id={'popupDialog'}
                                                closedby="any"
                                                data-testid="main-dialog"
                                            >
                                                <form>
                                                    <div id="dialogBody">xxx</div>
                                                    <div id="dialogFooter" className={'dialogFooter'}>
                                                        <div>
                                                            <StyledSecondaryButton
                                                                className={'secondary'}
                                                                children={'Cancel'}
                                                                onClick={closeDialog}
                                                                data-testid="dialog-cancel-button"
                                                            />
                                                        </div>
                                                        <div>
                                                            <StyledPrimaryButton
                                                                id={'saveButton'}
                                                                className={'primary'}
                                                                children={'Save'}
                                                                onClick={saveNewFacilityType}
                                                                data-testid="dialog-save-button"
                                                            />
                                                        </div>
                                                    </div>
                                                </form>
                                            </StyledMainDialog>
                                        </div>
                                    );
                                }
                            })()}
                        </Grid>
                    </Grid>
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
};

export default React.memo(BookableSpacesManageFacilities);
