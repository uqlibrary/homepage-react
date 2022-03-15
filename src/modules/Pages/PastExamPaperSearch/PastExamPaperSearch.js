import React from 'react';
import PropTypes from 'prop-types';

// import { throttle } from 'throttle-debounce';
import { useTitle } from 'hooks';

import { Grid, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import locale from './pastExamPaperSearch.locale';
import { isRepeatingString } from 'helpers/general';

const useStyles = makeStyles(
    () => ({
        searchPanel: {
            paddingTop: 12,
            paddingRight: 20,
            paddingBottom: 0,
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
export const PastExamPaperSearch = ({
    actions,
    examSuggestionListError,
    examSuggestionList,
    examSuggestionListLoading,
}) => {
    console.log('PastExamPaperSearch: examSuggestionList = ', examSuggestionList);
    const classes = useStyles();
    useTitle(locale.HTMLTitle);

    // const throttledReadingListLoadSuggestions = useRef(
    //     throttle(1000, newValue => {
    //         actions.loadExamSuggestions(newValue);
    //     }),
    // );

    const handleTypedKeywordChange = React.useCallback(
        (event, typedText) => {
            // setSearchKeyword(typedText);
            /* istanbul ignore else */
            if (typedText.length <= 1) {
                actions.clearExamSuggestions();
            } else if (typedText !== '' && !isRepeatingString(typedText)) {
                // do we need to throttle?
                // throttledReadingListLoadSuggestions.current(typedText.replace(' ', ''));
                // ignore the space if they type eg "FREN 1101"
                actions.loadExamSuggestions(typedText.replace(' ', ''));
            }
        },
        [actions],
    );

    // eslint-disable-next-line react/prop-types
    const OptionTemplate = ({ option: { name: name, course_title: courseTitle } }) => (
        <Grid container className="autocompleteClass">
            <Grid item xs={12}>
                <Typography variant="body1" color="textPrimary">
                    {name}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="body2" color="textSecondary">
                    {courseTitle}
                </Typography>
            </Grid>
        </Grid>
    );

    return (
        <StandardPage>
            <Grid container>
                <Grid item xs={12}>
                    <StandardCard title={locale.pageTitle}>
                        <form>
                            <Grid container className={classes.searchPanel} alignItems={'flex-end'}>
                                <Grid item xs={12} sm>
                                    <Autocomplete
                                        blurOnSelect="mouse"
                                        onInputChange={handleTypedKeywordChange}
                                        options={examSuggestionList || []}
                                        noOptionsText="Enter at least 2 characters to see relevant courses"
                                        renderInput={params => (
                                            <TextField
                                                {...params}
                                                label={locale.placeholder}
                                                inputProps={{
                                                    ...params.inputProps,
                                                    'data-testid': 'past-exam-paper-search-autocomplete-input',
                                                    'aria-label': 'search for past exam papers by course code',
                                                }}
                                            />
                                        )}
                                        renderOption={option => <OptionTemplate option={option} />}
                                        getOptionLabel={item =>
                                            (!!item && !!item.name && String(`${item.name} (${item.course_title})`)) ||
                                            ''
                                        }
                                    />
                                </Grid>
                                <div data-testid={'past-exam-paper-search-results'}>
                                    {examSuggestionListLoading && (
                                        <Grid
                                            item
                                            xs={'auto'}
                                            style={{
                                                width: 80,
                                                marginLeft: -100,
                                                marginRight: 20,
                                                marginBottom: 6,
                                                opacity: 0.3,
                                            }}
                                        >
                                            <CircularProgress color="primary" size={20} id="loading-suggestions" />
                                        </Grid>
                                    )}
                                </div>
                            </Grid>
                            {!!examSuggestionListError && (
                                <Grid
                                    container
                                    spacing={2}
                                    className={classes.searchPanel}
                                    data-testid={'past-exam-paper-error'}
                                >
                                    <Grid item xs={12} sm={12} md className={classes.searchPanelInfo}>
                                        <span>
                                            Autocomplete suggestions currently unavailable - please try again later
                                        </span>
                                    </Grid>
                                </Grid>
                            )}
                            {examSuggestionListError === null &&
                                examSuggestionListLoading === false &&
                                Array.isArray(examSuggestionList) &&
                                examSuggestionList.length === 0 && (
                                    <Grid
                                        container
                                        spacing={2}
                                        className={classes.searchPanel}
                                        data-testid={'past-exam-paper-search-noresults'}
                                    >
                                        <span className={classes.searchPanelInfo}>{locale.search.noResultsText}</span>
                                    </Grid>
                                )}
                        </form>
                        <p style={{ marginTop: '4em', lineHeight: 1.5 }}>
                            To search for past papers, enter up to 9 characters, so for example, BIOL3 will bring up all
                            3rd year biological sciences courses, BIOL2001 will bring up that course only
                        </p>
                    </StandardCard>
                </Grid>
            </Grid>
        </StandardPage>
    );
};

PastExamPaperSearch.propTypes = {
    actions: PropTypes.any,
    examSuggestionListError: PropTypes.any,
    examSuggestionList: PropTypes.array,
    examSuggestionListLoading: PropTypes.bool,
};

export default PastExamPaperSearch;
