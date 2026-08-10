import React from 'react';
// import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
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

const FeedbackTabContent = () => {
    return (
        <Grid container direction="column" rowSpacing={2.5}>
            <Hero
                title="Share a quick response"
                subtitle="The feedback view can invite short reactions about clarity, wayfinding, and the overall visitor experience before visitors leave the trail."
            />
            <Grid
                container
                direction="column"
                pl={'var(--art-trail-font-size)'}
                pr={'var(--art-trail-font-size)'}
                data-testid="pageContent"
            >
                <Grid>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
                        title
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 720 }}>
                        subtext
                    </Typography>
                </Grid>

                <Grid>Feedback form here or something else</Grid>

                <Grid>
                    <AdditionalContentCard />
                </Grid>
            </Grid>
        </Grid>
    );
};

FeedbackTabContent.propTypes = {};

export default FeedbackTabContent;
