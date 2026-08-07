import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import Hero from '../Hero';

const ArtPage1 = ({ tab }) => {
    return (
        <Grid container direction="column" rowSpacing={2.5}>
            <Hero
                title="Artwork stories from across the trail"
                subtitle="Each stop can introduce a specific work, cultural context, and the themes visitors should notice as they move through the collection."
            />
            <Grid>
                <Card elevation={0} sx={{ borderColor: 'divider', bgcolor: '#fff' }}>
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
                                    Featured artwork
                                </Typography>
                            </Grid>

                            <Grid>
                                <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 760 }}>
                                    Placeholder content for an artwork story with a short interpretive caption and room
                                    for media later.
                                </Typography>
                            </Grid>

                            <Grid>
                                <Grid container columnSpacing={1} rowSpacing={1}>
                                    {['Artwork details', 'Short story', 'Media placeholder'].map(highlight => (
                                        <Grid key={highlight}>
                                            <Chip label={highlight} color="secondary" variant="outlined" />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>

                            <Grid>
                                <Box
                                    sx={{
                                        borderRadius: 3,
                                        p: { xs: 2, sm: 3 },
                                        bgcolor: 'rgba(93, 45, 130, 0.06)',
                                        border: '1px dashed',
                                        borderColor: 'secondary.main',
                                    }}
                                >
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.75 }}>
                                        Artwork story placeholder
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        This page component can hold the richer artwork narrative, image treatment,
                                        audio player, or object metadata for the current stop.
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

ArtPage1.propTypes = {
    tab: PropTypes.shape({
        label: PropTypes.string.isRequired,
        subtitle: PropTypes.string.isRequired,
    }).isRequired,
};

export default ArtPage1;
