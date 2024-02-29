import React from 'react';
// import ContentLoader from 'react-content-loader';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';

import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';

// https://mui.com/material-ui/material-icons/?query=computer&selected=Laptop
const MUI_ICON_LAPTOP =
    'M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2zM4 6h16v10H4z';
// https://mui.com/material-ui/material-icons/?query=arrow&selected=ArrowForwardIos
const MUI_ICON_FORWARDARROW = 'M6.23 20.23 8 22l10-10L8 2 6.23 3.77 14.46 12z';

const useStyles = makeStyles(theme => ({
    filterDisplayList: {
        listStyleType: 'none',
        paddingLeft: 0,
        '& li': {
            listStyleType: 'none',
            paddingBottom: 6,
        },
    },
    uqActionButton: {
        marginBlock: 32,
        '& a': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.white.main,
            borderColor: theme.palette.primary.main,
            borderWidth: 1,
            borderStyle: 'solid',
            borderRadius: 6,
            padding: '8px 12px',
            fontWeight: 400,
            '&:hover': {
                backgroundColor: theme.palette.white.main,
                color: theme.palette.primary.main,
                textDecoration: 'none',
            },
        },
    },
    metaHeader: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: 12,
        '& > svg': {
            width: 30,
            paddingRight: 6,
        },
    },
    highlighted: {
        color: theme.palette.primary.light,
    },
    titleBlock: {
        display: 'flex',
        alignItems: 'center',
        paddingBottom: 10,
        '& > svg': {
            //     minHeight: 'auto',
            marginBottom: 10,
        },
        '& > p': {
            // minHeight: 35,
            padding: 0,
            marginBottom: 10,
        },
        '& h1': {
            padding: 0,
            // paddingBottom: 0,
            // fontWeight: 300,
            fontSize: 16,
            minHeight: 40,
            '& a': {
                minHeight: 40, // match * above or hard to mouse over
                color: 'rgba(0, 0, 0, 0.87)',
                // a gap above the underline
                textDecoration: 'none',
                borderBottom: '1px solid #000',
                paddingBottom: 1,
                // end of gap block
                '&:hover': {
                    backgroundColor: theme.palette.secondary.main,
                    borderBottomColor: theme.palette.white.main,
                },
            },
        },
    },
    dlorEntry: {
        '& div': {
            paddingTop: 0,
        },
    },
}));

export const DLOView = ({ actions, dlorItem, dlorItemLoading, dlorItemError }) => {
    const { dlorId } = useParams();
    const classes = useStyles();

    React.useEffect(() => {
        if (!dlorItemError && !dlorItemLoading && !dlorItem) {
            actions.loadADLOR(dlorId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const cleanedFilters = [];
    !!dlorItem?.filters &&
        Object.entries(dlorItem.filters).map(([filterType, filterTypeList]) => {
            const filterItem = {
                type: filterType,
                list: filterTypeList,
            };
            cleanedFilters.push(filterItem);
        });

    const deslugify = slug => {
        const words = slug.replace(/_/g, ' ');
        return words.charAt(0).toUpperCase() + words.slice(1);
    };

    function getTitleBlock(detailTitle = 'View an entry') {
        return (
            <div className={classes.titleBlock}>
                <Typography component={'h1'} variant={'h6'}>
                    <a href="/dlor">Digital learning objects</a>
                </Typography>
                {/* convert this to a background svg on the ::before of the span? */}
                <svg style={{ width: 10, marginInline: 6 }} focusable="false" aria-hidden="true" viewBox="0 0 24 24">
                    <path d={MUI_ICON_FORWARDARROW} />
                </svg>
                <Typography>{detailTitle}</Typography>
            </div>
        );
    }

    if (!!dlorItemLoading) {
        return (
            <div style={{ minHeight: 600 }}>
                <InlineLoader message="Loading" />
            </div>
        );
    }

    if (!!dlorItemError) {
        return (
            <StandardPage>
                <StandardCard className={classes.dlorEntry}>
                    {getTitleBlock()}
                    <p>An error occurred: {dlorItemError}</p>
                </StandardCard>
            </StandardPage>
        );
    }

    return (
        <StandardPage>
            <StandardCard className={classes.dlorEntry}>
                {getTitleBlock()}
                {!dlorItem || dlorItem.length === 0 ? (
                    <p>We did not find that item in the system.</p>
                ) : (
                    <Grid container spacing={4} data-testid="dlor-detailpage">
                        <Grid item xs={12} md={8}>
                            <Typography className={classes.highlighted} component={'h2'} variant={'h4'}>
                                {dlorItem.object_title}
                            </Typography>
                            <div data-testid="dlor-detailpage-description">
                                <p>{dlorItem.object_description}</p>
                            </div>
                            {dlorItem?.object_embed_type === 'link' && (
                                <div className={classes.uqActionButton}>
                                    <a href={dlorItem.object_link}>Access the module</a>
                                </div>
                            )}
                            {!!dlorItem.object_download_instructions && (
                                <React.Fragment>
                                    <Typography className={classes.highlighted} component={'h3'} variant={'h6'}>
                                        How to use this module
                                    </Typography>
                                    <p>{dlorItem.object_download_instructions}</p>
                                </React.Fragment>
                            )}
                        </Grid>
                        <Grid item xs={12} md={4} data-testid="detaipage-metadata">
                            <Typography component={'h3'} variant={'h6'} className={classes.metaHeader}>
                                <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24">
                                    <path d={MUI_ICON_LAPTOP} />
                                </svg>
                                Details
                            </Typography>
                            {!!cleanedFilters && cleanedFilters.length > 0 ? (
                                <div>
                                    {cleanedFilters.map(filter => {
                                        return (
                                            <div key={filter.type} data-testid={`detailpage-filter-${filter.type}`}>
                                                <Typography
                                                    className={classes.highlighted}
                                                    component={'h4'}
                                                    variant={'h6'}
                                                >
                                                    {deslugify(filter.type)}
                                                </Typography>
                                                <ul className={classes.filterDisplayList}>
                                                    {!!filter.list &&
                                                        filter.list.map((value, subIndex) => {
                                                            return <li key={subIndex}>{value}</li>;
                                                        })}
                                                </ul>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p>no filters</p>
                            )}
                        </Grid>
                    </Grid>
                )}
            </StandardCard>
        </StandardPage>
    );
};

DLOView.propTypes = {
    actions: PropTypes.any,
    dlorItem: PropTypes.object,
    dlorItemLoading: PropTypes.bool,
    dlorItemError: PropTypes.any,
};

export default React.memo(DLOView);
