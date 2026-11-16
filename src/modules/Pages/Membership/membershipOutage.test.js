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
        // On the hour bounds drop their minutes: 07:00–15:00 AEST on 25 November 2026 reads as "7am to 3pm".
        it('renders the configured window as AEST times and a full date', () => {
            expect(formatOutageWindow(PAYMENT_GATEWAY_OUTAGE)).toBe('7am to 3pm (AEST) on Wednesday 25 November 2026');
        });

        // A window whose bounds are not on the hour keeps the minutes.
        it('keeps the minutes when a bound is not on the hour', () => {
            // 07:30 and 09:45 UTC are 17:30 and 19:45 AEST (Brisbane is UTC+10).
            expect(formatOutageWindow({ from: '2026-11-25T07:30Z', to: '2026-11-25T09:45Z' })).toBe(
                '5:30pm to 7:45pm (AEST) on Wednesday 25 November 2026',
            );
        });
    });
});
