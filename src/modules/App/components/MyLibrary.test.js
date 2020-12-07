import { myLibraryLocale as locale } from './MyLibrary.locale';
import { isAString, isAValidLink } from 'modules/testhelpers';

describe('MylibraryLocale', () => {
    it('should have a valid locale', () => {
        isAString(locale.title);

        locale.items.map(item => {
            expect(typeof item).toEqual('object');
            isAString(item.dataTestid);
            isAString(item.label);
            item.link.startsWith('/') || isAValidLink(item.link);
        });
    });
});
