import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import ArtworkImage from '../../../../../../public/images/artTrail/artwork/UQAM_20260116_CampusArtwork_073_LR.jpg';
import NorthStradbrokeImage from '../../../../../../public/images/artTrail/North-Stradbroke-Island-_C_-Kevin-stock.adobe-scaled.jpg';
import MapImage from '../../../../../../public/images/artTrail/maps/Whispers.jpg';

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

const ArtDrawerContent = () => {
    return (
        <Grid container direction="column" rowSpacing={1.5}>
            <Grid>
                <StyledDrawerHeader variant="h3">Megan Cope</StyledDrawerHeader>
            </Grid>
            <Grid>
                <Box variant="body2" sx={{ color: 'text.secondary' }}>
                    <em>Whispers (Poles)</em> 2023
                    <br />
                    repurposed oyster shell waste on cypress pine
                    <br />
                    dimensions variable
                    <br />
                    Collection of The University of Queensland. Donated through the Australian Government's Cultural
                    Gifts Program by Megan Cope, 2025 (pending).
                    <br />
                    Reproduced courtsey the artist and Milani Gallery, Brisbane.
                    <br />
                    Installation view (detail), UQ Library. Photo: Joe Ruckli
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
                <Box variant="body2" sx={{ color: 'text.secondary' }}>
                    On Level 1,{' '}
                    <a
                        href="https://web.library.uq.edu.au/visit/central-library"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Central Library
                    </a>{' '}
                    (Building 12), St Lucia campus.
                </Box>
                <StyledUl>
                    <li>near the AskUs desk</li>
                    <li>in front of the purple stairs.</li>
                </StyledUl>
            </Grid>
        </Grid>
    );
};

