import React from 'react';
import { rtlRender, waitFor, WithRouter } from 'test-utils';
import { useParams } from 'react-router';
import useMediaQuery from '@mui/material/useMediaQuery';

import examSearchDENT80 from '../../../data/mock/data/records/learningResources/examSearch_DENT80';
import examSearchFREN from '../../../data/mock/data/records/learningResources/examSearch_FREN';
import examSearchPHYS1001 from '../../../data/mock/data/records/learningResources/examSearch_PHYS1001';

import { PastExamPaperList } from './PastExamPaperList';
import { MESSAGE_EXAMCODE_404 } from '../PastExamPaperSearch/pastExamPapers.helpers';

jest.mock('@mui/material/useMediaQuery', () => jest.fn());
jest.mock('@mui/material/styles/useTheme', () =>
    jest.fn(() => ({
        palette: {
            designSystem: {
                headingColor: '#000',
                panelBackgroundColor: '#fff',
            },
        },
        breakpoints: {
            down: jest.fn(() => 'sm'),
        },
    })),
);

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useParams: jest.fn(),
}));

const defaultActions = {
    loadExamSearch: jest.fn(),
};

const mockUseParams = useParams;
const mockUseMediaQuery = useMediaQuery;

const dent1050OnlyResults = {
    ...examSearchDENT80,
    papers: examSearchDENT80.papers.filter(course =>
        course.some(semester => semester.some(paper => paper?.courseCode?.toUpperCase() === 'DENT1050')),
    ),
};

const emptyResults = {
    minYear: 2017,
    maxYear: 2022,
    periods: [],
    papers: [],
};

function setup(testProps = {}) {
    const props = {
        actions: defaultActions,
        examSearchList: examSearchFREN,
        examSearchListError: null,
        examSearchListLoading: false,
        ...testProps,
    };

    return rtlRender(
        <WithRouter>
            <PastExamPaperList {...props} />
        </WithRouter>,
    );
}

