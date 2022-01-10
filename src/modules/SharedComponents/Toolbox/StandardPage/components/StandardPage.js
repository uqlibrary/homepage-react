import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

export const useStyles = makeStyles(
    theme => ({
        wrapper: {},
        layoutCard: {
            width: '100%',
            padding: 0,
        },
        layoutTitle: {
            color: '#51247A',
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
        arrowBack: {
            marginLeft: -48,
            marginTop: -4,
            opacity: 0.5,
        },
    }),
    { withTheme: true },
);

export const StandardPage = ({ title, children }) => {
    const classes = useStyles();

    return (
        <div className="layout-card">
            <Grid justify={'flex-start'} container spacing={0} data-testid="StandardPage" id="StandardPage">
                {title && (
                    <Grid item xs className={classes.title}>
                        <Typography
                            className={classes.layoutTitle}
                            component={'h1'}
                            data-testid="StandardPage-title"
                            variant={'h4'}
                        >
                            {title}
                        </Typography>
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
    help: PropTypes.object,
    children: PropTypes.any,
};

export default StandardPage;
