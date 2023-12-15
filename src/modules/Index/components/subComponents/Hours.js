import React, { useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { makeStyles } from '@mui/styles';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import Grid from '@mui/material/Grid';
import { useCookies } from 'react-cookie';
import matchSorter from 'match-sorter';
import RoomIcon from '@mui/icons-material/Room';
import Fade from '@mui/material/Fade';
import Badge from '@mui/material/Badge';
import CheckIcon from '@mui/icons-material/Check';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { hoursLocale } from './Hours.locale';
import Button from '@mui/material/Button';
import ContentLoader from 'react-content-loader';

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
        color: theme.palette.secondary.light,
    },
    actionButtonsLeft: {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        backgroundColor: theme.palette.secondary.light,
        color: '#fff',
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
        whiteSpace: 'nowrap',
    },
    flexContent: {
        flexGrow: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        [theme.breakpoints.down('md')]: {
            overflowX: 'hidden',
            overflowY: 'hidden',
        },
    },
    flexFooter: {
        height: 'auto',
    },
    componentHeight: {
        [theme.breakpoints.down('md')]: {
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
        [theme.breakpoints.down('md')]: {
            height: '100%',
        },
        [theme.breakpoints.up('md')]: {
            height: 232,
        },
        [theme.breakpoints.up('lg')]: {
            height: 232,
        },
    },
    loaderContent: {
        flexGrow: 1,
        overflowY: 'hidden',
        overflowX: 'hidden',
    },
}));

const MyLoader = props => (
    <ContentLoader
        uniqueKey="hours"
        speed={2}
        width={'100%'}
        height={'100%'}
        viewBox="0 0 365 250"
        backgroundColor="#f3f3f3"
        foregroundColor="#e2e2e2"
        {...props}
    >
        <rect x="5%" y="15" rx="3" ry="3" width="21%" height="14" />
        <rect x="35%" y="15" rx="3" ry="3" width="18%" height="14" />
        <rect x="65%" y="15" rx="3" ry="3" width="22%" height="14" />
        <rect x="0" y="40" rx="3" ry="3" width="100%" height="1" />

        <rect x="5%" y="55" rx="3" ry="3" width="18%" height="14" />
        <rect x="35%" y="55" rx="3" ry="3" width="21%" height="14" />
        <rect x="65%" y="55" rx="3" ry="3" width="23%" height="14" />
        <rect x="0" y="80" rx="3" ry="3" width="100%" height="1" />

        <rect x="5%" y="95" rx="3" ry="3" width="12%" height="14" />
        <rect x="35%" y="95" rx="3" ry="3" width="10%" height="14" />
        <rect x="65%" y="95" rx="3" ry="3" width="20%" height="14" />
        <rect x="0" y="120" rx="3" ry="3" width="100%" height="1" />

        <rect x="5%" y="135" rx="3" ry="3" width="21%" height="14" />
        <rect x="35%" y="135" rx="3" ry="3" width="19%" height="14" />
        <rect x="65%" y="135" rx="3" ry="3" width="17%" height="14" />
        <rect x="0" y="160" rx="3" ry="3" width="100%" height="1" />

        <rect x="5%" y="175" rx="3" ry="3" width="19%" height="14" />
        <rect x="35%" y="175" rx="3" ry="3" width="10%" height="14" />
        <rect x="65%" y="175" rx="3" ry="3" width="12%" height="14" />
        <rect x="0" y="200" rx="3" ry="3" width="100%" height="1" />

        <rect x="5%" y="215" rx="3" ry="3" width="23%" height="14" />
        <rect x="35%" y="215" rx="3" ry="3" width="18%" height="14" />
        <rect x="65%" y="215" rx="3" ry="3" width="17%" height="14" />
        <rect x="0" y="240" rx="3" ry="3" width="100%" height="1" />
    </ContentLoader>
);
export const ariaLabelForLocation = item => {
    const name = item.name;
    const hours =
        item.departments.length > 0 &&
        item.departments.map(i => {
            if (hoursLocale.departmentsMap.includes(i.name)) {
                return i.hours;
            }
            return null;
        });
    const studySpaceHours = `${name || /* istanbul ignore next */ ''}. ${
        !!hours[0] ? 'Study space hours are ' + hours[0] : ''
    }`;
    const askUsHours = !!hours[1] ? 'Ask Us hours are ' + hours[1] : '';
    const hoursConjunction = !!hours[0] && !!hours[1] ? 'and' : '';
    return `${studySpaceHours} ${hoursConjunction} ${askUsHours}`;
};

function departmentProvided(item) {
    return !!item && !!item.departments && Array.isArray(item.departments) && item.departments.length > 0;
}

export const hasDepartments = item => {
    const departments =
        !!departmentProvided(item) &&
        item.departments.map(item => {
            if (hoursLocale.departmentsMap.includes(item.name)) {
                return item.name;
            }
            return null;
        });
    const displayableDepartments =
        !!departmentProvided(item) &&
        departments.filter(el => {
            return el !== null;
        });
    return displayableDepartments.length > 0;
};

