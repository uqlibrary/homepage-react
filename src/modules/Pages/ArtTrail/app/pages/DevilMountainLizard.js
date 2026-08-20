import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';

import ArtworkImage from '../../../../../../public/images/artTrail/artwork/Petyarre_2001_02_crop_WEB.jpg';
import ThornyDevilsImage from '../../../../../../public/images/artTrail/Thorny-Devil-_C_-meyblume-scaled.jpg';

import Hero from '../Hero';
import {
    StyledAccordion,
    StyledAccordionDetails,
    StyledAccordionGrid,
    StyledDrawerHeader,
    StyledTrailImage,
    StyledImage,
    StyledImageCaption,
} from '../SharedComponents';

const ArtDrawerContent = () => {
    return (
        <Grid container direction="column" rowSpacing={1.5}>
            <Grid>
                <StyledDrawerHeader variant="h3">Gloria Tamerre Petyarre</StyledDrawerHeader>
            </Grid>
            <Grid>
                <Box component="p" sx={{ color: 'text.secondary' }}>
                    <em>Devil Mountain Lizard Dreaming</em> 1997
                    <br />
                    synthetic polymer paint on canvas
                    <br />
                    207 x 310 cm
                    <br />
                    Collection of The University of Queensland, purchased 2001.
                    <br />
                    Reproduced courtesy of the artist © licensed by Aboriginal Artists Agency Ltd.
                    <br />
                    Photo: Carl Warner.
                </Box>
            </Grid>
        </Grid>
    );
};
const LocationDrawerContent = () => {
    return (
        <Grid container direction="column" rowSpacing={1.5}>
            <Grid>
                <StyledDrawerHeader variant="h3">View the artwork</StyledDrawerHeader>
            </Grid>
            <Grid>
                <Box component="p" sx={{ color: 'text.secondary' }}>
                    Where: Level 1,{' '}
                    <a href="https://web.library.uq.edu.au/visit/duhig-tower" target="_blank" rel="noopener noreferrer">
                        Duhig Tower
                    </a>{' '}
                    (Building 2), St Lucia campus.
                </Box>
            </Grid>
        </Grid>
    );
};

const Page = ({ openDrawer }) => {
    return (
        <Grid container direction="column" rowSpacing={2.5}>
            <Hero title="'Devil Mountain Lizard Dreaming' 1997 artwork." sx={{ pb: 0 }} data-testid="pageHero" />
            <Grid container direction="column" data-testid="pageContent" pt={0}>
                <Grid>
                    <Box position="relative">
                        <StyledTrailImage
                            src={ArtworkImage}
                            alt="'Devil Mountain Lizard Dreaming' 1997 artwork."
                            intrinsicWidth={709}
                            intrinsicHeight={464}
                        />
                        <IconButton
                            size="large"
                            aria-label="More information about this artwork"
                            onClick={() => openDrawer(ArtDrawerContent)}
                            sx={{ position: 'absolute', top: 0, right: 0 }}
                        >
                            <InfoOutlinedIcon
                                fontSize="large"
                                sx={{
                                    color: '#fff',
                                    fontSize: '2.5rem',
                                    filter: 'drop-shadow(2px 2px 1px rgba(0,0,0,0.5))',
                                }}
                            />
                        </IconButton>
                        <IconButton
                            size="large"
                            aria-label="Location information about this artwork"
                            onClick={() => openDrawer(LocationDrawerContent)}
                            sx={{ position: 'absolute', bottom: 0, right: 0 }}
                        >
                            <LocationOnOutlinedIcon
                                fontSize="large"
                                sx={{
                                    color: '#fff',
                                    fontSize: '2.5rem',
                                    filter: 'drop-shadow(2px 2px 1px rgba(0,0,0,0.5))',
                                }}
                            />
                        </IconButton>
                    </Box>
                </Grid>
                <StyledAccordionGrid>
                    <StyledAccordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="about-the-artwork-content"
                            id="about-the-artwork-header"
                        >
                            About the artwork
                        </AccordionSummary>
                        <StyledAccordionDetails id="about-the-artwork-content">
                            <Box component="p">
                                This artwork depicts the scales of the Anmatyerre's totem animal, the Thorny Devil, who
                                was responsible for depositing ochre throughout Atnangkere Country. Note the intricate
                                lines, patterns, and colour, which the artist has used to create the illusion of
                                movement.
                            </Box>
                            <Box component="p">
                                The artist's work demonstrates a deep connection with Country and the important role of
                                the artist in their community to continue and protect knowledge, which continues to
                                future generations.
                            </Box>
                        </StyledAccordionDetails>
                    </StyledAccordion>
                    <StyledAccordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="about-the-artists-content"
                            id="about-the-artists-header"
                        >
                            About the artist
                        </AccordionSummary>
                        <StyledAccordionDetails id="about-the-artists-content">
                            <Box component="p">
                                The artist was born c. 1945 in Atnangkere, northeast of Alice Springs in the Northern
                                Territory.
                            </Box>
                        </StyledAccordionDetails>
                    </StyledAccordion>
                    <StyledAccordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="connection-to-country-content"
                            id="connection-to-country-header"
                        >
                            Connection to Country
                        </AccordionSummary>
                        <StyledAccordionDetails id="connection-to-country-content">
                            <Box component="p" sx={{ paddingBottom: '1rem' }}>
                                Learn more about <strong>Atnangkere Country.</strong>
                            </Box>
                            <iframe
                                title="Indigenous art trail - Atnangkere Country"
                                src="https://uq.h5p.com/content/1292937940959277909/embed"
                                aria-label="Indigenous art trail - Atnangkere Country - Devil Mountain Lizard Dreaming 1997"
                                width="1090"
                                frameBorder="0"
                                allowfullscreen="allowfullscreen"
                                allow="autoplay *; geolocation *; microphone *; camera *; midi *; encrypted-media *"
                                style={{ width: '100%', height: 'auto', aspectRatio: '1090/1033' }}
                            />
                            <Typography component={'h3'}>Thorny devils</Typography>
                            <StyledImage src={ThornyDevilsImage} alt="Thorny devil in the desert." loading="lazy" />
                            <StyledImageCaption>Thorny Devil @meyblume - stock.adobe.com</StyledImageCaption>
                            <Box component="p" sx={{ paddingBottom: '1rem' }}>
                                Thorny devils have a peculiar way of moving across the desert. This movement makes them
                                appear like a piece of vegetation blowing across the ground and helps them avoid
                                predators. Watch this{' '}
                                <a
                                    href="https://youtu.be/sxawWKuA4JM?si=543q69knAQGd-dgc"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    video of a thorny devil (YouTube, 23s):
                                </a>
                            </Box>
                            <iframe
                                width="560"
                                height="315"
                                src="https://www.youtube.com/embed/sxawWKuA4JM?si=6kk89BbR3ZeiubR2"
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowfullscreen=""
                                style={{ width: '100%', height: 'auto', aspectRatio: '16/9' }}
                            />
                        </StyledAccordionDetails>
                    </StyledAccordion>
                </StyledAccordionGrid>
            </Grid>
        </Grid>
    );
};

Page.propTypes = {
    openDrawer: PropTypes.func.isRequired,
};

export default Page;
