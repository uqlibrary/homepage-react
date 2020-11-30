import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import RoomIcon from '@material-ui/icons/Room';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { makeStyles } from '@material-ui/styles';
import { useCookies } from 'react-cookie';
import { locale } from './locale';

const useStyles = makeStyles(theme => ({
    selectedItem: {
        color: theme.palette.primary.main,
        opacity: '1 !important',
        fontWeight: 'bold',
    },
    iconButton: {
        marginTop: -4,
        marginLeft: -3,
        color: theme.palette.secondary.main,
        textTransform: 'none',
        fontSize: 14,
    },
    icon: {
        marginLeft: 13,
        marginBottom: -2,
        marginRight: 5,
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
    const handleLocationChange = location => {
        setCookie('location', location);
    };
    const handleLocationClick = event => {
        setAnchorEl(event.currentTarget);
    };
    const handleLocationClose = location => () => {
        if (location === 'not set') {
            handleLocationChange(null);
        } else {
            handleLocationChange(location);
        }
        setAnchorEl(null);
    };
    const handleBlur = () => {
        setAnchorEl(null);
    };
    let thisLocation = null;
    if (cookies.location === null || cookies.location === 'null') {
        thisLocation = locale.noLocationSet;
    } else {
        thisLocation = cookies.location;
    }
    const id = tag => `location-${idLabel}${tag ? '-' + tag : ''}`;
    return (
        <div id={id()} data-testid={id()}>
            <Tooltip
                id={id('tooltip')}
                title={locale.tooltip.replace('[currentLocation]', thisLocation)}
                placement="left"
                TransitionProps={{ timeout: 300 }}
            >
                <Button
                    size={'small'}
                    variant={'text'}
                    className={classes.iconButton}
                    onClick={handleLocationClick}
                    id={id('button')}
                    data-testid={id('button')}
                >
                    <RoomIcon
                        className={`${classes.icon} ${cookies.location === null ||
                            (cookies.location === 'null' && classes.wiggler)}`}
                    />{' '}
                    {thisLocation.replace(locale.noLocationSet, locale.noLocationSetLabel)}
                </Button>
            </Tooltip>
            <Menu
                id={id('menu')}
                data-testid={id('menu')}
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onBlur={handleBlur}
            >
                <MenuItem disabled>{locale.menuTitle}</MenuItem>
                {locale.locations.map((item, index) => (
                    <MenuItem
                        key={index}
                        onClick={handleLocationClose(item.value)}
                        disabled={thisLocation === item.value}
                        className={thisLocation === item.value ? classes.selectedItem : ''}
                        data-testid={id(`option-${index}`)}
                        id={id(`option-${index}`)}
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
    idLabel: '',
};

export default Location;
