import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { ConnectFooter, MinimalFooter } from 'modules/SharedComponents/Footer';
import { HelpIcon } from 'modules/SharedComponents/Toolbox/HelpDrawer';

const styles = theme => ({
    layoutCard: {
        width: '100%',
        padding: 0,
    },
    layoutTitle: {
        overflowWrap: 'break-word !important',
        maxWidth: 1200,
        width: '90%',
        margin: '12px auto',
        padding: 0,
        [theme.breakpoints.down('sm')]: {
            margin: '0 auto 12px auto',
        },
    },
    helpIcon: {
        position: 'absolute',
        right: '10px',
    },
    connectFooter: {
        backgroundColor: theme.hexToRGBA(theme.palette.secondary.main, 0.15),
    },
    minimalFooter: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.white.main,
        backgroundImage: 'linear-gradient(90deg,#51247a,87%,#962a8b)',
    },
});

export class Page extends Component {
    static propTypes = {
        title: PropTypes.any,
        help: PropTypes.object,
        children: PropTypes.any,
        classes: PropTypes.object,
        history: PropTypes.object,
    };

    render() {
        const { classes, title, children, help } = this.props;
        return (
            <Grid container className="StandardPage">
                {title && (
                    <Grid item xs>
                        <Typography
                            className={classes.layoutTitle}
                            color={'primary'}
                            component={'h2'}
                            data-testid="page-title"
                            variant={'h4'}
                        >
                            {title}
                        </Typography>
                    </Grid>
                )}
                {help && (
                    <div className={classes.helpIcon}>
                        <HelpIcon {...help} />
                    </div>
                )}
                <Grid item className={classes.layoutCard}>
                    {children}
                </Grid>
                <Grid container className={classes.connectFooter}>
                    <ConnectFooter history={this.props.history} />
                </Grid>
                <Grid container className={classes.minimalFooter}>
                    <MinimalFooter />
                </Grid>
            </Grid>
        );
    }
}

const StyledPage = withStyles(styles, { withTheme: true })(Page);
const StandardPage = props => <StyledPage {...props} />;
export default StandardPage;
