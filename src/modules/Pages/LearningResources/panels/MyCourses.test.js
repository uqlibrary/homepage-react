import React from 'react';
/* eslint-disable react/prop-types */
import { rtlRender, userEvent } from 'test-utils';
import { useAccountContext } from 'context';
import { MyCourses, courseTabLabel } from './MyCourses';

jest.mock('context', () => ({
    useAccountContext: jest.fn(),
}));

jest.mock('helpers/general', () => ({
    getCampusByCode: jest.fn(code => ({ STL: 'St Lucia', GAT: 'Gatton' })[code] || null),
}));

jest.mock('../shared/SubjectBody', () => ({
    SubjectBody: ({ subject }) => <div data-testid="subject-body">{subject.classnumber}</div>,
}));

const loadSubjectAndFocusOnTab = jest.fn();
const setCurrentMenuTab = jest.fn();

const defaultProps = {
    preselectedCourse: {},
    readingList: {},
    examList: {},
    guideList: {},
    coursemenu: `${courseTabLabel}-0`,
    loadSubjectAndFocusOnTab,
    setCurrentMenuTab,
};

const setup = (account, props = {}) => {
    useAccountContext.mockReturnValue({ account });
    return rtlRender(<MyCourses {...defaultProps} {...props} />);
};

describe('MyCourses component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('shows the empty state when the account is unavailable', () => {
        const { getByTestId, getByText } = setup(null);

        expect(getByTestId('no-classes')).toBeInTheDocument();
        expect(getByText('No enrolled courses available')).toBeInTheDocument();
    });

    it('shows the empty state when current classes are missing or empty', () => {
        const { getByTestId, rerender } = setup({});

        expect(getByTestId('no-classes')).toBeInTheDocument();

        useAccountContext.mockReturnValue({ account: { current_classes: [] } });
        rerender(<MyCourses {...defaultProps} />);

        expect(getByTestId('no-classes')).toBeInTheDocument();
    });

    it('selects the tab matching the preselected course, campus, and semester', () => {
        const account = {
            current_classes: [
                { classnumber: 'BIOL1000', CAMPUS: 'STL', semester: 'Semester 1' },
                { classnumber: 'FREN1010', CAMPUS: 'STL', semester: 'Semester 2' },
            ],
        };

        setup(account, {
            preselectedCourse: { coursecode: 'FREN1010', campus: 'St Lucia', semester: 'Semester 2' },
        });

        expect(setCurrentMenuTab).toHaveBeenCalledWith(`${courseTabLabel}-1`);
    });

    it('does not select a tab when no enrolled class matches all preselected details', () => {
        const account = {
            current_classes: [
                { classnumber: 'BIOL1000', CAMPUS: 'STL', semester: 'Semester 1' },
                { classnumber: 'FREN1010', CAMPUS: 'GAT', semester: 'Semester 1' },
                { classnumber: 'FREN1010', CAMPUS: 'STL', semester: 'Semester 2' },
            ],
        };

        setup(account, {
            preselectedCourse: { coursecode: 'FREN1010', campus: 'St Lucia', semester: 'Semester 1' },
        });

        expect(setCurrentMenuTab).not.toHaveBeenCalled();
    });

    it('renders enrolled course tabs and changes the selected tab when clicked', async () => {
        const account = {
            current_classes: [{ classnumber: 'FREN1010' }, { classnumber: 'BIOL1000' }],
        };
        const { getAllByRole, getAllByTestId, getByRole, getByTestId, rerender } = setup(account);

        expect(getAllByRole('tab')).toHaveLength(2);
        expect(getByRole('tab', { name: 'FREN1010' })).toHaveAttribute('aria-selected', 'true');
        expect(getAllByTestId('classpanel-0')).toHaveLength(1);
        expect(getByTestId('subject-body')).toHaveTextContent('FREN1010');

        const biologyTab = getByRole('tab', { name: 'BIOL1000' });
        await userEvent.click(biologyTab);

        expect(loadSubjectAndFocusOnTab).toHaveBeenCalledWith('BIOL1000', `${courseTabLabel}-1`);

        rerender(<MyCourses {...defaultProps} coursemenu={`${courseTabLabel}-1`} />);

        expect(getByRole('tab', { name: 'BIOL1000' })).toHaveAttribute('aria-selected', 'true');
        expect(getByTestId('subject-body')).toHaveTextContent('BIOL1000');
    });

    it('ignores tab changes when a tab has no course code', async () => {
        const { getAllByRole } = setup({ current_classes: [{ classnumber: 'FREN1010' }, { classnumber: '' }] });

        const emptyTab = getAllByRole('tab')[1];
        await userEvent.click(emptyTab);

        expect(loadSubjectAndFocusOnTab).not.toHaveBeenCalled();
    });
});
