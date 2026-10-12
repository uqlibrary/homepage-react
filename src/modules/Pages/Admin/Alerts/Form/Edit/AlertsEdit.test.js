import React from 'react';
import AlertsEdit, { setDefaults } from './AlertsEdit';
import * as alertActions from 'data/actions/alertsActions';
import { rtlRender, userEvent, fireEvent } from 'test-utils';

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => jest.fn(),
    useParams: () => ({ alertid: '1db618c0-d897-11eb-a27e-df4e46db7245' }),
}));

window.scrollTo = jest.fn();

function setup(testProps) {
    const props = {
        actions: {
            ...alertActions,
            loadAnAlert: testProps.loadAnAlert || jest.fn(),
            saveAlertChange: testProps.saveAlertChange || jest.fn(),
        },
        alert: testProps.alert || {},
        alertStatus: testProps.alertStatus,
    };
    return rtlRender(<AlertsEdit {...props} />);
}

describe('Edit Form Tests', () => {
    it('renders a loading state and loads the requested alert', () => {
        const loadAnAlertMock = jest.fn();
        const { getByText, queryByText } = setup({
            alertStatus: 'loading',
            loadAnAlert: loadAnAlertMock,
        });

        expect(getByText('Loading')).toBeInTheDocument();
        expect(queryByText('Edit alert')).not.toBeInTheDocument();
        expect(loadAnAlertMock).toHaveBeenCalledWith('1db618c0-d897-11eb-a27e-df4e46db7245');
    });

    it('pass correct request payload to the alert api', async () => {
        const alert = {
            id: '1db618c0-d897-11eb-a27e-df4e46db7245',
            start: '2021-06-29 15:00:34',
            end: '2031-07-02 18:30:34',
            title: 'Example alert',
            body: 'body',
            priority_type: 'urgent',
            systems: ['homepage'],
        };

        const saveAlertChangeMock = jest.fn();
        const { getByLabelText, getByRole } = setup({
            alert: { ...alert, created_by: 'uqtest1', updated_by: 'uqtest2' },
            saveAlertChange: saveAlertChangeMock,
        });
        fireEvent.change(getByLabelText('End date'), { target: { value: '2055-07-02T18:30:00' } });
        await userEvent.click(getByRole('button', { name: 'Save' }));
        expect(saveAlertChangeMock).toHaveBeenCalledWith({ ...alert, end: '2055-07-02 18:30:00' });
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