const Hours = ({ libHours, libHoursLoading, libHoursError, account }) => {
    const classes = useStyles();
    const [cookies] = useCookies();
    const [location, setLocation] = React.useState(cookies.location || undefined);
    const [showIcon, setShowIcon] = React.useState(false);
    useEffect(() => {
        if (location !== cookies.location) {
            setShowIcon(true);
            setLocation(cookies.location);
            setTimeout(() => {
                setShowIcon(false);
            }, 5000);
        }
    }, [location, cookies]);
    const cleanedHours =
        (!libHoursError &&
            !!libHours &&
            !!libHours.locations &&
            libHours.locations.length > 0 &&
            libHours.locations.map(item => {
                let departments = [];
                if (!!departmentProvided(item)) {
                    departments = item.departments.map(item => {
                        return {
                            name: item.name,
                            hours: item.rendered,
                        };
                    });
                }
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
            })) ||
        [];
    const alphaHours = cleanedHours
        .filter(e => e !== null)
        .sort((a, b) => {
            const textA = a.name.toUpperCase();
            const textB = b.name.toUpperCase();
            // eslint-disable-next-line no-nested-ternary
            return textA < textB ? -1 : textA > textB ? 1 : /* istanbul ignore next */ 0;
        });
    const sortedHours = matchSorter(alphaHours, cookies.location, {
        keys: ['campus'],
        threshold: matchSorter.rankings.NO_MATCH,
    });
    const navigateToUrl = url => {
        window.location.href = url;
    };
    return (
        <StandardCard
            primaryHeader
            title={
                <Grid container spacing={0} justifyContent="center" alignItems="center">
                    <Grid item xs={'auto'}>
                        {hoursLocale.title}
                    </Grid>
                    <Grid item xs />
                    <Grid item xs={'auto'}>
                        {showIcon && (
                            <Fade in={!!showIcon} timeout={500}>
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
                                        <RoomIcon data-testid="hours-wiggler" />
                                    </Badge>
                                </Tooltip>
                            </Fade>
                        )}
                    </Grid>
                </Grid>
            }
            noPadding
        >
            <div
                className={`${classes.flexWrapper} ${
                    !!account && !!account.id ? classes.componentHeight : classes.componentHeightPublic
                }`}
            >
                {!libHoursError && (
                    <div className={classes.flexHeader}>
                        {/* Header */}
                        <Grid container spacing={1} className={classes.listHeader}>
                            {hoursLocale.header.map((item, index) => {
                                return (
                                    <Grid item xs={item.width} key={index}>
                                        {item.name}
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </div>
                )}
                {!!libHoursError && (
                    /* istanbul ignore next */ <Fade in={!libHoursLoading} timeout={1000}>
                        <div className={classes.flexContent}>
                            <Typography style={{ padding: '1rem' }}>{hoursLocale.unavailable}</Typography>
                        </div>
                    </Fade>
                )}
                {!libHoursError && !!libHours && !libHoursLoading && (
                    <Fade in={!libHoursLoading} timeout={1000}>
                        <div className={classes.flexContent}>
                            {/* Scrollable area */}
                            {!!sortedHours &&
                                sortedHours.length > 1 &&
                                sortedHours.map((item, index) => {
                                    return (
                                        <Grid
                                            container
                                            data-testid={`hours-item-${index}`}
                                            spacing={1}
                                            key={index}
                                            className={classes.row}
                                            alignItems={'flex-start'}
                                            style={{ marginLeft: 8, width: '98%' }}
                                        >
                                            <Grid item xs={5}>
                                                <a
                                                    aria-label={ariaLabelForLocation(item)}
                                                    data-analyticsid={`hours-item-${index}`}
                                                    href={item.url}
                                                    className={
                                                        (cookies.location === item.campus && classes.selectedCampus) ||
                                                        ''
                                                    }
                                                >
                                                    {item.name}
                                                </a>
                                            </Grid>
                                            {hasDepartments(item) ? (
                                                item.departments.map((department, index) => {
                                                    if (hoursLocale.departmentsMap.includes(department.name)) {
                                                        return (
                                                            <Grid item xs key={index} style={{ fontSize: 14 }}>
                                                                {department.hours}
                                                            </Grid>
                                                        );
                                                    }
                                                    return null;
                                                })
                                            ) : (
                                                <Grid item xs key={index} style={{ fontSize: 14 }}>
                                                    {hoursLocale.noDepartments}
                                                </Grid>
                                            )}
                                        </Grid>
                                    );
                                })}
                        </div>
                    </Fade>
                )}
                {!libHoursError && !(!!libHours && !libHoursLoading) && (
                    <div className={classes.loaderContent}>
                        <MyLoader id="hours-loader" data-testid="hours-loader" aria-label="Hours data is laoding" />
                    </div>
                )}
                <div className={classes.flexFooter}>
                    {/* Buttons */}
                    <Grid container spacing={0}>
                        <Grid item xs>
                            <Button
                                classes={{ root: classes.actionButtonsLeft }}
                                data-testid="homepage-hours-weeklyhours-link"
                                data-analyticsid={'hours-item-weeklyhours-link'}
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
                                data-testid="homepage-hours-bookit-link"
                                data-analyticsid={'hours-item-bookit-link'}
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
    libHoursError: PropTypes.bool,
};

Hours.defaultProps = {};

export default Hours;
