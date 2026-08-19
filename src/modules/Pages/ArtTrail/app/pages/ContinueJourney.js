import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';

import Hero from '../Hero';
import TrailImage from '../SharedComponents/TrailImage';

import Book1Image from '../../../../../../public/images/artTrail/UQ_BlakHistory_Book-cover_900x1200px-350x467.jpg';
import Book2Image from '../../../../../../public/images/artTrail/Storying_the_Archive.jpg';
import Book3Image from '../../../../../../public/images/artTrail/Guide_LanguageRelationships_Final6a_300ppi.jpg';

const StyledImage = styled(TrailImage)({
    width: '100%',
});

const ContinueJourney = () => {
    return (
        <Grid container direction="column" rowSpacing={2.5}>
            <Hero title="Exploring Aboriginal and Torres Strait Islander stories" />
            <Grid
                container
                direction="column"
                pl={'var(--art-trail-spacing)'}
                pr={'var(--art-trail-spacing)'}
                data-testid="pageContent"
            >
                <Grid container wrap="nowrap" justifyContent="space-between" alignItems="flex-start" columnSpacing={1}>
                    <Grid xs>
                        <Typography variant="body1" component="div">
                            <p>
                                The journey doesn't end here. It continues across campus, in the archives and through
                                the stories held and cared for within the Library.
                            </p>
                        </Typography>
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
                            <Typography variant="body1" component="div" mb={2}>
                                Explore these freely available open textbooks to learn more:
                            </Typography>
                            <Grid container columnSpacing={2} mb={2}>
                                <Grid xs={12} sm={2}>
                                    <Typography variant="body1" component="div">
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
                                    </Typography>
                                </Grid>
                                <Grid xs={12} sm={10}>
                                    <Typography variant="body1" component="div">
                                        <a
                                            href="https://uq.pressbooks.pub/uq-blak-history/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            UQ has a Blak history by Lesley Acres, Georgina Baumann, Raelee Lancaster,
                                            Caitlin Murphy and Mia Strasek-Barker
                                        </a>
                                        <p>Publication date: 2024</p>
                                        <p>
                                            Explores the long history of Aboriginal and Torres Strait Islander peoples
                                            at the University of Queensland and highlights sites of cultural and
                                            historical significance across the university's campuses, many of which you
                                            can still visit today.
                                        </p>
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container columnSpacing={2} mb={2}>
                                <Grid xs={12} sm={2}>
                                    <Typography variant="body1" component="div">
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
                                    </Typography>
                                </Grid>
                                <Grid xs={12} sm={10}>
                                    <Typography variant="body1" component="div">
                                        <a
                                            href="https://uq.pressbooks.pub/storying-the-archive/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Storying the archive by Tracey Bunda (Ngugi/Wakka Wakka) and Laura Deane
                                        </a>
                                        <p>Publication date: 2024</p>
                                        <p>
                                            Further stories about our collections are shared in Storying the Archive. In
                                            this book, Aboriginal and Torres Strait Islander academics, researchers, and
                                            professional staff, and non-Indigenous colleagues respond to many items held
                                            in the Fryer Library.
                                        </p>
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container columnSpacing={2} mb={2}>
                                <Grid xs={12} sm={2}>
                                    <Typography variant="body1" component="div">
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
                                    </Typography>
                                </Grid>
                                <Grid xs={12} sm={10}>
                                    <Typography variant="body1" component="div">
                                        <a
                                            href="https://uq.pressbooks.pub/languageofrelationships/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            The language of relationships with Aboriginal and Torres Strait Islander
                                            peoples - Introductory guide by Tracey Bunda (Ngugi/Wakka Wakka) et al
                                        </a>
                                        <p>Publication date: 2023</p>
                                        <p>
                                            This book supports the UQ Community to build stronger relationships between
                                            Aboriginal and Torres Strait Islander peoples and non-Indigenous peoples
                                            across the University.
                                        </p>
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Typography variant="body1" component="div" mb={2}>
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
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion
                        sx={{
                            mb: 'var(--art-trail-spacing)',
                            '&.Mui-expanded:last-of-type': { mb: 'var(--art-trail-spacing)' },
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="feedback-content"
                            id="feedback-panel-header"
                        >
                            Let us know about your journey
                        </AccordionSummary>
                        <AccordionDetails>Form here</AccordionDetails>
                    </Accordion>
                </Grid>
            </Grid>
        </Grid>
    );
};

ContinueJourney.propTypes = {
    openDrawer: PropTypes.func.isRequired,
};

export default ContinueJourney;
