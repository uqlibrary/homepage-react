import React from 'react';
import { rtlRender, WithReduxStore, userEvent } from 'test-utils';
import {
    CourseSearch,
    getPlaceInCurrentAccountList,
    getSubjectDetails,
    isACurrentClass,
    isEnrolledInSubject,
    isValidSubjectNumber,
} from './CourseSearch';

// mock the dropdown component used in CourseSearch
// to keep our tests focused on the CourseSearch component itself
jest.mock('modules/SharedComponents/SubjectSearchDropdown', () => {
    const PropTypes = require('prop-types');
    const MockSubjectSearchDropdown = ({ loadCourseAndSelectTab }) => (
        <>
            <input id="full-learningresource-autocomplete" data-testid="course-search-input" />
            <button
                type="button"
                data-testid="search-with-suggestion"
                onClick={() =>
                    loadCourseAndSelectTab('FREN1010', [
                        { courseCode: 'FREN1010', campus: 'St Lucia', semester: 'Semester 1' },
                    ])
                }
            >
                Search with suggestion
            </button>
            <button
                type="button"
                data-testid="search-without-suggestion"
                onClick={() => loadCourseAndSelectTab('FREN1010', null)}
            >
                Search without suggestion
            </button>
            <button
                type="button"
                data-testid="search-with-missing-course-code"
                onClick={() => loadCourseAndSelectTab('FREN1010', [{}])}
            >
                Search with missing course code
            </button>
            <button
                type="button"
                data-testid="search-invalid-subject"
                onClick={() => loadCourseAndSelectTab('ABC', [])}
            >
                Search invalid subject
            </button>
        </>
    );
    MockSubjectSearchDropdown.propTypes = {
        loadCourseAndSelectTab: PropTypes.func.isRequired,
    };

    return { SubjectSearchDropdown: MockSubjectSearchDropdown };
});
// mock the SubjectBody component used in CourseSearch too, as it
// has a lot of functionality we dont care about in this test
jest.mock('../shared/SubjectBody', () => ({
    SubjectBody: jest.fn(({ subject }) => (
        <div data-testid="subject-body" data-subject={subject.classnumber} data-title={subject.title} />
    )),
}));

const loadNewSubject = jest.fn();
const updateSearchList = jest.fn();
const selectMyCoursesTab = jest.fn();

const defaultProps = {
    account: undefined,
    preselectedCourse: {},
    listSearchedSubjects: [],
    readingList: { list: {} },
    examList: { list: {} },
    guideList: { list: {} },
    loadNewSubject: loadNewSubject,
    updateSearchList: updateSearchList,
    selectMyCoursesTab: selectMyCoursesTab,
};

const setup = (props = {}) => {
    const testProps = { ...defaultProps, ...props };

    return rtlRender(
        <WithReduxStore>
            <CourseSearch {...testProps} />
        </WithReduxStore>,
    );
};

