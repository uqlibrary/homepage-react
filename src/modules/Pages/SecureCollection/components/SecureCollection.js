import React from 'react';
import { Redirect } from 'react-router';
import PropTypes from 'prop-types';

import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import { AUTH_URL_LOGIN } from 'config';

export const SecureCollection = ({
    actions,
    account,
    secureCollectionCheck,
    secureCollectionCheckLoading,
    secureCollectionCheckError,
}) => {
    console.log('SecureCollection - account = ', account);
    console.log('SecureCollection - secureCollectionCheck = ', secureCollectionCheck);
    console.log('SecureCollection - secureCollectionCheckLoading = ', secureCollectionCheckLoading);
    console.log('SecureCollection - secureCollectionCheckError = ', secureCollectionCheckError);

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
        // ok: {url: "https://dddnk7oxlhhax.cloudfront.net/secure/exams/0001/3e201.pdf?...", displaypanel: 'redirect'}
    }, [actions]);

    // TODO figure out 'acknowledged'

    let displayPanel;
    let finalLink;
    if (!!secureCollectionCheckError) {
        console.log('displayPanel: error form api');
        displayPanel = 'error';
    } else if (!secureCollectionCheckError && !!secureCollectionCheckLoading) {
        console.log('displayPanel: loading');
        displayPanel = 'loading';
    } else if (!secureCollectionCheck || !secureCollectionCheck.response) {
        console.log('displayPanel: !secureCollectionCheck.response');
        displayPanel = 'error'; // shouldnt happen if Error = false
    } else if (secureCollectionCheck.response === 'No such collection') {
        console.log('displayPanel: received "No such collection" for ', window.location.href);
        displayPanel = 'invalidRequest';
    } else if (secureCollectionCheck.response === 'Invalid User') {
        console.log('displayPanel: received "Invalid User" for ', window.location.href);
        displayPanel = 'invalidUser';
    } else if (secureCollectionCheck.displayPanel === 'commercialCopyright' && !!secureCollectionCheck.url) {
        console.log('displayPanel: received "commercialCopyright" for ', window.location.href);
        finalLink = secureCollectionCheck.url;
        displayPanel = 'commercialCopyright';
    } else if (secureCollectionCheck.displayPanel === 'statutoryCopyright' && !!secureCollectionCheck.url) {
        console.log('displayPanel: received "statutoryCopyright" for ', window.location.href);
        finalLink = secureCollectionCheck.url;
        displayPanel = 'statutoryCopyright';
    } else if (secureCollectionCheck.response === 'Login required') {
        console.log('displayPanel: received "Login required" for ', window.location.href);

        if (!account || !account.id) {
            window.location.assign(`${AUTH_URL_LOGIN}?return=${window.btoa(window.location.href)}`);
        } else if (!!secureCollectionCheck.url) {
            displayPanel = 'redirect';
            finalLink = secureCollectionCheck.url;
        } else {
            displayPanel = 'error';
        }
    } else {
        // this shouldnt happen
        displayPanel = 'error';
    }

    const getFileExtension = url => {
        if (url === undefined) {
            return false;
        }

        const dotPosition = url.lastIndexOf('.');
        if (dotPosition !== undefined && dotPosition >= 0) {
            return url.substr(dotPosition + 1);
        } else {
            return false;
        }
    };

    const wrapSegmentInStandardPage = (title, Segment) => {
        return (
            <StandardPage title="Secure Collection" goBackFunc={() => history.back()}>
                <section aria-live="assertive">
                    <StandardCard title={title}>
                        <Grid container>
                            <Grid item xs={12} data-testid="course-resources" style={{ marginBottom: 24 }}>
                                {Segment}
                            </Grid>
                        </Grid>
                    </StandardCard>
                </section>
            </StandardPage>
        );
    };

    console.log('displayPanel = ', displayPanel);

    const fileExtension = !!finalLink && getFileExtension(finalLink);
    switch (displayPanel) {
        case 'error':
            return wrapSegmentInStandardPage(
                'System temporarily unavailable',
                <React.Fragment>
                    <p>
                        We're working on the issue and will have service restored as soon as possible. Please try again
                        later.
                    </p>
                </React.Fragment>,
            );
        case 'loading':
            return (
                <Grid item xs={'auto'} style={{ width: 80, marginRight: 20, marginBottom: 6, opacity: 0.3 }}>
                    <CircularProgress color="primary" size={20} data-testid="loading-secure-collection-check" />
                </Grid>
            );
        case 'invalidRequest':
            const emailAddress = 'webmaster@library.uq.edu.au';
            const emailSubject = 'Broken link to the Secure File Collection';
            const getEmailBody = () => {
                let emailBody = 'Hi there!' + '\n';
                emailBody += "I'd like to report a problem with the Secure File Collection." + '\n';
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

            return wrapSegmentInStandardPage(
                'This file does not exist or is unavailable.',
                <React.Fragment>
                    <p>Please check the link you have used.</p>
                    <p>
                        Email us at <a href={emailLink}>{emailAddress}</a> to report broken links.
                    </p>
                </React.Fragment>,
            );
        case 'commercialCopyright':
            return wrapSegmentInStandardPage(
                'Copyright Notice',
                <React.Fragment>
                    <p className={'copyrightsubhead'}>
                        This file is provided to support teaching and learning for the staff and students of the
                        University of Queensland
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
                        <paper-button class="button-colored-accent">
                            <a href={finalLink}>Acknowledge Copyright and Download</a>
                        </paper-button>
                    </div>

                    {/* TODO add conditionally!!! */}
                    <p>
                        Save the file with a name ending in <b>.{fileExtension}</b> so your system will know how to open
                        it.
                    </p>
                </React.Fragment>,
            );
        case 'statutoryCopyright':
            return wrapSegmentInStandardPage(
                'WARNING',
                <React.Fragment>
                    <p>
                        This material has been reproduced and communicated to you by or on behalf of The University of
                        Queensland in accordance with section 113P of the Copyright Act 1968 (Act). The material in this
                        communication may be subject to copyright under the Act.
                    </p>
                    <p>
                        Any further reproduction or communication of this material by you may be the subject of
                        copyright protection under the Act.
                    </p>

                    <div id="download">
                        <paper-button class="button-colored-accent">
                            <a href="{finalLink}">Acknowledge Copyright and Download</a>
                        </paper-button>
                    </div>

                    <p>
                        Save the file with a name ending in <b>.{fileExtension}</b> so your system will know how to open
                        it.
                    </p>
                </React.Fragment>,
            );
        case 'invalidUser':
            return wrapSegmentInStandardPage(
                '',
                <React.Fragment>
                    <p>Access to this file is only available to UQ staff and students.</p>
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
        case 'redirect':
            return wrapSegmentInStandardPage(
                '',
                <React.Fragment>
                    <p>We are preparing the file, you should be redirected shortly.</p>
                    <p>
                        <a href="{finalLink}">Download the file</a> if the page does not redirect.
                    </p>

                    <Redirect to={finalLink} />
                </React.Fragment>,
            );
        default:
            break;
    }

    return <div className="waiting empty">Secure Collection output will go here</div>;
};

SecureCollection.propTypes = {
    actions: PropTypes.object,
    account: PropTypes.object,
    secureCollectionCheck: PropTypes.object,
    secureCollectionCheckLoading: PropTypes.bool,
    secureCollectionCheckError: PropTypes.any,
};

export default React.memo(SecureCollection);
