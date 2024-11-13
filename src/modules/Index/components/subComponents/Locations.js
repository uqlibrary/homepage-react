import React from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';
import ContentLoader from 'react-content-loader';

import Fade from '@mui/material/Fade';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';

import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';

import { locale as locationLocale } from 'config/locale';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import UqDsExclamationCircle from '../../../SharedComponents/Icons/UqDsExclamationCircle';
import { linkToDrupal } from 'helpers/general';

const StyledStandardCard = styled(StandardCard)(({ theme }) => ({
    marginBottom: '32px',
    '& .MuiCardHeader-root': {
        paddingBlock: '12px',
    },
    backgroundColor: 'white',
    border: '1px solid #DCDCDD',
    borderRadius: '0 0 4px 4px',
    boxShadow: '0px 12px 24px 0px rgba(25, 21, 28, 0.05)',
    marginTop: '2px',
    zIndex: 999,
    position: 'absolute',
    top: 102,
    [theme.breakpoints.down('uqDsDesktop')]: {
        left: '0 !important',
    },
    [theme.breakpoints.down('uqDsTablet')]: {
        left: 5,
        paddingLeft: 0,
    },
}));
const StyledWrapper = styled('div')(({ theme }) => ({
    margin: '32px 0 32px 32px',
    [theme.breakpoints.down('uqDsDesktop')]: {
        marginRight: '32px',
    },
    [theme.breakpoints.down('uqDsTablet')]: {
        margin: '24px',
    },
    '& .table-row-header': {
        height: '2rem',
        '& h3': {
            color: theme.palette.secondary.dark,
            fontSize: '16px',
            fontWeight: 500,
        },
    },
    '& .table-column-hours': {
        paddingLeft: '32px',
        whiteSpace: 'nowrap',
        [theme.breakpoints.down('uqDsTablet')]: {
            paddingLeft: '24px',
        },
        [theme.breakpoints.up('uqDsTablet')]: {
            maxWidth: '150px',
        },
    },
    '& .table-row-body': {
        paddingBlock: '8px',
        [theme.breakpoints.up('uqDsDesktop')]: {
            minWidth: '820px',
        },
        maxWidth: '100%',
    },
    '& .table-row-body > div.table-cell-ellipsis': {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
    },
    '& .table-cell-hastext span': {
        color: '#3B383E',
        fontWeight: 400,
        whiteSpace: 'nowrap',
    },
    '& .table-column-busy': {
        paddingLeft: '32px',
        width: '232px !important',
        [theme.breakpoints.down('uqDsTablet')]: {
            paddingLeft: '24px',
        },
    },
    '& .table-column-busyword': {
        '& span': {
            paddingLeft: '10px',
            fontSize: '14px',
            fontStyle: 'normal',
            lineHeight: '160%', // 22.4px
            letterSpacing: '0.14px',
        },
    },
    '& .location-askus > div': {
        paddingTop: '16px',
    },
    '& .table-cell-busy': {
        marginTop: '4px,', // force the text to centre align
    },
    '& .occupancy': {
        backgroundColor: '#dcdcdc',
        borderRadius: '20px',
        '& .occupancyPercent': {
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.primary.light,
        },
    },
    '& .occupancyText': {
        display: 'flex',
        alignItems: 'center',
        '& span': {
            paddingLeft: '4px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
        },
        '& svg': {
            height: '16px',
        },
    },
    '& .outlink': {
        marginTop: '24px',
        padding: '0',
        display: 'inline-block',
        '& > span': {
            display: 'flex',
            alignItems: 'center',
        },
        '& a': {
            color: theme.palette.primary.light,
            textDecoration: 'underline',
            fontSize: '16px',
            fontWeight: 500,
            '&:hover': {
                color: '#fff',
                backgroundColor: theme.palette.primary.light,
            },
        },
        '& svg': {
            fontSize: '16px',
            marginLeft: '10px',
            marginTop: '2px',
        },
    },
    '& .disclaimer': {
        marginTop: '16px',
        paddingLeft: 0,
        fontSize: '14px',
        fontStyle: 'normal',
        fontWeight: 400,
        letterSpacing: '0.14px',
        lineHeight: '160%', // 25.6px
        marginBottom: 0,
    },
}));

