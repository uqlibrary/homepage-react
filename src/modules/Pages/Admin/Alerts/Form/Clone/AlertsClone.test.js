import React from 'react';
import { default as AlertsClone } from './AlertsCloneContainer';
import { setDefaults } from './AlertsClone';
import { render, userEvent, WithReduxStore, waitForElementToBeRemoved } from 'test-utils';
import * as routes from 'repositories/routes';

const mockUseNavigate = jest.fn();

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
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
            body: 'This alert can be edited in mock.[permanent][UQ community COVID-19 advice](https://about.uq.edu.au/coronavirus)',
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

    describe('setDefaults', () => {
        it('uses alert and form values when building clone defaults', () => {
            const defaults = setDefaults({
                alert: {
                    id: 'alert-123',
                    title: 'Example alert',
                    priority_type: 'urgent',
                    systems: ['homepage'],
                },
                isPermanent: true,
                message: 'A message',
                linkRegex: ['[Read more](https://example.com)', 'Read more', 'https://example.com'],
            });

            expect(defaults).toEqual({
                id: 'alert-123',
                dateList: [
                    {
                        startDate: expect.any(String),
                        endDate: expect.any(String),
                    },
                ],
                startDateDefault: expect.any(String),
                endDateDefault: expect.any(String),
                alertTitle: 'Example alert',
                enteredbody: 'A message',
                linkRequired: true,
                priorityType: 'urgent',
                permanentAlert: true,
                linkTitle: 'Read more',
                linkUrl: 'https://example.com',
                type: 'clone',
                minimumDate: expect.any(String),
                systems: ['homepage'],
            });
            expect(defaults.dateList[0].startDate).toBe(defaults.startDateDefault);
            expect(defaults.dateList[0].endDate).toBe(defaults.endDateDefault);
        });

        it('uses empty and default values when alert details are absent', () => {
            expect(
                setDefaults({
                    alert: null,
                    isPermanent: false,
                    message: '',
                    linkRegex: null,
                }),
            ).toEqual({
                id: '',
                dateList: [
                    {
                        startDate: expect.any(String),
                        endDate: expect.any(String),
                    },
                ],
                startDateDefault: expect.any(String),
                endDateDefault: expect.any(String),
                alertTitle: '',
                enteredbody: '',
                linkRequired: false,
                priorityType: 'info',
                permanentAlert: false,
                linkTitle: '',
                linkUrl: '',
                type: 'clone',
                minimumDate: expect.any(String),
                systems: [],
            });
        });

        it('uses fallbacks for empty fields and an incomplete link match', () => {
            expect(
                setDefaults({
                    alert: {
                        id: '',
                        title: '',
                        priority_type: '',
                        systems: null,
                    },
                    isPermanent: false,
                    message: null,
                    linkRegex: ['[incomplete link'],
                }),
            ).toEqual({
                id: '',
                dateList: [
                    {
                        startDate: expect.any(String),
                        endDate: expect.any(String),
                    },
                ],
                startDateDefault: expect.any(String),
                endDateDefault: expect.any(String),
                alertTitle: '',
                enteredbody: '',
                linkRequired: false,
                priorityType: 'info',
                permanentAlert: false,
                linkTitle: '',
                linkUrl: '',
                type: 'clone',
                minimumDate: expect.any(String),
                systems: [],
            });
        });
    });
});
