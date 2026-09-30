import {
    bookingText,
    eventDateRange,
    eventTimeLong,
    filterStandardisedTrainingEvents,
    hasClasses,
    getUrlForLearningResourceSpecificTab,
} from './helpers';

import { fullPath } from 'config/routes';

const course = {
    classnumber: 'MATH1040',
    CAMPUS: 'STLUC',
    semester: 'Semester 1',
    DESCR: 'Basic Mathematics',
};
const student = { id: 's1234567', user_group: 'UG', current_classes: [course] };

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

describe('Helpers', () => {
    it('recognises enrolled classes only for a logged-in account', () => {
        expect(hasClasses(student)).toBe(true);
        expect(hasClasses(null)).toBe(false);
        expect(hasClasses({ current_classes: [course] })).toBe(false);
        expect(hasClasses({ id: 's1234567' })).toBe(false);
        expect(hasClasses({ id: 's1234567', current_classes: [] })).toBe(false);
    });

    it('builds course URLs from campus codes and optionally preserves a user query', () => {
        expect(getUrlForLearningResourceSpecificTab(course, { search: '' })).toBe(
            '/learning-resources?coursecode=MATH1040&campus=St Lucia&semester=Semester 1',
        );
        expect(getUrlForLearningResourceSpecificTab(course, { search: '?user=s1234567' }, true)).toBe(
            `${fullPath}/learning-resources?user=s1234567&coursecode=MATH1040&campus=St Lucia&semester=Semester 1`,
        );
        expect(getUrlForLearningResourceSpecificTab(course, { search: 'user=s1234567' })).toBe(
            '/learning-resources?coursecode=MATH1040&campus=St Lucia&semester=Semester 1',
        );
    });

    it('uses the supplied campus for dropdown selections', () => {
        expect(
            getUrlForLearningResourceSpecificTab(
                { classnumber: 'HIST1200', campus: 'Gatton', semester: 'Semester 2' },
                { search: '?user=s1234567' },
                false,
                true,
            ),
        ).toBe('/learning-resources?user=s1234567&coursecode=HIST1200&campus=Gatton&semester=Semester 2');
    });

    it('formats same-day and multi-day event times', () => {
        const event = { start: '2020-01-15T09:00:00', end: '2020-01-15T10:00:00' };

        expect(eventTimeLong(event)).toBe('15 January at 9am');
        expect(eventTimeLong({ ...event, end: '2020-01-16T10:30:00' })).toBe(
            '15 January at 9am - 16 January at 10.30am',
        );
    });

    it('formats same-day, same-month and cross-month date ranges', () => {
        const event = { start: '2020-01-15T09:00:00', end: '2020-01-15T10:00:00' };

        expect(eventDateRange(event)).toBe('15 January');
        expect(eventDateRange({ ...event, end: '2020-01-17T10:00:00' })).toBe('15 - 17 January');
        expect(eventDateRange({ ...event, end: '2020-02-02T10:00:00' })).toBe('15 January - 2 February');
    });

    it('selects booking labels for no booking, available places and a full event', () => {
        expect(bookingText({ bookingSettings: null })).toEqual({
            display: 'Booking is not required',
            button: 'Log in for more details',
        });
        expect(bookingText({ bookingSettings: { isBookingAvailable: true } })).toEqual({
            display: 'Places still available',
            button: 'Log in and book now',
        });
        expect(bookingText({ bookingSettings: { isBookingAvailable: false } })).toEqual({
            display: 'Event is fully booked',
            button: 'Log in to join wait list',
        });
    });

    it('normalizes array and object events and limits them to three', () => {
        const events = [
            firstEvent,
            { ...firstEvent, entityId: 102 },
            { ...firstEvent, entityId: 103 },
            { ...firstEvent, entityId: 104 },
        ];

        expect(filterStandardisedTrainingEvents(events, false, false)).toEqual(events.slice(0, 3));
        expect(filterStandardisedTrainingEvents({ one: events[0], two: events[1] }, false, false)).toEqual(
            events.slice(0, 2),
        );
        expect(filterStandardisedTrainingEvents(null, false, false)).toEqual([]);
        expect(filterStandardisedTrainingEvents(events, true, false)).toEqual(events.slice(0, 3));
        expect(filterStandardisedTrainingEvents(events, false, true)).toEqual(events.slice(0, 3));
        expect(filterStandardisedTrainingEvents({ one: events[0] }, true, false)).toEqual([]);
        expect(filterStandardisedTrainingEvents({ one: events[0] }, false, true)).toEqual([]);
    });
});
