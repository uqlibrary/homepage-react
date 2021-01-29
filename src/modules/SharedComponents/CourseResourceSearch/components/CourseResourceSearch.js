import React, { useRef, useState } from 'react';
import { throttle } from 'throttle-debounce';

import { PropTypes } from 'prop-types';
import { isRepeatingString, unescapeString } from 'helpers/general';
import { default as locale } from 'modules/Pages/CourseResources/courseResources.locale';
import { extractSubjectCodeFromName } from 'modules/Pages/CourseResources/courseResourcesHelpers';

import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import Hidden from '@material-ui/core/Hidden';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(
    theme => ({
        searchPanel: {
            paddingTop: 12,
            paddingRight: 20,
            paddingBottom: 0,
            paddingLeft: 20,
        },
        selectInput: {
            fontWeight: 300,
            color: theme.palette.primary.main,
            textOverflow: 'ellipsis !important',
            overflow: 'hidden !important',
            whiteSpace: 'nowrap !important',
            '&::placeholder': {
                paddingRight: 50,
                textOverflow: 'ellipsis !important',
                overflow: 'hidden !important',
                whiteSpace: 'nowrap !important',
            },
        },
        searchUnderlinks: {
            marginBottom: 4,
            '&a, a:link, a:hover, a:visited, a:active': {
                color: theme.palette.primary.main + ' !important',
            },
            [theme.breakpoints.down('sm')]: {
                zoom: 0.9,
            },
        },
        searchButton: {
            [theme.breakpoints.up('md')]: {
                width: 40,
                minWidth: 20,
                padding: '8px 8px !important',
            },
            [theme.breakpoints.down('sm')]: {
                width: '100%',
            },
        },
        fullForm: {
            marginBottom: 50,
        },
        searchTitle: {
            marginBlockStart: '0.5rem',
            marginBlockEnd: '0.5rem',
            marginLeft: '1rem',
        },
    }),
    { withTheme: true },
);

