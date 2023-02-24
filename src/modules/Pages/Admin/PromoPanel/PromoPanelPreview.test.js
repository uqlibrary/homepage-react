import { PromoPanelPreview } from './PromoPanelPreview';
import React from 'react';
import { rtlRender, fireEvent } from '../../../../../utils/test-utils';

function setup(testProps = {}) {
    const props = {
        isPreviewOpen: true,
        previewName: 'test preview',
        previewTitle: 'Title Preview',
        previewContent: 'Content Preview',
        handlePreviewClose: jest.fn(),
    };

    return rtlRender(<PromoPanelPreview {...props} {...testProps} />);
}

describe('Component PromoPanel Preview', () => {
    it('should render correctly', () => {
        const wrapper = setup();

        expect(wrapper).toMatchSnapshot();
    });
    it('should handle close correctly', () => {
        const closeFn = jest.fn();
        const { getByTestId } = setup({ handlePreviewClose: closeFn });

        fireEvent.click(getByTestId('admin-promopanel-preview-button-cancel'));
        expect(closeFn).toHaveBeenCalledTimes(1);
    });
});
