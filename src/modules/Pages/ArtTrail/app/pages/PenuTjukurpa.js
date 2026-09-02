import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import ArtworkImage from '../../../../../../public/images/artTrail/artwork/Burton_2016_03_crop-scaled.jpg';
import MapImage from '../../../../../../public/images/artTrail/maps/PenuTjukurpa.jpg';

import Hero from '../SharedComponents/Hero';
import InformationButton from '../SharedComponents/InformationButton';
import LocationButton from '../SharedComponents/LocationButton';
import {
    DisclosureSection,
    StyledHeading,
    StyledAccordionGrid,
    StyledAccordion,
    StyledAccordionDetails,
    StyledDrawerHeader,
    StyledTrailImage,
    StyledUl,
    StyledImage,
} from '../SharedComponents';

const ArtDrawerContent = () => {
    return (
        <Grid container direction="column" rowSpacing={1.5}>
            <Grid>
                <StyledDrawerHeader variant="h3">
                    Hector Tjupuru Burton
                    <br />
                    Ray Ken
                    <br />
                    Mick Wikilyiri
                    <br />
                    Brenton Ken
                </StyledDrawerHeader>
            </Grid>
            <Grid>
                <Box component="p" sx={{ color: 'text.secondary' }}>
                    <em>Punu Tjukurpa</em> 2013
                    <br />
                    synthetic polymer paint on linen
                    <br />
                    197 x 197 cm
                    <br />
                    Collection of The University of Queensland, purchased with the assistance of Cathryn Mittelheuser AM
                    in memory of Margaret Mittelheuser AM, 2016.
                    <br />
                    Reproduced courtesy of the artists, artists' estate and Alcaston Gallery, Melbourne.
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
                    Level 1,{' '}
                    <a href="https://web.library.uq.edu.au/visit/duhig-tower" target="_blank" rel="noopener noreferrer">
                        Duhig Tower
                    </a>{' '}
                    (Building 2), St Lucia campus.
                </Box>
            </Grid>
        </Grid>
    );
};

const Page = ({ openInformationDrawer, openLocationDrawer }) => {
    return (
        <Grid container direction="column" rowSpacing={2.5}>
            <Hero id="artwork-punu-tjukurpa" sx={{ pb: 0 }} />
            <Grid container direction="column" data-testid="pageContent" pt={0}>
                <Grid>
                    <Box position="relative">
                        <StyledTrailImage
                            src={ArtworkImage}
                            alt="Hector Tijupuru Burton, Ray Ken, Mick Wikilyiri, Brenton Ken 'Punu Tjukurpa' 2013"
                            intrinsicWidth={2548}
                            intrinsicHeight={2532}
                        />
                        <InformationButton
                            title="Punu Tjukurpa"
                            onClick={() => openInformationDrawer(ArtDrawerContent, 'Punu Tjukurpa')}
                        />
                        <LocationButton
                            title="Punu Tjukurpa"
                            onClick={() => openLocationDrawer(LocationDrawerContent, 'Punu Tjukurpa')}
                        />
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
                            <Box component={'p'}>
                                This work was created by senior men from the Men's Painting Room. Their work celebrates
                                their memories of Country, family history and Tjukurpa (the creation story for the Amata
                                region). The group have used the motif of the trees of their Country to represent
                                family, community, and their relationship to the land.
                            </Box>
                        }
                        details={
                            <>
                                <Box component={'p'}>
                                    For Anangu communities, the tree is a significant motif for ancestry and family. It
                                    is different to the way non-Indigenous families might think about a 'family tree',
                                    which usually depicts their ancestors at the top of the tree, amongst the leaves.
                                </Box>
                                <Box component={'p'}>
                                    In the Anangu way, as you can see in this work, <em>Punu Tjukurpa</em>, the
                                    Ancestors are the roots, which we see spreading deep across the bottom of the
                                    painting. The artists and Elders who share knowledge are the trunk, in the centre,
                                    and the children and future generations are at the top, represented by the young
                                    yellow and green sprouting leaves, yet to grow.
                                </Box>
                                <Box component={'p'}>
                                    Through this shared storytelling, <em>Punu Tjukurpa</em> creates a conduit between
                                    deep ancestral roots and future generations.
                                </Box>
                            </>
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
                            <Box component={'p'}>
                                Take a few minutes to look closely at all the detail in this painting.
                            </Box>
                            <StyledUl>
                                <li>
                                    What different shapes and patterns can you see branching off from the central shape?
                                </li>
                                <li>Which parts are your eyes most drawn to? Why do they stand out?</li>
                            </StyledUl>
                        </StyledAccordionDetails>
                    </StyledAccordion>
                    <StyledAccordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="about-the-artists-content"
                            id="about-the-artists-header"
                        >
                            About the artists
                        </AccordionSummary>
                        <StyledAccordionDetails id="about-the-artists-content">
                            <Box component={'p'}>
                                <strong>Hector Tjupuru Burton</strong> (c. 1937—2017) is a senior Pitjantjatjara law
                                man. He was born near Pukatja (Ernabella) in South Australia. He encouraged other senior
                                men to join him in forming a Men's Painting Room. The painting room provided artists
                                with an opportunity to record their sacred stories, inspired by the ancestors of the
                                Musgrave Ranges that rise above the Amata region.
                            </Box>
                            <Box component={'p'}>
                                <strong>Ray Ken</strong> (c. 1940—2018) was born near Indulkana in South Australia. He
                                belongs to the Pitjantjatjara/Yankunytjatjara people.
                            </Box>
                            <Box component={'p'}>
                                <strong>Mick Wikilyiri</strong> (c. 1940—) was born in Amata, South Australia and is a
                                Pitjantjatjara man.
                            </Box>
                            <Box component={'p'}>
                                <strong>Brenton Ken</strong> (c.1944—2018) was born in South Australia and belongs to
                                the Pitjantjatjara/Yankunytjatjara people.
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
                            <Box component={'p'} sx={{ pb: 1 }}>
                                Learn more about{' '}
                                <a
                                    href="https://empoweredcommunities.org.au/our-regions/npy-lands/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Ngaanyatjarra Pitjantjatjara Yankunytjatjara
                                </a>{' '}
                                Lands.
                            </Box>
                            <StyledImage
                                src={MapImage}
                                alt="Stylised map of Australia with the north west of Southern Australia highlighted, showing the location of Ngaanyatjarra Pitjantjatjara Yankunytjatjara Lands."
                                loading="lazy"
                            />
                        </StyledAccordionDetails>
                    </StyledAccordion>
                </StyledAccordionGrid>
            </Grid>
        </Grid>
    );
};

Page.propTypes = {
    openInformationDrawer: PropTypes.func.isRequired,
    openLocationDrawer: PropTypes.func.isRequired,
};

export default Page;
