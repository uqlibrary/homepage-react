import React, { useState } from 'react';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { makeStyles } from '@material-ui/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import { PropTypes } from 'prop-types';
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import { default as defaultLocale } from './locale.js';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { VoiceToText } from './voiceToText';
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

export const PrimoSearch = ({ locale, suggestions, suggestionsLoading, suggestionsError, actions }) => {
    const classes = useStyles();
    const [searchType, setSearchType] = useState(0);
    const [searchKeyword, setSearchKeyword] = useState('');

    const handleClearSuggestions = () => {
        actions.clearPrimoSuggestions();
    };

    const handleSearchTypeChange = event => {
        setSearchType(event.target.value);
        actions.clearPrimoSuggestions();
    };

    const handleSearchButton = event => {
        event.preventDefault();
        if (!!searchKeyword) {
            const link = locale.PrimoSearch.typeSelect.items[searchType].link.replace('[keyword]', searchKeyword);
            window.location.assign(link);
        }
    };

    const handleSearchKeywordChange = React.useCallback(
        (event, newValue) => {
            setSearchKeyword(newValue);
            if (newValue.length > 3) {
                if ([0, 1, 3, 4, 5].includes(searchType)) {
                    actions.loadPrimoSuggestions(newValue);
                } else if (searchType === 7) {
                    actions.loadExamPaperSuggestions(newValue);
                } else if (searchType === 8) {
                    actions.loadCourseReadingListsSuggestions(newValue);
                }
                console.log('focussing on the input');
                document.getElementById('primo-search-autocomplete').focus();
            }
        },
        [actions, searchType],
    );
    return (
        <StandardCard noPadding noHeader>
            <form onSubmit={handleSearchButton}>
                <Grid container spacing={1} className={classes.searchPanel} alignItems={'flex-end'}>
                    <Grid item xs={12} md={'auto'}>
                        <FormControl style={{ width: '100%' }}>
                            <InputLabel id="search-select-label">{locale.PrimoSearch.typeSelect.label}</InputLabel>
                            <Select
                                labelId="search-select-label"
                                id="primo-search-select"
                                data-testid="primo-search-select"
                                error={!!suggestionsError}
                                value={searchType}
                                className={classes.selectInput}
                                onChange={handleSearchTypeChange}
                            >
                                {locale.PrimoSearch.typeSelect.items.map((item, index) => (
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
                            open
                            options={(suggestions && suggestions.filter(option => option !== searchKeyword)) || []}
                            onInputChange={handleSearchKeywordChange}
                            renderInput={params => {
                                return (
                                    <TextField
                                        {...params}
                                        placeholder={locale.PrimoSearch.typeSelect.items[searchType].placeholder}
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
                                            'aria-label': 'Search terms',
                                            'data-testid': 'primo-search-input',
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
                                id="primo-search-submit"
                                data-testid="primo-search-submit"
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
                <Grid container spacing={2} className={classes.searchPanel}>
                    {!!suggestionsError ? (
                        <Grid item xs={12} sm={12} md style={{ color: 'red' }}>
                            <span>Autocomplete suggestions unavailable</span>
                        </Grid>
                    ) : (
                        <Hidden smDown>
                            <Grid item xs />
                        </Hidden>
                    )}
                    {locale.PrimoSearch.links.map((item, index) => {
                        if (item.display.includes(searchType)) {
                            return (
                                <Grid item xs={'auto'} key={index} className={classes.searchUnderlinks}>
                                    <a href={item.link}>{item.label}</a>
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

PrimoSearch.propTypes = {
    locale: PropTypes.any,
    suggestions: PropTypes.any,
    suggestionsLoading: PropTypes.bool,
    suggestionsError: PropTypes.string,
    actions: PropTypes.any,
};

PrimoSearch.defaultProps = {
    locale: defaultLocale,
};

export default PrimoSearch;
