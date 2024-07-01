import React, { useEffect, useRef, useState } from 'react';
import { PropTypes } from 'prop-types';
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
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select from '@mui/material/Select';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { scrollToTopOfPage } from 'helpers/general';

import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';

import {
    convertFileSizeToKb,
    convertSnakeCaseToKebabCase,
    getDlorViewPageUrl,
    getTotalSecondsFromMinutesAndSecond,
    isPreviewableUrl,
    isValidNumber,
    pluraliseWord,
    slugifyName,
    validFileSizeUnits,
} from 'modules/Pages/DigitalLearningObjects/dlorHelpers';
import {
    dlorAdminLink,
    isValidEmail,
    splitStringToArrayOnComma,
} from 'modules/Pages/Admin/DigitalLearningObjects/dlorAdminHelpers';
import { isValidUrl } from 'modules/Pages/DigitalLearningObjects/dlorHelpers';

const StyledErrorCountBadge = styled(Badge)(() => ({
    '& span': {
        right: -12,
    },
}));
const StyledErrorMessageBox = styled(Box)(({ theme }) => ({
    color: theme.palette.error.light,
    fontSize: '0.8em',
    marginTop: '2px',
}));
const StyledFacetFormControlLabel = styled(FormControlLabel)(() => ({
    display: 'flex',
    alignItems: 'flex-start',
    width: '100%',
    '& span:first-of-type': {
        paddingBlock: 0,
    },
    '& .MuiFormControlLabel-label': {
        fontSize: '0.9rem',
    },
}));
const StyledViewDurationBox = styled(Box)(() => ({
    '& > div': {
        display: 'flex',
        alignItems: 'center',
    },
    '& input': {
        maxWidth: '3em',
    },
}));
const StyledLightboxHeaderBox = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.primary.light,
    color: 'white',
    padding: '80px 0 20px 20px',
    '& h2': {
        fontSize: '2rem',
    },
    '& p': {
        fontSize: '1rem',
    },
}));
const StyledLinkAppearanceSpan = styled('span')(() => ({
    color: '#3872a8',
    textDecoration: 'none',
}));
const StyledDurationSpan = styled('span')(() => ({
    paddingRight: '6px',
}));

