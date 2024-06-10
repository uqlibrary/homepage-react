import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import parse from 'html-react-parser';
import { useCookies } from 'react-cookie';

import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';

import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import EditIcon from '@mui/icons-material/Edit';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import InfoIcon from '@mui/icons-material/Info';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
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
        '& button': {
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
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: 12,
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
    headerBlock: {
        '& p': {
            margin: 0,
            fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
            fontWight: 300,
            fontSize: '1rem',
            lineHeight: 1.5,
            letterSpacing: '0.00938em',
        },
    },
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
        paddingInlineStart: 0,
        marginInlineStart: 0,
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
    caWrapper: { display: 'flex', alignItems: 'center', marginTop: 4 },
    tagLabel: {
        fontVariant: 'small-caps',
        textTransform: 'lowercase',
        fontWeight: 'bold',
        fontSize: 16,
        color: '#333',
        marginRight: 10,
    },
}));

export const DLOView = ({
    actions,
    // get viewed dlor item
    dlorItem,
    dlorItemLoading,
    dlorItemError,
    // sending demographics and/or subscribe request
    dlorUpdatedItem,
    dlorItemUpdating,
    dlorUpdatedItemError,
}) => {
    const { account } = useAccountContext();
    const { dlorId } = useParams();
    const classes = useStyles();
    const [cookies, setCookie] = useCookies();

    console.log(dlorId, 'Loading=', dlorItemLoading, '; Error=', dlorItemError, '; dlorItem=', dlorItem);
    console.log('Updating=', dlorItemUpdating, '; Error=', dlorUpdatedItemError, '; dlorItem=', dlorUpdatedItem);

    const [formValues, setFormValues] = React.useState({
        subjectCode: '',
        schoolName: '',
    });

    const handleChange = (prop, value) => e => {
        const theNewValue = e.target.value;
        const newValues = { ...formValues, [prop]: theNewValue };

        // setFormValidity(validateValues(newValues));
        setFormValues(newValues);
    };

    React.useEffect(() => {
        window.scrollTo(0, 0); // onchange of dlor id, scroll up

        if (!!dlorId) {
            actions.clearADlor();
            actions.loadADLOR(dlorId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dlorId]);

    function navigateToObjectLink() {
        window.location.href = dlorItem?.object_link_url;
    }

    React.useEffect(() => {
        // safe to navigate now as the demographic request has started on the BE
        // (we dont bother waiting for it come back?)
        if (!!dlorItemUpdating) {
            navigateToObjectLink();
        }
    }, [dlorItemUpdating]);

    const deslugify = slug => {
        const words = slug?.replace(/_/g, ' ');
        return toTitleCase(words);
    };

    function getTitleBlock(detailTitle = 'View an object') {
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

    const saveAndNavigate = dlorItem => {
        console.log('saveAndNavigate formValues', dlorItem.object_link_url, formValues);

        if (formValues.schoolName.length > 0 || formValues.subjectCode.length > 0) {
            const valuestoSend = {
                dlorUuid: dlorItem.object_public_uuid,
                demographics: {
                    subject: formValues.subjectCode,
                    school: formValues.schoolName,
                },
                // subscribeRequest: { // later
                //     userName: 'Lea de Groot',
                //     userEmail: 'uqldegro@uq.edu.au',
                // },
            };
            const cypressTestCookie = cookies.hasOwnProperty('CYPRESS_TEST_DATA') ? cookies.CYPRESS_TEST_DATA : null;
            if (!!cypressTestCookie && location.host === 'localhost:2020' && cypressTestCookie === 'active') {
                setCookie('CYPRESS_DATA_SAVED', valuestoSend);
            }
            actions.saveDlorDemographics(valuestoSend);
            // navigation to link happens when the save has started via useEffect on dlorItemUpdating}
        } else {
            navigateToObjectLink();
        }
    };

    if (!!dlorItemLoading || dlorItemLoading === null || !!dlorItemUpdating) {
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
                    <Grid item xs={12} md={9}>
                        <LoginPrompt account={account} instyle={{ marginBottom: 12 }} />
                        <div style={{ marginBottom: 12 }}>
                            <Typography className={classes.highlighted} component={'h1'} variant={'h4'}>
                                {dlorItem?.object_title}
                            </Typography>
                        </div>
                        <>
                            {(!!dlorItem?.object_cultural_advice ||
                                !!dlorItem?.object_is_featured ||
                                !!dlorItem?.object_series_name) && (
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
                                    {!!dlorItem?.object_is_featured && (
                                        <>
                                            <BookmarkIcon style={{ fill: '#51247A', marginRight: 2, width: 20 }} />
                                            <span
                                                className={classes.tagLabel}
                                                data-testid={'dlor-detailpage-featured-custom-indicator'}
                                                style={{ marginLeft: -2 }}
                                            >
                                                Featured
                                            </span>
                                        </>
                                    )}
                                    {!!dlorItem?.object_cultural_advice && (
                                        <>
                                            <InfoIcon style={{ fill: '#2377CB', marginRight: 2, width: 20 }} />
                                            <span
                                                className={classes.tagLabel}
                                                data-testid={'dlor-detailpage-cultural-advice-custom-indicator'}
                                            >
                                                Cultural advice
                                            </span>
                                        </>
                                    )}
                                    {!!dlorItem?.object_series_name && dlorItem?.object_series?.length > 1 && (
                                        <>
                                            <PlaylistAddCheckIcon
                                                style={{ fill: '#4aa74e', marginRight: 2, width: 24 }}
                                            />
                                            <span
                                                className={classes.tagLabel}
                                                data-testid={'dlor-detailpage-object_series_name-custom-indicator'}
                                            >
                                                Series: {dlorItem?.object_series_name}
                                            </span>
                                        </>
                                    )}
                                </Typography>
                            )}
                        </>
                        {!!dlorItem?.object_cultural_advice && (
                            <p
                                data-testid="dlor-detailpage-cultural-advice"
                                style={{
                                    padding: '1em',
                                    borderColor: 'rgb(187, 216, 245)',
                                    color: 'rgb(0, 0, 0)',
                                    backgroundColor: 'rgb(187, 216, 245)',
                                    borderRadius: 3,
                                }}
                            >
                                Aboriginal and Torres Strait Islander peoples are warned that this resource may contain
                                images, transcripts or names of Aboriginal and Torres Strait Islander peoples now
                                deceased. It may also contain historically and culturally sensitive words, terms, and
                                descriptions.
                            </p>
                        )}
                        <div
                            data-testid="dlor-detailpage-description"
                            style={{ backgroundColor: 'white', padding: 12 }}
                            className={classes.headerBlock}
                        >
                            {!!dlorItem?.object_description && parse(dlorItem.object_description)}
                        </div>

                        {dlorItem?.object_link_url?.startsWith('http') && (
                            <div
                                id="gatherDemographics"
                                className={classes.gatherDemographicsClass}
                                style={{ backgroundColor: 'white' }}
                                data-testid="detailpage-getit-button"
                            >
                                <p>To help us understand how you will use this object, please tell us:</p>
                                <form>
                                    <FormControl variant="standard" fullWidth>
                                        <InputLabel htmlFor="subjectCode">
                                            Your relevant subject or UQ course code
                                        </InputLabel>
                                        <Input
                                            id="subjectCode"
                                            data-testid="view-demographics-subject-code"
                                            value={formValues?.subjectCode}
                                            onChange={handleChange('subjectCode')}
                                            inputProps={{ maxLength: 10 }}
                                        />
                                    </FormControl>
                                    <FormControl variant="standard" fullWidth>
                                        <InputLabel htmlFor="schoolName">Your school</InputLabel>
                                        <Input
                                            id="schoolName"
                                            data-testid="view-demographics-school-name"
                                            value={formValues?.schoolName}
                                            onChange={handleChange('schoolName')}
                                            // inputProps={{ maxLength: 100 }}
                                        />
                                    </FormControl>
                                    <div className="footer">
                                        <div className={classes.uqActionButton}>
                                            <Button
                                                aria-label="Click to access the object"
                                                onClick={() => saveAndNavigate(dlorItem)}
                                                data-testid="detailpage-clicklink"
                                            >
                                                {getItButtonLabel(dlorItem)}
                                            </Button>
                                        </div>
                                    </div>
                                </form>
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
                        {!!dlorItem?.object_series_name && dlorItem?.object_series?.length > 1 && (
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
                    <Grid item xs={12} md={3} data-testid="detailpage-metadata">
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
                                                        return (
                                                            <li
                                                                key={subIndex}
                                                                style={{ display: 'flex', alignItems: 'center' }}
                                                            >
                                                                {value.name}
                                                                {!!value?.help && value?.help.startsWith('http') && (
                                                                    <a
                                                                        href={value.help}
                                                                        target="_blank"
                                                                        title="View the help for this filter"
                                                                        style={{
                                                                            color: '#333',
                                                                            marginTop: 2,
                                                                            marginLeft: 3,
                                                                        }}
                                                                    >
                                                                        <HelpOutlineIcon size="small" />
                                                                    </a>
                                                                )}
                                                            </li>
                                                        );
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
    dlorUpdatedItem: PropTypes.any,
    dlorItemUpdating: PropTypes.bool,
    dlorUpdatedItemError: PropTypes.any,
    account: PropTypes.object,
};

export default React.memo(DLOView);
