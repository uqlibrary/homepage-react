import { MEMBERSHIP_TYPES, ALL_TYPES } from './membershipFieldRules';
import {
    MAINTENANCE_WINDOW,
    PAYMENT_GATEWAY_OUTAGE,
    PAYMENT_GATEWAY_TYPES,
    formatOutageWindow,
    isFrozen,
    isPaymentGatewayOutage,
    isWithinWindow,
} from './membershipOutage';

const during = window => new Date(new Date(window.from).getTime() + 60 * 1000);

describe('membershipOutage', () => {
    describe('isWithinWindow', () => {
        const window = { from: '2026-07-17T02:00Z', to: '2026-07-17T04:00Z' };

        it('is inside the window between the two bounds', () => {
            expect(isWithinWindow(window, new Date('2026-07-17T03:00Z'))).toBe(true);
        });

        it('is outside the window before it opens and after it closes', () => {
            expect(isWithinWindow(window, new Date('2026-07-17T01:59Z'))).toBe(false);
            expect(isWithinWindow(window, new Date('2026-07-17T04:01Z'))).toBe(false);
        });

        // Both bounds are exclusive (isAfter && isBefore), so the instants themselves are outside.
        it('treats both bounds as outside the window', () => {
            expect(isWithinWindow(window, new Date('2026-07-17T02:00Z'))).toBe(false);
            expect(isWithinWindow(window, new Date('2026-07-17T04:00Z'))).toBe(false);
        });

        it('defaults to now', () => {
            expect(isWithinWindow({ from: '2000-01-01T00:00Z', to: '2100-01-01T00:00Z' })).toBe(true);
        });
    });

    describe('isFrozen', () => {
        it('closes membership entirely during the maintenance window', () => {
            expect(isFrozen(during(MAINTENANCE_WINDOW))).toBe(true);
        });

        it('leaves membership open outside it', () => {
            expect(isFrozen(new Date('2026-07-17T00:00Z'))).toBe(false);
        });

        // The window it is configured with has long passed, so nothing is frozen today.
        it('is not freezing anything as things stand', () => {
            expect(isFrozen()).toBe(false);
        });
    });

    describe('isPaymentGatewayOutage', () => {
        it('stops the types that reach the gateway while it is down', () => {
            PAYMENT_GATEWAY_TYPES.forEach(type =>
                expect(isPaymentGatewayOutage(type, during(PAYMENT_GATEWAY_OUTAGE))).toBe(true),
            );
        });

        it('lets every other type apply, because they never touch the gateway', () => {
            const unaffected = ALL_TYPES.filter(type => !PAYMENT_GATEWAY_TYPES.includes(type));

            expect(unaffected).not.toHaveLength(0);
            unaffected.forEach(type =>
                expect(isPaymentGatewayOutage(type, during(PAYMENT_GATEWAY_OUTAGE))).toBe(false),
            );
        });

        it('stops nobody outside the window', () => {
            expect(isPaymentGatewayOutage(MEMBERSHIP_TYPES.COMMUNITY, new Date('2026-07-17T00:00Z'))).toBe(false);
        });

        // The window it is configured with has long passed, so nobody is being turned away today.
        it('is not stopping anyone as things stand', () => {
            expect(isPaymentGatewayOutage(MEMBERSHIP_TYPES.COMMUNITY)).toBe(false);
        });
    });

    describe('formatOutageWindow', () => {
        it('renders the configured window as AEST times and a full date', () => {
            expect(formatOutageWindow(PAYMENT_GATEWAY_OUTAGE)).toBe('7:00am-1:00pm AEST Wednesday 25th November 2026');
        });

        // These cover the 'st'/'nd'/'rd'/'th' and the 11–13 special case.
        it.each([
            ['2026-11-01T00:00Z', '1st November 2026'],
            ['2026-11-02T00:00Z', '2nd November 2026'],
            ['2026-11-03T00:00Z', '3rd November 2026'],
            ['2026-11-04T00:00Z', '4th November 2026'],
            ['2026-11-11T00:00Z', '11th November 2026'],
            ['2026-11-12T00:00Z', '12th November 2026'],
            ['2026-11-13T00:00Z', '13th November 2026'],
            ['2026-11-21T00:00Z', '21st November 2026'],
        ])('applies the right ordinal suffix for %s', (from, expectedDate) => {
            expect(formatOutageWindow({ from, to: from })).toContain(expectedDate);
        });
    });
});
