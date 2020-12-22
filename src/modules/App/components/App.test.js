import { AppClass } from './App';
import App from './App';
import { accounts, currentAuthor } from 'mock/data';
import { routes, AUTH_URL_LOGIN, AUTH_URL_LOGOUT } from 'config';
import mui1theme from 'config';

function setup(testProps = {}) {
    const props = {
        ...testProps,
        classes: {},
        theme: { palette: { white: { main: '#FFFFFF' } } },
        account: testProps.account || null,
        author: testProps.author || null,
        accountLoading: testProps.accountLoading || false,
        accountAuthorLoading: testProps.accountAuthorLoading || false,
        actions: testProps.actions || {
            loadCurrentAccount: jest.fn(),
            searchAuthorPublications: jest.fn(),
            loadSpotlights: testProps.loadSpotlights || jest.fn(),
            loadAlerts: testProps.loadAlerts || jest.fn(),
            loadChatStatus: testProps.loadChatStatus || jest.fn(),
            loadLibHours: testProps.loadLibHours || jest.fn(),
            loadCompAvail: testProps.loadCompAvail || jest.fn(),
            loadTrainingEvents: testProps.loadTrainingEvents || jest.fn(),
            showAppAlert: testProps.showAppAlert || jest.fn(),
        },
        location: testProps.location || {},
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

    return getElement(AppClass, props);
}

beforeAll(() => {
    delete global.window.location;
    global.window.location = { href: jest.fn(), assign: jest.fn() };
});

describe('Application component', () => {
    let account;
    let author;
    const saveLocation = window.location;

    beforeEach(() => {
        account = {
            id: 'uqauthor1',
            class: ['libstaff', 'IS_CURRENT'],
        };
        author = {
            aut_id: 1,
            aut_org_username: 'uqauthor1',
            aut_orcid_id: 'abc-abc-abc',
        };
    });

    afterAll(() => {
        delete window.location;
        window.location = saveLocation;
    });

    // it('redirects user to login if not Authorized', () => {
    //     const wrapper = setup();
    //     const redirectUserToLogin = jest.spyOn(wrapper.instance(), 'redirectUserToLogin');
    //     wrapper.setProps({
    //         accountLoading: true,
    //         account: null,
    //         spotlightsLoading: true,
    //         spotlights: null,
    //         libHoursLoading: true,
    //         libHours: null,
    //         chatStatus: null,
    //         alerts: null,
    //         location: { pathname: '/rhdsubmission' },
    //     });
    //     expect(redirectUserToLogin).not.toHaveBeenCalled();
    //
    //     wrapper.setProps({
    //         accountLoading: false,
    //         account: null,
    //         spotlightsLoading: true,
    //         spotlights: null,
    //         libHoursLoading: true,
    //         libHours: null,
    //         chatStatus: null,
    //         alerts: null,
    //         location: { pathname: '/rhdsubmission' } });
    //     expect(redirectUserToLogin).toHaveBeenCalled();
    //     wrapper.update();
    //
    //     expect(toJson(wrapper)).toMatchSnapshot();
    // });

    // it('should show orcid alert for a student without an author account', () => {
    //     const wrapper = setup({
    //         account: account.s2222222,
    //         author: {
    //             ...currentAuthor.s2222222.data,
    //             aut_orcid_id: null,
    //         },
    //         location: { pathname: '/' },
    //     });
    //     expect(toJson(wrapper)).toMatchSnapshot();
    // });

    // it('should not show orcid alert for a student without an author account', () => {
    //     const wrapper = setup({
    //         account: account.s3333333,
    //         author: currentAuthor.s3333333.data,
    //         location: { pathname: '/' },
    //     });
    //     expect(toJson(wrapper)).toMatchSnapshot();
    // });

    it('should assign the correct ref to setSessionExpiredConfirmation', () => {
        const wrapper = setup();

        wrapper.instance().setSessionExpiredConfirmation('hello');
        expect(wrapper.instance().sessionExpiredConfirmationBox).toEqual('hello');
    });

    // If the system is behind Lambda@Edge scripts then public users will go straight through to public files.
    // A user will only get to the fez-frontend app for a file if they are not logged in and
    // the file is not public, or they are logged in and the the file requires higher privs e.g. needs admin,
    // but they are a student.
    // it('redirects user to login if going to a secure file url and not user logged in yet', () => {
    //     const wrapper = setup({});
    //     const redirectUserToLogin = jest.spyOn(wrapper.instance(), 'redirectUserToLogin');
    //     wrapper.setProps({
    //         accountLoading: true,
    //         account: null,
    //         spotlightsLoading: true,
    //         spotlights: null,
    //         libHoursLoading: true,
    //         libHours: null,
    //         chatStatus: null,
    //         alerts: null,
    //         location: { pathname: '/view/UQ:1/test.pdf' },
    //     });
    //     expect(redirectUserToLogin).not.toHaveBeenCalled();
    //
    //     wrapper.setProps({
    //         accountLoading: false,
    //         account: null,
    //         spotlightsLoading: true,
    //         spotlights: null,
    //         libHoursLoading: true,
    //         libHours: null,
    //         chatStatus: null,
    //         alerts: null,
    //         location: { pathname: '/view/UQ:1/test.pdf' },
    //     });
    //     expect(redirectUserToLogin).toHaveBeenCalled();
    //     wrapper.update();
    //
    //     expect(toJson(wrapper)).toMatchSnapshot();
    // });

    it('should assign the correct ref to setSessionExpiredConfirmation', () => {
        const wrapper = setup({});

        wrapper.instance().setSessionExpiredConfirmation('hello');
        expect(wrapper.instance().sessionExpiredConfirmationBox).toEqual('hello');
    });

    // it('should call componentWillUnmount', () => {
    //     const wrapper = setup();
    //     const componentWillUnmount = jest.spyOn(wrapper.instance(), 'componentWillUnmount');
    //     wrapper.unmount();
    //     expect(componentWillUnmount).toHaveBeenCalled();
    // });

    it('Should show confirmation when the session expires', () => {
        const testFn = jest.fn();
        const wrapper = setup({ isSessionExpired: false });
        wrapper.instance().sessionExpiredConfirmationBox = { showConfirmation: testFn };
        wrapper.update();
        expect(testFn).not.toHaveBeenCalled();
        wrapper.setProps({ isSessionExpired: true });
        expect(testFn).toHaveBeenCalled();
    });

    it('Should get the childContext correctly', () => {
        // current URL is set to testUrl which is set in package.json as http://fez-staging.library.uq.edu.au
        const wrapper = setup();
        expect(wrapper.instance().getChildContext()).toEqual({
            userCountry: 'AU',
        });
    });

    it('Should display mobile correctly', () => {
        // current URL is set to testUrl which is set in package.json as http://homepage-staging.library.uq.edu.au
        const wrapper = setup();
        wrapper.setState({ isMobile: true });
        wrapper.instance().getChildContext();
        wrapper.update();
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render for anon user', () => {
        const wrapper = setup({ location: { pathname: '/' } });
        wrapper.instance().theme = { palette: { white: { main: '#FFFFFF' } } };
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render loading screen while account is loading', () => {
        const wrapper = setup({ accountLoading: true });
        wrapper.instance().theme = { palette: { white: { main: '#FFFFFF' } } };
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render application with routing for the user and display loading screen while loading author', () => {
        const wrapper = setup({
            account: account,
            accountAuthorLoading: true,
        });
        wrapper.instance().theme = { palette: { white: { main: '#FFFFFF' } } };
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should redirect to login page', () => {
        window.location.assign = jest.fn();
        setup({})
            .instance()
            .redirectUserToLogin()();
        expect(window.location.assign).toBeCalledWith(expect.stringContaining(AUTH_URL_LOGIN));
    });

    it('should redirect to logout page', () => {
        window.location.assign = jest.fn();
        setup({
            account: account,
            author: author,
        })
            .instance()
            .redirectUserToLogin(true)();
        expect(window.location.assign).toBeCalledWith(expect.stringContaining(AUTH_URL_LOGOUT));
    });

    it('should start loading current user', () => {
        const testMethod = jest.fn();
        setup({
            actions: {
                loadCurrentAccount: testMethod,
                loadSpotlights: jest.fn(),
                loadAlerts: jest.fn(),
                loadChatStatus: jest.fn(),
                loadLibHours: jest.fn(),
                loadCompAvail: jest.fn(),
                loadTrainingEvents: jest.fn(),
            },
        });
        expect(testMethod).toHaveBeenCalledWith();
    });

    // it('should load the incomplete publications list when the account is loaded', () => {
    //     const testMethod = jest.fn();
    //     const wrapper = setup({
    //         account: { name: 'test1' },
    //         accountLoading: false,
    //         actions: {
    //             loadCurrentAccount: jest.fn(),
    //             searchAuthorPublications: testMethod,
    //         },
    //     });
    //     wrapper.update();
    //     wrapper.setProps({ account: { name: 'test2' } });
    //     expect(testMethod).toHaveBeenCalled();
    // });

    // it('should determine if it has incomplete works from props and hide menu item', () => {
    //     const wrapper = setup({
    //         account: { name: 'test1' },
    //         accountLoading: false,
    //         actions: {
    //             loadCurrentAccount: jest.fn(),
    //             searchAuthorPublications: jest.fn(),
    //         },
    //         incompleteRecordList: {
    //             incomplete: {
    //                 publicationsListPagingData: {
    //                     total: 10,
    //                 },
    //             },
    //         },
    //     });
    //     expect(toJson(wrapper)).toMatchSnapshot();
    // });

    // it('should determine if it has incomplete works from props and show menu item', () => {
    //     const wrapper = setup({
    //         account: { name: 'test1' },
    //         accountLoading: false,
    //         spotlightsLoading: true,
    //         spotlights: null,
    //         libHoursLoading: true,
    //         libHours: null,
    //         chatStatus: null,
    //         alerts: null,
    //         actions: {
    //             loadCurrentAccount: jest.fn(),
    //             searchAuthorPublications: jest.fn(),
    //         },
    //         incompleteRecordList: {
    //             incomplete: {
    //                 publicationsListPagingData: {
    //                     total: 10,
    //                 },
    //             },
    //         },
    //     });
    //     expect(toJson(wrapper)).toMatchSnapshot();
    // });
});

describe('Testing wrapped App component', () => {
    it('Mounts', () => {
        const wrappedProps = {
            history: {
                push: jest.fn(),
                go: jest.fn(),
                location: { pathname: '/' },
            },
            actions: {
                logout: jest.fn(),
                loadCurrentAccount: jest.fn(),
                loadSpotlights: jest.fn(),
                loadAlerts: jest.fn(),
                loadChatStatus: jest.fn(),
                loadLibHours: jest.fn(),
                loadCompAvail: jest.fn(),
                loadTrainingEvents: jest.fn(),
            },
            account: { name: 'Ky' },
            location: { pathname: '/' },
            classes: {},
            theme: {
                ...mui1theme,
                palette: {
                    primary: {
                        main: 'red',
                    },
                },
            },
        };
        const wrapper = getElement(App, wrappedProps, { isShallow: false });
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
