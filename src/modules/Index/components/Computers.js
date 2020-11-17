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
import { computersLocale } from './Computers.locale';

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
}));

const Computers = ({ computerAvailability, computerAvailabilityLoading, height = 300 }) => {
    const classes = useStyles();
    const [cookies] = useCookies();
    const [location, setLocation] = React.useState(cookies.location || null);
    const [showIcon, setShowIcon] = React.useState(false);
    if (!!computerAvailabilityLoading) {
        return null;
    }
    const cleanedAvailability = computerAvailability.map(item => {
        const levels = Object.keys(item.availability);
        const totalLevels = levels.length;
        let levelsData = [];
        if (totalLevels > 0) {
            levelsData = levels.map(level => {
                return {
                    level: parseInt(level.replace('Level ', ''), 10),
                    roomCode: parseInt(item.availability[level].roomCode, 10),
                    available: item.availability[level].Available,
                    occupied: item.availability[level].Occupied,
                    total: item.availability[level].Available + item.availability[level].Occupied,
                    floorplan: item.availability[level].floorplan,
                };
            });
        }
        return {
            library: item.library.replace('&amp;', '&'),
            levels: levelsData,
            buildingCode: parseInt(item.buildingCode, 10),
            buildingNumber: parseInt(item.buildingNumber, 10),
            campus: computersLocale.campusMap[item.library],
        };
    });
    const sortedComputers = matchSorter(cleanedAvailability, cookies.location, {
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
    return (
        <StandardCard
            accentHeader
            title={
                <Grid container spacing={0} justify="center" alignItems="center">
                    <Grid item xs={'auto'}>
                        {computersLocale.title}
                    </Grid>
                    <Grid item xs />
                    <Grid item xs={'auto'}>
                        <Fade in={showIcon} timeout={500}>
                            <Tooltip
                                title={computersLocale.locationTooltip}
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
                {computersLocale.header.map((item, index) => {
                    return (
                        <Grid item xs={item.size} key={index}>
                            {item.title}
                        </Grid>
                    );
                })}
            </Grid>
            <div className={classes.scrollArea} style={{ height: height }}>
                {!!sortedComputers &&
                    sortedComputers.length > 1 &&
                    sortedComputers.map((item, index) => {
                        const add = (a, b) => a + b;
                        const buildingAvail = item.levels.map(level => level.available).reduce(add);
                        const buildingTotal = item.levels.map(level => level.occupied + level.available).reduce(add);
                        return (
                            <Grid container spacing={1} key={index} className={classes.row} alignItems={'flex-start'}>
                                <Grid item xs style={{ paddingLeft: 8 }}>
                                    <a
                                        aria-label={item.library}
                                        href={'#'}
                                        className={(cookies.location === item.campus && classes.selectedCampus) || ''}
                                    >
                                        {item.library}
                                    </a>
                                </Grid>
                                <Grid item xs={'auto'} style={{ fontSize: 14 }}>
                                    {buildingAvail} free of {buildingTotal}
                                </Grid>
                            </Grid>
                        );
                    })}
            </div>
        </StandardCard>
    );
};

Computers.propTypes = {
    computerAvailability: PropTypes.array,
    computerAvailabilityLoading: PropTypes.bool,
    height: PropTypes.number,
};

Computers.defaultProps = {};

export default Computers;
