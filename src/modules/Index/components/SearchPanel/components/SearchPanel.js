import React, { useState, useRef, useEffect } from 'react';
import { PropTypes } from 'prop-types';

import { searchPanelLocale } from './searchPanel.locale';
import { VoiceToText } from './voiceToText';
import { isRepeatingString, unescapeString } from 'helpers/general';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import { throttle } from 'throttle-debounce';
import SearchIcon from '@material-ui/icons/Search';
import Autocomplete from '@material-ui/lab/Autocomplete';
import useMediaQuery from '@material-ui/core/useMediaQuery';

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

export const SearchPanel = ({ locale, suggestions, suggestionsLoading, suggestionsError, actions }) => {
    const classes = useStyles();
    const [searchType, setSearchType] = useState(0);
    const [searchKeyword, setSearchKeyword] = useState('');
    const isDesktop = useMediaQuery('(min-width:600px)');
    useEffect(() => {
        if (isDesktop) {
            document.getElementById('primo-search-autocomplete').focus();
        }
    }, [isDesktop]);

    const handleClearSuggestions = () => {
        actions.clearPrimoSuggestions();
    };
    const focusOnSearchInput = () => {
        setTimeout(() => {
            const searchInput = document.getElementById('primo-search-autocomplete');
            searchInput.focus();
        }, 200);
    };

    const handleSearchTypeChange = event => {
        setSearchType(event.target.value);
        actions.clearPrimoSuggestions();
        focusOnSearchInput();
    };

    const isExamSearch = searchType === 7;
    const isCourseResourceSearch = searchType === 8;

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
            let keyword = searchKeyword;
            if (isCourseResourceSearch || isExamSearch) {
                // because the display text in the dropdown has the descriptors in it, that text reaches here.
                // trim down to the course code only
                keyword = charactersBefore(searchKeyword, ' ');
            }
            const link = locale.typeSelect.items[searchType].link
                .replace('[keyword]', keyword)
                .replace('[keyword]', keyword); // database search has two instances of keyword
            window.location.assign(link);
        }
    };

    const throttledPrimoLoadSuggestions = useRef(throttle(3100, newValue => actions.loadPrimoSuggestions(newValue)));
    const throttledExamLoadSuggestions = useRef(throttle(3100, newValue => actions.loadExamPaperSuggestions(newValue)));
    const throttledReadingListLoadSuggestions = useRef(
        throttle(3100, newValue => actions.loadHomepageCourseReadingListsSuggestions(newValue)),
    );

    const getSuggestions = React.useCallback(
        (event, typedText) => {
            setSearchKeyword(typedText);
            if (typedText.length > 3 && !isRepeatingString(typedText)) {
                if ([0, 1, 3, 4, 5].includes(searchType)) {
                    throttledPrimoLoadSuggestions.current(typedText);
                } else if (isExamSearch) {
                    throttledExamLoadSuggestions.current(typedText);
                } else if (isCourseResourceSearch) {
                    // on the first pass we only get what they type;
                    // on the second pass we get the full description string
                    const coursecode = charactersBefore(typedText, ' ');
                    throttledReadingListLoadSuggestions.current(coursecode);
                }
                focusOnSearchInput();
            } else {
                actions.clearPrimoSuggestions();
            }
        },
        [actions, searchType, isExamSearch, isCourseResourceSearch],
    );
    return (
        <StandardCard noPadding noHeader standardCardId="primo-search">
            <form id="primo-search-form" onSubmit={handleSearchButton}>
                <Grid container spacing={1} className={classes.searchPanel} alignItems={'flex-end'}>
                    <Grid item xs={12} md={'auto'}>
                        <FormControl style={{ width: '100%' }}>
                            <InputLabel id="primo-search-select-label">{locale.typeSelect.label}</InputLabel>
                            <Select
                                labelId="primo-search-select-label"
                                id="primo-search-select"
                                error={!!suggestionsError}
                                value={searchType}
                                onChange={handleSearchTypeChange}
                                SelectDisplayProps={{
                                    'data-testid': 'primo-search-select',
                                    id: 'primo-search-select',
                                }}
                                MenuProps={{
                                    'data-testid': 'primo-search-select-list',
                                    id: 'primo-search-select-list',
                                }}
                                inputProps={{
                                    id: 'primo-search-select-input',
                                    'data-testid': 'primo-search-select-input',
                                }}
                            >
                                {locale.typeSelect.items.map((item, index) => (
                                    <MenuItem value={index} key={index} data-testid={`primo-search-item-${index}`}>
                                        {item.icon}&nbsp;{item.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
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
                                (!!suggestions &&
                                    suggestions
                                        .filter(option => option.text !== searchKeyword)
                                        .map(option => unescapeString(option.text))) ||
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
                                        placeholder={locale.typeSelect.items[searchType].placeholder}
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
                                            'data-testid': 'primo-search-autocomplete-input',
                                        }}
                                    />
                                );
                            }}
                        />
                    </Grid>
                    <Grid item xs={'auto'} style={{ width: 90, marginLeft: -70, marginRight: -20, marginBottom: 6 }}>
                        <VoiceToText sendHandler={getSuggestions} clearSuggestions={handleClearSuggestions} />
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
                                id="primo-search-submit"
                                data-testid="primo-search-submit"
                                size={'large'}
                                variant="contained"
                                color={'primary'}
                                className={classes.searchButton}
                                type="submit"
                                value="Submit"
                            >
                                <SearchIcon />
                            </Button>
                        </Tooltip>
                    </Grid>
                </Grid>
                <Grid container spacing={2} className={classes.searchPanel} data-testid={'primo-search-links'}>
                    {!!suggestionsError ? (
                        <Grid item xs={12} sm={12} md style={{ color: 'red' }}>
                            <span>Autocomplete suggestions unavailable</span>
                        </Grid>
                    ) : (
                        <Hidden smDown>
                            <Grid item xs />
                        </Hidden>
                    )}
                    {!!locale.links &&
                        locale.links.length > 0 &&
                        locale.links.map((item, index) => {
                            if (item.display.includes(searchType)) {
                                return (
                                    <Grid
                                        item
                                        key={index}
                                        xs={'auto'}
                                        data-testid={`primo-search-links-${index}`}
                                        className={classes.searchUnderlinks}
                                    >
                                        <a href={item.link} rel="noreferrer">
                                            {item.label}
                                        </a>
                                    </Grid>
                                );
                            } else {
                                return null;
                            }
                        })}
                </Grid>
            </form>
        </StandardCard>
    );
};

SearchPanel.propTypes = {
    locale: PropTypes.any,
    option: PropTypes.any,
    suggestions: PropTypes.any,
    suggestionsLoading: PropTypes.bool,
    suggestionsError: PropTypes.string,
    actions: PropTypes.any,
};

SearchPanel.defaultProps = {
    locale: searchPanelLocale,
};

export default SearchPanel;