describe('CourseSearch component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('focuses the search input and hides search results when the list is empty', () => {
        const { getByTestId, queryByRole } = setup();

        expect(document.activeElement).toBe(getByTestId('course-search-input'));
        expect(queryByRole('region', { name: 'Learning Resource Search Results' })).not.toBeInTheDocument();
    });

    it('loads a preselected course once and adds it to the search list when needed', () => {
        const { rerender } = setup({
            preselectedCourse: { coursecode: 'FREN1010', campus: 'St Lucia', semester: 'Semester 1' },
        });

        expect(loadNewSubject).toHaveBeenCalledWith('FREN1010', 'St Lucia', 'Semester 1');
        expect(updateSearchList).toHaveBeenCalledWith('FREN1010');

        rerender(
            <WithReduxStore>
                <CourseSearch
                    {...{
                        ...defaultProps,
                        preselectedCourse: { coursecode: 'FREN1010', campus: 'St Lucia', semester: 'Semester 1' },
                    }}
                />
            </WithReduxStore>,
        );

        expect(loadNewSubject).toHaveBeenCalledTimes(1);
    });

    it('does not add a preselected course that is already in the search list', () => {
        setup({
            preselectedCourse: { coursecode: 'FREN1010' },
            listSearchedSubjects: ['FREN1010'],
        });

        expect(loadNewSubject).toHaveBeenCalledWith('FREN1010', '', '');
        expect(updateSearchList).not.toHaveBeenCalled();
    });

    it('does not preselect a course in which the account is already enrolled', () => {
        setup({
            account: { current_classes: [{ classnumber: 'FREN1010' }] },
            preselectedCourse: { coursecode: 'FREN1010' },
        });

        expect(loadNewSubject).not.toHaveBeenCalled();
        expect(updateSearchList).not.toHaveBeenCalled();
    });

    it('loads a valid suggested course and renders its search result', async () => {
        const { rerender, getByTestId, getByRole } = setup({
            listSearchedSubjects: [],
            examList: { list: { FREN1010: { title: 'French exams' } } },
        });
        await userEvent.click(getByTestId('search-with-suggestion'));

        expect(loadNewSubject).toHaveBeenCalledWith('FREN1010', 'St Lucia', 'Semester 1');
        expect(updateSearchList).toHaveBeenCalledWith('FREN1010');
        rerender(
            <WithReduxStore>
                <CourseSearch
                    {...{
                        ...defaultProps,
                        preselectedCourse: { coursecode: 'FREN1010', campus: 'St Lucia', semester: 'Semester 1' },
                        listSearchedSubjects: ['FREN1010'],
                        examList: { list: { FREN1010: { title: 'French exams' } } },
                    }}
                />
            </WithReduxStore>,
        );
        expect(getByRole('region', { name: 'Learning Resource Search Results' })).toBeInTheDocument();
        expect(getByRole('tab', { name: 'FREN1010' })).toHaveAttribute('aria-selected', 'true');
        expect(getByTestId('subject-body')).toHaveAttribute('data-title', 'French exams');
    });

    it('loads a valid subject without a suggestion using empty campus and semester values', async () => {
        const { getByTestId } = setup();
        await userEvent.click(getByTestId('search-without-suggestion'));

        expect(loadNewSubject).toHaveBeenCalledWith('FREN1010', '', '');
        expect(updateSearchList).toHaveBeenCalledWith('FREN1010');
    });

    it('falls back when a suggestion does not contain a course code', async () => {
        const { getByTestId } = setup();
        await userEvent.click(getByTestId('search-with-missing-course-code'));

        expect(loadNewSubject).toHaveBeenCalledWith('FREN1010', '', '');
        expect(updateSearchList).toHaveBeenCalledWith('FREN1010');
    });

    it('selects an existing search result without loading it again', async () => {
        const { getByTestId, getByRole } = setup({
            listSearchedSubjects: ['BIOL1000', 'FREN1010'],
        });
        await userEvent.click(getByTestId('search-without-suggestion'));

        expect(loadNewSubject).not.toHaveBeenCalled();
        expect(updateSearchList).not.toHaveBeenCalled();
        expect(getByRole('tab', { name: 'FREN1010' })).toHaveAttribute('aria-selected', 'true');
    });

    it('selects the your-courses tab for an enrolled course at its account-list position', async () => {
        const { getByTestId } = setup({
            account: {
                current_classes: [{ classnumber: 'BIOL1000' }, { classnumber: 'FREN1010' }],
            },
            listSearchedSubjects: [],
        });
        await userEvent.click(getByTestId('search-with-suggestion'));

        expect(selectMyCoursesTab).toHaveBeenCalledWith('FREN1010', 1);
        expect(loadNewSubject).not.toHaveBeenCalled();
        expect(updateSearchList).not.toHaveBeenCalled();
    });

    it('selects the first search tab for a subject number shorter than eight characters', async () => {
        const { getByTestId, getByRole } = setup({
            listSearchedSubjects: ['ABC'],
        });
        await userEvent.click(getByTestId('search-invalid-subject'));

        expect(loadNewSubject).not.toHaveBeenCalled();
        expect(updateSearchList).not.toHaveBeenCalled();
        expect(getByRole('tab', { name: 'ABC' })).toHaveAttribute('aria-selected', 'true');
    });

    it('preserves the default first-tab selection when search results appear', async () => {
        const { getByTestId, queryByRole, getByRole, rerender } = setup();
        await userEvent.click(getByTestId('search-invalid-subject'));

        expect(loadNewSubject).not.toHaveBeenCalled();
        expect(updateSearchList).not.toHaveBeenCalled();
        expect(queryByRole('region', { name: 'Learning Resource Search Results' })).not.toBeInTheDocument();

        rerender(
            <WithReduxStore>
                <CourseSearch {...defaultProps} listSearchedSubjects={['FREN1010']} />
            </WithReduxStore>,
        );

        expect(getByRole('tab', { name: 'FREN1010' })).toHaveAttribute('aria-selected', 'true');
    });

    it('uses a reading-list title when no exam title is available', () => {
        const { getByTestId } = setup({
            listSearchedSubjects: ['FREN1010'],
            readingList: { list: { FREN1010: { course_title: 'French readings' } } },
        });

        expect(getByTestId('subject-body')).toHaveAttribute('data-title', 'French readings');
    });

    it('renders an empty title when neither list has a subject title', () => {
        const { getByTestId } = setup({
            listSearchedSubjects: ['FREN1010 - French'],
            examList: { list: {} },
            readingList: { list: {} },
        });

        expect(getByTestId('subject-body')).toHaveAttribute('data-title', '');
    });

    it('renders one tab and panel for each searched course and selects on click', async () => {
        const { getAllByRole, getByRole } = setup({
            listSearchedSubjects: ['FREN1010', 'BIOL1000'],
        });

        expect(getAllByRole('tab')).toHaveLength(2);
        expect(getAllByRole('tabpanel', { hidden: true })).toHaveLength(2);
        expect(getByRole('tab', { name: 'FREN1010' })).toBeInTheDocument();
        expect(getByRole('tab', { name: 'BIOL1000' })).toBeInTheDocument();

        await userEvent.click(getByRole('tab', { name: 'BIOL1000' }));
        expect(getByRole('tab', { name: 'BIOL1000' })).toHaveAttribute('aria-selected', 'true');
    });

    describe('helpers', () => {
        it('returns false when the account or its current classes are missing', () => {
            expect(isEnrolledInSubject('FREN1010', undefined)).toBe(false);
            expect(isEnrolledInSubject('FREN1010', {})).toBe(false);
            expect(isEnrolledInSubject('FREN1010', { current_classes: [] })).toBe(false);
        });

        it('returns false when no class matches and true when a class matches', () => {
            expect(isEnrolledInSubject('FREN1010', { current_classes: [{ classnumber: 'BIOL1000' }] })).toBe(false);
            expect(isEnrolledInSubject('FREN1010', { current_classes: [{ classnumber: 'FREN1010' }] })).toBe(true);
        });

        it('treats a class with a missing class number as an empty class number', () => {
            expect(isEnrolledInSubject('', { current_classes: [{}] })).toBe(true);
        });

        it('identifies whether a course is one of the account current classes', () => {
            expect(isACurrentClass('FREN1010', undefined)).toBe(false);
            expect(isACurrentClass('FREN1010', {})).toBe(false);
            expect(isACurrentClass('FREN1010', { current_classes: [] })).toBe(false);
            expect(isACurrentClass('FREN1010', { current_classes: [{ classnumber: 'BIOL1000' }] })).toBe(false);
            expect(isACurrentClass('FREN1010', { current_classes: [{ classnumber: 'FREN1010' }] })).toBe(true);
        });

        it('considers subject numbers of at least eight characters valid', () => {
            expect(isValidSubjectNumber('FREN1010')).toBe(true);
            expect(isValidSubjectNumber('FREN10100')).toBe(true);
            expect(isValidSubjectNumber('FREN101')).toBe(false);
        });

        it('returns -1 when the account or matching class is missing', () => {
            expect(getPlaceInCurrentAccountList('FREN1010', undefined)).toBe(-1);
            expect(getPlaceInCurrentAccountList('FREN1010', {})).toBe(-1);
            expect(getPlaceInCurrentAccountList('FREN1010', { current_classes: [] })).toBe(-1);
            expect(
                getPlaceInCurrentAccountList('FREN1010', {
                    current_classes: [{ classnumber: 'BIOL1000' }],
                }),
            ).toBe(-1);
        });

        it('returns the matching class position in the account list', () => {
            expect(
                getPlaceInCurrentAccountList('FREN1010', {
                    current_classes: [{ classnumber: 'FREN1010' }, { classnumber: 'BIOL1000' }],
                }),
            ).toBe(0);
            expect(
                getPlaceInCurrentAccountList('FREN1010', {
                    current_classes: [{ classnumber: 'BIOL1000' }, { classnumber: 'FREN1010' }],
                }),
            ).toBe(1);
        });
        it('returns the exam title in preference to a reading-list title', () => {
            expect(
                getSubjectDetails(
                    'FREN1010',
                    { list: { FREN1010: { title: 'French exam title' } } },
                    { list: { FREN1010: { course_title: 'French reading title' } } },
                ),
            ).toEqual({ classnumber: 'FREN1010', title: 'French exam title' });
        });

        it('falls back to the reading-list title when no exam title is available', () => {
            expect(
                getSubjectDetails(
                    'FREN1010',
                    { list: { FREN1010: {} } },
                    { list: { FREN1010: { course_title: 'French reading title' } } },
                ),
            ).toEqual({ classnumber: 'FREN1010', title: 'French reading title' });
        });

        it('returns an empty title when neither list has a title', () => {
            expect(getSubjectDetails('FREN1010', undefined, undefined)).toEqual({
                classnumber: 'FREN1010',
                title: '',
            });
        });

        it('returns an empty title when the reading-list course has no course title', () => {
            expect(getSubjectDetails('FREN1010', undefined, { list: { FREN1010: {} } })).toEqual({
                classnumber: 'FREN1010',
                title: '',
            });
        });
    });
});
