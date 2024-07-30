import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import parse from 'html-react-parser';
import { useCookies } from 'react-cookie';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import { styled } from '@mui/material/styles';
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
import { isDlorAdminUser } from 'helpers/access';
import { useAccountContext } from 'context';

import LoginPrompt from 'modules/Pages/DigitalLearningObjects/SharedComponents/LoginPrompt';
import {
    getDurationString,
    getFileSizeString,
    getYoutubeUrlForPreviewEmbed,
    isPreviewableUrl,
    getDlorViewPageUrl,
    getPathRoot,
    toTitleCase,
    convertSnakeCaseToKebabCase,
} from 'modules/Pages/DigitalLearningObjects/dlorHelpers';
import { dlorAdminLink, isValidEmail } from 'modules/Pages/Admin/DigitalLearningObjects/dlorAdminHelpers';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';

const StyledUQActionButton = styled('div')(({ theme }) => ({
    marginBlock: '32px',
    '& button, & a': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.white.main,
        borderColor: theme.palette.primary.main,
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: '6px',
        padding: '8px 12px',
        fontWeight: 400,
        '&:hover': {
            backgroundColor: theme.palette.white.main,
            color: theme.palette.primary.main,
            textDecoration: 'none',
        },
    },
    '&:has(button)': {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '12px',
    },
}));
const StyledTitleTypography = styled(Typography)(({ theme }) => ({
    color: theme.palette.primary.light,
}));
const StyledContentGrid = styled(Grid)(() => ({
    marginTop: '6px',
    '& > div.MuiGrid-item': {
        paddingTop: '6px',
    },
}));
const StyledTitleBlockDiv = styled('div')(() => ({
    display: 'flex',
    alignItems: 'center',
    marginTop: '16px',
    '& p:first-child': {
        padding: 0,
        fontSize: 16,
        '& a': {
            color: 'rgba(0, 0, 0, 0.87)',
        },
    },
    '& svg': {
        width: 10,
        marginInline: '6px',
    },
    '& > p:nth-child(2)': {
        padding: 0,
    },
}));
const StyledHeaderDiv = styled(Typography)(() => ({
    backgroundColor: 'white',
    padding: '12px',
    '& p': {
        margin: 0,
        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
        fontWight: 300,
        fontSize: '1rem',
        lineHeight: 1.5,
        letterSpacing: '0.00938em',
    },
}));
const StyledIframe = styled('iframe')(() => ({
    left: 0,
    top: 0,
    height: '100%',
    width: '100%',
    position: 'absolute',
}));
const StyledTagLabelSpan = styled('span')(() => ({
    fontVariant: 'small-caps',
    textTransform: 'lowercase',
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    marginRight: '10px',
}));
const StyledSeriesList = styled('ol')(() => ({
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
}));
const StyledDemographicsBox = styled(Box)(() => ({
    padding: '1em',
    marginTop: '24px',
    borderRadius: '10px',
    backgroundColor: 'white',
    '& p': { marginLeft: '-8px' },
    '& form': { margin: '-8px', '& p': { marginBlock: '3em 0', marginLeft: '2px' } },
}));
const StyledLayoutBox = styled(Box)(() => ({
    backgroundColor: 'white',
    padding: '12px',
    marginTop: '24px',
}));
const StyledKeywordList = styled('ul')(() => ({
    listStyleType: 'none',
    paddingLeft: 0,
    '& li': {
        display: 'flex',
        alignItems: 'center',
        listStyleType: 'none',
        paddingBottom: '6px',
    },
}));
const StyledSidebarList = styled('ul')(() => ({
    listStyleType: 'none',
    paddingLeft: 0,
    '& li': {
        display: 'flex',
        alignItems: 'center',
        listStyleType: 'none',
        paddingBottom: '6px',
        '& a': {
            color: '#333',
            marginTop: '2px',
            marginLeft: '3px',
        },
    },
}));
const StyledSidebarHeadingTypography = styled(Typography)(() => ({
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px',
    '& svg': {
        width: 30,
        paddingRight: '6px',
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
    const [cookies, setCookie] = useCookies();
    const [confirmationOpen, setConfirmationOpen] = React.useState(false);

    console.log(dlorId, 'Loading=', dlorItemLoading, '; Error=', dlorItemError, '; dlorItem=', dlorItem);
    console.log('Updating=', dlorItemUpdating, '; Error=', dlorUpdatedItemError, '; dlorItem=', dlorUpdatedItem);

    const [formValues, setFormValues] = React.useState({
        subjectCode: '',
        schoolName: '',
        notify: false,
        preferredName: '',
        userEmail: '',
    });
    useEffect(() => {
        if (!!account?.id) {
            const tempForm = {
                ...formValues,
                preferredName: account.firstName,
                userEmail: account.mail,
            };
            setFormValues(tempForm);
        }
    }, [account]);

    const handleChange = prop => e => {
        let theNewValue =
            e.target.hasOwnProperty('checked') && e.target.type !== 'radio' ? e.target.checked : e.target.value;

        if (['notify'].includes(prop)) {
            theNewValue = !!e.target.checked;
        }
        const newValues = { ...formValues, [prop]: theNewValue };
        console.log('handleChange', prop, theNewValue, newValues);

        setFormValues(newValues);
    };

    useEffect(() => {
        window.scrollTo(0, 0); // onchange of dlor id, scroll up
        /* istanbul ignore else */
        if (!!dlorId) {
            actions.clearADlor();
            actions.loadADLOR(dlorId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dlorId]);

    function navigateToObjectLink() {
        window.location.href = dlorItem?.object_link_url;
    }

    useEffect(() => {
        // when the save attempt comes back...
        // if they only sent demographics, we only wait for the "in progress" because we dont care what it responds
        if (!!dlorItemUpdating && !formValues?.notify) {
            navigateToObjectLink();
        }
        //  they sent a notify then we will show a dialog, either success or failure
        if (!dlorItemUpdating && (!!dlorUpdatedItem || !!dlorUpdatedItemError) && !!formValues?.notify) {
            setConfirmationOpen(true);
        }
    }, [dlorItemUpdating, dlorUpdatedItem, dlorUpdatedItemError, formValues?.notify, navigateToObjectLink]);

    const deslugify = slug => {
        const words = slug?.replace(/_/g, ' ');
        return toTitleCase(words);
    };

    function getTitleBlock(detailTitle = 'View an object') {
        return (
            <StyledTitleBlockDiv>
                <Typography component={'p'} variant={'h6'} data-testid="dlor-detailpage-sitelabel">
                    <a href={`${getPathRoot()}/digital-learning-hub`}>Find a digital learning object</a>
                </Typography>
                <ArrowForwardIcon />
                <Typography>{detailTitle}</Typography>
            </StyledTitleBlockDiv>
        );
    }

    /* istanbul ignore next */
    const displayDownloadInstructions = downloadInstructions => {
        function addRelnoopenerNoreferrer(htmlString) {
            // Use regular expression to find all anchor tags (<a>)
            const regex = /<a([^>]+)>/g;
            return htmlString.replace(regex, (match, attributes) => {
                // Add the rel="noopener noreferrer" attribute
                return `<a ${attributes} rel="noopener noreferrer">`;
            });
        }

        const content = addRelnoopenerNoreferrer(downloadInstructions);

        return (
            <Box
                data-testid="dlor-massaged-download-instructions"
                sx={{
                    lineHeight: 1.5,
                }}
            >
                {parse(content)}
            </Box>
        );
    };

    const navigateToEditPage = uuid => {
        window.location.href = dlorAdminLink(`/edit/${uuid}`);
    };

    const saveAndNavigate = dlorItem => {
        console.log('saveAndNavigate formValues', dlorItem.object_link_url, formValues);

        if (formValues.schoolName.length > 0 || formValues.subjectCode.length > 0 || !!formValues.notify) {
            const valuestoSend = {
                dlorUuid: dlorItem.object_public_uuid,
                demographics: {
                    subject: formValues.subjectCode,
                    school: formValues.schoolName,
                },
                subscribeRequest: {
                    userName: !!formValues.notify ? formValues.preferredName : '',
                    userEmail: !!formValues.notify ? formValues.userEmail : '',
                },
            };
            /* istanbul ignore else */
            if (!!account.id) {
                valuestoSend.subscribeRequest.loggedin = true;
            }

            const cypressTestCookie = cookies.hasOwnProperty('CYPRESS_TEST_DATA')
                ? cookies.CYPRESS_TEST_DATA
                : /* istanbul ignore next */ null;
            /* istanbul ignore else */
            if (!!cypressTestCookie && location.host === 'localhost:2020' && cypressTestCookie === 'active') {
                setCookie('CYPRESS_DATA_SAVED', valuestoSend);
            }
            actions.saveDlorDemographics(valuestoSend);
            // navigation to link happens when the save has started via useEffect on dlorItemUpdating}
        } else {
            navigateToObjectLink();
        }
    };

    const finishNavigation = () => {
        setConfirmationOpen(false);
        navigateToObjectLink();
    };

    const getYoutubeEmbeddableUrl = urlIn => {
        const url = getYoutubeUrlForPreviewEmbed(urlIn); // assumes is return in ?v= format
        /* istanbul ignore next */
        if (url === false) {
            return false;
        }
        return url.replace('?v=', 'embed/');
    };

    function getItButtonLabel(dlorItem) {
        const interactionType = dlorItem?.object_link_interaction_type || /* istanbul ignore next */ null;
        const fileType = dlorItem?.object_link_file_type || null;

        let label = 'Access the object';
        if (interactionType === 'view') {
            const viewingTime = dlorItem?.object_link_size
                ? getDurationString(dlorItem?.object_link_size)
                : /* istanbul ignore next */ '';
            label = `Access the object (${fileType} ${viewingTime})`;
        } else if (interactionType === 'download') {
            const fileSize = !!dlorItem?.object_link_size
                ? getFileSizeString(dlorItem?.object_link_size)
                : /* istanbul ignore next */ null;
            label = `Access the object (${fileType} ${fileSize})`;
        }
        return label;
    }

    let subscriptionResponseLocale = {};
    if (!dlorItemUpdating && (!!dlorUpdatedItem || !!dlorUpdatedItemError)) {
        console.log('dlorUpdatedItem=', dlorUpdatedItem);
        const updatingMessage =
            dlorUpdatedItem?.data?.subscription === false
                ? 'You are already subscribed'
                : 'Please check your email to confirm your subscription request.';
        const getConfirmationTitle = !!dlorUpdatedItem
            ? updatingMessage
            : 'There was a problem saving your subscription request - please try again later.';
        subscriptionResponseLocale = {
            confirmationTitle: getConfirmationTitle,
            confirmationMessage: '',
            confirmButtonLabel: 'Visit link now',
        };
    }

    if (!!dlorItemLoading || dlorItemLoading === null || !!dlorItemUpdating) {
        return (
            <Box sx={{ minHeight: 600 }}>
                <InlineLoader message="Loading" />
            </Box>
        );
    }

    if (!!dlorItemError) {
        return (
            <StandardPage>
                <StandardCard>
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
                <StandardCard>
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
            <>
                <ConfirmationBox
                    actionButtonColor="primary"
                    actionButtonVariant="contained"
                    confirmationBoxId="dlor-save-notification"
                    onAction={() => finishNavigation()}
                    hideCancelButton
                    onClose={finishNavigation}
                    isOpen={confirmationOpen}
                    locale={subscriptionResponseLocale}
                />
                <div>
                    {getTitleBlock()}
                    <StyledContentGrid container spacing={4} data-testid="dlor-detailpage">
                        <Grid item xs={12} md={9}>
                            <LoginPrompt account={account} instyle={{ marginBottom: '12px' }} />
                            <Box sx={{ marginBottom: '12px' }}>
                                <StyledTitleTypography component={'h1'} variant={'h4'}>
                                    {dlorItem?.object_title}
                                </StyledTitleTypography>
                            </Box>
                            <>
                                {(!!dlorItem?.object_cultural_advice ||
                                    !!dlorItem?.object_is_featured ||
                                    !!dlorItem?.object_series_name) && (
                                    <Typography
                                        component={'p'}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginLeft: '-4px',
                                            marginTop: '-4px',
                                            marginBottom: '6px',
                                        }}
                                    >
                                        {!!dlorItem?.object_is_featured && (
                                            <>
                                                <BookmarkIcon sx={{ fill: '#51247A', marginRight: '2px', width: 20 }} />
                                                <StyledTagLabelSpan
                                                    data-testid={'dlor-detailpage-featured-custom-indicator'}
                                                    sx={{ marginLeft: '-2px' }}
                                                >
                                                    Featured
                                                </StyledTagLabelSpan>
                                            </>
                                        )}
                                        {!!dlorItem?.object_cultural_advice && (
                                            <>
                                                <InfoIcon sx={{ fill: '#2377CB', marginRight: '2px', width: 20 }} />
                                                <StyledTagLabelSpan
                                                    data-testid={'dlor-detailpage-cultural-advice-custom-indicator'}
                                                >
                                                    Cultural advice
                                                </StyledTagLabelSpan>
                                            </>
                                        )}
                                        {!!dlorItem?.object_series_name && dlorItem?.object_series?.length > 1 && (
                                            <>
                                                <PlaylistAddCheckIcon
                                                    sx={{ fill: '#4aa74e', marginRight: '2px', width: 24 }}
                                                />
                                                <StyledTagLabelSpan
                                                    data-testid={'dlor-detailpage-object-series-name-custom-indicator'}
                                                >
                                                    Series: {dlorItem?.object_series_name}
                                                </StyledTagLabelSpan>
                                            </>
                                        )}
                                    </Typography>
                                )}
                            </>
                            {!!dlorItem?.object_cultural_advice && (
                                <Box
                                    data-testid="dlor-detailpage-cultural-advice"
                                    sx={{
                                        padding: '1em',
                                        borderColor: 'rgb(187, 216, 245)',
                                        color: 'rgb(0, 0, 0)',
                                        backgroundColor: 'rgb(187, 216, 245)',
                                        borderRadius: '3px',
                                    }}
                                >
                                    Aboriginal and Torres Strait Islander peoples are warned that this resource may
                                    contain images, transcripts or names of Aboriginal and Torres Strait Islander
                                    peoples now deceased. It may also contain historically and culturally sensitive
                                    words, terms, and descriptions.
                                </Box>
                            )}
                            <StyledHeaderDiv data-testid="dlor-detailpage-description">
                                {!!dlorItem?.object_description && parse(dlorItem.object_description)}
                            </StyledHeaderDiv>

                            {/* until we can implement a captcha, we can only take input from loggedin users :( */}
                            {dlorItem?.object_link_url?.startsWith('http') && !account?.id && (
                                <StyledUQActionButton data-testid="detailpage-getit-button">
                                    <a href={dlorItem.object_link_url}>{getItButtonLabel(dlorItem)}</a>
                                </StyledUQActionButton>
                            )}
                            {dlorItem?.object_link_url?.startsWith('http') && account?.id && (
                                <StyledDemographicsBox
                                    id="gatherDemographics"
                                    data-testid="detailpage-getit-and demographics"
                                >
                                    <p>(Optional) Help us understand how you will use this object. Please tell us: </p>
                                    <form>
                                        <FormControl variant="standard" fullWidth>
                                            <InputLabel htmlFor="subjectCode">
                                                Your relevant course, program or session
                                            </InputLabel>
                                            <Input
                                                id="subjectCode"
                                                data-testid="view-demographics-subject-code"
                                                value={formValues?.subjectCode}
                                                onChange={handleChange('subjectCode')}
                                            />
                                        </FormControl>
                                        <FormControl variant="standard" fullWidth sx={{ marginTop: '10px' }}>
                                            <InputLabel htmlFor="schoolName">Your school, faculty or unit</InputLabel>
                                            <Input
                                                id="schoolName"
                                                data-testid="view-demographics-school-name"
                                                value={formValues?.schoolName}
                                                onChange={handleChange('schoolName')}
                                            />
                                        </FormControl>

                                        <p>Would you like notifications when updates are made to this object?</p>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    onChange={handleChange('notify')}
                                                    aria-label={'Notify?'}
                                                    checked={formValues?.notify}
                                                    data-testid={'checkbox-notify'}
                                                />
                                            }
                                            label="Notify me!"
                                        />
                                        {!!formValues.notify && (
                                            <>
                                                <FormControl variant="standard" fullWidth>
                                                    <InputLabel htmlFor="preferredName">Your name</InputLabel>
                                                    <Input
                                                        id="preferredName"
                                                        data-testid="view-notify-preferredName"
                                                        value={formValues?.preferredName}
                                                        onChange={handleChange('preferredName')}
                                                    />
                                                </FormControl>
                                                <FormControl variant="standard" fullWidth>
                                                    <InputLabel htmlFor="emailAddress">Your email address *</InputLabel>
                                                    <Input
                                                        id="userEmail"
                                                        required
                                                        data-testid="view-notify-userEmail"
                                                        value={formValues?.userEmail}
                                                        onChange={handleChange('userEmail')}
                                                    />
                                                    {!isValidEmail(formValues?.userEmail) && (
                                                        <div data-testid="dlor-form-error-message-object-publishing-user">
                                                            This email address is not valid.
                                                        </div>
                                                    )}
                                                </FormControl>
                                            </>
                                        )}

                                        <div>
                                            <StyledUQActionButton>
                                                <Button
                                                    aria-label="Click to access the object"
                                                    onClick={() => saveAndNavigate(dlorItem)}
                                                    data-testid="detailpage-clicklink"
                                                    disabled={
                                                        formValues?.notify && !isValidEmail(formValues?.userEmail)
                                                    }
                                                >
                                                    {getItButtonLabel(dlorItem)}
                                                </Button>
                                            </StyledUQActionButton>
                                        </div>
                                    </form>
                                </StyledDemographicsBox>
                            )}

                            {isPreviewableUrl(dlorItem.object_link_url) !== false && (
                                <div data-testid="detailpage-preview">
                                    <StyledTitleTypography component={'h2'} variant={'h6'}>
                                        Preview
                                    </StyledTitleTypography>
                                    <Box
                                        sx={{
                                            overflow: 'hidden',
                                            paddingBottom: '56.25%',
                                            position: 'relative',
                                            height: 0,
                                        }}
                                    >
                                        {!!getYoutubeEmbeddableUrl(dlorItem.object_link_url) !== false && (
                                            <StyledIframe
                                                width="853"
                                                height="480"
                                                src={getYoutubeEmbeddableUrl(dlorItem.object_link_url)}
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                title="Embedded youtube"
                                            />
                                        )}
                                    </Box>
                                </div>
                            )}
                            {!!dlorItem?.object_download_instructions && (
                                <StyledLayoutBox>
                                    <StyledTitleTypography component={'h2'} variant={'h6'}>
                                        How to use this object
                                    </StyledTitleTypography>
                                    {!!dlorItem?.object_download_instructions &&
                                        displayDownloadInstructions(dlorItem.object_download_instructions)}
                                </StyledLayoutBox>
                            )}
                            {!!dlorItem?.object_series_name && dlorItem?.object_series?.length > 1 && (
                                <StyledLayoutBox>
                                    <StyledTitleTypography component="h2" variant="h6">
                                        Part of a series: {dlorItem.object_series_name}
                                    </StyledTitleTypography>
                                    <StyledSeriesList>
                                        {dlorItem?.object_series
                                            ?.sort((a, b) => a.series_object_order - b.series_object_order)
                                            .map((s, index) => {
                                                return (
                                                    <li
                                                        key={`dlor-view-series-item-${s.series_object_uuid}`}
                                                        data-testid={`dlor-view-series-item-${convertSnakeCaseToKebabCase(
                                                            s.series_object_uuid,
                                                        )}-order-${index}`}
                                                    >
                                                        {s.series_object_uuid === dlorItem?.object_public_uuid ? (
                                                            <span>
                                                                <StarIcon />
                                                                <span>{s.series_object_title}</span>
                                                            </span>
                                                        ) : (
                                                            <a
                                                                href={getDlorViewPageUrl(s?.series_object_uuid)}
                                                                rel="noopener noreferrer"
                                                            >
                                                                {s.series_object_title}
                                                            </a>
                                                        )}
                                                    </li>
                                                );
                                            })}
                                    </StyledSeriesList>
                                </StyledLayoutBox>
                            )}
                        </Grid>
                        <Grid item xs={12} md={3} data-testid="detailpage-metadata">
                            {dlorItem?.object_filters?.length > 0 && (
                                <>
                                    {isDlorAdminUser(account) && (
                                        <Button
                                            onClick={() => navigateToEditPage(dlorItem?.object_public_uuid)}
                                            data-testid="detailpage-admin-edit-button"
                                            sx={{
                                                backgroundColor: '#2377cb',
                                                color: '#fff',
                                                marginBottom: '6px',
                                                paddingInline: '24px',
                                            }}
                                        >
                                            <EditIcon /> &nbsp; Edit
                                        </Button>
                                    )}
                                    <StyledSidebarHeadingTypography component={'h2'} variant={'h6'}>
                                        <BookmarksIcon />
                                        Details
                                    </StyledSidebarHeadingTypography>
                                    {dlorItem?.object_filters?.map(filter => {
                                        return (
                                            <div
                                                key={filter?.filter_key}
                                                data-testid={`detailpage-filter-${convertSnakeCaseToKebabCase(
                                                    filter?.filter_key,
                                                )}`}
                                            >
                                                <StyledTitleTypography component={'h3'} variant={'h6'}>
                                                    {deslugify(filter?.filter_key)}
                                                </StyledTitleTypography>
                                                <StyledSidebarList>
                                                    {!!filter.filter_values &&
                                                        filter.filter_values.map((value, subIndex) => {
                                                            return (
                                                                <li key={subIndex}>
                                                                    {value.name}
                                                                    {!!value?.help && value?.help.startsWith('http') && (
                                                                        <a
                                                                            href={value.help}
                                                                            target="_blank"
                                                                            title="View the help for this filter"
                                                                        >
                                                                            <HelpOutlineIcon size="small" />
                                                                        </a>
                                                                    )}
                                                                </li>
                                                            );
                                                        })}
                                                </StyledSidebarList>
                                            </div>
                                        );
                                    })}
                                    {!!dlorItem?.object_keywords && (
                                        <div data-testid="detailpage-metadata-keywords">
                                            <StyledTitleTypography component={'h3'} variant={'h6'}>
                                                Keywords
                                            </StyledTitleTypography>
                                            <StyledKeywordList>
                                                {dlorItem.object_keywords.map((keyword, index) => {
                                                    return (
                                                        <li key={index}>
                                                            {keyword.charAt(0).toUpperCase() + keyword.slice(1)}
                                                        </li>
                                                    );
                                                })}
                                            </StyledKeywordList>
                                        </div>
                                    )}
                                </>
                            )}
                        </Grid>
                    </StyledContentGrid>
                </div>
            </>
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
