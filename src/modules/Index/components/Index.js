/* eslint max-len: 0 */
import React, { useEffect } from 'react';
import ContentLoader from 'react-content-loader';
import { lazy } from 'react';
import { PropTypes } from 'prop-types';
import { useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { greeting, isEscapeKeyPressed, lazyRetry } from 'helpers/general';

import LibraryUpdates from 'modules/Index/components/subComponents/LibraryUpdates';
import NavigationCardWrapper from './subComponents/NavigationCardWrapper';
import {
    loadPrintBalance,
    searcheSpacePossiblePublications,
    searcheSpaceIncompleteNTROPublications,
    loadLibHours,
    loadCompAvail,
    loadTrainingEvents,
    loadDrupalArticles,
    loadJournalSearchFavourites,
    loadLoans,
} from 'data/actions';
import { canSeeLearningResources, isEspaceAuthor } from 'helpers/access';

const EspaceLinks = lazy(() => lazyRetry(() => import('modules/Index/components/subComponents/EspaceLinks')));
const Locations = lazy(() => lazyRetry(() => import('./subComponents/Locations')));
const LearningResourcesPanel = lazy(() => lazyRetry(() => import('modules/Index/components/subComponents/LearningResourcesPanel')));
// const PastExamPapers = lazy(() => lazyRetry(() => import('./subComponents/PastExamPapersPanel')));
const Training = lazy(() => lazyRetry(() => import('modules/Index/components/subComponents/Training')));
const ReferencingPanel = lazy(() => lazyRetry(() => import('modules/Index/components/subComponents/ReferencingPanel')));
const ReadPublish = lazy(() => lazyRetry(() => import('modules/Index/components/subComponents/ReadPublish')));
const CataloguePanel = lazy(() => lazyRetry(() => import('modules/Index/components/subComponents/CataloguePanel')));

const StyledPortalContainer = styled('div')(() => ({
    paddingTop: 48,
    paddingBottom: 48,
    backgroundColor: '#51247a',
    '@media (max-width: 640px)': {
        paddingBottom: 24,
        paddingTop: 24,
    },
}));

const StyledH1 = styled('h1')(({ theme }) => ({
    marginTop: 0,
    marginBottom: 0,
    paddingTop: 0,
    paddingBottom: 16,
    fontSize: '40px',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: '120%',
    letterSpacing: '0.4px',
    backgroundColor: theme.palette.primary.light,
    color: '#fff',
    fontFamily: 'Montserrat, Helvetica, Arial, sans-serif',
    '@media (max-width: 640px)': {
       paddingBottom: 24,
    },
}));

const StyledBookingLink = styled(Link)(({ theme }) => ({
    color: 'black',
    fontWeight: 400,
    textDecorationColor: theme.palette.primary.light,
    '& span': {
        color: theme.palette.primary.light,
        display: 'block',
        paddingTop: '13px',
    },
}));

const StyledHeading = styled(Typography)(() => ({
    fontSize: '32px',
    fontWeight: 500,
    marginTop: '1rem',
}));

const StyledGridWrapper = styled('div')(() => ({
    marginLeft: '-32px',
    marginRight: '-32px',
    paddingRight: '32px',
    backgroundColor: '#f3f3f4',
    '@media (max-width: 1200px)': {
        marginLeft: '-24px',
    },
}));

const StyledLocationBox = styled(Box)(({ theme }) => ({
backgroundColor: 'white',
    border: '1px solid #DCDCDD',
    borderRadius: '0 0 4px 4px',
    boxShadow: '0px 12px 24px 0px rgba(25, 21, 28, 0.05)',
    marginTop: '2px',
    minWidth: '66%',
    zIndex: 999,
    position: 'absolute',
    top: 50,
    left: 0,
    [theme.breakpoints.down('uqDsDesktop')]: {
        minWidth: '80%',
    },
    [theme.breakpoints.down('uqDsTablet')]: {
        minWidth: '95%',
        left: 5,
    },
}));

const StyledButtonWrapperDiv = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row-reverse',

    '& button': {
        color: theme.palette.primary.light,
        fontSize: '16px',
        marginTop: '6px',
        textDecoration: 'underline',
        textTransform: 'none',
        '&:hover': {
            backgroundColor: 'transparent',
            textDecoration: 'underline',
            '-webkit-text-decoration': 'none',
        },
    },
    '& a': {
        fontSize: '16px',
        height: '40px',
        paddingBlock: '6px',
        marginLeft: '32px',
    },
}));

const StyledGridItemLoggedIn = styled(Grid)(({ theme }) => ({
    paddingLeft: '24px',
    marginBottom: '24px',
    [theme.breakpoints.up('uqDsDesktopXL')]: {
        paddingLeft: '32px',
        marginBottom: '32px',
    },
}));

