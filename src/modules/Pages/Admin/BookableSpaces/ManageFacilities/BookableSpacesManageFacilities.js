import React from 'react';
import PropTypes from 'prop-types';
import { useCookies } from 'react-cookie';

import { Grid } from '@mui/material';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';

import AddIcon from '@mui/icons-material/Add';

import { HeaderBar } from 'modules/Pages/Admin/BookableSpaces/HeaderBar';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { slugifyName, StyledPrimaryButton } from 'helpers/general';
import { addBreadcrumbsToSiteHeader, displayToastMessage } from 'modules/Pages/Admin/BookableSpaces/helpers';

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
}) => {
    // console.log('load facilityTypeList', facilityTypeList, facilityTypeListLoading, facilityTypeListError);
    // console.log('load facilityTypeAdded', facilityTypeAdded, facilityTypeAdding, facilityTypeAddError);
    console.log(
        'load facilityTypeGroupAdded',
        facilityTypeGroupAdded,
        facilityTypeGroupAdding,
        facilityTypeAddGroupError,
    );
    // console.log('facilityTypeList?.data?.facility_types', facilityTypeList?.data?.facility_types);

    const [cookies, setCookie] = useCookies();

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
            facilityTypeList?.data?.facility_types.length > 0
        ) {
            setFormValues({
                // ...formValues,
                ['facility_types']: facilityTypeList?.data?.facility_types,
            });
        }
    }, [facilityTypeListLoading, facilityTypeListError, facilityTypeList]);

    const displayGroupAddItemForm = e => {
        console.log('displayGroupAddItemForm e=', e);
        const newField = (
            <Input
                // id="alertTitle"
                // data-testid="admin-alerts-form-title"
                value=""
                // onChange={handleChange('alertTitle')}
                // inputProps={{ maxLength: 100 }}
                aria-label="Add facility type to {facility.facility_type_group_name}"
            />
        );
    };

    const handleChange = prop => e => {
        const theNewValue = e.target.value;

        console.log('handleChange', prop, theNewValue, formValues);

        if (prop.startsWith('facilitytype-')) {
            const facilityTypeid = parseInt(prop.replace('facilitytype-', ''), 10);
            const updatedData = formValues.facility_types.map(f =>
                f?.facility_type_id === facilityTypeid ? { ...f, facility_type_name: theNewValue } : f,
            );
            console.log('handleChange after facilityTypes=', updatedData);
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

        // const id = e?.target.id;
        // const value = e?.target?.value;
        // console.log('handleChange ', id, e);
        // console.log('handleChange value=', value);
        // setFormValues({
        //     ...formValues,
        //     [id]: value,
        // });
    };

    const saveChange = e => {
        const cypressTestCookie = cookies.hasOwnProperty('CYPRESS_TEST_DATA') ? cookies.CYPRESS_TEST_DATA : null;

        console.log('saveChange e=', e);
        console.log('saveChange formValues=', formValues);
        // if (
        //     // !!formValues.addNew &&
        //     !!formValues.newGroupName &&
        //     !!formValues.firstGroupEntryName
        // ) {
        const valuesToSendGroup = {};
        valuesToSendGroup.facility_type_group_name = formValues.newGroupName;
        if (!!cypressTestCookie && location.host === 'localhost:2020' && cypressTestCookie === 'active') {
            console.log('setting CYPRESS_DATA_SAVED to', valuesToSendGroup);
            setCookie('CYPRESS_DATA_SAVED', valuesToSendGroup);
        }
        const groupSaved = false;
        return actions.createSpacesFacilityTypeGroup(valuesToSendGroup);
        // .then(response => {
        //     groupSaved = true;
        //     console.log('response:', response);
        //     const newGroupId = response?.data?.facility_type_group_id || false;
        //     if (!newGroupId) {
        //         throw 'Facility Type Group creation failed';
        //     }
        //     const tempFormValues = { ...formValues };
        //     delete tempFormValues.newGroupName;
        //     setFormValues(tempFormValues);
        //
        //     const valuesToSend = {};
        //     valuesToSend.facility_type_name = formValues.firstGroupEntryName;
        //     valuesToSend.facility_type__group_id = newGroupId;
        //     !!newGroupId && actions.createSpacesFacilityType(valuesToSend);
        // })
        // .then(() => {
        //     displayToastMessage('Group created', false);
        //     const tempFormValues = { ...formValues };
        //     delete tempFormValues.firstGroupEntryName;
        //     setFormValues(tempFormValues);
        // })
        // .catch(error => {
        //     if (!!groupSaved) {
        //         // save type failed
        //         console.log('save facility type failed', error);
        //         displayToastMessage(
        //             '[BSMF-001] Sorry, we were unable to create the first type for that group - the admins have been informed',
        //         );
        //     } else {
        //         // save group failed
        //         console.log('save facility type group failed', error);
        //         displayToastMessage('[BSMF-002] Sorry, an error occurred - the admins have been informed');
        //     }
        // })
        // .finally(() => {
        //     actions.loadAllFacilityTypes(); // reload updated values
        // })
        // }
    };
    const addFormDefaultLabel = 'Add new Facility group';
    const isAddNewGroupFormClosed = addNewForm => addNewForm.style.display === 'none';
    const openAddNewGroupForm = (addNewForm, formShowHideButton) => {
        addNewForm.style.display = 'block';
        !!formShowHideButton && (formShowHideButton.innerText = 'Clear new Group form');
        setFormValues({
            ...formValues,
            // ['addNew']: true,
        });
    };
    const closeAddNewGroupForm = (addNewForm, formShowHideButton) => {
        addNewForm.style.display = 'none';
        !!formShowHideButton && (formShowHideButton.innerText = addFormDefaultLabel);
        const tempFormValues = { ...formValues };
        delete tempFormValues.newGroupName;
        delete tempFormValues.firstGroupEntryName;
        setFormValues({
            ...tempFormValues,
            // ['addNew']: false,
        });
    };
    const showHideAddCampusForm = () => {
        const addNewForm = document.getElementById('add-new-facility=group-form');
        const formShowHideButton = document.getElementById('showHideAddCampusFormButton');
        if (!addNewForm) {
            return null;
        }

        if (isAddNewGroupFormClosed(addNewForm)) {
            openAddNewGroupForm(addNewForm, formShowHideButton);
        } else {
            console.log('ere');
            closeAddNewGroupForm(addNewForm, formShowHideButton);
            console.log('after');
        }
        document.activeElement.blur();
        return true;
    };

    const displayFacilityTypes = () => {
        if (!facilityTypeList.data?.facility_types) {
            return null;
        }

        // Group facility types by facility_type_group_name
        const groupedFacilities = facilityTypeList.data.facility_types.reduce((groups, facility) => {
            const groupName = facility.facility_type_group_name;
            if (!groups[groupName]) {
                groups[groupName] = {
                    groupName: groupName,
                    groupOrder: facility.facility_type_group_order,
                    groupType: facility.facility_type_group_type,
                    facilities: [],
                };
            }
            groups[groupName].facilities.push(facility);
            return groups;
        }, {});

        // Convert to array and sort by group order
        const sortedGroups = Object.values(groupedFacilities)
            .sort((a, b) => a.groupOrder - b.groupOrder)
            .map((group, index) => ({
                ...group,
                groupId: index + 1,
            }));

        return (
            <form>
                {/* TODO change to grid */}
                <div style={{ display: 'flex', gap: '2rem' }}>
                    {sortedGroups.map(facilityGroup => (
                        <div
                            data-testid={`facilitygroup-${slugifyName(facilityGroup.groupName)}`}
                            key={facilityGroup.groupName}
                            style={{ minWidth: '200px' }}
                        >
                            <Typography component={'h3'} variant={'h6'} style={{ whiteSpace: 'nowrap' }}>
                                {facilityGroup.groupName}
                            </Typography>

                            <div>
                                {facilityGroup.facilities.map(facilityType => {
                                    return (
                                        <Input
                                            key={`facilitytype-input-${facilityType.facility_type_id}`}
                                            value={
                                                formValues.facility_types?.find(
                                                    f => f?.facility_type_id === facilityType?.facility_type_id,
                                                )?.facility_type_name
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
                            <AddIcon
                                onClick={() => displayGroupAddItemForm(facilityGroup.groupId)}
                                data-testid={`add-type-${slugifyName(facilityGroup.groupName)}`}
                            />
                        </div>
                    ))}
                </div>
                <div style={{ marginTop: '2rem' }}>
                    <StyledPrimaryButton
                        id="saveChange"
                        data-testid="spaces-facilitytypes-saveChange"
                        fullWidth
                        children="Save changes"
                        onClick={saveChange}
                        // onKeyUp={saveChange}
                        style={{ width: 'auto' }}
                    />
                </div>
            </form>
        );
    };
    return (
        <StandardPage title="Spaces">
            <HeaderBar pageTitle="Manage Facility types" currentPage="manage-facilities" />

            <section aria-live="assertive">
                <StandardCard standardCardId="location-list-card" noPadding noHeader style={{ border: 'none' }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4} style={{ paddingTop: 0 }}>
                            <div style={{ margin: '0 0 2rem -2rem' }}>
                                <StyledPrimaryButton
                                    id="showHideAddCampusFormButton"
                                    style={{ marginLeft: '2rem', marginTop: '2rem', textTransform: 'initial' }}
                                    children={addFormDefaultLabel}
                                    onClick={showHideAddCampusForm}
                                    data-testid="add-new-group-button"
                                />
                            </div>
                            <form id="add-new-facility=group-form" style={{ marginBottom: '2rem', display: 'none' }}>
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
                            </form>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12} md={4} style={{ paddingTop: 0 }}>
                            {(() => {
                                // if (!!savingProgressShown) {
                                //     return <InlineLoader message="Saving" />;
                                // } else
                                if (!!facilityTypeGroupAdding || !!facilityTypeAdding || !!facilityTypeListLoading) {
                                    return <InlineLoader message="Loading" />;
                                } else if (!!facilityTypeListError) {
                                    return <p>Something went wrong - please try again later.</p>;
                                } else if (
                                    !facilityTypeList?.data?.facility_types ||
                                    facilityTypeList?.data?.facility_types.length === 0
                                ) {
                                    return <p>No facility types currently in system.</p>;
                                } else {
                                    return <div data-testid="spaces-location-wrapper">{displayFacilityTypes()}</div>;
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
};

export default React.memo(BookableSpacesManageFacilities);
