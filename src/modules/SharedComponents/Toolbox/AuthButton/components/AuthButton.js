import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Person from '@material-ui/icons/Person';
import PersonOutline from '@material-ui/icons/PersonOutline';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(
    theme => ({
        iconButton: {
            color: theme.palette.primary.main,
        },
        iconButtonLabel: {
            display: 'flex',
            flexDirection: 'column',
            fontSize: 12,
        },
        iconButtonRoot: {
            color: theme.palette.primary.main,
        },
    }),
    { withTheme: true },
);

export const AuthButton = ({ isAuthorizedUser, ariaLabel, onClick }) => {
    const classes = useStyles();
    return (
        <div className="auth-button-wrapper">
            <IconButton
                aria-label={ariaLabel}
                onClick={onClick}
                className={isAuthorizedUser ? 'log-out-button' : 'log-in-button'}
                classes={{
                    root: classes.iconButtonRoot,
                    label: classes.iconButtonLabel,
                }}
            >
                {isAuthorizedUser ? (
                    <Person id="logged-in-icon" className={classes.iconButton} />
                ) : (
                    <PersonOutline id="logged-out-icon" className={classes.iconButton} />
                )}
                <div>{!!isAuthorizedUser ? 'Log out' : 'Log in'}</div>
            </IconButton>
        </div>
    );
};

AuthButton.propTypes = {
    isAuthorizedUser: PropTypes.bool.isRequired,
    ariaLabel: PropTypes.string,
    onClick: PropTypes.func,
};

export default AuthButton;
