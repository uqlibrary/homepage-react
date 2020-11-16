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
}));

const Hours = ({ libHours, libHoursLoading, height = 300 }) => {
    const classes = useStyles();
    const [cookies] = useCookies();
    const [location, setLocation] = React.useState(cookies.location || null);
    const [showIcon, setShowIcon] = React.useState(false);
    if (!!libHoursLoading) {
        return null;
    }
    const campusMap = {
        'Arch Music': 'St Lucia',
        AskUs: 'Online',
        'Biol Sci': 'St Lucia',
        Central: 'St Lucia',
        DHEngSci: 'St Lucia',
        'Duhig Study': 'St Lucia',
        Fryer: 'St Lucia',
        Gatton: 'Gatton',
        Herston: 'Herston',
        Law: 'St Lucia',
        'Whitty Mater': 'Other',
        PACE: 'Other',
        Bundaberg: 'Other',
        HerveyBay: 'Other',
        Rockhampton: 'Other',
        Toowoomba: 'Other',
    };
    const departmentsMap = ['Service', 'Study space'];
    const cleanedHours = libHours.locations.map(item => {
        const departments = item.departments.map(item => {
            return { name: item.name, hours: item.rendered };
        });
        return {
            name: item.abbr,
            campus: campusMap[item.abbr],
            departments,
        };
    });
    const sortedHours = matchSorter(cleanedHours, cookies.location, {
        keys: ['campus'],
        threshold: 0,
    });
    if (location !== cookies.location) {
        setShowIcon(true);
        setLocation(cookies.location);
        setTimeout(() => {
            setShowIcon(false);
        }, 5000);
    }
    return (
        <StandardCard
            accentHeader
            title={
                <Grid container spacing={0} justify="center" alignItems="center">
                    <Grid item xs={'auto'}>
                        Library Hours
                    </Grid>
                    <Grid item xs />
                    <Grid item xs={'auto'}>
                        <Fade in={showIcon} timeout={500}>
                            <Tooltip
                                title={'Your preferred campus has been updated'}
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
            fullHeight
            noPadding
        >
            <Grid container spacing={1} className={classes.listHeader}>
                <Grid item xs={4}>
                    Location
                </Grid>
                <Grid item xs={4}>
                    Study space
                </Grid>
                <Grid item xs={4}>
                    Service desk
                </Grid>
            </Grid>
            <div className={classes.scrollArea} style={{ height: height }}>
                {!!sortedHours &&
                    sortedHours.length > 1 &&
                    sortedHours.map((item, index) => {
                        return (
                            <Grid container spacing={1} key={index} className={classes.row} alignItems={'flex-start'}>
                                <Grid item xs={4}>
                                    <a href={item.url} style={{ marginLeft: 8 }}>
                                        {item.name}
                                    </a>
                                </Grid>
                                {item.departments.length > 0 &&
                                    item.departments.map((item, index) => {
                                        if (departmentsMap.includes(item.name)) {
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
        </StandardCard>
    );
};

Hours.propTypes = {
    libHours: PropTypes.object,
    libHoursLoading: PropTypes.bool,
    height: PropTypes.number,
};

Hours.defaultProps = {};

export default Hours;
