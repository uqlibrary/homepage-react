import React from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';

import UqArrowForwardIcon from 'modules/SharedComponents/Icons/UqArrowForwardIcon';

const StyledGridItem = styled(Grid)(() => ({
    listStyleType: 'none',
    display: 'flex',
    alignItems: 'stretch',
    flex: 1,
    marginBottom: '32px',
    '@media (max-width: 74.95rem)': {
        paddingLeft: '24px',
        marginBottom: '24px',
    },
    paddingLeft: '32px',
    '& > div': {
        height: '100%',
        display: 'flex',
    },
    '@media (max-width: 847px)': {
        marginBottom: '24px',
    },
    '& .cardLabel': {
        color: '#19151c',
        fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
        fontSize: '20px',
        fontWeight: 500,
        letterSpacing: '0.16px',
        lineHeight: '1.6',
    },
    '& p': {
        color: '#3b383e',
        fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
        fontSize: '16px',
        fontWeight: 400,
        letterSpacing: '0.16px',
        lineHeight: '1.6',
    },
    '@media (min-width: 1024px)': {
        paddingLeft: '32px',
        marginBottom: '32px',
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
    '& svg.arrowForwardIcon': {
        display: 'block',
        marginTop: '24px',
    },
    '& .icon': {
        width: '56px',
        height: '56px',
    },
    '@media (max-width: 847px)': {
        '& .icon': {
            width: '40px',
            height: '40px',
        },
        '& > *': {
            marginLeft: '24px',
        },
    },
    '> *': {
        margin: '24px',
    },

    // on hover, tablet and up, the background changes colour, the link text underlines and the icon moves
    '@media (min-width: 848px)': {
        '& svg.arrowForwardIcon': {
            '@media (prefers-reduced-motion: no-preference)': {
                transition: 'margin-left 200ms ease-in-out',
            },
        },
        '&:hover': {
            '& .cardLabel': {
                textDecoration: 'underline',
            },
            '@media (prefers-reduced-motion: no-preference)': {
                backgroundColor: '#f3f3f4',
            },
            textDecoration: 'none',
            '& svg.arrowForwardIcon': {
                '@media (prefers-reduced-motion: no-preference)': {
                    marginLeft: '5px',
                    transition: 'margin-left 200ms ease-in-out',
                },
            },
        },
    },
}));

const paneIcon = paneBackgroundImage => {
    return (
        <Box
            className={'icon'}
            sx={{
                backgroundImage: paneBackgroundImage,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
            }}
        />
    );
};

const SingleLinkCard = ({ cardLabel, landingUrl, iconBackgroundImage, shortParagraph, loggedIn }) => {
    return (
        <StyledGridItem item component={'li'} xs={12} md={6} lg={4}>
            <div>
                <StyledLink border={1} p={1} to={landingUrl}>
                    {paneIcon(iconBackgroundImage)}
                    {!!loggedIn ? (
                        <h3 className={cardLabel}>{cardLabel}</h3>
                    ) : (
                        <h2 className={cardLabel}>{cardLabel}</h2>
                    )}
                    <p>{shortParagraph}</p>
                    <UqArrowForwardIcon />
                </StyledLink>
            </div>
        </StyledGridItem>
    );
};

SingleLinkCard.propTypes = {
    cardLabel: PropTypes.string,
    landingUrl: PropTypes.string,
    iconBackgroundImage: PropTypes.string,
    shortParagraph: PropTypes.string,
    loggedIn: PropTypes.bool,
};

export default SingleLinkCard;
