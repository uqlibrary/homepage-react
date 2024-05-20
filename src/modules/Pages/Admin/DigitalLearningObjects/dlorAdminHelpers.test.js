import { dlorAdminLink, splitStringToArrayOnComma } from './dlorAdminHelpers';

describe('helpers', () => {
    it('splits keywords correctly', () => {
        expect(splitStringToArrayOnComma('abc, def, hij')).toEqual(['abc', 'def', 'hij']);
        expect(splitStringToArrayOnComma('abc, d"e"f, hij')).toEqual(['abc', 'd"e"f', 'hij']);
        expect(splitStringToArrayOnComma('abc, "def, def", "hij"')).toEqual(['abc', 'def, def', 'hij']);
        expect(splitStringToArrayOnComma('"abc, abc", def, "hij"')).toEqual(['abc, abc', 'def', 'hij']);
        expect(splitStringToArrayOnComma('abc')).toEqual(['abc']);
        expect(splitStringToArrayOnComma('abc,def,hij')).toEqual(['abc', 'def', 'hij']);
    });
    it('generates admin links correctly', () => {
        expect(dlorAdminLink('/add')).toEqual('http://localhost/admin/dlor/add');
    });
});
