import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import RoomIcon from '@mui/icons-material/Room';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { makeStyles } from '@mui/styles';
import { useCookies } from 'react-cookie';
import { locale } from './locale';

const useStyles = makeStyles(theme => ({
    selectedItem: {
        color: theme.palette.primary.main,
        opacity: '1 !important',
        fontWeight: 'bold',
    },
    iconButton: {
        marginTop: -5,
        marginLeft: 0,
        color: theme.palette.secondary.light,
        textTransform: 'none',
        fontSize: 14,
    },
    icon: {
        marginLeft: 0,
        marginBottom: -2,
        marginRight: 0,
        marginTop: -2,
        height: 14,
        width: 14,
    },
    '@keyframes wiggle': {
        from: { transform: 'rotate(-14deg)', transformOrigin: '50% 100%' },
        to: { transform: 'rotate(7deg)', transformOrigin: '50% 100%' },
    },
    wiggler: {
        color: theme.palette.primary.main,
        animationName: '$wiggle',
        animationDuration: '0.3s',
        animationIterationCount: 30,
        animationDirection: 'alternate',
        animationTimingFunction: 'ease-in-out',
    },
}));

export const Location = ({ idLabel }) => {
    const classes = useStyles();
    const [cookies, setCookie] = useCookies();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleLocationClick = event => {
        setAnchorEl(event.currentTarget);
    };
    const handleLocationClose = location => () => {
        const current = new Date();
        const nextYear = new Date();
        nextYear.setFullYear(current.getFullYear() + 1);
        if (location === 'not set') {
            setCookie('location', null, { expires: nextYear });
        } else {
            setCookie('location', location, { expires: nextYear });
        }
        setAnchorEl(null);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    let thisLocation = null;
    if (!cookies.location || cookies.location === 'null') {
        thisLocation = locale.noLocationSet;
    } else {
        thisLocation = cookies.location;
    }
    const getTagId = (tag = null) => {
        const locationPrefix = !!idLabel ? /* istanbul ignore next */ '-' + idLabel : '';
        const locationSuffix = !!tag ? '-' + tag : '';
        return `location${locationPrefix}${locationSuffix}`;
    };
    return (
        <div id={getTagId()} data-testid={getTagId()}>
            <Tooltip
                id={getTagId('tooltip')}
                title={locale.tooltip.replace('[currentLocation]', thisLocation)}
                placement="right"
                TransitionProps={{ timeout: 300 }}
            >
                <Button
                    size={'small'}
                    variant={'text'}
                    className={classes.iconButton}
                    onClick={handleLocationClick}
                    id={getTagId('button')}
                    data-testid={getTagId('button')}
                    data-analyticsid={getTagId('button')}
                >
                    <RoomIcon
                        className={`${classes.icon} ${
                            !cookies.location || cookies.location === 'null' ? classes.wiggler : ''
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
                        className={thisLocation === item.value ? classes.selectedItem : ''}
                        data-testid={getTagId(`option-${index}`)}
                        data-analyticsid={getTagId(`option-${index}`)}
                        id={getTagId(`option-${index}`)}
                    >
                        {(thisLocation === item.location || thisLocation === item.value) && <RoomIcon />}
                        {item.location}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
};

Location.propTypes = {
    idLabel: PropTypes.string,
};

Location.defaultProps = {
    idLabel: null,
};

export default Location;
