import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import { makeStyles } from '@mui/styles';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select from '@mui/material/Select';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { useConfirmationState } from 'hooks';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { scrollToTopOfPage } from 'helpers/general';
import { splitStringToArrayOnComma } from '../dlorHelpers';

const moment = require('moment-timezone');

const useStyles = makeStyles(theme => ({
    charactersRemaining: {
        textAlign: 'right',
        color: '#504e4e',
        fontSize: '0.8em',
    },
    errorCount: {
        '& span': {
            right: -12,
        },
    },
    errorMessage: {
        color: theme.palette.error.light,
        fontSize: '0.8em',
        marginTop: 2,
    },
    fieldNote: {
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
    const [cookies, setCookie] = useCookies();
    const theme = useTheme();

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

    const formDefaults = {
        object_title: '',
        object_description: '',
        object_summary: '',
        object_owning_team_id: 1,
        object_embed_type: 'link',
        object_link_url: '',
        object_download_instructions: '',
        object_publishing_user: account?.id,
        object_status: 'new',
        object_review_date_next: getTodayPlusOneYear(),
        team_name: '',
        team_manager: '',
        team_email: '',
        object_keywords_string: '',
        facets: [],
    };

    const [isOpen, showConfirmation, hideConfirmation] = useConfirmationState();

    const [saveStatus, setSaveStatus] = useState(null); // control confirmation box display
    const [isFormValid, setFormValidity] = useState(false); // enable-disable the save button
    const [showTeamCreationForm, setShowTeamCreationForm] = useState(false); // enable-disable the Team creation fields
    const [formValues, setFormValues] = useState(formDefaults);

    const titleMinimumLength = 8;
    const descriptionMinimumLength = 100;
    const summaryMinimumLength = 20;
    const keywordMinimumLength = 4;
    const characterCount = (numCharsCurrent, numCharsMin, fieldName) => {
        const missingCharCount = numCharsMin - numCharsCurrent;
        return (
            <div className={classes.charactersRemaining} data-testid={`input-characters-remaining-${fieldName}`}>
                {numCharsCurrent > 0 && missingCharCount > 0
                    ? `at least ${missingCharCount} more character${missingCharCount > 1 ? 's' : ''} needed`
                    : ''}
            </div>
        );
    };

    // export const ManageAuthorsList = ({ onBulkRowDelete, onRowAdd, onRowDelete, onRowUpdate, onScopusIngest }) => {
    const handleFacetChange = facetId => e => {
        let newValues;
        if (!!e.target.checked) {
            newValues = {
                ...formValues,
                facets: [...formValues.facets, facetId],
            };
        } else {
            newValues = {
                ...formValues,
                facets: [...formValues.facets.filter(id => id !== facetId)],
            };
        }

        setFormValidity(validateValues(newValues));
        setFormValues(newValues);
    };

    const handleChange = prop => e => {
        // handle radio & checkbox filter field changes
        const theNewValue =
            e.target.hasOwnProperty('checked') && e.target.type !== 'radio' ? e.target.checked : e.target.value; // .trimEnd();
        // setNewValue(theNewValue);

        // handle teams dropdown changes
        if (prop === 'object_owning_team_id') {
            setShowTeamCreationForm(theNewValue === 'new');
        }

        // amalgamate new value into data set
        const newValues = { ...formValues, [prop]: theNewValue };

        setFormValidity(validateValues(newValues));
        setFormValues(newValues);
    };

    const isValidUrl = testUrl => {
        let url;

        try {
            url = new URL(testUrl);
        } catch (_) {
            return false;
        }

        return (
            (url.protocol === 'http:' || url.protocol === 'https:') &&
            !!url.hostname &&
            url.hostname.length >= '12.co'.length
        );
    };

    const isValidEmail = testEmail => {
        return testEmail?.length >= 'ab@ab'.length && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(testEmail);
    };

    const isValidUsername = testUserName => {
        return testUserName?.length === 8 || testUserName?.length === 9;
    };

    const stepPanelContentOne = (
        <>
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
                        error={!isValidUsername(formValues?.object_publishing_user)}
                    />
                    {!isValidUsername(formValues?.object_publishing_user) && (
                        <div className={classes.errorMessage} data-testid={'error-message-object_publishing_user'}>
                            This username is not valid.
                        </div>
                    )}
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
                            error={!isValidEmail(formValues?.team_email)}
                        />
                        {!isValidEmail(formValues?.team_email) && (
                            <div className={classes.errorMessage} data-testid="error-message-team_email">
                                This email address is not valid.
                            </div>
                        )}
                    </FormControl>
                </Grid>
            )}
        </>
    );
    const stepPanelContentTwo = (
        <>
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
                    {!!formValues?.object_title &&
                        characterCount(formValues?.object_title.length, titleMinimumLength, 'object_title')}
                </FormControl>
            </Grid>
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
                    {!!formValues?.object_description &&
                        characterCount(
                            formValues?.object_description.length,
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
                    {!!formValues?.object_summary &&
                        characterCount(formValues?.object_summary?.length, summaryMinimumLength, 'object_summary')}
                </FormControl>
            </Grid>
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
        </>
    );
    const stepPanelContentThree = (
        <>
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
            {formValues?.object_embed_type === 'link' && (
                <Grid item xs={12}>
                    <FormControl
                        variant="standard"
                        // className={classes.typingArea}
                        fullWidth
                    >
                        <InputLabel htmlFor="object_link_url">Web address *</InputLabel>
                        <Input
                            id="object_link_url"
                            data-testid="object_link_url"
                            required
                            value={formValues?.object_link_url}
                            onChange={handleChange('object_link_url')}
                            error={!!formValues?.object_link_url && !isValidUrl(formValues?.object_link_url)}
                        />
                        {formValues?.object_link_url?.length > 'http://ab.co'.length &&
                            !isValidUrl(formValues?.object_link_url) && (
                                <div className={classes.errorMessage} data-testid={'error-message-object_link_url'}>
                                    This web address is not valid.
                                </div>
                            )}
                    </FormControl>
                </Grid>
            )}
            <Grid item xs={12}>
                <FormControl
                    variant="standard"
                    // className={classes.typingArea}
                    fullWidth
                >
                    <InputLabel htmlFor="object_download_instructions">Download Instructions</InputLabel>
                    <Input
                        id="object_download_instructions"
                        data-testid="object_download_instructions"
                        multiline
                        rows={6}
                        value={formValues?.object_download_instructions}
                        onChange={handleChange('object_download_instructions')}
                    />
                </FormControl>
            </Grid>
        </>
    );
    const stepPanelContentFour = (
        <>
            <Grid item xs={12}>
                <Typography component={'h2'} variant={'h6'}>
                    Filters
                </Typography>
            </Grid>
            {!!dlorFilterList &&
                dlorFilterList.map(filterItem => {
                    return (
                        <Grid item xs={4} key={filterItem.facet_type_slug}>
                            <Typography component={'h3'} variant={'h7'}>
                                {!!filterItem.facet_type_name && filterItem.facet_type_name}{' '}
                                {filterItem?.facet_type_required && <span className={classes.required}>*</span>}
                            </Typography>
                            {displayControlByFacetType(filterItem)}
                        </Grid>
                    );
                })}
            <Grid item xs={12}>
                <FormControl
                    variant="standard"
                    // className={classes.typingArea}
                    fullWidth
                >
                    <InputLabel htmlFor="object_keywords">
                        Keywords - enter a comma separated list of keywords *
                    </InputLabel>
                    <Input
                        id="object_keywords"
                        data-testid="object_keywords"
                        multiline
                        required
                        rows={2}
                        value={formValues?.object_keywords_string}
                        onChange={handleChange('object_keywords_string')}
                    />
                    {!!formValues?.object_keywords_string &&
                        characterCount(
                            formValues?.object_keywords_string?.length,
                            keywordMinimumLength,
                            'object_keywords_string',
                        )}
                    <p className={classes.fieldNote}>
                        If you need a keyword with a comma within it, surround the keyword with double quotes, like:
                        cat, "dog, dog", mouse
                    </p>
                </FormControl>
            </Grid>
        </>
    );
    const steps = [
        {
            label: 'Ownership',
            stepPanelContent: stepPanelContentOne,
        },
        {
            label: 'Description',
            stepPanelContent: stepPanelContentTwo,
        },
        {
            label: 'Link',
            stepPanelContent: stepPanelContentThree,
        },
        {
            label: 'Filtering',
            stepPanelContent: stepPanelContentFour,
        },
    ];
    const [activeStep, setActiveStep] = useState(0);

    const initiallyValid = new Array(steps?.length).fill(true);
    console.log('PanelValidity initiallyValid=', initiallyValid);
    const [panelValidity, setPanelValidity] = useState(initiallyValid);

    function getTodayPlusOneYear(baseDate = null) {
        const today = baseDate || moment();
        return today
            .add(1, 'year')
            .hour(0)
            .minute(1) // 1 minute past midnight
            .format('YYYY-MM-DDTHH:mm');
    }

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
        // this is needed to get the validation badges after the filter list loads
        if (!!dlorFilterList && dlorFilterList.length > 0) {
            console.log('useEffect filter val');
            setFormValidity(validateValues(formDefaults));
        }
    }, [dlorFilterList]);

    useEffect(() => {
        console.log('useEffect dlorItem=', dlorItem, ';dlorItemError', dlorItemError);
        if ((!!dlorItem && !!dlorItem.data?.object_id) || !!dlorItemError) {
            console.log('useEffect showing conf');
            setSaveStatus('complete');
            showConfirmation();
        }
    }, [showConfirmation, dlorItem, dlorItemError]);

    const saveNewDlor = () => {
        const valuesToSend = { ...formValues };
        if (formValues?.object_owning_team_id === 'new') {
            delete valuesToSend.object_owning_team_id;
        } else {
            delete valuesToSend.team_name;
            delete valuesToSend.team_manager;
            delete valuesToSend.team_email;
        }

        valuesToSend.object_keywords = splitStringToArrayOnComma(valuesToSend.object_keywords_string);
        delete valuesToSend.object_keywords_string;

        console.log('saveNewDlor after valuesToSend=', valuesToSend);

        console.log('cookies=', document.cookie);
        const cypressTestCookie = cookies.hasOwnProperty('CYPRESS_TEST_DATA') ? cookies.CYPRESS_TEST_DATA : null;
        console.log('cypressTestCookie=', cypressTestCookie);
        if (!!cypressTestCookie && location.host === 'localhost:2020' && cypressTestCookie === 'active') {
            console.log('writing cookie CYPRESS_DATA_SAVED');
            setCookie('CYPRESS_DATA_SAVED', valuesToSend);
        } else {
            console.log('NOT writing cookie CYPRESS_DATA_SAVED');
        }

        return actions.createDLor(valuesToSend);
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
        hideConfirmation();
        history.push('/admin/dlor');
        scrollToTopOfPage();
    };

    const clearForm = actiontype => {
        hideConfirmation();
        window.location.reload(false);
    };

    const validateValues = currentValues => {
        let firstPanelErrorCount = 0;
        // valid user id is 8 or 9 char
        !isValidUsername(currentValues?.object_publishing_user) && firstPanelErrorCount++;
        currentValues?.object_owning_team_id === 'new' &&
            currentValues?.team_name?.length < 1 &&
            firstPanelErrorCount++;
        currentValues?.object_owning_team_id === 'new' &&
            currentValues?.team_manager?.length < 1 &&
            firstPanelErrorCount++;
        currentValues?.object_owning_team_id === 'new' &&
            (currentValues?.team_email?.length < 1 || !isValidEmail(currentValues?.team_email)) &&
            firstPanelErrorCount++;

        let secondPanelErrorCount = 0;
        currentValues?.object_title?.length < titleMinimumLength && secondPanelErrorCount++;
        currentValues?.object_description?.length < descriptionMinimumLength && secondPanelErrorCount++;
        currentValues?.object_summary?.length < summaryMinimumLength && secondPanelErrorCount++;

        let thirdPanelErrorCount = 0;
        // object_download_instructions optional
        !(currentValues?.object_embed_type === 'link' || currentValues?.object_embed_type === 'embed') &&
            thirdPanelErrorCount++;
        currentValues?.object_embed_type === 'link' &&
            !isValidUrl(currentValues?.object_link_url) &&
            thirdPanelErrorCount++;

        let fourthPanelErrorCount = 0;
        currentValues?.object_keywords_string.length < keywordMinimumLength && fourthPanelErrorCount++;

        // check the required facets are checked
        !!dlorFilterList &&
            dlorFilterList.forEach(filterType => {
                if (!!filterType.facet_type_required) {
                    const facetIds = filterType.facet_list.map(facet => facet.facet_id);
                    if (!currentValues?.facets?.some(value => facetIds.includes(value))) {
                        fourthPanelErrorCount++;
                    }
                }
            });

        setPanelValidity([firstPanelErrorCount, secondPanelErrorCount, thirdPanelErrorCount, fourthPanelErrorCount]);

        const isValid =
            firstPanelErrorCount === 0 &&
            secondPanelErrorCount === 0 &&
            thirdPanelErrorCount === 0 &&
            fourthPanelErrorCount === 0;
        console.log('validateValues currentValues=', isValid, currentValues);
        return isValid;
    };

    function displayControlByFacetType(filterItem) {
        let result = <></>;
        if (filterItem?.facet_type_number === 'one-or-more') {
            result =
                !!filterItem.facet_list &&
                filterItem.facet_list.map(thisfacet => (
                    <FormControlLabel
                        key={`${filterItem.facet_type_slug}-${thisfacet.facet_slug}`}
                        className={classes.facetControl}
                        control={
                            <Checkbox
                                onChange={handleFacetChange(thisfacet.facet_id)}
                                id={`filter-${thisfacet.facet_slug}`}
                                data-testid={`filter-${thisfacet.facet_slug}`}
                            />
                        }
                        label={thisfacet.facet_name}
                    />
                ));
        } else if (filterItem?.facet_type_number === 'zero-or-more') {
            result =
                !!filterItem.facet_list &&
                filterItem.facet_list.map(thisfacet => (
                    <FormControlLabel
                        key={`${filterItem.facet_type_slug}-${thisfacet.facet_slug}`}
                        className={classes.facetControl}
                        control={
                            <Checkbox
                                onChange={handleFacetChange(thisfacet.facet_id)}
                                id={`filter-${thisfacet.facet_slug}`}
                                data-testid={`filter-${thisfacet.facet_slug}`}
                            />
                        }
                        label={thisfacet.facet_name}
                    />
                ));
        } else if (filterItem?.facet_type_number === 'exactly-one') {
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
                    aria-labelledby={`demo-radio-object_${filterItem.facet_slug}_label-group-label`}
                    // defaultValue={
                    //     !!filterItem.facet_list &&
                    //     filterItem.facet_list.length > 0 &&
                    //     !filterItem.facet_list.slice(0, 1)[0]
                    // }
                    name={radioGroupName}
                    value={filterItem.facet_slug}
                    // id={`radio-filter-${filterItem.facet_type_slug}`}
                    // onChange={handleChange(`facet::${filterItem.facet_type_slug}::${thisfacet.facet_slug}`)}
                >
                    {!!filterItem.facet_list &&
                        filterItem.facet_list.map(thisfacet => (
                            <FormControlLabel
                                key={`${filterItem.facet_type_slug}-${thisfacet.facet_slug}`}
                                className={classes.facetControl}
                                control={
                                    <Radio
                                        value={thisfacet.facet_slug}
                                        // id={`filter-${filterItem.facet_type_slug}-${thisfacet.facet_slug}`}
                                        data-testid={`filter-${thisfacet.facet_slug}`}
                                    />
                                }
                                label={thisfacet.facet_name}
                                onChange={handleFacetChange(thisfacet.facet_id)}
                            />
                        ))}
                </RadioGroup>
            );
        } else {
            result = <>unknown facet type</>;
        }
        return result;
    }

    const handleNext = () => setActiveStep(prevActiveStep => prevActiveStep + 1);
    const handleBack = () => setActiveStep(prevActiveStep => prevActiveStep - 1);

    if (!!dlorTeamLoading || dlorFilterListLoading) {
        return (
            <StandardPage title="DLOR Management">
                <StandardCard title="Create an Object for Digital learning objects">
                    <Grid item xs={12}>
                        <InlineLoader message="Loading" />
                    </Grid>
                </StandardCard>
            </StandardPage>
        );
    }
    if (!!dlorTeamError) {
        return (
            <StandardPage title="DLOR Management">
                <StandardCard title="Create an Object for Digital learning objects">
                    <Typography variant="body1" data-testid="dlor-addObject-error">
                        {dlorTeamError}
                    </Typography>
                </StandardCard>
            </StandardPage>
        );
    }
    if (!!dlorFilterListError) {
        return (
            <StandardPage title="DLOR Management">
                <StandardCard title="Create an Object for Digital learning objects">
                    <Typography variant="body1" data-testid="dlor-homepage-error">
                        {dlorFilterListError}
                    </Typography>
                </StandardCard>
            </StandardPage>
        );
    }
    if (!dlorFilterListLoading && !dlorFilterListError && (!dlorFilterList || dlorFilterList.length === 0)) {
        return (
            <StandardPage title="DLOR Management">
                <StandardCard title="Create an Object for Digital learning objects">
                    <Typography variant="body1" data-testid="dlor-homepage-noresult">
                        Missing filters: We did not find any entries in the system - please try again later.
                    </Typography>
                </StandardCard>
            </StandardPage>
        );
    }

    return (
        <StandardPage title="DLOR Management">
            <StandardCard title="Create an Object for Digital learning objects">
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
                <form id="dlor-add-form">
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Stepper activeStep={activeStep}>
                                {steps.map((step, index) => {
                                    const stepProps = { completed: null };
                                    const labelProps = {
                                        optional: null,
                                    };
                                    return (
                                        <Step key={step.label} {...stepProps} style={{ paddingRight: 25 }}>
                                            <StepLabel {...labelProps}>
                                                {panelValidity[index] === 0 ? (
                                                    <span>{step.label}</span>
                                                ) : (
                                                    <Badge
                                                        color="error"
                                                        badgeContent={panelValidity[index]}
                                                        className={classes.errorCount}
                                                        data-testid={`dlor-panel-validity-indicator-${index}`}
                                                    >
                                                        {step.label}
                                                    </Badge>
                                                )}
                                            </StepLabel>
                                        </Step>
                                    );
                                })}
                            </Stepper>
                        </Grid>
                        {steps[activeStep].stepPanelContent} {/* a large amount of html here!! */}
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                <Button
                                    color="inherit"
                                    disabled={activeStep === 0}
                                    onClick={handleBack}
                                    sx={{ mr: 1 }}
                                    data-testid="dlor-add-back-button"
                                >
                                    Back
                                </Button>
                                <Box sx={{ flex: '1 1 auto' }} />
                                {activeStep === steps.length - 1 ? (
                                    <Button
                                        color="primary"
                                        data-testid="admin-dlor-add-button-submit"
                                        variant="contained"
                                        children="Save"
                                        disabled={!isFormValid}
                                        onClick={saveNewDlor}
                                        // className={classes.saveButton}
                                    />
                                ) : (
                                    <Button onClick={handleNext} data-testid="dlor-add-next-button">
                                        Next
                                    </Button>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                </form>
                <Grid container spacing={2} style={{ marginTop: 32 }}>
                    <Grid item xs={3} align="left">
                        <Button
                            color="secondary"
                            children="Cancel"
                            data-testid="admin-dlor-add-button-cancel"
                            onClick={() => navigateToDlorAdminHomePage()}
                            variant="contained"
                        />
                    </Grid>
                    <Grid item xs={9} align="right" />
                </Grid>
            </StandardCard>
        </StandardPage>
    );
};

export default DLOAdd;
