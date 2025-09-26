import {
    linkToDrupal,
    getCampusByCode,
    pluralise,
    isRepeatingString,
    leftJoin,
    stripHtml,
    unescapeString,
    isValidUrl,
} from './general';

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

    it('should unescape a string', () => {
        expect(unescapeString(null)).toEqual('');

        expect(unescapeString('1&amp;2')).toEqual('1 and 2');
    });

    it('should pluralise strings correctly', () => {
        expect(pluralise('record', 1)).toEqual('record');

        expect(pluralise('record', 2)).toEqual('records');
        expect(pluralise('record', 947)).toEqual('records');

        expect(pluralise('frog', 0)).toEqual('frogs');
        expect(pluralise('frog', 1)).toEqual('frog');
        expect(pluralise('frog', 4)).toEqual('frogs');
        expect(pluralise('body', 0, 'bodies')).toEqual('bodies');
        expect(pluralise('body', 1, 'bodies')).toEqual('body');
        expect(pluralise('body', 8, 'bodies')).toEqual('bodies');
    });

    it('shows the correct drupal domain name', () => {
        // actual usage
        expect(linkToDrupal('/research')).toEqual('https://dev-library-uq.pantheonsite.io/research'); // unit tests assume homepage-staging.library.uq.edu.au

        // test coverage usage - options not currrently used
        // expect(linkToDrupal('/visit', 'localhost')).toEqual('https://dev-library-uq.pantheonsite.io/visit');
        // expect(linkToDrupal('/about', 'homepage-development.library.uq.edu.au')).toEqual(
        //     'https://dev-library-uq.pantheonsite.io/about',
        // );

        expect(linkToDrupal('/about', 'homepage-staging.library.uq.edu.au')).toEqual(
            'https://dev-library-uq.pantheonsite.io/about',
        );
        expect(linkToDrupal('/support', 'somethingelse.library.uq.edu.au')).toEqual(
            'https://web.library.uq.edu.au/support',
        );
        expect(linkToDrupal('/study', 'www.library.uq.edu.au')).toEqual('https://web.library.uq.edu.au/study');
    });

    it('should validate urls', () => {
        expect(isValidUrl('http://example.com')).toEqual(true);
        expect(isValidUrl('https://example.com')).toEqual(true);
        expect(isValidUrl('https://example.com/image.jpg')).toEqual(true);
        expect(isValidUrl('https://uq.edu.au')).toBe(true);

        expect(isValidUrl('ftp://something.com')).toBe(false);
        expect(isValidUrl('https://')).toEqual(false);
        expect(isValidUrl('')).toEqual(false);
        expect(isValidUrl('x')).toBe(false);
        expect(isValidUrl(null)).toEqual(false);
        expect(isValidUrl('https://google')).toEqual(false); // not dot - probably exists, but we are treating it as invalid, because nobody uses them, but a typo would be easy
        expect(isValidUrl('https://s.h')).toEqual(false);
        expect(isValidUrl('blahblahblah')).toEqual(false);
        expect(isValidUrl('blah blah blah')).toEqual(false);
        expect(isValidUrl('https://x.c')).toBe(false); // too short
    });
});
