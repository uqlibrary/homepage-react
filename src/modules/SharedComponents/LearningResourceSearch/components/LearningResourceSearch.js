import React, { useRef, useState } from 'react';
import { PropTypes } from 'prop-types';

import { isRepeatingString, unescapeString } from 'helpers/general';

import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';
import TextField from '@material-ui/core/TextField';
import { throttle } from 'throttle-debounce';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { extractSubjectCodeFromName } from 'modules/Pages/LearningResources/learningResourcesHelpers';
import { default as locale } from 'modules/Pages/LearningResources/learningResources.locale';

const useStyles = makeStyles(
    () => ({
        searchPanel: {
            paddingTop: 12,
            paddingRight: 20,
            paddingBottom: 0,
            paddingLeft: 20,
        },
        searchPanelInfo: {
            color: 'red',
            paddingLeft: '2em',
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
        searchTitle: {
            marginBlockStart: '0.5rem',
            marginBlockEnd: '0.5rem',
            marginLeft: '1rem',
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
    const classes = useStyles();

    const [searchKeyword, setSearchKeyword] = useState('');
    const [noOptionsText, noOptionsTextSetter] = useState(locale.search.noOptionsText);

    const throttledReadingListLoadSuggestions = useRef(
        throttle(3100, newValue => {
            actions.loadCourseReadingListsSuggestions(newValue);
        }),
    );

    const handleTypedKeywordChange = React.useCallback(
        (event, typedText) => {
            setSearchKeyword(typedText);
            /* istanbul ignore else */
            if (typedText.length <= 3) {
                noOptionsTextSetter(locale.search.noOptionsText);
                actions.clearLearningResourceSuggestions();
            } else if (typedText !== '' && !isRepeatingString(typedText)) {
                // on the first pass we only get what they type;
                // on the second pass we get the full description string
                throttledReadingListLoadSuggestions.current(typedText.replace(' ', ''));
            }
        },
        [actions],
    );

    const handleSelectionOfCourseInDropdown = (event, option) => {
        /* istanbul ignore else */
        if (!!option && !!option.courseCode) {
            // we dont want the previous list to pop up if they search again
            actions.clearLearningResourceSuggestions();

            if (displayType === 'compact') {
                // user is on the homepage - will navigate to the Learning Resources page
                navigateToLearningResourcePage(option);
            } else {
                // user is on the Learning Resource page - tab will load
                loadCourseAndSelectTab(extractSubjectCodeFromName(option.courseCode), CRsuggestions);
            }

            document.getElementById(`${elementId}-autocomplete`).value = '';

            // clear the input after they select so they can re-search in a clean field
            setSearchKeyword('');
        }
    };

    function getOptions() {
        return (
            (!!CRsuggestions &&
                CRsuggestions.filter(option => option.courseCode !== searchKeyword).map(option =>
                    unescapeString(option.displayname),
                )) ||
            []
        );
    }

    // we group them all together to place a header at the top of the search results
    const renderGroup = params => [
        <h3 className={classes.searchTitle} key={params.key}>
            {locale.search.autocompleteResultsTitle}
        </h3>,
        params.children,
    ];

    return (
        <form>
            <Grid container spacing={1} className={classes.searchPanel} alignItems={'flex-end'}>
                <Grid item xs={12} sm>
                    <Autocomplete
                        data-testid={`${elementId}-autocomplete`}
                        blurOnSelect="mouse"
                        id={`${elementId}-autocomplete`}
                        options={getOptions()}
                        onChange={(event, value) => {
                            const fullOption = CRsuggestions.filter(lr => lr.displayname === value).pop();
                            handleSelectionOfCourseInDropdown(event, fullOption);
                        }}
                        onInputChange={handleTypedKeywordChange}
                        noOptionsText={noOptionsText}
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
                        disableClearable
                        openOnFocus
                        value={searchKeyword}
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
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
            {!!CRsuggestionsError && (
                /* istanbul ignore next */
                <Grid container spacing={2} className={classes.searchPanel} data-testid={`${elementId}-links`}>
                    <Grid item xs={12} sm={12} md className={classes.searchPanelInfo}>
                        <span>Autocomplete suggestions unavailable</span>
                    </Grid>
                </Grid>
            )}
            {searchKeyword !== '' &&
                CRsuggestionsError === null &&
                CRsuggestionsLoading === false &&
                Array.isArray(CRsuggestions) &&
                CRsuggestions.length === 0 && (
                    /* istanbul ignore next */
                    <Grid container spacing={2} className={classes.searchPanel} data-testid={`${elementId}-noresults`}>
                        <span data-testid="noCoursesFound" className={classes.searchPanelInfo}>
                            {locale.search.noResultsText}
                        </span>
                    </Grid>
                )}
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
