import React from 'react';
import { rtlRender } from 'test-utils';

import { noResultsFoundBlock, UserInstructions } from './pastExamPapers.helpers';

describe('helpers', () => {
    describe('UserInstructions', () => {
        it('links to information about past exam papers', () => {
            const { getByRole } = rtlRender(<UserInstructions />);
            const link = getByRole('link', { name: 'Read more about past exam papers' });

            expect(link).toHaveAttribute(
                'href',
                'https://dev-library-uq.pantheonsite.io/study-and-learning-support/coursework/past-exam-papers',
            );
            expect(link.closest('p')).toHaveAttribute('id', 'examResultsDescription');
        });
    });

    describe('noResultsFoundBlock', () => {
        it('does not include a course code when the search term is blank', () => {
            const { getByText } = rtlRender(noResultsFoundBlock('   '));

            expect(getByText('We have not found any past exams for this course.')).toBeInTheDocument();
            expect(getByText('Read more about past exam papers')).toBeInTheDocument();
        });

        it('trims and capitalises the supplied course code', () => {
            const { getByText } = rtlRender(noResultsFoundBlock('  engl1000  '));

            expect(getByText('We have not found any past exams for this course "ENGL1000".')).toBeInTheDocument();
        });
    });
});
