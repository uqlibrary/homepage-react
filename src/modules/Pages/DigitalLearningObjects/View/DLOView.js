/* istanbul ignore file */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useParams } from 'react-router-dom';
import parse from 'html-react-parser';
import { useCookies } from 'react-cookie';
import { pathConfig } from 'config/pathConfig';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { NotificationsActive } from '@mui/icons-material';

import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import EditIcon from '@mui/icons-material/Edit';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import InfoIcon from '@mui/icons-material/Info';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { isDlorAdminUser, isDlorOwner, isStaff, isLibraryStaff, isUQOnlyUser } from 'helpers/access';
import { useAccountContext } from 'context';
import { CAPTCHA_DEMOGRAPHICS_API } from 'repositories/routes';
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
import { breadcrumbs } from 'config/routes';
import { Chip, Dialog, DialogContent, DialogTitle, Tooltip } from '@mui/material';

const StyledUQActionButton = styled('div')(({ theme, noMargin }) => ({
    marginBlock: '0px',
    width: '100%',
    display: 'inline-block',
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
    '& button.cancel, & a': {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.white.main,
        borderColor: theme.palette.secondary.main,
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
    '& button.extended': {
        width: '100%',
        textTransform: 'uppercase',
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.white.main,
        borderColor: theme.palette.primary.main,
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: '6px',
        padding: '12px 12px',
        fontWeight: 400,
        transition: 'all 0.3s',
        boxSizing: 'border-box',
        position: 'relative',
        '&:hover': {
            backgroundColor: theme.palette.white.main,
            color: theme.palette.primary.main,
            textDecoration: 'none',
        },
    },
    '&:has(button)': {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: noMargin ? '0px' : /* istanbul ignore next */ '12px',
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
    border: '1px solid hsla(203, 50%, 30%, 0.15)',
    borderRadius: '4px',
    marginTop: '12px',
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
        },
        '& a:hover': {
            backgroundColor: '#a3a1a4', // $grey-500
        },
    },
}));

