import { mutateKey, mutateObject, mutateClearObject, transformer } from './transformers';

describe('Tests transformer functions', () => {
    it('mutateKey mutates object key', () => {
        const original = {
            myKey: 'value',
            unchanged: 'key',
        };
        const expected = {
            myNewKey: 'value',
            unchanged: 'key',
        };
        mutateKey(original, 'myKey', 'myNewKey');
        expect(original).toEqual(expected);
    });
    it('mutateObject mutates object value', () => {
        const original = {
            inspection_status: 'PASS',
            unchanged: 'key',
        };
        const expected = {
            unchanged: 'key',
        };
        expect(mutateObject(original, 'inspection_status')).toEqual('PASS');
        expect(original).toEqual(expected);
    });
    it('mutateClearObject clears key', () => {
        const original = {
            inspection_status: 'PASS',
            unchanged: 'key',
        };
        const expected = {
            unchanged: 'key',
        };
        expect(mutateClearObject(original, 'inspection_status')).toEqual(undefined);
        expect(original).toEqual(expected);
    });
    it('transformer mutates object according to rules', () => {
        const original = {
            a: 'a-value',
            b: 'b-value',
            c: 'c-remove',
            d: 'd-value',
            e: 'e-newkey',
        };
        const expected = {
            with_a: {
                a: 'a-value',
                d: 'd-value',
            },
            b: 'b-value',
            c: undefined,
            f: 'e-newkey',
        };
        const rules = {
            a: ({ state, data }) => ({
                with_a: {
                    ...state.with_a,
                    a: mutateObject(data, 'a'),
                },
            }),
            c: ({ data }) => ({
                c: mutateClearObject(data, 'c'),
            }),
            d: ({ state, data }) => ({
                with_a: {
                    ...state.with_a,
                    d: mutateObject(data, 'd'),
                },
            }),
            e: ({ data }) => mutateKey(data, 'e', 'f'),
        };
        expect(transformer(original, rules)).toEqual(expected);
    });
});
