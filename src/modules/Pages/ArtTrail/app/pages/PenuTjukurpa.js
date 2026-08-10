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

import ArtworkImage from '../assets/images/artwork/Burton_2016_03_crop-scaled.jpg';

import Hero from '../Hero';

const StyledAccordion = styled(Accordion)(() => ({
    marginBottom: 'var(--art-trail-font-size)',
    '&.Mui-expanded:last-of-type': { marginBottom: 'var(--art-trail-font-size)' },
}));

const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
    '& p': {
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
    height: 'auto',
});

const PenuTjukurpaDrawerContent = () => {
    return (
        <Grid container direction="column" rowSpacing={1.5}>
            <Grid>
                <Typography variant="h4">
                    Hector Tjupuru Burton
                    <br />
                    Ray Ken
                    <br />
                    Mick Wikilyiri
                    <br />
                    Brenton Ken
                </Typography>
            </Grid>
            <Grid>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
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
                </Typography>
            </Grid>
        </Grid>
    );
};

const Page = ({ openDrawer }) => {
    return (
        <Grid container direction="column" rowSpacing={2.5}>
            <Hero
                title="'Punu Tjukurpa' 2013, Hector Tijupuru Burton, Ray Ken, Mick Wikilyiri, Brenton Ken"
                subtitle=""
            />
            <Grid
                container
                direction="column"
                pl={'var(--art-trail-font-size)'}
                pr={'var(--art-trail-font-size)'}
                data-testid="pageContent"
            >
                <Grid>
                    <Box position="relative">
                        <StyledImage
                            src={ArtworkImage}
                            alt="'Punu Tjukurpa' 2013, Hector Tijupuru Burton, Ray Ken, Mick Wikilyiri, Brenton Ken"
                            sx={{ position: 'relative' }}
                        />
                        <IconButton
                            size="large"
                            aria-label="More information about this artwork"
                            onClick={() => openDrawer(PenuTjukurpaDrawerContent)}
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
                                This work was created by senior men from the Men's Painting Room. Their work celebrates
                                their memories of Country, family history and Tjukurpa (the creation story for the Amata
                                region). The group have used the motif of the trees of their Country to represent
                                family, community, and their relationship to the land.
                            </Typography>
                            <Typography component={'p'}>
                                For Anangu communities, the tree is a significant motif for ancestry and family. It is
                                different to the way non-Indigenous families might think about a 'family tree', which
                                usually depicts their ancestors at the top of the tree, amongst the leaves.
                            </Typography>
                            <Typography component={'p'}>
                                In the Anangu way, as you can see in this work, Punu Tjukurpa, the Ancestors are the
                                roots, which we see spreading deep across the bottom of the painting. The artists and
                                Elders who share knowledge are the trunk, in the centre, and the children and future
                                generations are at the top, represented by the young yellow and green sprouting leaves,
                                yet to grow.
                            </Typography>
                            <Typography component={'p'}>
                                Through this shared storytelling, Punu Tjukurpa creates a conduit between deep ancestral
                                roots and future generations.
                            </Typography>
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
                            <Typography component={'p'}>
                                <strong>Hector Tjupuru Burton</strong> (c. 1937—2017) is a senior Pitjantjatjara law
                                man. He was born near Pukatja (Ernabella) in South Australia. He encouraged other senior
                                men to join him in forming a Men’s Painting Room. The painting room provided artists
                                with an opportunity to record their sacred stories, inspired by the ancestors of the
                                Musgrave Ranges that rise above the Amata region.
                            </Typography>
                            <Typography component={'p'}>
                                <strong>Ray Ken</strong> (c. 1940—2018) was born near Indulkana in South Australia. He
                                belongs to the Pitjantjatjara/Yankunytjatjara people.
                            </Typography>
                            <Typography component={'p'}>
                                <strong>Mick Wikilyiri</strong> (c. 1940—) was born in Amata, South Australia and is a
                                Pitjantjatjara man.
                            </Typography>
                            <Typography component={'p'}>
                                <strong>Brenton Ken</strong> (c.1944—2018) was born in South Australia and belongs to
                                the Pitjantjatjara/Yankunytjatjara people.
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
