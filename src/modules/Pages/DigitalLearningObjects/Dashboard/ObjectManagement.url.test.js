import { getUserPostfix } from '../../Admin/DigitalLearningObjects/dlorAdminHelpers';
import { buildObjectManagementUrl } from './ObjectManagement';

jest.mock('../../Admin/DigitalLearningObjects/dlorAdminHelpers', () => ({
    getUserPostfix: jest.fn(() => ''),
}));

describe('buildObjectManagementUrl', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    it('returns url with ?type= when no postfix and no query', () => {
        const url = buildObjectManagementUrl('foo');
        expect(url).toBe('/digital-learning-hub?type=foo');
    });

    it('returns url with postfix and ?type= when no query', () => {
        getUserPostfix.mockImplementation(() => '/bar');
        const url = buildObjectManagementUrl('baz');
        expect(url).toBe('/digital-learning-hub/bar?type=baz');
    });

    it('returns url with &type= if already has query', () => {
        getUserPostfix.mockImplementation(() => '?existing=1');
        const url = buildObjectManagementUrl('qux');
        expect(url).toBe('/digital-learning-hub?existing=1&type=qux');
    });
});
