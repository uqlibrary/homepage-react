import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Hero from '../Hero';
import { StyledAudioPlayer, StyledAccordionGrid, StyledAccordion, StyledAccordionDetails } from '../SharedComponents';
import WelcomeAudio from '../../../../../../public/audio/artTrail/welcome.mp3';

const WelcomePage = ({ mediaStopSignal }) => {
    return (
        <Grid container direction="column" rowSpacing={2.5}>
            <Hero
                title="Indigenous art and Library discovery trail"
                subtitle="A self-guided trail to explore Aboriginal and Torres Strait Islander artworks in the University of Queensland Library."
            />
            <StyledAccordionGrid container direction="column" data-testid="pageContent">
                <Grid>
                    <StyledAudioPlayer title="Listen to this page" src={WelcomeAudio} stopSignal={mediaStopSignal} />
                </Grid>
                <Grid container>
                    <Grid xs>
                        <Box component="div">
                            <p>
                                Welcome to the Indigenous Art and Library Discovery Trail at The University of
                                Queensland Library.
                            </p>
                            <p>When you're ready, tap Start the Trail to begin. </p>
                        </Box>
                    </Grid>
                </Grid>
                <Grid>
                    <StyledAccordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="transcript-content"
                            id="transcript-panel-header"
                        >
                            Audio transcript
                        </AccordionSummary>
                        <StyledAccordionDetails>
                            <p>
                                This self-guided trail invites you to explore Indigenous artworks across the library,
                                and discover some of the Aboriginal and Torres Strait Islander stories held and cared
                                for within the library.
                            </p>
                            <p>
                                Together, these works highlight Aboriginal and Torres Strait Islander voices and
                                celebrate enduring connections to Country, community and culture.
                            </p>
                            <p>
                                Your journey begins on level 1 of Duhig Tower. As you move through the trail, we invite
                                you to take your time, look closely, and reflect on the stories shared here.
                            </p>
                            <p>
                                Before you begin, the University of Queensland would like to acknowledge the Traditional
                                Owners and their custodianship of the lands on which we meet and learn. We pay our
                                respects to their Ancestors and their descendants, who continue cultural and spiritual
                                connections to Country. We recognise their valuable contributions to Australian and
                                global society.
                            </p>
                        </StyledAccordionDetails>
                    </StyledAccordion>
                </Grid>
            </StyledAccordionGrid>
        </Grid>
    );
};

WelcomePage.propTypes = {
    mediaStopSignal: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    openDrawer: PropTypes.func.isRequired,
};

export default WelcomePage;
