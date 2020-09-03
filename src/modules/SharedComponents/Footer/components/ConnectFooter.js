import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    connectFooter: {
        fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
        fontSize: '14px',
        fontWeight: '300',
        lineHeight: '25px',
        margin: '0 auto',
        maxWidth: '1200px',
        position: 'relative',
        '& a': {
            color: '#333',
            textDecoration: 'none',
        },
        '& div': {
            [theme.breakpoints.down('sm')]: {
                textAlign: 'center',
            },
        },
    },
    navigation: {
        padding: '20px',
        '& ul': {
            margin: '0 0 0 20px',
            padding: 0,
        },
        '& li': {
            listStyle: 'none',
            margin: 0,
            padding: 0,
            [theme.breakpoints.down('sm')]: {
                display: 'inline-block',
            },
        },
    },
    separator: {
        display: 'none',
        [theme.breakpoints.down('sm')]: {
            display: 'inline-block',
        },
    },
    buttonColoredAccent: {
        display: 'flex', // needed to get the wiiiide button for Giving buttons
        margin: '10px auto 0 auto',
        maxWidth: '244px',
        width: '100%',
        '& a': {
            backgroundColor: '#0e62eb',
            border: '1px solid #0e62eb',
            borderRadius: '3px',
            boxShadow:
                '0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2)',
            color: '#fff',
            maxWidth: '244px',
            outlineWidth: 0,
            padding: '0.7em',
            textAlign: 'center',
            transition: 'box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
            width: '100%',
            '&:hover': {
                backgroundColor: '#fff',
                color: '#0e62eb !important',
                fontWeight: 'bold',
                textDecoration: 'none',
            },
        },
    },
    buttonSocial: {
        maxWidth: '400px',
        margin: '0 auto',
        '& div': {
            backgroundColor: '#000',
            borderRadius: '4px',
            height: '33px',
            margin: '0 5px',
            padding: '8px 0 0',
            width: '33px',
        },
        '& a': {
            color: '#fff',
            display: 'block',
            margin: 0,
            textAlign: 'center',
            textDecoration: 'none',
            textTransform: 'uppercase',
        },
        '& img': {
            height: '20px',
            lineHeight: 0,
            width: '20px',
        },
        [theme.breakpoints.down('sm')]: {
            textAlign: 'center',
        },
    },
    internal: {
        bottom: '1rem',
        position: 'absolute',
        [theme.breakpoints.down('sm')]: {
            bottom: 'auto',
            marginTop: '1rem',
            position: 'relative',
        },
    },
    giving: {
        '& div': {
            [theme.breakpoints.down('sm')]: {
                margin: '5px auto',
            },
        },
    },
    contacts: {
        '& div': {
            '& div': {
                [theme.breakpoints.down('sm')]: {
                    margin: '0 auto',
                },
            },
        },
    },
});

