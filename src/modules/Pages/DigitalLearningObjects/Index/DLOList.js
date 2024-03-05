import React from 'react';
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

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';

const useStyles = makeStyles(theme => ({
    panelGap: {
        [theme.breakpoints.up('md')]: {
            paddingLeft: 16,
        },
        [theme.breakpoints.down('md')]: {
            paddingTop: 16,
        },
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
    },
    filterSidebarHeading: {
        alignItems: 'center',
    },
    filterSidebarType: {
        width: '100%',
        borderBottom: '1px solid #e1e1e1',
    },
    filterSidebarTypeHeading: {
        paddingLeft: 0,
        justifyContent: 'space-between',
        '& h3': {
            fontWeight: 500,
        },
        '& button': {
            borderWidth: 0,
            backgroundColor: '#f7f7f7',
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
}));

export const DLOList = ({
    actions,
    dlorList,
    dlorListLoading,
    dlorListError,
    dlorFilterList,
    dlorFilterListLoading,
    dlorFilterListError,
}) => {
    const classes = useStyles();

    const [selectedFilters, setSelectedFilters] = React.useState([]);

    React.useEffect(() => {
        if (!dlorListError && !dlorListLoading && !dlorList) {
            actions.loadAllDLORs();
        }
        if (!dlorFilterListError && !dlorFilterListLoading && !dlorFilterList) {
            actions.loadAllFilters();
        }
    }, [dlorList, dlorFilterList]);

    const getSidebarElementId = (index, elementSlug = 'sidebar-panel') => `${elementSlug}-${index}`;

    function hideElement(element, displayproperty = null) {
        !!element && (element.style.visibility = 'hidden');
        !!element && (element.style.opacity = 0);
        !!element && (element.style.height = 0);
        !!displayproperty && !!element && (element.style.display = displayproperty);
    }

    function showElement(element, displayproperty = null) {
        !!element && (element.style.visibility = 'visible');
        !!element && (element.style.opacity = 1);
        !!element && (element.style.height = 'auto');
        !!displayproperty && !!element && (element.style.display = displayproperty);
    }

    function hidePanel(index) {
        const facetPanel = document.getElementById(panelId(index));
        const upArrowIcon = document.getElementById(UpArrowId(index));
        const downArrowIcon = document.getElementById(DownArrowId(index));
        hideElement(facetPanel);
        showElement(downArrowIcon, 'inline-block');
        hideElement(upArrowIcon, 'none');
    }

    function showPanel(index) {
        const facetPanel = document.getElementById(panelId(index));
        const upArrowIcon = document.getElementById(UpArrowId(index));
        const downArrowIcon = document.getElementById(DownArrowId(index));
        showElement(facetPanel);
        hideElement(downArrowIcon, 'none');
        showElement(upArrowIcon, 'inline-block');
    }

    const panelId = index => getSidebarElementId(index);
    const UpArrowId = index => getSidebarElementId(index, 'panel-uparrow');
    const DownArrowId = index => getSidebarElementId(index, 'panel-downarrow');

    function showHidePanel(index) {
        const downArrowIcon = document.getElementById(DownArrowId(index));
        if (!!downArrowIcon && downArrowIcon.style.display === 'none') {
            hidePanel(index);
        } else if (!!downArrowIcon && downArrowIcon.style.display === 'inline-block') {
            showPanel(index);
        }
    }

    const handleCheckboxAction = prop => e => {
        const topicSlug = prop.replace('checkbox-', '');
        const filterSlug = e.target.value;

        const existingObject = selectedFilters.find(f => f.filter_key === topicSlug);
        if (existingObject) {
            if (e.target.checked) {
                existingObject.filter_values.push(filterSlug);

                const tempfilters = [...selectedFilters, existingObject];
                console.log('filters-- create', tempfilters);
                setSelectedFilters(tempfilters);
            } else {
                let updateFilters = selectedFilters.map(f => {
                    if (f.filter_key === topicSlug) {
                        // Remove the specific value from the filter_values array
                        f.filter_values = f.filter_values.filter(val => val !== filterSlug);
                    }
                    if (f.filter_values.length === 0) {
                        return null;
                    }
                    return f;
                });
                updateFilters = updateFilters.filter(item => item !== null);
                setSelectedFilters(updateFilters);
            }
        } else {
            if (e.target.checked) {
                // If the key does not exist, add a new object with the given key and val
                const tempfilters = [{ filter_key: topicSlug, filter_values: [filterSlug] }, ...selectedFilters];
                setSelectedFilters(tempfilters);
            }
        }
    };

    function showFilterSidebar() {
        return (
            <>
                <Grid container className={classes.filterSidebarHeading} data-testid="sidebar-panel-heading">
                    <Grid item md={9}>
                        <Typography component={'h2'} variant={'h6'} style={{ marginLeft: -10 }}>
                            Filters
                        </Typography>
                    </Grid>
                    <Grid item md={3}>
                        <button className={classes.filterResetButton}>Reset</button>
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    {dlorFilterList.map((type, index) => {
                        return (
                            <Grid item key={index} className={classes.filterSidebarType}>
                                <Grid container className={classes.filterSidebarTypeHeading}>
                                    <Grid item md={11}>
                                        <Typography component={'h3'} variant="subtitle1">
                                            {type.filter_name}
                                        </Typography>
                                    </Grid>
                                    <Grid item md={1}>
                                        <IconButton
                                            aria-label="Minimise the filter section"
                                            data-testid={getSidebarElementId(index, 'panel-minimisation-icon')}
                                            onClick={() => showHidePanel(index)}
                                        >
                                            <KeyboardArrowUpIcon id={getSidebarElementId(index, 'panel-uparrow')} />
                                            <KeyboardArrowDownIcon
                                                id={getSidebarElementId(index, 'panel-downarrow')}
                                                style={{ display: 'none', visibility: 'hidden', opacity: 0, height: 0 }}
                                            />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                                <div
                                    className={classes.filterSidebarCheckboxWrapper}
                                    id={getSidebarElementId(index)}
                                    data-testid={getSidebarElementId(index)}
                                >
                                    {!!type.filter_facet_list &&
                                        type.filter_facet_list.length > 0 &&
                                        type.filter_facet_list.map(facet => {
                                            const checkBoxid = `checkbox-${type.filter_slug}`;
                                            return (
                                                <FormControlLabel
                                                    key={`${type.filter_slug}-${facet.facet_slug}`}
                                                    className={classes.filterSidebarCheckboxControl}
                                                    control={
                                                        <Checkbox
                                                            className={classes.filterSidebarCheckbox}
                                                            onChange={handleCheckboxAction(checkBoxid)}
                                                            value={facet.facet_name}
                                                            data-testid={`checkbox-${type.filter_slug}-${facet.facet_slug}`}
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

    const filterDlorList = () => {
        const testvar = [];
        if (!selectedFilters || selectedFilters.length === 0) {
            return dlorList;
        }

        return dlorList.filter(d => {
            return (
                !!selectedFilters &&
                selectedFilters.some(selectedFilter => {
                    // filter parent object_key not found in object
                    /* istanbul ignore next */
                    if (!d?.object_filters?.some(obj => obj.filter_key === selectedFilter.filter_key)) {
                        return false;
                    }

                    return selectedFilter.filter_values.some(subFilter => {
                        return !!d.object_filters.some(obj => {
                            return obj.filter_values.includes(subFilter);
                        });
                    });
                })
            );
        });
    };

    function showBody(dlorData) {
        const getFilters = (topicSlug, object) => {
            const f = object.object_filters?.filter(o => o.filter_key === topicSlug);
            if (!f || f.length === 0) {
                return false;
            }
            const output = f.pop();
            return output?.filter_values?.length > 0
                ? output.filter_values.join(', ')
                : /* istanbul ignore next */ false;
        };

        const footerElementType = object => getFilters('item_type', object);
        const footerElementMedia = object => getFilters('media_format', object);
        const footerElementLicence = object => getFilters('licence', object);
        const headerElementTopic = object => getFilters('topic', object);

        return (
            <Grid container spacing={3} className={classes.panelGrid} data-testid="dlor-homepage-list">
                {!!dlorData &&
                    dlorData.length > 0 &&
                    dlorData.map(object => (
                        <Grid
                            item
                            xs={12}
                            md={4}
                            className={classes.panelGap}
                            key={object.object_id}
                            data-testid={`dlor-homepage-panel-${object.object_public_uuid}`}
                        >
                            <a className={classes.navigateToDetail} href={`/dlor/view/${object.object_public_uuid}`}>
                                <StandardCard noHeader fullHeight className={classes.dlorCard}>
                                    <article className={classes.article}>
                                        <header>
                                            {headerElementTopic(object).length > 0 && (
                                                <Typography className={classes.highlighted}>
                                                    {headerElementTopic(object)}
                                                </Typography>
                                            )}
                                            <Typography component={'h2'} variant={'h6'}>
                                                {object.object_title}
                                            </Typography>
                                        </header>
                                        <div className={classes.articleContents}>
                                            <p>{object.object_summary}</p>
                                        </div>

                                        <footer>
                                            {footerElementType(object).length > 0 && (
                                                <div
                                                    data-testid={`dlor-homepage-panel-${object.object_public_uuid}-footer-type`}
                                                >
                                                    <LaptopIcon />
                                                    {footerElementType(object)}
                                                </div>
                                            )}
                                            {footerElementMedia(object).length > 0 && (
                                                <div
                                                    data-testid={`dlor-homepage-panel-${object.object_public_uuid}-footer-media`}
                                                >
                                                    <DescriptionIcon />
                                                    {footerElementMedia(object)}
                                                </div>
                                            )}
                                            {footerElementLicence(object).length > 0 && (
                                                <div
                                                    data-testid={`dlor-homepage-panel-${object.object_public_uuid}-footer-licence`}
                                                >
                                                    <CopyrightIcon />
                                                    {footerElementLicence(object)}
                                                </div>
                                            )}
                                        </footer>
                                    </article>
                                </StandardCard>
                            </a>
                        </Grid>
                    ))}
            </Grid>
        );
    }

    return (
        <StandardPage>
            <Typography component={'h1'} variant={'h6'}>
                Digital learning objects
            </Typography>
            <Grid container spacing={2}>
                <Grid item md={3} className={classes.filterSidebar}>
                    {(() => {
                        if (!!dlorFilterListLoading || dlorFilterListLoading === null) {
                            return (
                                <div style={{ minHeight: 600 }}>
                                    <InlineLoader message="Loading" />
                                </div>
                            );
                        } else if (!!dlorFilterListError) {
                            return (
                                <Typography variant="body1" data-testid="dlor-homepage-filter-error">
                                    {dlorFilterListError}
                                </Typography>
                            );
                        } else if (!dlorFilterList || dlorFilterList.length === 0) {
                            return (
                                <Typography variant="body1">
                                    We did not find any entries in the system - please try again later.
                                </Typography>
                            );
                        } else {
                            return showFilterSidebar();
                        }
                    })()}
                </Grid>
                <Grid item md={9}>
                    {(() => {
                        if (!!dlorListLoading || dlorListLoading === null) {
                            return (
                                <div style={{ minHeight: 600 }}>
                                    <InlineLoader message="Loading" />
                                </div>
                            );
                        } else if (!!dlorListError) {
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
                                return showBody(dlorData);
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
};

export default React.memo(DLOList);
