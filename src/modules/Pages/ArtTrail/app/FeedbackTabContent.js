import React from 'react';
import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import Hero from './Hero';

const AdditionalContentCard = () => {
    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'divider',
            }}
        >
            <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                <Grid container direction="column" rowSpacing={1.5}>
                    <Grid>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            Additional placeholder section
                        </Typography>
                    </Grid>
                    <Grid>
                        <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 760 }}>
                            This secondary content area demonstrates how longer page sections scroll beneath the fixed
                            header and fixed bottom navigation.
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

const FeedbackTabContent = ({ tab, page }) => {
    return (
        <Grid container direction="column" rowSpacing={2.5}>
            <Hero
                title="Share a quick response"
                subtitle="The feedback view can invite short reactions about clarity, wayfinding, and the overall visitor experience before visitors leave the trail."
            />

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
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>

            <Grid>
                <AdditionalContentCard />
            </Grid>
        </Grid>
    );
};

FeedbackTabContent.propTypes = {
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

export default FeedbackTabContent;
