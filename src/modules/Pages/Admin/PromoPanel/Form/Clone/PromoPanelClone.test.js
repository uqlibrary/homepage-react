import React from 'react';
import PromoPanelClone from './PromoPanelClone';
import { WithRouter, rtlRender } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        actions: { loadPromoPanelUserList: jest.fn(), loadPromoPanelList: jest.fn() },
        promoPanelList: [],
        promoPanelListLoading: false,
        promoPanelUserTypesLoading: false,
        promoPanelUserTypeList: [],
        panelUpdated: false,
        queueLength: 0,
        promoPanelListError: null,
        promoPanelUserTypesError: null,
        promoPanelActionError: null,
    };
    return rtlRender(
        <WithRouter>
            <PromoPanelClone {...props} {...testProps} />
        </WithRouter>,
    );
}
describe('Promo Panel Clone', () => {
    it('shows an error if one exists', () => {
        jest.mock('react-router-dom', () => ({
            useParams: jest.fn().mockReturnValue({ promopanelid: '123' }),
        }));
        const { getByTestId } = setup({ promoPanelUserTypesError: 'Error' });
        expect(getByTestId('promo-panel-error')).toBeInTheDocument();
    });
});
