import React from 'react';
import PromoPanelAdd from './PromoPanelAdd';
import { rtlRender } from '../../../../../../../utils/test-utils';
import * as actions from 'data/actions';

function setup(testProps = {}) {
    const props = {
        actions: actions,
        promoPanelList: [],
        promoPanelListLoading: false,
        promoPanelUserTypesLoading: false,
        promoPanelUserTypeList: [],
        promoPanelSaving: false,
        panelUpdated: false,
        queueLength: 0,
        promoPanelListError: null,
        promoPanelUserTypesError: null,
        promoPanelActionError: null,
    };
    return rtlRender(<PromoPanelAdd {...props} {...testProps} />);
}

describe('Promo Panel Add Container', () => {
    it('Shows error if error occurs for promoPanelListError', () => {
        const { getByTestId } = setup({ promoPanelListError: 'Error' });
        expect(getByTestId('Promopanel-Error')).toBeInTheDocument();
    });
    it('Shows error if error occurs for promoPanelUserTypesError', () => {
        const { getByTestId } = setup({ promoPanelUserTypesError: 'Error' });
        expect(getByTestId('Promopanel-Error')).toBeInTheDocument();
    });
});
