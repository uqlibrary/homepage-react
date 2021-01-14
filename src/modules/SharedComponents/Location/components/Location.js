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
        marginTop: -5,
        marginLeft: 0,
        color: theme.palette.secondary.main,
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
        if (location === 'not set') {
            setCookie('location', null, { expires: '2022-01-01T00:00:00.000Z' });
        } else {
            setCookie('location', location, { expires: '2022-01-01T00:00:00.000Z' });
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
    const id = (tag = null) => `location${!!idLabel ? '-' + idLabel : ''}${!!tag ? '-' + tag : ''}`;
    return (
        <div id={id()} data-testid={id()}>
            <Tooltip
                id={id('tooltip')}
                title={locale.tooltip.replace('[currentLocation]', thisLocation)}
                placement="right"
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
                id={id('menu')}
                data-testid={id('menu')}
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                    id: id('paper'),
                    'data-testid': id('paper'),
                }}
            >
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
    idLabel: null,
};

export default Location;
