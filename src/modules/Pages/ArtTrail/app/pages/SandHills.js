import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';

import ArtworkImage from '../../../../../../public/images/artTrail/artwork/Napandardi_2013_40_crop_WEB.jpg';

import Hero from '../Hero';

const StyledAccordion = styled(Accordion)(() => ({
    marginBottom: 'var(--art-trail-spacing)',
    '&.Mui-expanded:last-of-type': { marginBottom: 'var(--art-trail-spacing)' },
}));

const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
    '& p': {
        fontSize: 'var(--art-trail-font-size)',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        lineHeight: 1.5,
        '&:first-of-type': {
            marginTop: 0,
        },
        '&:last-of-type': {
            marginBottom: 0,
        },
    },
}));

const StyledImage = styled('img')({
    maxWidth: '100%',
    width: '100%',
    height: 'auto',
    position: 'relative',
});

const StyledUl = styled('ul')(({ theme }) => ({
    paddingInlineStart: '1.25rem',
    '& li:not(:last-of-type)': {
        marginBottom: theme.spacing(1),
    },
}));

const StyledDrawerHeader = styled(Typography)(({ theme }) => ({
    fontSize: '1.125rem',
    fontWeight: theme.typography.fontWeightMedium,
    fontFamily: 'var(--art-trail-font-family)',
    lineHeight: '1.6',
}));

const StyledAccordionGrid = styled(Grid)(() => ({
    paddingLeft: 'var(--art-trail-spacing)',
    paddingRight: 'var(--art-trail-spacing)',
    paddingBottom: 'calc(var(--art-trail-spacing) * 2)',
}));

const ArtDrawerContent = () => {
    return (
        <Grid container direction="column" rowSpacing={1.5}>
            <Grid>
                <StyledDrawerHeader variant="h3">Lily Kelly Napangardi</StyledDrawerHeader>
            </Grid>
            <Grid>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    <em>Sand Hills</em> 2007
                    <br />
                    synthetic polymer paint on linen
                    <br />
                    201 x 311 cm
                    <br />
                    Collection of The University of Queensland. Gift of Patrick Corrigan AM through the Australian
                    Government's Cultural Gifts Program, 2013.
                    <br />
                    Reproduced courtesy of the artist © licensed by Aboriginal Artists Agency Ltd.
                    <br />
                    Photo: Carl Warner.
                </Typography>
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
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Where: Level 1,{' '}
                    <a href="https://web.library.uq.edu.au/visit/duhig-tower" target="_blank" rel="noopener noreferrer">
                        Duhig Tower (TBC: THIS MIGHT LINK TO MAP TAB)
                    </a>{' '}
                    (Building 2), St Lucia campus.
                </Typography>
            </Grid>
        </Grid>
    );
};

const Page = ({ openDrawer }) => {
    return (
        <Grid container direction="column" rowSpacing={2.5}>
            <Hero title="'Sand Hills' 2007, Lily Kelly Napangardi" sx={{ pb: 0 }} data-testid="pageHero" />
            <Grid container direction="column" data-testid="pageContent" pt={0}>
                <Grid>
                    <Box position="relative">
                        <StyledImage src={ArtworkImage} alt="Sand Hills 2007 artwork." />
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
                            <Typography component={'p'}>
                                This work by Lily Napangardi depicts the cycles of rainfall and wind across the
                                sandhills of the Kintore and Coniston areas in the Northern Territory. Sand Hills 2007
                                is a classic example of her black and white compositions, and depicts the 'tali' (sand
                                hills) of the Kintore and Coniston areas.
                            </Typography>
                            <Typography component={'p'}>
                                Despite her reductive palette, Napangardi imbues these works with movement and
                                definition by emphasising rows within the net of fine dots. The clusters, lines and
                                dispersions of minute dots give her canvas the illusion of three-dimensional space and
                                depth. The effect evokes shifting sand dunes and the desert landscape after rain. The
                                seasonal changes influence the landscape and, consequently, traditional life. Through
                                her paintings, Napangardi seeks to demonstrate her deep understanding of Country and
                                assert her people's connection to the land.
                            </Typography>
                        </StyledAccordionDetails>
                    </StyledAccordion>
                    <StyledAccordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="reflect-content"
                            id="reflect-header"
                        >
                            Reflect
                        </AccordionSummary>
                        <StyledAccordionDetails id="reflect-content">
                            <Typography component={'p'}>Take a moment to look closely at this painting.</Typography>
                            <StyledUl>
                                <li>Which areas are your eyes most drawn to?</li>
                                <li>
                                    As your eyes move across these areas, what kind of movement or energy do you feel?
                                </li>
                                <li>Can you imagine this movement and energy performed by sand?</li>
                            </StyledUl>

                            <Typography component={'p'}>
                                Try to take yourself to this place and imagine how it might feel in your body to be
                                there.
                            </Typography>
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
                            <Typography component={'p'}>
                                Lily Kelly Napangardi was born in 1948 in the Northern Territory. She is a senior law
                                woman of the Watiyawanu community near Haasts Bluff, north-west of Alice Springs. She is
                                a custodian of the Women's Dreaming story associated with Country around Kunajarrayi
                                (Mount Nicker).
                            </Typography>
                            <Typography component={'p'}>
                                Napangardi began painting with her husband at Papunya in the 1980s, achieving
                                recognition in her own right when she began making striking monochromatic works.
                            </Typography>
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
                            <Typography component={'p'} sx={{ pb: 1 }}>
                                Learn more about <strong>Warlpiri Country.</strong>
                            </Typography>
                            <iframe
                                title="Indigenous art trail - Warlpiri Country"
                                src="https://uq.h5p.com/content/1292937898322727859/embed"
                                aria-label="Clone of Indigenous art and Library discovery trail - Sand Hills 2007 - Warlpiri Country"
                                width="1090"
                                frameBorder="0"
                                allowFullScreen
                                allow="autoplay *; geolocation *; microphone *; camera *; midi *; encrypted-media *"
                                style={{ width: '100%', height: 'auto', aspectRatio: '1090/1033' }}
                            />
                            <StyledUl>
                                <li>
                                    <a href="https://ngurra.org/#/sc/1" target="_blank" rel="noopener noreferrer">
                                        Northern Tanami Indigenous Protected Area digital storybook{' '}
                                    </a>
                                    <br /> Watch a video about the Warlpiri story in language.
                                </li>
                                <li>
                                    <a
                                        href="https://ictv.com.au/video/4989-warlukurlangu-yawulyu-song-from-the-place-belonging-to-the-fire"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Warlukurlangu yawulyu ' Song from the place belonging to the fire'{' '}
                                    </a>{' '}
                                    <br /> Listen to songs and stories in language from Warlpiri Country.
                                </li>
                            </StyledUl>
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
