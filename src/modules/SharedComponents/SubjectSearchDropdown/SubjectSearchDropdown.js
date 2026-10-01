import React, { useRef, useState } from 'react';
import { PropTypes } from 'prop-types';

import { throttle } from 'throttle-debounce';

import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';

import { isRepeatingString, unescapeString } from 'helpers/general';

import { extractSubjectCodeFromName } from 'modules/Pages/LearningResources/shared/learningResourcesHelpers';
import { default as locale } from 'modules/Pages/LearningResources/shared/learningResources.locale';
import { styled } from '@mui/material/styles';

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
    [`& .${autocompleteClasses.popupIndicator}`]: {
        transform: 'none',
    },
    '& .Mui-focused': {
        border: theme.palette.designSystem.border,
    },
}));
const StyledH2Typography = styled(Typography)(({ theme }) => ({
    color: theme.palette.designSystem.headingColor,
    marginLeft: '16px',
}));
const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiAutocomplete-inputRoot': {
        border: theme.palette.designSystem.border,
    },
    '& .MuiInputBase-root': {
        '&:focus-within': {
            borderColor: '#2377CB',
        },
    },
    '& .MuiInput-underline:before': { borderBottomWidth: 0 },
    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
        borderBottomWidth: 0,
    },
    '& .MuiInput-underline:after': { borderBottomWidth: 0 },
}));
const StyledSearchPanel = styled(Grid)(() => ({
    marginTop: '24px',
    padding: '0 24px 24px 24px',
    '& .searchPanelInfo': {
        color: 'red',
    },
    '& .selectInput': {
        fontWeight: 400,
        textOverflow: 'ellipsis !important',
        overflow: 'hidden !important',
        whiteSpace: 'nowrap !important',
        height: '45px',
        padding: '0 0 0 16px !important',
        '&::placeholder': {
            textOverflow: 'ellipsis !important',
            overflow: 'hidden !important',
            whiteSpace: 'nowrap !important',
        },
    },
    '& button[title="Open"]': {
        paddingRight: '16px',
        // borderTopColor: 'black',
        // borderRightColor: 'black',
        // borderBottomColor: 'black',
    },
    '& .MuiAutocomplete-inputRoot': {
        borderColor: 'black !important',
    },
}));
const SearchLabelGridItem = styled(Grid)(({ theme }) => ({
    paddingTop: '0 !important',
    '& label': {
        color: theme.palette.designSystem.bodyCopy,
        fontSize: '16px',
        fontStyle: 'normal',
        fontWeight: 400,
        lineHeight: '160%', // 25.6px
        letterSpacing: '0.16px',
    },
}));

