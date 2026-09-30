import React from 'react';
import { fireEvent, rtlRender, waitFor } from 'test-utils';

import Training, { MyLoader } from './Training';

const firstEvent = {
    entityId: 101,
    name: 'Research skills',
    start: '2026-11-20T09:00:00+10:00',
    end: '2026-11-20T10:00:00+10:00',
    campus: 'St Lucia',
    location: 'Central Library',
    summary: '<p>Learn to find research articles.</p>',
    bookingSettings: null,
};

function setup(props = {}) {
    return rtlRender(
        <Training trainingEvents={[firstEvent]} trainingEventsLoading={false} trainingEventsError={false} {...props} />,
    );
}

describe('Training', () => {
    it('shows a training event and its booking details', async () => {
        const { getByRole, getByText, getByTestId, queryByTestId } = setup();

        expect(getByRole('heading', { name: 'Training' })).toBeInTheDocument();
        expect(getByRole('link', { name: 'See all training' })).toHaveAttribute(
            'href',
            'https://dev-library-uq.pantheonsite.io/study-and-learning-support/training-and-workshops/online-and-person-workshops',
        );
        expect(getByTestId('training-event-date-range-0')).toHaveTextContent('20 November');
        expect(getByRole('button', { name: /Research skills/ })).toHaveTextContent('St Lucia');

        fireEvent.click(getByRole('button', { name: /Research skills/ }));

        expect(getByTestId('training-events-detail-101')).toBeInTheDocument();
        expect(getByText('Learn to find research articles.')).toBeInTheDocument();
        expect(getByText('Central Library')).toBeInTheDocument();
        expect(getByText('Booking is not required')).toBeInTheDocument();
        expect(getByRole('link', { name: 'Log in for more details' })).toHaveAttribute(
            'href',
            'https://studenthub.uq.edu.au/students/events/detail/101',
        );
        await waitFor(() => expect(getByRole('button', { name: 'Close event detail' })).toHaveFocus());

        fireEvent.click(getByRole('button', { name: 'Close event detail' }));
        expect(queryByTestId('training-events-detail-101')).not.toBeInTheDocument();
        expect(getByRole('button', { name: /Research skills/ })).toBeInTheDocument();
    });

    it('shows a loading placeholder while events are loading', () => {
        const { getByLabelText, queryByTestId } = setup({ trainingEvents: null, trainingEventsLoading: true });

        expect(getByLabelText('UQ training Events loading')).toBeInTheDocument();
        expect(queryByTestId('training-event-detail-button-0')).not.toBeInTheDocument();
    });

    it('shows an error when events cannot be loaded', () => {
        const { getByTestId, queryByTestId } = setup({ trainingEventsError: true });

        expect(getByTestId('training-api-error')).toHaveTextContent('We can’t load training events right now');
        expect(queryByTestId('training-event-detail-button-0')).not.toBeInTheDocument();
    });

    it.each([[], null])('shows the empty state for missing events (%p)', trainingEvents => {
        const { getByTestId, getByRole, container, rerender } = setup({ trainingEvents });

        expect(getByTestId('training-api-error')).toHaveTextContent('There are no training sessions available');
        expect(getByRole('link', { name: 'Training and workshops' })).toHaveAttribute(
            'href',
            'https://dev-library-uq.pantheonsite.io/study-and-learning-support/training-and-workshops',
        );
        rerender(
            <Training trainingEvents={trainingEvents} trainingEventsLoading={false} trainingEventsError={false} />,
        );
        expect(container.querySelector('.trainingWrapper')).toHaveClass('missing');
    });

    it('normalizes object-shaped events and displays only the first three', () => {
        const events = Object.fromEntries(
            [101, 102, 103, 104].map(entityId => [entityId, { ...firstEvent, entityId, name: `Event ${entityId}` }]),
        );
        const { getAllByTestId, queryByRole } = setup({ trainingEvents: events });

        expect(getAllByTestId(/^training-event-detail-button-/)).toHaveLength(3);
        expect(queryByRole('button', { name: /Event 104/ })).not.toBeInTheDocument();
    });

    it('shows available bookings and a same-month date range', () => {
        const event = {
            ...firstEvent,
            end: '2026-11-22T10:00:00+10:00',
            bookingSettings: { isBookingAvailable: true },
            location: null,
            venue: 'Teaching Room',
        };
        const { getByTestId, getByRole, getByText } = setup({ trainingEvents: [event] });

        expect(getByTestId('training-event-date-range-0')).toHaveTextContent('20 - 22 November');
        fireEvent.click(getByRole('button', { name: /Research skills/ }));
        expect(getByTestId('training-detail-date-range-101')).toHaveTextContent('22 November');
        expect(getByText('Teaching Room')).toBeInTheDocument();
        expect(getByText('Places still available')).toBeInTheDocument();
        expect(getByRole('link', { name: 'Log in and book now' })).toBeInTheDocument();
    });

    it('shows a wait list and a cross-month date range for a full event', () => {
        const event = {
            ...firstEvent,
            end: '2026-12-02T10:00:00+10:00',
            bookingSettings: { isBookingAvailable: false },
        };
        const { getByTestId, getByRole, getByText } = setup({ trainingEvents: [event] });

        expect(getByTestId('training-event-date-range-0')).toHaveTextContent('20 November - 2 December');
        fireEvent.click(getByRole('button', { name: /Research skills/ }));
        expect(getByTestId('training-detail-date-range-101')).toHaveTextContent('2 December');
        expect(getByText('Event is fully booked')).toBeInTheDocument();
        expect(getByRole('link', { name: 'Log in to join wait list' })).toBeInTheDocument();
    });

    it('renders the loading graphic', () => {
        const { getByTestId } = rtlRender(<MyLoader data-testid="training-loader" width={250} />);

        expect(getByTestId('training-loader')).toHaveAttribute('viewBox', '0 0 365 300');
        expect(getByTestId('training-loader')).toHaveAttribute('width', '250');
        expect(getByTestId('training-loader').querySelectorAll('rect[rx="3"]')).toHaveLength(9);
    });
});
