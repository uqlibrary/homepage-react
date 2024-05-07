import {
    formatFileSize,
    getDurationString,
    convertDurationStringToSeconds,
    convertFileSizeStringToKb,
} from './dlorHelpers';

describe('helpers', () => {
    it('returns correct file size units', () => {
        expect(formatFileSize(324)).toEqual('324 KB');
        expect(formatFileSize(4543)).toEqual('4.5 MB');
        expect(formatFileSize(54412)).toEqual('54.4 MB');
        expect(formatFileSize(324126)).toEqual('324.1 MB');
        expect(formatFileSize(6341267)).toEqual('6.3 GB');
        expect(formatFileSize(72412672)).toEqual('72.4 GB');
        expect(formatFileSize(324126728)).toEqual('324.1 GB');
        expect(formatFileSize(8141267281)).toEqual('8.1 TB');

        expect(convertFileSizeStringToKb('8.1 TB')).toEqual('8100000000');
        expect(convertFileSizeStringToKb('324.1 GB')).toEqual('324100000');
        expect(convertFileSizeStringToKb('72.4 GB')).toEqual('72400000');
        expect(convertFileSizeStringToKb('6.3 GB')).toEqual('6300000');
        expect(convertFileSizeStringToKb('324.1 MB')).toEqual('324100');
        expect(convertFileSizeStringToKb('54.4 MB')).toEqual('54400');
        expect(convertFileSizeStringToKb('4.5 MB')).toEqual('4500');
        expect(convertFileSizeStringToKb('324 KB')).toEqual('324');

        expect(convertFileSizeStringToKb('324.1 mb')).toEqual('324100');

        // expect(convertFileSizeStringToKb('invalid string')).toThrow(
        //     'convertFileSizeStringToKb:Invalid size string "invalid string"',
        // );
    });

    it('returns correct duration string', () => {
        expect(getDurationString(2864)).toEqual('47m 44s');
        expect(getDurationString(2864, 'MMM minutes and SSS seconds')).toEqual('47 minutes and 44 seconds');

        expect(convertDurationStringToSeconds('47m 44s')).toEqual(2864);
        expect(
            convertDurationStringToSeconds('47 minutes and 44 seconds', /(\d+)\s*minutes\s*and\s*(\d+)\s*seconds/),
        ).toEqual(2864);
    });
});
