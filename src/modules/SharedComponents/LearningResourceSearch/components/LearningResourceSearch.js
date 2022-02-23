import React, { useState, useRef, useEffect } from 'react';
import { PropTypes } from 'prop-types';

import { isRepeatingString, unescapeString } from 'helpers/general';

import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import { makeStyles } from '@material-ui/styles';
import TextField from '@material-ui/core/TextField';
import { throttle } from 'throttle-debounce';
import Autocomplete from '@material-ui/lab/Autocomplete';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { extractSubjectCodeFromName } from 'modules/Pages/LearningResources/learningResourcesHelpers';

const useStyles = makeStyles(
    () => ({
        searchPanel: {
            paddingTop: 12,
            paddingRight: 20,
            paddingBottom: 0,
            paddingLeft: 20,
        },
        selectInput: {
            fontWeight: 300,
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
    }),
    { withTheme: true },
);

export const LearningResourceSearch = ({
    actions,
    displayType, // default: 'full'; values: 'full', 'compact'
    // 'full' for learning resources page search
    // 'compact' for Learning Resource search in homepage panel
    elementId,
    loadCourseAndSelectTab,
    navigateToLearningResourcePage,
    CRsuggestions,
    CRsuggestionsLoading,
    CRsuggestionsError,
}) => {
    console.log('LearningResourceSearch:', elementId, ' CRsuggestions = ', CRsuggestions);
    const classes = useStyles();
    const [searchKeyword, setSearchKeyword] = useState('');
    const isDesktop = useMediaQuery('(min-width:600px)');
    useEffect(() => {
        if (isDesktop) {
            document.getElementById(`${elementId}-autocomplete`).focus();
        }
    }, [elementId, isDesktop]);

    /**
     * get the characters in the string before the specified character
     * eg `ACCT7101 ( Accounting | St Lucia , semester 2 2020 )` returns 'ACCT7101'
     * @param string
     * @param separator
     * @returns {string|*}
     */
    const charactersBefore = (string, separator) => {
        if (!!string && string.indexOf(separator) === -1) {
            return string.trim();
        }
        return string.substr(0, string.indexOf(separator));
    };

    const throttledReadingListLoadSuggestions = useRef(
        throttle(3100, newValue => {
            console.log('throttledReadingListLoadSuggestions', newValue, displayType, searchKeyword);
            // if (displayType === 'full' && searchKeyword === newValue) {
            //     // if we are on the results page and the current search term is the same as what we have, dont search
            //     return;
            // }
            actions.loadCourseReadingListsSuggestions(newValue);
        }),
    );

    const handleTypedKeywordChange = React.useCallback(
        (event, typedText) => {
            if (typedText.includes(' ')) {
                // skip a space in the input - api doesnt really handle multiple words
                return;
            }

            console.log(
                'handleTypedKeywordChange',
                displayType,
                '; typedText = ',
                typedText,
                '; searchKeyword = ',
                searchKeyword,
                'CRsuggestions',
                CRsuggestions,
            );
            // if (displayType === 'full' && typedText !== '' && CRsuggestions === null) {
            //     return;
            // }
            setSearchKeyword(typedText);
            if (typedText.length > 3 && !isRepeatingString(typedText)) {
                // on the first pass we only get what they type;
                // on the second pass we get the full description string
                const coursecode = charactersBefore(typedText, ' ');
                console.log(
                    displayType,
                    '; typedText = ',
                    typedText,
                    '; CRsuggestions = ',
                    !!CRsuggestions ? CRsuggestions.length : 0,
                    'about to throttledReadingListLoadSuggestions',
                    typedText,
                    displayType,
                    searchKeyword,
                );
                throttledReadingListLoadSuggestions.current(coursecode);
                console.log('here ', typedText);

                // focusOnSearchInput();
            } else {
                actions.clearLearningResourceSuggestions();
            }
        },
        // check this
        [actions],
    );

    // const focusOnSearchInput = () => {
    //     console.log('elementId = ', elementId);
    //     console.log('elementId2  = ', `${elementId}-autocomplete`);
    //     setTimeout(() => {
    //         const searchInput = document.getElementById(`${elementId}-autocomplete`);
    //         searchInput.focus();
    //     }, 200);
    // };

    const handleSelectionOfCourseInDropdown = (event, option) => {
        console.log('handleSelectionOfCourseInDropdown ', option);
        /* istanbul ignore else */
        if (!(!!option && !!option.courseCode)) {
            // dev
            console.log('handleSelectionOfCourseInDropdown missing option.courseCode');
        }
        if (!!option && !!option.courseCode) {
            console.log('handleSelectionOfCourseInDropdown about to clear');
            // we dont want the previous list to pop up if they search again
            actions.clearLearningResourceSuggestions();
            console.log('handleSelectionOfCourseInDropdown after clear');

            if (displayType === 'compact') {
                console.log('handleSelectionOfCourseInDropdown compact');

                // user is on the homepage - will navigate to the Learning Resources page
                navigateToLearningResourcePage(option);
            } else {
                // user is on the Learning Resource page - tab will load
                loadCourseAndSelectTab(extractSubjectCodeFromName(option.courseCode), CRsuggestions);
            }

            document.getElementById(`${elementId}-autocomplete`).value = '';
            console.log('input field should now be empty');

            // clear the input after they select so they can re-search in a clean field
            setSearchKeyword('');
        }
    };

    /*
     * can we remove this?!?
     */
    const handleSearchButton = event => {
        if (!!event) {
            event.preventDefault();
        }
        console.log(searchKeyword);
        if (!!searchKeyword) {
            // because the display text in the dropdown has the descriptors in it, that text reaches here.
            // trim down to the course code only
            const keyword = charactersBefore(searchKeyword, ' ');

            if (displayType === 'compact') {
                // user is on the homepage - will navigate to the Learning Resources page
                // https://www.library.uq.edu.au/learning-resources?coursecode=FREN2020&campus=St%20Lucia&semester=7160%20Semester%202%202021
                navigateToLearningResourcePage(keyword);
            } else {
                // user is on the Learning Resource page - tab will load
                loadCourseAndSelectTab(extractSubjectCodeFromName(keyword), CRsuggestions);
            }
        }
    };
    function getOptions() {
        console.log('getOptions CRsuggestions=', CRsuggestions);
        const newVar =
            !!CRsuggestions &&
            CRsuggestions.filter(option => option.courseCode !== searchKeyword).map(option =>
                unescapeString(option.displayname),
            );
        // console.log('getOptions newVar=', newVar);
        return newVar || [];
    }

    // NEED TO ADD HEADER YET
    // // we group them all together to place a header at the top of the search results
    // const renderGroup = params => [
    //     <h3 className={classes.searchTitle} key={params.key}>
    //         {locale.search.autocompleteResultsTitle}
    //     </h3>,
    //     params.children,
    // ];

    return (
        <form id="primo-search-form" onSubmit={handleSearchButton}>
            <Grid container spacing={1} className={classes.searchPanel} alignItems={'flex-end'}>
                <Grid item xs={12} sm>
                    <Autocomplete
                        value={searchKeyword}
                        freeSolo
                        id={`${elementId}-autocomplete`}
                        data-testid={`${elementId}-autocomplete`}
                        disableClearable
                        openOnFocus
                        clearOnEscape
                        // options={(!!CRsuggestions && CRsuggestions) || []}
                        // getOptionLabel={option => learningResourceSubjectDisplay(option)}
                        options={getOptions()}
                        // renderGroup={renderGroup}
                        onInputChange={handleTypedKeywordChange}
                        ListboxProps={{
                            'aria-labelledby': 'primo-search-select-label',
                            id: 'primo-search-autocomplete-listbox',
                            'data-testid': 'primo-search-autocomplete-listbox',
                            'aria-label': 'Suggestion list',
                        }}
                        onChange={(event, value) => {
                            // setTimeout(() => {
                            console.log('change: ', value, event);
                            const fullOption = CRsuggestions.filter(lr => lr.displayname === value).pop();
                            console.log('clicked = ', fullOption);
                            // document.getElementById('primo-search-submit').click();
                            handleSelectionOfCourseInDropdown(event, fullOption);
                            // }, 300);
                        }}
                        renderInput={params => {
                            return (
                                <TextField
                                    {...params}
                                    placeholder="Search by course code or keyword"
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
                                        'aria-label': 'Enter your search terms',
                                        'data-testid': 'primo-search-autocomplete-input',
                                    }}
                                />
                            );
                        }}
                    />
                </Grid>
                <div data-testid={`${elementId}-results`}>
                    {CRsuggestionsLoading && (
                        <Grid
                            item
                            xs={'auto'}
                            style={{ width: 80, marginLeft: -100, marginRight: 20, marginBottom: 6, opacity: 0.3 }}
                        >
                            <CircularProgress color="primary" size={20} id="loading-suggestions" />
                        </Grid>
                    )}
                </div>
            </Grid>
            <Grid container spacing={2} className={classes.searchPanel} data-testid={`${elementId}-links`}>
                {!!CRsuggestionsError ? (
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
    );
};

LearningResourceSearch.propTypes = {
    displayType: PropTypes.string,
    elementId: PropTypes.string,
    option: PropTypes.any,
    CRsuggestions: PropTypes.any,
    CRsuggestionsLoading: PropTypes.bool,
    CRsuggestionsError: PropTypes.string,
    actions: PropTypes.any,
    loadCourseAndSelectTab: PropTypes.any,
    navigateToLearningResourcePage: PropTypes.any,
};

LearningResourceSearch.defaultProps = {
    displayType: 'all',
};

export default LearningResourceSearch;
