import React from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';
import ContentLoader from 'react-content-loader';

import Grid from '@mui/material/Grid';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import { locale as locationLocale } from 'config/locale';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

const StyledWrapper = styled('div')(({ theme }) => ({
    ['&.locations-wrapper']: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    ['& .locations-wrapper-detail']: {
        flexGrow: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        [theme.breakpoints.down('md')]: {
            overflowX: 'hidden',
            overflowY: 'hidden',
        },
    },
    ['& .table-row']: {
        fontSize: '1.1em',
        fontWeight: 500,
        letterSpacing: '0.16px',
        marginLeft: 8,
        padding: '4px 0 4px 0',
        transition: 'all 0.3s ease',
        ['& a']: {
            color: theme.palette.primary.light,
            textDecoration: 'underline',
        },
        '@media (max-width: 900px)': {
            maxWidth: '98%',
        },
        '@media (min-width: 900px)': {
            maxWidth: '785px',
        },
        '&:hover': {
            backgroundColor: '#f3f3f4', // $grey-50	Background colour to highlight sections, cards or panes
        },
    },
    '& .table-header-cell': {
        fontWeight: 'bold',
    },
    '& .table-cell-hours': {
        fontWeight: 400,
    },
    '& .table-cell-library-name': {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    '& .occupancy': {
        backgroundColor: 'grey',
        border: '1px solid #333',
        borderRadius: '20px',
        fontSize: '0.8em',
        width: '100%',
        '& .full': {
            backgroundColor: theme.palette.primary.light,
            color: 'white',
            display: 'block',
            borderRadius: '20px',
        },
        '& span span': {
            paddingLeft: '24px',
        },
    },
    ['& .outlink']: {
        marginTop: '32px',
        marginLeft: '16px',
        '& a': {
            color: theme.palette.primary.light,
            textDecoration: 'underline',
            fontSize: '1.1em',
            fontWeight: 500,
        },
    },
    ['& .location-askus']: {
        marginTop: '20px',
    },
    ['& .loaderContent']: {
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
const departmentsMap = ['Collections & space', 'Study space'];
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

const Locations = ({ libHours, libHoursLoading, libHoursError, account }) => {
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
                            currently_open: item.times?.currently_open,
                        };
                    });
                }
                const min = 20;
                const max = 100;
                const randomBusynessNumber =
                    item?.abbr === 'Gatton' ? null : Math.floor(Math.random() * (max - min + 1)) + min;
                return {
                    name: item.name,
                    abbr: item.abbr,
                    url: item.url,
                    alt: item.name,
                    campus: locationLocale.hoursCampusMap[item.abbr],
                    departments,
                    // temporaily grab a random number that is the busyness %age
                    // will eventually be an api
                    busyness: randomBusynessNumber,
                };
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
    const sortedHours = alphaHours.sort((a, b) => {
        if (a.abbr === 'AskUs') return 1; // Move 'askus' to the end
        if (b.abbr === 'AskUs') return -1; // Move 'askus' to the end
        return a.abbr?.localeCompare(b.abbr); // Sort the rest alphabetically
    });

    const isOpen = (item, departmentsMapIn = null) => {
        const departmentsMapUsed = departmentsMapIn ?? departmentsMap;
        return item.departments?.filter(d => departmentsMapUsed.includes(d.name))?.find(d => d.currently_open === true);
    };
    const getidFromname = string => {
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
    return (
        <StandardCard noPadding standardCardId="locations-panel">
            <StyledWrapper
                className={`locations-wrapper ${
                    !!account && !!account.id ? 'componentHeight' : 'componentHeightPublic'
                }`}
            >
                {!!libHoursError && (
                    /* istanbul ignore next */ <Fade in={!libHoursLoading} timeout={1000}>
                        <div className={'locations-wrapper-detail'}>
                            <Typography style={{ padding: '1rem' }}>
                                We can’t load opening hours right now. Please refresh your browser or try again later.
                            </Typography>
                        </div>
                    </Fade>
                )}
                {!libHoursError && !!libHours && !libHoursLoading && (
                    <Fade in={!libHoursLoading} timeout={1000}>
                        <div className={'locations-wrapper-detail'} role="table">
                            <p>
                                Note: made up occupancy data (random numbers) also, pretending Gatton isnt returning
                                occupancy data atm
                            </p>
                            <Grid container spacing={1} className="table-row" alignItems={'flex-start'} role="row">
                                <Grid item xs={7}>
                                    <Grid container>
                                        <Grid
                                            item
                                            xs
                                            className={'table-cell-library-name'}
                                            role="columnheader"
                                            id="locations-header-library"
                                        >
                                            <Typography component={'h2'} className={'table-header-cell'}>
                                                Library
                                            </Typography>
                                        </Grid>
                                        <Grid
                                            item
                                            sx={{
                                                display: {
                                                    xs: 'none',
                                                    // at about 700, the Name becomes unreadable
                                                    // then we stop showing the times
                                                    '@media (min-width: 700px)': {
                                                        display: 'block',
                                                    },
                                                },
                                            }}
                                            role="columnheader"
                                            id="locations-header-hours"
                                        >
                                            <Typography component={'h2'} className={'table-header-cell'}>
                                                Opening hours
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={5} role="columnheader" id="locations-header-busyness">
                                    <Typography component={'h2'} className={'table-header-cell'}>
                                        Busy level
                                    </Typography>
                                </Grid>
                            </Grid>
                            {!!sortedHours &&
                                sortedHours.length > 1 &&
                                sortedHours.map((item, index) => {
                                    return (
                                        <Grid
                                            container
                                            data-testid={getidFromname(`hours-item-${item.abbr}`)}
                                            spacing={1}
                                            key={index}
                                            className={`table-row location-${item.abbr.toLowerCase()}`}
                                            alignItems={'flex-start'}
                                            role="row"
                                        >
                                            <Grid item xs={7}>
                                                <Grid container>
                                                    <Grid
                                                        item
                                                        xs
                                                        className={'table-cell-library-name'}
                                                        role="cell"
                                                        aria-labelledby="locations-header-library"
                                                    >
                                                        <a
                                                            aria-label={ariaLabelForLocation(item)}
                                                            data-analyticsid={`hours-item-${index}`}
                                                            href={item.url}
                                                        >
                                                            <span id={`${getidFromname(`hours-item-${item.abbr}`)}`}>
                                                                {item.name}
                                                            </span>
                                                        </a>
                                                    </Grid>
                                                    <Grid
                                                        className={'table-cell-hours'}
                                                        item
                                                        sx={{
                                                            display: {
                                                                xs: 'none',
                                                                // at about 700, the Name becomes unreadable
                                                                // then we stop showing the times
                                                                '@media (min-width: 700px)': {
                                                                    display: 'block',
                                                                },
                                                            },
                                                        }}
                                                        role="cell"
                                                        aria-labelledby={
                                                            'locations-header-hours ' +
                                                            `${getidFromname(`hours-item-${item.abbr}`)}`
                                                        }
                                                    >
                                                        {(() => {
                                                            if (item.abbr === 'AskUs') {
                                                                return item.departments.map(department => {
                                                                    if (['Chat'].includes(department.name)) {
                                                                        return isOpen(item, ['Chat']) ? (
                                                                            <Typography
                                                                                key={`chat-isopen-${department.lid}`}
                                                                            >
                                                                                {department.hours}
                                                                            </Typography>
                                                                        ) : (
                                                                            <Typography
                                                                                key={`chat-isclosed-${department.lid}`}
                                                                            >
                                                                                Closed
                                                                            </Typography>
                                                                        );
                                                                    }
                                                                    return null;
                                                                });
                                                            } else if (hasDepartments(item)) {
                                                                return item.departments.map(department => {
                                                                    if (departmentsMap.includes(department.name)) {
                                                                        return isOpen(item) ? (
                                                                            <Typography
                                                                                key={`department-isopen-${department.lid}`}
                                                                            >
                                                                                {department.hours}
                                                                            </Typography>
                                                                        ) : (
                                                                            <Typography
                                                                                key={`department-isclosed-${department.lid}`}
                                                                            >
                                                                                Closed
                                                                            </Typography>
                                                                        );
                                                                    }
                                                                    return null;
                                                                });
                                                            } else {
                                                                return <Typography>See location</Typography>;
                                                            }
                                                        })()}
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            {item.abbr !== 'AskUs' && item.busyness !== null && (
                                                <Grid
                                                    item
                                                    xs={5}
                                                    role="cell"
                                                    aria-labelledby="locations-header-busyness"
                                                >
                                                    <div className="occupancy">
                                                        <span
                                                            className="full"
                                                            style={{
                                                                width:
                                                                    !hasDepartments(item) || isOpen(item)
                                                                        ? `${item.busyness}%`
                                                                        : 0,
                                                            }}
                                                            title={busynessText(item.busyness)}
                                                        >
                                                            <span>
                                                                {!hasDepartments(item) ||
                                                                (isOpen(item) && item.busyness > 0)
                                                                    ? // ? `${item.busyness}%`
                                                                      ''
                                                                    : 'Closed'}
                                                            </span>
                                                        </span>
                                                    </div>
                                                </Grid>
                                            )}
                                        </Grid>
                                    );
                                })}
                        </div>
                    </Fade>
                )}
                {!libHoursError && !(!!libHours && !libHoursLoading) && (
                    <div className={'loaderContent'}>
                        <MyLoader id="hours-loader" data-testid="hours-loader" aria-label="Locations data is loading" />
                    </div>
                )}
                <div className="outlink">
                    <Link
                        data-testid="homepage-hours-weeklyhours-link"
                        data-analyticsid={'hours-item-weeklyhours-link'}
                        to="https://web.library.uq.edu.au/locations-hours/opening-hours"
                    >
                        See weekly Library and AskUs hours
                    </Link>
                </div>
            </StyledWrapper>
        </StandardCard>
    );
};

Locations.propTypes = {
    libHours: PropTypes.object,
    account: PropTypes.object,
    libHoursLoading: PropTypes.bool,
    libHoursError: PropTypes.bool,
};

export default Locations;