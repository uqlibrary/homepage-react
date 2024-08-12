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
import NavPanelBlock from 'modules/Index/components/subComponents/NavPanelBlock';
import {
    loadLibHours,
    loadCompAvail,
    loadTrainingEvents,
} from 'data/actions';
import { canSeeLearningResources } from 'helpers/access';

const Computers = lazy(() => lazyRetry(() => import('modules/Index/components/subComponents/Computers')));
const Hours = lazy(() => lazyRetry(() => import('modules/Index/components/subComponents/Hours')));
const LearningResourcesPanel = lazy(() => lazyRetry(() => import('modules/Index/components/subComponents/LearningResourcesPanel')));
const Training = lazy(() => lazyRetry(() => import('modules/Index/components/subComponents/Training')));

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

const StyledLink = styled(Link)(() => ({
    color: 'black',
    fontWeight: 400,
    '& div': {
        paddingTop: '14px',
    },
    '@media (min-width: 640px)': {
        position: 'absolute',
        top: 0,
        right: '10px',
        zIndex: 10,
    },
}));

const StyledSummary = styled('span')(({ theme }) => ({
    color: theme.palette.primary.light,
    textDecoration: 'underline',
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
}) => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        const siteHeader = document.querySelector('uq-site-header');
        !!siteHeader && siteHeader.removeAttribute('secondleveltitle');
        !!siteHeader && siteHeader.removeAttribute('secondLevelUrl');
    }, []);

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
            <div style={{ borderBottom: '1px solid #d1d0d2' /* grey-300 */ }}>
                <div className="layout-card">
                    <StyleWrapper>
                        <StyledLink
                            href="https://uqbookit.uq.edu.au/#/app/booking-types/77b52dde-d704-4b6d-917e-e820f7df07cb"
                            underline="hover">
                            <div>
                                Make a booking
                            </div>
                        </StyledLink>
                        <StyledAccordion>
                            <StyledAccordionSummary
                                expandIcon={<ExpandMoreIcon/>}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                                data-testid="hours-accordion-open"
                            >
                                <StyledSummary>Opening hours and computer availability</StyledSummary>
                            </StyledAccordionSummary>
                            <AccordionDetails>
                                <p>(temporary display while FE design agreed)</p>
                                <Grid container spacing={4}>
                                    <Grid item xs={12} md={4} data-testid="library-hours-panel">
                                        <Hours
                                            libHours={libHours}
                                            libHoursLoading={libHoursLoading}
                                            libHoursError={libHoursError}
                                            account={account}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={8} data-testid="computer-availability-panel">
                                        <Computers
                                            computerAvailability={computerAvailability}
                                            computerAvailabilityLoading={computerAvailabilityLoading}
                                            computerAvailabilityError={computerAvailabilityError}
                                            account={account}
                                        />
                                    </Grid>
                                </Grid>
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
                    </Grid>
                </StandardPage>
            )}

            <NavPanelBlock/>

            <LibraryUpdates />
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
};

export default Index;
