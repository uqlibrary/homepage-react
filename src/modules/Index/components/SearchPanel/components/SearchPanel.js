import React, { useState } from 'react';
import { PropTypes } from 'prop-types';

import { searchPanelLocale } from './searchPanel.locale';
import { VoiceToText } from './voiceToText';
import { isRepeatingString } from 'helpers/general';

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

import SearchIcon from '@material-ui/icons/Search';
import Autocomplete from '@material-ui/lab/Autocomplete';

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

export const SearchPanel = ({ locale, suggestions, suggestionsLoading, suggestionsError, actions }) => {
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
            const link = locale.typeSelect.items[searchType].link.replace('[keyword]', searchKeyword);
            window.location.assign(link);
        }
    };

    const handleSearchKeywordChange = React.useCallback(
        (event, newValue) => {
            setSearchKeyword(newValue);
            if (newValue.length > 3 && !isRepeatingString(newValue)) {
                if ([0, 1, 3, 4, 5].includes(searchType)) {
                    actions.loadPrimoSuggestions(newValue);
                } else if (searchType === 7) {
                    actions.loadExamPaperSuggestions(newValue);
                } else if (searchType === 8) {
                    console.log('homepage: fetch search_suggestions?type=learning_resource');
                    actions.loadHomepageCourseReadingListsSuggestions(newValue);
                }
                document.getElementById('primo-search-autocomplete').focus();
            } else {
                actions.clearPrimoSuggestions();
            }
        },
        [actions, searchType],
    );
    return (
        <StandardCard noPadding noHeader standardCardId="primo-search">
            <form onSubmit={handleSearchButton}>
                <Grid container spacing={1} className={classes.searchPanel} alignItems={'flex-end'}>
                    <Grid item xs={12} md={'auto'}>
                        <FormControl style={{ width: '100%' }}>
                            <InputLabel id="primo-search-select-label">{locale.typeSelect.label}</InputLabel>
                            <Select
                                labelId="primo-search-select-label"
                                id="primo-search-select"
                                error={!!suggestionsError}
                                value={searchType}
                                className={classes.selectInput}
                                onChange={handleSearchTypeChange}
                                SelectDisplayProps={{
                                    'data-testid': 'primo-search-select',
                                }}
                                MenuProps={{
                                    'data-testid': 'primo-search-select-list',
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
                            autoFocus
                            id="primo-search-autocomplete"
                            data-testid="primo-search-autocomplete"
                            disableClearable
                            openOnFocus
                            clearOnEscape
                            options={
                                (!!suggestions &&
                                    suggestions
                                        .filter(option => option.text !== searchKeyword)
                                        .map(option => option.text)) ||
                                []
                            }
                            onInputChange={handleSearchKeywordChange}
                            ListboxProps={{
                                'aria-labelledby': 'primo-search-select-label',
                                id: 'primo-search-autocomplete-listbox',
                                'data-testid': 'primo-search-autocomplete-listbox',
                                'aria-label': 'Suggestion list',
                            }}
                            renderInput={params => {
                                return (
                                    <TextField
                                        {...params}
                                        autoFocus
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
                        <VoiceToText
                            sendHandler={handleSearchKeywordChange}
                            clearSuggestions={handleClearSuggestions}
                            elementId={'primo-search-autocomplete'}
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
