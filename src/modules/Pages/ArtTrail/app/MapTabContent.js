import React from 'react';
// import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

const MapTabContent = () => {
    const mapPlaceholder = (
        <Box
            sx={{
                borderRadius: 3,
                p: { xs: 2.5, sm: 3.5 },
                minHeight: { xs: 240, sm: 320 },
                bgcolor: 'rgba(0, 109, 117, 0.08)',
                border: '1px dashed',
                borderColor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Box sx={{ textAlign: 'center', maxWidth: 420 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                    Map component mounts here
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    This single-page tab is ready for the interactive map component once that code is added.
                </Typography>
            </Box>
        </Box>
    );

    return (
        <Grid container direction="column" rowSpacing={2.5}>
            <Grid
                container
                direction="column"
                pl={'var(--art-trail-spacing)'}
                pr={'var(--art-trail-spacing)'}
                data-testid="pageContent"
            >
                <Grid>
                    <Typography variant="h3">title</Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 720 }}>
                        sub text
                    </Typography>
                </Grid>
            </Grid>

            <Grid>{mapPlaceholder}</Grid>
        </Grid>
    );
};

MapTabContent.propTypes = {};

export default MapTabContent;
