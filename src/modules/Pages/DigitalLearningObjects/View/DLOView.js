import React from 'react';
// import ContentLoader from 'react-content-loader';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';

import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';

import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';
import BookmarksIcon from '@mui/icons-material/Bookmarks';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { getHomepageLink } from 'helpers/access';

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
        '& svg': {
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
        '& svg': {
            marginBottom: 10,
            width: 10,
            marginInline: 6,
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

    console.log(dlorId, 'Loading=', dlorItemLoading, '; Error=', dlorItemError, '; dlorItem=', dlorItem);

    React.useEffect(() => {
        console.log('loading data through actions');
        if (!!dlorId) {
            actions.clearDlor();
            actions.loadADLOR(dlorId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dlorId]);

    const deslugify = slug => {
        const words = slug.replace(/_/g, ' ');
        return words.charAt(0).toUpperCase() + words.slice(1);
    };

    function getTitleBlock(detailTitle = 'View an entry') {
        return (
            <div className={classes.titleBlock}>
                <Typography component={'h1'} variant={'h6'}>
                    <a href={`${getHomepageLink()}dlor`}>Digital learning objects</a>
                </Typography>
                <ArrowForwardIcon />
                <Typography>{detailTitle}</Typography>
            </div>
        );
    }

    if (!!dlorItemLoading || dlorItemLoading === null) {
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
                    <Typography variant="body1" data-testid="dlor-detailpage-error">
                        {dlorItemError}
                    </Typography>
                </StandardCard>
            </StandardPage>
        );
    }

    if (!dlorItem || Object.keys(dlorItem).length === 0) {
        return (
            <StandardPage>
                <StandardCard className={classes.dlorEntry}>
                    {getTitleBlock()}
                    <Typography variant="body1" data-testid="dlor-detailpage-empty">
                        We could not find the requested entry - please check the web address.
                    </Typography>
                </StandardCard>
            </StandardPage>
        );
    }

    return (
        <StandardPage>
            <StandardCard className={classes.dlorEntry}>
                {getTitleBlock()}
                <Grid container spacing={4} data-testid="dlor-detailpage">
                    <Grid item xs={12} md={8}>
                        <Typography className={classes.highlighted} component={'h2'} variant={'h4'}>
                            {dlorItem.object_title}
                        </Typography>
                        <div data-testid="dlor-detailpage-description">
                            {!!dlorItem.object_description &&
                                dlorItem.object_description.split('\n').map((line, index) => <p key={index}>{line}</p>)}
                        </div>
                        {dlorItem.object_embed_type === 'link' && (
                            <div className={classes.uqActionButton}>
                                <a href={dlorItem.obj_link_url}>Access the module</a>
                            </div>
                        )}
                        {!!dlorItem.obj_download_instructions && (
                            <>
                                <Typography className={classes.highlighted} component={'h3'} variant={'h6'}>
                                    How to use this module
                                </Typography>
                                {!!dlorItem.obj_download_instructions &&
                                    dlorItem.obj_download_instructions
                                        .split('\n')
                                        .map((line, index) => <p key={index}>{line}</p>)}
                            </>
                        )}
                    </Grid>
                    <Grid item xs={12} md={4} data-testid="detaipage-metadata">
                        {dlorItem.object_filters?.length > 0 && (
                            <>
                                <Typography component={'h3'} variant={'h6'} className={classes.metaHeader}>
                                    <BookmarksIcon />
                                    Details
                                </Typography>
                                {dlorItem.object_filters.map(filter => {
                                    return (
                                        <div
                                            key={filter.filter_key}
                                            data-testid={`detailpage-filter-${filter.filter_key}`}
                                        >
                                            <Typography className={classes.highlighted} component={'h4'} variant={'h6'}>
                                                {deslugify(filter.filter_key)}
                                            </Typography>
                                            <ul className={classes.filterDisplayList}>
                                                {!!filter.filter_values &&
                                                    filter.filter_values.map((value, subIndex) => {
                                                        return <li key={subIndex}>{value}</li>;
                                                    })}
                                            </ul>
                                        </div>
                                    );
                                })}
                            </>
                        )}
                    </Grid>
                </Grid>
            </StandardCard>
        </StandardPage>
    );
};

DLOView.propTypes = {
    actions: PropTypes.any,
    dlorItem: PropTypes.any,
    dlorItemLoading: PropTypes.bool,
    dlorItemError: PropTypes.any,
};

export default React.memo(DLOView);
