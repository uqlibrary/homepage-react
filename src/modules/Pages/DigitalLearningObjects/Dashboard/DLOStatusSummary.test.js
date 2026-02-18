import React from 'react';
import { render, screen } from '@testing-library/react';
import DLOStatusSummary from './DLOStatusSummary';
import * as helpers from '../../Admin/DigitalLearningObjects/dlorAdminHelpers';

describe('DLOStatusSummary', () => {
    beforeEach(() => {
        jest.spyOn(helpers, 'getUserPostfix').mockReturnValue('');
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('renders all status counts and labels with provided data', () => {
        const data = {
            new_objects: 1,
            published_objects: 2,
            rejected_objects: 3,
            deprecated_objects: 4,
            user_submitted_objects: 5,
        };
        render(<DLOStatusSummary data={data} />);
        expect(screen.getByTestId('count-new_objects')).toHaveTextContent('1');
        expect(screen.getByTestId('count-published_objects')).toHaveTextContent('2');
        expect(screen.getByTestId('count-rejected_objects')).toHaveTextContent('3');
        expect(screen.getByTestId('count-deprecated_objects')).toHaveTextContent('4');
        expect(screen.getByTestId('count-user_submitted_objects')).toHaveTextContent('5');
        expect(screen.getByText('New / Draft')).toBeInTheDocument();
        expect(screen.getByText('Published')).toBeInTheDocument();
        expect(screen.getByText('Rejected')).toBeInTheDocument();
        expect(screen.getByText('Unpublished')).toBeInTheDocument();
        expect(screen.getByText('User Submitted')).toBeInTheDocument();
    });

    it('renders 0 for missing or undefined data', () => {
        render(<DLOStatusSummary data={{}} />);
        expect(screen.getByTestId('count-new_objects')).toHaveTextContent('0');
        expect(screen.getByTestId('count-published_objects')).toHaveTextContent('0');
        expect(screen.getByTestId('count-rejected_objects')).toHaveTextContent('0');
        expect(screen.getByTestId('count-deprecated_objects')).toHaveTextContent('0');
        expect(screen.getByTestId('count-user_submitted_objects')).toHaveTextContent('0');
    });

    it('renders 0 for completely missing data prop', () => {
        render(<DLOStatusSummary />);
        expect(screen.getByTestId('count-new_objects')).toHaveTextContent('0');
        expect(screen.getByTestId('count-published_objects')).toHaveTextContent('0');
        expect(screen.getByTestId('count-rejected_objects')).toHaveTextContent('0');
        expect(screen.getByTestId('count-deprecated_objects')).toHaveTextContent('0');
        expect(screen.getByTestId('count-user_submitted_objects')).toHaveTextContent('0');
    });

    it('generates correct hrefs for each status (no postfix)', () => {
        render(<DLOStatusSummary data={{}} />);
        expect(screen.getByTestId('count-new_objects').querySelector('a')).toHaveAttribute(
            'href',
            '/digital-learning-hub?type=new',
        );
        expect(screen.getByTestId('count-published_objects').querySelector('a')).toHaveAttribute(
            'href',
            '/digital-learning-hub?type=current',
        );
        expect(screen.getByTestId('count-rejected_objects').querySelector('a')).toHaveAttribute(
            'href',
            '/digital-learning-hub?type=rejected',
        );
        expect(screen.getByTestId('count-deprecated_objects').querySelector('a')).toHaveAttribute(
            'href',
            '/digital-learning-hub?type=deprecated',
        );
        expect(screen.getByTestId('count-user_submitted_objects').querySelector('a')).toHaveAttribute(
            'href',
            '/digital-learning-hub?type=usersubmitted',
        );
    });

    it('generates correct hrefs for each status (with postfix)', () => {
        helpers.getUserPostfix.mockReturnValue('?user=foo');
        render(<DLOStatusSummary data={{}} />);
        expect(screen.getByTestId('count-new_objects').querySelector('a')).toHaveAttribute(
            'href',
            '/digital-learning-hub?user=foo&type=new',
        );
        expect(screen.getByTestId('count-published_objects').querySelector('a')).toHaveAttribute(
            'href',
            '/digital-learning-hub?user=foo&type=current',
        );
        expect(screen.getByTestId('count-rejected_objects').querySelector('a')).toHaveAttribute(
            'href',
            '/digital-learning-hub?user=foo&type=rejected',
        );
        expect(screen.getByTestId('count-deprecated_objects').querySelector('a')).toHaveAttribute(
            'href',
            '/digital-learning-hub?user=foo&type=deprecated',
        );
        expect(screen.getByTestId('count-user_submitted_objects').querySelector('a')).toHaveAttribute(
            'href',
            '/digital-learning-hub?user=foo&type=usersubmitted',
        );
    });
});
