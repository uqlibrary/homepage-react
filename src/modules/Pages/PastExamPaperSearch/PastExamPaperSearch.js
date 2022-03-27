import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

// import { throttle } from 'throttle-debounce';
import { useTitle } from 'hooks';

import { Grid, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import locale from './pastExamPaperSearch.locale';
import { isRepeatingString } from 'helpers/general';
import { noResultsFoundBlock } from './pastExamPapers.helpers';

const useStyles = makeStyles(
    () => ({
        searchPanel: {
            paddingTop: 12,
            paddingRight: 20,
            paddingBottom: 0,
        },
        searchPanelInfo: { color: 'red', paddingLeft: '2em' },
        loading: {
            width: 80,
            marginLeft: -100,
            marginRight: 20,
            marginBottom: 6,
            opacity: 0.3,
        },
        aboutLink: {
            marginTop: '4em',
            lineHeight: 1.5,
            '& a': {
                textDecoration: 'underline',
            },
        },
        aboutBlock: {
            paddingBottom: '1em',
            '& strong': {
                letterSpacing: '0.7px',
            },
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
    console.log('examSuggestionList = ', examSuggestionList);
    const classes = useStyles();
    useTitle('Search for a past exam paper - Library - The University of Queensland');
    const filter = createFilterOptions();

    const noOptionsTextDefault = 'Type more characters to search';
    const [noOptionsText, setNoOptionsText] = React.useState(noOptionsTextDefault);
    const [isOpen, setOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');

    useEffect(() => {
        if (!!examSuggestionListError) {
            setOpen(false);
        }
    }, [examSuggestionListError]);

    useEffect(() => {
        const noResultsFoundPanel = () => {
            return (
                <Grid container>
                    <Grid item xs={12}>
                        {noResultsFoundBlock(searchTerm)}
                    </Grid>
                </Grid>
            );
        };
        if (!examSuggestionListLoading && !!examSuggestionList && examSuggestionList.length === 0) {
            setNoOptionsText(noResultsFoundPanel());
        }
    }, [examSuggestionList, examSuggestionListLoading, searchTerm]);

    // const throttledExamSuggestionsLoad = useRef(
    //     throttle(1000, newValue => {
    //         actions.loadExamSuggestions(newValue);
    //     }),
    // );

    const handleTypedKeywordChange = React.useCallback(
        (event, typedText) => {
            setSearchTerm(typedText);
            if (typedText.length <= 1) {
                actions.clearExamSuggestions();
                setOpen(true);
                setNoOptionsText(noOptionsTextDefault);
            } else if (typedText !== '' && !isRepeatingString(typedText) && typedText.length < 10) {
                // do we need to throttle?
                // throttledExamSuggestionsLoad.current(typedText.replace(' ', ''));
                // ignore the space if they type eg "FREN 1101"
                actions.loadExamSuggestions(typedText.replace(' ', ''));
                setOpen(true);
            } else {
                // repeating string: book on the keyboard? dont send to api
                setOpen(false);
            }
        },
        [actions],
    );

    // eslint-disable-next-line react/prop-types
    const FormattedSuggestion = ({ option: { name: name, course_title: courseTitle } }) => (
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

    const addKeywordAsOption = (options, params) => {
        const filtered = filter(options, params);

        if (params.inputValue !== '') {
            filtered.unshift({
                name: params.inputValue.toUpperCase(),
                // url: `/exams/course/${params.inputValue.toUpperCase()}`,
                course_title: `View all exams for ${params.inputValue.toUpperCase()}`,
            });
        }

        return filtered;
    };

    return (
        <StandardPage>
            <StandardCard title="Search for a past exam paper">
                <Grid container alignItems={'flex-end'}>
                    <Grid item xs={12} sm className={classes.aboutBlock}>
                        <p>
                            Enter a full or partial course code (between 2 and 9 characters) to find available past exam
                            papers. For example:
                        </p>
                        <ul>
                            <li>
                                <strong>BIOL2001</strong> displays the exam papers for the course,
                            </li>
                            <li>
                                <strong>BIOL3</strong> displays exam papers for third year Biological Sciences course,
                            </li>
                            <li>
                                <strong>BIOL</strong> displays all available Biological Sciences exam papers.
                            </li>
                        </ul>
                    </Grid>
                </Grid>
                <form>
                    <Autocomplete
                        open={isOpen}
                        blurOnSelect="mouse"
                        filterOptions={addKeywordAsOption}
                        onInputChange={handleTypedKeywordChange}
                        options={examSuggestionList || []}
                        noOptionsText={noOptionsText}
                        renderInput={params => (
                            <TextField
                                {...params}
                                label={locale.placeholder}
                                inputProps={{
                                    ...params.inputProps,
                                    'data-testid': 'past-exam-paper-search-autocomplete-input',
                                    'aria-label': locale.placeholder,
                                    autoFocus: true,
                                }}
                            />
                        )}
                        renderOption={option => <FormattedSuggestion option={option} />}
                        getOptionLabel={item =>
                            (!!item && !!item.name && String(`${item.name} (${item.course_title})`)) || ''
                        }
                    />
                </form>
                {examSuggestionListLoading && (
                    <Grid container>
                        <Grid item xs={'auto'} className={classes.loading}>
                            <CircularProgress color="primary" size={20} id="loading-suggestions" />
                        </Grid>
                    </Grid>
                )}
                {!!examSuggestionListError && (
                    <Grid container spacing={2} className={classes.searchPanel} data-testid={'past-exam-paper-error'}>
                        <Grid item xs={12} sm={12} md className={classes.searchPanelInfo}>
                            <span>Autocomplete suggestions currently unavailable - please try again later</span>
                        </Grid>
                    </Grid>
                )}
                <Grid container>
                    <Grid item xs={'auto'}>
                        <p className={classes.aboutLink}>
                            <a href="https://web.library.uq.edu.au/library-services/students/past-exam-papers">
                                Read more about searching for past exam papers
                            </a>
                        </p>
                    </Grid>
                </Grid>
            </StandardCard>
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
