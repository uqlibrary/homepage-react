import React from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const StyledBox = styled(Box)(({ theme }) => ({
    borderColor: 'hsla(203, 50%, 30%, 0.15)',
    borderRadius: '4px',
    background: '#FFFFFF',
    boxShadow: 'rgba(0, 0, 0, 0.10) 0 1px 3px 0',
    height: '100%',
    position: 'relative',
    cursor: 'pointer',
    h2: {
        marginTop: '5px',
    },
    a: {
        color: theme.palette.secondary.dark,
        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
        fontSize: '20px',
        fontWeight: 500,
        padding: '24px 24px 24px 8px',
        '& svg': {
            display: 'block',
        },
    },
    '& svg': {
        '@media (prefers-reduced-motion: no-preference)': {
            transition: 'margin-left 200ms ease-in-out',
        },
        position: 'absolute',
        bottom: '16px',
        left: '24px',
    },
    '&:hover': {
        '@media (prefers-reduced-motion: no-preference)': {
            backgroundColor: '#f3f3f4',
        },
        '& a': {
            textDecoration: 'underline',
        },
        '& svg': {
            '@media (prefers-reduced-motion: no-preference)': {
                marginLeft: '5px',
                transition: 'margin-left 200ms ease-in-out',
            },
        },
    },
}));

const NavCard = ({ cardLabel, landingUrl }) => {
    return (
        <Grid item component="li" xs={12} md={6} lg={4}>
            <StyledBox border={1} p={2}>
                <h2>
                    <Link to={landingUrl}>
                        <span>{cardLabel}</span>
                        <ArrowForwardIcon sx={{ color: '#51247A' }} />
                    </Link>
                </h2>
            </StyledBox>
        </Grid>
    );
};

NavCard.propTypes = {
    cardLabel: PropTypes.string,
    landingUrl: PropTypes.string,
};

export default NavCard;
