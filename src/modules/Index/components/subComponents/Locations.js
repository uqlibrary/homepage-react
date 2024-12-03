import React from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';
import ContentLoader from 'react-content-loader';

import Fade from '@mui/material/Fade';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';

import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';

import { locale as locationLocale } from 'config/locale';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
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
    marginTop: '-7px',
    zIndex: 999,
    position: 'absolute',
    top: 102,
    maxWidth: '100%',
    [theme.breakpoints.up('uqDsTablet')]: {
        marginLeft: '-28px',
    },
    [theme.breakpoints.up('uqDsDesktop')]: {
        width: '790px',
    },
    [theme.breakpoints.down('uqDsDesktop')]: {
        left: '0 !important',
    },
}));
const StyledOutlinkDiv = styled('div')(({ theme }) => ({
    marginTop: '22px',
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
        letterSpacing: '0.16px',
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
}));
const StyledDisclaimerParagraph = styled('div')(({ theme }) => ({
    marginTop: '26px',
    paddingLeft: 0,
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: 400,
    letterSpacing: '0.16px',
    lineHeight: '160%', // 25.6px
    marginBottom: 0,
    [theme.breakpoints.down('uqDsTablet')]: {
        display: 'none',
    },
}));
const StyledTableWrapper = styled('div')(({ theme }) => ({
    margin: '32px',
    letterSpacing: '0.16px',
    [theme.breakpoints.down('uqDsTablet')]: {
        margin: '24px',
    },
    '& .table-row-header': {
        height: '2rem',
        '& h3': {
            color: theme.palette.secondary.dark,
            fontSize: '16px',
            fontWeight: 500,
            letterSpacing: '0.16px',
        },
    },
    '& .table-cell ': {
        letterSpacing: '0.16px',
    },
    '& .table-row ': {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    '& .table-row, .table-row > *': {
        boxSizing: 'border-box',
    },
    '& .table-row-body': {
        paddingBlock: '8px',
    },
    '& .has-ellipsis': {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
    },
    '& .table-column-name': {
        flex: 1,
        maxWidth: '340px',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        '& a': {
            paddingBlock: 0, // override mui
            '&:focus': {
                color: '#fff',
                backgroundColor: theme.palette.primary.light,
            },
        },

        paddingRight: '64px',
        [theme.breakpoints.down('uqDsDesktop')]: {
            paddingRight: '24px',
        },
    },
    '& .table-column-hours': {
        whiteSpace: 'nowrap',
        width: '120px',
        [theme.breakpoints.down('uqDsTablet')]: {
            display: 'none',
        },
    },
    '& .table-cell-hastext span': {
        color: '#3B383E',
        fontWeight: 400,
        whiteSpace: 'nowrap',
        letterSpacing: '0.16px',
    },
    '& .table-column-busy': {
        boxSizing: 'border-box',
        width: '156px', // Default width for 0px - 390px:  132px + 24px left margin = 156px
        [theme.breakpoints.up('uqDsMobile')]: {
            width: '204px', // Width for 391px - 640px:  180px + 24px left margin = 204px
        },
        [theme.breakpoints.up('uqDsTablet')]: {
            width: '256px', // Width for above 640px: 192px + 64px left margin = 256px
        },
    },
    '& .location-askus': {
        paddingTop: '24px',
    },
    '& .occupancyWrapper': {
        paddingLeft: '64px',
        [theme.breakpoints.down('uqDsDesktop')]: {
            paddingLeft: '24px',
        },
    },
    '& .occupancyBar': {
        backgroundColor: '#dcdcdc',
        borderRadius: '20px',
        height: 16,
        '& .MuiLinearProgress-bar': { backgroundColor: '#51247A' },
        width: '132px', //  0px - 390px
        [theme.breakpoints.up('uqDsMobile')]: {
            width: '180px', // 391px - 640px
        },
        [theme.breakpoints.up('uqDsTablet')]: {
            width: '192px', // above 640px
        },
    },
    '& .occupancyText': {
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        fontWeight: 400,
        '& span': {
            paddingLeft: '4px',
        },
    },
    '& .has-exclamation-icon': {
        paddingLeft: '20px',
        backgroundImage:
            'url("data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%229.25%22%20stroke%3D%22%2351247A%22%20stroke-width%3D%221.5%22/%3E%3Cpath%20d%3D%22M12%207.8v4%22%20stroke%3D%22%2351247A%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22/%3E%3Ccircle%20cx%3D%2211.9%22%20cy%3D%2215.6%22%20r%3D%22.6%22%20fill%3D%22%23000%22%20stroke%3D%22%2351247A%22/%3E%3C/svg%3E")',
        backgroundSize: ' 16px 16px',
        backgroundPosition: 'left center',
        backgroundRepeat: 'no-repeat',
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
        data-testid="hours-loader"
        aria-label="Locations data is loading"
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
        location.departments.map(dept => {
            if (departmentsMap.includes(dept.name)) {
                return dept.name;
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

const VEMCOUNT_LOCATION_DATA_EXPECTED_BUT_MISSING = 'Missing';
const isOpen = (location, departmentsMapIn = null) => {
    const departmentsMapUsed = departmentsMapIn ?? departmentsMap;
    return location.departments?.filter(d => departmentsMapUsed.includes(d.name))?.find(d => d.currently_open === true);
};
const getTextForBusyness = (location, busyLookup) => {
    if (
        location.abbr === 'AskUs' ||
        !location?.busyness ||
        location.busyness === VEMCOUNT_LOCATION_DATA_EXPECTED_BUT_MISSING ||
        !isOpen(location)
    ) {
        return null;
    }
    let busyinessIndex = 4; // Very busy
    if (location.busyness <= 25) {
        busyinessIndex = 1; // 'Not busy';
    } else if (location.busyness <= 50) {
        busyinessIndex = 2; // 'Moderate';
    } else if (location.busyness <= 75) {
        busyinessIndex = 3; // 'Busy';
    }
    return busyLookup.hasOwnProperty(busyinessIndex) ? busyLookup[busyinessIndex] : /* istanbul ignore next */ null;
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
export const ariaLabelForLocation = location => {
    let libraryName = `the ${location?.displayName} Library`;
    const nameLookupTable = {
        AskUs: 'AskUs chat assistance',
        Fryer: 'Fryer Library',
        Gatton: 'JK Murray Library',
    };
    if (nameLookupTable.hasOwnProperty(location?.abbr)) {
        libraryName = nameLookupTable[location.abbr];
    }

    const openingHoursArray = getLibraryHours(location);
    let openingHours =
        !!openingHoursArray && Array.isArray(openingHoursArray) ? openingHoursArray.join(' ') : openingHoursArray;
    if (openingHours === 'See location') {
        return `Click through to the location page for ${libraryName} hours and busy level.`;
    }

    openingHours = openingHours
        .trim()
        .replace(' - ', ' to ')
        .toLowerCase();

    let locationType = 'study space';
    if (location?.abbr === 'AskUs') {
        locationType = 'operating hours today';
    }

    const capitaliseLibraryName =
        String(libraryName)
            .charAt(0)
            .toUpperCase() + String(libraryName).slice(1);
    let response = `${capitaliseLibraryName} ${locationType} is open ${openingHours}.`;

    const busynessLabels = {
        1: 'not busy',
        2: 'moderately busy',
        3: 'quite busy',
        4: 'very busy',
    };
    const business = getTextForBusyness(location, busynessLabels);
    if (!!business) {
        response += ` This space is currently ${business}.`;
    }

    return response;
};

const Locations = ({
    libHours,
    libHoursLoading,
    libHoursError,
    vemcount,
    vemcountLoading,
    vemcountError,
    closePanel,
}) => {
    const theme = useTheme();
    const [screenWidth, setScreenWidth] = React.useState(window.innerWidth);
    React.useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    /* istanbul ignore next */
    const handleFirstLinkKeyDown = e => {
        console.log('handleFirstLinkKeyDown e.id=', e?.id);
        console.log('handleFirstLinkKeyDown document.activeElement=', document.activeElement);
        if (e.key === 'Tab' && e.shiftKey) {
            e.preventDefault();
            const openerCloserButton = document.getElementById('location-dialog-controller');
            console.log('handleFirstLinkKeyDown openerCloserButton=', openerCloserButton);
            !!openerCloserButton && openerCloserButton.focus();
            closePanel();
        }
    };

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

                const getDisplayName = location => {
                    // if not present in the lookup table, uses the value passed from Springshare
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
                    if (lookupTable.hasOwnProperty(location.abbr)) {
                        return lookupTable[location.abbr];
                    }
                    return location.name;
                };

                return {
                    displayName: getDisplayName(location),
                    abbr: location.abbr,
                    url: location.url,
                    campus: locationLocale.hoursCampusMap[location.abbr],
                    departments,
                    busyness: getVemcountPercentage(location?.lid, location.name) || null,
                };
            })) ||
        [];
    const sortedHours = cleanedHours
        .filter(e => e !== null)
        .filter(l => l.abbr !== 'Whitty Mater') // remove this from springshare data for homepage
        .filter(l => screenWidth > theme.breakpoints.values.uqDsTablet || l.abbr !== 'AskUs') // remove the askus line when on smaller screens, it lacks extra info
        .sort((a, b) => {
            // Askus goes last in the list
            if (a.abbr === 'AskUs') return 1;
            if (b.abbr === 'AskUs') return -1;

            // Otherwise, sort alphabetically by name
            return a.displayName.localeCompare(b.displayName);
        });

    const sluggifyName = string => {
        return string.toLowerCase().replace(' ', '-');
    };

    function getBusynessBar(location) {
        if (location.abbr === 'AskUs') {
            return null;
        }
        if (location.abbr === 'Fryer') {
            return <div className="occupancyText has-ellipsis">By appointment</div>;
        }
        if (!hasDepartments(location)) {
            return <div className="occupancyText has-ellipsis has-exclamation-icon">Data not available</div>;
        }
        if (!isOpen(location)) {
            return <div className="occupancyText has-ellipsis">Closed</div>;
        }
        /* istanbul ignore next */
        if (location.busyness === null) {
            return null;
        }
        if (location.busyness === VEMCOUNT_LOCATION_DATA_EXPECTED_BUT_MISSING) {
            return <div className="occupancyText has-ellipsis has-exclamation-icon">Data not available</div>;
        }
        return (
            <LinearProgress
                className="occupancyBar"
                variant="determinate"
                value={location.busyness}
                aria-label={getTextForBusyness(location, {
                    1: 'Not busy',
                    2: 'Moderately busy',
                    3: 'Quite busy',
                    4: 'Very busy',
                })}
            />
        );
    }

    return (
        <StyledStandardCard noPadding noHeader standardCardId="locations-panel">
            <StyledTableWrapper id="locationsTableWrapper">
                {(!!libHoursError || !!vemcountError) && (
                    <Fade in={!libHoursLoading} timeout={1000}>
                        <div className={'locations-wrapper'}>
                            <Typography style={{ padding: '1rem 1rem 1rem 0' }} data-testid="locations-error">
                                We can't load opening hours or how busy Library spaces are right now. Please refresh
                                your browser or try again later.
                            </Typography>
                        </div>
                    </Fade>
                )}
                {!libHoursError && !!libHours && !libHoursLoading && !vemcountError && !!vemcount && !vemcountLoading && (
                    <>
                        {/* Header Row */}
                        <Grid container className="table-row table-row-header">
                            <Grid item id="header-library" className={'table-column-name'}>
                                <Typography component="h3" variant="h6">
                                    Library
                                </Typography>
                            </Grid>
                            <Grid item className="table-column-hours" id="header-hours">
                                <Typography component="h3" variant="h6">
                                    Opening hours*
                                </Typography>
                            </Grid>
                            <Grid item className="table-column-busy occupancyWrapper" id="header-busy">
                                <Typography component="h3" variant="h6">
                                    Busy level
                                </Typography>
                            </Grid>
                        </Grid>

                        {/* Body Rows */}
                        {!!sortedHours &&
                            sortedHours.length > 1 &&
                            sortedHours.map((location, index) => {
                                const librarySlug = sluggifyName(`hours-item-${location.abbr}`);
                                return (
                                    <Grid
                                        container
                                        key={index}
                                        className={`table-row table-row-body location-${location.abbr.toLowerCase()} `}
                                        data-testid={librarySlug}
                                    >
                                        <Grid
                                            item
                                            id={sluggifyName(`library-name-${location.abbr}`)}
                                            className="table-cell table-column-name has-ellipsis"
                                            aria-labelledby="header-library"
                                        >
                                            <Link
                                                to={location.url}
                                                id={`${librarySlug}`}
                                                className={'locationLink'}
                                                data-testid={`${librarySlug}-link`}
                                                aria-label={ariaLabelForLocation(location)}
                                                onKeyDown={index === 0 ? handleFirstLinkKeyDown : null}
                                            >
                                                {location.displayName}
                                            </Link>
                                        </Grid>
                                        <Grid
                                            item
                                            className="table-cell table-column-hours table-cell-hastext"
                                            aria-labelledby={`header-hours ${sluggifyName(
                                                `library-name-${location.abbr}`,
                                            )}`}
                                        >
                                            <Typography
                                                component={'span'}
                                                data-testid={`${sluggifyName(`location-item-${location.abbr}-hours`)}`}
                                            >
                                                {getLibraryHours(location)}
                                            </Typography>
                                        </Grid>
                                        <Grid
                                            item
                                            className="table-cell table-cell-busy table-column-busy"
                                            data-testid={`${sluggifyName(`hours-item-busy-${location.abbr}`)}`}
                                            aria-labelledby={`header-busy ${sluggifyName(
                                                `library-name-${location.abbr}`,
                                            )}`}
                                        >
                                            <div className={'occupancyWrapper'}>{getBusynessBar(location)}</div>
                                        </Grid>
                                    </Grid>
                                );
                            })}
                    </>
                )}
                {((!!libHoursLoading && !libHoursError && !libHours) ||
                    (!vemcountError && !vemcount && !!vemcountLoading)) && (
                    <div className={'loaderContent'}>
                        <MyLoader id="hours-loader" />
                    </div>
                )}
                <StyledOutlinkDiv>
                    <span>
                        <Link
                            id="homepage-hours-weeklyhours-link"
                            data-testid="homepage-hours-weeklyhours-link"
                            data-analyticsid={'hours-item-weeklyhours-link'}
                            to={linkToDrupal('/visit-our-spaces/all-opening-hours')}
                            onBlur={closePanel}
                        >
                            <span>
                                {!!libHoursError || !!vemcountError ? <span>In the meantime, s</span> : <span>S</span>}
                                ee all Library and AskUs hours
                            </span>{' '}
                        </Link>
                        <ArrowForwardIcon /> {/* uq ds arrow-right-1 */}
                    </span>
                </StyledOutlinkDiv>
                <StyledDisclaimerParagraph data-testid="locations-hours-disclaimer">
                    {!(!!libHoursError || !!vemcountError) &&
                        '*Student and staff hours. For visitor and community hours, see individual locations.'}
                </StyledDisclaimerParagraph>
            </StyledTableWrapper>
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
    closePanel: PropTypes.func,
};

export default Locations;
