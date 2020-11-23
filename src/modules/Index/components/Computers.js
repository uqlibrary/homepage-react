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
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
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
    linkButton: {
        padding: 0,
        minWidth: 0,
        marginTop: -2,
        marginBottom: -2,
    },
    linkButtonLabel: {
        textTransform: 'capitalize',
        textAlign: 'left',
        fontSize: 16,
        color: '#3872a8', // theme.palette.accent.dark,
        fontWeight: 300,
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
    },
}));

const Computers = ({ computerAvailability, computerAvailabilityLoading }) => {
    const classes = useStyles();
    const [cookies] = useCookies();
    const [location, setLocation] = React.useState(cookies.location || null);
    const [showIcon, setShowIcon] = React.useState(false);
    const [collapse, setCollapse] = React.useState({});
    const [mapSrc, setMapSrc] = React.useState(null);
    if (!!computerAvailabilityLoading) {
        return null;
    }
    const cleanedAvailability = computerAvailability.map(item => {
        const levels = Object.keys(item.availability);
        const totalLevels = levels.length;
        let levelsData = [];
        if (totalLevels > 0) {
            levelsData = levels
                .map(level => {
                    return {
                        level: parseInt(level.replace('Level ', ''), 10),
                        roomCode: parseInt(item.availability[level].roomCode, 10),
                        available: item.availability[level].Available,
                        occupied: item.availability[level].Occupied,
                        total: item.availability[level].Available + item.availability[level].Occupied,
                        floorplan: item.availability[level].floorplan,
                    };
                })
                .sort((a, b) => a.level - b.level);
        }
        return {
            library: item.library.replace('&amp;', '&'),
            levels: levelsData,
            buildingCode: parseInt(item.buildingCode, 10),
            buildingNumber: parseInt(item.buildingNumber, 10),
            campus: computersLocale.campusMap[item.library],
        };
    });
    const alphaAvailability = cleanedAvailability
        .filter(e => e !== null)
        .sort((a, b) => {
            const textA = a.library.toUpperCase();
            const textB = b.library.toUpperCase();
            // eslint-disable-next-line no-nested-ternary
            const result = textA < textB ? -1 : textA > textB ? 1 : 0;
            return result;
        });
    const sortedComputers = matchSorter(alphaAvailability, cookies.location, {
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
    const handleCollapse = index => {
        if (collapse[index]) {
            setCollapse({ [index]: false });
        } else {
            setCollapse({ [index]: true });
        }
    };
    const closeMap = () => {
        setMapSrc(null);
    };
    const openMap = (library, building, room, level) => {
        setMapSrc({ library, building, room, level });
    };
    const MapPopup = ({}) => {
        if (!!mapSrc) {
            return (
                <Dialog
                    onClose={() => closeMap()}
                    aria-label="UQ Library map"
                    open={!!mapSrc}
                    maxWidth={'lg'}
                    PaperProps={{
                        style: {
                            backgroundColor: 'transparent',
                            width: '66%',
                            height: '66%',
                        },
                    }}
                >
                    <Grid
                        container
                        spacing={0}
                        style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: '#000020',
                            padding: 20,
                            overflow: 'hidden',
                        }}
                    >
                        <Grid item xs>
                            <Typography variant={'h5'} style={{ color: 'white', marginTop: -6 }}>
                                {mapSrc.library} - Level {mapSrc.level}
                            </Typography>
                        </Grid>
                        <Grid item xs={'auto'}>
                            <IconButton onClick={() => closeMap()} style={{ color: 'white', marginTop: -16 }}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Grid>
                        <Grid item xs={12} style={{ height: '100%', padding: '32px 0' }}>
                            <iframe
                                src={`https://www.library.uq.edu.au/uqlsm/map.php?building=${mapSrc.building}&room=${mapSrc.room}&embed=true`}
                                style={{
                                    width: '90%',
                                    height: '90%',
                                    margin: '0 5% 10% 5%',
                                    overflow: 'hidden',
                                    border: 'none',
                                }}
                            />
                        </Grid>
                    </Grid>
                </Dialog>
            );
        }
        return null;
    };
    return (
        <StandardCard
            accentHeader
            title={
                <Grid container spacing={0} justify="center" alignItems="center">
                    <Grid item xs={11} style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {computersLocale.title}
                    </Grid>
                    <Grid item xs={1}>
                        {showIcon && (
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
                        )}
                    </Grid>
                </Grid>
            }
            noPadding
        >
            <MapPopup />
            <div className={`${classes.flexWrapper} ${classes.componentHeight}`}>
                <div className={classes.flexContent}>
                    {!!sortedComputers &&
                        sortedComputers.length > 1 &&
                        sortedComputers.map((item, index) => {
                            const add = (a, b) => a + b;
                            const buildingAvail = item.levels.map(level => level.available).reduce(add);
                            const buildingTotal = item.levels
                                .map(level => level.occupied + level.available)
                                .reduce(add);
                            return (
                                <React.Fragment key={index}>
                                    <Grid
                                        container
                                        spacing={1}
                                        className={classes.row}
                                        justify="center"
                                        alignItems="center"
                                    >
                                        <Grid item xs style={{ paddingLeft: 16 }}>
                                            <Button
                                                onClick={() => handleCollapse(index)}
                                                classes={{
                                                    root: classes.linkButton,
                                                    label: `${classes.linkButtonLabel} ${
                                                        cookies.location === item.campus ? classes.selectedCampus : ''
                                                    }`,
                                                }}
                                                aria-label={`${item.library} - ${buildingAvail} of ${buildingTotal} free. Click to review each level`}
                                            >
                                                {item.library}
                                            </Button>
                                        </Grid>
                                        <Grid item xs={'auto'} style={{ fontSize: 14, marginRight: 16 }}>
                                            {buildingAvail} of {buildingTotal} free
                                        </Grid>
                                    </Grid>
                                    {item.levels.length > 0 &&
                                        item.levels.map((level, levelIndex) => (
                                            <Collapse
                                                in={collapse[index]}
                                                timeout="auto"
                                                unmountOnExit
                                                key={levelIndex}
                                            >
                                                <Grid
                                                    container
                                                    spacing={1}
                                                    className={classes.row}
                                                    justify="center"
                                                    alignItems="center"
                                                >
                                                    <Grid item xs style={{ paddingLeft: 32 }}>
                                                        <Button
                                                            onClick={() =>
                                                                openMap(
                                                                    item.library,
                                                                    item.buildingCode,
                                                                    level.roomCode,
                                                                    level.level,
                                                                )
                                                            }
                                                            classes={{
                                                                root: classes.linkButton,
                                                                label: `${classes.linkButtonLabel} ${
                                                                    cookies.location === item.campus
                                                                        ? classes.selectedCampus
                                                                        : ''
                                                                }`,
                                                            }}
                                                        >
                                                            Level {level.level}
                                                        </Button>
                                                    </Grid>
                                                    <Grid xs item />
                                                    <Grid item xs={'auto'} style={{ fontSize: 14 }}>
                                                        {level.available} of {level.available + level.occupied}{' '}
                                                        available
                                                    </Grid>
                                                </Grid>
                                            </Collapse>
                                        ))}
                                </React.Fragment>
                            );
                        })}
                </div>
            </div>
        </StandardCard>
    );
};

Computers.propTypes = {
    computerAvailability: PropTypes.array,
    computerAvailabilityLoading: PropTypes.bool,
};

Computers.defaultProps = {};

export default Computers;
