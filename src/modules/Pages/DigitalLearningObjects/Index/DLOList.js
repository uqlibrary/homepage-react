import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import parse from 'html-react-parser';

import { Grid, Pagination } from '@mui/material';
import { makeStyles } from '@mui/styles';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';

import DescriptionIcon from '@mui/icons-material/Description';
import LaptopIcon from '@mui/icons-material/Laptop';
import LocalLibrarySharpIcon from '@mui/icons-material/LocalLibrarySharp';
import CopyrightIcon from '@mui/icons-material/Copyright';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import TopicIcon from '@mui/icons-material/Topic';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CloseIcon from '@mui/icons-material/Close';
import SchoolSharpIcon from '@mui/icons-material/SchoolSharp';
import SearchIcon from '@mui/icons-material/Search';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import InfoIcon from '@mui/icons-material/Info';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';

import LoginPrompt from 'modules/Pages/DigitalLearningObjects/SharedComponents/LoginPrompt';
import HeroCard from 'modules/Pages/DigitalLearningObjects/SharedComponents/HeroCard';
import { getDlorViewPageUrl } from '../dlorHelpers';

const useStyles = makeStyles(theme => ({
    panelGap: {
        paddingLeft: 16,
        paddingBottom: 16,
        paddingTop: '0 !important',
    },
    panelGrid: {
        paddingLeft: 12,
        paddingRight: 12,
        marginBlock: 6,
        display: 'flex',
        alignItems: 'stretch', // panels fill the screen with equal width
    },
    highlighted: {
        color: theme.palette.primary.light,
        fontWeight: 400,
        marginLeft: 4,
    },
    dlorCard: {
        backgroundColor: '#fff',
        borderColor: 'transparent',
        fontFamily: 'Roboto, sans-serif',
        // height: '100%',
        paddingInline: 0,
        textAlign: 'left',
        width: '100%',
        '&:hover': {
            cursor: 'pointer',
            textDecoration: 'none',
            borderTopColor: '#f2f2f2',
            borderLeftColor: '#f2f2f2',
            '& > article': {
                backgroundColor: '#f2f2f2',
            },
        },
        '& article': {
            padding: '12px',
            '& header': {
                '& h2': {
                    lineHeight: 1,
                    marginBlock: 7,
                    display: 'flex',
                    alignItems: 'center',
                },
            },
            '& > div': {
                maxHeight: 180,
                overflowY: 'auto',
                overflowX: 'hidden',
                fontWeight: 300,
            },
            '& > div p': {
                marginBottom: '0.2em',
                marginTop: '0.2em',
                fontSize: 16,
            },
            '& > div p:first-child': {
                marginTop: 0,
            },
            '& footer': {
                color: theme.palette.primary.light,
                fontWeight: 400,
                marginTop: 6,
                display: 'flex',
                alignItems: 'center', // horizontally, align icon and label at the center
                '& > svg:not(:first-child)': {
                    paddingLeft: 12,
                },
                '& svg': {
                    width: 20,
                    '& > path': {
                        fill: theme.palette.primary.light,
                    },
                },
                '& span': {
                    paddingLeft: 2,
                },
            },
        },
    },
    panelBody: {
        paddingTop: 0,
    },
    filterSidebar: {
        fontSize: 10,
        paddingTop: 0,
        marginTop: 12,
        [theme.breakpoints.down('md')]: {
            display: 'none',
        },
    },
    filterSidebarBody: {
        marginTop: 0,
    },
    showFilterSidebarIcon: {
        display: 'flex',
        justifyContent: 'flex-end',
        width: '100%',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    hideFilterSidebarIcon: {
        display: 'flex',
        justifyContent: 'flex-end',
        width: '100%',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    filterSidebarHeading: {
        [theme.breakpoints.up('md')]: {
            paddingRight: 20,
        },
    },
    filterSidebarType: {
        width: '100%',
        borderBottom: '1px solid #e1e1e1',
        paddingTop: '0!important',
        paddingBottom: 16,
        // marginTop: 16,
        paddingLeft: '0!important',
        marginLeft: 24,
        paddingRight: 8,
    },
    filterSidebarTypeHeading: {
        display: 'flex',
        paddingLeft: 0,
        justifyContent: 'space-between',
        paddingTop: 16,
        '& h3': {
            color: theme.palette.secondary.dark,
            display: 'flex',
            alignItems: 'flex-start',
            fontWeight: 500,
        },
        '& button': {
            borderColor: 'transparent',
            backgroundColor: '#f7f7f7',
        },
    },
    filterSidebarFacetHelpPopup: {
        position: 'absolute',
        top: 35,
        left: 0,
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        padding: 14,
        lineHeight: 1.4,
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
        fontSize: 16,
        '& span': {
            display: 'block',
            marginTop: 40,
        },
        '& button': {
            marginTop: 10,
            position: 'absolute',
            top: 10,
            right: 10,
            float: 'right',
            width: '6em',
        },
    },
    facetPanelControl: {
        '& button': {
            padding: 0,
        },
    },
    filterSidebarCheckboxWrapper: {
        '& label': {
            display: 'flex',
            alignItems: 'flex-start', // align items vertically at the top
        },
    },
    filterSidebarCheckboxControl: {
        display: 'block',
        '& span:first-child': {
            paddingBlock: 0,
        },
        paddingBottom: 5,
        '& .MuiFormControlLabel-label': {
            fontSize: '0.9rem',
        },
    },
    skipLink: {
        // hidden when not focused
        position: 'absolute',
        left: -1000,

        // uqActionButton layout
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.white.main,
        borderColor: theme.palette.primary.main,
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 6,
        padding: '8px 12px',
        fontWeight: 400,

        marginLeft: 10,
        '&:focus': {
            left: 'auto',

            // uqActionButton layout
            backgroundColor: theme.palette.white.main,
            color: theme.palette.primary.main,
            textDecoration: 'none',
        },
    },
    keywordSearchPanel: {
        width: 'calc(100% - 24px)',
        marginBottom: 18,
        marginLeft: 12,
        marginRight: 12,
    },
    dlorPagination: {
        width: '100%',
        '& ul': {
            justifyContent: 'center',
        },
    },
    uqActionButton: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.white.main,
        borderColor: theme.palette.primary.main,
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '8px 12px',
        fontWeight: 400,
        '&:hover': {
            backgroundColor: theme.palette.white.main,
            color: theme.palette.primary.main,
            textDecoration: 'none',
        },
    },
    tagLabel: {
        fontVariant: 'small-caps',
        textTransform: 'lowercase',
        fontWeight: 'bold',
        marginRight: 10,
        color: '#333',
    },
}));

export const DLOList = ({
    actions,
    dlorList,
    dlorListLoading,
    dlorListError,
    dlorFilterList,
    dlorFilterListLoading,
    dlorFilterListError,
    account,
}) => {
    const classes = useStyles();

    const [selectedFilters, setSelectedFilters] = useState([]);
    const [filterListTrimmed, setFilterListTrimmed] = useState([]);
    const [filterTypesOpen, setFilterTypesOpen] = useState([]);
    const checkBoxArrayRef = useRef([]);
    const [keywordSearch, setKeywordSearch] = useState('');
    const keyWordSearchRef = useRef('');

    const [paginationPage, setPaginationPage] = React.useState(1);

    /* istanbul ignore next */
    function skipToElement() {
        const skipNavLander = document.querySelector('#first-panel-button');
        !!skipNavLander && skipNavLander.focus({ focusVisible: true });
    }

    const heroTitleDlor = 'Find a digital learning object';
    const heroDescriptionDlor =
        'Use the Digital Learning Hub to find modules, videos and guides for teaching and study.';
    const heroBackgroundImageDlor = require('../../../../../public/images/digital-learning-hub-hero-shot-wide.png');

    useEffect(() => {
        if (!dlorListError && !dlorListLoading && !dlorList) {
            actions.loadCurrentDLORs();
        }
        if (!dlorFilterListError && !dlorFilterListLoading && !dlorFilterList) {
            actions.loadAllFilters();
        }
    }, [dlorList, dlorFilterList, dlorListError, dlorListLoading, dlorFilterListError, dlorFilterListLoading, actions]);

    function keywordIsSearchable(keyword) {
        // don't filter on something terribly short
        return keyword?.length > 1;
    }

    const updateUrl = itemType => {
        const url = new URL(document.URL);

        const separator = ';';
        const params = {
            keyword: '',
            filters: '',
        };

        // start with the values currently in the url
        location.hash
            .slice(1) // remove '#' from beginning
            .split(separator) // separate filters
            .map(spec => {
                /* istanbul ignore if */
                if (!spec) {
                    return;
                }
                const [name, thevalue] = spec.split('='); // get keys and values
                if (name === 'keyword') {
                    params.keyword = thevalue;
                }
                if (name === 'filters') {
                    params.filters = thevalue;
                }
            });

        // overwrite the values from the url with the requested change
        if (itemType === 'keyword') {
            params.keyword = keyWordSearchRef.current.value;
        }
        if (itemType === 'filters') {
            const facetIds = checkBoxArrayRef.current.map(c => {
                const parts = c.split('-');
                const facetId = parseInt(parts[1], 10);
                return facetId;
            });
            params.filters = facetIds.join(',');
        }

        // only put the used segments in the hash (tidy url)
        if (params.keyword === '') {
            delete params.keyword;
        } else {
            params.keyword = `keyword=${params.keyword}`;
        }
        if (params.filters === '') {
            delete params.filters;
        } else {
            params.filters = `filters=${params.filters}`;
        }
        url.hash = Object.keys(params).length > 0 ? Object.values(params).join(separator) : '#';

        // add the current hash to the url
        document.location.href = url.href;
    };

    const clearKeywordField = () => {
        setKeywordSearch('');
        keyWordSearchRef.current.value = '';
        setPaginationPage(1); // set pagination back to page 1
        updateUrl('keyword');
    };

    const handleKeywordSearch = e => {
        const keyword = e?.target?.value;

        if (keywordIsSearchable(keyword)) {
            setKeywordSearch(keyword);
            setPaginationPage(1);
        } else if (
            !keyword ||
            keyword.length === 0 // they've cleared it
        ) {
            clearKeywordField();
        }

        keyWordSearchRef.current.value = keyword;
        updateUrl('keyword');
    };

    function hideElement(element, displayproperty = null) {
        /* istanbul ignore next */
        if (!element) {
            return;
        }
        element.style.display = 'none';
        element.style.visibility = 'hidden';
        element.style.opacity = 0;
        element.style.height = 0;
        !!displayproperty && (element.style.display = displayproperty);
    }

    function showElement(element, displayproperty = null) {
        /* istanbul ignore next */
        if (!element) {
            return;
        }
        element.style.display = 'inline-block';
        element.style.visibility = 'visible';
        element.style.opacity = 1;
        element.style.height = 'auto';
        !!displayproperty && (element.style.display = displayproperty);
    }

    const sidebarElementId = (facetTypeId, elementSlug = 'sidebar-panel') => `${elementSlug}-${facetTypeId}`;

    const panelId = facetTypeId => sidebarElementId(facetTypeId);
    const UpArrowId = facetTypeId => sidebarElementId(facetTypeId, 'panel-uparrow');
    const DownArrowId = facetTypeId => sidebarElementId(facetTypeId, 'panel-downarrow');

    const filterButtonLabel = actionLabel => `${actionLabel} this filter section`;
    const filterMaximiseButtonLabel = filterButtonLabel('Open');
    const filterMinimiseButtonLabel = filterButtonLabel('Close');
    function hidePanel(facetTypeId) {
        const facetPanel = document.getElementById(panelId(facetTypeId));
        const upArrowIcon = document.getElementById(UpArrowId(facetTypeId));
        const downArrowIcon = document.getElementById(DownArrowId(facetTypeId));
        hideElement(facetPanel);
        showElement(downArrowIcon, 'inline-block');
        !!downArrowIcon && downArrowIcon.parentElement?.setAttribute('aria-label', filterMaximiseButtonLabel);
        hideElement(upArrowIcon, 'none');
        setFilterTypesOpen(filterTypesOpen.filter(f => f !== facetTypeId)); // hide
    }

    function showPanel(facetTypeId) {
        const facetPanel = document.getElementById(panelId(facetTypeId));
        const upArrowIcon = document.getElementById(UpArrowId(facetTypeId));
        const downArrowIcon = document.getElementById(DownArrowId(facetTypeId));
        showElement(facetPanel);
        hideElement(downArrowIcon, 'none');
        showElement(upArrowIcon, 'inline-block');
        !!upArrowIcon && upArrowIcon.parentElement?.setAttribute('aria-label', filterMinimiseButtonLabel);
        setFilterTypesOpen([...filterTypesOpen, facetTypeId]); // show
    }

    function showHidePanel(facetTypeId) {
        const upArrowIcon = document.getElementById(UpArrowId(facetTypeId));
        const downArrowIcon = document.getElementById(DownArrowId(facetTypeId));
        /* istanbul ignore else */
        if (
            (!!downArrowIcon && downArrowIcon.style.display === 'none') ||
            (!!upArrowIcon && upArrowIcon.style.display !== 'none')
        ) {
            hidePanel(facetTypeId);
        } else if (
            (!!downArrowIcon && downArrowIcon.style.display !== 'none') ||
            (!!upArrowIcon && upArrowIcon.style.display === 'none')
        ) {
            showPanel(facetTypeId);
        }
    }

    function setFiltersFromUrl() {
        let filtersFound = false;
        location.hash
            .slice(1) // remove '#' from beginning
            .split(';') // separate filters
            .map(spec => {
                /* istanbul ignore if */
                if (!spec) {
                    return;
                }
                const [name, thevalue] = spec.split('='); // get keys and values
                if (name === 'keyword' && thevalue.length > 0) {
                    const keyword = {
                        target: {
                            value: thevalue,
                        },
                    };
                    handleKeywordSearch(keyword);
                    // setKeywordSearch
                }
                if (name === 'filters' && thevalue.length > 0) {
                    filtersFound = true;
                    // build the facet ids into facedtypeslug-facetid
                    const facetids = thevalue?.split(',').map(Number);
                    // const facetTypes = [];
                    const facettypelist = facetids
                        .map(facetId => {
                            for (const facetType of dlorFilterList) {
                                const facet = facetType.facet_list.find(f => f.facet_id === facetId);
                                setFilterTypesOpen([...filterTypesOpen, facetType.facet_type_id]);
                                // show
                                if (facet) {
                                    return `${facetType.facet_type_slug}-${facetId}`;
                                }
                            }
                            /* istanbul ignore next */
                            return null; // In case the facetId is not found
                        })
                        .filter(Boolean);
                    setSelectedFilters(facettypelist);
                    checkBoxArrayRef.current = facettypelist;
                }
            });
        // setLoaded(true);
        if (!filtersFound) {
            showPanel([...dlorFilterList].shift().facet_type_id);
        }
    }

    useEffect(() => {
        if (!!dlorFilterList && !!dlorList) {
            const trimmedFilterList = [...dlorFilterList];
            // Extract all unique id values from dlorList
            const idsFromDlorList = new Set();
            dlorList?.forEach(item => {
                item.object_filters.forEach(filter => {
                    filter.filter_values.forEach(value => {
                        idsFromDlorList.add(value.id);
                    });
                });
            });

            // Iterate over trimmedFilterList and remove entries not found in dlorList
            trimmedFilterList?.forEach(facetType => {
                facetType.facet_list = facetType.facet_list.filter(facet =>
                    // Check if facet_id exists in idsFromDlorList
                    idsFromDlorList.has(facet.facet_id),
                );
            });

            setFilterListTrimmed(trimmedFilterList);

            // Check the url for supplied filters and update the ui (which implies filters applying)
            setFiltersFromUrl();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dlorFilterList, dlorList]);

    function getPopupId(facetType) {
        return `dlor-list-${facetType?.facet_type_slug}-help-popup`;
    }

    function openHelpText(facetType) {
        const popupId = getPopupId(facetType);
        const popupElement = !!popupId && document.getElementById(popupId);
        !!popupElement && (popupElement.style.display = 'block');
    }

    function closeHelpText(facetType) {
        const popupId = getPopupId(facetType);
        const popupElement = !!popupId && document.getElementById(popupId);
        !!popupElement && (popupElement.style.display = 'none');
    }

    function showFilters() {
        // hide the filter icon
        const icon = document.getElementById('filterIconShowId');
        !!icon && (icon.style.display = 'none');

        // show the filter sidebar
        const block = document.getElementById('filterSidebar');
        !!block && (block.style.display = 'block');
    }
    function hideFilters() {
        // show the filter icon
        const icon = document.getElementById('filterIconShowId');
        !!icon && (icon.style.display = 'flex');

        // hide the filter sidebar
        const block = document.getElementById('filterSidebar');
        !!block && (block.style.display = 'none');
    }

    const keywordFoundIn = (object, enteredKeyword) => {
        const enteredKeywordLower = enteredKeyword.toLowerCase();
        if (
            object.object_title.toLowerCase().includes(enteredKeywordLower) ||
            object.object_description.toLowerCase().includes(enteredKeywordLower) ||
            object.object_summary.toLowerCase().includes(enteredKeywordLower)
        ) {
            return true;
        }
        if (
            !!object?.object_keywords?.some(k => {
                return k.toLowerCase().startsWith(enteredKeywordLower);
            })
        ) {
            return true;
        }
        return false;
    };

    const handleCheckboxAction = prop => e => {
        const facetTypeSlug = prop?.replace('checkbox-', '');

        const facetId = e.target.value;

        const checkboxId = `${facetTypeSlug}-${facetId}`;
        const individualFilterId = `${facetTypeSlug}-${facetId}`;

        if (e?.target?.checked) {
            const updateFilters = [...selectedFilters, individualFilterId];
            setSelectedFilters(updateFilters);

            checkBoxArrayRef.current = [...checkBoxArrayRef.current, checkboxId];
        } else {
            // unchecking a filter checkbox
            const updateFilters = selectedFilters.filter(f2 => f2 !== individualFilterId);
            setSelectedFilters(updateFilters);

            checkBoxArrayRef.current = checkBoxArrayRef.current.filter(id => id !== checkboxId);
        }
        setPaginationPage(1);

        updateUrl('filters');
    };

    function isPanelForDefault(facetTypeId) {
        const primeFacetTypeId = [...dlorFilterList].shift().facet_type_id;
        return facetTypeId === primeFacetTypeId;
    }

    function resetFiltering() {
        // clear the filter checkboxes
        setSelectedFilters([]);
        checkBoxArrayRef.current = [];
        updateUrl('filters');

        // reset panel open-close to initial position
        filterListTrimmed?.map(facetType => {
            if (isPanelForDefault(facetType?.facet_type_id)) {
                showPanel(facetType?.facet_type_id);
            } else {
                hidePanel(facetType?.facet_type_id);
            }
        });

        clearKeywordField();

        // close help dialogs
        dlorFilterList.forEach(f => closeHelpText(f));

        setPaginationPage(1);
    }

    const openPanelListContains = facetTypeid => {
        return filterTypesOpen.includes(facetTypeid);
    };

    const getPublicHelp = facetTypeSlug => {
        let result = '';
        /* istanbul ignore else */
        if (!!filterListTrimmed) {
            result = filterListTrimmed?.filter(f => f?.facet_type_slug === facetTypeSlug)?.pop()
                ?.facet_type_help_public;
        }
        return result;
    };

    const getFacetTypeIcon = facetTypeSlug => {
        const iconList = {
            item_type: <LaptopIcon aria-label={getPublicHelp(facetTypeSlug)} />,
            media_format: <DescriptionIcon aria-label={getPublicHelp(facetTypeSlug)} />,
            licence: <CopyrightIcon aria-label={getPublicHelp(facetTypeSlug)} />,
            topic: <TopicIcon aria-label={getPublicHelp(facetTypeSlug)} />,
            graduate_attributes: <SchoolSharpIcon aria-label={getPublicHelp(facetTypeSlug)} />,
            subject: <LocalLibrarySharpIcon aria-label={getPublicHelp(facetTypeSlug)} />,
        };
        return iconList[facetTypeSlug];
    };

    const slugifyName = text => {
        // Trim hyphens from the end of the text
        return text
            .toString() // Ensure the input is a string
            .toLowerCase() // Convert the string to lowercase
            .replace(/\s+/g, '_') // Replace spaces with hyphens
            .replace(/-/g, '_') // Replace spaces with hyphens
            .replace(/[^\w\-]+/g, '') // Remove all non-word characters except for hyphens
            .replace(/\-\-+/g, '_') // Replace multiple hyphens with a single hyphen
            .replace(/^-+/, '') // Trim hyphens from the start of the text
            .replace(/\//, '') // Trim slashes
            .replace(/-+$/, '');
    };

    function displayFilterSidebarContents() {
        return (
            <>
                <Grid container className={classes.filterSidebarHeading} data-testid="sidebar-panel-heading">
                    <Grid item xs={10}>
                        <Typography component={'h2'} variant={'h6'}>
                            Filters
                        </Typography>
                    </Grid>
                    <Grid item xs={1}>
                        <span
                            id="filterIconHideId"
                            data-testid="filterIconHideId"
                            className={classes.hideFilterSidebarIcon}
                        >
                            <IconButton aria-label="hide the filters" onClick={() => hideFilters()}>
                                <CloseIcon />
                            </IconButton>
                        </span>
                    </Grid>
                    <Grid item xs={1}>
                        <button
                            data-testid="sidebar-filter-reset-button"
                            className={classes.uqActionButton}
                            onClick={() => resetFiltering()}
                            aria-label="Reset filter to default"
                        >
                            Reset
                        </button>
                    </Grid>
                </Grid>
                <Grid container spacing={3} className={classes.filterSidebarBody}>
                    {filterListTrimmed?.map(facetType => {
                        return (
                            <Grid item key={facetType?.facet_type_slug} className={classes.filterSidebarType}>
                                <Grid container className={classes.filterSidebarTypeHeading}>
                                    <Grid item md={11} style={{ position: 'relative' }}>
                                        <Typography
                                            component={'h3'}
                                            variant="subtitle1"
                                            style={{ display: 'flex', alignItems: 'center' }}
                                        >
                                            {getFacetTypeIcon(facetType?.facet_type_slug)} &nbsp;{' '}
                                            {facetType?.facet_type_name}{' '}
                                            {!!facetType.facet_type_help_public && (
                                                <IconButton
                                                    aria-label="View facet help"
                                                    onClick={() => openHelpText(facetType)}
                                                    data-testid={sidebarElementId(
                                                        facetType?.facet_type_slug,
                                                        'panel-help-icon',
                                                    )}
                                                >
                                                    <HelpOutlineIcon size="small" />
                                                </IconButton>
                                            )}
                                        </Typography>
                                        <div
                                            id={getPopupId(facetType)}
                                            className={classes.filterSidebarFacetHelpPopup}
                                            style={{ display: 'none' }}
                                        >
                                            <button
                                                data-testid={sidebarElementId(
                                                    facetType?.facet_type_slug,
                                                    'panel-help-close',
                                                )}
                                                onClick={
                                                    /* istanbul ignore next */ () =>
                                                        /* istanbul ignore next */ closeHelpText(facetType)
                                                }
                                            >
                                                Close
                                            </button>
                                            {!!facetType?.facet_type_help_public &&
                                                parse(facetType.facet_type_help_public)}
                                        </div>
                                    </Grid>
                                    <Grid item md={1} className={classes.facetPanelControl}>
                                        <IconButton
                                            aria-label={
                                                openPanelListContains(facetType?.facet_type_id)
                                                    ? filterMinimiseButtonLabel
                                                    : filterMaximiseButtonLabel
                                            }
                                            data-testid={sidebarElementId(
                                                facetType?.facet_type_slug,
                                                'panel-minimisation-icon',
                                            )}
                                            onClick={() => showHidePanel(facetType?.facet_type_id)}
                                        >
                                            <KeyboardArrowUpIcon
                                                id={sidebarElementId(facetType?.facet_type_id, 'panel-uparrow')}
                                                data-testid={sidebarElementId(
                                                    facetType?.facet_type_slug,
                                                    'panel-uparrow',
                                                )}
                                                style={
                                                    openPanelListContains(facetType?.facet_type_id)
                                                        ? {}
                                                        : {
                                                              display: 'none',
                                                              visibility: 'hidden',
                                                              opacity: 0,
                                                              height: 0,
                                                          }
                                                }
                                            />
                                            <KeyboardArrowDownIcon
                                                id={sidebarElementId(facetType?.facet_type_id, 'panel-downarrow')}
                                                data-testid={sidebarElementId(
                                                    facetType?.facet_type_slug,
                                                    'panel-downarrow',
                                                )}
                                                style={
                                                    openPanelListContains(facetType?.facet_type_id)
                                                        ? {
                                                              display: 'none',
                                                              visibility: 'hidden',
                                                              opacity: 0,
                                                              height: 0,
                                                          }
                                                        : {}
                                                }
                                            />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                                <div
                                    className={classes.filterSidebarCheckboxWrapper}
                                    id={sidebarElementId(facetType?.facet_type_id)}
                                    data-testid={sidebarElementId(facetType?.facet_type_slug)}
                                    style={
                                        openPanelListContains(facetType?.facet_type_id)
                                            ? {}
                                            : { display: 'none', visibility: 'hidden', opacity: 0, height: 0 }
                                    }
                                >
                                    {!!facetType?.facet_list &&
                                        facetType?.facet_list?.length > 0 &&
                                        facetType?.facet_list?.map(facet => {
                                            const checkBoxid = `checkbox-${facetType?.facet_type_slug}`;
                                            const checkBoxidShort = `${facetType?.facet_type_slug}-${facet?.facet_id}`;
                                            return (
                                                <FormControlLabel
                                                    key={`${facetType?.facet_type_slug}-${facet?.facet_id}`}
                                                    className={classes.filterSidebarCheckboxControl}
                                                    control={
                                                        <Checkbox
                                                            // className={classes.filterSidebarCheckbox}
                                                            onChange={handleCheckboxAction(checkBoxid)}
                                                            aria-label={'Include'}
                                                            // value={facet?.facet_name}
                                                            value={facet?.facet_id}
                                                            data-testid={`checkbox-${
                                                                facetType?.facet_type_slug
                                                            }-${slugifyName(facet?.facet_name)}`}
                                                            ref={checkBoxArrayRef.current[checkBoxidShort]}
                                                            checked={
                                                                !!checkBoxArrayRef.current?.includes(checkBoxidShort)
                                                            }
                                                        />
                                                    }
                                                    label={facet?.facet_name}
                                                />
                                            );
                                        })}
                                </div>
                            </Grid>
                        );
                    })}
                </Grid>
            </>
        );
    }

    const numberItemsPerPage = 10;

    function filterDlorList() {
        const sortedList = dlorList.sort((a, b) => b.object_is_featured - a.object_is_featured);

        if (
            (!selectedFilters || selectedFilters.length === 0) &&
            (!keywordSearch || !keywordIsSearchable(keywordSearch))
        ) {
            return sortedList;
        }

        function parseSelectedFilters(selectedFilters) {
            return selectedFilters?.reduce((acc, filter) => {
                const [facetTypeSlug, facetId] = filter?.split('-');
                if (!acc[facetTypeSlug]) {
                    acc[facetTypeSlug] = [];
                }
                acc[facetTypeSlug].push(facetId);
                return acc;
            }, {});
        }

        function filterDlor(entry, groupedFilters) {
            return Object.entries(groupedFilters)?.every(([groupKey, groupValues]) =>
                entry?.object_filters?.some(
                    filterGroup =>
                        filterGroup?.filter_key === groupKey &&
                        groupValues?.some(value =>
                            filterGroup?.filter_values?.some(val => val?.id?.toString() === value),
                        ),
                ),
            );
        }

        // Group selectedFilters by facetTypeSlug
        const groupedFilters = parseSelectedFilters(selectedFilters);

        return sortedList?.filter(d => {
            const passesCheckboxFilter = filterDlor(d, groupedFilters);
            const passesKeyWordFilter =
                !keywordSearch || !keywordIsSearchable(keywordSearch) || !!keywordFoundIn(d, keywordSearch);
            return passesCheckboxFilter && passesKeyWordFilter;
        });
    }

    const paginateDlorList = pageloadShown => {
        const filteredDlorList = filterDlorList();

        const paginatedFilteredDlorList = filteredDlorList?.filter((_, index) => {
            const startIndex = (pageloadShown - 1) * numberItemsPerPage;
            const endIndex = startIndex + numberItemsPerPage;
            return index >= startIndex && index < endIndex;
        });
        return paginatedFilteredDlorList;
    };

    function navigateToDetailPage(uuid) {
        window.location.href = getDlorViewPageUrl(uuid);
    }

    function displayItemPanel(object, index) {
        function hasTopicFacet(facetTypeSlug) {
            const f = object?.object_filters?.filter(o => o.filter_key === facetTypeSlug);
            return !(!f || f.length === 0);
        }

        const getConcatenatedFilterLabels = (facetTypeSlug, wrapInParam = false) => {
            const f = object?.object_filters?.filter(o => o?.filter_key === facetTypeSlug);
            const output = f?.pop();
            const facetNames = output?.filter_values?.map(item => item.name)?.join(', ');
            return !!wrapInParam ? /* istanbul ignore next */ `(${facetNames})` : facetNames;
        };

        return (
            <Grid
                item
                xs={12}
                className={classes.panelGap}
                key={object?.object_id}
                data-testid={`dlor-homepage-panel-${object?.object_public_uuid}`}
            >
                <button
                    className={classes.dlorCard}
                    onClick={() => navigateToDetailPage(object?.object_public_uuid)}
                    aria-label={`Click for more details on ${object.object_title}`}
                    id={index === 0 ? 'first-panel-button' : null}
                >
                    <article>
                        <header>
                            <Typography component={'h2'} variant={'h6'}>
                                <span>{object?.object_title}</span>
                            </Typography>
                            <>
                                {(!!object?.object_cultural_advice ||
                                    !!object?.object_is_featured ||
                                    !!object?.object_series_name) && (
                                    <Typography
                                        component={'p'}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginLeft: -4,
                                            marginTop: -4,
                                            marginBottom: 6,
                                        }}
                                    >
                                        {!!object?.object_is_featured && (
                                            <>
                                                <BookmarkIcon style={{ fill: '#51247A', marginRight: 2, width: 20 }} />
                                                <span
                                                    className={classes.tagLabel}
                                                    data-testid={`dlor-homepage-panel-${object?.object_public_uuid}-featured`}
                                                    style={{ marginLeft: -2 }}
                                                >
                                                    Featured
                                                </span>
                                            </>
                                        )}
                                        {!!object?.object_cultural_advice && (
                                            <>
                                                <InfoIcon style={{ fill: '#2377CB', marginRight: 2, width: 20 }} />
                                                <span
                                                    className={classes.tagLabel}
                                                    data-testid={`dlor-homepage-panel-${object?.object_public_uuid}-cultural-advice`}
                                                >
                                                    Cultural advice
                                                </span>
                                            </>
                                        )}
                                        {!!object?.object_series_name && (
                                            <>
                                                <PlaylistAddCheckIcon
                                                    style={{ fill: '#4aa74e', marginRight: 2, width: 24 }}
                                                />
                                                <span
                                                    className={classes.tagLabel}
                                                    data-testid={`dlor-homepage-panel-${object?.object_public_uuid}-object_series_name`}
                                                >
                                                    Series: {object?.object_series_name}
                                                </span>
                                            </>
                                        )}
                                    </Typography>
                                )}
                            </>
                        </header>

                        <div>
                            <p>{object?.object_summary}</p>
                        </div>
                        <footer>
                            {!!hasTopicFacet('item_type') && (
                                <>
                                    {getFacetTypeIcon('item_type')}
                                    <span data-testid={`dlor-homepage-panel-${object?.object_public_uuid}-footer-type`}>
                                        {getConcatenatedFilterLabels('item_type')}
                                    </span>
                                </>
                            )}
                            {!!hasTopicFacet('media_format') && (
                                <>
                                    {getFacetTypeIcon('media_format')}
                                    <span
                                        data-testid={`dlor-homepage-panel-${object?.object_public_uuid}-footer-media`}
                                    >
                                        {getConcatenatedFilterLabels('media_format')}
                                    </span>
                                </>
                            )}
                            {!!hasTopicFacet('topic') && (
                                <>
                                    {getFacetTypeIcon('topic')}
                                    <span
                                        data-testid={`dlor-homepage-panel-${object?.object_public_uuid}-footer-topic`}
                                    >
                                        {getConcatenatedFilterLabels('topic')}
                                    </span>
                                </>
                            )}
                        </footer>
                    </article>
                </button>
            </Grid>
        );
    }

    if (!!dlorFilterListLoading || dlorFilterListLoading === null || !!dlorListLoading || dlorListLoading === null) {
        return (
            <>
                <HeroCard
                    heroTitle={heroTitleDlor}
                    heroDescription={heroDescriptionDlor}
                    heroBackgroundImage={heroBackgroundImageDlor}
                />
                <StandardPage>
                    <Grid container spacing={2}>
                        <Grid item md={12}>
                            <div style={{ minHeight: 600 }}>
                                <InlineLoader message="Loading" />
                            </div>
                        </Grid>
                    </Grid>
                </StandardPage>
            </>
        );
    }

    const handlePaginationChange = (e, value) => {
        setPaginationPage(value);
        // and scroll back to the top
        const topOfBodyElement = document.getElementById('topOfBody');
        topOfBodyElement?.scrollIntoView({ behavior: 'smooth' });
    };

    // this will eventually be an internal form
    const contactFormLink = 'https://forms.office.com/r/8t0ugSZgE7';

    return (
        <>
            <HeroCard
                heroTitle={heroTitleDlor}
                heroDescription={heroDescriptionDlor}
                heroBackgroundImage={heroBackgroundImageDlor}
            />
            <StandardPage>
                <Grid
                    container
                    style={{ marginBlock: '2em' }}
                    alignItems="center"
                    id="topOfBody"
                    justifyContent="flex-end"
                >
                    <Grid item xs={12} md={9}>
                        <Typography component={'p'} style={{ fontSize: '1.2em', fontWeight: 400 }}>
                            Find out{' '}
                            <a href="https://guides.library.uq.edu.au/teaching/link-embed-resources/digital-learning-objects">
                                how to use our digital learning objects
                            </a>
                            .
                            <button
                                className={classes.skipLink}
                                id="skip-filters"
                                onClick={/* istanbul ignore next */ () => /* istanbul ignore next */ skipToElement()}
                            >
                                Skip facet selection to view Digital Learning Hub entries
                            </button>
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={3} style={{ textAlign: 'right' }}>
                        <a
                            data-testid="dlor-homepage-contact"
                            className={classes.uqActionButton}
                            href={contactFormLink}
                            target="_blank"
                            title="Load a contact form, in a new window"
                            style={{ fontSize: '1.2em', maxWidth: '8em' }}
                        >
                            Contact us
                            <OpenInNewIcon />
                        </a>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid
                        item
                        xs={12}
                        md={3}
                        className={classes.filterSidebar}
                        id="filterSidebar"
                        data-testid="filterSidebar"
                    >
                        {(() => {
                            if (!!dlorFilterListError || !filterListTrimmed || filterListTrimmed.length === 0) {
                                return (
                                    <Typography variant="body1" data-testid="dlor-homepage-filter-error">
                                        Filters currently unavailable - please try again later.
                                    </Typography>
                                );
                            } else {
                                return displayFilterSidebarContents();
                            }
                        })()}
                    </Grid>
                    <Grid item xs={12} md={9} style={{ marginTop: 12 }}>
                        <TextField
                            className={classes.keywordSearchPanel}
                            data-testid="dlor-homepage-keyword"
                            label="Search our digital objects by keyword"
                            onChange={handleKeywordSearch}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={clearKeywordField} aria-label="search by keyword">
                                            {keyWordSearchRef.current?.value === '' ? (
                                                <SearchIcon />
                                            ) : (
                                                <CloseIcon data-testid="keyword-clear" />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            inputRef={keyWordSearchRef}
                        />
                        {(() => {
                            if (!!dlorListError) {
                                return (
                                    <Typography variant="body1" data-testid="dlor-homepage-error">
                                        {dlorListError}
                                    </Typography>
                                );
                            } else if (!dlorList || dlorList.length === 0) {
                                return (
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <Typography variant="body1" data-testid="dlor-homepage-noresult">
                                                We did not find any entries in the system - please try again later.
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                );
                            } else {
                                dlorList?.forEach(d => {
                                    // add a constructed array of facet-parent_facet-child
                                    d.constructedFilters = d?.object_filters?.flatMap(filter =>
                                        filter?.filter_values?.map(
                                            value => `${filter?.filter_key}-${slugifyName(value.id)}`,
                                        ),
                                    );
                                });

                                const dlorData = paginateDlorList(paginationPage);
                                const paginationCount = Math.ceil(filterDlorList()?.length / numberItemsPerPage);
                                if (!dlorData || dlorData.length === 0) {
                                    return (
                                        <Grid container spacing={3}>
                                            <Grid item xs={1} />
                                            <Grid item xs={11} data-testid="dlor-homepage-empty">
                                                <p>Can't find what you are looking for?</p>
                                                <ul>
                                                    <li>Check your search terms and filters are correct.</li>
                                                    <li>
                                                        You may need to uncheck filters to get results for your keyword.
                                                    </li>
                                                    <li>
                                                        You are welcome to suggest a new object via our{' '}
                                                        <a href={contactFormLink}>feedback form</a>.
                                                    </li>
                                                </ul>
                                            </Grid>
                                        </Grid>
                                    );
                                } else {
                                    return (
                                        <div className={classes.panelBody}>
                                            <LoginPrompt account={account} narrower />
                                            <Grid
                                                container
                                                spacing={3}
                                                className={classes.panelGrid}
                                                data-testid="dlor-homepage-list"
                                                id="dlor-homepage-list"
                                            >
                                                <div
                                                    id="filterIconShowId"
                                                    data-testid="filterIconShowId"
                                                    className={classes.showFilterSidebarIcon}
                                                >
                                                    <IconButton
                                                        aria-label="Show the filters"
                                                        onClick={() => showFilters()}
                                                    >
                                                        <FilterAltIcon />
                                                    </IconButton>
                                                </div>
                                                {!!dlorData &&
                                                    dlorData.length > 0 &&
                                                    dlorData.map((o, index) => displayItemPanel(o, index))}
                                                {!!dlorData && dlorData.length > 0 && (
                                                    <Pagination
                                                        count={paginationCount}
                                                        showFirstButton
                                                        showLastButton
                                                        onChange={handlePaginationChange}
                                                        page={paginationPage}
                                                        className={classes.dlorPagination}
                                                    />
                                                )}
                                            </Grid>
                                        </div>
                                    );
                                }
                            }
                        })()}
                    </Grid>
                </Grid>
            </StandardPage>
        </>
    );
};

DLOList.propTypes = {
    actions: PropTypes.any,
    dlorList: PropTypes.array,
    dlorListLoading: PropTypes.bool,
    dlorListError: PropTypes.any,
    dlorFilterList: PropTypes.array,
    dlorFilterListLoading: PropTypes.bool,
    dlorFilterListError: PropTypes.any,
    account: PropTypes.object,
};

// export default React.memo(DLOList);
export default DLOList;
