import React from 'react';
import { useDispatch } from 'react-redux';
import { rtlRender } from 'test-utils';
import * as actions from 'data/actions';
import * as dlorActions from 'data/actions/dlorActions';

import HomePage from './HomePage';

jest.mock('react-redux', () => ({
    useDispatch: jest.fn(),
}));

jest.mock('data/actions', () => ({
    loadPrintBalance: jest.fn(),
    searcheSpacePossiblePublications: jest.fn(),
    searcheSpaceIncompleteNTROPublications: jest.fn(),
    loadLibHours: jest.fn(),
    loadTrainingEvents: jest.fn(),
    loadDrupalArticles: jest.fn(),
    loadLoans: jest.fn(),
    loadVemcountList: jest.fn(),
}));

jest.mock('data/actions/dlorActions', () => ({
    loadDlorStatistics: jest.fn(),
}));

// mock a bunch of components that we dont care about for specifically testing HomePage.js
jest.mock('./publicComponents/UtilityBar/UtilityBar', () => () => 'UtilityBar');
jest.mock('./publicComponents/LibraryUpdates/LibraryUpdates', () => () => 'LibraryUpdates');
jest.mock('./publicComponents/HelpNavigation/NavigationCardWrapper', () => () => 'NavigationCardWrapper');
jest.mock('./loggedinComponents/EspaceLinks', () => () => 'EspaceLinks');
jest.mock('./loggedinComponents/LearningResourcesPanel', () => () => 'LearningResourcesPanel');
jest.mock('./loggedinComponents/Training', () => () => 'Training');
jest.mock('./loggedinComponents/ReferencingPanel', () => () => 'ReferencingPanel');
jest.mock('./loggedinComponents/ReadPublish', () => () => 'ReadPublish');
jest.mock('./loggedinComponents/AccountPanel/AccountPanel', () => () => 'AccountPanel');
jest.mock('./loggedinComponents/DigitalLearningHub', () => () => 'DigitalLearningHub');

const mockDispatch = jest.fn();

const defaultProps = {
    account: null,
    accountLoading: true,
    author: null,
    libHours: null,
    libHoursLoading: false,
    libHoursError: false,
    trainingEvents: null,
    trainingEventsLoading: false,
    trainingEventsError: false,
    printBalance: null,
    printBalanceLoading: null,
    printBalanceError: false,
    possibleRecords: null,
    possibleRecordsLoading: null,
    incompleteNTRO: null,
    incompleteNTROLoading: null,
    drupalArticleList: [],
    drupalArticlesError: false,
    drupalArticlesLoading: false,
    loans: null,
    loansLoading: null,
    vemcount: null,
    vemcountLoading: false,
    vemcountError: false,
    dlorStatistics: null,
    dlorStatisticsLoading: false,
    dlorStatisticsError: false,
};

function setup(props = {}) {
    return rtlRender(<HomePage {...defaultProps} {...props} />);
}

const allActions = [
    actions.loadPrintBalance,
    actions.searcheSpacePossiblePublications,
    actions.searcheSpaceIncompleteNTROPublications,
    actions.loadLibHours,
    actions.loadTrainingEvents,
    actions.loadDrupalArticles,
    actions.loadLoans,
    actions.loadVemcountList,
    dlorActions.loadDlorStatistics,
];

/**
 * Helper function to assert supplied actions are dispatched,
 * while every other action is not.
 */
function expectOnlyActions(...expectedActions) {
    allActions.forEach(action => {
        if (expectedActions.includes(action)) {
            expect(action).toHaveBeenCalledTimes(1);
        } else {
            expect(action).not.toHaveBeenCalled();
        }
    });
    expect(mockDispatch).toHaveBeenCalledTimes(expectedActions.length);
}

