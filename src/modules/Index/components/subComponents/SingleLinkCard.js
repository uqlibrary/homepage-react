import React from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';

import UqArrowForwardIcon from 'modules/SharedComponents/Icons/UqArrowForwardIcon';

const StyledGridItem = styled(Grid)(({ theme }) => ({
    listStyleType: 'none',
    display: 'flex',
    alignItems: 'stretch',
    flex: 1,
    '& > div': {
        height: '100%',
        display: 'flex',
    },
    paddingLeft: '24px',
    marginBottom: '24px',
    [theme.breakpoints.up('uqDsDesktopXL')]: {
        paddingLeft: '32px',
        marginBottom: '32px',
    },
    [theme.breakpoints.down('uqDsTablet')]: {
        display: 'block',
        width: '100%',
    },
    '& .cardHeading': {
        color: '#19151c',
        fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
        fontSize: '24px',
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
    '& .iconWrapper': {
        width: '56px',
        height: '56px',
    },
    [theme.breakpoints.down('uqDsTablet')]: {
        '& .iconWrapper': {
            width: '40px',
            height: '40px',
        },
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        minWidth: '100%',
        '& p': {
            display: 'none',
        },
        '& svg.arrowForwardIcon': {
            // marginTop: 0,
            paddingLeft: '15px',
        },
        '& > *': {
            marginLeft: '24px',
        },
        '& h2': {
            margin: '0 0 0 16px',
            fontWeight: 500,
            // minWidth: '80%',
        },
        '& div': {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
    },
    '> *': {
        margin: '24px',
    },

    // on hover, tablet and up, the background changes colour, the link text underlines and the icon moves
    [theme.breakpoints.up('uqDsDesktop')]: {
        '& svg.arrowForwardIcon': {
            '@media (prefers-reduced-motion: no-preference)': {
                transition: 'margin-left 200ms ease-in-out',
            },
        },
        '&:hover': {
            '& .cardHeading': {
                textDecoration: 'underline',
            },
            '@media (prefers-reduced-motion: no-preference)': {
                backgroundColor: '#f3f3f4',
            },
            textDecoration: 'none',
            '& svg.arrowForwardIcon': {
                '@media (prefers-reduced-motion: no-preference)': {
                    marginLeft: '34px', // 24 + 10
                    transition: 'margin-left 200ms ease-in-out',
                },
            },
        },
    },
}));

const paneIcon = paneBackgroundImage => {
    return (
        <Box
            className={'iconWrapper'}
            sx={{
                backgroundImage: paneBackgroundImage,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
            }}
        />
    );
};

const SingleLinkCard = ({ cardHeading, landingUrl, iconBackgroundImage, shortParagraph, loggedIn }) => {
    return (
        <StyledGridItem item component={'li'} uqDsMobile={12} uqDsTablet={6} uqDsDesktop={4}>
            <div>
                <StyledLink border={1} p={1} to={landingUrl}>
                    <div>
                        {paneIcon(iconBackgroundImage)}
                        {!!loggedIn ? (
                            <h3 className={'cardHeading'}>{cardHeading}</h3>
                        ) : (
                            <h2 className={'cardHeading'}>{cardHeading}</h2>
                        )}
                        <p>{shortParagraph}</p>
                    </div>
                    <UqArrowForwardIcon />
                </StyledLink>
            </div>
        </StyledGridItem>
    );
};

SingleLinkCard.propTypes = {
    cardHeading: PropTypes.string,
    landingUrl: PropTypes.string,
    iconBackgroundImage: PropTypes.string,
    shortParagraph: PropTypes.string,
    loggedIn: PropTypes.bool,
};

export default SingleLinkCard;
