import { StandardPage, getBackNavFunc } from './StandardPage';

jest.mock('react-router', () => ({
    useHistory: jest.fn(() => ({ go: jest.fn() })),
}));

function setup(testProps) {
    const props = { ...testProps };
    return getElement(StandardPage, props, true);
}

describe('StandardPage component', () => {
    it('renders with content', () => {
        const wrapper = setup({ children: 'test content' });
        expect(wrapper.find('[data-testid="StandardPage"]').text()).toBe('test content');
    });

    it('renders with title and back button', () => {
        history.back = jest.fn();
        const originalReferrer = document.referrer;
        Object.defineProperty(document, 'referrer', { value: 'Refferer Test', configurable: true });

        const testTitle = 'standard page title';
        const wrapper = setup({ title: testTitle });
        const titleContents = wrapper.find('[data-testid="StandardPage-title"]').children();
        expect(toJson(titleContents)[1]).toBe(testTitle);
        titleContents
            .find('[data-testid="StandardPage-goback-button"]')
            .props()
            .onClick();

        expect(history.back).toHaveBeenCalledTimes(1);
        Object.defineProperty(document, 'referrer', { value: originalReferrer });
    });

    it('renders with custom goBack function', () => {
        const testFn = jest.fn();

        const testTitle = 'standard page title';
        const wrapper = setup({ title: testTitle, goBackFunc: testFn });
        const titleContents = wrapper.find('[data-testid="StandardPage-title"]').children();
        expect(toJson(titleContents)[1]).toBe(testTitle);
        titleContents
            .find('[data-testid="StandardPage-goback-button"]')
            .props()
            .onClick();
        expect(testFn).toHaveBeenCalledTimes(1);
    });

    it('renders with help', () => {
        const helpAttributes = { title: 'test title', text: 'text content', buttonLabel: 'test button' };
        const wrapper = setup({
            help: helpAttributes,
        });
        const helpIcon = toJson(wrapper.find('Connect(HelpIcon)'));
        expect(helpIcon.props.buttonLabel).toBe(helpAttributes.buttonLabel);
        expect(helpIcon.props.text).toBe(helpAttributes.text);
        expect(helpIcon.props.title).toBe(helpAttributes.title);
    });
});

describe('getBackNavFunc helper', () => {
    it('calls history.goBack if available', () => {
        history.back = jest.fn();
        const originalReferrer = document.referrer;
        Object.defineProperty(document, 'referrer', { value: 'Refferer Test', configurable: true });

        const testFn = jest.fn();
        const reactRouterHistoryObj = {
            goBack: testFn,
        };
        getBackNavFunc(reactRouterHistoryObj)();
        expect(testFn).toHaveBeenCalledTimes(1);

        Object.defineProperty(document, 'referrer', { value: originalReferrer });
    });
});
