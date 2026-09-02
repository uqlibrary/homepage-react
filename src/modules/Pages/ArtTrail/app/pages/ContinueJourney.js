import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Hero from '../SharedComponents/Hero';
import {
    StyledImage,
    StyledAccordionGrid,
    StyledAudioPlayer,
    StyledAccordion,
    StyledAccordionDetails,
} from '../SharedComponents';

import Book1Image from '../../../../../../public/images/artTrail/UQ_BlakHistory_Book-cover_900x1200px-350x467.jpg';
import Book2Image from '../../../../../../public/images/artTrail/Storying_the_Archive.jpg';
import Book3Image from '../../../../../../public/images/artTrail/Guide_LanguageRelationships_Final6a_300ppi.jpg';

import ContinueJourneyAudio from '../../../../../../public/audio/artTrail/continuejourney.mp3';

const ContinueJourney = ({ mediaStopSignal, handleMediaEvent, handleAccordionChange }) => {
    return (
        <Grid container direction="column" rowSpacing={2.5}>
            <Hero title="Continue your journey" />
            <StyledAccordionGrid container direction="column" data-testid="pageContent">
                <Grid>
                    <StyledAudioPlayer
                        title="Listen to this page"
                        src={ContinueJourneyAudio}
                        stopSignal={mediaStopSignal}
                        data-testid="audioPlayer"
                        onPlay={() => handleMediaEvent('play')}
                        onStop={() => handleMediaEvent('stop')}
                        onReset={() => handleMediaEvent('reset')}
                        onComplete={() => handleMediaEvent('complete')}
                    />
                </Grid>
                <Grid container wrap="nowrap" justifyContent="space-between" alignItems="flex-start" columnSpacing={1}>
                    <Grid xs>
                        <Box component="p">Thank you for exploring the Indigenous Art and Library Discovery Trail.</Box>
                        <Box component="p">
                            If you'd like to get in touch about this project or provide feedback, please contact us via
                            the{' '}
                            <a
                                href="https://support.my.uq.edu.au/app/library/feedback"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                The University of Queensland Library Feedback Form
                            </a>
                            .
                        </Box>
                    </Grid>
                </Grid>
                <Grid>
                    <StyledAccordion onChange={handleAccordionChange}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="transcript-content"
                            id="transcript-panel-header"
                        >
                            Audio transcript
                        </AccordionSummary>
                        <StyledAccordionDetails>
                            <Box component="p" mb={2}>
                                We hope the artworks and stories you have encountered today have inspired you to
                                reflect, learn and connect more deeply with Aboriginal and Torres Strait Islander
                                cultures, histories and communities.
                            </Box>
                            <Box component="p" mb={2}>
                                The journey doesn't end here. It continues across campus, in the archives and through
                                the stories held and cared for within the Library.
                            </Box>
                            <Box component="p" mb={2}>
                                To continue your journey, explore the resources below or visit Fryer Library to discover
                                more Aboriginal and Torres Strait Islander stories.
                            </Box>
                        </StyledAccordionDetails>
                    </StyledAccordion>
                    <StyledAccordion onChange={handleAccordionChange}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="resources-content"
                            id="resources-panel-header"
                        >
                            Resources to continue your journey
                        </AccordionSummary>
                        <StyledAccordionDetails>
                            <Box component="p" pb={2}>
                                Explore these freely available open textbooks to learn more:
                            </Box>

                            <Grid container columnSpacing={2} mb={2}>
                                <Grid xs={12} sm={2}>
                                    <a
                                        href="https://uq.pressbooks.pub/uq-blak-history/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <StyledImage
                                            src={Book1Image}
                                            alt="Front cover image of the book 'UQ has a Blak history', which shows several archive images from around the UQ St Lucia campus"
                                        />
                                    </a>
                                </Grid>
                                <Grid xs={12} sm={10}>
                                    <a
                                        href="https://uq.pressbooks.pub/uq-blak-history/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        UQ has a Blak history by Lesley Acres, Georgina Baumann, Raelee Lancaster,
                                        Caitlin Murphy and Mia Strasek-Barker
                                    </a>
                                    <Box component="p">Publication date: 2024</Box>
                                    <Box component="p">
                                        Explores the long history of Aboriginal and Torres Strait Islander peoples at
                                        the University of Queensland and highlights sites of cultural and historical
                                        significance across the university's campuses, many of which you can still visit
                                        today.
                                    </Box>
                                </Grid>
                            </Grid>
                            <Grid container columnSpacing={2} mb={2}>
                                <Grid xs={12} sm={2}>
                                    <a
                                        href="https://uq.pressbooks.pub/storying-the-archive/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <StyledImage
                                            src={Book2Image}
                                            alt="Front cover image of the book 'Storying the archive', which shows a montage of people's faces at the top and Indigenous artwork at the bottom"
                                        />
                                    </a>
                                </Grid>
                                <Grid xs={12} sm={10}>
                                    <a
                                        href="https://uq.pressbooks.pub/storying-the-archive/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Storying the archive by Tracey Bunda (Ngugi/Wakka Wakka) and Laura Deane
                                    </a>
                                    <Box component="p">Publication date: 2024</Box>
                                    <Box component="p">
                                        Further stories about our collections are shared in Storying the Archive. In
                                        this book, Aboriginal and Torres Strait Islander academics, researchers, and
                                        professional staff, and non-Indigenous colleagues respond to many items held in
                                        the Fryer Library.
                                    </Box>
                                </Grid>
                            </Grid>
                            <Grid container columnSpacing={2} mb={2}>
                                <Grid xs={12} sm={2}>
                                    <a
                                        href="https://uq.pressbooks.pub/languageofrelationships/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <StyledImage
                                            src={Book3Image}
                                            alt="Front cover image of the book 'The language of relationships with Aboriginal and Torres Strait Islander peoples - Introductory guide', which shows a photograph of a large group of people under a marquee in deep discussion with each other. Indigenous artwork is shown underneath the photo."
                                        />
                                    </a>
                                </Grid>
                                <Grid xs={12} sm={10}>
                                    <a
                                        href="https://uq.pressbooks.pub/languageofrelationships/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        The language of relationships with Aboriginal and Torres Strait Islander peoples
                                        - Introductory guide by Tracey Bunda (Ngugi/Wakka Wakka) et al
                                    </a>
                                    <Box component="p">Publication date: 2023</Box>
                                    <Box component="p">
                                        This book supports the UQ Community to build stronger relationships between
                                        Aboriginal and Torres Strait Islander peoples and non-Indigenous peoples across
                                        the University.
                                    </Box>
                                </Grid>
                            </Grid>
                            <Box component="div" mb={2}>
                                To continue exploring Aboriginal and Torres Strait Islander stories held in UQ Library,
                                you can book an appointment to visit the{' '}
                                <a
                                    href="https://web.library.uq.edu.au/visit/fryer-library-and-fw-robinson-reading-room"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Fryer Library
                                </a>
                                .
                            </Box>
                        </StyledAccordionDetails>
                    </StyledAccordion>
                </Grid>
            </StyledAccordionGrid>
        </Grid>
    );
};

ContinueJourney.propTypes = {
    mediaStopSignal: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    handleMediaEvent: PropTypes.func.isRequired,
    handleAccordionChange: PropTypes.func.isRequired,
};

export default ContinueJourney;
