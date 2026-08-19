import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Hero from '../Hero';
import { StyledAudioPlayer } from '../SharedComponents';

const WELCOME_AUDIO_SRC = '/audio/artTrail/sample1.mp3';

const WelcomePage = ({ mediaStopSignal }) => {
    return (
        <Grid container direction="column" rowSpacing={2.5}>
            <Hero
                title="Indigenous art and Library discovery trail"
                subtitle="A self-guided trail to explore Aboriginal and Torres Strait Islander artworks in the University of Queensland Library."
            />
            <Grid
                container
                direction="column"
                pl={'var(--art-trail-spacing)'}
                pr={'var(--art-trail-spacing)'}
                data-testid="pageContent"
            >
                <Grid container wrap="nowrap" justifyContent="space-between" alignItems="flex-start" columnSpacing={1}>
                    <Grid xs>
                        <Typography variant="h3" sx={{ fontSize: { xs: '1.5rem', sm: '2.5rem' }, fontWeight: 500 }}>
                            Welcome
                        </Typography>
                        <Typography variant="body1" component="div">
                            <p>
                                Welcome to the Indigenous Art and Library Discovery Trail at The University of
                                Queensland Library.
                            </p>
                            <p>Tap “Start the Trail” below to begin.</p>
                        </Typography>
                    </Grid>
                </Grid>
                <Grid>
                    <StyledAudioPlayer
                        title="Listen to this page"
                        src={WELCOME_AUDIO_SRC}
                        stopSignal={mediaStopSignal}
                    />
                </Grid>
                <Grid>
                    <Accordion
                        sx={{
                            mb: 'var(--art-trail-spacing)',
                            '&.Mui-expanded:last-of-type': { mb: 'var(--art-trail-spacing)' },
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
    mediaStopSignal: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    openDrawer: PropTypes.func.isRequired,
};

export default WelcomePage;