describe('HomePage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useDispatch.mockReturnValue(mockDispatch);
    });

    it('removes second-level attributes from the site header on mount', () => {
        const siteHeader = document.createElement('uq-site-header');
        siteHeader.setAttribute('secondleveltitle', 'Library');
        siteHeader.setAttribute('secondLevelUrl', '/library');
        document.body.appendChild(siteHeader);

        try {
            setup();

            expect(siteHeader.hasAttribute('secondleveltitle')).toBe(false);
            expect(siteHeader.hasAttribute('secondLevelUrl')).toBe(false);
            expectOnlyActions(actions.loadDrupalArticles);
        } finally {
            siteHeader.remove();
        }
    });

    it('renders the public page sections when signed out', () => {
        const { container, getByRole, queryByText } = setup();

        expect(getByRole('heading', { name: 'Library', level: 1 })).toBeInTheDocument();
        expect(container).toHaveTextContent('UtilityBar');
        expect(container).toHaveTextContent('NavigationCardWrapper');
        expect(container).toHaveTextContent('LibraryUpdates');
        expect(queryByText('AccountPanel')).not.toBeInTheDocument();
        expectOnlyActions(actions.loadDrupalArticles);
    });

    it('renders the simplified account layout for certain users', () => {
        const { getByTestId, queryByTestId, queryByText } = setup({
            account: { id: 's123', firstName: 'TestUser', user_group: 'ICTE' },
        });

        expect(getByTestId('homepage-user-greeting')).toHaveTextContent('Hi, TestUser');
        expect(getByTestId('account-panel')).toHaveTextContent('AccountPanel');
        expect(getByTestId('referencing-panel')).toHaveTextContent('ReferencingPanel');
        expect(getByTestId('training-panel')).toHaveTextContent('Training');
        expect(queryByText('LearningResourcesPanel')).not.toBeInTheDocument();
        expect(queryByTestId('learning-resources-panel')).not.toBeInTheDocument();
        expect(queryByTestId('readpublish-panel')).not.toBeInTheDocument();
        expect(queryByTestId('espace-links-panel')).not.toBeInTheDocument();
        expectOnlyActions(actions.loadDrupalArticles, dlorActions.loadDlorStatistics);
    });

    it('omits training for ineligible users in the simplified layout', () => {
        const { queryByTestId } = setup({
            account: { id: 's123', firstName: 'TestUser', user_group: 'ALUMNI' },
        });

        expect(queryByTestId('training-panel')).not.toBeInTheDocument();
        expectOnlyActions(actions.loadDrupalArticles, dlorActions.loadDlorStatistics);
    });

    it('renders only eligible panels for undergraduate users in the expanded layout', () => {
        const { getByTestId, queryByTestId } = setup({
            account: { id: 's123', firstName: 'TestUser', user_group: 'UG' },
        });

        expect(getByTestId('learning-resources-panel')).toHaveTextContent('LearningResourcesPanel');
        expect(getByTestId('training-panel')).toHaveTextContent('Training');
        expect(queryByTestId('readpublish-panel')).not.toBeInTheDocument();
        expect(queryByTestId('espace-links-panel')).not.toBeInTheDocument();
        expectOnlyActions(actions.loadDrupalArticles, dlorActions.loadDlorStatistics);
    });

    it('omits ineligible panels in the expanded layout for an eSpace author', () => {
        const { getByTestId, queryByTestId } = setup({
            account: { id: 's123', firstName: 'TestUser', user_group: 'ALUMNI' },
            author: { aut_id: 123 },
        });

        expect(getByTestId('espace-links-panel')).toHaveTextContent('EspaceLinks');
        expect(queryByTestId('learning-resources-panel')).not.toBeInTheDocument();
        expect(queryByTestId('readpublish-panel')).not.toBeInTheDocument();
        expect(queryByTestId('training-panel')).not.toBeInTheDocument();
        expectOnlyActions(actions.loadDrupalArticles, dlorActions.loadDlorStatistics);
    });

    it('renders panels for Staff users in the expanded layout', () => {
        const { getByTestId } = setup({
            account: { id: 's123', firstName: 'TestUser', user_group: 'STAFF' },
            author: { aut_id: 123 },
        });

        expect(getByTestId('homepage-user-greeting')).toHaveTextContent('Hi, TestUser');
        expect(getByTestId('account-panel')).toHaveTextContent('AccountPanel');
        expect(getByTestId('learning-resources-panel')).toHaveTextContent('LearningResourcesPanel');
        expect(getByTestId('readpublish-panel')).toHaveTextContent('ReadPublish');
        expect(getByTestId('espace-links-panel')).toHaveTextContent('EspaceLinks');
        expect(getByTestId('dlor-links-panel')).toHaveTextContent('DigitalLearningHub');
        expect(getByTestId('training-panel')).toHaveTextContent('Training');
        expectOnlyActions(actions.loadDrupalArticles, dlorActions.loadDlorStatistics);
    });

    it('dispatches article and public location loads when their data is unavailable', () => {
        setup({ drupalArticleList: null, accountLoading: false });

        expectOnlyActions(actions.loadDrupalArticles, actions.loadLibHours, actions.loadVemcountList);
    });

    it('does not request articles when a list is already available', () => {
        setup({ drupalArticleList: [{ title: 'Existing article' }] });

        expectOnlyActions();
    });

    it('skips account-specific loads when the account is unavailable', () => {
        setup({ accountLoading: false, author: { aut_id: 42 }, drupalArticleList: [{ title: 'Existing article' }] });

        expectOnlyActions(actions.loadLibHours, actions.loadVemcountList);
    });

    it('skips eSpace searches when the author ID is unavailable', () => {
        setup({ account: { id: 's123' }, accountLoading: false, author: {} });

        expectOnlyActions(
            actions.loadDrupalArticles,
            actions.loadLibHours,
            actions.loadVemcountList,
            actions.loadTrainingEvents,
            actions.loadPrintBalance,
            actions.loadLoans,
            dlorActions.loadDlorStatistics,
        );
    });

    it('skips account-specific loads when their data is already available', () => {
        setup({
            account: { id: 's123' },
            accountLoading: false,
            author: { aut_id: 42 },
            drupalArticleList: [{ title: 'Existing article' }],
            printBalance: { balance: 0 },
            possibleRecords: { total: 0 },
            incompleteNTRO: { total: 0 },
            loans: [],
            dlorStatistics: {},
        });

        expectOnlyActions(actions.loadLibHours, actions.loadVemcountList, actions.loadTrainingEvents);
    });

    it('skips account-specific loads while their requests are in progress', () => {
        setup({
            account: { id: 's123' },
            accountLoading: false,
            author: { aut_id: 42 },
            drupalArticleList: [{ title: 'Existing article' }],
            printBalanceLoading: true,
            possibleRecordsLoading: true,
            incompleteNTROLoading: true,
            loansLoading: true,
            dlorStatisticsLoading: true,
        });

        expectOnlyActions(actions.loadLibHours, actions.loadVemcountList, actions.loadTrainingEvents);
    });

    it('does not request DLOR statistics after a statistics error', () => {
        setup({ account: { id: 's123' }, dlorStatisticsError: true });

        expectOnlyActions(actions.loadDrupalArticles);
    });

    it('dispatches logged-in data loads and uses the general training filter by default', () => {
        setup({ account: { id: 's123' }, accountLoading: false, author: { aut_id: 42 } });

        expectOnlyActions(
            actions.loadDrupalArticles,
            actions.loadLibHours,
            actions.loadVemcountList,
            actions.loadTrainingEvents,
            actions.loadPrintBalance,
            actions.searcheSpacePossiblePublications,
            actions.searcheSpaceIncompleteNTROPublications,
            actions.loadLoans,
            dlorActions.loadDlorStatistics,
        );
        expect(actions.loadTrainingEvents).toHaveBeenCalledWith(104);
    });

    it('uses a custom training filter and renders an empty first name safely', () => {
        const { getByTestId } = setup({
            account: { id: 's123', firstName: '', trainingfilterId: 360 },
            accountLoading: false,
        });

        expect(getByTestId('homepage-user-greeting')).toHaveTextContent('Hi,');
        expectOnlyActions(
            actions.loadDrupalArticles,
            actions.loadLibHours,
            actions.loadVemcountList,
            actions.loadTrainingEvents,
            actions.loadPrintBalance,
            actions.loadLoans,
            dlorActions.loadDlorStatistics,
        );
        expect(actions.loadTrainingEvents).toHaveBeenCalledWith(360);
    });
});
