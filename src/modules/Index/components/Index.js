/* eslint max-len: 0 */
import React, { useEffect } from 'react';
import ContentLoader from 'react-content-loader';
import { lazy } from 'react';
import { PropTypes } from 'prop-types';
import { useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { greeting, isEscapeKeyPressed, lazyRetry } from 'helpers/general';

import LibraryUpdates from 'modules/Index/components/subComponents/LibraryUpdates';
import NavigationCardWrapper from './subComponents/NavigationCardWrapper';
import {
    loadPrintBalance,
    searcheSpacePossiblePublications,
    searcheSpaceIncompleteNTROPublications,
    loadLibHours,
    loadTrainingEvents,
    loadDrupalArticles,
    loadLoans,
} from 'data/actions';
import { canSeeLearningResourcesPanel, isEspaceAuthor, canSeeReadPublish } from 'helpers/access';
import UtilityBar from './subComponents/UtilityBar';

const EspaceLinks = lazy(() => lazyRetry(() => import('modules/Index/components/subComponents/EspaceLinks')));
const LearningResourcesPanel = lazy(() => lazyRetry(() => import('modules/Index/components/subComponents/LearningResourcesPanel')));
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

const StyledHeading = styled(Typography)(() => ({
    fontSize: '32px',
    fontWeight: 500,
    marginTop: '1rem',
}));

const StyledGridWrapper = styled('div')(() => ({
    backgroundColor: '#f3f3f4',
    '@media (max-width: 1200px)': {
        marginLeft: '-24px',
    },
}));

const StyledGridItemLoggedIn = styled(Grid)(({ theme }) => ({
    paddingLeft: '24px',
    marginBottom: '24px',
    // [theme.breakpoints.down('uqDsDesktop')]: {
    //     paddingRight: '24px',
    // },
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
            <UtilityBar
                libHours={libHours}
                libHoursLoading={libHoursLoading}
                libHoursError={libHoursError}
            />
            {accountLoading === false && !!account && (
                <StyledGridWrapper>
                    <StandardPage>
                        <Grid container>
                            <Grid item uqDsMobile={12} sx={{ marginBottom: '32px', marginLeft: '24px' }}>
                                <StyledHeading component={'h2'} data-testid="homepage-user-greeting">
                                    {greeting()}, {account.firstName || /* istanbul ignore next */ ''}
                                </StyledHeading>
                            </Grid>
                            <Grid item>
                                <Grid container>
                                    <Grid item uqDsDesktop={4} uqDsMobile={12}>
                                        <Grid container>
                                            <StyledGridItemLoggedIn item uqDsMobile={12} data-testid="primo-panel">
                                                <CataloguePanel account={account} loans={loans} printBalance={printBalance} />
                                            </StyledGridItemLoggedIn>
                                            <StyledGridItemLoggedIn item uqDsMobile={12} data-testid="training-panel">
                                                <Training
                                                    trainingEvents={trainingEvents}
                                                    trainingEventsLoading={trainingEventsLoading}
                                                    trainingEventsError={trainingEventsError}
                                                />
                                            </StyledGridItemLoggedIn>
                                        </Grid>
                                    </Grid>
                                    <Grid item uqDsDesktop={8}>
                                        <Grid container>
                                            {canSeeLearningResourcesPanel(account) && (
                                                <StyledGridItemLoggedIn item uqDsMobile={12} data-testid="learning-resources-panel">
                                                    <LearningResourcesPanel account={account} history={history}/>
                                                </StyledGridItemLoggedIn>
                                            )}

                                            <Grid item uqDsDesktop={6} uqDsMobile={12}>
                                                <Grid container>
                                                    <StyledGridItemLoggedIn  item uqDsMobile={12} data-testid="referencing-panel">
                                                        <ReferencingPanel account={account} />
                                                    </StyledGridItemLoggedIn>
                                                    {canSeeReadPublish(account) && (
                                                        <StyledGridItemLoggedIn  item uqDsMobile={12} data-testid="readpublish-panel">
                                                            <ReadPublish />
                                                        </StyledGridItemLoggedIn>
                                                    )}
                                                </Grid>
                                            </Grid>
                                            <Grid item uqDsDesktop={6}>
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
                    </StandardPage>
                </StyledGridWrapper>
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
    loans: PropTypes.any,
    loansLoading: PropTypes.bool,
    printBalance: PropTypes.any,
    printBalanceLoading: PropTypes.bool,
};

export default Index;
