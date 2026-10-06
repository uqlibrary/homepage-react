import React from 'react';
import Immutable from 'immutable';
import { fireEvent, rtlRender, WithRouter, WithReduxStore } from 'test-utils';

import { LearningResourcesPanel } from './LearningResourcesPanel';

const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockNavigate,
}));

const course = {
    classnumber: 'MATH1040',
    CAMPUS: 'STLUC',
    semester: 'Semester 1',
    DESCR: 'Basic Mathematics',
};
const student = { id: 's1234567', user_group: 'UG', current_classes: [course] };

function setup(account = student, initialEntry = '/learning-resources', initialState) {
    return rtlRender(
        <WithRouter route="/learning-resources" initialEntries={[initialEntry]}>
            <WithReduxStore initialState={initialState}>
                <LearningResourcesPanel account={account} />
            </WithReduxStore>
        </WithRouter>,
    );
}

describe('LearningResourcesPanel', () => {
    beforeEach(() => mockNavigate.mockClear());

    it('shows the enrolled course with its description and destination', () => {
        const { getByText, getByTestId, getByRole, queryByTestId } = setup();

        expect(getByText('Learning resources and past exam papers')).toBeInTheDocument();
        expect(getByRole('heading', { name: 'Your current courses' })).toBeInTheDocument();
        expect(getByTestId('learning-resource-panel-course-link-0')).toHaveAttribute(
            'href',
            '/learning-resources?coursecode=MATH1040&campus=St Lucia&semester=Semester 1',
        );
        expect(getByText('Basic Mathematics')).toHaveAttribute('title', 'Basic Mathematics');
        expect(queryByTestId('staff-course-prompt')).not.toBeInTheDocument();
    });

    it('preserves the existing user query in enrolled course links', () => {
        const { getByTestId } = setup(student, '/learning-resources?user=s1234567');

        expect(getByTestId('learning-resource-panel-course-link-0')).toHaveAttribute(
            'href',
            '/learning-resources?user=s1234567&coursecode=MATH1040&campus=St Lucia&semester=Semester 1',
        );
    });

    it('limits the list to five courses and shows a link to all classes', () => {
        const classes = Array.from({ length: 6 }, (_, index) => ({ ...course, classnumber: `MATH${1000 + index}` }));
        const { getAllByTestId, getByRole, getByTestId } = setup({ ...student, current_classes: classes });

        expect(getAllByTestId(/^hcr-\d+$/)).toHaveLength(5);
        expect(getAllByTestId(/^learning-resource-panel-course-link-/)).toHaveLength(5);
        const footer = getByTestId('learning-resource-panel-course-multi-footer');
        expect(footer).toContainElement(getByRole('link', { name: 'See all 6 classes' }));
        expect(getByRole('link', { name: 'See all 6 classes' })).toHaveAttribute('href', '/learning-resources');
    });

    it('shows example courses for library staff without enrolled classes', () => {
        const { getByTestId, getByRole, queryByTestId } = setup({ id: 'staff', user_group: 'LIBRARYSTAFFB' });

        expect(getByTestId('staff-course-prompt')).toHaveTextContent('Students see enrolled courses');
        expect(getByRole('link', { name: 'FREN1010' })).toHaveAttribute(
            'href',
            `/learning-resources?coursecode=FREN1010&campus=St Lucia&semester=Semester 1 ${new Date().getFullYear()}`,
        );
        expect(getByRole('link', { name: 'MATH1040' })).toBeInTheDocument();
        expect(getByRole('link', { name: 'PHYS1001' })).toBeInTheDocument();
        expect(queryByTestId('learning-resource-panel-course-multi-footer')).not.toBeInTheDocument();
    });

    it('prefers enrolled classes over examples for library staff', () => {
        const { getByRole, queryByTestId } = setup({ ...student, user_group: 'LIBRARYSTAFFB' });

        expect(getByRole('link', { name: 'MATH1040' })).toBeInTheDocument();
        expect(queryByTestId('staff-course-prompt')).not.toBeInTheDocument();
        expect(queryByTestId('learning-resource-panel-course-link-1')).not.toBeInTheDocument();
    });

    it('shows the empty message when no classes are available', () => {
        const { getByText, queryByTestId } = setup(null);

        expect(
            getByText('Your enrolled courses will appear here three weeks prior to the start of the semester.'),
        ).toBeInTheDocument();
        expect(queryByTestId('your-courses')).not.toBeInTheDocument();
        expect(queryByTestId('staff-course-prompt')).not.toBeInTheDocument();
    });

    it('navigates to the selected course with the current user query', () => {
        const suggestions = [
            {
                displayname: 'HIST1200 - History',
                courseCode: 'HIST1200',
                campus: 'St Lucia',
                semester: 'Semester 2',
            },
        ];
        const initialState = Immutable.Map({
            learningResourceSuggestionsReducer: {
                CRsuggestions: suggestions,
                CRsuggestionsLoading: false,
                CRsuggestionsError: null,
            },
        });
        const { getByRole } = setup(student, '/learning-resources?user=s1234567', initialState);

        fireEvent.mouseDown(getByRole('combobox', { name: 'search for a subject by course code or title' }));
        fireEvent.click(getByRole('option', { name: 'HIST1200 - History' }));

        expect(mockNavigate).toHaveBeenCalledWith(
            '/learning-resources?user=s1234567&coursecode=HIST1200&campus=St Lucia&semester=Semester 2',
        );
    });
});
