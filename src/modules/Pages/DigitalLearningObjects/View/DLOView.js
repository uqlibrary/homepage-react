import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import parse from 'html-react-parser';

import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';

import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import EditIcon from '@mui/icons-material/Edit';
import StarIcon from '@mui/icons-material/Star';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { getHomepageLink, isDlorAdminUser } from 'helpers/access';
import { useAccountContext } from 'context';

import LoginPrompt from 'modules/Pages/DigitalLearningObjects/SharedComponents/LoginPrompt';
import {
    displayDownloadInstructions,
    getDurationString,
    getFileSizeString,
    getYoutubeUrlForPreviewEmbed,
    isPreviewableUrl,
    getDlorViewPageUrl,
    toTitleCase,
} from 'modules/Pages/DigitalLearningObjects/dlorHelpers';
import { dlorAdminLink } from 'modules/Pages/Admin/DigitalLearningObjects/dlorAdminHelpers';
import { fullPath } from 'config/routes';

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
    viewContent: {
        marginTop: 6,
        '& > div.MuiGrid-item': {
            paddingTop: 6,
        },
    },
    titleBlock: {
        display: 'flex',
        alignItems: 'center',
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
    seriesList: {
        '& li': {
            display: 'flex',
            marginBottom: '0.5em',
            '& a': {
                backgroundColor: '#d1d0d2', // $grey-300
                color: '#000',
            },
            '& a, & > span': {
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                padding: 10,
                textDecoration: 'none',
                border: '1px solid #d1d0d2', // $grey-300
            },
            '& a:hover': {
                backgroundColor: '#a3a1a4', // $grey-500
            },
        },
    },
    gatherDemographicsClass: {
        padding: '1em',
        marginTop: 24,
        borderRadius: 10,
    },
}));

