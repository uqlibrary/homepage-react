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

import LoginPrompt from 'modules/Pages/DigitalLearningObjects/SharedComponents/LoginPrompt';
import {
    displayDownloadInstructions,
    getVimeoViewableUrl,
    getYoutubeViewableUrl,
    isPreviewableUrl,
} from 'modules/Pages/DigitalLearningObjects/dlorHelpers';

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
        marginBottom: 20,
        '& p:first-child': {
            padding: 0,
            fontSize: 16,
            '& a': {
                color: 'rgba(0, 0, 0, 0.87)',
            },
        },
        '& svg': {
            width: 10,
            marginInline: 6,
        },
        '& > p:nth-child(2)': {
            padding: 0,
        },
    },
    // dlorEntry: {
    //     '& div': {
    //         paddingTop: 0,
    //     },
    // },
    downloadInstructions: {
        lineHeight: 1.5,
    },
    videoResponsive: {
        overflow: 'hidden',
        paddingBottom: '56.25%',
        position: 'relative',
        height: 0,
        '& iframe': {
            left: 0,
            top: 0,
            height: '100%',
            width: '100%',
            position: 'absolute',
        },
    },
}));

export const DLOView = ({ actions, dlorItem, dlorItemLoading, dlorItemError, account }) => {
    const { dlorId } = useParams();
    const classes = useStyles();

    console.log(dlorId, 'Loading=', dlorItemLoading, '; Error=', dlorItemError, '; dlorItem=', dlorItem);

    React.useEffect(() => {
        if (!!dlorId) {
            actions.clearADlor();
            actions.loadADLOR(dlorId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dlorId]);

    const deslugify = slug => {
        const words = slug?.replace(/_/g, ' ');
        return words?.charAt(0).toUpperCase() + words?.slice(1);
    };

    function getTitleBlock(detailTitle = 'View an entry') {
        return (
            <div className={classes.titleBlock}>
                <Typography component={'p'} variant={'h6'} data-testid="dlor-detailpage-sitelabel">
                    <a href={`${getHomepageLink()}digital-learning-hub`}>Find a digital learning object</a>
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

    if (!dlorItem || Object.keys(dlorItem)?.length === 0) {
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

    const getYoutubeEmbeddableUrl = urlIn => {
        const url = getYoutubeViewableUrl(urlIn); // assumes is return in ?v= format
        if (url === false) {
            return false;
        }
        return url.replace('?v=', 'embed/');
    };
    const getVimeoEmbeddableUrl = urlIn => {
        const url = getVimeoViewableUrl(urlIn); // assumes is return in ?v= format
        if (url === false) {
            return false;
        }
        return url.replace('?v=', 'embed/');
    };
    return (
        <StandardPage>
            <StandardCard className={classes.dlorEntry}>
                {getTitleBlock()}
                <Grid container spacing={4} data-testid="dlor-detailpage">
                    <Grid item xs={12} md={8}>
                        <div style={{ marginBottom: 12 }}>
                            <LoginPrompt account={account} />
                        </div>
                        <Typography className={classes.highlighted} component={'h1'} variant={'h4'}>
                            {dlorItem?.object_title}
                        </Typography>
                        <div data-testid="dlor-detailpage-description">
                            {!!dlorItem?.object_description &&
                                dlorItem?.object_description
                                    ?.split('\n')
                                    ?.map((line, index) => <p key={index}>{line}</p>)}
                        </div>
                        {dlorItem?.object_embed_type === 'link' && !!dlorItem?.object_link_url && (
                            <div className={classes.uqActionButton}>
                                <a aria-label="Click to visit the Learning Resource" href={dlorItem.object_link_url}>
                                    Access the object
                                </a>
                            </div>
                        )}

                        {isPreviewableUrl(dlorItem.object_link_url) !== false && (
                            <div data-testid="detailpage-preview">
                                <Typography className={classes.highlighted} component={'h2'} variant={'h6'}>
                                    Preview
                                </Typography>
                                <div className={classes.videoResponsive}>
                                    {!!getYoutubeEmbeddableUrl(dlorItem.object_link_url) !== false && (
                                        <iframe
                                            width="853"
                                            height="480"
                                            src={getYoutubeEmbeddableUrl(dlorItem.object_link_url)}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            title="Embedded youtube"
                                        />
                                    )}
                                    {!!getVimeoEmbeddableUrl(dlorItem.object_link_url) !== false && (
                                        <iframe
                                            title="vimeo-player"
                                            src={getVimeoEmbeddableUrl(dlorItem.object_link_url)}
                                            src="https://player.vimeo.com/video/750432905"
                                            width="640"
                                            height="360"
                                            frameBorder="0"
                                            allowFullScreen
                                        />
                                    )}
                                </div>
                            </div>
                        )}

                        {!!dlorItem?.object_download_instructions && (
                            <>
                                <Typography className={classes.highlighted} component={'h2'} variant={'h6'}>
                                    How to use this object
                                </Typography>
                                {!!dlorItem?.object_download_instructions &&
                                    displayDownloadInstructions(
                                        dlorItem.object_download_instructions,
                                        classes.downloadInstructions,
                                    )}
                            </>
                        )}
                    </Grid>
                    <Grid item xs={12} md={4} data-testid="detaipage-metadata">
                        {dlorItem?.object_filters?.length > 0 && (
                            <>
                                <Typography component={'h2'} variant={'h6'} className={classes.metaHeader}>
                                    <BookmarksIcon />
                                    Details
                                </Typography>
                                {dlorItem?.object_filters?.map(filter => {
                                    return (
                                        <div
                                            key={filter?.filter_key}
                                            data-testid={`detailpage-filter-${filter?.filter_key}`}
                                        >
                                            <Typography className={classes.highlighted} component={'h3'} variant={'h6'}>
                                                {deslugify(filter?.filter_key)}
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
                                {!!dlorItem?.object_keywords && (
                                    <div data-testid="detaipage-metadata-keywords">
                                        <Typography className={classes.highlighted} component={'h3'} variant={'h6'}>
                                            Keywords
                                        </Typography>
                                        <ul className={classes.filterDisplayList}>
                                            {dlorItem.object_keywords.map((keyword, index) => {
                                                return (
                                                    <li key={index}>
                                                        {keyword.charAt(0).toUpperCase() + keyword.slice(1)}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                )}
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
    account: PropTypes.object,
};

export default React.memo(DLOView);
