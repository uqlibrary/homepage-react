import React from 'react';
import { rtlRender } from 'test-utils';
import { _courseLink } from '../shared/learningResourcesHelpers';
import { linkToDrupal } from 'helpers/general';
import { PastExamPapers } from './PastExamPapers';

const setup = (props = {}) => {
    const testProps = {
        headingLevel: 'h2',
        examListLoading: false,
        ...props,
    };
    return rtlRender(<PastExamPapers {...testProps} />);
};

describe('PastExamPapers component', () => {
    it('shows loading before errors or exam results', () => {
        const { getByRole, queryByTestId } = setup({
            examListLoading: true,
        });

        expect(getByRole('progressbar', { name: 'loading Past exam papers' })).toBeInTheDocument();
        expect(queryByTestId('exams-springshare-error')).not.toBeInTheDocument();
        expect(queryByTestId('examPaperItem-0')).not.toBeInTheDocument();
    });

    it('shows the error state instead of available exam results', () => {
        const { getByTestId, queryByTestId } = setup({
            examListError: 'Unavailable',
        });

        expect(getByTestId('exams-springshare-error')).toHaveTextContent('Exam papers list currently unavailable');
        expect(queryByTestId('examPaperItem-0')).not.toBeInTheDocument();
    });

    it('shows the empty state when the exam list is missing or empty', () => {
        const { getByTestId, rerender } = setup();

        expect(getByTestId('no-exam-papers')).toHaveTextContent('No Past Exam Papers for this course.');

        rerender(<PastExamPapers headingLevel="h2" examListLoading={false} examList={{ list: [] }} />);

        expect(getByTestId('no-exam-papers')).toBeInTheDocument();
    });

    it('renders papers with sample labels and skips the excess link when none remain', () => {
        const examList = {
            coursecode: 'FREN1010',
            list: [
                { period: 'Semester 1 2025', url: 'https://example.com/sample.pdf', paperType: 'SAMPLE paper' },
                { period: 'Semester 2 2024', url: 'https://example.com/regular.docx', paperType: 'Final paper' },
                { period: 'Semester 1 2024', url: 'https://example.com/other.pdf' },
            ],
            remainingCount: 0,
        };
        const { getByRole, getByTestId, queryByTestId } = setup({ headingLevel: 'h3', examList });

        expect(getByRole('heading', { name: 'Past exam papers (3 items)', level: 3 })).toBeInTheDocument();
        expect(getByTestId('past-exams-FREN1010')).toHaveAttribute('id', 'past-exams-FREN1010');
        expect(getByTestId('examPaperItem-0')).toHaveAttribute(
            'aria-label',
            'past exam paper for Semester 1 2025 format PDF',
        );
        expect(getByTestId('examPaperItem-0')).toHaveTextContent('(Sample)');
        expect(getByTestId('examPaperItem-1')).toHaveTextContent('Semester 2 2024 (DOCX)');
        expect(getByTestId('examPaperItem-1')).not.toHaveTextContent('(Sample)');
        expect(getByTestId('examPaperItem-2')).toHaveTextContent('Semester 1 2024 (PDF)');
        expect(queryByTestId('exam-more-link')).not.toBeInTheDocument();
        expect(getByTestId('exams-readmore')).toHaveTextContent('Read more about past exam papers');
        expect(getByRole('link', { name: 'Read more about past exam papers' })).toHaveAttribute(
            'href',
            linkToDrupal('/study-and-learning-support/coursework/past-exam-papers'),
        );
    });

    it('renders the singular excess-paper link and total count', () => {
        const { getByRole, getByTestId } = setup({
            examList: {
                coursecode: 'BIOL1000',
                list: [{ period: 'Semester 1 2025', url: 'https://example.com/paper.pdf' }],
                remainingCount: 1,
            },
        });

        expect(getByRole('heading', { name: 'Past exam papers (2 items)' })).toBeInTheDocument();
        expect(getByTestId('exam-more-link')).toHaveTextContent('1 more past paper');
        expect(getByRole('link', { name: '1 more past paper' })).toHaveAttribute(
            'href',
            _courseLink('BIOL1000', 'https://www.library.uq.edu.au/exams/course/[courseCode]'),
        );
    });

    it('uses a singular item count and plural excess-paper label', () => {
        const { getByRole, getByTestId } = setup({
            examList: {
                coursecode: 'BIOL1000',
                list: [{ period: 'Semester 1 2025', url: 'https://example.com/paper.pdf' }],
                remainingCount: 2,
            },
        });

        expect(getByRole('heading', { name: 'Past exam papers (3 items)' })).toBeInTheDocument();
        expect(getByTestId('exam-more-link')).toHaveTextContent('2 more past papers');
    });

    it('labels a single available paper as one item', () => {
        const { getByRole } = setup({
            examList: {
                coursecode: 'BIOL1000',
                list: [{ period: 'Semester 1 2025', url: 'https://example.com/paper.pdf' }],
            },
        });

        expect(getByRole('heading', { name: 'Past exam papers (1 item)' })).toBeInTheDocument();
    });
});
