import React, { useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import Grid from '@mui/material/Grid';
import { useCookies } from 'react-cookie';
import matchSorter from 'match-sorter';
import RoomIcon from '@mui/icons-material/Room';
import Fade from '@mui/material/Fade';
import Badge from '@mui/material/Badge';
import CheckIcon from '@mui/icons-material/Check';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { computersLocale } from './Computers.locale';
import { locale as locationLocale } from 'modules/SharedComponents/Location/components/locale';
import ContentLoader from 'react-content-loader';
import { obfusticateUsername } from 'helpers/general';
import { LOCATION_COOKIE_NAME } from 'config/general';
import { styled } from '@mui/material/styles';

const MyLoader = props => (
    <ContentLoader
        speed={2}
        uniqueKey="computers"
        width={'100%'}
        height={'100%'}
        viewBox="0 0 365 300"
        backgroundColor="#f3f3f3"
        foregroundColor="#e2e2e2"
        {...props}
    >
        <rect x="5%" y="15" rx="3" ry="3" width="50%" height="14" />
        <rect x="70%" y="15" rx="3" ry="3" width="20%" height="14" />
        <rect x="0" y="40" rx="3" ry="3" width="100%" height="1" />

        <rect x="5%" y="55" rx="3" ry="3" width="52%" height="14" />
        <rect x="70%" y="55" rx="3" ry="3" width="19%" height="14" />
        <rect x="0" y="80" rx="3" ry="3" width="100%" height="1" />

        <rect x="5%" y="95" rx="3" ry="3" width="47%" height="14" />
        <rect x="70%" y="95" rx="3" ry="3" width="21%" height="14" />
        <rect x="0" y="120" rx="3" ry="3" width="100%" height="1" />

        <rect x="5%" y="135" rx="3" ry="3" width="50%" height="14" />
        <rect x="70%" y="135" rx="3" ry="3" width="20%" height="14" />
        <rect x="0" y="160" rx="3" ry="3" width="100%" height="1" />

        <rect x="5%" y="175" rx="3" ry="3" width="52%" height="14" />
        <rect x="70%" y="175" rx="3" ry="3" width="19%" height="14" />
        <rect x="0" y="200" rx="3" ry="3" width="100%" height="1" />

        <rect x="5%" y="215" rx="3" ry="3" width="50%" height="14" />
        <rect x="70%" y="215" rx="3" ry="3" width="20%" height="14" />
        <rect x="0" y="240" rx="3" ry="3" width="100%" height="1" />

        <rect x="5%" y="255" rx="3" ry="3" width="47%" height="14" />
        <rect x="70%" y="255" rx="3" ry="3" width="21%" height="14" />
        <rect x="0" y="280" rx="3" ry="3" width="100%" height="1" />
    </ContentLoader>
);

const StyledWrapper = styled('div')(({ theme }) => ({
    ['&.flexWrapper']: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    ['&.componentHeight']: {
        [theme.breakpoints.down('md')]: {
            height: '100%',
        },
        [theme.breakpoints.up('md')]: {
            height: 300,
        },
    },
    ['&.componentHeightPublic']: {
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
    ['& .scrollArea']: {
        overflowX: 'hidden',
        overflowY: 'auto',
        marginRight: 0,
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        padding: 8,
        color: theme.palette.secondary.dark,
    },
    ['& .row']: {
        borderBottom: '1px solid #EEE',
        padding: '8px 0 0 0',
    },
    ['& .locationIcon']: {
        color: theme.palette.white.main,
        marginTop: 6,
        marginBottom: -6,
    },
    ['& .selectedCampus']: {
        fontWeight: 500,
    },
    ['& .flexHeader']: {
        height: 'auto',
    },
    ['& .flexContent']: {
        flexGrow: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        [theme.breakpoints.down('md')]: {
            overflowX: 'hidden',
            overflowY: 'hidden',
        },
    },
    ['& .flexFooter']: {
        height: 'auto',
    },
    ['& .flexLoaderContent']: {
        flexGrow: 1,
        overflowY: 'hidden',
        overflowX: 'hidden',
    },
    ['& .linkButton']: {
        padding: 2,
        minWidth: 0,
        marginTop: -2,
        marginBottom: -2,
        textAlign: 'left',
        fontWeight: 300,
        textTransform: 'none',
    },
    ['& .linkButtonLabel']: {
        textTransform: 'none',
        textAlign: 'left',
        fontSize: 16,
        lineHeight: 1.1,
        color: '#3872a8', // theme.palette.accent.dark,
        fontWeight: 300,
    },
    ['& .mapAvailSwatch']: {
        display: 'inline-block',
        height: 12,
        width: 12,
        marginRight: 12,
        backgroundColor: '#00FF00',
        border: '1px solid #FFFFFF',
    },
    ['& .mapOccupSwatch']: {
        display: 'inline-block',
        height: 12,
        width: 12,
        marginRight: 12,
        backgroundColor: '#AA00FF',
        border: '1px solid #FFFFFF',
    },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
    ['& .badge']: {
        backgroundColor: theme.palette.success.main,
        padding: 0,
        height: 12,
        width: 12,
        maxWidth: 12,
        minWidth: 12,
        right: 4,
        top: 2,
    },
    ['& .badgeIcon']: {
        height: 10,
        width: 10,
        color: theme.palette.white.main,
    },
}));

const Computers = ({ computerAvailability, computerAvailabilityLoading, computerAvailabilityError, account }) => {
    const [cookies] = useCookies();
    const [preferredLocation, setPreferredLocation] = React.useState(undefined);
    const [showIcon, setShowIcon] = React.useState(false);
    const [collapse, setCollapse] = React.useState({});
    const [mapSrc, setMapSrc] = React.useState(null);
    useEffect(() => {
        const locationCookie = cookies.hasOwnProperty(LOCATION_COOKIE_NAME) ? cookies[LOCATION_COOKIE_NAME] : {};
        if (!!account) {
            const username = obfusticateUsername(account);
            setPreferredLocation(
                locationCookie.hasOwnProperty(username) ? locationCookie[username] : locationLocale.noLocationSet,
            );
        }
    }, [cookies, account]);
    useEffect(() => {
        if (preferredLocation !== undefined && preferredLocation !== locationLocale.noLocationSet) {
            setShowIcon(true);
            setTimeout(() => {
                setShowIcon(false);
            }, 5000);
        }
    }, [preferredLocation, cookies]);
    const cleanedAvailability =
        computerAvailability &&
        computerAvailability.map(item => {
            const levels = Object.keys(item.availability);
            const totalLevels = levels.length;
            let levelsData = [];
            /* istanbul ignore else */
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
                campus: locationLocale.computersCampusMap[item.library],
            };
        });
    const alphaAvailability =
        !!cleanedAvailability &&
        cleanedAvailability
            .filter(e => e !== null)
            .sort((a, b) => {
                const textA = a.library.toUpperCase();
                const textB = b.library.toUpperCase();
                // eslint-disable-next-line no-nested-ternary
                return textA < textB ? -1 : textA > textB ? 1 : /* istanbul ignore next */ 0;
            });
    const sortedComputers =
        !!account && !!account.id
            ? alphaAvailability &&
              matchSorter(alphaAvailability, preferredLocation, {
                  keys: ['campus'],
                  threshold: matchSorter.rankings.NO_MATCH,
              })
            : alphaAvailability;
    const handleCollapse = index => {
        if (collapse[index]) {
            setCollapse({ [index]: false });
        } else {
            setCollapse({ [index]: true });
            if (index !== 0) {
                setTimeout(() => {
                    document.getElementById('computers-library-content').scrollBy({
                        top: 32,
                        left: 0,
                        behavior: 'smooth',
                    });
                }, 100);
            }
        }
    };
    const closeMap = () => {
        setMapSrc(null);
    };
    const openMap = (library, building, room, level, total, available, floorplan) => {
        /* istanbul ignore else */
        if (!!floorplan) {
            setMapSrc({ library, building, room, level, total, available, floorplan });
        }
    };
    const MapPopup = ({}) => {
        if (!!mapSrc) {
            return (
                <Dialog
                    onClose={/* istanbul ignore next */ () => closeMap()}
                    aria-label="UQ Library computer availablity map"
                    role="dialog"
                    open={!!mapSrc}
                    maxWidth={'lg'}
                    PaperProps={{
                        id: 'computers-library-dialog',
                        'data-testid': 'computers-library-dialog',
                        'data-analyticsid': 'computers-library-dialog',
                        style: {
                            backgroundColor: '#000020',
                            color: '#FFFFFF',
                            width: '66%',
                            height: '66%',
                        },
                        'aria-label': 'Display of computer availability on this floor',
                    }}
                >
                    <Grid
                        container
                        spacing={0}
                        style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: '#000020 !important',
                            color: '#FFFFFF !important',
                            padding: 20,
                            overflow: 'hidden',
                        }}
                    >
                        <Grid item xs>
                            <Typography
                                variant={'h5'}
                                component={'h3'}
                                style={{
                                    color: '#FFFFFF !important',
                                    backgroundColor: '#000020 !important',
                                    marginTop: -6,
                                }}
                            >
                                {mapSrc.library} - Level {mapSrc.level} ({mapSrc.available} free of {mapSrc.total})
                            </Typography>
                        </Grid>
                        <Grid item xs={'auto'}>
                            <IconButton
                                id="computers-library-dialog-close-button"
                                data-testid="computers-library-dialog-close-button"
                                data-analyticsid="computers-library-dialog-close-button"
                                onClick={() => closeMap()}
                                aria-label="Click to close map"
                                style={{ color: 'white', marginTop: -16 }}
                                size="large"
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Grid>
                        <Grid item xs={12} style={{ height: 'calc(100% - 50px)', padding: '32px 0' }}>
                            <iframe
                                title={`${mapSrc.building} map`}
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
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs />
                                <Grid item xs={'auto'}>
                                    <div className={'mapAvailSwatch'} /> Available
                                </Grid>
                                <Grid item xs={'auto'}>
                                    <div className={'mapOccupSwatch'} /> Occupied
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Dialog>
            );
        }
        return null;
    };
    return (
        <StandardCard
            primaryHeader
            standardCardId="standard-card-computers"
            title={
                <Grid container spacing={0} justifyContent="center" alignItems="center">
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
                                    <StyledBadge
                                        classes={{ badge: 'badge' }}
                                        color="primary"
                                        badgeContent={<CheckIcon size="small" className={'badgeIcon'} />}
                                    >
                                        <RoomIcon data-testid="computers-wiggler" />
                                    </StyledBadge>
                                </Tooltip>
                            </Fade>
                        )}
                    </Grid>
                </Grid>
            }
            noPadding
        >
            <MapPopup />
            <StyledWrapper className={'flexWrapper componentHeight'}>
                {!!computerAvailabilityError && (
                    /* istanbul ignore next */ <Fade in={!computerAvailabilityLoading} timeout={1000}>
                        <div className={'flexContent'}>
                            <Typography style={{ padding: '1rem' }}>{computersLocale.unavailable}</Typography>
                        </div>
                    </Fade>
                )}
                {!computerAvailabilityError && computerAvailability && !computerAvailabilityLoading && (
                    <Fade in={!computerAvailabilityLoading} timeout={1000}>
                        <div className={'flexContent'} id="computers-library-content">
                            {!!sortedComputers &&
                                sortedComputers.length > 1 &&
                                sortedComputers.map((item, index) => {
                                    const add = (a, b) => a + b;
                                    const buildingAvail = item.levels.map(level => level.available).reduce(add);
                                    const buildingTotal = item.levels
                                        .map(level => level.occupied + level.available)
                                        .reduce(add);
                                    const ariaLabel = `${item.library} - ${buildingAvail} free of ${buildingTotal}. Click to review each level`;
                                    return (
                                        <React.Fragment key={index}>
                                            <Grid
                                                container
                                                data-testid={`computer-row-${index}`}
                                                spacing={1}
                                                className={'row'}
                                                justifyContent="center"
                                                alignItems="center"
                                            >
                                                <Grid item xs style={{ paddingLeft: 16 }}>
                                                    <Button
                                                        onClick={() => handleCollapse(index)}
                                                        aria-expanded={!!collapse[index]}
                                                        classes={{
                                                            root: `linkButton ${
                                                                item.campus && preferredLocation === item.campus
                                                                    ? 'selectedCampu'
                                                                    : ''
                                                            }`,
                                                            label: `linkButtonLabel ${
                                                                item.campus && preferredLocation === item.campus
                                                                    ? 'selectedCampus'
                                                                    : ''
                                                            }`,
                                                        }}
                                                        aria-label={ariaLabel}
                                                        id={`computers-library-button-${index}`}
                                                        data-testid={`computers-library-button-${index}`}
                                                        data-analyticsid={`computers-library-button-${index}`}
                                                    >
                                                        {item.library}
                                                    </Button>
                                                </Grid>
                                                <Grid item xs={'auto'} style={{ fontSize: 14, marginRight: 16 }}>
                                                    {buildingAvail} free of {buildingTotal}
                                                </Grid>
                                            </Grid>
                                            {item.levels.length > 0 &&
                                                item.levels.map((level, levelIndex) => {
                                                    const levelname = l => `${item.library} level ${l.level}`;
                                                    const seatsOnLevel = l => {
                                                        const totalSeatsOnLevel = l.available + l.occupied;
                                                        return `${l.available} free of ${totalSeatsOnLevel}`;
                                                    };
                                                    const seatsOnLevelAria = l =>
                                                        `${levelname(l)}. ${seatsOnLevel(l)} computers`;
                                                    return (
                                                        <Collapse
                                                            in={collapse[index]}
                                                            timeout="auto"
                                                            unmountOnExit
                                                            key={levelIndex}
                                                        >
                                                            <Grid
                                                                role="region"
                                                                container
                                                                spacing={1}
                                                                className={'row'}
                                                                justifyContent="center"
                                                                alignItems="center"
                                                            >
                                                                <Grid item xs style={{ paddingLeft: 32 }}>
                                                                    <Button
                                                                        id={`computers-${item.library}-level-${item.level}-button`}
                                                                        data-testid={`computers-library-${index}-level-${level.level}-button`}
                                                                        data-analyticsid={`computers-library-${index}-level-${level.level}-button`}
                                                                        aria-label={seatsOnLevelAria(level)}
                                                                        disabled={!level.floorplan}
                                                                        onClick={() =>
                                                                            openMap(
                                                                                item.library,
                                                                                item.buildingCode,
                                                                                level.roomCode,
                                                                                level.level,
                                                                                level.total,
                                                                                level.available,
                                                                                level.floorplan,
                                                                            )
                                                                        }
                                                                        classes={{
                                                                            root: 'linkButton',
                                                                            label: `linkButtonLabel ${
                                                                                preferredLocation === item.campus
                                                                                    ? 'selectedCampus'
                                                                                    : ''
                                                                            }`,
                                                                        }}
                                                                    >
                                                                        Level {level.level}
                                                                    </Button>
                                                                </Grid>
                                                                <Grid xs item />
                                                                <Grid
                                                                    item
                                                                    xs={'auto'}
                                                                    style={{ fontSize: 14, marginRight: 16 }}
                                                                >
                                                                    {seatsOnLevel(level)}
                                                                </Grid>
                                                            </Grid>
                                                        </Collapse>
                                                    );
                                                })}
                                        </React.Fragment>
                                    );
                                })}
                        </div>
                    </Fade>
                )}
                {!computerAvailabilityError && !(computerAvailability && !computerAvailabilityLoading) && (
                    <div className={'flexLoaderContent'}>
                        <MyLoader />
                    </div>
                )}
            </StyledWrapper>
        </StandardCard>
    );
};

Computers.propTypes = {
    computerAvailability: PropTypes.array,
    computerAvailabilityLoading: PropTypes.bool,
    computerAvailabilityError: PropTypes.bool,
    account: PropTypes.object,
};

Computers.defaultProps = {};

export default Computers;
