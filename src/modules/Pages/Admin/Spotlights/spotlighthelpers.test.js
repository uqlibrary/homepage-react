import {
    getTimeEndOfDayFormatted,
    getTimeMondayComing,
    getTimeMondayMidnightNext,
    getTimeSundayNextFormatted,
} from './spotlighthelpers';
const moment = require('moment');

describe('spotlight helpers', () => {
    it('correctly calculates next sunday', () => {
        // these dates should be 6 days after the date produced by getTimeMondayMidnightNext
        expect(getTimeSundayNextFormatted(moment('08-15-2021'))).toEqual('2021-08-22T23:59'); // sunday

        expect(getTimeSundayNextFormatted(moment('08-16-2021'))).toEqual('2021-08-29T23:59'); // monday
        expect(getTimeSundayNextFormatted(moment('08-17-2021'))).toEqual('2021-08-29T23:59'); // tuesday
        expect(getTimeSundayNextFormatted(moment('08-18-2021'))).toEqual('2021-08-29T23:59'); // wednesday
        expect(getTimeSundayNextFormatted(moment('08-19-2021'))).toEqual('2021-08-29T23:59'); // thursday
        expect(getTimeSundayNextFormatted(moment('08-20-2021'))).toEqual('2021-08-29T23:59'); // friday
        expect(getTimeSundayNextFormatted(moment('08-21-2021'))).toEqual('2021-08-29T23:59'); // saturday
        expect(getTimeSundayNextFormatted(moment('08-22-2021'))).toEqual('2021-08-29T23:59'); // sunday

        expect(getTimeSundayNextFormatted(moment('08-23-2021'))).toEqual('2021-09-05T23:59'); // monday
        expect(getTimeSundayNextFormatted(moment('08-24-2021'))).toEqual('2021-09-05T23:59'); // tuesday
        expect(getTimeSundayNextFormatted(moment('08-25-2021'))).toEqual('2021-09-05T23:59'); // wednesday
        expect(getTimeSundayNextFormatted(moment('08-26-2021'))).toEqual('2021-09-05T23:59'); // thursday
        expect(getTimeSundayNextFormatted(moment('08-27-2021'))).toEqual('2021-09-05T23:59'); // friday
        expect(getTimeSundayNextFormatted(moment('08-28-2021'))).toEqual('2021-09-05T23:59'); // saturday
    });
    it('correctly calculates next monday', () => {
        expect(getTimeMondayComing(moment('08-15-2021')).format('YYYY-MM-DDTHH:mm')).toEqual('2021-08-16T09:00'); // sunday

        expect(getTimeMondayComing(moment('08-16-2021')).format('YYYY-MM-DDTHH:mm')).toEqual('2021-08-23T09:00'); // monday
        expect(getTimeMondayComing(moment('08-17-2021')).format('YYYY-MM-DDTHH:mm')).toEqual('2021-08-23T09:00'); // tuesday
        expect(getTimeMondayComing(moment('08-18-2021')).format('YYYY-MM-DDTHH:mm')).toEqual('2021-08-23T09:00'); // wednesday
        expect(getTimeMondayComing(moment('08-19-2021')).format('YYYY-MM-DDTHH:mm')).toEqual('2021-08-23T09:00'); // thursday
        expect(getTimeMondayComing(moment('08-20-2021')).format('YYYY-MM-DDTHH:mm')).toEqual('2021-08-23T09:00'); // friday
        expect(getTimeMondayComing(moment('08-21-2021')).format('YYYY-MM-DDTHH:mm')).toEqual('2021-08-23T09:00'); // saturday
        expect(getTimeMondayComing(moment('08-22-2021')).format('YYYY-MM-DDTHH:mm')).toEqual('2021-08-23T09:00'); // sunday

        expect(getTimeMondayComing(moment('08-23-2021')).format('YYYY-MM-DDTHH:mm')).toEqual('2021-08-30T09:00'); // monday
        expect(getTimeMondayComing(moment('08-24-2021')).format('YYYY-MM-DDTHH:mm')).toEqual('2021-08-30T09:00'); // tuesday
    });
    it('correctly calculates next monday midnight', () => {
        // these dates should be 6 days before the date produced by getTimeSundayNextFormatted
        expect(getTimeMondayMidnightNext(moment('08-15-2021'))).toEqual('2021-08-16T00:01'); // sunday

        expect(getTimeMondayMidnightNext(moment('08-16-2021'))).toEqual('2021-08-23T00:01'); // monday
        expect(getTimeMondayMidnightNext(moment('08-17-2021'))).toEqual('2021-08-23T00:01'); // tuesday
        expect(getTimeMondayMidnightNext(moment('08-18-2021'))).toEqual('2021-08-23T00:01'); // wednesday
        expect(getTimeMondayMidnightNext(moment('08-19-2021'))).toEqual('2021-08-23T00:01'); // thursday
        expect(getTimeMondayMidnightNext(moment('08-20-2021'))).toEqual('2021-08-23T00:01'); // friday
        expect(getTimeMondayMidnightNext(moment('08-21-2021'))).toEqual('2021-08-23T00:01'); // saturday
        expect(getTimeMondayMidnightNext(moment('08-22-2021'))).toEqual('2021-08-23T00:01'); // sunday

        expect(getTimeMondayMidnightNext(moment('08-23-2021'))).toEqual('2021-08-30T00:01'); // monday
        expect(getTimeMondayMidnightNext(moment('08-24-2021'))).toEqual('2021-08-30T00:01'); // tuesday
        expect(getTimeMondayMidnightNext(moment('08-25-2021'))).toEqual('2021-08-30T00:01'); // wednesday
        expect(getTimeMondayMidnightNext(moment('08-26-2021'))).toEqual('2021-08-30T00:01'); // thursday
        expect(getTimeMondayMidnightNext(moment('08-27-2021'))).toEqual('2021-08-30T00:01'); // friday
        expect(getTimeMondayMidnightNext(moment('08-28-2021'))).toEqual('2021-08-30T00:01'); // saturday
    });
    it('correctly calculates end of day', () => {
        expect(getTimeEndOfDayFormatted()).toEqual(moment().format('YYYY-MM-DDT23:59'));
    });
});
