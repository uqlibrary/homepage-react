import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { default as locale } from './locale.js';
import { default as menuLocale } from 'locale/menu';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    connectFooter: {
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
    const separator = <li className={classes.separator}>&nbsp;|&nbsp;</li>;
    return (
        <Grid className={classes.connectFooter} container spacing={3} data-testid="connect-footer">
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
                <Grid container className={classes.buttonSocial}>
                    {locale.connectFooter.buttonSocial.map(item => (
                        <Grid aria-disabled="false" item role="button" style={{ paddingTop: '7px' }} xs={2}>
                            <a
                                href={item.linkTo}
                                rel={item.relOpener || 'noopener noreferrer'}
                                target="_blank"
                                title={item.linktitle}
                                data-testid={item.dataTestid}
                            >
                                {!!item.linklabel ? (
                                    item.linklabel
                                ) : (
                                    <img
                                        alt={item.imageAlt}
                                        aria-label={item.imageAriaLabel}
                                        src={item.imageSrc}
                                        title={item.imageTitle}
                                    />
                                )}
                            </a>
                        </Grid>
                    ))}
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
                        <Grid
                            aria-disabled="false"
                            aria-label={item.ariaLabel}
                            className={classes.buttonColoredAccent}
                            id={item.id}
                            item
                            role="button"
                            xs={12}
                        >
                            <a
                                href={item.linkTo}
                                data-testid={item.dataTestid}
                                rel={item.relOpener || 'noopener noreferrer'}
                            >
                                {item.label}
                            </a>
                        </Grid>
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
    className: '',
    classes: {},
};

export default withStyles(styles, { withTheme: true })(ConnectFooter);
