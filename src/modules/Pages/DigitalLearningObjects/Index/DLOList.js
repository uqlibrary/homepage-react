import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import { Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';

import DescriptionIcon from '@mui/icons-material/Description';
import LaptopIcon from '@mui/icons-material/Laptop';
import CopyrightIcon from '@mui/icons-material/Copyright';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { getHomepageLink } from 'helpers/access';

const useStyles = makeStyles(theme => ({
    panelGap: {
        paddingLeft: 16,
        paddingBottom: 24,
        paddingTop: '0 !important',
    },
    panelGrid: {
        paddingLeft: 12,
        paddingRight: 12,
        marginBlock: 6,
        display: 'flex',
        alignItems: 'stretch', // panels fill the screen with equal width
    },
    // dlorCard: {
    //     border: '1px solid green',
    //     '& > div': {
    //         border: '1px solid blue',
    //     },
    // },
    article: {
        // border: '1px solid red',
        '& header': {
            '& h2': {
                lineHeight: 1.3,
            },
            // backgroundColor: '#ffffd1',
        },
        '& footer': {
            marginTop: 24,
            color: theme.palette.primary.light,
            fontWeight: 400,
            '& > div': {
                display: 'flex',
                alignItems: 'center', // center align icon and label horizontally
                paddingBlock: 3,
            },
            '& svg': {
                width: 20,
                paddingRight: 4,
                '& > path': {
                    fill: theme.palette.primary.light,
                },
            },
            // backgroundColor: '#dbffd6',
        },
    },
    // articleContents: {
    //     backgroundColor: '#fbe4ff',
    // },
    highlighted: {
        color: theme.palette.primary.light,
        fontWeight: 400,
    },
    navigateToDetail: {
        '&:hover': {
            textDecoration: 'none',
            '& > div': {
                backgroundColor: '#f2f2f2',
            },
        },
    },
    filterSidebar: {
        fontSize: 10,
        [theme.breakpoints.down('md')]: {
            display: 'none',
        },
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
        alignItems: 'center',
        paddingBottom: 4,
    },
    filterSidebarType: {
        width: '100%',
        borderBottom: '1px solid #e1e1e1',
        paddingTop: '0!important',
        paddingBottom: 16,
        marginTop: 16,
        paddingLeft: '0!important',
        marginLeft: 24,
    },
    filterSidebarTypeHeading: {
        display: 'flex',
        paddingLeft: 0,
        justifyContent: 'space-between',
        paddingTop: 0,
        '& h3': {
            fontWeight: 500,
        },
        '& button': {
            borderWidth: 0,
            backgroundColor: '#f7f7f7',
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
    filterResetButton: {
        borderWidth: 0,
        backgroundColor: '#f7f7f7',
        color: 'rgb(13, 109, 205)',
        fontSize: 14,
        letterSpacing: '0.03em',
        minHeight: 40,
        cursor: 'pointer',
        '&:hover': {
            textDecoration: 'underline',
            textDecorationColor: 'rgb(13, 109, 205)',
        },
    },
    loginAlert: {
        backgroundColor: '#dcedfd',
        color: 'rgba(0, 0, 0, 0.87)',
        fontWeight: 400,
        lineHeight: 1.5,
        marginRight: 12,
        marginLeft: 12,
        marginBottom: 12,
        padding: 12,
        display: 'flex',
        alignItems: 'center',
        '& span': {
            marginLeft: 10,
        },
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

    const [selectedFilters, setSelectedFilters] = React.useState([]);
    const checkBoxArrayRef = useRef([]);

    React.useEffect(() => {
        if (!dlorListError && !dlorListLoading && !dlorList) {
            actions.loadAllDLORs();
        }
        if (!dlorFilterListError && !dlorFilterListLoading && !dlorFilterList) {
            actions.loadAllFilters();
        }
    }, [dlorList, dlorFilterList]);

    // useEffect(() => {
    //     checkBoxArrayRef.current = checkBoxArrayRef.current.slice(0, dlorFilterList.length);
    // }, [dlorFilterList]);

    function hideElement(element, displayproperty = null) {
        !!element && (element.style.display = 'none');
        !!element && (element.style.visibility = 'hidden');
        !!element && (element.style.opacity = 0);
        !!element && (element.style.height = 0);
        !!displayproperty && !!element && (element.style.display = displayproperty);
    }

    function showElement(element, displayproperty = null) {
        !!element && (element.style.display = 'inline-block');
        !!element && (element.style.visibility = 'visible');
        !!element && (element.style.opacity = 1);
        !!element && (element.style.height = 'auto');
        !!displayproperty && !!element && (element.style.display = displayproperty);
    }

    const sidebarElementId = (index, elementSlug = 'sidebar-panel') => `${elementSlug}-${index}`;

    const panelId = index => sidebarElementId(index);
    const UpArrowId = index => sidebarElementId(index, 'panel-uparrow');
    const DownArrowId = index => sidebarElementId(index, 'panel-downarrow');

    const filterButtonLabel = actionLabel => actionLabel + ' this filter section';
    const filterMaximiseButtonLabel = filterButtonLabel('Open');
    const filterMinimiseButtonLabel = filterButtonLabel('Close');
    function hidePanel(index) {
        const facetPanel = document.getElementById(panelId(index));
        const upArrowIcon = document.getElementById(UpArrowId(index));
        const downArrowIcon = document.getElementById(DownArrowId(index));
        hideElement(facetPanel);
        showElement(downArrowIcon, 'inline-block');
        !!downArrowIcon && downArrowIcon.parentElement.setAttribute('aria-label', filterMaximiseButtonLabel);
        hideElement(upArrowIcon, 'none');
    }

    function showPanel(index) {
        const facetPanel = document.getElementById(panelId(index));
        const upArrowIcon = document.getElementById(UpArrowId(index));
        const downArrowIcon = document.getElementById(DownArrowId(index));
        showElement(facetPanel);
        hideElement(downArrowIcon, 'none');
        showElement(upArrowIcon, 'inline-block');
        !!upArrowIcon && upArrowIcon.parentElement.setAttribute('aria-label', filterMinimiseButtonLabel);
    }

    function showHidePanel(index) {
        const upArrowIcon = document.getElementById(UpArrowId(index));
        const downArrowIcon = document.getElementById(DownArrowId(index));
        if (
            (!!downArrowIcon && downArrowIcon.style.display === 'none') ||
            (!!downArrowIcon && upArrowIcon.style.display !== 'none')
        ) {
            hidePanel(index);
        } else if (
            (!!downArrowIcon && downArrowIcon.style.display !== 'none') ||
            (!!downArrowIcon && upArrowIcon.style.display === 'none')
        ) {
            showPanel(index);
        }
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

    function findFacetSlugByName(facetName) {
        for (const facetType of dlorFilterList) {
            for (const facet of facetType.facet_list) {
                if (facet.facet_name === facetName) {
                    return facet.facet_slug;
                }
            }
        }

        return null; // Return null if no matching facet_name is found
    }

    const handleCheckboxAction = prop => e => {
        const facetTypeSlug = prop.replace('checkbox-', '');

        const facetName = e.target.value;
        const facetSlug = findFacetSlugByName(facetName);

        const checkboxId = `${facetTypeSlug}-${facetSlug}`;
        const individualFilterSlug = `${facetTypeSlug}-${facetSlug}`;

        if (e.target.checked) {
            setSelectedFilters([...selectedFilters, individualFilterSlug]);

            checkBoxArrayRef.current = [...checkBoxArrayRef.current, checkboxId];
        } else {
            const updateFilters = selectedFilters.filter(f2 => f2 !== individualFilterSlug);
            setSelectedFilters(updateFilters);

            checkBoxArrayRef.current = checkBoxArrayRef.current.filter(item => item !== checkboxId);
        }
    };

    function isFirstFilterPanel(index) {
        return index > 0;
    }

    function resetFilters() {
        // reshow the panels
        setSelectedFilters([]);

        // clear the filter checkboxes
        checkBoxArrayRef.current = [];

        // reset panel open-close to initial position
        dlorFilterList.map((facetType, index) => {
            if (isFirstFilterPanel(index)) {
                hidePanel(index);
            } else {
                showPanel(index);
            }
        });
    }

    function displayFilterSidebarContents() {
        return (
            <>
                <Grid container className={classes.filterSidebarHeading} data-testid="sidebar-panel-heading">
                    <Grid item md={9}>
                        <div
                            id="filterIconHideId"
                            data-testid="filterIconHideId"
                            className={classes.hideFilterSidebarIcon}
                        >
                            <IconButton aria-label="hide the filters" onClick={() => hideFilters()}>
                                <CloseIcon />
                            </IconButton>
                        </div>
                        <Typography component={'h2'} variant={'h6'}>
                            Filters
                        </Typography>
                    </Grid>
                    <Grid item md={3}>
                        <button
                            data-testid="sidebar-filter-reset-button"
                            className={classes.filterResetButton}
                            onClick={() => resetFilters()}
                            aria-label="Reset filter to default"
                        >
                            Reset
                        </button>
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    {dlorFilterList.map((facetType, index) => {
                        return (
                            <Grid item key={facetType.facet_type_slug} className={classes.filterSidebarType}>
                                <Grid container className={classes.filterSidebarTypeHeading}>
                                    <Grid item md={11}>
                                        <Typography component={'h3'} variant="subtitle1">
                                            {facetType.facet_type_name}
                                        </Typography>
                                    </Grid>
                                    <Grid item md={1} className={classes.facetPanelControl}>
                                        <IconButton
                                            aria-label={
                                                isFirstFilterPanel(index)
                                                    ? filterMaximiseButtonLabel
                                                    : filterMinimiseButtonLabel
                                            }
                                            data-testid={sidebarElementId(index, 'panel-minimisation-icon')}
                                            onClick={() => showHidePanel(index)}
                                        >
                                            <KeyboardArrowUpIcon
                                                id={sidebarElementId(index, 'panel-uparrow')}
                                                data-testid={sidebarElementId(index, 'panel-uparrow')}
                                                style={
                                                    isFirstFilterPanel(index)
                                                        ? {
                                                              display: 'none',
                                                              visibility: 'hidden',
                                                              opacity: 0,
                                                              height: 0,
                                                          }
                                                        : {}
                                                }
                                            />
                                            <KeyboardArrowDownIcon
                                                id={sidebarElementId(index, 'panel-downarrow')}
                                                data-testid={sidebarElementId(index, 'panel-downarrow')}
                                                style={
                                                    !isFirstFilterPanel(index)
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
                                    id={sidebarElementId(index)}
                                    data-testid={sidebarElementId(index)}
                                    style={
                                        index > 0
                                            ? {
                                                  display: 'none',
                                                  visibility: 'hidden',
                                                  opacity: 0,
                                                  height: 0,
                                              }
                                            : {}
                                    }
                                >
                                    {!!facetType.facet_list &&
                                        facetType.facet_list.length > 0 &&
                                        facetType.facet_list.map(facet => {
                                            const checkBoxid = `checkbox-${facetType.facet_type_slug}`;
                                            const checkBoxidShort = `${facetType.facet_type_slug}-${facet.facet_slug}`;
                                            return (
                                                <FormControlLabel
                                                    key={`${facetType.facet_type_slug}-${facet.facet_slug}`}
                                                    className={classes.filterSidebarCheckboxControl}
                                                    control={
                                                        <Checkbox
                                                            className={classes.filterSidebarCheckbox}
                                                            onChange={handleCheckboxAction(checkBoxid)}
                                                            aria-label={'Include'}
                                                            value={facet.facet_name}
                                                            data-testid={`checkbox-${facetType.facet_type_slug}-${facet.facet_slug}`}
                                                            ref={checkBoxArrayRef.current[checkBoxidShort]}
                                                            checked={
                                                                !!checkBoxArrayRef.current.includes(checkBoxidShort)
                                                            }
                                                        />
                                                    }
                                                    label={facet.facet_name}
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
            .replace(/-+$/, '');
    };

    const filterDlorList = () => {
        const testvar = [];
        if (!selectedFilters || selectedFilters.length === 0) {
            return dlorList;
        }

        return dlorList.filter(d => {
            return (
                !!d?.constructedFilters &&
                !!selectedFilters &&
                selectedFilters.every(el => d?.constructedFilters.includes(el))
            );
        });
    };

    const getPublicHelp = facetTypeSlug =>
        !!dlorFilterList
            ? dlorFilterList.filter(f => f.facet_type_slug === facetTypeSlug).pop().facet_type_help_public
            : '';

    function displayItemPanel(object) {
        const getConcatenatedFilterLabels = facetTypeSlug => {
            const f = object.object_filters?.filter(o => o.filter_key === facetTypeSlug);
            if (!f || f.length === 0) {
                return false;
            }
            const output = f.pop();
            return output?.filter_values?.length > 0
                ? output.filter_values.join(', ')
                : /* istanbul ignore next */ false;
        };
        const footerElementType = getConcatenatedFilterLabels('item_type');
        const footerElementMedia = getConcatenatedFilterLabels('media_format');
        const footerElementLicence = getConcatenatedFilterLabels('licence');
        const headerElementTopic = getConcatenatedFilterLabels('topic');

        return (
            <Grid
                item
                xs={12}
                md={4}
                className={classes.panelGap}
                key={object.object_id}
                data-testid={`dlor-homepage-panel-${object.object_public_uuid}`}
            >
                <a
                    className={classes.navigateToDetail}
                    href={`${getHomepageLink()}dlor/view/${object.object_public_uuid}`}
                >
                    <StandardCard noHeader fullHeight className={classes.dlorCard}>
                        <article className={classes.article}>
                            <header>
                                {!!headerElementTopic && (
                                    <Typography className={classes.highlighted}>{headerElementTopic}</Typography>
                                )}
                                <Typography component={'h2'} variant={'h6'}>
                                    {object.object_title}
                                </Typography>
                            </header>
                            <div className={classes.articleContents}>
                                <p>{object.object_summary}</p>
                            </div>

                            <footer>
                                {!!footerElementType && (
                                    <div data-testid={`dlor-homepage-panel-${object.object_public_uuid}-footer-type`}>
                                        <LaptopIcon aria-label={getPublicHelp('item_type')} />
                                        {footerElementType}
                                    </div>
                                )}
                                {!!footerElementMedia && (
                                    <div data-testid={`dlor-homepage-panel-${object.object_public_uuid}-footer-media`}>
                                        <DescriptionIcon aria-label={getPublicHelp('media_format')} />
                                        {footerElementMedia}
                                    </div>
                                )}
                                {!!footerElementLicence && (
                                    <div
                                        data-testid={`dlor-homepage-panel-${object.object_public_uuid}-footer-licence`}
                                    >
                                        <CopyrightIcon aria-label={getPublicHelp('licence')} />
                                        {footerElementLicence}
                                    </div>
                                )}
                            </footer>
                        </article>
                    </StandardCard>
                </a>
            </Grid>
        );
    }

    if (!!dlorFilterListLoading || dlorFilterListLoading === null || !!dlorListLoading || dlorListLoading === null) {
        return (
            <StandardPage>
                <Typography component={'h1'} variant={'h6'}>
                    Digital learning objects
                </Typography>
                <Grid container spacing={2}>
                    <Grid item md={12}>
                        <div style={{ minHeight: 600 }}>
                            <InlineLoader message="Loading" />
                        </div>
                    </Grid>
                </Grid>
            </StandardPage>
        );
    }

    return (
        <StandardPage>
            <Typography component={'h1'} variant={'h6'}>
                Digital learning objects
            </Typography>
            <Grid container spacing={2}>
                <Grid item md={3} className={classes.filterSidebar} id="filterSidebar" data-testid="filterSidebar">
                    {(() => {
                        if (!!dlorFilterListError || !dlorFilterList || dlorFilterList.length === 0) {
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
                <Grid item xs={12} md={9}>
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
                                        <Typography variant="body1" data-testid="dlor-homepage-empty">
                                            We did not find any entries in the system - please try again later.
                                        </Typography>
                                    </Grid>
                                </Grid>
                            );
                        } else {
                            dlorList.forEach(d => {
                                // add a constructed array of facet-parent_facet-child
                                d.constructedFilters = d.object_filters.flatMap(filter =>
                                    filter.filter_values.map(value => `${filter.filter_key}-${slugifyName(value)}`),
                                );
                            });

                            const dlorData = filterDlorList();
                            if (!dlorData || dlorData.length === 0) {
                                return (
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <Typography variant="body1">
                                                No records satisfied this filter selection.
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                );
                            } else {
                                const loginLink = `https://auth.library.uq.edu.au/login?return=${window.btoa(
                                    window.location.href,
                                )}`;
                                return (
                                    <>
                                        {!account?.id && (
                                            <div data-testid="dlor-homepage-loginprompt" className={classes.loginAlert}>
                                                <InfoIcon />
                                                <span>
                                                    <a style={{ color: '#1e72c6' }} href={loginLink}>
                                                        Login
                                                    </a>{' '}
                                                    for a better experience
                                                </span>
                                            </div>
                                        )}
                                        <Grid
                                            container
                                            spacing={3}
                                            className={classes.panelGrid}
                                            data-testid="dlor-homepage-list"
                                        >
                                            <div
                                                id="filterIconShowId"
                                                data-testid="filterIconShowId"
                                                className={classes.showFilterSidebarIcon}
                                            >
                                                <IconButton aria-label="show the filters" onClick={() => showFilters()}>
                                                    <FilterAltIcon />
                                                </IconButton>
                                            </div>
                                            {!!dlorData &&
                                                dlorData.length > 0 &&
                                                dlorData.map(o => displayItemPanel(o))}
                                        </Grid>
                                    </>
                                );
                            }
                        }
                    })()}
                </Grid>
            </Grid>
        </StandardPage>
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
