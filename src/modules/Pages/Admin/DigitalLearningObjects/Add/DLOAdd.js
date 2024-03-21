import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

const moment = require('moment-timezone');

import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import { makeStyles } from '@mui/styles';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';

import { useConfirmationState } from 'hooks';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { scrollToTopOfPage } from 'helpers/general';

const useStyles = makeStyles(theme => ({
    charactersRemaining: {
        textAlign: 'right',
        color: '#504e4e',
        fontSize: '0.8em',
    },
    facetControl: {
        display: 'flex',
        alignItems: 'flex-start',
        width: '100%',
        '& span:first-child': {
            paddingBlock: 0,
        },
        '& .MuiFormControlLabel-label': {
            fontSize: '0.9rem',
        },
        // '& span:nth-child(2)': {
        //     color: '#333',
        //     textOverflow: 'initial',
        // },
    },
    facetRadioControl: {
        display: 'block',
        '& span:first-child': {
            paddingBlock: 0,
        },
    },
    //     typingArea: {
    //         '& textarea ': {
    //             backgroundColor: 'rgb(236, 236, 236, 0.5)',
    //             borderRadius: 4,
    //             padding: 10,
    //         },
    //         '& label': {
    //             color: theme.typography.caption.color,
    //             paddingLeft: 10,
    //             paddingTop: 10,
    //         },
    //     },
}));

