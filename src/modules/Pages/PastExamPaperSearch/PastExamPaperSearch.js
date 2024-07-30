import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { useTitle } from 'hooks';

import { Grid, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';

import locale from './pastExamPaperSearch.locale';
import { isRepeatingString } from 'helpers/general';
import { noResultsFoundBlock } from './pastExamPapers.helpers';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const StyledAboutLink = styled('p')(() => ({
    marginTop: '4em',
    lineHeight: 1.5,
    '& a': { textDecoration: 'underline' },
}));

const StyledAboutBlock = styled(Grid)(() => ({
    paddingBottom: '1em',
    '& strong': { letterSpacing: '0.7px' },
}));

const StyledSearchPanel = styled('div')(() => ({
    paddingTop: 12,
    paddingRight: 20,
    paddingBottom: 0,
    '& .searchPanelInfo': { color: 'red', paddingLeft: '2em' },
}));

export const PastExamPaperSearch = ({
    actions,
    examSuggestionListError,
    examSuggestionList,
    examSuggestionListLoading,
}) => {
    useTitle('Search for a past exam paper - Library - The University of Queensland');
    const filter = createFilterOptions();
    const MAX_LENGTH_COURSE_CODE = 9;
    const navigate = useNavigate();

    const [isOpen, setOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');

    const noOptionsTextTooShort = 'Type more characters to search';
    const [noOptionsText, setNoOptionsText] = React.useState(null);
    useEffect(() => {
        const noOptionsTextNoResultsFoundPanel = () => {
            return (
                <Grid container>
                    <Grid item xs={12}>
                        {noResultsFoundBlock(searchTerm)}
                    </Grid>
                </Grid>
            );
        };
        if (!examSuggestionListLoading && !examSuggestionListError) {
            if (!!examSuggestionList && examSuggestionList.length === 0) {
                setOpen(true);
                setNoOptionsText(noOptionsTextNoResultsFoundPanel());
            } else if (searchTerm !== '') {
                setOpen(true);
            } else {
                setOpen(false);
            }
        }
    }, [examSuggestionList, examSuggestionListError, examSuggestionListLoading, searchTerm]);

    useEffect(() => {
        if (!!examSuggestionListError) {
            setOpen(false);
        }
    }, [examSuggestionListError]);

    const handleTypedKeywordChange = React.useCallback(
        (event, typedText) => {
            // if we have a new search term, wipe the unshifted "View all exam papers for" entry
            if (!typedText.startsWith(searchTerm)) {
                actions.clearExamSuggestions();
            }

            setSearchTerm(typedText);

            if (typedText.length <= 1) {
                actions.clearExamSuggestions();
                setOpen(true);
                setNoOptionsText(noOptionsTextTooShort);
            } else if (!isRepeatingString(typedText) && typedText.length <= MAX_LENGTH_COURSE_CODE) {
                setNoOptionsText(null);
                setOpen(false);
                // ignore the space if they type eg "FREN 1101"
                actions.loadExamSuggestions(typedText.replace(' ', ''));
            }
        },
        [actions, searchTerm],
    );

    const addKeywordAsOption = (options, params) => {
        const filtered = filter(options, params);

        const truncatedSearchTerm = params.inputValue.toUpperCase().substring(0, MAX_LENGTH_COURSE_CODE);
        if (filtered.length > 0 && params.inputValue !== '' && options[0].name.toUpperCase() !== truncatedSearchTerm) {
            filtered.unshift({
                name: truncatedSearchTerm,
                course_title: `View all exam papers for ${truncatedSearchTerm}`,
            });
        }
        return filtered;
    };

    const gotoSearchResultPage = (event, value) => {
        const searchUrl = `/exams/course/${value.name.toUpperCase()}`;
        navigate(searchUrl);
    };

    return (
        <StandardPage title="Search for a past exam paper" style={{ marginTop: '16px' }}>
            <StandardCard>
                <Grid container alignItems={'flex-end'}>
                    <StyledAboutBlock item xs={12} sm>
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
                    </StyledAboutBlock>
                </Grid>
                <form>
                    <Autocomplete
                        autoHighlight
                        clearOnEscape
                        clearOnBlur={false}
                        open={isOpen}
                        filterOptions={addKeywordAsOption}
                        onInputChange={handleTypedKeywordChange}
                        id="exam-search"
                        onChange={gotoSearchResultPage}
                        options={examSuggestionList || []}
                        noOptionsText={noOptionsText}
                        renderInput={params => (
                            <TextField
                                variant="standard"
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
                        renderOption={(props, option) => (
                            <Box component="li" {...props} key={option.name}>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <Typography variant="body1" color="textPrimary">
                                            {option.name}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="body2" color="textSecondary">
                                            {option.course_title}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}
                        getOptionLabel={item =>
                            (!!item && !!item.name && String(`${item.name} (${item.course_title})`)) ||
                            /* istanbul ignore next */ ''
                        }
                    />
                </form>
                {!!examSuggestionListLoading && (
                    <Grid container spacing={2}>
                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md
                            style={{ marginTop: 50, marginRight: 20, marginBottom: 6, minHeight: 100 }}
                        >
                            <InlineLoader message="Loading" />
                        </Grid>
                    </Grid>
                )}
                {!!examSuggestionListError && (
                    <StyledSearchPanel container spacing={2} data-testid={'past-exam-paper-error'}>
                        <Grid item xs={12} sm={12} md className={'searchPanelInfo'}>
                            <span>Autocomplete suggestions currently unavailable - please try again later</span>
                        </Grid>
                    </StyledSearchPanel>
                )}
                <Grid container>
                    <Grid item xs={'auto'}>
                        <StyledAboutLink>
                            <a href="https://web.library.uq.edu.au/library-services/students/past-exam-papers">
                                Read more about searching for past exam papers
                            </a>
                        </StyledAboutLink>
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