const MyLoader = props => (
    <ContentLoader
        uniqueKey="hours"
        speed={2}
        width={'100%'}
        height={'50%'}
        viewBox="0 0 365 250"
        backgroundColor="#f3f3f3"
        foregroundColor="#e2e2e2"
        {...props}
    >
        <rect x="0%" y="15" rx="3" ry="3" width="21%" height="5" />
        <rect x="35%" y="15" rx="3" ry="3" width="18%" height="5" />
        <rect x="65%" y="15" rx="3" ry="3" width="22%" height="5" />

        <rect x="0%" y="35" rx="3" ry="3" width="18%" height="5" />
        <rect x="35%" y="35" rx="3" ry="3" width="21%" height="5" />
        <rect x="65%" y="35" rx="3" ry="3" width="23%" height="5" />

        <rect x="0%" y="55" rx="3" ry="3" width="12%" height="5" />
        <rect x="35%" y="55" rx="3" ry="3" width="10%" height="5" />
        <rect x="65%" y="55" rx="3" ry="3" width="20%" height="5" />

        <rect x="0%" y="75" rx="3" ry="3" width="21%" height="5" />
        <rect x="35%" y="75" rx="3" ry="3" width="19%" height="5" />
        <rect x="65%" y="75" rx="3" ry="3" width="17%" height="5" />

        <rect x="0%" y="95" rx="3" ry="3" width="19%" height="5" />
        <rect x="35%" y="95" rx="3" ry="3" width="10%" height="5" />
        <rect x="65%" y="95" rx="3" ry="3" width="12%" height="5" />

        <rect x="0%" y="115" rx="3" ry="3" width="23%" height="5" />
        <rect x="35%" y="115" rx="3" ry="3" width="18%" height="5" />
        <rect x="65%" y="115" rx="3" ry="3" width="17%" height="5" />
    </ContentLoader>
);

const departmentsMap = ['Collections & space', 'Study space', 'Service & collections'];
function departmentProvided(location) {
    return (
        !!location && !!location.departments && Array.isArray(location.departments) && location.departments.length > 0
    );
}

export const hasDepartments = location => {
    const departments =
        !!departmentProvided(location) &&
        location.departments.map(item => {
            if (departmentsMap.includes(item.name)) {
                return item.name;
            }
            return null;
        });
    const displayableDepartments =
        !!departmentProvided(location) &&
        departments.filter(el => {
            return el !== null;
        });
    return displayableDepartments.length > 0;
};

const getOverrideLocationName = locationAbbr => {
    // if not present in the lookup table, uses the value passed from Springhshare
    const lookupTable = {
        AskUs: 'AskUs chat hours', // this one must be overriden long term, I think
        'Arch Music': 'Architecture and Music', // all these following should be able to be deleted once the Springshare name values are updated, post go live
        Central: 'Central',
        'Biol Sci': 'Biological Sciences',
        DHEngSci: 'Dorothy Hill Engineering and Sciences',
        'Dutton Park': 'Dutton Park Health Sciences',
        Fryer: 'FW Robinson Reading Room (Fryer)',
        Gatton: 'JK Murray (UQ Gatton)',
        Law: 'Walter Harrison Law',
        Herston: 'Herston Health Sciences',
    };
    if (lookupTable.hasOwnProperty(locationAbbr)) {
        return lookupTable[locationAbbr];
    }
    // Return null if the key is not found
    return null;
};

export const ariaLabelForLocation = location => {
    let libraryName = 'the ' + (getOverrideLocationName(location?.abbr) || location.name) + ' Library';
    const lookupTable = {
        AskUs: 'the AskUs chat & phone assistance',
        Fryer: 'Fryer Library',
        Gatton: 'JK Murray Library',
    };
    if (lookupTable.hasOwnProperty(location?.abbr)) {
        libraryName = lookupTable[location.abbr];
    }
    return 'More information on ' + libraryName;
};

