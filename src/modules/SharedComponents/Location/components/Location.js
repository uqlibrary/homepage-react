import React from 'react';
// import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import RoomIcon from '@material-ui/icons/Room';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

// const useStyles = makeStyles(
//     theme => ({
//         chatStatus: {
//             position: 'absolute',
//             bottom: theme.spacing(2),
//             right: theme.spacing(2),
//             backgroundColor: 'rgba(0,0,0,0.75)',
//             color: theme.palette.white.main,
//             textTransform: 'uppercase',
//             paddingTop: 8,
//             paddingBottom: 8,
//             paddingLeft: 16,
//             paddingRight: 16,
//             // width: 340,
//             borderRadius: 4,
//         },
//         chatAction: {
//             position: 'absolute',
//             bottom: theme.spacing(2),
//             right: theme.spacing(2),
//         },
//         chatIcon: {
//             color: theme.palette.white.main,
//         },
//         badgeOnline: {
//             backgroundColor: theme.palette.success.main,
//         },
//         badgeOffline: {
//             backgroundColor: theme.palette.error.main,
//         },
//     }),
//     { withTheme: true },
// );

export const Location = ({ handleLocationChange, currentLocation }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleLocationClick = event => {
        setAnchorEl(event.currentTarget);
    };
    const handleLocationClose = location => () => {
        handleLocationChange(location);
        setAnchorEl(null);
    };
    return (
        <React.Fragment>
            <Tooltip
                id="auth-button"
                title={`Current location is ${currentLocation} - Click to change`}
                placement="top"
                TransitionProps={{ timeout: 300 }}
            >
                <IconButton
                    size={'small'}
                    variant={'contained'}
                    style={{ marginRight: -12, color: 'white' }}
                    onClick={handleLocationClick}
                >
                    <RoomIcon />
                </IconButton>
            </Tooltip>
            <Menu id="simple-menu" anchorEl={anchorEl} open={Boolean(anchorEl)}>
                <MenuItem disabled>Select a preferred location</MenuItem>
                <MenuItem onClick={handleLocationClose('St Lucia')} disabled={currentLocation === 'St Lucia'}>
                    St Lucia
                </MenuItem>
                <MenuItem onClick={handleLocationClose('Gatton')} disabled={currentLocation === 'Gatton'}>
                    Gatton
                </MenuItem>
                <MenuItem onClick={handleLocationClose('Herston')} disabled={currentLocation === 'Herston'}>
                    Herston
                </MenuItem>
            </Menu>
        </React.Fragment>
    );
};

Location.propTypes = {
    handleLocationChange: PropTypes.func,
    currentLocation: PropTypes.string,
};

Location.defaultProps = {};

export default Location;
