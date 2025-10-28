import React from 'react';
import StandardAuthPage from './StandardAuthPage';
import { render, WithReduxStore } from 'test-utils';
import Immutable from 'immutable';

import { PERMISSIONS } from '../../config/auth';
import locale from '../../testTag.locale';
import userData from '../../../../../../data/mock/data/testing/testAndTag/testTagUser';
/*
    title: PropTypes.string,
    user: PropTypes.object,
    locale: PropTypes.object,
    requiredPermissions: PropTypes.array,
    inclusive: PropTypes.bool,
    children: PropTypes.any,
    */

const contentText = 'This is the protected content';

function setup(testProps = {}, renderer = render) {
    const { state = {}, ...props } = testProps;

    const _state = {
        accountReducer: {
            accountLoading: false,
            account: { tnt: userData },
            ...state,
        },
    };
    return renderer(
        <WithReduxStore initialState={Immutable.Map(_state)}>
            <StandardAuthPage {...props}>
                <>{contentText}</>
            </StandardAuthPage>
        </WithReduxStore>,
    );
}

describe('StandardAuthPage', () => {
    it('renders component with denied text when user does not have required permissions', () => {
        const { getByText } = setup({ requiredPermissions: [PERMISSIONS.can_admin] });
        expect(getByText(locale.pages.general.pageUnavailable)).toBeInTheDocument();
    });
    it('renders component with denied text when user does not have all required permissions', () => {
        const { getByText } = setup({
            requiredPermissions: [
                PERMISSIONS.can_admin,
                PERMISSIONS.can_alter,
                PERMISSIONS.can_inspect,
                PERMISSIONS.can_see_reports,
            ],
        });
        expect(getByText(locale.pages.general.pageUnavailable)).toBeInTheDocument();
    });

    it('renders component with title, subtitle (department_display_name) and protected content when user has any required permission', () => {
        const mockSubtitleFn = jest.fn(dept => `Subtitle for ${dept}`);
        const { getByTestId, getByText } = setup({
            locale: { header: { pageSubtitle: mockSubtitleFn } },
            inclusive: false,
            title: 'Test title',
            requiredPermissions: [
                PERMISSIONS.can_admin,
                PERMISSIONS.can_alter,
                PERMISSIONS.can_inspect,
                PERMISSIONS.can_see_reports,
            ],
        });
        expect(mockSubtitleFn).toHaveBeenCalledWith('Library');
        expect(getByTestId('StandardPage-title')).toHaveTextContent('Test title');
        expect(getByTestId('test_tag_header')).toHaveTextContent('Subtitle for Library');
        expect(getByText(contentText)).toBeInTheDocument();
    });

    it('renders component with title, subtitle (user_department) and protected content when user has any required permission', () => {
        const mockSubtitleFn = jest.fn(dept => `Subtitle for ${dept}`);
        const { getByTestId, getByText } = setup({
            state: {
                account: { tnt: { ...userData, department_display_name: undefined } },
            },
            locale: { header: { pageSubtitle: mockSubtitleFn } },
            inclusive: false,
            title: 'Test title',
            requiredPermissions: [
                PERMISSIONS.can_admin,
                PERMISSIONS.can_alter,
                PERMISSIONS.can_inspect,
                PERMISSIONS.can_see_reports,
            ],
        });
        expect(mockSubtitleFn).toHaveBeenCalledWith('UQL');
        expect(getByTestId('StandardPage-title')).toHaveTextContent('Test title');
        expect(getByTestId('test_tag_header')).toHaveTextContent('Subtitle for UQL');
        expect(getByText(contentText)).toBeInTheDocument();
    });
    it('renders component with title and subtitle and protected content', () => {
        const mockSubtitleFn = jest.fn(dept => `Subtitle for ${dept}`);
        const { getByTestId, getByText } = setup({
            locale: { header: { pageSubtitle: mockSubtitleFn } },
            title: 'Test title',
            requiredPermissions: [PERMISSIONS.can_inspect],
        });
        expect(mockSubtitleFn).toHaveBeenCalledWith('Library');
        expect(getByTestId('StandardPage-title')).toHaveTextContent('Test title');
        expect(getByTestId('test_tag_header')).toHaveTextContent('Subtitle for Library');
        expect(getByText(contentText)).toBeInTheDocument();
    });
    it('renders component with denied text when error loading user', () => {
        const { getByText } = setup({
            state: {
                account: {
                    userLoading: false,
                    tnt: null,
                },
            },
        });
        expect(getByText(locale.pages.general.pageUnavailable)).toBeInTheDocument();
    });
});
