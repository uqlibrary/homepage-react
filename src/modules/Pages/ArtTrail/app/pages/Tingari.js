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

import ArtworkImage from '../../../../../../public/images/artTrail/artwork/Tjupurrula_2014_40_WEB.jpg';

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

const ArtDrawerContent = () => {
    return (
        <Grid container direction="column" rowSpacing={1.5}>
            <Grid>
                <StyledDrawerHeader variant="h3">Johnny Yungut Tjupurrula </StyledDrawerHeader>
            </Grid>
            <Grid>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    <em>Tingari ceremonies at Wilkinkarra</em> 2003
                    <br />
                    synthetic polymer paint on linen
                    <br />
                    182.5 x 152 cm
                    <br />
                    Collection of The University of Queensland. Gift of Christopher Thomas and Mark Alexander through
                    the Australian Government's Cultural Gifts Program, 2014.
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
            <Hero title="'Tingari ceremonies at Wilkinkarra' 2003, Johnny Yungut Tjupurrula" />
            <Grid container direction="column" data-testid="pageContent">
                <Grid>
                    <Box position="relative">
                        <StyledImage src={ArtworkImage} alt="'Tingari ceremonies at Wilkinkarra' 2003 artwork." />
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
                                This work considers migration and movements across long expanses of Country which are
                                significant for Tingari Dreaming Stories. Note the intricate lines, patterns, and
                                colour, which the artist has used to create the illusion of movement.
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
                                Take a moment to look at the painterly marks made by the artist in these artworks.
                            </Typography>
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
                            <Typography component={'p'}>
                                The artist was born c. 1930 near Tjungimanta, Kiwirrkurra in the Northern Territory.
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
                                Learn more about <strong>Kiwirrkurra.</strong>
                            </Typography>
                            <iframe
                                title="Indigenous art trail - Kiwirrkurra"
                                src="https://uq.h5p.com/content/1292938712625855909/embed"
                                aria-label="Indigenous art trail - Kiwirrkurra - Tingari ceremonies at Wilkinkarra 2003"
                                width="1090"
                                frameBorder="0"
                                allowFullScreen
                                allow="autoplay *; geolocation *; microphone *; camera *; midi *; encrypted-media *"
                                style={{ width: '100%', height: 'auto', aspectRatio: '1090/1033' }}
                            />
                            <StyledUl>
                                <li>
                                    <a
                                        href="https://www.abc.net.au/news/2025-03-16/pintupi-nine-aboriginal-family-40-years-after-leaving-wa-desert/104824250"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        From the sands of time, the Pintupi Nine were thrust into the glare of the
                                        modern world{' '}
                                    </a>
                                    <br /> Kiwirrkurra is home to people from the Pintupi, Manyjilyjarra and Kukatja
                                    language groups. Read more about the Pintupi people and Kiwirrkurra in this ABC News
                                    article.
                                </li>
                            </StyledUl>
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
