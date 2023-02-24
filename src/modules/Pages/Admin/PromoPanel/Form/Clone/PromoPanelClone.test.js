import React from 'react';
import PromoPanelClone from './PromoPanelClone';
import { renderWithRouter } from '../../../../../../../utils/test-utils';

function setup(testProps = {}) {
    const props = {
        actions: { loadPromoPanelUserList: jest.fn(), loadPromoPanelList: jest.fn() },
        promoPanelList: [],
        promoPanelListLoading: false,
        promoPanelUserTypesLoading: false,
        promoPanelUserTypeList: [],
        history: { push: jest.fn() },
        panelUpdated: false,
        queueLength: 0,
        promoPanelListError: null,
        promoPanelUserTypesError: null,
        promoPanelActionError: null,
    };
    return renderWithRouter(<PromoPanelClone {...props} {...testProps} />);
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