const Page = ({ openInformationDrawer, openLocationDrawer, handleAccordionChange }) => {
    return (
        <Grid container direction="column" rowSpacing={2.5}>
            <Hero id="artwork-whispers" sx={{ pb: 0 }} />
            <Grid container direction="column" data-testid="pageContent" pt={0}>
                <Grid>
                    <Box position="relative">
                        <StyledTrailImage
                            src={ArtworkImage}
                            alt="Whispers 2023 artwork."
                            intrinsicWidth={1667}
                            intrinsicHeight={2500}
                        />

                        <InformationButton
                            title="Whispers (Poles)"
                            onClick={() => openInformationDrawer(ArtDrawerContent, 'Whispers (Poles)')}
                        />
                        <LocationButton
                            title="Whispers (Poles)"
                            onClick={() => openLocationDrawer(LocationDrawerContent, 'Whispers (Poles)')}
                        />
                    </Box>
                </Grid>
                <StyledAccordionGrid onChange={handleAccordionChange}>
                    <DisclosureSection
                        heading={
                            <StyledHeading variant="h6" component="h2">
                                About the artwork
                            </StyledHeading>
                        }
                        summary={
                            <Box component={'p'}>
                                Megan Cope's <em>Whispers (Poles)</em> 2023 emerges from her connection to Quandamooka
                                Country, which encompasses lands, sands, and seas in present-day Moreton Bay.
                            </Box>
                        }
                        details={
                            <>
                                <Box component={'p'}>
                                    Cope's recent practice is informed by her cultural relationships and ancestral
                                    practices to Kinyingarra (meaning 'oyster' in Jandai and Gowar languages), and the
                                    histories and devastations to midden sites and oyster reefs on Quandamooka Country.
                                    Oyster reefs are vital for healthy and resilient saltwater ecosystems: they act as
                                    natural breakwaters, filter and improve water quality, and provide habitat for fish
                                    and other marine life.
                                </Box>
                                <Box component={'p'}>
                                    Cope's work demonstrates the role of art in physically healing saltwater Country and
                                    coastal environments that have been colonised and now transformed through climate
                                    change. This series of hand-built Kinyingarra poles replicates the formations of
                                    Cope's living artwork, <em>Kinyingarra Guwinyanba</em> (2022), created on
                                    Quandamooka Country in the intertidal zone. Her “On Country” iterations are designed
                                    to cultivate growth and create habitat in the water where they are planted. In situ,
                                    they become living land and sea art sculptures, fostering regenerative practice,
                                    restoring place, and innovating ancestral methods of caring for Country.
                                </Box>
                                <Box component={'p'}>
                                    <em>Whispers (Poles)</em> is a selection from a large-scale public work of over 200
                                    poles created in 2023 through collaboration and knowledge exchange in Gadigal
                                    Country. In this work, community and Country are interwoven, emphasising shared and
                                    ongoing responsibilities to care for saltwater ecosystems that have nourished both
                                    generations and connected life worlds.
                                </Box>
                            </>
                        }
                        onExpand={handleAccordionChange}
                    />

                    <StyledAccordion onChange={handleAccordionChange}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="reflect-content"
                            id="reflect-header"
                        >
                            Reflect
                        </AccordionSummary>
                        <StyledAccordionDetails id="reflect-content">
                            <Box component={'p'}>Megan Cope often uses elements of Country in her artworks.</Box>
                            <StyledUl>
                                <li>What do you think displaying these materials off-Country might say?</li>
                                <li>Why do you think this is important to the artist?</li>
                            </StyledUl>
                        </StyledAccordionDetails>
                    </StyledAccordion>
                    <StyledAccordion onChange={handleAccordionChange}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="about-the-artists-content"
                            id="about-the-artists-header"
                        >
                            About the artist
                        </AccordionSummary>
                        <StyledAccordionDetails id="about-the-artists-content">
                            <Box component={'p'}>
                                Megan Cope was born in 1982 in Meanjin, Brisbane. Her people are the Quandamooka people
                                of Minjerribah (North Stradbroke Island).
                            </Box>
                            <Box component={'p'}>Megan Cope is represented by Milani Gallery.</Box>
                            <Box component={'p'}>
                                You can read more about Megan Cope on{' '}
                                <a href="https://www.megancope.com.au/about" target="_blank" rel="noopener noreferrer">
                                    her website
                                </a>
                            </Box>
                        </StyledAccordionDetails>
                    </StyledAccordion>
                    <StyledAccordion onChange={handleAccordionChange}>
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
                                    href="https://aiatsis.gov.au/explore/map-indigenous-australia"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Quandamooka Country
                                </a>
                                .
                            </Box>

                            <StyledImage
                                src={MapImage}
                                alt="Stylised map of Australia with the south east region of Queensland highlighted, showing the location of Quandamooka Country."
                                loading="lazy"
                            />
                            <Box component={'p'} sx={{ pb: 1 }}>
                                Watch{' '}
                                <a
                                    href="https://youtu.be/MDLi3CIUJII?si=BEzJ4GTMaW8GSDgu"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Megan Cope's regenerate artworks in Minjerribah | Art Works (YouTube, 9m 56s)
                                </a>{' '}
                                to learn more about how Megan Cope's artworks are part of restoring and caring for
                                Country:
                            </Box>
                            <iframe
                                width="560"
                                height="315"
                                src="https://www.youtube.com/embed/MDLi3CIUJII?si=IIQU3xb96JcDf4fA"
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    aspectRatio: '16/9',
                                    marginBottom: 'var(--art-trail-spacing)',
                                }}
                            />

                            <StyledImage
                                src={NorthStradbrokeImage}
                                alt="Ocean view at North Stradbroke Island."
                                loading="lazy"
                            />
                            <StyledImageCaption>North Stradbroke Island @Kevin stock.adobe.com.</StyledImageCaption>
                        </StyledAccordionDetails>
                    </StyledAccordion>
                    <StyledAccordion onChange={handleAccordionChange}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="stories-from-the-collection-content"
                            id="stories-from-the-collection-header"
                        >
                            Stories from the collection
                        </AccordionSummary>
                        <StyledAccordionDetails id="stories-from-the-collection-content">
                            <Box component={'p'}>
                                This artwork connects to <strong>Quandamooka Country</strong> and{' '}
                                <strong>Minjerrbah (North Stradbroke Island)</strong>, also the home of Oodgeroo
                                Noonuccal, a poet, artist and Aboriginal activist.
                            </Box>
                            <Box component={'p'}>
                                The Fryer Collection holds the{' '}
                                <a
                                    href="https://manuscripts.library.uq.edu.au/index.php/uqfl84"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Oodgeroo Noonuccal papers
                                </a>
                                , a collection of poetry, speeches, correspondence, photos and other materials relating
                                to Noonuccal's life and work.
                            </Box>
                            <Box component={'p'}>
                                One remarkable item included in the collection is the poem{' '}
                                <a
                                    href="https://uq.pressbooks.pub/storying-the-archive/chapter/response-to-oodgeroo-noonuccals-poems/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <em>Yusuf (Hijacker)</em>
                                </a>
                                . Noonuccal wrote this poem on the back of a paper airplane sick bag while she was held
                                hostage during the British Airways VC10 hijacking in 1974.
                            </Box>
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
    handleAccordionChange: PropTypes.func.isRequired,
};

export default Page;
