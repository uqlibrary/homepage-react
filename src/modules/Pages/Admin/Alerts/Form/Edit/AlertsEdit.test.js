import React from 'react';
import AlertsEdit from './AlertsEdit';
import * as alertActions from 'data/actions/alertsActions';
import { rtlRender, userEvent, fireEvent } from 'test-utils';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useParams: () => ({ alertid: '1db618c0-d897-11eb-a27e-df4e46db7245' }),
}));

window.scrollTo = jest.fn();

function setup(testProps) {
    const props = {
        actions: {
            ...alertActions,
            saveAlertChange: testProps.saveAlertChange || jest.fn(),
        },
        alert: testProps.alert || {},
    };
    return rtlRender(<AlertsEdit {...props} />);
}

describe('Edit Form Tests', () => {
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
        expect(saveAlertChangeMock).toBeCalledWith({ ...alert, end: '2055-07-02 18:30:00' });
    });
});
