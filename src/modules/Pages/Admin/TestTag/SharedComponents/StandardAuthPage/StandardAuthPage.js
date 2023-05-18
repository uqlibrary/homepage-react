import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Typography from '@material-ui/core/Typography';

import { ContentLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import { hasAccess } from '../../helpers/auth';
import TestTagHeader from '../TestTagHeader/TestTagHeader';

const StandardAuthPage = ({
    title = '',
    locale = null,
    withBreadcrumbs = true,
    requiredPermissions = [],
    inclusive = true,
    children = null,
    ...props
} = {}) => {
    const { user, privilege } = useSelector(state => state.get('testTagUserReducer'));
    const defaultAllow = (!!user && typeof user === 'object' && Object.keys(user).length > 0) || false;
    const userAllow = !!privilege ? hasAccess(privilege, requiredPermissions, inclusive) : null;
    const shouldHaveAccess = defaultAllow && userAllow;
    const headerDepartmentText = React.useMemo(
        () =>
            user
                ? locale?.header?.pageSubtitle?.(
                      user?.department_display_name ??
                          /* istanbul ignore next */ user?.user_department ??
                          /* istanbul ignore next */ '',
                  )
                : /* istanbul ignore next */ '',
        [user, locale],
    );

    return (
        <StandardPage title={title} {...props}>
            {!!!userAllow && <ContentLoader message="Checking" />}
            {!!userAllow && !shouldHaveAccess && <Typography variant={'h6'}>Page is unavailable</Typography>}
            {shouldHaveAccess && (
                <TestTagHeader
                    departmentText={headerDepartmentText}
                    requiredText={locale?.header?.requiredText}
                    breadcrumbs={withBreadcrumbs ? locale.breadcrumbs : []}
                />
            )}
            {shouldHaveAccess && children}
        </StandardPage>
    );
};

StandardAuthPage.propTypes = {
    title: PropTypes.string,
    user: PropTypes.object,
    locale: PropTypes.object,
    withBreadcrumbs: PropTypes.bool,
    requiredPermissions: PropTypes.array,
    inclusive: PropTypes.bool,
    children: PropTypes.any,
};

export default React.memo(StandardAuthPage);
