import { dlorAdminLink, getUserPostfix, isValidEmail, splitStringToArrayOnComma } from './dlorAdminHelpers';

describe('helpers', () => {
    it('splits keywords correctly', () => {
        expect(splitStringToArrayOnComma('abc, def, hij')).toEqual(['abc', 'def', 'hij']);
        expect(splitStringToArrayOnComma('abc, d"e"f, hij')).toEqual(['abc', 'd"e"f', 'hij']);
        expect(splitStringToArrayOnComma('abc, "def, def", "hij"')).toEqual(['abc', 'def, def', 'hij']);
        expect(splitStringToArrayOnComma('"abc, abc", def, "hij"')).toEqual(['abc, abc', 'def', 'hij']);
        expect(splitStringToArrayOnComma('abc')).toEqual(['abc']);
        expect(splitStringToArrayOnComma('abc,def,hij')).toEqual(['abc', 'def', 'hij']);
        expect(splitStringToArrayOnComma('')).toEqual('');
    });
    it('generates admin links correctly', () => {
        const account = { id: 'dloradmn', groups: ['lib_dlor_admins']};
        expect(dlorAdminLink('/add', account)).toEqual('http://localhost/admin/dlor/add');
        expect(dlorAdminLink(undefined, account)).toEqual('http://localhost/admin/dlor');
    });
    it('generates validates emails correctly', () => {
        expect(isValidEmail('blah')).toEqual(false); // simple
        expect(isValidEmail('lea@example.com')).toEqual(true); // simple
        expect(isValidEmail('lea+1@example.com')).toEqual(true); // various valid usernames
        expect(isValidEmail('lea.1@example.com')).toEqual(true);
        expect(isValidEmail('lea%1@example.com')).toEqual(true);
        expect(isValidEmail('lea-1@example.com')).toEqual(true);
        expect(isValidEmail('lea@degroot.id.au')).toEqual(true); // cctld
        expect(isValidEmail('lea@example1.com')).toEqual(true); // number in domain
    });
    it('generates a user post string correctly', () => {
        // this is just for coverage
        expect(getUserPostfix()).toEqual('');
    });
});
