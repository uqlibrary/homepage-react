import { MEMBERSHIP_TYPES } from './membershipFieldRules';

/**
 * Scheduled outages, during which the form stops accepting applications.
 *
 * Both windows below are in the past, so both of these currently return false and the form is fully open. They
 * are kept because this is how the Library takes the form down for maintenance — the window is edited when an
 * outage is scheduled, and edited back afterwards. The dates are the ones the form was last left with.
 *
 * The bounds are written as UTC instants so an outage starts and ends at the same moment for every applicant,
 * wherever they are.
 */

// Membership was frozen entirely for two hours on 15 June 2017.
export const MAINTENANCE_WINDOW = {
    from: '2017-06-15T02:00Z',
    to: '2017-06-15T04:00Z',
};

// The payment gateway was down from 07:00 to 13:00 AEST on 20 January 2025.
export const PAYMENT_GATEWAY_OUTAGE = {
    from: '2025-01-19T21:00Z',
    to: '2025-01-20T03:00Z',
};

/**
 * The types a payment gateway outage stops.
 *
 * Only community and alumnifriends actually reach the gateway, so listing alumni here is a wider net than it
 * needs to be. It is the wider net the form has always cast, and it errs towards turning applications away
 * during an outage rather than letting them fail at the gateway, so it stands.
 */
export const PAYMENT_GATEWAY_TYPES = [
    MEMBERSHIP_TYPES.ALUMNI,
    MEMBERSHIP_TYPES.ALUMNI_FRIENDS,
    MEMBERSHIP_TYPES.COMMUNITY,
];

/**
 * Whether an instant falls inside a window. Both bounds are exclusive.
 */
export const isWithinWindow = ({ from, to }, now = new Date()) => now > new Date(from) && now < new Date(to);

/**
 * Whether membership applications are frozen for maintenance. Applies to every type.
 */
export const isFrozen = (now = new Date()) => isWithinWindow(MAINTENANCE_WINDOW, now);

/**
 * Whether the payment gateway is unavailable for this type. The types that never pay are unaffected.
 */
export const isPaymentGatewayOutage = (type, now = new Date()) =>
    PAYMENT_GATEWAY_TYPES.includes(type) && isWithinWindow(PAYMENT_GATEWAY_OUTAGE, now);
