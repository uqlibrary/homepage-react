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
import { lazyRetry } from 'helpers/general';

import LibraryUpdates from 'modules/Index/components/subComponents/LibraryUpdates';
import NavigationCardWrapper from './subComponents/NavigationCardWrapper';
import {
    loadLibHours,
    loadCompAvail,
    loadTrainingEvents,
    loadDrupalArticles,
} from 'data/actions';
import { canSeeLearningResources } from 'helpers/access';

const Locations = lazy(() => lazyRetry(() => import('./subComponents/Locations')));
const LearningResourcesPanel = lazy(() => lazyRetry(() => import('modules/Index/components/subComponents/LearningResourcesPanel')));
const PastExamPapers = lazy(() => lazyRetry(() => import('./subComponents/PastExamPapersPanel')));
const Training = lazy(() => lazyRetry(() => import('modules/Index/components/subComponents/Training')));
const ReferencingPanel = lazy(() => lazyRetry(() => import('modules/Index/components/subComponents/ReferencingPanel')));

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

const StyledH1 = styled('h1')(({ theme }) => ({
    marginTop: '-10px',
    paddingBottom: '20px',
    backgroundColor: theme.palette.primary.light,
    color: '#fff',
    fontFamily: 'Montserrat, Helvetica, Arial, sans-serif',
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

const StyledCulturalAdvice = styled('div')(() => ({
    backgroundColor: '#231430',
    paddingTop: '20px',
    backgroundImage: 'linear-gradient(90deg, #48206c 28.12%, #48206ca6 70.31%, #48206c00), url(https://static.uq.net.au/v15/images/rap/brisbane-river-artwork.png)',
    '& p': {
        paddingBottom: '20px',
    },
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
    libHours,
    libHoursLoading,
    libHoursError,
    computerAvailability,
    computerAvailabilityLoading,
    computerAvailabilityError,
    trainingEvents,
    trainingEventsLoading,
    trainingEventsError,
    drupalArticleList,
    drupalArticlesLoading,
    drupalArticlesError,
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
    return (
        <React.Suspense fallback={<ContentLoader message="Loading"/>}>
            { /* TEMP WORKS - USED AS A PLACEHOLDER FOR NOW */ }
            {/* <StyledCulturalAdvice>
                <StandardPage>
                    <p className={'newCulturalStatement'} style={{ letterSpacing: '.01rem', fontWeight: '400', fontFamily: 'Roboto, Helvetica, Arial, sans-serif', color: 'white', margin: 0, border: 0 }}>
                        The Library is custodian of <a style={{
                        color: 'white', textDecoration: 'underline',
                    }} href="https://web.library.uq.edu.au/collections/culturally-sensitive-collections">culturally sensitive Indigenous material.</a></p>

                </StandardPage>
            </StyledCulturalAdvice> */}
            <div id="search-portal-container" data-testid="search-portal-container" style={{
                paddingTop: 25,
                paddingBottom: 25,
                backgroundColor: '#51247a',
            }}>
                <StandardPage>
                    <StyledH1>Library</StyledH1>
                    <search-portal theme="dark" />
                </StandardPage>

            </div>
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
            {accountLoading === false && !!account && (
                <StandardPage>
                    <Grid container spacing={4} style={{ paddingBottom: '1em' }}>
                        <Grid item xs={12}>
                            <Typography component={'h2'} sx={{ marginTop: '1em', fontSize: '24px', fontWeight: 500 }}>
                                Personalised section
                            </Typography>
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
                        <Grid  item xs={12} md={4} data-testid="referencing-panel" sx={{ paddingTop: '0px' }}>
                            <ReferencingPanel account={account} />
                        </Grid>
                    </Grid>
                </StandardPage>
            )}

            <NavigationCardWrapper/>

            <LibraryUpdates drupalArticleList={drupalArticleList} />
        </React.Suspense>
    );
};

Index.propTypes = {
    account: PropTypes.object,
    accountLoading: PropTypes.bool,
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
    drupalArticleList: PropTypes.array,
    drupalArticlesLoading: PropTypes.bool,
    drupalArticlesError: PropTypes.bool,
};

export default Index;
