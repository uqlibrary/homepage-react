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

import { Megamenu } from './Megamenu';

const defaultMenuItems = [
    {
        linkTo: '/',
        primaryText: 'Primary text 0',
        secondaryText: 'secondary text 0',
    },
    {
        linkTo: '/xyz',
        primaryText: 'Primary text 1',
        secondaryText: 'secondary text 1',
    },
];

const defaultLocale = {
    skipNavTitle: 'Skip navigation',
    skipNavAriaLabel: 'Skip navigation',
    closeMenuLabel: 'Close menu',
};

function setup(testProps = {}) {
    const props = {
        ...testProps,
        classes: {},
        logoText: 'test',
        logoImage: 'test',
        logoLink: 'test',
        menuItems: testProps.menuItems || defaultMenuItems,
        toggleMenu: testProps.toggleMenu || jest.fn(),
        history: testProps.history || { push: jest.fn() },
        locale: testProps.locale || defaultLocale,
        menuOpen: testProps.menuOpen || false,
        docked: testProps.docked || false,
    };
    return getElement(Megamenu, props);
}

describe('Component Megamenu', () => {
    it('should render empty drawer', () => {
        const wrapper = setup();
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('should render opened drawer with menus', () => {
        const wrapper = setup({ menuOpen: true });
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    it('should display mobile correctly', () => {
        const wrapper = setup({ menuOpen: true, isMobile: true });
        const tree = toJson(wrapper);
        expect(tree).toMatchSnapshot();
    });

    // it('should have working method for navigating to links', () => {
    // });
    //
    // it('should have working method for skipping menu items', () => {
    // });
    //
    // it('should have working method for focusing on given element ID', () => {
    // });
});