describe('PastExamPaperList', () => {
    beforeEach(() => {
        document.body.appendChild(document.createElement('uq-site-header'));
        jest.clearAllMocks();
        mockUseParams.mockReturnValue({ courseHint: 'fren' });
        mockUseMediaQuery.mockReturnValue(false);
    });

    afterEach(() => {
        document.querySelector('uq-site-header')?.remove();
    });

    it('renders the result page, sets metadata, and loads the requested course', async () => {
        const { getByRole, getByTestId } = setup();

        await waitFor(() => expect(defaultActions.loadExamSearch).toHaveBeenCalledWith('fren'));

        expect(getByRole('heading', { name: 'Sample past exam papers' })).toBeInTheDocument();
        expect(getByTestId('exampapers-original-heading')).toHaveTextContent('Original past exam papers');
        expect(document.title).toBe(
            'Past Exam Papers from 2017 to 2022 for "FREN" - Library - The University of Queensland',
        );
        expect(document.querySelector('uq-site-header')).toHaveAttribute('secondleveltitle', 'Past exam papers');
        expect(document.querySelector('uq-site-header')).toHaveAttribute('secondlevelurl', '/exams');
        expect(getByRole('link', { name: 'Read more about past exam papers' })).toHaveAttribute(
            'href',
            'https://dev-library-uq.pantheonsite.io/study-and-learning-support/coursework/past-exam-papers',
        );
    });

    it('renders without a site header', () => {
        document.querySelector('uq-site-header').remove();

        expect(() => setup()).not.toThrow();
    });

    describe('a desktop page', () => {
        it('with multiple subjects displayed shows the desktop originals table view', async () => {
            const { getByTestId, findByText } = setup({ examSearchList: examSearchFREN });

            expect(await findByText('Past Exam Papers from 2017 to 2022 for "FREN"')).toBeInTheDocument();

            expect(getByTestId('exampaper-desktop-sample-link-FREN1010-semester0-paper0')).toHaveTextContent(
                'FREN1010 Sem.2 2020',
            );
            expect(getByTestId('exampaper-desktop-originals-table-header').children).toHaveLength(4);
            expect(getByTestId('exampaper-desktop-originals-table-body').children).toHaveLength(22);

            // FREN1010 row one, column one, cell is empty
            expect(getByTestId('exampaper-desktop-originals-FREN1010-semester0')).toBeEmptyDOMElement();

            // FREN1010 row one, column two, cell has two links
            const paper1A = getByTestId('exampaper-desktop-originals-link-FREN1010-semester1-paper0');
            expect(paper1A).toHaveTextContent('FREN1010');
            expect(paper1A).toHaveTextContent('Paper A');
            expect(paper1A).toContainHTML('FREN1010<span><br>Paper A</span>');
            expect(paper1A).toHaveAttribute(
                'href',
                'https://files.library.uq.edu.au/exams/2019/Semester_Two_Final_Examinations__2018_FREN1020_613.pdf',
            );

            const paper1B = getByTestId('exampaper-desktop-originals-link-FREN1010-semester1-paper1');
            expect(paper1B).toHaveTextContent('FREN1010');
            expect(paper1B).toHaveTextContent('Paper B');
            expect(paper1B).toContainHTML('FREN1010<span><br>Paper B</span>');
            expect(paper1B).toHaveAttribute(
                'href',
                'https://files.library.uq.edu.au/exams/2019/Semester_Two_Final_Examinations__2018_FREN1020_614.pdf',
            );

            // FREN1010 row one, column three, cell is empty
            expect(getByTestId('exampaper-desktop-originals-FREN1010-semester2')).toBeEmptyDOMElement();

            // FREN2010 row two, column one, cell has link
            expect(getByTestId('exampaper-desktop-originals-link-FREN2010-semester0-paper0')).toHaveAttribute(
                'href',
                'https://files.library.uq.edu.au/exams/2018/Semester_Two_Final_Examinations__2021_FREN2110_8461.pdf',
            );

            // FREN2010 row two, column two, cell is empty
            expect(getByTestId('exampaper-desktop-originals-FREN2010-semester1')).toBeEmptyDOMElement();

            // FREN2010 row two, column three, cell has link
            const paper3 = getByTestId('exampaper-desktop-originals-link-FREN2010-semester2-paper0');
            expect(paper3).toHaveTextContent('FREN2010');
            expect(paper3).toHaveTextContent('Final');
            expect(paper3).toContainHTML('FREN2010<span><br>Final</span>');
            expect(paper3).toHaveAttribute(
                'href',
                'https://files.library.uq.edu.au/exams/2018/Semester_Two_Final_Examinations__2019_FREN7221_school.pdf',
            );

            // FREN2080 row three, column one, cell has link
            const paper4 = getByTestId('exampaper-desktop-originals-link-FREN2080-semester0-paper0');
            expect(paper4).toHaveTextContent('FREN2080');
            expect(paper4).toHaveAttribute(
                'href',
                'https://files.library.uq.edu.au/exams/2018/Semester_Two_Final_Examinations__2021_FREN2110_8462.pdf',
            );

            // FREN2080 row three, column two, cell is empty
            expect(getByTestId('exampaper-desktop-originals-FREN2080-semester1')).toBeEmptyDOMElement();
            // FREN2080 row three, column three, cell is empty
            expect(getByTestId('exampaper-desktop-originals-FREN2080-semester2')).toBeEmptyDOMElement();

            // FREN2081 row four, column one, cell has link
            const paper5 = getByTestId('exampaper-desktop-originals-link-FREN2081-semester0-paper0');
            expect(paper5).toHaveTextContent('FREN2081');
            expect(paper5).toHaveAttribute(
                'href',
                'https://files.library.uq.edu.au/exams/2018/Semester_Two_Final_Examinations__2021_FREN2110_8463.pdf',
            );

            // FREN2081 row four, column two, cell is empty
            expect(getByTestId('exampaper-desktop-originals-FREN2081-semester1')).toBeEmptyDOMElement();
            // FREN2081 row four, column three, cell is empty
            expect(getByTestId('exampaper-desktop-originals-FREN2081-semester2')).toBeEmptyDOMElement();

            // FREN2082 row five, column one, cell has link
            const paper6 = getByTestId('exampaper-desktop-originals-link-FREN2082-semester0-paper0');
            expect(paper6).toHaveTextContent('Final Paper');
            expect(paper6).toHaveTextContent('FREN2082');
            expect(paper6).toContainHTML('<span>Final Paper<br></span>FREN2082');
            expect(paper6).toHaveAttribute(
                'href',
                'https://files.library.uq.edu.au/exams/2018/Semester_Two_Final_Examinations__2021_FREN2110_8464.pdf',
            );

            // FREN2082 row five, column two, cell has two links
            const paper7A = getByTestId('exampaper-desktop-originals-link-FREN2082-semester1-paper0');
            expect(paper7A).toHaveTextContent('FREN2082');
            expect(paper7A).toHaveTextContent('a special french paper');
            expect(paper7A).toContainHTML('FREN2082<span><br>a special french paper</span>');
            expect(paper7A).toHaveAttribute(
                'href',
                'https://files.library.uq.edu.au/exams/2018/Semester_Two_Final_Examinations__2021_FREN2110_847.pdf',
            );

            const paper7B = getByTestId('exampaper-desktop-originals-link-FREN2082-semester1-paper1');
            expect(paper7B).toHaveTextContent('FREN2082');
            expect(paper7B).toHaveAttribute(
                'href',
                'https://files.library.uq.edu.au/exams/2018/Semester_Two_Final_Examinations__2021_FREN2110_848.pdf',
            );

            // FREN2082 row five, column three, cell is empty
            expect(getByTestId('exampaper-desktop-originals-FREN2082-semester2')).toBeEmptyDOMElement();

            // FREN2083 row six, column one, cell has link
            const paper8 = getByTestId('exampaper-desktop-originals-link-FREN2083-semester0-paper0');
            expect(paper8).toHaveTextContent('FREN2083');
            expect(paper8).toHaveAttribute(
                'href',
                'https://files.library.uq.edu.au/exams/2018/Semester_Two_Final_Examinations__2021_FREN2110_8465.pdf',
            );

            // FREN2083 row six, column two, cell is empty
            expect(getByTestId('exampaper-desktop-originals-FREN2083-semester1')).toBeEmptyDOMElement();

            // FREN2083 row six, column three, cell is empty
            expect(getByTestId('exampaper-desktop-originals-FREN2083-semester2')).toBeEmptyDOMElement();
        });

        it('with one subject and no sample papers shows originals in simple desktop view', async () => {
            mockUseParams.mockReturnValue({ courseHint: 'PHYS1001' });
            const { getByTestId, queryByTestId, findByTestId } = setup({ examSearchList: examSearchPHYS1001 });

            expect(await findByTestId('exampapers-original-heading')).toBeInTheDocument();

            expect(getByTestId('exampaper-desktop-original-line')).toBeInTheDocument();
            expect(queryByTestId('exampaper-desktop-sample-line')).not.toBeInTheDocument();
        });

        it('with no original papers and some sample papers shows the desktop simple view', async () => {
            mockUseParams.mockReturnValue({ courseHint: 'dent1050' });
            const { getByTestId, queryByTestId } = setup({ examSearchList: dent1050OnlyResults });

            expect(getByTestId('exampapers-original-heading')).toHaveTextContent('Original past exam papers');

            expect(getByTestId('no-original-papers-provided')).toHaveTextContent('No original papers provided.');
            expect(queryByTestId('original-papers-table')).not.toBeInTheDocument();
            expect(getByTestId('sample-papers-heading')).toHaveTextContent('Sample past exam papers');
            expect(getByTestId('exampaper-desktop-sample-link-DENT1050-semester0-paper0')).toHaveTextContent(
                'DENT1050 Sem.2 2022',
            );
        });
    });

    describe('a mobile page', () => {
        beforeEach(() => {
            mockUseMediaQuery.mockReturnValue(true);
        });

        it('with multiple subjects displayed shows the mobile originals simple view', () => {
            const { getByTestId } = setup({ examSearchList: examSearchFREN });

            // sample papers are correct
            expect(getByTestId('exampaper-mobile-sample-link-FREN1010-semester0-paper0')).toHaveTextContent(
                'FREN1010 Sem.2 2020',
            );

            // original papers are correct
            expect(getByTestId('exampaper-mobile-original-link-FREN1010-semester0-paper0')).toHaveTextContent(
                'FREN1010 Sem.1 2020 Paper A',
            );
            expect(getByTestId('exampaper-mobile-original-link-FREN1010-semester0-paper1')).toHaveTextContent(
                'FREN1010 Sem.1 2020 Paper B',
            );
            expect(getByTestId('exampaper-mobile-original-link-FREN2010-semester0-paper0')).toHaveTextContent(
                'FREN2010 Sem.1 2021',
            );
            expect(getByTestId('exampaper-mobile-original-link-FREN2010-semester1-paper0')).toHaveTextContent(
                'FREN2010 Sem.1 2019 Final',
            );
            expect(getByTestId('exampaper-mobile-original-link-FREN2082-semester1-paper0')).toHaveTextContent(
                'FREN2082 Sem.1 2020 a special french paper',
            );
            expect(getByTestId('exampaper-mobile-original-link-FREN2082-semester1-paper1')).toHaveTextContent(
                'FREN2082 Sem.1 2020 Paper 2',
            );
            expect(getByTestId('exampaper-mobile-original-link-FREN2082-semester0-paper0')).toHaveTextContent(
                'FREN2082 Sem.1 2021 (Final Paper)',
            );
        });

        it('with one subject and no sample papers shows originals in Simple view', () => {
            mockUseParams.mockReturnValue({ courseHint: 'PHYS1001' });
            const { getByTestId, queryByTestId } = setup({ examSearchList: examSearchPHYS1001 });

            expect(getByTestId('exampapers-original-heading')).toHaveTextContent('Original past exam papers');
            expect(getByTestId('exampaper-mobile-original-line')).toBeInTheDocument();
            expect(queryByTestId('exampaper-mobile-sample-line')).not.toBeInTheDocument();
        });

        it('with no original papers and some sample papers shows Simple view', () => {
            mockUseParams.mockReturnValue({ courseHint: 'dent1050' });
            const { getByTestId, queryByTestId } = setup({ examSearchList: dent1050OnlyResults });

            expect(getByTestId('exampapers-original-heading')).toHaveTextContent('Original past exam papers');
            expect(getByTestId('no-original-papers-provided')).toHaveTextContent('No original papers provided');
            expect(queryByTestId('original-papers-table')).not.toBeInTheDocument();
            expect(getByTestId('sample-papers-heading')).toHaveTextContent('Sample past exam papers');
            expect(getByTestId('exampaper-mobile-sample-link-DENT1050-semester0-paper0')).toHaveTextContent(
                'DENT1050 Sem.2 2022',
            );
        });
    });

    describe('search errors', () => {
        it('a search with no results shows a course-specific message', async () => {
            mockUseParams.mockReturnValue({ courseHint: 'empt' });
            const { getByTestId, getByText } = setup({ examSearchList: emptyResults, examSearchListError: false });

            expect(getByText('Past Exam Papers from 2017 to 2022 for "EMPT"')).toBeInTheDocument();
            expect(getByTestId('past-exam-paper-missing')).toHaveTextContent(
                'We have not found any past exams for this course "EMPT".',
            );
        });

        it('a true 404 shows the generic missing-course message', async () => {
            mockUseParams.mockReturnValue({ courseHint: 'mock404' });
            const { getByText, getByTestId } = setup({
                examSearchList: null,
                examSearchListError: MESSAGE_EXAMCODE_404,
            });

            expect(getByText('Past Exam Papers by Subject')).toBeInTheDocument();
            expect(getByTestId('past-exam-paper-missing')).toHaveTextContent(
                'We have not found any past exams for this course.',
            );
        });

        it('when the api fails I get an appropriate error message', async () => {
            const { getByTestId, queryAllByRole } = setup({ examSearchListError: new Error('Unavailable') });

            expect(queryAllByRole('option')).toHaveLength(0);
            expect(getByTestId('past-exam-paper-error')).toHaveTextContent(
                'Past exam paper search is currently unavailable - please try again later',
            );
        });
    });

    describe('coverage', () => {
        it('shows a loader while results are loading', () => {
            const { getByLabelText } = setup({ examSearchListLoading: true });

            expect(getByLabelText('Loading Past exam papers')).toBeInTheDocument();
        });
    });
});