export const SubjectSearchDropdown = ({
    actions,
    displayType,
    // default: 'full'; values: 'full', 'compact'
    // 'full' for learning resources page search
    // 'compact' for Learning Resource search in homepage panel
    elementId,
    loadCourseAndSelectTab,
    navigateToLearningResourcePage,
    CRsuggestions,
    CRsuggestionsLoading,
    CRsuggestionsError,
}) => {
    const [searchKeyword, setSearchKeyword] = useState('');
    const [noOptionsText, noOptionsTextSetter] = useState(locale.search.noOptionsText);

    const throttledReadingListLoadSuggestions = useRef(
        throttle(1000, newValue => {
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
            // we don't want the previous list to pop up if they search again
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
        // make special characters display nicely
        // this is where the subjects in the Autocomplete dropdown is displayed
        return (!!CRsuggestions && CRsuggestions.map(option => unescapeString(option.displayname))) || [];
    }

    // we group them all together to place a header at the top of the search results
    const renderGroup = params => [
        <StyledH2Typography component={'h2'} variant={'h6'} key={params.key}>
            {locale.search.autocompleteResultsTitle}
        </StyledH2Typography>,
        params.children,
    ];

    function dsSearchIcon() {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                aria-hidden="true"
                focusable="false"
            >
                <g id="Search">
                    <path
                        d="M7.5 14C11.0899 14 14 11.0899 14 7.5C14 3.91015 11.0899 1 7.5 1C3.91015 1 1 3.91015 1 7.5C1 11.0899 3.91015 14 7.5 14Z"
                        stroke="#51247A"
                        strokeWidth="1.5"
                    />
                    <path
                        d="M12.5 12.5L17 17"
                        stroke="#51247A"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </g>
            </svg>
        );
    }

    return (
        <form>
            <StyledSearchPanel container spacing={1} alignItems={'flex-end'}>
                <SearchLabelGridItem item xs={12}>
                    <label
                        htmlFor="homepage-learningresource-autocomplete"
                        id="homepage-learningresource-autocomplete-label"
                    >
                        {locale.search.placeholder}
                    </label>
                </SearchLabelGridItem>
                <Grid item xs={12} sm>
                    <StyledAutocomplete
                        filterOptions={options => {
                            return options;
                        }}
                        data-testid={`${elementId}-autocomplete`} // learningResourceId-autocomplete // full-learningresource-autocomplete
                        analyticsid-testid={`${elementId}-autocomplete`}
                        aria-controls={`${elementId}-autocomplete-listbox`}
                        blurOnSelect="mouse"
                        id={`${elementId}-autocomplete`}
                        options={getOptions()}
                        onChange={(event, value) => {
                            const fullOption = CRsuggestions.filter(lr => lr.displayname === value).pop();
                            handleSelectionOfCourseInDropdown(event, fullOption);
                        }}
                        onInputChange={handleTypedKeywordChange}
                        noOptionsText={noOptionsText}
                        popupIcon={dsSearchIcon()}
                        renderGroup={renderGroup}
                        groupBy={() => false}
                        renderInput={params => {
                            return (
                                <StyledTextField
                                    variant="standard"
                                    {...params}
                                    error={!!CRsuggestionsError}
                                    InputProps={{
                                        ...params.InputProps,
                                        type: 'search',
                                        classes: {
                                            input: 'selectInput',
                                        },
                                        'data-testid': 'learning-resource-search-input-field',
                                    }}
                                    inputProps={{
                                        ...params.inputProps,
                                        'data-testid': `${elementId}-autocomplete-input-wrapper`,
                                        'data-analyticsid': `${elementId}-autocomplete-input-wrapper`,
                                        'aria-label': 'search for a subject by course code or title',
                                    }}
                                    InputLabelProps={{
                                        shrink: false,
                                        sx: {
                                            paddingLeft: '2px',
                                            '&.Mui-focused': {
                                                color: 'grey',
                                                borderWidth: 0,
                                            },
                                            display: !!searchKeyword ? 'none' : 'block',
                                            marginTop: '2px',
                                        },
                                    }}
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
                            <CircularProgress
                                color="primary"
                                size={20}
                                id="loading-suggestions"
                                aria-label="Loading Learning resources"
                            />
                        </Grid>
                    )}
                </div>
            </StyledSearchPanel>
            {!!CRsuggestionsError && (
                /* istanbul ignore next */
                <StyledSearchPanel container spacing={2} className={'searchPanel'} data-testid={`${elementId}-links`}>
                    <Grid item xs={12} sm={12} md className={'searchPanelInfo'}>
                        <span>Autocomplete suggestions unavailable</span>
                    </Grid>
                </StyledSearchPanel>
            )}
            {searchKeyword !== '' &&
                CRsuggestionsError === null &&
                CRsuggestionsLoading === false &&
                Array.isArray(CRsuggestions) &&
                CRsuggestions.length === 0 && (
                    /* istanbul ignore next */
                    <StyledSearchPanel
                        container
                        spacing={2}
                        className={'searchPanel'}
                        data-testid={`${elementId}-noresults`}
                    >
                        <span data-testid="noCoursesFound" className={'searchPanelInfo'}>
                            {locale.search.noResultsText}
                        </span>
                    </StyledSearchPanel>
                )}
        </form>
    );
};

SubjectSearchDropdown.propTypes = {
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

export default SubjectSearchDropdown;
