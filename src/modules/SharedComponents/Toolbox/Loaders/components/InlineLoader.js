import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    circular: {
        color: theme.palette.accent.main,
    },
    message: {
        color: theme.palette.accent.main,
    },
});

export class InlineLoader extends React.Component {
    static propTypes = {
        message: PropTypes.string,
        classes: PropTypes.object,
    };

    static defaultProps = {
        message: 'Loading',
    };

    render() {
        return (
            <div style={{ padding: 8 }}>
                <Grid
                    container
                    direction={'row'}
                    spacing={1}
                    justify="center"
                    alignItems="center"
                    alignContent={'center'}
                >
                    <Hidden smUp>
                        <Grid item xs />
                    </Hidden>
                    <Grid item xs={'auto'} style={{ textAlign: 'center' }}>
                        <CircularProgress className={this.props.classes.circular} size={18} thickness={2} />
                    </Grid>
                    <Grid item xs={'auto'} style={{ textAlign: 'center' }}>
                        <Typography
                            className={this.props.classes.message}
                            variant={'h5'}
                            component={'span'}
                            style={{ fontSize: '1.33rem' }}
                        >
                            {this.props.message}
                        </Typography>
                    </Grid>
                    <Hidden smUp>
                        <Grid item xs />
                    </Hidden>
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(InlineLoader);
