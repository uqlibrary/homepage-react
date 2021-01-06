import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
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
            goBackFunc = () => (!!history && history.back()) || window.back(),
            goBackTooltip = 'Go back',
        } = this.props;
        return (
            <div className={classes.wrapper}>
                <Grid justify={'flex-start'} container spacing={1} data-testid="StandardPage" id="StandardPage">
                    {title && (
                        <Grid item xs>
                            <Typography
                                className={classes.layoutTitle}
                                color={'primary'}
                                component={'h2'}
                                data-testid="StandardPage-title"
                                variant={'h4'}
                            >
                                {!!goBackFunc && (
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
                                )}
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
                </Grid>
            </div>
        );
    }
}

const StyledPage = withStyles(styles, { withTheme: true })(Page);
const StandardPage = props => <StyledPage {...props} />;
export default StandardPage;
