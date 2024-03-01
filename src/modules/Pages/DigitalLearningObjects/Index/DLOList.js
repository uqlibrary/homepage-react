import React from 'react';
import PropTypes from 'prop-types';

import { Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import DescriptionIcon from '@mui/icons-material/Description';
import LaptopIcon from '@mui/icons-material/Laptop';
import CopyrightIcon from '@mui/icons-material/Copyright';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import locale from '../../Admin/TestTag/testTag.locale';

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

    React.useEffect(() => {
        if (!dlorListError && !dlorListLoading && !dlorList) {
            actions.loadAllDLORs();
        }
        if (!dlorFilterListError && !dlorFilterListLoading && !dlorFilterList) {
            actions.loadAllFilters();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                                        <button aria-label="Minimise the filter section">
                                            <KeyboardArrowUpIcon />
                                        </button>
                                    </Grid>
                                </Grid>
                                {!!type.filter_facet_list &&
                                    type.filter_facet_list.length > 0 &&
                                    type.filter_facet_list.map(facet => {
                                        return (
                                            <FormControlLabel
                                                key={`${type.filter_slug}-${facet.facet_slug}`}
                                                className={classes.filterSidebarCheckboxControl}
                                                control={<Checkbox className={classes.filterSidebarCheckbox} />}
                                                label={facet.facet_name}
                                            />
                                        );
                                    })}
                            </Grid>
                        );
                    })}
                </Grid>
            </>
        );
    }

    function showBody() {
        return (
            <Grid container spacing={3} className={classes.panelGrid} data-testid="dlor-homepage-list">
                {dlorList.map(object => (
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
                                        {!!object?.filters?.topic && object.filters.topic.length > 0 && (
                                            <Typography className={classes.highlighted}>
                                                {object.filters.topic.join(', ')}
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
                                        {!!object?.filters?.item_type && object.filters.item_type.length > 0 && (
                                            <div
                                                data-testid={`dlor-homepage-panel-${object.object_public_uuid}-footer-type`}
                                            >
                                                <LaptopIcon />
                                                {object.filters.item_type.join(', ')}
                                            </div>
                                        )}
                                        {!!object?.filters?.media_format && object.filters.media_format.length > 0 && (
                                            <div
                                                data-testid={`dlor-homepage-panel-${object.object_public_uuid}-footer-media`}
                                            >
                                                <DescriptionIcon />
                                                {object.filters.media_format.join(', ')}
                                            </div>
                                        )}
                                        {!!object?.filters?.licence && object.filters.licence.length > 0 && (
                                            <div
                                                data-testid={`dlor-homepage-panel-${object.object_public_uuid}-footer-licence`}
                                            >
                                                <CopyrightIcon />
                                                {object.filters.licence.join(', ')}
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
            <Grid container>
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
                            return showBody();
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
