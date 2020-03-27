import React from 'react';
import AdvancedSearchComponent from './AdvancedSearchComponent';
import moment from 'moment';
import { rtlRender, fireEvent, waitForElement, act } from 'test-utils';

function setup(testProps = {}) {
    const props = {
        isLoading: false,
        isMinimised: false,
        isOpenAccess: false,
        yearFilter: {
            invalid: false,
        },
        className: 'advanced-search',
        updateYearRangeFilter: jest.fn(),
        docTypes: [],
        onSearch: jest.fn(),
        ...testProps,
    };
    return rtlRender(<AdvancedSearchComponent {...props} />);
}

describe('AdvancedSearchComponent', () => {
    it('should render default view', () => {
        const { getByTestId, getByText } = setup();
        expect(getByText(/advanced search/i)).toBeInTheDocument();
        expect(getByText(/please select a field to search/i)).toBeInTheDocument();
        expect(getByTestId('add-another-search-row').disabled).toBeTruthy();
        expect(getByTestId('textfield').disabled).toBeTruthy();
        expect(getByTestId('advancedSearchButton')).toBeInTheDocument();
    });

    it('should render minimised view', () => {
        const testFn = jest.fn();
        const { getByTestId, getByText } = setup({ isMinimised: true, onToggleMinimise: testFn });
        expect(getByText(/advanced search/i)).toBeInTheDocument();
        expect(getByTestId('maximize-advanced-search')).toBeInTheDocument();
        fireEvent.click(getByTestId('maximize-advanced-search'));
        expect(testFn).toHaveBeenCalled();
    });

    it('should render default view with open access checked', () => {
        const testFn = jest.fn();
        const { getByTestId, getByText } = setup({ isOpenAccess: true, onToggleOpenAccess: testFn });
        expect(getByText(/advanced search/i)).toBeInTheDocument();
        expect(getByText(/please select a field to search/i)).toBeInTheDocument();
        expect(getByTestId('add-another-search-row').disabled).toBeTruthy();
        expect(getByTestId('textfield').disabled).toBeTruthy();
        expect(getByTestId('advancedSearchButton')).toBeInTheDocument();
        expect(getByText('open access/full text')).toBeInTheDocument();

        fireEvent.click(getByTestId('advanced-search-open-access'));
        expect(testFn).toHaveBeenCalled();
    });

    it('should render advanced search row based on props', () => {
        const { getByTestId, getByText } = setup({
            isOpenAccess: true,
            fieldRows: [{ value: 'i feel lucky', searchField: 'all' }],
        });
        expect(getByText(/advanced search/i)).toBeInTheDocument();
        expect(getByTestId('textfield').value).toEqual('i feel lucky');
        expect(getByTestId('add-another-search-row').disabled).toBeFalsy();
        expect(getByTestId('advancedSearchButton')).toBeInTheDocument();
        expect(getByText('open access/full text')).toBeInTheDocument();
    });

    it('should toggle search mode from advanced to simple', () => {
        const testFn = jest.fn();
        const { getByTestId } = setup({ onToggleSearchMode: testFn });
        fireEvent.click(getByTestId('toggle-to-simple-search-mode'));
        expect(testFn).toHaveBeenCalled();
    });

    it('should add advanced search row', () => {
        const testFn = jest.fn();
        const { getByTestId } = setup({
            onAdvancedSearchRowAdd: testFn,
            fieldRows: [{ value: 'i feel lucky', searchField: 'all' }],
        });
        fireEvent.click(getByTestId('add-another-search-row'));
        expect(testFn).toHaveBeenCalled();
    });

    it('should remove advanced search row', () => {
        const testFn = jest.fn();
        const { getByTestId } = setup({
            onAdvancedSearchRowRemove: testFn,
            fieldRows: [
                { value: 'i feel lucky', searchField: 'all' },
                { value: 'i feel more lucky', searchField: 'rek_title' },
            ],
        });

        fireEvent.click(getByTestId('delete-advanced-search-row-1'));
        expect(testFn).toHaveBeenCalled();
    });

    it('should reset advanced search', () => {
        const testFn = jest.fn();
        const { getByTestId } = setup({
            onAdvancedSearchReset: testFn,
            fieldRows: [
                { value: 'i feel lucky', searchField: 'all' },
                { value: 'i feel more lucky', searchField: 'rek_title' },
            ],
        });

        fireEvent.click(getByTestId('reset-advanced-search'));
        expect(testFn).toHaveBeenCalled();
    });

    it('should handle changes in advanced search row when field selector is changed', async() => {
        const testFn = jest.fn();
        const { getByTestId, getByText } = setup({
            onAdvancedSearchRowChange: testFn,
        });

        fireEvent.mouseDown(getByTestId('field-type-selector'));
        const list = await waitForElement(() => getByTestId('menu-field-type-selector'));
        fireEvent.click(getByText(/any field/i, list));
        expect(testFn).toHaveBeenCalledWith(0, { searchField: 'all', value: '', label: '' });
    });

    it('should handle changes in advanced search row when text field is changed for selected field', () => {
        const testFn = jest.fn();
        const { getByTestId } = setup({
            onAdvancedSearchRowChange: testFn,
            fieldRows: [{ value: '', searchField: 'all' }],
        });

        fireEvent.change(getByTestId('textfield'), { target: { value: 'testing' } });
        expect(testFn).toHaveBeenCalledWith(0, { searchField: 'all', value: 'testing', label: '' });
    });

    it('haveAllAdvancedSearchFieldsValidated should return false for a fieldRow which is longer than the max length', () => {
        const thisProps = {
            fieldRows: [
                {
                    searchField: 'rek_title',
                    value:
                        'OuuCJZb8JA35CrCl1wjx5WzgN2eAMBGryy72EGw7hB98P5P1SRwBDlHz2c1sej4YMIuzwPi3ewpAPiUp65' +
                        'sgJrL0BIVhr3S1ESxLpPfDlzgMSosPIT5Eq3WytsehVd8T8n5hy4akLPYQ1HTWYbSzvifjw79rbuMdvLGm' +
                        'XWS36ljaluN6v3sg8gtwUi5owNsuEIPiaOquVkV1k8nqdDx1npntW9fTX0B84UvnzemXIWySCoeiIsZVNm' +
                        'jdonoC3SYT2dDIddraqgShz256k1ZC56P9M6Zgs9FpmeFUHwEuXHBxcWLmxGfsxpJhNuFNKnELD2rhWYq3' +
                        'RXkDm67FyYwDX9V8IpMBNfAZi8Bb57VFvFbuGqQo56D99mkTA7SfRoVcbd3mMkSDQdowH8Bpni2EFPdC1a' +
                        'KcsWGxPPIS4Cr93PVFJFp9X2zSvXGDQ0WRLzINYFUahICxwIkclTK4uc9N3c3Czmy06mchh8aMlHDaplnc' +
                        'ul8TOLV8J',
                },
            ],
        };
        const { getByText } = setup({ ...thisProps });
        expect(getByText('Must be 255 characters or less')).toBeInTheDocument();
    });

    it('haveAllAdvancedSearchFieldsValidated should allow all field to be empty and empty field', () => {
        const thisProps = {
            fieldRows: [{ searchField: 'all', value: '' }, { searchField: '0', value: '' }],
        };
        const { getByTestId } = setup({ ...thisProps });
        expect(getByTestId('advancedSearchButton').disabled).toBeFalsy();
    });

    it('should render advanced search docTypes with checked values based on props', async() => {
        const { getByTestId, getAllByRole } = setup({
            isOpenAccess: true,
            docTypes: [179, 202],
            fieldRows: [{ value: 'i feel lucky', searchField: 'all' }],
        });

        fireEvent.mouseDown(getByTestId('document-type-selector'));
        const list = await waitForElement(() => getByTestId('menu-document-type-selector'));
        const options = getAllByRole('option', list);
        expect(options[4]).toHaveClass('Mui-selected'); // Journal article
        expect(options[4].checked).toBeTruthy(); // Journal article
        expect(options[12]).toHaveClass('Mui-selected'); // Generic document
        expect(options[12].checked).toBeTruthy(); // Generic document
    });

    it('should render advanced search docTypes with checked values based on fixed invalid props', async() => {
        const { getByTestId, getAllByRole } = setup({
            isOpenAccess: true,
            docTypes: ['179', '202'],
            fieldRows: [{ value: 'i feel lucky', searchField: 'all' }],
        });

        fireEvent.mouseDown(getByTestId('document-type-selector'));
        const list = await waitForElement(() => getByTestId('menu-document-type-selector'));
        const options = getAllByRole('option', list);
        expect(options[4]).toHaveClass('Mui-selected'); // Journal article
        expect(options[12]).toHaveClass('Mui-selected'); // Generic document
    });

    it('should render advanced search with no valid checked docTypes based on invalid props', async() => {
        const { getByTestId, getAllByRole } = setup({
            isOpenAccess: true,
            docTypes: ['test', 202],
            fieldRows: [{ value: 'i feel lucky', searchField: 'all' }],
        });

        fireEvent.mouseDown(getByTestId('document-type-selector'));
        const list = await waitForElement(() => getByTestId('menu-document-type-selector'));
        const options = getAllByRole('option', list);
        expect(options[12].checked).toBeTruthy(); // Generic document
        expect(options[12]).toHaveClass('Mui-selected'); // Generic document
        expect(options.filter(option => option['data-value'] === 'test').length).toEqual(0);
    });

    it('should update date range filter', () => {
        const updateYearRangeFilterFn = jest.fn();
        const { getByTestId } = setup({
            updateYearRangeFilter: updateYearRangeFilterFn,
            isOpenAccess: true,
        });

        fireEvent.change(getByTestId('from'), { target: { value: '2010' } });

        expect(updateYearRangeFilterFn).toHaveBeenCalledWith({
            from: 2010,
            invalid: false,
        });

        fireEvent.change(getByTestId('to'), { target: { value: '2014' } });
        expect(updateYearRangeFilterFn).toHaveBeenCalledWith({
            to: 2014,
            invalid: false,
        });
    });

    it('should update created date range filter for unpublished filters', () => {
        const updateDateRangeFn = jest.fn();
        const { getByTestId } = setup({
            showUnpublishedFields: true,
            updateDateRange: updateDateRangeFn,
            createdRange: {
                from: moment('10/10/2010', 'DD/MM/YYYY'),
                to: null,
            },
        });

        fireEvent.change(getByTestId('created-range-to-date'), { target: { value: '10/10/2013' } });
        expect(getByTestId('created-range-to-date').value).toBe('10/10/2013');
        expect(updateDateRangeFn).toHaveBeenCalledWith('rek_created_date', {
            from: moment('10/10/2010', 'DD/MM/YYYY'),
            to: moment('10/10/2013', 'DD/MM/YYYY', true),
        });
    });

    it('should handle search for created date range filter', () => {
        const onSearchFn = jest.fn();
        const { getByTestId } = setup({
            showUnpublishedFields: true,
            onSearch: onSearchFn,
        });

        act(() => {
            fireEvent.change(getByTestId('created-range-from-date'), { target: { value: '10/10/2013' } });
        });

        act(() => {
            fireEvent.change(getByTestId('created-range-to-date'), { target: { value: '10/11/2013' } });
        });

        fireEvent.click(getByTestId('advancedSearchButton'));

        expect(onSearchFn).toHaveBeenCalledWith();
    });
});
