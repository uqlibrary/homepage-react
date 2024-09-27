/* eslint max-len: 0 */
import React, { useEffect } from 'react';
import ContentLoader from 'react-content-loader';
import { lazy } from 'react';
import { PropTypes } from 'prop-types';
import { useDispatch } from 'react-redux';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { greeting, lazyRetry } from 'helpers/general';

import LibraryUpdates from 'modules/Index/components/subComponents/LibraryUpdates';
import NavigationCardWrapper from './subComponents/NavigationCardWrapper';
import {
    searcheSpacePossiblePublications,
    searcheSpaceIncompleteNTROPublications,
    loadLibHours,
    loadCompAvail,
    loadTrainingEvents,
    loadDrupalArticles,
    loadJournalSearchFavourites,
    loadLoans
} from 'data/actions';
import { canSeeLearningResources, isEspaceAuthor } from 'helpers/access';

const EspaceLinks = lazy(() => lazyRetry(() => import('modules/Index/components/subComponents/EspaceLinks')));
const Locations = lazy(() => lazyRetry(() => import('./subComponents/Locations')));
const LearningResourcesPanel = lazy(() => lazyRetry(() => import('modules/Index/components/subComponents/LearningResourcesPanel')));
const PastExamPapers = lazy(() => lazyRetry(() => import('./subComponents/PastExamPapersPanel')));
const Training = lazy(() => lazyRetry(() => import('modules/Index/components/subComponents/Training')));
const ReferencingPanel = lazy(() => lazyRetry(() => import('modules/Index/components/subComponents/ReferencingPanel')));
const ReadPublish = lazy(() => lazyRetry(() => import('modules/Index/components/subComponents/ReadPublish')));

const StyledAccordion = styled(Accordion)(() => ({
    backgroundColor: 'inherit',
    border: 'none',
    boxShadow: 'none',
}));

const StyledAccordionSummary = styled(AccordionSummary)(() => ({
    display: 'inline-flex',
    width: 'auto',
    minWidth: 0,
    paddingLeft: 0,
    minHeight: '48px !important',
    '& .MuiAccordionSummary-content': {
        margin: '0 !important',
    },
    '& .MuiAccordionSummary-contentGutters': {
        margin: '0 !important',
    },
}));

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

const StyleWrapper = styled('div')(() => ({
    position: 'relative',
}));

const StyledLink = styled(Link)(({ theme }) => ({
    color: 'black',
    fontWeight: 400,
    textDecorationColor: theme.palette.primary.light,
    '& span': {
        color: theme.palette.primary.light,
        display: 'block',
        paddingTop: '14px',
    },
    '@media (min-width: 640px)': {
        position: 'absolute',
        top: 0,
        right: '10px',
        zIndex: 10,
    },
}));

const StyledHeading = styled(Typography)(() => ({
    fontSize: '32px',
    fontWeight: 500,
    marginTop: '1rem',
}));

const StyledSummary = styled('span')(({ theme }) => ({
    color: theme.palette.primary.light,
    textDecoration: 'underline',
    fontFamily: 'Roboto, sans-serif',
    fontWeight: 400,
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
    // console.log('drupal article list in index feeder,', drupalArticleList);
    const dispatch = useDispatch();

    React.useEffect(() => {
        const siteHeader = document.querySelector('uq-site-header');
        !!siteHeader && siteHeader.removeAttribute('secondleveltitle');
        !!siteHeader && siteHeader.removeAttribute('secondLevelUrl');
    }, []);


    // drupal article stuff here.

    useEffect(() => {
        if (!drupalArticleList || drupalArticleList?.length < 1) {
            // console.log('dispatching', drupalArticleList);
            dispatch(loadDrupalArticles());
        }
    }, [drupalArticleList, dispatch]);

    // Journal Search favourites here
    useEffect(() => {
        if (accountLoading === false && !!account) {
            // console.log('dispatching', drupalArticleList);
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
            console.log("dispatching")
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
                <div className="layout-card">
                    <StyleWrapper>
                        <StyledLink
                            href="https://uqbookit.uq.edu.au/#/app/booking-types/77b52dde-d704-4b6d-917e-e820f7df07cb"
                            data-testid="homepage-hours-bookit-link"
                            >
                            <span>
                                Make a booking
                            </span>
                        </StyledLink>
                        <StyledAccordion>
                            <StyledAccordionSummary
                                expandIcon={<ExpandMoreIcon/>}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                                data-testid="hours-accordion-open"
                            >
                                <StyledSummary>Library locations</StyledSummary>
                            </StyledAccordionSummary>
                            <AccordionDetails>
                                <Locations
                                    libHours={libHours}
                                    libHoursLoading={libHoursLoading}
                                    libHoursError={libHoursError}
                                    account={account}
                                />
                            </AccordionDetails>
                        </StyledAccordion>
                    </StyleWrapper>
                </div>
            </div>
            {console.log("loans", loans)}
            {accountLoading === false && !!account && (
                <StandardPage>
                    <Grid container spacing={4} style={{ paddingBottom: '1em' }}>
                        <Grid item xs={12}>
                            <StyledHeading component={'h2'} data-testid="homepage-user-greeting">
                                {greeting()}, {account.firstName || /* istanbul ignore next */ ''}
                            </StyledHeading>
                        </Grid>
                        <Grid item xs={12} md={4} data-testid="training-panel" sx={{ paddingTop: '0px' }}>
                            <Training
                                trainingEvents={trainingEvents}
                                trainingEventsLoading={trainingEventsLoading}
                                trainingEventsError={trainingEventsError}
                            />
                        </Grid>
                        {canSeeLearningResources(account) && (
                            <Grid item xs={12} md={4} data-testid="learning-resources-panel" sx={{ paddingTop: '0px' }}>
                                <LearningResourcesPanel account={account} history={history}/>
                            </Grid>
                        )}
                        {canSeeLearningResources(account) && (
                            <Grid item xs={12} md={4} data-testid="past-exam-papers-panel" sx={{ paddingTop: '0px' }}>
                                <PastExamPapers account={account} history={history}/>
                            </Grid>
                        )}
                        {isEspaceAuthor(account, author) && (
                            <Grid item xs={12} md={4} data-testid="espace-links-panel" sx={{ paddingTop: '0px' }}>
                                <EspaceLinks
                                    author={author}
                                    possibleRecords={possibleRecords}
                                    incompleteNTRORecords={incompleteNTRO}
                                />
                            </Grid>
                        )}
                        <Grid  item xs={12} md={4} data-testid="referencing-panel" sx={{ paddingTop: '0px' }}>
                            <ReferencingPanel account={account} />
                        </Grid>
                        <Grid  item xs={12} md={4} data-testid="referencing-panel" sx={{ paddingTop: '0px' }}>
                            <ReadPublish account={account} journalSearchList={journalSearchList} journalSearchError={journalSearchError} journalSearchLoading={journalSearchLoading} />
                        </Grid>
                    </Grid>
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
    journalSearchList: PropTypes.object,
    journalSearchLoading: PropTypes.bool,
    journalSearchError: PropTypes.bool,
};

export default Index;
