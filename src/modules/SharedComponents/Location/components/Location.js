import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import RoomIcon from '@mui/icons-material/Room';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { useCookies } from 'react-cookie';
import { locale } from './locale';
import { obfusticateUsername } from 'helpers/general';
import { LOCATION_COOKIE_NAME } from 'config/general';
import { styled } from '@mui/material/styles';

const StyledLocation = styled('div')(({ theme }) => ({
    '& .iconButton': {
        marginTop: -5,
        marginLeft: 0,
        color: theme.palette.secondary.light,
        textTransform: 'none',
        fontSize: 14,
        '& .icon': {
            color: theme.palette.primary.main,
            marginLeft: 0,
            marginBottom: -2,
            marginRight: 0,
            marginTop: -2,
            height: 14,
            width: 14,
        },
    },

    '@keyframes wiggler': {
        from: { transform: 'rotate(-14deg)', transformOrigin: '50% 100%' },
        to: { transform: 'rotate(7deg)', transformOrigin: '50% 100%' },
    },
    '& .wiggler': {
        color: theme.palette.primary.main,
        animationName: 'wiggler',
        animationDuration: '0.3s',
        animationIterationCount: 30,
        animationDirection: 'alternate',
        animationTimingFunction: 'ease-in-out',
    },
}));

export const Location = ({ idLabel, account }) => {
    const [cookies, setCookie, removeCookie] = useCookies();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleLocationClick = event => {
        setAnchorEl(event.currentTarget);
    };

    function cookieContents(account, location) {
        const cookieValue = {};
        cookieValue[obfusticateUsername(account)] = location;
        return cookieValue;
    }

    function preferredLocation() {
        /* istanbul ignore next */
        if (!account) {
            return locale.noLocationSet;
        }

        const locationCookie = cookies[LOCATION_COOKIE_NAME];
        const username1 = obfusticateUsername(account);
        if (locationCookie[username1]) {
            return locationCookie[username1];
        }

        // the username isn't in the cookie? different user!! public computer? clear that cookie!
        /* istanbul ignore next */
        removeCookie(LOCATION_COOKIE_NAME);

        /* istanbul ignore next */
        return locale.noLocationSet;
    }

    function cookieExpiryDate() {
        const current = new Date();
        const nextYear = new Date();
        nextYear.setFullYear(current.getFullYear() + 1);
        return nextYear;
    }
    const handleLocationClose = location => () => {
        setCookie(LOCATION_COOKIE_NAME, location === 'not set' ? null : cookieContents(account, location), {
            expires: cookieExpiryDate(),
        });
        setAnchorEl(null);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    // temporary code to rename old cookie; these cookies are set to last a year
    // this `if` can be removed in feb 2025
    const OLD_COOKIE_NAME = 'location';
    if (cookies.hasOwnProperty(OLD_COOKIE_NAME) && cookies[OLD_COOKIE_NAME] !== 'null') {
        const location = cookies[OLD_COOKIE_NAME];
        removeCookie(OLD_COOKIE_NAME);
        const nextYear = cookieExpiryDate();
        setCookie(LOCATION_COOKIE_NAME, cookieContents(account, location), { expires: nextYear });
    }

    const thisLocation =
        !cookies[LOCATION_COOKIE_NAME] || cookies[LOCATION_COOKIE_NAME] === 'null'
            ? locale.noLocationSet
            : preferredLocation();

    const getTagId = (tag = null) => {
        const locationPrefix = !!idLabel ? /* istanbul ignore next */ '-' + idLabel : '';
        const locationSuffix = !!tag ? '-' + tag : '';
        return `location${locationPrefix}${locationSuffix}`;
    };

    return (
        <StyledLocation id={getTagId()} data-testid={getTagId()}>
            <Tooltip
                id={getTagId('tooltip')}
                title={locale.tooltip.replace('[currentLocation]', thisLocation)}
                placement="right"
                TransitionProps={{ timeout: 300 }}
            >
                <Button
                    size={'small'}
                    variant={'text'}
                    className={'iconButton'}
                    onClick={handleLocationClick}
                    id={getTagId('button')}
                    data-testid={getTagId('button')}
                    data-analyticsid={getTagId('button')}
                >
                    <RoomIcon
                        className={`icon ${
                            !cookies[LOCATION_COOKIE_NAME] || cookies[LOCATION_COOKIE_NAME] === 'null' ? 'wiggler' : ''
                        }`}
                    />{' '}
                    {thisLocation.replace(locale.noLocationSet, locale.noLocationSetLabel)}
                </Button>
            </Tooltip>
            <Menu
                keepMounted
                autoFocus
                id={getTagId('menu')}
                data-testid={getTagId('menu')}
                data-analyticsid={getTagId('menu')}
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                    id: getTagId('paper'),
                    'data-testid': getTagId('paper'),
                }}
            >
                {locale.locations.map((item, index) => (
                    <MenuItem
                        key={index}
                        onClick={handleLocationClose(item.value)}
                        disabled={thisLocation === item.value}
                        className={thisLocation === item.value ? 'selectedItem' : ''}
                        sx={
                            thisLocation === item.value
                                ? { color: 'primary.main', opacity: '1 !important', fontWeight: 'bold' }
                                : {}
                        }
                        data-testid={getTagId(`option-${index}`)}
                        data-analyticsid={getTagId(`option-${index}`)}
                        id={getTagId(`option-${index}`)}
                    >
                        {(thisLocation === item.displayName || thisLocation === item.value) && <RoomIcon />}
                        {item.displayName}
                    </MenuItem>
                ))}
            </Menu>
        </StyledLocation>
    );
};

Location.propTypes = {
    idLabel: PropTypes.string,
    account: PropTypes.object,
};

Location.defaultProps = {
    idLabel: null,
};

export default Location;
