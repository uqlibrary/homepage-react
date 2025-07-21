import { default as locale } from './learningResources.locale';
import { isAString, isAValidLink, isPositiveInteger } from 'modules/testhelpers';

describe('learningResourcesLocale', () => {
    it('should have a valid locale', () => {
        // because the locale is meant to be maintained by the user, we check the file is valid
        isAString(locale.title);
        expect(typeof locale.search).toEqual('object');
        isAString(locale.search.title);

        isPositiveInteger(locale.notesTrimLength);
    });
});
