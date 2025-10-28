import React from 'react';
import AuthWrapper from './AuthWrapper';
import { render, WithReduxStore } from 'test-utils';
import Immutable from 'immutable';

import { PERMISSIONS } from '../../config/auth';
import userData from '../../../../../../data/mock/data/testing/testAndTag/testTagUser';

const fallbackText = 'This is a fallback';
const contentText = 'This is the protected content';

function setup(testProps = {}, renderer = render) {
    const { state: { user = {} } = {}, ...props } = testProps;

    const _state = {
        accountReducer: {
            accountLoading: false,
            account: { tnt: { ...userData, ...user } },
        },
    };
    return renderer(
        <WithReduxStore initialState={Immutable.Map(_state)}>
            <AuthWrapper fallback={<>{fallbackText}</>} {...props}>
                <>{contentText}</>
            </AuthWrapper>
        </WithReduxStore>,
    );
}

describe('AuthWrapper', () => {
    it('renders fallback when no requiredPermission provided ', () => {
        const { getByText, queryByText } = setup();
        expect(getByText(fallbackText)).toBeInTheDocument();
        expect(queryByText(contentText)).not.toBeInTheDocument();
    });
    it('renders fallback when no user available ', () => {
        const { getByText, queryByText } = setup({
            state: {
                user: {},
            },
        });
        expect(getByText(fallbackText)).toBeInTheDocument();
        expect(queryByText(contentText)).not.toBeInTheDocument();
    });
    it('renders fallback when user privilege does not meet requiredPermissions ', () => {
        const { getByText, queryByText } = setup({
            requiredPermissions: [PERMISSIONS.can_admin],
        });
        expect(getByText(fallbackText)).toBeInTheDocument();
        expect(queryByText(contentText)).not.toBeInTheDocument();
    });
    it('renders fallback when user privileges do not match all required permissions ', () => {
        const user = {
            privileges: {
                can_admin: 0,
                can_inspect: 1,
                can_alter: 0,
                can_see_reports: 0,
            },
        };
        const { getByText, queryByText } = setup({
            state: {
                user,
            },
            inclusive: true,
            requiredPermissions: [PERMISSIONS.can_inspect, PERMISSIONS.can_see_reports],
        });
        expect(getByText(fallbackText)).toBeInTheDocument();
        expect(queryByText(contentText)).not.toBeInTheDocument();
    });
    it('renders children when user privileges match some required permissions ', () => {
        const user = {
            privileges: {
                can_admin: 0,
                can_inspect: 1,
                can_alter: 0,
                can_see_reports: 0,
            },
        };
        const { getByText, queryByText } = setup({
            state: { user },
            requiredPermissions: [PERMISSIONS.can_inspect, PERMISSIONS.can_see_reports],
        });
        expect(queryByText(fallbackText)).not.toBeInTheDocument();
        expect(getByText(contentText)).toBeInTheDocument();
    });
});
