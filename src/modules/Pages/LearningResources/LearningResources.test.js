/**
 * @jest-environment-options {"url":"http://localhost"}
 */
import { rtlRender, WithReduxStore, userEvent } from 'test-utils';
import React from 'react';
import Immutable from 'immutable';
import { useAccountContext } from 'context';
import { useLocation } from 'react-router';
import { loadExamLearningResources, loadGuides, loadReadingLists } from 'data/actions';
import { getNormalisedCampus, getQueryParams, isValidInput } from './LearningResources';
import LearningResourcesContainer from './LearningResourcesContainer';

jest.mock('context', () => ({
    useAccountContext: jest.fn(),
}));

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useLocation: jest.fn(),
}));

jest.mock('data/actions', () => ({
    ...jest.requireActual('data/actions'),
    loadReadingLists: jest.fn(() => () => Promise.resolve()),
    loadGuides: jest.fn(() => () => Promise.resolve()),
    loadExamLearningResources: jest.fn(() => () => Promise.resolve()),
}));

const actions = {
    loadReadingLists,
    loadGuides,
    loadExamLearningResources,
};

const validSearch = '?coursecode=FREN1010&campus=St%20Lucia&semester=Semester%201';
const courseSuggestions = [
    {
        displayname: 'FREN1010 - French',
        courseCode: 'FREN1010',
        campus: 'St Lucia',
        semester: 'Semester 1',
    },
    {
        displayname: 'HIST1200 - History',
        courseCode: 'HIST1200',
        campus: 'Gatton',
        semester: 'Semester 2',
    },
    {
        displayname: 'AAAAAAAA - Repeating course',
        courseCode: 'AAAAAAAA',
        campus: 'St Lucia',
        semester: 'Semester 1',
    },
];

const setup = ({ account = { current_classes: [] }, search = '', suggestions = [], ...props } = {}) => {
    useAccountContext.mockReturnValue({ account });
    useLocation.mockReturnValue({ search });
    const initialState = Immutable.Map({
        readingListReducer: {
            readingList: props.readingList || null,
            readingListLoading: props.readingListLoading || false,
            readingListError: props.readingListError || null,
        },
        guidesReducer: {
            guideList: props.guideList || null,
            guideListLoading: props.guideListLoading || false,
            guideListError: props.guideListError || null,
        },
        examLearningResourceReducer: {
            examLearningResourceList: props.examLearningResourceList || null,
            examLearningResourceListLoading: props.examLearningResourceListLoading || false,
            examLearningResourceListError: props.examLearningResourceListError || null,
        },
        learningResourceSuggestionsReducer: {
            CRsuggestions: suggestions,
            CRsuggestionsLoading: false,
            CRsuggestionsError: null,
        },
    });
    return rtlRender(
        <WithReduxStore initialState={initialState}>
            <LearningResourcesContainer />
        </WithReduxStore>,
    );
};

