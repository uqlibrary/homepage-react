import { StandardPage } from './StandardPage';

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

    it('renders title', () => {
        const testTitle = 'standard page title';
        const wrapper = setup({ title: testTitle });
        const titleContents = wrapper.find('[data-testid="StandardPage-title"]').children();
        expect(toJson(titleContents)).toBe(testTitle);
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
