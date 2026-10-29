import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export class InlineLoader extends React.Component {
    static propTypes = {
        message: PropTypes.string,
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
                    <Grid sx={{ display: { xs: 'block', sm: 'none' } }} />{' '}
                    <Grid size={{ xs: 'auto' }} style={{ textAlign: 'center' }}>
                        <CircularProgress
                            sx={{ color: 'primary.light' }}
                            size={18}
                            thickness={2}
                            aria-labelledby="loading-icon"
                        />
                    </Grid>
                    <Grid size={{ xs: 'auto' }} style={{ textAlign: 'center' }}>
                        <Typography
                            id="loading-icon"
                            sx={{ color: 'primary.light', fontSize: '1.33rem' }}
                            variant={'h5'}
                            component={'span'}
                        >
                            {this.props.message}
                        </Typography>
                    </Grid>
                    <Grid sx={{ display: { xs: 'block', sm: 'none' } }} />
                </Grid>
            </div>
        );
    }
}

export default InlineLoader;
