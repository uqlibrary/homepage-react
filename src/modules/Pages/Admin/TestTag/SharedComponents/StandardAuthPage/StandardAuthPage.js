import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Typography from '@material-ui/core/Typography';

import { ContentLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import { hasAccess } from '../../helpers/auth';
import TestTagHeader from '../TestTagHeader/TestTagHeader';
import locale from '../../testTag.locale';

const StandardAuthPage = ({
    title = '',
    withHeader = true,
    headerSubText = '',
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
                ? locale?.form?.pageSubtitle?.(
                      user?.department_display_name ??
                          /* istanbul ignore next */ user?.user_department ??
                          /* istanbul ignore next */ '',
                  )
                : /* istanbul ignore next */ '',
        [user],
    );
    console.log({ defaultAllow, userAllow, shouldHaveAccess });
    return (
        <StandardPage title={title} {...props}>
            {!!!userAllow && <ContentLoader message="Checking" />}
            {!!userAllow && !shouldHaveAccess && <Typography variant={'h6'}>Page is unavailable</Typography>}
            {shouldHaveAccess && withHeader && (
                <TestTagHeader departmentText={headerDepartmentText} requiredText={headerSubText} />
            )}
            {shouldHaveAccess && children}
        </StandardPage>
    );
};

StandardAuthPage.propTypes = {
    title: PropTypes.string,
    user: PropTypes.object,
    withHeader: PropTypes.bool,
    headerSubText: PropTypes.string,
    requiredPermissions: PropTypes.array,
    inclusive: PropTypes.bool,
    children: PropTypes.any,
};

export default React.memo(StandardAuthPage);
