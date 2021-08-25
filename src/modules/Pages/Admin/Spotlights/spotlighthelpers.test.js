import { getTimeSundayNextFormatted } from './spotlighthelpers';
const moment = require('moment');

describe('spotlight helpers', () => {
    it('correctly calculates next sunday', () => {
        expect(getTimeSundayNextFormatted(moment('08-15-2021'))).toEqual('2021-08-22T23:59'); // sunday
        expect(getTimeSundayNextFormatted(moment('08-16-2021'))).toEqual('2021-08-22T23:59'); // monday
        expect(getTimeSundayNextFormatted(moment('08-17-2021'))).toEqual('2021-08-22T23:59'); // tuesday
        expect(getTimeSundayNextFormatted(moment('08-18-2021'))).toEqual('2021-08-22T23:59'); // wednesday
        expect(getTimeSundayNextFormatted(moment('08-19-2021'))).toEqual('2021-08-22T23:59'); // thursday

        expect(getTimeSundayNextFormatted(moment('08-20-2021'))).toEqual('2021-08-29T23:59'); // friday
        expect(getTimeSundayNextFormatted(moment('08-21-2021'))).toEqual('2021-08-29T23:59'); // saturday
        expect(getTimeSundayNextFormatted(moment('08-22-2021'))).toEqual('2021-08-29T23:59'); // sunday
        expect(getTimeSundayNextFormatted(moment('08-23-2021'))).toEqual('2021-08-29T23:59'); // monday
        expect(getTimeSundayNextFormatted(moment('08-24-2021'))).toEqual('2021-08-29T23:59'); // tuesday
        expect(getTimeSundayNextFormatted(moment('08-25-2021'))).toEqual('2021-08-29T23:59'); // wednesday
        expect(getTimeSundayNextFormatted(moment('08-26-2021'))).toEqual('2021-08-29T23:59'); // thursday

        expect(getTimeSundayNextFormatted(moment('08-27-2021'))).toEqual('2021-09-05T23:59'); // friday
        expect(getTimeSundayNextFormatted(moment('08-28-2021'))).toEqual('2021-09-05T23:59'); // saturday
    });
});
