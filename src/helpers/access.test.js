import { getUserServices } from './access';

describe('access', () => {
    it('should get the correct services when the account is missing', () => {
        expect(getUserServices({})).toEqual([]);
    });
});
