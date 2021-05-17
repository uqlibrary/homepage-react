import React from 'react';
import { Redirect } from 'react-router';
import PropTypes from 'prop-types';

import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import { AUTH_URL_LOGIN } from 'config';

const useStyles = makeStyles(
    () => ({
        followLink: {
            alignItems: 'center',
            backgroundColor: '#0e62eb',
            border: '1px solid #0e62eb',
            borderRadius: '3px',
            boxSizing: 'border-box',
            color: '#fff',
            display: 'flex',
            fontFamily: 'Roboto, Noto, sans-serif',
            fontSize: '16px',
            fontVariantCaps: 'normal',
            justifyContent: 'center',
            margin: '0 auto',
            maxWidth: '30em',
            outlineWidth: 0,
            padding: '0.7em 0.57em',
            textAlign: 'center',
            textTransform: 'uppercase',
            transitionDelay: '0s',
            transition: 'box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
            userSelect: 'none',
            zIndex: 0,
            '&:hover': {
                color: '#0e62eb !important',
                backgroundColor: '#fff',
                textDecoration: 'none',
            },
        },
    }),
    { withTheme: true },
);

export const SecureCollection = ({
    actions,
    account,
    secureCollectionCheck,
    secureCollectionCheckLoading,
    secureCollectionCheckError,
}) => {
    console.log('SecureCollection - account = ', account);
    console.log('SecureCollection - secureCollectionCheckLoading = ', secureCollectionCheckLoading);
    console.log('SecureCollection - secureCollectionCheckError = ', secureCollectionCheckError);
    console.log('SecureCollection - secureCollectionCheck = ', secureCollectionCheck);

    const classes = useStyles();

    const extractPathFromParams = params => {
        const searchParams = new URLSearchParams(params);
        if (!searchParams.has('collection') || !searchParams.has('file')) {
            // force 'No such collection' response from the api
            return 'unknown/unknown';
        }
        return `${searchParams.get('collection')}/${searchParams.get('file')}`;
    };

    React.useEffect(() => {
        !!actions.loadSecureCollectionCheck &&
            actions.loadSecureCollectionCheck(extractPathFromParams(window.location.search));

        // error: {response: true, responseText: "An unknown error occurred"}
        // no such folder: {response: "No such collection"}
        // unauthorised user: {response: "Invalid User"}
        // ok: {url: "https://dddnk7oxlhhax.cloudfront.net/secure/exams/0001/3e201.pdf?...", displayPanel: 'redirect'}
    }, [actions]);

    // TODO figure out 'acknowledged'

    let displayPanel;
    let finalLink;
    if (!secureCollectionCheckError && !secureCollectionCheckLoading && !secureCollectionCheck) {
        console.log('displayPanel: !secureCollectionCheck', secureCollectionCheck);
        displayPanel = 'error'; // shouldnt happen if Error = false
    } else if (
        !secureCollectionCheckError &&
        !secureCollectionCheckLoading &&
        secureCollectionCheck.response === 'No such collection'
    ) {
        console.log('displayPanel: received "No such collection" for ', window.location.href);
        displayPanel = 'noSuchCollection';
    } else if (
        !secureCollectionCheckError &&
        !secureCollectionCheckLoading &&
        secureCollectionCheck.response === 'Login required'
    ) {
        console.log('displayPanel: received "Login required" for ', window.location.href);

        if (!account || !account.id) {
            console.log('Login required: redirecting to auth');
            displayPanel = 'loginRequired';
        } else {
            displayPanel = 'loading';
            console.log('user is logged in: ', account);
            console.log('; load next api ', extractPathFromParams(window.location.search));
            !!actions.loadSecureCollectionFile &&
                actions.loadSecureCollectionFile(extractPathFromParams(window.location.search));
        }
    } else if (
        !secureCollectionCheckError &&
        !secureCollectionCheckLoading &&
        secureCollectionCheck.response === 'Invalid User'
    ) {
        console.log('displayPanel: received "Invalid User" for ', window.location.href);
        displayPanel = 'invalidUser';
    } else if (
        !secureCollectionCheckError &&
        !secureCollectionCheckLoading &&
        secureCollectionCheck.displayPanel === 'redirect'
    ) {
        if (!!secureCollectionCheck.url) {
            console.log('displayPanel: received "commercialCopyright" for ', window.location.href);
            finalLink = secureCollectionCheck.url;
            displayPanel = 'commercialCopyright';
        } else {
            console.log('secureCollectionCheck.url was missing for ', secureCollectionCheck.displayPanel);
            displayPanel = 'error';
        }
    } else if (
        !secureCollectionCheckError &&
        !secureCollectionCheckLoading &&
        secureCollectionCheck.displayPanel === 'commercialCopyright'
    ) {
        if (!!secureCollectionCheck.url) {
            console.log('displayPanel: received "commercialCopyright" for ', window.location.href);
            finalLink = secureCollectionCheck.url;
            displayPanel = 'commercialCopyright';
        } else {
            console.log('secureCollectionCheck.url was missing for ', secureCollectionCheck.displayPanel);
            displayPanel = 'error';
        }
    } else if (
        !secureCollectionCheckError &&
        !secureCollectionCheckLoading &&
        secureCollectionCheck.displayPanel === 'statutoryCopyright'
    ) {
        if (!!secureCollectionCheck.url) {
            console.log('displayPanel: received "statutoryCopyright" for ', window.location.href);
            finalLink = secureCollectionCheck.url;
            console.log('setting finalLink = ', secureCollectionCheck.url);
            displayPanel = 'statutoryCopyright';
        } else {
            console.log('secureCollectionCheck.url was missing for ', secureCollectionCheck.displayPanel);
            displayPanel = 'error';
        }
    } else if (!!secureCollectionCheckError) {
        console.log('displayPanel: error from api');
        displayPanel = 'error';
    } else if (!secureCollectionCheckError && !!secureCollectionCheckLoading) {
        console.log('displayPanel: loading');
        displayPanel = 'loading';
    } else {
        // this shouldnt happen
        console.log('this shouldnt happen');
        displayPanel = 'error';
    }

    const getFileExtension = filename => {
        if (filename === undefined) {
            return false;
        }

        // remove any search param from the url so we can easily extract the file extension
        const url = new URL(filename);
        url.search = '';
        const pathName = url.pathname;

        const dotPosition = pathName.lastIndexOf('.');
        if (dotPosition !== undefined && dotPosition >= 0) {
            return pathName.substr(dotPosition + 1);
        }

        return false;
    };

    const wrapFragmentInStandardPage = (title, fragment) => {
        return (
            <StandardPage title="Secure Collection" goBackFunc={() => history.back()}>
                <section aria-live="assertive">
                    <StandardCard title={title} noPadding>
                        <Grid container>
                            <Grid
                                item
                                xs={12}
                                data-testid="secure-collection"
                                style={{ marginBottom: 24, paddingLeft: 24, paddingRight: 24 }}
                            >
                                {fragment}
                            </Grid>
                        </Grid>
                    </StandardCard>
                </section>
            </StandardPage>
        );
    };

    console.log('displayPanel = ', displayPanel);

    const fileExtension = !!finalLink && getFileExtension(finalLink);

    function displayCommercialCopyrightAcknowledgementPanel() {
        return wrapFragmentInStandardPage(
            'Copyright Notice',
            <React.Fragment>
                <p className={'copyrightsubhead'}>
                    This file is provided to support teaching and learning for the staff and students of the University
                    of Queensland
                </p>
                <h3>COMMONWEALTH OF AUSTRALIA</h3>
                <h4>Copyright Regulations 1969</h4>
                <h5>WARNING</h5>
                <p>
                    This material has been reproduced and communicated to you by or on behalf of the University of
                    Queensland pursuant to Part VB of the Copyright Act 1968 (the Act).
                </p>
                <p>
                    The material in this communication may be subject to copyright under the Act. Any further
                    reproduction or communication of this material by you may be the subject of copyright protection
                    under the Act.
                </p>
                <div id="download">
                    <a className={classes.followLink} href={finalLink}>
                        Acknowledge Copyright and Download
                    </a>
                </div>
                {!!fileExtension && (
                    <p data-testid={'fileExtension'}>
                        Save the file with a name ending in <b>.{fileExtension}</b> so your system will know how to open
                        it.
                    </p>
                )}
            </React.Fragment>,
        );
    }

    function displayStatutoryCopyrightAcknowledgementPanel() {
        return wrapFragmentInStandardPage(
            'WARNING',
            <React.Fragment>
                <p>
                    This material has been reproduced and communicated to you by or on behalf of The University of
                    Queensland in accordance with section 113P of the Copyright Act 1968 (Act). The material in this
                    communication may be subject to copyright under the Act.
                </p>
                <p>
                    Any further reproduction or communication of this material by you may be the subject of copyright
                    protection under the Act.
                </p>
                <div id="download">
                    <a className={classes.followLink} href={finalLink}>
                        Acknowledge Copyright and Download
                    </a>
                </div>
                {!!fileExtension && (
                    <p data-testid={'fileExtension'}>
                        Save the file with a name ending in <b>.{fileExtension}</b> so your system will know how to open
                        it.
                    </p>
                )}
            </React.Fragment>,
        );
    }

    function displayUnknownCollectionPanel() {
        const emailAddress = 'webmaster@library.uq.edu.au';
        const emailSubject = 'Broken link to the Secure File Collection';
        const getEmailBody = () => {
            let emailBody = 'Hi there!' + '\n\n';
            emailBody += "I'd like to report a problem with the Secure File Collection." + '\n\n';
            if (document.referrer !== '') {
                emailBody += 'I was visiting ' + document.referrer + ' and clicked a link.' + '\n';
            }
            emailBody += 'I landed on ' + window.location.href + ' but it said the link wasnt valid.' + '\n\n';
            emailBody +=
                '(You can also include any other detail that will help us provide the file here, ' +
                'including where you were coming from)';
            return encodeURIComponent(emailBody);
        };
        const emailLink = `mailto:${emailAddress}?Subject=${emailSubject}&body=${getEmailBody()}`;

        return wrapFragmentInStandardPage(
            'This file does not exist or is unavailable.',
            <React.Fragment>
                <p>Please check the link you have used.</p>
                <p>
                    Email us at <a href={emailLink}>{emailAddress}</a> to report broken links.
                </p>
            </React.Fragment>,
        );
    }

    function displayApiErrorPanel() {
        return wrapFragmentInStandardPage(
            'System temporarily unavailable',
            <React.Fragment>
                <p>
                    We're working on the issue and will have service restored as soon as possible. Please try again
                    later.
                </p>
            </React.Fragment>,
        );
    }

    function displayNoAccessPanel() {
        return wrapFragmentInStandardPage(
            'Access to this file is only available to UQ staff and students.',
            <React.Fragment>
                <ul>
                    <li>
                        If you have another UQ account,{' '}
                        <a href="https://auth.library.uq.edu.au/logout">logout and switch accounts</a> to proceed.
                    </li>
                    <li>
                        <a href="https://web.library.uq.edu.au/contact-us">Contact us</a> if you should have file
                        collection access with this account.
                    </li>
                </ul>
                <p>
                    Return to the <a href="https://www.library.uq.edu.au/">Library Home Page</a>.
                </p>
            </React.Fragment>,
        );
    }

    function displayLoginRequiredRediectorPanel(loginLink) {
        console.log('loginLink = ', loginLink);
        return wrapFragmentInStandardPage(
            'Redirecting',
            <React.Fragment>
                <p>Login is required for this file.</p>

                <Grid item xs={'auto'} style={{ width: 80, marginRight: 20, marginBottom: 6, opacity: 0.3 }}>
                    <CircularProgress color="primary" size={20} data-testid="loading-secure-collection-check" />
                </Grid>

                {/* <Redirect to={loginLink} /> */}
            </React.Fragment>,
        );
    }

    function displayRedirectingPanel() {
        return wrapFragmentInStandardPage(
            'Redirecting',
            <React.Fragment>
                <p>We are preparing the file, you should be redirected shortly.</p>
                <p>
                    <a href={finalLink}>Download the file</a> if the page does not redirect.
                </p>

                <Redirect to={finalLink} />
            </React.Fragment>,
        );
    }

    switch (displayPanel) {
        case 'error':
            return displayApiErrorPanel();
        case 'loading':
            return (
                <Grid item xs={'auto'} style={{ width: 80, marginRight: 20, marginBottom: 6, opacity: 0.3 }}>
                    <CircularProgress color="primary" size={20} data-testid="loading-secure-collection-check" />
                </Grid>
            );
        case 'noSuchCollection':
            return displayUnknownCollectionPanel();
        case 'loginRequired':
            const loginLink = `${AUTH_URL_LOGIN}?return=${window.btoa(window.location.href)}`;
            return displayLoginRequiredRediectorPanel(loginLink);
        case 'commercialCopyright':
            return displayCommercialCopyrightAcknowledgementPanel();
        case 'statutoryCopyright':
            return displayStatutoryCopyrightAcknowledgementPanel();
        case 'invalidUser':
            return displayNoAccessPanel();
        case 'redirect':
            return displayRedirectingPanel();
        default:
            return wrapFragmentInStandardPage('', <div className="waiting empty">Something went wrong</div>);
    }
};

SecureCollection.propTypes = {
    actions: PropTypes.object,
    account: PropTypes.object,
    secureCollectionCheck: PropTypes.object,
    secureCollectionCheckLoading: PropTypes.bool,
    secureCollectionCheckError: PropTypes.any,
};

export default React.memo(SecureCollection);
