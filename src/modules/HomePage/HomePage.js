/* eslint max-len: 0 */
import React, { useEffect } from 'react';
import ContentLoader from 'react-content-loader';
import { PropTypes } from 'prop-types';
import { useDispatch } from 'react-redux';

import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import LibraryUpdates from './publicComponents/LibraryUpdates/LibraryUpdates';
import NavigationCardWrapper from './publicComponents/HelpNavigation/NavigationCardWrapper';
import {
    loadPrintBalance,
    searcheSpacePossiblePublications,
    searcheSpaceIncompleteNTROPublications,
    loadLibHours,
    loadTrainingEvents,
    loadDrupalArticles,
    loadLoans,
    loadVemcountList,
} from 'data/actions';
import { canSeeLearningResourcesPanel, isEspaceAuthor, canSeeReadPublish, canSeeTrainingPanel } from 'helpers/access';
import UtilityBar from './publicComponents/UtilityBar/UtilityBar';

import EspaceLinks from './loggedinComponents/EspaceLinks';
import LearningResourcesPanel from './loggedinComponents/LearningResourcesPanel';
import Training from './loggedinComponents/Training';
import ReferencingPanel from './loggedinComponents/ReferencingPanel';
import ReadPublish from './loggedinComponents/ReadPublish';
import AccountPanel from './loggedinComponents/AccountPanel/AccountPanel';

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
    marginTop: '32px',
    marginBottom: '24px',
}));

const StyledGridWrapper = styled('div')(() => ({
    backgroundColor: '#f3f3f4',
    '@media (max-width: 1200px)': {
        // marginLeft: '-24px',
    },
}));

const StyledGridItemLoggedIn = styled(Grid)(({ theme }) => ({
    paddingLeft: '24px',
    marginBottom: '24px',
    [theme.breakpoints.down('uqDsDesktop')]: {
        paddingLeft: '0',
        marginBottom: '24px',
    },
    [theme.breakpoints.up('uqDsDesktopXL')]: {
        paddingLeft: '32px',
        marginBottom: '32px',
    },
    [theme.breakpoints.down('uqDsTablet')]: {
        maxWidth: '100%',
    },
    '& h3': {
        whiteSpace: 'pre-wrap',
    },
}));

const StyledGridItemLoggedInLeftMost = styled(Grid)(({ theme }) => ({
    paddingLeft: '0',
    marginBottom: '24px',
    [theme.breakpoints.up('uqDsDesktopXL')]: {
        paddingLeft: '0px',
        marginBottom: '32px',
    },
    [theme.breakpoints.down('uqDsTablet')]: {
        maxWidth: '100%',
    },
    '& h3': {
        whiteSpace: 'pre-wrap',
    },
}));

