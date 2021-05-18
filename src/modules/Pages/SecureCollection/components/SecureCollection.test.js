import { extractPathFromParams, getUrlSearchParams } from './SecureCollection';

describe('filterProps helper', () => {
    it('should handle a standard window.location being passed in', () => {
        console.log('classic: https://www.library.uq.edu.au/collection?collection=collection&file=doesntExist');
        const classicLocation = new URL(
            'https://www.library.uq.edu.au/collection?collection=collection&file=doesntExist',
        );

        const classicResult = getUrlSearchParams(classicLocation);
        console.log('classicResult.search = ', classicResult.search);
        // expect(classicResult.search).toBe('?collection=collection&file=doesntExist');

        expect(classicResult.has('collection')).toBe(true);
        expect(classicResult.get('collection')).toBe('collection');
        expect(classicResult.has('file')).toBe(true);
        expect(classicResult.get('file')).toBe('doesntExist');
    });

    it('should handle a search params with the search params supplied inside the hash', () => {
        const hashLocation = new URL(
            'https://www.library.uq.edu.au/branch/#/collection?collection=collection&file=doesntExist',
        );

        const hashResult = getUrlSearchParams(hashLocation);

        expect(hashResult.has('collection')).toBe(true);
        expect(hashResult.get('collection')).toBe('collection');
        expect(hashResult.has('file')).toBe(true);
        expect(hashResult.get('file')).toBe('doesntExist');
    });

    it('should handle the really-shouldnt-happen edge case where no params are passed in', () => {
        const result = extractPathFromParams('https://www.library.uq.edu.au/collection');

        expect(result).toBe('unknown/unknown');
    });
});
