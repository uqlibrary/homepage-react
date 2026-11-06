import React from 'react';
import { getFileSizeString } from '../../../../DigitalLearningObjects/dlorHelpers';
import List from './List';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('../../../../DigitalLearningObjects/dlorHelpers', () => ({
    getFileSizeString: jest.fn(),
}));

const onClear = jest.fn();
const setup = (testProps = {}) => {
    const props = {
        onClear,
        file: { name: 'image.png', size: 2000 },
        ...testProps,
    };
    return render(<List {...props} />);
};

describe('List', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        getFileSizeString.mockReturnValue('2 KB');
    });

    it('should render file name and size', () => {
        const { getByText } = setup();

        expect(getByText(/image.png/)).toBeInTheDocument();
        expect(getByText(/2 KB/)).toBeInTheDocument();
        expect(getFileSizeString).toHaveBeenCalledWith(2);
    });

    it('should call onClear when close icon button is clicked', async () => {
        const { getByRole } = setup();

        await userEvent.click(getByRole('button'));

        expect(onClear).toHaveBeenCalledTimes(1);
    });

    it('should show tooltip title on hover', async () => {
        const { getByRole, findByText } = setup();

        await userEvent.hover(getByRole('button'));

        expect(
            await findByText('Click to remove file. The file will be deleted upon submitting the form.'),
        ).toBeInTheDocument();
    });
});