describe('LearningResources component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('defaults to course search when there are no enrolled courses', () => {
        const { getByRole, getByTestId } = setup();

        expect(getByRole('heading', { name: 'Learning resources' })).toBeInTheDocument();
        expect(getByRole('tab', { name: 'Course search' })).toHaveAttribute('aria-selected', 'true');
        expect(getByTestId('full-learningresource')).toBeInTheDocument();
        expect(getByRole('combobox', { name: 'search for a subject by course code or title' })).toBeInTheDocument();
    });

    it('selects Your courses and loads enrolled courses through the real course tabs', async () => {
        const header = document.createElement('uq-site-header');
        document.body.appendChild(header);
        const account = {
            current_classes: [
                { classnumber: 'FREN1010', CAMPUS: 'STLUC', semester: 'Semester 1' },
                { classnumber: 'BIOL1000', CAMPUS: 'GATTN', semester: 'Semester 2' },
            ],
        };
        const { getByRole, getByTestId } = setup({ account });

        expect(getByRole('tab', { name: 'Your courses' })).toHaveAttribute('aria-selected', 'true');
        expect(getByTestId('learning-resource-subject-title')).toHaveTextContent('FREN1010');
        expect(actions.loadReadingLists).toHaveBeenCalledWith('FREN1010', 'St Lucia', 'Semester 1');
        expect(header).toHaveAttribute('secondleveltitle', 'Learning resources');

        await userEvent.click(getByRole('tab', { name: 'BIOL1000' }));

        expect(actions.loadReadingLists).toHaveBeenCalledWith('BIOL1000', 'Gatton', 'Semester 2');
        expect(getByTestId('learning-resource-subject-title')).toHaveTextContent('BIOL1000');
        header.remove();
    });

    it('does not reload an enrolled course that already has a reading-list cache', async () => {
        const account = {
            current_classes: [
                { classnumber: 'BIOL1000', CAMPUS: 'GATTN', semester: 'Semester 2' },
                { classnumber: 'FREN1010', CAMPUS: 'STLUC', semester: 'Semester 1' },
            ],
        };
        const { getByRole } = setup({
            account,
            readingList: {
                coursecode: 'FREN1010',
                reading_lists: [{ url: 'https://example.com/list', totalCount: 1 }],
            },
        });

        await userEvent.click(getByRole('tab', { name: 'FREN1010' }));

        expect(actions.loadReadingLists).toHaveBeenCalledTimes(1);
        expect(getByRole('link', { name: 'FREN1010 Reading list (contains 1 item)' })).toHaveAttribute(
            'href',
            'https://example.com/list',
        );
    });

    it('loads a valid query course when no enrolled class matches it', () => {
        setup({ search: validSearch });

        expect(actions.loadReadingLists).toHaveBeenCalledWith('FREN1010', 'St Lucia', 'Semester 1');
        expect(actions.loadGuides).toHaveBeenCalledWith('FREN1010');
        expect(actions.loadExamLearningResources).toHaveBeenCalledWith('FREN1010');
    });

    it('selects Your courses when the query course matches an enrolled class', () => {
        const account = {
            current_classes: [{ classnumber: 'FREN1010', CAMPUS: 'STLUC', semester: 'Semester 1' }],
        };
        const { getByRole } = setup({ account, search: validSearch });

        expect(getByRole('tab', { name: 'Your courses' })).toHaveAttribute('aria-selected', 'true');
        expect(getByRole('heading', { name: /FREN1010/ })).toBeInTheDocument();
    });

    it('does not load an enrolled course code that is too short', () => {
        const { getByRole } = setup({ account: { current_classes: [{ classnumber: 'FREN101' }] } });

        expect(actions.loadReadingLists).not.toHaveBeenCalled();
        expect(actions.loadGuides).not.toHaveBeenCalled();
        expect(actions.loadExamLearningResources).not.toHaveBeenCalled();
        expect(getByRole('heading', { name: /FREN101/ })).toBeInTheDocument();
    });

    it('does not load a repeating enrolled course code', () => {
        setup({ account: { current_classes: [{ classnumber: 'AAAAAAAA' }] } });

        expect(actions.loadReadingLists).not.toHaveBeenCalled();
        expect(actions.loadGuides).not.toHaveBeenCalled();
        expect(actions.loadExamLearningResources).not.toHaveBeenCalled();
    });

    it('loads a selected course from the search dropdown', async () => {
        const { getByRole } = setup({ suggestions: courseSuggestions });

        await userEvent.click(getByRole('option', { name: 'HIST1200 - History' }));

        expect(actions.loadReadingLists).toHaveBeenCalledWith('HIST1200', 'Gatton', 'Semester 2');
        expect(actions.loadGuides).toHaveBeenCalledWith('HIST1200');
        expect(actions.loadExamLearningResources).toHaveBeenCalledWith('HIST1200');
        expect(getByRole('tab', { name: 'HIST1200' })).toBeInTheDocument();
    });

    it('selects an enrolled course from the search dropdown', async () => {
        const account = {
            current_classes: [{ classnumber: 'FREN1010', CAMPUS: 'STLUC', semester: 'Semester 1' }],
        };
        const { getByRole } = setup({ account, suggestions: courseSuggestions });

        await userEvent.click(getByRole('tab', { name: 'Course search' }));
        await userEvent.click(getByRole('option', { name: 'FREN1010 - French' }));

        expect(getByRole('tab', { name: 'Your courses' })).toHaveAttribute('aria-selected', 'true');
        expect(getByRole('heading', { name: /FREN1010/ })).toBeInTheDocument();
    });

    it('loads an enrolled course with missing campus and semester as null values', async () => {
        const account = { current_classes: [{ classnumber: 'FREN1010' }] };
        const { getByRole } = setup({ account, suggestions: courseSuggestions });

        await userEvent.click(getByRole('tab', { name: 'Course search' }));
        await userEvent.click(getByRole('option', { name: 'FREN1010 - French' }));

        expect(actions.loadReadingLists).toHaveBeenCalledWith('FREN1010', null, null);
        expect(actions.loadGuides).toHaveBeenCalledWith('FREN1010');
        expect(actions.loadExamLearningResources).toHaveBeenCalledWith('FREN1010');
    });

    it('renders resource data cached for an enrolled course', () => {
        const account = { current_classes: [{ classnumber: 'FREN1010', CAMPUS: 'STLUC', semester: 'Semester 1' }] };
        const { getByRole } = setup({
            account,
            readingList: {
                coursecode: 'FREN1010',
                reading_lists: [{ url: 'https://example.com/list', totalCount: 1 }],
            },
            guideList: [{ coursecode: 'FREN1010', title: 'French guide', url: 'https://example.com/guide' }],
            examLearningResourceList: {
                coursecode: 'FREN1010',
                list: [{ period: '2025', url: 'https://example.com/exam.pdf' }],
            },
            examLearningResourceListLoading: false,
        });

        expect(getByRole('link', { name: 'FREN1010 Reading list (contains 1 item)' })).toHaveAttribute(
            'href',
            'https://example.com/list',
        );
        expect(getByRole('link', { name: 'library guide for French guide' })).toHaveAttribute(
            'href',
            'https://example.com/guide',
        );
        expect(getByRole('link', { name: 'past exam paper for 2025 format PDF' })).toHaveAttribute(
            'href',
            'https://example.com/exam.pdf',
        );
    });

    describe('helpers', () => {
        it('normalizes campus names found in combined course details', () => {
            expect(getNormalisedCampus({ campus: 'EDUC1234 / EDUC1235 St Lucia' })).toBe('St Lucia');
            expect(getNormalisedCampus({ campus: 'Somewhere else' })).toBe(false);
            expect(getNormalisedCampus({})).toBe(false);
        });

        it('validates course, campus, semester, and allowed query keys', () => {
            expect(isValidInput({ coursecode: 'FREN1010', campus: 'St Lucia', semester: 'Semester 1 2026' })).toBe(
                true,
            );
            expect(isValidInput({ coursecode: 'FREN1010', campus: '', semester: 'Semester 1 2026' })).toBe(true);
            expect(isValidInput({ coursecode: 'FREN1010', campus: 'Elsewhere', semester: 'Semester 1 2026' })).toBe(
                false,
            );
            expect(isValidInput({ coursecode: 'FREN101', campus: 'St Lucia', semester: 'Semester 1 2026' })).toBe(
                false,
            );
            expect(isValidInput({ coursecode: 'FREN1010', campus: 'St Lucia', semester: 'Term 1!' })).toBe(false);
            expect(
                isValidInput({ coursecode: 'FREN1010', campus: 'St Lucia', semester: 'Semester 1', extra: 'no' }),
            ).toBe(false);

            expect(
                isValidInput({
                    coursecode: 'FREN1010',
                    campus: 'St Lucia',
                    semester: 'Semester 1',
                    user: 's1234567',
                }),
            ).toBe(true);
        });

        it('parses and normalizes a valid search query and rejects invalid input', () => {
            expect(getQueryParams('?coursecode=FREN1010&campus=St+Lucia&semester=Semester+1')).toEqual({
                coursecode: 'FREN1010',
                campus: 'St Lucia',
                semester: 'Semester 1',
            });
            // invalid course code
            expect(getQueryParams('?coursecode=FREN101&campus=St+Lucia&semester=Semester+1')).toEqual([]);
        });
    });
});
