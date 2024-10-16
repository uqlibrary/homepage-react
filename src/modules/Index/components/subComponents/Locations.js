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
    marginTop: '24px',
    marginLeft: '32px',
    marginRight: '40px',
    [theme.breakpoints.down('uqDsTablet')]: {
        margin: '24px 0 24px',
    },
    '& .wrapper2': {
        width: '100%',
    },
    '& table': {
        width: '100%',
        borderCollapse: 'collapse',
    },
    '& tr': {
        height: '2rem',
        '& td:not(:first-child)': {
            width: '1%', // this allows the library name cell to do an ellipsis
            whiteSpace: 'nowrap',
        },
        '& th:not(:first-child)': {
            width: '1%',
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
    '& .table-cell-name a': {
        marginTop: '4px',
    },
    '& th .table-cell-name-content': {
        marginTop: '4px',
    },
    '& .table-cell-name-content': {
        overflow: 'hidden',
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
    },
    '& .table-row': {
        '& a': {
            color: theme.palette.primary.light,
            textDecoration: 'underline',
            '&:hover': {
                backgroundColor: 'inherit',
            },
        },
    },
    '& .table-row-body': {
        '&:hover': {
            backgroundColor: '#f3f3f4', // $grey-50	Background colour to highlight sections, cards or panes
        },
    },
    '& .table-column-busy': {
        paddingBlock: 0,
        '& > div': {
            marginLeft: '24px',
        },
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
            },
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
        '& a': {
            display: 'flex',
            alignItems: 'center',
            color: theme.palette.primary.light,
            textDecoration: 'underline',
            fontSize: '16px',
            fontWeight: 500,
            '&:hover': {
                color: 'white',
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
export const ariaLabelForLocation = item => {
    const name = item.name;
    const hours =
        item.departments.length > 0 &&
        item.departments.map(i => {
            if (departmentsMap.includes(i.name)) {
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
            if (departmentsMap.includes(item.name)) {
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

// eventually, call the api
const vemcountapi = {
    data: [
        {
            id: 14976, // Duhig Tower
            headCount: 160,
            capacity: 294,
        },
        {
            id: 14975, // Central Library
            headCount: 2,
            capacity: 770,
        },
        {
            id: 14974, // Architecture & Music Library
            headCount: 90,
            capacity: 105,
        },
        {
            id: 14977, // Biological Sciences Library
            headCount: 290,
            capacity: 595,
        },
        {
            id: 14979, // DHESL
            headCount: 130,
            capacity: 315,
        },
        // mock data, gatton did not return a response
        // {
        //     id: 14985, // Gatton
        //     headCount: 16,
        //     capacity: 378,
        // },
        {
            id: 14983, // Herston
            headCount: 70,
            capacity: 70,
        },
        {
            id: 14978, // Law
            headCount: 100,
            capacity: 196,
        },
        {
            id: 14980, // Dutton Park  (Pace)
            headCount: 27,
            capacity: 112,
        },
    ],
    // missing:
    // 4986 askus
    // 3832 fryer - FW Robinson Reading Room
    // 3966 whitty
};

// this table maps those locations who exist on vemcount against their matching speingshare location
// note: not all locations have vemcount people-counting gates
const vemmcountSpringshareMapping = [
    {
        springshareId: 3967,
        vemcountId: 14980,
        name: 'Dutton park', // this doesn't need to match either system, its for the developer to not have to track raw numbers
    },
    {
        springshareId: 3842,
        vemcountId: 14975,
        name: 'Central',
    },
    {
        springshareId: 3823,
        vemcountId: 14974,
        name: 'Architecture',
    },
    {
        springshareId: 3824,
        vemcountId: 14977,
        name: 'BSL',
    },
    {
        springshareId: 3825,
        vemcountId: 14979,
        name: 'DHESL',
    },
    {
        springshareId: 3830,
        vemcountId: 14976,
        name: 'Duhig tower',
    },
    {
        springshareId: 3833,
        vemcountId: 14985,
        name: 'Gatton',
    },
    {
        springshareId: 3838,
        vemcountId: 14983,
        name: 'Herston',
    },
    {
        springshareId: 3841,
        vemcountId: 14978,
        name: 'Law',
    },
];

const VEMCOUNT_LOCATION_DATA_EXPECTED_BUT_MISSING = 'Missing';
const Locations = ({ libHours, libHoursLoading, libHoursError }) => {
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
        (!libHoursError &&
            !!libHours &&
            !!libHours.locations &&
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

                function vemcountPercentByLocation(springshareLocationId) {
                    const vemcountholder = vemmcountSpringshareMapping.filter(
                        m => m.springshareId === springshareLocationId,
                    );
                    const vemcountLocation = vemcountholder?.pop();
                    const vemcountId = vemcountLocation?.vemcountId;
                    // vemcountapi constant, above, wil be replaced wih api results
                    const vemcountWrapper = vemcountapi?.data?.filter(v => v.id === vemcountId);
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
                    } else if (vemcountBusynessPercent > 0 && vemcountBusynessPercent < minimumDisplayedPercentage) {
                        // don't let the bar go below what shows as a small curve on the left
                        calculatedBusyness = minimumDisplayedPercentage;
                    } else if (vemcountBusynessPercent > 0) {
                        calculatedBusyness = Math.floor(vemcountBusynessPercent);
                    } else {
                        calculatedBusyness = null;
                    }

                    return calculatedBusyness;
                }

                const min = 5;
                const max = 100;
                function tempCalcLocationBusiness() {
                    // this wil be replaced wih api results
                    if (location?.abbr === 'Gatton') {
                        return null;
                    }
                    if (location?.abbr === 'Herston') {
                        return 100;
                    }
                    if (location?.abbr === 'Biol Sci') {
                        return VEMCOUNT_LOCATION_DATA_EXPECTED_BUT_MISSING;
                    }
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                }

                const randomBusynessNumber = tempCalcLocationBusiness();
                return {
                    name: location.name,
                    abbr: location.abbr,
                    url: location.url,
                    alt: location.name,
                    campus: locationLocale.hoursCampusMap[location.abbr],
                    departments,
                    busyness: randomBusynessNumber,
                    // busyness: getVemcountPercentage(location?.lid, location.name) || null,
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
        if (location.abbr === 'AskUs') {
            return location.departments.map(department => {
                if (['Chat'].includes(department.name)) {
                    return department.hours;
                }
                return null;
            });
        }
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
                    className={`occupancyPercent occupancyPercent${location.busyness}`}
                    style={{
                        width: !hasDepartments(location) || isOpen(location) ? `${location.busyness}%` : 0,
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
                {!!libHoursError && (
                    <Fade in={!libHoursLoading} timeout={1000}>
                        <div className={'locations-wrapper'}>
                            <Typography style={{ padding: '1rem' }}>
                                We can’t load opening hours right now. Please refresh your browser or try again later.
                            </Typography>
                        </div>
                    </Fade>
                )}
                {!libHoursError && !!libHours && !libHoursLoading && (
                    <Fade in={!libHoursLoading} timeout={1000}>
                        <div className={'wrapper2'}>
                            <table className={'locations-wrapper'}>
                                <thead className="table-row-header">
                                    <tr className={'table-row'}>
                                        <th className={'table-column-library-name'} id="locations-header-library">
                                            <div className={'table-cell-name-content'}>Library</div>
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
                                                >
                                                    <td
                                                        className={
                                                            'table-body-cell table-cell-name table-column-library-name'
                                                        }
                                                        aria-labelledby="locations-header-library"
                                                    >
                                                        <a
                                                            id={`${sluggifyName(`hours-item-${location.abbr}`)}`}
                                                            aria-label={ariaLabelForLocation(location)}
                                                            data-analyticsid={`hours-item-${index}`}
                                                            href={location.url}
                                                            style={{ paddingBlock: 0 }}
                                                            className={'table-cell-name-content'}
                                                        >
                                                            {location.abbr === 'AskUs'
                                                                ? 'AskUs chat hours'
                                                                : location.name}
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
                                                            {getLibraryHours(location)}
                                                        </td>
                                                    )}
                                                    <td
                                                        aria-labelledby="locations-header-busyness"
                                                        className={'table-body-cell table-cell-busy table-column-busy'}
                                                    >
                                                        <div>{getBusyness(location)}</div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </div>
                    </Fade>
                )}
                {!!libHoursLoading && !libHoursError && !libHours && (
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
                        <span>See weekly Library and AskUs hours</span> <ArrowForwardIcon /> {/* uq ds arrow-right-1 */}
                    </Link>
                </div>
                <p className={'disclaimer'}>
                    *Student and staff hours only. For visitor and community hours, see individual Library links above.
                </p>
            </StyledWrapper>
        </StyledStandardCard>
    );
};

Locations.propTypes = {
    libHours: PropTypes.object,
    libHoursLoading: PropTypes.bool,
    libHoursError: PropTypes.bool,
};

export default Locations;
