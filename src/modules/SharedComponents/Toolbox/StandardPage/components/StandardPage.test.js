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
});
