import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Unstable_Grid2';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';

import ArtworkImage from '../../../../../../public/images/artTrail/artwork/Robinson_2017_02_WEBREADY.jpg';
import ThursdayIslandImage from '../../../../../../public/images/artTrail/Thursday-Island-_C_-Reef-Pix-stock.adobe-scaled.jpg';

import Hero from '../Hero';
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

const ArtDrawerContent = () => {
    return (
        <Grid container direction="column" rowSpacing={1.5}>
            <Grid>
                <StyledDrawerHeader variant="h3">Brian Robinson</StyledDrawerHeader>
            </Grid>
            <Grid>
                <Box component="p" sx={{ color: 'text.secondary' }}>
                    <em>Warual III (Green Turtle)</em> 2015
                    <br />
                    lino print on fabric, edition 1/5
                    <br />
                    150 x 150 x 5 cm
                    <br />
                    Collection of The University of Queensland, purchased 2017
                    <br />
                    Reproduced courtesy of the artist, © and onespace, Brisbane.
                    <br />
                    Photo: Carl Warner
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
                    Near the kitchen and exit on Level 2,{' '}
                    <a
                        href="https://web.library.uq.edu.au/visit/central-library"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Central Library
                    </a>{' '}
                    (Building 12), St Lucia campus.
                </Box>
            </Grid>
        </Grid>
    );
};

const Page = ({ openDrawer }) => {
    return (
        <Grid container direction="column" rowSpacing={2.5}>
            <Hero title="'Warual III (Green Turtle)' 2015, Brian Robinson" sx={{ pb: 0 }} data-testid="pageHero" />
            <Grid container direction="column" data-testid="pageContent" pt={0}>
                <Grid>
                    <Box position="relative">
                        <StyledTrailImage
                            src={ArtworkImage}
                            alt="'Warual III (Green Turtle)' 2015 artwork."
                            intrinsicWidth={987}
                            intrinsicHeight={1000}
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
                    <DisclosureSection
                        heading={
                            <StyledHeading variant="h6" component="h3">
                                About the artwork
                            </StyledHeading>
                        }
                        summary={
                            <Box component="p">
                                Brian Robinson creates works that combine traditional mark making and patterns from his
                                cultural belongings with references to his favourite pop culture movies and comics. His
                                work features cosmic toys, superheroes, cartoons and well-known branded iconography,
                                co-opted into the spirit world of First Nations imagination that he intertwines with
                                historical narratives, personal history and humour.
                            </Box>
                        }
                        details={
                            <>
                                <Box component="p">
                                    Robinson is a multi-skilled contemporary artist and is internationally recognised
                                    for his work in printmaking, painting, sculpture and design.
                                </Box>
                                <Box component="p">
                                    <em>Warual III</em> 2015 reflects the tropical marine environments surrounding
                                    Waiben and the inhabitants of the island.
                                </Box>
                                <Box component="p">
                                    Such animal motifs have been essential parts of his life and culture, imbued with
                                    the customs, stories, traditions and lifestyles of his Ancestors and family.
                                </Box>
                            </>
                        }
                    />

                    <StyledAccordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="about-the-artwork-content"
                            id="about-the-artwork-header"
                        >
                            About the artwork
                        </AccordionSummary>
                        <StyledAccordionDetails id="about-the-artwork-content" />
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
                            <Box component="p">
                                Take a moment to look closely at the small details carved into this lino print.
                            </Box>
                            <StyledUl>
                                <li>What hidden pop culture references can you find?</li>
                                <li>
                                    Why do you think the artist might include these alongside stories of his culture in
                                    his artworks?
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
                                Brian Robinson was born in 1973 on Waiben (Thursday Island) in Far North Queensland. He
                                has connections to the Maluyligal, Wuthathi and Dayak people. Growing up on Waiben,
                                Brian was surrounded by family who were well known fish folk, practicing faiths that
                                existed with strong cultural traditions and Maluyligal spirituality.
                            </Box>
                            <Box component="p">
                                Today, he lives and works in Gimuy (Cairns). Brian Robinson is represented by Onespace
                                Gallery, Brisbane.
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
                            <Box component="p" sx={{ pb: 1 }}>
                                Learn more about Waiben (Thursday Island).
                            </Box>
                            <iframe
                                title="Indigenous art trail - Waiben (Thursday Island)"
                                src="https://uq.h5p.com/content/1292938905372654189/embed"
                                aria-label="Indigenous art trail - Waiben (Thursday Island) - Warual III (Green Turtle)"
                                width="1090"
                                frameBorder="0"
                                allowfullscreen="allowfullscreen"
                                allow="autoplay *; geolocation *; microphone *; camera *; midi *; encrypted-media *"
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    aspectRatio: '1090/1033',
                                    marginBottom: 'var(--art-trail-spacing)',
                                }}
                            />
                            <StyledImage src={ThursdayIslandImage} alt="Thursday Island." loading="lazy" />
                            <StyledImageCaption>Thursday Island @Reef Pix stock.adobe.com</StyledImageCaption>
                            <Box component={'p'} sx={{ pb: 1 }}>
                                Watch{' '}
                                <a
                                    href="https://youtu.be/jCXdWPcXHCE?si=udjcAX9G34U0HLBm"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Artist story/ Brian Robinson discusses his art practice (YouTube, 5m 56s)
                                </a>{' '}
                                to hear Brian Robinson discuss his practice as an artist:
                            </Box>
                            <iframe
                                width="560"
                                height="315"
                                src="https://www.youtube.com/embed/jCXdWPcXHCE?si=j09ilceFa9rmpk55"
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowfullscreen=""
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    aspectRatio: '16/9',
                                }}
                            />
                        </StyledAccordionDetails>
                    </StyledAccordion>
                    <StyledAccordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="stories-from-the-collection-content"
                            id="stories-from-the-collection-header"
                        >
                            Stories from the collection
                        </AccordionSummary>
                        <StyledAccordionDetails id="stories-from-the-collection-content">
                            <Box component={'p'}>
                                Brian Robinson's work combines traditional mark-making and patterns with pop culture
                                imagery, demonstrating ways that Aboriginal cultures are continually evolving. Kevin
                                Gilbert's 1969 essay, 'What do I, as an Aboriginal, think about the old traditions and
                                customs of my people, and what place do they have in present life and in the future?'
                                explores similar themes.
                            </Box>
                            <Box component={'p'}>
                                Kevin Gilbert was born in 1933 to the Wiradjuri Nation near Condobolin, New South Wales.
                                In addition to publishing several poetry and prose works, he also wrote 'The Cherry
                                Pickers', a play about Aboriginal seasonal workers and was the first Aboriginal
                                playwright to have a play performed in Australia.
                            </Box>
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
