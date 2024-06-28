import {
    convertFileSizeToKb,
    convertSnakeCaseToKebabCase,
    getDlorViewPageUrl,
    getDurationString,
    getFileSizeString,
    getMinutesFromTotalSeconds,
    getTotalSecondsFromMinutesAndSecond,
    getSecondsFromTotalSeconds,
    getYoutubeUrlForPreviewEmbed,
    isPreviewableUrl,
    isValidNumber,
    isValidUrl,
    pluraliseWord,
    toTitleCase,
} from './dlorHelpers';

describe('helpers', () => {
    it('returns correct file size units', () => {
        expect(getFileSizeString(0)).toEqual('');
        expect(getFileSizeString(324)).toEqual('324 KB');
        expect(getFileSizeString(4543)).toEqual('4.5 MB');
        expect(getFileSizeString(54412)).toEqual('54.4 MB');
        expect(getFileSizeString(324126)).toEqual('324.1 MB');
        expect(getFileSizeString(6341267)).toEqual('6.3 GB');
        expect(getFileSizeString(72412672)).toEqual('72.4 GB');
        expect(getFileSizeString(324126728)).toEqual('324.1 GB');
        expect(getFileSizeString(8141267281)).toEqual('8.1 TB');

        expect(getFileSizeString(0)).toEqual('');
        expect(getFileSizeString(324)).toEqual('324 KB');
        expect(getFileSizeString(4543)).toEqual('4.5 MB');
        expect(getFileSizeString(54412)).toEqual('54.4 MB');
        expect(getFileSizeString(324126)).toEqual('324.1 MB');
        expect(getFileSizeString(6341267)).toEqual('6.3 GB');
        expect(getFileSizeString(72412672)).toEqual('72.4 GB');
        expect(getFileSizeString(324126728)).toEqual('324.1 GB');
        expect(getFileSizeString(8141267281)).toEqual('8.1 TB');

        expect(getFileSizeString(0, 'unit')).toEqual('KB');
        expect(getFileSizeString(324, 'unit')).toEqual('KB');

        expect(getFileSizeString(0, 'amount')).toEqual(0);
        expect(getFileSizeString(4543, 'amount')).toEqual('4.5');
    });

    it('returns correct duration string', () => {
        expect(getDurationString(0)).toEqual('');
        expect(getDurationString(2864)).toEqual('47m 44s');
        expect(getDurationString(2864, 'MMM minutes and SSS seconds')).toEqual('47 minutes and 44 seconds');

        // expect(convertDurationStringToSeconds('47m 44s')).toEqual(2864);
        // expect(
        //     convertDurationStringToSeconds('47 minutes and 44 seconds', /(\d+)\s*minutes\s*and\s*(\d+)\s*seconds/),
        // ).toEqual(2864);
    });

    it('changes to titlecase correctly', () => {
        expect(toTitleCase('AAA')).toEqual('Aaa');
        expect(toTitleCase('aaa')).toEqual('Aaa');
        expect(toTitleCase('aAa')).toEqual('Aaa');
        expect(toTitleCase('aaa BBB BBB')).toEqual('Aaa bbb bbb');
    });

    it('converts valid units', () => {
        expect(convertFileSizeToKb(4, 'TB')).toEqual('4000000000');
        expect(convertFileSizeToKb(5, 'GB')).toEqual('5000000');
        expect(convertFileSizeToKb(34, 'MB')).toEqual('34000');
        expect(convertFileSizeToKb(654, 'KB')).toEqual('654');
    });

    it('gets minutes from total seconds', () => {
        expect(getMinutesFromTotalSeconds(0)).toEqual(0); // { minutes: 0, seconds: 0 });

        expect(getMinutesFromTotalSeconds(10)).toEqual(0); // { minutes: 0, seconds: 10 });
        expect(getMinutesFromTotalSeconds(60)).toEqual(1);
        expect(getMinutesFromTotalSeconds(340)).toEqual(5);
    });

    it('gets seconds from total seconds', () => {
        expect(getSecondsFromTotalSeconds(0)).toEqual(0); // { minutes: 0, seconds: 0 });

        expect(getSecondsFromTotalSeconds(10)).toEqual(10);
        expect(getSecondsFromTotalSeconds(60)).toEqual(0);
        expect(getSecondsFromTotalSeconds(340)).toEqual(40);
    });

    it('gets total seconds from minutes and seconds', () => {
        expect(getTotalSecondsFromMinutesAndSecond(0, 0)).toEqual(0);
        expect(getTotalSecondsFromMinutesAndSecond(0, 10)).toEqual(10);
        expect(getTotalSecondsFromMinutesAndSecond(1, 0)).toEqual(60);
        expect(getTotalSecondsFromMinutesAndSecond(5, 40)).toEqual(340);
    });

    it('gets correct youtube url', () => {
        expect(getYoutubeUrlForPreviewEmbed('not a url')).toEqual(false);
        expect(getYoutubeUrlForPreviewEmbed('ftp://something')).toEqual(false);
        expect(getYoutubeUrlForPreviewEmbed('http://notyoutubedomain.com')).toEqual(false);
        expect(getYoutubeUrlForPreviewEmbed('https://www.youtube.com/123')).toEqual(false); // to short to be a valid id
        expect(getYoutubeUrlForPreviewEmbed('https://www.youtube.com/jwKH6X3cGMg')).toEqual(
            'https://www.youtube.com/?v=jwKH6X3cGMg',
        );
        expect(getYoutubeUrlForPreviewEmbed('https://www.youtube.com/watch?v=jwKH6X3cGMg&something=else')).toEqual(
            'https://www.youtube.com/?v=jwKH6X3cGMg',
        );

        expect(isPreviewableUrl('https://www.youtube.com/jwKH6X3cGMg')).toEqual(true);
        expect(isPreviewableUrl('http://notyoutubedomain.com')).toEqual(false);
    });

    it('checks numbers', () => {
        expect(isValidNumber(0, true)).toEqual(true);
        expect(isValidNumber(0, false)).toEqual(false);
        expect(isValidNumber(0)).toEqual(false); // use default value of false for coverage
        expect(isValidNumber(99, true)).toEqual(true);
        expect(isValidNumber(99, false)).toEqual(true);
        expect(isValidNumber('A', true)).toEqual(false);
        expect(isValidNumber('A', false)).toEqual(false);
    });

    it('generates view urls', () => {
        expect(getDlorViewPageUrl('xyz')).toEqual('http://localhost/digital-learning-hub/view/xyz');
    });

    it('forms the plural of words correctly', () => {
        expect(pluraliseWord('frog', 0)).toEqual('frog');
        expect(pluraliseWord('frog', 1)).toEqual('frog');
        expect(pluraliseWord('frog', 4)).toEqual('frogs');
        expect(pluraliseWord('body', 0, 'bodies')).toEqual('body');
        expect(pluraliseWord('body', 1, 'bodies')).toEqual('body');
        expect(pluraliseWord('body', 8, 'bodies')).toEqual('bodies');
    });

    it('should correctly validate an url', () => {
        expect(isValidUrl('x')).toBe(false);
        expect(isValidUrl('ftp://x.com')).toBe(false);
        expect(isValidUrl('https://x.c')).toBe(false);
        expect(isValidUrl('http://apple')).toBe(false);
        expect(isValidUrl('https://uq.edu.au')).toBe(true);
    });

    it('should correctly change snake case to kebab case', () => {
        expect(convertSnakeCaseToKebabCase('abc123')).toBe('abc123');
        expect(convertSnakeCaseToKebabCase('object_series_order-98s0_dy5k3_98h4')).toBe(
            'object-series-order-98s0-dy5k3-98h4',
        );
        expect(convertSnakeCaseToKebabCase('object-series-order-98s0-dy5k3-98h4')).toBe(
            'object-series-order-98s0-dy5k3-98h4',
        );
    });
});
