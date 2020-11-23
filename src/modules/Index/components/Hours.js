import React from 'react';
import { PropTypes } from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { StandardCard } from '../../SharedComponents/Toolbox/StandardCard';
import Grid from '@material-ui/core/Grid';
import { useCookies } from 'react-cookie';
import matchSorter from 'match-sorter';
import RoomIcon from '@material-ui/icons/Room';
import Fade from '@material-ui/core/Fade';
import Badge from '@material-ui/core/Badge';
import CheckIcon from '@material-ui/icons/Check';
import Tooltip from '@material-ui/core/Tooltip';
import { hoursLocale } from './Hours.locale';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
    scrollArea: {
        overflowX: 'hidden',
        overflowY: 'auto',
        marginRight: 0,
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        padding: 8,
        color: theme.palette.secondary.dark,
        height: '100%',
    },
    row: {
        borderBottom: '1px solid #EEE',
        padding: '8px 0 0 0',
    },
    locationIcon: {
        color: theme.palette.white.main,
        marginTop: 6,
        marginBottom: -6,
    },
    badge: {
        backgroundColor: theme.palette.success.main,
        padding: 0,
        height: 12,
        width: 12,
        maxWidth: 12,
        minWidth: 12,
        right: 4,
        top: 2,
    },
    badgeIcon: {
        height: 10,
        width: 10,
        color: theme.palette.white.main,
    },
    listHeader: {
        backgroundColor: '#EEE',
        width: '100%',
        margin: 0,
        paddingLeft: 8,
        paddingRight: 24,
        paddingTop: 4,
        paddingBottom: 4,
        fontSize: 14,
        color: theme.palette.secondary.main,
    },
    actionButtonsLeft: {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
    },
    actionButtonsRight: {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 0,
    },
    selectedCampus: {
        fontWeight: 500,
    },
    flexWrapper: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    flexHeader: {
        height: 'auto',
    },
    flexContent: {
        flexGrow: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        [theme.breakpoints.down('sm')]: {
            overflowX: 'hidden',
            overflowY: 'hidden',
        },
    },
    flexFooter: {
        height: 'auto',
    },
    componentHeight: {
        [theme.breakpoints.down('sm')]: {
            height: '100%',
        },
        [theme.breakpoints.up('md')]: {
            height: 300,
        },
        [theme.breakpoints.up('lg')]: {
            height: 300,
        },
    },

    componentHeightPublic: {
        [theme.breakpoints.down('sm')]: {
            height: '100%',
        },
        [theme.breakpoints.up('md')]: {
            height: 300,
        },
        [theme.breakpoints.up('lg')]: {
            height: 232,
        },
    },
}));

const Hours = ({ libHours, libHoursLoading, account }) => {
    const classes = useStyles();
    const [cookies] = useCookies();
    const [location, setLocation] = React.useState(cookies.location || null);
    const [showIcon, setShowIcon] = React.useState(false);
    if (!!libHoursLoading) {
        return null;
    }
    const cleanedHours = libHours.locations.map(item => {
        const departments = item.departments.map(item => {
            return { name: item.name, hours: item.rendered };
        });
        if (item.abbr !== 'AskUs') {
            return {
                name: item.abbr,
                url: item.url,
                alt: item.name,
                campus: hoursLocale.campusMap[item.abbr],
                departments,
            };
        }
        return null;
    });
    const alphaHours = cleanedHours
        .filter(e => e !== null)
        .sort((a, b) => {
            const textA = a.name.toUpperCase();
            const textB = b.name.toUpperCase();
            // eslint-disable-next-line no-nested-ternary
            const result = textA < textB ? -1 : textA > textB ? 1 : 0;
            return result;
        });
    const sortedHours = matchSorter(alphaHours, cookies.location, {
        keys: ['campus'],
        threshold: matchSorter.rankings.NO_MATCH,
    });
    if (location !== cookies.location) {
        setShowIcon(true);
        setLocation(cookies.location);
        setTimeout(() => {
            setShowIcon(false);
        }, 5000);
    }
    const navigateToUrl = url => {
        window.location.href = url;
    };
    return (
        <StandardCard
            accentHeader
            title={
                <Grid container spacing={0} justify="center" alignItems="center">
                    <Grid item xs={'auto'}>
                        {hoursLocale.title}
                    </Grid>
                    <Grid item xs />
                    <Grid item xs={'auto'}>
                        <Fade in={showIcon} timeout={500}>
                            <Tooltip
                                title={hoursLocale.locationTooltip}
                                placement="bottom"
                                TransitionProps={{ timeout: 300 }}
                            >
                                <Badge
                                    classes={{ badge: classes.badge }}
                                    color="primary"
                                    badgeContent={<CheckIcon size="small" className={classes.badgeIcon} />}
                                >
                                    <RoomIcon />
                                </Badge>
                            </Tooltip>
                        </Fade>
                    </Grid>
                </Grid>
            }
            noPadding
        >
            <div
                className={`${classes.flexWrapper} ${
                    !account ? classes.componentHeightPublic : classes.componentHeight
                }`}
            >
                <div className={classes.flexHeader}>
                    {/* Header */}
                    <Grid container spacing={1} className={classes.listHeader}>
                        {hoursLocale.header.map((item, index) => {
                            return (
                                <Grid item xs={4} key={index}>
                                    {item}
                                </Grid>
                            );
                        })}
                    </Grid>
                </div>
                <div className={classes.flexContent}>
                    {/* Scrollable area */}
                    {!!sortedHours &&
                        sortedHours.length > 1 &&
                        sortedHours.map((item, index) => {
                            return (
                                <Grid
                                    container
                                    spacing={1}
                                    key={index}
                                    className={classes.row}
                                    alignItems={'flex-start'}
                                >
                                    <Grid item xs={4}>
                                        <a
                                            aria-label={item.name}
                                            href={item.url}
                                            style={{ marginLeft: 8 }}
                                            className={
                                                (cookies.location === item.campus && classes.selectedCampus) || ''
                                            }
                                        >
                                            {item.name}
                                        </a>
                                    </Grid>
                                    {item.departments.length > 0 &&
                                        item.departments.map((item, index) => {
                                            if (hoursLocale.departmentsMap.includes(item.name)) {
                                                return (
                                                    <Grid item xs key={index} style={{ fontSize: 14 }}>
                                                        {item.hours}
                                                    </Grid>
                                                );
                                            }
                                            return null;
                                        })}
                                </Grid>
                            );
                        })}
                </div>
                <div className={classes.flexFooter}>
                    {/* Buttons */}
                    <Grid container spacing={0}>
                        <Grid item xs>
                            <Button
                                classes={{ root: classes.actionButtonsLeft }}
                                size="small"
                                variant="contained"
                                color={hoursLocale.actionButtons[0].color}
                                disableElevation
                                fullWidth
                                onClick={() => navigateToUrl(hoursLocale.actionButtons[0].url)}
                            >
                                {hoursLocale.actionButtons[0].label}
                            </Button>
                        </Grid>
                        <Grid item xs>
                            <Button
                                classes={{ root: classes.actionButtonsRight }}
                                size="small"
                                variant="contained"
                                color={hoursLocale.actionButtons[1].color}
                                disableElevation
                                fullWidth
                                onClick={() => navigateToUrl(hoursLocale.actionButtons[1].url)}
                            >
                                {hoursLocale.actionButtons[1].label}
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </StandardCard>
    );
};

Hours.propTypes = {
    libHours: PropTypes.object,
    account: PropTypes.object,
    libHoursLoading: PropTypes.bool,
};

Hours.defaultProps = {};

export default Hours;
