import { getDataFieldParams } from './utils';

describe('getDataFieldParams', () => {
    it('returns expected results when valid', () => {
        const data = { field1: 'test', testKey: 'test value', field2: 'test' };
        expect(getDataFieldParams(data, { valueKey: 'testKey' })).toEqual({
            dataFieldName: 'testKey',
            dataFieldValue: 'test value',
        });
    });
    it('returns expected results when invalid', () => {
        const data = { field1: 'test', testKey: 'test value', field2: 'test' };
        expect(getDataFieldParams(data, {})).toEqual({
            dataFieldName: null,
            dataFieldValue: null,
        });
    });
});