const StyledLayoutBox = styled(Box)(() => ({
    backgroundColor: 'white',
    border: '1px solid hsla(203, 50%, 30%, 0.15)',
    borderRadius: '4px',
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

const StyledFilterLink = styled(Link)(() => ({
    color: '#3872a8 !important',
}));

window.captchaScriptLoaded = window.captchaScriptLoaded || false;

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
    dlorFavouritesList,
}) => {
    console.log('PROCESS', process.env.BRANCH);
    const { account } = useAccountContext();
    const { dlorId } = useParams();
    const [cookies, setCookie] = useCookies();
    const [confirmationOpen, setConfirmationOpen] = React.useState(false);
    const captchaContainerRef = React.useRef(null);
    const [captchaLoaded, setCaptchaLoaded] = React.useState(false);
    const [isDemographicsOpened, setIsDemographicsOpened] = React.useState(false);
    const [demographicsConfirmation, setDemographicsConfirmation] = React.useState(false);

    async function sendDemographics() {
        const container = document.querySelector('#my-captcha-container');
        if (!container) {
            console.error("CAPTCHA container element '#my-captcha-container' not found in the DOM.");
            // Consider disabling the submit button or showing an error message
            return;
        }

        const demographicsData = {
            dlorUuid: '987y_isjgt_9866',
            demographics: {
                school: 'school of testing',
                subject: 'demotest',
                subscribeRequest: {
                    userName: 'Steve',
                    userEmail: 's.lancaster@library.uq.edu.au',
                },
            },
        };

        let captchaToken = null; // Initialize token

        try {
            console.log('Attempting to get CAPTCHA token...');

            // Step 1: Wrap the callback-based renderCaptcha in a Promise
            captchaToken = await new Promise((resolve, reject) => {
                window.AwsWafCaptcha.renderCaptcha(container, {
                    apiKey:
                        'VyiD2LcoHRLNRwQlv9CjnKliXibVz+r8a7xh+oFbYUoj9eA5xUth5m0K0j/ExKz+xmXRBSnLbnZCjjWS6pwCw2ZBYPYr5k3sX8fZ5R180+ujo6fl2N4xLaMD4hqsHnt1Lex7tA69+MsLlXumepHpFi2pHKYNlRq2j9GSf04JPnZ6FvFxRz7J9HMMeA9bvw6hitqcmjh2auDnOqGa/LNKdkawCSqe08PAYed/juj2ENfyFMGxeA5tnDK7Yi7+RDmAN4eTYdpvHbkyKoau7zTDmrlxoKIeuTO0olqWKBkEzSadoDIDHR5xfpDV8U3LN3HPADvYm1YqgCWPdZ+BW8l1GpItn07HQSL/Kq/udpgthFcNM1D2G6MJwyDVsMzDq995MMm36ZGb9IaMd2xZnfF3+Lk8K6TYmWz6sYy9xdZwyjrOjakL3XvrGByl7Ux4m8ayaihSWAaDVcQ4QxIRa6pn9MChRi0OOWGI4CUIuVsGUTPhnEEZ40tIjFp2+fbijPxsXLO03/co3+6t9neH4UgyYrzFRbekqKpym32uthf3I2iwoyRM07DgZKWuZWoLTmbMzMg5karqt8oTa05rqCAVdlT5R/HxmI4hqXwDYI/2PE2t11cS7Z/VQTP7ogS5T2cMfIAP95WFLw7mh4+/nCfqVsNQ/2eDq9x9hPKgwHwOF0c=_1_1',
                    // This is the CRITICAL part: the success and error callbacks
                    onSuccess: token => {
                        console.log('CAPTCHA solved successfully, token received:', token);
                        resolve(token); // Resolve the wrapper Promise with the token
                    },
                    onError: error => {
                        console.error('CAPTCHA error:', error);
                        reject(error); // Reject the wrapper Promise with the error
                    },
                });
            });

            // If we reach here, the CAPTCHA was successful and captchaToken has a value

            // Step 2: Send the POST request with the obtained CAPTCHA token
            const response = await fetch(CAPTCHA_DEMOGRAPHICS_API().apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Only add the header if captchaToken is valid (it should be here)
                    ...(captchaToken && { 'x-aws-waf-token': captchaToken }),
                },
                body: JSON.stringify(demographicsData),
            });

            // Step 3: Handle the response from your actual API endpoint
            if (response.ok) {
                const responseData = await response.json(); // Assuming your API returns JSON
                console.log('Demographics submitted successfully!', responseData);
                // Implement your success UI/logic here (e.g., clear form, show success message)
            } else {
                const errorText = await response.text(); // Get more details if not ok
                console.error(`Failed to submit demographics. Status: ${response.status}, Details: ${errorText}`);
                // Implement your error UI/logic here
            }
        } catch (error) {
            // Step 4: Handle errors (from CAPTCHA or the fetch call)
            console.error('An error occurred during submission:', error);

            // You can check error.code if onError passes specific codes
            if (error && error.code === 'USER_CANCELLED') {
                // Assuming SDK provides 'USER_CANCELLED' for cancellation
                console.log('CAPTCHA challenge cancelled by user.');
            } else if (error && error.code === 'CAPTCHA_CHALLENGE_FAILED') {
                console.log('CAPTCHA challenge failed (e.g., incorrect solution).');
            } else {
                console.error('Unhandled CAPTCHA or network error:', error);
            }
            // Display a user-friendly message on the UI
        }
    }

    // const captchaExampleSuccessFunction = /* istanbul ignore next */ wafToken => {
    //     /* istanbul ignore next */
    //     console.log('CAPTCHA COMPLETED - WAF TOKEN', wafToken, CAPTCHA_DEMOGRAPHICS_API().apiUrl);
    //     window.AwsWafIntegration.fetch(CAPTCHA_DEMOGRAPHICS_API().apiUrl, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'X-WAF-Token': wafToken,
    //         },
    //         body: JSON.stringify({
    //             dlorUuid: '987y_isjgt_9866',
    //             recaptcha: 'ABC',
    //             demographics: {
    //                 school: 'school of testing',
    //                 subject: 'demotest',
    //                 subscribeRequest: {
    //                     userName: 'Steve',
    //                     userEmail: 's.lancaster@library.uq.edu.au',
    //                 },
    //             },
    //         }),
    //     })
    //         .then(response => {
    //             console.log('Full response:', response); // Log entire response object
    //             console.log('Response headers:', response.headers);
    //             console.log('Response status:', response.status);

    //             if (!response.ok) {
    //                 // Get the error message from CloudFront if available
    //                 return response.text().then(errorText => {
    //                     console.log('Error response body:', errorText);
    //                     throw new Error(`HTTP error! Status: ${response.status}, Body: ${errorText}`);
    //                 });
    //             }
    //             console.log('Success response:', response);
    //             return null; // Around here I should fire actual dispatches, etc. I wont be returning anything as such
    //         })
    //         .catch(error => {
    //             console.error('Detailed fetch error:', {
    //                 message: error.message,
    //                 stack: error.stack,
    //             });
    //         });
    // };

    // const captchaExampleErrorFunction = error => {
    //     /* Do something with the error */
    //     /* istanbul ignore next */
    //     console.error('Captcha error:', error);
    // };

    useEffect(() => {
        if (document.getElementById('captcha-script')) return;

        const script = document.createElement('script');
        script.src = 'https://b842968e7955.edge.captcha-sdk.awswaf.com/b842968e7955/jsapi.js';
        script.type = 'text/javascript';
        script.async = false;
        script.defer = false;
        script.id = 'captcha-script';

        /* istanbul ignore next */
        script.onload = () => {
            window.captchaScriptLoaded = true;
            setCaptchaLoaded(true);
        };

        script.onerror = () => {
            console.error('Failed to load captcha script.');
        };

        document.head.appendChild(script);
    }, []);

    // useEffect(() => {
    //     /* istanbul ignore next */
    //     if (dlorItem && captchaLoaded) {
    //         const showMyCaptcha = () => {
    //             console.log('Showing', dlorItem);
    //             /* istanbul ignore else */
    //             if (captchaContainerRef.current) {
    //                 const container = captchaContainerRef.current;
    //                 /* istanbul ignore else */
    //                 if (container) {
    //                     window.AwsWafCaptcha.renderCaptcha(container, {
    //                         apiKey:
    //                             'RBZU8IWC5aE9Yu8JJBeFlZYOTjQGvZodLGvr7/Xnmt169UkbVbvqp4G3FKtULv1A3WoYUGuqIGTvfFCJX8MvYILjQOWdMTnj4u+46mmWr9QXEL/iEurBd19fZSIFCrNonkWon74i9G8Q5cnMbQNy59WuYnqWpbzewRygF4+UMhwcI8CmZieiPVNqFAVSvff5J+J8htfTLFn0ED2ehzncXAhE5tDc5XMfNGlyx6e8Mgqs5zulYds1aLZ/ELvvcMyr5aqWY3AWDyArm2+7x4MoCLFFFo+pAtJPUOlUDdbILaso9K7bumpR4VorQ3gsMbxNj9NEaIqYalEJJxS8NaibODAwzQCPoVpaeLzYPOiwOWRtya0RZAdyA6YZ5RQzl7VCmBZ4STULlL5QUCmRczMHd7zD4acaGwQyoyjnU3vlEBisFOgZhydNYHwxSAnzF7jMKcIhGtIWrh3IRotOFBWljlIJUFRanqOPoJgl14mHVXKNIQNabNFCRoGLTxRsLuDmaQzjwq2nDLk5wpBqwedfGzAn14s5D1qyIhG730qkU7UoFx7vUeBkAXGBwgUU3Kgz4PPp+c+DtCHQk8wRzs1VnodIbu/8ZlHoDCfbM0HI8i4mv7JQQAXol6xPwJHXO9Uj6qbicjt1ll6HYv2h4NRBKot8d9QmbFoKM4JPCpM2Pq4=_1_1',
    //                         onSuccess: captchaExampleSuccessFunction,
    //                         onError: captchaExampleErrorFunction,
    //                         // ...other configuration parameters as needed...
    //                     });
    //                 } else {
    //                     console.error('Captcha container not found');
    //                 }
    //             }
    //         };

    //         // Call showMyCaptcha when the component mounts
    //         showMyCaptcha();
    //     }
    // }, [dlorItem, captchaLoaded]);
    // const [confirmationOpen, setConfirmationOpen] = React.useState(false);
    const defaultFormValues = {
        subjectCode: '',
        schoolName: '',
        otherComments: '',
        notify: false,
        sendDemographics: false,
        sendNotify: false,
        preferredName: '',
        userEmail: '',
    };

    const [formValues, setFormValues] = React.useState(defaultFormValues);
    const [isNotifyOpened, setIsNotifyOpened] = React.useState(false);
    // const [notifyType, setNotifyType] = React.useState('');
    const [confirmLocale, setConfirmLocale] = React.useState({});
    // useEffect(() => {
    //     if (document.getElementById('captcha-script')) return;
    //     if (!dlorItem) return;

    //     const script = document.createElement('script');
    //     script.src = 'https://b842968e7955.edge.captcha-sdk.awswaf.com/b842968e7955/jsapi.js';
    //     script.type = 'text/javascript';
    //     script.async = false;
    //     script.defer = true;
    //     script.id = 'captcha-script';

    //     script.onload = () => {
    //         // Wait for the script to be fully loaded and initialized
    //         setTimeout(() => {
    //             if (window.AwsWafIntegration && window.AwsWafCaptcha) {
    //                 window.AwsWafIntegration.saveReferrer();
    //                 const container = captchaContainerRef.current;
    //                 if (container) {
    //                     window.AwsWafCaptcha.renderCaptcha(container, {
    //                         apiKey:
    //                             'RBZU8IWC5aE9Yu8JJBeFlZYOTjQGvZodLGvr7/Xnmt169UkbVbvqp4G3FKtULv1A3WoYUGuqIGTvfFCJX8MvYILjQOWdMTnj4u+46mmWr9QXEL/iEurBd19fZSIFCrNonkWon74i9G8Q5cnMbQNy59WuYnqWpbzewRygF4+UMhwcI8CmZieiPVNqFAVSvff5J+J8htfTLFn0ED2ehzncXAhE5tDc5XMfNGlyx6e8Mgqs5zulYds1aLZ/ELvvcMyr5aqWY3AWDyArm2+7x4MoCLFFFo+pAtJPUOlUDdbILaso9K7bumpR4VorQ3gsMbxNj9NEaIqYalEJJxS8NaibODAwzQCPoVpaeLzYPOiwOWRtya0RZAdyA6YZ5RQzl7VCmBZ4STULlL5QUCmRczMHd7zD4acaGwQyoyjnU3vlEBisFOgZhydNYHwxSAnzF7jMKcIhGtIWrh3IRotOFBWljlIJUFRanqOPoJgl14mHVXKNIQNabNFCRoGLTxRsLuDmaQzjwq2nDLk5wpBqwedfGzAn14s5D1qyIhG730qkU7UoFx7vUeBkAXGBwgUU3Kgz4PPp+c+DtCHQk8wRzs1VnodIbu/8ZlHoDCfbM0HI8i4mv7JQQAXol6xPwJHXO9Uj6qbicjt1ll6HYv2h4NRBKot8d9QmbFoKM4JPCpM2Pq4=_1_1',
    //                         onSuccess: async voucher => {
    //                             try {
    //                                 const response = await window.AwsWafIntegration.fetch(
    //                                     CAPTCHA_DEMOGRAPHICS_API().apiUrl,
    //                                     {
    //                                         method: 'POST',
    //                                         headers: {
    //                                             'Content-Type': 'application/json',
    //                                         },
    //                                         body: JSON.stringify({
    //                                             dlorUuid: dlorItem?.object_public_uuid,
    //                                             recaptcha: 'ABC',
    //                                             demographics: {
    //                                                 school: formValues?.schoolName || '',
    //                                                 subject: formValues?.subjectCode || '',
    //                                                 subscribeRequest: {
    //                                                     userName: formValues?.preferredName || '',
    //                                                     userEmail: formValues?.userEmail || '',
    //                                                 },
    //                                             },
    //                                         }),
    //                                     },
    //                                 );

    //                                 console.log('Full response:', response);
    //                                 console.log('Response headers:', response.headers);
    //                                 console.log('Response status:', response.status);

    //                                 if (!response.ok) {
    //                                     const errorText = await response.text();
    //                                     console.log('Error response body:', errorText);
    //                                     throw new Error(`HTTP error! Status: ${response.status}, Body: ${errorText}`);
    //                                 }

    //                                 console.log('Success response:', response);
    //                                 setDemographicsConfirmation(true);
    //                                 setFormValues(defaultFormValues);
    //                             } catch (error) {
    //                                 console.error('Detailed fetch error:', {
    //                                     message: error.message,
    //                                     stack: error.stack,
    //                                 });
    //                             }
    //                         },
    //                         onError: error => {
    //                             console.error('Captcha error:', error);
    //                         },
    //                     });
    //                 }
    //             } else {
    //                 console.error('AWS WAF CAPTCHA SDK not properly initialized');
    //             }
    //         }, 1000); // Give the script time to initialize
    //     };

    //     script.onerror = error => {
    //         console.error('Failed to load CAPTCHA script:', error);
    //     };

    //     document.head.appendChild(script);

    //     // Cleanup
    //     return () => {
    //         const scriptElement = document.getElementById('captcha-script');
    //         if (scriptElement) {
    //             document.head.removeChild(scriptElement);
    //         }
    //     };
    // }, [dlorItem]);
    // Add this state near your other useState declarations
    const [isFavoriteActionInProgress, setIsFavoriteActionInProgress] = useState(false);

    // console.log(dlorId, 'Loading=', dlorItemLoading, '; Error=', dlorItemError, '; dlorItem=', dlorItem);
    // console.log('Updating=', dlorItemUpdating, '; Error=', dlorUpdatedItemError, '; dlorItem=', dlorUpdatedItem);

    const isLoggedIn = !!account?.id;

    const formatDate = dateString => {
        /* istanbul ignore next */ if (!dateString) return '';

        const date = new Date(dateString);
        const options = {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        };

        return date
            .toLocaleString('en-AU', options)
            .replace(',', '') // Remove comma after day
            .replace(/\s+/g, ' ') // Normalize spaces
            .replace(/(\d{4})/, ', $1') // Add comma before year
            .replace(/\s,/, ','); // Remove space before comma
    };

    useEffect(() => {
        const siteHeader = document.querySelector('uq-site-header');
        !!siteHeader && siteHeader.setAttribute('secondleveltitle', breadcrumbs.dlor.title);
        !!siteHeader && siteHeader.setAttribute('secondLevelUrl', breadcrumbs.dlor.pathname);
    }, []);
    // PENDING CHANGE - left in to merge when ticket for require login is built.

    // async function sha256(message) {
    //     // Encode as UTF-8
    //     const msgBuffer = new TextEncoder('utf-8').encode(message);
    //     // Hash the message
    //     const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    //     // Convert ArrayBuffer to Array
    //     const hashArray = Array.from(new Uint8Array(hashBuffer));
    //     // Convert bytes to hex string
    //     const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
    //     return hashHex;
    //   }

    // useEffect(() => {
    //     if (dlorItem && dlorItem.object_public_uuid) {
    //         // check if they have access param requirement. If it doesnt match, reject.
    //         // if it does match, require them to log in.
    //         const url = new URL(window.location.href);
    //         const params = url.searchParams;
    //         const hasParam2value = params.get('vw');
    //         if (hasParam2value) {
    //             sha256(dlorItem.object_public_uuid).then(hash => {
    //                 if (hash !== hasParam2value) {
    //                     console.log("XXXTHEY ARE NOT ALLOWED IN - HASH MUNGED", hash)
    //                 } else {
    //                     console.log("XXXTHEY ARE ALLOWED - Requires login.")
    //                 }
    //             });
    //         }

    //     }
    // }, [dlorItem]);

    useEffect(() => {
        if (!dlorFavouritesList) {
            actions.loadDlorFavourites();
        }
    }, [actions, dlorFavouritesList]);

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
        const theNewValue = e.target.value;

        const newValues = { ...formValues, [prop]: theNewValue };

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

    useEffect(() => {
        // Google Analytics to push pageView for object
        /* istanbul ignore else */
        if (!!dlorItem && !!dlorItem.object_title) {
            window.dataLayer = window.dataLayer || /* istanbul ignore next */ []; // for tests
            window.dataLayer.push({
                event: 'pageview',
                page_title: dlorItem.object_title,
            });
            document.title = dlorItem.object_title;
        }
    }, [dlorItem]);

    const navigateToObjectLink = React.useCallback(() => {
        window.location.href = dlorItem?.object_link_url;
    }, [dlorItem?.object_link_url]);

    const demograpicsResponseLocale = {
        confirmationTitle: 'Demographic information saved',
        confirmationMessage: 'We will use this information to help improve our services.',
        confirmButtonLabel: 'OK',
    };

    // const notifyResponseLocale = {
    //     confirmationTitle: 'Notification request saved',
    //     confirmationMessage: 'Please check your email to confirm your subscription request.',
    //     confirmButtonLabel: 'OK',
    // };
    useEffect(() => {
        // when the save attempt comes back...
        // if they only sent demographics, we only wait for the "in progress" because we dont care what it responds

        if (!dlorItemUpdating && !!formValues?.sendDemographics && !dlorUpdatedItemError) {
            console.log('A');
            setFormValues({ ...defaultFormValues, preferredName: account?.firstName, userEmail: account?.mail });
            setConfirmLocale(demograpicsResponseLocale);
            setIsDemographicsOpened(false);
            setIsNotifyOpened(false);
            setDemographicsConfirmation(true);
            // navigateToObjectLink();
        }
        if (!dlorItemUpdating && !!formValues?.sendNotify && !dlorUpdatedItemError) {
            console.log('B');
            const updatingMessage =
                dlorUpdatedItem?.data?.subscription === false
                    ? 'You are already subscribed'
                    : 'Please check your email to confirm your subscription request.';
            const getConfirmationTitle = !!dlorUpdatedItem
                ? updatingMessage
                : /* istanbul ignore next */ 'There was a problem saving your subscription request - please try again later.';
            setConfirmLocale({
                confirmationTitle: getConfirmationTitle,
                confirmationMessage: '',
                confirmButtonLabel: 'OK',
            });
            setFormValues({ ...defaultFormValues, preferredName: account?.firstName, userEmail: account?.mail });
            setIsDemographicsOpened(false);
            setIsNotifyOpened(false);
            setDemographicsConfirmation(true);
            // navigateToObjectLink();
        }
        if (!!dlorUpdatedItemError && (!!formValues?.sendDemographics || !!formValues?.sendNotify)) {
            console.log('ERROR IF');
            setFormValues({ ...formValues, sendDemographics: false, sendNotify: false });
            setConfirmLocale({
                confirmationTitle: 'There was a problem saving your supplied information - please try again later.',
                confirmationMessage: '',
                confirmButtonLabel: 'OK',
            });
            setIsDemographicsOpened(false);
            setIsNotifyOpened(false);
            setDemographicsConfirmation(true);
        }
        //  they sent a notify then we will show a dialog, either success or failure
        // if (!dlorItemUpdating && (!!dlorUpdatedItem || !!dlorUpdatedItemError) && !!formValues?.notify) {
        //     console.log('C');
        //     setConfirmationOpen(true);
        // }
    }, [
        dlorItemUpdating,
        dlorUpdatedItem,
        dlorUpdatedItemError,
        formValues?.notify,
        navigateToObjectLink,
        formValues?.sendDemographics,
    ]);

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
        window.location.href = isDlorAdminUser(account)
            ? dlorAdminLink(`/edit/${uuid}`)
            : `/digital-learning-hub/edit/${uuid}`;
    };

    // const saveAndNavigate = dlorItem => {
    //     // console.log('saveAndNavigate formValues', dlorItem.object_link_url, formValues);

    //     if (formValues.schoolName.length > 0 || formValues.subjectCode.length > 0 || !!formValues.notify) {
    //         const valuestoSend = {
    //             dlorUuid: dlorItem.object_public_uuid,
    //             demographics: {
    //                 subject: formValues.subjectCode,
    //                 school: formValues.schoolName,
    //                 comments: formValues.otherComments,
    //             },
    //             subscribeRequest: {
    //                 userName: !!formValues.notify ? formValues.preferredName : '',
    //                 userEmail: !!formValues.notify ? formValues.userEmail : '',
    //             },
    //         };
    //         /* istanbul ignore else */
    //         if (!!account.id) {
    //             valuestoSend.subscribeRequest.loggedin = true;
    //         }

    //         const cypressTestCookie = cookies.hasOwnProperty('CYPRESS_TEST_DATA')
    //             ? cookies.CYPRESS_TEST_DATA
    //             : /* istanbul ignore next */ null;
    //         /* istanbul ignore else */
    //         if (!!cypressTestCookie && location.host === 'localhost:2020' && cypressTestCookie === 'active') {
    //             setCookie('CYPRESS_DATA_SAVED', valuestoSend);
    //         }
    //         actions.saveDlorDemographics(valuestoSend);
    //         // navigation to link happens when the save has started via useEffect on dlorItemUpdating}
    //     } else {
    //         navigateToObjectLink();
    //     }
    // };

    const saveDemographicsAndNotify = dlorItem => {
        const valuestoSend = {
            dlorUuid: dlorItem.object_public_uuid,
            demographics: {
                subject: isDemographicsOpened ? formValues?.subjectCode : '',
                school: isDemographicsOpened ? formValues.schoolName : '',
                comments: isDemographicsOpened ? formValues.otherComments : '',
            },
            subscribeRequest: {
                userName: isNotifyOpened ? formValues?.preferredName : '',
                userEmail: isNotifyOpened ? formValues?.userEmail : '',
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
        actions.saveDlorDemographics(valuestoSend).then(() => {
            setFormValues({
                ...formValues,
                sendDemographics: valuestoSend.demographics.subject.length > 0,
                sendNotify: valuestoSend.subscribeRequest.userName.length > 0,
                demographics: {
                    subjectCode: '',
                    schoolName: '',
                    otherComments: '',
                },
                subscribeRequest: {
                    userName: '',
                    userEmail: '',
                },
            });
        });

        /* istanbul ignore else */
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
        console.log('GetItButtonLabel', dlorItem);
        const interactionType = dlorItem?.object_link_interaction_type || /* istanbul ignore next */ null;
        const fileType = dlorItem?.object_link_file_type || null;
        let label = 'Access the object';
        let details = '';

        if (interactionType === 'view') {
            console.log('item', dlorItem);
            const viewingTime = dlorItem?.object_link_size
                ? getDurationString(dlorItem?.object_link_size)
                : /* istanbul ignore next */ '';
            if (fileType && viewingTime) {
                details = `<br/>(${fileType} ${viewingTime})`; // Add line break
            } else if (fileType) {
                details = `(${fileType})`;
            } else {
                /* istanbul ignore else */
                if (viewingTime) {
                    details = `(${viewingTime})`;
                }
            }
        } else if (interactionType === 'download') {
            const fileSize = !!dlorItem?.object_link_size
                ? getFileSizeString(dlorItem?.object_link_size)
                : /* istanbul ignore next */ null;
            if (fileType && fileSize) {
                details = `<br/>(${fileType} ${fileSize})`; // Add line break
            } else if (fileType) {
                details = `(${fileType})`;
            } else {
                /* istanbul ignore else */
                if (fileSize) {
                    details = `(${fileSize})`;
                }
            }
        }

        if (details) {
            label = `Access the object ${details}`;
        }

        return <>{parse(label)}</>;
    }

    // Create a handler function for the favorite actions
    const handleFavoriteAction = async (action, uuid) => {
        // debouncer - not required to verify via test
        /* istanbul ignore next */
        if (isFavoriteActionInProgress) return;

        setIsFavoriteActionInProgress(true);
        try {
            await actions[action](uuid);
        } finally {
            // Re-enable after 1 second
            setTimeout(() => {
                setIsFavoriteActionInProgress(false);
            }, 1000);
        }
    };

    const canUserAccessObject = (account, restrictTo) => {
        switch (restrictTo) {
            case 'uqlibrarystaff':
                return isLibraryStaff(account);
            case 'uqstaff':
                return isStaff(account);
            case 'uquser':
                return isUQOnlyUser(account);
            case 'none':
            default:
                return true;
        }
    };

    const getAccessDeniedMessage = restrictTo => {
        switch (restrictTo) {
            case 'uqlibrarystaff':
                return 'You need to be a UQ Library staff member to access this object';
            case 'uqstaff':
                return 'You need to be a UQ staff member to access this object';
            default:
                return 'You need to be a UQ staff or student to access this object';
        }
    };

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
                    hideCancelButton
                    isOpen={demographicsConfirmation}
                    locale={confirmLocale}
                    onAction={() => setDemographicsConfirmation(false)}
                />
                {/* <ConfirmationBox
                    actionButtonColor="primary"
                    actionButtonVariant="contained"
                    confirmationBoxId="dlor-demographics-notification"
                    hideCancelButton
                    isOpen={demographicsConfirmation}
                    locale={notifyType === 'demographics' ? demograpicsResponseLocale : notifyResponseLocale}
                    onAction={() => setDemographicsConfirmation(false)}
                /> */}
                {/* Demographics questions dialog - move to seperate component */}
                <Dialog open={isDemographicsOpened}>
                    <DialogTitle>Help us understand how you will use this object</DialogTitle>
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <form>
                            <FormControl variant="standard" fullWidth>
                                <InputLabel htmlFor="subjectCode">
                                    What course or session are you using this object for?
                                </InputLabel>
                                <Input
                                    id="subjectCode"
                                    data-testid="view-demographics-subject-code"
                                    value={formValues?.subjectCode}
                                    onChange={handleChange('subjectCode')}
                                />
                            </FormControl>
                            <FormControl variant="standard" fullWidth sx={{ marginTop: '10px' }}>
                                <InputLabel htmlFor="schoolName">What is your school, faculty or unit?</InputLabel>
                                <Input
                                    id="schoolName"
                                    data-testid="view-demographics-school-name"
                                    value={formValues?.schoolName}
                                    onChange={handleChange('schoolName')}
                                />
                            </FormControl>
                            <FormControl variant="standard" fullWidth sx={{ marginTop: '10px' }}>
                                <InputLabel htmlFor="otherComments">Other comments?</InputLabel>
                                <Input
                                    id="otherComments"
                                    data-testid="view-demographics-other-comments"
                                    value={formValues?.otherComments}
                                    onChange={handleChange('otherComments')}
                                />
                            </FormControl>
                        </form>
                        <Box sx={{ display: 'flex', gap: '10px', mt: 2, justifyContent: 'flex-end' }}>
                            <Button
                                aria-label="Cancel"
                                onClick={() => setIsDemographicsOpened(false)}
                                data-testid="demographics-cancel"
                                variant="contained"
                                color="secondary"
                            >
                                Cancel
                            </Button>
                            <Button
                                aria-label="Save my demographics"
                                onClick={() => saveDemographicsAndNotify(dlorItem)}
                                data-testid="demographics-capture"
                                variant="contained"
                                color="primary"
                                disabled={!account.id || !formValues?.subjectCode || !formValues?.schoolName}
                            >
                                Continue
                            </Button>
                        </Box>
                    </DialogContent>
                </Dialog>
                {/* Notification dialog */}
                <Dialog open={isNotifyOpened}>
                    <DialogTitle>Notify you of any changes to this object</DialogTitle>
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <form style={{ width: '100%' }}>
                            <FormControl variant="standard" fullWidth>
                                <InputLabel htmlFor="preferredName">Your name</InputLabel>
                                <Input
                                    id="preferredName"
                                    data-testid="view-notify-preferredName"
                                    value={formValues?.preferredName}
                                    onChange={handleChange('preferredName')}
                                />
                            </FormControl>
                            <FormControl variant="standard" fullWidth sx={{ marginTop: '10px' }}>
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
                        </form>
                        <Box sx={{ display: 'flex', gap: '10px', mt: 2, justifyContent: 'flex-end' }}>
                            <Button
                                aria-label="Cancel"
                                onClick={() => setIsNotifyOpened(false)}
                                data-testid="notifications-cancel"
                                variant="contained"
                                color="secondary"
                            >
                                Cancel
                            </Button>
                            <Button
                                aria-label="Notify Me"
                                onClick={() => saveDemographicsAndNotify(dlorItem)}
                                data-testid="notifications-capture"
                                variant="contained"
                                color="primary"
                                disabled={!isValidEmail(formValues?.userEmail) || !formValues?.preferredName}
                            >
                                Continue
                            </Button>
                        </Box>
                    </DialogContent>
                </Dialog>
                <div>
                    {getTitleBlock()}
                    {console.log('Can Access object?', canUserAccessObject(account, dlorItem?.object_restrict_to))}
                    {!canUserAccessObject(account, dlorItem?.object_restrict_to) ? (
                        <Box
                            sx={{
                                padding: '1em',
                                marginBottom: '12px',
                                borderColor: '#f8d7da',
                                backgroundColor: '#f8d7da',
                                color: '#721c24',
                                borderRadius: '3px',
                            }}
                            data-testid="access-denied-message"
                        >
                            <Typography>{getAccessDeniedMessage(dlorItem?.object_restrict_to)}</Typography>
                            <LoginPrompt account={account} instyle={{ marginTop: '12px' }} />
                        </Box>
                    ) : (
                        <StyledContentGrid container spacing={4} data-testid="dlor-detailpage">
                            <Grid item xs={12} md={9}>
                                <LoginPrompt account={account} instyle={{ marginBottom: '12px' }} />
                                <Box
                                    sx={{
                                        marginBottom: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <StyledTitleTypography component={'h1'} variant={'h4'}>
                                        {dlorItem?.object_title}
                                    </StyledTitleTypography>
                                    {!!isLoggedIn && (
                                        <>
                                            {dlorFavouritesList?.some(
                                                fav => fav.object_public_uuid === dlorItem?.object_public_uuid,
                                            ) ? (
                                                <Tooltip title="Remove from Favourites" arrow>
                                                    <StarIcon
                                                        onClick={() =>
                                                            handleFavoriteAction(
                                                                'removeFavourite',
                                                                dlorItem?.object_public_uuid,
                                                            )
                                                        }
                                                        sx={{
                                                            fill: '#FFD700',
                                                            cursor: isFavoriteActionInProgress
                                                                ? 'not-allowed'
                                                                : 'pointer',
                                                            fontSize: '2rem',
                                                        }}
                                                        data-testid="favorite-star-icon"
                                                    />
                                                </Tooltip>
                                            ) : (
                                                <Tooltip title="Add to Favourites" arrow>
                                                    <StarBorderIcon
                                                        onClick={() =>
                                                            handleFavoriteAction(
                                                                'addFavourite',
                                                                dlorItem?.object_public_uuid,
                                                            )
                                                        }
                                                        sx={{
                                                            fill: '#666',
                                                            cursor: isFavoriteActionInProgress
                                                                ? 'not-allowed'
                                                                : 'pointer',
                                                            fontSize: '2rem',
                                                        }}
                                                        data-testid="favorite-star-outline-icon"
                                                    />
                                                </Tooltip>
                                            )}
                                        </>
                                    )}
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
                                                    <BookmarkIcon
                                                        sx={{ fill: '#51247A', marginRight: '2px', width: 20 }}
                                                    />
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
                                                    <Link
                                                        to={`/digital-learning-hub/series/${dlorItem.object_series_id}`}
                                                    >
                                                        <StyledTagLabelSpan
                                                            data-testid={
                                                                'dlor-detailpage-object-series-name-custom-indicator'
                                                            }
                                                        >
                                                            Series: {dlorItem?.object_series_name}
                                                        </StyledTagLabelSpan>
                                                    </Link>
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
                                    <Grid container spacing={1}>
                                        <Grid item xs={12} sm={8}>
                                            {!!dlorItem?.object_description && parse(dlorItem.object_description)}
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            {/* Demographics and notification buttons */}
                                            <StyledUQActionButton noMargin>
                                                <Button
                                                    aria-label="Click to access the object"
                                                    onClick={() => navigateToObjectLink()}
                                                    data-testid="detailpage-clicklink"
                                                    class="extended"
                                                >
                                                    {getItButtonLabel(dlorItem)}
                                                </Button>
                                            </StyledUQActionButton>
                                            <div style={{ backgroundColor: '#ddd', padding: '5px', marginTop: '10px' }}>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        gap: '8px',
                                                    }}
                                                >
                                                    <Typography
                                                        variant="p"
                                                        sx={{ marginTop: '0px', textAlign: 'center' }}
                                                    >
                                                        Keep up to date
                                                    </Typography>
                                                    <Chip
                                                        data-testid="detailpage-notify-button"
                                                        disabled={!account?.id}
                                                        onClick={() => setIsNotifyOpened(true)}
                                                        icon={<NotificationsActive />}
                                                        label="Notify me"
                                                        sx={{
                                                            backgroundColor: '#51247a',
                                                            color: 'white',
                                                            paddingLeft: '5px',
                                                            '& .MuiChip-label': {
                                                                color: 'white !important',
                                                                fontWeight: 'bold',
                                                            },
                                                            '& .MuiChip-icon': {
                                                                color: 'white !important',
                                                            },
                                                        }}
                                                    />
                                                </Box>
                                            </div>
                                            <div style={{ backgroundColor: '#ddd', padding: '5px', marginTop: '10px' }}>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        gap: '8px',
                                                    }}
                                                >
                                                    <Typography
                                                        variant="p"
                                                        sx={{ marginTop: '0px', textAlign: 'center' }}
                                                    >
                                                        Using this object?
                                                    </Typography>
                                                    <Chip
                                                        disabled={!account?.id}
                                                        onClick={() => setIsDemographicsOpened(true)}
                                                        data-testid="detailpage-demographics-button"
                                                        label="Let us know"
                                                        sx={{
                                                            paddingLeft: '5px',
                                                            backgroundColor: '#51247a',
                                                            color: 'white',
                                                            '& .MuiChip-label': {
                                                                color: 'white !important',
                                                                fontWeight: 'bold',
                                                            },
                                                            '& .MuiChip-icon': {
                                                                color: 'white !important',
                                                            },
                                                        }}
                                                    />
                                                </Box>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </StyledHeaderDiv>
                                {/* until we can implement a captcha, we can only take input from loggedin users :( */}
                                {/* {dlorItem?.object_link_url?.startsWith('http') && !account?.id && (
                                    <StyledUQActionButton class="marginBlock" data-testid="detailpage-getit-button">
                                        <a href={dlorItem.object_link_url}>{getItButtonLabel(dlorItem)}</a>
                                    </StyledUQActionButton>
                                )} */}
                                {/* {dlorItem?.object_link_url?.startsWith('http') && account?.id && (
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
                                                    </>
                                                )}
                                                <div>
                                                    <StyledUQActionButton>
                                                        <Button
                                                            aria-label="Click to access the object"
                                                            onClick={() => saveAndNavigate(dlorItem)}
                                                            data-testid="detailpage-clicklinkOLD"
                                                            disabled={
                                                                formValues?.notify && !isValidEmail(formValues?.userEmail)
                                                            }
                                                        >
                                                            Old button
                                                        </Button>
                                                    </StyledUQActionButton>
                                                </div>
                                            </form>
                                        </StyledDemographicsBox>
                                    )} */}
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
                                            Add the object to your course
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
                                <StyledLayoutBox>
                                    {!!isLoggedIn && (
                                        <Typography
                                            component={'p'}
                                            sx={{
                                                marginTop: '0px',
                                                marginBottom: '0px',
                                                fontSize: '0.9rem',
                                                color: '#666',
                                            }}
                                            data-testid="detailpage-last-updated"
                                        >
                                            <strong>Last reviewed:</strong>{' '}
                                            {formatDate(dlorItem?.object_review_date_next)}
                                        </Typography>
                                    )}
                                    <Typography
                                        component={'p'}
                                        sx={{
                                            marginTop: '0px',
                                            marginBottom: '0px',
                                            fontSize: '0.9rem',
                                            color: '#666',
                                        }}
                                        data-testid="detailpage-visibility"
                                    >
                                        <strong>Access: </strong>
                                        {(() => {
                                            switch (dlorItem?.object_restrict_to) {
                                                case 'uquser':
                                                    return 'This object is available to UQ staff and students.';
                                                case 'uqstaff':
                                                    return 'This object is available to UQ staff members only.';
                                                case 'uqlibrarystaff':
                                                    return 'This object is available to UQ Library staff members only.';
                                                case 'none':
                                                default:
                                                    return 'Anyone can access this object.';
                                            }
                                        })()}
                                    </Typography>
                                    {!!isLoggedIn && (
                                        <Typography
                                            component={'p'}
                                            sx={{
                                                marginTop: '0px',
                                                marginBottom: '0px',
                                                fontSize: '0.9rem',
                                                color: '#666',
                                            }}
                                            data-testid="detailpage-authenticated-link"
                                        >
                                            <strong>Secure URL: </strong>
                                            <a
                                                href={pathConfig.dlorViewSecure(dlorItem.object_public_uuid)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                data-testid="detailpage-authenticated-link-url"
                                            >
                                                {`${window.location.origin}${pathConfig.dlorViewSecure(
                                                    dlorItem.object_public_uuid,
                                                )}`}
                                            </a>
                                        </Typography>
                                    )}
                                </StyledLayoutBox>
                            </Grid>
                            <Grid item xs={12} md={3} data-testid="detailpage-metadata">
                                {dlorItem?.object_filters?.length > 0 && (
                                    <>
                                        {(isDlorAdminUser(account) || isDlorOwner(account, dlorItem)) && (
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
                                                                        <StyledFilterLink
                                                                            to={`/digital-learning-hub?filters=${value.id}`}
                                                                        >
                                                                            {value.name}
                                                                        </StyledFilterLink>
                                                                        {!!value?.help &&
                                                                            value?.help.startsWith('http') && (
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
                                                                <StyledFilterLink
                                                                    to={`/digital-learning-hub?keyword=${keyword
                                                                        .charAt(0)
                                                                        .toUpperCase() +
                                                                        keyword.slice(1).replace(/\s/g, '+')}`}
                                                                >
                                                                    {keyword.charAt(0).toUpperCase() + keyword.slice(1)}
                                                                </StyledFilterLink>
                                                            </li>
                                                        );
                                                    })}
                                                </StyledKeywordList>
                                            </div>
                                        )}
                                    </>
                                )}
                            </Grid>
                            <div ref={captchaContainerRef} id="my-captcha-container" />
                        </StyledContentGrid>
                    )}
                </div>
            </>
            <Button onClick={sendDemographics} variant="contained" color="primary" data-testid="send-demographics-test">
                Test CAPTCHA
            </Button>
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
    dlorFavouritesList: PropTypes.array,
};

export default React.memo(DLOView);
