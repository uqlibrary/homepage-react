import React from 'react';
import PropTypes from 'prop-types';

import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import Paper from '@mui/material/Paper';

import wholeArtworkImage from './assets/images/UQRAP_Whole-Artwork-RGB.jpg';

const StyledHeading = styled('h1')(({ theme }) => ({
    marginTop: 0,
    marginBottom: 0,
    paddingTop: 0,
    paddingBottom: 0,
    fontSize: '1.875rem',
    fontStyle: 'normal',
    fontWeight: theme.typography.fontWeightHeavy,
    lineHeight: '120%',
    letterSpacing: '0.4px',
    color: '#fff',
    fontFamily: theme.typography.headingFontFamily,
}));

const StyledSubheading = styled('h2')(({ theme }) => ({
    fontSize: '1.125rem',
    fontWeight: theme.typography.fontWeightMedium,
    fontFamily: 'var(--art-trail-font-family)',
    lineHeight: '1.6',
    marginTop: '1rem',
}));

const Hero = ({ title, subtitle }) => {
    return (
        <Grid>
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 0,
                    overflow: 'hidden',
                    background: `linear-gradient(90deg, #41215e 35.5%, rgba(65, 33, 94, 0)), url(${wholeArtworkImage}) #d3d3d3 center / cover no-repeat`,
                    color: 'common.white',
                    p: { xs: 2, sm: 3, md: 4 },
                }}
            >
                <StyledHeading>{title}</StyledHeading>
                <StyledSubheading>{subtitle}</StyledSubheading>
            </Paper>
        </Grid>
    );
};

Hero.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
};

export default Hero;