export const HomePage = ({
    account,
    accountLoading,
    author,
    libHours,
    libHoursLoading,
    libHoursError,
    trainingEvents,
    trainingEventsLoading,
    trainingEventsError,
    printBalance,
    printBalanceLoading,
    printBalanceError,
    possibleRecords,
    possibleRecordsLoading,
    incompleteNTRO,
    incompleteNTROLoading,
    drupalArticleList,
    drupalArticlesError,
    drupalArticlesLoading,
    loans,
    loansLoading,
    vemcount,
    vemcountLoading,
    vemcountError,
}) => {
    const dispatch = useDispatch();

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
            dispatch(loadLibHours());
            dispatch(loadVemcountList());
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
            dispatch(loadLoans());
        }
    }, [accountLoading, account, loans, loansLoading, dispatch]);

    const verySimplelayout =
        !canSeeLearningResourcesPanel(account) && !isEspaceAuthor(account, author) && !canSeeReadPublish(account);
    return (
        <>
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
                vemcount={vemcount}
                vemcountLoading={vemcountLoading}
                vemcountError={vemcountError}
            />
            <React.Suspense fallback={<ContentLoader message="Loading" />}>
                {!!account && (
                    <StyledGridWrapper>
                        <StandardPage>
                            <Grid container spacing={!!verySimplelayout ? 2 : 0}>
                                <Grid item xs={12}>
                                    <StyledHeading component={'h2'} data-testid="homepage-user-greeting">
                                        Hi, {account.firstName || /* istanbul ignore next */ ''}
                                    </StyledHeading>
                                </Grid>
                                {!!verySimplelayout ? (
                                    <>
                                        <StyledGridItemLoggedInLeftMost
                                            item
                                            xs={12}
                                            uqDsDesktop={4}
                                            data-testid="account-panel"
                                            style={{ paddingTop: 0 }}
                                        >
                                            <AccountPanel
                                                account={account}
                                                loans={loans}
                                                loansLoading={loansLoading}
                                                printBalance={printBalance}
                                                printBalanceLoading={printBalanceLoading}
                                                printBalanceError={printBalanceError}
                                            />
                                        </StyledGridItemLoggedInLeftMost>
                                        {canSeeTrainingPanel(account) && (
                                            <StyledGridItemLoggedInLeftMost
                                                item
                                                xs={12}
                                                uqDsDesktop={4}
                                                data-testid="training-panel"
                                                style={{ paddingTop: 0 }}
                                            >
                                                <Training
                                                    trainingEvents={trainingEvents}
                                                    trainingEventsLoading={trainingEventsLoading}
                                                    trainingEventsError={trainingEventsError}
                                                />
                                            </StyledGridItemLoggedInLeftMost>
                                        )}
                                        <StyledGridItemLoggedInLeftMost
                                            item
                                            xs={12}
                                            uqDsDesktop={4}
                                            data-testid="referencing-panel"
                                            style={{ paddingTop: 0 }}
                                        >
                                            <ReferencingPanel account={account} />
                                        </StyledGridItemLoggedInLeftMost>
                                    </>
                                ) : (
                                    <>
                                        <Grid item uqDsDesktop={4} xs={12}>
                                            <Grid container>
                                                <StyledGridItemLoggedInLeftMost
                                                    item
                                                    xs={12}
                                                    data-testid="account-panel"
                                                >
                                                    <AccountPanel
                                                        account={account}
                                                        loans={loans}
                                                        loansLoading={loansLoading}
                                                        printBalance={printBalance}
                                                        printBalanceLoading={printBalanceLoading}
                                                        printBalanceError={printBalanceError}
                                                    />
                                                </StyledGridItemLoggedInLeftMost>
                                                {canSeeTrainingPanel(account) && (
                                                    <StyledGridItemLoggedInLeftMost
                                                        item
                                                        xs={12}
                                                        data-testid="training-panel"
                                                    >
                                                        <Training
                                                            trainingEvents={trainingEvents}
                                                            trainingEventsLoading={trainingEventsLoading}
                                                            trainingEventsError={trainingEventsError}
                                                        />
                                                    </StyledGridItemLoggedInLeftMost>
                                                )}
                                            </Grid>
                                        </Grid>
                                        <Grid item uqDsDesktop={8} xs={12}>
                                            <Grid container>
                                                {canSeeLearningResourcesPanel(account) && (
                                                    <StyledGridItemLoggedIn
                                                        item
                                                        xs={12}
                                                        data-testid="learning-resources-panel"
                                                    >
                                                        <LearningResourcesPanel account={account} history={history} />
                                                    </StyledGridItemLoggedIn>
                                                )}

                                                <Grid item uqDsDesktop={6} xs={12}>
                                                    <Grid container>
                                                        <StyledGridItemLoggedIn
                                                            item
                                                            xs={12}
                                                            data-testid="referencing-panel"
                                                        >
                                                            <ReferencingPanel account={account} />
                                                        </StyledGridItemLoggedIn>
                                                        {canSeeReadPublish(account) && (
                                                            <StyledGridItemLoggedIn
                                                                item
                                                                xs={12}
                                                                data-testid="readpublish-panel"
                                                            >
                                                                <ReadPublish />
                                                            </StyledGridItemLoggedIn>
                                                        )}
                                                    </Grid>
                                                </Grid>
                                                <Grid item uqDsDesktop={6} xs={12}>
                                                    <Grid container>
                                                        {isEspaceAuthor(account, author) && (
                                                            <StyledGridItemLoggedIn
                                                                item
                                                                xs={12}
                                                                data-testid="espace-links-panel"
                                                            >
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
                                    </>
                                )}
                            </Grid>
                        </StandardPage>
                    </StyledGridWrapper>
                )}
            </React.Suspense>
            <NavigationCardWrapper account={account} accountLoading={accountLoading} />

            <LibraryUpdates
                drupalArticleList={drupalArticleList}
                drupalArticlesError={drupalArticlesError}
                drupalArticlesLoading={drupalArticlesLoading}
            />
        </>
    );
};

HomePage.propTypes = {
    account: PropTypes.object,
    accountLoading: PropTypes.bool,
    author: PropTypes.object,
    actions: PropTypes.any,
    libHours: PropTypes.object,
    libHoursLoading: PropTypes.bool,
    libHoursError: PropTypes.bool,
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
    printBalanceError: PropTypes.bool,
    vemcount: PropTypes.object,
    vemcountLoading: PropTypes.bool,
    vemcountError: PropTypes.bool,
};

export default HomePage;
