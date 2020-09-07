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
import { loadPrimoSuggestions } from 'actions';

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

export const PrimoSearch = ({ locale, suggestions, suggestionsLoading, suggestionsError }) => {
    console.log('Values from reducer: ', suggestions, suggestionsLoading, suggestionsError);
    const classes = useStyles();
    const [searchType, setSearchType] = useState(0);
    const [searchKeyword, setSearchKeyword] = useState(null);
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

    const handleSearchKeywordChange = event => {
        console.log(event.target.value);
        setSearchKeyword(event.target.value);
        if (event.target.value.length > 3) {
            loadPrimoSuggestions(event.target.value);
        }
    };

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
                        <TextField
                            id="search-input"
                            placeholder="Find books, articles, databases, conferences and more.."
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                                classes: {
                                    input: classes.selectInput,
                                },
                            }}
                            onChange={handleSearchKeywordChange}
                        />
                    </Grid>
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
    suggestionsError: PropTypes.object,
};

PrimoSearch.defaultProps = {
    locale: defaultLocale,
};

export default PrimoSearch;
