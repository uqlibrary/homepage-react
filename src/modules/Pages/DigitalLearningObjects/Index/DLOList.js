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
    filterSidebarEntry: {
        display: 'flex',
        alignItems: 'flex-start', // align checkbox and label to top of the grid
    },
    filterSidebarCheckboxControl: {
        display: 'block',
        alignItems: 'flex-start', // align checkbox and label to top of the grid
        '& span:first-child': {
            paddingBlock: 0,
        },
        paddingBottom: 5,
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

    console.log('loading=', dlorFilterListLoading, 'error=', dlorFilterListError, 'list=', dlorFilterList);

    const [selectedFilters, setSelectedFilters2] = React.useState([]);
    const setSelectedFilters = newfilter => {
        console.log('setSelectedFilters setting ', newfilter);
        setSelectedFilters2(newfilter);
    };

    React.useEffect(() => {
        console.log('ONLOAD USEEFFECT');
        if (!dlorListError && !dlorListLoading && !dlorList) {
            actions.loadAllDLORs();
        }
        if (!dlorFilterListError && !dlorFilterListLoading && !dlorFilterList) {
            actions.loadAllFilters();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
        // TODO: handle uncheck
        console.log('handleCheckboxAction', prop, e); // , e);
        console.log('e.target=', e.target);
        console.log('e.target,vale=', e.target.value);
        console.log('selectedFilters=', selectedFilters);
        if (e.target.checked) {
            console.log('Checkbox is checked');
        } else {
            console.log('Checkbox is unchecked');
        }
        const topicSlug = prop.replace('checkbox-', '');
        const filterSlug = e.target.value; // social-sciences
        console.log('topicSlug=', topicSlug);
        console.log('filterSlug=', filterSlug);

        const existingObject = selectedFilters.find(f => f.filter_key === topicSlug);
        console.log('existingObject=', existingObject);
        console.log('existingObject=', JSON.stringify(existingObject));
        if (existingObject) {
            console.log('222HERE');
            if (e.target.checked) {
                existingObject.vals.push(filterSlug);

                const tempfilters = [...selectedFilters, existingObject];
                console.log('filters-- create', tempfilters);
                setSelectedFilters(tempfilters);
            } else {
                console.log('unchecking:: start');
                let updateFilters = selectedFilters.map(f => {
                    if (f.filter_key === topicSlug) {
                        // Remove the specific value from the filter_values array
                        console.log('unchecking:: remove ', filterSlug, ' from', topicSlug);
                        f.filter_values = f.filter_values.filter(val => val !== filterSlug);
                    }
                    if (f.filter_values.length === 0) {
                        console.log('unchecking:: ', topicSlug, 'now empty');
                        return null;
                    }
                    console.log('unchecking:: return', f);
                    return f;
                });
                if (updateFilters.length === 1 && updateFilters[0] === null) {
                    updateFilters = [];
                }
                setSelectedFilters(updateFilters);
            }
        } else {
            if (e.target.checked) {
                // If the key does not exist, add a new object with the given key and val
                const tempfilters = [{ filter_key: topicSlug, filter_values: [filterSlug] }, ...selectedFilters];
                console.log('filters-- add', tempfilters);
                setSelectedFilters(tempfilters);
            } else {
                console.log('needs handling?');
            }
        }
    };

    // filter the list according to

    function showFilterSidebar() {
        return (
            <>
                <Grid container style={{ alignItems: 'center' }}>
                    <Grid item md={9} className={classes.filterSidebarHeading}>
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
                                <div id={getSidebarElementId(index)} data-testid={getSidebarElementId(index)}>
                                    {!!type.filter_facet_list &&
                                        type.filter_facet_list.length > 0 &&
                                        type.filter_facet_list.map(facet => {
                                            const checkBoxid = `checkbox-${type.filter_slug}`; // --${facet.facet_slug}`;
                                            return (
                                                <FormControlLabel
                                                    key={`${type.filter_slug}-${facet.facet_slug}`}
                                                    className={classes.filterSidebarCheckboxControl}
                                                    control={
                                                        <Checkbox
                                                            className={classes.filterSidebarCheckbox}
                                                            onChange={handleCheckboxAction(checkBoxid)}
                                                            value={facet.facet_name}
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
        console.log('testvar=', testvar);
        console.log('filterDlorList start: filters=', selectedFilters);
        console.log('filterDlorList start: dlorList=', dlorList);
        // if (!selectedFilters || Object.keys(selectedFilters).length === 0) {
        if (!selectedFilters || selectedFilters.length === 0) {
            console.log('filterDlorList: NO FILTERS! dlorList length =', dlorList.length);
            return dlorList;
        } else {
            console.log('filterDlorList: filters usable: ', selectedFilters);
        }

        const newDlorList = dlorList.filter(d => {
            // return true; // show all
            // return false; // show none
            console.log('------', d.object_title);
            // console.log('selectedFilters=', selectedFilters);
            // console.log('object filters=', d.object_filters);
            // for (const [topicName, topiclist] of Object.entries(filters)) {
            return selectedFilters.some(selectedFilter => {
                // console.log('selectedFilter=', selectedFilter);
                console.log('1 checking d.object_filters = ', d.object_filters);
                console.log('1 against ', selectedFilter);

                // filter parent object_key not found in object
                if (!d.object_filters.some(obj => obj.filter_key === selectedFilter.filter_key)) {
                    console.log('1 did not find', selectedFilter.filter_key, 'in', d.object_filters);
                    return false;
                } else {
                    console.log('1 found', selectedFilter.filter_key, 'in', d.object_filters);
                }

                return selectedFilter.filter_values.some(subFilter => {
                    console.log('2 checking d.object_filters = ', d.object_filters);
                    console.log('2 against subFilter', subFilter);
                    if (
                        !d.object_filters.some(obj => {
                            console.log('2A checking obj = ', obj);
                            console.log('2A checking obj.filter_values = ', obj.filter_values);
                            console.log('2A against subFilter', subFilter);
                            console.log('2A includes?', obj.filter_values.includes(subFilter));
                            return obj.filter_values.includes(subFilter);
                        })
                    ) {
                        console.log('2 did not find', subFilter, 'in', d.object_filters.filter_values);
                        return false;
                    } else {
                        console.log('2 found', subFilter, 'in', d.object_filters.filter_values);
                    }
                    return true;
                });

                // if (
                //     !d.object_filters.some(k => {
                //         return (k.filter_key = selectedFilter);
                //     })
                // ) {
                //     console.log(
                //         'did not find top level filter on object',
                //         `"${objectFilterEntry.filter_key}" - has entries:`,
                //         selectedFilters,
                //     );
                //     return false;
                // } else {
                //     console.log(
                //         'contineu, top level filter found',
                //         objectFilterEntry.filter_key,
                //         objectFilterEntry.filter_values,
                //     );
                //     console.log('objectFilterEntry=', objectFilterEntry);
                //     // for (const [subTopicName, subTopicValue] of Object.entries(objectFilterEntry)) {
                //     objectFilterEntry.filter_values.map(subTopicName => {
                //         // if (selectedFilters[objectFilterEntry].includes(subTopicName)) {
                //         //     console.log('did not find second level filter on object', subTopicName, objectFilterEntry);
                //         //     return false;
                //         // } else {
                //         //     console.log('OK second level filter', subTopicName);
                //         // }
                //     });
                //     // }
                // }
                console.log('should show');
                return true;
            });
        });
        // }

        console.log('filterDlorList newDlorList=', newDlorList);
        return newDlorList;
    };

    function showBody(dlorData) {
        console.log('showBody dlorData=', dlorData);
        console.log('showBody filters=', selectedFilters);

        // loop over the filters array and match it with the dlorData array

        // foreach filter type
        //     if the dlordata does not have the type or does not have any of the subtypes on this filter type
        //     return null

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
                                            {!!object?.object_filters?.topic &&
                                                object.object_filters.topic.length > 0 && (
                                                    <Typography className={classes.highlighted}>
                                                        {object.object_filters.topic.join(', ')}
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
                                            {!!object?.object_filters?.item_type &&
                                                object.object_filters.item_type.length > 0 && (
                                                    <div
                                                        data-testid={`dlor-homepage-panel-${object.object_public_uuid}-footer-type`}
                                                    >
                                                        <LaptopIcon />
                                                        {object.object_filters.item_type.join(', ')}
                                                    </div>
                                                )}
                                            {!!object?.object_filters?.media_format &&
                                                object.object_filters.media_format.length > 0 && (
                                                    <div
                                                        data-testid={`dlor-homepage-panel-${object.object_public_uuid}-footer-media`}
                                                    >
                                                        <DescriptionIcon />
                                                        {object.object_filters.media_format.join(', ')}
                                                    </div>
                                                )}
                                            {!!object?.object_filters?.licence &&
                                                object.object_filters.licence.length > 0 && (
                                                    <div
                                                        data-testid={`dlor-homepage-panel-${object.object_public_uuid}-footer-licence`}
                                                    >
                                                        <CopyrightIcon />
                                                        {object.object_filters.licence.join(', ')}
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
                    <region>
                        {(() => {
                            if (!!dlorFilterListLoading || dlorFilterListLoading === null) {
                                return (
                                    <div style={{ minHeight: 600 }}>
                                        <InlineLoader message="Loading" />
                                    </div>
                                );
                            } else if (!!dlorFilterListError) {
                                return (
                                    <Typography variant="body1">
                                        An error occurred: {dlorFilterListError}; Please refesh or try again later.
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
                    </region>
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
                            return <p>An error occurred: {dlorListError}</p>;
                        } else if (!dlorList || dlorList.length === 0) {
                            return <p>We did not find any entries in the system - please try again later.</p>;
                        } else {
                            return showBody(filterDlorList());
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
