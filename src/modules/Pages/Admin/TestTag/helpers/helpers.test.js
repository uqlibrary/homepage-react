import { capitaliseLeadingChar, isEmptyStr, isEmptyObject, createLocationString, isInvalidUUID } from './helpers';
describe('helpers', () => {
    it('capitaliseLeadingChar operates correctly', () => {
        expect(capitaliseLeadingChar('test')).toEqual('Test');
        expect(capitaliseLeadingChar('Test')).toEqual('Test');
        expect(capitaliseLeadingChar('TesT')).toEqual('Test');
        expect(capitaliseLeadingChar('TEST')).toEqual('Test');
    });
    it('isEmptyStr operates correctly', () => {
        expect(isEmptyStr('test')).toEqual(false);
        expect(isEmptyStr('')).toEqual(true);
        expect(isEmptyStr(null)).toEqual(true);
        expect(isEmptyStr(undefined)).toEqual(true);
        expect(isEmptyStr([])).toEqual(true);
        expect(isEmptyStr({})).toEqual(true);
        expect(isEmptyStr(['a'])).toEqual(true);
        expect(isEmptyStr({ a: 'a' })).toEqual(true);
    });
    it('isEmptyObject operates correctly', () => {
        expect(isEmptyObject('test')).toEqual(true);
        expect(isEmptyObject('')).toEqual(true);
        expect(isEmptyObject(null)).toEqual(true);
        expect(isEmptyObject(undefined)).toEqual(true);
        expect(isEmptyObject([])).toEqual(true);
        expect(isEmptyObject({})).toEqual(true);
        expect(isEmptyObject(['a'])).toEqual(true);
        expect(isEmptyObject({ a: 'a' })).toEqual(false);
    });
    it('createLocationString operates correctly', () => {
        expect(createLocationString({ site: 'test1', building: 'test2', floor: 'test3', room: 'test4' })).toEqual(
            'test3-test4 test2, test1',
        );
    });
    it('isInvalidUUID operates correctly', () => {
        expect(isInvalidUUID('A')).toEqual(true);
        expect(isInvalidUUID('a')).toEqual(false);
        expect(isInvalidUUID('123456789012345678901')).toEqual(true);
    });
});
