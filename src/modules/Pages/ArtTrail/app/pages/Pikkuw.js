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

import ArtworkImage from '../../../../../../public/images/artTrail/artwork/UQAM_20241219_CampusArtwork_046.jpg';

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

const StyledDrawerHeader = styled(Typography)(({ theme }) => ({
    fontSize: '1.125rem',
    fontWeight: theme.typography.fontWeightMedium,
    fontFamily: 'var(--art-trail-font-family)',
    lineHeight: '1.6',
}));

const ArtDrawerContent = () => {
    return (
        <Grid container direction="column" rowSpacing={1.5}>
            <Grid>
                <StyledDrawerHeader variant="h3">Craig Koomeeta</StyledDrawerHeader>
            </Grid>
            <Grid>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    <em>Pikkuw (Saltwater crocodile)</em> 2008
                    <br />
                    natural ochres with synthetic polymer binder on milkwood
                    <br />
                    32 x 241 x 75 cm
                    <br />
                    Collection of The University of Queensland, purchased with the assistance of an anonymous donor to
                    commemorate the University's Centenary, 2010.
                    <br />
                    Reproduced courtesy of the artist © and Wik & Kugu Art Centre, Aurukun.
                    <br />
                    Installation view, UQ Library.
                    <br />
                    Photo: Joe Ruckli
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
                    Near the AskUs desk on Level 1,{' '}
                    <a
                        href="https://web.library.uq.edu.au/visit/central-library"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Central Library
                    </a>{' '}
                    (Building 12), St Lucia campus.
                </Typography>
            </Grid>
        </Grid>
    );
};

const Page = ({ openDrawer }) => {
    return (
        <Grid container direction="column" rowSpacing={2.5}>
            <Hero title="'Pikkuw (Saltwater crocodile)' 2008, Craig Koomeeta" />
            <Grid container direction="column" data-testid="pageContent">
                <Grid>
                    <Box position="relative">
                        <StyledImage src={ArtworkImage} alt="'Pikkuw (Saltwater crocodile)' 2008 artwork." />
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
                <Grid>
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
                                <em>Pikkuw (Saltwater crocodile)</em> 2008, created by artist Craig Koomeeta, is a
                                tribute to his mother's country as it refers to the relationships between different
                                communities of Koomeeta's Apelech clan. It is also a testament to the stories of coastal
                                saltwater clans.
                            </Typography>
                            <Typography component={'p'}>
                                The carving is of a male saltwater crocodile named Pikkuw. According to Koomeeta's
                                cultural lore, Pikkuw eloped with a female freshwater crocodile from Kencherang Lagoon,
                                a large freshwater lagoon north of Aurukun. Min Kena, a big freshwater male crocodile
                                from Kencherang Lagoon, was deeply angered by the elopement and attacked Pikkuw. Pikkuw
                                bit Min Kena on the tail giving him a noticeably shorter tail. Unfortunately for Pikkuw,
                                Min Kena bit him back on the snout which is why as you can see in this carving that
                                During the colossal fight Pikkuw's saltwater family heard him cry out and proceeded to
                                search for him. When they found him, he was injured and bleeding, so they made a
                                stretcher and took him back to the beach where he slept for many nights. When he awoke
                                the saltwater crocodile family sang many songs.
                            </Typography>
                            <Typography component={'p'}>
                                Pikkuw is decorated here in rich ochre colours and Apelech clan paint up designs,
                                representing the salt water coastal kin of these countries.
                            </Typography>
                            <Typography component={'p'}>
                                This work by Koomeeta remembers the strength of Ancestors and the importance of
                                continuing practices during times of colonial violence. Koomeeta also considers the
                                wisdom and foresight of Elders to pass on cultural knowledge and the visions of
                                community to foster self-determining ways that regenerate cultural expression for future
                                generations.
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
                                Born in 1977, Craig Koomeeta is from the Wik Alkan language group and hails from lands
                                encompassing the Western Cape York Peninsula.
                            </Typography>
                            <Typography component={'p'}>
                                He is a senior Apelech man with a strong family history and is heavily involved within
                                his community in Aurukun.
                            </Typography>
                            <Typography component={'p'}>
                                Koomeeta began refining his cultural practice at 14-years-old. His Uncle Ronald
                                Toilkalkin taught him the art of carving, a central practice for many Aurukun artists.
                                In Aurukun, carving evolved from early clay-based moulding and sculptural techniques.
                                Following Australia's invasion, colonisers introduced tools and assimilatory practices
                                which led to an increased use of timber carving.
                            </Typography>
                            <Typography component={'p'}>
                                The traditional stories of Koomeeta's Apelech Ancestors, the creation brothers and
                                spiritual beings, whose journeys shaped Aurukun and the five clans, inform Koomeeta's
                                artworks.
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
                                Learn more about <strong>Wik Country.</strong>
                            </Typography>
                            <iframe
                                title="Indigenous art trail - Wik Country"
                                src="https://uq.h5p.com/content/1292938863165241189/embed"
                                aria-label="Indigenous art trail - Wik Country - Pikkuw"
                                width="1090"
                                frameBorder="0"
                                allowfullscreen="allowfullscreen"
                                allow="autoplay *; geolocation *; microphone *; camera *; midi *; encrypted-media *"
                                style={{ width: '100%', height: 'auto', aspectRatio: '1090/1033' }}
                            />
                            <Typography component={'p'} sx={{ pb: 1 }}>
                                In this video{' '}
                                <a
                                    href="https://youtu.be/QB14YlFEPiQ?si=LAtIOW3WVV3h3FWT"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Craig Koomeeta discusses his traditional stories (YouTube, 4m 10s)
                                </a>
                            </Typography>
                            <iframe
                                width="560"
                                height="315"
                                src="https://www.youtube.com/embed/QB14YlFEPiQ?si=gjn0ckh-eJ1KyTQE"
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowfullscreen=""
                                style={{ width: '100%', height: 'auto', aspectRatio: '16/9' }}
                            />
                        </StyledAccordionDetails>
                    </StyledAccordion>
                    <StyledAccordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="about-the-artists-content"
                            id="about-the-artists-header"
                        >
                            Stories from the collection
                        </AccordionSummary>
                        <StyledAccordionDetails id="about-the-artists-content">
                            <Typography component={'p'}>
                                Artist Craig Koomeeta's work draws upon the traditional stories of his Apelech Ancestors
                                from the area around Aurukun. Following colonisation, this area became a mission under
                                the control of the Presbyterian Church of Queensland.
                            </Typography>
                            <Typography component={'p'}>
                                In 1936, the Church commissioned Norman F Nelson to conduct an inspection and evaluation
                                of the work and properties of four missions in North Queensland, including Aurukun. The
                                resulting reports and photos provide a record of the community and contribute to ongoing
                                truth-telling.
                            </Typography>
                        </StyledAccordionDetails>
                    </StyledAccordion>
                </Grid>
            </Grid>
        </Grid>
    );
};

Page.propTypes = {
    openDrawer: PropTypes.func.isRequired,
};

export default Page;
