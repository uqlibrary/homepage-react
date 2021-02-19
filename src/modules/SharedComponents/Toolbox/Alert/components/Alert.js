import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import Close from '@material-ui/icons/Close';

import ErrorOutline from '@material-ui/icons/ErrorOutline';
import Error from '@material-ui/icons/Error';
import Warning from '@material-ui/icons/Warning';
import Info from '@material-ui/icons/Info';
import InfoOutlined from '@material-ui/icons/InfoOutlined';
import Help from '@material-ui/icons/Help';
import HelpOutline from '@material-ui/icons/HelpOutline';
import Done from '@material-ui/icons/Done';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import { makeStyles } from '@material-ui/styles';

const classNames = require('classnames');

const useStyles = makeStyles(
    theme => ({
        common: {
            borderRadius: 0,
            paddingTop: 8,
            paddingBottom: 8,
        },
        '@keyframes wiggle': {
            from: { transform: 'rotate(-30deg)', transformOrigin: '40% 50%' },
            to: { transform: 'rotate(15deg)', transformOrigin: '40% 50%' },
        },
        wiggler: {
            animationName: '$wiggle',
            animationDuration: '0.3s',
            animationIterationCount: 20,
            animationDirection: 'alternate',
            animationTimingFunction: 'ease-in-out',
        },
        icon: {
            '& .icon': {
                fontSize: 28,
                marginRight: 12,
                marginBottom: -6,
                marginLeft: -6,
            },
            '& .spinner': {
                margin: '8px 24px 0 6px',
            },
        },
        text: {
            alignSelf: 'center',
            padding: '4px 0',
            textShadow: '1px 1px 1px rgba(0, 0, 0, 0.2)',
            verticalAlign: 'middle',
        },
        actionButton: {
            marginRight: -4,
            '& .action': {
                [theme.breakpoints.down('xs')]: {
                    marginRight: 12,
                },
            },
        },
        dismissButton: {
            marginLeft: -8,
            marginRight: -19,
            marginTop: -12,
            marginBottom: -12,
        },
        linked: {
            '&:hover': {
                cursor: 'pointer',
            },
        },
        error: {
            color: theme.palette.white.main,
            backgroundColor: theme.palette.error.main,
            '& a:link, & a:hover, & a:visited': {
                color: theme.palette.white.main,
                textDecoration: 'underline',
            },
            '& .spinner': {
                color: theme.palette.error.dark,
            },
            '& .icon': {
                color: theme.palette.error.dark,
            },
            '& .dismiss': {
                color: theme.palette.error.dark,
            },
            '& .action': {
                color: theme.palette.white.main,
                backgroundColor: theme.palette.error.dark,
            },
        },
        error_outline: {
            color: theme.palette.white.main,
            backgroundColor: theme.palette.error.main,
            '& a:link, & a:hover, & a:visited': {
                color: theme.palette.white.main,
                textDecoration: 'underline',
            },
            '& .spinner': {
                color: theme.palette.error.dark,
            },
            '& .icon': {
                color: theme.palette.error.dark,
            },
            '& .dismiss': {
                color: theme.palette.error.dark,
            },
            '& .action': {
                color: theme.palette.white.main,
                backgroundColor: theme.palette.error.dark,
            },
        },
        warning: {
            color: theme.palette.white.main,
            backgroundColor: theme.palette.warning.main,
            '& a:link, & a:hover, & a:visited': {
                color: theme.palette.white.main,
                textDecoration: 'underline',
            },
            '& .spinner': {
                color: theme.palette.warning.dark,
            },
            '& .icon': {
                color: theme.palette.warning.dark,
            },
            '& .dismiss': {
                color: theme.palette.warning.dark,
            },
            '& .action': {
                color: theme.palette.white.main,
                backgroundColor: theme.palette.warning.dark,
            },
        },
        help: {
            color: theme.palette.white.main,
            backgroundColor: theme.palette.secondary.main,
            '& a:link, & a:hover, & a:visited': {
                color: theme.palette.white.main,
                textDecoration: 'underline',
            },
            '& .spinner': {
                color: theme.palette.secondary.dark,
            },
            '& .icon': {
                color: theme.palette.secondary.dark,
            },
            '& .dismiss': {
                color: theme.palette.secondary.dark,
            },
            '& .action': {
                color: theme.palette.white.main,
                backgroundColor: theme.palette.secondary.dark,
            },
        },
        help_outline: {
            color: theme.palette.white.main,
            backgroundColor: theme.palette.secondary.main,
            '& a:link, & a:hover, & a:visited': {
                color: theme.palette.white.main,
                textDecoration: 'underline',
            },
            '& .spinner': {
                color: theme.palette.secondary.dark,
            },
            '& .icon': {
                color: theme.palette.secondary.dark,
            },
            '& .dismiss': {
                color: theme.palette.secondary.dark,
            },
            '& .action': {
                color: theme.palette.white.main,
                backgroundColor: theme.palette.secondary.dark,
            },
        },
        info: {
            color: theme.palette.white.main,
            backgroundColor: theme.palette.accent.main,
            '& a:link, & a:hover, & a:visited': {
                color: theme.palette.white.main,
                textDecoration: 'underline',
            },
            '& .spinner': {
                color: theme.palette.accent.dark,
            },
            '& .icon': {
                color: theme.palette.accent.dark,
            },
            '& .dismiss': {
                color: theme.palette.accent.dark,
            },
            '& .action': {
                color: theme.palette.white.main,
                backgroundColor: theme.palette.accent.dark,
            },
        },
        info_outline: {
            color: theme.palette.white.main,
            backgroundColor: theme.palette.accent.main,
            '& a:link, & a:hover, & a:visited': {
                color: theme.palette.white.main,
                textDecoration: 'underline',
            },
            '& .spinner': {
                color: theme.palette.accent.dark,
            },
            '& .icon': {
                color: theme.palette.accent.dark,
            },
            '& .dismiss': {
                color: theme.palette.accent.dark,
            },
            '& .action': {
                color: theme.palette.white.main,
                backgroundColor: theme.palette.accent.dark,
            },
        },
        done: {
            color: theme.palette.white.main,
            backgroundColor: theme.palette.success.light,
            '& a:link, & a:hover, & a:visited': {
                color: theme.palette.white.main,
                textDecoration: 'underline',
            },
            '& .spinner': {
                color: theme.palette.success.dark,
            },
            '& .icon': {
                color: theme.palette.success.dark,
            },
            '& .dismiss': {
                color: theme.palette.success.dark,
            },
            '& .action': {
                color: theme.palette.white.main,
                backgroundColor: theme.palette.success.dark,
            },
        },
    }),
    { withTheme: true },
);

