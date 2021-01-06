import { getCampusByCode, isRepeatingString, leftJoin, stripHtml, unescapeString } from './general';
import { getUserServices } from './access';
import { accounts } from '../mock/data';

describe('general helpers', () => {
    it('leftJoin', () => {
        const objArrA = [
            { nameA: 'test1', testA: 'testA1' },
            { nameA: 'test2', testA: 'testA2' },
            { nameA: 'test3', testA: 'testA3' },
        ];
        const objArrB = [
            { nameB: 'test1', testB: 'testB1' },
            { nameB: 'test2', testB: 'testB2' },
            { nameB: 'test3', testB: 'testB3' },
        ];
        const actual = leftJoin(objArrA, objArrB, 'nameA', 'nameB');
        const expected = [
            { nameA: 'test1', testA: 'testA1', nameB: 'test1', testB: 'testB1' },
            { nameA: 'test2', testA: 'testA2', nameB: 'test2', testB: 'testB2' },
            { nameA: 'test3', testA: 'testA3', nameB: 'test3', testB: 'testB3' },
        ];
        expect(actual).toEqual(expected);
        expect(leftJoin(objArrA)).toBe(objArrA);
    });

    it('should strip HTML from a string containing HTML', () => {
        expect(stripHtml('hello<br/> there')).toEqual('hello there');
    });

    it('should get the campus name correctly', () => {
        expect(getCampusByCode('STLUC')).toEqual('St Lucia');
    });

    it('should get a missing campus name correctly', () => {
        expect(getCampusByCode('XXXXXX')).toEqual(null);
    });

    it('should detect long repeating strings (book-on-keyboard problem)', () => {
        expect(isRepeatingString('PHIL1001')).toBe(false);
        expect(isRepeatingString('XXXX3333B')).toBe(false); // the maximum possible repeat on a valid course code
        expect(isRepeatingString('the quick brown dog jumped over the lazy dog')).toBe(false);

        // the classic example of a book on the keyboard:
        expect(isRepeatingString('``````````````````````````````````````````````````')).toBe(true);

        expect(isRepeatingString('sss')).toBe(false);
        expect(isRepeatingString('ssss')).toBe(false);
        expect(isRepeatingString('sssss')).toBe(true);
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

    it('should unescape a string', () => {
        expect(unescapeString(null)).toEqual('');

        expect(unescapeString('1&amp;2')).toEqual('1 and 2');
    });
});