export const DLOView = ({ actions, dlorItem, dlorItemLoading, dlorItemError }) => {
    const { account } = useAccountContext();
    const { dlorId } = useParams();
    const classes = useStyles();

    console.log(dlorId, 'Loading=', dlorItemLoading, '; Error=', dlorItemError, '; dlorItem=', dlorItem);

    React.useEffect(() => {
        window.scrollTo(0, 0); // onchange of dlor id, scroll up

        if (!!dlorId) {
            actions.clearADlor();
            actions.loadADLOR(dlorId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dlorId]);

    const deslugify = slug => {
        const words = slug?.replace(/_/g, ' ');
        return toTitleCase(words);
    };

    function getTitleBlock(detailTitle = 'View an entry') {
        return (
            <div className={classes.titleBlock}>
                <Typography component={'p'} variant={'h6'} data-testid="dlor-detailpage-sitelabel">
                    <a href={`${fullPath}/digital-learning-hub`}>Find a digital learning object</a>
                </Typography>
                <ArrowForwardIcon />
                <Typography>{detailTitle}</Typography>
            </div>
        );
    }

    const navigateToEditPage = uuid => {
        window.location.href = dlorAdminLink(`/edit/${uuid}`);
    };

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
        const url = getYoutubeUrlForPreviewEmbed(urlIn); // assumes is return in ?v= format
        if (url === false) {
            return false;
        }
        return url.replace('?v=', 'embed/');
    };

    function getItButtonLabel(dlorItem) {
        const interactionType = dlorItem?.object_link_interaction_type || null;
        const fileType = dlorItem?.object_link_file_type || null;

        let label = 'Access the object';
        if (interactionType === 'view') {
            const viewingTime = dlorItem?.object_link_size ? getDurationString(dlorItem?.object_link_size) : '';
            label = `Access the object (${fileType} ${viewingTime})`;
        } else if (interactionType === 'download') {
            const fileSize = !!dlorItem?.object_link_size ? getFileSizeString(dlorItem?.object_link_size) : null;
            label = `Access the object (${fileType} ${fileSize})`;
        }
        return label;
    }

    console.log('dlorItem=', dlorItem);
    console.log('dlorItem?.object_series=', dlorItem?.object_series);

    return (
        <StandardPage>
            <div className={classes.dlorEntry}>
                {getTitleBlock()}
                <Grid container spacing={4} data-testid="dlor-detailpage" className={classes.viewContent}>
                    <Grid item xs={12} md={8}>
                        <LoginPrompt account={account} instyle={{ marginBottom: 12 }} />
                        <div
                            data-testid="dlor-detailpage-description"
                            style={{ backgroundColor: 'white', padding: 12 }}
                        >
                            <Typography className={classes.highlighted} component={'h1'} variant={'h4'}>
                                {dlorItem?.object_title}
                            </Typography>
                            {!!dlorItem?.object_description && parse(dlorItem.object_description)}
                        </div>

                        <div
                            id="gatherDemographics"
                            className={classes.gatherDemographicsClass}
                            style={{ backgroundColor: 'white' }}
                        >
                            <p>To help us understand how you will use this object, please tell us:</p>
                            <FormControl variant="standard" fullWidth>
                                <InputLabel htmlFor="alertTitle">Your relevant subject</InputLabel>
                                <Input
                                    id="alertTitle"
                                    data-testid="admin-alerts-form-title"
                                    // error={!values.alertTitle}
                                    // value={values.alertTitle}
                                    // onChange={handleChange('alertTitle')}
                                    inputProps={{ maxLength: 100 }}
                                />
                            </FormControl>
                            <FormControl variant="standard" fullWidth>
                                <InputLabel htmlFor="alertTitle">Your school</InputLabel>
                                <Input
                                    id="alertTitle"
                                    data-testid="admin-alerts-form-title"
                                    // error={!values.alertTitle}
                                    // value={values.alertTitle}
                                    // onChange={handleChange('alertTitle')}
                                    inputProps={{ maxLength: 100 }}
                                />
                            </FormControl>
                            <div className="footer">
                                <div
                                    className={classes.uqActionButton}
                                    // style={{ position: 'relative' }}
                                    style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}
                                >
                                    <a aria-label="Click to access the object" href={dlorItem?.object_link_url}>
                                        {getItButtonLabel(dlorItem)}
                                    </a>
                                </div>
                            </div>
                        </div>

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
                                </div>
                            </div>
                        )}
                        {!!dlorItem?.object_download_instructions && (
                            <div style={{ backgroundColor: 'white', padding: 12, marginTop: 24 }}>
                                <Typography className={classes.highlighted} component={'h2'} variant={'h6'}>
                                    How to use this object
                                </Typography>
                                {!!dlorItem?.object_download_instructions &&
                                    displayDownloadInstructions(
                                        dlorItem.object_download_instructions,
                                        classes.downloadInstructions,
                                    )}
                            </div>
                        )}
                        {!!dlorItem?.object_series && dlorItem?.object_series.length > 1 && (
                            <div style={{ backgroundColor: 'white', padding: 12, marginTop: 24 }}>
                                <Typography className={classes.highlighted} component="h2" variant="h6">
                                    Part of a series: {dlorItem.object_series_name}
                                </Typography>
                                <ol className={classes.seriesList}>
                                    {dlorItem?.object_series
                                        ?.sort((a, b) => a.series_object_order - b.series_object_order)
                                        .map((s, index) => {
                                            return (
                                                <li
                                                    key={`dlor-view-series-item-${s.series_object_uuid}`}
                                                    data-testid={`dlor-view-series-item-${s.series_object_uuid}-order-${index}`}
                                                >
                                                    {s.series_object_uuid === dlorItem?.object_public_uuid ? (
                                                        <span>
                                                            <StarIcon />
                                                            <span>{s.series_object_title}</span>
                                                        </span>
                                                    ) : (
                                                        <a href={getDlorViewPageUrl(s?.series_object_uuid)}>
                                                            {s.series_object_title}
                                                        </a>
                                                    )}
                                                </li>
                                            );
                                        })}
                                </ol>
                            </div>
                        )}
                    </Grid>
                    <Grid item xs={12} md={4} data-testid="detailpage-metadata">
                        {dlorItem?.object_filters?.length > 0 && (
                            <>
                                {isDlorAdminUser(account) && (
                                    <Button
                                        onClick={() => navigateToEditPage(dlorItem?.object_public_uuid)}
                                        data-testid="detailpage-admin-edit-button"
                                        style={{
                                            backgroundColor: '#2377cb',
                                            color: '#fff',
                                            marginBottom: 6,
                                            paddingInline: 24,
                                        }}
                                    >
                                        <EditIcon /> &nbsp; Edit
                                    </Button>
                                )}
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
                                                        return <li key={subIndex}>{value.name}</li>;
                                                    })}
                                            </ul>
                                        </div>
                                    );
                                })}
                                {!!dlorItem?.object_keywords && (
                                    <div data-testid="detailpage-metadata-keywords">
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
            </div>
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
