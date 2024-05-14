import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import html2text from 'html2text';

import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
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

import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';

import { useAccountContext } from 'context';
import { useConfirmationState } from 'hooks';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { scrollToTopOfPage } from 'helpers/general';
import {
    convertFileSizeToKb,
    displayDownloadInstructions,
    getTotalSecondsFromMinutesAndSecond,
    isPreviewableUrl,
    isValidNumber,
    validFileSizeUnits,
} from 'modules/Pages/DigitalLearningObjects/dlorHelpers';
import { getUserPostfix, splitStringToArrayOnComma } from 'modules/Pages/Admin/DigitalLearningObjects/dlorAdminHelpers';
import { fullPath } from 'config/routes';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

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
    fieldUseTip: {
        fontSize: '0.9em',
        marginTop: 4,
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
    viewDuration: {
        '& > div': {
            display: 'flex',
            alignItems: 'center',
        },
        '& input': {
            maxWidth: '3em',
        },
    },
}));

export const DlorForm = ({
    actions,
    dlorItemSaving,
    dlorSavedItemError,
    dlorSavedItem,
    dlorItemLoading,
    dlorItem,
    // dlorItemError,
    dlorTeam,
    dlorTeamLoading,
    dlorTeamError,
    dlorFilterList,
    dlorFilterListLoading,
    dlorFilterListError,
    dlorFileTypeList,
    dlorFileTypeListLoading,
    dlorFileTypeListError,
    formDefaults,
    mode,
}) => {
    const { account } = useAccountContext();
    const classes = useStyles();
    const history = useHistory();
    const [cookies, setCookie] = useCookies();
    const theme = useTheme();

    const [isOpen, showConfirmation, hideConfirmation] = useConfirmationState();

    const [saveStatus, setSaveStatus] = useState(null); // control confirmation box display
    const [isFormValid, setFormValidity] = useState(false); // enable-disable the save button
    const [showTeamForm, setShowTeamForm] = useState(false); // enable-disable the Team creation fields
    const [showFileTypeCreationForm, setShowFileTypeCreationForm] = useState(false); // enable-disable the File Type creation fields

    const [isLinkFileTypeError, setIsLinkFileTypeError] = useState(false);

    const linkInteractionType_download = 'download';
    const linkInteractionType_view = 'view';
    const linkInteractionType_none = 'none';
    const [showLinkTimeForm, setShowLinkTimeForm] = useState(false);
    const [showLinkSizeForm, setShowLinkSizeForm] = useState(false);

    const [summarySuggestionOpen, setSummarySuggestionOpen] = useState(false);
    const [formValues, setFormValues] = useState(formDefaults);
    const [summaryContent, setSummaryContent] = useState('');
    const checkBoxArrayRef = useRef([]);
    const teamSelectRef = useRef(null);
    const linkInteractionTypeSelectRef = useRef(formValues?.object_link_interaction_type || 'none');
    const linkFileTypeSelectRef = useRef(formValues.object_link_file_type || 'new');

    const flatMapFacets = facetList => {
        return facetList?.flatMap(facet => facet?.filter_values?.map(value => value?.id)).sort((a, b) => a - b);
    };

    function getFacetIds(slug) {
        const facetType = dlorFilterList?.find(item => item.facet_type_slug === slug);

        return facetType?.facet_list?.map(facet => facet.facet_id) || [];
    }

    useEffect(() => {
        if (mode === 'edit' && !!dlorItem) {
            closeConfirmationBox();
            setFormValues(formDefaults);
            setSummaryContent(formDefaults.object_summary);
            checkBoxArrayRef.current = flatMapFacets(formDefaults.facets);

            setInteractionTypeDisplays(dlorItem?.object_link_interaction_type);
            linkFileTypeSelectRef.current = dlorItem?.object_link_file_type || 'new';

            teamSelectRef.current = dlorItem?.object_owning_team_id;
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dlorItem, mode]);

    useEffect(() => {
        if (!dlorTeamError && !dlorTeamLoading && !!dlorTeam && dlorTeam.length > 0) {
            if (mode === 'add') {
                const firstTeam = dlorTeam?.filter((t, index) => index === 0) || [];
                teamSelectRef.current = firstTeam?.shift()?.team_id;
            }
        }
    }, [dlorTeam, mode]);

    // these match the values in dlor cypress admin tests
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

    const editorConfig = {
        removePlugins: [
            'Image',
            'ImageCaption',
            'ImageStyle',
            'ImageToolbar',
            'ImageUpload',
            'EasyImage',
            'CKFinder',
            'BlockQuote',
            'Table',
            'MediaEmbed',
        ],
        heading: {
            options: [
                { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                { model: 'heading1', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                { model: 'heading2', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
            ],
        },
    };

    const handleEditorChange = (fieldname, newContent) => {
        // console.log('testing the change fire', fieldname, newContent);
        // console.log('Form Values:', formValues);
        // setFormValues({
        //     ...formValues,
        //     object_description: newContent,
        // });
        setSummarySuggestionOpen(true);
        resetForm(fieldname, newContent);
    };

    // export const ManageAuthorsList = ({ onBulkRowDelete, onRowAdd, onRowDelete, onRowUpdate, onScopusIngest }) => {
    const handleFacetChange = unused => e => {
        let newValues;

        let facetId = Number(e.target.id.replace('filter-', ''));

        let radioType;
        if (e.target.type === 'radio') {
            facetId = Number(e.target.value);

            // turn off the current entries for radio
            // (this surprised me - I would have thought it would do it natively!
            radioType = e.target.name.replace('object_facet_', '').replace('_radio-buttons-group', '');
            const radioFilterIds = getFacetIds(radioType);
            let checkboxlatest = checkBoxArrayRef.current;
            radioFilterIds?.map(rid => {
                checkboxlatest = checkboxlatest.filter(id => id !== rid);
            });
            checkBoxArrayRef.current = checkboxlatest;
        }

        let current;
        if (!!e.target.checked) {
            current = [...checkBoxArrayRef.current, facetId];
            newValues = {
                ...formValues,
                facets: current,
            };
        } else {
            current = checkBoxArrayRef.current.filter(id => id !== facetId);
            newValues = {
                ...formValues,
                facets: current,
            };
        }
        checkBoxArrayRef.current = current;
        setFormValidity(validateValues(newValues));
        setFormValues(newValues);
    };

    function setInteractionTypeDisplays(value) {
        console.log('**** setInteractionTypeDisplays value=', value);
        linkInteractionTypeSelectRef.current = value;
        setShowLinkTimeForm(value === linkInteractionType_view);
        setShowLinkSizeForm(value === linkInteractionType_download);
    }

    const handleChange = (prop, value) => e => {
        let theNewValue =
            e.target.hasOwnProperty('checked') && e.target.type !== 'radio' ? e.target.checked : e.target.value;

        if (prop === 'object_is_featured') {
            theNewValue = !!e.target.checked ? 1 : 0;
        }

        // handle teams dropdown changes
        if (prop === 'object_owning_team_id') {
            setShowTeamForm(theNewValue === 'new' ? 'new' : false);
            teamSelectRef.current = theNewValue !== 'new' ? e.target.value : 'new';
        }
        if (prop === 'object_link_interaction_type') {
            setInteractionTypeDisplays(theNewValue);
            // valid?
            if (mode === 'add') {
                linkFileTypeSelectRef.current = 'new';
            }
        }
        if (prop === 'object_link_size_amount') {
            setIsLinkFileTypeError(isValidNumber(theNewValue));
        }

        if (prop === 'object_summary') {
            setSummaryContent(e.target.value);
        }
        if (prop === 'object_description') {
            setSummarySuggestionOpen(true);
        }
        if (prop === 'object_link_file_type') {
            linkFileTypeSelectRef.current = theNewValue;
            setShowFileTypeCreationForm(theNewValue === 'new');
        }

        resetForm(prop, theNewValue);
    };

    const isValidUrl = testUrl => {
        let url;

        try {
            url = new URL(testUrl);
        } catch (_) {
            return false;
        }

        return (
            (url?.protocol === 'http:' || url?.protocol === 'https:') &&
            !!url?.hostname &&
            !!url?.hostname.includes('.') && // tld only domain names really dont happen, must be a dot!
            url?.hostname.length >= '12.co'.length
        );
    };

    const isValidEmail = testEmail => {
        return testEmail?.length >= 'ab@ab'.length && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(testEmail);
    };

    const isValidUsername = testUserName => {
        return testUserName?.length >= 4 && testUserName?.length <= 8;
    };

    const editTeam = () => {
        console.log('editTeam - open form on button click');
        setShowTeamForm(teamSelectRef.current);

        console.log("getTeamFieldValue('team_email')=", getTeamFieldValue('team_email'));
        // initialise values in form - duplicate code in resetForm for single call
        const newValues = {
            ...formValues,
            team_name: getTeamFieldValue('team_name'),
            team_manager: getTeamFieldValue('team_manager'),
            team_email: getTeamFieldValue('team_email'),
        };
        console.log('editTeam editTeam resetform', newValues);

        setFormValidity(validateValues(newValues));
        setFormValues(newValues);
    };

    function getTeamFieldValue(fieldName) {
        //
        // TODO: when "edit" has been clicked and then they swap to a new team, clear the form,
        //  but if they have previously used new form, don't wipe those values!
        //
        if (showTeamForm === 'new') {
            console.log('getTeamFieldValue NEW for', fieldName, showTeamForm);
            return !!formValues ? formValues[fieldName] : '';
        }
        // // they are editing an existing team
        // if (!!formValues && !!formValues[fieldName]) {
        //     console.log('getTeamFieldValue ONE for', fieldName, showTeamForm);
        //     return formValues[fieldName];
        // }
        if (
            !!dlorItem?.owner?.team_id &&
            dlorItem?.owner?.team_id === teamSelectRef.current &&
            !!dlorItem?.owner?.[fieldName]
        ) {
            // they havent previously entered anything & we are editing
            let response = dlorItem?.owner?.[fieldName];
            if (fieldName === 'team_email') {
                response = 'dummy';
            }
            return response;
        }
        if (
            (mode === 'edit' &&
                !!dlorItem?.owner?.team_id &&
                dlorItem?.owner?.team_id !== teamSelectRef.current &&
                !!dlorItem?.owner?.[fieldName]) ||
            (mode === 'add' && !!dlorTeam && !!teamSelectRef.current)
        ) {
            console.log('getTeamFieldValue THREE-FOUR for', fieldName);
            const find1 = dlorTeam?.find(team => team.team_id === teamSelectRef.current);
            let response = find1?.[fieldName];
            if (fieldName === 'team_email') {
                // response = find1?.team_email;
                response = 'dummy';
            }
            return response;
        }

        // adding a new - use the default
        // if (!!formDefaults && !!formDefaults[fieldName]) {
        //     console.log('getTeamFieldValue FIVE for', fieldName, showTeamForm);
        //     return formDefaults[fieldName];
        // }
        console.log('getTeamFieldValue FALL for', fieldName, showTeamForm);
        return '';
    }

    const stepPanelContentOwnership = (
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
                        value={formValues?.object_publishing_user || ''}
                        onChange={handleChange('object_publishing_user')}
                        style={{ width: '20em' }}
                        error={!isValidUsername(formValues?.object_publishing_user)}
                    />
                    <div className={classes.fieldUseTip}>This must be the person's UQ username</div>
                    {!isValidUsername(formValues?.object_publishing_user) && (
                        <div className={classes.errorMessage} data-testid={'error-message-object_publishing_user'}>
                            This username is not valid.
                        </div>
                    )}
                </FormControl>
            </Grid>
            <Grid item xs={12} style={{ minHeight: 95 }}>
                <InputLabel id="object_owning_team_label">Owning Team</InputLabel>
                <Select
                    variant="standard"
                    labelId="object_owning_team_label"
                    id="object_owning_team"
                    data-testid="object_owning_team"
                    value={teamSelectRef.current ?? 1}
                    // defaultValue={formValues?.object_owning_team_id}
                    // value={teamSelectRef.current}
                    onChange={handleChange('object_owning_team_id')}
                    // aria-labelledby="object_owning_team_label"
                    style={{ minWidth: '20em' }}
                >
                    {dlorTeam?.map((t, index) => {
                        return (
                            <MenuItem
                                key={t.team_id}
                                value={t.team_id}
                                selected={t.team_id === teamSelectRef.current}
                                data-testid={`object_owning_team-${t.team_id}`}
                                divider={index === dlorTeam.length - 1}
                            >
                                {t.team_name}
                            </MenuItem>
                        );
                    })}
                    <MenuItem
                        value="new"
                        data-testid="object-form-teamid-new"
                        selected={teamSelectRef.current === 'new'}
                    >
                        Create a team
                    </MenuItem>
                </Select>
                <button onClick={() => editTeam()} style={{ marginLeft: '10px' }}>
                    Edit
                </button>
            </Grid>
            {showTeamForm !== false && (
                <Grid item xs={5}>
                    {showTeamForm !== 'new' && (
                        <p style={{ fontStyle: 'italic' }}>A change here will affect all Objects for this team</p>
                    )}
                    <FormControl
                        variant="standard"
                        // className={classes.typingArea}
                        fullWidth
                    >
                        <InputLabel htmlFor="team_name">Name of new Team *</InputLabel>
                        <Input
                            id="team_name"
                            data-testid="team_name"
                            value={formValues?.team_name || ''}
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
                            value={formValues?.team_manager || ''}
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
                            value={formValues?.team_email || ''}
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

    const suggestSummary = (enteredDescription, requiredLength = 150) => {
        const plainSummary = html2text.fromString(enteredDescription);
        // if they enter a complete sentence, use just that sentences up to the requiredlength point
        const fullStopLocation = plainSummary.indexOf('.');
        if (fullStopLocation !== -1) {
            return plainSummary.substring(0, fullStopLocation + 1);
        }

        const lastCarriageReturnIndex = plainSummary.indexOf('\n');
        if (lastCarriageReturnIndex !== -1) {
            return plainSummary.substring(0, lastCarriageReturnIndex + 1).trim(); // remove carriage return from end
        }

        // while its short, return the shortness
        if (plainSummary?.length <= requiredLength) {
            return plainSummary;
        }

        // return the first n characters, breaking at a word break
        const trimmedString = plainSummary?.slice(0, requiredLength + 1);
        const slice = trimmedString.slice(0, Math.min(trimmedString?.length, trimmedString?.lastIndexOf(' ')));
        return slice;
    };

    function resetForm(prop, theNewValue) {
        console.log('THE NEW VALUE', theNewValue);
        // amalgamate new value into data set
        const newValues = { ...formValues, [prop]: theNewValue };

        setFormValidity(validateValues(newValues));
        setFormValues(newValues);
    }

    const useSuggestion = e => {
        const newSummary = suggestSummary(formValues?.object_description);
        setSummaryContent(newSummary);
        // handleChange('object_summary', e);
        resetForm('object_summary', newSummary);
        setSummarySuggestionOpen(false);
    };

    const SummaryCharCountPrompt = () => {
        let newVar = '';
        if (!!formValues?.object_summary) {
            newVar = characterCount(formValues?.object_summary?.length, summaryMinimumLength, 'object_summary');
        } else if (!!summaryContent) {
            newVar = characterCount(summaryContent?.length, summaryMinimumLength, 'object_summary');
        }
        return newVar;
    };

    const stepPanelContentDescription = (
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
                        value={formValues?.object_title || ''}
                        onChange={handleChange('object_title')}
                    />
                    {!!formValues?.object_title &&
                        characterCount(formValues?.object_title?.length, titleMinimumLength, 'object_title')}
                </FormControl>
            </Grid>
            <Grid item xs={12}>
                <FormControl variant="standard" fullWidth style={{ paddingTop: 50 }}>
                    <InputLabel htmlFor="object_description">Description of Object *</InputLabel>
                    {/* <Input
                        id="object_description"
                        data-testid="object_description"
                        multiline
                        required
                        rows={6}
                        value={formValues?.object_description || ''}
                        onChange={handleChange('object_description')}
                    /> */}
                    <CKEditor
                        id="object_description"
                        data-testid="object_description"
                        style={{ width: '100%' }}
                        className={classes.CKEditor}
                        editor={ClassicEditor}
                        config={editorConfig}
                        data={formValues?.object_description || ''}
                        onReady={editor => {
                            // You can store the "editor" and use when it is needed.
                            // console.log("Editor is ready to use!", editor);
                            editor.editing.view.change(writer => {
                                writer.setStyle('height', '200px', editor.editing.view.document.getRoot());
                            });
                        }}
                        onChange={(event, editor) => {
                            const htmlData = editor.getData();
                            // const plainText = html2text.fromString(htmlData);
                            // console.log('data:', plainText);
                            // /setTimeout(() => console.log('TEST FIRE'), 0);
                            handleEditorChange('object_description', htmlData);
                        }}
                    />
                    {!!formValues?.object_description &&
                        characterCount(
                            html2text.fromString(formValues?.object_description).length,
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
                        value={summaryContent}
                        onChange={handleChange('object_summary')}
                    />
                    <SummaryCharCountPrompt />
                    {!!summarySuggestionOpen && (
                        <div data-testid="admin-dlor-suggest-summary">
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography component={'h2'} variant={'p'}>
                                    Suggestion for summary:
                                </Typography>
                                <IconButton
                                    data-testid="admin-dlor-suggest-summary-close-button"
                                    data-analyticsid="admin-dlor-suggest-summary-close-button"
                                    onClick={() => setSummarySuggestionOpen(false)}
                                    aria-label="Click to close Summary suggestion"
                                    size="large"
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </div>
                            <Typography
                                component={'p'}
                                style={{ marginBlock: 10 }}
                                data-testid="admin-dlor-suggest-summary-content"
                            >
                                {suggestSummary(formValues?.object_description)}
                            </Typography>
                            <Button
                                color="primary"
                                data-testid="admin-dlor-suggest-summary-button"
                                data-analyticsid="admin-dlor-suggest-summary-button"
                                style={{ display: 'block' }}
                                variant="contained"
                                children="Use Suggestion"
                                onClick={useSuggestion}
                            />
                        </div>
                    )}
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
                        value={formValues?.object_status || 'new'}
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
            <Grid item xs={12}>
                <FormLabel>Featured object?</FormLabel>
                <InputLabel>
                    <Checkbox
                        checked={!!formValues?.object_is_featured}
                        data-testid="object_is_featured"
                        onChange={handleChange('object_is_featured')}
                        style={{ paddingLeft: 0 }}
                    />
                    Feature this Object at the top of the list page
                </InputLabel>
            </Grid>
        </>
    );

    const getFileTypeListbyMode = () => {
        if (mode === 'add') {
            return dlorFileTypeList || [];
        }
        // else Edit
        return formValues?.object_link_types || [];
    };

    const getFileTypeList = getFileTypeListbyMode().filter(
        type => type.object_link_interaction_type === linkInteractionTypeSelectRef.current,
    );

    const stepPanelContentLinks = (
        <>
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
                        value={formValues?.object_link_url || ''}
                        onChange={handleChange('object_link_url')}
                        error={
                            !!formValues?.object_link_url &&
                            formValues?.object_link_url?.length > 'http://ab.co'.length &&
                            !isValidUrl(formValues?.object_link_url)
                        }
                    />
                    {formValues?.object_link_url?.length > 'http://ab.co'.length &&
                        !isValidUrl(formValues?.object_link_url) && (
                            <div className={classes.errorMessage} data-testid={'error-message-object_link_url'}>
                                This web address is not valid.
                            </div>
                        )}
                    {formValues?.object_link_url?.length > 'http://ab.co'.length &&
                        isPreviewableUrl(formValues?.object_link_url) !== false && (
                            <p style={{ display: 'flex', alignItems: 'center' }} data-testid="object_link_url_preview">
                                <DoneIcon color="success" />
                                <span>A preview will show on the View page.</span>
                            </p>
                        )}
                </FormControl>
            </Grid>
            <Grid item xs={12}>
                <InputLabel id="object_link_interaction_type-label" htmlFor="object_link_interaction_type">
                    Message advising about link
                </InputLabel>
                <Grid container>
                    <Grid item xs={4}>
                        <FormControl>
                            <span>&nbsp;</span>
                            <Select
                                variant="standard"
                                labelId="object_link_interaction_type-label"
                                id="object_link_interaction_type"
                                data-testid="object_link_interaction_type"
                                value={linkInteractionTypeSelectRef.current}
                                onChange={handleChange('object_link_interaction_type')}
                                style={{ width: '100%' }}
                            >
                                <MenuItem
                                    value={linkInteractionType_download}
                                    data-testid="object_link_interaction_type-download"
                                    selected={linkInteractionTypeSelectRef.current === linkInteractionType_download}
                                >
                                    can Download
                                </MenuItem>
                                <MenuItem
                                    value={linkInteractionType_view}
                                    data-testid="object_link_interaction_type-view"
                                    selected={linkInteractionTypeSelectRef.current === linkInteractionType_view}
                                >
                                    can View
                                </MenuItem>
                                <MenuItem
                                    value={linkInteractionType_none}
                                    data-testid="object_link_interaction_type-none"
                                    selected={
                                        ![linkInteractionType_download, linkInteractionType_view].includes(
                                            linkInteractionTypeSelectRef.current,
                                        )
                                    }
                                >
                                    No message
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <FormControl style={{ minWidth: '10em' }}>
                            {[linkInteractionType_download, linkInteractionType_view].includes(
                                linkInteractionTypeSelectRef.current,
                            ) && (
                                <>
                                    <InputLabel htmlFor="object_link_file_type">File type *</InputLabel>
                                    <Select
                                        variant="standard"
                                        labelId="object_link_file_type"
                                        id="object_link_file_type"
                                        data-testid="object_link_file_type"
                                        value={linkFileTypeSelectRef.current}
                                        onChange={handleChange('object_link_file_type')}
                                        style={{ width: '100%', marginTop: 20 }}
                                    >
                                        {getFileTypeList.map((type, index) => (
                                            <MenuItem
                                                key={type.object_link_file_type}
                                                data-testid={`object_link_file_type-${type.object_link_file_type}`}
                                                value={type.object_link_file_type}
                                                selected={type.object_link_file_type === linkFileTypeSelectRef.current}
                                            >
                                                {type.object_link_file_type}
                                            </MenuItem>
                                        ))}
                                        <MenuItem
                                            data-testid={'object_link_file_type-new'}
                                            value="new"
                                            selected={linkFileTypeSelectRef.current === 'new'}
                                        >
                                            New type
                                        </MenuItem>
                                    </Select>
                                    {showFileTypeCreationForm && (
                                        <Grid item xs={12}>
                                            <FormControl variant="standard" fullWidth>
                                                <InputLabel htmlFor="new_file_type">New File Type (abbrev)</InputLabel>
                                                <Input
                                                    id="new_file_type"
                                                    data-testid="new_file_type"
                                                    value={formValues?.new_file_type || ''}
                                                    onChange={handleChange('new_file_type')}
                                                />
                                            </FormControl>
                                        </Grid>
                                    )}{' '}
                                </>
                            )}
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <div className={classes.viewDuration}>
                            {!!showLinkTimeForm && (
                                <>
                                    <InputLabel id="object_link_duration-label">Run time *</InputLabel>
                                    <div>
                                        <FormControl>
                                            <Input
                                                id="object_link_duration_minutes"
                                                aria-labelledby="object_link_duration-label object_link_duration_minutes"
                                                data-testid="object_link_duration_minutes"
                                                required
                                                value={formValues?.object_link_duration_minutes || ''}
                                                onChange={handleChange('object_link_duration_minutes')}
                                            />
                                        </FormControl>
                                        <span id="object_link_duration_minutes-label" style={{ paddingRight: 6 }}>
                                            minutes{' '}
                                        </span>
                                        <span style={{ paddingRight: 6 }}>and </span>
                                        <FormControl>
                                            <Input
                                                id="object_link_duration_seconds"
                                                aria-labelledby="object_link_duration-label object_link_duration_seconds-label"
                                                data-testid="object_link_duration_seconds"
                                                required
                                                value={formValues?.object_link_duration_seconds || ''}
                                                onChange={handleChange('object_link_duration_seconds')}
                                            />
                                        </FormControl>
                                        <span id="object_link_duration_seconds-label">seconds</span>
                                    </div>
                                </>
                            )}
                            {!!showLinkSizeForm && (
                                <>
                                    <InputLabel id="object_link_file_size-label">File Size *</InputLabel>
                                    <div>
                                        <FormControl>
                                            <Input
                                                id="object_link_size_amount"
                                                aria-labelledby="object_link_file_size-label"
                                                data-testid="object_link_size_amount"
                                                required
                                                value={formValues?.object_link_size_amount || ''}
                                                onChange={handleChange('object_link_size_amount')}
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <Select
                                                variant="standard"
                                                labelId="object_link_size_units"
                                                id="object_link_size_units"
                                                data-testid="object_link_size_units"
                                                value={formValues?.object_link_size_units}
                                                // value={linkFileTypeSelectRef.current}
                                                onChange={handleChange('object_link_size_units')} // needs ref?
                                            >
                                                {validFileSizeUnits.map(unit => (
                                                    <MenuItem
                                                        key={unit}
                                                        id={`object_link_size_units-${unit}`}
                                                        data-testid={`object_link_size_units-${unit}`}
                                                        value={unit}
                                                        selected={unit === formValues?.object_link_size_units}
                                                    >
                                                        {unit}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                </>
                            )}
                        </div>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <FormControl
                    variant="standard"
                    // className={classes.typingArea}
                    fullWidth
                    style={{ paddingTop: 50 }}
                >
                    <InputLabel htmlFor="object_download_instructions" style={{ fontSize: 16 }}>
                        Download Instructions
                    </InputLabel>
                    <CKEditor
                        id="download_instructions"
                        data-testid="download_instructions"
                        style={{ width: '100%' }}
                        className={classes.CKEditor}
                        editor={ClassicEditor}
                        config={editorConfig}
                        data={formValues?.object_download_instructions || ''}
                        onReady={editor => {
                            // You can store the "editor" and use when it is needed.
                            // console.log("Editor is ready to use!", editor);
                            editor.editing.view.change(writer => {
                                writer.setStyle('height', '200px', editor.editing.view.document.getRoot());
                            });
                        }}
                        onChange={(event, editor) => {
                            const htmlData = editor.getData();
                            // const plainText = html2text.fromString(htmlData);
                            // console.log('data:', plainText);
                            // /setTimeout(() => console.log('TEST FIRE'), 0);
                            handleEditorChange('object_download_instructions', htmlData);
                        }}
                    />
                </FormControl>
            </Grid>
        </>
    );

    const stepPanelContentFilters = (
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
                        value={formValues?.object_keywords_string || ''}
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
            stepPanelContent: stepPanelContentOwnership,
        },
        {
            label: 'Description',
            stepPanelContent: stepPanelContentDescription,
        },
        {
            label: 'Link',
            stepPanelContent: stepPanelContentLinks,
        },
        {
            label: 'Filtering',
            stepPanelContent: stepPanelContentFilters,
        },
    ];
    const [activeStep, setActiveStep] = useState(0);

    const [panelValidity, setPanelValidity] = useState(new Array(steps?.length).fill(true));

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
        if (mode === 'add' && !dlorFileTypeListError && !dlorFileTypeListLoading && !dlorFileTypeList) {
            actions.loadFileTypeList();
        }
        closeConfirmationBox(); // hide any conf left over from earlier add/edit efforts
    }, []);

    useEffect(() => {
        setFormValidity(validateValues(formDefaults));
        console.log('useEffect: formDefaults', formDefaults);
        const isFileTypeSet =
            [linkInteractionType_download, linkInteractionType_view].includes(
                formDefaults?.object_link_interaction_type || null,
            ) && !!formDefaults?.object_link_file_type;
        if (!!isFileTypeSet) {
            setShowFileTypeCreationForm(false);
        } else {
            setShowFileTypeCreationForm(true);
            formDefaults.object_link_file_type = 'new';
        }
    }, [formDefaults]);

    useEffect(() => {
        // this is needed to get the validation badges after the filter list loads
        if (!!dlorFilterList && dlorFilterList.length > 0) {
            setFormValidity(validateValues(formDefaults));
        }
        console.log('useEffect: dlorFilterList');
    }, [dlorFilterList]);

    useEffect(() => {
        if ((!!dlorSavedItem && !!dlorSavedItem.data?.object_id) || !!dlorSavedItemError) {
            setSaveStatus('complete');
            showConfirmation();
        }
        console.log('useEffect: dlorSavedItem');
    }, [showConfirmation, dlorSavedItem, dlorSavedItemError]);

    const saveDlor = () => {
        const valuesToSend = { ...formValues };
        // somehow in localhost this is already an array of ids, but on feature branch its the original facets
        if (valuesToSend.facets.length > 0 && valuesToSend.facets[0].hasOwnProperty('filter_key')) {
            valuesToSend.facets = flatMapFacets(formValues?.facets);
        }
        if (formValues?.object_owning_team_id === 'new') {
            delete valuesToSend.object_owning_team_id;
        } else {
            delete valuesToSend.team_name;
            delete valuesToSend.team_manager;
            delete valuesToSend.team_email;
        }

        valuesToSend.object_keywords = splitStringToArrayOnComma(valuesToSend.object_keywords_string);
        delete valuesToSend.object_keywords_string;

        if (valuesToSend?.object_link_interaction_type === linkInteractionType_download) {
            console.log('rrrrrrrr download');
            valuesToSend.object_link_size = convertFileSizeToKb(
                valuesToSend?.object_link_size_amount,
                valuesToSend?.object_link_size_units,
            );
        } else if (valuesToSend?.object_link_interaction_type === linkInteractionType_view) {
            console.log('rrrrrrrr view');
            valuesToSend.object_link_size = getTotalSecondsFromMinutesAndSecond(
                valuesToSend?.object_link_duration_minutes,
                valuesToSend?.object_link_duration_seconds,
            );
        } else if (valuesToSend?.object_link_interaction_type === linkInteractionType_none) {
            console.log('rrrrrrrr other');
            delete valuesToSend?.object_link_file_type;
        }
        if (!!valuesToSend.new_file_type) {
            console.log('rrrrrrrr new file type');
            valuesToSend.object_link_file_type = valuesToSend.new_file_type;
            delete valuesToSend.new_file_type;
        }
        delete valuesToSend?.object_link_size_units;
        delete valuesToSend?.object_link_size_amount;
        delete valuesToSend?.object_link_duration_minutes;
        delete valuesToSend?.object_link_duration_seconds;

        // don't send back the array of types
        !!valuesToSend?.object_link_types && delete valuesToSend.object_link_types;

        const cypressTestCookie = cookies.hasOwnProperty('CYPRESS_TEST_DATA') ? cookies.CYPRESS_TEST_DATA : null;
        if (!!cypressTestCookie && location.host === 'localhost:2020' && cypressTestCookie === 'active') {
            setCookie('CYPRESS_DATA_SAVED', valuesToSend);
        }

        return mode === 'add'
            ? actions.createDlor(valuesToSend)
            : actions.updateDlor(dlorItem.object_public_uuid, valuesToSend);
    };

    const locale = {
        successMessage: {
            confirmationTitle: mode === 'add' ? 'The object has been created' : 'Changes have been saved',
            confirmationMessage: '',
            cancelButtonLabel: mode === 'add' ? 'Add another Object' : 'Re-edit Object',
            confirmButtonLabel: 'Return to list page',
        },
        errorMessage: {
            confirmationTitle: dlorSavedItemError,
            confirmationMessage: '',
            cancelButtonLabel: mode === 'add' ? 'Add another Object' : 'Re-edit Object',
            confirmButtonLabel: 'Return to list page',
        },
    };

    const navigateToDlorAdminHomePage = () => {
        // TODO also want to clear form here too before nav, so back button gives clear form?

        closeConfirmationBox();
        const userString = getUserPostfix();
        window.location.href = `${fullPath}/admin/dlor${userString}`;
        scrollToTopOfPage();
    };

    function closeConfirmationBox() {
        setSaveStatus(null);
        hideConfirmation();
    }

    const clearForm = actiontype => {
        closeConfirmationBox();
        window.location.reload(false);
    };

    const validateValues = currentValues => {
        console.log('validateValues', currentValues);
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
        html2text.fromString(currentValues?.object_description)?.length < descriptionMinimumLength &&
            secondPanelErrorCount++;
        currentValues?.object_summary?.length < summaryMinimumLength && secondPanelErrorCount++;

        let thirdPanelErrorCount = 0;
        !isValidUrl(currentValues?.object_link_url) && thirdPanelErrorCount++;

        [linkInteractionType_download, linkInteractionType_view].includes(
            currentValues?.object_link_interaction_type,
        ) &&
            (!currentValues?.object_link_file_type ||
                (currentValues?.object_link_file_type === 'new' && !currentValues?.new_file_type)) &&
            thirdPanelErrorCount++;

        currentValues.object_link_interaction_type === linkInteractionType_view &&
            (!isValidNumber(currentValues?.object_link_duration_minutes) ||
                !isValidNumber(currentValues?.object_link_duration_seconds)) &&
            thirdPanelErrorCount++;

        currentValues.object_link_interaction_type === linkInteractionType_download &&
        !isValidNumber(currentValues?.object_link_size_amount) &&
        !currentValues?.object_link_size_unit && // needs valid check here?
            thirdPanelErrorCount++;

        let fourthPanelErrorCount = 0;
        currentValues?.object_keywords_string?.length < keywordMinimumLength && fourthPanelErrorCount++;

        function isDeepStructure(variable) {
            return Array.isArray(variable) ? typeof variable[0] === 'object' && variable[0] !== null : false;
        }

        // check the required facets are checked
        !!dlorFilterList &&
            dlorFilterList.forEach(filterType => {
                if (!!filterType.facet_type_required) {
                    const possibleFacetIds = filterType.facet_list.map(facet => facet.facet_id);
                    let hasMatch;
                    if (mode === 'add') {
                        hasMatch = currentValues?.facets?.some(selectedFacet => {
                            return possibleFacetIds.includes(selectedFacet);
                        });
                    } else {
                        // edit
                        if (isDeepStructure(currentValues?.facets)) {
                            const justFacetIds = !!currentValues?.facets && flatMapFacets(currentValues?.facets);
                            hasMatch = justFacetIds?.some(id => {
                                return possibleFacetIds?.includes(id);
                            });
                        } else {
                            hasMatch = currentValues?.facets?.some(id => {
                                return possibleFacetIds?.includes(id);
                            });
                        }
                    }
                    if (!hasMatch) {
                        fourthPanelErrorCount++;
                    }
                }
            });

        setPanelValidity([firstPanelErrorCount, secondPanelErrorCount, thirdPanelErrorCount, fourthPanelErrorCount]);

        return (
            firstPanelErrorCount === 0 &&
            secondPanelErrorCount === 0 &&
            thirdPanelErrorCount === 0 &&
            fourthPanelErrorCount === 0
        );
    };

    function displayControlByFacetType(filterItem) {
        const facetIsSet = (findId, facets = null) => {
            return checkBoxArrayRef.current.includes(findId);
            // return facets?.some(ff => ff?.filter_values?.some(value => value?.id === findId));
        };

        let result = <></>;
        if (filterItem?.facet_type_number === 'one-or-more') {
            result =
                !!filterItem.facet_list &&
                filterItem.facet_list.map(thisfacet => {
                    return (
                        <FormControlLabel
                            key={`${filterItem.facet_type_slug}-${thisfacet.facet_id}`}
                            className={classes.facetControl}
                            control={
                                <Checkbox
                                    onChange={handleFacetChange(thisfacet.facet_id)}
                                    id={`filter-${thisfacet.facet_id}`}
                                    data-testid={`filter-${thisfacet.facet_id}`}
                                    checked={facetIsSet(thisfacet?.facet_id, formValues?.facets)}
                                />
                            }
                            label={thisfacet.facet_name}
                        />
                    );
                });
        } else if (filterItem?.facet_type_number === 'zero-or-more') {
            result =
                !!filterItem.facet_list &&
                filterItem.facet_list.map(thisfacet => {
                    return (
                        <FormControlLabel
                            key={`${filterItem.facet_type_slug}-${thisfacet.facet_id}`}
                            className={classes.facetControl}
                            control={
                                <Checkbox
                                    onChange={handleFacetChange(thisfacet.facet_id)}
                                    id={`filter-${thisfacet.facet_id}`}
                                    data-testid={`filter-${thisfacet.facet_id}`}
                                    checked={facetIsSet(thisfacet?.facet_id, formValues?.facets)}
                                />
                            }
                            label={thisfacet.facet_name}
                        />
                    );
                });
        } else if (filterItem?.facet_type_number === 'exactly-one') {
            const radioGroupName = !!filterItem && `object_facet_${filterItem.facet_type_slug}_radio-buttons-group`;
            result = (
                <RadioGroup
                    aria-labelledby={`demo-radio-object_${filterItem.facet_id}_label-group-label`}
                    name={radioGroupName}
                    value={filterItem.facet_id}
                    onChange={handleFacetChange(filterItem.id)}
                >
                    {filterItem?.facet_list?.map(thisfacet => {
                        return (
                            <FormControlLabel
                                key={thisfacet.facet_id}
                                className={classes.facetControl}
                                control={<Radio checked={facetIsSet(thisfacet?.facet_id, formValues?.facets)} />}
                                value={thisfacet.facet_id}
                                data-testid={`filter-${thisfacet.facet_id}`}
                                label={thisfacet.facet_name}
                            />
                        );
                    })}
                </RadioGroup>
            );
        } else {
            result = <>unknown facet type</>;
        }
        return result;
    }

    const handleNext = () => setActiveStep(prevActiveStep => prevActiveStep + 1);
    const handleBack = () => setActiveStep(prevActiveStep => prevActiveStep - 1);

    if (!!dlorTeamLoading || dlorFilterListLoading || !!dlorItemSaving || !!dlorItemLoading) {
        return (
            <Grid item xs={12}>
                <InlineLoader message="Loading" />
            </Grid>
        );
    }
    if (!!dlorTeamError) {
        return (
            <Typography variant="body1" data-testid="dlor-form-addedit-error">
                {dlorTeamError}
            </Typography>
        );
    }
    if (!!dlorFilterListError) {
        return (
            <Typography variant="body1" data-testid="dlor-homepage-error">
                {dlorFilterListError}
            </Typography>
        );
    }
    if (!dlorFilterListLoading && !dlorFilterListError && (!dlorFilterList || dlorFilterList.length === 0)) {
        return (
            <Typography variant="body1" data-testid="dlor-homepage-noresult">
                Missing filters: We did not find any entries in the system - please try again later.
            </Typography>
        );
    }

    return (
        <>
            {saveStatus === 'complete' && (
                <ConfirmationBox
                    actionButtonColor="primary"
                    actionButtonVariant="contained"
                    confirmationBoxId="dlor-save-outcome"
                    onAction={() => navigateToDlorAdminHomePage()}
                    hideCancelButton={!locale.successMessage.cancelButtonLabel}
                    cancelButtonLabel={locale.successMessage.cancelButtonLabel}
                    onCancelAction={() => clearForm()}
                    onClose={closeConfirmationBox}
                    isOpen={isOpen}
                    locale={!!dlorSavedItemError ? locale.errorMessage : locale.successMessage}
                />
            )}
            <form id="dlor-addedit-form">
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
                                data-testid="dlor-form-back-button"
                            >
                                Back
                            </Button>
                            <Box sx={{ flex: '1 1 auto' }} />
                            {activeStep === steps?.length - 1 ? (
                                <Button
                                    color="primary"
                                    data-testid="admin-dlor-save-button-submit"
                                    variant="contained"
                                    children="Save"
                                    disabled={!isFormValid}
                                    onClick={saveDlor}
                                    // className={classes.saveButton}
                                />
                            ) : (
                                <Button onClick={handleNext} data-testid="dlor-form-next-button">
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
                        data-testid="admin-dlor-form-button-cancel"
                        onClick={() => navigateToDlorAdminHomePage()}
                        variant="contained"
                    />
                </Grid>
                <Grid item xs={9} align="right" />
            </Grid>
        </>
    );
};

export default DlorForm;