const VEMCOUNT_LOCATION_DATA_EXPECTED_BUT_MISSING = 'Missing';
const Locations = ({ libHours, libHoursLoading, libHoursError, vemcount, vemcountLoading, vemcountError }) => {
    const SHRINK_BREAKPOINT_TABLET = 760;
    const SHRINK_BREAKPOINT_MINI = 390;
    const [screenWidth, setScreenWidth] = React.useState(window.innerWidth);
    React.useEffect(() => {
        const handleResize = () => {
            console.log('window.innerWidth  =', window.innerWidth);
            setScreenWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const cleanedHours =
        (vemcountLoading === false &&
            !vemcountError &&
            !libHoursError &&
            !!libHours &&
            !!libHours.locations &&
            vemcount.data.locationList.length > 0 &&
            libHours.locations.length > 0 &&
            libHours.locations.map(location => {
                let departments = [];
                if (!!departmentProvided(location)) {
                    departments = location.departments.map(dept => {
                        return {
                            name: dept.name,
                            hours: dept.rendered,
                            currently_open: dept.times?.currently_open,
                        };
                    });
                }

                function getVemcountZoneBySpringshareId(springshareLocationId) {
                    return locationLocale.vemcountSpringshareMapping.find(
                        m => m.springshareId === springshareLocationId,
                    );
                }

                function vemcountPercentByLocation(springshareLocationId) {
                    const vemcountLocation = getVemcountZoneBySpringshareId(springshareLocationId);
                    const vemcountZoneId = vemcountLocation?.vemcountZoneId;
                    const vemcountWrapper = vemcount?.data?.locationList?.filter(v => v.id === vemcountZoneId);
                    // const dateLoaded = vemcount?.data?.dateLoaded; // for use later
                    const vemcountData = vemcountWrapper.length > 0 ? vemcountWrapper[0] : null;
                    if (vemcountLocation?.springshareId === springshareLocationId && vemcountWrapper?.length === 0) {
                        return VEMCOUNT_LOCATION_DATA_EXPECTED_BUT_MISSING;
                    }
                    return (vemcountData?.headCount / vemcountData?.capacity) * 100;
                }

                function getVemcountPercentage(springshareLocationId) {
                    if (springshareLocationId === null) {
                        return null;
                    }
                    const minimumDisplayedPercentage = 5;
                    const maxmumDisplayedPercentage = 100;

                    const vemcountBusynessPercent = vemcountPercentByLocation(springshareLocationId);
                    let calculatedBusyness;
                    if (vemcountBusynessPercent === VEMCOUNT_LOCATION_DATA_EXPECTED_BUT_MISSING) {
                        calculatedBusyness = vemcountBusynessPercent;
                    } else if (!!isNaN(vemcountBusynessPercent)) {
                        calculatedBusyness = null;
                    } else if (vemcountBusynessPercent < minimumDisplayedPercentage) {
                        // don't let the bar go below what shows as a small curve on the left
                        calculatedBusyness = minimumDisplayedPercentage;
                    } else if (vemcountBusynessPercent > maxmumDisplayedPercentage) {
                        calculatedBusyness = maxmumDisplayedPercentage;
                    } else {
                        calculatedBusyness = Math.floor(vemcountBusynessPercent);
                    }

                    return calculatedBusyness;
                }

                return {
                    name: location.name,
                    abbr: location.abbr,
                    url: location.url,
                    alt: location.name,
                    campus: locationLocale.hoursCampusMap[location.abbr],
                    departments,
                    busyness: getVemcountPercentage(location?.lid, location.name) || null,
                };
            })) ||
        [];
    const alphaHours = cleanedHours
        .filter(e => e !== null)
        .filter(l => l.abbr !== 'Whitty Mater') // remove this from springshare data for homepage
        .filter(l => screenWidth > SHRINK_BREAKPOINT_TABLET || l.abbr !== 'AskUs') // remove the askus line when on smaller screens, it lacks extra info
        .sort((a, b) => {
            const textA = a.name.toUpperCase();
            const textB = b.name.toUpperCase();
            // eslint-disable-next-line no-nested-ternary
            return textA < textB ? -1 : textA > textB ? 1 : /* istanbul ignore next */ 0;
        });
    const sortedHours = alphaHours.sort((a, b) => {
        if (a.abbr === 'AskUs') return 1; // Move 'askus' to the end
        if (b.abbr === 'AskUs') return -1; // Move 'askus' to the end
        return a.abbr?.localeCompare(b.abbr); // Sort the rest alphabetically
    });

    const isOpen = (location, departmentsMapIn = null) => {
        const departmentsMapUsed = departmentsMapIn ?? departmentsMap;
        return location.departments
            ?.filter(d => departmentsMapUsed.includes(d.name))
            ?.find(d => d.currently_open === true);
    };
    const sluggifyName = string => {
        return string.toLowerCase().replace(' ', '-');
    };
    const getTextForBusyness = location => {
        if (
            location.abbr === 'AskUs' ||
            !location?.busyness ||
            location.busyness === VEMCOUNT_LOCATION_DATA_EXPECTED_BUT_MISSING ||
            !isOpen(location)
        ) {
            return null;
        }
        if (location.busyness <= 25) {
            return 'Not busy';
        }
        if (location.busyness <= 50) {
            return 'Moderate';
        }
        if (location.busyness <= 75) {
            return 'Busy';
        }
        return 'Very busy';
    };

    function getLibraryHours(location) {
        /* istanbul ignore else */
        if (location.abbr === 'AskUs') {
            return location.departments.map(department => {
                if (['Chat'].includes(department.name)) {
                    return department.hours;
                }
                return null;
            });
        }
        /* istanbul ignore else */
        if (hasDepartments(location)) {
            return location.departments.map(department => {
                if (departmentsMap.includes(department.name)) {
                    return department.hours;
                }
                return null;
            });
        }
        return 'See location';
    }

    function getBusynessBar(location) {
        if (location.abbr === 'AskUs') {
            return null;
        }
        if (location.abbr === 'Fryer') {
            return <div className="occupancyText occupancyTextClosed">By appointment only</div>;
        }
        if (!hasDepartments(location)) {
            return (
                <div className="occupancyText">
                    <UqDsExclamationCircle /> <span>Data not available</span>
                </div>
            );
        }
        if (!isOpen(location)) {
            return <div className="occupancyText occupancyTextClosed">Closed</div>;
        }
        if (location.busyness === null) {
            return null;
        }
        if (location.busyness === VEMCOUNT_LOCATION_DATA_EXPECTED_BUT_MISSING) {
            return (
                <div className="occupancyText">
                    <UqDsExclamationCircle /> <span>Data not available</span>
                </div>
            );
        }
        const barWidth = () => {
            if (screenWidth <= SHRINK_BREAKPOINT_MINI) {
                return '132px';
            }
            return screenWidth > SHRINK_BREAKPOINT_TABLET ? '232px' : '143px';
        };
        return (
            <LinearProgress
                className="occupancy"
                variant="determinate"
                value={location.busyness}
                sx={{
                    height: 16,
                    backgroundColor: '#dcdcdc',
                    '& .MuiLinearProgress-bar': { backgroundColor: '#51247A' },
                    maxWidth: barWidth,
                }}
            />
        );
    }

    return (
        <StyledStandardCard noPadding noHeader standardCardId="locations-panel">
            <StyledWrapper id="tablewrapper">
                {(!!libHoursError || !!vemcountError) && (
                    <Fade in={!libHoursLoading} timeout={1000}>
                        <div className={'locations-wrapper'}>
                            <Typography style={{ padding: '1rem 1rem 1rem 0' }} data-testid="locations-error">
                                We can't load opening hours or study space availability information right now. Please
                                refresh your browser or try again later.
                            </Typography>
                        </div>
                    </Fade>
                )}
                {!libHoursError && !!libHours && !libHoursLoading && !vemcountError && !!vemcount && !vemcountLoading && (
                    <Fade in={!libHoursLoading} timeout={1000}>
                        <div id={'fadeWrapper'}>
                            {/* Header Row */}
                            <Grid container className="table-row-header">
                                <Grid item uqDsMobile={5} uqDsTablet={4}>
                                    <Typography component="h3" variant="h6">
                                        Library
                                    </Typography>
                                </Grid>
                                {screenWidth > SHRINK_BREAKPOINT_TABLET && (
                                    <Grid item uqDsMobile={3} className="table-column-hours">
                                        <Typography component="h3" variant="h6">
                                            Opening hours*
                                        </Typography>
                                    </Grid>
                                )}
                                <Grid item uqDsMobile={screenWidth > 390 ? 4 : 5} className="table-column-busy">
                                    <Typography component="h3" variant="h6">
                                        Busy level
                                    </Typography>
                                </Grid>
                                {screenWidth > 390 && <Grid item className="table-column-busyword" />}
                            </Grid>

                            {/* Body Rows */}
                            {!!sortedHours &&
                                sortedHours.length > 1 &&
                                sortedHours.map((location, index) => (
                                    <Grid
                                        container
                                        key={index}
                                        className={`table-row-body location-${location.abbr.toLowerCase()}`}
                                        data-testid={sluggifyName(`hours-item-${location.abbr}`)}
                                    >
                                        <Grid item uqDsMobile={5} uqDsTablet={4} className="table-cell-ellipsis">
                                            <Link
                                                to={location.url}
                                                id={`${sluggifyName(`hours-item-${location.abbr}`)}`}
                                                data-testid={`${sluggifyName(`hours-item-${location.abbr}`)}-link`}
                                            >
                                                {getOverrideLocationName(location.abbr) || location.name}
                                            </Link>
                                        </Grid>
                                        {screenWidth > SHRINK_BREAKPOINT_TABLET && (
                                            <Grid item uqDsMobile={3} className="table-column-hours table-cell-hastext">
                                                <Typography
                                                    component={'span'}
                                                    data-testid={`hours-item-hours-${index}`}
                                                >
                                                    {getLibraryHours(location)}
                                                </Typography>
                                            </Grid>
                                        )}
                                        <Grid
                                            item
                                            uqDsMobile={screenWidth > 390 ? 4 : 5}
                                            className="table-cell-ellipsis table-cell-busy table-column-busy"
                                            data-testid={`${sluggifyName(`hours-item-busy-${location.abbr}`)}`}
                                        >
                                            {getBusynessBar(location)}
                                        </Grid>
                                        {screenWidth > 390 && (
                                            <Grid
                                                item
                                                uqDsMobile={1}
                                                className="table-cell-hastext table-column-busyword"
                                            >
                                                <Typography
                                                    component={'span'}
                                                    data-testid={`${sluggifyName(
                                                        `hours-item-busy-words-${location.abbr}`,
                                                    )}`}
                                                >
                                                    {getTextForBusyness(location)}
                                                </Typography>
                                            </Grid>
                                        )}
                                    </Grid>
                                ))}
                        </div>
                    </Fade>
                )}
                {((!!libHoursLoading && !libHoursError && !libHours) ||
                    (!vemcountError && !vemcount && !!vemcountLoading)) && (
                    <div className={'loaderContent'}>
                        <MyLoader id="hours-loader" data-testid="hours-loader" aria-label="Locations data is loading" />
                    </div>
                )}
                <div className="outlink">
                    <span>
                        <Link
                            data-testid="homepage-hours-weeklyhours-link"
                            data-analyticsid={'hours-item-weeklyhours-link'}
                            to={linkToDrupal('/locations-hours/opening-hours')}
                        >
                            <span>
                                {!!libHoursError || !!vemcountError ? <span>In the meantime, s</span> : <span>S</span>}
                                ee weekly Library and AskUs hours
                            </span>{' '}
                        </Link>
                        <ArrowForwardIcon /> {/* uq ds arrow-right-1 */}
                    </span>
                </div>
                {screenWidth > SHRINK_BREAKPOINT_TABLET && (
                    <p className={'disclaimer'}>
                        {!(!!libHoursError || !!vemcountError) &&
                            '*Student and staff hours only. For visitor and community hours, see individual Library links above.'}
                    </p>
                )}
            </StyledWrapper>
        </StyledStandardCard>
    );
};

Locations.propTypes = {
    libHours: PropTypes.object,
    libHoursLoading: PropTypes.bool,
    libHoursError: PropTypes.bool,
    vemcount: PropTypes.object,
    vemcountLoading: PropTypes.bool,
    vemcountError: PropTypes.bool,
};

export default Locations;
