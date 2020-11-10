import React from 'react';
import PropTypes from 'prop-types';

import { default as locale } from '../footerLocale.js';
import { default as menuLocale } from 'locale/menu';

import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    connectFooter: {
        fontWeight: '300',
        lineHeight: '25px',
        margin: '0 auto 0 auto',
        maxWidth: '1200px',
        padding: '20px 0',
        position: 'relative',
        '& a': {
            color: theme.palette.secondary.dark,
            textDecoration: 'none',
            '&:hover': {
                color: theme.palette.primary.main,
                textDecoration: 'underline',
            },
        },
    },
    navigation: {
        '& ul': {
            padding: 0,
            [theme.breakpoints.down('sm')]: {
                textAlign: 'center',
            },
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
        display: 'inline-block',
    },
    socialButtonClass: {
        backgroundColor: '#000 !important',
        color: theme.palette.white.main,
        '&:hover': {
            backgroundColor: theme.palette.accent.dark + '!important',
        },
    },
    internal: {
        bottom: '1rem',
        position: 'absolute',
        [theme.breakpoints.down('sm')]: {
            bottom: 'auto',
            marginTop: '1rem',
            position: 'relative',
            textAlign: 'center',
        },
    },
    giving: {
        '& div': {
            marginLeft: 'auto',
            [theme.breakpoints.down('sm')]: {
                margin: '5px auto',
                maxWidth: '300px',
            },
        },
        textAlign: 'right',
    },
    givingBlock: {
        marginRight: 10,
    },
    givingButtonClass: {
        color: theme.palette.white.main + '!important',
        backgroundColor: theme.palette.accent.main,
        '&:hover': {
            backgroundColor: theme.palette.accent.dark,
        },
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
    const { classes, history } = props;

    const _navigateToLink = (url, target = '_self') => {
        const isInternaLink = url => url.indexOf('http') === -1;
        if (!!url) {
            if (isInternaLink(url)) {
                history.push(url);
            } else if (target === '_self') {
                window.location.assign(url);
            } else {
                // external link
                window.open(url, target);
            }
        }
    };

    const separator = () => (
        <Hidden mdUp className={classes.separator}>
            &nbsp;|&nbsp;
        </Hidden>
    );

    return (
        <Grid
            className={classes.connectFooter}
            container
            data-testid="connect-footer"
            alignItems="flex-start"
            justify="center"
        >
            <Grid item xs={12} md={4} className={classes.navigation}>
                <ul>
                    <li>
                        <a data-testid="footermenu-homepage" href={menuLocale.menuhome.linkTo}>
                            {menuLocale.menuhome.primaryText}
                        </a>
                        {separator()}
                    </li>
                    {menuLocale.publicmenu.map((linkProperties, index) => (
                        <li key={`footerli-${index}`}>
                            <a data-testid={linkProperties.dataTestid || null} href={linkProperties.linkTo}>
                                {linkProperties.primaryText}
                            </a>
                            {index < menuLocale.publicmenu.length - 1 && separator()}
                        </li>
                    ))}
                </ul>
            </Grid>
            <Grid item xs={12} md={4} className={classes.contacts}>
                <Grid container>
                    <Grid item xs={'auto'}>
                        <Typography variant={'h6'} component={'h3'}>
                            {locale.connectFooter.buttonSocialHeader}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={1} style={{ justifyContent: 'center' }}>
                    {locale.connectFooter.buttonSocial.map((item, index) => (
                        <Grid item xs={'auto'} key={`buttonSocial-${index}`} id={`buttonSocial-${index}`}>
                            <Tooltip
                                id={`auth-button-${index}`}
                                title={`${item.linkMouseOver}`}
                                placement="bottom"
                                TransitionProps={{ timeout: 300 }}
                            >
                                <Button
                                    aria-label={item.linkMouseOver}
                                    classes={{
                                        root: classes.socialButtonClass,
                                    }}
                                    color="primary"
                                    variant="contained"
                                    data-testid={item.dataTestid}
                                    id={`socialbutton-${index}`}
                                    onClick={() => _navigateToLink(item.linkTo, '_blank')}
                                >
                                    {!!item.linklabel ? item.linklabel : item.icon}
                                </Button>
                            </Tooltip>
                        </Grid>
                    ))}
                </Grid>
                <Grid className={classes.internal}>
                    {locale.connectFooter.internalLinks.map((linkProperties, index) => {
                        return (
                            <span key={`internallabel-${index}`}>
                                <a data-testid={linkProperties.dataTestid || null} href={linkProperties.linkTo}>
                                    {linkProperties.linklabel}
                                </a>
                                {index < locale.connectFooter.internalLinks.length - 1 && <span>&nbsp;|&nbsp; </span>}
                            </span>
                        );
                    })}
                </Grid>
            </Grid>
            <Grid item xs={12} md={4} className={classes.giving}>
                <Grid container spacing={2}>
                    {locale.connectFooter.givingLinks.map((item, index) => {
                        return (
                            <Grid item xs={12} md={8} key={`givingLinks-${index}`} className={classes.givingBlock}>
                                <Button
                                    fullWidth
                                    children={item.label}
                                    className={classes.givingButtonClass}
                                    data-testid={item.dataTestid}
                                    key={`givingLinks-${index}`}
                                    onClick={() => _navigateToLink(item.linkTo)}
                                    variant="contained"
                                />
                            </Grid>
                        );
                    })}
                </Grid>
            </Grid>
        </Grid>
    );
}

ConnectFooter.propTypes = {
    classes: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

ConnectFooter.defaultProps = {
    classes: {},
};

export default withStyles(styles, { withTheme: true })(ConnectFooter);
