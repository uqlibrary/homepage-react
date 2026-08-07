import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Hero from '../Hero';

const WelcomePage = () => {
    return (
        <Grid container direction="column" rowSpacing={2.5}>
            <Hero
                title="Indigenous art and Library discovery trail"
                subtitle="A self-guided trail to explore Aboriginal and Torres Strait Islander artworks in the University of Queensland Library."
            />
            <Grid
                container
                direction="column"
                pl={'var(--art-trail-font-size)'}
                pr={'var(--art-trail-font-size)'}
                data-testid="pageContent"
            >
                <Grid>
                    <Typography variant="h3" sx={{ fontSize: { xs: '1.5rem', sm: '2.5rem' }, fontWeight: 500 }}>
                        Welcome
                    </Typography>
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
                            Placeholder
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Artwork goes here
                        </Typography>
                    </Box>
                </Grid>
                <Grid>
                    <Accordion
                        sx={{
                            mb: 'var(--art-trail-font-size)',
                            '&.Mui-expanded:last-of-type': { mb: 'var(--art-trail-font-size)' },
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="transcript-content"
                            id="transcript-panel-header"
                        >
                            Audio transcript
                        </AccordionSummary>
                        <AccordionDetails>
                            Placeholder content for additional information, related items, or a hand-off into the next
                            trail stop. Placeholder content for additional information, related items, or a hand-off
                            into the next trail stop. Placeholder content for additional information, related items, or
                            a hand-off into the next trail stop.
                        </AccordionDetails>
                    </Accordion>
                </Grid>
            </Grid>
        </Grid>
    );
};

WelcomePage.propTypes = {
    tab: PropTypes.shape({
        label: PropTypes.string.isRequired,
        subtitle: PropTypes.string.isRequired,
    }).isRequired,
};

export default WelcomePage;
