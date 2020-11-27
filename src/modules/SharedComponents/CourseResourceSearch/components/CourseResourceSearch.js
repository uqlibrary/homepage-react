import React, { useState } from 'react';
// import { useLocation } from 'react-router';

import { PropTypes } from 'prop-types';
import { isRepeatingString, unescapeString } from 'helpers/general';
import { courseResourcesLocale as locale } from 'modules/Index/components/CourseResources.locale';

import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import Hidden from '@material-ui/core/Hidden';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';
import TextField from '@material-ui/core/TextField';
import { extractSubjectCodeFromName } from 'modules/Pages/CourseResources/courseResourcesHelpers';

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
    }),
    { withTheme: true },
);

export const CourseResourceSearch = ({
    actions,
    displayType, // default: 'full'; values: 'full', 'compact'
    // 'full' for course resources page search
    // 'compact' for course resource search in homepage panel
    elementId = 'primo-search',
    loadCourseAndSelectTab,
    navigateToCourseResourcePage,
    suggestions,
    suggestionsLoading,
    suggestionsError,
}) => {
    const classes = useStyles();

    const [searchKeyword, setSearchKeyword] = useState('');

    const handleSubmit = event => {
        event.preventDefault();
    };

    const handleTypedKeywordChange = React.useCallback(
        (event, newValue) => {
            console.log('handleTypedKeywordChange: newValue = ', newValue);
            setSearchKeyword(newValue);
            if (newValue.includes(' ')) {
                // Autocomplete is firing onInputChange with the full course name many times. Dont know why.
                // Dont call the action for these subsequent calls
                // (a valid course code will never have a space in it)
                return;
            }
            if (newValue.length > 3 && !isRepeatingString(newValue)) {
                console.log('CR: fetch search_suggestions?type=learning_resource');
                actions.loadCourseReadingListsSuggestions(newValue);
                document.getElementById(`${elementId}-autocomplete`).focus();
            }
        },
        [actions, elementId],
    );

    const courseResourceSubjectDisplay = option => {
        return !!option && !!option.text
            ? `${option.text} (${unescapeString(option.rest.course_title)}, ${option.rest.period})`
            : '';
    };

    const handleSelectionOfCourseInDropdown = option => {
        console.log('handleSelectionOfCourseInDropdown: option = ', option);
        return !!option.text && searchKeyword.toUpperCase().startsWith(option.text.toUpperCase());
    };

    const handleChange = (event, option) => {
        console.log('handleChange: searchKeyword = ', searchKeyword.toUpperCase(), '; option = ', option);
        if (!!option.text && option.text.toUpperCase().startsWith(searchKeyword.toUpperCase())) {
            console.log('handleChange: found');
            console.log('handleChange: newValue = ', option);
            console.log('handleSelectionOfCourseInDropdown: displayType = ', displayType);
            if (displayType === 'compact') {
                // user is on the homepage - will navigate to the Course Resources page
                navigateToCourseResourcePage(option, searchKeyword);
            } else {
                // user is on the full view, on the Course Resource page (tab will load)
                loadCourseAndSelectTab(extractSubjectCodeFromName(option.text), suggestions);
            }

            document.getElementById(`${elementId}-autocomplete`).value = '';

            // we dont want the previous list to pop up if they search again
            actions.clearPrimoSuggestions();
        }
    };

    // function handleClose(reason, event) {
    //     console.log('close reason = ', reason, ': event =  ', event);
    //     // setDialogValue({
    //     //     title: '',
    //     //     year: '',
    //     // });
    //
    //     // toggleOpen(false);
    // }

    return (
        <form onSubmit={handleSubmit}>
            <Grid container spacing={1} className={classes.searchPanel} alignItems={'flex-end'}>
                <Grid item xs={12} sm>
                    <Autocomplete
                        // debug
                        autoSelect
                        data-testid={`${elementId}-autocomplete`}
                        blurOnSelect="mouse"
                        clearOnEscape
                        // clearOnBlur
                        id={`${elementId}-autocomplete`}
                        getOptionSelected={(option, value) => {
                            return handleSelectionOfCourseInDropdown(option, value);
                        }}
                        options={(!!suggestions && suggestions) || []}
                        getOptionLabel={option => courseResourceSubjectDisplay(option)}
                        onChange={(event, newValue) => {
                            handleChange(event, newValue);
                        }}
                        // onClose={(event, reason) => handleClose(reason, event)}
                        onInputChange={handleTypedKeywordChange}
                        noOptionsText={locale.noOptionsText}
                        renderInput={params => {
                            return (
                                <TextField
                                    {...params}
                                    placeholder={locale.placeholder}
                                    error={!!suggestionsError}
                                    InputProps={{
                                        ...params.InputProps,
                                        type: 'search',
                                        classes: {
                                            input: classes.selectInput,
                                        },
                                    }}
                                    inputProps={{
                                        ...params.inputProps,
                                        'aria-label': `${locale.placeholder}`,
                                        'data-testid': `${elementId}-autocomplete-input`,
                                    }}
                                />
                            );
                        }}
                    />
                </Grid>
                {suggestionsLoading && (
                    <Grid
                        item
                        xs={'auto'}
                        style={{ width: 80, marginLeft: -100, marginRight: 20, marginBottom: 6, opacity: 0.3 }}
                    >
                        <CircularProgress color="primary" size={20} id="loading-suggestions" />
                    </Grid>
                )}
            </Grid>
            <Grid container spacing={2} className={classes.searchPanel} data-testid={`${elementId}-links`}>
                {!!suggestionsError ? (
                    <Grid item xs={12} sm={12} md style={{ color: 'red' }}>
                        <span>{locale.unavailableText}</span>
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
    suggestions: PropTypes.any,
    suggestionsLoading: PropTypes.bool,
    suggestionsError: PropTypes.string,
    actions: PropTypes.any,
};

CourseResourceSearch.defaultProps = {
    displayType: 'all',
};

export default CourseResourceSearch;
