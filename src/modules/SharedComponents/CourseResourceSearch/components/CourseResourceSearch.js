import React, { useState } from 'react';
import { useLocation } from 'react-router';

import { PropTypes } from 'prop-types';
import { VoiceToText } from './voiceToText';
import { isRepeatingString } from 'helpers/general';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { getUrlForCourseResourceSpecificTab } from 'modules/Index/components/HomePageCourseResources';

import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Hidden from '@material-ui/core/Hidden';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles(
    theme => ({
        searchPanel: {
            paddingTop: 12,
            paddingRight: 30,
            paddingBottom: 0,
            paddingLeft: 30,
        },
        selectInput: {
            fontSize: 24,
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
    // displayType, // default: 'all'; values: 'all', 'courseresources', 'homepagecourseresources'
    displayType, // default: 'full'; values: 'full', 'compact'
    // 'full' for course resources page search
    // 'compact' for course resource search in homepage panel
    elementId = 'primo-search',
    // locale,
    history,
    searchKeywordSelected,
    suggestions,
    suggestionsLoading,
    suggestionsError,
}) => {
    const classes = useStyles();
    const pageLocation = useLocation();

    const [searchKeyword, setSearchKeyword] = useState('');
    // const [selectedValue, setSelectedValue] = useState('');

    const handleClearSuggestions = () => {
        actions.clearPrimoSuggestions();
    };

    const handleSearchButton = event => {
        event.preventDefault();
        console.log('handleSearchButton');
        console.log('displayType = ', displayType);
        console.log('suggestions = ', suggestions);
        if (displayType === 'compact') {
            console.log('in compact courseresources');
            // console.log('selectedValue = ', selectedValue);
            const course = {
                classnumber: searchKeyword,
                campus: '???',
                semester: '???',
            };
            const url = getUrlForCourseResourceSpecificTab(course, pageLocation);
            console.log('would visit ', url);
            // history.push(url);
            console.log('history = ', history);
        } else if (displayType === 'courseresources') {
            console.log('in full');
            searchKeywordSelected(searchKeyword, suggestions);
        }
    };

    // this is a hack, but I couldnt get getOptionLabel and renderOption
    // working on Autocomplete to return just the course code :(
    // const extractCourseCodeFromBeginningOfDescription = courseDescription => {
    //     console.log('extractCourseCodeFromBeginningOfDescription: courseDescription = ', courseDescription);
    //     return courseDescription;
    //     // return courseDescription.trim().split(' ')[0];
    // };

    const handleSearchKeywordChange = React.useCallback(
        (event, newValue) => {
            console.log('handleSearchKeywordChange: ', newValue);
            // setSelectedValue(newValue);
            // const selectedValue = displayType.includes('courseresources')
            //     ? extractCourseCodeFromBeginningOfDescription(newValue)
            //     : newValue;
            // const selectedValue = newValue;

            setSearchKeyword(newValue);
            if (newValue.length > 3 && !isRepeatingString(newValue)) {
                actions.loadCourseReadingListsSuggestions(newValue);
                // document.getElementById(`${elementId}-autocomplete`).focus();
            }
        },
        [actions],
        // [actions, elementId],
        // [actions, displayType, elementId],
    );

    const courseResourceSubjectDisplay = option => {
        console.log('option = ', option);
        return !!option && !!option.text ? `${option.text} (${option.rest.course_title}, ${option.rest.period})` : '';
    };

    const optionSelected = (option, value) => {
        console.log('optionSelected');
        if (displayType === 'compact') {
            console.log('option = ', option);
            // console.log('; searchKeyword = ', searchKeyword);
            console.log('coursecode = ', option.text);
            console.log('campus = ', option.rest.campus);
            console.log('semester = ', option.rest.period);

            if (!!option.text && searchKeyword.toUpperCase().startsWith(option.text.toUpperCase())) {
                const course = {
                    classnumber: option.text,
                    campus: option.rest.campus,
                    semester: option.rest.period,
                };
                const url = getUrlForCourseResourceSpecificTab(course, pageLocation, false, true);
                // console.log('would visit ', url);
                history.push(url);
                // console.log('history = ', history);
            }
        } else {
            console.log('option = ', option);
            console.log('value = ', value);
            // console.log('; searchKeyword = ', searchKeyword);
            // console.log('coursecode = ', option.text);
            // console.log('campus = ', option.rest.campus);
            // console.log('semester = ', option.rest.period);
            searchKeywordSelected(searchKeyword, suggestions);
        }

        return !!option.text && searchKeyword.toUpperCase().startsWith(option.text.toUpperCase());
    };

    return (
        <StandardCard noPadding noHeader standardCardId={`${elementId}`}>
            <form onSubmit={handleSearchButton}>
                <Grid container spacing={1} className={classes.searchPanel} alignItems={'flex-end'}>
                    <Grid item xs={12} sm>
                        <Autocomplete
                            debug // #dev
                            // value={searchKeyword}
                            id={`${elementId}-autocomplete`}
                            // data-testid={`${elementId}-autocomplete`}
                            // disableClearable
                            // onChange={(event, value) => console.log(value)}
                            // openOnFocus
                            // clearOnEscape
                            getOptionSelected={(option, value) => {
                                return optionSelected(option, value);
                            }}
                            options={(!!suggestions && suggestions) || []}
                            // options={
                            //     (!!suggestions &&
                            //         suggestions
                            //             .filter(option => option.text !== searchKeyword)
                            //             .map(option => {
                            //                 return !!option.rest ? courseResourceSubjectDisplay(option)
                            //                 : option.text;
                            //             })) ||
                            //     []
                            // }
                            getOptionLabel={option => courseResourceSubjectDisplay(option)}
                            onInputChange={handleSearchKeywordChange}
                            // ListboxProps={{
                            //     'aria-labelledby': `${elementId}-select-label`,
                            //     id: `${elementId}-autocomplete-listbox`,
                            //     'data-testid': `${elementId}-autocomplete-listbox`,
                            //     'aria-label': 'Suggestion list',
                            // }}
                            renderInput={params => {
                                return (
                                    <TextField
                                        {...params}
                                        placeholder="Enter a course code"
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
                                            'aria-label': 'Enter your search terms',
                                            'data-testid': `${elementId}-autocomplete-input`,
                                        }}
                                    />
                                );
                            }}
                        />
                    </Grid>
                    <Grid item xs={'auto'} style={{ width: 90, marginLeft: -70, marginRight: -20, marginBottom: 6 }}>
                        <VoiceToText
                            sendHandler={handleSearchKeywordChange}
                            clearSuggestions={handleClearSuggestions}
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
                    <Grid item xs={12} md={'auto'}>
                        <Tooltip title={'Perform your search'}>
                            <Button
                                fullWidth
                                id={`${elementId}-submit`}
                                data-testid={`${elementId}-submit`}
                                size={'large'}
                                variant="contained"
                                color={'primary'}
                                onClick={handleSearchButton}
                                className={classes.searchButton}
                            >
                                <SearchIcon />
                            </Button>
                        </Tooltip>
                    </Grid>
                </Grid>
                <Grid container spacing={2} className={classes.searchPanel} data-testid={`${elementId}-links`}>
                    {!!suggestionsError ? (
                        <Grid item xs={12} sm={12} md style={{ color: 'red' }}>
                            <span>Autocomplete suggestions unavailable</span>
                        </Grid>
                    ) : (
                        <Hidden smDown>
                            <Grid item xs />
                        </Hidden>
                    )}
                </Grid>
            </form>
        </StandardCard>
    );
};

CourseResourceSearch.propTypes = {
    displayType: PropTypes.string,
    elementId: PropTypes.string,
    history: PropTypes.any,
    locale: PropTypes.any,
    option: PropTypes.any,
    searchKeywordSelected: PropTypes.any,
    suggestions: PropTypes.any,
    suggestionsLoading: PropTypes.bool,
    suggestionsError: PropTypes.string,
    actions: PropTypes.any,
};

CourseResourceSearch.defaultProps = {
    displayType: 'all',
    // locale: defaultLocale,
};

export default CourseResourceSearch;
