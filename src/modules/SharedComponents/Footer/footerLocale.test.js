import { default as locale } from './footer.locale';
import { isAString, isAValidLink } from 'modules/testhelpers';
import { default as menuLocale } from 'locale/menu';

describe('footerLocale', () => {
    // it('should have a valid minimal footer locale', () => {
    //     // because the menu locale is meant to be maintained by the user, we check the file is valid
    //     checkLocaleBlock(locale.minimalFooter.reconciliation.link);
    //     isAString(locale.minimalFooter.reconciliation.statement);
    //
    //     locale.minimalFooter.leftColumn.line1.forEach(item => {
    //         checkLocaleBlock(item);
    //     });
    //     locale.minimalFooter.leftColumn.line2.forEach(item => {
    //         checkLocaleBlock(item);
    //     });
    //     locale.minimalFooter.leftColumn.line3.forEach(item => {
    //         checkLocaleBlock(item);
    //     });
    //
    //     locale.minimalFooter.rightColumn.line1.forEach(item => {
    //         checkLocaleBlock(item);
    //     });
    //     locale.minimalFooter.rightColumn.line2.forEach(item => {
    //         checkLocaleBlock(item);
    //     });
    //
    //     locale.minimalFooter.bottomBlock.line1.forEach(item => {
    //         checkLocaleBlock(item);
    //     });
    // });

    it('should have a valid connect footer locale', () => {
        // because the footer locale is meant to be maintained by the user, we check the file is valid
        expect(locale.connectFooter.buttonSocialHeader.length).not.toBe(0);
        locale.connectFooter.buttonSocial.forEach(menu => {
            isAString(menu.dataTestid);
            isAValidLink(menu.linkTo);
            isAString(menu.linkMouseOver);
            expect(menu.icon.length).not.toBe(0);
        });

        locale.connectFooter.internalLinks.forEach(menu => {
            isAString(menu.dataTestid);
            isAString(menu.linklabel);
            isAValidLink(menu.linkTo);
        });

        locale.connectFooter.givingLinks.forEach(menu => {
            isAString(menu.dataTestid);
            isAString(menu.label);
            isAValidLink(menu.linkTo);
        });
    });

    it('should have a valid menu locale', () => {
        // because the menu locale is meant to be maintained by the user, we check the file is valid
        isAString(menuLocale.menuhome.dataTestid);
        isAValidLink(menuLocale.menuhome.linkTo);
        isAString(menuLocale.menuhome.primaryText);

        menuLocale.publicmenu.forEach(menu => {
            isAString(menu.dataTestid);
            isAValidLink(menu.linkTo);
            isAString(menu.primaryText);
            !menu.secondaryText || isAString(menu.secondaryText);
        });
    });
});