export const Alert = ({
    action,
    actionButtonLabel,
    allowDismiss,
    customIcon,
    customType,
    disableAlertClick,
    dismissAction,
    dismissTitle,
    message,
    showLoader,
    alertId,
    title,
    type,
    wiggle,
    canHide,
}) => {
    const classes = useStyles();
    const [hideAlert, setHideAlert] = useState(false);
    const renderIcon = type => {
        switch (type) {
            case 'custom':
                return customIcon;
            case 'error':
                return (
                    <Error id="error-icon" className="icon" aria-label="Error alert." focusable aria-hidden="false" />
                );
            case 'error_outline':
                return (
                    <ErrorOutline
                        id="error-outline-icon"
                        className="icon"
                        aria-label="Error alert."
                        focusable
                        aria-hidden="false"
                    />
                );
            case 'warning':
                return (
                    <Warning
                        id="warning-icon"
                        className="icon"
                        aria-label="Important alert."
                        focusable
                        aria-hidden="false"
                    />
                );
            case 'info':
                return <Info id="info-icon" className="icon" aria-label="Alert." focusable aria-hidden="false" />;
            case 'info_outline':
                return (
                    <InfoOutlined
                        id="info-outline-icon"
                        className="icon"
                        aria-label="Alert."
                        focusable
                        aria-hidden="false"
                    />
                );
            case 'help':
                return <Help id="help-icon" className="icon" aria-label="Help alert." focusable aria-hidden="false" />;
            case 'help_outline':
                return (
                    <HelpOutline
                        id="help-outline-icon"
                        className="icon"
                        aria-label="Help aler.t"
                        focusable
                        aria-hidden="false"
                    />
                );
            case 'done':
                return (
                    <Done id="done-icon" className="icon" aria-label="Success alert." focusable aria-hidden="false" />
                );
            default:
                return (
                    <Error id="error-icon" className="icon" aria-label="Error alert." focusable aria-hidden="false" />
                );
        }
    };
    const hideThisAlert = () => {
        setHideAlert(true);
    };

    if (!!hideAlert) {
        return null;
    } else {
        return (
            <div
                className={classNames(classes[!!customIcon ? customType : type], classes.common)}
                data-testid={alertId}
                id={alertId}
            >
                <div className="layout-card">
                    <Grid container spacing={1} justify="center" alignItems="center" alignContent="center">
                        <Grid item xs={12} sm className={action && !disableAlertClick && classes.linked}>
                            <Grid container justify="center" alignItems="center" alignContent="center">
                                <Grid
                                    item
                                    className={`${classes.icon} alert-icon ${wiggle ? classes.wiggler : ''}`}
                                    onClick={!disableAlertClick && action}
                                    onKeyDown={!disableAlertClick && action}
                                    id={`${alertId}-action-icon-button`}
                                    data-testid={`${alertId}-action-icon-button`}
                                >
                                    {showLoader ? (
                                        <CircularProgress id="spinner" className="spinner" size={38} thickness={3} />
                                    ) : (
                                        renderIcon(type)
                                    )}
                                </Grid>
                                <Grid
                                    item
                                    xs
                                    className={`${classes.text} alert-text`}
                                    onClick={!disableAlertClick && action}
                                    onKeyDown={!disableAlertClick && action}
                                    id={`${alertId}-action-message-button`}
                                    data-testid={`${alertId}-action-message-button`}
                                >
                                    <strong>{title}</strong>
                                    &nbsp;
                                    {message}
                                </Grid>
                                {allowDismiss && dismissAction && (
                                    <Hidden smUp>
                                        <Grid item className={classes.dismissButton}>
                                            <IconButton
                                                onClick={dismissAction}
                                                aria-label={dismissTitle}
                                                id={`${alertId}-dismiss-button-mobile`}
                                                data-testid={`${alertId}-dismiss-button-mobile`}
                                            >
                                                <Close />
                                            </IconButton>
                                        </Grid>
                                    </Hidden>
                                )}
                                {canHide && (
                                    <Hidden smUp>
                                        <Grid item className={classes.dismissButton}>
                                            <IconButton
                                                onClick={hideThisAlert}
                                                aria-label={dismissTitle}
                                                id={`${alertId}-hide-button-mobile`}
                                                data-testid={`${alertId}-hide-button-mobile`}
                                            >
                                                <Close />
                                            </IconButton>
                                        </Grid>
                                    </Hidden>
                                )}
                            </Grid>
                        </Grid>
                        {action && actionButtonLabel && (
                            <Grid item xs sm="auto" className={classes.actionButton}>
                                <Button
                                    variant="text"
                                    children={actionButtonLabel}
                                    onClick={action}
                                    fullWidth
                                    className="action alert-button"
                                    id={`${alertId}-action-button`}
                                    data-testid={`${alertId}-action-button`}
                                />
                            </Grid>
                        )}
                        {allowDismiss && dismissAction && (
                            <Hidden xsDown>
                                <Grid item className={classes.dismissButton}>
                                    <IconButton
                                        onClick={dismissAction}
                                        aria-label={dismissTitle}
                                        id={`${alertId}-dismiss-button`}
                                        data-testid={`${alertId}-dismiss-button`}
                                    >
                                        <Close />
                                    </IconButton>
                                </Grid>
                            </Hidden>
                        )}
                        {!!canHide && (
                            <Hidden xsDown>
                                <Grid item className={classes.dismissButton}>
                                    <IconButton
                                        onClick={hideThisAlert}
                                        aria-label={dismissTitle}
                                        id={`${alertId}-hide-button`}
                                        data-testid={`${alertId}-hide-button`}
                                    >
                                        <Close />
                                    </IconButton>
                                </Grid>
                            </Hidden>
                        )}
                    </Grid>
                </div>
            </div>
        );
    }
};

Alert.propTypes = {
    action: PropTypes.func,
    actionButtonLabel: PropTypes.string,
    allowDismiss: PropTypes.bool,
    canHide: PropTypes.bool,
    customIcon: PropTypes.any,
    customType: PropTypes.oneOf([
        null,
        'error',
        'error_outline',
        'warning',
        'info',
        'info_outline',
        'help',
        'help_outline',
        'done',
        'custom',
    ]),
    disableAlertClick: PropTypes.bool,
    dismissAction: PropTypes.func,
    dismissTitle: PropTypes.string,
    message: PropTypes.any.isRequired,
    showLoader: PropTypes.bool,
    alertId: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.oneOf([
        'error',
        'error_outline',
        'warning',
        'info',
        'info_outline',
        'help',
        'help_outline',
        'done',
        'custom',
    ]),
    wiggle: PropTypes.bool,
};

Alert.defaultProps = {
    allowDismiss: true,
    canHide: true,
    customIcon: null,
    customType: null,
    disableAlertClick: false,
    dismissTitle: 'Click to dismiss this alert',
    message:
        'Some items on your page have not loaded properly and may not work as expected. This issue has been automatically reported.',
    showLoader: false,
    type: 'error',
    wiggle: null,
};

export default Alert;