export const DlorForm = ({
    actions,
    dlorItemSaving,
    dlorSavedItemError,
    dlorSavedItem,
    dlorItemLoading,
    dlorItem,
    dlorTeamList,
    dlorTeamListLoading,
    dlorTeamListError,
    dlorFilterList,
    dlorFilterListLoading,
    dlorFilterListError,
    dlorFileTypeList,
    dlorFileTypeListLoading,
    dlorFileTypeListError,
    formDefaults,
    mode,
}) => {
    const [cookies, setCookie] = useCookies();

    const [confirmationOpen, setConfirmationOpen] = useState(false);

    const [showTeamForm, setShowTeamForm] = useState(false); // enable-disable the Team creation fields

    // show-hide the File Type creation fields
    const [showFileTypeCreationForm, setShowFileTypeCreationForm] = useState(false);

    const linkInteractionTypeDOWNLOAD = 'download';
    const linkInteractionTypeVIEW = 'view';
    const linkInteractionTypeNONE = 'none';
    const [showLinkTimeForm, setShowLinkTimeForm] = useState(false);
    const [showLinkSizeForm, setShowLinkSizeForm] = useState(false);

    const [summarySuggestionOpen, setSummarySuggestionOpen] = useState(false);
    const [formValues, setFormValues] = useState(formDefaults);
    const [summaryContent, setSummaryContent] = useState('');
    const [isNotifying, setIsNotifying] = useState(false);
    const [isNotificationLightboxOpen, setIsNotificationLightboxOpen] = useState(false);
    const checkBoxArrayRef = useRef([]);
    const teamSelectRef = useRef(null);
    const linkInteractionTypeSelectRef = useRef(formValues?.object_link_interaction_type || 'none');
    const linkFileTypeSelectRef = useRef(formValues.object_link_file_type || 'new');

    const flatMapFacets = facetList => {
        return facetList?.flatMap(facet => facet?.filter_values?.map(value => value?.id)).sort((a, b) => a - b);
    };

    function getFacetIds(slug) {
        const facetType = dlorFilterList?.find(item => item.facet_type_slug === slug);

        return facetType?.facet_list?.map(facet => facet.facet_id) || /* istanbul ignore next */ [];
    }

    useEffect(() => {
        console.log(
            'useEffect FIRST l=',
            dlorItemSaving,
            '; e=',
            dlorSavedItemError,
            '; dlorSavedItem=',
            dlorSavedItem,
        );
        setConfirmationOpen(!dlorItemSaving && (!!dlorSavedItemError || !!dlorSavedItem));
    }, [dlorItemSaving, dlorSavedItemError, dlorSavedItem]);

    function setInteractionTypeDisplays(value) {
        linkInteractionTypeSelectRef.current = value;
        setShowLinkTimeForm(value === linkInteractionTypeVIEW);
        setShowLinkSizeForm(value === linkInteractionTypeDOWNLOAD);
    }
    useEffect(() => {
        if (mode === 'edit' && !!dlorItem) {
            setConfirmationOpen(false);
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
        if (!dlorTeamListError && !dlorTeamListLoading && !!dlorTeamList && dlorTeamList.length > 0) {
            if (mode === 'add') {
                const firstTeam = dlorTeamList?.filter((t, index) => index === 0) || /* istanbul ignore next */ [];
                teamSelectRef.current = firstTeam?.shift()?.team_id;
            }
        }
    }, [dlorTeamList, dlorTeamListError, dlorTeamListLoading, mode]);

    // these match the values in dlor cypress admin tests
    const titleMinimumLength = 8;
    const descriptionMinimumLength = 100;
    const summaryMinimumLength = 20;
    const keywordMinimumLength = 4;
    const characterCount = (numCharsCurrent, numCharsMin, fieldName) => {
        const missingCharCount = numCharsMin - numCharsCurrent;
        return (
            <Box
                sx={{
                    textAlign: 'right',
                    color: '#504e4e',
                    fontSize: '0.8em',
                }}
                data-testid={`input-characters-remaining-${convertSnakeCaseToKebabCase(fieldName)}`}
            >
                {numCharsCurrent > 0 && missingCharCount > 0
                    ? `at least ${missingCharCount} more ${pluraliseWord('character', missingCharCount)} needed`
                    : ''}
            </Box>
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

    const isValidUsername = testUserName => {
        return testUserName?.length >= 4 && testUserName?.length <= 8;
    };

    function validatePanelOwnership(currentValues) {
        let firstPanelErrorCount = 0;
        // valid user id is 8 or 9 char
        !isValidUsername(currentValues?.object_publishing_user) && firstPanelErrorCount++;
        if (teamSelectRef.current === 'new') {
            if (
                currentValues?.team_name_new === undefined ||
                !currentValues?.team_name_new ||
                currentValues?.team_name_new?.length < 1
            ) {
                firstPanelErrorCount++;
            }
            if (
                currentValues?.team_manager_new === undefined ||
                !currentValues?.team_manager_new ||
                currentValues?.team_manager_new?.length < 1
            ) {
                firstPanelErrorCount++;
            }
            (currentValues?.team_email_new === undefined ||
                !currentValues?.team_email_new ||
                currentValues?.team_email_new?.length < 1 ||
                !isValidEmail(currentValues?.team_email_new)) &&
                firstPanelErrorCount++;
        } else if (mode === 'edit') {
            currentValues?.team_manager_edit?.length < 1 && /* istanbul ignore next */ firstPanelErrorCount++;
            (currentValues?.team_email_edit?.length < 1 || !isValidEmail(currentValues?.team_email_edit)) &&
                firstPanelErrorCount++;
        }
        return firstPanelErrorCount;
    }

    function validatePanelDescription(currentValues) {
        let secondPanelErrorCount = 0;
        currentValues?.object_title?.length < titleMinimumLength && secondPanelErrorCount++;
        html2text.fromString(currentValues?.object_description)?.length < descriptionMinimumLength &&
            secondPanelErrorCount++;
        currentValues?.object_summary?.length < summaryMinimumLength && secondPanelErrorCount++;
        return secondPanelErrorCount;
    }

    function validatePanelLinks(currentValues) {
        let thirdPanelErrorCount = 0;
        !isValidUrl(currentValues?.object_link_url) && thirdPanelErrorCount++;

        [linkInteractionTypeDOWNLOAD, linkInteractionTypeVIEW].includes(currentValues?.object_link_interaction_type) &&
            (!currentValues?.object_link_file_type ||
                (currentValues?.object_link_file_type === 'new' && !currentValues?.new_file_type)) &&
            thirdPanelErrorCount++;

        // if minutes and seconds are both zero, error, otherwise zero allowed
        currentValues.object_link_interaction_type === linkInteractionTypeVIEW &&
            (!isValidNumber(currentValues?.object_link_duration_minutes, true) ||
                !isValidNumber(currentValues?.object_link_duration_seconds, true) ||
                !isValidNumber(
                    Number(currentValues?.object_link_duration_minutes) +
                        Number(currentValues?.object_link_duration_seconds),
                )) &&
            thirdPanelErrorCount++;

        currentValues.object_link_interaction_type === linkInteractionTypeDOWNLOAD &&
            !isValidNumber(currentValues?.object_link_size_amount) &&
            !currentValues?.object_link_size_unit &&
            thirdPanelErrorCount++;
        return thirdPanelErrorCount;
    }

    function validatePanelFiltering(currentValues) {
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
        return fourthPanelErrorCount;
    }

    const handleEditorChange = (fieldname, newContent) => {
        setSummarySuggestionOpen(true);
        // amalgamate new value into data set
        const newValues = { ...formValues, [fieldname]: newContent };

        setFormValues(newValues);
    };

    const handleFacetChange = () => e => {
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
        setFormValues(newValues);
    };

    const handleChange = prop => e => {
        let theNewValue =
            e.target.hasOwnProperty('checked') && e.target.type !== 'radio' ? e.target.checked : e.target.value;

        if (['object_is_featured', 'object_cultural_advice'].includes(prop)) {
            theNewValue = !!e.target.checked ? 1 : 0;
        }

        // handle teams dropdown changes
        if (prop === 'object_owning_team_id') {
            setShowTeamForm(theNewValue === 'new' ? 'new' : false);
            teamSelectRef.current = theNewValue !== 'new' ? e.target.value : 'new';
        }
        if (prop === 'object_link_interaction_type') {
            setInteractionTypeDisplays(theNewValue);
            if (mode === 'add') {
                linkFileTypeSelectRef.current = 'new';
            }
        }

        if (prop === 'object_summary') {
            setSummaryContent(e.target.value);
        }
        /* istanbul ignore next */
        if (prop === 'object_description') {
            setSummarySuggestionOpen(true);
        }
        if (prop === 'object_link_file_type') {
            linkFileTypeSelectRef.current = theNewValue;
            setShowFileTypeCreationForm(theNewValue === 'new');
        }

        // amalgamate new value into data set
        const newValues = { ...formValues, [prop]: theNewValue };

        setFormValues(newValues);
    };

    const controlEditTeamDialog = () => {
        if (showTeamForm !== false) {
            // clicked on "Close", close dialog
            setShowTeamForm(false);
            return;
        }

        setShowTeamForm(teamSelectRef.current);

        const newValues = {
            ...formValues,
            team_manager_edit: !!formValues ? formValues.team_manager_edit : /* istanbul ignore next */ '',
            team_email_edit: !!formValues ? formValues.team_email_edit : /* istanbul ignore next */ '',
        };
        setFormValues(newValues);
    };

    const stepPanelContentOwnership = (
        <>
            <Grid item xs={12}>
                <FormControl variant="standard" fullWidth>
                    <InputLabel htmlFor="object_publishing_user">Publishing user *</InputLabel>
                    <Input
                        id="object_publishing_user"
                        data-testid="object-publishing-user"
                        required
                        value={formValues?.object_publishing_user || ''}
                        onChange={handleChange('object_publishing_user')}
                        sx={{ width: '20em' }}
                        error={!isValidUsername(formValues?.object_publishing_user)}
                    />
                    <Box
                        sx={{
                            fontSize: '0.9em',
                            marginTop: '4px',
                        }}
                    >
                        This must be the person's UQ username
                    </Box>
                    {!isValidUsername(formValues?.object_publishing_user) && (
                        <StyledErrorMessageBox data-testid="dlor-form-error-message-object-publishing-user">
                            This username is not valid.
                        </StyledErrorMessageBox>
                    )}
                </FormControl>
            </Grid>
            <Grid item xs={12} sx={{ minHeight: '95px' }}>
                <InputLabel id="object_owning_team_label">Owning Team</InputLabel>
                <Select
                    variant="standard"
                    labelId="object_owning_team_label"
                    id="object_owning_team"
                    data-testid="object-owning-team"
                    value={teamSelectRef.current ?? 1}
                    onChange={handleChange('object_owning_team_id')}
                    sx={{ minWidth: '20em' }}
                >
                    {dlorTeamList?.map((t, index) => {
                        return (
                            <MenuItem
                                key={t.team_id}
                                value={t.team_id}
                                selected={t.team_id === teamSelectRef.current}
                                data-testid={`object-owning-team-${t.team_id}`}
                                divider={index === dlorTeamList.length - 1}
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
                {/* the user can only edit team details for the current Team - this is just a convenience form */}
                {mode === 'edit' && formDefaults?.object_owning_team_id === teamSelectRef.current && (
                    <Button
                        onClick={() => controlEditTeamDialog()}
                        sx={{ marginLeft: '10px' }}
                        data-testid="object-form-teamid-change"
                    >
                        {showTeamForm === false ? 'Update contact' : 'Close'}
                    </Button>
                )}
            </Grid>
            {showTeamForm !== false && teamSelectRef.current === 'new' && (
                <Grid item xs={5}>
                    <FormControl variant="standard" fullWidth>
                        <InputLabel htmlFor="team_name_new">Name of new Team *</InputLabel>
                        <Input
                            id="team_name_new"
                            data-testid="dlor-form-team-name-new"
                            value={formValues?.team_name_new || ''}
                            onChange={handleChange('team_name_new')}
                        />
                    </FormControl>
                    <FormControl variant="standard" fullWidth>
                        <InputLabel htmlFor="team_manager_new">Name of Team manager *</InputLabel>
                        <Input
                            id="team_manager_new"
                            data-testid="dlor-form-team-manager-new"
                            required
                            value={formValues?.team_manager_new || ''}
                            onChange={handleChange('team_manager_new')}
                        />
                    </FormControl>
                    <FormControl variant="standard" fullWidth>
                        <InputLabel htmlFor="team_email_new">Team email *</InputLabel>
                        <Input
                            id="team_email_new"
                            data-testid="dlor-form-team-email-new"
                            required
                            value={formValues?.team_email_new || ''}
                            onChange={handleChange('team_email_new')}
                            type="email"
                            error={!isValidEmail(formValues?.team_email_new)}
                        />
                        {!isValidEmail(formValues?.team_email_new) && (
                            <StyledErrorMessageBox data-testid="error-message-team-email-new">
                                This email address is not valid.
                            </StyledErrorMessageBox>
                        )}
                    </FormControl>
                </Grid>
            )}
            {showTeamForm !== false && teamSelectRef.current !== 'new' && (
                <Grid item xs={5}>
                    <Box sx={{ fontStyle: 'italic', marginBlock: '-16px 16px' }}>
                        A change here will affect all Objects for this team.
                        <br />
                        You can also{' '}
                        <a target="_blank" href={dlorAdminLink('/team/manage')}>
                            Manage Teams
                        </a>
                    </Box>
                    <FormControl variant="standard" fullWidth>
                        <InputLabel htmlFor="team_manager_edit">Name of Team manager *</InputLabel>
                        <Input
                            id="team_manager_edit"
                            data-testid="dlor-form-team-manager-edit"
                            required
                            value={formValues?.team_manager_edit || /* istanbul ignore next */ ''}
                            onChange={handleChange('team_manager_edit')}
                        />
                    </FormControl>
                    <FormControl variant="standard" fullWidth>
                        <InputLabel htmlFor="team_email_edit">Team email *</InputLabel>
                        <Input
                            id="team_email_edit"
                            data-testid="dlor-form-team-email-edit"
                            required
                            value={formValues?.team_email_edit || ''}
                            onChange={handleChange('team_email_edit')}
                            type="email"
                            error={!isValidEmail(formValues?.team_email_edit)}
                        />
                        {!isValidEmail(formValues?.team_email_edit) && (
                            <StyledErrorMessageBox data-testid="error-message-team-email-edit">
                                This email address is not valid.
                            </StyledErrorMessageBox>
                        )}
                    </FormControl>
                </Grid>
            )}
            <Grid item xs={12}>
                {mode === 'edit' ? (
                    <Typography component={'p'}>
                        Next Review Date: {formValues?.object_review_date_next} (edit to come)
                    </Typography>
                ) : (
                    <Typography component={'p'}>
                        Next Review Date: {formValues?.object_review_date_next} (setting to come)
                    </Typography>
                )}
            </Grid>
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
        /* istanbul ignore else */
        if (plainSummary?.length <= requiredLength) {
            return plainSummary;
        }

        // return the first n characters, breaking at a word break
        /* istanbul ignore next */
        const trimmedString = plainSummary?.slice(0, requiredLength + 1);
        /* istanbul ignore next */
        const slice = trimmedString.slice(0, Math.min(trimmedString?.length, trimmedString?.lastIndexOf(' ')));
        /* istanbul ignore next */
        return slice;
    };

    const useSuggestion = () => {
        const newSummary = suggestSummary(formValues?.object_description);
        setSummaryContent(newSummary);
        // amalgamate new value into data set
        const newValues = { ...formValues, ['object_summary']: newSummary };

        setFormValues(newValues);

        setSummarySuggestionOpen(false);
    };

    const SummaryCharCountPrompt = () => {
        let newVar = '';
        if (!!formValues?.object_summary) {
            newVar = characterCount(formValues?.object_summary?.length, summaryMinimumLength, 'object_summary');
        } else {
            /* istanbul ignore next */
            if (!!summaryContent) {
                newVar = characterCount(summaryContent?.length, summaryMinimumLength, 'object_summary');
            }
        }
        return newVar;
    };

    const stepPanelContentDescription = (
        <>
            <Grid item xs={12}>
                <FormControl variant="standard" fullWidth>
                    <InputLabel htmlFor="object_title">Object title *</InputLabel>
                    <Input
                        id="object_title"
                        data-testid="object-title"
                        required
                        value={formValues?.object_title || ''}
                        onChange={handleChange('object_title')}
                    />
                    {!!formValues?.object_title &&
                        characterCount(formValues?.object_title?.length, titleMinimumLength, 'object_title')}
                </FormControl>
            </Grid>
            <Grid item xs={12}>
                <FormControl variant="standard" fullWidth sx={{ paddingTop: '50px' }}>
                    <InputLabel htmlFor="object_description">Description of Object *</InputLabel>
                    <CKEditor
                        id="object_description"
                        data-testid="object-description"
                        sx={{ width: '100%' }}
                        editor={ClassicEditor}
                        config={editorConfig}
                        data={formValues?.object_description || ''}
                        onReady={editor => {
                            editor.editing.view.change(writer => {
                                writer.setStyle('height', '200px', editor.editing.view.document.getRoot());
                            });
                        }}
                        onChange={(event, editor) => {
                            const htmlData = editor.getData();
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
                <FormControl variant="standard" fullWidth>
                    <InputLabel htmlFor="object_summary">Summary of Object *</InputLabel>
                    <Input
                        id="object_summary"
                        data-testid="object-summary"
                        multiline
                        required
                        rows={2}
                        value={summaryContent}
                        onChange={handleChange('object_summary')}
                    />
                    <SummaryCharCountPrompt />
                    {!!summarySuggestionOpen && (
                        <div data-testid="admin-dlor-suggest-summary">
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
                            </Box>
                            <Typography
                                component={'p'}
                                sx={{ marginBlock: '10px' }}
                                data-testid="admin-dlor-suggest-summary-content"
                            >
                                {suggestSummary(formValues?.object_description)}
                            </Typography>
                            <Button
                                color="primary"
                                data-testid="admin-dlor-suggest-summary-button"
                                data-analyticsid="admin-dlor-suggest-summary-button"
                                sx={{ display: 'block' }}
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
                        data-testid="object-is-featured"
                        onChange={handleChange('object_is_featured')}
                        sx={{ paddingLeft: 0 }}
                    />
                    Feature this Object at the top of the list page
                </InputLabel>
            </Grid>
            <Grid item xs={12}>
                <FormLabel>Cultural advice?</FormLabel>
                <InputLabel>
                    <Checkbox
                        checked={!!formValues?.object_cultural_advice}
                        data-testid="object-cultural-advice"
                        onChange={handleChange('object_cultural_advice')}
                        sx={{ paddingLeft: 0 }}
                    />
                    Display the standard Cultural advice against this item
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
                <FormControl variant="standard" fullWidth>
                    <InputLabel htmlFor="object_link_url">Web address *</InputLabel>
                    <Input
                        id="object_link_url"
                        data-testid="object-link-url"
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
                            <StyledErrorMessageBox data-testid="dlor-form-error-message-object-link-url">
                                This web address is not valid.
                            </StyledErrorMessageBox>
                        )}
                    {formValues?.object_link_url?.length > 'http://ab.co'.length &&
                        isPreviewableUrl(formValues?.object_link_url) !== false && (
                            <Box
                                sx={{ display: 'flex', alignItems: 'center', marginBlock: '6px' }}
                                data-testid="object-link-url-preview"
                            >
                                <DoneIcon color="success" />
                                <span>A preview will show on the View page.</span>
                            </Box>
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
                                data-testid="object-link-interaction-type"
                                value={linkInteractionTypeSelectRef.current}
                                onChange={handleChange('object_link_interaction_type')}
                                sx={{ width: '100%' }}
                            >
                                <MenuItem
                                    value={linkInteractionTypeDOWNLOAD}
                                    data-testid="object-link-interaction-type-download"
                                    selected={linkInteractionTypeSelectRef.current === linkInteractionTypeDOWNLOAD}
                                >
                                    can Download
                                </MenuItem>
                                <MenuItem
                                    value={linkInteractionTypeVIEW}
                                    data-testid="object-link-interaction-type-view"
                                    selected={linkInteractionTypeSelectRef.current === linkInteractionTypeVIEW}
                                >
                                    can View
                                </MenuItem>
                                <MenuItem
                                    value={linkInteractionTypeNONE}
                                    data-testid="object-link-interaction-type-none"
                                    selected={
                                        ![linkInteractionTypeDOWNLOAD, linkInteractionTypeVIEW].includes(
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
                        <FormControl sx={{ minWidth: '10em' }}>
                            {[linkInteractionTypeDOWNLOAD, linkInteractionTypeVIEW].includes(
                                linkInteractionTypeSelectRef.current,
                            ) && (
                                <>
                                    <InputLabel htmlFor="object_link_file_type">File type *</InputLabel>
                                    <Select
                                        variant="standard"
                                        labelId="object_link_file_type"
                                        id="object_link_file_type"
                                        data-testid="object-link-file-type"
                                        value={linkFileTypeSelectRef.current}
                                        onChange={handleChange('object_link_file_type')}
                                        sx={{ width: '100%', marginTop: '20px' }}
                                    >
                                        {getFileTypeList.map(type => (
                                            <MenuItem
                                                key={type.object_link_file_type}
                                                data-testid={`object-link-file-type-${convertSnakeCaseToKebabCase(
                                                    type.object_link_file_type,
                                                )}`}
                                                value={type.object_link_file_type}
                                                selected={type.object_link_file_type === linkFileTypeSelectRef.current}
                                            >
                                                {type.object_link_file_type}
                                            </MenuItem>
                                        ))}
                                        <MenuItem
                                            data-testid={'object-link-file-type-new'}
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
                                                    data-testid="dlor-admin-form-new-file-type"
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
                        <StyledViewDurationBox>
                            {!!showLinkTimeForm && (
                                <>
                                    <InputLabel id="object_link_duration-label">Run time *</InputLabel>
                                    <div>
                                        <FormControl>
                                            <Input
                                                id="object_link_duration_minutes"
                                                aria-labelledby="object_link_duration-label object_link_duration_minutes"
                                                data-testid="object-link-duration-minutes"
                                                required
                                                value={formValues?.object_link_duration_minutes || ''}
                                                onChange={handleChange('object_link_duration_minutes')}
                                            />
                                        </FormControl>
                                        <StyledDurationSpan id="object_link_duration_minutes-label">
                                            minutes
                                        </StyledDurationSpan>
                                        <StyledDurationSpan> and </StyledDurationSpan>
                                        <FormControl>
                                            <Input
                                                id="object_link_duration_seconds"
                                                aria-labelledby="object_link_duration-label object_link_duration_seconds-label"
                                                data-testid="object-link-duration-seconds"
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
                                                data-testid="object-link-size-amount"
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
                                                data-testid="object-link-size-units"
                                                value={formValues?.object_link_size_units}
                                                onChange={handleChange('object_link_size_units')}
                                            >
                                                {validFileSizeUnits.map(unit => (
                                                    <MenuItem
                                                        key={unit}
                                                        id={`object_link_size_units-${unit}`}
                                                        data-testid={`object-link-size-units-${unit}`}
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
                        </StyledViewDurationBox>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <FormControl variant="standard" fullWidth sx={{ paddingTop: '50px' }}>
                    {/* yes, this looks too big locally, but looks correct live. No, I dont know why */}
                    <InputLabel htmlFor="object_download_instructions" sx={{ fontSize: 20 }}>
                        Download Instructions
                    </InputLabel>
                    <CKEditor
                        id="download_instructions"
                        data-testid="download_instructions"
                        sx={{ width: '100%' }}
                        editor={ClassicEditor}
                        config={editorConfig}
                        data={formValues?.object_download_instructions || ''}
                        onReady={editor => {
                            editor.editing.view.change(writer => {
                                writer.setStyle('height', '200px', editor.editing.view.document.getRoot());
                            });
                        }}
                        onChange={(event, editor) => {
                            const htmlData = editor.getData();
                            handleEditorChange('object_download_instructions', htmlData);
                        }}
                    />
                </FormControl>
            </Grid>
        </>
    );

    function displayControlByFacetType(filterItem) {
        const facetIsSet = findId => {
            return checkBoxArrayRef.current.includes(findId);
        };

        let result = <></>;
        /* istanbul ignore else */
        if (filterItem?.facet_type_number === 'one-or-more' || filterItem?.facet_type_number === 'zero-or-more') {
            result =
                !!filterItem.facet_list &&
                filterItem.facet_list.map(thisfacet => {
                    return (
                        <StyledFacetFormControlLabel
                            key={`${filterItem.facet_type_slug}-${thisfacet.facet_id}`}
                            control={
                                <Checkbox
                                    onChange={handleFacetChange(thisfacet.facet_id)}
                                    id={`filter-${thisfacet.facet_id}`}
                                    data-testid={`filter-${convertSnakeCaseToKebabCase(
                                        filterItem.facet_type_slug,
                                    )}-${slugifyName(thisfacet.facet_name)}`}
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
                    aria-labelledby={`demo-radio-object_${filterItem.facet_type_slug}_label-group-label`}
                    name={radioGroupName}
                    value={filterItem.facet_id}
                    onChange={handleFacetChange(filterItem.id)}
                >
                    {filterItem?.facet_list?.map(thisfacet => {
                        return (
                            <StyledFacetFormControlLabel
                                key={thisfacet.facet_id}
                                control={<Radio checked={facetIsSet(thisfacet?.facet_id, formValues?.facets)} />}
                                value={thisfacet.facet_id}
                                data-testid={`filter-${convertSnakeCaseToKebabCase(
                                    filterItem.facet_type_slug,
                                )}-${slugifyName(thisfacet.facet_name)}`}
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

    const openNotifyLightbox = () => {
        setIsNotificationLightboxOpen(true);
    };

    const closeNotifyLightbox = () => {
        setIsNotificationLightboxOpen(false);
    };

    const handleNotifyChange = e => {
        e.preventDefault();
        setIsNotifying(!!e.target.checked);
        !!e.target.checked && openNotifyLightbox();
    };

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
                        <Grid
                            item
                            xs={4}
                            key={filterItem.facet_type_slug}
                            data-testid={`filter-group-${convertSnakeCaseToKebabCase(filterItem.facet_type_slug)}`}
                        >
                            <Typography
                                component={'h3'}
                                variant={'h7'}
                                id={`demo-radio-object_${filterItem.facet_type_slug}_label-group-label`}
                            >
                                {!!filterItem.facet_type_name && filterItem.facet_type_name}{' '}
                                {filterItem?.facet_type_required && <span title="Required field">*</span>}
                            </Typography>
                            {displayControlByFacetType(filterItem)}
                        </Grid>
                    );
                })}
            <Grid item xs={12}>
                <FormControl variant="standard" fullWidth>
                    <InputLabel htmlFor="object_keywords">
                        Keywords - enter a comma separated list of keywords *
                    </InputLabel>
                    <Input
                        id="object_keywords"
                        data-testid="object-keywords"
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
                    <Box
                        sx={{
                            fontSize: '0.8em',
                            marginBlock: '12px',
                        }}
                    >
                        If you need a keyword with a comma within it, surround the keyword with double quotes, like:
                        cat, "dog, dog", mouse
                    </Box>
                </FormControl>
            </Grid>
            {mode === 'edit' && (
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    onChange={handleNotifyChange}
                                    data-testid="choose-notify"
                                    checked={isNotifying}
                                />
                            }
                            label="Notify following users?"
                        />
                        {!!isNotifying && (
                            <Button onClick={openNotifyLightbox} data-testid="notify-reedit-button">
                                Edit
                            </Button>
                        )}
                    </Box>
                </Grid>
            )}

            <Modal
                open={isNotificationLightboxOpen}
                onClose={closeNotifyLightbox}
                aria-labelledby="notify-lightbox-title"
                aria-describedby="notify-lightbox-description"
                data-testid="notify-lightbox-modal"
                sx={{ zIndex: 1000 }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80%',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <StyledLightboxHeaderBox id="notify-lightbox-title">
                        <Typography variant="h6" component="h2" data-testid="notify-lightbox-title">
                            Object change notification
                        </Typography>
                        <Typography variant="h6" component="p">
                            {dlorItem?.object_title}
                        </Typography>
                    </StyledLightboxHeaderBox>
                    <Typography id="notify-lightbox-description" sx={{ mt: '2px' }}>
                        We have updated{' '}
                        <b>
                            <a href={getDlorViewPageUrl(dlorItem?.object_public_uuid)}>{dlorItem?.object_title}</a>
                        </b>
                    </Typography>
                    <Typography sx={{ mt: '2px' }}>Here is what is new:</Typography>
                    <Typography sx={{ mt: '2px', color: 'grey', fontSize: '0.8em' }}>
                        Enter the notification details the user will see here:
                    </Typography>
                    <CKEditor
                        id="notificationText"
                        sx={{ width: '100%' }}
                        editor={ClassicEditor}
                        config={editorConfig}
                        data={formValues?.notificationText || ''}
                        onReady={editor => {
                            editor.editing.view.change(writer => {
                                writer.setStyle('height', '200px', editor.editing.view.document.getRoot());
                            });
                        }}
                        onChange={(event, editor) => {
                            const htmlData = editor.getData();
                            handleEditorChange('notificationText', htmlData);
                        }}
                    />
                    <Typography sx={{ mt: '2px' }}>
                        You can <StyledLinkAppearanceSpan>unsubscribe</StyledLinkAppearanceSpan> from notifications
                        about this object.
                    </Typography>
                    <Typography sx={{ mt: '2px' }}>
                        Please email{' '}
                        <StyledLinkAppearanceSpan>digital-learning-hub@library.uq.edu.au</StyledLinkAppearanceSpan> if
                        you have any questions.
                    </Typography>
                    <Typography sx={{ mt: '2px' }}>
                        <small>
                            <strong>
                                Please do not reply directly to this email. This mailbox is not monitored, and you will
                                not receive a response.
                            </strong>
                        </small>
                    </Typography>
                    <Typography sx={{ mt: '2px' }}>
                        <small>
                            e.{' '}
                            <StyledLinkAppearanceSpan>digital-learning-hub@library.uq.edu.au</StyledLinkAppearanceSpan>{' '}
                            | w. <a href="http://www.library.uq.edu.au">www.library.uq.edu.au</a>
                        </small>
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: '2px' }}>
                        <Button
                            variant="contained"
                            color="secondary"
                            disabled={formValues?.notificationText === ''}
                            data-testid="notify-lightbox-close-button"
                            onClick={closeNotifyLightbox}
                            sx={{ mt: '2px' }}
                        >
                            Close
                        </Button>
                    </Box>
                </Box>
            </Modal>
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

    useEffect(() => {
        /* istanbul ignore else */
        if (!dlorTeamListError && !dlorTeamListLoading && !dlorTeamList) {
            actions.loadOwningTeams();
        }
        /* istanbul ignore else */
        if (!dlorFilterListError && !dlorFilterListLoading && !dlorFilterList) {
            actions.loadAllFilters();
        }
        /* istanbul ignore else */
        if (mode === 'add' && !dlorFileTypeListError && !dlorFileTypeListLoading && !dlorFileTypeList) {
            actions.loadFileTypeList();
        }

        console.log('useEffect 2ND l=', dlorItemSaving, '; e=', dlorSavedItemError, '; dlorSavedItem=', dlorSavedItem);
        setConfirmationOpen(!dlorItemSaving && (!!dlorSavedItemError || !!dlorSavedItem));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* istanbul ignore next */
    useEffect(() => {
        const isFileTypeSet =
            [linkInteractionTypeDOWNLOAD, linkInteractionTypeVIEW].includes(
                formDefaults?.object_link_interaction_type || null,
            ) && !!formDefaults?.object_link_file_type;
        if (!!isFileTypeSet) {
            setShowFileTypeCreationForm(false);
        } else {
            setShowFileTypeCreationForm(true);
            formDefaults.object_link_file_type = 'new';
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formDefaults]);

    useEffect(() => {
        if ((!!dlorSavedItem && !!dlorSavedItem.data?.object_id) || !!dlorSavedItemError) {
            setConfirmationOpen(true);
        }
    }, [dlorSavedItem, dlorSavedItemError]);

    const saveDlor = () => {
        const valuesToSend = { ...formValues };
        // somehow in localhost this is already an array of ids, but on feature branch its the original facets
        if (valuesToSend.facets.length > 0 && valuesToSend.facets[0].hasOwnProperty('filter_key')) {
            valuesToSend.facets = flatMapFacets(formValues?.facets);
        }
        if (formValues?.object_owning_team_id === 'new') {
            delete valuesToSend.object_owning_team_id;

            valuesToSend.team_name = valuesToSend.team_name_new;
            valuesToSend.team_manager = valuesToSend.team_manager_new;
            valuesToSend.team_email = valuesToSend.team_email_new;
        } else if (formValues?.object_owning_team_id !== formDefaults.object_owning_team_id) {
            // they can only change manager and email for the original team;
            // if they entered this then changed teams, undo
            delete valuesToSend.team_name;
            delete valuesToSend.team_manager;
            delete valuesToSend.team_email;
        } else {
            valuesToSend.team_name = valuesToSend.team_name_edit;
            valuesToSend.team_manager = valuesToSend.team_manager_edit;
            valuesToSend.team_email = valuesToSend.team_email_edit;
        }

        delete valuesToSend.team_name_new;
        delete valuesToSend.team_manager_new;
        delete valuesToSend.team_email_new;
        delete valuesToSend.team_name_edit;
        delete valuesToSend.team_manager_edit;
        delete valuesToSend.team_email_edit;

        valuesToSend.object_keywords = splitStringToArrayOnComma(valuesToSend.object_keywords_string);
        delete valuesToSend.object_keywords_string;

        if (mode === 'add') {
            delete valuesToSend.notificationText;
        } else if (!isNotifying) {
            valuesToSend.notificationText = '';
        }

        /* istanbul ignore else */
        if (valuesToSend?.object_link_interaction_type === linkInteractionTypeDOWNLOAD) {
            valuesToSend.object_link_size = convertFileSizeToKb(
                valuesToSend?.object_link_size_amount,
                valuesToSend?.object_link_size_units,
            );
        } else if (valuesToSend?.object_link_interaction_type === linkInteractionTypeVIEW) {
            valuesToSend.object_link_size = getTotalSecondsFromMinutesAndSecond(
                valuesToSend?.object_link_duration_minutes,
                valuesToSend?.object_link_duration_seconds,
            );
        } else if (valuesToSend?.object_link_interaction_type === linkInteractionTypeNONE) {
            delete valuesToSend?.object_link_file_type;
        }
        if (!!valuesToSend.new_file_type) {
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
            : actions.updateDlor(dlorItem?.object_public_uuid, valuesToSend);
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
        setConfirmationOpen(false);
        actions.clearADlor();
        window.location.href = dlorAdminLink();
        scrollToTopOfPage();
    };
    const navigateToPreviousPage = () => {
        window.location.href = dlorAdminLink();
    };

    function closeConfirmationBox() {
        setConfirmationOpen(false);
    }

    const clearForm = () => {
        setConfirmationOpen(false);
        window.location.reload(false);
    };

    const handleNext = () => setActiveStep(prevActiveStep => prevActiveStep + 1);
    const handleBack = () => setActiveStep(prevActiveStep => prevActiveStep - 1);

    if (!!dlorTeamListLoading || dlorFilterListLoading || !!dlorItemSaving || !!dlorItemLoading) {
        return (
            <Grid item xs={12}>
                <InlineLoader message="Loading" />
            </Grid>
        );
    }
    if (!!dlorTeamListError) {
        return (
            <Typography variant="body1" data-testid="dlor-form-addedit-error">
                {dlorTeamListError}
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

    function panelErrorCount(index) {
        if (index === 0) {
            return validatePanelOwnership(formValues);
        } else if (index === 1) {
            return validatePanelDescription(formValues);
        } else if (index === 2) {
            return validatePanelLinks(formValues);
        } else {
            // index must = 3
            return validatePanelFiltering(formValues);
        }
    }

    return (
        <>
            <ConfirmationBox
                actionButtonColor="primary"
                actionButtonVariant="contained"
                confirmationBoxId="dlor-save-outcome"
                onAction={() => navigateToDlorAdminHomePage()}
                hideCancelButton={!locale.successMessage.cancelButtonLabel}
                cancelButtonLabel={locale.successMessage.cancelButtonLabel}
                onCancelAction={() => clearForm()}
                onClose={closeConfirmationBox}
                isOpen={confirmationOpen}
                locale={!!dlorSavedItemError ? locale.errorMessage : locale.successMessage}
            />
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
                                    <Step key={step.label} {...stepProps} sx={{ paddingRight: '25px' }}>
                                        <StepLabel {...labelProps}>
                                            {panelErrorCount(index) === 0 ? (
                                                <span>{step.label}</span>
                                            ) : (
                                                <StyledErrorCountBadge
                                                    color="error"
                                                    badgeContent={panelErrorCount(index)}
                                                    data-testid={`dlor-panel-validity-indicator-${index}`}
                                                >
                                                    {step.label}
                                                </StyledErrorCountBadge>
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
                                    disabled={
                                        validatePanelOwnership(formValues) > 0 ||
                                        validatePanelDescription(formValues) > 0 ||
                                        validatePanelLinks(formValues) > 0 ||
                                        validatePanelFiltering(formValues) > 0
                                    }
                                    onClick={saveDlor}
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
            <Grid container spacing={2} sx={{ marginTop: '32px' }}>
                <Grid item xs={3} align="left">
                    <Button
                        color="secondary"
                        children="Cancel"
                        data-testid="admin-dlor-form-button-cancel"
                        onClick={() => navigateToPreviousPage()}
                        variant="contained"
                    />
                </Grid>
                <Grid item xs={9} align="right" />
            </Grid>
        </>
    );
};

DlorForm.propTypes = {
    actions: PropTypes.any,
    dlorItemLoading: PropTypes.bool,
    dlorItem: PropTypes.object,
    dlorItemUpdating: PropTypes.bool,
    dlorUpdatedItemError: PropTypes.any,
    dlorUpdatedItem: PropTypes.object,
    dlorTeamList: PropTypes.array,
    dlorTeamListLoading: PropTypes.bool,
    dlorTeamListError: PropTypes.any,
    dlorFilterList: PropTypes.array,
    dlorFilterListLoading: PropTypes.bool,
    dlorFilterListError: PropTypes.any,
    dlorFileTypeList: PropTypes.array,
    dlorFileTypeListLoading: PropTypes.bool,
    dlorFileTypeListError: PropTypes.any,
    dlorSavedItem: PropTypes.object,
    dlorItemSaving: PropTypes.bool,
    dlorSavedItemError: PropTypes.any,
    formDefaults: PropTypes.object,
    mode: PropTypes.string,
};

export default DlorForm;
