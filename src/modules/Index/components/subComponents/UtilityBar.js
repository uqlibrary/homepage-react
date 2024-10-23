/* eslint max-len: 0 */
import React, { useEffect } from 'react';
import { lazy } from 'react';
import { PropTypes } from 'prop-types';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { isEscapeKeyPressed, lazyRetry } from 'helpers/general';

const Locations = lazy(() => lazyRetry(() => import('./Locations')));

const StyledBookingLink = styled(Link)(({ theme }) => ({
    color: 'black',
    fontWeight: 400,
    textDecorationColor: theme.palette.primary.light,
    '& span': {
        color: theme.palette.primary.light,
        display: 'block',
        paddingTop: '13px',
    },
}));

const StyledLocationBox = styled(Box)(({ theme }) => ({
    marginLeft: 0,
}));

const StyledButtonWrapperDiv = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row-reverse',

    '& button': {
        color: theme.palette.primary.light,
        fontSize: '16px',
        marginTop: '6px',
        textDecoration: 'underline',
        textTransform: 'none',
        '&:hover': {
            backgroundColor: 'transparent',
            textDecoration: 'underline',
            '-webkit-text-decoration': 'none',
        },
    },
    '& a': {
        fontSize: '16px',
        height: '40px',
        paddingBlock: '6px',
        marginLeft: '32px',
    },
}));

export const UtilityBar = ({ libHours, libHoursLoading, libHoursError }) => {
    // handle the location opener
    const [locationOpen, setLocationOpen] = React.useState(false);
    const locationsRef = React.useRef(null);
    const closeOnClickOutsideDialog = e => {
        if (locationsRef.current && !locationsRef.current.contains(e.target)) {
            setLocationOpen(false);
        }
    };
    const closeOnEscape = e => {
        if (isEscapeKeyPressed(e)) {
            setLocationOpen(false);
        }
    };
    const handleLocationOpenerClick = () => {
        const showLocation = setInterval(() => {
            setLocationOpen(!locationOpen);

            const locationButton = document.getElementById('location-dialog-controller');
            !!locationButton && (locationButton.ariaExpanded = !locationOpen);

            if (!locationOpen) {
                document.addEventListener('mousedown', closeOnClickOutsideDialog);
                document.addEventListener('keydown', closeOnEscape);
            } else {
                document.removeEventListener('mousedown', closeOnClickOutsideDialog);
                document.removeEventListener('keydown', closeOnEscape);
            }

            clearInterval(showLocation);
        }, 10);
        return () => {
            document.removeEventListener('mousedown', closeOnClickOutsideDialog);
            document.removeEventListener('keydown', closeOnEscape);
        };
    };
    const isLocationOpen = Boolean(locationOpen);

    useEffect(() => {
        const siteHeader = document.querySelector('uq-site-header');
        !!siteHeader && siteHeader.removeAttribute('secondleveltitle');
        !!siteHeader && siteHeader.removeAttribute('secondLevelUrl');
    }, []);

    return (
        <div style={{ borderBottom: '1px solid hsla(203, 50%, 30%, 0.15)' }}>
            <div className="layout-card" style={{ position: 'relative' }}>
                <StyledButtonWrapperDiv style={{ position: 'relative' }}>
                    <StyledBookingLink
                        href="https://uqbookit.uq.edu.au/#/app/booking-types/77b52dde-d704-4b6d-917e-e820f7df07cb"
                        data-testid="homepage-hours-bookit-link"
                    >
                        <span>Book a room</span>
                    </StyledBookingLink>
                    <Button
                        id="location-dialog-controller"
                        data-testid="hours-accordion-open"
                        onClick={handleLocationOpenerClick}
                        aria-haspopup="true"
                        aria-expanded="false"
                        aria-controls="locations-wrapper"
                    >
                        Library locations
                        {!!locationOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </Button>
                </StyledButtonWrapperDiv>
                <Fade in={!!isLocationOpen}>
                    <StyledLocationBox
                        id={'locations-wrapper'}
                        aria-labelledby="location-dialog-controller"
                        ref={locationsRef}
                        role={'dialog'}
                    >
                        <Locations
                            libHours={libHours}
                            libHoursLoading={libHoursLoading}
                            libHoursError={libHoursError}
                        />
                    </StyledLocationBox>
                </Fade>
            </div>
        </div>
    );
};

UtilityBar.propTypes = {
    libHours: PropTypes.object,
    libHoursLoading: PropTypes.bool,
    libHoursError: PropTypes.bool,
};

export default UtilityBar;
