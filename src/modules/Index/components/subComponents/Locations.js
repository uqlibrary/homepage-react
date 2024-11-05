import React from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';
import ContentLoader from 'react-content-loader';

import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

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
    top: 50,

    minWidth: '66%',
    [theme.breakpoints.down('uqDsDesktop')]: {
        minWidth: '80%',
        left: '0 !important',
        padding: '1px 24px',
    },
    [theme.breakpoints.down('uqDsTablet')]: {
        minWidth: 'auto',
        maxWidth: '95%',
        left: 5,
    },
}));
const StyledWrapper = styled('div')(({ theme }) => ({
    margin: 0,
    [theme.breakpoints.down('uqDsTablet')]: {
        margin: '24px 0 24px',
    },
    '& .wrapper2': {
        width: '100%',
    },
    '& table': {
        width: '85%',
        borderCollapse: 'collapse',
        margin: '24px 40px 0 32px',
    },
    '& tr': {
        height: '2rem',
        '& td:not(:first-of-type)': {
            // width: '1%', // this allows the library name cell to do an ellipsis
            whiteSpace: 'nowrap',
        },
        '& th:not(:first-of-type)': {
            // width: '1%',
            whiteSpace: 'nowrap',
        },
    },
    '& td': {
        position: 'relative',
    },
    '& th': {
        position: 'relative',
        textAlign: 'left',
        color: theme.palette.secondary.dark,
    },
    '& .table-row-body': {
        transition: 'color 200ms ease-out, background-color 200ms ease-out',
        '&:hover': {
            cursor: 'pointer',
            '& td:first-of-type a': {
                backgroundColor: theme.palette.primary.light,
                color: 'white',
            },
        },
        '& td a': {
            marginBlock: '4px',
            padding: 0,
            textDecoration: 'underline',
            '&:hover': {
                color: 'inherit',
                backgroundColor: 'inherit',
            },
        },
        '& td:not(:first-of-type) a': {
            textDecoration: 'none',
        },
    },
    '& .table-cell-hours a': {
        color: '#3B383E',
        fontWeight: 400,
    },
    '& .table-column-busy': {
        paddingBlock: 0,
        marginRight: '40px',
        // width: '150px', // needs adjustment for mobile?
    },
    '& a:has(.occupancy)': {
        width: '150px', // needs adjustment for mobile?
    },
    '& .occupancy': {
        backgroundColor: '#dcdcdc',
        borderRadius: '20px',
        fontSize: '0.8em',
        width: '100%',
        height: '16px',
        '& .occupancyPercent': {
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.primary.light,
            display: 'block',
            borderTopLeftRadius: '20px',
            borderBottomLeftRadius: '20px',
            height: '16px',
            '& span': {
                paddingLeft: '24px',
                borderTopRightRadius: '20px',
                borderBottomRightRadius: '20px',
            },
        },
        '& .occupancyPercentLong': {
            borderTopRightRadius: '20px',
            borderBottomRightRadius: '20px',
        },
        '& .occupancyPercent:has(.occupancyText)': {
            lineHeight: '18px',
        },
        '& .occupancyPercent100': {
            borderTopRightRadius: '20px',
            borderBottomRightRadius: '20px',
        },
    },
    '& .occupancyTextClosed': {
        textAlign: 'center',
    },
    '& .occupancyText': {
        color: theme.palette.secondary.main,
        fontWeight: 400,
        '& svg': {
            height: '16px',
            width: 'auto',
            marginTop: '2px',
        },
        '& span': {
            marginTop: '-2px',
        },
    },
    '& .outlink': {
        marginTop: '32px',
        padding: '4px 40px 4px 32px',
        '&:hover': {
            backgroundColor: '#f3f3f4', // $grey-50	Background colour to highlight sections, cards or panes
        },
        '& a': {
            display: 'flex',
            alignItems: 'center',
            color: theme.palette.primary.light,
            textDecoration: 'underline',
            fontSize: '16px',
            fontWeight: 500,
            '&:hover': {
                backgroundColor: 'inherit',
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
        paddingLeft: '32px',
        paddingRight: '40px',
        paddingBottom: '24px',
        fontSize: '14px',
        fontStyle: 'normal',
        fontWeight: 400,
        letterSpacing: '0.14px',
        lineHeight: '160%', // 25.6px
    },
    '& .location-askus': {
        marginTop: '20px',
    },
    '& .loaderContent': {
        flexGrow: 1,
        overflowY: 'hidden',
        overflowX: 'hidden',
        marginLeft: '32px',
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
    // if not present in the lookup table, use the value passed from Springhshare
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
    const [isWideScreen, setIsWideScreen] = React.useState(window.innerWidth > 700);
    React.useEffect(() => {
        const handleResize = () => {
            setIsWideScreen(window.innerWidth > 700);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup the event listener on component unmount
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

                    const vemcountBusynessPercent = vemcountPercentByLocation(springshareLocationId);
                    let calculatedBusyness;
                    if (vemcountBusynessPercent === VEMCOUNT_LOCATION_DATA_EXPECTED_BUT_MISSING) {
                        calculatedBusyness = vemcountBusynessPercent;
                    } else if (!!isNaN(vemcountBusynessPercent)) {
                        calculatedBusyness = null;
                    } else if (vemcountBusynessPercent < minimumDisplayedPercentage) {
                        // don't let the bar go below what shows as a small curve on the left
                        calculatedBusyness = minimumDisplayedPercentage;
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
        .filter(l => isWideScreen || l.abbr !== 'AskUs') // remove the askus line when on smaller screens, it lacks extra info
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

    const isOpen = (item, departmentsMapIn = null) => {
        const departmentsMapUsed = departmentsMapIn ?? departmentsMap;
        return item.departments?.filter(d => departmentsMapUsed.includes(d.name))?.find(d => d.currently_open === true);
    };
    const sluggifyName = string => {
        // standardise a string
        return string.toLowerCase().replace(' ', '-');
    };
    const busynessText = busyness => {
        if (busyness <= 25) {
            return 'Not busy';
        }
        if (busyness <= 50) {
            return 'Moderately busy';
        }
        if (busyness <= 75) {
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

    function getBusyness(location) {
        if (location.abbr === 'AskUs') {
            return null;
        }
        if (!hasDepartments(location)) {
            return (
                <div className="occupancyText">
                    <UqDsExclamationCircle /> <span>No information</span>
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
                    <UqDsExclamationCircle /> <span>No information</span>
                </div>
            );
        }
        return (
            <div className="occupancy">
                <div
                    className={`occupancyPercent ${
                        location.busyness > 96 ? 'occupancyPercentLong' : ''
                    } occupancyPercent${location.busyness}`}
                    style={{
                        width:
                            !hasDepartments(location) || isOpen(location)
                                ? `${location.busyness}%`
                                : /* istanbul ignore next */ 0,
                    }}
                    title={busynessText(location.busyness)}
                >
                    <span>{/* ${location.busyness}%*/}</span>
                </div>
            </div>
        );
    }

    return (
        <StyledStandardCard noPadding noHeader standardCardId="locations-panel">
            <StyledWrapper id="tablewrapper">
                {(!!libHoursError || !!vemcountError) && (
                    <Fade in={!libHoursLoading} timeout={1000}>
                        <div className={'locations-wrapper'}>
                            <Typography style={{ padding: '1rem' }}>
                                We can’t load location information right now. Please refresh your browser or try again
                                later.
                            </Typography>
                        </div>
                    </Fade>
                )}
                {!libHoursError && !!libHours && !libHoursLoading && !vemcountError && !!vemcount && !vemcountLoading && (
                    <Fade in={!libHoursLoading} timeout={1000}>
                        <div className={'wrapper2'}>
                            <table className={'locations-wrapper'}>
                                <thead className="table-row-header">
                                    <tr className={'table-row'}>
                                        <th className={'table-header-name'} id="locations-header-library">
                                            <div>Library</div>
                                        </th>
                                        {isWideScreen && (
                                            <th
                                                className={'table-header-cell table-column-hours'}
                                                id="locations-header-hours"
                                            >
                                                Opening hours*
                                            </th>
                                        )}
                                        <th
                                            id="locations-header-busyness"
                                            className={'table-header-cell table-column-busy'}
                                        >
                                            <div>Busy level</div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {!!sortedHours &&
                                        sortedHours.length > 1 &&
                                        sortedHours.map((location, index) => {
                                            return (
                                                <tr
                                                    data-testid={sluggifyName(`hours-item-${location.abbr}`)}
                                                    key={index}
                                                    className={`table-row table-row-body location-${location.abbr.toLowerCase()}`}
                                                    data-analyticsid={`hours-item-${index}`}
                                                >
                                                    <td
                                                        className={'table-body-cell table-cell-name'}
                                                        aria-labelledby="locations-header-library"
                                                    >
                                                        <a
                                                            id={`${sluggifyName(`hours-item-${location.abbr}`)}`}
                                                            data-testid={`hours-item-name-${index}`}
                                                            href={location.url}
                                                            style={{ paddingBlock: 0 }}
                                                        >
                                                            {getOverrideLocationName(location.abbr) || location.name}
                                                        </a>
                                                    </td>
                                                    {isWideScreen && (
                                                        <td
                                                            className={
                                                                'table-body-cell table-column-hours table-cell-hours'
                                                            }
                                                            aria-labelledby={
                                                                'locations-header-hours ' +
                                                                `${sluggifyName(`hours-item-${location.abbr}`)}`
                                                            }
                                                        >
                                                            <a
                                                                aria-label={ariaLabelForLocation(location)}
                                                                data-testid={`hours-item-hours-${index}`}
                                                                href={location.url}
                                                                style={{ paddingBlock: 0 }}
                                                            >
                                                                {getLibraryHours(location)}
                                                            </a>
                                                        </td>
                                                    )}
                                                    <td
                                                        aria-labelledby="locations-header-busyness"
                                                        className={'table-body-cell table-cell-busy table-column-busy'}
                                                    >
                                                        <a
                                                            aria-label={ariaLabelForLocation(location)}
                                                            data-testid={`hours-item-busy-${index}`}
                                                            href={location.url}
                                                            style={{ paddingBlock: 0 }}
                                                        >
                                                            {getBusyness(location)}
                                                        </a>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
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
                    <Link
                        data-testid="homepage-hours-weeklyhours-link"
                        data-analyticsid={'hours-item-weeklyhours-link'}
                        to={linkToDrupal('/locations-hours/opening-hours')}
                    >
                        <span>
                            {!!libHoursError || !!vemcountError ? <span>In the meantime, s</span> : <span>S</span>}
                            ee weekly Library and AskUs hours
                        </span>{' '}
                        <ArrowForwardIcon /> {/* uq ds arrow-right-1 */}
                    </Link>
                </div>
                <p className={'disclaimer'}>
                    {!(!!libHoursError || !!vemcountError) &&
                        '*Student and staff hours only. For visitor and community hours, see individual Library links above.'}
                </p>
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
