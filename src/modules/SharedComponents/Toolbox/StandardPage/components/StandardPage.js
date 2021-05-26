import React from 'react';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import { HelpIcon } from 'modules/SharedComponents/Toolbox/HelpDrawer';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

export const useStyles = makeStyles(
    theme => ({
        wrapper: {},
        layoutCard: {
            width: '100%',
            padding: 0,
        },
        layoutTitle: {
            overflowWrap: 'break-word !important',
            maxWidth: 1200,
            width: '90%',
            marginTop: 12,
            marginBottom: 0,
            marginLeft: 'auto',
            marginRight: 'auto',
            padding: 0,
            [theme.breakpoints.down('sm')]: {
                margin: '0 auto 12px auto',
            },
        },
        title: {
            marginLeft: -58,
            marginBottom: 24,
            [theme.breakpoints.down('sm')]: {
                marginLeft: -20,
                marginBottom: 8,
            },
        },
        helpIcon: {
            position: 'absolute',
            right: '10px',
        },
        arrowBack: {
            marginLeft: -48,
            marginTop: -4,
            opacity: 0.5,
        },
    }),
    { withTheme: true },
);

export const getBackNavFunc = history => {
    if (!document.referrer) {
        return null;
    }
    if (!!history && typeof history.goBack === 'function') {
        return () => {
            history.goBack();
        };
    }
    return () => {
        window.history.back();
    };
};

export const StandardPage = ({
    title,
    children,
    help,
    goBackFunc: customGoBackFunc = false,
    goBackTooltip = 'Go back',
}) => {
    const history = useHistory();
    const classes = useStyles();

    const goBackFunc = customGoBackFunc !== false ? customGoBackFunc : getBackNavFunc(history);

    const renderBackButton = () =>
        !!goBackFunc && (
            <Hidden xsDown>
                <Tooltip
                    id="StandardPage-goback-tooltip"
                    data-testid="StandardPage-goback-tooltip"
                    title={goBackTooltip}
                    TransitionProps={{ timeout: 300 }}
                >
                    <IconButton
                        className={classes.arrowBack}
                        onClick={goBackFunc}
                        id="StandardPage-goback-button"
                        data-testid="StandardPage-goback-button"
                    >
                        <ArrowBackIcon color="secondary" />
                    </IconButton>
                </Tooltip>
            </Hidden>
        );

    return (
        <div className="layout-card">
            <Grid justify={'flex-start'} container spacing={0} data-testid="StandardPage" id="StandardPage">
                {title && (
                    <Grid item xs className={classes.title}>
                        <Typography
                            className={classes.layoutTitle}
                            color={'primary'}
                            component={'h2'}
                            data-testid="StandardPage-title"
                            variant={'h4'}
                        >
                            {renderBackButton()}
                            {title}
                        </Typography>
                    </Grid>
                )}
                {help && (
                    <Grid item xs={'auto'} className={classes.helpIcon}>
                        <HelpIcon {...help} />
                    </Grid>
                )}
                <Grid item xs={12}>
                    {children}
                </Grid>
            </Grid>
        </div>
    );
};

StandardPage.propTypes = {
    title: PropTypes.any,
    goBackFunc: PropTypes.func,
    goBackTooltip: PropTypes.string,
    help: PropTypes.object,
    children: PropTypes.any,
};

export default StandardPage;
