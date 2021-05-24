import { StandardPage } from './StandardPage';

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
        const testTitle = 'standard page title';
        const wrapper = setup({ title: testTitle });
        expect(toJson(wrapper.find('[data-testid="StandardPage-title"]').children())[1]).toBe(testTitle);
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
