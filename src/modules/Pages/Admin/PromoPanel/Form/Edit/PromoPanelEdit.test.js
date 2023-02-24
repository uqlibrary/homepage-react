import React from 'react';
import PromoPanelEdit from './PromoPanelEdit';
import { renderWithRouter } from '../../../../../../../utils/test-utils';
import * as actions from 'data/actions';

function setup(testProps = {}) {
    const props = {
        actions: actions,
        promoPanelList: [],
        promoPanelListLoading: false,
        promoPanelUserTypesLoading: false,
        promoPanelUserTypeList: [],
        promoPanelSaving: false,
        history: { push: jest.fn() },
        panelUpdated: false,
        queueLength: 0,
        promoPanelListError: null,
        promoPanelUserTypesError: null,
        promoPanelActionError: null,
    };
    return renderWithRouter(<PromoPanelEdit {...props} {...testProps} />);
}

describe('Promo Panel Edit Container', () => {
    it('Shows error if error occurs for promoPanelListError', () => {
        const { getByTestId } = setup({ promoPanelListError: 'Error' });
        expect(getByTestId('panel-error')).toBeInTheDocument();
    });
    it('Shows error if error occurs for promoPanelUserTypesError', () => {
        const { getByTestId } = setup({ promoPanelUserTypesError: 'Error' });
        expect(getByTestId('panel-error')).toBeInTheDocument();
    });
    it('Shows error if error occurs for promoPanelActionError', () => {
        const { getByTestId } = setup({ promoPanelActionError: 'Error' });
        expect(getByTestId('panel-error')).toBeInTheDocument();
    });
});
