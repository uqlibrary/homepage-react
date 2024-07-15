import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const StyledHeroImage = styled(Box)(({ theme }) => ({
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    overflow: 'hidden' /* Ensure nothing spills outside the div */,
    [theme.breakpoints.down('md')]: {
        minHeight: '300px',
    },
    width: '100%', // 900 x 600
    height: '100%',
}));
const StyledHeroWrapper = styled(Box)(({ theme }) => ({
    marginTop: '1em',
    [theme.breakpoints.up('md')]: {
        marginRight: '-5em',
        position: 'relative',
        display: 'flex',
        justifyContent: 'flex-end',
    },
}));
const StyledHeroContent = styled(Box)(({ theme }) => ({
    backgroundColor: '#51247a',
    [theme.breakpoints.up('md')]: {
        boxShadow: 'rgba(24, 24, 24, 0.1) 0px 3px',
        marginTop: '50px',
        borderTop: '1px solid #333',
        borderBottom: '4px solid #333',
        maxWidth: '586px',
    },
    padding: '32px',
}));
const StyledHeroParent = styled(Grid)(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        minHeight: '336px',
        flexDirection: 'row-reverse',
    },
}));

const HeroCard = ({ heroTitle, heroDescription, heroBackgroundImage }) => {
    return (
        <Box
            sx={{
                backgroundColor: '#4b2271',
                marginTop: '-16px',
            }}
        >
            <StyledHeroParent container direction={{ xs: 'column', md: 'row' }}>
                <Grid item xs={12} md={6}>
                    <StyledHeroImage
                        sx={{ backgroundImage: `url(${heroBackgroundImage})` }}
                        data-testid="hero-card-image"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <StyledHeroWrapper>
                        <StyledHeroContent>
                            <Typography
                                component={'h1'}
                                variant={'h1'}
                                data-testid="hero-card-title"
                                sx={{
                                    color: '#fff',
                                    fontFamily: 'Montserrat, Helvetica, Arial, sans-serif',
                                    fontSize: 32,
                                    letterSpacing: '.01rem',
                                }}
                            >
                                {heroTitle}
                            </Typography>
                            <Typography
                                component={'p'}
                                data-testid="hero-card-description"
                                sx={{
                                    color: '#fff',
                                    letterSpacing: '.01rem',
                                    lineHeight: 1.6,
                                    fontSize: 18,
                                    marginTop: '16px',
                                }}
                            >
                                {heroDescription}
                            </Typography>
                        </StyledHeroContent>
                    </StyledHeroWrapper>
                </Grid>
            </StyledHeroParent>
        </Box>
    );
};

HeroCard.propTypes = {
    heroTitle: PropTypes.string,
    heroDescription: PropTypes.string,
    heroBackgroundImage: PropTypes.string,
};

export default HeroCard;
