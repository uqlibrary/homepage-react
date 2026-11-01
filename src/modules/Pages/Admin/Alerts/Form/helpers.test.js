import {
    expandValues,
    isInvalidEndDate,
    isInvalidStartDate,
    postAddCloneDetails,
    postAddConfirmationDetails,
} from './helpers';

describe('helpers', () => {
    const dateDefaults = { startDateDefault: '2030-05-01T09:00', endDateDefault: '2030-05-01T17:00' };

    it('validates start dates against the minimum and date format', () => {
        expect(isInvalidStartDate('2030-05-01T09:00', dateDefaults)).toBe(false);
        expect(isInvalidStartDate('2030-04-30T17:00', dateDefaults)).toBe(true);
        expect(isInvalidStartDate('', dateDefaults)).toBe(true);
        expect(isInvalidStartDate('2030-05-32T09:00', dateDefaults)).toBe(true);
    });

    it('validates end dates against their start date and date format', () => {
        expect(isInvalidEndDate('2030-05-01T17:00', '2030-05-01T09:00')).toBe(false);
        expect(isInvalidEndDate('2030-05-01T09:00', '2030-05-01T09:00')).toBe(true);
        expect(isInvalidEndDate('2030-05-01T17:00', '')).toBe(false);
        expect(isInvalidEndDate('2030-05-32T17:00', '')).toBe(true);
    });

    it('expands empty form values with defaults and empty optional fields', () => {
        expect(
            expandValues(
                {
                    alertTitle: '',
                    enteredbody: 'Notice',
                    permanentAlert: false,
                    linkRequired: false,
                    linkTitle: '',
                    linkUrl: '',
                    startDate: '',
                    endDate: '',
                    systems: null,
                },
                dateDefaults,
            ),
        ).toEqual({
            alertTitle: '',
            enteredbody: 'Notice',
            permanentAlert: false,
            linkRequired: false,
            linkTitle: '',
            linkUrl: '',
            startDate: dateDefaults.startDateDefault,
            endDate: dateDefaults.endDateDefault,
            systems: [],
            body: 'Notice',
        });
    });

    it('preserves populated values and builds the alert body', () => {
        expect(
            expandValues(
                {
                    alertTitle: 'Notice title',
                    enteredbody: 'Read this',
                    permanentAlert: true,
                    linkRequired: true,
                    linkTitle: 'More details',
                    linkUrl: '/details',
                    startDate: '2030-05-02T09:00',
                    endDate: '2030-05-02T17:00',
                    systems: ['homepage'],
                },
                dateDefaults,
            ),
        ).toEqual({
            alertTitle: 'Notice title',
            enteredbody: 'Read this',
            permanentAlert: true,
            linkRequired: true,
            linkTitle: 'More details',
            linkUrl: '/details',
            startDate: '2030-05-02T09:00',
            endDate: '2030-05-02T17:00',
            systems: ['homepage'],
            body: 'Read this[permanent][More details](/details)',
        });
    });

    it('formats add confirmation details for one or more alerts', () => {
        const addLocale = {
            confirmationTitle: 'An alert has been added',
            confirmationMessage: 'The alert is now live.',
        };

        expect(postAddConfirmationDetails(addLocale, 1)).toEqual(addLocale);
        expect(postAddConfirmationDetails(addLocale, 3)).toEqual({
            ...addLocale,
            confirmationTitle: '3 alerts have been added',
        });
    });

    it('formats clone confirmation details for one or more alerts', () => {
        const cloneLocale = {
            confirmationTitle: 'The alert has been cloned',
            confirmationMessage: 'The cloned alert can now be edited.',
        };

        expect(postAddCloneDetails(cloneLocale, 1)).toEqual(cloneLocale);
        expect(postAddCloneDetails(cloneLocale, 2)).toEqual({
            ...cloneLocale,
            confirmationTitle: '2 alerts have been cloned',
        });
    });
});
