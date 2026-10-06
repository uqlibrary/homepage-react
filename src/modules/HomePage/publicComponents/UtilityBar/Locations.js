import React from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router';
import ContentLoader from 'react-content-loader';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';

import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';

import { getVemcountPercentage, ariaLabelForLocation } from './helpers';
import BusynessBar from './partials/BusynessBar';

import { ASKUS_SPRINGSHARE_ID, locale as locationLocale, WHITTY_SPRINGSHARE_ID } from 'config/locale';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { linkToDrupal } from 'helpers/general';

const StyledStandardCard = styled(StandardCard)(({ theme }) => ({
    marginBottom: '32px',
    '& .MuiCardHeader-root': {
        paddingBlock: '12px',
    },
    backgroundColor: 'white',
    border: theme.palette.designSystem.border,
    borderRadius: '0 0 4px 4px',
    boxShadow: '0px 12px 24px 0px rgba(25, 21, 28, 0.05)',
    marginTop: '-3px',
    zIndex: 999,
    position: 'absolute',
    top: 97,
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
        color: theme.palette.primary.main,
        textDecoration: 'underline',
        fontSize: '16px',
        fontWeight: 500,
        letterSpacing: '0.16px',
        '&:hover': {
            color: '#fff',
            backgroundColor: theme.palette.primary.main,
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
    fontSize: theme.palette.designSystem.bodySmallFontSize,
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
        maxWidth: '345px',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        '& a': {
            paddingBlock: 0, // override mui
            '&:focus': {
                color: '#fff',
                backgroundColor: theme.palette.primary.main,
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
        color: theme.palette.designSystem.bodyCopy,
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
    '& .locations-error': {
        padding: '1rem 1rem 1rem 0',
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
        if (e.key === 'Tab' && e.shiftKey) {
            // when the user back-clicks out of the first link on the Locations dialog
            e.preventDefault();
            const openerCloserButton = document.getElementById('location-dialog-controller');
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
                location.abbr = locationLocale.locationAbbreviations[location.lid];

                return {
                    lid: location?.lid,
                    displayName: location?.display_name,
                    abbr: location?.abbr,
                    url: location?.url,
                    openingHours: location?.opening_hours || 'See location',
                    vemcountZoneId: location?.vemcount_zone_id,
                    isCurrentlyOpen: location?.currently_open,
                    campus: location?.campus_name,
                    busyness: getVemcountPercentage(location?.vemcount_zone_id, vemcount.data.locationList) || null,
                };
            })) ||
        [];
    const sortedHours = cleanedHours
        .filter(e => e !== null)
        .filter(l => l.lid !== WHITTY_SPRINGSHARE_ID) // remove this from springshare data for homepage
        // remove the askus line when on smaller screens, it lacks extra info
        .filter(l => screenWidth > theme.breakpoints.values.uqDsTablet || l.lid !== ASKUS_SPRINGSHARE_ID)
        .sort((a, b) => {
            // Askus goes last in the list
            if (a.lid === ASKUS_SPRINGSHARE_ID) return 1;
            if (b.lid === ASKUS_SPRINGSHARE_ID) return -1;

            // Otherwise, sort alphabetically by name
            return a.displayName.localeCompare(b.displayName);
        });

    return (
        <StyledStandardCard noPadding noHeader standardCardId="locations-panel">
            <StyledTableWrapper id="locationsTableWrapper">
                {(() => {
                    if (!!libHoursLoading || !!vemcountLoading) {
                        return (
                            <div className={'loaderContent'}>
                                <MyLoader id="hours-loader" />
                            </div>
                        );
                    } else if (!!libHoursError || !!vemcountError) {
                        return (
                            <div>
                                <Typography className={'locations-error'} data-testid="locations-error">
                                    We can't load opening hours or how busy Library spaces are right now. Please refresh
                                    your browser or try again later.
                                </Typography>
                            </div>
                        );
                    } else {
                        return (
                            <>
                                {/* Header Row */}
                                <Grid container className="table-row table-row-header">
                                    <Grid item id="header-library" className={'table-column-name'} aria-hidden="true">
                                        <Typography component="h3" variant="h6">
                                            Library
                                        </Typography>
                                    </Grid>
                                    <Grid item className="table-column-hours" id="header-hours" aria-hidden="true">
                                        <Typography component="h3" variant="h6">
                                            Opening hours*
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        item
                                        className="table-column-busy occupancyWrapper"
                                        id="header-busy"
                                        aria-hidden="true"
                                    >
                                        <Typography component="h3" variant="h6">
                                            Busy level
                                        </Typography>
                                    </Grid>
                                </Grid>

                                {/* Body Rows */}
                                {!!sortedHours &&
                                    sortedHours.length > 1 &&
                                    sortedHours.map((location, index) => {
                                        const librarySlug = `hours-item-${location.abbr}`;
                                        return (
                                            <Grid
                                                container
                                                key={index}
                                                className={`table-row table-row-body location-${location.abbr}`}
                                                data-testid={librarySlug}
                                            >
                                                <Grid
                                                    item
                                                    id={`library-name-${location.abbr}`}
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
                                                        data-analyticsid={`hours-item-${index}`}
                                                    >
                                                        {location.displayName}
                                                    </Link>
                                                </Grid>
                                                <Grid
                                                    item
                                                    className="table-cell table-column-hours table-cell-hastext"
                                                    aria-labelledby={`header-hours library-name-${location.abbr}`}
                                                    aria-hidden="true"
                                                >
                                                    <Typography
                                                        component={'span'}
                                                        data-testid={`location-item-${location.abbr}-hours`}
                                                    >
                                                        {location?.openingHours}
                                                    </Typography>
                                                </Grid>
                                                <Grid
                                                    item
                                                    className="table-cell table-cell-busy table-column-busy"
                                                    data-testid={`hours-item-busy-${location.abbr}`}
                                                    aria-labelledby={`header-busy library-name-${location.abbr}`}
                                                    aria-hidden="true"
                                                >
                                                    <div className={'occupancyWrapper'}>
                                                        <BusynessBar location={location} />
                                                    </div>
                                                </Grid>
                                            </Grid>
                                        );
                                    })}
                            </>
                        );
                    }
                })()}
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
