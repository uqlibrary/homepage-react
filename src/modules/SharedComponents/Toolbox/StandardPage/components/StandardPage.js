import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import { HelpIcon } from 'modules/SharedComponents/Toolbox/HelpDrawer';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

const styles = theme => ({
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
});

export class Page extends Component {
    static propTypes = {
        title: PropTypes.any,
        goBackFunc: PropTypes.func,
        goBackTooltip: PropTypes.string,
        help: PropTypes.object,
        children: PropTypes.any,
        classes: PropTypes.object,
    };

    render() {
        const {
            classes,
            title,
            children,
            help,
            goBackFunc = () => (!!history && history.back()) || window.history.back(),
            goBackTooltip = 'Go back',
        } = this.props;
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
                                {!!goBackFunc && (
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
                                )}
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
    }
}

const StyledPage = withStyles(styles, { withTheme: true })(Page);
const StandardPage = props => <StyledPage {...props} />;
export default StandardPage;
