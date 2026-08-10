import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import Hero from '../Hero';

const DevilMountainLizardDrawerContent = () => {
    return (
        <Grid container direction="column" rowSpacing={1.5}>
            <Grid>
                <Typography variant="body1">
                    Devil Mountain Lizard can surface extra artwork interpretation, language notes, or collection
                    references in this drawer.
                </Typography>
            </Grid>
            <Grid>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    The drawer is capped at half the visible viewport, so extended notes stay scrollable inside the
                    panel instead of pushing the footer controls out of place.
                </Typography>
            </Grid>
        </Grid>
    );
};

const Page = ({ openDrawer }) => {
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
                <Grid container wrap="nowrap" justifyContent="space-between" alignItems="flex-start" columnSpacing={1}>
                    <Grid xs>
                        <Typography variant="h3" sx={{ fontSize: { xs: '1.5rem', sm: '2.5rem' }, fontWeight: 500 }}>
                            Welcome
                        </Typography>
                    </Grid>
                    <Grid>
                        <IconButton
                            aria-label="Open page drawer"
                            onClick={() => openDrawer(DevilMountainLizardDrawerContent)}
                        >
                            <InfoOutlinedIcon />
                        </IconButton>
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

Page.propTypes = {
    openDrawer: PropTypes.func.isRequired,
};

export default Page;
