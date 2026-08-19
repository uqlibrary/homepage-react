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

import Artwork1Image from '../../../../../../public/images/artTrail/artwork/2018.27_Kunawarritji-1-landscape-2.jpg';
import Artwork2Image from '../../../../../../public/images/artTrail/artwork/2018.28_Kunawarritji-2-landscape-2.jpg';
import DesertImage from '../../../../../../public/images/artTrail/Desert-near-old-Canning-Stock-Route_C_-tolly65_stock.adobe.com-2.jpg';

import Hero from '../Hero';
import {
    StyledAccordion,
    StyledAccordionDetails,
    StyledAccordionGrid,
    StyledDrawerHeader,
    StyledTrailImage,
    StyledImage,
    StyledImageCaption,
    StyledUl,
} from '../SharedComponents';

const Art1DrawerContent = () => {
    return (
        <Grid container direction="column" rowSpacing={1.5}>
            <Grid>
                <StyledDrawerHeader variant="h3">Nora Wompi Nungurrayi</StyledDrawerHeader>
            </Grid>
            <Grid>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    <em>Kunawarritji 1</em> 1997
                    <br />
                    synthetic polymer paint on Belgian linen
                    <br />
                    180 x 120 cm
                    <br />
                    Collection of The University of Queensland, purchased 2018.
                    <br />
                    Reproduced courtesy of the artist's estate and Suzanne O'Connell Gallery, Brisbane
                    <br />
                    Photo: Carl Warner.
                </Typography>
            </Grid>
        </Grid>
    );
};
const Art2DrawerContent = () => {
    return (
        <Grid container direction="column" rowSpacing={1.5}>
            <Grid>
                <StyledDrawerHeader variant="h3">Nora Wompi Nungurrayi</StyledDrawerHeader>
            </Grid>
            <Grid>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    <em>Kunawarritji 2</em> 1997
                    <br />
                    synthetic polymer paint on Belgian linen
                    <br />
                    180 x 120 cm
                    <br />
                    Collection of The University of Queensland, purchased 2018.
                    <br />
                    Reproduced courtesy of the artist's estate and Suzanne O'Connell Gallery, Brisbane
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
                        Duhig Tower
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
            <Hero
                title="'Kunawarritji 1' and 'Kunawarritji 2' 2012, Nora Wompi Nungurrayi"
                sx={{ pb: 0 }}
                data-testid="pageHero"
            />
            <Grid container direction="column" data-testid="pageContent" pt={0}>
                <Grid>
                    <Box position="relative">
                        <StyledTrailImage
                            src={Artwork1Image}
                            alt="Kunawarritji 1 artwork."
                            intrinsicWidth={4671}
                            intrinsicHeight={3096}
                        />
                        <IconButton
                            size="large"
                            aria-label="More information about this artwork"
                            onClick={() => openDrawer(Art1DrawerContent)}
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
                    <Box position="relative">
                        <StyledImage
                            src={Artwork2Image}
                            alt="Kunawarritji 2 artwork."
                            intrinsicWidth={3042}
                            intrinsicHeight={2043}
                        />
                        <IconButton
                            size="large"
                            aria-label="More information about this artwork"
                            onClick={() => openDrawer(Art2DrawerContent)}
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
                                These two paintings depict a place central to the artist's life and community,
                                Kunawarritji (meaning 'water spring'). What makes these paintings so striking for an
                                artist of this region is the defined colour palette which utilises soft yellows, pinks,
                                whites, and blues. These colours overlap and bleed into each other creating fluid
                                intersections of place.
                            </Typography>
                            <Typography component={'p'}>
                                You can see the expressive brushstrokes within each of these works. While both artworks
                                depict the same place, there is a unique feel to each painting, communicated through
                                colour, shape and texture. If you look closely at each artwork, you can see the depth of
                                the underlaid paint, the ochre tones showing through the lighter layers.
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
                                The artist, from the Kukatja language group and Nungurrayi communities, was born c. 1935
                                near Well 33 in the Kunawarritji Community based along the Canning Stock Route in
                                mid-Western Australia.
                            </Typography>
                            <Typography component={'p'}>
                                Many of the paintings created by this artist connect with nature and place, and this is
                                because she spent many years of her life moving between Kunawarritji, Balgo, Kiwirrkurra
                                and Punmu. More than a prolific artist, she was a senior respected elder and cultural
                                leader who cared for Country and whose obligations drew her to these different places
                                across her lifetime. The artist passed away in 2017 and it is a privilege to be able to
                                show her continuing artistic legacy to you today.
                            </Typography>
                            <Typography component={'p'}>
                                Find out{' '}
                                <a href="https://martumili.com.au/node/73" target="_blank" rel="noopener noreferrer">
                                    more about the artist.
                                </a>
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
                                This artwork was inspired by the artist’s home at Kunawarritji, part of Martu Country in
                                Western Australia.
                            </Typography>
                            <iframe
                                title="Indigenous art trail - Martu Country"
                                src="https://uq.h5p.com/content/1292938729180054199/embed"
                                aria-label="Indigenous art trail - Martu Country - Kunawarritji"
                                width="1090"
                                frameBorder="0"
                                allowFullScreen
                                allow="autoplay *; geolocation *; microphone *; camera *; midi *; encrypted-media *"
                                style={{ width: '100%', height: 'auto', aspectRatio: '1090/1033' }}
                            />
                            <StyledUl>
                                <li>
                                    <a
                                        href="https://www.kj.org.au/martu-country"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Why Martu country is special{' '}
                                    </a>
                                    <br /> Read about Martu lands - from Kanyirninpa Jukurrpa.
                                </li>
                            </StyledUl>
                            <Typography component={'p'} sx={{ pb: 1 }}>
                                Kunawarritji is part of Martu Country on what was the old Canning Stock Route.
                            </Typography>
                            <StyledImage src={DesertImage} alt="Thorny devil in the desert." loading="lazy" />
                            <StyledImageCaption>
                                Desert near old Canning Stock Route @tolly65 – stock.adobe.com
                            </StyledImageCaption>
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
