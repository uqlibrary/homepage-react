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
    textDecorationColor: theme.palette.primary.light,
    '& span': {
        fontSize: '18px',
        fontWeight: 500,
        color: theme.palette.primary.light,
        display: 'block',
        paddingTop: '13px',
        whiteSpace: 'nowrap',
    },
}));

const StyledLocationBox = styled(Box)(() => ({
    marginLeft: 0,
    opacity: 0,
}));

const StyledButtonWrapperDiv = styled('div')(({ theme }) => ({
    // display as locations then booking link but code as booking then locations,
    // so they don't tab to the booking link after clicking the locations open
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row-reverse',

    '& button': {
        color: theme.palette.primary.light,
        fontSize: '18px',
        fontWeight: 500,
        marginTop: '6px',
        textDecoration: 'underline',
        textTransform: 'none',
        whiteSpace: 'nowrap',
        '&:hover': {
            backgroundColor: 'transparent',
            textDecoration: 'underline',
            WebkitTextDecoration: 'none',
        },
    },
    '& a': {
        fontSize: '16px',
        height: '40px',
        paddingBlock: '32px',
        marginLeft: '32px',
    },
}));

const UqDsLocationIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="26" viewBox="0 0 18 26" fill="none">
        <g id="icon/location">
            <path
                d="M9.00047 5C10.8267 5 12.3333 6.50685 12.3333 8.33333C12.3333 10.1598 10.8267 11.6667 9.00047 11.6667C7.17426 11.6667 5.66764 10.1598 5.66764 8.33333C5.62198 6.50685 7.1286 5 9.00047 5Z"
                stroke="#51247A"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M9 1C13.4082 1 17 4.59365 17 9.00404C17 12.6521 11.6122 21.7452 9.70748 24.631C9.4898 25.0121 8.94558 25.121 8.61905 24.8488C8.5102 24.7943 8.45578 24.7399 8.40136 24.631C6.38775 21.6907 1 12.5977 1 9.00404C1 4.59365 4.59184 1 9 1Z"
                stroke="#51247A"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </g>
    </svg>
);

export const UtilityBar = ({ libHours, libHoursLoading, libHoursError, vemcount, vemcountLoading, vemcountError }) => {
    // handle the location opener
    const [locationOpen, setLocationOpen] = React.useState(false);
    const locationsRef = React.useRef(null);

    // UseEffect to listen to when the state of locationOpen changes. Mitigates delay checks, etc.
    useEffect(() => {
        const closeOnClickOutsideDialog = e => {
            // Extra condition added to not include the label the opens or closes the hours - because it already has one - no need to fire twice.
            if (
                locationOpen &&
                locationsRef.current &&
                !locationsRef.current.contains(e.target) &&
                !((e.target?.id || 'NONE') === 'location-dialog-controller-span')
            ) {
                setLocationOpen(false);
            }
        };
        const closeOnEscape = e => {
            /* istanbul ignore else */
            if (isEscapeKeyPressed(e)) {
                setLocationOpen(false);
            }
        };

        if (locationOpen) {
            document.addEventListener('mousedown', closeOnClickOutsideDialog);
            document.addEventListener('keydown', closeOnEscape);
        } else {
            document.removeEventListener('mousedown', closeOnClickOutsideDialog);
            document.removeEventListener('keydown', closeOnEscape);
        }

        return () => {
            document.removeEventListener('mousedown', closeOnClickOutsideDialog);
            document.removeEventListener('keydown', closeOnEscape);
        };
    }, [locationOpen]);

    const handleLocationOpenerClick = () => {
        setLocationOpen(!locationOpen);
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
                        {UqDsLocationIcon}
                        <span id="location-dialog-controller-span" style={{ paddingLeft: '16px' }}>
                            Locations and hours
                        </span>
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
                            vemcount={vemcount}
                            vemcountLoading={vemcountLoading}
                            vemcountError={vemcountError}
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
    vemcount: PropTypes.object,
    vemcountLoading: PropTypes.bool,
    vemcountError: PropTypes.bool,
};

export default UtilityBar;
