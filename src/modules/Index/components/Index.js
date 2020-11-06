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
import { loadSpotlights } from 'actions';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import PrimoSearch from 'modules/SharedComponents/PrimoSearch/containers/PrimoSearch';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import { default as locale } from './locale';
import {
    seeCourseResources,
    seeComputerAvailability,
    seeFeedback,
    seeLibraryHours,
    seeLibraryServices,
    seeTraining,
} from 'helpers/access';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
const ordinal = require('ordinal');
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import Spotlights from './Spotlights';
const moment = require('moment');
import { makeStyles } from '@material-ui/styles';
import Badge from '@material-ui/core/Badge';
import { Location } from 'modules/SharedComponents/Location';
import { useCookies } from 'react-cookie';

const useStyles = makeStyles(theme => ({
    ppButton: {
        width: 24,
        minWidth: 24,
        height: 24,
        padding: 8,
        margin: 2,
        backgroundColor: theme.palette.accent.main,
        '&:hover': {
            backgroundColor: theme.palette.accent.dark,
        },
        '& svg': {
            width: 18,
            height: 18,
            padding: 4,
            color: theme.palette.white.main,
        },
    },
    ppBadgeError: {
        zIndex: 999,
        width: 12,
        minWidth: 12,
        height: 12,
        fontSize: 8,
        backgroundColor: 'red',
        left: -8,
        top: 8,
        padding: 1,
    },
    ppBadgeWarning: {
        zIndex: 999,
        width: 12,
        minWidth: 12,
        height: 12,
        fontSize: 8,
        backgroundColor: 'orange',
        left: -8,
        top: 8,
        padding: 1,
    },
    ppBadgeInfo: {
        zIndex: 999,
        width: 12,
        minWidth: 12,
        height: 12,
        fontSize: 8,
        backgroundColor: '#656565',
        left: -8,
        top: 8,
        padding: 1,
    },
}));

