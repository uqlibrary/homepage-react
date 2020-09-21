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
import AppBar from '@material-ui/core/AppBar';
import MenuItem from '@material-ui/core/MenuItem';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PrintIcon from '@material-ui/icons/Print';
import MenuBookIcon from '@material-ui/icons/MenuBook';
const moment = require('moment');
import Box from '@material-ui/core/Box';
import { useDispatch } from 'react-redux';
import RoomIcon from '@material-ui/icons/Room';
import HelpIcon from '../../SharedComponents/Toolbox/HelpDrawer/components/HelpIcon';
import NotificationImportantIcon from '@material-ui/icons/NotificationImportant';
import PhoneIcon from '@material-ui/icons/Phone';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import { loadSpotlights } from 'actions';
const welcomeSpotlight = require('../../../../public/images/Welcome_Spotlight.jpg');
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import PrimoSearch from '../containers/PrimoSearch';

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
    const TabPanel = props => {
        // eslint-disable-next-line react/prop-types
        const { children, value, index, ...other } = props;
        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box p={3}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    };
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
                            autoPlay
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
                                    {greeting()} {(account && account.firstName) || ''}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} style={{ marginBottom: -12, alignSelf: 'flex-end', marginLeft: -24 }}>
                                <Grid container spacing={0}>
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
                                            Current print balance <b style={{ color: 'green' }}>$12.50</b>
                                        </Grid>
                                        <Grid item xs={'auto'}>
                                            <Tooltip
                                                id="auth-button"
                                                title={'Manage your print balance'}
                                                placement="left"
                                                TransitionProps={{ timeout: 300 }}
                                            >
                                                <IconButton
                                                    size={'small'}
                                                    variant={'contained'}
                                                    style={{ color: 'green' }}
                                                >
                                                    <PrintIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Grid>
                                    </MenuItem>
                                </Grid>
                                <Grid container spacing={0}>
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
                                            Current book loans <b>6</b>
                                        </Grid>
                                        <Grid item xs={'auto'}>
                                            <Tooltip
                                                id="auth-button"
                                                title={'Manage your book loans'}
                                                placement="left"
                                                TransitionProps={{ timeout: 300 }}
                                            >
                                                <IconButton size={'small'} variant={'contained'} color={'secondary'}>
                                                    <MenuBookIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Grid>
                                    </MenuItem>
                                </Grid>
                                <Grid container spacing={0}>
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
                                            Overdue book loans <b style={{ color: 'orange' }}>1</b>
                                        </Grid>
                                        <Grid item xs={'auto'}>
                                            <Tooltip
                                                id="auth-button"
                                                title={'Manage your overdue loans'}
                                                placement="left"
                                                TransitionProps={{ timeout: 300 }}
                                            >
                                                <IconButton
                                                    size={'small'}
                                                    variant={'contained'}
                                                    style={{ color: 'orange' }}
                                                >
                                                    <NotificationImportantIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Grid>
                                    </MenuItem>
                                </Grid>
                                <Grid container spacing={0}>
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
                                            Overdue fines <b style={{ color: 'red' }}>$7.50</b>
                                        </Grid>
                                        <Grid item xs={'auto'}>
                                            <Tooltip
                                                id="auth-button"
                                                title={'Manage your overdue fines'}
                                                placement="left"
                                                TransitionProps={{ timeout: 300 }}
                                            >
                                                <IconButton
                                                    size={'small'}
                                                    variant={'contained'}
                                                    style={{ color: 'red' }}
                                                >
                                                    <MonetizationOnIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Grid>
                                    </MenuItem>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Your Librarian */}
                    <Grid item xs={12} sm={5}>
                        <StandardCard fullHeight noPadding noHeader>
                            <Grid container>
                                <Grid
                                    item
                                    style={{
                                        height: 250,
                                        width: 175,
                                        background:
                                            'url(https://web.library.uq.edu.au/sites/web.library.uq.edu.au/files/styles/uq_core_small_portrait/public/ckfinder/images/people/Liaison%20librarians%20240%20x%20240/Berends_Felicity_S_240x240.jpg?itok=vxp_rnrI)',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'right',
                                    }}
                                />
                                <Grid item xs style={{ padding: 12 }}>
                                    <Typography color={'primary'} variant={'h5'}>
                                        Your Librarian
                                    </Typography>
                                    <p>
                                        <b>Felicity Berends</b>
                                        <br />
                                        Faculty goes here
                                    </p>
                                    <Grid container>
                                        <Grid item xs={'auto'}>
                                            <IconButton size={'small'} style={{ width: 40, height: 40, margin: -6 }}>
                                                <PhoneIcon
                                                    size={'small'}
                                                    color={'secondary'}
                                                    style={{ paddingRight: 6 }}
                                                />
                                            </IconButton>
                                        </Grid>
                                        <Grid item xs>
                                            <a href="#">+61 7 336 56752</a>
                                        </Grid>
                                    </Grid>
                                    <Grid container>
                                        <Grid item xs={'auto'}>
                                            <IconButton size={'small'} style={{ width: 40, height: 40, margin: -6 }}>
                                                <MailOutlineIcon
                                                    size={'small'}
                                                    color={'secondary'}
                                                    style={{ paddingRight: 6 }}
                                                />
                                            </IconButton>
                                        </Grid>
                                        <Grid item xs>
                                            <a href="#">a.berends@library.uq.edu.au</a>
                                        </Grid>
                                    </Grid>
                                    <Grid container>
                                        <Grid item xs={'auto'}>
                                            <IconButton size={'small'} style={{ width: 40, height: 40, margin: -6 }}>
                                                <RoomIcon
                                                    size={'small'}
                                                    color={'secondary'}
                                                    style={{ paddingRight: 6 }}
                                                />
                                            </IconButton>
                                        </Grid>
                                        <Grid item xs>
                                            Duhig Tower, St Lucia
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </StandardCard>
                    </Grid>

                    {/* Comp Avail/hours/Training */}
                    <Grid item xs={12} sm={7}>
                        <StandardCard noPadding noHeader fullHeight>
                            <AppBar position="static">
                                <Grid container spacing={2}>
                                    <Grid item xs>
                                        <Tabs value={0} aria-label="simple tabs example">
                                            <Tab value={0} label="Computer availability" style={{ minWidth: 0 }} />
                                            <Tab label="Library Hours" style={{ minWidth: 0 }} />
                                            <Tab label="Training" style={{ minWidth: 0 }} />
                                        </Tabs>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={'auto'}
                                        style={{
                                            paddingTop: 6,
                                            paddingBottom: 10,
                                            paddingLeft: 24,
                                            paddingRight: 24,
                                        }}
                                    >
                                        <Tooltip title={'Select your location'} placement={'left'}>
                                            <IconButton>
                                                <RoomIcon
                                                    style={{
                                                        height: 24,
                                                        color: '#FFFFFF',
                                                        marginLeft: -6,
                                                        marginRight: -12,
                                                    }}
                                                />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            </AppBar>
                            <TabPanel value={0} index={0} style={{ overflowY: 'scroll', height: 200 }}>
                                Available computers
                            </TabPanel>
                            <TabPanel value={0} index={1}>
                                Library hours
                            </TabPanel>
                            <TabPanel value={0} index={2}>
                                Training
                            </TabPanel>
                        </StandardCard>
                    </Grid>

                    {/* Course resources*/}
                    <Grid item xs={12} sm={4}>
                        <StandardCard fullHeight noHeader>
                            <Grid container spacing={1}>
                                <Grid item xs>
                                    <Typography color={'primary'} variant={'h5'}>
                                        Course resources
                                    </Typography>
                                </Grid>
                                <Grid item xs={'auto'}>
                                    <HelpIcon
                                        title={'About course resources'}
                                        text={'Test'}
                                        buttonLabel={'CLOSE'}
                                        style={{ marginTop: -12 }}
                                    />
                                </Grid>
                            </Grid>
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
                                        Your courses
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

                    {/* Primo account */}
                    <Grid item xs={12} sm={4}>
                        <StandardCard fullHeight noHeader>
                            <Grid item xs>
                                <Typography color={'primary'} variant={'h5'}>
                                    Primo account details
                                </Typography>
                            </Grid>
                        </StandardCard>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item style={{ marginBottom: 300 }} />
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
