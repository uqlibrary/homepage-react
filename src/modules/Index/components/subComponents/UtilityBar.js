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

const StyledWrapperDiv = styled('div')(() => ({
    position: 'relative',
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'flex-end', // actually the start, reversed because of flex-direction
    alignItems: 'center',
    paddingBlock: '32px',
}));

const StyledBookingLink = styled(Link)(({ theme }) => ({
    textDecorationColor: theme.palette.primary.light,
    fontSize: '16px',
    height: '30px',
    [theme.breakpoints.up('sm')]: {
        marginLeft: '32px',
    },
    '& span': {
        fontSize: '18px',
        fontWeight: 500,
        color: theme.palette.primary.light,
        display: 'block',
        paddingTop: '3.5px',
        whiteSpace: 'nowrap',
    },
}));
const StyledLocationOpenerButton = styled(Button)(({ theme }) => ({
    color: theme.palette.primary.light,
    [theme.breakpoints.up('uqDsMobile')]: {
        backgroundImage:
            // location/map icon
            "url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2218%22%20height%3D%2226%22%20viewBox%3D%220%200%2018%2026%22%20fill%3D%22none%22%3E%3Cg%20id%3D%22icon/location%22%3E%3Cpath%20d%3D%22M9.00047%205C10.8267%205%2012.3333%206.50685%2012.3333%208.33333C12.3333%2010.1598%2010.8267%2011.6667%209.00047%2011.6667C7.17426%2011.6667%205.66764%2010.1598%205.66764%208.33333C5.62198%206.50685%207.1286%205%209.00047%205Z%22%20stroke%3D%22%2351247A%22%20strokeWidth%3D%221.5%22%20strokeLinecap%3D%22round%22%20strokeLinejoin%3D%22round%22/%3E%3Cpath%20d%3D%22M9%201C13.4082%201%2017%204.59365%2017%209.00404C17%2012.6521%2011.6122%2021.7452%209.70748%2024.631C9.4898%2025.0121%208.94558%2025.121%208.61905%2024.8488C8.5102%2024.7943%208.45578%2024.7399%208.40136%2024.631C6.38775%2021.6907%201%2012.5977%201%209.00404C1%204.59365%204.59184%201%209%201Z%22%20stroke%3D%22%2351247A%22%20strokeWidth%3D%221.5%22%20strokeLinecap%3D%22round%22%20strokeLinejoin%3D%22round%22/%3E%3C/g%3E%3C/svg%3E')",
        paddingLeft: '26px', // 18px wide + 8px padding between icon and text
        backgroundSize: '18px 26px',
        backgroundPosition: 'left center',
        backgroundRepeat: 'no-repeat',
    },
    fontSize: '18px',
    fontWeight: 500,
    marginTop: 0,
    padding: 0,
    textDecoration: 'underline',
    textTransform: 'none',
    whiteSpace: 'nowrap',
    '&:hover': {
        backgroundColor: 'transparent',
        textDecoration: 'underline',
        WebkitTextDecoration: 'none',
    },
}));

const StyledLocationBox = styled(Box)(() => ({
    marginLeft: 0,
    opacity: 0,
}));

export const UtilityBar = ({ libHours, libHoursLoading, libHoursError, vemcount, vemcountLoading, vemcountError }) => {
    // handle the location opener
    const [locationOpen, setLocationOpen] = React.useState(false);
    const locationsRef = React.useRef(null);

    const showHideLocationPanel = () => {
        setLocationOpen(!locationOpen);

        const showHideButton = document.getElementById('location-dialog-controller');
        if (!!showHideButton) {
            const isOpen = showHideButton.ariaExpanded === 'true';
            showHideButton.ariaExpanded = isOpen ? 'false' : 'true'; // toggle the current value

            const locationsPanel = document.getElementById('locations-wrapper');
            !!locationsPanel && (locationsPanel.ariaHidden = isOpen ? 'true' : 'false');
            !!locationsPanel && (locationsPanel.ariaLive = isOpen ? 'off' : 'assertive');
        }
    };

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
                showHideLocationPanel();
            }
        };
        const closeOnEscape = e => {
            /* istanbul ignore else */
            if (isEscapeKeyPressed(e)) {
                showHideLocationPanel();
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

    const isLocationOpen = Boolean(locationOpen);

    useEffect(() => {
        const siteHeader = document.querySelector('uq-site-header');
        !!siteHeader && siteHeader.removeAttribute('secondleveltitle');
        !!siteHeader && siteHeader.removeAttribute('secondLevelUrl');
    }, []);

    // display as locations then booking link but code as booking then locations,
    // so they don't tab to the booking link after clicking the locations open
    return (
        <div style={{ borderBottom: '1px solid hsla(203, 50%, 30%, 0.15)' }}>
            <div className="layout-card" style={{ position: 'relative' }}>
                <StyledWrapperDiv>
                    <StyledBookingLink
                        href="https://uqbookit.uq.edu.au/#/app/booking-types/77b52dde-d704-4b6d-917e-e820f7df07cb"
                        data-testid="homepage-hours-bookit-link"
                    >
                        <span>Book a room</span>
                    </StyledBookingLink>
                    <StyledLocationOpenerButton
                        id="location-dialog-controller"
                        data-testid="hours-accordion-open"
                        onClick={showHideLocationPanel}
                        aria-haspopup="true"
                        aria-expanded={locationOpen ? 'true' : 'false'}
                        aria-controls="locations-wrapper"
                        aria-label="Show/hide Locations and hours panel"
                    >
                        <span id="location-dialog-controller-span">Locations and hours</span>
                        {!!locationOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </StyledLocationOpenerButton>
                </StyledWrapperDiv>
                <Fade in={!!isLocationOpen}>
                    <StyledLocationBox
                        id={'locations-wrapper'}
                        data-testid="locations-wrapper"
                        aria-labelledby="location-dialog-controller"
                        ref={locationsRef}
                        role={'dialog'}
                        aria-live="off"
                        aria-hidden="true"
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
