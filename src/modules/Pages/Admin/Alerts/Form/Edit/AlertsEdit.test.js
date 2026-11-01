import React from 'react';
import { default as AlertsEdit } from './AlertsEditContainer';
import { setDefaults } from './AlertsEdit';
import * as routes from 'repositories/routes';
import { rtlRender, userEvent, fireEvent, WithReduxStore, waitForElementToBeRemoved } from 'test-utils';

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => jest.fn(),
    useParams: () => ({ alertid: '1db618c0-d897-11eb-a27e-df4e46db7245' }),
}));

window.scrollTo = jest.fn();

const alertId = '1db618c0-d897-11eb-a27e-df4e46db7245';
const alert = {
    id: alertId,
    start: '2021-06-29 15:00:34',
    end: '2031-07-02 18:30:34',
    title: 'Example alert',
    body: 'body',
    priority_type: 'urgent',
    systems: ['homepage'],
    created_by: 'uqtest1',
    updated_by: 'uqtest2',
};

function setup() {
    return rtlRender(
        <WithReduxStore>
            <AlertsEdit />
        </WithReduxStore>,
    );
}

describe('Edit Form Tests', () => {
    beforeEach(() => {
        mockApi = setupMockAdapter();
    });

    afterEach(() => {
        mockApi.reset();
    });

    it('renders a loading state and loads the requested alert', async () => {
        const alertApiUrl = routes.ALERT_BY_ID_API({ id: alertId }).apiUrl;
        mockApi.onGet(alertApiUrl).reply(200, alert);

        const { getByText, queryByText } = setup();

        expect(getByText('Loading')).toBeInTheDocument();
        expect(queryByText('Edit alert')).not.toBeInTheDocument();
        await waitForElementToBeRemoved(() => getByText('Loading'));
        expect(queryByText('Edit alert')).toBeInTheDocument();
        expect(mockApi.history.get).toHaveLength(1);
        expect(mockApi.history.get[0].url).toBe(alertApiUrl);
    });

    it('pass correct request payload to the alert api', async () => {
        const alertApiUrl = routes.ALERT_BY_ID_API({ id: alertId }).apiUrl;
        mockApi.onGet(alertApiUrl).reply(200, alert);
        mockApi.onPut(routes.ALERT_UPDATE_API({ id: alertId }).apiUrl).reply(200, alert);

        const { getByLabelText, getByRole, getByText } = setup();
        await waitForElementToBeRemoved(() => getByText('Loading'));
        fireEvent.change(getByLabelText('End date'), { target: { value: '2055-07-02T18:30:00' } });
        await userEvent.click(getByRole('button', { name: 'Save' }));
        await waitForElementToBeRemoved(() => getByText('Loading'));

        expect(mockApi.history.put).toHaveLength(1);
        expect(JSON.parse(mockApi.history.put[0].data)).toEqual({
            id: alertId,
            title: 'Example alert',
            body: 'body',
            priority_type: 'urgent',
            start: '2021-06-29 15:00:00',
            end: '2055-07-02 18:30:00',
            systems: ['homepage'],
        });
    });

    describe('setDefaults', () => {
        it('sets defaults from alert and form inputs', () => {
            expect(
                setDefaults({
                    alert: {
                        id: 'alert-123',
                        start: '2021-06-29 15:00:34',
                        end: '2031-07-02 18:30:34',
                        title: 'Example alert',
                        priority_type: 'urgent',
                        systems: ['homepage'],
                        updated_by: 'uqtest2',
                        created_by: 'uqtest1',
                    },
                    isPermanent: false,
                    linkRequired: false,
                    linkTitle: 'Read more',
                    linkUrl: '/details',
                    message: 'Alert details',
                }),
            ).toEqual({
                id: 'alert-123',
                dateList: [{ startDate: '2021-06-29T15:00:34', endDate: '2031-07-02T18:30:34' }],
                startDateDefault: '2021-06-29T15:00:34',
                endDateDefault: '2031-07-02T18:30:34',
                alertTitle: 'Example alert',
                enteredbody: 'Alert details',
                linkRequired: false,
                priorityType: 'urgent',
                permanentAlert: false,
                linkTitle: 'Read more',
                linkUrl: '/details',
                type: 'edit',
                minimumDate: expect.any(String),
                systems: ['homepage'],
                updatedBy: 'uqtest2',
                createdBy: 'uqtest1',
            });
        });

        it('uses fallback values when alert data is unavailable', () => {
            expect(
                setDefaults({
                    alert: null,
                    isPermanent: true,
                    linkRequired: true,
                    linkTitle: 'More information',
                    linkUrl: '/details',
                    message: 'Notice',
                }),
            ).toEqual({
                id: '',
                dateList: [{ startDate: '', endDate: '' }],
                startDateDefault: '',
                endDateDefault: '',
                alertTitle: '',
                enteredbody: 'Notice',
                linkRequired: true,
                priorityType: 'info',
                permanentAlert: true,
                linkTitle: 'More information',
                linkUrl: '/details',
                type: 'edit',
                minimumDate: expect.any(String),
                systems: [],
                updatedBy: null,
                createdBy: '?',
            });
        });
    });
});
