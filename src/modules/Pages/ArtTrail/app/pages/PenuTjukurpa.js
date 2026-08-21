import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Unstable_Grid2';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';

import ArtworkImage from '../../../../../../public/images/artTrail/artwork/Burton_2016_03_crop-scaled.jpg';

import Hero from '../Hero';
import {
    StyledHeading,
    StyledAccordionGrid,
    StyledDrawerHeader,
    StyledTrailImage,
    StyledUl,
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
    const [isExpanded, setIsExpanded] = React.useState(false);
    const expandedContentId = React.useId();
    const collapsedInlineButton = (
        <Button
            type="button"
            variant="text"
            onClick={() => setIsExpanded(true)}
            aria-expanded={false}
            aria-controls={expandedContentId}
            endIcon={
                <ExpandMoreIcon
                    sx={{
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                    }}
                />
            }
            sx={{
                px: 0,
                pt: 1.5,
                pb: 0,
                ml: 0,
                verticalAlign: 'baseline',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 400,
                lineHeight: 1.5,
                color: 'primary.main',
                textDecoration: 'underline',
                textUnderlineOffset: '0.14em',
                '&:hover': {
                    textDecoration: 'underline',
                    backgroundColor: 'transparent',
                },
                textAlign: 'center',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 70%)',
            }}
        >
            View more
        </Button>
    );
    const toggleButton = (
        <Button
            type="button"
            onClick={() => setIsExpanded(currentState => !currentState)}
            aria-expanded={isExpanded}
            aria-controls={expandedContentId}
            endIcon={
                <ExpandMoreIcon
                    sx={{
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                    }}
                />
            }
            sx={{
                px: 0,
                py: 0,
                width: '100%',
                minWidth: 0,
                justifyContent: 'center',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 400,
                lineHeight: 1.5,
                color: 'primary.main',
                textDecoration: 'underline',
                textUnderlineOffset: '0.14em',
                '&:hover': {
                    textDecoration: 'underline',
                    backgroundColor: 'transparent',
                },
                '& .MuiButton-endIcon': {
                    ml: 0.25,
                },
                backgroundColor: 'white',
            }}
        >
            {isExpanded ? 'View less' : 'View more'}
        </Button>
    );

    return (
        <Grid container direction="column" rowSpacing={2.5}>
            <Hero
                title="'Punu Tjukurpa' 2013, Hector Tijupuru Burton, Ray Ken, Mick Wikilyiri, Brenton Ken"
                sx={{ pb: 0 }}
                data-testid="pageHero"
            />
            <Grid container direction="column" data-testid="pageContent" pt={0}>
                <Grid>
                    <Box position="relative">
                        <StyledTrailImage
                            src={ArtworkImage}
                            alt="'Punu Tjukurpa' 2013, Hector Tijupuru Burton, Ray Ken, Mick Wikilyiri, Brenton Ken"
                            intrinsicWidth={2548}
                            intrinsicHeight={2532}
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
                    <Box>
                        <StyledHeading variant="h6" component="h3">
                            About the artwork
                        </StyledHeading>
                        <Box sx={{ position: 'relative' }}>
                            <p>
                                This work was created by senior men from the Men's Painting Room. Their work celebrates
                                their memories of Country, family history and Tjukurpa (the creation story for the Amata
                                region). The group have used the motif of the trees of their Country to represent
                                family, community, and their relationship to the land.
                                {!isExpanded && collapsedInlineButton}
                            </p>
                        </Box>
                        {isExpanded ? (
                            <Box id={expandedContentId}>
                                <p>
                                    For Anangu communities, the tree is a significant motif for ancestry and family. It
                                    is different to the way non-Indigenous families might think about a 'family tree',
                                    which usually depicts their ancestors at the top of the tree, amongst the leaves.
                                </p>
                                <p>
                                    In the Anangu way, as you can see in this work, Punu Tjukurpa, the Ancestors are
                                    roots, which we see spreading deep across the bottom of the painting. The artists
                                    and Elders who share knowledge are the trunk, in the centre, and the children and
                                    future generations are at the top, represented by the young yellow and green
                                    sprouting leaves, yet to grow.
                                </p>
                                <p>
                                    Through this shared storytelling, Punu Tjukurpa creates a conduit between deep
                                    ancestral roots and future generations.
                                </p>
                                <StyledHeading variant="h6" component="h3">
                                    Reflect
                                </StyledHeading>
                                <p>Take a few minutes to look closely at all the detail in this painting.</p>
                                <StyledUl>
                                    <li>
                                        What different shapes and patterns can you see branching off from the central
                                        shape?
                                    </li>
                                    <li>Which parts are your eyes most drawn to? Why do they stand out?</li>
                                </StyledUl>
                                <StyledHeading variant="h6" component="h3">
                                    About the artists
                                </StyledHeading>
                                <p>
                                    <strong>Hector Tjupuru Burton</strong> (c. 1937—2017) is a senior Pitjantjatjara law
                                    man. He was born near Pukatja (Ernabella) in South Australia. He encouraged other
                                    senior men to join him in forming a Men’s Painting Room. The painting room provided
                                    artists with an opportunity to record their sacred stories, inspired by ancestors of
                                    the Musgrave Ranges that rise above the Amata region.
                                </p>
                                <p>
                                    <strong>Ray Ken</strong> (c. 1940—2018) was born near Indulkana in South Australia.
                                    He belongs to the Pitjantjatjara/Yankunytjatjara people.
                                </p>
                                <p>
                                    <strong>Mick Wikilyiri</strong> (c. 1940—) was born in Amata, South Australia and is
                                    a Pitjantjatjara man.
                                </p>
                                <p>
                                    <strong>Brenton Ken</strong> (c.1944—2018) was born in South Australia and belongs
                                    to the Pitjantjatjara/Yankunytjatjara people.
                                </p>
                                <StyledHeading variant="h6" component="h3">
                                    Connection to Country
                                </StyledHeading>
                                <p>
                                    Learn more about <strong>Ngaanyatjarra Pitjantjatjara Yankunytjatjara</strong>{' '}
                                    Lands.
                                </p>
                                <iframe
                                    title="Ngaanyatjarra Pitjantjatjara Yankunytjatjara image hotspot"
                                    src="https://uq.h5p.com/content/1292937845127577289/embed"
                                    aria-label="Indigenous art and Library discovery trail - Punu Tjukurpa 2013"
                                    width="1090"
                                    frameBorder="0"
                                    allowFullScreen
                                    allow="autoplay *; geolocation *; microphone *; camera *; midi *; encrypted-media *"
                                    style={{ width: '100%', height: 'auto', aspectRatio: '1090/1033' }}
                                />
                            </Box>
                        ) : null}
                        {isExpanded ? <Box sx={{ mt: 0.25 }}>{toggleButton}</Box> : null}
                    </Box>
                </StyledAccordionGrid>
            </Grid>
        </Grid>
    );
};

Page.propTypes = {
    openDrawer: PropTypes.func.isRequired,
};

export default Page;
