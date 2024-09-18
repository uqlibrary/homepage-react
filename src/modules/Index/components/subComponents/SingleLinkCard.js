import React from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';

import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

const StyledGridItem = styled(Grid)(({ theme }) => ({
    listStyleType: 'none',
    marginBottom: '60px',
    '@media (min-width: 56em)': {
        // height: '6em',
        paddingTop: '24px !important',
    },
    '@media (max-width: 74.95rem)': {
        paddingLeft: '24px !important',
        // marginBottom: '51px',
    },
    '@media (max-width: 56em)': {
        paddingTop: '24px !important',
        // marginBottom: '60px',
    },
    paddingLeft: '16px',
    '& div': {
        padding: theme.spacing(2),
        height: '100%', // Ensure the item takes full height
        display: 'flex', // Make the item a flex container
        flexDirection: 'column', // Align children vertically
        justifyContent: 'center', // Center children vertically
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
    '& svg[data-testid="ArrowForwardIcon"]': {
        display: 'block',
        marginTop: '24px',
    },
    '@media (max-width: 56em)': {
        // marginBottom: '-58px',
        padding: '24px',

        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        '& svg[data-testid="ArrowForwardIcon"]': {
            marginTop: 0,
        },
    },

    // on hover, the background changes colour, the link text underlines and the icon moves
    '@media (min-width: 56em)': {
        '& svg[data-testid="ArrowForwardIcon"]': {
            '@media (prefers-reduced-motion: no-preference)': {
                transition: 'margin-left 200ms ease-in-out',
            },
        },
    },
    '&:hover': {
        '& h2': {
            textDecoration: 'underline',
        },
        '@media (prefers-reduced-motion: no-preference)': {
            backgroundColor: '#f3f3f4',
        },
        textDecoration: 'none',
        '& svg[data-testid="ArrowForwardIcon"]': {
            '@media (prefers-reduced-motion: no-preference)': {
                marginLeft: '5px',
                transition: 'margin-left 200ms ease-in-out',
            },
        },
    },
}));

const SingleLinkCard = ({ cardLabel, landingUrl }) => {
    return (
        <StyledGridItem item component="li" xs={12} md={6} lg={4}>
            <div>
                <StyledLink border={1} p={1} to={landingUrl}>
                    <QuestionMarkIcon />
                    <h2>{cardLabel}</h2>
                    <p>a short paragraph that describes the area</p>
                    <ArrowForwardIcon classname={'arrow'} sx={{ color: '#51247A' }} />
                </StyledLink>
            </div>
        </StyledGridItem>
    );
};

SingleLinkCard.propTypes = {
    cardLabel: PropTypes.string,
    landingUrl: PropTypes.string,
};

export default SingleLinkCard;
