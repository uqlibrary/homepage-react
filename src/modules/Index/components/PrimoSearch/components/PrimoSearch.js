import React, { useState } from 'react';
import { useLocation } from 'react-router';

import { PropTypes } from 'prop-types';
import { primoSearch as defaultLocale } from './primoSearchLocale';
import { VoiceToText } from './voiceToText';
import { isRepeatingString } from 'helpers/general';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { getUrlForCourseResourceSpecificTab } from 'modules/Index/components/HomePageCourseResources';

import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import Hidden from '@material-ui/core/Hidden';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/styles';
import MenuItem from '@material-ui/core/MenuItem';
import SearchIcon from '@material-ui/icons/Search';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
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

export const PrimoSearch = ({
    actions,
    displayType, // default: 'all'; values: 'all', 'courseresources', 'homepagecourseresources'
    // 'all' for full homepage search
    // 'courseresources' for course resources page search
    // 'homepagecourseresources' for course resource search in homepage panel
    elementId = 'primo-search',
    locale,
    searchKeywordSelected,
    suggestions,
    suggestionsLoading,
    suggestionsError,
}) => {
    const classes = useStyles();
    const pageLocation = useLocation();

    const searchTypeCourseResources = 8;
    const searchTypeAll = 0;
    const [searchType, setSearchType] = useState(displayType === 'all' ? searchTypeAll : searchTypeCourseResources);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedValue, setSelectedValue] = useState('');

    const handleClearSuggestions = () => {
        actions.clearPrimoSuggestions();
    };

    const handleSearchTypeChange = event => {
        setSearchType(event.target.value);
        actions.clearPrimoSuggestions();
    };

    const handleSearchButton = event => {
        event.preventDefault();
        console.log('handleSearchButton');
        console.log('displayType = ', displayType);
        console.log('suggestions = ', suggestions);
        if (displayType === 'homepagecourseresources') {
            console.log('in homepagecourseresources');
            console.log('selectedValue = ', selectedValue);
            const course = {
                classnumber: searchKeyword,
                campus: '???',
                semester: '???',
            };
            const url = getUrlForCourseResourceSpecificTab(course, pageLocation);
            history.push(url);
        } else if (displayType === 'courseresources') {
            console.log('in courseresources');
            searchKeywordSelected(searchKeyword, suggestions);
        } else if (!!searchKeyword) {
            const link = locale.typeSelect.items[searchType].link.replace('[keyword]', searchKeyword);
            window.location.assign(link);
        }
    };

    // this is a hack, but I couldnt get getOptionLabel and renderOption
    // working on Autocomplete to return just the course code :(
    const extractCourseCodeFromBeginningOfDescription = courseDescription => {
        console.log('extractCourseCodeFromBeginningOfDescription: courseDescription = ', courseDescription);
        return courseDescription.trim().split(' ')[0];
    };

    const handleSearchKeywordChange = React.useCallback(
        (event, newValue) => {
            console.log('handleSearchKeywordChange: ', newValue);
            setSelectedValue(newValue);
            const selectedValue = displayType.includes('courseresources')
                ? extractCourseCodeFromBeginningOfDescription(newValue)
                : newValue;

            setSearchKeyword(selectedValue);
            if (selectedValue.length > 3 && !isRepeatingString(selectedValue)) {
                if ([searchTypeAll, 1, 3, 4, 5].includes(searchType)) {
                    actions.loadPrimoSuggestions(selectedValue);
                } else if (searchType === 7) {
                    actions.loadExamPaperSuggestions(selectedValue);
                } else if (searchType === searchTypeCourseResources) {
                    actions.loadCourseReadingListsSuggestions(selectedValue);
                }
                document.getElementById(`${elementId}-autocomplete`).focus();
            }
        },
        [actions, searchType, displayType, elementId],
    );

    const courseResourceSubjectDisplay = option =>
        `${option.text} (${option.rest.course_title}, ${option.rest.period})`;

    return (
        <StandardCard noPadding noHeader standardCardId={`${elementId}`}>
            <form onSubmit={handleSearchButton}>
                <Grid container spacing={1} className={classes.searchPanel} alignItems={'flex-end'}>
                    {displayType === 'all' && (
                        <Grid item xs={12} md={'auto'}>
                            <FormControl style={{ width: '100%' }}>
                                <InputLabel id={`${elementId}-select-label`} data-testid={`${elementId}-title`}>
                                    {locale.typeSelect.label}
                                </InputLabel>
                                <Select
                                    labelId={`${elementId}-select-label`}
                                    id={`${elementId}-select`}
                                    data-testid={`${elementId}-select`}
                                    error={!!suggestionsError}
                                    value={searchType}
                                    className={classes.selectInput}
                                    onChange={handleSearchTypeChange}
                                    MenuProps={{
                                        'data-testid': `${elementId}-select-list`,
                                    }}
                                >
                                    {locale.typeSelect.items.map((item, index) => (
                                        <MenuItem value={index} key={index} data-testid={`${elementId}-item-${index}`}>
                                            {item.icon}&nbsp;{item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    )}
                    <Grid item xs={12} sm>
                        <Autocomplete
                            debug // #dev
                            value={searchKeyword}
                            freeSolo={displayType === 'all'}
                            id={`${elementId}-autocomplete`}
                            data-testid={`${elementId}-autocomplete`}
                            disableClearable
                            openOnFocus
                            clearOnEscape
                            options={
                                (!!suggestions &&
                                    suggestions
                                        .filter(option => option.text !== searchKeyword)
                                        .map(option => {
                                            return !!option.rest ? courseResourceSubjectDisplay(option) : option.text;
                                        })) ||
                                []
                            }
                            onInputChange={handleSearchKeywordChange}
                            ListboxProps={{
                                'aria-labelledby': `${elementId}-select-label`,
                                id: `${elementId}-autocomplete-listbox`,
                                'data-testid': `${elementId}-autocomplete-listbox`,
                                'aria-label': 'Suggestion list',
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
                                            'data-testid': `${elementId}-autocomplete-input`,
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
                                id={`${elementId}-submit`}
                                data-testid={`${elementId}-submit`}
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
                <Grid container spacing={2} className={classes.searchPanel} data-testid={`${elementId}-links`}>
                    {!!suggestionsError ? (
                        <Grid item xs={12} sm={12} md style={{ color: 'red' }}>
                            <span>Autocomplete suggestions unavailable</span>
                        </Grid>
                    ) : (
                        <Hidden smDown>
                            <Grid item xs />
                        </Hidden>
                    )}
                    {displayType === 'all' &&
                        locale.links.map((item, index) => {
                            if (item.display.includes(searchType)) {
                                return (
                                    <Grid
                                        item
                                        key={index}
                                        xs={'auto'}
                                        data-testid={`${elementId}-links-${index}`}
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

PrimoSearch.propTypes = {
    displayType: PropTypes.string,
    elementId: PropTypes.string,
    locale: PropTypes.any,
    option: PropTypes.any,
    searchKeywordSelected: PropTypes.any,
    suggestions: PropTypes.any,
    suggestionsLoading: PropTypes.bool,
    suggestionsError: PropTypes.string,
    actions: PropTypes.any,
};

PrimoSearch.defaultProps = {
    displayType: 'all',
    locale: defaultLocale,
};

export default PrimoSearch;
