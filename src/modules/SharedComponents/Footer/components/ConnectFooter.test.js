import { default as locale } from '../footerLocale';
import { default as menuLocale } from 'locale/menu';

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

import { ConnectFooter } from './ConnectFooter';

function setup(testProps = {}) {
    const props = {
        ...testProps,
        classes: {},
        history: testProps.history || { push: jest.fn() },
    };
    return getElement(ConnectFooter, props);
}

describe('Component Megamenu', () => {
    it('should render', () => {
        const wrapper = setup();
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('should have a valid footer locale', () => {
        // because the footer locale is meant to be maintained by the user, we check the file is valid
        expect(locale.connectFooter.buttonSocialHeader.length).not.toBe(0);
        locale.connectFooter.buttonSocial.forEach(menu => {
            expect(menu.dataTestid.length).not.toBe(0);
            expect(menu.linkTo.length).not.toBe(0);
            expect(menu.linkMouseOver.length).not.toBe(0);
            (!!menu.linklabel && expect(menu.linklabel.length).not.toBe(0)) ||
                (!!menu.icon && expect(menu.icon.length).not.toBe(0));
        });

        locale.connectFooter.internalLinks.forEach(menu => {
            expect(menu.dataTestid.length).not.toBe(0);
            expect(menu.linklabel.length).not.toBe(0);
            expect(menu.linkTo.length).not.toBe(0);
        });

        locale.connectFooter.givingLinks.forEach(menu => {
            expect(menu.dataTestid.length).not.toBe(0);
            expect(menu.label.length).not.toBe(0);
            expect(menu.linkTo.length).not.toBe(0);
        });
    });

    it('should have a valid menu locale', () => {
        // because the menu locale is meant to be maintained by the user, we check the file is valid
        expect(menuLocale.menuhome.dataTestid.length).not.toBe(0);
        expect(menuLocale.menuhome.linkTo.length).not.toBe(0);
        expect(menuLocale.menuhome.primaryText.length).not.toBe(0);

        menuLocale.publicmenu.forEach(menu => {
            expect(menu.dataTestid.length).not.toBe(0);
            expect(menu.linkTo.length).not.toBe(0);
            expect(menu.primaryText.length).not.toBe(0);
            expect(menu.primaryText.length).not.toBe(0);
        });
    });
});
