import { formatFileSize } from './dlorHelpers';

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
    });
});