export function ConnectFooter(props) {
    const { classes } = props;
    return (
        <Grid className={`${classes.connectFooter}`} container spacing={3}>
            <Grid item xs={12} md={4} className={`${classes.navigation}`}>
                {/* if we continue with this display, it should be driven by the json that creates the megamenu... */}
                <ul>
                    <li>
                        <a href="http://www.library.uq.edu.au" data-testid="connect-home-link">
                            Library home
                        </a>
                    </li>
                    <li className={`${classes.separator}`}>&nbsp;|&nbsp;</li>
                    <li>
                        <a
                            href="https://web.library.uq.edu.au/library-services"
                            data-testid="connect-services-link"
                            rel="noopener noreferrer"
                        >
                            Library services
                        </a>
                    </li>
                    <li className={`${classes.separator}`}>&nbsp;|&nbsp;</li>
                    <li>
                        <a
                            href="https://web.library.uq.edu.au/research-tools-techniques"
                            data-testid="connect-research-link"
                            rel="noopener noreferrer"
                        >
                            Research tools &amp; techniques
                        </a>
                    </li>
                    <li className={`${classes.separator}`}>&nbsp;|&nbsp;</li>
                    <li>
                        <a
                            href="https://web.library.uq.edu.au/collections"
                            data-testid="connect-collections-link"
                            rel="noopener noreferrer"
                        >
                            Collections
                        </a>
                    </li>
                    <li className={`${classes.separator}`}>&nbsp;|&nbsp;</li>
                    <li>
                        <a
                            href="https://web.library.uq.edu.au/borrowing-requesting"
                            data-testid="connect-borrowing-link"
                            rel="noopener noreferrer"
                        >
                            Borrowing &amp; requesting
                        </a>
                    </li>
                    <li className={`${classes.separator}`}>&nbsp;|&nbsp;</li>
                    <li>
                        <a
                            href="https://web.library.uq.edu.au/locations-hours"
                            data-testid="connect-locations-link"
                            rel="noopener noreferrer"
                        >
                            Locations &amp; hours
                        </a>
                    </li>
                    <li className={`${classes.separator}`}>&nbsp;|&nbsp;</li>
                    <li>
                        <a
                            href="https://web.library.uq.edu.au/about-us"
                            data-testid="connect-about-link"
                            rel="noopener noreferrer"
                        >
                            About
                        </a>
                    </li>
                    <li className={`${classes.separator}`}>&nbsp;|&nbsp;</li>
                    <li>
                        <a
                            href="https://web.library.uq.edu.au/contact-us"
                            data-testid="connect-contact-link"
                            rel="noopener noreferrer"
                        >
                            Contact us
                        </a>
                    </li>
                </ul>
            </Grid>
            <Grid item xs={12} md={4} className={`${classes.contacts}`}>
                <Grid container>
                    <Grid item>
                        <Typography
                            style={{ fontSize: '1.2rem', color: '#000', marginBottom: '10px', fontWeight: 400 }}
                            variant={'h3'}
                        >
                            Connect with us
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container className={`${classes.buttonSocial}`}>
                    <Grid aria-disabled="false" item role="button" style={{ paddingTop: '7px' }} tabIndex="-1" xs={2}>
                        <a
                            href="https://web.library.uq.edu.au/blog"
                            rel="noopener noreferrer"
                            target="_blank"
                            title="Library Blog"
                            data-testid="connect-blog-link"
                        >
                            Blog
                        </a>
                    </Grid>
                    <Grid item xs={2} tabIndex="-1" role="button" aria-disabled="false">
                        <a
                            href="https://twitter.com/UQ_Library"
                            rel="external noopener noreferrer"
                            target="_blank"
                            title="Library on Twitter"
                            data-testid="connect-twitter-link"
                        >
                            <img
                                alt="Twitter icon"
                                aria-label="Library on Twitter"
                                src="//assets.library.uq.edu.au/reusable-components/resources/social-media-icons/twitter.png"
                                title="Twitter"
                            />
                        </a>
                    </Grid>
                    <Grid item xs={2} tabIndex="-1" role="button" aria-disabled="false">
                        <a
                            href="https://www.facebook.com/uniofqldlibrary"
                            rel="external noopener noreferrer"
                            target="_blank"
                            title="Library on Facebook"
                            data-testid="connect-facebook-link"
                        >
                            <img
                                alt="Facebook icon"
                                aria-label="Library on Facebook"
                                src="//assets.library.uq.edu.au/reusable-components/resources/social-media-icons/facebook.png"
                                title="Facebook"
                            />
                        </a>
                    </Grid>
                    <Grid item xs={2} role="button" aria-disabled="false">
                        <a
                            href="https://www.instagram.com/uniofqldlibrary/"
                            rel="external noopener noreferrer"
                            tabIndex="-1"
                            target="_blank"
                            title="Library on Instagram"
                            data-testid="connect-instagram-link"
                        >
                            <img
                                alt="Instagram icon"
                                aria-label="Library on Instagram"
                                src="//assets.library.uq.edu.au/reusable-components/resources/social-media-icons/instagram.png"
                                title="Instagram"
                            />
                        </a>
                    </Grid>
                    <Grid item xs={2} tabIndex="-1" role="button" aria-disabled="false">
                        <a
                            href="https://www.youtube.com/user/uqlibrary"
                            rel="external noopener noreferrer"
                            target="_blank"
                            title="Library on YouTube"
                            data-testid="connect-youtube-link"
                        >
                            <img
                                alt="YouTube icon"
                                aria-label="Library on YouTube"
                                src="//assets.library.uq.edu.au/reusable-components/resources/social-media-icons/youtube.png"
                                title="YouTube"
                            />
                        </a>
                    </Grid>
                </Grid>
                <div className={`${classes.internal}`}>
                    <a
                        href="https://support.my.uq.edu.au/app/library/feedback"
                        data-testid="connect-feedback-link"
                        rel="noopener noreferrer"
                    >
                        Feedback
                    </a>
                    &nbsp;|&nbsp;{' '}
                    <a
                        href="https://web.library.uq.edu.au/about-us/participate-customer-research"
                        data-testid="connect-participate-link"
                        rel="noopener noreferrer"
                    >
                        Help us improve
                    </a>{' '}
                    &nbsp;|&nbsp;{' '}
                    <a
                        href="https://web.library.uq.edu.au/sitemap"
                        data-testid="connect-sitemap-link"
                        rel="noopener noreferrer"
                    >
                        Site Map
                    </a>
                </div>
            </Grid>
            <Grid item xs={12} md={4} className={`${classes.giving}`}>
                <Grid
                    aria-disabled="false"
                    aria-label="Join Friends of the Library"
                    className={`${classes.buttonColoredAccent}`}
                    id="joinFriend"
                    item
                    role="button"
                    tabIndex="-1"
                    xs={12}
                >
                    <a
                        href="https://web.library.uq.edu.au/about-us/friends-library"
                        data-testid="connect-friends-link"
                        rel="noopener noreferrer"
                    >
                        Join Friends of the Library
                    </a>
                </Grid>
                <Grid
                    aria-disabled="false"
                    aria-label="Give to the Library"
                    className={`${classes.buttonColoredAccent}`}
                    id="giveToLibrary"
                    item
                    role="button"
                    tabIndex="-1"
                    xs={12}
                >
                    <a
                        href="https://www.uq.edu.au/giving/organisations/university-queensland-library"
                        data-testid="connect-give-link"
                        rel="noopener noreferrer"
                    >
                        Give to the Library
                    </a>
                </Grid>
            </Grid>
        </Grid>
    );
}

ConnectFooter.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired,
};

ConnectFooter.defaultProps = {
    className: '',
    classes: {},
};

export default withStyles(styles, { withTheme: true })(ConnectFooter);
