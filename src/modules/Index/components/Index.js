import React, { useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import PrintIcon from '@material-ui/icons/Print';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import { useDispatch } from 'react-redux';
import RoomIcon from '@material-ui/icons/Room';
import { loadSpotlights } from 'actions';
// const welcomeSpotlight = require('../../../../public/images/Welcome_Spotlight.jpg');
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import PrimoSearch from 'modules/SharedComponents/PrimoSearch/containers/PrimoSearch';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import { default as locale } from './locale';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { LiveAnnouncer, LiveMessage } from 'react-aria-live';
const ordinal = require('ordinal');
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import {
    CarouselProvider,
    Slider,
    Slide,
    ButtonBack,
    ButtonNext,
    ButtonPlay,
    ButtonFirst,
    ButtonLast,
    DotGroup,
    Image,
} from 'pure-react-carousel';
// import 'pure-react-carousel/dist/react-carousel.es.css';
const moment = require('moment');

export const Index = ({ account, spotlights, spotlightsLoading }) => {
    const dispatch = useDispatch();
    useEffect(() => {
        if (spotlightsLoading === null) {
            dispatch(loadSpotlights());
        }
    }, [spotlightsLoading, dispatch]);
    console.log(spotlights);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [anchorPrintEl, setAnchorPrintEl] = React.useState(null);
    const handleLocationClick = event => {
        setAnchorEl(event.currentTarget);
    };
    const handleLocationClose = () => {
        setAnchorEl(null);
    };
    const handlePrintClick = event => {
        setAnchorPrintEl(event.currentTarget);
    };
    const handlePrintClose = () => {
        setAnchorPrintEl(null);
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
    const circleColor = value => {
        if (value < 25) {
            return 'red';
        } else if (value > 25 && value < 50) {
            return 'orange';
        } else if (value > 50 && value < 75) {
            return '#36926a';
        } else if (value > 75) {
            return 'green';
        }
        return '#999';
    };
    return (
        <LiveAnnouncer>
            <LiveMessage message={''} aria-live="polite" />
            <StandardPage>
                <div className="layout-card" style={{ marginTop: 24, marginBottom: 50 }}>
                    <Grid container spacing={6}>
                        {/* Search */}
                        <Grid item xs={12}>
                            <PrimoSearch />
                        </Grid>
                        {/* Spotlights */}
                        <Grid item xs={12} md={8} id="spotlights" data-testid="spotlights">
                            <div>
                                <CarouselProvider
                                    visibleSlides={1}
                                    totalSlides={3}
                                    step={1}
                                    naturalSlideWidth={1967}
                                    naturalSlideHeight={721}
                                    isPlaying
                                >
                                    <Slider>
                                        <Slide index={0}>
                                            <Image
                                                src="https://app.library.uq.edu.au/file/public/c7ce4070-0f71-11eb-9138-53c32be5af5c.jpg"
                                                style={{ width: '100%' }}
                                            />
                                        </Slide>
                                        <Slide index={1}>
                                            <Image
                                                src="https://app.library.uq.edu.au/file/public/c7d1a910-0c41-11eb-86ad-c9112b007fcc.jpg"
                                                style={{ width: '100%' }}
                                            />
                                        </Slide>
                                        <Slide index={2}>
                                            <Image
                                                src="https://app.library.uq.edu.au/file/public/5902a780-51e9-11e9-b2aa-e17ca7351ccc.jpg"
                                                style={{ width: '100%' }}
                                            />
                                        </Slide>
                                    </Slider>
                                    <ButtonPlay childrenPlaying="Pause" childrenPaused="Play" />
                                    <ButtonFirst>First</ButtonFirst>
                                    <ButtonBack>Back</ButtonBack>
                                    <ButtonNext>Next</ButtonNext>
                                    <ButtonLast>Last</ButtonLast>
                                    <DotGroup />
                                </CarouselProvider>
                            </div>
                        </Grid>

                        {/* Personalisation panel */}
                        <Hidden smDown>
                            <Grid item xs={12} md={4} style={{ paddingLeft: 16, paddingTop: 28 }}>
                                <Grid
                                    container
                                    spacing={1}
                                    style={{ borderLeft: '1px solid #CCCCCC', paddingLeft: 6, height: '100%' }}
                                    justify={'flex-end'}
                                >
                                    {account && account.id && (
                                        <Grid item xs={12} style={{ marginTop: -16 }}>
                                            <Typography
                                                variant={'h5'}
                                                component={'h5'}
                                                color={'primary'}
                                                style={{ paddingLeft: 16, fontSize: '2.25rem' }}
                                            >
                                                {greeting()}
                                                <br />
                                                {(account && account.firstName) || ''}
                                            </Typography>
                                            <Tooltip
                                                id="auth-button"
                                                title={`Your UQ username is ${account && account.id}`}
                                                placement="right"
                                                TransitionProps={{ timeout: 300 }}
                                            >
                                                <Typography
                                                    component={'span'}
                                                    color={'secondary'}
                                                    style={{ fontSize: 12 }}
                                                >
                                                    <AccountBoxIcon
                                                        fontSize={'small'}
                                                        style={{
                                                            marginLeft: 16,
                                                            marginBottom: -2,
                                                            marginRight: 6,
                                                            height: 12,
                                                            width: 12,
                                                        }}
                                                    />
                                                    {(account && account.id) || ''}
                                                </Typography>
                                            </Tooltip>
                                        </Grid>
                                    )}
                                    <Grid
                                        item
                                        xs={12}
                                        style={{ marginBottom: -12, alignSelf: 'flex-end', marginLeft: -24 }}
                                    >
                                        <Grid container spacing={0}>
                                            <MenuItem
                                                style={{
                                                    width: '100%',
                                                    marginBottom: -3,
                                                    marginTop: -3,
                                                    paddingTop: 3,
                                                    paddingBottom: 3,
                                                }}
                                                onClick={handlePrintClick}
                                            >
                                                <Grid item xs style={{ lineHeight: '30px' }}>
                                                    <Typography style={{ fontSize: 15, fontWeight: 300 }}>
                                                        Manage your print balance
                                                    </Typography>
                                                </Grid>
                                                <Menu
                                                    id="simple-menu"
                                                    anchorEl={anchorPrintEl}
                                                    keepMounted
                                                    open={Boolean(anchorPrintEl)}
                                                    onClose={handlePrintClose}
                                                    onBlur={handlePrintClose}
                                                >
                                                    <MenuItem disabled>Manage your PaperCut account</MenuItem>
                                                    <MenuItem onClick={handleLocationClose}>
                                                        Log in and manage your print balance
                                                    </MenuItem>
                                                    <MenuItem onClick={handleLocationClose}>
                                                        Top up your print balance - $5
                                                    </MenuItem>
                                                    <MenuItem onClick={handleLocationClose}>
                                                        Top up your print balance - $10
                                                    </MenuItem>
                                                    <MenuItem onClick={handleLocationClose}>
                                                        Top up your print balance - $20
                                                    </MenuItem>
                                                </Menu>
                                                <Grid item xs={'auto'}>
                                                    <b style={{ color: '#333', marginRight: 12 }}>$12.50</b>
                                                    <Tooltip
                                                        id="auth-button"
                                                        title={'Manage your print balance'}
                                                        placement="left"
                                                        TransitionProps={{ timeout: 300 }}
                                                    >
                                                        <IconButton size={'small'} variant={'contained'}>
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
                                                    <Typography style={{ fontSize: 15, fontWeight: 300 }}>
                                                        Manage book loans
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={'auto'}>
                                                    <b>6</b> | <b style={{ color: 'orange', marginRight: 12 }}>1</b>
                                                    <Tooltip
                                                        id="auth-button"
                                                        title={'Manage your book loans (6 current | 1 overdue)'}
                                                        placement="left"
                                                        TransitionProps={{ timeout: 300 }}
                                                    >
                                                        <IconButton
                                                            size={'small'}
                                                            variant={'contained'}
                                                            color={'secondary'}
                                                        >
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
                                                    <Typography style={{ fontSize: 15, fontWeight: 300 }}>
                                                        Manage overdue fines
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={'auto'}>
                                                    <b style={{ color: 'orange', marginRight: 12 }}>$7.50</b>
                                                    <Tooltip
                                                        id="auth-button"
                                                        title={'Manage your overdue fines'}
                                                        placement="left"
                                                        TransitionProps={{ timeout: 300 }}
                                                    >
                                                        <IconButton size={'small'} variant={'contained'}>
                                                            <MonetizationOnIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Grid>
                                            </MenuItem>
                                        </Grid>
                                        {/* Room bookings */}
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
                                                    <Typography style={{ fontSize: 15, fontWeight: 300 }}>
                                                        Manage room bookings
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={'auto'}>
                                                    <b style={{ color: 'orange', marginRight: 12 }}>1 (Today)</b>
                                                    <Tooltip
                                                        id="auth-button"
                                                        title={'Manage your room bookings (1 today)'}
                                                        placement="left"
                                                        TransitionProps={{ timeout: 300 }}
                                                    >
                                                        <IconButton size={'small'} variant={'contained'}>
                                                            <MeetingRoomIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Grid>
                                            </MenuItem>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Hidden>

                        {/* Comp Avail */}
                        <Grid item xs={12} md={4}>
                            <StandardCard
                                accentHeader
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
                                                    style={{ marginRight: -12, color: 'white' }}
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
                                <div
                                    style={{
                                        height: 275,
                                        overflowX: 'hidden',
                                        overflowY: 'auto',
                                        marginRight: -16,
                                        marginTop: -16,
                                        marginBottom: -24,
                                        marginLeft: -16,
                                        padding: 8,
                                    }}
                                >
                                    {locale.Computers.map((item, index) => {
                                        const percent = parseInt((item.free / item.total) * 100, 10);
                                        return (
                                            <Grid
                                                container
                                                spacing={2}
                                                key={index}
                                                style={{ borderBottom: '1px solid #EEE', padding: '8px 0 0 0' }}
                                            >
                                                <Grid item xs={5}>
                                                    <a href={item.link} style={{ marginLeft: 8 }}>
                                                        {item.title}
                                                    </a>
                                                </Grid>
                                                <Grid item xs>
                                                    {item.free} of {item.total} available
                                                </Grid>
                                                <Grid item xs={'auto'}>
                                                    <Tooltip
                                                        title={`${percent}% available = ${item.free} of ${item.total}`}
                                                        placement="left"
                                                        TransitionProps={{ timeout: 300 }}
                                                    >
                                                        <Box position="relative" display="inline-flex">
                                                            <CircularProgress
                                                                size={20}
                                                                variant="static"
                                                                value={100}
                                                                style={{ color: circleColor(percent) }}
                                                            />
                                                            <Box
                                                                top={0}
                                                                left={0}
                                                                bottom={0}
                                                                right={0}
                                                                position="absolute"
                                                                display="flex"
                                                                alignItems="center"
                                                                justifyContent="center"
                                                            >
                                                                <CircularProgress
                                                                    variant="static"
                                                                    size={20}
                                                                    value={100 - percent}
                                                                    style={{ color: '#ececec' }}
                                                                />
                                                            </Box>
                                                        </Box>
                                                    </Tooltip>
                                                </Grid>
                                            </Grid>
                                        );
                                    })}
                                </div>
                            </StandardCard>
                        </Grid>

                        {/* Library hours */}
                        <Grid item xs={12} md={4}>
                            <StandardCard
                                accentHeader
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
                                                    style={{ marginRight: -12, color: 'white' }}
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
                                <div
                                    style={{
                                        height: 275,
                                        overflowX: 'hidden',
                                        overflowY: 'auto',
                                        marginRight: -16,
                                        marginTop: -16,
                                        marginBottom: -24,
                                        marginLeft: -16,
                                        padding: 8,
                                    }}
                                >
                                    {locale.Hours.map((item, index) => {
                                        return (
                                            <Grid
                                                container
                                                spacing={2}
                                                key={index}
                                                style={{ borderBottom: '1px solid #EEE', padding: '8px 0 0 0' }}
                                            >
                                                <Grid item xs={5}>
                                                    {!!item.iconInfo ? (
                                                        <Tooltip
                                                            title={item.iconInfo || null}
                                                            placement="right"
                                                            TransitionProps={{ timeout: 300 }}
                                                        >
                                                            <a href={item.link} style={{ marginLeft: 8 }}>
                                                                {item.title}
                                                            </a>
                                                        </Tooltip>
                                                    ) : (
                                                        <a href={item.link} style={{ marginLeft: 8 }}>
                                                            {item.title}
                                                        </a>
                                                    )}
                                                </Grid>
                                                <Grid item xs>
                                                    {item.hours}
                                                </Grid>
                                                <Grid item xs={'auto'}>
                                                    {!!item.iconInfo ? (
                                                        <Tooltip
                                                            title={item.iconInfo}
                                                            placement="left"
                                                            TransitionProps={{ timeout: 300 }}
                                                        >
                                                            {item.icon}
                                                        </Tooltip>
                                                    ) : (
                                                        item.icon
                                                    )}
                                                </Grid>
                                            </Grid>
                                        );
                                    })}
                                </div>
                            </StandardCard>
                        </Grid>

                        {/* Course resources*/}
                        <Grid item xs={12} md={4}>
                            <StandardCard
                                fullHeight
                                accentHeader
                                title={
                                    <Grid container>
                                        <Grid item xs>
                                            Course resources
                                        </Grid>
                                    </Grid>
                                }
                            >
                                <Grid container spacing={1}>
                                    <Grid item xs>
                                        <TextField placeholder="Enter a course code to search" fullWidth />
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

                        {/* Training */}
                        <Grid item xs={12} md={4}>
                            <StandardCard
                                accentHeader
                                title={
                                    <Grid container>
                                        <Grid item xs>
                                            Training
                                        </Grid>
                                        <Grid item xs={'auto'}>
                                            <Tooltip
                                                id="auth-button"
                                                title={'More training'}
                                                placement="top"
                                                TransitionProps={{ timeout: 300 }}
                                            >
                                                <IconButton
                                                    size={'small'}
                                                    variant={'contained'}
                                                    style={{ marginRight: 0, color: 'white' }}
                                                    onClick={handleLocationClick}
                                                >
                                                    <OpenInNewIcon />
                                                </IconButton>
                                            </Tooltip>
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
                                                    style={{ marginRight: -12, color: 'white' }}
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
                                <div
                                    style={{
                                        height: 275,
                                        overflowX: 'hidden',
                                        overflowY: 'auto',
                                        marginRight: -16,
                                        marginTop: -16,
                                        marginBottom: -24,
                                        marginLeft: -16,
                                        padding: 8,
                                    }}
                                >
                                    {locale.Training.map((item, index) => {
                                        return (
                                            <Grid
                                                container
                                                spacing={2}
                                                key={index}
                                                style={{ borderBottom: '1px solid #EEE', padding: '8px 0 0 0' }}
                                                alignContent={'center'}
                                                alignItems={'center'}
                                            >
                                                <Grid item xs={3}>
                                                    <Grid
                                                        container
                                                        spacing={0}
                                                        alignContent={'center'}
                                                        alignItems={'center'}
                                                        justify={'center'}
                                                    >
                                                        <Grid item xs={12} aria-label={ordinal(item.dayDate)}>
                                                            <div
                                                                style={{
                                                                    fontFamily: 'DM Mono',
                                                                    color: 'purple',
                                                                    width: '2ch',
                                                                    textTransform: 'uppercase',
                                                                    overflow: 'hidden',
                                                                    whiteSpace: 'nowrap',
                                                                    margin: '0 auto',
                                                                    fontWeight: 300,
                                                                    fontSize: '1.2em',
                                                                }}
                                                            >
                                                                {ordinal(item.dayDate)}
                                                            </div>
                                                        </Grid>
                                                        <Grid
                                                            item
                                                            xs={12}
                                                            style={{
                                                                marginTop: -6,
                                                            }}
                                                            aria-label={item.day}
                                                        >
                                                            <div
                                                                style={{
                                                                    fontFamily: 'DM Mono',
                                                                    color: 'purple',
                                                                    width: '3ch',
                                                                    textTransform: 'uppercase',
                                                                    overflow: 'hidden',
                                                                    whiteSpace: 'nowrap',
                                                                    margin: '0 auto',
                                                                    fontWeight: 300,
                                                                    fontSize: '1.1em',
                                                                }}
                                                            >
                                                                {item.day}
                                                            </div>
                                                        </Grid>
                                                        <Grid
                                                            item
                                                            xs={12}
                                                            aria-label={item.monthDate}
                                                            style={{ marginTop: -6 }}
                                                        >
                                                            <div
                                                                style={{
                                                                    fontFamily: 'DM Mono',
                                                                    color: 'purple',
                                                                    width: '3ch',
                                                                    textTransform: 'uppercase',
                                                                    overflow: 'hidden',
                                                                    whiteSpace: 'nowrap',
                                                                    margin: '0 auto',
                                                                    fontWeight: 300,
                                                                    fontSize: '1.1em',
                                                                }}
                                                            >
                                                                {item.monthDate}
                                                            </div>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs>
                                                    <a
                                                        href={item.link}
                                                        aria-label={`${item.date} ${item.time} ${item.format} - ${item.title}`}
                                                    >
                                                        {item.title}
                                                    </a>
                                                    <br />
                                                    <span style={{ fontSize: '0.8rem', color: '#999' }}>
                                                        {item.date} - {item.time}
                                                        <br />
                                                        {item.format}
                                                    </span>
                                                </Grid>
                                            </Grid>
                                        );
                                    })}
                                </div>
                            </StandardCard>
                        </Grid>

                        {/* Library services */}
                        <Grid item xs={12} md={4}>
                            <StandardCard
                                fullHeight
                                accentHeader
                                squareTop={false}
                                title={
                                    <Grid container>
                                        <Grid item xs>
                                            Library services
                                        </Grid>
                                    </Grid>
                                }
                                fullHeight
                            >
                                <Grid container spacing={1}>
                                    {locale.LibraryServices.links.map((item, index) => {
                                        return (
                                            <Grid item xs={12} sm={12} key={index}>
                                                <a href={item.url}>{item.title}</a>
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            </StandardCard>
                        </Grid>

                        {/* Feedback */}
                        <Grid item xs={12} md={4}>
                            <StandardCard
                                customTitleBgColor={'rgb(100, 100, 100)'}
                                customTitleColor={'white'}
                                squareTop={false}
                                title={
                                    <Grid container>
                                        <Grid item xs>
                                            Feedback
                                        </Grid>
                                    </Grid>
                                }
                                fullHeight
                            >
                                <Grid container spacing={1}>
                                    <Grid item xs={12}>
                                        <Grid item xs={12} xl={6}>
                                            <Grid container spacing={1}>
                                                <Grid item xs={12}>
                                                    <Typography variant={'h6'}>Contact options</Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    Phone: +61 7 3506 2615
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={12}>
                                                Email: examsupport@library.uq.edu.au
                                            </Grid>
                                            <Grid item xs={12}>
                                                Library chat (opens in a new tab)
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </StandardCard>
                        </Grid>
                    </Grid>
                </div>
            </StandardPage>
        </LiveAnnouncer>
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