export const Index = ({ account, spotlights, spotlightsLoading }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    // Load spotlights if they havent been already
    useEffect(() => {
        if (spotlightsLoading === null) {
            dispatch(loadSpotlights());
        }
    }, [spotlightsLoading, dispatch]);

    // Location cookie and setting
    const [cookies, setCookie] = useCookies(['location']);
    const [location, setLocation] = React.useState(cookies.location || null);
    if (!cookies.location) {
        setCookie('location', location);
    }
    useEffect(() => {
        if (!!cookies.location && cookies.location !== location) {
            setCookie('location', location);
        }
    }, [location, cookies.location, setCookie]);
    const handleLocationChange = location => {
        if (location !== cookies.location) {
            setLocation(location);
        }
    };

    // Papercut settings
    const [anchorPapercutEl, setAnchorPapercutEl] = React.useState(null);
    const handlePapercutClick = event => {
        setAnchorPapercutEl(event.currentTarget);
    };
    const handlePapercutClose = () => {
        setAnchorPapercutEl(null);
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
        <StandardPage>
            <div className="layout-card">
                <Grid container spacing={6}>
                    {/* Search */}
                    <Grid item xs={12}>
                        <PrimoSearch />
                    </Grid>
                    {/* Spotlights */}
                    <Grid item xs={12} md={8} id="spotlights" data-testid="spotlights">
                        <Spotlights spotlights={spotlights} spotlightsLoading={spotlightsLoading} />
                    </Grid>

                    {/* Personalisation panel or hours */}
                    {!!account ? (
                        <Hidden smDown>
                            <Grid item xs={12} md={4} style={{ paddingLeft: 16, paddingTop: 28 }}>
                                <Grid
                                    container
                                    spacing={1}
                                    style={{ borderLeft: '1px solid #CCCCCC', paddingLeft: 6, height: '100%' }}
                                    justify={'flex-end'}
                                >
                                    {account && account.id && (
                                        <Grid item xs={12} style={{ marginTop: -16 }} data-testid="personal-panel">
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
                                                onClick={handlePapercutClick}
                                            >
                                                <Grid item xs style={{ lineHeight: '30px' }}>
                                                    <Typography style={{ color: '#316799' }}>
                                                        Manage your print balance ($12.50)
                                                    </Typography>
                                                </Grid>
                                                <Menu
                                                    id="simple-menu"
                                                    anchorEl={anchorPapercutEl}
                                                    keepMounted
                                                    open={Boolean(anchorPapercutEl)}
                                                    onClose={handlePapercutClose}
                                                    onBlur={handlePapercutClose}
                                                >
                                                    <MenuItem disabled>Manage your PaperCut account</MenuItem>
                                                    <MenuItem onClick={handlePapercutClose}>
                                                        Log in and manage your print balance
                                                    </MenuItem>
                                                    <MenuItem onClick={handlePapercutClose}>
                                                        Top up your print balance - $5
                                                    </MenuItem>
                                                    <MenuItem onClick={handlePapercutClose}>
                                                        Top up your print balance - $10
                                                    </MenuItem>
                                                    <MenuItem onClick={handlePapercutClose}>
                                                        Top up your print balance - $20
                                                    </MenuItem>
                                                </Menu>
                                                <Grid item xs={'auto'}>
                                                    <Tooltip
                                                        id="auth-button"
                                                        title={'Manage your print balance'}
                                                        placement="left"
                                                        TransitionProps={{ timeout: 300 }}
                                                    >
                                                        <Button
                                                            size={'small'}
                                                            variant={'contained'}
                                                            className={classes.ppButton}
                                                        >
                                                            <PrintIcon />
                                                        </Button>
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
                                                    <Typography style={{ color: '#316799' }}>
                                                        Manage your library loans (2 overdue)
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={'auto'}>
                                                    <Tooltip
                                                        id="auth-button"
                                                        title={'Manage your item loans (6 current | 2 overdue)'}
                                                        placement="left"
                                                        TransitionProps={{ timeout: 300 }}
                                                    >
                                                        <Badge
                                                            badgeContent={2}
                                                            color="error"
                                                            classes={{ badge: classes.ppBadgeWarning }}
                                                        >
                                                            <Button
                                                                size={'small'}
                                                                variant={'contained'}
                                                                className={classes.ppButton}
                                                            >
                                                                <MenuBookIcon />
                                                            </Button>
                                                        </Badge>
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
                                                    <Typography style={{ color: '#316799' }}>
                                                        Pay overdue fines (1 outstanding)
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={'auto'}>
                                                    <Tooltip
                                                        id="auth-button"
                                                        title={'Pay your overdue fines | 1 outstanding'}
                                                        placement="left"
                                                        TransitionProps={{ timeout: 300 }}
                                                    >
                                                        <Badge
                                                            badgeContent={1}
                                                            color="error"
                                                            classes={{ badge: classes.ppBadgeError }}
                                                        >
                                                            <Button
                                                                size={'small'}
                                                                variant={'contained'}
                                                                className={classes.ppButton}
                                                            >
                                                                <MonetizationOnIcon />
                                                            </Button>
                                                        </Badge>
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
                                                    <Typography style={{ color: '#316799' }}>
                                                        Manage room bookings
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={'auto'}>
                                                    <Tooltip
                                                        id="auth-button"
                                                        title={'Manage your room bookings (1 today)'}
                                                        placement="left"
                                                        TransitionProps={{ timeout: 300 }}
                                                    >
                                                        <Button
                                                            size={'small'}
                                                            variant={'contained'}
                                                            className={classes.ppButton}
                                                        >
                                                            <MeetingRoomIcon />
                                                        </Button>
                                                    </Tooltip>
                                                </Grid>
                                            </MenuItem>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Hidden>
                    ) : (
                        <Grid item xs={12} md={4}>
                            <StandardCard
                                accentHeader
                                title={
                                    <Grid container data-testid="library-hours-panel-noaccount">
                                        <Grid item xs>
                                            Library hours
                                        </Grid>
                                        <Grid item xs={'auto'}>
                                            <Location
                                                handleLocationChange={handleLocationChange}
                                                currentLocation={location}
                                                idLabel="libraryHours"
                                            />
                                        </Grid>
                                    </Grid>
                                }
                                fullHeight
                            >
                                <div
                                    style={{
                                        height: 200,
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
                    )}

                    {/* Comp Avail */}
                    {seeComputerAvailability(account) && (
                        <Grid item xs={12} md={4} data-testid="computer-availability-panel">
                            <StandardCard
                                accentHeader
                                title={
                                    <Grid container>
                                        <Grid item xs>
                                            Computer availability
                                        </Grid>
                                        <Grid item xs={'auto'}>
                                            <Location
                                                handleLocationChange={handleLocationChange}
                                                currentLocation={location}
                                                idLabel="computerAvailability"
                                            />
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
                                                                thickness={10}
                                                                variant="static"
                                                                value={percent}
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
                                                                    thickness={10}
                                                                    value={percent - 100}
                                                                    style={{
                                                                        color: circleColor(percent),
                                                                        opacity: 0.2,
                                                                    }}
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
                    )}

                    {/* Library hours or training */}
                    {seeLibraryHours(account) && (
                        <Grid item xs={12} md={4} data-testid="library-hours-panel">
                            <StandardCard
                                accentHeader
                                title={
                                    <Grid container>
                                        <Grid item xs>
                                            Library hours
                                        </Grid>
                                        <Grid item xs={'auto'}>
                                            <Location
                                                handleLocationChange={handleLocationChange}
                                                currentLocation={location}
                                                idLabel="libraryHours"
                                            />
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
                    )}
                    {/* Course resources*/}
                    {!!seeCourseResources(account) && (
                        <Grid item xs={12} md={4} data-testid="course-resources-panel">
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
                    )}

                    {/* Training */}
                    {seeTraining && (
                        <Grid item xs={12} md={4} data-testid="training-panel">
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
                                                >
                                                    <OpenInNewIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Grid>
                                        <Grid item xs={'auto'}>
                                            <Location
                                                handleLocationChange={handleLocationChange}
                                                currentLocation={location}
                                                idLabel="training"
                                            />
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
                    )}

                    {/* Library services */}
                    {seeLibraryServices && (
                        <Grid item xs={12} md={4} data-testid="library-services-panel">
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
                    )}

                    {/* Feedback */}
                    {seeFeedback && (
                        <Grid item xs={12} md={4} data-testid="feedback-panel">
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
                    )}
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
