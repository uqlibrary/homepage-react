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

import ArtworkImage from '../../../../../../public/images/artTrail/artwork/UQAM_20260116_CampusArtwork_073_LR.jpg';
import NorthStradbrokeImage from '../../../../../../public/images/artTrail/North-Stradbroke-Island-_C_-Kevin-stock.adobe-scaled.jpg';

import Hero from '../Hero';
import {
    StyledAccordion,
    StyledAccordionDetails,
    StyledAccordionGrid,
    StyledDrawerHeader,
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
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
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
                    On Level 1,{' '}
                    <a
                        href="https://web.library.uq.edu.au/visit/central-library"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Central Library
                    </a>{' '}
                    (Building 12), St Lucia campus.
                </Typography>
                <StyledUl>
                    <li>near the AskUs desk</li>
                    <li>in front of the purple stairs.</li>
                </StyledUl>
            </Grid>
        </Grid>
    );
};

const Page = ({ openDrawer }) => {
    return (
        <Grid container direction="column" rowSpacing={2.5}>
            <Hero title="'Whispers (Poles)' 2023, Megan Cope" sx={{ pb: 0 }} data-testid="pageHero" />
            <Grid container direction="column" data-testid="pageContent" pt={0}>
                <Grid>
                    <Box position="relative">
                        <StyledImage src={ArtworkImage} alt="Whispers 2023 artwork." />
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
                                Megan Cope's Whispers (Poles) 2023 emerges from her connection to Quandamooka Country,
                                which encompasses lands, sands, and seas in present-day Moreton Bay.
                            </Typography>
                            <Typography component={'p'}>
                                Cope's recent practice is informed by her cultural relationships and ancestral practices
                                to Kinyingarra (meaning 'oyster' in Jandai and Gowar languages), and the histories and
                                devastations to midden sites and oyster reefs on Quandamooka Country. Oyster reefs are
                                vital for healthy and resilient saltwater ecosystems: they act as natural breakwaters,
                                filter and improve water quality, and provide habitat for fish and other marine life.
                            </Typography>
                            <Typography component={'p'}>
                                Cope's work demonstrates the role of art in physically healing saltwater Country and
                                coastal environments that have been colonised and now transformed through climate
                                change. This series of hand-built Kinyingarra poles replicates the formations of Cope's
                                living artwork, Kinyingarra Guwinyanba (2022), created on Quandamooka Country in the
                                intertidal zone. Her “On Country” iterations are designed to cultivate growth and create
                                habitat in the water where they are planted. In situ, they become living land and sea
                                art sculptures, fostering regenerative practice, restoring place, and innovating
                                ancestral methods of caring for Country.
                            </Typography>
                            <Typography component={'p'}>
                                <em>Whispers (Poles)</em> is a selection from a large-scale public work of over 200
                                poles created in 2023 through collaboration and knowledge exchange in Gadigal Country.
                                In this work, community and Country are interwoven, emphasising shared and ongoing
                                responsibilities to care for saltwater ecosystems that have nourished both generations
                                and connected life worlds.
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
                            <Typography component={'p'}>
                                Megan Cope often uses elements of Country in her artworks.
                            </Typography>
                            <StyledUl>
                                <li>What do you think displaying these materials off-Country might say?</li>
                                <li>Why do you think this is important to the artist?</li>
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
                            <Typography component={'p'}>
                                Megan Cope was born in 1982 in Meanjin, Brisbane. Her people are the Quandamooka people
                                of Minjerribah (North Stradbroke Island).
                            </Typography>
                            <Typography component={'p'}>Megan Cope is represented by Milani Gallery.</Typography>
                            <Typography component={'p'}>
                                You can read more about Megan Cope on{' '}
                                <a href="https://www.megancope.com.au/about" target="_blank" rel="noopener noreferrer">
                                    her website
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
                                Learn more about <strong>Quandamooka Country.</strong>
                            </Typography>
                            <iframe
                                title="Indigenosu art trail - Quandamooka"
                                src="https://uq.h5p.com/content/1292938875849479079/embed"
                                aria-label="Indigenous art trail - Quandamooka - Whispers"
                                width="1090"
                                frameBorder="0"
                                allowfullscreen="allowfullscreen"
                                allow="autoplay *; geolocation *; microphone *; camera *; midi *; encrypted-media *"
                                style={{ width: '100%', height: 'auto', aspectRatio: '1090/1033' }}
                            />
                            <Typography component={'p'} sx={{ pb: 1 }}>
                                Watch{' '}
                                <a
                                    href="https://youtu.be/MDLi3CIUJII?si=BEzJ4GTMaW8GSDgu"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Megan Cope's regenerate artworks in Minjerribah | Art Works (YouTube, 9m 56s)
                                </a>{' '}
                                to learn more about how Megan Cope’s artworks are part of restoring and caring for
                                Country:
                            </Typography>
                            <iframe
                                width="560"
                                height="315"
                                src="https://www.youtube.com/embed/sxawWKuA4JM?si=6kk89BbR3ZeiubR2"
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowfullscreen=""
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
                    <StyledAccordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="stories-from-the-collection-content"
                            id="stories-from-the-collection-header"
                        >
                            Stories from the collection
                        </AccordionSummary>
                        <StyledAccordionDetails id="stories-from-the-collection-content">
                            <Typography component={'p'}>
                                This artwork connects to <strong>Quandamooka Country</strong> and{' '}
                                <strong>Minjerrbah (North Stradbroke Island)</strong>, also the home of Oodgeroo
                                Noonuccal, a poet, artist and Aboriginal activist.
                            </Typography>
                            <Typography component={'p'}>
                                The Fryer Collection holds the{' '}
                                <a
                                    href="https://manuscripts.library.uq.edu.au/index.php/uqfl84"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Oodgeroo Noonuccal papers
                                </a>
                                , a collection of poetry, speeches, correspondence, photos and other materials relating
                                to Noonuccal’s life and work.
                            </Typography>
                            <Typography component={'p'}>
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
                            </Typography>
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
