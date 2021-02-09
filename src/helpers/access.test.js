import { getUserServices, isHdrStudent } from './access';
import { accounts } from '../mock/data';

describe('access', () => {
    it('should get the correct services when the account is missing', () => {
        expect(getUserServices({})).toEqual([]);
    });

    it('should know if an account is for a HDR student', () => {
        expect(isHdrStudent(accounts.s1111111)).toEqual(true);
        expect(isHdrStudent(accounts.uqstaff)).toEqual(false);
    });

    it('should show the correct services to the correct groups', () => {
        // happy path
        expect(getUserServices(accounts.s1111111).length).toEqual(3);

        // coverage: various parameters invalid
        expect(getUserServices(accounts.s1111111, {})).toEqual([]);

        expect(
            getUserServices(accounts.s1111111, {
                LibraryServices: 'x',
            }),
        ).toEqual([]);

        expect(
            getUserServices({
                id: 'dummy',
                user_group: 'unknown',
            }),
        ).toEqual([]);

        expect(
            getUserServices({
                user_group: 'unknown',
            }),
        ).toEqual([]);

        expect(
            getUserServices(accounts.s1111111, {
                LibraryServices: {
                    links: [
                        {
                            // missing id
                            title: 'Title',
                            url: 'https://blah',
                        },
                    ],
                },
            }),
        ).toEqual([]);
    });
});
