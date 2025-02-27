/* eslint max-len: 0 */
import React, { lazy, useEffect } from 'react';
import { PropTypes } from 'prop-types';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';

import { addClass, isEscapeKeyPressed, lazyRetry, removeClass } from 'helpers/general';

const Locations = lazy(() => lazyRetry(() => import('./Locations')));

const StyledWrapperDiv = styled('div')(() => ({
    position: 'relative',
    '&.layout-card': {
        '& .locations-wrapper': {
            opacity: 0,
        },
        '& .locations-wrapper.locations-wrapper-open': {
            opacity: 1,
        },
    },
}));

const StyledButtonAreaDiv = styled('div')(({ theme }) => ({
    position: 'relative',
    display: 'flex',
    flexWrap: 'wrap',
    [theme.breakpoints.up('uqDsMobile')]: {
        gap: '32px',
    },
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBlock: '32px',
}));

const StyledBookingLink = styled(Link)(({ theme }) => ({
    textDecorationColor: theme.palette.primary.light,
    fontSize: '16px',
    height: '30px',
    '&:hover': {
        textDecorationColor: 'white',
    },
    '& span': {
        fontSize: '18px',
        fontWeight: 500,
        color: theme.palette.primary.light,
        display: 'block',
        marginTop: '4px',
        whiteSpace: 'nowrap',
    },
    '&:hover span': {
        backgroundColor: theme.palette.primary.light,
        color: 'white',
    },
}));
const StyledLocationOpenerButton = styled(Button)(({ theme }) => ({
    backgroundColor: 'transparent !important',
    color: theme.palette.primary.light,
    [theme.breakpoints.up('uqDsTablet')]: {
        backgroundImage:
            // location/map icon
            "url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2218%22%20height%3D%2226%22%20viewBox%3D%220%200%2018%2026%22%20fill%3D%22none%22%3E%3Cg%20id%3D%22icon/location%22%3E%3Cpath%20d%3D%22M9.00047%205C10.8267%205%2012.3333%206.50685%2012.3333%208.33333C12.3333%2010.1598%2010.8267%2011.6667%209.00047%2011.6667C7.17426%2011.6667%205.66764%2010.1598%205.66764%208.33333C5.62198%206.50685%207.1286%205%209.00047%205Z%22%20stroke%3D%22%2351247A%22%20strokeWidth%3D%221.5%22%20strokeLinecap%3D%22round%22%20strokeLinejoin%3D%22round%22/%3E%3Cpath%20d%3D%22M9%201C13.4082%201%2017%204.59365%2017%209.00404C17%2012.6521%2011.6122%2021.7452%209.70748%2024.631C9.4898%2025.0121%208.94558%2025.121%208.61905%2024.8488C8.5102%2024.7943%208.45578%2024.7399%208.40136%2024.631C6.38775%2021.6907%201%2012.5977%201%209.00404C1%204.59365%204.59184%201%209%201Z%22%20stroke%3D%22%2351247A%22%20strokeWidth%3D%221.5%22%20strokeLinecap%3D%22round%22%20strokeLinejoin%3D%22round%22/%3E%3C/g%3E%3C/svg%3E')",
        backgroundPosition: 'left center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '18px 26px',
        paddingLeft: '26px', // 18px wide + 8px padding between icon and text
    },
    '&.panel-closed::after': {
        backgroundImage:
            // expand more icon
            "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z%22/%3E%3C/svg%3E')",
    },
    '&.panel-open::after': {
        backgroundImage:
            // expand less icon
            "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22m12 8-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z%22/%3E%3C/svg%3E')",
    },
    '&::after': {
        backgroundPosition: 'right center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '18px 26px',
        content: '""',
        display: 'inline-block',
        width: '24px',
        height: '24px',
    },
    fontSize: '18px',
    fontWeight: 500,
    marginTop: 0,
    padding: 0,
    textTransform: 'none',
    whiteSpace: 'nowrap',
    border: '2px solid white', // prefill space for tabbing through
    '& .MuiTouchRipple-root': {
        display: 'none', // remove mui ripple
    },
    '& span': {
        textDecoration: 'underline',
        lineHeight: 'normal',
        outlineOffset: '1px',
        outlineStyle: 'auto',
        outlineWidth: '1px',
        outlineColor: 'transparent',
    },
    '&:hover span': {
        backgroundColor: theme.palette.primary.light,
        color: 'white',
    },
    '&.panel-open span': {
        backgroundColor: theme.palette.primary.light,
        color: 'white',
    },
    '&:focus-within span': {
        backgroundColor: theme.palette.primary.light,
    },
    '&.panel-open:focus-within span': {
        backgroundColor: theme.palette.primary.light,
        color: 'white',
    },
    '&.panel-closed:focus-within span': {
        backgroundColor: 'white',
        color: theme.palette.primary.light,
    },
    '&.panel-closed:focus-within:hover span': {
        backgroundColor: theme.palette.primary.light,
        color: 'white',
    },
    '&.panel-closed:focus-visible span': {
        outlineColor: '-webkit-focus-ring-color',
    },
}));

const StyledLocationBox = styled(Box)(() => ({
    marginLeft: 0,
}));

