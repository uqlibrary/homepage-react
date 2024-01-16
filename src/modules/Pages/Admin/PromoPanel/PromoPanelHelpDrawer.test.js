import { PromoPanelHelpDrawer } from './PromoPanelHelpDrawer';
import React from 'react';
import { rtlRender, fireEvent } from '../../../../../utils/test-utils';
import { default as locale } from 'modules/Pages/Admin/PromoPanel/promopanel.locale';

function setup(testProps = {}) {
    const props = {
        helpContent: locale.listPage.help,
        open: true,
        closeHelpLightbox: jest.fn(),
        ...testProps,
    };
    return rtlRender(<PromoPanelHelpDrawer {...props} {...testProps} />);
}

describe('Component Help Drawer', () => {
    it('should render correctly', () => {
        const wrapper = setup();
        expect(wrapper).toMatchSnapshot();
    });
    it('should close correctly', () => {
        const closeFn = jest.fn();
        const { getByTestId } = setup({ closeHelpLightbox: closeFn });
        fireEvent.click(getByTestId('promopanel-helpdrawer-close-button'));
        expect(closeFn).toHaveBeenCalledTimes(1);
    });
});
