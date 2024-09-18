import React from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const StyledGridItem = styled(Grid)(() => ({
    listStyleType: 'none',
    // marginBottom: '60px',
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
    '@media (max-width: 899px)': {
        ' p': {
            display: 'none',
        },
        marginBottom: '24px',
        '& > div': {
            display: 'block',
            width: '100%',
        },
    },
    '& h2': {
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
    '& .icon': {
        width: '56px',
        height: '56px',
    },
    '@media (max-width: 899px)': {
        // marginBottom: '-58px',
        padding: '24px 24px 24px 0',

        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        '& svg[data-testid="ArrowForwardIcon"]': {
            marginTop: 0,
        },
        '& > div': {
            margin: '0 16px 0 24px',
        },
        '& > h2': { margin: 0 },
        // '& > p': { margin: 0 },
        '& > svg': { marginLeft: 'auto' },
        '& .icon': {
            width: '40px',
            height: '40px',
        },
    },

    // on hover, tablet and up, the background changes colour, the link text underlines and the icon moves
    '@media (min-width: 899px)': {
        '& svg[data-testid="ArrowForwardIcon"]': {
            '@media (prefers-reduced-motion: no-preference)': {
                transition: 'margin-left 200ms ease-in-out',
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
    },
}));

const paneIcon = paneBackgroundImage => {
    return (
        <Box
            className={'icon'}
            sx={{
                // color: '#51247A',
                // width: 100, // Set the width of the box
                // height: 56, // Set the height of the box
                backgroundImage: paneBackgroundImage,
                backgroundSize: 'contain', // Adjust the size of the background image
                backgroundRepeat: 'no-repeat', // Prevent the image from repeating
                backgroundPosition: 'center', // Center the image
            }}
        />
    );
};

const SingleLinkCard = ({ cardLabel, landingUrl, iconBackgroundImage, shortParagraph }) => {
    return (
        <StyledGridItem item component={'li'} xs={12} md={6} lg={4}>
            <div>
                <StyledLink border={1} p={1} to={landingUrl}>
                    {paneIcon(iconBackgroundImage)}
                    <h2>{cardLabel}</h2>
                    <p>{shortParagraph}</p>
                    <ArrowForwardIcon
                        // classname={'arrow'}
                        sx={{ color: '#51247A' }}
                    />
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
};

export default SingleLinkCard;
