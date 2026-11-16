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

// The payment gateway was down from 07:00 to 15:00 AEST on 25 November 2026.
export const PAYMENT_GATEWAY_OUTAGE = {
    from: '2026-11-24T21:00Z',
    to: '2026-11-25T05:00Z',
};

/**
 * The types a payment gateway outage stops.
 */
export const PAYMENT_GATEWAY_TYPES = [MEMBERSHIP_TYPES.ALUMNI_FRIENDS, MEMBERSHIP_TYPES.COMMUNITY];

/**
 * A test only override of the outage windows, keyed as { MAINTENANCE_WINDOW, PAYMENT_GATEWAY_OUTAGE }.
 */
const outageOverride = () => (process.env.USE_MOCK && window.__MEMBERSHIP_OUTAGE_OVERRIDE__) || {};
const maintenanceWindow = () => outageOverride().MAINTENANCE_WINDOW ?? MAINTENANCE_WINDOW;
const paymentGatewayOutage = () => outageOverride().PAYMENT_GATEWAY_OUTAGE ?? PAYMENT_GATEWAY_OUTAGE;

/**
 * Whether an instant falls inside a window. Both bounds are exclusive.
 */
export const isWithinWindow = ({ from, to }, now = new Date()) => now > new Date(from) && now < new Date(to);

/**
 * Whether membership applications are frozen for maintenance. Applies to every type.
 */
export const isFrozen = (now = new Date()) => isWithinWindow(maintenanceWindow(), now);

/**
 * Whether the payment gateway is unavailable for this type. The types that never pay are unaffected.
 */
export const isPaymentGatewayOutage = (type, now = new Date()) =>
    PAYMENT_GATEWAY_TYPES.includes(type) && isWithinWindow(paymentGatewayOutage(), now);

// AEST, so the quoted times are stable year round.
const BRISBANE_TZ = 'Australia/Brisbane';

const partsOf = (date, options) =>
    new Intl.DateTimeFormat('en-AU', { timeZone: BRISBANE_TZ, ...options })
        .formatToParts(date)
        .reduce((acc, { type, value }) => ({ ...acc, [type]: value }), {});

const formatAestTime = date => {
    const { hour, minute, dayPeriod } = partsOf(date, { hour: 'numeric', minute: '2-digit', hour12: true });
    // Drop the minutes for an on-the-hour time: "7am", not "7:00am".
    const time = minute === '00' ? hour : `${hour}:${minute}`;
    return `${time}${dayPeriod.toLowerCase().replace(/\s/g, '')}`;
};

const formatAestDate = date => {
    const { weekday, day, month, year } = partsOf(date, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
    return `${weekday} ${day} ${month} ${year}`;
};

/**
 * A window as the human-readable AEST text the outage message quotes, e.g.
 * "7am to 3pm (AEST) on Wednesday 25 November 2026". Derived from the window so the message tracks the
 * configured dates. membership.locale.js never needs editing when an outage is rescheduled.
 */
export const formatOutageWindow = ({ from, to }) =>
    `${formatAestTime(new Date(from))} to ${formatAestTime(new Date(to))} (AEST) on ${formatAestDate(new Date(from))}`;
