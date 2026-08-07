import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

const MapTabContent = ({ tab, page }) => {
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
            <Grid>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {tab.label}
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 720 }}>
                    {tab.subtitle}
                </Typography>
            </Grid>

            <Grid>
                <Card
                    elevation={0}
                    sx={{
                        borderColor: 'divider',
                        bgcolor: '#fff',
                    }}
                >
                    <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                        <Grid container direction="column" rowSpacing={2.5}>
                            <Grid>
                                <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: '0.12em' }}>
                                    {tab.label}
                                </Typography>
                                <Typography
                                    variant="h4"
                                    sx={{ fontSize: { xs: '1.9rem', sm: '2.4rem' }, fontWeight: 700 }}
                                >
                                    {page.title}
                                </Typography>
                            </Grid>

                            <Grid>
                                <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 760 }}>
                                    {page.body}
                                </Typography>
                            </Grid>

                            <Grid>
                                <Grid container columnSpacing={1} rowSpacing={1}>
                                    {page.highlights.map(highlight => (
                                        <Grid key={highlight}>
                                            <Chip label={highlight} color="secondary" variant="outlined" />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>

                            <Grid>{mapPlaceholder}</Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

MapTabContent.propTypes = {
    tab: PropTypes.shape({
        label: PropTypes.string.isRequired,
        subtitle: PropTypes.string.isRequired,
    }).isRequired,
    page: PropTypes.shape({
        title: PropTypes.string.isRequired,
        body: PropTypes.string.isRequired,
        highlights: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
};

export default MapTabContent;
