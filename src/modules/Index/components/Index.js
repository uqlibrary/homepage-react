import React, { useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import ImageGallery from 'react-image-gallery';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import PrintIcon from '@material-ui/icons/Print';
import MenuBookIcon from '@material-ui/icons/MenuBook';
const moment = require('moment');
// import Box from '@material-ui/core/Box';
import { useDispatch } from 'react-redux';
import RoomIcon from '@material-ui/icons/Room';
// import HelpIcon from '../../SharedComponents/Toolbox/HelpDrawer/components/HelpIcon';
import NotificationImportantIcon from '@material-ui/icons/NotificationImportant';
// import PhoneIcon from '@material-ui/icons/Phone';
// import MailOutlineIcon from '@material-ui/icons/MailOutline';
import { loadSpotlights } from 'actions';
const welcomeSpotlight = require('../../../../public/images/Welcome_Spotlight.jpg');
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import PrimoSearch from '../containers/PrimoSearch';
// import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
// import FormHelperText from '@material-ui/core/FormHelperText';
// import FormControl from '@material-ui/core/FormControl';
// import Select from '@material-ui/core/Select';
import Menu from '@material-ui/core/Menu';
import AllInboxIcon from '@material-ui/icons/AllInbox';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';

export const Index = ({ account, spotlights, spotlightsLoading }) => {
    const dispatch = useDispatch();
    useEffect(() => {
        if (spotlightsLoading === null) {
            dispatch(loadSpotlights());
        }
    }, [spotlightsLoading, dispatch]);
    const images =
        !!spotlights && spotlights.length > 0
            ? spotlights.map(item => {
                  return {
                      original: item.img_url,
                      thumbnail: item.img_url,
                  };
              })
            : [
                  {
                      original: welcomeSpotlight,
                      originalAlt: 'Welcome to the UQ Library',
                      originalTitle: 'UQ Library',
                  },
              ];
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleLocationClick = event => {
        setAnchorEl(event.currentTarget);
    };
    const handleLocationClose = () => {
        setAnchorEl(null);
    };
    const greeting = () => {
        const time = moment().format('H');
        if (time < 12) {
            return <span>Good morning</span>;
        } else if (time >= 12 && time < 18) {
            return <span>Good afternoon</span>;
        } else {
            return <span>Good evening</span>;
        }
    };
    // const TabPanel = props => {
    //     // eslint-disable-next-line react/prop-types
    //     const { children, value, index, ...other } = props;
    //     return (
    //         <div
    //             role="tabpanel"
    //             hidden={value !== index}
    //             id={`simple-tabpanel-${index}`}
    //             aria-labelledby={`simple-tab-${index}`}
    //             {...other}
    //         >
    //             {value === index && (
    //                 <Box p={3}>
    //                     <Typography>{children}</Typography>
    //                 </Box>
    //             )}
    //         </div>
    //     );
    // };
    return (
        <StandardPage>
            <div className="layout-card" style={{ marginTop: 12 }}>
                <Grid container spacing={6}>
                    {/* Search */}
                    <Grid item xs={12} id="primo-search">
                        <PrimoSearch />
                    </Grid>
                    {/* Spotlights */}
                    <Grid item xs={8}>
                        <ImageGallery
                            onErrorImageURL={welcomeSpotlight}
                            items={images}
                            showThumbnails={images.length > 1}
                            showFullscreenButton={false}
                            showPlayButton={false}
                            autoPlay={!account}
                            slideDuration={1000}
                            slideInterval={12000}
                            showBullets={false}
                        />
                    </Grid>

                    {/* Personalisation panel */}
                    <Grid item xs={4} style={{ paddingLeft: 16, paddingTop: 28 }}>
                        <Grid
                            container
                            spacing={1}
                            style={{ borderLeft: '1px solid #CCCCCC', paddingLeft: 6, height: '100%' }}
                            justify={'flex-end'}
                        >
                            <Grid item xs={12}>
                                <Typography
                                    variant={'h4'}
                                    component={'h4'}
                                    color={'primary'}
                                    style={{ paddingLeft: 12 }}
                                >
                                    {greeting()}
                                    <br />
                                    {(account && account.firstName) || ''}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} style={{ marginBottom: -12, alignSelf: 'flex-end', marginLeft: -24 }}>
                                <Grid container spacing={0}>
                                    <Tooltip
                                        id="auth-button"
                                        title={'Manage your print balance'}
                                        placement="left"
                                        TransitionProps={{ timeout: 300 }}
                                    >
                                        <MenuItem
                                            style={{
                                                width: '100%',
                                                marginBottom: -3,
                                                marginTop: -3,
                                                paddingTop: 3,
                                                paddingBottom: 3,
                                            }}
                                        >
                                            <Grid item xs style={{ lineHeight: '30px' }}>
                                                <Typography style={{ fontSize: 14 }}>
                                                    Current print balance <b style={{ color: 'green' }}>$12.50</b>
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={'auto'}>
                                                <IconButton
                                                    size={'small'}
                                                    variant={'contained'}
                                                    style={{ color: 'green' }}
                                                >
                                                    <PrintIcon />
                                                </IconButton>
                                            </Grid>
                                        </MenuItem>
                                    </Tooltip>
                                </Grid>
                                <Grid container spacing={0}>
                                    <Tooltip
                                        id="auth-button"
                                        title={'Manage your book loans'}
                                        placement="left"
                                        TransitionProps={{ timeout: 300 }}
                                    >
                                        <MenuItem
                                            style={{
                                                width: '100%',
                                                marginBottom: -3,
                                                marginTop: -3,
                                                paddingTop: 3,
                                                paddingBottom: 3,
                                            }}
                                        >
                                            <Grid item xs style={{ lineHeight: '24px' }}>
                                                <Typography style={{ fontSize: 14 }}>
                                                    Current book loans <b>6</b>
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={'auto'}>
                                                <IconButton size={'small'} variant={'contained'} color={'secondary'}>
                                                    <MenuBookIcon />
                                                </IconButton>
                                            </Grid>
                                        </MenuItem>
                                    </Tooltip>
                                </Grid>
                                <Grid container spacing={0}>
                                    <Tooltip
                                        id="auth-button"
                                        title={'Manage your overdue loans'}
                                        placement="left"
                                        TransitionProps={{ timeout: 300 }}
                                    >
                                        <MenuItem
                                            style={{
                                                width: '100%',
                                                marginBottom: -3,
                                                marginTop: -3,
                                                paddingTop: 3,
                                                paddingBottom: 3,
                                            }}
                                        >
                                            <Grid item xs style={{ lineHeight: '24px' }}>
                                                <Typography style={{ fontSize: 14 }}>
                                                    Overdue book loans <b style={{ color: 'orange' }}>1</b>
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={'auto'}>
                                                <IconButton
                                                    size={'small'}
                                                    variant={'contained'}
                                                    style={{ color: 'orange' }}
                                                >
                                                    <NotificationImportantIcon />
                                                </IconButton>
                                            </Grid>
                                        </MenuItem>
                                    </Tooltip>
                                </Grid>
                                <Grid container spacing={0}>
                                    <Tooltip
                                        id="auth-button"
                                        title={'Manage your overdue fines'}
                                        placement="left"
                                        TransitionProps={{ timeout: 300 }}
                                    >
                                        <MenuItem
                                            style={{
                                                width: '100%',
                                                marginBottom: -3,
                                                marginTop: -3,
                                                paddingTop: 3,
                                                paddingBottom: 3,
                                            }}
                                        >
                                            <Grid item xs style={{ lineHeight: '24px' }}>
                                                <Typography style={{ fontSize: 14 }}>
                                                    Overdue fines <b style={{ color: 'red' }}>$7.50</b>
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={'auto'}>
                                                <IconButton
                                                    size={'small'}
                                                    variant={'contained'}
                                                    style={{ color: 'red' }}
                                                >
                                                    <MonetizationOnIcon />
                                                </IconButton>
                                            </Grid>
                                        </MenuItem>
                                    </Tooltip>
                                </Grid>
                                {/* Doc del */}
                                <Grid container spacing={0}>
                                    <Tooltip
                                        id="auth-button"
                                        title={'Manage your document delivery'}
                                        placement="left"
                                        TransitionProps={{ timeout: 300 }}
                                    >
                                        <MenuItem
                                            style={{
                                                width: '100%',
                                                marginBottom: -3,
                                                marginTop: -3,
                                                paddingTop: 3,
                                                paddingBottom: 3,
                                            }}
                                        >
                                            <Grid item xs style={{ lineHeight: '24px' }}>
                                                <Typography style={{ fontSize: 14 }}>
                                                    Document delivery requests <b>2</b>
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={'auto'}>
                                                <IconButton size={'small'} variant={'contained'} color={'secondary'}>
                                                    <AllInboxIcon />
                                                </IconButton>
                                            </Grid>
                                        </MenuItem>
                                    </Tooltip>
                                </Grid>
                                {/* Room bookings */}
                                <Grid container spacing={0}>
                                    <Tooltip
                                        id="auth-button"
                                        title={'Manage your room bookings (1 today)'}
                                        placement="left"
                                        TransitionProps={{ timeout: 300 }}
                                    >
                                        <MenuItem
                                            style={{
                                                width: '100%',
                                                marginBottom: -3,
                                                marginTop: -3,
                                                paddingTop: 3,
                                                paddingBottom: 3,
                                            }}
                                        >
                                            <Grid item xs style={{ lineHeight: '24px' }}>
                                                <Typography style={{ fontSize: 14 }}>
                                                    Room bookings <b style={{ color: 'orange' }}>1 (Today)</b>
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={'auto'}>
                                                <IconButton
                                                    size={'small'}
                                                    variant={'contained'}
                                                    style={{ color: 'orange' }}
                                                >
                                                    <MeetingRoomIcon />
                                                </IconButton>
                                            </Grid>
                                        </MenuItem>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Comp Avail */}
                    <Grid item xs={12} sm={4}>
                        <StandardCard
                            primaryHeader
                            title={
                                <Grid container>
                                    <Grid item xs>
                                        Computer availability
                                    </Grid>
                                    <Grid item xs={'auto'}>
                                        <Tooltip
                                            id="auth-button"
                                            title={'Current location is St Lucia - Click to change'}
                                            placement="top"
                                            TransitionProps={{ timeout: 300 }}
                                        >
                                            <IconButton
                                                size={'small'}
                                                variant={'contained'}
                                                style={{ marginRight: -12 }}
                                                onClick={handleLocationClick}
                                            >
                                                <RoomIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Menu
                                            id="simple-menu"
                                            anchorEl={anchorEl}
                                            keepMounted
                                            open={Boolean(anchorEl)}
                                            onClose={handleLocationClose}
                                        >
                                            <MenuItem disabled>Select a preferred location</MenuItem>
                                            <MenuItem onClick={handleLocationClose}>St Lucia</MenuItem>
                                            <MenuItem onClick={handleLocationClose}>Gatton</MenuItem>
                                            <MenuItem onClick={handleLocationClose}>Herston</MenuItem>
                                        </Menu>
                                    </Grid>
                                </Grid>
                            }
                            fullHeight
                        >
                            test
                        </StandardCard>
                    </Grid>
                    {/* Library hours */}
                    <Grid item xs={12} sm={4}>
                        <StandardCard
                            primaryHeader
                            title={
                                <Grid container>
                                    <Grid item xs>
                                        Library hours
                                    </Grid>
                                    <Grid item xs={'auto'}>
                                        <Tooltip
                                            id="auth-button"
                                            title={'Current location is St Lucia - Click to change'}
                                            placement="top"
                                            TransitionProps={{ timeout: 300 }}
                                        >
                                            <IconButton
                                                size={'small'}
                                                variant={'contained'}
                                                style={{ marginRight: -12 }}
                                                onClick={handleLocationClick}
                                            >
                                                <RoomIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Menu
                                            id="simple-menu"
                                            anchorEl={anchorEl}
                                            keepMounted
                                            open={Boolean(anchorEl)}
                                            onClose={handleLocationClose}
                                        >
                                            <MenuItem disabled>Select a preferred location</MenuItem>
                                            <MenuItem onClick={handleLocationClose}>St Lucia</MenuItem>
                                            <MenuItem onClick={handleLocationClose}>Gatton</MenuItem>
                                            <MenuItem onClick={handleLocationClose}>Herston</MenuItem>
                                        </Menu>
                                    </Grid>
                                </Grid>
                            }
                            fullHeight
                        >
                            test
                        </StandardCard>
                    </Grid>

                    {/* Course resources*/}
                    <Grid item xs={12} sm={4}>
                        <StandardCard
                            fullHeight
                            primaryHeader
                            title={
                                <Grid container>
                                    <Grid item xs>
                                        Course resources
                                    </Grid>
                                    <Grid item xs={'auto'}>
                                        <Tooltip
                                            id="auth-button"
                                            title={'Current location is St Lucia - Click to change'}
                                            placement="top"
                                            TransitionProps={{ timeout: 300 }}
                                        >
                                            <IconButton
                                                size={'small'}
                                                variant={'contained'}
                                                style={{ marginRight: -12 }}
                                                onClick={handleLocationClick}
                                            >
                                                <RoomIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Menu
                                            id="simple-menu"
                                            anchorEl={anchorEl}
                                            keepMounted
                                            open={Boolean(anchorEl)}
                                            onClose={handleLocationClose}
                                        >
                                            <MenuItem disabled>Select a preferred location</MenuItem>
                                            <MenuItem onClick={handleLocationClose}>St Lucia</MenuItem>
                                            <MenuItem onClick={handleLocationClose}>Gatton</MenuItem>
                                            <MenuItem onClick={handleLocationClose}>Herston</MenuItem>
                                        </Menu>
                                    </Grid>
                                </Grid>
                            }
                        >
                            <Grid container spacing={1}>
                                <Grid item xs>
                                    <TextField placeholder="Enter course code to search" fullWidth />
                                </Grid>
                                <Grid item xs={'auto'}>
                                    <Button size={'small'} style={{ width: 30, minWidth: 30 }}>
                                        <SearchIcon />
                                    </Button>
                                </Grid>
                            </Grid>
                            <Grid container spacing={1} style={{ marginTop: 12 }}>
                                <Grid item xs={12}>
                                    <Typography color={'secondary'} variant={'h6'}>
                                        Popular courses
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <a href="#">PH101</a> - Applied psychology
                                </Grid>
                                <Grid item xs={12}>
                                    <a href="#">PH102</a> - More applied psychology
                                </Grid>
                                <Grid item xs={12}>
                                    <a href="#">PH103</a> - Even more applied psychology
                                </Grid>
                            </Grid>
                        </StandardCard>
                    </Grid>
                </Grid>
            </div>
        </StandardPage>
    );
};

Index.propTypes = {
    account: PropTypes.object,
    actions: PropTypes.any,
    spotlights: PropTypes.any,
    spotlightsError: PropTypes.any,
    spotlightsLoading: PropTypes.bool,
};

Index.defaultProps = {};

export default Index;
