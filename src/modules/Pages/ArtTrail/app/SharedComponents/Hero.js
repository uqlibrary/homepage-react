import React from 'react';
import PropTypes from 'prop-types';

import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';

import { getArtworkPoiById } from '../config/mapPois';
import { stripHtml } from '../utils/mapUtils';
import AriaAnnounce from './AriaAnnounce';
import wholeArtworkImage from '../../../../../../public/images/artTrail/UQRAP_River-Artwork-RGB.jpg';

const StyledHeading = styled('h1')(({ theme }) => ({
    marginTop: 0,
    marginBottom: '1rem',
    paddingTop: 0,
    paddingBottom: 0,
    fontSize: '1.875rem',
    fontStyle: 'normal',
    fontWeight: theme.typography.artTrail.fontWeightHeavy,
    lineHeight: '120%',
    letterSpacing: '0.4px',
    color: '#fff',
    fontFamily: theme.typography.artTrail.headingFontFamily,
}));

const StyledSubheading = styled('div')(({ theme }) => ({
    fontSize: '1.125rem',
    fontWeight: theme.typography.fontWeightMedium,
    lineHeight: 1.5,
    fontFamily: theme.typography.artTrail.bodyFontFamily,
}));

const Hero = ({ id, title, subtitle, sx }) => {
    const _titleText = title || getArtworkPoiById(id)?.tableLinkText;
    const cleanTitle = stripHtml(_titleText);
    return (
        <Grid sx={sx}>
            <AriaAnnounce message={cleanTitle} />
            <Box
                data-testid="pageHero"
                sx={{
                    borderRadius: 0,
                    overflow: 'hidden',
                    background: `linear-gradient(90deg, #41215e 35.5%, rgba(65, 33, 94, 0.5)), url(${wholeArtworkImage}) #d3d3d3 center / cover no-repeat`,
                    color: 'common.white',
                    p: { xs: 2, sm: 3, md: 4 },
                    minHeight: { xs: 180, sm: 240, md: 340 },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
            >
                <StyledHeading tabIndex={-1} dangerouslySetInnerHTML={{ __html: _titleText }} />
                {subtitle && <StyledSubheading>{subtitle}</StyledSubheading>}
            </Box>
        </Grid>
    );
};

Hero.propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    sx: PropTypes.object,
};

export default Hero;