export const UtilityBar = ({ libHours, libHoursLoading, libHoursError, vemcount, vemcountLoading, vemcountError }) => {
    // handle the location opener
    const [locationOpen, setLocationOpen] = React.useState(null);
    const locationsRef = React.useRef(null);

    function setLocationPanelAsClosed() {
        const locationsPanel = document.getElementById('locations-wrapper');
        !!locationsPanel && locationsPanel.setAttribute('inert', 'true');
        !!locationsPanel && removeClass(locationsPanel, 'locations-wrapper-open');
        const openerButton = document.getElementById('location-dialog-controller');
        !!openerButton && removeClass(openerButton, 'panel-open');
        !!openerButton && addClass(openerButton, 'panel-closed');
    }

    function setLocationPanelAsOpen() {
        const locationsPanel = document.getElementById('locations-wrapper');
        !!locationsPanel && locationsPanel.removeAttribute('inert');
        !!locationsPanel && addClass(locationsPanel, 'locations-wrapper-open');
        // change icon
        const openerButton = document.getElementById('location-dialog-controller');
        !!openerButton && addClass(openerButton, 'panel-open');
        !!openerButton && removeClass(openerButton, 'panel-closed');
    }

    const showHideLocationPanel = () => {
        const hasOpened = !locationOpen;

        setLocationOpen(hasOpened);

        if (!!hasOpened) {
            setLocationPanelAsOpen();
        } else {
            setLocationPanelAsClosed();
        }
    };

    /* istanbul ignore next */
    const handleLocationButtonKeyDown = e => {
        if (e?.key !== 'Enter') {
            return;
        }

        e.preventDefault();

        const hasOpened = !locationOpen;

        setLocationOpen(hasOpened);

        if (!!hasOpened) {
            setLocationPanelAsOpen();

            const findLink = setInterval(() => {
                // wait for the links to load (probably already available) and then navigate to it
                const listLinks = document.querySelectorAll('.locationLink');
                if (!!listLinks && listLinks.length > 0) {
                    clearInterval(findLink);
                    // move the user's focus to the first link
                    !!listLinks && listLinks.length > 0 && listLinks[0].focus();
                }
            }, 100);
        } else {
            setLocationPanelAsClosed();
        }
    };

    useEffect(() => {
        const closeOnClickOutsideDialog = e => {
            // Don't include the label that opens or closes the hours - because it already has one - don't fire twice.
            if (
                locationOpen &&
                locationsRef.current &&
                !locationsRef.current.contains(e.target) &&
                !((e.target?.id || 'NONE') === 'location-dialog-controller') &&
                !((e.target?.id || 'NONE') === 'location-dialog-controller-label')
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

        /* istanbul ignore next */
        const handleLastLinkKeyDown = e => {
            if (e?.key === 'Tab') {
                e.preventDefault();

                showHideLocationPanel();

                const bookitLink = document.getElementById('bookit-link');
                !!bookitLink && bookitLink.focus();
            }
        };

        if (locationOpen === false) {
            document.removeEventListener('mousedown', closeOnClickOutsideDialog);
            document.removeEventListener('keydown', closeOnEscape);
        } else if (locationOpen === true) {
            document.addEventListener('mousedown', closeOnClickOutsideDialog);
            document.addEventListener('keydown', closeOnEscape);

            const lastLink = document.getElementById('homepage-hours-weeklyhours-link');
            /* istanbul ignore else */
            if (!!lastLink) {
                lastLink.setAttribute('haslistener', 'true');
                lastLink.addEventListener('keydown', handleLastLinkKeyDown);
            }
        }

        return () => {
            document.removeEventListener('mousedown', closeOnClickOutsideDialog);
            document.removeEventListener('keydown', closeOnEscape);

            const lastLink = document.getElementById('homepage-hours-weeklyhours-link');
            if (!!lastLink && lastLink.getAttribute('haslistener') === 'true') {
                lastLink.removeEventListener('keydown', handleLastLinkKeyDown);
            }
        };
    }, [locationOpen]);

    useEffect(() => {
        const siteHeader = document.querySelector('uq-site-header');
        !!siteHeader && siteHeader.removeAttribute('secondleveltitle');
        !!siteHeader && siteHeader.removeAttribute('secondLevelUrl');
    }, []);

    // display as locations then booking link but code as booking then locations,
    // so they don't tab to the booking link after clicking the locations open
    return (
        <div style={{ borderBottom: '1px solid hsla(203, 50%, 30%, 0.15)' }}>
            <StyledWrapperDiv className="layout-card">
                <StyledButtonAreaDiv>
                    <StyledLocationOpenerButton
                        id="location-dialog-controller"
                        data-testid="hours-accordion-open"
                        data-analyticsid="hours-accordion"
                        onClick={showHideLocationPanel}
                        onKeyDown={handleLocationButtonKeyDown}
                        aria-haspopup="true"
                        aria-expanded={locationOpen ? 'true' : 'false'}
                        aria-controls="locations-wrapper"
                        aria-label="Show/hide Locations and hours panel"
                        className={'panel-closed'}
                    >
                        <span id="location-dialog-controller-label" data-analyticsid="hours-accordion">
                            Locations and hours
                        </span>
                    </StyledLocationOpenerButton>
                    <StyledBookingLink
                        href="https://uqbookit.uq.edu.au/#/app/booking-types/77b52dde-d704-4b6d-917e-e820f7df07cb"
                        data-testid="homepage-hours-bookit-link"
                        id="bookit-link"
                    >
                        <span>Book a room</span>
                    </StyledBookingLink>
                </StyledButtonAreaDiv>
                <StyledLocationBox
                    id={'locations-wrapper'}
                    className={'locations-wrapper'}
                    data-testid="locations-wrapper"
                    aria-labelledby="location-dialog-controller"
                    ref={locationsRef}
                    role={'dialog'}
                    aria-live={locationOpen ? 'assertive' : 'off'}
                    inert="true"
                >
                    <Locations
                        libHours={libHours}
                        libHoursLoading={libHoursLoading}
                        libHoursError={libHoursError}
                        vemcount={vemcount}
                        vemcountLoading={vemcountLoading}
                        vemcountError={vemcountError}
                        closePanel={showHideLocationPanel}
                    />
                </StyledLocationBox>
            </StyledWrapperDiv>
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
