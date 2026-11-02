import React from 'react';
import { rtlRender } from 'test-utils';
import { SubjectLinks } from './SubjectLinks';

const setup = (subject, headingLevel = 'h2') =>
    rtlRender(<SubjectLinks subject={subject} headingLevel={headingLevel} />);

describe('SubjectLinks component', () => {
    it('renders the standard links for a non-LAWS course', () => {
        const subject = { classnumber: 'BIOL1000' };
        const { getByRole, getByTestId, queryByTestId } = setup(subject, 'h3');

        expect(getByRole('heading', { name: 'Course links', level: 3 })).toBeInTheDocument();
        expect(getByTestId('subject-links-BIOL1000')).toHaveAttribute('id', 'subject-links-BIOL1000');
        expect(getByTestId('blackboard')).toHaveAttribute('href', 'https://learn.uq.edu.au/');
        expect(getByTestId('ecp')).toHaveAttribute(
            'href',
            'https://www.uq.edu.au/study/course.html?course_code=BIOL1000',
        );
        expect(getByTestId('ecp')).toHaveTextContent('Electronic Course Profile');
        expect(queryByTestId('legalResearchEssentials')).not.toBeInTheDocument();
    });

    it('adds Legal Research Essentials for a LAWS course', () => {
        const { getByTestId } = setup({ classnumber: 'LAWS1100' });

        expect(getByTestId('legalResearchEssentials')).toHaveAttribute(
            'href',
            'https://web.library.uq.edu.au/study-and-learning-support/training-and-workshops/legal-research-essentials',
        );
        expect(getByTestId('legalResearchEssentials')).toHaveTextContent('Legal Research Essentials');
    });
});