export const DLOAdd = ({
    actions,
    dlorItemCreating,
    dlorItemError,
    dlorItem,
    dlorTeam,
    dlorTeamLoading,
    dlorTeamError,
    dlorFilterList,
    dlorFilterListLoading,
    dlorFilterListError,
    account,
}) => {
    const classes = useStyles();
    const history = useHistory();

    // !!dlorItem && console.log('DLOAdd creating=', dlorItemCreating, '; error=', dlorItemError, '; response=', dlorItem);
    // !!dlorTeam && console.log('DLOAdd team=', dlorTeamLoading, '; error=', dlorTeamError, '; response=', dlorTeam);
    // !!dlorFilterList &&
    console.log(
        'DLOAdd filters=',
        dlorFilterListLoading,
        '; error=',
        dlorFilterListError,
        '; response=',
        dlorFilterList,
    );

    const [isOpen, showConfirmation, hideConfirmation] = useConfirmationState();

    const [saveStatus, setSaveStatus] = useState(null); // control confirmation box display
    const [isFormValid, setFormValidity] = useState(false); // enable-disable the save button
    const [showTeamCreationForm, setShowTeamCreationForm] = useState(false); // enable-disable the Team creation fields

    const titleMinimumLength = 10;
    const descriptionMinimumLength = 100;
    const summaryMinimumLength = 20;
    const characterCount = (numCharsCurrent, numCharsMin, fieldName) => {
        const missingCharCount = numCharsMin - numCharsCurrent;
        return (
            <div className={classes.charactersRemaining} data-testid={`input-characters-remaining-${fieldName}`}>
                {numCharsCurrent > 0 && missingCharCount > 0
                    ? `at least ${missingCharCount} more characters needed`
                    : ''}
            </div>
        );
    };

    function getTodayPlusOneYear(baseDate = null) {
        const today = baseDate || moment();
        return today
            .add(1, 'year')
            .hour(0)
            .minute(1) // 1 minute past midnight
            .format('YYYY-MM-DDTHH:mm');
    }

    const formDefaults = {
        object_title: '',
        object_description: '',
        object_summary: '',
        object_owning_team_id: 1,
        object_embed_type: 'link',
        object_publishing_user: account?.id,
        object_status: 'new',
        object_review_date_next: getTodayPlusOneYear(),
        team_name: '',
        team_manager: '',
        team_email: '',
    };
    const [formValues, setFormValues] = useState(formDefaults);

    useEffect(() => {
        if (!dlorTeamError && !dlorTeamLoading && !dlorTeam) {
            actions.loadOwningTeams();
        }
        if (!dlorFilterListError && !dlorFilterListLoading && !dlorFilterList) {
            actions.loadAllFilters();
        }
        setFormValidity(validateValues(formDefaults));
    }, []);

    useEffect(() => {
        console.log('useEffect dlorItem=', dlorItem, ';dlorItemError', dlorItemError);
        if ((!!dlorItem && !!dlorItem.data?.object_id) || !!dlorItemError) {
            console.log('useEffect showing conf');
            setSaveStatus('complete');
            showConfirmation();
        }
    }, [showConfirmation, dlorItem, dlorItemError]);

    // useEffect(() => {
    //     // this is temporary while we work out how to handle it, then it will be a value on the db so they can set it when they create the facet type
    //     // decide what _type_ each facet type is
    //     !!dlorFilterList &&
    //         dlorFilterList.map(f => {
    //             if (
    //                 f.facet_type_slug === 'topic' ||
    //                 f.facet_type_slug === 'media_format' ||
    //                 f.facet_type_slug === 'subject'
    //             ) {
    //                 // 1:n[O]
    //                 // an Object will always have one of these, and "other" should be in the list and appear last
    //                 f.functionType = 'one-or-more-with-other';
    //             } else if (f.facet_type_slug === 'graduate_attributes') {
    //                 // 0:n[-]
    //                 // an Object does not require this, but may have many - no "other" option
    //                 f.functionType = 'zero-or-more-no-other';
    //             } else if (f.facet_type_slug === 'item_type' || f.facet_type_slug === 'licence') {
    //                 // 1:1[O]
    //                 // an object will have one (and only one) of these, but "Other" is an option
    //                 f.functionType = 'one-with-other';
    //             }
    //         });
    // }, [dlorFilterList]);

    // useEffect(() => {
    //     if (!!dlorTeam && dlorTeam.length > 0) {
    //         setFormValues({
    //             ...formValues,
    //             ['object_owning_team_id']: dlorTeam.filter((t, index) => index === 0),
    //         });
    //     }
    // }, [dlorTeam]);

    const saveNewDlor = () => {
        const valuesTosSend = formValues;
        if (formValues.object_owning_team_id === 'new') {
            delete valuesTosSend.object_owning_team_id;
        } else {
            delete valuesTosSend.team_name;
            delete valuesTosSend.team_manager;
            delete valuesTosSend.team_email;
        }

        for (const [key, value] of Object.entries(valuesTosSend)) {
            if (!key.startsWith('facet::')) {
                continue;
            }
            const parts = key.split('::');
            const facetTypeSlug = parts[1];
            const facetSlug = parts[2];

            if (valuesTosSend.hasOwnProperty('facetType')) {
                if (valuesTosSend.facetType.hasOwnProperty(facetTypeSlug)) {
                    valuesTosSend.facetType[facetTypeSlug].push(facetSlug);
                } else {
                    valuesTosSend.facetType[facetTypeSlug] = [facetSlug];
                }
            } else {
                valuesTosSend.facetType = { [facetTypeSlug]: [facetSlug] };
            }

            delete valuesTosSend[key];
        }

        console.log('saveNewDlor after valuesTosSend=', valuesTosSend);

        return actions.createDLor(valuesTosSend);
    };

    const locale = {
        successMessage: {
            confirmationTitle: 'The object has been created',
            confirmationMessage: '',
            cancelButtonLabel: 'Add another Object',
            confirmButtonLabel: 'Return to list page',
        },
        errorMessage: {
            confirmationTitle: dlorItemError,
            confirmationMessage: '',
            confirmButtonLabel: 'Return to list page',
        },
    };

    const handleLeavePage = () => {
        window.alert('leave the page: TBA, where do we go on exit?');
    };

    const navigateToDlorAdminHomePage = () => {
        // TODO also want to clear form here too before nav, so back button gives clear form?

        // actions.loadAllDLORs(); // force reload of data now we have added a new one. needed?
        history.push('/admin/dlor');
        scrollToTopOfPage();
    };

    const clearForm = actiontype => {
        hideConfirmation();
        setFormValues(formDefaults);
    };

    const handleChange = prop => e => {
        // console.log('formValues=', formValues);
        console.log('e.target.type=', e.target.type);
        const newValue =
            e.target.hasOwnProperty('checked') && e.target.type !== 'radio' ? e.target.checked : e.target.value; // .trimEnd();
        console.log('handleChange', prop, newValue, e.target);
        if (prop === 'object_owning_team_id') {
            setShowTeamCreationForm(newValue === 'new');
            newValue === 'new' && console.log('user chose new');
        }

        const newValues = { ...formValues, [prop]: newValue };
        console.log('newValues=', newValues);
        setFormValidity(validateValues(newValues));
        setFormValues(newValues);
    };

    const validateValues = currentValues => {
        let isValid = true;

        currentValues.object_title.length < titleMinimumLength && (isValid = false);
        currentValues.object_description.length < descriptionMinimumLength && (isValid = false);
        currentValues.object_summary.length < summaryMinimumLength && (isValid = false);
        // currentValues.object_owning_team_id > 0 && (isValid = false);
        !(currentValues.object_embed_type === 'link' || currentValues.object_embed_type === 'embed') &&
            (isValid = false);
        // valid user id is 8 or 9 char
        (currentValues.object_publishing_user.length < 8 || currentValues.object_publishing_user.length > 10) &&
            (isValid = false);
        currentValues.object_owning_team_id === 'new' && currentValues.team_name.length < 1 && (isValid = false);
        currentValues.object_owning_team_id === 'new' && currentValues.team_manager.length < 1 && (isValid = false);
        currentValues.object_owning_team_id === 'new' && currentValues.team_email.length < 1 && (isValid = false);

        // // check the required facets are checked
        // !!dlorFilterList &&
        //     dlorFilterList.forEach(f => {
        //         const controlType = getFacetControlType(f);
        //         if (controlType.startsWith('one')) {
        //             // console.log('validateValues check facet ', f.facet_type_slug);
        //             const hasKeyStartingWithFacet = Object.keys(currentValues).some(key =>
        //                 key.startsWith(`facet::${f.facet_type_slug}`),
        //             );
        //             !hasKeyStartingWithFacet && (isValid = false);
        //
        //             // console.log('validateValues hasKeyStartingWithFacet ', f.facet_type_slug, hasKeyStartingWithFacet);
        //         }
        //     });
        console.log('validateValues currentValues=', isValid, currentValues);

        return isValid;
    };

    if (!!dlorTeamError) {
        return (
            <StandardPage>
                <StandardCard>
                    {/* {getTitleBlock()}*/}
                    <Typography variant="body1" data-testid="dlor-addObject-error">
                        {dlorTeamError}
                    </Typography>
                </StandardCard>
            </StandardPage>
        );
    }

    function getFacetControlType(filterItem) {
        /*

        one-or-more-with-other   required=true   count=1+
        zero-or-more-no-other                    count=0+
        one-with-other           required=true   count=1

         */
        const facetTypeSlug = filterItem.facet_type_slug;
        let displayType = '';
        if (facetTypeSlug === 'topic' || facetTypeSlug === 'media_format' || facetTypeSlug === 'subject') {
            // 1:n[O]
            // an Object will always have one of these, and "other" should be in the list and appear last
            displayType = 'one-or-more-with-other';
        } else if (facetTypeSlug === 'graduate_attributes') {
            // 0:n[-]
            // an Object does not require this, but may have many - no "other" option
            displayType = 'zero-or-more-no-other';
        } else if (facetTypeSlug === 'item_type' || facetTypeSlug === 'licence') {
            // 1:1[O]
            // an object will have one (and only one) of these, but "Other" is an option
            displayType = 'one-with-other';
        }
        return displayType;
    }

    function displayControlByFacetType(filterItem) {
        const controlType = getFacetControlType(filterItem);
        let result = <></>;
        if (controlType === 'one-or-more-with-other') {
            result =
                !!filterItem.facet_list &&
                filterItem.facet_list.map(thisfacet => (
                    <FormControlLabel
                        key={`${filterItem.facet_type_slug}-${thisfacet.facet_slug}`}
                        className={classes.facetControl}
                        control={
                            <Checkbox
                                onChange={handleChange(`facet::${filterItem.facet_type_slug}::${thisfacet.facet_slug}`)}
                            />
                        }
                        label={thisfacet.facet_name}
                        // value="link"
                    />
                ));
        } else if (controlType === 'zero-or-more-no-other') {
            result =
                !!filterItem.facet_list &&
                filterItem.facet_list.map(thisfacet => (
                    <FormControlLabel
                        key={`${filterItem.facet_type_slug}-${thisfacet.facet_slug}`}
                        className={classes.facetControl}
                        control={
                            <Checkbox
                                onChange={handleChange(`facet::${filterItem.facet_type_slug}::${thisfacet.facet_slug}`)}
                            />
                        }
                        label={thisfacet.facet_name}
                    />
                ));
            // return <>zero-or-more-no-other</>;
        } else if (controlType === 'one-with-other') {
            console.log('filterItem=', filterItem);
            const radioGroupName = !!filterItem && `object_facet_${filterItem.facet_type_slug}_radio-buttons-group`;
            console.log('radioGroupName=', radioGroupName);
            console.log('filterItem.facet_list=', filterItem.facet_list);
            console.log(
                'default value=',
                !!filterItem.facet_list && filterItem.facet_list.length > 0 && !filterItem.facet_list.slice(0, 1),
            );
            result = (
                <RadioGroup
                    aria-labelledby="demo-radio-object_embed_type_label-group-label"
                    defaultValue={
                        !!filterItem.facet_list &&
                        filterItem.facet_list.length > 0 &&
                        !filterItem.facet_list.slice(0, 1)[0] // .facet_slug
                    }
                    name={radioGroupName}
                    value={filterItem.facet_slug}
                    // onChange={handleChange(`facet::${filterItem.facet_type_slug}::${thisfacet.facet_slug}`)}
                >
                    {!!filterItem.facet_list &&
                        filterItem.facet_list.map(thisfacet => (
                            <FormControlLabel
                                key={`${filterItem.facet_type_slug}-${thisfacet.facet_slug}`}
                                className={classes.facetControl}
                                control={<Radio value={thisfacet.facet_slug} />}
                                label={thisfacet.facet_name}
                                onChange={handleChange(`facet::${filterItem.facet_type_slug}::${thisfacet.facet_slug}`)}
                            />
                        ))}
                </RadioGroup>
            );
        } else {
            result = <>unknown facet type</>;
        }
        return result;
    }

    return (
        <StandardPage title="DLOR Management">
            <StandardCard title="Create an Object for Digital learning objects">
                <form id="dlor-add-form">
                    {saveStatus === 'complete' && (
                        <ConfirmationBox
                            actionButtonColor="primary"
                            actionButtonVariant="contained"
                            confirmationBoxId="dlor-creation-outcome"
                            onAction={() => navigateToDlorAdminHomePage()}
                            hideCancelButton={!locale.successMessage.cancelButtonLabel}
                            cancelButtonLabel={locale.successMessage.cancelButtonLabel}
                            onCancelAction={() => clearForm()}
                            onClose={hideConfirmation}
                            isOpen={isOpen}
                            locale={!dlorItemError ? locale.successMessage : locale.errorMessage}
                        />
                    )}
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormControl
                                variant="standard"
                                fullWidth
                                // className={classes.typingArea}
                            >
                                <InputLabel htmlFor="object_title">Object title *</InputLabel>
                                <Input
                                    id="object_title"
                                    data-testid="object_title"
                                    // error={}
                                    required
                                    value={formValues?.object_title}
                                    onChange={handleChange('object_title')}
                                />
                                {!!formValues.object_title &&
                                    characterCount(formValues.object_title.length, titleMinimumLength, 'object_title')}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl
                                variant="standard"
                                // className={classes.typingArea}
                                fullWidth
                            >
                                <InputLabel htmlFor="object_publishing_user">Publishing user *</InputLabel>
                                <Input
                                    id="object_publishing_user"
                                    data-testid="object_publishing_user"
                                    required
                                    value={formValues?.object_publishing_user}
                                    onChange={handleChange('object_publishing_user')}
                                    style={{ width: '20em' }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} style={{ minHeight: 95 }}>
                            <InputLabel id="object_owning_team_label">Owning Team</InputLabel>
                            {!!dlorTeam && (
                                <Select
                                    defaultValue={dlorTeam.filter((t, index) => index === 0)}
                                    value={formValues?.object_owning_team_id}
                                    onChange={handleChange('object_owning_team_id')}
                                    aria-labelledby="object_owning_team_label"
                                    id="object_owning_team"
                                    data-testid="object_owning_team"
                                >
                                    {dlorTeam.map(t => (
                                        <MenuItem key={t.team_id} value={t.team_id}>
                                            {t.team_name}
                                        </MenuItem>
                                    ))}
                                    <MenuItem value="new" data-testid="object-add-teamid-new">
                                        Create a team
                                    </MenuItem>
                                </Select>
                            )}
                        </Grid>
                        {showTeamCreationForm && (
                            <Grid item xs={12}>
                                <FormControl
                                    variant="standard"
                                    // className={classes.typingArea}
                                    fullWidth
                                >
                                    <InputLabel htmlFor="team_name">Name of new Team *</InputLabel>
                                    <Input
                                        id="team_name"
                                        data-testid="team_name"
                                        value={formValues?.team_name}
                                        onChange={handleChange('team_name')}
                                    />
                                </FormControl>
                                <FormControl
                                    variant="standard"
                                    // className={classes.typingArea}
                                    fullWidth
                                >
                                    <InputLabel htmlFor="team_manager">Name of Team manager *</InputLabel>
                                    <Input
                                        id="team_manager"
                                        data-testid="team_manager"
                                        required
                                        value={formValues?.team_manager}
                                        onChange={handleChange('team_manager')}
                                    />
                                </FormControl>
                                <FormControl
                                    variant="standard"
                                    // className={classes.typingArea}
                                    fullWidth
                                >
                                    <InputLabel htmlFor="team_email">Team email *</InputLabel>
                                    <Input
                                        id="team_email"
                                        data-testid="team_email"
                                        required
                                        value={formValues?.team_email}
                                        onChange={handleChange('team_email')}
                                        type="email"
                                    />
                                </FormControl>
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <FormControl variant="standard" fullWidth>
                                <InputLabel htmlFor="object_description">Description of Object *</InputLabel>
                                <Input
                                    id="object_description"
                                    data-testid="object_description"
                                    multiline
                                    required
                                    rows={6}
                                    value={formValues?.object_description}
                                    onChange={handleChange('object_description')}
                                />
                                {!!formValues.object_description &&
                                    characterCount(
                                        formValues.object_description.length,
                                        descriptionMinimumLength,
                                        'object_description',
                                    )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl
                                variant="standard"
                                // className={classes.typingArea}
                                fullWidth
                            >
                                <InputLabel htmlFor="object_summary">Summary of Object *</InputLabel>
                                <Input
                                    id="object_summary"
                                    data-testid="object_summary"
                                    multiline
                                    required
                                    rows={2}
                                    value={formValues?.object_summary}
                                    onChange={handleChange('object_summary')}
                                />
                                {!!formValues.object_summary &&
                                    characterCount(
                                        formValues.object_summary.length,
                                        summaryMinimumLength,
                                        'object_summary',
                                    )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl variant="standard" fullWidth>
                                <FormLabel id="object_embed_type_label">Object inclusion type</FormLabel>
                                <RadioGroup
                                    aria-labelledby="demo-radio-object_embed_type_label-group-label"
                                    defaultValue="link"
                                    name="object_embed_type_radio-buttons-group"
                                    row
                                    value={formValues?.object_embed_type}
                                    onChange={handleChange('object_embed_type')}
                                >
                                    <FormControlLabel value="link" control={<Radio />} label="Link" />
                                    <FormControlLabel value="embed" control={<Radio />} label="Embedded" disabled />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        {(() => {
                            if (!!dlorFilterListLoading) {
                                // console.log('filterlistloading');
                                return (
                                    <Typography variant="body1" data-testid="dlor-homepage-error">
                                        <InlineLoader message="Loading" />
                                    </Typography>
                                );
                            } else if (!!dlorFilterListError) {
                                // console.log('dlorFilterListError');
                                return (
                                    <Typography variant="body1" data-testid="dlor-homepage-error">
                                        <div>An Error</div>
                                        {dlorFilterListError}
                                    </Typography>
                                );
                            } else if (!dlorFilterList || dlorFilterList.length === 0) {
                                return (
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <Typography variant="body1" data-testid="dlor-homepage-noresult">
                                                Missing filters: We did not find any entries in the system - please try
                                                again later.
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                );
                            } else {
                                console.log('dlorFilterList AAA=', dlorFilterList);
                                return (
                                    <>
                                        <Grid item xs={12}>
                                            <Typography component={'h2'} variant={'h6'}>
                                                Filters
                                            </Typography>
                                        </Grid>
                                        {!!dlorFilterList &&
                                            dlorFilterList.map(filterItem => {
                                                const controlType = getFacetControlType(filterItem);
                                                return (
                                                    <Grid item xs={4} key={filterItem.facet_type_slug}>
                                                        <Typography component={'h3'} variant={'h7'}>
                                                            {!!filterItem.facet_type_name && filterItem.facet_type_name}{' '}
                                                            {controlType.endsWith('with-other') && (
                                                                <span className={classes.required}>*</span>
                                                            )}
                                                        </Typography>
                                                        {displayControlByFacetType(filterItem)}

                                                        {/* {getFacetControlType(facetTypeSlug) !== 'one-or-more-with-other' &&*/}
                                                        {/*    getFacetControlType(facetTypeSlug) !== 'zero-or-more-no-other' &&*/}
                                                        {/*    getFacetControlType(facetTypeSlug) !== 'one-with-other' && (*/}
                                                        {/*        <p>*/}
                                                        {/*            unknown facet type {filterItem.facet_type_name} : {functionType}*/}
                                                        {/*        </p>*/}
                                                        {/*    )}*/}
                                                    </Grid>
                                                );
                                            })}
                                    </>
                                );
                            }
                        })()}
                        <Grid item xs={12}>
                            <FormControl variant="standard" fullWidth>
                                <FormLabel id="object_status_label">Object publication status</FormLabel>
                                <RadioGroup
                                    aria-labelledby="demo-radio-object_status_label-group-label"
                                    defaultValue="new"
                                    name="object_status_radio-buttons-group"
                                    row
                                    value={formValues?.object_status}
                                    onChange={handleChange('object_status')}
                                >
                                    <FormControlLabel
                                        value="current"
                                        control={<Radio />}
                                        label="Published"
                                        selected={formValues?.object_status === 'current'}
                                    />
                                    <FormControlLabel
                                        value="new"
                                        control={<Radio />}
                                        label="Draft"
                                        selected={formValues?.object_status === 'new'}
                                    />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs={3} align="left">
                            <Button
                                color="secondary"
                                children="Cancel"
                                data-testid="admin-dlor-add-button-cancel"
                                onClick={() => navigateToDlorAdminHomePage()}
                                variant="contained"
                            />
                        </Grid>
                        <Grid item xs={9} align="right">
                            <Button
                                color="primary"
                                data-testid="admin-dlor-add-button-submit"
                                variant="contained"
                                children="Save"
                                disabled={!isFormValid}
                                onClick={saveNewDlor}
                                // className={classes.saveButton}
                            />
                        </Grid>
                    </Grid>
                </form>
            </StandardCard>
        </StandardPage>
    );
};

export default DLOAdd;