export const CourseResourceSearch = ({
    actions,
    displayType, // default: 'full'; values: 'full', 'compact'
    // 'full' for course resources page search
    // 'compact' for course resource search in homepage panel
    elementId,
    loadCourseAndSelectTab,
    navigateToCourseResourcePage,
    CRsuggestions,
    CRsuggestionsLoading,
    CRsuggestionsError,
}) => {
    const classes = useStyles();

    // control the displayed value (we dont want the subject hanging around in the input field after selection)
    const [inputValue, setInputValue] = useState('');

    /* istanbul ignore next */
    const handleSubmit = event => {
        event.preventDefault();
    };

    const throttledCourseResourceLoadSuggestions = useRef(
        throttle(3100, newValue => actions.loadCourseReadingListsSuggestions(newValue)),
    );

    const handleTypedKeywordChange = React.useCallback(
        (event, newValue) => {
            if (newValue.includes(' ')) {
                // skip a space in the input - api doesnt really handle multiple words
                return;
            }

            // make sure what is displayed matches what we are using
            setInputValue(newValue);

            if (newValue.length <= 3) {
                actions.clearCourseResourceSuggestions();
            } else if (!isRepeatingString(newValue)) {
                // if we pass a space in the search string, Autocomplete refuses to display a result
                // but - api only returns anything for "multiple words" when they make up a course code
                // (eg 'health economics' doesnt return anything, but 'FREN 1010' does)
                // so spaces do nothing anyway
                throttledCourseResourceLoadSuggestions.current(newValue.replace(' ', ''));
                document.getElementById(`${elementId}-autocomplete`).focus();
            }
        },
        [actions, elementId],
    );

    const courseResourceSubjectDisplay = option => {
        const coursecode = option.text;
        const title = !!option.rest.course_title ? `${unescapeString(option.rest.course_title)}, ` : '';
        const campus = !!option.rest.campus ? `${option.rest.campus}, ` : '';
        const semester = !!option.rest.period ? option.rest.period : '';
        // we need coursecode AND campus AND semester to make the api call for the details, so exclude any without
        return !!option && !!coursecode && !!semester && !!campus ? `${coursecode} (${title}${campus}${semester})` : '';
    };

    const handleSelectionOfCourseInDropdown = (event, option) => {
        /* istanbul ignore else */
        if (!!option && !!option.text) {
            if (displayType === 'compact') {
                // user is on the homepage - will navigate to the Course Resources page
                navigateToCourseResourcePage(option);
            } else {
                // user is on the Course Resource page - tab will load
                loadCourseAndSelectTab(extractSubjectCodeFromName(option.text), CRsuggestions);
            }

            document.getElementById(`${elementId}-autocomplete`).value = '';

            // we dont want the previous list to pop up if they search again
            actions.clearCourseResourceSuggestions();

            // clear the input after they select so they can re-search in a clean field
            setInputValue('');
        }
    };

    // we group them all together to place a header at the top of the search results
    const renderGroup = params => [
        <h3 className={classes.searchTitle} key={params.key}>
            {locale.search.autocompleteResultsTitle}
        </h3>,
        params.children,
    ];

    return (
        <form onSubmit={handleSubmit} className={displayType === 'full' ? classes.fullForm : ''}>
            <Grid container spacing={1} className={classes.searchPanel} alignItems={'flex-end'}>
                <Grid item xs={12} sm>
                    <Autocomplete
                        autoSelect
                        data-testid={`${elementId}-autocomplete`}
                        blurOnSelect="mouse"
                        clearOnEscape
                        id={`${elementId}-autocomplete`}
                        options={(!!CRsuggestions && CRsuggestions) || []}
                        getOptionLabel={option => courseResourceSubjectDisplay(option)}
                        onChange={(event, value) => {
                            handleSelectionOfCourseInDropdown(event, value);
                        }}
                        inputValue={inputValue}
                        onInputChange={handleTypedKeywordChange}
                        noOptionsText={locale.search.noOptionsText}
                        renderGroup={renderGroup}
                        groupBy={() => false}
                        renderInput={params => {
                            return (
                                <TextField
                                    {...params}
                                    placeholder={locale.search.placeholder}
                                    error={!!CRsuggestionsError}
                                    InputProps={{
                                        ...params.InputProps,
                                        type: 'search',
                                        classes: {
                                            input: classes.selectInput,
                                        },
                                    }}
                                    inputProps={{
                                        ...params.inputProps,
                                        'data-testid': `${elementId}-autocomplete-input-wrapper`,
                                        'aria-label': 'search for a subject by course code or title',
                                    }}
                                    label={locale.search.placeholder}
                                />
                            );
                        }}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2} className={classes.searchPanel} data-testid={`${elementId}-results`}>
                {!!CRsuggestionsLoading && (
                    <Grid
                        item
                        xs={'auto'}
                        style={{ width: 80, marginLeft: -100, marginRight: 20, marginBottom: 6, opacity: 0.3 }}
                    >
                        <CircularProgress color="primary" size={20} id="loading-CRsuggestions" />
                    </Grid>
                )}
            </Grid>
            <Grid container spacing={2} className={classes.searchPanel} data-testid={`${elementId}-links`}>
                {!!CRsuggestionsError ? (
                    /* istanbul ignore next */
                    <Grid item xs={12} sm={12} md style={{ color: 'red' }}>
                        <span>{locale.search.unavailableText}</span>
                    </Grid>
                ) : (
                    <Hidden smDown>
                        <Grid item xs />
                    </Hidden>
                )}
            </Grid>
        </form>
    );
};

CourseResourceSearch.propTypes = {
    displayType: PropTypes.string,
    elementId: PropTypes.string,
    history: PropTypes.any,
    locale: PropTypes.any,
    option: PropTypes.any,
    loadCourseAndSelectTab: PropTypes.any,
    navigateToCourseResourcePage: PropTypes.any,
    CRsuggestions: PropTypes.any,
    CRsuggestionsLoading: PropTypes.bool,
    CRsuggestionsError: PropTypes.string,
    actions: PropTypes.any,
};

CourseResourceSearch.defaultProps = {
    displayType: 'all',
};

export default CourseResourceSearch;
