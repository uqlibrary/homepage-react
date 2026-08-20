import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Hero from '../Hero';
import { StyledHeading, StyledAudioPlayer } from '../SharedComponents';
import WelcomeAudio from '../../../../../../public/audio/artTrail/welcome.mp3';

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
                <Grid>
                    <StyledAudioPlayer title="Listen to this page" src={WelcomeAudio} stopSignal={mediaStopSignal} />
                </Grid>
                <Grid container wrap="nowrap" justifyContent="space-between" alignItems="flex-start" columnSpacing={1}>
                    <Grid xs>
                        <Box component="div">
                            <p>
                                Welcome to the Indigenous Art and Library Discovery Trail at The University of
                                Queensland Library.
                            </p>
                            <p>Tap “Start the Trail” below to begin.</p>
                        </Box>
                    </Grid>
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
                            <StyledHeading variant="h6" component="h3">
                                About the Indigenous art and Library discovery trail
                            </StyledHeading>
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
