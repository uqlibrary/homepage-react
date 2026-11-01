import React from 'react';
import { fireEvent, rtlRender, waitFor, WithRouter } from 'test-utils';

import examSuggestion_FREN from '../../../data/mock/data/records/learningResources/examSuggestion_FREN';

import { PastExamPaperSearch } from './PastExamPaperSearch';

const mockNavigate = jest.fn();

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockNavigate,
}));

const defaultActions = {
    clearExamSuggestions: jest.fn(),
    loadExamSuggestions: jest.fn(),
};

function setup(testProps = {}) {
    const props = {
        actions: defaultActions,
        examSuggestionList: [],
        examSuggestionListError: null,
        examSuggestionListLoading: false,
        ...testProps,
    };

    return rtlRender(
        <WithRouter>
            <PastExamPaperSearch {...props} />
        </WithRouter>,
    );
}

describe('PastExamPaperSearch', () => {
    beforeEach(() => {
        document.body.appendChild(document.createElement('uq-site-header'));
        jest.clearAllMocks();
    });

    afterEach(() => {
        document.querySelector('uq-site-header')?.remove();
    });

    it('renders the search page and configures page metadata', () => {
        const { getByRole, getByTestId } = setup();

        expect(getByRole('heading', { name: 'Search for a past exam paper' })).toBeInTheDocument();
        expect(getByTestId('past-exam-paper-search-autocomplete-input')).toBeInTheDocument();
        expect(document.title).toBe('Search for a past exam paper - Library - The University of Queensland');
        expect(document.querySelector('uq-site-header')).toHaveAttribute('secondleveltitle', 'Past exam papers');
        expect(getByRole('link', { name: 'Read more about searching for past exam papers' })).toHaveAttribute(
            'href',
            'https://dev-library-uq.pantheonsite.io/study-and-learning-support/coursework/past-exam-papers',
        );
    });

    it('renders without a site header', () => {
        document.querySelector('uq-site-header').remove();

        expect(() => setup()).not.toThrow();
    });

    it('when I type too short a course code fragment in the search bar, a hint shows', async () => {
        const { getByTestId, getByText } = setup({ examSuggestionList: undefined });

        fireEvent.change(getByTestId('past-exam-paper-search-autocomplete-input'), { target: { value: 'B' } });

        await waitFor(() => expect(getByText('Type more characters to search')).toBeInTheDocument());
        expect(defaultActions.clearExamSuggestions).toHaveBeenCalledTimes(1);
        expect(defaultActions.loadExamSuggestions).not.toHaveBeenCalled();
    });

    it('loads suggestions for a valid search and removes its first space', () => {
        const { getByTestId } = setup({ examSuggestionList: undefined });

        fireEvent.change(getByTestId('past-exam-paper-search-autocomplete-input'), {
            target: { value: 'FREN 1101' },
        });

        expect(defaultActions.loadExamSuggestions).toHaveBeenCalledWith('FREN1101');
    });

    it('when I type a valid course code fragment in the search bar, appropriate suggestions load', () => {
        const { getByTestId, getAllByRole } = setup({ examSuggestionList: examSuggestion_FREN });

        fireEvent.change(getByTestId('past-exam-paper-search-autocomplete-input'), {
            target: { value: 'fren1' },
        });

        expect(defaultActions.loadExamSuggestions).toHaveBeenCalledWith('fren1');
        expect(getAllByRole('option')).toHaveLength(3);
    });

    it('when I type an invalid course code fragment in the search bar, a hint shows', () => {
        const { getByTestId } = setup({ examSuggestionList: [] });
        fireEvent.change(getByTestId('past-exam-paper-search-autocomplete-input'), { target: { value: 'em' } });

        const noOptions = document.querySelector('.MuiAutocomplete-noOptions');
        expect(noOptions).toBeInTheDocument();
        expect(noOptions).toHaveTextContent('We have not found any past exams for this course');
    });

    test('when I dont have any results yet, the "results for this search" doesnt get added to the drop down', () => {
        const { getByTestId, queryByTestId, getAllByRole } = setup({ examSuggestionList: examSuggestion_FREN });
        fireEvent.change(getByTestId('past-exam-paper-search-autocomplete-input'), { target: { value: 'f' } });
        expect(queryByTestId('exam-search-listbox')).not.toBeInTheDocument();
        fireEvent.change(getByTestId('past-exam-paper-search-autocomplete-input'), { target: { value: 'fren' } });
        expect(getAllByRole('option')).toHaveLength(17);
    });

    it('clears stale suggestions when the typed prefix changes', () => {
        const { getByTestId } = setup({ examSuggestionList: undefined });
        const input = getByTestId('past-exam-paper-search-autocomplete-input');

        fireEvent.change(input, { target: { value: 'BI' } });
        fireEvent.change(input, { target: { value: 'AC' } });

        expect(defaultActions.clearExamSuggestions).toHaveBeenCalledTimes(1);
        expect(defaultActions.loadExamSuggestions).toHaveBeenLastCalledWith('AC');
    });

    it.each(['ABCDEFGHIJ', 'AAAAA'])('does not search for invalid input %s', typedText => {
        const { getByTestId } = setup({ examSuggestionList: undefined });

        fireEvent.change(getByTestId('past-exam-paper-search-autocomplete-input'), { target: { value: typedText } });

        expect(defaultActions.loadExamSuggestions).not.toHaveBeenCalled();
    });

    it('when I click on a suggestion from the list, the correct result page loads', async () => {
        const { getByTestId, getAllByRole } = setup({ examSuggestionList: examSuggestion_FREN });

        fireEvent.change(getByTestId('past-exam-paper-search-autocomplete-input'), { target: { value: 'fren' } });
        expect(getAllByRole('option')).toHaveLength(17);
        fireEvent.click(getAllByRole('option')[0]);

        expect(mockNavigate).toHaveBeenCalledWith('/exams/course/FREN');
    });
    it('when I hit return on a search list, the result page for the first option loads', async () => {
        const { getByTestId, getAllByRole } = setup({ examSuggestionList: examSuggestion_FREN });

        fireEvent.change(getByTestId('past-exam-paper-search-autocomplete-input'), { target: { value: 'fren' } });
        expect(getAllByRole('option')).toHaveLength(17);
        const input = getByTestId('past-exam-paper-search-autocomplete-input');
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 });

        expect(mockNavigate).toHaveBeenCalledWith('/exams/course/FREN');
    });

    it('does not duplicate an exact course option', async () => {
        const suggestions = [{ name: 'BIOL1000', course_title: 'Biology 1' }];
        const { getByTestId, findAllByRole } = setup({ examSuggestionList: suggestions });

        fireEvent.change(getByTestId('past-exam-paper-search-autocomplete-input'), {
            target: { value: 'biol1000' },
        });

        expect(await findAllByRole('option')).toHaveLength(1);
    });

    it('shows a loader while suggestions are loading', () => {
        const { getByText } = setup({ examSuggestionListLoading: true });

        expect(getByText('Loading')).toBeInTheDocument();
    });

    it('shows an error and closes suggestions when loading fails', () => {
        const { getByTestId, getByText } = setup({ examSuggestionListError: new Error('Unavailable') });

        expect(getByTestId('past-exam-paper-error')).toBeInTheDocument();
        expect(
            getByText('Autocomplete suggestions currently unavailable - please try again later'),
        ).toBeInTheDocument();
    });

    it('when my search term matches the first result I do not get a "show all" prompt', () => {
        const { getByTestId, getAllByRole } = setup({ examSuggestionList: examSuggestion_FREN });

        fireEvent.change(getByTestId('past-exam-paper-search-autocomplete-input'), {
            target: { value: 'fren101' },
        });
        expect(getAllByRole('option')).toHaveLength(2);
        const option1 = getAllByRole('option')[0];
        const option2 = getAllByRole('option')[1];
        expect(option1).toHaveTextContent('View all exam papers for FREN101');
        expect(option1).toBeVisible();
        expect(option2).toHaveTextContent('FREN1010');
        expect(option2).toBeVisible();
        fireEvent.change(getByTestId('past-exam-paper-search-autocomplete-input'), {
            target: { value: 'fren1010' },
        });
        expect(getAllByRole('option')).toHaveLength(1);
        const option = getAllByRole('option')[0];
        expect(option).toHaveTextContent('FREN1010');
        expect(option).toBeVisible();
    });

    it('when the api fails I get an appropriate error message', async () => {
        const { getByTestId } = setup({ examSuggestionListError: new Error('Unavailable') });

        expect(getByTestId('past-exam-paper-error')).toHaveTextContent(
            'Autocomplete suggestions currently unavailable - please try again later',
        );
    });
});
