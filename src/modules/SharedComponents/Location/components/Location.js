import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import RoomIcon from '@material-ui/icons/Room';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { makeStyles } from '@material-ui/styles';
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
    },
    icon: {
        marginLeft: 14,
        marginBottom: -2,
        marginRight: 5,
        marginTop: -2,
        height: 12,
        width: 12,
    },
}));

export const Location = ({ handleLocationChange, currentLocation, idLabel }) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
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
    if (currentLocation === null || currentLocation === 'null') {
        thisLocation = locale.noLocationSet;
    } else {
        thisLocation = currentLocation;
    }
    const id = tag => `location-${idLabel}${tag ? '-' + tag : ''}`;
    return (
        <div id={id()} data-testid={id()}>
            <Tooltip
                id={id('tooltip')}
                title={locale.tooltip.replace('[currentLocation]', thisLocation)}
                placement="bottom"
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
                    <RoomIcon className={classes.icon} />{' '}
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
    handleLocationChange: PropTypes.func,
    currentLocation: PropTypes.string,
    idLabel: PropTypes.string,
};

Location.defaultProps = {
    idLabel: '',
};

export default Location;
