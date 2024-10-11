import React from 'react';
import { default as AlertsClone } from './AlertsCloneContainer';
import { render, userEvent, WithReduxStore, waitForElementToBeRemoved } from 'test-utils';
import * as routes from 'repositories/routes';

const mockUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockUseNavigate,
    useParams: jest.fn(() => ({ alertid: '1db618c0-d897-11eb-a27e-df4e46db7245' })),
}));

window.scrollTo = jest.fn();

function setup() {
    return render(
        <WithReduxStore>
            <AlertsClone />
        </WithReduxStore>,
    );
}

describe('Form Tests', () => {
    beforeEach(() => {
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
        mockUseNavigate.mockClear();
    });

    it('the cancel button returns to the list page', async () => {
        // data to populate the form
        mockApi.onGet(routes.ALERT_BY_ID_API({ id: '1db618c0-d897-11eb-a27e-df4e46db7245' }).apiUrl).reply(200, {
            id: '1db618c0-d897-11eb-a27e-df4e46db7245',
            start: '2021-06-29 15:00:34',
            end: '2031-07-02 18:30:34',
            title: 'Example alert:',
            body:
                'This alert can be edited in mock.[permanent][UQ community COVID-19 advice](https://about.uq.edu.au/coronavirus)',
            priority_type: 'urgent',
            systems: ['homepage'],
            created_by: 'uqtest1',
            updated_by: 'uqtest2',
        });

        // on save, api returned multiple alerts created
        mockApi.onPost(routes.ALERTS_CREATE_API().apiUrl).reply(200, [{ id: '1' }, { id: '2' }]);
        const { getByText, getByRole } = setup();
        await waitForElementToBeRemoved(() => getByText('Loading'));

        // clone multiple alerts, based on the API response
        await userEvent.click(getByRole('button', { name: 'Create' }));
        await waitForElementToBeRemoved(() => getByText('Loading'));

        expect(getByText('2 alerts have been cloned')).toBeEnabled();
    });
});
