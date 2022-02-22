import React, { useState, useRef, useEffect } from 'react';
import { PropTypes } from 'prop-types';

import { isRepeatingString, unescapeString } from 'helpers/general';

import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import { makeStyles } from '@material-ui/styles';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import { throttle } from 'throttle-debounce';
import SearchIcon from '@material-ui/icons/Search';
import Autocomplete from '@material-ui/lab/Autocomplete';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { extractSubjectCodeFromName } from 'modules/Pages/LearningResources/learningResourcesHelpers';

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

// navigateToLearningResourcePage={navigateToLearningResourcePage}
export const LearningResourceSearch = ({
    displayType, // default: 'full'; values: 'full', 'compact'
    // 'full' for learning resources page search
    // 'compact' for Learning Resource search in homepage panel
    CRsuggestions,
    CRsuggestionsLoading,
    CRsuggestionsError,
    actions,
    navigateToLearningResourcePage,
    loadCourseAndSelectTab,
}) => {
    const classes = useStyles();
    const [searchKeyword, setSearchKeyword] = useState('');
    const isDesktop = useMediaQuery('(min-width:600px)');
    useEffect(() => {
        if (isDesktop) {
            document.getElementById('primo-search-autocomplete').focus();
        }
    }, [isDesktop]);

    const focusOnSearchInput = () => {
        setTimeout(() => {
            const searchInput = document.getElementById('primo-search-autocomplete');
            searchInput.focus();
        }, 200);
    };

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

    const throttledReadingListLoadSuggestions = useRef(
        throttle(3100, newValue => actions.loadCourseReadingListsSuggestions(newValue)),
    );

    const getSuggestions = React.useCallback(
        (event, typedText) => {
            setSearchKeyword(typedText);
            if (typedText.length > 3 && !isRepeatingString(typedText)) {
                // on the first pass we only get what they type;
                // on the second pass we get the full description string
                const coursecode = charactersBefore(typedText, ' ');
                throttledReadingListLoadSuggestions.current(coursecode);

                focusOnSearchInput();
            } else {
                actions.clearLearningResourceSuggestions();
            }
        },
        [actions],
    );
    return (
        <StandardCard
            noPadding
            noHeader
            standardCardId="primo-search"
            className={displayType === 'full' ? classes.fullForm : ''}
        >
            <form id="primo-search-form" onSubmit={handleSearchButton}>
                <Grid container spacing={1} className={classes.searchPanel} alignItems={'flex-end'}>
                    <Grid item xs={12} sm>
                        <Autocomplete
                            value={searchKeyword}
                            freeSolo
                            id="primo-search-autocomplete"
                            data-testid="primo-search-autocomplete"
                            disableClearable
                            openOnFocus
                            clearOnEscape
                            options={
                                (!!CRsuggestions &&
                                    CRsuggestions.filter(option => option.text !== searchKeyword).map(option =>
                                        unescapeString(option.text),
                                    )) ||
                                []
                            }
                            onInputChange={getSuggestions}
                            ListboxProps={{
                                'aria-labelledby': 'primo-search-select-label',
                                id: 'primo-search-autocomplete-listbox',
                                'data-testid': 'primo-search-autocomplete-listbox',
                                'aria-label': 'Suggestion list',
                            }}
                            onChange={() => {
                                setTimeout(() => {
                                    document.getElementById('primo-search-submit').click();
                                }, 300);
                            }}
                            renderInput={params => {
                                return (
                                    <TextField
                                        {...params}
                                        placeholder="Enter a course code"
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
                    {CRsuggestionsLoading && (
                        <Grid
                            item
                            xs={'auto'}
                            style={{ width: 80, marginLeft: -100, marginRight: 20, marginBottom: 6, opacity: 0.3 }}
                        >
                            <CircularProgress color="primary" size={20} id="loading-suggestions" />
                        </Grid>
                    )}
                </Grid>
                <Grid container spacing={2} className={classes.searchPanel} data-testid={'primo-search-links'}>
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
        </StandardCard>
    );
};

LearningResourceSearch.propTypes = {
    displayType: PropTypes.string,
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
