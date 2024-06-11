import React from 'react';
import PropTypes from 'prop-types';

import { Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';

const useStyles = makeStyles(theme => ({
    layoutCardOverwriter: {
        backgroundColor: '#4b2271',
        marginTop: -16,
    },
    uqHero__parent: {
        [theme.breakpoints.up('md')]: {
            minHeight: 336,
            flexDirection: 'row-reverse',
        },
    },
    uqHero__wrapper: {
        marginTop: '1em',
        [theme.breakpoints.up('md')]: {
            marginRight: '-5em',
            position: 'relative',
            display: 'flex',
            justifyContent: 'flex-end',
        },
    },
    uqHero__content: {
        backgroundColor: '#51247a',
        [theme.breakpoints.up('md')]: {
            boxShadow: 'rgba(24, 24, 24, 0.1) 0px 3px',
            marginTop: 50,
            borderTop: '1px solid #333',
            borderBottom: '4px solid #333',
            maxWidth: 586,
        },
        padding: 32,
    },
    uqHero__title: {
        color: '#fff',
        fontFamily: 'Montserrat, Helvetica, Arial, sans-serif',
        fontSize: 32,
        letterSpacing: '.01rem',
    },
    uqHero__description: {
        color: '#fff',
        letterSpacing: '.01rem',
        lineHeight: 1.6,
        fontSize: 18,
        marginTop: 16,
    },
    uqHero__image: {
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        overflow: 'hidden' /* Ensure nothing spills outside the div */,
        [theme.breakpoints.down('md')]: {
            minHeight: 300,
        },
        width: '100%', // 900 x 600
        height: '100%',
    },
}));

const HeroCard = ({ heroTitle, heroDescription, heroBackgroundImage }) => {
    const classes = useStyles();

    return (
        <div className={classes.layoutCardOverwriter}>
            <Grid container className={classes.uqHero__parent} direction={{ xs: 'column', md: 'row' }}>
                <Grid item xs={12} md={6}>
                    <div
                        className={classes.uqHero__image}
                        style={{ backgroundImage: `url(${heroBackgroundImage})` }}
                        data-testid="hero-card-image"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <div className={classes.uqHero__wrapper}>
                        <div className={classes.uqHero__content}>
                            <Typography
                                component={'h1'}
                                variant={'h1'}
                                className={classes.uqHero__title}
                                data-testid="hero-card-title"
                            >
                                {heroTitle}
                            </Typography>
                            <Typography
                                component={'p'}
                                className={classes.uqHero__description}
                                data-testid="hero-card-description"
                            >
                                {heroDescription}
                            </Typography>
                        </div>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};

HeroCard.propTypes = {
    heroTitle: PropTypes.string,
    heroDescription: PropTypes.string,
    heroBackgroundImage: PropTypes.string,
};

export default HeroCard;
