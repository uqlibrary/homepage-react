/* eslint max-len: 0 */
import React, { useEffect } from 'react';
import ContentLoader from 'react-content-loader';
import { lazy } from 'react';
import { PropTypes } from 'prop-types';
import { useDispatch } from 'react-redux';
import Grid from '@mui/material/Grid';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { lazyRetry } from 'helpers/general';

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
    // Load homepage data requirements
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
        <React.Suspense fallback={<ContentLoader message="Loading" />}>
            <div id="search-portal-container" data-testid="search-portal-container" style={{
                paddingTop: 25,
                paddingBottom: 25,
                backgroundColor: '#51247a',
                }}>
                    <StandardPage><search-portal /></StandardPage>

            </div>
            <StandardPage>

                <Grid container spacing={4}>
                    {/* Search */}
                    <Grid item xs={12} style={{ marginTop: 12 }}>
                        {/* <search-portal /> */}
                    </Grid>
                    {/* Hours panel, logged out */}
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
                    {canSeeLearningResources(account) && (
                        <Grid item xs={12} md={4} data-testid="learning-resources-panel">
                            <LearningResourcesPanel account={account} history={history} />
                        </Grid>
                    )}
                    {accountLoading === false && !!account && (
                    <Grid item xs={12} md={4} data-testid="training-panel">
                        <Training
                            trainingEvents={trainingEvents}
                            trainingEventsLoading={trainingEventsLoading}
                            trainingEventsError={trainingEventsError}
                        />
                    </Grid>
                        )}
                </Grid>
            </StandardPage>
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
