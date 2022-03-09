import App from './App';

function setup(testProps = {}, args = { isShallow: false }) {
    const props = {
        ...testProps,
        account: testProps.account || null,
        accountLoading: testProps.accountLoading || false,
        actions: testProps.actions || {
            loadCurrentAccount: jest.fn(),
            searchAuthorPublications: jest.fn(),
            loadChatStatus: testProps.loadChatStatus || jest.fn(),
            showAppAlert: testProps.showAppAlert || jest.fn(),
        },
        history: testProps.history || { location: {} },
    };

    window.matchMedia =
        window.matchMedia ||
        function matchMedia() {
            return {
                matches: false,
                addListener: function addListener() {},
                removeListener: function removeListener() {},
            };
        };

    return getElement(App, props, args);
}

beforeAll(() => {
    delete global.window.location;
    global.window.location = { href: jest.fn(), assign: jest.fn() };
});

describe('Application component', () => {
    const saveLocation = window.location;

    afterAll(() => {
        delete window.location;
        window.location = saveLocation;
    });

    // it('should render for anon user', () => {
    //     const wrapper = setup({ location: { pathname: '/' } });
    //     expect(toJson(wrapper)).toMatchSnapshot();
    // });

    // it('should render loading screen while account is loading', () => {
    //     const wrapper = setup({ accountLoading: true });
    //     expect(toJson(wrapper)).toMatchSnapshot();
    // });

    it('should start loading current user', () => {
        const testMethod = jest.fn();
        setup({
            actions: {
                loadCurrentAccount: testMethod,
                loadChatStatus: jest.fn(),
            },
        });
        expect(testMethod).toHaveBeenCalledWith();
    });
});
