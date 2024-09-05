import React from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';

import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const StyledGridItem = styled(Grid)(() => ({
    listStyleType: 'none',
    marginBottom: '60px',
    '@media (min-width: 56em)': {
        height: '6em',
        paddingTop: '24px !important',
    },
    '@media (max-width: 74.95rem)': {
        paddingLeft: '24px !important',
        marginBottom: '51px',
    },
    '@media (max-width: 56em)': {
        paddingTop: '24px !important',
        marginBottom: '60px',
    },
}));
const StyledLink = styled(Link)(({ theme }) => ({
    border: '1px solid hsla(203, 50%, 30%, 0.15)',
    borderRadius: '4px',
    background: '#FFFFFF',
    boxShadow: 'rgba(0, 0, 0, 0.10) 0 1px 3px 0',
    display: 'block',
    cursor: 'pointer',
    color: theme.palette.secondary.dark,
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
    fontSize: '20px',
    fontWeight: 500,
    padding: '24px',
    '& svg': {
        display: 'block',
        marginTop: '24px',
    },
    '@media (max-width: 56em)': {
        marginBottom: '-58px',
        padding: '24px',

        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        '& svg': {
            marginTop: 0,
        },
    },

    // on hover, the background changes colour, the link text underlines and the icon moves
    '@media (min-width: 56em)': {
        '& svg': {
            '@media (prefers-reduced-motion: no-preference)': {
                transition: 'margin-left 200ms ease-in-out',
            },
        },
    },
    '&:hover': {
        '@media (prefers-reduced-motion: no-preference)': {
            backgroundColor: '#f3f3f4',
        },
        textDecoration: 'underline',
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
        <StyledGridItem item component="li" xs={12} md={6} lg={4}>
            <StyledLink border={1} p={1} to={landingUrl}>
                <span>{cardLabel}</span>
                <ArrowForwardIcon sx={{ color: '#51247A' }} />
            </StyledLink>
        </StyledGridItem>
    );
};

NavCard.propTypes = {
    cardLabel: PropTypes.string,
    landingUrl: PropTypes.string,
};

export default NavCard;
