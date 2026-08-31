import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Artwork1Image from '../../../../../../public/images/artTrail/artwork/2018.27_Kunawarritji-1-landscape-2.jpg';
import Artwork2Image from '../../../../../../public/images/artTrail/artwork/2018.28_Kunawarritji-2-landscape-2.jpg';
import DesertImage from '../../../../../../public/images/artTrail/Desert-near-old-Canning-Stock-Route_C_-tolly65_stock.adobe.com-2.jpg';
import MapImage from '../../../../../../public/images/artTrail/maps/Kunawarritji.jpg';

import Hero from '../SharedComponents/Hero';
import InformationButton from '../SharedComponents/InformationButton';
import LocationButton from '../SharedComponents/LocationButton';
import {
    DisclosureSection,
    StyledHeading,
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
                <Box component="p" sx={{ color: 'text.secondary' }}>
                    <em>Kunawarritji 1</em> 2012
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
                </Box>
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
                <Box component="p" sx={{ color: 'text.secondary' }}>
                    <em>Kunawarritji 2</em> 2012
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
                </Box>
            </Grid>
        </Grid>
    );
};
const LocationDrawerContent = () => {
    return (
        <Grid container direction="column" rowSpacing={1.5}>
            <Grid>
                <StyledDrawerHeader variant="h3">Artwork location</StyledDrawerHeader>
            </Grid>
            <Grid>
                <Box component="p" sx={{ color: 'text.secondary' }}>
                    Level 2,{' '}
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
            <Hero id="artwork-nora-wompi-nungurrayi" sx={{ pb: 0 }} />
            <Grid container direction="column" data-testid="pageContent" pt={0}>
                <Grid>
                    <Box position="relative">
                        <StyledTrailImage
                            src={Artwork1Image}
                            alt="Kunawarritji 1 artwork."
                            intrinsicWidth={4671}
                            intrinsicHeight={3096}
                        />

                        <InformationButton onClick={() => openDrawer(Art1DrawerContent)} />
                        <LocationButton onClick={() => openDrawer(LocationDrawerContent)} />
                    </Box>
                    <Box position="relative">
                        <StyledImage
                            src={Artwork2Image}
                            alt="Kunawarritji 2 artwork."
                            intrinsicWidth={3042}
                            intrinsicHeight={2043}
                        />

                        <InformationButton onClick={() => openDrawer(Art2DrawerContent)} />
                        <LocationButton onClick={() => openDrawer(LocationDrawerContent)} />
                    </Box>
                </Grid>
                <StyledAccordionGrid>
                    <DisclosureSection
                        heading={
                            <StyledHeading variant="h6" component="h2">
                                About the artwork
                            </StyledHeading>
                        }
                        summary={
                            <Box component="p">
                                These two paintings depict a place central to the artist's life and community,
                                Kunawarritji (meaning 'water spring'). What makes these paintings so striking for an
                                artist of this region is the defined colour palette which utilises soft yellows, pinks,
                                whites, and blues. These colours overlap and bleed into each other creating fluid
                                intersections of place.
                            </Box>
                        }
                        details={
                            <Box component="p">
                                You can see the expressive brushstrokes within each of these works. While both artworks
                                depict the same place, there is a unique feel to each painting, communicated through
                                colour, shape and texture. If you look closely at each artwork, you can see the depth of
                                the underlaid paint, the ochre tones showing through the lighter layers.
                            </Box>
                        }
                    />

                    <StyledAccordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="reflect-content"
                            id="reflect-header"
                        >
                            Reflect
                        </AccordionSummary>
                        <StyledAccordionDetails id="reflect-content">
                            <Box component="p">
                                Take a moment to look at the painterly marks made by the artist in these artworks.
                            </Box>
                            <StyledUl>
                                <li>What feelings do the colours of each painting convey to you?</li>
                                <li>
                                    How might the different colour palettes be telling different parts of the story the
                                    artist is conveying?
                                </li>
                            </StyledUl>
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
                                The artist, from the Kukatja language group and Nungurrayi communities, was born c. 1935
                                near Well 33 in the Kunawarritji Community based along the Canning Stock Route in
                                mid-Western Australia.
                            </Box>
                            <Box component="p">
                                Many of the paintings created by this artist connect with nature and place, and this is
                                because she spent many years of her life moving between Kunawarritji, Balgo, Kiwirrkurra
                                and Punmu. More than a prolific artist, she was a senior respected elder and cultural
                                leader who cared for Country and whose obligations drew her to these different places
                                across her lifetime. The artist passed away in 2017 and it is a privilege to be able to
                                show her continuing artistic legacy to you today.
                            </Box>
                            <Box component="p">
                                Find out{' '}
                                <a href="https://martumili.com.au/node/73" target="_blank" rel="noopener noreferrer">
                                    more about the artist.
                                </a>
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
                                This artwork was inspired by the artist's home at Kunawarritji, part of{' '}
                                <a
                                    href="https://aiatsis.gov.au/explore/map-indigenous-australia"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Martu Country
                                </a>{' '}
                                in Western Australia.
                            </Box>
                            <StyledImage
                                src={MapImage}
                                alt="Stylised map of Australia with the north west of Western Australia highlighted, showing the location of Martu Country."
                                loading="lazy"
                            />
                            <StyledUl>
                                <li>
                                    <a
                                        href="https://www.kj.org.au/martu-country"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Why Martu Country is special{' '}
                                    </a>
                                    <br /> Read about Martu lands - from Kanyirninpa Jukurrpa.
                                </li>
                            </StyledUl>
                            <Box component="p" sx={{ paddingBottom: '1rem' }}>
                                Kunawarritji is part of Martu Country on what was the old Canning Stock Route.
                            </Box>
                            <StyledImage src={DesertImage} alt="Thorny devil in the desert." loading="lazy" />
                            <StyledImageCaption>
                                Desert near old Canning Stock Route @tolly65 - stock.adobe.com
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
