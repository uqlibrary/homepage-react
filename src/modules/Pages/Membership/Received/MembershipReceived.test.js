import React from 'react';
import { rtlRender } from 'test-utils';
import MembershipReceived from './MembershipReceived';

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useParams: () => ({ id: 'abc-00000123' }),
}));

describe('MembershipReceived', () => {
    it('thanks the applicant and shows their application reference', () => {
        const { getByTestId } = rtlRender(<MembershipReceived />);

        expect(getByTestId('membership-received')).toBeInTheDocument();
        expect(getByTestId('membership-received-thankyou')).toHaveTextContent('Thank you for your membership');
        expect(getByTestId('membership-received-reference')).toHaveTextContent('abc-00000123');
    });
});
