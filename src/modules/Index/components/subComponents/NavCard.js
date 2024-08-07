import React from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';

import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const StyledBox = styled(Box)(({ theme }) => ({
    borderColor: theme.palette.secondary.main,
    height: '100%',
    position: 'relative',
    cursor: 'pointer',
    '& h2': {
        marginTop: '10px',
    },
    a: {
        color: theme.palette.secondary.dark,
        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
        fontSize: '20px',
        fontWeight: 500,
        letterSpacing: '0.16px',
        '& svg': {
            display: 'block',
            // marginTop: '40px',
        },
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
                transition: 'margin-left 0.3s ease-in-out',
            },
        },
    },
    '& svg': {
        '@media (prefers-reduced-motion: no-preference)': {
            transition: 'margin-left 0.3s ease-in-out',
        },
        position: 'absolute',
        bottom: '15px',
        left: '20px',
    },
}));

const NavCard = ({ cardLabel, landingUrl, onWrappedChange }) => {
    const divRef = React.useRef(null);

    React.useEffect(() => {
        const checkHeight = () => {
            /* istanbul ignore else */
            if (divRef.current) {
                const height = divRef.current.getBoundingClientRect().height;
                const displayedTextGreaterThanOneLine = height > 30;
                onWrappedChange(displayedTextGreaterThanOneLine);
            }
        };

        // Initial check
        checkHeight();

        // listenfor resize, so the height can change dynamically
        window.addEventListener('resize', checkHeight);
        return () => {
            window.removeEventListener('resize', checkHeight);
        };
    }, [cardLabel, onWrappedChange]);
    return (
        <StyledBox border={1} p={2}>
            <h2>
                <Link to={landingUrl}>
                    <span ref={divRef}>{cardLabel}</span>
                    <ArrowForwardIcon />
                </Link>
            </h2>
        </StyledBox>
    );
};

NavCard.propTypes = {
    cardLabel: PropTypes.string,
    landingUrl: PropTypes.string,
    onWrappedChange: PropTypes.func,
};

export default NavCard;
