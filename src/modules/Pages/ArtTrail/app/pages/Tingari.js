import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Unstable_Grid2';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';

import ArtworkImage from '../../../../../../public/images/artTrail/artwork/Tjupurrula_2014_40_WEB.jpg';
import MapImage from '../../../../../../public/images/artTrail/maps/Tingari.jpg';

import Hero from '../SharedComponents/Hero';
import {
    DisclosureSection,
    StyledHeading,
    StyledAccordion,
    StyledAccordionDetails,
    StyledAccordionGrid,
    StyledDrawerHeader,
    StyledTrailImage,
    StyledUl,
    StyledImage,
} from '../SharedComponents';

const ArtDrawerContent = () => {
    return (
        <Grid container direction="column" rowSpacing={1.5}>
            <Grid>
                <StyledDrawerHeader variant="h3">Johnny Yungut Tjupurrula </StyledDrawerHeader>
            </Grid>
            <Grid>
                <Box component="p" sx={{ color: 'text.secondary' }}>
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
                    Where: Level 1,{' '}
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
            <Hero
                title={
                    <span>
                        Johnny Yungut Tjupurrula, <em>Tingari ceremonies at Wilkinkarra</em> 2003
                    </span>
                }
                sx={{ pb: 0 }}
                data-testid="pageHero"
            />
            <Grid container direction="column" data-testid="pageContent" pt={0}>
                <Grid>
                    <Box position="relative">
                        <StyledTrailImage
                            src={ArtworkImage}
                            alt="'Tingari ceremonies at Wilkinkarra' 2003 artwork."
                            intrinsicWidth={709}
                            intrinsicHeight={841}
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
                        forceExpanded
                        heading={
                            <StyledHeading variant="h6" component="h2">
                                About the artwork
                            </StyledHeading>
                        }
                        summary={
                            <Box component="p">
                                This work considers migration and movements across long expanses of Country which are
                                significant for Tingari Dreaming Stories. Note the intricate lines, patterns, and
                                colour, which the artist has used to create the illusion of movement.
                            </Box>
                        }
                    />

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
                                The artist was born c. 1930 near Tjungimanta, Kiwirrkurra in the Northern Territory.
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
                                Learn more about{' '}
                                <a
                                    href="https://www.ngaanyatjarra.org.au/communities/kiwirrkurra/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Kiwirrkurra
                                </a>
                                .
                            </Box>

                            <StyledImage
                                src={MapImage}
                                alt="Stylised map of Australia with the south west region of Northern Territory highlighted, showing the location of Kiwirrkurra."
                                loading="lazy"
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
                </StyledAccordionGrid>
            </Grid>
        </Grid>
    );
};

Page.propTypes = {
    openDrawer: PropTypes.func.isRequired,
};

export default Page;
