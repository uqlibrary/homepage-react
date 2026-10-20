import React from 'react';
import { render, waitFor, preview } from 'test-utils';
import SubjectBody, { subjectHeading } from './SubjectBody';
import { Guides } from '../panels/Guides';
import { PastExamPapers } from '../panels/PastExamPapers';
import ReadingLists from '../panels/ReadingLists';
import { SubjectLinks } from '../panels/SubjectLinks';

jest.mock('../panels/Guides', () => ({
    Guides: jest.fn(() => null),
}));

jest.mock('../panels/PastExamPapers', () => ({
    PastExamPapers: jest.fn(() => null),
}));

jest.mock('../panels/ReadingLists', () => ({
    __esModule: true,
    default: jest.fn(() => null),
}));

jest.mock('../panels/SubjectLinks', () => ({
    SubjectLinks: jest.fn(() => null),
}));

const createSubjectBodyProps = overrides => ({
    subject: {
        classnumber: 'FREN1010',
        DESCR: 'French &gt; English',
    },
    examList: {
        list: { FREN1010: [{ period: 'Semester 1', url: 'https://example.com/exam.pdf' }] },
        loading: false,
        error: null,
    },
    guideList: {
        list: { FREN1010: [{ title: 'French language guide' }] },
        loading: false,
        error: null,
    },
    readingList: {
        coursecode: 'FREN1010',
        list: { FREN1010: [{ title: 'French reading list' }] },
        loading: false,
        error: null,
    },
    ...overrides,
});

const setup = props => {
    return render(<SubjectBody {...props} />);
};

describe('SubjectBody component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        document.getElementById('learning-resource-search-results')?.remove();
    });

    it('renders the subject heading, focuses search results, and passes panel data', () => {
        const searchResults = document.createElement('div');
        searchResults.id = 'learning-resource-search-results';
        searchResults.tabIndex = -1;
        document.body.appendChild(searchResults);

        const props = createSubjectBodyProps({
            subject: {
                classnumber: 'FREN1010',
                DESCR: 'French &gt; English',
                title: 'Ignored fallback title',
            },
            panelHeadingLevel: 'h4',
            subjectHeaderLevel: 'h1',
            readingList: {
                coursecode: 'FREN1010',
                list: { FREN1010: [{ title: 'French reading list' }] },
                loading: true,
                error: 'Reading list error',
            },
        });
        const { container } = setup(props);
        const heading = container.querySelector('[data-testid="learning-resource-subject-title"]');

        expect(heading.tagName).toBe('H1');
        expect(heading.textContent).toBe('FREN1010 - French > English');
        expect(document.activeElement).toBe(searchResults);

        expect(ReadingLists.mock.calls[0][0]).toEqual(
            {
                courseCode: 'FREN1010',
                readingList: props.readingList.list.FREN1010,
                readingListLoading: true,
                readingListError: 'Reading list error',
                headingLevel: 'h4',
            },
            {},
        );
        expect(PastExamPapers.mock.calls[0][0]).toEqual(
            {
                examList: props.examList.list.FREN1010,
                examListLoading: false,
                examListError: null,
                headingLevel: 'h4',
            },
            {},
        );
        expect(Guides.mock.calls[0][0]).toEqual(
            {
                guideList: props.guideList.list.FREN1010,
                guideListLoading: false,
                guideListError: null,
                headingLevel: 'h4',
            },
            {},
        );
        expect(SubjectLinks.mock.calls[0][0]).toEqual(
            {
                subject: props.subject,
                headingLevel: 'h4',
            },
            {},
        );
    });

    it('uses default heading levels and omits errors for a different reading-list course', () => {
        const props = createSubjectBodyProps({
            subject: { classnumber: '' },
            readingList: {
                coursecode: 'OTHER1010',
                list: { null: [] },
                loading: false,
                error: 'Unrelated reading list error',
            },
        });
        setup(props);

        expect(ReadingLists.mock.calls[0][0]).toEqual(
            {
                courseCode: null,
                readingList: [],
                readingListLoading: false,
                readingListError: null,
                headingLevel: 'h3',
            },
            {},
        );
        expect(PastExamPapers.mock.calls[0][0]).toEqual(
            {
                examList: props.examList.list.null,
                examListLoading: false,
                examListError: null,
                headingLevel: 'h3',
            },
            {},
        );
        expect(Guides.mock.calls[0][0]).toEqual(
            {
                guideList: props.guideList.list.null,
                guideListLoading: false,
                guideListError: null,
                headingLevel: 'h3',
            },
            {},
        );
        expect(SubjectLinks.mock.calls[0][0]).toEqual(
            {
                subject: props.subject,
                headingLevel: 'h3',
            },
            {},
        );
    });

    describe('subjectHeading', () => {
        it('uses course.DESCR before the title fallback', () => {
            expect(
                subjectHeading({
                    classnumber: 'FREN1010',
                    DESCR: 'French &gt; English',
                    title: 'Ignored fallback title',
                }),
            ).toBe('FREN1010 - French > English');
        });

        it('uses the title as a fallback and does not focus when search results are absent', () => {
            expect(subjectHeading({ classnumber: 'BIOL1000', title: 'Biology' })).toBe('BIOL1000 - Biology');
            expect(document.getElementById('learning-resource-search-results')).toBeNull();
        });

        it('returns the class number when the subject has no description or title', () => {
            expect(subjectHeading({ classnumber: 'BIOL1000' })).toBe('BIOL1000 ');
            expect(document.getElementById('learning-resource-search-results')).toBeNull();
        });

        it('does not move focus when the subject description is empty', async () => {
            const searchResults = document.createElement('button');
            searchResults.id = 'learning-resource-search-results';
            searchResults.textContent = 'button';
            document.body.appendChild(searchResults);
            const props = createSubjectBodyProps({
                subject: { classnumber: 'BIOL1000', DESCR: '', title: 'Biology' },
            });
            setup(props);
            const { container } = setup(props);
            expect(container.querySelector('[data-testid="learning-resource-subject-title"]').textContent).toBe(
                'BIOL1000 - Biology',
            );
            await waitFor(() => expect(document.activeElement).toBe(searchResults));
            preview.debug();
        });
    });
});
