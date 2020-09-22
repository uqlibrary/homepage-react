import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { default as locale } from './locale.js';
import { default as menuLocale } from 'locale/menu';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import TwitterIcon from '@material-ui/icons/Twitter';
import YouTubeIcon from '@material-ui/icons/YouTube';

const uqBlue = 'rgb(14, 98, 235)';
const styles = theme => ({
    connectFooter: {
        fontWeight: '300',
        lineHeight: '25px',
        margin: '20px auto 0 auto',
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
        '& ul': {
            padding: 0,
        },
        '& li': {
            listStyle: 'none',
            margin: 0,
            padding: 0,
            [theme.breakpoints.down('sm')]: {
                display: 'inline-block',
            },
            '& a': {
                fontSize: '14px',
            },
        },
    },
    separator: {
        display: 'none',
        [theme.breakpoints.down('sm')]: {
            display: 'inline-block',
        },
    },
    socialButtonClass: {
        '& a': {
            backgroundColor: '#000 !important',
            color: '#fff',
        },
        '& div:first-child': {
            // blog button has to be forced wider
            minWidth: '5em',
        },
        [theme.breakpoints.down('sm')]: {
            maxWidth: '400px',
            margin: '0 auto',
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
            marginLeft: 'auto',
            [theme.breakpoints.down('sm')]: {
                margin: '5px auto',
            },
        },
        textAlign: 'right',
    },
    givingButtonClass: {
        color: theme.palette.white.main + '!important',
        backgroundColor: uqBlue,
        '&:hover': {
            backgroundColor: theme.palette.white.main,
            color: 'rgb(14, 98, 235) !important',
        },
        width: '70%',
        marginBottom: '1rem',
        padding: '1rem',
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
    const separator = <li className={classes.separator}>&nbsp;|&nbsp;</li>;
    return (
        <Grid className={classes.connectFooter} container data-testid="connect-footer">
            <Grid item xs={12} md={4} className={classes.navigation}>
                <ul>
                    <li>
                        <a href={menuLocale.home.linkTo} data-testid={menuLocale.home.dataTestid}>
                            {menuLocale.home.primaryText}
                        </a>
                    </li>
                    {separator}
                    {menuLocale.menu.map((item, index) => (
                        <Fragment>
                            <li>
                                <a
                                    href={item.linkTo}
                                    data-testid={item.dataTestid}
                                    rel={item.relOpener || 'noopener noreferrer'}
                                >
                                    {item.primaryText}
                                </a>
                            </li>
                            {index < menuLocale.menu.length - 1 && separator}
                        </Fragment>
                    ))}
                </ul>
            </Grid>
            <Grid item xs={12} md={4} className={classes.contacts}>
                <Grid container>
                    <Grid item>
                        <Typography variant={'h6'} component={'h3'}>
                            Connect with us
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container className={classes.socialButtonClass}>
                    <Grid aria-disabled="false" item role="button" xs={2}>
                        <IconButton
                            color="primary"
                            href="https://web.library.uq.edu.au/blog"
                            target="_blank"
                            title="Library Blog"
                            data-testid="connect-blog-link"
                        >
                            Blog
                        </IconButton>
                    </Grid>
                    <Grid item xs={2} role="button" aria-disabled="false">
                        <IconButton
                            href="https://twitter.com/UQ_Library"
                            target="_blank"
                            title="Library on Twitter"
                            data-testid="connect-twitter-link"
                        >
                            <TwitterIcon />
                        </IconButton>
                    </Grid>
                    <Grid item xs={2} role="button" aria-disabled="false">
                        <IconButton
                            href="https://www.facebook.com/uniofqldlibrary"
                            target="_blank"
                            title="Library on Facebook"
                            data-testid="connect-facebook-link"
                        >
                            <FacebookIcon />
                        </IconButton>
                    </Grid>
                    <Grid item xs={2} role="button" aria-disabled="false">
                        <IconButton
                            href="https://www.instagram.com/uniofqldlibrary/"
                            target="_blank"
                            title="Library on Instagram"
                            data-testid="connect-instagram-link"
                        >
                            <InstagramIcon />
                        </IconButton>
                    </Grid>
                    <Grid item xs={2} role="button" aria-disabled="false">
                        <IconButton
                            href="https://www.youtube.com/user/uqlibrary"
                            target="_blank"
                            title="Library on YouTube"
                            data-testid="connect-youtube-link"
                        >
                            <YouTubeIcon />
                        </IconButton>
                    </Grid>
                </Grid>
                <div className={classes.internal}>
                    {locale.connectFooter.internalLinks.map((item, index) => {
                        return (
                            <Fragment>
                                <a
                                    href={item.linkTo}
                                    data-testid={item.dataTestid}
                                    rel={item.relOpener || 'noopener noreferrer'}
                                >
                                    {item.linklabel}
                                </a>
                                {index < locale.connectFooter.internalLinks.length - 1 && <span>&nbsp;|&nbsp; </span>}
                            </Fragment>
                        );
                    })}
                </div>
            </Grid>
            <Grid item xs={12} md={4} className={classes.giving}>
                {locale.connectFooter.givingLinks.map(item => {
                    return (
                        <Button
                            variant="contained"
                            className={classes.givingButtonClass}
                            href={item.linkTo}
                            data-testid={item.dataTestid}
                            children={item.label}
                        />
                    );
                })}
            </Grid>
        </Grid>
    );
}

ConnectFooter.propTypes = {
    classes: PropTypes.object.isRequired,
};

ConnectFooter.defaultProps = {
    classes: {},
};

export default withStyles(styles, { withTheme: true })(ConnectFooter);
