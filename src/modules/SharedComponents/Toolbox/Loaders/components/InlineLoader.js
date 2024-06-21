import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Hidden from '@mui/material/Hidden';
import Typography from '@mui/material/Typography';

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
                    justifyContent="center"
                    alignItems="center"
                    alignContent={'center'}
                >
                    <Hidden smUp>
                        <Grid item xs />
                    </Hidden>
                    <Grid item xs={'auto'} style={{ textAlign: 'center' }}>
                        <CircularProgress
                            sx={{ color: 'primary.light' }}
                            className={this.props.classes.circular}
                            size={18}
                            thickness={2}
                            aria-labelledby="loading-icon"
                        />
                    </Grid>
                    <Grid item xs={'auto'} style={{ textAlign: 'center' }}>
                        <Typography
                            id="loading-icon"
                            sx={{ color: 'primary.light', fontSize: '1.33rem' }}
                            variant={'h5'}
                            component={'span'}
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

export default InlineLoader;
