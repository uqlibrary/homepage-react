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
        },
        searchUnderlinks: {
            '&a:link, a:hover, a:visited, a:active': {
                color: theme.palette.primary.main + ' !important',
            },
        },
    }),
    { withTheme: true },
);

export const PrimoSearch = ({ locale, suggestions, suggestionsLoading, suggestionsError, actions }) => {
    const classes = useStyles();
    const [searchType, setSearchType] = useState(0);
    const [searchKeyword, setSearchKeyword] = useState('');
    const handleSearchTypeChange = event => {
        setSearchType(event.target.value);
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
                actions.loadPrimoSuggestions(newValue);
            }
            document.getElementById('primo-autocomplete').focus();
        },
        [actions],
    );

    const handleClearSuggestions = React.useCallback(() => {
        actions.clearPrimoSuggestions();
    });
    return (
        <StandardCard noPadding noHeader>
            <form onSubmit={handleSearchButton}>
                <Grid container spacing={1} className={classes.searchPanel} alignItems={'flex-end'}>
                    <Grid item xs={12} md={'auto'}>
                        <FormControl style={{ minWidth: '100%' }}>
                            <InputLabel id="search-select-label" autoFocus>
                                {locale.PrimoSearch.typeSelect.label}
                            </InputLabel>
                            <Select
                                labelId="search-select-label"
                                id="search-select"
                                value={searchType}
                                className={classes.selectInput}
                                onChange={handleSearchTypeChange}
                            >
                                {locale.PrimoSearch.typeSelect.items.map((item, index) => (
                                    <MenuItem value={index} key={index}>
                                        {item.icon}&nbsp;{item.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs>
                        <Autocomplete
                            value={searchKeyword}
                            freeSolo
                            id="primo-autocomplete"
                            disableClearable
                            openOnFocus
                            clearOnEscape
                            // open={!!suggestions && !!searchKeyword && searchKeyword.length > 3}
                            options={
                                (suggestions &&
                                    suggestions.docs
                                        .map(option => option.text)
                                        .filter(option => option !== searchKeyword)) ||
                                []
                            }
                            onInputChange={handleSearchKeywordChange}
                            renderInput={params => {
                                return (
                                    <TextField
                                        {...params}
                                        placeholder="Find books, articles, databases, conferences and more.."
                                        error={suggestionsError}
                                        helperText={suggestionsError}
                                        InputProps={{
                                            ...params.InputProps,
                                            type: 'search',
                                            classes: {
                                                input: classes.selectInput,
                                            },
                                        }}
                                    />
                                );
                            }}
                        />
                    </Grid>
                    {suggestionsLoading && (
                        <Grid item xs={'auto'} style={{ width: 30, marginLeft: -95, marginRight: 65, marginBottom: 6 }}>
                            <CircularProgress color="secondary" size={20} id="loading-suggestions" />
                        </Grid>
                    )}
                    <VoiceToText sendHandler={handleSearchKeywordChange} clearSuggestions={handleClearSuggestions} />
                    <Grid item xs={'auto'}>
                        <Button
                            id="search-submit"
                            size={'large'}
                            variant="contained"
                            color={'primary'}
                            style={{ width: 20, minWidth: 20, padding: '8px 8px !important' }}
                            onClick={handleSearchButton}
                        >
                            <SearchIcon />
                        </Button>
                    </Grid>
                </Grid>
                <Grid container spacing={2} className={classes.searchPanel}>
                    <Hidden smDown>
                        <Grid item xs />
                    </Hidden>
                    {locale.PrimoSearch.links.map((item, index) => (
                        <Grid item xs={'auto'} key={index} className={classes.searchUnderlinks}>
                            <a href={item.link}>{item.label}</a>
                        </Grid>
                    ))}
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
