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
        minWidth: '100%',
    },
    '& p': {
        color: theme.palette.secondary.main,
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
    color: theme.palette.primary.light,
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
    fontSize: '20px',
    fontWeight: 500,
    position: 'relative',
    '& .cardHeading': {
        color: '#19151c',
        fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
        fontSize: '24px',
        fontWeight: 500,
        letterSpacing: '0.16px',
        lineHeight: 1.2,
        marginBlock: '8px',
    },
    '& svg.arrowForwardIcon': {
        display: 'block',
    },
    '& .panelIcon': {
        width: '56px',
        height: '56px',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
    },
    [theme.breakpoints.up('uqDsTablet')]: {
        // tablet and above
        '& .panelBodyWrapper': {
            margin: '24px 24px 0 24px',
        },
        '& p': {
            marginTop: 0,
            marginBottom: 0,
        },
        '& .arrowSvgWrapper': {
            minHeight: '48px',
            marginTop: '24px',
        },
        '& svg.arrowForwardIcon': {
            position: 'absolute',
            bottom: '24px',
            left: '24px',
        },
    },
    [theme.breakpoints.down('uqDsTablet')]: {
        // mobile
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        minWidth: '90%',
        marginRight: '24px',
        padding: '24px',
        '& .panelIcon': {
            width: '40px',
            height: '40px',
            minWidth: '40px',
            minHeight: '40px',
        },
        '& p': {
            display: 'none',
        },
        '& svg.arrowForwardIcon': {
            paddingLeft: '15px',
        },
        '& .cardHeading': {
            fontWeight: 500,
            fontSize: '22px',
            marginLeft: '24px',
        },
        '& div': {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
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
                    marginLeft: '10px',
                    transition: 'margin-left 200ms ease-in-out',
                },
            },
        },
    },
}));

const paneIcon = paneBackgroundImage => {
    return (
        <Box
            className={'panelIcon'}
            sx={{
                backgroundImage: paneBackgroundImage,
            }}
        />
    );
};

const SingleLinkCard = ({ cardHeading, landingUrl, iconBackgroundImage, shortParagraph, loggedIn }) => {
    return (
        <StyledGridItem item component={'li'} xs={12} uqDsTablet={6} uqDsDesktop={4}>
            <div>
                <StyledLink border={1} p={1} to={landingUrl}>
                    <div className={'panelBodyWrapper'}>
                        {paneIcon(iconBackgroundImage)}
                        {!!loggedIn ? (
                            <h3 className={'cardHeading'}>{cardHeading}</h3>
                        ) : (
                            <h2 className={'cardHeading'}>{cardHeading}</h2>
                        )}
                        <p>{shortParagraph}</p>
                    </div>
                    <div className={'arrowSvgWrapper'}>
                        <UqArrowForwardIcon />
                    </div>
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