export const Index = ({
    account,
    accountLoading,
    author,
    libHours,
    libHoursLoading,
    libHoursError,
    // computerAvailability,
    // computerAvailabilityLoading,
    // computerAvailabilityError,
    trainingEvents,
    trainingEventsLoading,
    trainingEventsError,
    printBalance,
    printBalanceLoading,
    possibleRecords,
    possibleRecordsLoading,
    incompleteNTRO,
    incompleteNTROLoading,
    drupalArticleList,
    drupalArticlesError,
    journalSearchList,
    journalSearchLoading,
    journalSearchError,
    loans,
    loansLoading,

}) => {
    const dispatch = useDispatch();

    // handle the location opener
    const [locationOpen, setLocationOpen] = React.useState(false);
    const locationsRef = React.useRef(null);
    const closeOnClickOutsideDialog = (e) => {
        if (locationsRef.current && !locationsRef.current.contains(e.target)) {
            setLocationOpen(false);
        }
    };
    const closeOnEscape = (e) => {
        if (isEscapeKeyPressed(e)) {
            setLocationOpen(false);
        }
    };
    const handleLocationOpenerClick = () => {
        const showLocation = setInterval(() => {
            setLocationOpen(!locationOpen);

            const locationButton = document.getElementById('location-dialog-controller');
            !!locationButton && (locationButton.ariaExpanded = !locationOpen);

            if (!locationOpen) {
                document.addEventListener('mousedown', closeOnClickOutsideDialog);
                document.addEventListener('keydown', closeOnEscape);
            } else {
                document.removeEventListener('mousedown', closeOnClickOutsideDialog);
                document.removeEventListener('keydown', closeOnEscape);
            }

            clearInterval(showLocation);
        }, 10);
        return () => {
            document.removeEventListener('mousedown', closeOnClickOutsideDialog);
            document.removeEventListener('keydown', closeOnEscape);
        };
    };
    const isLocationOpen = Boolean(locationOpen);

    useEffect(() => {
        const siteHeader = document.querySelector('uq-site-header');
        !!siteHeader && siteHeader.removeAttribute('secondleveltitle');
        !!siteHeader && siteHeader.removeAttribute('secondLevelUrl');
    }, []);

    // drupal article stuff here.

    useEffect(() => {
        if (!drupalArticleList || drupalArticleList?.length < 1) {
            dispatch(loadDrupalArticles());
        }
    }, [drupalArticleList, dispatch]);

    // Journal Search favourites here
    useEffect(() => {
        if (accountLoading === false && !!account) {
            dispatch(loadJournalSearchFavourites());
        }
    }, [accountLoading, account, dispatch]);

    useEffect(() => {
        if (accountLoading === false) {
            dispatch(loadLibHours());
            dispatch(loadCompAvail());
        }
    }, [accountLoading, dispatch]);

    useEffect(() => {
        if (accountLoading === false) {
            dispatch(loadTrainingEvents(account));
        }
    }, [account, accountLoading, dispatch]);
    useEffect(() => {
        if (accountLoading === false && !!account && !printBalance && printBalanceLoading === null) {
            dispatch(loadPrintBalance());
        }
    }, [accountLoading, account, printBalance, printBalanceLoading, dispatch]);
    useEffect(() => {
        if (
            accountLoading === false &&
            !!account &&
            !!author &&
            !!author.aut_id &&
            !possibleRecords &&
            possibleRecordsLoading === null
        ) {
            dispatch(searcheSpacePossiblePublications());
        }
    }, [accountLoading, account, author, possibleRecords, possibleRecordsLoading, dispatch]);
    useEffect(() => {
        if (
            accountLoading === false &&
            !!account &&
            !!author &&
            !!author.aut_id &&
            !incompleteNTRO &&
            incompleteNTROLoading === null
        ) {
            dispatch(searcheSpaceIncompleteNTROPublications());
        }
    }, [accountLoading, account, author, incompleteNTRO, incompleteNTROLoading, dispatch]);

    useEffect(() => {
        if (accountLoading === false && !!account && !loans && loansLoading === null) {
            console.log('dispatching');
            dispatch(loadLoans());
        }
    }, [accountLoading, account, loans, loansLoading, dispatch]);

    return (
        <React.Suspense fallback={<ContentLoader message="Loading"/>}>
            <StyledPortalContainer id="search-portal-container" data-testid="search-portal-container">
                <StandardPage>
                    <StyledH1>Library</StyledH1>
                    <search-portal theme="dark" />
                </StandardPage>
            </StyledPortalContainer>
            <div style={{ borderBottom: '1px solid hsla(203, 50%, 30%, 0.15)' }}>
                <div className="layout-card" style={{ position: 'relative' }}>
                    <StyledButtonWrapperDiv style={{ position: 'relative' }}>
                        <StyledBookingLink
                            href="https://uqbookit.uq.edu.au/#/app/booking-types/77b52dde-d704-4b6d-917e-e820f7df07cb"
                            data-testid="homepage-hours-bookit-link"
                        >
                            <span>
                                Book a room
                            </span>
                        </StyledBookingLink>
                        <Button
                            id="location-dialog-controller"
                            data-testid="hours-accordion-open"
                            onClick={handleLocationOpenerClick}
                            aria-haspopup="true"
                            aria-expanded="false"
                            aria-controls="locations-wrapper"
                        >
                            Library locations
                            {!!locationOpen ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
                        </Button>
                    </StyledButtonWrapperDiv>
                    <Fade direction="down" in={!!isLocationOpen} mountOnEnter unmountOnExit>
                        <StyledLocationBox
                            id={'locations-wrapper'}
                            aria-labelledby="location-dialog-controller"
                            ref={locationsRef}
                            role={'dialog'}>
                            <Locations
                                libHours={libHours}
                                libHoursLoading={libHoursLoading}
                                libHoursError={libHoursError}
                                account={account}
                            />
                        </StyledLocationBox>
                    </Fade>
                </div>
            </div>
            {accountLoading === false && !!account && (
                <StandardPage>
                    <StyledGridWrapper>
                        <Grid container>
                            <Grid item uqDsMobile={12} sx={{ marginBottom: '32px', marginLeft: '24px' }}>
                                <StyledHeading component={'h2'} data-testid="homepage-user-greeting">
                                    {greeting()}, {account.firstName || /* istanbul ignore next */ ''}
                                </StyledHeading>
                            </Grid>
                            <Grid className={'gridThree'} item sx={12}>
                                <Grid className={'gridFour'} container>
                                    <Grid className={'gridFive'} item uqDsMobile={4}>
                                        <Grid container className={'gridSix'}>
                                            <StyledGridItemLoggedIn className={'gridSeven'} item uqDsMobile={12} data-testid="primo-panel">
                                                <CataloguePanel account={account} loans={loans} printBalance={printBalance} />
                                            </StyledGridItemLoggedIn>
                                            <StyledGridItemLoggedIn className={'gridEight'} item uqDsMobile={12} data-testid="training-panel">
                                                <Training
                                                    trainingEvents={trainingEvents}
                                                    trainingEventsLoading={trainingEventsLoading}
                                                    trainingEventsError={trainingEventsError}
                                                />
                                            </StyledGridItemLoggedIn>
                                        </Grid>
                                    </Grid>
                                    <Grid item uqDsMobile={8}>
                                        <Grid container>
                                            {canSeeLearningResources(account) && (
                                                <StyledGridItemLoggedIn item uqDsMobile={12} data-testid="learning-resources-panel">
                                                    <LearningResourcesPanel account={account} history={history}/>
                                                </StyledGridItemLoggedIn>
                                            )}

                                            <Grid item uqDsMobile={6}>
                                                <Grid container>
                                                    {/* {canSeeLearningResources(account) && (*/}
                                                    {/*    <StyledGridItemLoggedIn item uqDsMobile={12} data-testid="past-exam-papers-panel">*/}
                                                    {/*        <PastExamPapers account={account} history={history}/>*/}
                                                    {/*    </StyledGridItemLoggedIn>*/}
                                                    {/* )}*/}
                                                    <StyledGridItemLoggedIn  item uqDsMobile={12} data-testid="referencing-panel">
                                                        <ReferencingPanel account={account} />
                                                    </StyledGridItemLoggedIn>
                                                    <StyledGridItemLoggedIn  item uqDsMobile={12} data-testid="readpublish-panel">
                                                        <ReadPublish account={account} journalSearchList={journalSearchList} journalSearchError={journalSearchError} journalSearchLoading={journalSearchLoading} />
                                                    </StyledGridItemLoggedIn>
                                                </Grid>
                                            </Grid>
                                            <Grid item uqDsMobile={6}>
                                                <Grid container>
                                                    {isEspaceAuthor(account, author) && (
                                                        <StyledGridItemLoggedIn item uqDsMobile={12} data-testid="espace-links-panel">
                                                            <EspaceLinks
                                                                author={author}
                                                                possibleRecords={possibleRecords}
                                                                incompleteNTRORecords={incompleteNTRO}
                                                            />
                                                        </StyledGridItemLoggedIn>
                                                    )}
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </StyledGridWrapper>
                </StandardPage>
            )}
            <NavigationCardWrapper account={account} accountLoading={accountLoading} />

            <LibraryUpdates drupalArticleList={drupalArticleList} drupalArticlesError={drupalArticlesError} />
        </React.Suspense>
    );
};

Index.propTypes = {
    account: PropTypes.object,
    accountLoading: PropTypes.bool,
    author: PropTypes.object,
    actions: PropTypes.any,
    libHours: PropTypes.object,
    libHoursLoading: PropTypes.bool,
    libHoursError: PropTypes.bool,
    computerAvailability: PropTypes.array,
    computerAvailabilityLoading: PropTypes.bool,
    computerAvailabilityError: PropTypes.bool,
    trainingEvents: PropTypes.any,
    trainingEventsLoading: PropTypes.bool,
    trainingEventsError: PropTypes.bool,
    possibleRecords: PropTypes.object,
    possibleRecordsLoading: PropTypes.bool,
    incompleteNTRO: PropTypes.object,
    incompleteNTROLoading: PropTypes.bool,
    drupalArticleList: PropTypes.array,
    drupalArticlesLoading: PropTypes.bool,
    drupalArticlesError: PropTypes.bool,
    journalSearchList: PropTypes.any,
    journalSearchLoading: PropTypes.bool,
    journalSearchError: PropTypes.bool,
    loans: PropTypes.any,
    loansLoading: PropTypes.bool,
};

export default Index;
